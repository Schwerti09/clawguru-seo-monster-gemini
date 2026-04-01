import { NextRequest, NextResponse } from "next/server"
import { getRequestId } from "@/lib/ops/request-id"
import { logTelemetry } from "@/lib/ops/telemetry"

export const dynamic = "force-dynamic"

type CheckEvent =
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

    logTelemetry("check.analytics", {
      requestId,
      event: body.event,
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
