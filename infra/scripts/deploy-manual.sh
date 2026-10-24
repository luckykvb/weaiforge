#!/usr/bin/env bash
# Manual deploy, until the GitHub Actions pipeline is fixed. Mirrors the deploy
# job in .github/workflows/site.yml, but runs locally with an AWS profile.
#
#   AWS_PROFILE=weaiforge bash infra/scripts/deploy-manual.sh
#
# Reads the bucket and distribution from Terraform outputs, so run it after the
# prod stack is applied. Run from the repo root.
set -euo pipefail

export AWS_REGION="${AWS_REGION:-us-east-1}"
prod="infra/envs/prod"

bucket=$(terraform -chdir="$prod" output -raw site_bucket)
dist_id=$(terraform -chdir="$prod" output -raw distribution_id)
echo "bucket=$bucket distribution=$dist_id"

echo "# Build"
npm ci
npm run build
node infra/scripts/check-csp.mjs dist

echo "# Sync fingerprinted assets (immutable, cached a year)"
aws s3 sync dist/ "s3://$bucket/" \
  --no-progress --exclude "*" --include "assets/*" \
  --cache-control "public, max-age=31536000, immutable"

echo "# Sync HTML and the rest (revalidated, delete removed objects)"
aws s3 sync dist/ "s3://$bucket/" \
  --no-progress --delete --exclude "assets/*" \
  --cache-control "public, max-age=0, s-maxage=86400, must-revalidate"

echo "# Invalidate CloudFront"
id=$(aws cloudfront create-invalidation \
  --distribution-id "$dist_id" --paths "/*" \
  --query 'Invalidation.Id' --output text)
aws cloudfront wait invalidation-completed --distribution-id "$dist_id" --id "$id"
echo "done: invalidation $id complete"
