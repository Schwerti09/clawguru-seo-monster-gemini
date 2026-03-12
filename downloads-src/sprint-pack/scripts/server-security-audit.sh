#!/usr/bin/env bash
set -euo pipefail

# Server security audit (read-only). Intended for Linux.

echo "== Host =="
hostnamectl 2>/dev/null || hostname || true

echo "== Kernel =="
uname -a

echo "== Uptime =="
uptime

echo "== Users (recent) =="
who || true

echo "== Listening ports =="
ss -tulpen 2>/dev/null || netstat -tulpen 2>/dev/null || true

echo "== SSH config highlights =="
if [[ -f /etc/ssh/sshd_config ]]; then
  egrep -i '^(PermitRootLogin|PasswordAuthentication|PubkeyAuthentication|AllowUsers|AllowGroups|MaxAuthTries|X11Forwarding)' /etc/ssh/sshd_config || true
fi

echo "== Firewall =="
ufw status verbose 2>/dev/null || true
iptables -S 2>/dev/null | head -n 50 || true

echo "== Sudoers =="
ls -la /etc/sudoers.d 2>/dev/null || true

echo "== Packages (updates) =="
if command -v apt-get >/dev/null 2>&1; then
  apt-get -s upgrade 2>/dev/null | egrep '^(Inst|Conf)' | head -n 40 || true
fi

echo "== Docker =="
if command -v docker >/dev/null 2>&1; then
  docker info 2>/dev/null | egrep '^(Server Version|Storage Driver|Cgroup Driver|Runtimes|Logging Driver)' || true
fi

echo "Audit complete. Save output to a file for tracking."
