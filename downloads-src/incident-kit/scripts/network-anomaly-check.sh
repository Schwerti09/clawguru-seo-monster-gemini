#!/usr/bin/env bash
set -euo pipefail

# Network anomaly check (read-only)

echo "== External established connections =="
ss -tpn state established 2>/dev/null | egrep -v "(127\.0\.0\.1|::1)" || true

echo "== Top talkers (requires iproute2, best effort) =="
if command -v ss >/dev/null 2>&1; then
  ss -tpn 2>/dev/null | awk '{print $5}' | sed 's/\[//;s/\]//' | cut -d: -f1 | sort | uniq -c | sort -nr | head -n 20 || true
fi

echo "== DNS resolver config =="
cat /etc/resolv.conf 2>/dev/null || true

echo "== Recent auth failures (if available) =="
(grep -E "Failed password|Invalid user" /var/log/auth.log | tail -n 50) 2>/dev/null || true
