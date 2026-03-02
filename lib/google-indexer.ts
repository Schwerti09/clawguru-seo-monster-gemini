// lib/google-indexer.ts
// Google Indexing API helper.
// Reads the service-account key from GOOGLE_INDEXER_KEY (JSON string) and submits
// URL_UPDATED notifications via the Indexing API.

import { google } from "googleapis"
import { redisGet, redisIncr } from "@/lib/redis"

const SCOPES = ["https://www.googleapis.com/auth/indexing"]

export const DAILY_INDEXING_QUOTA = 200

type IndexResult =
  | { url: string; status: "fulfilled"; httpStatus: number }
  | { url: string; status: "rejected"; error: string }

type GoogleAuthClient = InstanceType<typeof google.auth.GoogleAuth>

export type IndexOptions = {
  batchMode?: boolean
}

function quotaKey(date = new Date()) {
  const day = date.toISOString().slice(0, 10)
  return `gsc:quota:${day}`
}

function secondsUntilTomorrow(date = new Date()) {
  const tomorrow = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1))
  return Math.max(60, Math.floor((tomorrow.getTime() - date.getTime()) / 1000))
}

export async function getIndexingQuota() {
  const raw = await redisGet(quotaKey())
  const used = Number(raw ?? 0)
  return { used, limit: DAILY_INDEXING_QUOTA }
}

export async function recordIndexingQuota(count: number) {
  if (count <= 0) return
  await redisIncr(quotaKey(), count, secondsUntilTomorrow())
}

async function indexUrlsBatch(urls: string[], auth: GoogleAuthClient): Promise<IndexResult[]> {
  const client = await auth.getClient()
  const tokenResponse = await client.getAccessToken()
  const token = typeof tokenResponse === "string" ? tokenResponse : tokenResponse?.token
  if (!token) {
    return urls.map((url) => ({ url, status: "rejected", error: "Missing access token" }))
  }

  const boundary = `batch_${typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Date.now()}`
  const body = urls
    .map((url, index) => {
      const payload = JSON.stringify({ url, type: "URL_UPDATED" })
      return [
        `--${boundary}`,
        "Content-Type: application/http",
        `Content-ID: <item-${index}>`,
        "",
        "POST /v3/urlNotifications:publish HTTP/1.1",
        "Content-Type: application/json",
        "",
        payload,
        "",
      ].join("\r\n")
    })
    .join("")
    .concat(`--${boundary}--`)

  const res = await fetch("https://indexing.googleapis.com/batch", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": `multipart/mixed; boundary=${boundary}`,
    },
    body,
  })

  if (!res.ok) {
    const errorText = await res.text()
    return urls.map((url) => ({
      url,
      status: "rejected",
      error: `Batch request failed (${res.status}): ${errorText || res.statusText}`,
    }))
  }

  return urls.map((url) => ({ url, status: "fulfilled", httpStatus: res.status }))
}

/** Notify Google that the given URLs have been updated.
 *  Returns an array of per-URL results from the Indexing API.
 */
export async function indexUrls(urls: string[], options: IndexOptions = {}) {
  const raw = process.env.GOOGLE_INDEXER_KEY
  if (!raw) {
    throw new Error("GOOGLE_INDEXER_KEY environment variable is not set")
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

  const batchMode = options.batchMode ?? false

  if (batchMode && urls.length > 1) {
    const results = await indexUrlsBatch(urls, auth)
    await recordIndexingQuota(urls.length)
    return results
  }

  const results = await Promise.allSettled(
    urls.map((url) =>
      indexing.urlNotifications.publish({
        requestBody: {
          url,
          type: "URL_UPDATED",
        },
      })
    )
  )

  await recordIndexingQuota(urls.length)

  return results.map((r, i) => ({
    url: urls[i],
    status: r.status,
    ...(r.status === "fulfilled"
      ? { httpStatus: r.value.status }
      : { error: (r.reason as Error)?.message ?? String(r.reason) }),
  }))
}
