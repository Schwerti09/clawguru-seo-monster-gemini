import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(req: NextRequest) {
  const payload = await req.json().catch(() => null)
  const email = typeof payload?.email === "string" ? payload.email.trim() : ""
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
