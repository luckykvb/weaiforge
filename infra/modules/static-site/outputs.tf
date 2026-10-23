output "bucket_name" {
  value = aws_s3_bucket.site.bucket
}

output "bucket_arn" {
  value = aws_s3_bucket.site.arn
}

output "distribution_id" {
  value = aws_cloudfront_distribution.site.id
}

output "distribution_arn" {
  value = aws_cloudfront_distribution.site.arn
}

output "distribution_domain_name" {
  description = "dxxxx.cloudfront.net, the alias/CNAME target."
  value       = aws_cloudfront_distribution.site.domain_name
}

output "distribution_hosted_zone_id" {
  description = "CloudFront's fixed hosted zone ID, for Route 53 alias records."
  value       = aws_cloudfront_distribution.site.hosted_zone_id
}

output "web_acl_arn" {
  value = try(aws_wafv2_web_acl.site[0].arn, null)
}

output "pricing_plan_status" {
  value = try(awscc_pricingplanmanager_subscription.site[0].status, "pay-as-you-go")
}
