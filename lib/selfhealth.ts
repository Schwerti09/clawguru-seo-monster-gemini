// File: lib/selfhealth.ts
// Self-Health System – automated site health, SEO watchdog, content freshness monitor.

import { RUNBOOKS } from "./pseo"
import { sendEmail } from "./email"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CheckStatus = "ok" | "warn" | "fail"

export type HealthCheck = {
  name: string
  status: CheckStatus
  message: string
  detail?: string
}

export type SiteHealthReport = {
  ok: boolean          // true = all checks ok or warn, false = at least one fail
  score: number        // 0–100
  ts: string           // ISO timestamp
  checks: HealthCheck[]
  summary: string
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const SITEMAP_NAMES = [
  "main",
  "providers",
  "runbooks-a-f",
  "runbooks-g-l",
  "runbooks-m-r",
  "runbooks-s-z",
  "runbooks-0-9",
  "tags-a-f",
  "tags-g-l",
  "tags-m-r",
  "tags-s-z",
  "tags-0-9",
] as const

const CRITICAL_PAGES = [
  "/",
  "/runbooks",
  "/copilot",
  "/check",
  "/live",
  "/tags",
  "/intel",
  "/pricing",
] as const

const REQUIRED_ENV_VARS = [
  "STRIPE_SECRET_KEY",
  "STRIPE_PRICE_DAYPASS",
  "NEXT_PUBLIC_SITE_URL",
] as const

// Warn if freshest runbook lastmod is older than this many days
const FRESHNESS_WARN_DAYS = 30
const FRESHNESS_FAIL_DAYS = 90

// Timeout per fetch (ms)
const FETCH_TIMEOUT_MS = 10_000

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function base(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org").replace(/\/$/, "")
}

async function fetchWithTimeout(url: string): Promise<{ ok: boolean; status: number; body: string }> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const res = await fetch(url, { signal: controller.signal, cache: "no-store" })
    const body = await res.text().catch(() => "")
    return { ok: res.ok, status: res.status, body }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return { ok: false, status: 0, body: msg }
  } finally {
    clearTimeout(timer)
  }
}

function daysSince(dateStr: string): number {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return 9999
  return Math.floor((Date.now() - d.getTime()) / 86_400_000)
}

// ---------------------------------------------------------------------------
// Individual checks
// ---------------------------------------------------------------------------

/** Verify the sitemap index and all sub-sitemaps return 200 + valid XML. */
export async function checkSitemaps(): Promise<HealthCheck[]> {
  const b = base()
  const results: HealthCheck[] = []

  // Check the sitemap index first
  const index = await fetchWithTimeout(`${b}/sitemap.xml`)
  results.push({
    name: "sitemap:index",
    status: index.ok && index.body.includes("<sitemapindex") ? "ok"
      : index.ok ? "warn"
      : "fail",
    message: index.ok
      ? index.body.includes("<sitemapindex") ? "Sitemap index OK" : "Sitemap index reachable but missing <sitemapindex>"
      : `Sitemap index unreachable (HTTP ${index.status})`,
    detail: index.ok ? undefined : index.body.slice(0, 200),
  })

  // Check each named sub-sitemap
  for (const name of SITEMAP_NAMES) {
    const url = `${b}/sitemaps/${name}.xml`
    const res = await fetchWithTimeout(url)
    const hasUrlset = res.body.includes("<urlset") || res.body.includes("<sitemapindex")
    results.push({
      name: `sitemap:${name}`,
      status: res.ok && hasUrlset ? "ok"
        : res.ok ? "warn"
        : "fail",
      message: res.ok
        ? hasUrlset ? `${name}.xml OK` : `${name}.xml reachable but missing <urlset>`
        : `${name}.xml unreachable (HTTP ${res.status})`,
      detail: res.ok ? undefined : res.body.slice(0, 200),
    })
  }

  return results
}

/** Verify critical pages return HTTP 200. */
export async function checkCriticalPages(): Promise<HealthCheck[]> {
  const b = base()
  const results: HealthCheck[] = []

  for (const path of CRITICAL_PAGES) {
    const url = `${b}${path}`
    const res = await fetchWithTimeout(url)
    results.push({
      name: `page:${path === "/" ? "home" : path.replace(/^\//, "")}`,
      status: res.ok ? "ok" : res.status >= 500 ? "fail" : "warn",
      message: res.ok ? `${path} → ${res.status} OK` : `${path} → HTTP ${res.status}`,
      detail: !res.ok ? res.body.slice(0, 200) : undefined,
    })
  }

  return results
}

/** Verify required environment variables are present. */
export function checkEnvVars(): HealthCheck[] {
  const missing = REQUIRED_ENV_VARS.filter((k) => !process.env[k])

  if (missing.length === 0) {
    return [{ name: "env:vars", status: "ok", message: "All required env vars present" }]
  }

  return [
    {
      name: "env:vars",
      status: "fail",
      message: `Missing env vars: ${missing.join(", ")}`,
      detail: missing.join(", "),
    },
  ]
}

