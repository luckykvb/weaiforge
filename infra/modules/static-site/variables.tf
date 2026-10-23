variable "name" {
  description = "Name prefix for every resource, e.g. weaiforge-site-prod."
  type        = string
}

variable "domain_name" {
  description = "Canonical apex domain served by the distribution, e.g. weaiforge.com."
  type        = string
}

variable "redirect_domains" {
  description = "Extra hostnames on the certificate and distribution that 301 to domain_name (www.<apex> only; see viewer-request.js)."
  type        = list(string)
  default     = []
}

variable "zone_id" {
  description = "Route 53 hosted zone that holds the ACM validation records."
  type        = string
}

variable "bucket_name" {
  description = "Globally unique name of the private S3 origin bucket."
  type        = string
}

variable "pricing_plan_tier" {
  description = "CloudFront flat-rate plan tier (FREE, PRO, BUSINESS, PREMIUM), or null for pay-as-you-go. Paid tiers need ApprovePaidSubscription out of band."
  type        = string
  default     = "FREE"

  validation {
    condition     = var.pricing_plan_tier == null || contains(["FREE", "PRO", "BUSINESS", "PREMIUM"], coalesce(var.pricing_plan_tier, "-"))
    error_message = "pricing_plan_tier must be FREE, PRO, BUSINESS, PREMIUM or null."
  }
}

variable "waf_enabled" {
  description = "Attach the WAF web ACL. Required by (and free on) a flat-rate plan; about $9/month on pay-as-you-go."
  type        = bool
  default     = true
}

variable "waf_rate_limit" {
  description = "Requests per IP per 5 minutes before WAF blocks that IP."
  type        = number
  default     = 2000
}

variable "access_logs_enabled" {
  description = "Write CloudFront standard (legacy) access logs to S3. Not part of the Free plan feature set; enable on Pro or pay-as-you-go."
  type        = bool
  default     = false
}

variable "access_log_retention_days" {
  description = "Days to keep access logs."
  type        = number
  default     = 90
}

variable "price_class" {
  description = "Edge footprint. PriceClass_All costs nothing extra on a flat-rate plan; PriceClass_200 (still includes India) trims pay-as-you-go rates."
  type        = string
  default     = "PriceClass_All"
}
