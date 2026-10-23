# Private origin: only this distribution can read it (OAC + AWS:SourceArn).
# Content is a build artefact of the repo, so git is the source of truth for DR;
# versioning covers accidental deletes and fast rollback between deploys.

resource "aws_s3_bucket" "site" {
  #checkov:skip=CKV_AWS_18:Server access logs add cost and noise; viewers only reach the bucket through CloudFront.
  #checkov:skip=CKV_AWS_144:Cross-region replication is unnecessary; the site is rebuilt from git in minutes.
  #checkov:skip=CKV_AWS_145:SSE-S3 is deliberate for public content; SSE-KMS with OAC adds key cost and policy coupling.
  #checkov:skip=CKV2_AWS_62:No consumers for S3 event notifications.
  bucket        = var.bucket_name
  force_destroy = true
}

resource "aws_s3_bucket_ownership_controls" "site" {
  bucket = aws_s3_bucket.site.id
  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_public_access_block" "site" {
  bucket                  = aws_s3_bucket.site.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "site" {
  bucket = aws_s3_bucket.site.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_versioning" "site" {
  bucket = aws_s3_bucket.site.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "site" {
  bucket = aws_s3_bucket.site.id

  rule {
    id     = "expire-superseded-versions"
    status = "Enabled"
    filter {}
    noncurrent_version_expiration {
      noncurrent_days = 30
    }
    expiration {
      expired_object_delete_marker = true
    }
    abort_incomplete_multipart_upload {
      days_after_initiation = 1
    }
  }
}

data "aws_iam_policy_document" "site" {
  statement {
    sid       = "CloudFrontOriginAccessControl"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.site.arn}/*"]
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.site.arn]
    }
  }

  statement {
    sid       = "DenyInsecureTransport"
    effect    = "Deny"
    actions   = ["s3:*"]
    resources = [aws_s3_bucket.site.arn, "${aws_s3_bucket.site.arn}/*"]
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

resource "aws_s3_bucket_policy" "site" {
  bucket = aws_s3_bucket.site.id
  policy = data.aws_iam_policy_document.site.json

  depends_on = [aws_s3_bucket_public_access_block.site]
}

# --- Access logs (optional) ---------------------------------------------------
# Legacy CloudFront logging delivers with an ACL grant, so this bucket needs
# BucketOwnerPreferred ownership and the awslogsdelivery grant.

data "aws_canonical_user_id" "current" {
  count = var.access_logs_enabled ? 1 : 0
}

resource "aws_s3_bucket" "logs" {
  count = var.access_logs_enabled ? 1 : 0
  #checkov:skip=CKV_AWS_18:This is the log bucket.
  #checkov:skip=CKV_AWS_21:Logs are append-only and expire; versioning only adds cost.
  #checkov:skip=CKV_AWS_144:Cross-region replication is unnecessary for short-lived access logs.
  #checkov:skip=CKV_AWS_145:CloudFront log delivery does not support SSE-KMS buckets.
  #checkov:skip=CKV2_AWS_62:No consumers for S3 event notifications.
  bucket        = "${var.bucket_name}-logs"
  force_destroy = true
}

resource "aws_s3_bucket_ownership_controls" "logs" {
  #checkov:skip=CKV2_AWS_65:CloudFront legacy log delivery requires ACLs on the log bucket.
  count  = var.access_logs_enabled ? 1 : 0
  bucket = aws_s3_bucket.logs[0].id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "logs" {
  count                   = var.access_logs_enabled ? 1 : 0
  bucket                  = aws_s3_bucket.logs[0].id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "logs" {
  count  = var.access_logs_enabled ? 1 : 0
  bucket = aws_s3_bucket.logs[0].id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_acl" "logs" {
  count  = var.access_logs_enabled ? 1 : 0
  bucket = aws_s3_bucket.logs[0].id

  access_control_policy {
    owner {
      id = data.aws_canonical_user_id.current[0].id
    }
    grant {
      permission = "FULL_CONTROL"
      grantee {
        type = "CanonicalUser"
        id   = data.aws_canonical_user_id.current[0].id
      }
    }
    grant {
      permission = "FULL_CONTROL"
      grantee {
        # awslogsdelivery: the account CloudFront uses to write standard logs.
        type = "CanonicalUser"
        id   = "c4c1ede66af53448b93c283ce9448c4ba468c9432aa01d700d3878632f77d2d0"
      }
    }
  }

  depends_on = [aws_s3_bucket_ownership_controls.logs]
}

resource "aws_s3_bucket_lifecycle_configuration" "logs" {
  count  = var.access_logs_enabled ? 1 : 0
  bucket = aws_s3_bucket.logs[0].id

  rule {
    id     = "expire-access-logs"
    status = "Enabled"
    filter {}
    expiration {
      days = var.access_log_retention_days
    }
    abort_incomplete_multipart_upload {
      days_after_initiation = 1
    }
  }
}

resource "aws_s3_bucket_policy" "logs" {
  count  = var.access_logs_enabled ? 1 : 0
  bucket = aws_s3_bucket.logs[0].id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "DenyInsecureTransport"
      Effect    = "Deny"
      Principal = "*"
      Action    = "s3:*"
      Resource  = [aws_s3_bucket.logs[0].arn, "${aws_s3_bucket.logs[0].arn}/*"]
      Condition = { Bool = { "aws:SecureTransport" = "false" } }
    }]
  })

  depends_on = [aws_s3_bucket_public_access_block.logs]
}
