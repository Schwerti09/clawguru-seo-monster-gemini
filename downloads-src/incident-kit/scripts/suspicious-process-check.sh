#!/usr/bin/env bash
set -euo pipefail

# Suspicious process quick check (heuristic)

echo "== High CPU processes =="
ps -eo pid,ppid,user,%cpu,%mem,etime,cmd --sort=-%cpu | head -n 20

echo "== Listening processes =="
ss -tulpen 2>/dev/null || true

echo "== Recently started processes (best effort) =="
ps -eo lstart,pid,user,cmd --sort=lstart | tail -n 30

echo "== Suspicious keywords (best effort) =="
ps auxfww | egrep -i "(wget|curl|nc |ncat|socat|base64|python -c|perl -e|bash -i|/tmp/|kworker/|miner|xmrig)" || true
