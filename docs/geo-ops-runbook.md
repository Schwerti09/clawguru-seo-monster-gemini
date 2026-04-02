# Geo Ops Runbook

Operational schedule for the Geo Living Matrix rollout loop.

## Required env vars

- `GEO_AUTO_PROMOTION_SECRET` (or one of the fallback geo secrets)
- `GEO_AUTO_PROMOTE_LOOKBACK_DAYS` (default `7`)
- `GEO_AUTO_PROMOTE_MIN_AVG_QUALITY` (default `84`)
- `GEO_AUTO_PROMOTE_MIN_VARIANTS` (default `3`)
- `GEO_AUTO_PROMOTE_MAX_PROMOTIONS` (default `10`)
- `GEO_REVALIDATE_SECRET` (required for live revalidate calls)
- `GEO_REVALIDATE_SLUGS` (comma-separated seed slugs, default `aws-ssh-hardening-2026`)

## Step-by-step execution

1) Guardrail (protect index quality)

- Dry-run: `npm run geo:sitemap-guardrail:dry-run`
- Live: `npm run geo:sitemap-guardrail:live`

2) Canary rollout promotion

- Dry-run: `npm run geo:canary-rollout:dry-run`
- Live: `npm run geo:canary-rollout:live`

3) Auto promotion (quality-based canary -> stable)

- Dry-run: `npm run geo:auto-promotion:dry-run`
- Live: `npm run geo:auto-promotion:live`

## Combined cycle command

- Dry-run: `npm run geo:ops-cycle:dry-run`
- Live: `npm run geo:ops-cycle:live`

This runs:

1. `/api/geo/sitemap-guardrail`
2. `/api/geo/canary-rollout`
3. `/api/geo/auto-promotion`
4. `/api/geo/revalidate` for each promoted city + configured seed slug(s) (live mode only)

## Recommended cron cadence

- Every hour: `geo:ops-cycle:dry-run`
- Daily 07:00 UTC: `geo:ops-cycle:live`

If quality drops, keep only dry-run mode until thresholds recover.

