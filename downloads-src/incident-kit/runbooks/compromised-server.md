# Compromised Server Response

## Goal
Contain compromise, preserve evidence, rebuild cleanly.

## Immediate containment
- Quarantine host (network isolation).
- Stop suspicious services.
- Preserve snapshots if possible.

## Evidence
- process list, network connections
- auth logs, sudo logs
- webserver logs

## Eradication + recovery
- Prefer clean rebuild over in-place cleanup.
- Rotate all secrets used on host.
- Patch root cause.

## Verification
- Monitor logs for recurrence.
