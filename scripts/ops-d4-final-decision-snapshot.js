/* eslint-disable no-console */
try {
  require("dotenv").config()
  require("dotenv").config({ path: ".env.local" })
} catch {
  /* optional */
}

const { Client } = require("pg")

const BASE_URL = (process.env.GEO_INDEX_HEALTH_BASE || process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org").replace(/\/$/, "")
const D4_SLUGS = [
  "warsaw",
  "krakow",
  "wroclaw",
  "budapest",
  "bucharest",
  "sofia",
  "athens",
  "thessaloniki",
  "bratislava",
  "zagreb",
  "ljubljana",
  "belgrade",
]

async function getRollout(c) {
  const q = `
    SELECT
      COUNT(*) FILTER (WHERE is_active AND rollout_stage = 'stable')::int AS active_stable,
      COUNT(*) FILTER (WHERE is_active AND rollout_stage = 'canary')::int AS active_canary
    FROM geo_cities
  `
  const r = await c.query(q)
  return {
    activeStable: Number(r.rows[0]?.active_stable || 0),
    activeCanary: Number(r.rows[0]?.active_canary || 0),
  }
}

async function getFunnel(c) {
  const q = `
    SELECT
      COUNT(*) FILTER (WHERE event = 'check_page_view')::int AS page_views,
      COUNT(*) FILTER (WHERE event = 'check_start')::int AS check_starts,
      COUNT(*) FILTER (WHERE event = 'check_result')::int AS check_results,
      COUNT(*) FILTER (WHERE event = 'hardening_link_click')::int AS runbook_clicks
    FROM check_funnel_events
    WHERE created_at >= NOW() - INTERVAL '24 hours'
  `
  const r = await c.query(q)
  return {
    sessionsTotalProxy: Number(r.rows[0]?.page_views || 0),
    checkStart: Number(r.rows[0]?.check_starts || 0),
    checkResults: Number(r.rows[0]?.check_results || 0),
    runbookClicks: Number(r.rows[0]?.runbook_clicks || 0),
    // We do not have a reliable bounce metric in this table.
    bouncePercent: null,
  }
}

async function getGeoSegmentProxy(c) {
  const q = `
    SELECT COUNT(*)::int AS geo_segment_hits
    FROM check_funnel_events
    WHERE created_at >= NOW() - INTERVAL '24 hours'
      AND (
        (meta_json->>'path') LIKE '%openclaw-risk-2026-%'
        OR (meta_json->>'path') LIKE '%openclaw-exposed-%'
      )
  `
  const r = await c.query(q)
  return Number(r.rows[0]?.geo_segment_hits || 0)
}

async function getMatrixChecks(c) {
  const q = `
    SELECT
      city_slug,
      locale,
      ROUND(AVG(quality_score))::int AS avg_quality,
      BOOL_OR(local_summary ILIKE '%kein pentest%') AS has_de_trust,
      BOOL_OR(local_summary ILIKE '%not a pentest%') AS has_en_trust,
      BOOL_OR(links_json::text ILIKE '%city-aware-compliance-%') AS has_city_aware
    FROM geo_variant_matrix
    WHERE city_slug = ANY($1::text[])
      AND locale IN ('de','en')
    GROUP BY city_slug, locale
    ORDER BY city_slug, locale
  `
  const r = await c.query(q, [D4_SLUGS])
  const rows = r.rows
  const allRowsPresent = rows.length === D4_SLUGS.length * 2
  const qualityOk = allRowsPresent && rows.every((x) => Number(x.avg_quality || 0) >= 85)
  const trustOk = allRowsPresent && rows.every((x) => (x.locale === "de" ? x.has_de_trust : x.has_en_trust))
  const cityAwareOk = allRowsPresent && rows.every((x) => x.has_city_aware)
  return {
    rows,
    allRowsPresent,
    qualityOk,
    trustOk,
    cityAwareOk,
  }
}

async function getUrlHealthSample() {
  const sampleCities = ["warsaw", "budapest", "sofia", "belgrade"]
  const checks = []
  for (const locale of ["de", "en"]) {
    const baseSlug = locale === "de" ? "openclaw-risk-2026" : "openclaw-exposed"
    for (const city of sampleCities) {
      const url = `${BASE_URL}/${locale}/runbook/${baseSlug}-${city}`
      const expectedPath = `/${locale}/${city}/${baseSlug}`
      try {
        const first = await fetch(url, {
          method: "GET",
          redirect: "manual",
          headers: { "user-agent": "clawguru-d4-final-snapshot/1.0" },
        })
        const location = first.headers.get("location") || ""
        const redirectTarget = location ? new URL(location, BASE_URL) : null
        const redirectOk = (first.status === 301 || first.status === 308) && redirectTarget?.pathname === expectedPath
        let finalStatus = 0
        let finalOk = false
        if (redirectTarget) {
          const second = await fetch(redirectTarget.toString(), {
            method: "GET",
            redirect: "manual",
            headers: { "user-agent": "clawguru-d4-final-snapshot/1.0" },
          })
          finalStatus = second.status
          finalOk = second.status === 200
        }
        checks.push({
          locale,
          city,
          legacyStatus: first.status,
          location,
          redirectOk,
          finalStatus,
          finalOk,
          ok: redirectOk && finalOk,
        })
      } catch (e) {
        checks.push({ locale, city, legacyStatus: 0, redirectOk: false, finalStatus: 0, finalOk: false, ok: false, error: String(e?.message || e) })
      }
    }
  }
  return {
    checks,
    legacyRedirectOk: checks.every((x) => x.redirectOk),
    all200: checks.every((x) => x.finalOk),
  }
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL missing")
  }
  const c = new Client({ connectionString: process.env.DATABASE_URL })
  await c.connect()
  try {
    const rollout = await getRollout(c)
    const funnel = await getFunnel(c)
    const geoSegmentProxy = await getGeoSegmentProxy(c)
    const matrix = await getMatrixChecks(c)
    const urlHealth = await getUrlHealthSample()
    const payload = {
      generatedAt: new Date().toISOString(),
      rollout,
      traffic24h: {
        sessionsTotalProxy: funnel.sessionsTotalProxy,
        geoSegmentProxy,
        bouncePercent: funnel.bouncePercent,
        checkStart: funnel.checkStart,
        runbookClicks: funnel.runbookClicks,
      },
      checks: {
        matrixQuality85: matrix.qualityOk,
        legacyRedirectToCanonical: urlHealth.legacyRedirectOk,
        runbookUrls200Sample: urlHealth.all200,
        trustAnchorFraming: matrix.trustOk,
        cityAwareComplianceSignals: matrix.cityAwareOk,
      },
      details: {
        matrixRows: matrix.rows,
        urlHealthChecks: urlHealth.checks,
      },
    }
    console.log(JSON.stringify(payload, null, 2))
  } finally {
    await c.end()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
