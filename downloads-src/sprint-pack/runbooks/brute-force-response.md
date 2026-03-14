# Brute Force Response (SSH / Web Login)

## Goal
Stop credential stuffing/brute force, protect accounts, and reduce future exposure.

## Triage
- Confirm the target:
  - SSH? Web login? VPN?
- Confirm impact:
  - successful logins?
  - suspicious sessions?

## Immediate containment
1. Enable rate-limiting / lockouts.
2. Block abusive IPs (temporary firewall).
3. Require MFA if supported.

## SSH-specific
- Check logs:
```bash
sudo journalctl -u ssh --since "2 hours ago" | tail -n 200
sudo grep -E "Failed password|Invalid user" /var/log/auth.log | tail -n 200
```
- If password auth is enabled, disable it.
- Deploy Fail2ban.

## Web login-specific
- Enable WAF rules.
- Add `limit_req` in Nginx.
- Enforce strong password policy.

## Verify no compromise
- Review recent successful logins.
- Check for:
  - new ssh keys
  - new sudoers entries
  - unexpected cron jobs

## Remediation
- Rotate passwords/keys for affected accounts.
- Add allowlists for admin paths.
- Add alerting on auth anomalies.
