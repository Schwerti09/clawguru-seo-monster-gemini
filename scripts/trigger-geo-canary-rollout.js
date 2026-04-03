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
    process.env.GEO_CANARY_ROLLOUT_SECRET ||
    process.env.GEO_EXPANSION_SECRET ||
    process.env.GEO_AUTO_PRUNE_SECRET ||
    process.env.GEO_REVALIDATE_SECRET ||
    ""
  if (!secret) {
    console.error("missing GEO_CANARY_ROLLOUT_SECRET (or fallback geo secrets)")
    process.exit(1)
  }

  const locale = getArg("locale", "de")
  const slug = getArg("slug", "aws-ssh-hardening-2026")
  const cities = getArg("cities", "")
  const limit = getArg("limit", process.env.GEO_CANARY_ROLLOUT_LIMIT || "80")
  const minRankingScore = getArg("minRankingScore", process.env.GEO_CANARY_PROMOTE_MIN_RANKING_SCORE || "86")
  const url =
    `${base}/api/geo/canary-rollout` +
    `?dryRun=${dryRun ? "1" : "0"}` +
    `&locale=${encodeURIComponent(locale)}` +
    `&slug=${encodeURIComponent(slug)}` +
    (cities ? `&cities=${encodeURIComponent(cities)}` : "") +
    `&limit=${encodeURIComponent(limit)}` +
    `&minRankingScore=${encodeURIComponent(minRankingScore)}`

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "user-agent": "clawguru-geo-canary-rollout/1.0",
    },
  })
  const json = await res.json().catch(() => null)
  if (!res.ok || !json) {
    console.error("canary-rollout request failed", { status: res.status, url })
    process.exit(1)
  }

  console.log(
    `canary-rollout mode=${dryRun ? "dry-run" : "live"} locale=${locale} cities=${cities || "-"} minRankingScore=${json.minRankingScore}`
  )
  if (json.debug) {
    console.log(
      `debug totalRanked=${json.debug.totalRanked} canaryRanked=${json.debug.canaryRanked} belowStatus200=${json.debug.belowStatus200} belowMinRankingScore=${json.debug.belowMinRankingScore} selected=${json.debug.selected}`
    )
  }
  console.log(`promoted=${(json.promoted || []).join(",") || "-"}`)
  console.log(`wouldPromote=${(json.wouldPromote || []).join(",") || "-"}`)
}

main().catch((err) => {
  console.error("geo canary rollout trigger failed:", err)
  process.exit(1)
})
