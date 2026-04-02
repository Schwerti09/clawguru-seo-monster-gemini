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

async function callRevalidate(base, revalidateSecret, payload) {
  const url = `${base}/api/geo/revalidate`
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-geo-revalidate-secret": revalidateSecret,
      "user-agent": "clawguru-geo-ops-cycle/1.0",
    },
    body: JSON.stringify(payload),
  })
  const json = await res.json().catch(() => null)
  if (!res.ok || !json) {
    throw new Error(`revalidate request failed ${res.status} ${url}`)
  }
  return json
}

async function main() {
  const base = getBase()
  const mode = modeFromCli()
  const dryRun = mode !== "live"
  const locale = (getArg("locale", "de") || "de").toLowerCase()
  const slug = getArg("slug", process.env.GEO_SITEMAP_GUARDRAIL_SLUG || "aws-ssh-hardening-2026")
  const revalidateSlugs = (getArg("revalidateSlugs", process.env.GEO_REVALIDATE_SLUGS || slug) || slug)
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
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
  const revalidateSecret = process.env.GEO_REVALIDATE_SECRET || ""

  console.log(`geo-ops-cycle mode=${mode} locale=${locale}`)

  const guardrail = await call(base, `/api/geo/sitemap-guardrail?dryRun=${dryRun ? "1" : "0"}`, secret)
  console.log(`guardrail mode=${guardrail.mode || "-"} health=${guardrail.healthScore ?? "-"}`)

  const canary = await call(
    base,
    `/api/geo/canary-rollout?dryRun=${dryRun ? "1" : "0"}&locale=${encodeURIComponent(locale)}&slug=${encodeURIComponent(slug)}`,
    secret
  )
  console.log(`canary promoted=${(canary.promoted || []).join(",") || "-"} wouldPromote=${(canary.wouldPromote || []).join(",") || "-"}`)

  const autoPromotion = await call(
    base,
    `/api/geo/auto-promotion?dryRun=${dryRun ? "1" : "0"}&locale=${encodeURIComponent(locale)}`,
    secret
  )
  console.log(`auto-promotion promoted=${(autoPromotion.promoted || []).join(",") || "-"} candidates=${(autoPromotion.candidates || []).length || 0}`)

  const promotedCities = Array.from(new Set([...(canary.promoted || []), ...(autoPromotion.promoted || [])]))
  if (promotedCities.length === 0) {
    console.log("revalidate skipped: no promoted cities")
    return
  }

  if (dryRun) {
    console.log(`revalidate dry-run cities=${promotedCities.join(",")} slugs=${revalidateSlugs.join(",")}`)
    return
  }

  if (!revalidateSecret) {
    console.log("revalidate skipped: GEO_REVALIDATE_SECRET is missing")
    return
  }

  let revalidatedCount = 0
  for (const citySlug of promotedCities) {
    for (const rbSlug of revalidateSlugs) {
      await callRevalidate(base, revalidateSecret, {
        locale,
        slug: rbSlug,
        citySlug,
        allLocales: false,
      })
      revalidatedCount++
    }
  }
  console.log(`revalidate triggered calls=${revalidatedCount}`)
}

main().catch((err) => {
  console.error("geo ops cycle failed:", err)
  process.exit(1)
})

