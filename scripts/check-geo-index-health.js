const DEFAULT_BASE = "https://clawguru.org"

function getBase() {
  const arg = process.argv.find((x) => x.startsWith("--base="))
  const raw = (arg ? arg.split("=").slice(1).join("=") : "") || process.env.GEO_INDEX_HEALTH_BASE || DEFAULT_BASE
  return raw.replace(/\/$/, "")
}

async function main() {
  const base = getBase()
  const url = `${base}/api/geo/index-health`
  const res = await fetch(url, { redirect: "manual", headers: { "user-agent": "clawguru-geo-index-health/1.0" } })
  const json = await res.json().catch(() => null)
  if (!json) {
    console.error("invalid response from", url)
    process.exit(1)
  }
  console.log(`geo-index-health score=${json.score} healthy=${json.healthyCities}/${json.totalCities}`)
  if (!res.ok || json.score < 80) {
    process.exitCode = 1
  }
}

main().catch((err) => {
  console.error("geo index health check failed:", err)
  process.exit(1)
})
