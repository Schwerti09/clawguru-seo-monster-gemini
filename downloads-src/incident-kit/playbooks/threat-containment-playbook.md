# Threat Containment Playbook

## Goal
Contain the threat to stop ongoing attacker actions while preserving evidence.

## Containment levers (choose based on scenario)

### Identity
- Disable suspicious accounts
- Rotate admin credentials
- Revoke API tokens
- Enforce MFA on privileged groups

### Network
- Block known IoCs (IP/domain/ASN)
- Restrict egress (deny by default where possible)
- Quarantine VLAN / isolate hosts

### Application
- WAF rules (managed challenges, bot mitigation)
- Rate limiting on auth endpoints
- Disable risky features temporarily

### Cloud
- Disable suspicious IAM roles
- Block public bucket access
- Rotate access keys

## Evidence preservation
Before wiping/rebuilding:
- Snapshot VM/disk
- Export central logs
- Capture memory/process/network state

## Verification
- Confirm attacker actions stopped (no new alerts)
- Confirm scope not expanding
- Document everything in timeline
