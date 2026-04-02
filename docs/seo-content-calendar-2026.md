# SEO Content Calendar 2026

Purpose: turn Strategy Block 5 into an executable publishing queue with clear intent, internal links, and ownership.

## Publishing Rules

- Ship quality over volume: max 2 posts/week, each with actionable runbook-level depth.
- Every post must link to at least 2 pillar LPs: `/openclaw`, `/ai-agent-security`, `/moltbot-hardening`, `/openclaw-security-check`.
- Every post must include one direct path to `/check` and one path to `/methodik`.
- No unverified CVEs or fabricated incident claims.

## Priority Queue (Next 8 Weeks)

| Week | Topic | Primary Intent | Primary LP Link | Secondary LP Link | Status |
|---|---|---|---|---|---|
| 1 | 30-second check: what we measure and what we do not | Tool trust | `/openclaw-security-check` | `/ai-agent-security` | shipped (`/[lang]/check-methodology-30-seconds`) |
| 1 | OpenClaw top-5 exposure misconfigs | Community pain | `/openclaw` | `/moltbot-hardening` | shipped (`/[lang]/openclaw-top-5-exposure-misconfigs`) |
| 2 | Gateway auth in 10 steps (operator runbook) | Hardening | `/moltbot-hardening` | `/openclaw` | shipped (`/[lang]/gateway-auth-10-steps`) |
| 2 | API key leak response playbook | Incident response | `/ai-agent-security` | `/openclaw-security-check` | shipped (`/[lang]/api-key-leak-response-playbook`) |
| 3 | NIS2 technical controls for self-hosted teams | Compliance intent | `/ai-agent-security` | `/openclaw` | shipped (`/[lang]/nis2-technical-controls-self-hosted`) |
| 4 | Hetzner vs DO security baseline (2026) | Infra hardening | `/moltbot-hardening` | `/openclaw-security-check` | backlog |
| 5 | Docker + reverse proxy hardening cheatsheet | Tactical implementation | `/moltbot-hardening` | `/openclaw` | backlog |
| 6 | Security check vs pentest: expectation guide | Conversion clarity | `/openclaw-security-check` | `/ai-agent-security` | backlog |
| 7 | Executable runbook vs static blog post | Product differentiation | `/openclaw` | `/ai-agent-security` | backlog |
| 8 | AI-agent threat model template for operators | Category authority | `/ai-agent-security` | `/openclaw-security-check` | backlog |

## Article Template (Required Sections)

1. Problem context (real operator symptom, no hype)
2. Fast signal (what to verify in under 5 minutes)
3. Fix path (ordered steps + command snippets where useful)
4. Re-check criteria (what "fixed" means)
5. Internal links (`/check`, `/methodik`, 2 LPs, 1 runbook hub)
6. Scope limits and disclaimer (not a pentest)

## Tracking

- Content KPI source: GSC query impressions/clicks by LP-linked article.
- Conversion KPI source: check starts and check->runbook transitions.
- Review cadence: weekly pruning of underperforming posts, monthly intent map refresh.
