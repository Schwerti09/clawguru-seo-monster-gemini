# Legendary: Nation-State Incident Playbook (High-Level)

## Objective
Coordinate a high-assurance response for targeted intrusion where adversary capabilities are advanced (persistence, stealth, long dwell time).

## Operating principles
- Assume compromise may be **multi-system**.
- Prioritize identity systems and build pipeline integrity.
- Preserve evidence and maintain chain-of-custody.

## Strategic containment
- Segmentation: lock down east-west traffic.
- Identity reset: rotate privileged creds, revoke tokens.
- CI/CD: rotate deploy keys, audit workflows.

## Investigation
- Collect centralized logs (cloud audit, IdP, EDR, DNS, proxy).
- Identify persistence mechanisms.
- Determine data access scope.

## Recovery
- Rebuild from known-good infrastructure-as-code.
- Verified clean-room deployments.
- Red-team validation before re-opening.

## Governance
- Executive + legal + PR alignment.
- Regulatory notifications where required.

## Outputs
- Scope statement
- Clean rebuild plan
- Lessons learned + roadmap
