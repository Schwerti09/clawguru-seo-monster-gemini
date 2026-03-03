// app/api/seo/index-now/route.ts
// Submits the newest 200 URLs to Google via the Indexing API.
// Prioritizes the newest, highest-severity CVEs first (for example, "Final 15k Push").
// Must be called with the correct CRON_SECRET to prevent abuse.

import { NextRequest, NextResponse } from "next/server"
import { KNOWN_CVES, type CveSeverity } from "@/lib/cve-pseo"
import { get100kSlugsPage } from "@/lib/pseo"
import { DAILY_INDEXING_QUOTA, getIndexingQuota, indexUrls } from "@/lib/google-indexer"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const BATCH_SIZE = 200
const BATCH_MODE = process.env.GOOGLE_INDEXER_BATCH_MODE !== "false"
const INDEXING_BATCH_LABEL = process.env.INDEXING_BATCH_LABEL ?? "CVE Priority Batch"

// Higher number = higher priority in the IndexNow batch ordering.
const SEVERITY_PRIORITY: Record<CveSeverity, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
}

// Parse an ISO date string (YYYY-MM-DD) into a timestamp, or null if invalid.
function parsePublishedDate(date: string) {
  const parsed = Date.parse(date)
  return Number.isNaN(parsed) ? null : parsed
}

// KNOWN_CVES is static seed data, so we sort once at module load.
const SORTED_CVES = [...KNOWN_CVES].sort((a, b) => {
  const severityDelta = SEVERITY_PRIORITY[b.severity] - SEVERITY_PRIORITY[a.severity]
  if (severityDelta !== 0) return severityDelta
  const dateA = parsePublishedDate(a.publishedDate)
  const dateB = parsePublishedDate(b.publishedDate)
  if (dateA === null && dateB === null) return 0
  if (dateA === null) return 1
  if (dateB === null) return -1
  return dateB - dateA
})

export async function GET(req: NextRequest) {
  // Security: require CRON_SECRET
  const secret = process.env.CRON_SECRET
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET is not configured" }, { status: 500 })
  }
  const auth = req.headers.get("authorization") ?? ""
  const param = req.nextUrl.searchParams.get("secret") ?? ""
  if (auth !== `Bearer ${secret}` && param !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // 1. CVE solution URLs
  const cveUrls = SORTED_CVES.map((cve) => `${BASE_URL}/solutions/fix-${cve.cveId}`)

  // 2. Dynamic runbook URLs (fill the remainder of the 200-URL batch)
  const remaining = Math.max(0, BATCH_SIZE - cveUrls.length)
  const runbookSlugs = get100kSlugsPage(0, remaining)
  const runbookUrls = runbookSlugs.map(
    (slug) => `${BASE_URL}/runbook/${slug}`
  )

  const quota = await getIndexingQuota()
  const remainingQuota = Math.max(0, DAILY_INDEXING_QUOTA - quota.used)
  const maxBatch = Math.min(BATCH_SIZE, remainingQuota)
  const urls = [...cveUrls, ...runbookUrls].slice(0, maxBatch)

  if (urls.length === 0) {
    const now = new Date()
    const resetAt = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)).toISOString()
    return NextResponse.json({
      submitted: 0,
      ok: 0,
      errors: 0,
      results: [],
      quota: { used: quota.used, limit: DAILY_INDEXING_QUOTA },
      generatedAt: new Date().toISOString(),
      message: `Daily quota exhausted. Resets at ${resetAt}`,
      batchLabel: INDEXING_BATCH_LABEL,
    })
  }

  const results = await indexUrls(urls, { batchMode: BATCH_MODE })

  const fulfilled = results.filter((r) => r.status === "fulfilled").length
  const rejected = results.filter((r) => r.status === "rejected").length

  console.log(`[seo/index-now] submitted=${urls.length} ok=${fulfilled} err=${rejected}`)

  return NextResponse.json({
    submitted: urls.length,
    ok: fulfilled,
    errors: rejected,
    results,
    quota: { used: quota.used + urls.length, limit: DAILY_INDEXING_QUOTA },
    generatedAt: new Date().toISOString(),
    batchLabel: INDEXING_BATCH_LABEL,
  })
}
