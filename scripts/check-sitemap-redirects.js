const DEFAULT_BASE = "https://clawguru.org"

const LEGACY_SITEMAP_PATHS = [
  "/sitemap-index",
  "/sitemap/runbooks",
  "/sitemap/providers",
  "/sitemap/tags",
  "/sitemap/solutions",
  "/sitemap/cves",
  "/sitemap/runbooks.xml",
  "/sitemap/providers.xml",
  "/sitemap/tags.xml",
  "/sitemap/solutions.xml",
  "/sitemap/cves.xml",
]

function getBaseUrl() {
  const arg = process.argv.find((v) => v.startsWith("--base="))
  const raw =
    (arg ? arg.split("=").slice(1).join("=") : "") ||
    process.env.SITEMAP_CHECK_BASE ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    DEFAULT_BASE

  return raw.replace(/\/$/, "")
}

function pad(value, len) {
  const s = String(value)
  return s.length >= len ? s : s + " ".repeat(len - s.length)
}

async function checkLegacyRedirect(base, path) {
  const url = `${base}${path}`

  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "manual",
      headers: { "user-agent": "clawguru-sitemap-redirect-check/1.0" },
    })

    const location = res.headers.get("location") || ""
    const resolved = location ? new URL(location, base).toString() : ""
    const expected = `${base}/sitemap.xml`
    const ok = res.status === 308 && resolved === expected

    return {
      kind: "legacy",
      path,
      status: res.status,
      location: resolved,
      ok,
      message: ok ? "ok" : `expected 308 -> ${expected}`,
    }
  } catch (error) {
    return {
      kind: "legacy",
      path,
      status: 0,
      location: "",
      ok: false,
      message: `request_failed: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

async function checkCanonicalIndex(base) {
  const path = "/sitemap.xml"
  const url = `${base}${path}`

  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "manual",
      headers: { "user-agent": "clawguru-sitemap-redirect-check/1.0" },
    })
    const body = await res.text()

    const ok = res.status === 200 && body.includes("<sitemapindex")

    return {
      kind: "canonical",
      path,
      status: res.status,
      location: "",
      ok,
      message: ok ? "ok" : "expected 200 + <sitemapindex>",
    }
  } catch (error) {
    return {
      kind: "canonical",
      path,
      status: 0,
      location: "",
      ok: false,
      message: `request_failed: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

async function checkCanonicalChunk(base) {
  const path = "/sitemaps/runbooks-a-f.xml"
  const url = `${base}${path}`

  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "manual",
      headers: { "user-agent": "clawguru-sitemap-redirect-check/1.0" },
    })
    const body = await res.text()

    const ok = res.status === 200 && body.includes("<urlset")

    return {
      kind: "canonical",
      path,
      status: res.status,
      location: "",
      ok,
      message: ok ? "ok" : "expected 200 + <urlset>",
    }
  } catch (error) {
    return {
      kind: "canonical",
      path,
      status: 0,
      location: "",
      ok: false,
      message: `request_failed: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

function printResults(results, base) {
  console.log(`\nSitemap redirect check base: ${base}`)
  console.log(pad("STATUS", 8), pad("PATH", 34), pad("HTTP", 6), "DETAIL")

  for (const result of results) {
    const status = result.ok ? "PASS" : "FAIL"
    const detail = result.location ? `${result.location} (${result.message})` : result.message
    console.log(
      pad(status, 8),
      pad(result.path, 34),
      pad(result.status, 6),
      detail
    )
  }

  const pass = results.filter((r) => r.ok).length
  const fail = results.length - pass
  console.log(`\nSummary: ${pass} pass, ${fail} fail`) 
}

async function main() {
  const base = getBaseUrl()

  const legacyResults = []
  for (const path of LEGACY_SITEMAP_PATHS) {
    legacyResults.push(await checkLegacyRedirect(base, path))
  }

  const canonicalResults = [
    await checkCanonicalIndex(base),
    await checkCanonicalChunk(base),
  ]

  const results = [...legacyResults, ...canonicalResults]
  printResults(results, base)

  const hasFailure = results.some((r) => !r.ok)
  if (hasFailure) {
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error("Fatal error:", error)
  process.exit(1)
})
