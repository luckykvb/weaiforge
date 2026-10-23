# CLOUDFRONT-scope web ACL. A flat-rate plan requires one and covers its cost;
# the Free tier allows at most 5 rules and no custom rule groups, so this uses
# 3 AWS managed rule sets plus a per-IP rate limit.

locals {
  managed_rule_sets = {
    AWSManagedRulesAmazonIpReputationList = 0
    AWSManagedRulesCommonRuleSet          = 1
    AWSManagedRulesKnownBadInputsRuleSet  = 2
  }
}

resource "aws_wafv2_web_acl" "site" {
  #checkov:skip=CKV2_AWS_31:WAF request logging is not part of the Free plan; CloudWatch metrics and sampled requests are on.
  #checkov:skip=CKV_AWS_192:AWSManagedRulesKnownBadInputsRuleSet (Log4JRCE) is attached via the dynamic rule block, which checkov does not expand.
  count = var.waf_enabled ? 1 : 0

  name        = var.name
  description = "Edge protection for ${var.domain_name}"
  scope       = "CLOUDFRONT"

  default_action {
    allow {}
  }

  dynamic "rule" {
    for_each = local.managed_rule_sets
    content {
      name     = rule.key
      priority = rule.value

      override_action {
        none {}
      }

      statement {
        managed_rule_group_statement {
          vendor_name = "AWS"
          name        = rule.key
        }
      }

      visibility_config {
        cloudwatch_metrics_enabled = true
        metric_name                = "${var.name}-${rule.key}"
        sampled_requests_enabled   = true
      }
    }
  }

  rule {
    name     = "rate-limit-per-ip"
    priority = 10

    action {
      block {}
    }

    statement {
      rate_based_statement {
        limit              = var.waf_rate_limit
        aggregate_key_type = "IP"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${var.name}-rate-limit"
      sampled_requests_enabled   = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = var.name
    sampled_requests_enabled   = true
  }
}
