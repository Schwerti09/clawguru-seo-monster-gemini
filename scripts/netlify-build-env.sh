#!/bin/bash
# ============================================================================
# Netlify Build Environment Variables
# ============================================================================
# Diese Variablen werden NUR während des Build-Prozesses benötigt und werden
# NICHT in Serverless Functions injiziert. Das hält die Function env vars
# unter dem 4KB Limit.
#
# WICHTIG: Netlify injiziert ALLE Variablen aus [build.environment] in Functions.
# Deshalb sind die Build-only Variablen hier ausgelagert.
# ============================================================================

# Sitemap Generation Settings
export SITEMAP_BUCKETS="5"
export SITEMAP_ALLOW_CHUNK="1"
export SITEMAP_QUALITY_STRICT="1"
export SITEMAP_RUNBOOKS_PER_BUCKET="2000"
export SITEMAP_INCLUDE_SYNTHETIC_100K="0"
export SITEMAP_100K_LOCALES="de,en"
export SITEMAP_100K_PAGES="42"

# Geo Matrix Settings (Static Generation)
export GEO_MATRIX_SITEMAP="1"
export GEO_MATRIX_ENABLED="1"
export GEO_MATRIX_AUTO_REWRITE="1"
export GEO_MATRIX_MIN_QUALITY="72"
export GEO_MATRIX_SITEMAP_CITY_LIMIT="50"
export GEO_MATRIX_SITEMAP_CITY_POOL="72"
export GEO_MATRIX_SITEMAP_SEED_LIMIT="8"
export GEO_INDEX_HEALTH_BASE="https://clawguru.org"
export GEO_INDEX_HEALTH_CITY_LIMIT="12"

# PSEO Settings
export PSEO_RUNBOOK_COUNT="50000"
export PSEO_ALLOW_SYNTHETIC_100K="0"

# Build Optimization Flags (not needed at runtime)
export NEXT_PUBLIC_ADMIN_UI="1"
export NEXT_DISABLE_ESLINT="1"
export NEXT_DISABLE_TYPE_CHECK="1"

# Quality Thresholds
export MIN_AVG_QUALITY="86"
export MIN_VARIANTS="3"
export MAX_PROMOTIONS="10"

# Observability (disabled for build)
export OBS_ENABLED="0"
export OBS_SAMPLE_RATE="0.1"

echo "✓ Build environment variables loaded ($(date))"
