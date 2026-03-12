#!/usr/bin/env bash
set -euo pipefail

# Fail2ban installer + sshd jail baseline

if [[ $EUID -ne 0 ]]; then
  echo "Please run as root (sudo)." >&2
  exit 1
fi

if command -v apt-get >/dev/null 2>&1; then
  apt-get update
  apt-get install -y fail2ban
elif command -v yum >/dev/null 2>&1; then
  yum install -y epel-release
  yum install -y fail2ban
else
  echo "Unsupported package manager. Install fail2ban manually." >&2
  exit 2
fi

mkdir -p /etc/fail2ban/jail.d
cat >/etc/fail2ban/jail.d/sshd.local <<'EOF'
[sshd]
enabled = true
port = ssh
logpath = %(sshd_log)s
maxretry = 5
findtime = 10m
bantime = 1h
EOF

systemctl enable --now fail2ban
fail2ban-client status sshd || true

echo "Fail2ban installed and sshd jail enabled."
