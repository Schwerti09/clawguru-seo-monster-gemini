#!/usr/bin/env bash
set -euo pipefail

# Quick forensics snapshot (read-only). Run as root for best results.

TS=$(date +%F-%H%M%S)
OUT=${OUT_DIR:-"./forensics-$TS"}
mkdir -p "$OUT"

echo "Writing snapshot to: $OUT"

{
  echo "== Host =="; hostnamectl 2>/dev/null || hostname
  echo "== Time =="; date -u
  echo "== Uptime =="; uptime
  echo "== Users =="; who || true
  echo "== Processes (top) =="; ps auxfww | head -n 200
  echo "== Network connections =="; ss -tupn 2>/dev/null || netstat -tupn 2>/dev/null || true
  echo "== Listening ports =="; ss -tulpen 2>/dev/null || netstat -tulpen 2>/dev/null || true
  echo "== Recent logins =="; last -n 50 || true
} > "$OUT/host_snapshot.txt" 2>&1

# Hashes of recently modified binaries (best effort)
find /usr/bin /usr/sbin -type f -mtime -3 -maxdepth 1 2>/dev/null | head -n 200 > "$OUT/recent_bins.txt" || true

echo "Done. Review $OUT/host_snapshot.txt"
