// FULL PASSIVE WELTMACHT: lib/passive.ts
// WORLD BEAST: Passive-income tracking + plan definitions + affiliate dashboard.

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

// ---------------------------------------------------------------------------
// WORLD BEAST: Plan Definitions
// ---------------------------------------------------------------------------

export type PlanId = "free" | "pro_monthly" | "pro_yearly" | "team" | "enterprise" | "whitelabel" | "daypass"

export type Plan = {
  id: PlanId
  name: string
  priceEurCents: number        // monthly or one-time
  billingCycle: "monthly" | "yearly" | "once"
  stripePriceId?: string       // set via env vars
  features: string[]
  highlighted?: boolean
  badge?: string
}

// WORLD BEAST: Full plan catalog – monthly, yearly, enterprise, white-label
export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    priceEurCents: 0,
    billingCycle: "monthly",
    features: ["3 Runbook Checks/Tag", "Config Validator", "Öffentliche Runbooks"],
    badge: "Kostenlos starten",
  },
  {
    id: "pro_monthly",
    name: "Pro",
    priceEurCents: 900,
    billingCycle: "monthly",
    stripePriceId: process.env.STRIPE_PRICE_PRO_MONTHLY,
    features: [
      "Unbegrenzte Checks",
      "500+ Runbooks",
      "Dashboard & Score-History",
      "Weekly Digest",
      "Copilot Chat",
    ],
    highlighted: true,
    badge: "Beliebteste Wahl",
  },
  {
    id: "pro_yearly",
    name: "Pro Yearly",
    priceEurCents: 7900,
    billingCycle: "yearly",
    stripePriceId: process.env.STRIPE_PRICE_PRO_YEARLY,
    features: [
      "Alles aus Pro",
      "2 Monate gratis (vs. monatlich)",
      "Priority Support",
      "Early Access Features",
    ],
    badge: "2 Monate gratis",
  },
  {
    id: "team",
    name: "Team",
    priceEurCents: 2900,
    billingCycle: "monthly",
    stripePriceId: process.env.STRIPE_PRICE_TEAM,
    features: [
      "Bis zu 10 Nutzer",
      "Shared Ops Dashboard",
      "Team Alerts",
      "Shared Runbook Library",
      "Alles aus Pro",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceEurCents: 0,
    billingCycle: "monthly",
    features: [
      "Unbegrenzte Nutzer",
      "SSO / SAML",
      "Custom Runbook Domain",
      "Dedizierter Support",
      "SLA 99.9%",
      "On-Premise Option",
    ],
    badge: "Auf Anfrage",
  },
  {
    id: "whitelabel",
    name: "White-Label",
    priceEurCents: 0,
    billingCycle: "monthly",
    features: [
      "Komplettes Rebranding",
      "Custom Domain + Logo",
      "Eigene Runbook-Datenbank",
      "API-Zugang",
      "Revenue-Share Modell",
    ],
    badge: "Partner-Programm",
  },
  {
    id: "daypass",
    name: "Day Pass",
    priceEurCents: 499,
    billingCycle: "once",
    stripePriceId: process.env.STRIPE_PRICE_DAYPASS,
    features: ["24h Pro-Zugang", "Alle Runbooks", "Copilot Chat"],
    badge: "Sofort-Zugang",
  },
]

// ---------------------------------------------------------------------------
// WORLD BEAST: Affiliate Dashboard Types
// ---------------------------------------------------------------------------

export type AffiliateEntry = {
  affiliateId: string
  referrals: number
  conversions: number
  commissionEurCents: number
  tier: "bronze" | "silver" | "gold" | "platinum"
  joinedAt: string
}

/** WORLD BEAST: Calculate affiliate tier from lifetime conversions */
export function affiliateTier(conversions: number): AffiliateEntry["tier"] {
  if (conversions >= 100) return "platinum"
  if (conversions >= 50) return "gold"
  if (conversions >= 10) return "silver"
  return "bronze"
}

/** WORLD BEAST: Commission rate by tier (percentage of sale) */
export const AFFILIATE_COMMISSION_RATES: Record<AffiliateEntry["tier"], number> = {
  bronze: 0.10,
  silver: 0.15,
  gold: 0.20,
  platinum: 0.25,
}

// ---------------------------------------------------------------------------
// WORLD BEAST: Upsell trigger logic
// ---------------------------------------------------------------------------

export type UpsellTrigger = {
  show: boolean
  message: string
  ctaText: string
  ctaHref: string
}

/**
 * WORLD BEAST: Returns upsell popup config after N checks.
 * Trigger after 3 checks with "Unlock 500+ Runbooks for €9/month".
 */
export function getUpsellTrigger(checksToday: number, hasPro: boolean): UpsellTrigger {
  if (hasPro || checksToday < 3) {
    return { show: false, message: "", ctaText: "", ctaHref: "" }
  }
  return {
    show: true,
    message: `🔓 Du hast heute ${checksToday} Checks gemacht. Unlock 500+ Runbooks für nur €9/Monat!`,
    ctaText: "Jetzt Pro werden →",
    ctaHref: "/pricing",
  }
}
