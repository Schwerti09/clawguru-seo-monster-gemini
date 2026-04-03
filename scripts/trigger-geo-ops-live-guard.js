try {
  require("dotenv").config()
  require("dotenv").config({ path: ".env.local" })
  const extra = (process.env.GEO_CLI_EXTRA_DOTENV || "").trim()
  if (extra) require("dotenv").config({ path: extra })
} catch {}

const DEFAULT_BASE = "https://clawguru.org"
const { spawnSync } = require("node:child_process")

function getArg(name, fallback = "") {
  const arg = process.argv.find((x) => x.startsWith(`--${name}=`))
  if (!arg) return fallback
  return arg.split("=").slice(1).join("=")
}

function getBase() {
  const raw = getArg("base", process.env.GEO_INDEX_HEALTH_BASE || DEFAULT_BASE)
  return raw.replace(/\/$/, "")
}

function isSet(key) {
  return Boolean((process.env[key] || "").trim())
}

function resolveEndpointSecrets() {
  return {
    guardrail:
      process.env.GEO_SITEMAP_GUARDRAIL_SECRET ||
      process.env.GEO_EXPANSION_SECRET ||
      process.env.GEO_AUTO_PRUNE_SECRET ||
      process.env.GEO_REVALIDATE_SECRET ||
      "",
    canary:
      process.env.GEO_CANARY_ROLLOUT_SECRET ||
      process.env.GEO_EXPANSION_SECRET ||
      process.env.GEO_AUTO_PRUNE_SECRET ||
      process.env.GEO_REVALIDATE_SECRET ||
      "",
    autoPromotion:
      process.env.GEO_AUTO_PROMOTION_SECRET ||
      process.env.GEO_CANARY_ROLLOUT_SECRET ||
      process.env.GEO_EXPANSION_SECRET ||
      process.env.GEO_REVALIDATE_SECRET ||
      "",
    revalidate: process.env.GEO_REVALIDATE_SECRET || "",
  }
}

async function call(base, path, secret) {
  const url = `${base}${path}`
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "user-agent": "clawguru-geo-ops-live-guard/1.0",
    },
  })
  const json = await res.json().catch(() => null)
  if (!res.ok || !json) {
    throw new Error(`request failed ${res.status} ${url}`)
  }
  return json
}

async function main() {
  const base = getBase()
  const locale = (getArg("locale", "de") || "de").toLowerCase()
  const slug = getArg("slug", process.env.GEO_SITEMAP_GUARDRAIL_SLUG || "aws-ssh-hardening-2026")
  const maxCandidates = parseInt(getArg("maxCandidates", process.env.GEO_LIVE_GUARD_MAX_CANDIDATES || "20"), 10) || 20
  const maxHealthDrop = parseInt(getArg("maxHealthDrop", process.env.GEO_LIVE_GUARD_MAX_HEALTH_DROP || "10"), 10) || 10

  const secrets = resolveEndpointSecrets()

  const required = ["GEO_AUTO_PROMOTION_SECRET", "GEO_REVALIDATE_SECRET", "GEO_REVALIDATE_SLUGS"]
  const missing = required.filter((k) => !isSet(k))
  if (missing.length > 0) {
    console.error(`live-guard blocked: missing required keys: ${missing.join(", ")}`)
    process.exit(1)
  }
  if (!secrets.guardrail || !secrets.canary || !secrets.autoPromotion || !secrets.revalidate) {
    console.error("live-guard blocked: missing endpoint-specific secrets")
    process.exit(1)
  }

  console.log(`live-guard start locale=${locale} slug=${slug}`)

  const guardrail = await call(base, `/api/geo/sitemap-guardrail?dryRun=1`, secrets.guardrail)
  const canary = await call(
    base,
    `/api/geo/canary-rollout?dryRun=1&locale=${encodeURIComponent(locale)}&slug=${encodeURIComponent(slug)}`,
    secrets.canary
  )
  const autoPromotion = await call(
    base,
    `/api/geo/auto-promotion?dryRun=1&locale=${encodeURIComponent(locale)}`,
    secrets.autoPromotion
  )

  const healthScore = Number(guardrail.healthScore ?? 100)
  const minScore = Number((guardrail.minScore ?? process.env.GEO_SITEMAP_GUARDRAIL_MIN_SCORE) || 75)
  const healthy = Number(guardrail.healthyCities ?? 0)
  const total = Number(guardrail.totalCities ?? 0)
  const candidates = Array.isArray(autoPromotion.candidates) ? autoPromotion.candidates.length : 0

  // Safety rails:
  // 1) health score should not be below guardrail minimum
  // 2) health should not be drastically below 100
  // 3) candidate list should not explode unexpectedly
  if (healthScore < minScore) {
    console.error(`live-guard blocked: healthScore ${healthScore} < minScore ${minScore}`)
    process.exit(2)
  }
  if (100 - healthScore > maxHealthDrop) {
    console.error(`live-guard blocked: health drop too high (${healthScore}) threshold=${100 - maxHealthDrop}`)
    process.exit(2)
  }
  if (candidates > maxCandidates) {
    console.error(`live-guard blocked: too many promotion candidates (${candidates} > ${maxCandidates})`)
    process.exit(2)
  }

  console.log(`live-guard dry-run ok health=${healthScore} healthy=${healthy}/${total} candidates=${candidates}`)
  console.log("live-guard executing: geo:ops-cycle:live")

  const run = spawnSync(
    process.execPath,
    [
      "scripts/trigger-geo-ops-cycle.js",
      "--mode=live",
      `--base=${base}`,
      `--locale=${locale}`,
      `--slug=${slug}`,
    ],
    { stdio: "inherit", env: process.env }
  )
  if (run.status !== 0) {
    throw new Error(`ops-cycle live failed with exit code ${run.status ?? "unknown"}`)
  }
  console.log("live-guard complete")
}

main().catch((err) => {
  console.error("geo ops live guard failed:", err)
  process.exit(1)
})

