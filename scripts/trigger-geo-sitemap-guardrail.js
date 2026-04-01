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
    process.env.GEO_SITEMAP_GUARDRAIL_SECRET ||
    process.env.GEO_EXPANSION_SECRET ||
    process.env.GEO_AUTO_PRUNE_SECRET ||
    process.env.GEO_REVALIDATE_SECRET ||
    ""
  if (!secret) {
    console.error("missing GEO_SITEMAP_GUARDRAIL_SECRET (or fallback geo secrets)")
    process.exit(1)
  }

  const locale = getArg("locale", process.env.GEO_SITEMAP_GUARDRAIL_LOCALE || "de")
  const slug = getArg("slug", process.env.GEO_SITEMAP_GUARDRAIL_SLUG || "aws-ssh-hardening-2026")
  const url =
    `${base}/api/geo/sitemap-guardrail` +
    `?dryRun=${dryRun ? "1" : "0"}` +
    `&locale=${encodeURIComponent(locale)}` +
    `&slug=${encodeURIComponent(slug)}`

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "user-agent": "clawguru-geo-sitemap-guardrail/1.0",
    },
  })
  const json = await res.json().catch(() => null)
  if (!res.ok || !json) {
    console.error("sitemap-guardrail request failed", { status: res.status, url })
    process.exit(1)
  }

  const limits = json.applied || json.target || {}
  console.log(
    `sitemap-guardrail mode=${dryRun ? "dry-run" : "live"} action=${json.action} changed=${json.changed} score=${json.score}`
  )
  console.log(
    `limits mode=${limits.mode || "-"} cityLimit=${limits.cityLimit || "-"} cityPool=${limits.cityPool || "-"} seedLimit=${limits.seedLimit || "-"}`
  )
}

main().catch((err) => {
  console.error("geo sitemap guardrail trigger failed:", err)
  process.exit(1)
})
