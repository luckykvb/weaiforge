# Route 53 is authoritative for the zone; GoDaddy stays the registrar and only
# holds the four NS records. Before the NS switch the zone must answer exactly
# like GoDaddy does (scripts/dns_diff.py), or email and the live site break.
#
# Traffic cutover is in-place: the apex A record and the www CNAME are single
# resources whose targets flip from the legacy host to CloudFront on cutover.

locals {
  # Route 53 needs TXT strings longer than 255 chars split into quoted chunks
  # (DKIM keys); write them unsplit in tfvars.
  dns_records = {
    for key, record in var.dns_records : key => merge(record, {
      records = record.type == "TXT" ? [for value in record.records : join("\"\"", regexall(".{1,255}", value))] : record.records
    })
  }
  site = one(module.static_site)
}

resource "aws_route53_zone" "this" {
  #checkov:skip=CKV2_AWS_38:DNSSEC is a planned follow-up (KMS key + DS record at GoDaddy); see RUNBOOK.
  #checkov:skip=CKV2_AWS_39:Query logging is not needed for a brochure site and costs extra.
  name    = var.domain_name
  comment = "Public zone for ${var.domain_name} (registrar: GoDaddy)"

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_route53_record" "copied" {
  for_each = local.dns_records

  zone_id = aws_route53_zone.this.zone_id
  name    = each.value.name == "" ? var.domain_name : "${each.value.name}.${var.domain_name}"
  type    = each.value.type
  ttl     = each.value.ttl
  records = each.value.records
}

resource "aws_route53_record" "apex_a" {
  #checkov:skip=CKV2_AWS_23:Points at the legacy host (Vercel) until cutover, then aliases CloudFront.
  zone_id = aws_route53_zone.this.zone_id
  name    = var.domain_name
  type    = "A"
  ttl     = var.cutover ? null : 600
  records = var.cutover ? null : var.legacy_apex_a_records

  dynamic "alias" {
    for_each = var.cutover ? [local.site] : []
    content {
      name                   = alias.value.distribution_domain_name
      zone_id                = alias.value.distribution_hosted_zone_id
      evaluate_target_health = false
    }
  }
}

resource "aws_route53_record" "apex_aaaa" {
  count = var.cutover ? 1 : 0

  zone_id = aws_route53_zone.this.zone_id
  name    = var.domain_name
  type    = "AAAA"

  alias {
    name                   = local.site.distribution_domain_name
    zone_id                = local.site.distribution_hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "www" {
  count = var.cutover || var.legacy_www_cname != null ? 1 : 0

  zone_id = aws_route53_zone.this.zone_id
  name    = "www.${var.domain_name}"
  type    = "CNAME"
  ttl     = 600
  records = [var.cutover ? local.site.distribution_domain_name : var.legacy_www_cname]
}

# Only Amazon may issue certificates for the domain. Added at cutover so the
# legacy host can still renew its certificate until traffic has moved.
resource "aws_route53_record" "caa" {
  count = var.cutover ? 1 : 0

  zone_id = aws_route53_zone.this.zone_id
  name    = var.domain_name
  type    = "CAA"
  ttl     = 3600
  records = concat(
    [for ca in ["amazon.com", "amazontrust.com", "awstrust.com", "amazonaws.com"] : "0 issue \"${ca}\""],
    ["0 issuewild \";\"", "0 iodef \"mailto:${var.alert_email}\""],
  )
}
