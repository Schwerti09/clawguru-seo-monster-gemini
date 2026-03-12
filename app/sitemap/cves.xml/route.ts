import { NextRequest, NextResponse } from "next/server"
import { logTelemetry } from "@/lib/ops/telemetry"
import { getRequestId } from "@/lib/ops/request-id"

export async function GET(req: NextRequest) {
  const requestId = getRequestId(req.headers)
  const startedAt = Date.now()
  const target = new URL("/sitemap.xml", req.url)

  logTelemetry("sitemap.legacy_child.redirect", {
    requestId,
    from: new URL(req.url).pathname,
    target: target.toString(),
    durationMs: Date.now() - startedAt,
  })

  return NextResponse.redirect(target, 308)
}
