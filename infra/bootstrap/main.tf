# One-time, human-applied foundation (RUNBOOK.md §Bootstrap):
#   - remote-state bucket (S3 native locking, no DynamoDB)
#   - GitHub Actions OIDC provider (no long-lived AWS keys in GitHub)
#   - three CI roles: tf-plan (read-only), tf-apply (infra), site-deploy (content only)
#
# First apply runs on local state via backend_override.tf, then state is
# migrated into the bucket it just created.

terraform {
  required_version = ">= 1.11, < 2.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }

  backend "s3" {}
}

provider "aws" {
  region = var.region

  default_tags {
    tags = local.tags
  }
}

data "aws_caller_identity" "current" {}

locals {
  tag_policy = jsondecode(file("${path.module}/../tag-policy.json"))
  tag_values = {
    project             = "website"
    environment         = "shared"
    cost-center         = var.cost_center
    owner               = var.owner
    managed-by          = "terraform"
    repository          = var.github_repository
    data-classification = "internal"
  }
  tags = { for name in local.tag_policy.required : "${local.tag_policy.prefix}${name}" => local.tag_values[name] }

  account_id   = data.aws_caller_identity.current.account_id
  state_bucket = "${var.project}-tfstate-${local.account_id}-${var.region}"
  # Immutable subject claims put the numeric IDs in the token's sub; without them
  # AssumeRoleWithWebIdentity is denied even though the repo name matches.
  repo_owner = split("/", var.github_repository)[0]
  repo_name  = split("/", var.github_repository)[1]
  repo_sub = var.github_owner_id == null || var.github_repository_id == null ? "repo:${var.github_repository}" : (
    "repo:${local.repo_owner}@${var.github_owner_id}/${local.repo_name}@${var.github_repository_id}"
  )

  # Names the prod stack creates (envs/prod/main.tf); CI roles are scoped to them.
  site_bucket      = "${var.project}-site-prod-${local.account_id}"
  site_bucket_glob = "${var.project}-site-*"
  distribution_arn = "arn:aws:cloudfront::${local.account_id}:distribution/${coalesce(var.site_distribution_id, "*")}"
}

# --- Remote state ------------------------------------------------------------

resource "aws_s3_bucket" "state" {
  #checkov:skip=CKV_AWS_18:Access logging omitted (cost); state access is via CI roles and CloudTrail.
  #checkov:skip=CKV_AWS_144:Cross-region replication out of scope; versioning protects state.
  #checkov:skip=CKV_AWS_145:SSE-S3 used deliberately; state holds no secrets and a CMK adds cost.
  #checkov:skip=CKV2_AWS_62:No consumers for S3 event notifications.
  bucket = local.state_bucket

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_versioning" "state" {
  bucket = aws_s3_bucket.state.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "state" {
  bucket = aws_s3_bucket.state.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "state" {
  bucket                  = aws_s3_bucket.state.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "state" {
  bucket = aws_s3_bucket.state.id
  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "state" {
  bucket = aws_s3_bucket.state.id

  rule {
    id     = "expire-old-state-versions"
    status = "Enabled"
    filter {}
    noncurrent_version_expiration {
      noncurrent_days = 90
    }
    abort_incomplete_multipart_upload {
      days_after_initiation = 1
    }
  }
}

data "aws_iam_policy_document" "state_tls_only" {
  statement {
    sid       = "DenyInsecureTransport"
    effect    = "Deny"
    actions   = ["s3:*"]
    resources = [aws_s3_bucket.state.arn, "${aws_s3_bucket.state.arn}/*"]
    principals {
      type        = "*"
      identifiers = ["*"]
    }
    condition {
      test     = "Bool"
      variable = "aws:SecureTransport"
      values   = ["false"]
    }
  }
}

resource "aws_s3_bucket_policy" "state" {
  bucket = aws_s3_bucket.state.id
  policy = data.aws_iam_policy_document.state_tls_only.json
}

# --- GitHub OIDC -------------------------------------------------------------

resource "aws_iam_openid_connect_provider" "github" {
  url            = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]
}

data "aws_iam_policy_document" "trust_pull_request" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github.arn]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["${local.repo_sub}:pull_request", "${local.repo_sub}:ref:refs/heads/main"]
    }
  }
}

# Only jobs bound to the protected "production" GitHub environment (required
# reviewer, main branch only) can assume the mutating roles.
data "aws_iam_policy_document" "trust_production" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github.arn]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["${local.repo_sub}:environment:production"]
    }
  }
}

data "aws_iam_policy_document" "state_access" {
  statement {
    sid       = "StateList"
    actions   = ["s3:ListBucket"]
    resources = [aws_s3_bucket.state.arn]
  }
  statement {
    sid       = "StateReadWrite"
    actions   = ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"]
    resources = ["${aws_s3_bucket.state.arn}/*"]
  }
}

