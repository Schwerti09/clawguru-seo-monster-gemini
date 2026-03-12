import { NextRequest, NextResponse } from "next/server"
import path from "path"
import fs from "fs/promises"
import { cookies } from "next/headers"
import { verifyAccessToken } from "@/lib/access-token"
import { stripe } from "@/lib/stripe"

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
  const key = req.nextUrl.searchParams.get("key") || ""
  const session_id = req.nextUrl.searchParams.get("session_id") || ""
  const f = fileForKey(key)
  if (!f) return NextResponse.json({ error: "Invalid key" }, { status: 400 })

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
    return NextResponse.json({ error: "Not authorized" }, { status: 403 })
  }

  try {
    const full = path.join(process.cwd(), "public", "downloads", f.filename)
    // Fail explicitly when the asset is not present (better than generic 500)
    try {
      await fs.stat(full)
    } catch {
      console.error("[download] file missing", { key, path: full })
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }
    const data = await fs.readFile(full)
    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": f.type,
        "Content-Disposition": `attachment; filename="${f.filename}"`,
        "Cache-Control": "private, no-store"
      }
    })
  } catch {
    return NextResponse.json({ error: "Download failed" }, { status: 500 })
  }
}
