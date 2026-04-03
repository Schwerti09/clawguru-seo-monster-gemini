# Geo Ops Runbook

Operational schedule for the Geo Living Matrix rollout loop.

## Required env vars

- `GEO_CANARY_ROLLOUT_SECRET`
- `GEO_SITEMAP_GUARDRAIL_SECRET`
- `GEO_AUTO_PROMOTION_SECRET` (or one of the fallback geo secrets)
- `GEO_EXPANSION_SECRET` (required for `/api/geo/top-city-expansion` auth)
- `GEO_AUTO_PROMOTE_LOOKBACK_DAYS` (default `7`)
- `GEO_AUTO_PROMOTE_MIN_AVG_QUALITY` (default `84`)
- `GEO_AUTO_PROMOTE_MIN_VARIANTS` (default `3`)
- `GEO_AUTO_PROMOTE_MAX_PROMOTIONS` (default `10`)
- `GEO_REVALIDATE_SECRET` (required for live revalidate calls)
- `GEO_REVALIDATE_SLUGS` (comma-separated seed slugs, default `aws-ssh-hardening-2026`)

## Step-by-step execution

0) Readiness check (before any cron/live run)

- `npm run check:geo-ops-readiness`

1) Guardrail (protect index quality)

- Dry-run: `npm run geo:sitemap-guardrail:dry-run`
- Live: `npm run geo:sitemap-guardrail:live`

2) Canary rollout promotion

- Dry-run: `npm run geo:canary-rollout:dry-run`
- Live: `npm run geo:canary-rollout:live`

Optional high-volume tuning:

- Dry-run example: `node scripts/trigger-geo-canary-rollout.js --mode=dry-run --locale=de --slug=openclaw-risk-2026 --limit=500 --minRankingScore=65`
- Live example: `node scripts/trigger-geo-canary-rollout.js --mode=live --locale=de --slug=openclaw-risk-2026 --limit=500 --minRankingScore=65`

3) Top-city expansion (eligibility + activation)

- Dry-run: `npm run geo:top-city-expansion:dry-run`
- Live: `npm run geo:top-city-expansion:live`

4) Auto promotion (quality-based canary -> stable)

- Dry-run: `npm run geo:auto-promotion:dry-run`
- Live: `npm run geo:auto-promotion:live`

## Combined cycle command

- Dry-run: `npm run geo:ops-cycle:dry-run`
- Live: `npm run geo:ops-cycle:live`
- Guarded live: `npm run geo:ops-live-guard`

This runs:

1. `/api/geo/sitemap-guardrail`
2. `/api/geo/canary-rollout`
3. `/api/geo/auto-promotion`
4. `/api/geo/revalidate` for each promoted city + configured seed slug(s) (live mode only)

## 500-city rollout note (Apr 2026)

- Runtime/auth path can be healthy while `wouldPromote`/`wouldActivate` remains empty.
- That state usually indicates eligibility/data gates, not infra failure.
- Use the staged debug plan in `AGENTS.md` §10 before lowering thresholds aggressively.

## Safe live guard

Use `npm run geo:ops-live-guard` for production rollouts.

It enforces:

- Required key presence (`GEO_AUTO_PROMOTION_SECRET`, `GEO_REVALIDATE_SECRET`, `GEO_REVALIDATE_SLUGS`)
- Dry-run health score safety
- Candidate-count safety cap before live execution

Tunable guardrails:

- `GEO_LIVE_GUARD_MAX_CANDIDATES` (default `20`)
- `GEO_LIVE_GUARD_MAX_HEALTH_DROP` (default `10`)

## Recommended cron cadence

- Every hour: `geo:ops-cycle:dry-run`
- Daily 07:00 UTC: `geo:ops-cycle:live`

If quality drops, keep only dry-run mode until thresholds recover.

## Windows note

On Windows, `.env.local` may be hidden in Explorer. If you cannot find it, use terminal:

- `dir /a`

