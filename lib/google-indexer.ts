// lib/google-indexer.ts
// Google Indexing API helper.
// Reads the service-account key from GOOGLE_INDEXER_KEY (JSON string) and submits
// URL_UPDATED notifications via the Indexing API.

import { google } from "googleapis"

const SCOPES = ["https://www.googleapis.com/auth/indexing"]
const DEFAULT_DAILY_QUOTA = 200
const quotaState = { date: "", used: 0 }

function todayKey(now = new Date()) {
  return now.toISOString().slice(0, 10)
}

function remainingQuota(limit: number) {
  const today = todayKey()
  if (quotaState.date !== today) {
    quotaState.date = today
    quotaState.used = 0
  }
  return Math.max(0, limit - quotaState.used)
}

/** Notify Google that the given URLs have been updated.
 *  Returns an array of per-URL results from the Indexing API.
 */
export async function indexUrls(urls: string[]) {
  const raw = process.env.GOOGLE_INDEXER_KEY
  if (!raw) {
    throw new Error("GOOGLE_INDEXER_KEY environment variable is not set")
  }

  const configuredQuota = Number(process.env.GOOGLE_INDEXER_DAILY_QUOTA ?? DEFAULT_DAILY_QUOTA)
  const dailyQuota = Number.isFinite(configuredQuota) && configuredQuota > 0
    ? Math.min(DEFAULT_DAILY_QUOTA, configuredQuota)
    : DEFAULT_DAILY_QUOTA
  const available = remainingQuota(dailyQuota)
  const limitedUrls = urls.slice(0, available)
  if (urls.length > limitedUrls.length) {
    console.warn(`[google-indexer] quota ${dailyQuota}/day reached, skipping ${urls.length - limitedUrls.length} URLs`)
  }
  if (limitedUrls.length === 0) {
    return []
  }

  let keyFile: unknown
  try {
    keyFile = JSON.parse(raw)
  } catch {
    throw new Error("GOOGLE_INDEXER_KEY is not valid JSON. Ensure the service-account key is stored as a JSON string.")
  }

  const auth = new google.auth.GoogleAuth({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    credentials: keyFile as any,
    scopes: SCOPES,
  })

  const indexing = google.indexing({ version: "v3", auth })

  const results = await Promise.allSettled(
    limitedUrls.map((url) =>
      indexing.urlNotifications.publish({
        requestBody: {
          url,
          type: "URL_UPDATED",
        },
      })
    )
  )
  quotaState.used += limitedUrls.length

  return results.map((r, i) => ({
    url: limitedUrls[i],
    status: r.status,
    ...(r.status === "fulfilled"
      ? { httpStatus: r.value.status }
      : { error: (r.reason as Error)?.message ?? String(r.reason) }),
  }))
}
