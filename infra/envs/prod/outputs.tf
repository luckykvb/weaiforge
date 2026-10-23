output "name_servers" {
  description = "Set these four as custom nameservers for the domain at GoDaddy."
  value       = aws_route53_zone.this.name_servers
}

output "zone_id" {
  value = aws_route53_zone.this.zone_id
}

output "site_bucket" {
  value = local.site_bucket
}

output "distribution_id" {
  value = try(local.site.distribution_id, null)
}

output "distribution_domain_name" {
  description = "Test before cutover: curl --resolve <domain>:443:<an IP of this name> https://<domain>/"
  value       = try(local.site.distribution_domain_name, null)
}

output "pricing_plan_status" {
  value = try(local.site.pricing_plan_status, null)
}

output "github_environment_variables" {
  description = "Set on the GitHub 'production' environment (vars, not secrets)."
  value = {
    SITE_BUCKET        = local.site_bucket
    CF_DISTRIBUTION_ID = try(local.site.distribution_id, "")
    SITE_URL           = var.cutover ? "https://${var.domain_name}" : try("https://${local.site.distribution_domain_name}", "")
  }
}
