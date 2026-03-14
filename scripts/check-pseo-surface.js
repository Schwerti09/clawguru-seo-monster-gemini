const { buildDeterministicSample, DEFAULT_SAMPLE_SIZE, DEFAULT_SEED } = require("./pseo-sampling")

const DEFAULT_BASE = "https://clawguru.org"

function pad(value, len) {
  const s = String(value)
  return s.length >= len ? s : s + " ".repeat(len - s.length)
}

function getArgValue(name) {
  const prefix = `--${name}=`
  const arg = process.argv.find((v) => v.startsWith(prefix))
  if (!arg) return ""
  return arg.slice(prefix.length)
}

function getBaseUrl() {
  const raw =
    getArgValue("base") ||
    process.env.PSEO_SURFACE_BASE ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    DEFAULT_BASE

  return raw.replace(/\/$/, "")
}

function getSampleSize() {
  const raw = getArgValue("sample-size")
  const parsed = Number(raw)
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_SAMPLE_SIZE
  return Math.floor(parsed)
}

function getSeed() {
  return getArgValue("seed") || process.env.PSEO_SAMPLE_SEED || DEFAULT_SEED
}

function getInternalSecret() {
  return (
    getArgValue("internal-secret") ||
    process.env.INTERNAL_PSEO_STATS_SECRET ||
    process.env.PSEO_STATS_SECRET ||
    ""
  )
}

