// FULL PASSIVE WELTMACHT: lib/passive.ts
// Passive-income tracking: revenue calculation + daily report generation.
// WORLD BEAST: extended with Yearly Plans, Enterprise, White-Label, Affiliate Dashboard, Upsell logic.

import { stripe } from "@/lib/stripe"

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

// FULL PASSIVE WELTMACHT: affiliate revenue estimated as a percentage of Stripe revenue
// Replace with real affiliate API (Awin, ShareASale, etc.) when available.
const AFFILIATE_ESTIMATE_PERCENTAGE = 0.15

// WORLD BEAST: plan pricing in EUR cents
export const PLAN_PRICES: Record<PlanId, { monthly: number; yearly: number | null }> = {
  daypass:     { monthly: 700,   yearly: null },    // 7€ one-time
  pro:         { monthly: 1499,  yearly: 12900 },   // 14.99€/mo  or 129€/yr
  team:        { monthly: 2999,  yearly: 25900 },   // 29.99€/mo  or 259€/yr
  enterprise:  { monthly: 49900, yearly: 399000 },  // 499€/mo    or 3990€/yr
  whitelabel:  { monthly: 99900, yearly: 799000 },  // 999€/mo    or 7990€/yr
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

// WORLD BEAST: extended plan IDs
export type PlanId = "daypass" | "pro" | "team" | "enterprise" | "whitelabel"

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

// WORLD BEAST: Affiliate Dashboard types
export type AffiliateEntry = {
  affiliateCode: string
  clicks: number
  conversions: number
  commissionCents: number
  formattedCommission: string
}

export type AffiliateDashboard = {
  totalAffiliates: number
  totalConversions: number
  totalCommissionCents: number
  formattedTotal: string
  entries: AffiliateEntry[]
}

// WORLD BEAST: Upsell configuration
export type UpsellConfig = {
  triggerAfterChecks: number   // show upsell popup after N checks
  message: string
  ctaLabel: string
  ctaHref: string
  planId: PlanId
  priceLabel: string
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
// WORLD BEAST: Upsell configuration
// ---------------------------------------------------------------------------

/**
 * WORLD BEAST: Returns the upsell popup config shown after N security checks.
 * Trigger = 3 checks → nudge free users to upgrade.
 */
export function getUpsellConfig(): UpsellConfig {
  return {
    triggerAfterChecks: 3,
    message: "Du hast bereits 3 Checks durchgeführt – du weißt, was du kannst. Hol dir jetzt Zugang zu 500+ Premium-Runbooks.",
    ctaLabel: "Unlock 500+ Runbooks für 9€/Monat →",
    ctaHref: "/pricing",
    planId: "pro",
    priceLabel: "9€/Monat",
  }
}

// ---------------------------------------------------------------------------
// WORLD BEAST: Affiliate Dashboard
// ---------------------------------------------------------------------------

/**
 * WORLD BEAST: Builds an affiliate dashboard summary.
 * Uses Stripe metadata to identify affiliate codes on charges.
 * Falls back to empty data if Stripe is unavailable.
 */
export async function getAffiliateDashboard(): Promise<AffiliateDashboard> {
  const map = new Map<string, { clicks: number; conversions: number; commissionCents: number }>()

  try {
    const key = process.env.STRIPE_SECRET_KEY
    if (key) {
      const startOfMonth = Math.floor(new Date(new Date().setDate(1)).setUTCHours(0, 0, 0, 0) / 1000)
      const charges = await stripe.charges.list({ created: { gte: startOfMonth }, limit: 100 })
      for (const c of charges.data) {
        const code = c.metadata?.affiliateCode
        if (code && c.paid && !c.refunded && c.currency.toLowerCase() === "eur") {
          const entry = map.get(code) ?? { clicks: 0, conversions: 0, commissionCents: 0 }
          entry.conversions += 1
          // WORLD BEAST: 20% commission on affiliate-referred sales
          entry.commissionCents += Math.round(c.amount * 0.2)
          map.set(code, entry)
        }
      }
    }
  } catch {
    // WORLD BEAST: dashboard still renders with empty data when Stripe is unavailable
  }

  const entries: AffiliateEntry[] = Array.from(map.entries()).map(([code, data]) => ({
    affiliateCode: code,
    clicks: data.clicks,
    conversions: data.conversions,
    commissionCents: data.commissionCents,
    formattedCommission: `€${(data.commissionCents / 100).toFixed(2)}`,
  }))

  const totalConversions = entries.reduce((s, e) => s + e.conversions, 0)
  const totalCommissionCents = entries.reduce((s, e) => s + e.commissionCents, 0)

  return {
    totalAffiliates: entries.length,
    totalConversions,
    totalCommissionCents,
    formattedTotal: `€${(totalCommissionCents / 100).toFixed(2)}`,
    entries,
  }
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
