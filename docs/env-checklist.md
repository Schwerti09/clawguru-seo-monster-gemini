# Environment Checklist (Ops Quickstart)

Purpose: keep environment setup operational and short, especially before SEO/Geo rollouts.

How to use:
- Fill `.env.local` for local dev.
- Fill deployment secrets separately (Netlify/Vercel/GitHub Actions).
- Never commit real secrets.

## 1) Required for local development

- `NEXT_PUBLIC_SITE_URL`
- `SITE_URL`
- `DATABASE_URL`
- One AI key chain:
  - `AI_PROVIDER_ORDER`
  - at least one of: `DEEPSEEK_API_KEY`, `GEMINI_API_KEY`, `OPENAI_API_KEY`

## 2) Required for auth/admin surfaces

- `ACCESS_TOKEN_SECRET`
- `SESSION_SECRET`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

## 3) Required for Geo ops scripts and guarded automation

- `GEO_SITEMAP_GUARDRAIL_SECRET`
- `GEO_AUTO_PROMOTION_SECRET`
- `GEO_REVALIDATE_SECRET`
- `GEO_REVALIDATE_SLUGS`

Recommended defaults:
- `GEO_REVALIDATE_SLUGS=openclaw-risk-2026,openclaw-exposed,aws-ssh-hardening-2026,hetzner-ssh-hardening-2026`
- `GEO_SITEMAP_GUARDRAIL_LOCALE=de`
- `GEO_SITEMAP_GUARDRAIL_SLUG=aws-ssh-hardening-2026`

Optional but useful:
- `GEO_CANARY_ROLLOUT_SECRET`
- `GEO_CANARY_ROLLOUT_LIMIT`
- `GEO_AUTO_PROMOTE_LOOKBACK_DAYS`
- `GEO_AUTO_PROMOTE_MIN_AVG_QUALITY`
- `GEO_AUTO_PROMOTE_MIN_VARIANTS`
- `GEO_AUTO_PROMOTE_MAX_PROMOTIONS`
- `GEO_LIVE_GUARD_MAX_CANDIDATES`
- `GEO_LIVE_GUARD_MAX_HEALTH_DROP`

## 4) Required for payments/billing

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- product prices used by your checkout flow (`STRIPE_PRICE_*`)

## 5) Required for email/alerts (if enabled)

- `RESEND_API_KEY`
- `RESEND_FROM`
- `EMAIL_FROM`
- `SUPPORT_EMAIL`

## 6) Optional cache/performance

- `REDIS_URL` or Upstash pair:
  - `UPSTASH_REDIS_REST_URL`
  - `UPSTASH_REDIS_REST_TOKEN`

## 7) Optional integrations

- `DISCORD_WEBHOOK_URL`
- `GITHUB_TOKEN`
- `GOOGLE_INDEXER_KEY`
- `NVD_API_KEY`
- `INTEL_API_KEY` or `INTEL_API_KEYS`

## 8) Pre-rollout quick check

Before major SEO/Geo deploy:
- `npm run check:i18n`
- `npm run check:seo-canonicals`
- `npm run geo:sitemap-guardrail:dry-run`
- `npm run geo:auto-promotion:dry-run`
- `npm run geo:ops-live-guard`

If one fails due missing env, set required keys first and rerun.
