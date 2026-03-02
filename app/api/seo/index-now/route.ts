// app/api/seo/index-now/route.ts
// Submits the newest 200 URLs to Google via the Indexing API.
// Must be called with the correct CRON_SECRET to prevent abuse.

import { NextRequest, NextResponse } from "next/server"
import { KNOWN_CVES } from "@/lib/cve-pseo"
import { get100kSlugsPage } from "@/lib/pseo"
import { indexUrls } from "@/lib/google-indexer"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const BATCH_SIZE = 200

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
  const cveUrls = KNOWN_CVES.map(
    (cve) => `${BASE_URL}/solutions/fix-${cve.cveId}`
  )

  // 2. Dynamic runbook URLs (fill the remainder of the 200-URL batch)
  const remaining = Math.max(0, BATCH_SIZE - cveUrls.length)
  const runbookSlugs = get100kSlugsPage(0, remaining)
  const runbookUrls = runbookSlugs.map(
    (slug) => `${BASE_URL}/runbook/${slug}`
  )

  const urls = [...cveUrls, ...runbookUrls].slice(0, BATCH_SIZE)

  const results = await indexUrls(urls)

  const fulfilled = results.filter((r) => r.status === "fulfilled").length
  const rejected = results.filter((r) => r.status === "rejected").length

  console.log(`[seo/index-now] submitted=${urls.length} ok=${fulfilled} err=${rejected}`)

  return NextResponse.json({
    submitted: urls.length,
    ok: fulfilled,
    errors: rejected,
    results,
    generatedAt: new Date().toISOString(),
  })
}
