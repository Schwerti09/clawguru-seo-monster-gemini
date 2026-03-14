# Legendary: Nation-State Intrusion Playbook (High-Level)

## Objective
Coordinate response to a targeted intrusion with advanced adversary tradecraft.

## Key assumptions
- Attacker may have long dwell time.
- Identity and build pipeline are high-value targets.
- Persistence is likely.

## Strategic containment
- Lock down privileged identity:
  - enforce MFA
  - rotate privileged credentials
  - revoke tokens and sessions
- Reduce lateral movement:
  - segment networks
  - restrict east-west traffic
- Protect CI/CD:
  - rotate deploy keys
  - audit workflows and runners

## Investigation
- Collect authoritative logs:
  - IdP, cloud audit, EDR, DNS, proxy
- Identify persistence and command-and-control.

## Recovery
- Prefer clean rebuilds from IaC.
- Validate with independent checks before re-opening access.
