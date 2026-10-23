# weaiforge.com infrastructure

Static hosting for the WeAIForge site on AWS, entirely in Terraform.

```
GoDaddy (registrar) ──NS──▶ Route 53 zone weaiforge.com
   apex + www ──alias──▶ CloudFront (flat-rate Free plan: WAF + DDoS, $0)
        viewer-request fn   www→apex 301, clean URLs
        viewer-response fn  HSTS, CSP and the other security headers
        ACM cert (us-east-1)  TLS 1.2+, HTTP/2+3, IPv6, brotli/gzip
        ──OAC (SigV4)──▶ private S3 bucket (us-east-1)
   MX / SPF / DKIM / DMARC (GoDaddy email) · CAA (amazon only)

GitHub Actions ──OIDC──▶ weaiforge-gha-{tf-plan, tf-apply, site-deploy}
```

Everything runs in **us-east-1** (CloudFront certificates and the CLOUDFRONT-scope
WAF must). Expected cost is about **$0.50–1.00/month** (the Route 53 zone; the
CloudFront Free plan bundles the CDN, WAF and DDoS protection at $0).

## Layout

| Path | What |
|---|---|
| `bootstrap/` | One-time, human-applied: state bucket, GitHub OIDC provider, three CI roles. |
| `envs/prod/` | The zone, DNS records, and the `static_site` module; budgets and anomaly detection. |
| `modules/static-site/` | S3 origin, OAC, ACM, CloudFront, WAF, flat-rate plan, the two CloudFront Functions. |
| `scripts/` | `check-tags.py` (tag contract), `check-csp.mjs` (build vs edge CSP), `dns_diff.py`, `smoke.sh`. |
| `tag-policy.json` | The mandatory `weaiforge:*` tag contract. |

## Rollout switches (`envs/prod/prod.tfvars`)

Flip one per PR, in order — see [RUNBOOK.md](RUNBOOK.md):

1. `site_enabled = false`, `cutover = false` — the zone mirrors GoDaddy. Then switch nameservers at GoDaddy.
2. `site_enabled = true` — bucket, certificate, CloudFront, WAF and the Free plan. Then the first content deploy.
3. `cutover = true` — the apex and www move to CloudFront; CAA is added.

## CI

- **`.github/workflows/site.yml`** — build, unit-test the edge functions, CSP check, `npm audit`, gitleaks, dependency review; on `main`, deploy to S3 + invalidate + smoke test.
- **`.github/workflows/infra.yml`** — fmt, validate, tflint, checkov, tag contract; plan on PRs, apply on `main` (gated by the `production` environment).

Local check before a PR:

```bash
cd infra
terraform fmt -recursive
for s in bootstrap envs/prod; do terraform -chdir=$s init -backend=false && terraform -chdir=$s validate; done
tflint --init --config "$PWD/.tflint.hcl" && tflint --chdir envs/prod --config "$PWD/.tflint.hcl"
checkov -d . --framework terraform --compact --skip-download
node --test infra/modules/static-site/functions/*.test.mjs   # from repo root
```
