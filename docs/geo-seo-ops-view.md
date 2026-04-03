# Geo/SEO Ops View (Daily/Weekly Ampel)

Purpose: keep Geo/SEO execution operational with a simple traffic-light view and fixed checks.

## Daily (Mon-Sun)

| Area | Check | Command / Source | Green | Yellow | Red | Owner |
|---|---|---|---|---|---|---|
| Canonicals | Canonical integrity | `npm run check:seo-canonicals` | Passes with 0 regressions | Warnings only, no index-critical issue | Fails or canonical mismatch on live LPs | SEO agent |
| i18n parity | Locale key parity | `npm run check:i18n` | `[i18n] OK` | Temporary missing key in non-critical copy | Missing keys affecting LP/roast/check pages | i18n owner |
| Geo sitemap guard | Geo sitemap safety | `npm run geo:sitemap-guardrail:dry-run` | No blocking guardrail hit | Guardrail warns, rollout can proceed with fix queue | Blocking guardrail, rollout stop | Geo ops |
| Ops live guard | Release safety gate | `npm run geo:ops-live-guard` | All guard checks healthy | One non-blocking check degraded | Blocking safety check failed | Geo ops |
| Check funnel health | `/check` event stream | Postgres + analytics dashboards | Event volume in expected range | Mild drop (<20% day/day) | Severe drop or no ingest | Product ops |

## Weekly (Fri review)

| Area | What to review | Green | Yellow | Red |
|---|---|---|---|---|
| Indexation trend | GSC clicks + indexed pages for LP/content routes | Upward or stable | Flat with minor query loss | Declining clicks/indexation |
| Link graph | LP ↔ content ↔ runbook internal paths | All new pages include pillar links + `/check` + `/methodik` | Small gaps, tracked in backlog | Structural gaps across clusters |
| Geo rollouts | City variants + quality matrix | Canary->stable plan on schedule | Delays with workaround | Rollout blocked or quality regressions |
| Roast virality | Shares + referral sessions from roast pages | Growing share/referral trend | Flat trend | Material drop with no new triggers |
| Backlog burn | AGENTS open SEO items | On-track completion | Minor spillover | Critical items unowned |

## Run Order (when shipping SEO changes)

1. `npm run check:i18n`
2. `npm run check:seo-canonicals`
3. `npm run geo:sitemap-guardrail:dry-run`
4. `npm run geo:ops-live-guard`
5. Manual smoke on key routes: `/openclaw`, `/openclaw-security-check`, `/moltbot-hardening`, `/ai-agent-security`, `/roast-my-stack`

## Incident Rules

- Red on canonical/i18n/guardrails: stop rollout, fix first, rerun full run order.
- Red on funnel ingest: treat as production incident, prioritize telemetry restore.
- Any unresolved Red after 24h: add blocker entry to `AGENTS.md` with owner + ETA.

