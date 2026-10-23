data "aws_caller_identity" "current" {}

locals {
  name = "${var.project}-site-${var.environment}"

  # Mandatory tag contract (../../tag-policy.json): every key is applied to every
  # taggable resource through provider default_tags, then enforced twice -
  # the precondition below at plan/apply, and scripts/check-tags.py over the plan in CI.
  tag_policy = jsondecode(file("${path.module}/../../tag-policy.json"))
  tag_values = {
    project             = "website"
    environment         = var.environment
    cost-center         = var.cost_center
    owner               = var.owner
    managed-by          = "terraform"
    repository          = var.github_repository
    data-classification = "public"
  }
  tags = { for name in local.tag_policy.required : "${local.tag_policy.prefix}${name}" => local.tag_values[name] }

  # Must match bootstrap's site_bucket, which scopes the deploy role.
  site_bucket = "${local.name}-${data.aws_caller_identity.current.account_id}"
}

data "aws_default_tags" "current" {}

resource "terraform_data" "tag_contract" {
  lifecycle {
    precondition {
      condition = alltrue([
        for name in local.tag_policy.required :
        try(data.aws_default_tags.current.tags["${local.tag_policy.prefix}${name}"], "") != ""
      ])
      error_message = "Provider default_tags is missing a mandatory tag from tag-policy.json (${join(", ", local.tag_policy.required)}). Untagged spend cannot be attributed."
    }
    precondition {
      condition     = alltrue([for v in values(local.tags) : can(regex(local.tag_policy.value_pattern, v))])
      error_message = "A tag value contains characters AWS tags do not allow (see value_pattern in tag-policy.json)."
    }
  }
}

# Created once the zone is authoritative (site_enabled): ACM validates through it.
module "static_site" {
  source = "../../modules/static-site"
  count  = var.site_enabled ? 1 : 0

  name                = local.name
  domain_name         = var.domain_name
  redirect_domains    = ["www.${var.domain_name}"]
  zone_id             = aws_route53_zone.this.zone_id
  bucket_name         = local.site_bucket
  pricing_plan_tier   = var.pricing_plan_tier
  waf_enabled         = var.pricing_plan_tier != null || var.waf_enabled
  access_logs_enabled = var.access_logs_enabled
  price_class         = var.pricing_plan_tier != null ? "PriceClass_All" : "PriceClass_200"
}
