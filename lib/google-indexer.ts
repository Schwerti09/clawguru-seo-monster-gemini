// lib/google-indexer.ts
// Google Indexing API helper.
// Reads the service-account key from GOOGLE_INDEXER_KEY (JSON string) and submits
// URL_UPDATED notifications via the Indexing API.

import { google } from "googleapis"

const SCOPES = ["https://www.googleapis.com/auth/indexing"]

/** Notify Google that the given URLs have been updated.
 *  Returns an array of per-URL results from the Indexing API.
 */
export async function indexUrls(urls: string[]) {
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

  return results.map((r, i) => ({
    url: urls[i],
    status: r.status,
    ...(r.status === "fulfilled"
      ? { httpStatus: r.value.status }
      : { error: (r.reason as Error)?.message ?? String(r.reason) }),
  }))
}
