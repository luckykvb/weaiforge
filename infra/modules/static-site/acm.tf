# CloudFront only accepts certificates from us-east-1; the stack's provider is
# pinned there (see precondition in cloudfront.tf). DNS validation needs the
# zone to be authoritative, i.e. GoDaddy nameservers already delegated.

resource "aws_acm_certificate" "site" {
  domain_name               = var.domain_name
  subject_alternative_names = var.redirect_domains
  validation_method         = "DNS"
  key_algorithm             = "RSA_2048"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "certificate_validation" {
  for_each = {
    for option in aws_acm_certificate.site.domain_validation_options : option.domain_name => {
      name   = option.resource_record_name
      type   = option.resource_record_type
      record = option.resource_record_value
    }
  }

  zone_id         = var.zone_id
  name            = each.value.name
  type            = each.value.type
  ttl             = 300
  records         = [each.value.record]
  allow_overwrite = true
}

resource "aws_acm_certificate_validation" "site" {
  certificate_arn         = aws_acm_certificate.site.arn
  validation_record_fqdns = [for record in aws_route53_record.certificate_validation : record.fqdn]
}
