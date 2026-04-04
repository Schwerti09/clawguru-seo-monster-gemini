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
  D2: [
    "london",
    "manchester",
    "birmingham",
    "dublin",
    "edinburgh",
    "copenhagen",
    "stockholm",
    "oslo",
    "helsinki",
    "gothenburg",
    "malmo",
    "aarhus",
    "reykjavik",
  ],
  /** Southern EU / Iberia / FR hubs — align with AGENTS.md §29.6 / §30 */
  D3: [
    "rome",
    "milan",
    "turin",
    "naples",
    "lisbon",
    "porto",
    "valencia",
    "seville",
    "bilbao",
    "marseille",
    "toulouse",
    "nice",
  ],
  /** CEE + Balkan capitals — align with AGENTS.md §30 */
  D4: [
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
  london: { name_de: "London", name_en: "London", country_code: "GB", priority: 96, population: 8980000 },
  manchester: { name_de: "Manchester", name_en: "Manchester", country_code: "GB", priority: 78, population: 553000 },
  birmingham: { name_de: "Birmingham", name_en: "Birmingham", country_code: "GB", priority: 76, population: 1150000 },
  dublin: { name_de: "Dublin", name_en: "Dublin", country_code: "IE", priority: 78, population: 592000 },
  edinburgh: { name_de: "Edinburgh", name_en: "Edinburgh", country_code: "GB", priority: 74, population: 548000 },
  copenhagen: { name_de: "Kopenhagen", name_en: "Copenhagen", country_code: "DK", priority: 77, population: 660000 },
  stockholm: { name_de: "Stockholm", name_en: "Stockholm", country_code: "SE", priority: 79, population: 975000 },
  oslo: { name_de: "Oslo", name_en: "Oslo", country_code: "NO", priority: 73, population: 709000 },
  helsinki: { name_de: "Helsinki", name_en: "Helsinki", country_code: "FI", priority: 72, population: 664000 },
  gothenburg: { name_de: "Goeteborg", name_en: "Gothenburg", country_code: "SE", priority: 68, population: 590000 },
  malmo: { name_de: "Malmoe", name_en: "Malmo", country_code: "SE", priority: 66, population: 362000 },
  aarhus: { name_de: "Aarhus", name_en: "Aarhus", country_code: "DK", priority: 64, population: 290000 },
  reykjavik: { name_de: "Reykjavik", name_en: "Reykjavik", country_code: "IS", priority: 62, population: 140000 },
  rome: { name_de: "Rom", name_en: "Rome", country_code: "IT", priority: 88, population: 2873000 },
  milan: { name_de: "Mailand", name_en: "Milan", country_code: "IT", priority: 86, population: 1400000 },
  turin: { name_de: "Turin", name_en: "Turin", country_code: "IT", priority: 78, population: 848000 },
  naples: { name_de: "Neapel", name_en: "Naples", country_code: "IT", priority: 80, population: 2180000 },
  lisbon: { name_de: "Lissabon", name_en: "Lisbon", country_code: "PT", priority: 79, population: 545000 },
  porto: { name_de: "Porto", name_en: "Porto", country_code: "PT", priority: 72, population: 237000 },
  valencia: { name_de: "Valencia", name_en: "Valencia", country_code: "ES", priority: 76, population: 792000 },
  seville: { name_de: "Sevilla", name_en: "Seville", country_code: "ES", priority: 74, population: 688000 },
  bilbao: { name_de: "Bilbao", name_en: "Bilbao", country_code: "ES", priority: 70, population: 346000 },
  marseille: { name_de: "Marseille", name_en: "Marseille", country_code: "FR", priority: 82, population: 870000 },
  toulouse: { name_de: "Toulouse", name_en: "Toulouse", country_code: "FR", priority: 75, population: 493000 },
  nice: { name_de: "Nizza", name_en: "Nice", country_code: "FR", priority: 73, population: 348000 },
  warsaw: { name_de: "Warschau", name_en: "Warsaw", country_code: "PL", priority: 84, population: 1790000 },
  krakow: { name_de: "Krakau", name_en: "Krakow", country_code: "PL", priority: 76, population: 780000 },
  wroclaw: { name_de: "Breslau", name_en: "Wroclaw", country_code: "PL", priority: 72, population: 641000 },
  budapest: { name_de: "Budapest", name_en: "Budapest", country_code: "HU", priority: 80, population: 1756000 },
  bucharest: { name_de: "Bukarest", name_en: "Bucharest", country_code: "RO", priority: 78, population: 1883000 },
  sofia: { name_de: "Sofia", name_en: "Sofia", country_code: "BG", priority: 74, population: 1284000 },
  athens: { name_de: "Athen", name_en: "Athens", country_code: "GR", priority: 81, population: 3154000 },
  thessaloniki: { name_de: "Thessaloniki", name_en: "Thessaloniki", country_code: "GR", priority: 70, population: 824000 },
  bratislava: { name_de: "Pressburg", name_en: "Bratislava", country_code: "SK", priority: 71, population: 432000 },
  zagreb: { name_de: "Zagreb", name_en: "Zagreb", country_code: "HR", priority: 73, population: 806000 },
  ljubljana: { name_de: "Laibach", name_en: "Ljubljana", country_code: "SI", priority: 68, population: 284000 },
  belgrade: { name_de: "Belgrad", name_en: "Belgrade", country_code: "RS", priority: 75, population: 1370000 },
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