/** Check whether runbook content is fresh (recent lastmod dates). */
export function checkContentFreshness(): HealthCheck[] {
  const runbooks = RUNBOOKS

  if (runbooks.length === 0) {
    return [{ name: "content:freshness", status: "warn", message: "No runbooks found" }]
  }

  // Find the most recent lastmod
  const dates = runbooks.map((r) => r.lastmod).filter(Boolean)
  const mostRecent = dates.sort().at(-1) ?? ""
  const days = daysSince(mostRecent)

  let status: CheckStatus = "ok"
  let message = `Most recent runbook lastmod: ${mostRecent} (${days}d ago)`

  if (days >= FRESHNESS_FAIL_DAYS) {
    status = "fail"
    message = `Content stale: newest runbook lastmod is ${days} days old (>${FRESHNESS_FAIL_DAYS}d threshold)`
  } else if (days >= FRESHNESS_WARN_DAYS) {
    status = "warn"
    message = `Content aging: newest runbook lastmod is ${days} days old (>${FRESHNESS_WARN_DAYS}d threshold)`
  }

  return [
    {
      name: "content:freshness",
      status,
      message,
      detail: `${runbooks.length} runbooks total. Most recent lastmod: ${mostRecent}.`,
    },
  ]
}

/** Check that the /api/health endpoint itself is reachable. */
export async function checkHealthEndpoint(): Promise<HealthCheck> {
  const b = base()
  const res = await fetchWithTimeout(`${b}/api/health`)
  return {
    name: "api:health",
    status: res.ok ? "ok" : "fail",
    message: res.ok ? `/api/health → ${res.status} OK` : `/api/health → HTTP ${res.status}`,
    detail: !res.ok ? res.body.slice(0, 200) : undefined,
  }
}

// ---------------------------------------------------------------------------
// Main aggregation
// ---------------------------------------------------------------------------

/**
 * Run all site health checks and return a consolidated report.
 * Safe to call from a cron/scheduled endpoint – no side effects unless
 * `options.alertEmail` is set, in which case a summary email is sent on failure.
 */
export async function checkSiteHealth(options: {
  alertEmail?: string
  skipRemote?: boolean   // skip HTTP-based checks (useful for unit tests / build-time)
} = {}): Promise<SiteHealthReport> {
  const { alertEmail, skipRemote = false } = options

  const checks: HealthCheck[] = [
    ...checkEnvVars(),
    ...checkContentFreshness(),
  ]

  if (!skipRemote) {
    const [sitemapChecks, pageChecks, healthEndpoint] = await Promise.all([
      checkSitemaps(),
      checkCriticalPages(),
      checkHealthEndpoint(),
    ])
    checks.push(...sitemapChecks, ...pageChecks, healthEndpoint)
  }

  const failCount = checks.filter((c) => c.status === "fail").length
  const warnCount = checks.filter((c) => c.status === "warn").length
  const total = checks.length

  const score = total === 0 ? 100 : Math.round(((total - failCount - warnCount * 0.5) / total) * 100)
  const ok = failCount === 0

  const summary = ok
    ? warnCount > 0
      ? `${warnCount} warning(s) – site is live but needs attention`
      : "All checks passed – site healthy"
    : `${failCount} failure(s), ${warnCount} warning(s) – immediate attention required`

  const report: SiteHealthReport = {
    ok,
    score: Math.max(0, Math.min(100, score)),
    ts: new Date().toISOString(),
    checks,
    summary,
  }

  // Alert email if configured and health is degraded
  if (alertEmail && !ok) {
    await sendHealthAlert(alertEmail, report).catch(() => undefined)
  }

  return report
}

// ---------------------------------------------------------------------------
// Alert helper
// ---------------------------------------------------------------------------

async function sendHealthAlert(to: string, report: SiteHealthReport): Promise<void> {
  const failedChecks = report.checks.filter((c) => c.status === "fail")
  const warnChecks = report.checks.filter((c) => c.status === "warn")

  const rows = (checks: HealthCheck[], icon: string) =>
    checks.map((c) => `<li>${icon} <strong>${c.name}</strong>: ${c.message}${c.detail ? ` <em>(${c.detail})</em>` : ""}</li>`).join("\n")

  const html = `
<h2>🚨 ClawGuru Site Health Alert</h2>
<p><strong>Score:</strong> ${report.score}/100 &nbsp; <strong>Status:</strong> ${report.ok ? "✅ OK" : "❌ FAILING"}</p>
<p><strong>Summary:</strong> ${report.summary}</p>
<p><strong>Time:</strong> ${report.ts}</p>
${failedChecks.length > 0 ? `<h3>❌ Failures (${failedChecks.length})</h3><ul>${rows(failedChecks, "❌")}</ul>` : ""}
${warnChecks.length > 0 ? `<h3>⚠️ Warnings (${warnChecks.length})</h3><ul>${rows(warnChecks, "⚠️")}</ul>` : ""}
<p>Fix these issues to keep ClawGuru.org healthy and ranking.</p>
`

  await sendEmail({
    to,
    subject: `🚨 ClawGuru Health Alert – Score ${report.score}/100`,
    html,
  })
}
