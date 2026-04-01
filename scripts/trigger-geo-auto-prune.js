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
  const secret = process.env.GEO_AUTO_PRUNE_SECRET || process.env.GEO_REVALIDATE_SECRET || ""
  if (!secret) {
    console.error("missing GEO_AUTO_PRUNE_SECRET (or GEO_REVALIDATE_SECRET)")
    process.exit(1)
  }

  const locale = getArg("locale", "de")
  const slug = getArg("slug", "aws-ssh-hardening-2026")
  const limit = getArg("limit", process.env.GEO_MATRIX_SITEMAP_CITY_LIMIT || "24")
  const minHealth = getArg("minHealth", process.env.GEO_AUTO_PRUNE_MIN_HEALTH || "80")
  const maxPriority = getArg("maxPriority", process.env.GEO_AUTO_PRUNE_MAX_PRIORITY || "70")

  const url =
    `${base}/api/geo/auto-prune` +
    `?dryRun=${dryRun ? "1" : "0"}` +
    `&locale=${encodeURIComponent(locale)}` +
    `&slug=${encodeURIComponent(slug)}` +
    `&limit=${encodeURIComponent(limit)}` +
    `&minHealth=${encodeURIComponent(minHealth)}` +
    `&maxPriority=${encodeURIComponent(maxPriority)}`

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "user-agent": "clawguru-geo-auto-prune/1.0",
    },
  })
  const json = await res.json().catch(() => null)
  if (!res.ok || !json) {
    console.error("auto-prune request failed", { status: res.status, url })
    process.exit(1)
  }

  console.log(`auto-prune mode=${dryRun ? "dry-run" : "live"} healthScore=${json.healthScore}`)
  console.log(`deactivated=${(json.deactivated || []).join(",") || "-"}`)
  console.log(`wouldDeactivate=${(json.wouldDeactivate || []).join(",") || "-"}`)
}

main().catch((err) => {
  console.error("geo auto-prune trigger failed:", err)
  process.exit(1)
})

