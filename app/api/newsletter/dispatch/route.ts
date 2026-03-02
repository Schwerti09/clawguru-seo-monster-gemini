/**
 * POST /api/newsletter/dispatch
 *
 * Admin-protected endpoint that:
 *  1. Fetches Critical/High CVEs from NIST NVD API
 *  2. Summarizes the top 5 with the configured LLM (Gemini / OpenAI)
 *  3. Builds a responsive HTML email
 *  4. Sends it to all Stripe customer emails (active + canceled)
 *
 * Authentication: same admin cookie used by /api/admin/*
 *
 * Optional request body (JSON):
 *  { dryRun?: boolean }   – if true, returns the HTML without sending
 */

import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { adminCookieName, verifyAdminToken } from "@/lib/admin-auth"
import { sendEmail } from "@/lib/email"
import {
  fetchCriticalCVEs,
  summarizeThreats,
  buildNewsletterHtml,
  getStripeCustomerEmails,
  signUnsubscribeToken,
  currentWeekLabel,
  type NewsletterSendResult,
} from "@/lib/newsletter"

export const runtime = "nodejs"
// Long-running: CVE fetch + AI + bulk email → max 5 min
export const maxDuration = 300

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 })
}

export async function POST(req: NextRequest) {
  // --- Auth ---
  const token = cookies().get(adminCookieName())?.value || ""
  const session = token ? verifyAdminToken(token) : null
  if (!session) return unauthorized()

  let dryRun = false
  try {
    const body = await req.json().catch(() => ({})) as { dryRun?: boolean }
    dryRun = body.dryRun === true
  } catch {
    // no body – ok
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org").replace(/\/$/, "")
  const weekLabel = currentWeekLabel()

  // --- 1. Fetch CVEs ---
  let cves
  try {
    cves = await fetchCriticalCVEs(10)
  } catch (err) {
    return NextResponse.json(
      { error: "CVE fetch failed", detail: String(err) },
      { status: 502 }
    )
  }

  if (cves.length === 0) {
    return NextResponse.json({ ok: true, message: "No critical/high CVEs found this week.", sent: 0 })
  }

  // --- 2. AI Summarization ---
  let threats
  try {
    threats = await summarizeThreats(cves)
  } catch (err) {
    // Fallback: use raw descriptions if AI is unavailable
    threats = cves.slice(0, 5).map((c) => ({
      id: c.id,
      severity: c.severity,
      cvssScore: c.cvssScore,
      summary: c.description.slice(0, 400),
    }))
    console.warn("[newsletter/dispatch] AI summarization failed, using raw descriptions:", err)
  }

  if (dryRun) {
    // Return preview HTML for a non-pro recipient (shows Day Pass CTA)
    const previewUnsub = `${siteUrl}/api/newsletter/unsubscribe?token=PREVIEW_TOKEN`
    const html = buildNewsletterHtml({
      threats,
      siteUrl,
      unsubscribeUrl: previewUnsub,
      showDayPassCta: true,
      weekLabel,
    })
    return NextResponse.json({ ok: true, dryRun: true, cveCount: cves.length, threats, html })
  }

  // --- 3. Get Stripe recipients ---
  let recipients
  try {
    recipients = await getStripeCustomerEmails()
  } catch (err) {
    return NextResponse.json(
      { error: "Stripe customer fetch failed", detail: String(err) },
      { status: 502 }
    )
  }

  if (recipients.length === 0) {
    return NextResponse.json({ ok: true, message: "No recipients found in Stripe.", sent: 0 })
  }

  // --- 4. Send emails ---
  const result: NewsletterSendResult = { sent: 0, failed: 0, skipped: 0 }
  const subject = `🛡️ ClawGuru Security Report – ${weekLabel}: ${cves.length} kritische Schwachstellen`

  for (const recipient of recipients) {
    try {
      const unsubscribeUrl = `${siteUrl}/api/newsletter/unsubscribe?token=${encodeURIComponent(
        signUnsubscribeToken(recipient.email)
      )}`

      const html = buildNewsletterHtml({
        threats,
        siteUrl,
        unsubscribeUrl,
        // Active subscribers see the "check now" CTA; canceled/other → Day Pass upsell
        showDayPassCta: recipient.status === "canceled" || recipient.status === "other",
        weekLabel,
      })

      await sendEmail({ to: recipient.email, subject, html })
      result.sent++
    } catch (err) {
      console.error(`[newsletter/dispatch] Failed to send to ${recipient.email}:`, err)
      result.failed++
    }
  }

  return NextResponse.json({
    ok: true,
    weekLabel,
    cveCount: cves.length,
    recipientCount: recipients.length,
    ...result,
  })
}
