# Security Audit Checklist

## Quick inventory
- [ ] Hostnames, IPs, roles
- [ ] Critical services list
- [ ] Admin access paths

## Exposure
- [ ] Open ports review
- [ ] Public endpoints mapped
- [ ] WAF/CDN rules reviewed

## Identity
- [ ] Privileged accounts list
- [ ] MFA coverage
- [ ] Recent admin logins reviewed

## Secrets
- [ ] CI/CD secrets rotated schedule
- [ ] No secrets in images/repos

## Detection
- [ ] Logs collected and retained
- [ ] Alerts for auth failures/spikes

## Recovery readiness
- [ ] Backups exist and restore tested
- [ ] Incident templates ready
