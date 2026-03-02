/**
 * lib/google-indexer.ts
 *
 * Google Search Console Indexing API helper.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * Service Account Setup (one-time):
 *   1. Go to Google Cloud Console → IAM & Admin → Service Accounts.
 *   2. Create a service account, download the JSON key.
 *   3. In Google Search Console → Settings → Users & permissions → Add user,
 *      add the service account email as "Owner".
 *   4. In Netlify → Site settings → Environment variables, add:
 *        GOOGLE_SERVICE_ACCOUNT_JSON  ← paste the entire JSON key file content
 *        NEXT_PUBLIC_SITE_URL          ← e.g. https://clawguru.org
 *
 * How it works:
 *   • Builds a priority URL list: CVE solution pages first, then runbooks.
 *   • Filters out URLs already submitted within the last 7 days (quota guard).
 *   • Submits up to DAILY_LIMIT (200) URLs via indexing.urlNotifications.publish.
 *   • Persists sent-URL timestamps to INDEXING_STATE_FILE so the 7-day guard
 *     works within a single warm Lambda container invocation.
 *     ⚠ NOTE: /tmp is ephemeral and is reset on every cold start, so the
 *     7-day guard resets too.  For a production deployment, replace the file
 *     store with a persistent backend (Netlify Blobs, Redis, Upstash, etc.)
 *     and point INDEXING_STATE_FILE at that adapter, or swap loadSentMap /
 *     saveSentMap for async KV calls.
 * ────────────────────────────────────────────────────────────────────────────
 */

import { google } from "googleapis"
import * as fs from "fs"
import * as path from "path"
import { KNOWN_CVES } from "./cve-pseo"
import { RUNBOOKS, get100kSlugsPage, SITEMAP_PAGE_SIZE_100K } from "./pseo"

// ── Constants ────────────────────────────────────────────────────────────────

/** Maximum URLs sent per day (Google Indexing API standard quota). */
export const DAILY_LIMIT = 200

/** Re-submission cooldown in milliseconds (7 days). */
const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000

/** Path used to persist submission timestamps across warm Lambda containers. */
const STATE_FILE =
  process.env.INDEXING_STATE_FILE ?? path.join("/tmp", "indexing-sent.json")

// ── State persistence ────────────────────────────────────────────────────────

/** Map of URL → last submission timestamp (Unix ms). */
type SentMap = Record<string, number>

function loadSentMap(): SentMap {
  try {
    const raw = fs.readFileSync(STATE_FILE, "utf8")
    return JSON.parse(raw) as SentMap
  } catch {
    return {}
  }
}

function saveSentMap(sent: SentMap): void {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(sent), "utf8")
  } catch (err) {
    console.warn("[google-indexer] Could not persist state file:", err)
  }
}

/** Prune entries older than the cooldown window to keep the state file small. */
function pruneOldEntries(sent: SentMap): SentMap {
  const cutoff = Date.now() - COOLDOWN_MS
  return Object.fromEntries(
    Object.entries(sent).filter(([, ts]) => ts > cutoff)
  )
}

// ── URL generation ───────────────────────────────────────────────────────────

/**
 * Builds a priority-sorted list of all indexable URLs:
 *   1. CVE solution pages   (/solutions/fix-[cveId])   – highest priority
 *   2. Runbook pages         (/runbook/[slug])
 *   3. Programmatic 100 k pages (first page only to avoid memory pressure)
 */
export function buildPriorityUrlList(base: string): string[] {
  const urls: string[] = []

  // Priority 1 – CVE solutions (most time-sensitive content)
  for (const cve of KNOWN_CVES) {
    urls.push(`${base}/solutions/fix-${cve.slug}`)
  }

  // Priority 2 – Runbooks
  for (const rb of RUNBOOKS) {
    urls.push(`${base}/runbook/${rb.slug}`)
  }

  // Priority 3 – 100k programmatic pages (first page)
  const firstPageSlugs = get100kSlugsPage(0, SITEMAP_PAGE_SIZE_100K)
  for (const slug of firstPageSlugs) {
    urls.push(`${base}/runbook/${slug}`)
  }

  // Deduplicate while preserving order
  return [...new Set(urls)]
}

// ── Google API client ────────────────────────────────────────────────────────

/**
 * Creates an authenticated Google Indexing API client.
 *
 * Credentials are read from the GOOGLE_SERVICE_ACCOUNT_JSON environment
 * variable (preferred for Netlify) or from GOOGLE_APPLICATION_CREDENTIALS
 * (standard ADC file path for local development).
 */
function createIndexingClient() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  const credentials = raw ? (JSON.parse(raw) as object) : undefined

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/indexing"],
  })

  return google.indexing({ version: "v3", auth })
}

// ── Core indexing logic ──────────────────────────────────────────────────────

export interface IndexingResult {
  submitted: string[]
  skipped: string[]
  errors: Array<{ url: string; error: string }>
}

/**
 * Submits up to DAILY_LIMIT URLs to the Google Indexing API.
 *
 * @param overrideBase  Override the site base URL (useful in tests).
 * @returns             Summary of submitted, skipped, and failed URLs.
 */
export async function runDailyIndexing(
  overrideBase?: string
): Promise<IndexingResult> {
  const base =
    overrideBase ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://clawguru.org"

  const sent = pruneOldEntries(loadSentMap())
  const now = Date.now()

  const allUrls = buildPriorityUrlList(base)

  // Filter out URLs submitted within the cooldown window
  const eligible = allUrls.filter(
    (url) => !sent[url] || now - sent[url] > COOLDOWN_MS
  )

  const batch = eligible.slice(0, DAILY_LIMIT)
  const eligibleSet = new Set(eligible)
  const skipped = allUrls.filter((url) => !eligibleSet.has(url))

  const result: IndexingResult = { submitted: [], skipped, errors: [] }

  if (batch.length === 0) {
    console.log("[google-indexer] No eligible URLs to submit today.")
    return result
  }

  const indexing = createIndexingClient()

  for (const url of batch) {
    try {
      await indexing.urlNotifications.publish({
        requestBody: { url, type: "URL_UPDATED" },
      })
      sent[url] = now
      result.submitted.push(url)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`[google-indexer] Failed to submit ${url}:`, msg)
      result.errors.push({ url, error: msg })
    }
  }

  saveSentMap(sent)

  console.log(
    `[google-indexer] submitted=${result.submitted.length}` +
      ` skipped=${result.skipped.length}` +
      ` errors=${result.errors.length}`
  )

  return result
}
