// netlify/functions/daily-index.mts
// Netlify Scheduled Function – runs daily at 04:00 UTC.
// Delegates to the Next.js API route /api/google-indexing/cron which runs the
// actual Google Indexing API submission (keeps this function bundle lightweight).

import type { Config } from "@netlify/functions"

export default async function handler() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
  const secret = process.env.CRON_SECRET

  const url = `${base}/api/google-indexing/cron`
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (secret) {
    headers["Authorization"] = `Bearer ${secret}`
  }

  try {
    const res = await fetch(url, { headers })
    const body = await res.json().catch((e: unknown) => {
      console.warn("[daily-index] Could not parse response JSON:", e)
      return {}
    })

    console.log(
      `[daily-index] status=${res.status} ok=${(body as { ok?: boolean }).ok ?? "?"}`,
      JSON.stringify(body)
    )
  } catch (err) {
    console.error("[daily-index] Request failed:", err)
  }
}

export const config: Config = {
  schedule: "0 4 * * *",
}
