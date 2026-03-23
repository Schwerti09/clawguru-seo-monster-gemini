const DEFAULT_BASE = "https://clawguru.org"

const CHECKS = [
  { path: "/de/intel", method: "GET", expected: [200], note: "critical page" },
  { path: "/de/check", method: "GET", expected: [200], note: "critical page" },
  { path: "/de/runbooks", method: "GET", expected: [200], note: "critical page" },
  { path: "/ru/issue/ebpf-security", method: "GET", expected: [200], note: "locale issue page" },
  {
    path: "/de/provenance/prometheus-rabbitmq-hsts-2030",
    method: "GET",
    expected: [307, 308],
    note: "expected locale provenance redirect",
    expectLocationIncludes: "/provenance/prometheus-rabbitmq-hsts-2030",
  },
  // Stripe Daypass Checkout redirect (should 303 to checkout.stripe.com)
  {
    path: "/api/stripe/checkout?plan=daypass",
    method: "GET",
    expected: [303],
    note: "stripe daypass redirect",
    expectLocationIncludes: "checkout.stripe.com",
  },
  // 3D pages (Three.js)
  { path: "/universe", method: "GET", expected: [200], note: "3D universe page" },
  { path: "/mycelium", method: "GET", expected: [200], note: "3D mycelium page" },
  // Summon UI baseline check (status only)
  { path: "/summon", method: "GET", expected: [200], note: "summon page" },
  {
    path: "/api/v1/intel-feed/latest",
    method: "GET",
    expected: [200, 401],
    note: "auth-gated endpoint can be 401 when auth is enforced",
  },
  {
    path: "/api/security-check",
    method: "GET",
    expected: [405],
    note: "POST-only route",
  },
]

function getBaseUrl() {
  const arg = process.argv.find((v) => v.startsWith("--base="))
  const raw =
    (arg ? arg.split("=").slice(1).join("=") : "") ||
    process.env.SMOKE_CHECK_BASE ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    DEFAULT_BASE

  return raw.replace(/\/$/, "")
}

function pad(value, len) {
  const s = String(value)
  return s.length >= len ? s : s + " ".repeat(len - s.length)
}

async function runCheck(base, check) {
  const url = `${base}${check.path}`
  const options = {
    method: check.method,
    redirect: "manual",
    headers: { "user-agent": "clawguru-production-smoke-check/1.0" },
  }

  const res = await fetch(url, options)
  const location = res.headers.get("location") || ""
  const expectedStatus = check.expected.includes(res.status)
  const locationOk = check.expectLocationIncludes
    ? location.includes(check.expectLocationIncludes)
    : true

  return {
    ...check,
    status: res.status,
    ok: expectedStatus && locationOk,
    location,
  }
}

function printResults(results, base) {
  console.log(`\nProduction smoke check base: ${base}`)
  console.log(pad("STATUS", 8), pad("METHOD", 8), pad("PATH", 52), pad("HTTP", 6), "DETAIL")

  for (const r of results) {
    const status = r.ok ? "PASS" : "FAIL"
    const detailParts = [r.note]
    if (r.location) detailParts.push(`location=${r.location}`)
    if (!r.ok) detailParts.push(`expected=${r.expected.join("|")}`)

    console.log(
      pad(status, 8),
      pad(r.method, 8),
      pad(r.path, 52),
      pad(r.status, 6),
      detailParts.join("; ")
    )
  }

  const pass = results.filter((r) => r.ok).length
  const fail = results.length - pass
  console.log(`\nSummary: ${pass} pass, ${fail} fail`)
}

async function main() {
  const base = getBaseUrl()

  const results = []
  for (const check of CHECKS) {
    try {
      results.push(await runCheck(base, check))
    } catch (error) {
      results.push({
        ...check,
        status: 0,
        ok: false,
        location: "",
        note: `${check.note}; request_failed=${error instanceof Error ? error.message : String(error)}`,
      })
    }
  }

  printResults(results, base)

  if (results.some((r) => !r.ok)) {
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error("Smoke check failed:", error)
  process.exit(1)
})
