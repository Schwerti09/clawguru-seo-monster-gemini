// FULL PASSIVE WELTMACHT: app/api/health/activate-passive/route.ts
// Server-side endpoint to activate Full Passive Mode from the dashboard.
// Secured by session access check (Pro/Team only) – CRON_SECRET stays server-only.

import { NextResponse } from "next/server"
import { getAccess } from "@/lib/access"
import { checkSiteHealth, autoHeal } from "@/lib/selfhealth"
import { calculateDailyRevenue, generateDailyReport } from "@/lib/passive"
import { sendEmail } from "@/lib/email"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST() {
  // FULL PASSIVE WELTMACHT: only Pro/Team subscribers can trigger this
  const access = await getAccess()
  if (!access.ok || (access.plan !== "pro" && access.plan !== "team")) {
    return NextResponse.json({ error: "Pro oder Team erforderlich." }, { status: 403 })
  }

  try {
    // FULL PASSIVE WELTMACHT: run all passive-mode tasks in parallel
    const [report, healResult, revenue] = await Promise.all([
      checkSiteHealth({ skipRemote: false }),
      autoHeal(),
      calculateDailyRevenue(),
    ])

    const dailyReport = generateDailyReport({
      revenue,
      runbooksHealed: healResult.runbooksHealed,
      runbooksGenerated: healResult.runbooksGenerated,
      healthScore: report.score,
    })

    // FULL PASSIVE WELTMACHT: notify owner on manual activation too
    const summaryEmail = process.env.PASSIVE_SUMMARY_EMAIL || "rolf@clawguru.org"
    await sendActivationEmail(summaryEmail, dailyReport, report.score).catch((err) => {
      console.error("[activate-passive] Email failed:", err instanceof Error ? err.message : err)
    })

    return NextResponse.json(
      { ok: true, report, heal: healResult, daily: dailyReport },
      { headers: { "Cache-Control": "no-store" } }
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}

async function sendActivationEmail(
  to: string,
  report: import("@/lib/passive").DailyReport,
  healthScore: number
): Promise<void> {
  const scoreColor = healthScore >= 90 ? "#22c55e" : healthScore >= 70 ? "#f59e0b" : "#ef4444"

  const html = `
<div style="font-family:system-ui,sans-serif;max-width:600px;margin:auto;background:#0a0a0a;color:#e5e7eb;padding:32px;border-radius:16px">
  <h1 style="font-size:24px;font-weight:900;margin:0 0 8px">🚀 Full Passive Mode aktiviert!</h1>
  <p style="color:#9ca3af;margin:0 0 24px">${report.date}</p>

  <div style="background:#111;border-radius:12px;padding:20px;margin-bottom:16px">
    <div style="font-size:36px;font-weight:900;color:${scoreColor}">${healthScore}/100</div>
    <div style="color:#9ca3af">Health Score</div>
  </div>

  <div style="background:#111;border-radius:12px;padding:20px;margin-bottom:16px">
    <div style="font-size:36px;font-weight:900;color:#22c55e">${report.revenue.formatted}</div>
    <div style="color:#9ca3af">Heute verdient</div>
  </div>

  <p style="margin:16px 0">🔧 <strong>${report.runbooksHealed} Runbooks geheilt</strong> · ✨ <strong>${report.runbooksGenerated} neu generiert</strong></p>
  <p style="font-weight:700">${report.nextAction}</p>

  <p style="color:#4b5563;font-size:12px;text-align:center;margin-top:24px">
    <a href="https://clawguru.org/dashboard/health" style="color:#06b6d4">Dashboard →</a>
  </p>
</div>
`

  await sendEmail({
    to,
    subject: `🚀 Full Passive Mode aktiviert · ${report.date}`,
    html,
  })
}
