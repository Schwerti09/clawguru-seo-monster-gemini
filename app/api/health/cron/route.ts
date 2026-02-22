// File: app/api/health/cron/route.ts
// Scheduled self-health endpoint – call via Netlify Scheduled Function or external cron.
// Secured by CRON_SECRET to prevent unauthorised triggering.

import { NextRequest, NextResponse } from "next/server"
import { checkSiteHealth } from "@/lib/selfhealth"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = req.headers.get("authorization") ?? ""
    const param = req.nextUrl.searchParams.get("secret") ?? ""
    if (auth !== `Bearer ${secret}` && param !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  const alertEmail = process.env.HEALTH_ALERT_EMAIL || undefined

  try {
    const report = await checkSiteHealth({ alertEmail })
    return NextResponse.json(report, {
      status: report.ok ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json(
      { ok: false, score: 0, ts: new Date().toISOString(), error: message },
      { status: 500 }
    )
  }
}
