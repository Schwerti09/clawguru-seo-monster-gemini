/* eslint-disable no-console */
/**
 * D4 geo_variant_matrix batch upsert.
 * Usage:
 *   node scripts/ops-d4-geo-matrix-upsert.js probe   # BEGIN + upsert + ROLLBACK
 *   node scripts/ops-d4-geo-matrix-upsert.js commit  # BEGIN + upsert + COMMIT
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
    ('warsaw','Warschau','Warsaw','Masowien','Masovia','PL','tech_hub'),
    ('krakow','Krakau','Krakow','Kleinpolen','Lesser Poland','PL','tech_hub'),
    ('wroclaw','Breslau','Wroclaw','Niederschlesien','Lower Silesia','PL','industry_kmu'),
    ('budapest','Budapest','Budapest','Budapest','Budapest','HU','tech_hub'),
    ('bucharest','Bukarest','Bucharest','Bukarest','Bucharest','RO','tech_hub'),
    ('sofia','Sofia','Sofia','Sofia','Sofia','BG','tech_hub'),
    ('athens','Athen','Athens','Attika','Attica','GR','tech_hub'),
    ('thessaloniki','Thessaloniki','Thessaloniki','Zentralmakedonien','Central Macedonia','GR','industry_kmu'),
    ('bratislava','Bratislava','Bratislava','Bratislava','Bratislava','SK','tech_hub'),
    ('zagreb','Zagreb','Zagreb','Zagreb','Zagreb','HR','tech_hub'),
    ('ljubljana','Ljubljana','Ljubljana','Ljubljana','Ljubljana','SI','tech_hub'),
    ('belgrade','Belgrad','Belgrade','Belgrad','Belgrade','RS','tech_hub')
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
  CASE WHEN l.locale = 'de'
    THEN 'OpenClaw Risiko 2026 in ' || c.city_name_de || ': Exposures priorisieren und direkt härten'
    ELSE 'OpenClaw Exposure in ' || c.city_name_en || ' 2026: prioritize edge risk and harden fast'
  END,
  CASE WHEN l.locale = 'de'
    THEN 'D4-CEE-Balkan-Welle: hohe Self-Hosting-Dichte + schnelle Deploy-Cadence → Edge-Exposure. Runbooks: OpenClaw Check, Moltbot Hardening, Gateway Auth, Docker Proxy, API-Key Leak Response. Kein Pentest.'
    ELSE 'D4 CEE/Balkan wave: high self-hosting density + fast deploy cadence → edge exposure. Runbooks: OpenClaw check, Moltbot hardening, gateway auth, Docker proxy, API key leak response. Not a pentest.'
  END,
  '[
    {"type":"runbook","slug":"openclaw-security-check","label":"OpenClaw Security Check"},
    {"type":"runbook","slug":"moltbot-hardening","label":"Moltbot Hardening"},
    {"type":"runbook","slug":"gateway-auth-10-steps","label":"Gateway Auth 10 Steps"},
    {"type":"runbook","slug":"docker-reverse-proxy-hardening-cheatsheet","label":"Docker Reverse Proxy Hardening"},
    {"type":"runbook","slug":"api-key-leak-response-playbook","label":"API Key Leak Response"},
    {"type":"signal","label":"d4-cee-' || c.city_type || '-2026"},
    {"type":"signal","label":"city-aware-compliance-' || c.country_code || '-2026"}
  ]'::jsonb,
  CASE WHEN c.city_type = 'tech_hub' THEN 87 ELSE 85 END,
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
    console.error("Usage: node scripts/ops-d4-geo-matrix-upsert.js <probe|commit>")
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
