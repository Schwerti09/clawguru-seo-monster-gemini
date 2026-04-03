#!/usr/bin/env node
/* eslint-disable no-console */
try {
  require("dotenv").config()
  require("dotenv").config({ path: ".env.local" })
} catch {}

const { Client } = require("pg")

const DEFAULT_LOCALES = ["de", "en"]

const BATCHES = {
  D1: [
    "berlin",
    "munich",
    "hamburg",
    "frankfurt",
    "cologne",
    "vienna",
    "zurich",
    "amsterdam",
    "brussels",
    "paris",
    "lyon",
    "madrid",
    "barcelona",
  ],
}

const CITY_META = {
  berlin: { name_de: "Berlin", name_en: "Berlin", country_code: "DE", priority: 100, population: 3769000 },
  munich: { name_de: "Muenchen", name_en: "Munich", country_code: "DE", priority: 95, population: 1565000 },
  hamburg: { name_de: "Hamburg", name_en: "Hamburg", country_code: "DE", priority: 93, population: 1910000 },
  frankfurt: { name_de: "Frankfurt am Main", name_en: "Frankfurt", country_code: "DE", priority: 92, population: 776000 },
  cologne: { name_de: "Koeln", name_en: "Cologne", country_code: "DE", priority: 88, population: 1087000 },
  vienna: { name_de: "Wien", name_en: "Vienna", country_code: "AT", priority: 90, population: 2000000 },
  zurich: { name_de: "Zuerich", name_en: "Zurich", country_code: "CH", priority: 87, population: 443000 },
  amsterdam: { name_de: "Amsterdam", name_en: "Amsterdam", country_code: "NL", priority: 79, population: 918000 },
  brussels: { name_de: "Bruessel", name_en: "Brussels", country_code: "BE", priority: 77, population: 186000 },
  paris: { name_de: "Paris", name_en: "Paris", country_code: "FR", priority: 94, population: 2161000 },
  lyon: { name_de: "Lyon", name_en: "Lyon", country_code: "FR", priority: 74, population: 522000 },
  madrid: { name_de: "Madrid", name_en: "Madrid", country_code: "ES", priority: 83, population: 3223000 },
  barcelona: { name_de: "Barcelona", name_en: "Barcelona", country_code: "ES", priority: 81, population: 1620000 },
}

function parseArgs(argv) {
  const args = {}
  for (const item of argv.slice(2)) {
    if (!item.startsWith("--")) continue
    const [k, v] = item.slice(2).split("=")
    args[k] = v === undefined ? true : v
  }
  return args
}

async function main() {
  const args = parseArgs(process.argv)
  const waveId = String(args["wave-id"] || "wave-adhoc")
  const batch = String(args.batch || "D1")
  const qualityFloor = Number(args["quality-floor"] || 85)
  const mode = String(args.mode || "dry-run")
  const locales = String(args.locales || DEFAULT_LOCALES.join(","))
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean)

  const cities =
    args.cities && typeof args.cities === "string" && args.cities.length > 0
      ? args.cities.split(",").map((v) => v.trim()).filter(Boolean)
      : BATCHES[batch] || []

  if (!cities.length) {
    throw new Error(`No cities resolved for batch=${batch}`)
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()

  try {
    if (mode === "commit") {
      await client.query("BEGIN")
    }

    const qualityRes = await client.query(
      `
      SELECT
        city_slug,
        ROUND(AVG(quality_score))::int AS avg_quality
      FROM geo_variant_matrix
      WHERE city_slug = ANY($1::text[])
        AND locale = ANY($2::text[])
      GROUP BY city_slug
      ORDER BY avg_quality DESC, city_slug
      `,
      [cities, locales]
    )

    const qualityByCity = new Map(qualityRes.rows.map((row) => [row.city_slug, Number(row.avg_quality)]))
    const eligible = cities.filter((city) => (qualityByCity.get(city) || 0) >= qualityFloor)
    const belowFloor = cities.filter((city) => !eligible.includes(city))

    let insertedMissing = []
    let seeded = []
    let skippedStable = []

    if (mode === "commit" && eligible.length > 0) {
      // Ensure missing city records exist.
      for (const slug of eligible) {
        const meta = CITY_META[slug]
        if (!meta) continue
        await client.query(
          `
          INSERT INTO geo_cities (slug, name_de, name_en, country_code, priority, population, is_active, rollout_stage)
          VALUES ($1, $2, $3, $4, $5, $6, TRUE, 'canary')
          ON CONFLICT (slug) DO NOTHING
          `,
          [slug, meta.name_de, meta.name_en, meta.country_code, meta.priority, meta.population]
        )
      }

      const existingRes = await client.query(
        `
        SELECT slug, rollout_stage
        FROM geo_cities
        WHERE slug = ANY($1::text[])
        `,
        [eligible]
      )
      const stageByCity = new Map(existingRes.rows.map((row) => [row.slug, row.rollout_stage]))

      insertedMissing = eligible.filter((slug) => !stageByCity.has(slug))
      skippedStable = eligible.filter((slug) => stageByCity.get(slug) === "stable")
      const toCanary = eligible.filter((slug) => stageByCity.get(slug) !== "stable")

      if (toCanary.length > 0) {
        const seedRes = await client.query(
          `
          UPDATE geo_cities
          SET is_active = TRUE, rollout_stage = 'canary', updated_at = NOW()
          WHERE slug = ANY($1::text[])
          RETURNING slug
          `,
          [toCanary]
        )
        seeded = seedRes.rows.map((row) => row.slug)
      }
    }

    if (mode === "commit") {
      await client.query("COMMIT")
    }

    console.log({
      waveId,
      batch,
      mode,
      qualityFloor,
      requested: cities,
      locales,
      quality: qualityRes.rows,
      eligible_count: eligible.length,
      below_floor_count: belowFloor.length,
      recommended_seed_count: eligible.length,
      cities_needing_manual_enrichment: belowFloor,
      insertedMissing,
      skippedStable,
      seeded,
    })
  } catch (error) {
    if (mode === "commit") {
      await client.query("ROLLBACK")
    }
    throw error
  } finally {
    await client.end()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
