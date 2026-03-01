import { NextRequest, NextResponse } from "next/server"
import { sendEmail } from "@/lib/email"

export const runtime = "nodejs"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  let body: { name?: string; email?: string; company?: string; message?: string }
  try {
    body = await req.json() as typeof body
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  try {
    const { name = "", email = "", company = "", message = "" } = body

    if (!email || typeof email !== "string" || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }
    if (!name || typeof name !== "string" || name.length < 2) {
      return NextResponse.json({ error: "Name required" }, { status: 400 })
    }

    const notifyTo = process.env.ENTERPRISE_NOTIFY_EMAIL || process.env.EMAIL_FROM
    if (!notifyTo) {
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
    }

    await sendEmail({
      to: notifyTo,
      replyTo: email,
      subject: `[Enterprise Anfrage] ${name}${company ? ` · ${company}` : ""}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#e5e7eb;padding:32px;border-radius:16px">
          <h1 style="color:#fff;font-size:22px;font-weight:900;margin-bottom:16px">🏢 Neue Enterprise-Anfrage</h1>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
            <tr>
              <td style="color:#9ca3af;padding:6px 0;width:110px">Name</td>
              <td style="color:#e5e7eb;padding:6px 0">${escHtml(name)}</td>
            </tr>
            <tr>
              <td style="color:#9ca3af;padding:6px 0">E-Mail</td>
              <td style="color:#e5e7eb;padding:6px 0"><a href="mailto:${escHtml(email)}" style="color:#ffa500">${escHtml(email)}</a></td>
            </tr>
            ${company ? `
            <tr>
              <td style="color:#9ca3af;padding:6px 0">Unternehmen</td>
              <td style="color:#e5e7eb;padding:6px 0">${escHtml(company)}</td>
            </tr>` : ""}
          </table>
          ${message ? `
          <div style="background:#111827;border:1px solid #374151;border-radius:12px;padding:16px;margin-bottom:24px">
            <div style="color:#9ca3af;font-size:12px;margin-bottom:8px;text-transform:uppercase;letter-spacing:.1em">Nachricht</div>
            <p style="color:#d1d5db;white-space:pre-wrap;margin:0">${escHtml(message)}</p>
          </div>` : ""}
          <p style="margin-top:32px;color:#6b7280;font-size:12px">ClawGuru · Enterprise Sales · clawguru.org</p>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[enterprise-contact]", err)
    return NextResponse.json({ error: "Send failed" }, { status: 500 })
  }
}

function escHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
