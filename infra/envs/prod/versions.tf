terraform {
  required_version = ">= 1.11, < 2.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
    awscc = {
      source  = "hashicorp/awscc"
      version = "~> 1.107"
    }
  }

  # Partial config: terraform init -backend-config=../../backend.hcl
  backend "s3" {
    key          = "prod/terraform.tfstate"
    encrypt      = true
    use_lockfile = true
  }
}

# Single region: CloudFront certificates, CLOUDFRONT-scope WAF, budgets and
# Cost Explorer all live in us-east-1, so no aliased provider is needed.
provider "aws" {
  region = var.region

  default_tags {
    tags = local.tags
  }
}

# Only for the flat-rate plan subscription (no tag support on that resource).
provider "awscc" {
  region = var.region
}
