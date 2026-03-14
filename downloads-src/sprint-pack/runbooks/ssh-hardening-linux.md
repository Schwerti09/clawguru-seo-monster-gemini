# SSH Hardening (Linux)

## Goal
Reduce brute-force risk and credential theft by enforcing strong SSH configuration and operational controls.

## Preconditions
- You have console access / out-of-band access.
- You know at least one working admin user.
- You can roll back `/etc/ssh/sshd_config`.

## Checklist (quick)
- Disable root login
- Disable password auth (use keys)
- Restrict users/groups
- Limit auth attempts
- Enable logging
- Enable MFA via PAM (optional)

## Procedure

### 1) Create/verify an admin user
- Ensure at least one non-root sudo user exists.

### 2) Back up config
```bash
sudo cp -a /etc/ssh/sshd_config /etc/ssh/sshd_config.bak.$(date +%F-%H%M)
```

### 3) Apply baseline config
Edit `/etc/ssh/sshd_config`:

- `PermitRootLogin no`
- `PasswordAuthentication no`
- `KbdInteractiveAuthentication no`
- `PubkeyAuthentication yes`
- `AllowUsers <your-admin-user>` (or `AllowGroups sshusers`)
- `MaxAuthTries 3`
- `LoginGraceTime 20`
- `ClientAliveInterval 300`
- `ClientAliveCountMax 2`
- `X11Forwarding no`
- `AllowTcpForwarding no` (enable only if needed)
- `PermitTunnel no`

### 4) Validate config
```bash
sudo sshd -t
```

### 5) Reload SSH safely
Keep a second session open.

```bash
sudo systemctl reload sshd || sudo systemctl reload ssh
```

### 6) Verify from a new terminal
```bash
ssh -o PreferredAuthentications=publickey <user>@<host>
```

## Detection
- Monitor `/var/log/auth.log` or `journalctl -u ssh -S today`.
- Alert on repeated failed auth, new key additions, changes to sshd_config.

## Response
If you lock yourself out:
- Use console access
- Restore backup config
- Restart SSH

## Hardening extras
- Add Fail2ban for SSH
- Enforce key types (ed25519), rotate keys periodically
- Use `sshd_config.d/*.conf` where supported
