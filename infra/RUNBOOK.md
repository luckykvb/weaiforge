# Runbook — weaiforge.com on AWS

Zero-downtime, email-safe rollout. Commands assume the AWS CLI, Terraform ≥ 1.11
and an AWS admin profile for the one-time bootstrap. The region is **us-east-1**.

Prerequisites checked for this account (633162131389):
- Profile `weaiforge` is an IAM user with the access to run the bootstrap.
- No GitHub OIDC provider exists yet — the bootstrap creates it.
- **Confirm the account is NOT on the AWS "Free Tier" plan**, or the CloudFront
  flat-rate Free plan is unavailable. If it is, set `pricing_plan_tier = null`
  and `waf_enabled = true` in `prod.tfvars` (adds ~$9/month for WAF) — nothing
  else changes.

---

## 1. Bootstrap (one-time, human-run)

```bash
export AWS_PROFILE=weaiforge AWS_REGION=us-east-1
cd infra/bootstrap
printf 'terraform {\n  backend "local" {}\n}\n' > backend_override.tf   # git-ignored; first apply uses local state
terraform init                                   # local state for this first apply
terraform apply                                  # defaults target weaiforge5/weaiforge

terraform output -raw backend_config > ../backend.hcl
rm backend_override.tf
terraform init -migrate-state -backend-config=../backend.hcl -backend-config=key=bootstrap/terraform.tfstate
terraform output github_variables                # values for GitHub (step 2)
```

## 2. GitHub configuration

**Repository variables** (Settings → Secrets and variables → Actions → Variables),
from the `github_variables` output: `AWS_REGION`, `TF_STATE_BUCKET`, `AWS_PLAN_ROLE_ARN`.

**Environment `production`** (Settings → Environments → New environment):
- Protection: required reviewer (you), and "Deployment branches" limited to `main`.
- Environment variables: `AWS_APPLY_ROLE_ARN`, `AWS_DEPLOY_ROLE_ARN` (from the
  output), plus `SITE_BUCKET`, `CF_DISTRIBUTION_ID`, `SITE_URL` — filled from the
  `envs/prod` outputs after step 4. Until then, leave the latter three unset;
  the deploy and smoke jobs are skipped automatically.

**Repository security** (Settings → Code security): enable secret scanning, push
protection and Dependabot alerts. Create the `@weaiforge5/admins` team (CODEOWNERS).

**Branch protection** on `main`: require a PR, require the `Site` and
`Infrastructure` status checks, and disallow force-pushes.

## 3. Prod stage 1 — zone mirrors GoDaddy (`site_enabled=false`, `cutover=false`)

Re-verify `prod.tfvars` against the **GoDaddy DNS page** first. `dns_records` was
seeded from public DNS on 2026-10-23, which cannot reveal records nobody queries
(for example DKIM selectors). Add any missing TXT/CNAME (especially a
`*._domainkey` DKIM record) before applying.

Open a PR with the stage-1 tfvars. `infra.yml` posts the plan; merge to apply.
Then confirm the new zone answers exactly like GoDaddy, using the four NS values
from the plan/outputs:

```bash
python infra/scripts/dns_diff.py weaiforge.com \
  --old ns51.domaincontrol.com --old ns52.domaincontrol.com \
  --new <r53-ns-1> --new <r53-ns-2> --new <r53-ns-3> --new <r53-ns-4>
```

It must report **0 differences**.

## 4. Switch nameservers (at GoDaddy) and enable the site

1. GoDaddy → the domain → Nameservers → "I'll use my own" → the four Route 53 NS
   values. Propagation can take up to 48h; check with
   `nslookup -type=ns weaiforge.com 8.8.8.8`.
2. Once Route 53 is authoritative, open a PR setting `site_enabled = true`. Apply
   creates the bucket, validates ACM through the zone, and builds CloudFront, WAF
   and the Free plan. Copy `site_bucket`, `distribution_id` and
   `distribution_domain_name` from the outputs into the `production` environment
   variables (`SITE_BUCKET`, `CF_DISTRIBUTION_ID`; leave `SITE_URL` until cutover).

## 5. First deploy and pre-cutover test

Run the **Site** workflow (`workflow_dispatch`), or push any site change. It
builds, deploys to S3 and invalidates. Test the distribution before moving
traffic — resolve the apex Host header to a CloudFront IP of the distribution
domain:

```bash
ip=$(dig +short <distribution_domain_name> | head -1)
curl -sI --resolve weaiforge.com:443:$ip https://weaiforge.com/ | grep -Ei 'HTTP|content-security|strict-transport'
curl -s  --resolve weaiforge.com:443:$ip https://weaiforge.com/ai-agents -o /dev/null -w '%{http_code}\n'
```

## 6. Cutover

PR with `cutover = true`. Apply flips the apex A/AAAA and the www CNAME to
CloudFront and adds the CAA record. Set `SITE_URL=https://weaiforge.com` on the
`production` environment so the smoke job runs on future deploys. Verify:

```bash
bash infra/scripts/smoke.sh https://weaiforge.com
```

Also send and receive a test email at samba@weaiforge.com (proves MX/SPF/DKIM
survived). Check https://securityheaders.com and https://www.ssllabs.com.

## 7. Subscribe to the CloudFront Free plan

Terraform creates the plan subscription (`awscc_pricingplanmanager_subscription`,
`FREE`), which activates immediately. Confirm in the CloudFront console →
"Pricing plans" that the distribution shows the **Free** plan and the WAF web ACL
is attached. If the account was ineligible and apply errored on the subscription,
set `pricing_plan_tier = null`, `waf_enabled = true` and re-apply.

## 8. Decommission Vercel

Remove the Vercel project/domain, delete `vercel.json` from the repo, and confirm
GoDaddy auto-renew is on with the domain locked.

---

## Rollback

- **Content:** Site workflow → Run workflow → set `ref` to a previous good SHA.
  It rebuilds and redeploys that commit. (S3 versioning also retains prior HTML.)
- **Traffic, fast:** set `cutover = false` and apply — the apex/www revert to the
  `legacy_*` targets. (Only useful while Vercel still serves.)
- **Infra:** revert the PR; `infra.yml` applies the previous state.

## DR

The site is a build artefact of this git repo; S3 holds no unique data. To rebuild
in a fresh account: run the bootstrap, apply `envs/prod` through stage 1→cutover,
and deploy. State lives in the versioned `weaiforge-tfstate-*` bucket.

## Follow-ups (optional)

- **DNSSEC:** a Route 53 KMS signing key (~$1/month) + a DS record at GoDaddy.
- **HSTS preload:** add `preload` to the header in `viewer-response.js` and submit
  to hstspreload.org once the setup has been stable for a while.
- **Access logs / dashboards:** set `access_logs_enabled = true` (not in the Free
  plan feature set — enable on Pro or pay-as-you-go).
