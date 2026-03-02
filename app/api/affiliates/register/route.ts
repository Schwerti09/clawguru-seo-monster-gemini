import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(req: NextRequest) {
  const payload = await req.json().catch(() => null)
  const email = typeof payload?.email === "string" ? payload.email.trim() : ""
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 })
  }

  const fallbackId = () => {
    const bytes = crypto.getRandomValues(new Uint8Array(16))
    return Array.from(bytes)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("")
  }

  const affiliateId = typeof crypto?.randomUUID === "function" ? crypto.randomUUID() : fallbackId()

  return NextResponse.json({ affiliateId })
}
