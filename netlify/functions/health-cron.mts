// netlify/functions/health-cron.mts
// Netlify Scheduled Function – runs daily at 06:00 UTC.
// Calls the /api/health/cron endpoint to run self-health checks.

import type { Config } from "@netlify/functions"

export default async function handler() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
  const secret = process.env.CRON_SECRET

  const url = `${base}/api/health/cron`
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (secret) {
    headers["Authorization"] = `Bearer ${secret}`
  }

  const res = await fetch(url, { headers })
  const body = await res.json().catch(() => ({}))

  console.log(`[health-cron] status=${res.status} ok=${(body as { ok?: boolean }).ok ?? "?"}`, JSON.stringify(body))
}

export const config: Config = {
  schedule: "0 6 * * *",
}
