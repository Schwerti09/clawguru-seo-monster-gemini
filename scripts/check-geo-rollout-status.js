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
  const secret =
    process.env.GEO_ROLLOUT_STATUS_SECRET ||
    process.env.GEO_CANARY_ROLLOUT_SECRET ||
    process.env.GEO_SITEMAP_GUARDRAIL_SECRET ||
    process.env.GEO_EXPANSION_SECRET ||
    process.env.GEO_AUTO_PRUNE_SECRET ||
    process.env.GEO_REVALIDATE_SECRET ||
    ""
  if (!secret) {
    console.error("missing GEO_ROLLOUT_STATUS_SECRET (or fallback geo secret)")
    process.exit(1)
  }

  const locale = getArg("locale", "de")
  const slug = getArg("slug", "aws-ssh-hardening-2026")
  const url =
    `${base}/api/geo/rollout-status` +
    `?locale=${encodeURIComponent(locale)}` +
    `&slug=${encodeURIComponent(slug)}`

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${secret}`,
      "user-agent": "clawguru-geo-rollout-status/1.0",
    },
  })
  const json = await res.json().catch(() => null)
  if (!res.ok || !json) {
    console.error("rollout-status request failed", { status: res.status, url })
    process.exit(1)
  }

  const r = json.rollout || {}
  console.log(
    `rollout total=${r.total || 0} activeStable=${r.activeStable || 0} activeCanary=${r.activeCanary || 0} inactiveStable=${r.inactiveStable || 0} inactiveCanary=${r.inactiveCanary || 0}`
  )
  const snap = json.rankingSnapshot
  if (snap) {
    console.log(`ranking healthScore=${snap.healthScore} healthy=${snap.healthyCities}/${snap.totalCities} durationMs=${snap.durationMs}`)
  }
}

main().catch((err) => {
  console.error("geo rollout status check failed:", err)
  process.exit(1)
})
