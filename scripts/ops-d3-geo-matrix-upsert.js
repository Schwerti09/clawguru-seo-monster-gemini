/* eslint-disable no-console */
/**
 * D3 geo_variant_matrix batch upsert (AGENTS.md §32.3).
 * Usage:
 *   node scripts/ops-d3-geo-matrix-upsert.js probe   # BEGIN + upsert + ROLLBACK
 *   node scripts/ops-d3-geo-matrix-upsert.js commit  # BEGIN + upsert + COMMIT
 */
try {
  require("dotenv").config()
  require("dotenv").config({ path: ".env.local" })
} catch {
  /* optional */
}

const { Client } = require("pg")

const UPSERT_SQL = `
WITH cities(slug, city_name_de, city_name_en, region_de, region_en, country_code, city_type) AS (
  VALUES
    ('rome','Rom','Rome','Latium','Lazio','IT','tech_hub'),
    ('milan','Mailand','Milan','Lombardei','Lombardy','IT','finance_infra'),
    ('turin','Turin','Turin','Piemont','Piedmont','IT','industry_kmu'),
    ('naples','Neapel','Naples','Kampanien','Campania','IT','industry_kmu'),
    ('lisbon','Lissabon','Lisbon','Lissabon','Lisbon','PT','tech_hub'),
    ('porto','Porto','Porto','Norden','North','PT','industry_kmu'),
    ('valencia','Valencia','Valencia','Valencia','Valencian Community','ES','industry_kmu'),
    ('seville','Sevilla','Seville','Andalusien','Andalusia','ES','industry_kmu'),
    ('bilbao','Bilbao','Bilbao','Baskenland','Basque Country','ES','industry_kmu'),
    ('marseille','Marseille','Marseille','Provence-Alpes-Côte d''Azur','Provence-Alpes-Cote d''Azur','FR','tech_hub'),
    ('toulouse','Toulouse','Toulouse','Okzitanien','Occitanie','FR','tech_hub'),
    ('nice','Nizza','Nice','Provence-Alpes-Côte d''Azur','Provence-Alpes-Cote d''Azur','FR','industry_kmu')
),
locales(locale) AS (VALUES ('de'), ('en'))
INSERT INTO geo_variant_matrix (
  locale, base_slug, city_slug, variant_slug, city_name, region_name, country_code,
  local_title, local_summary, links_json, quality_score, model, updated_at
)
SELECT
  l.locale,
  CASE WHEN l.locale = 'de' THEN 'openclaw-risk-2026' ELSE 'openclaw-exposed' END,
  c.slug,
  CASE WHEN l.locale = 'de' THEN 'openclaw-risk-2026-' || c.slug ELSE 'openclaw-exposed-' || c.slug END,
  CASE WHEN l.locale = 'de' THEN c.city_name_de ELSE c.city_name_en END,
  CASE WHEN l.locale = 'de' THEN c.region_de ELSE c.region_en END,
  c.country_code,
  CASE WHEN l.locale = 'de' THEN 'OpenClaw Risiko 2026 in ' || c.city_name_de ELSE 'OpenClaw Exposure in ' || c.city_name_en || ' 2026' END,
  CASE WHEN l.locale = 'de'
    THEN 'Südeuropa-/Iberia-Welle: Self-Hosting, Integrations-Exposition und schnelle Deploy-Zyklen — Check, Gateway-Härtung und Runbook-Re-Check als Standardpfad.'
    ELSE 'Southern Europe / Iberia wave: self-hosting, integration exposure, fast deploy cadence — check, gateway hardening, and runbook re-check as default path.'
  END,
  jsonb_build_array(
    jsonb_build_object('type','runbook','slug','openclaw-security-check'),
    jsonb_build_object('type','runbook','slug','moltbot-hardening'),
    jsonb_build_object('type','runbook','slug','gateway-auth-10-steps'),
    jsonb_build_object('type','runbook','slug','docker-reverse-proxy-hardening-cheatsheet'),
    jsonb_build_object('type','runbook','slug','api-key-leak-response-playbook'),
    jsonb_build_object('type','signal','label', 'd3-southern-eu-' || c.city_type || '-2026')
  ),
  CASE WHEN c.city_type = 'tech_hub' THEN 87 WHEN c.city_type = 'finance_infra' THEN 86 ELSE 85 END,
  'gemini',
  NOW()
FROM cities c CROSS JOIN locales l
ON CONFLICT (locale, variant_slug) DO UPDATE
SET local_title = EXCLUDED.local_title,
    local_summary = EXCLUDED.local_summary,
    links_json = EXCLUDED.links_json,
    quality_score = EXCLUDED.quality_score,
    model = EXCLUDED.model,
    updated_at = NOW();
`

async function main() {
  const mode = process.argv[2]
  if (!["probe", "commit"].includes(mode)) {
    console.error("Usage: node scripts/ops-d3-geo-matrix-upsert.js <probe|commit>")
    process.exit(1)
  }
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL missing (set in .env or .env.local)")
    process.exit(1)
  }
  const c = new Client({ connectionString: process.env.DATABASE_URL })
  await c.connect()
  try {
    await c.query("BEGIN")
    const r = await c.query(UPSERT_SQL)
    if (mode === "commit") {
      await c.query("COMMIT")
      console.log("COMMIT OK, rows affected:", r.rowCount)
    } else {
      await c.query("ROLLBACK")
      console.log("ROLLBACK probe OK — no data persisted. rows:", r.rowCount)
    }
  } catch (e) {
    await c.query("ROLLBACK").catch(() => {})
    throw e
  } finally {
    await c.end()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
