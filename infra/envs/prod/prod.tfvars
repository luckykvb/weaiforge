domain_name       = "weaiforge.com"
github_repository = "weaiforge5/weaiforge"
owner             = "devops"
cost_center       = "marketing"
alert_email       = "samba@weaiforge.com"

# Rollout switches; flip one per PR, in order (RUNBOOK.md):
#   1. both false  -> zone answers exactly like GoDaddy; then switch NS at GoDaddy
#   2. site_enabled -> bucket, certificate, CloudFront, WAF, Free plan; first deploy
#   3. cutover      -> apex/www move to CloudFront, CAA added
site_enabled = false
cutover      = false

pricing_plan_tier = "FREE"

# --- Copied from the live GoDaddy zone (public DNS, 2026-10-23) ------------------
# Seeded from public DNS, then reconciled with the GoDaddy DNS page (CNAME/TXT rows).
# Still confirm MX/SRV/A rows on that page before switching nameservers.

# Vercel, current host of the site.
legacy_apex_a_records = ["216.198.79.1"]
legacy_www_cname      = "weaiforge.com"

dns_records = {
  # GoDaddy-hosted email (secureserver.net)
  mx = {
    name    = ""
    type    = "MX"
    records = ["0 smtp.secureserver.net", "10 mailstore1.secureserver.net"]
  }
  apex_txt = {
    name = ""
    type = "TXT"
    records = [
      "v=spf1 include:secureserver.net -all",
      "google-site-verification=r-wCypx6FMz6qhbf_ZEigPJuRGA9JTx17bIiFZP1RLw",
    ]
  }
  dmarc = {
    name    = "_dmarc"
    type    = "TXT"
    records = ["v=DMARC1; p=quarantine; adkim=r; aspf=r; rua=mailto:dmarc_rua@onsecureserver.net;"]
  }
  autodiscover_srv = {
    name    = "_autodiscover._tcp"
    type    = "SRV"
    records = ["0 0 443 autodiscover.secureserver.net"]
  }
  # DKIM, confirmed on the GoDaddy DNS page 2026-10-23.
  dkim1 = {
    name    = "secureserver1._domainkey"
    type    = "CNAME"
    records = ["s1.dkim.weaiforge_com.16f.onsecureserver.net"]
  }
  dkim2 = {
    name    = "secureserver2._domainkey"
    type    = "CNAME"
    records = ["s2.dkim.weaiforge_com.16f.onsecureserver.net"]
  }
  webmail = {
    name    = "email"
    type    = "CNAME"
    records = ["email.secureserver.net"]
  }
  domainconnect = {
    name    = "_domainconnect"
    type    = "CNAME"
    records = ["_domainconnect.gd.domaincontrol.com"]
  }
}
