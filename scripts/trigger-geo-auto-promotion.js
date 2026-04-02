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
    process.env.GEO_AUTO_PROMOTION_SECRET ||
    process.env.GEO_CANARY_ROLLOUT_SECRET ||
    process.env.GEO_EXPANSION_SECRET ||
    process.env.GEO_REVALIDATE_SECRET ||
    ""
  if (!secret) {
    console.error("missing GEO_AUTO_PROMOTION_SECRET (or fallback geo secrets)")
    process.exit(1)
  }

  const locale = getArg("locale", "de")
  const lookbackDays = getArg("lookbackDays", process.env.GEO_AUTO_PROMOTE_LOOKBACK_DAYS || "7")
  const minAvgQuality = getArg("minAvgQuality", process.env.GEO_AUTO_PROMOTE_MIN_AVG_QUALITY || "84")
  const minVariants = getArg("minVariants", process.env.GEO_AUTO_PROMOTE_MIN_VARIANTS || "3")
  const maxPromotions = getArg("maxPromotions", process.env.GEO_AUTO_PROMOTE_MAX_PROMOTIONS || "10")

  const url =
    `${base}/api/geo/auto-promotion` +
    `?dryRun=${dryRun ? "1" : "0"}` +
    `&locale=${encodeURIComponent(locale)}` +
    `&lookbackDays=${encodeURIComponent(lookbackDays)}` +
    `&minAvgQuality=${encodeURIComponent(minAvgQuality)}` +
    `&minVariants=${encodeURIComponent(minVariants)}` +
    `&maxPromotions=${encodeURIComponent(maxPromotions)}`

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "user-agent": "clawguru-geo-auto-promotion/1.0",
    },
  })
  const json = await res.json().catch(() => null)
  if (!res.ok || !json) {
    console.error("auto-promotion request failed", { status: res.status, url })
    process.exit(1)
  }

  console.log(`geo-auto-promotion mode=${dryRun ? "dry-run" : "live"} locale=${json.locale}`)
  console.log(
    `thresholds lookbackDays=${json.lookbackDays} minAvgQuality=${json.minAvgQuality} minVariants=${json.minVariants} maxPromotions=${json.maxPromotions}`
  )
  console.log(`candidates=${(json.candidates || []).map((x) => x.citySlug).join(",") || "-"}`)
  console.log(`promoted=${(json.promoted || []).join(",") || "-"}`)
}

main().catch((err) => {
  console.error("geo auto promotion trigger failed:", err)
  process.exit(1)
})

