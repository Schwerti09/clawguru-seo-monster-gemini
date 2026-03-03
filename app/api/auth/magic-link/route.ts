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

    const token = signMagicToken(email)
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const magicLink = `${siteUrl}/api/auth/verify?token=${encodeURIComponent(token)}`

    if (process.env.RESEND_API_KEY && process.env.EMAIL_FROM) {
      await sendEmail({
        to: email,
        subject: "Your ClawGuru Login Link",
        html: `
          <p>Klick den Link unten, um dich bei ClawGuru einzuloggen. Der Link ist 15 Minuten gültig.</p>
          <p><a href="${magicLink}" style="font-weight:bold">Login to ClawGuru →</a></p>
          <p style="color:#888;font-size:12px">Falls du das nicht angefordert hast, kannst du diese E-Mail ignorieren.</p>
        `,
        replyTo: "support@clawguru.org",
      })
    } else {
      // Dev / test: log to console
      console.log(`[magic-link] Login link for ${email}: ${magicLink}`)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[magic-link]", err)
    return NextResponse.json({ error: "Failed to send magic link" }, { status: 500 })
  }
}
