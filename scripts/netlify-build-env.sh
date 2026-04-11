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
#   - SECRETS_SCAN_OMIT_KEYS   (from netlify.toml, ~1.1 KB — required for scanner)
#   - Dashboard secrets  (~2–3 KB depending on how many integrations are active)
# Total ≈ 3–4 KB.  If Functions hit the 4 KB limit, move SECRETS_SCAN_OMIT_KEYS
# to the Netlify Dashboard (scope: "Builds", not "Functions").
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

# ── Secrets scanner ──────────────────────────────────────────────────────────
# SECRETS_SCAN_OMIT_KEYS is now in [build.environment] inside netlify.toml
# because the scanner runs as a post-build step and does NOT see variables
# exported only during the build command's shell session.
# Do NOT move it back here — the scanner will miss it and fail the build.

echo "✓ Build environment variables loaded ($(date))"
