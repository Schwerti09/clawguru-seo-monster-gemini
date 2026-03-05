import { NextRequest, NextResponse } from "next/server"
import { addEnterpriseRequest } from "@/lib/enterprise-requests"

export const runtime = "nodejs"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const name = String(body.name || "").trim()
  const email = String(body.email || "").trim()
  const company = String(body.company || "").trim()
  const message = String(body.message || "").trim()

  if (!name) return NextResponse.json({ error: "Name ist erforderlich." }, { status: 422 })
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Ungültige E-Mail-Adresse." }, { status: 422 })

  const entry = addEnterpriseRequest({ name, email, company, message })
  console.log(`[enterprise-contact] Anfrage gespeichert (id=${entry.id}) von ${email}`)

  return NextResponse.json({ ok: true })
}
