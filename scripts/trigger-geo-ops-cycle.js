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

function modeFromCli() {
  const mode = (getArg("mode", "dry-run") || "dry-run").toLowerCase()
  return mode === "live" ? "live" : "dry-run"
}

async function call(base, path, secret) {
  const url = `${base}${path}`
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "user-agent": "clawguru-geo-ops-cycle/1.0",
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
  const mode = modeFromCli()
  const dryRun = mode !== "live"
  const secret =
    process.env.GEO_AUTO_PROMOTION_SECRET ||
    process.env.GEO_CANARY_ROLLOUT_SECRET ||
    process.env.GEO_SITEMAP_GUARDRAIL_SECRET ||
    process.env.GEO_EXPANSION_SECRET ||
    process.env.GEO_REVALIDATE_SECRET ||
    ""

  if (!secret) {
    console.error("missing geo secret for ops cycle")
    process.exit(1)
  }

  console.log(`geo-ops-cycle mode=${mode}`)

  const guardrail = await call(base, `/api/geo/sitemap-guardrail?dryRun=${dryRun ? "1" : "0"}`, secret)
  console.log(`guardrail mode=${guardrail.mode || "-"} health=${guardrail.healthScore ?? "-"}`)

  const canary = await call(base, `/api/geo/canary-rollout?dryRun=${dryRun ? "1" : "0"}`, secret)
  console.log(`canary promoted=${(canary.promoted || []).join(",") || "-"} wouldPromote=${(canary.wouldPromote || []).join(",") || "-"}`)

  const autoPromotion = await call(base, `/api/geo/auto-promotion?dryRun=${dryRun ? "1" : "0"}`, secret)
  console.log(`auto-promotion promoted=${(autoPromotion.promoted || []).join(",") || "-"} candidates=${(autoPromotion.candidates || []).length || 0}`)
}

main().catch((err) => {
  console.error("geo ops cycle failed:", err)
  process.exit(1)
})

