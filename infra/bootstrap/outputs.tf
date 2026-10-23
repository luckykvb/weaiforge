output "backend_config" {
  description = "Contents for infra/backend.hcl (terraform output -raw backend_config > ../backend.hcl)."
  value       = <<-EOT
    bucket       = "${aws_s3_bucket.state.bucket}"
    region       = "${var.region}"
    encrypt      = true
    use_lockfile = true
  EOT
}

output "github_variables" {
  description = "GitHub Actions variables (vars, not secrets): repo-level for plan, 'production' environment for apply/deploy."
  value = {
    AWS_REGION          = var.region
    TF_STATE_BUCKET     = aws_s3_bucket.state.bucket
    AWS_PLAN_ROLE_ARN   = aws_iam_role.plan.arn
    AWS_APPLY_ROLE_ARN  = aws_iam_role.apply.arn
    AWS_DEPLOY_ROLE_ARN = aws_iam_role.deploy.arn
  }
}
