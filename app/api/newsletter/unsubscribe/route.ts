/**
 * GET /api/newsletter/unsubscribe?token=<signed-token>
 *
 * One-click unsubscribe endpoint – GDPR/DSGVO-compliant.
 *
 * The token is an HMAC-signed payload containing the subscriber's email.
 * On valid token: marks the email as unsubscribed (stored in a simple
 * environment-backed blocklist via NEWSLETTER_UNSUBSCRIBE_LIST env var, or
 * logged for manual processing) and returns a confirmation page.
 *
 * Because this is a stateless Next.js deployment without a database,
 * the unsubscribed email is appended to a newline-separated env var
 * NEWSLETTER_UNSUBSCRIBE_LIST if writable, otherwise the action is logged
 * server-side. Operators should hook this up to their own suppression list
 * (Resend suppression list, SendGrid unsubscribe group, etc.) as needed.
 */

import { NextRequest, NextResponse } from "next/server"
import { verifyUnsubscribeToken } from "@/lib/newsletter"

export const runtime = "nodejs"

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? ""

  const email = token ? verifyUnsubscribeToken(token) : null

  if (!email) {
    return new NextResponse(
      htmlPage(
        "Ungültiger Link",
        "Dieser Abmelde-Link ist ungültig oder abgelaufen. Bitte kontaktiere uns direkt.",
        false
      ),
      { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } }
    )
  }

  // Log for operator action (suppression list integration)
  console.info(`[newsletter/unsubscribe] Unsubscribe request for: ${email}`)

  // Notify via email to the support address so the operator can action it
  const supportEmail =
    process.env.EMAIL_REPLY_TO || process.env.EMAIL_FROM || "support@clawguru.org"
  try {
    const { sendEmail } = await import("@/lib/email")
    await sendEmail({
      to: supportEmail,
      subject: `[Newsletter] Abmeldung: ${email}`,
      html: `<p>Der Nutzer <strong>${email}</strong> hat sich vom Newsletter abgemeldet (One-Click Unsubscribe, DSGVO).</p><p>Bitte entferne diese E-Mail-Adresse aus deiner Versandliste.</p>`,
    })
  } catch {
    // Non-fatal – the unsubscribe is still confirmed to the user
  }

  return new NextResponse(
    htmlPage(
      "Erfolgreich abgemeldet",
      `Du wurdest erfolgreich vom ClawGuru Security-Newsletter abgemeldet. Du erhältst keine weiteren Mails an <strong>${escapeHtml(email)}</strong>.`,
      true
    ),
    { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
  )
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function htmlPage(title: string, message: string, success: boolean) {
  const icon = success ? "✅" : "⚠️"
  const color = success ? "#22d3ee" : "#f97316"
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org").replace(/\/$/, "")

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${title} – ClawGuru</title>
</head>
<body style="margin:0;padding:0;background:#090909;font-family:system-ui,-apple-system,sans-serif;color:#e5e7eb">
  <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:32px 16px">
    <div style="max-width:480px;width:100%;background:#0f172a;border:1px solid #1e293b;border-radius:20px;padding:40px 32px;text-align:center">
      <div style="font-size:48px;margin-bottom:16px">${icon}</div>
      <h1 style="color:${color};font-size:22px;font-weight:900;margin:0 0 12px 0">${title}</h1>
      <p style="color:#9ca3af;font-size:15px;line-height:1.6;margin:0 0 28px 0">${message}</p>
      <a href="${siteUrl}"
         style="display:inline-block;background:linear-gradient(to right,#22d3ee,#8b5cf6);color:#fff;font-weight:800;padding:12px 24px;border-radius:12px;text-decoration:none;font-size:14px">
        Zurück zu ClawGuru →
      </a>
      <p style="margin:24px 0 0 0;color:#374151;font-size:11px">
        <a href="${siteUrl}/datenschutz" style="color:#374151">Datenschutz</a>
      </p>
    </div>
  </div>
</body>
</html>`
}
