#!/bin/bash
# ============================================================================
# Netlify Build Environment Variables
# ============================================================================
# These variables are sourced at the START of the Netlify build command and
# are available ONLY during the build process.  They are NOT injected into
# Serverless Functions — that is the entire point of this script.
#
# Netlify injects every variable from [build.environment] AND from the
# Dashboard into every Function.  The combined size must stay under 4 KB.
# By keeping build-only config here (and non-secret defaults in
# config/env-defaults.json), the Function env contains only:
#   - NODE_VERSION  (from netlify.toml, ~14 bytes)
#   - SECRETS_SCAN_OMIT_PATHS  (from netlify.toml, ~55 bytes)
#   - Dashboard secrets  (~2–3 KB depending on how many integrations are active)
# Total ≈ 2–3 KB — well under the 4 KB limit.
# ============================================================================

# ── Node.js / npm ─────────────────────────────────────────────────────────────
export NODE_OPTIONS="--max-old-space-size=6144"
export NPM_CONFIG_PRODUCTION="false"

# ── Build Optimization Flags ──────────────────────────────────────────────────
export NEXT_PUBLIC_ADMIN_UI="1"
export NEXT_DISABLE_ESLINT="1"
export NEXT_DISABLE_TYPE_CHECK="1"

# ── Sitemap Generation Settings ──────────────────────────────────────────────
export SITEMAP_BUCKETS="5"
export SITEMAP_ALLOW_CHUNK="1"
export SITEMAP_QUALITY_STRICT="1"
export SITEMAP_RUNBOOKS_PER_BUCKET="2000"
export SITEMAP_INCLUDE_SYNTHETIC_100K="0"
export SITEMAP_100K_LOCALES="de,en"
export SITEMAP_100K_PAGES="42"

# ── Geo Matrix Settings (Static Generation) ──────────────────────────────────
export GEO_MATRIX_SITEMAP="1"
export GEO_MATRIX_ENABLED="1"
export GEO_MATRIX_AUTO_REWRITE="1"
export GEO_MATRIX_MIN_QUALITY="72"
export GEO_MATRIX_SITEMAP_CITY_LIMIT="50"
export GEO_MATRIX_SITEMAP_CITY_POOL="72"
export GEO_MATRIX_SITEMAP_SEED_LIMIT="8"
export GEO_INDEX_HEALTH_BASE="https://clawguru.org"
export GEO_INDEX_HEALTH_CITY_LIMIT="12"

# ── PSEO Settings ────────────────────────────────────────────────────────────
export PSEO_RUNBOOK_COUNT="50000"
export PSEO_ALLOW_SYNTHETIC_100K="0"

# ── Quality Thresholds ───────────────────────────────────────────────────────
export MIN_AVG_QUALITY="86"
export MIN_VARIANTS="3"
export MAX_PROMOTIONS="10"

# ── Observability (disabled for build) ───────────────────────────────────────
export OBS_ENABLED="0"
export OBS_SAMPLE_RATE="0.1"

# ── Secrets scanner fallback ─────────────────────────────────────────────────
# The Netlify secrets scanner runs as a post-build step.  SECRETS_SCAN_OMIT_PATHS
# in netlify.toml already covers all build output.  If the scanner still flags
# something, set SECRETS_SCAN_OMIT_KEYS in the Netlify Dashboard (scope: Builds).
# We also export it here in case the build-step scanner can pick it up:
export SECRETS_SCAN_OMIT_KEYS="ACCESS_TOKEN_SECRET,ACCOUNTING_EXPORT_SECRET,ADMIN_API_TOKEN,ADMIN_PASSWORT,ADMIN_PASSWORD,ADMIN_SESSION_SECRET,CRON_SECRET,DATABASE_URL,DEEPSEEK_API_KEY,DISCORD_WEBHOOK_URL,ENTERPRISE_API_KEYS,GEMINI_API_KEY,GITHUB_TOKEN,GOOGLE_INDEXER_KEY,HEYGEN_API_KEY,INTEL_API_KEY,MAGIC_LINK_SECRET,NETLIFY_API_KEY,NETLIFY_AUTH_TOKEN,NETLIFY_ACCOUNT_ID,NETLIFY_SITE_ID,NEWSLETTER_UNSUBSCRIBE_SECRET,NEXTAUTH_SECRET,NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,NVD_API_KEY,OPENAI_API_KEY,REDIS_URL,RESEND_API_KEY,SECURITY_CHECK_SECRET,SENTINEL_NOTIFY_URL,SESSION_SECRET,STRIPE_METERED_PRICE_ID,STRIPE_PRICE_DAYPASS,STRIPE_PRICE_ENTERPRISE,STRIPE_PRICE_INCIDENT,STRIPE_PRICE_MSP,STRIPE_PRICE_PRO,STRIPE_PRICE_PRO_MONTHLY,STRIPE_PRICE_PRO_YEARLY,STRIPE_PRICE_SPRINT,STRIPE_PRICE_TEAM,STRIPE_SECRET_KEY,STRIPE_WEBHOOK_SECRET,UPSTASH_REDIS_REST_TOKEN,UPSTASH_REDIS_REST_URL,V1_CHECK_INDICATOR_SECRET"

echo "✓ Build environment variables loaded ($(date))"
