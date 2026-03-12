#!/usr/bin/env bash
set -euo pipefail

# SSH hardening helper (non-destructive by default).
# Review changes before applying in production.

CONF="/etc/ssh/sshd_config"
BACKUP="/etc/ssh/sshd_config.bak.$(date +%F-%H%M%S)"

if [[ $EUID -ne 0 ]]; then
  echo "Please run as root (sudo)." >&2
  exit 1
fi

if [[ ! -f "$CONF" ]]; then
  echo "sshd_config not found: $CONF" >&2
  exit 1
fi

cp -a "$CONF" "$BACKUP"
echo "Backup created: $BACKUP"

echo "Applying conservative SSH hardening..."

# Use simple replace-or-append logic
set_opt() {
  local key="$1" value="$2"
  if grep -qiE "^\s*${key}\b" "$CONF"; then
    sed -i -E "s/^\s*${key}\b.*/${key} ${value}/I" "$CONF"
  else
    echo "${key} ${value}" >> "$CONF"
  fi
}

set_opt "PermitRootLogin" "no"
set_opt "PasswordAuthentication" "no"
set_opt "KbdInteractiveAuthentication" "no"
set_opt "PubkeyAuthentication" "yes"
set_opt "MaxAuthTries" "3"
set_opt "LoginGraceTime" "20"
set_opt "X11Forwarding" "no"
set_opt "PermitTunnel" "no"

# Validate
if sshd -t; then
  echo "sshd config valid. Reloading..."
  systemctl reload sshd 2>/dev/null || systemctl reload ssh 2>/dev/null || true
  echo "Done. Test a new SSH session before closing the current one."
else
  echo "sshd config validation failed. Restoring backup." >&2
  cp -a "$BACKUP" "$CONF"
  exit 2
fi
