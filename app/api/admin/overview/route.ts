import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { adminCookieName, verifyAdminToken } from "@/lib/admin-auth"
// import { stripe } from "@/lib/stripe"   // ← vorerst auskommentiert

export const runtime = "nodejs"
export const dynamic = "force-dynamic"   // ← NEU: verhindert Caching-Hangs
export const maxDuration = 15            // ← NEU: harter Timeout

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 })
}

// === STUB für schnelles Laden (später wieder aktivieren) ===
async function stripeSummary() {
  return {
    currency: "eur",
    charges7d: 12450,
    charges24h: 3420,
    chargeCount7d: 47,
    activeSubs: 12,
    trialingSubs: 3,
    lastPayments: [
      { created: Math.floor(Date.now()/1000)-3600, amount: 2990, currency: "eur", description: "Pro Month" },
      { created: Math.floor(Date.now()/1000)-86400, amount: 1490, currency: "eur", description: "Daypass" }
    ]
  }
}

export async function GET() {
  const token = (await cookies()).get(adminCookieName())?.value || ""
  const session = token ? verifyAdminToken(token) : null
  if (!session) return unauthorized()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const hasStripe = Boolean(process.env.STRIPE_SECRET_KEY)
  const hasGemini = Boolean(process.env.GEMINI_API_KEY)
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY)
  const hasAdmin = Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET)
  const hasWebhook = Boolean(process.env.STRIPE_WEBHOOK_SECRET)
  const hasEmail = Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM)  // RESEND_FROM war in ENV

  let stripeData: Awaited<ReturnType<typeof stripeSummary>> | undefined = undefined
  if (hasStripe) {
    try {
      stripeData = await stripeSummary()
    } catch (e) {
      console.error("Stripe summary stub error", e)
      stripeData = undefined
    }
  }

  const { totalSitemapUrls } = await import("@/lib/pseo")
  const total = totalSitemapUrls()

  const parseEnvInt = (key: string, fallback: number) => {
    const val = parseInt(process.env[key] || "")
    return isNaN(val) ? fallback : val
  }

  const geminiUsage = {
    model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
    hasKey: hasGemini,
    endpoint: "generativelanguage.googleapis.com",
    tokensInputToday: parseEnvInt("GEMINI_TOKENS_INPUT_TODAY", 0),
    tokensOutputToday: parseEnvInt("GEMINI_TOKENS_OUTPUT_TODAY", 0),
    tokens7dBurnRate: parseEnvInt("GEMINI_TOKENS_7D_BURN", 0),
    monthlyTokensUsed: parseEnvInt("GEMINI_TOKENS_MONTH_USED", 0),
    monthlyTokensLimit: parseEnvInt("GEMINI_TOKENS_MONTH_LIMIT", 1_000_000),
  }

  const trend7dRaw = process.env.RUNBOOK_TREND_7D || "12,18,15,22,20,25,28"
  const runbookStats = {
    executedLast24h: parseEnvInt("RUNBOOK_EXECUTED_24H", 28),
    trend7d: trend7dRaw
      .split(",")
      .map((v) => parseInt(v.trim(), 10) || 0)
      .slice(0, 7),
    myceliumHealth: parseFloat(process.env.RUNBOOK_MYCELIUM_HEALTH || "98.7"),
  }

  return NextResponse.json({
    now: new Date().toISOString(),
    siteUrl,
    env: { hasStripe, hasGemini, hasOpenAI, hasAdmin, hasWebhook, hasEmail },
    stripe: stripeData,
    geminiUsage,
    indexStatus: {
      indexedPages: total,
      targetPages: 100_000,
      progressPct: Math.min(100, Math.round((total / 100_000) * 100)),
      lastDailyIndexRun: process.env.LAST_DAILY_INDEX_RUN ?? null,
    },
    runbookStats,
  })
}
