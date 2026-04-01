const DEFAULT_BASE = "https://clawguru.org"

function getArg(name, fallback = "") {
  const arg = process.argv.find((x) => x.startsWith(`--${name}=`))
  if (!arg) return fallback
  return arg.split("=").slice(1).join("=")
}

function getBase() {
  const raw = getArg("base", process.env.GEO_INDEX_HEALTH_BASE || DEFAULT_BASE)
  return raw.replace(/\/$/, "")
}

async function main() {
  const base = getBase()
  const locale = getArg("locale", "de")
  const slug = getArg("slug", "aws-ssh-hardening-2026")
  const limit = getArg("limit", process.env.GEO_MATRIX_SITEMAP_CITY_LIMIT || "24")
  const url = `${base}/api/geo/city-ranking?locale=${encodeURIComponent(locale)}&slug=${encodeURIComponent(slug)}&limit=${encodeURIComponent(limit)}`

  const res = await fetch(url, { headers: { "user-agent": "clawguru-geo-city-ranking/1.0" } })
  const json = await res.json().catch(() => null)
  if (!json || !Array.isArray(json.cities)) {
    console.error("invalid response from", url)
    process.exit(1)
  }

  console.log(`geo-city-ranking healthScore=${json.healthScore} healthy=${json.healthyCities}/${json.totalCities}`)
  for (const city of json.cities.slice(0, 10)) {
    console.log(` - ${city.slug} score=${city.rankingScore} status=${city.status} priority=${city.priority}`)
  }
}

main().catch((err) => {
  console.error("geo city ranking check failed:", err)
  process.exit(1)
})

