import { NextRequest, NextResponse } from "next/server"
import { signMagicToken } from "@/lib/auth"
import { sendEmail } from "@/lib/email"

export const runtime = "nodejs"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Per-email rate limit: allow at most 1 request every 3 minutes. */
const RATE_LIMIT_MS = 3 * 60 * 1000
const emailLastSent = new Map<string, number>()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : ""

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 })
    }

    console.log(`[magic-link] Magic Link angefordert für E-Mail: ${email}`)

    // Per-email rate limit: reject if last send was less than 3 minutes ago
    const now = Date.now()
    const lastSent = emailLastSent.get(email)
    if (lastSent && now - lastSent < RATE_LIMIT_MS) {
      const retryAfterSec = Math.ceil((RATE_LIMIT_MS - (now - lastSent)) / 1000)
      console.log(`[magic-link] Rate-Limit für ${email} – bitte in ${retryAfterSec}s erneut versuchen`)
      return NextResponse.json(
        { error: `Bitte warte noch ${retryAfterSec} Sekunden, bevor du einen neuen Link anforderst.` },
        { status: 429 }
      )
    }

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
        <p>Klick den Link unten, um dich bei ClawGuru einzuloggen. Der Link ist 30 Minuten gültig.</p>
        <p><a href="${magicLink}" style="font-weight:bold">Login to ClawGuru →</a></p>
        <p style="color:#888;font-size:12px">Falls du das nicht angefordert hast, kannst du diese E-Mail ignorieren.</p>
      `,
      replyTo: "support@clawguru.org",
    })

    emailLastSent.set(email, now)
    // Prune stale entries to prevent unbounded Map growth
    for (const [key, ts] of emailLastSent) {
      if (now - ts >= RATE_LIMIT_MS) emailLastSent.delete(key)
    }
    console.log(`[magic-link] E-Mail erfolgreich gesendet → Message ID: ${id ?? "(unknown)"}`)

    return NextResponse.json({ ok: true, message: "Neuer Magic Link wurde gesendet" })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("[magic-link] Fehler beim Senden des Magic Links:", message)
    return NextResponse.json({ error: "Failed to send magic link" }, { status: 500 })
  }
}
