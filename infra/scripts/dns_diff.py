#!/usr/bin/env python3
"""Compare DNS answers from the current (GoDaddy) nameservers against the new
Route 53 nameservers, BEFORE switching the registrar's NS records. Every record
Route 53 will serve must already match, or email and the live site break at
cutover.

    dns_diff.py weaiforge.com \
        --old ns51.domaincontrol.com --old ns52.domaincontrol.com \
        --new ns-123.awsdns-15.com   --new ns-456.awsdns-20.net

Needs `dig` on PATH. Compares A, AAAA, MX, TXT, CNAME, CAA, SRV for the apex and
the names in prod.tfvars. NS and SOA are expected to differ and are skipped.
Exit code is non-zero if any record differs.
"""
from __future__ import annotations

import argparse
import subprocess
import sys

RECORD_TYPES = ["A", "AAAA", "MX", "TXT", "CNAME", "CAA", "SRV"]


def dig(name: str, rtype: str, server: str) -> set[str]:
    out = subprocess.run(
        ["dig", f"@{server}", "+norecurse", "+short", name, rtype],
        capture_output=True, text=True, timeout=30,
    ).stdout
    return {line.strip().rstrip(".").lower() for line in out.splitlines() if line.strip()}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawTextHelpFormatter)
    parser.add_argument("domain")
    parser.add_argument("--old", action="append", required=True, help="current nameserver (repeatable)")
    parser.add_argument("--new", action="append", required=True, help="Route 53 nameserver (repeatable)")
    parser.add_argument("--name", action="append", default=[], help="extra FQDN to compare (repeatable)")
    args = parser.parse_args()

    names = [args.domain, f"www.{args.domain}", f"_dmarc.{args.domain}",
             f"_autodiscover._tcp.{args.domain}", f"email.{args.domain}", *args.name]

    differences = 0
    for name in names:
        for rtype in RECORD_TYPES:
            old = set().union(*(dig(name, rtype, s) for s in args.old))
            new = set().union(*(dig(name, rtype, s) for s in args.new))
            if old != new:
                differences += 1
                print(f"DIFF {name} {rtype}")
                print(f"  old ({', '.join(args.old)}): {sorted(old) or '-'}")
                print(f"  new ({', '.join(args.new)}): {sorted(new) or '-'}")
            elif old:
                print(f"ok   {name} {rtype}: {sorted(old)}")

    print(f"\n{differences} difference(s). " +
          ("Safe to switch nameservers." if differences == 0 else "DO NOT switch nameservers yet."))
    return 1 if differences else 0


if __name__ == "__main__":
    sys.exit(main())