async function fetchPseoStats(base, secret) {
  const url = `${base}/api/internal/pseo/stats`
  const headers = {
    "user-agent": "clawguru-pseo-surface-check/1.0",
  }
  if (secret) {
    headers.authorization = `Bearer ${secret}`
  }

  try {
    const res = await fetch(url, { method: "GET", redirect: "manual", headers })
    const contentType = res.headers.get("content-type") || ""
    const bodyText = await res.text()

    let json = null
    if (contentType.includes("application/json")) {
      try {
        json = JSON.parse(bodyText)
      } catch {
        json = null
      }
    }

    return {
      ok: res.ok,
      status: res.status,
      contentType,
      json,
      note: res.ok
        ? "internal stats available"
        : secret
          ? "internal stats request failed"
          : "internal stats not requested (missing secret)",
    }
  } catch (error) {
    return {
      ok: false,
      status: 0,
      contentType: "",
      json: null,
      note: `internal stats fetch failed: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

async function fetchXmlWithOneRedirect(url) {
  const headers = { "user-agent": "clawguru-pseo-surface-check/1.0" }
  const first = await fetch(url, { method: "GET", redirect: "manual", headers })
  if ((first.status === 307 || first.status === 308) && first.headers.get("location")) {
    const redirectUrl = new URL(first.headers.get("location"), url).toString()
    return fetch(redirectUrl, { method: "GET", redirect: "manual", headers })
  }
  return first
}

function extractLocs(xml) {
  return (xml.match(/<loc>[^<]+<\/loc>/gi) || []).map((tag) =>
    tag.replace(/<\/?loc>/gi, "").trim()
  )
}

function pickRunbookSitemapLocs(indexLocs) {
  return indexLocs.filter((loc) => /\/sitemaps\/runbooks-[a-z]{2}-(a-f|g-l|m-r|s-z|0-9)\.xml$/i.test(loc))
}

function normalizeSitemapLocToBase(loc, base) {
  try {
    const parsed = new URL(loc)
    return `${base}${parsed.pathname}${parsed.search || ""}`
  } catch {
    if (loc.startsWith("/")) return `${base}${loc}`
    return `${base}/${loc.replace(/^\//, "")}`
  }
}

async function fetchMaterializedSlugsFromSitemaps(base, limit) {
  const slugs = []
  const seen = new Set()

  const indexRes = await fetchXmlWithOneRedirect(`${base}/sitemap.xml`)
  if (!indexRes.ok) return slugs

  const indexBody = await indexRes.text()
  const indexLocs = extractLocs(indexBody)
  const runbookSitemapLocs = pickRunbookSitemapLocs(indexLocs)

  for (const loc of runbookSitemapLocs) {
    if (slugs.length >= limit) break
    try {
      const chunkUrl = normalizeSitemapLocToBase(loc, base)
      const res = await fetchXmlWithOneRedirect(chunkUrl)
      if (!res.ok) continue
      const body = await res.text()
      const locs = extractLocs(body)
      for (const pageLoc of locs) {
        const match = pageLoc.match(/\/runbook\/([^/?#]+)$/i)
        if (!match) continue
        const slug = decodeURIComponent(match[1])
        if (seen.has(slug)) continue
        seen.add(slug)
        slugs.push(slug)
        if (slugs.length >= limit) break
      }
    } catch {
      // ignore chunk fetch failures, continue with remaining chunks
    }
  }

  return slugs
}

function buildChecks(sample) {
  const checks = []

  for (const slug of sample.materializedSlugs) {
    checks.push({ path: `/runbook/${slug}`, kind: "materialized" })
  }

  for (const slug of sample.generated100kSlugs) {
    checks.push({ path: `/runbook/${slug}`, kind: "generated100k" })
  }

  for (const path of sample.localeRunbookPaths) {
    checks.push({ path, kind: "locale-generated100k" })
  }

  const deduped = []
  const seen = new Set()
  for (const check of checks) {
    if (seen.has(check.path)) continue
    seen.add(check.path)
    deduped.push(check)
  }

  return deduped
}

function hasBrokenSignature(body) {
  const signatures = [
    "internal server error",
    "application error",
    "cannot get /",
    "404 page not found",
    "runtime error",
  ]

  const lower = body.toLowerCase()
  return signatures.some((s) => lower.includes(s))
}

async function runCheck(base, check) {
  const url = `${base}${check.path}`

  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "manual",
      headers: { "user-agent": "clawguru-pseo-surface-check/1.0" },
    })

    let finalStatus = res.status
    let finalBody = await res.text()
    let redirected = false

    if ((res.status === 307 || res.status === 308) && res.headers.get("location")) {
      const redirectUrl = new URL(res.headers.get("location"), base).toString()
      const redirectedRes = await fetch(redirectUrl, {
        method: "GET",
        redirect: "manual",
        headers: { "user-agent": "clawguru-pseo-surface-check/1.0" },
      })
      redirected = true
      finalStatus = redirectedRes.status
      finalBody = await redirectedRes.text()
    }

    const hasCanonical = /<link[^>]+rel=["']canonical["']/i.test(finalBody)
    const nonEmptyBody = finalBody.trim().length > 0
    const brokenSignature = hasBrokenSignature(finalBody)

    const ok = finalStatus === 200 && hasCanonical && nonEmptyBody && !brokenSignature

    const detailParts = []
    detailParts.push(`canonical=${hasCanonical ? "yes" : "no"}`)
    detailParts.push(`body=${nonEmptyBody ? "non-empty" : "empty"}`)
    if (redirected) detailParts.push(`redirected-from=${res.status}`)
    if (brokenSignature) detailParts.push("broken-signature-detected")

    return {
      ...check,
      status: finalStatus,
      ok,
      detail: detailParts.join(", "),
    }
  } catch (error) {
    return {
      ...check,
      status: 0,
      ok: false,
      detail: `request_failed=${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

function printStatsResult(statsResult) {
  const label = statsResult.ok ? "PASS" : statsResult.status === 401 ? "WARN" : "INFO"
  const summary = [
    `status=${statsResult.status}`,
    `content-type=${statsResult.contentType || "n/a"}`,
    statsResult.note,
  ].join("; ")

  console.log("\nInternal pSEO stats endpoint")
  console.log(pad("STATUS", 8), pad("PATH", 34), pad("HTTP", 6), "DETAIL")
  console.log(pad(label, 8), pad("/api/internal/pseo/stats", 34), pad(statsResult.status, 6), summary)

  if (statsResult.ok && statsResult.json) {
    const j = statsResult.json
    console.log(
      "Stats:",
      JSON.stringify(
        {
          materializedRunbooksCount: j.materializedRunbooksCount,
          count100kSlugs: j.count100kSlugs,
          providerCount: j.providerCount,
          serviceCount: j.serviceCount,
          issueCount: j.issueCount,
          yearCount: j.yearCount,
          localeCount: j.localeCount,
          env: j.env,
        },
        null,
        2
      )
    )
  }
}

function printResults(results, base, sample) {
  console.log(`\npSEO surface check base: ${base}`)
  console.log(`seed=${sample.seed}; sample-size=${sample.sampleSize}; checks=${results.length}`)
  console.log(pad("STATUS", 8), pad("KIND", 22), pad("PATH", 54), pad("HTTP", 6), "DETAIL")

  for (const r of results) {
    console.log(
      pad(r.ok ? "PASS" : "FAIL", 8),
      pad(r.kind, 22),
      pad(r.path, 54),
      pad(r.status, 6),
      r.detail
    )
  }

  const pass = results.filter((r) => r.ok).length
  const fail = results.length - pass
  console.log(`\nSummary: ${pass} pass, ${fail} fail`)
}

async function main() {
  const base = getBaseUrl()
  const seed = getSeed()
  const sampleSize = getSampleSize()
  const secret = getInternalSecret()

  const statsResult = await fetchPseoStats(base, secret)
  printStatsResult(statsResult)

  const sample = buildDeterministicSample({ sampleSize, seed })
  const materializedFromSitemap = await fetchMaterializedSlugsFromSitemaps(base, sample.sampleSize)
  if (materializedFromSitemap.length > 0) {
    sample.materializedSlugs = materializedFromSitemap
  }
  const checks = buildChecks(sample)

  const results = []
  for (const check of checks) {
    results.push(await runCheck(base, check))
  }

  printResults(results, base, sample)

  if (results.some((r) => !r.ok)) {
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error("pSEO surface check failed:", error)
  process.exit(1)
})
