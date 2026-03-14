# Legendary: Zero-Day Response Runbook (High-Level)

## Purpose
Guide leadership and operators through a fast, disciplined response when a critical, actively exploited zero-day impacts internet-facing systems.

## Triggers
- Vendor advisory indicates active exploitation
- Credible exploit PoC in the wild
- Detection signals show exploitation attempts

## Command intent
- **Reduce exposure immediately**
- **Preserve evidence**
- **Patch/mitigate safely**

## Phase 1: Immediate exposure reduction (0–60 min)
- Freeze risky deploys.
- Identify affected products/versions.
- Apply mitigations (WAF rules, feature flags, IP allowlists).
- Rate limit sensitive endpoints.

## Phase 2: Detection + threat hunting (1–6h)
- Enable enhanced logging for affected services.
- Hunt for:
  - suspicious webshell patterns
  - anomalous admin/API usage
  - new binaries/cron jobs

## Phase 3: Patch rollout (same day)
- Roll patches to staging.
- Canary deploy to a subset of production.
- Full rollout with monitoring.

## Phase 4: Posture improvements
- Reduce exposed surface permanently.
- Implement pre-prod exploit simulation and patch playbooks.

## Artifacts
- Incident timeline
- Patch rollout log
- Indicator list
- Executive summary
