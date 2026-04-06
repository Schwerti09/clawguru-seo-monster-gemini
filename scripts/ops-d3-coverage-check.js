/* eslint-disable no-console */
try {
  require("dotenv").config()
  require("dotenv").config({ path: ".env.local" })
} catch {
  /* optional */
}

const { Client } = require("pg")

const SLUGS = [
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
]

async function main() {
  const c = new Client({ connectionString: process.env.DATABASE_URL })
  await c.connect()
  const q = `SELECT city_slug, locale, COUNT(*)::int AS variants, ROUND(AVG(quality_score))::int AS avg_quality
    FROM geo_variant_matrix
    WHERE city_slug = ANY($1::text[]) AND locale IN ('de','en')
    GROUP BY city_slug, locale
    ORDER BY city_slug, locale`
  const r = await c.query(q, [SLUGS])
  console.table(r.rows)
  await c.end()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
