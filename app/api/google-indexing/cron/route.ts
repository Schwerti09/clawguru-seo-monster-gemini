// app/api/google-indexing/cron/route.ts
// Next.js API route – triggers the Google Indexing API batch submission.
// Called daily by the Netlify Scheduled Function (netlify/functions/daily-index.mts).
// Secured by CRON_SECRET to prevent unauthorised triggering.

import { NextRequest, NextResponse } from "next/server"
import { runDailyIndexing } from "@/lib/google-indexer"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  // When CRON_SECRET is not set the route is callable without auth,
  // intentionally mirroring the existing /api/health/cron behaviour so
  // development environments work without configuration.
  if (secret) {
    const auth = req.headers.get("authorization") ?? ""
    const param = req.nextUrl.searchParams.get("secret") ?? ""
    if (auth !== `Bearer ${secret}` && param !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  try {
    const result = await runDailyIndexing()
    return NextResponse.json(
      { ok: true, ...result },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("[google-indexing/cron] Failed:", message)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
