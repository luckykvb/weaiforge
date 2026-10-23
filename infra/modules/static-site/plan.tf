# CloudFront flat-rate pricing plan. FREE activates immediately and bundles the
# distribution, its WAF web ACL and the Route 53 zone at $0/month (1M requests,
# 100 GB). Not available to accounts still on the AWS Free Tier.
# Deleting a FREE subscription cancels it at once; a distribution cannot be
# deleted while subscribed, which Terraform's dependency order already respects.

resource "awscc_pricingplanmanager_subscription" "site" {
  count = var.pricing_plan_tier == null ? 0 : 1

  plan_family = "CloudFront"
  plan_tier   = var.pricing_plan_tier
  resource_arns = [
    aws_cloudfront_distribution.site.arn,
    aws_wafv2_web_acl.site[0].arn,
    "arn:aws:route53:::hostedzone/${var.zone_id}",
  ]
}
