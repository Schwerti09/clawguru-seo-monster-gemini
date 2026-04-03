try {
  require("dotenv").config()
  require("dotenv").config({ path: ".env.local" })
  const extra = (process.env.GEO_CLI_EXTRA_DOTENV || "").trim()
  if (extra) require("dotenv").config({ path: extra })
} catch {}

const REQUIRED_KEYS = [
  "GEO_AUTO_PROMOTION_SECRET",
  "GEO_REVALIDATE_SECRET",
  "GEO_REVALIDATE_SLUGS",
]

const OPTIONAL_KEYS = [
  "GEO_AUTO_PROMOTE_LOOKBACK_DAYS",
  "GEO_AUTO_PROMOTE_MIN_AVG_QUALITY",
  "GEO_AUTO_PROMOTE_MIN_VARIANTS",
  "GEO_AUTO_PROMOTE_MAX_PROMOTIONS",
  "GEO_CANARY_ROLLOUT_SECRET",
  "GEO_SITEMAP_GUARDRAIL_SECRET",
]

function isSet(key) {
  return Boolean((process.env[key] || "").trim())
}

function printGroup(title, keys) {
  console.log(`\n${title}`)
  for (const key of keys) {
    console.log(`${isSet(key) ? "✅" : "❌"} ${key}`)
  }
}

function main() {
  printGroup("Required", REQUIRED_KEYS)
  printGroup("Optional", OPTIONAL_KEYS)

  const missingRequired = REQUIRED_KEYS.filter((k) => !isSet(k))
  if (missingRequired.length > 0) {
    console.log("\nGeo Ops readiness: NOT READY")
    console.log(`Missing required keys: ${missingRequired.join(", ")}`)
    process.exit(1)
  }

  console.log("\nGeo Ops readiness: READY")
  process.exit(0)
}

main()

