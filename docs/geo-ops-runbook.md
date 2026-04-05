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

## D4 activation note (Apr 2026)

- D4 matrix coverage uses the 12-city CEE/Balkan set: `warsaw`, `krakow`, `wroclaw`, `budapest`, `bucharest`, `sofia`, `athens`, `thessaloniki`, `bratislava`, `zagreb`, `ljubljana`, `belgrade`.
- Canonical geo LP targets for D4 are `/{locale}/{city}/openclaw-risk-2026` (`de`) and `/{locale}/{city}/openclaw-exposed` (`en`).
- Legacy runbook URLs must 301 to those canonical city targets before seed/promotion is considered green.
- `app/api/geo/city-ranking/route.ts` follows same-origin `301/302/307/308` redirects so legacy runbook probes count as healthy when the canonical city page answers `200 OK`.
- `scripts/ops-d4-final-decision-snapshot.js` now validates both gates separately:
  - legacy redirect -> canonical city URL
  - canonical target -> `200 OK`
- Recommended D4 sequence:
  1. `node scripts/ops-d4-coverage-check.js`
  2. `node scripts/ops-d4-final-decision-snapshot.js`
  3. `node scripts/geo-batch-seed-by-quality.js --wave-id=<wave> --batch=D4 --quality-floor=85 --mode=dry-run`
  4. if all self-healing checks are green: rerun with `--mode=commit`
  5. `node scripts/trigger-geo-canary-rollout.js --mode=dry-run --locale=de --slug=openclaw-risk-2026`
  6. `node scripts/trigger-geo-canary-rollout.js --mode=dry-run --locale=en --slug=openclaw-exposed`

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

