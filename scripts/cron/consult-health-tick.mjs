#!/usr/bin/env node
// scripts/cron/consult-health-tick.mjs
//
// Portable cron tick for the /consulting automation health workflow.
// Runs every 15 minutes. Calls the production /api/consult-health/cron
// endpoint with a Bearer token and reports back via stdout/stderr.
//
// Designed to be platform-agnostic. Works on:
//   - Railway Cron Service (recommended, production setup)
//   - GitHub Actions schedule (backup option)
//   - Any external cron scheduler (cron-job.org, EasyCron, systemd timer)
//
// Required ENV:
//   - CRON_SECRET          Shared secret that matches the main web service
//   - SITE_URL             Production URL (default: https://clawguru.org)
//
// Optional ENV:
//   - CRON_TIMEOUT_MS      Request timeout in ms (default: 30000)
//   - CRON_VERBOSE         Set to "1" to print response body on success
//
// Exit codes:
//   0   Success (HTTP 200 from cron endpoint)
//   1   Transport error (DNS, timeout, network)
//   2   Authentication error (HTTP 401, misconfigured CRON_SECRET)
//   3   Endpoint error (HTTP 5xx or unexpected status)
//   4   Configuration error (missing CRON_SECRET)

const DEFAULT_SITE_URL = "https://clawguru.org"
const DEFAULT_TIMEOUT_MS = 30_000

function log(level, message, extra) {
  const ts = new Date().toISOString()
  const line = { ts, level, message, ...(extra ?? {}) }
  const stream = level === "error" ? process.stderr : process.stdout
  stream.write(JSON.stringify(line) + "\n")
}

async function main() {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || cronSecret.trim().length === 0) {
    log("error", "CRON_SECRET is not configured", {
      hint: "Set CRON_SECRET to the same value used by the web service.",
    })
    process.exit(4)
  }

  const siteUrl = (process.env.SITE_URL ?? DEFAULT_SITE_URL).replace(/\/$/, "")
  const timeoutMs = Number.parseInt(process.env.CRON_TIMEOUT_MS ?? "", 10) || DEFAULT_TIMEOUT_MS
  const verbose = process.env.CRON_VERBOSE === "1" || process.env.CRON_VERBOSE === "true"
  const endpoint = `${siteUrl}/api/consult-health/cron`

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  const startedAt = Date.now()
  let response
  try {
    response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cronSecret}`,
        "User-Agent": "clawguru-consult-health-tick/1.0",
      },
      signal: controller.signal,
    })
  } catch (err) {
    clearTimeout(timeoutId)
    const isAbort = err instanceof Error && err.name === "AbortError"
    log("error", isAbort ? "request timed out" : "fetch error", {
      endpoint,
      timeoutMs,
      error: err instanceof Error ? err.message : String(err),
    })
    process.exit(1)
  }
  clearTimeout(timeoutId)

  const durationMs = Date.now() - startedAt
  const body = await response.text()

  if (response.status === 200) {
    const payload = verbose ? tryParseJson(body) : undefined
    log("info", "cron tick completed", {
      endpoint,
      status: response.status,
      durationMs,
      ...(payload ? { payload } : {}),
    })
    process.exit(0)
  }

  if (response.status === 401) {
    log("error", "authentication failed", {
      endpoint,
      status: response.status,
      hint: "CRON_SECRET in this service does not match the web service.",
    })
    process.exit(2)
  }

  log("error", "cron endpoint returned unexpected status", {
    endpoint,
    status: response.status,
    durationMs,
    body: body.slice(0, 500),
  })
  process.exit(3)
}

function tryParseJson(text) {
  try {
    return JSON.parse(text)
  } catch {
    return { raw: text.slice(0, 200) }
  }
}

main().catch((err) => {
  log("error", "unhandled error in cron tick", {
    error: err instanceof Error ? err.message : String(err),
  })
  process.exit(1)
})