data "aws_iam_policy_document" "state_lock_only" {
  statement {
    sid       = "StateList"
    actions   = ["s3:ListBucket"]
    resources = [aws_s3_bucket.state.arn]
  }
  statement {
    sid       = "StateRead"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.state.arn}/*"]
  }
  statement {
    sid       = "LockFile"
    actions   = ["s3:PutObject", "s3:DeleteObject"]
    resources = ["${aws_s3_bucket.state.arn}/*.tflock"]
  }
}

# --- tf-plan: read-only + state lock -------------------------------------------

resource "aws_iam_role" "plan" {
  name                 = "${var.project}-gha-tf-plan"
  description          = "GitHub Actions: terraform plan on pull requests and main (read-only)."
  assume_role_policy   = data.aws_iam_policy_document.trust_pull_request.json
  max_session_duration = 3600
}

resource "aws_iam_role_policy_attachment" "plan_readonly" {
  role       = aws_iam_role.plan.name
  policy_arn = "arn:aws:iam::aws:policy/ReadOnlyAccess"
}

data "aws_iam_policy_document" "plan_extra_read" {
  source_policy_documents = [data.aws_iam_policy_document.state_lock_only.json]

  # The flat-rate plan subscription is read through Cloud Control (awscc).
  statement {
    sid = "PricingPlanRead"
    actions = [
      "pricingplanmanager:Get*", "pricingplanmanager:List*",
      "cloudformation:GetResource", "cloudformation:ListResources",
    ]
    resources = ["*"]
  }
}

resource "aws_iam_role_policy" "plan_state" {
  name   = "terraform-state-lock"
  role   = aws_iam_role.plan.id
  policy = data.aws_iam_policy_document.plan_extra_read.json
}

# --- tf-apply: only the services the website stack uses ------------------------

resource "aws_iam_role" "apply" {
  name                 = "${var.project}-gha-tf-apply"
  description          = "GitHub Actions: terraform apply of the website stack (production environment)."
  assume_role_policy   = data.aws_iam_policy_document.trust_production.json
  max_session_duration = 3600
}

data "aws_iam_policy_document" "apply" {
  #checkov:skip=CKV_AWS_109:Terraform must create/delete edge resources whose IDs do not exist yet; scoped to services, environment-gated trust.
  #checkov:skip=CKV_AWS_111:As above; S3 write is limited to weaiforge-site-* buckets.
  #checkov:skip=CKV_AWS_356:CloudFront, WAF, ACM, Route 53 and Cloud Control create APIs are not resource-restrictable before creation.
  source_policy_documents = [data.aws_iam_policy_document.state_access.json]

  statement {
    sid       = "SiteBuckets"
    actions   = ["s3:*"]
    resources = ["arn:aws:s3:::${local.site_bucket_glob}", "arn:aws:s3:::${local.site_bucket_glob}/*"]
  }
  statement {
    sid       = "CanonicalUserLookup"
    actions   = ["s3:ListAllMyBuckets"]
    resources = ["*"]
  }
  statement {
    sid = "EdgeAndDns"
    actions = [
      "cloudfront:*", "wafv2:*", "acm:*", "route53:*", "pricingplanmanager:*",
      # awscc resources go through the Cloud Control API.
      "cloudformation:CreateResource", "cloudformation:GetResource", "cloudformation:UpdateResource",
      "cloudformation:DeleteResource", "cloudformation:ListResources",
      "cloudformation:GetResourceRequestStatus", "cloudformation:CancelResourceRequest",
    ]
    resources = ["*"]
  }
  statement {
    sid       = "Budgets"
    actions   = ["budgets:*"]
    resources = ["arn:aws:budgets::${local.account_id}:budget/${var.project}-*"]
  }
  statement {
    sid = "CostExplorer"
    actions = [
      "ce:CreateAnomalyMonitor", "ce:UpdateAnomalyMonitor", "ce:DeleteAnomalyMonitor", "ce:GetAnomalyMonitors",
      "ce:CreateAnomalySubscription", "ce:UpdateAnomalySubscription", "ce:DeleteAnomalySubscription", "ce:GetAnomalySubscriptions",
      "ce:TagResource", "ce:UntagResource", "ce:ListTagsForResource",
      "ce:UpdateCostAllocationTagsStatus", "ce:ListCostAllocationTags",
    ]
    resources = ["*"]
  }
  statement {
    sid       = "ServiceLinkedRoles"
    actions   = ["iam:CreateServiceLinkedRole"]
    resources = ["arn:aws:iam::${local.account_id}:role/aws-service-role/*"]
  }
}

resource "aws_iam_role_policy" "apply" {
  name   = "website-stack"
  role   = aws_iam_role.apply.id
  policy = data.aws_iam_policy_document.apply.json
}

# --- site-deploy: upload the build and invalidate, nothing else ----------------

resource "aws_iam_role" "deploy" {
  name                 = "${var.project}-gha-site-deploy"
  description          = "GitHub Actions: sync the built site to S3 and invalidate CloudFront."
  assume_role_policy   = data.aws_iam_policy_document.trust_production.json
  max_session_duration = 3600
}

data "aws_iam_policy_document" "deploy" {
  statement {
    sid       = "ListSiteBucket"
    actions   = ["s3:ListBucket"]
    resources = ["arn:aws:s3:::${local.site_bucket}"]
  }
  statement {
    sid       = "WriteSiteObjects"
    actions   = ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"]
    resources = ["arn:aws:s3:::${local.site_bucket}/*"]
  }
  statement {
    sid       = "InvalidateCdn"
    actions   = ["cloudfront:CreateInvalidation", "cloudfront:GetInvalidation", "cloudfront:ListInvalidations"]
    resources = [local.distribution_arn]
  }
}

resource "aws_iam_role_policy" "deploy" {
  name   = "site-deploy"
  role   = aws_iam_role.deploy.id
  policy = data.aws_iam_policy_document.deploy.json
}
