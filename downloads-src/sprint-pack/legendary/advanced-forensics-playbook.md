# Legendary: Advanced Forensics Playbook (High-Level)

## Scope
High-level forensic workflow for advanced incidents (cloud + host + identity).

## Preserve
- Snapshot disks/VMs where possible
- Export cloud audit logs
- Preserve identity logs (SSO, MFA events)

## Collect
- Process trees, network connections
- Persistence (cron, services, autoruns)
- Suspicious binaries + hashes

## Analyze
- Build a timeline
- Map IoCs across systems
- Determine patient zero

## Report
- Evidence list
- Timeline
- Root cause hypothesis
- Remediation recommendations
