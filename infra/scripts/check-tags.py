#!/usr/bin/env python3
"""Fail if any taggable resource in a Terraform plan lacks the mandatory tags.

    terraform plan -out=tfplan && terraform show -json tfplan > plan.json
    check-tags.py plan.json [--policy ../tag-policy.json]
    check-tags.py --self-test

A resource is taggable when its planned values carry `tags_all` (the AWS
provider merges provider-level default_tags into it). Every required
`<prefix><name>` key must be present there with a value matching
`value_pattern`. Resources being destroyed are ignored.
"""

import argparse
import json
import re
import sys
from pathlib import Path

DEFAULT_POLICY = Path(__file__).resolve().parent.parent / "tag-policy.json"


def load_policy(path: Path) -> tuple[list[str], re.Pattern[str]]:
    policy = json.loads(path.read_text(encoding="utf-8"))
    keys = [policy["prefix"] + name for name in policy["required"]]
    return keys, re.compile(policy["value_pattern"])


def violations(plan: dict, required: list[str], pattern: re.Pattern[str]) -> tuple[list[str], int]:
    """Return (problems, number of taggable resources checked)."""
    problems: list[str] = []
    checked = 0
    for rc in plan.get("resource_changes", []):
        change = rc.get("change", {})
        if "delete" in change.get("actions", []) and "create" not in change.get("actions", []):
            continue
        after = change.get("after") or {}
        unknown = change.get("after_unknown") or {}
        if "tags_all" not in after and "tags_all" not in unknown:
            continue  # not a taggable resource type
        checked += 1
        address = rc["address"]
        tags = after.get("tags_all")
        if tags is None:
            problems.append(f"{address}: tags_all unknown at plan time; cannot verify")
            continue
        for key in required:
            value = tags.get(key)
            if value is None or value == "":
                problems.append(f"{address}: missing tag {key}")
            elif not pattern.match(value):
                problems.append(f"{address}: tag {key}={value!r} has invalid characters/length")
    return problems, checked


def self_test() -> int:
    required = ["p:project", "p:owner"]
    pattern = re.compile(r"^[a-z0-9 -]{1,20}$")

    def rc(address: str, tags_all, actions=("create",)) -> dict:
        after = {} if tags_all == "absent" else {"tags_all": tags_all}
        return {"address": address, "change": {"actions": list(actions), "after": after}}

    cases = [
        ("compliant resource passes", [rc("a.ok", {"p:project": "x", "p:owner": "y"})], 0, 1),
        ("missing key fails", [rc("a.bad", {"p:project": "x"})], 1, 1),
        ("empty value fails", [rc("a.empty", {"p:project": "x", "p:owner": ""})], 1, 1),
        ("bad value fails", [rc("a.badval", {"p:project": "X!", "p:owner": "y"})], 1, 1),
        ("non-taggable type is skipped", [rc("a.skip", "absent")], 0, 0),
        ("destroyed resources are skipped", [rc("a.gone", {}, ("delete",))], 0, 0),
    ]
    failed = 0
    for name, changes, want_problems, want_checked in cases:
        problems, checked = violations({"resource_changes": changes}, required, pattern)
        ok = len(problems) == want_problems and checked == want_checked
        failed += not ok
        print(f"{'ok  ' if ok else 'FAIL'} {name}")
    return 1 if failed else 0


def main() -> int:
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawTextHelpFormatter
    )
    parser.add_argument("plan_json", nargs="?", type=Path)
    parser.add_argument("--policy", type=Path, default=DEFAULT_POLICY)
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()

    if args.self_test:
        return self_test()
    if not args.plan_json:
        parser.error("plan_json is required unless --self-test")

    required, pattern = load_policy(args.policy)
    plan = json.loads(args.plan_json.read_text(encoding="utf-8"))
    problems, checked = violations(plan, required, pattern)
    for problem in problems:
        print(f"::error::{problem}")
    print(f"tag contract: {checked} taggable resources checked, {len(problems)} problems")
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
