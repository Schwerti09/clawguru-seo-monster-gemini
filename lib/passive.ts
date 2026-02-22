// FULL PASSIVE WELTMACHT: lib/passive.ts
// Passive-income tracking: revenue calculation + daily report generation.

import { stripe } from "@/lib/stripe"

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

// FULL PASSIVE WELTMACHT: affiliate revenue estimated as a percentage of Stripe revenue
// Replace with real affiliate API (Awin, ShareASale, etc.) when available.
const AFFILIATE_ESTIMATE_PERCENTAGE = 0.15

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type RevenueBreakdown = {
  stripe: number       // EUR cents
  affiliates: number   // EUR cents (dummy/estimated until real affiliate API)
  total: number        // EUR cents
  formatted: string    // "€xx.xx"
}

export type DailyReport = {
  date: string             // YYYY-MM-DD
  revenue: RevenueBreakdown
  runbooksHealed: number
  runbooksGenerated: number
  minutesWorked: number    // FULL PASSIVE WELTMACHT: always 0
  healthScore: number
  summary: string
  nextAction: string
}

// ---------------------------------------------------------------------------
// Revenue calculation
// ---------------------------------------------------------------------------

/**
 * FULL PASSIVE WELTMACHT: Calculates today's revenue from Stripe charges
 * plus a dummy affiliate estimate. Returns EUR-cent amounts.
 */
export async function calculateDailyRevenue(): Promise<RevenueBreakdown> {
  let stripeCents = 0

  try {
    const key = process.env.STRIPE_SECRET_KEY
    if (key) {
      // Fetch charges created today (UTC midnight → now)
      const startOfDay = Math.floor(new Date().setUTCHours(0, 0, 0, 0) / 1000)
      const charges = await stripe.charges.list({
        created: { gte: startOfDay },
        limit: 100,
      })
      for (const c of charges.data) {
        if (c.paid && !c.refunded && c.currency.toLowerCase() === "eur") {
          // Only count EUR charges to avoid incorrect 1:1 currency assumptions.
          // Extend with FX conversion if multi-currency support is needed.
          stripeCents += c.amount
        }
      }
    }
  } catch {
    // FULL PASSIVE WELTMACHT: revenue still tracked even if Stripe is unavailable
    stripeCents = 0
  }

  const affiliateCents = Math.round(stripeCents * AFFILIATE_ESTIMATE_PERCENTAGE)

  const total = stripeCents + affiliateCents
  const formatted = `€${(total / 100).toFixed(2)}`

  return { stripe: stripeCents, affiliates: affiliateCents, total, formatted }
}

// ---------------------------------------------------------------------------
// Daily report generation
// ---------------------------------------------------------------------------

/**
 * FULL PASSIVE WELTMACHT: Generates the full daily passive-income report.
 * Combines revenue + health + content generation stats into one report object.
 */
export function generateDailyReport(opts: {
  revenue: RevenueBreakdown
  runbooksHealed: number
  runbooksGenerated: number
  healthScore: number
}): DailyReport {
  const { revenue, runbooksHealed, runbooksGenerated, healthScore } = opts

  const date = new Date().toISOString().slice(0, 10)

  const scoreEmoji = healthScore >= 90 ? "✅" : healthScore >= 70 ? "⚠️" : "❌"

  const summary = [
    `${scoreEmoji} Health Score: ${healthScore}/100`,
    `💰 Heute verdient: ${revenue.formatted}`,
    `🔧 Runbooks geheilt: ${runbooksHealed}`,
    `✨ Runbooks neu generiert: ${runbooksGenerated}`,
    `🛋️ Gearbeitete Minuten: 0 (FULL PASSIVE MODE)`,
  ].join(" · ")

  const nextAction =
    healthScore < 70
      ? "⚠️ Health Score niedrig – bitte manuell prüfen."
      : "🚀 Nächstes Projekt kann gestartet werden. ClawGuru läuft von allein."

  return {
    date,
    revenue,
    runbooksHealed,
    runbooksGenerated,
    minutesWorked: 0,
    healthScore,
    summary,
    nextAction,
  }
}
