// netlify/functions/daily-index.mts
// Netlify Scheduled Function – runs daily at 04:00 UTC.
// Triggers the Google Indexing API batch submission via lib/google-indexer.ts.

import type { Config } from "@netlify/functions"
import { runDailyIndexing } from "../../lib/google-indexer"

export default async function handler() {
  console.log("[daily-index] Starting Google Indexing API batch submission…")

  try {
    const result = await runDailyIndexing()

    console.log(
      `[daily-index] Done. submitted=${result.submitted.length}` +
        ` skipped=${result.skipped.length}` +
        ` errors=${result.errors.length}`
    )
  } catch (err) {
    console.error("[daily-index] Indexing run failed:", err)
  }
}

export const config: Config = {
  schedule: "0 4 * * *",
}
