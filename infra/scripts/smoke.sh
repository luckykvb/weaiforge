#!/usr/bin/env bash
# Post-deploy smoke test. Usage: smoke.sh https://weaiforge.com
# Exits non-zero on the first failed assertion.
set -euo pipefail

base="${1:?usage: smoke.sh <base-url>}"
base="${base%/}"
host="${base#https://}"
apex="${host#www.}"
fail=0

check() { if eval "$2"; then echo "ok   $1"; else echo "FAIL $1"; fail=1; fi; }

echo "# Pages return 200"
for path in / /ai-agents /forward-deployed-engineering /privacy /terms; do
  code=$(curl -fsS -o /dev/null -w '%{http_code}' "$base$path" || true)
  check "GET $path -> $code" "[ '$code' = '200' ]"
done

echo "# Clean-URL and apex canonicalisation"
code=$(curl -s -o /dev/null -w '%{http_code}' "$base/privacy.html" || true)
loc=$(curl -s -o /dev/null -w '%{redirect_url}' "$base/privacy.html" || true)
check ".html 301 -> clean ($code $loc)" "[ '$code' = '301' ] && [[ '$loc' == */privacy ]]"

code=$(curl -s -o /dev/null -w '%{http_code}' "https://www.$apex/ai-agents" || true)
loc=$(curl -s -o /dev/null -w '%{redirect_url}' "https://www.$apex/ai-agents" || true)
check "www 301 -> apex ($code $loc)" "[ '$code' = '301' ] && [[ '$loc' == https://$apex/* ]]"

code=$(curl -s -o /dev/null -w '%{http_code}' "http://$apex/" || true)
check "http 30x -> https ($code)" "[ '${code:0:2}' = '30' ]"

echo "# Security headers"
headers=$(curl -fsSI "$base/")
check "strict-transport-security" "grep -qi '^strict-transport-security:.*max-age' <<<\"\$headers\""
check "content-security-policy"   "grep -qi '^content-security-policy:'          <<<\"\$headers\""
check "x-content-type-options"    "grep -qi '^x-content-type-options: *nosniff'  <<<\"\$headers\""
check "x-frame-options DENY"      "grep -qi '^x-frame-options: *DENY'            <<<\"\$headers\""
check "no server header leak"     "! grep -qi '^server: *AmazonS3'               <<<\"\$headers\""

exit $fail
