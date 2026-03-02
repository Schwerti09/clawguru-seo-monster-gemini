// File: app/api/retention/weekly/route.ts
// Weekly retention loop for Active Defenders – sends personalized security alerts.

import { NextRequest, NextResponse } from "next/server"
import { sendEmail } from "@/lib/email"
import { currentWeekLabel } from "@/lib/newsletter"
import { listActiveDefenders, fetchDefenderThreats, buildDefenderEmailHtml } from "@/lib/retention"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"
export const maxDuration = 300

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = req.headers.get("authorization") ?? ""
    const param = req.nextUrl.searchParams.get("secret") ?? ""
    if (auth !== `Bearer ${secret}` && param !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org").replace(/\/$/, "")
  const weekLabel = currentWeekLabel()

  let contacts
  try {
    contacts = await listActiveDefenders()
  } catch (err) {
    return NextResponse.json({ error: "Active defender list failed", detail: String(err) }, { status: 502 })
  }

  if (contacts.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, message: "No active defenders registered." })
  }

  const threats = await fetchDefenderThreats()
  if (threats.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, message: "No critical threats this week." })
  }

  const subject = `🛡️ Security Alert – ${weekLabel}: ${threats.length} kritische Lücken`
  let sent = 0
  let failed = 0
  const batchSize = 10

  for (let i = 0; i < contacts.length; i += batchSize) {
    const batch = contacts.slice(i, i + batchSize)
    const results = await Promise.allSettled(
      batch.map(async (contact) => {
        const html = buildDefenderEmailHtml({ contact, threats, siteUrl, weekLabel })
        await sendEmail({ to: contact.email, subject, html })
        return contact.email
      })
    )

    for (let j = 0; j < results.length; j++) {
      const result = results[j]
      if (result.status === "fulfilled") {
        sent++
      } else {
        const email = batch[j]?.email || "unknown"
        console.error(`[retention/weekly] Failed for ${email}:`, result.reason)
        failed++
      }
    }
  }

  return NextResponse.json({
    ok: true,
    sent,
    failed,
    recipients: contacts.length,
    threats: threats.map((t) => t.id),
  })
}
