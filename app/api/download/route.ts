import { NextRequest, NextResponse } from "next/server"
import path from "path"
import fs from "fs/promises"
import { cookies } from "next/headers"
import { verifyAccessToken } from "@/lib/access-token"
import { stripe } from "@/lib/stripe"
import { logTelemetry } from "@/lib/ops/telemetry"
import { getRequestId } from "@/lib/ops/request-id"

export const runtime = "nodejs"

function fileForKey(key: string) {
  if (key === "sprint-pack") return { filename: "sprint-pack.zip", type: "application/zip" }
  if (key === "incident-kit") return { filename: "incident-kit.zip", type: "application/zip" }
  return null
}

async function sessionAllows(session_id: string) {
  // Legacy support: allow downloads when the checkout session is paid.
  const session = await stripe.checkout.sessions.retrieve(session_id)
  return session.payment_status === "paid" || session.status === "complete"
}

export async function GET(req: NextRequest) {
  const requestId = getRequestId(req.headers)
  const startedAt = Date.now()
  const key = req.nextUrl.searchParams.get("key") || ""
  const session_id = req.nextUrl.searchParams.get("session_id") || ""
  logTelemetry("download.request", {
    requestId,
    key,
    hasSessionId: Boolean(session_id),
  })
  const f = fileForKey(key)
  if (!f) {
    logTelemetry("download.error", {
      requestId,
      key,
      reason: "invalid_key",
      durationMs: Date.now() - startedAt,
    })
    return NextResponse.json({ error: "Invalid key" }, { status: 400 })
  }

  // New primary auth: access cookie
  const token = (await cookies()).get("claw_access")?.value || ""
  const payload = token ? verifyAccessToken(token) : null

  let ok = Boolean(payload)

  // Fallback: legacy session_id
  if (!ok && session_id) {
    try {
      ok = await sessionAllows(session_id)
    } catch {
      ok = false
    }
  }

  if (!ok) {
    console.warn("[download] not authorized", {
      key,
      hasCookie: Boolean(token),
      cookieValid: Boolean(payload),
      hasSessionId: Boolean(session_id),
    })
    logTelemetry("download.error", {
      requestId,
      key,
      reason: "not_authorized",
      hasCookie: Boolean(token),
      cookieValid: Boolean(payload),
      hasSessionId: Boolean(session_id),
      durationMs: Date.now() - startedAt,
    })
    return NextResponse.json({ error: "Not authorized" }, { status: 403 })
  }

  try {
    const full = path.join(process.cwd(), "public", "downloads", f.filename)
    // Fail explicitly when the asset is not present (better than generic 500)
    try {
      await fs.stat(full)
    } catch {
      console.error("[download] file missing", { key, path: full })
      logTelemetry("download.error", {
        requestId,
        key,
        reason: "file_missing",
        durationMs: Date.now() - startedAt,
      })
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }
    const data = await fs.readFile(full)
    logTelemetry("download.success", {
      requestId,
      key,
      filename: f.filename,
      durationMs: Date.now() - startedAt,
    })
    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": f.type,
        "Content-Disposition": `attachment; filename="${f.filename}"`,
        "Cache-Control": "private, no-store"
      }
    })
  } catch {
    logTelemetry("download.error", {
      requestId,
      key,
      reason: "read_failed",
      durationMs: Date.now() - startedAt,
    })
    return NextResponse.json({ error: "Download failed" }, { status: 500 })
  }
}
