// File: app/api/health/cron/route.ts
// Scheduled self-health endpoint – call via Netlify Scheduled Function or external cron.
// Secured by CRON_SECRET to prevent unauthorised triggering.
// FULL PASSIVE WELTMACHT: runs autoHeal + sends daily passive-income summary email.

import { NextRequest, NextResponse } from "next/server"
import { checkSiteHealth, autoHeal } from "@/lib/selfhealth"
import { calculateDailyRevenue, generateDailyReport } from "@/lib/passive"
import { sendEmail } from "@/lib/email"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = req.headers.get("authorization") ?? ""
    const param = req.nextUrl.searchParams.get("secret") ?? ""
    if (auth !== `Bearer ${secret}` && param !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  const alertEmail = process.env.HEALTH_ALERT_EMAIL || undefined

  try {
    // FULL PASSIVE WELTMACHT: run health check + auto-heal in parallel
    const [report, healResult, revenue] = await Promise.all([
      checkSiteHealth({ alertEmail }),
      autoHeal(),
      calculateDailyRevenue(),
    ])

    // FULL PASSIVE WELTMACHT: generate daily passive-income report
    const dailyReport = generateDailyReport({
      revenue,
      runbooksHealed: healResult.runbooksHealed,
      runbooksGenerated: healResult.runbooksGenerated,
      healthScore: report.score,
    })

    // FULL PASSIVE WELTMACHT: send daily summary email to owner
    const summaryEmail = process.env.PASSIVE_SUMMARY_EMAIL || "rolf@clawguru.org"
    await sendDailySummaryEmail(summaryEmail, dailyReport, report.score).catch((err) => {
      console.error("[cron] Daily summary email failed:", err instanceof Error ? err.message : err)
    })

    const weeklyAlertEmail = process.env.WEEKLY_SECURITY_ALERT_EMAIL
    if (weeklyAlertEmail && isWeeklyWindow()) {
      await sendWeeklySecurityAlertEmail(weeklyAlertEmail, report).catch((err) => {
        console.error("[cron] Weekly security alert failed:", err instanceof Error ? err.message : err)
      })
    }

    return NextResponse.json(
      { ...report, heal: healResult, daily: dailyReport },
      {
        status: report.ok ? 200 : 503,
        headers: { "Cache-Control": "no-store" },
      }
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json(
      { ok: false, score: 0, ts: new Date().toISOString(), error: message },
      { status: 500 }
    )
  }
}

// ---------------------------------------------------------------------------
// FULL PASSIVE WELTMACHT: Daily summary email
// ---------------------------------------------------------------------------

async function sendDailySummaryEmail(
  to: string,
  report: import("@/lib/passive").DailyReport,
  healthScore: number
): Promise<void> {
  const scoreColor = healthScore >= 90 ? "#22c55e" : healthScore >= 70 ? "#f59e0b" : "#ef4444"
  const scoreLabel = healthScore >= 90 ? "Alles grün ✅" : healthScore >= 70 ? "Kleinere Warnungen ⚠️" : "Handlungsbedarf ❌"

  const html = `
<div style="font-family:system-ui,sans-serif;max-width:600px;margin:auto;background:#0a0a0a;color:#e5e7eb;padding:32px;border-radius:16px">
  <h1 style="font-size:28px;font-weight:900;margin:0 0 8px">Guten Morgen Schwerti 👑</h1>
  <p style="color:#9ca3af;margin:0 0 24px">ClawGuru Daily Report · ${report.date}</p>

  <div style="background:#111;border-radius:12px;padding:20px;margin-bottom:16px">
    <div style="font-size:13px;text-transform:uppercase;letter-spacing:.1em;color:#6b7280">Health Score</div>
    <div style="font-size:36px;font-weight:900;color:${scoreColor}">${healthScore}/100</div>
    <div style="color:${scoreColor};font-weight:700">${scoreLabel}</div>
  </div>

  <div style="background:#111;border-radius:12px;padding:20px;margin-bottom:16px">
    <div style="font-size:13px;text-transform:uppercase;letter-spacing:.1em;color:#6b7280">Heute verdient</div>
    <div style="font-size:36px;font-weight:900;color:#22c55e">${report.revenue.formatted}</div>
    <div style="color:#9ca3af;font-size:13px">Stripe: €${(report.revenue.stripe / 100).toFixed(2)} · Affiliates (est.): €${(report.revenue.affiliates / 100).toFixed(2)}</div>
  </div>

  <div style="background:#111;border-radius:12px;padding:20px;margin-bottom:16px">
    <div style="font-size:13px;text-transform:uppercase;letter-spacing:.1em;color:#6b7280;margin-bottom:8px">Content Automation</div>
    <div>🔧 Heute <strong>${report.runbooksHealed} Runbooks geheilt</strong> + <strong>${report.runbooksGenerated} neu generiert</strong></div>
    <div style="margin-top:6px">🛋️ Du hast heute <strong>0 Minuten gearbeitet</strong> und <strong>${report.revenue.formatted} verdient</strong></div>
  </div>

  <div style="background:#111;border-radius:12px;padding:20px;margin-bottom:24px">
    <div style="font-size:13px;text-transform:uppercase;letter-spacing:.1em;color:#6b7280;margin-bottom:8px">Next Action</div>
    <div style="font-weight:700">${report.nextAction}</div>
  </div>

  <p style="color:#4b5563;font-size:12px;text-align:center">ClawGuru · Full Passive Weltmacht Mode · <a href="https://clawguru.org/dashboard/health" style="color:#06b6d4">Dashboard öffnen →</a></p>
</div>
`

  await sendEmail({
    to,
    subject: `👑 ClawGuru Daily: ${report.revenue.formatted} verdient · Score ${healthScore}/100 · ${report.date}`,
    html,
  })
}

function isWeeklyWindow(now = new Date()) {
  return now.getUTCDay() === 1
}

async function sendWeeklySecurityAlertEmail(to: string, report: import("@/lib/selfhealth").SiteHealthReport) {
  const failed = report.checks.filter((c) => c.status === "fail")
  const warnings = report.checks.filter((c) => c.status === "warn")
  const items = (checks: typeof report.checks, icon: string) =>
    checks.map((c) => `<li>${icon} <strong>${c.name}</strong>: ${c.message}</li>`).join("")

  const html = `
<div style="font-family:system-ui,sans-serif;max-width:600px;margin:auto;background:#0a0a0a;color:#e5e7eb;padding:28px;border-radius:16px">
  <h1 style="margin:0 0 8px;font-size:26px;font-weight:900">🛡️ Weekly Security Alert</h1>
  <p style="margin:0 0 16px;color:#9ca3af">ClawGuru · ${report.ts}</p>
  <div style="background:#111;border-radius:12px;padding:18px;margin-bottom:16px">
    <div style="font-size:13px;text-transform:uppercase;letter-spacing:.1em;color:#6b7280">Health Score</div>
    <div style="font-size:32px;font-weight:900;color:${report.score >= 90 ? "#22c55e" : report.score >= 70 ? "#f59e0b" : "#ef4444"}">${report.score}/100</div>
    <div style="color:#9ca3af;font-size:13px">Status: ${report.ok ? "✅ OK" : "❌ Action Required"}</div>
  </div>
  ${failed.length ? `<h3 style="margin:16px 0 8px">❌ Critical</h3><ul>${items(failed, "❌")}</ul>` : ""}
  ${warnings.length ? `<h3 style="margin:16px 0 8px">⚠️ Warnings</h3><ul>${items(warnings, "⚠️")}</ul>` : ""}
  <p style="color:#6b7280;font-size:12px;margin-top:24px">Automatischer Wochenreport. Passe Grenzwerte in /lib/selfhealth.ts an.</p>
</div>
`

  await sendEmail({
    to,
    subject: `🛡️ ClawGuru Weekly Security Alert · Score ${report.score}/100`,
    html,
  })
}
