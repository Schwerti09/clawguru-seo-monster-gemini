import { NextRequest, NextResponse } from "next/server"
import { getRequestId } from "@/lib/ops/request-id"
import { logTelemetry } from "@/lib/ops/telemetry"
import { recordCheckFunnelEvent } from "@/lib/check-funnel"

export const dynamic = "force-dynamic"

type CheckEvent =
  | "check_page_view"
  | "check_start"
  | "check_result"
  | "check_error"
  | "methodik_click"
  | "share_click"
  | "pricing_click"
  | "hardening_link_click"

export async function POST(req: NextRequest) {
  try {
    const requestId = getRequestId(req.headers)
    const body = (await req.json().catch(() => ({}))) as {
      event?: CheckEvent | string
      data?: Record<string, unknown>
    }

    if (!body?.event) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    const e = body.event as CheckEvent
    recordCheckFunnelEvent(e)

    logTelemetry("check.analytics", {
      requestId,
      event: e,
      data: JSON.stringify(body.data ?? {}).slice(0, 800),
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[analytics/check]", error)
    // Never block UX if analytics fails.
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
