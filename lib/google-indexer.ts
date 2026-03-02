// lib/google-indexer.ts
// Google Indexing API helper.
// Reads the service-account key from GOOGLE_INDEXER_KEY (JSON string) and submits
// URL_UPDATED notifications via the Indexing API.

import { base64ToBytes, base64UrlEncode, encodeUtf8 } from "@/lib/edge-crypto"

const SCOPES = ["https://www.googleapis.com/auth/indexing"]
const TOKEN_URL = "https://oauth2.googleapis.com/token"
const INDEXING_URL = "https://indexing.googleapis.com/v3/urlNotifications:publish"

type ServiceAccountKey = {
  client_email: string
  private_key: string
  token_uri?: string
}

function pemToArrayBuffer(pem: string) {
  const cleaned = pem.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----/g, "").replace(/\s+/g, "")
  return base64ToBytes(cleaned)
}

async function signJwt(key: ServiceAccountKey, scope: string) {
  const now = Math.floor(Date.now() / 1000)
  const header = base64UrlEncode(JSON.stringify({ alg: "RS256", typ: "JWT" }))
  const payload = base64UrlEncode(
    JSON.stringify({
      iss: key.client_email,
      scope,
      aud: key.token_uri || TOKEN_URL,
      iat: now,
      exp: now + 3600,
    })
  )
  const data = `${header}.${payload}`
  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(key.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, encodeUtf8(data))
  return `${data}.${base64UrlEncode(new Uint8Array(signature))}`
}

async function getAccessToken(key: ServiceAccountKey) {
  const assertion = await signJwt(key, SCOPES.join(" "))
  const res = await fetch(key.token_uri || TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  })
  if (!res.ok) {
    throw new Error(`Token exchange failed (${res.status})`)
  }
  const json = (await res.json()) as { access_token?: string }
  if (!json.access_token) throw new Error("Missing access token")
  return json.access_token
}

/** Notify Google that the given URLs have been updated.
 *  Returns an array of per-URL results from the Indexing API.
 */
export async function indexUrls(urls: string[]) {
  const raw = process.env.GOOGLE_INDEXER_KEY
  if (!raw) {
    throw new Error("GOOGLE_INDEXER_KEY environment variable is not set")
  }

  let keyFile: ServiceAccountKey
  try {
    keyFile = JSON.parse(raw) as ServiceAccountKey
  } catch {
    throw new Error("GOOGLE_INDEXER_KEY is not valid JSON. Ensure the service-account key is stored as a JSON string.")
  }

  const accessToken = await getAccessToken(keyFile)
  const results = await Promise.allSettled(
    urls.map((url) =>
      fetch(INDEXING_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, type: "URL_UPDATED" }),
      }).then(async (res) => {
        if (!res.ok) {
          const detail = await res.text().catch(() => "")
          throw new Error(`Indexing failed (${res.status}): ${detail}`)
        }
        return res.status
      })
    )
  )

  return results.map((r, i) => ({
    url: urls[i],
    status: r.status,
    ...(r.status === "fulfilled"
      ? { httpStatus: r.value }
      : { error: (r.reason as Error)?.message ?? String(r.reason) }),
  }))
}
