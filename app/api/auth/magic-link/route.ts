import { NextRequest, NextResponse } from "next/server"
import { signMagicToken } from "@/lib/auth"
import { sendEmail } from "@/lib/email"

export const runtime = "nodejs"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : ""

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 })
    }

    console.log(`[magic-link] Magic Link angefordert für E-Mail: ${email}`)

    const apiKey = process.env.RESEND_API_KEY
    console.log(
      `[magic-link] RESEND_API_KEY vorhanden: ${apiKey ? `ja (Länge: ${apiKey.length})` : "nein"}`
    )

    const token = signMagicToken(email)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const magicLink = `${siteUrl}/api/auth/verify?token=${encodeURIComponent(token)}`

    console.log(`[magic-link] Sende Magic Link an ${email} …`)

    const { id } = await sendEmail({
      to: email,
      subject: "Your ClawGuru Login Link",
      html: `
        <p>Klick den Link unten, um dich bei ClawGuru einzuloggen. Der Link ist 15 Minuten gültig.</p>
        <p><a href="${magicLink}" style="font-weight:bold">Login to ClawGuru →</a></p>
        <p style="color:#888;font-size:12px">Falls du das nicht angefordert hast, kannst du diese E-Mail ignorieren.</p>
      `,
      replyTo: "support@clawguru.org",
    })

    console.log(`[magic-link] E-Mail erfolgreich gesendet → Message ID: ${id ?? "(unknown)"}`)

    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("[magic-link] Fehler beim Senden des Magic Links:", message)
    return NextResponse.json({ error: "Failed to send magic link" }, { status: 500 })
  }
}
