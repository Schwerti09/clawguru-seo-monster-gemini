#!/usr/bin/env bash
# ─── Cloudflare Workers build script ─────────────────────────────────────────
# Memory: CF build machines have ~4 GB RAM — use 3584 MB (leave 512 MB headroom).
# Run via wrangler.toml [build] command or manually:
#   bash scripts/cloudflare-build.sh
# ─────────────────────────────────────────────────────────────────────────────
set -e

export NODE_OPTIONS="--max-old-space-size=3584"
export NEXT_TELEMETRY_DISABLED=1
export NEXT_DISABLE_TYPE_CHECK=1
export NEXT_DISABLE_ESLINT=1

# Build-time SEO / sitemap guardrails (same as netlify-build-env.sh)
export SITEMAP_QUALITY_STRICT=1
export SITEMAP_INCLUDE_SYNTHETIC_100K=0
export SITEMAP_100K_LOCALES="de,en"
export SITEMAP_BUCKETS=5
export GEO_MATRIX_SITEMAP=1
export GEO_MATRIX_SITEMAP_CITY_LIMIT=50

echo "▶ Building runbooks data…"
node scripts/generate-runbooks-json.js

echo "▶ Running Next.js build…"
npx next build

echo "▶ Running @opennextjs/cloudflare adapter…"
npx opennextjs-cloudflare build

echo "✅ Cloudflare build complete — output in .worker-next/"
