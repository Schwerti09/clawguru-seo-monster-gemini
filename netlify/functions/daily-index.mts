// netlify/functions/daily-index.mts
// Netlify Scheduled Function – runs every day at 04:00 UTC.
// Calls /api/seo/index-now to submit the latest 200 URLs to Google.

import type { Config } from "@netlify/functions"

export default async function handler() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
  const secret = process.env.CRON_SECRET

  const url = `${base}/api/seo/index-now`
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (secret) {
    headers["Authorization"] = `Bearer ${secret}`
  }

  const res = await fetch(url, { headers })
  const body = await res.json().catch(() => ({}))

  console.log(
    `[daily-index] status=${res.status} submitted=${(body as { submitted?: number }).submitted ?? "?"} ok=${(body as { ok?: number }).ok ?? "?"} errors=${(body as { errors?: number }).errors ?? "?"}`,
    JSON.stringify(body)
  )
}

export const config: Config = {
  schedule: "0 4 * * *",
}
