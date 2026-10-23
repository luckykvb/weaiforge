variable "region" {
  description = "Everything runs in us-east-1 (CloudFront certificates and WAF must)."
  type        = string
  default     = "us-east-1"

  validation {
    condition     = var.region == "us-east-1"
    error_message = "This stack must run in us-east-1."
  }
}

variable "project" {
  description = "Naming prefix for every resource."
  type        = string
  default     = "weaiforge"
}

variable "environment" {
  type    = string
  default = "prod"
}

variable "domain_name" {
  description = "Canonical apex domain; www.<domain> redirects to it."
  type        = string
}

variable "github_repository" {
  description = "owner/repo, recorded in the repository tag."
  type        = string
}

variable "owner" {
  type = string
}

variable "cost_center" {
  type = string
}

variable "alert_email" {
  description = "Receives budget/anomaly alerts and CAA iodef reports."
  type        = string
}

# --- Rollout switches (RUNBOOK.md) ----------------------------------------------

variable "site_enabled" {
  description = "Create the bucket, certificate, CloudFront and WAF. Turn on only after GoDaddy delegates to the Route 53 nameservers (ACM validates through the zone)."
  type        = bool
  default     = false
}

variable "cutover" {
  description = "Point the apex and www at CloudFront (and add CAA). Requires site_enabled and a successful first deploy."
  type        = bool
  default     = false

  validation {
    condition     = !var.cutover || var.site_enabled
    error_message = "cutover requires site_enabled = true."
  }
}

variable "legacy_apex_a_records" {
  description = "Apex A records GoDaddy serves today, kept until cutover."
  type        = list(string)
}

variable "legacy_www_cname" {
  description = "www CNAME target GoDaddy serves today (null if none), kept until cutover."
  type        = string
  default     = null
}

variable "dns_records" {
  description = "Other records copied from the GoDaddy zone (mail, verification). name is relative to the zone; \"\" is the apex. TXT values unsplit."
  type = map(object({
    name    = string
    type    = string
    ttl     = optional(number, 3600)
    records = list(string)
  }))
  default = {}

  validation {
    condition     = alltrue([for r in values(var.dns_records) : !contains(["NS", "SOA"], r.type)])
    error_message = "NS and SOA records are managed by Route 53; do not copy them."
  }
}

# --- Edge -----------------------------------------------------------------------

variable "pricing_plan_tier" {
  description = "CloudFront flat-rate plan tier, or null for pay-as-you-go (e.g. if the account is not eligible)."
  type        = string
  default     = "FREE"
}

variable "waf_enabled" {
  description = "WAF on pay-as-you-go (~$9/month). Always on when a flat-rate plan is used."
  type        = bool
  default     = false
}

variable "access_logs_enabled" {
  description = "CloudFront standard access logs to S3 (not in the Free plan feature set)."
  type        = bool
  default     = false
}

# --- FinOps ---------------------------------------------------------------------

variable "monthly_budget_usd" {
  type    = number
  default = 10
}

variable "anomaly_threshold_usd" {
  type    = number
  default = 3
}

variable "activate_cost_allocation_tags" {
  description = "Activate the weaiforge:* keys as cost allocation tags (billing must have seen them; ~24h after resources exist)."
  type        = bool
  default     = false
}
