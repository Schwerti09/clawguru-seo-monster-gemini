# Linux Hardening Checklist

## Accounts & auth
- [ ] MFA for admins (where possible)
- [ ] Remove unused accounts
- [ ] Disable root SSH login
- [ ] Disable password SSH auth (keys only)

## Patching
- [ ] Automatic security updates enabled
- [ ] Kernel and critical packages updated

## Network
- [ ] Firewall enabled (default deny inbound)
- [ ] Only required ports exposed
- [ ] SSH restricted by IP allowlist (if possible)

## Services
- [ ] Remove unused services
- [ ] Least privilege users
- [ ] Systemd hardening for exposed services

## Logging
- [ ] Central log forwarding
- [ ] Alerting for auth anomalies
- [ ] Time sync (NTP) enabled

## Backups
- [ ] Backups tested
- [ ] Immutable/offline backup copy
