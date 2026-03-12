# Legendary: Zero-Day Rapid Containment (High-Level)

## Objective
Minimize exposure during active exploitation of an unknown/0-day by applying layered containment and strict change control.

## Principles
- Contain first, then patch.
- Preserve evidence.
- Limit blast radius by segmentation.

## Immediate containment
- Enforce WAF managed challenge for sensitive endpoints.
- Reduce public surface (disable features, restrict admin paths).
- Block suspicious ASNs/regions where legally acceptable.

## Detection
- Enable enhanced logging.
- Hunt for:
  - suspicious request patterns
  - privilege escalation attempts
  - creation of new users/tokens

## Patch lane
- Stage → canary → full rollout.
- Document exact versions and timestamps.
