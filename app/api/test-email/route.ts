import { NextResponse } from "next/server"
import { sendEmail } from "@/lib/email"

export const runtime = "nodejs"

export async function GET() {
  const TEST_RECIPIENT = process.env.TEST_EMAIL_RECIPIENT || "rolf@clawguru.org"

  try {
    console.log(`[test-email] Sende Test-Mail an ${TEST_RECIPIENT} …`)

    const { id } = await sendEmail({
      to: TEST_RECIPIENT,
      subject: "ClawGuru – Test-Mail",
      html: `<p>Dies ist eine automatische Test-Mail, um zu prüfen, ob Resend korrekt konfiguriert ist.</p>`,
      replyTo: "support@clawguru.org",
    })

    console.log(`[test-email] Erfolgreich gesendet → Message ID: ${id ?? "(unknown)"}`)
    return NextResponse.json({ success: true, message: "Test-Mail gesendet", id: id ?? null })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("[test-email] Fehler beim Senden:", message)
    return NextResponse.json(
      { success: false, message: "Test-Mail fehlgeschlagen", error: message },
      { status: 500 }
    )
  }
}
