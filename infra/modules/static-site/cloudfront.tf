data "aws_region" "current" {}

# Managed policy: the Free plan does not include custom cache policies.
# Honours origin Cache-Control (the deploy sets immutable assets, revalidated HTML).
data "aws_cloudfront_cache_policy" "caching_optimized" {
  name = "Managed-CachingOptimized"
}

resource "aws_cloudfront_origin_access_control" "site" {
  name                              = var.name
  description                       = "SigV4 access from ${var.name} to its S3 origin"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_function" "viewer_request" {
  name    = "${var.name}-viewer-request"
  runtime = "cloudfront-js-2.0"
  comment = "www to apex, clean URLs"
  publish = true
  code    = file("${path.module}/functions/viewer-request.js")
}

resource "aws_cloudfront_function" "viewer_response" {
  name    = "${var.name}-viewer-response"
  runtime = "cloudfront-js-2.0"
  comment = "Security headers (CSP, HSTS, ...)"
  publish = true
  code    = file("${path.module}/functions/viewer-response.js")
}

resource "aws_cloudfront_distribution" "site" {
  #checkov:skip=CKV_AWS_86:Access logging is optional (access_logs_enabled); not in the Free plan feature set.
  #checkov:skip=CKV_AWS_310:Origin failover needs a second origin; a static site rebuilt from git does not warrant it.
  #checkov:skip=CKV_AWS_374:Geo restriction is not a requirement for a public company site.
  #checkov:skip=CKV2_AWS_32:Security headers are set by the viewer-response function; the Free plan disallows custom response headers policies.
  #checkov:skip=CKV2_AWS_47:The attached web ACL uses AWSManagedRulesKnownBadInputsRuleSet (Log4j coverage) when waf_enabled.
  enabled             = true
  comment             = var.domain_name
  aliases             = concat([var.domain_name], var.redirect_domains)
  default_root_object = "index.html"
  http_version        = "http2and3"
  is_ipv6_enabled     = true
  price_class         = var.price_class
  web_acl_id          = var.waf_enabled ? aws_wafv2_web_acl.site[0].arn : null

  origin {
    origin_id                = "s3-site"
    domain_name              = aws_s3_bucket.site.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.site.id
  }

  default_cache_behavior {
    target_origin_id       = "s3-site"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true
    cache_policy_id        = data.aws_cloudfront_cache_policy.caching_optimized.id

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.viewer_request.arn
    }

    function_association {
      event_type   = "viewer-response"
      function_arn = aws_cloudfront_function.viewer_response.arn
    }
  }

  # Without s3:ListBucket, OAC reads of missing keys return 403. Serve the home
  # page with a real 404 status so unknown URLs land somewhere useful.
  custom_error_response {
    error_code            = 403
    response_code         = 404
    response_page_path    = "/index.html"
    error_caching_min_ttl = 60
  }

  custom_error_response {
    error_code            = 404
    response_code         = 404
    response_page_path    = "/index.html"
    error_caching_min_ttl = 60
  }

  dynamic "logging_config" {
    for_each = var.access_logs_enabled ? [1] : []
    content {
      bucket          = aws_s3_bucket.logs[0].bucket_domain_name
      prefix          = "cloudfront/"
      include_cookies = false
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.site.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  lifecycle {
    precondition {
      condition     = data.aws_region.current.region == "us-east-1"
      error_message = "CloudFront certificates and CLOUDFRONT-scope WAF must be created in us-east-1."
    }
    precondition {
      condition     = var.pricing_plan_tier == null || var.waf_enabled
      error_message = "A CloudFront flat-rate plan requires a WAF web ACL (waf_enabled = true)."
    }
  }

  depends_on = [aws_s3_bucket_acl.logs]
}
