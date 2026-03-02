// netlify/functions/retention-weekly.mts
// Netlify Scheduled Function – runs weekly to trigger Active Defenders retention email.

import type { Config } from "@netlify/functions"

export default async function handler() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
  const secret = process.env.CRON_SECRET

  const url = `${base}/api/retention/weekly`
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (secret) {
    headers["Authorization"] = `Bearer ${secret}`
  }

  const res = await fetch(url, { headers })
  const body = await res.json().catch(() => ({}))

  console.log(
    `[retention-weekly] status=${res.status} sent=${(body as { sent?: number }).sent ?? "?"} failed=${(body as { failed?: number }).failed ?? "?"}`,
    JSON.stringify(body)
  )
}

export const config: Config = {
  schedule: "0 8 * * 1",
}
