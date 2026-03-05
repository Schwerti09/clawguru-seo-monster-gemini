import { NextRequest, NextResponse } from "next/server"
import { sendEmail } from "@/lib/email"

export const runtime = "nodejs"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function escHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
}

function notificationHtml(name: string, email: string, company: string, message: string) {
  return `
<div style="font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial; line-height: 1.5; color:#111;">
  <h2 style="margin:0 0 10px 0;">ClawGuru Enterprise – neue Anfrage</h2>
  <table style="border-collapse:collapse; width:100%; font-size:14px;">
    <tr><td style="padding:6px 10px; font-weight:700; width:120px; border:1px solid #eee;">Name</td><td style="padding:6px 10px; border:1px solid #eee;">${escHtml(name)}</td></tr>
    <tr><td style="padding:6px 10px; font-weight:700; border:1px solid #eee;">E-Mail</td><td style="padding:6px 10px; border:1px solid #eee;">${escHtml(email)}</td></tr>
    <tr><td style="padding:6px 10px; font-weight:700; border:1px solid #eee;">Unternehmen</td><td style="padding:6px 10px; border:1px solid #eee;">${escHtml(company)}</td></tr>
    <tr><td style="padding:6px 10px; font-weight:700; border:1px solid #eee;">Nachricht</td><td style="padding:6px 10px; border:1px solid #eee; white-space:pre-wrap;">${escHtml(message)}</td></tr>
  </table>
</div>`
}

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

  const to = process.env.ENTERPRISE_CONTACT_EMAIL || "support@clawguru.org"

  const apiKey = process.env.RESEND_API_KEY
  console.log(
    `[enterprise-contact] RESEND_API_KEY vorhanden: ${apiKey ? `ja (Länge: ${apiKey.length})` : "nein"}`
  )
  console.log(`[enterprise-contact] Enterprise Anfrage von ${email} an ${to}`)

  try {
    console.log(`[enterprise-contact] Sende Enterprise-Anfrage von ${name} an ${to} …`)

    const { id } = await sendEmail({
      from: "ClawGuru <hello@clawguru.org>",
      to,
      subject: `Enterprise Anfrage von ${name}${company ? ` (${company})` : ""}`,
      html: notificationHtml(name, email, company, message),
      replyTo: email,
    })

    console.log(`[enterprise-contact] E-Mail erfolgreich gesendet → Message ID: ${id ?? "(unknown)"}`)
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : String(err)
    console.error("[enterprise-contact] Fehler beim Senden:", errMessage)
    return NextResponse.json({ error: "E-Mail konnte nicht gesendet werden. Bitte versuche es später erneut." }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
