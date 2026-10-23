variable "region" {
  type    = string
  default = "us-east-1"
}

variable "project" {
  description = "Naming prefix; must match envs/prod (var.project)."
  type        = string
  default     = "weaiforge"
}

variable "github_repository" {
  description = "owner/repo allowed to assume the CI roles."
  type        = string
  default     = "weaiforge5/weaiforge"
}

variable "owner" {
  type    = string
  default = "devops"
}

variable "cost_center" {
  type    = string
  default = "marketing"
}

variable "site_distribution_id" {
  description = "CloudFront distribution ID from envs/prod. Until set, the deploy role may invalidate any distribution in the account (there is only this one)."
  type        = string
  default     = null
}
