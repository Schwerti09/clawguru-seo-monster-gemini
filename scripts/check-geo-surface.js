const DEFAULT_BASE = "https://clawguru.org"

function getBaseUrl() {
  const arg = process.argv.find((v) => v.startsWith("--base="))
  const raw = (arg ? arg.split("=").slice(1).join("=") : "") || process.env.GEO_CHECK_BASE || DEFAULT_BASE
  return raw.replace(/\/$/, "")
}

async function checkText(url, expected) {
  const res = await fetch(url, { redirect: "manual", headers: { "user-agent": "clawguru-geo-check/1.0" } })
  const text = await res.text()
  return { ok: res.status === 200 && expected.every((x) => text.includes(x)), status: res.status, text }
}

async function checkJson(url, validator) {
  const res = await fetch(url, { redirect: "manual", headers: { "user-agent": "clawguru-geo-check/1.0" } })
  const text = await res.text()
  let json = null
  try {
    json = JSON.parse(text)
  } catch {
    return { ok: false, status: res.status, reason: "invalid_json" }
  }
  return { ok: res.status === 200 && validator(json), status: res.status }
}

async function main() {
  const base = getBaseUrl()
  const llms = await checkText(`${base}/llms.txt`, ["/api/seo/citation-feed", "/de/runbooks"])
  const citation = await checkJson(`${base}/api/seo/citation-feed`, (j) => Array.isArray(j?.runbooks) && j.runbooks.length > 0)

  console.log("GEO surface check:", base)
  console.log("llms.txt:", llms.ok ? "PASS" : `FAIL (status=${llms.status})`)
  console.log("citation-feed:", citation.ok ? "PASS" : `FAIL (status=${citation.status})`)

  if (!llms.ok || !citation.ok) {
    process.exitCode = 1
  }
}

main().catch((err) => {
  console.error("geo check failed:", err)
  process.exit(1)
})
