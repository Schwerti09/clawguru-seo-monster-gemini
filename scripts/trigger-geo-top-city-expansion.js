try {
  require("dotenv").config()
  require("dotenv").config({ path: ".env.local" })
  const extra = (process.env.GEO_CLI_EXTRA_DOTENV || "").trim()
  if (extra) require("dotenv").config({ path: extra })
} catch {}

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
  const mode = (getArg("mode", "dry-run") || "dry-run").toLowerCase()
  const dryRun = mode !== "live"
  const secret =
    process.env.GEO_EXPANSION_SECRET ||
    process.env.GEO_AUTO_PRUNE_SECRET ||
    process.env.GEO_REVALIDATE_SECRET ||
    ""
  if (!secret) {
    console.error("missing GEO_EXPANSION_SECRET (or GEO_AUTO_PRUNE_SECRET / GEO_REVALIDATE_SECRET)")
    process.exit(1)
  }

  const locale = getArg("locale", "de")
  const slug = getArg("slug", "aws-ssh-hardening-2026")
  const limit = getArg("limit", process.env.GEO_MATRIX_SITEMAP_CITY_LIMIT || "24")
  const minHealth = getArg("minHealth", process.env.GEO_EXPANSION_MIN_HEALTH || "88")
  const maxActivate = getArg("maxActivate", process.env.GEO_EXPANSION_MAX_ACTIVATE || "3")
  const minPriority = getArg("minPriority", process.env.GEO_EXPANSION_MIN_PRIORITY || "60")
  const minPopulation = getArg("minPopulation", process.env.GEO_EXPANSION_MIN_POPULATION || "500000")

  const url =
    `${base}/api/geo/top-city-expansion` +
    `?dryRun=${dryRun ? "1" : "0"}` +
    `&locale=${encodeURIComponent(locale)}` +
    `&slug=${encodeURIComponent(slug)}` +
    `&limit=${encodeURIComponent(limit)}` +
    `&minHealth=${encodeURIComponent(minHealth)}` +
    `&maxActivate=${encodeURIComponent(maxActivate)}` +
    `&minPriority=${encodeURIComponent(minPriority)}` +
    `&minPopulation=${encodeURIComponent(minPopulation)}`

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "user-agent": "clawguru-geo-top-city-expansion/1.0",
    },
  })
  const json = await res.json().catch(() => null)
  if (!res.ok || !json) {
    console.error("top-city-expansion request failed", { status: res.status, url })
    process.exit(1)
  }

  console.log(`top-city-expansion mode=${dryRun ? "dry-run" : "live"} healthScore=${json.healthScore}`)
  console.log(`activated=${(json.activated || []).join(",") || "-"}`)
  const preview = Array.isArray(json.wouldActivate) ? json.wouldActivate.map((x) => x.slug).join(",") : "-"
  console.log(`wouldActivate=${preview || "-"}`)
}

main().catch((err) => {
  console.error("geo top-city-expansion trigger failed:", err)
  process.exit(1)
})
