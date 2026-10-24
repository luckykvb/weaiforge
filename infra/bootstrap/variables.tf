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

variable "github_owner_id" {
  description = "Numeric ID of the GitHub owner. The OIDC subject is repo:<owner>@<owner_id>/<repo>@<repo_id>:... while immutable subject claims are on (this repo's default). Null falls back to the plain repo:<owner>/<repo> form."
  type        = string
  default     = "342127648"
}

variable "github_repository_id" {
  description = "Numeric ID of the GitHub repository; see github_owner_id."
  type        = string
  default     = "1311089883"
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
