# Recovery Playbook

## Goal
Restore services safely without reintroducing compromise.

## Principles
- Prefer clean rebuilds.
- Restore identity systems first.
- Validate integrity before re-opening traffic.

## Steps
1. Confirm root cause is mitigated (patched, exposure removed).
2. Rotate credentials and secrets.
3. Rebuild compromised systems from golden images/IaC.
4. Restore data from known-good backups.
5. Validate:
   - integrity checks
   - security controls
   - monitoring
6. Gradual traffic re-enable.

## Post-recovery monitoring
- Increase alert sensitivity for 7–14 days.
- Hunt for recurrence IoCs.
