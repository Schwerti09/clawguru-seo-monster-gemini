// app/api/consult-health/env-check/route.ts
// Healthcheck endpoint for the /consulting automation workflow.
// Reports which ENV vars are configured without leaking secret values.
// Reference doc: docs/consult-automation-env-2026-04-26.md

import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

type Severity = "required" | "recommended" | "optional"

type EnvCheck = {
  /** Var names to read, in priority order. First non-empty wins. */
  vars: string[]
  severity: Severity
  /** Stable id used in the configured-tree response. */
  id: string
}

/**
 * Centralized list of ENV checks for the /consulting workflow.
 * Mirrors the table in docs/consult-automation-env-2026-04-26.md section 3.
 *
 * When adding a new ENV var:
 *   1. Add an entry here with the right severity.
 *   2. Update the doc table.
 *   3. Update the tree assembly in `assembleConfigured` if it should appear in the response.
 */
const ENV_CHECKS: EnvCheck[] = [
  // Stripe (required)
  { id: "stripe.secret", vars: ["STRIPE_SECRET_KEY"], severity: "required" },
  { id: "stripe.webhook", vars: ["STRIPE_WEBHOOK_SECRET"], severity: "required" },
  { id: "stripe.prices.daypass", vars: ["STRIPE_PRICE_DAYPASS"], severity: "required" },
  { id: "stripe.prices.pro", vars: ["STRIPE_PRICE_PRO"], severity: "required" },
  { id: "stripe.prices.team", vars: ["STRIPE_PRICE_TEAM"], severity: "required" },
  // Stripe (optional)
  { id: "stripe.prices.pro_annual", vars: ["STRIPE_PRICE_PRO_ANNUAL"], severity: "optional" },
  { id: "stripe.prices.team_annual", vars: ["STRIPE_PRICE_TEAM_ANNUAL"], severity: "optional" },
  { id: "stripe.prices.msp", vars: ["STRIPE_PRICE_MSP"], severity: "optional" },
  { id: "stripe.prices.enterprise", vars: ["STRIPE_PRICE_ENTERPRISE"], severity: "optional" },

  // Auth (required, accepts aliases)
  {
    id: "auth.accessToken",
    vars: ["ACCESS_TOKEN_SECRET", "NEXTAUTH_SECRET", "SESSION_SECRET"],
    severity: "required",
  },

  // Email (required + recommended)
  // RESEND_API_KEY is technically required, but RESEND_DISABLED=true bypasses it for dev.
  // We classify as required and adjust at runtime if RESEND_DISABLED is set.
  { id: "email.resend", vars: ["RESEND_API_KEY"], severity: "required" },
  { id: "email.from", vars: ["RESEND_FROM"], severity: "recommended" },
  { id: "email.support", vars: ["SUPPORT_EMAIL"], severity: "recommended" },
  { id: "email.replyTo", vars: ["EMAIL_REPLY_TO"], severity: "optional" },
  { id: "email.legacyFrom", vars: ["EMAIL_FROM"], severity: "optional" },
  { id: "email.disabled", vars: ["RESEND_DISABLED"], severity: "optional" },

  // Site (required)
  { id: "site.url", vars: ["NEXT_PUBLIC_SITE_URL"], severity: "required" },

  // Database (required + recommended)
  { id: "database.primary", vars: ["DATABASE_URL"], severity: "required" },
  { id: "database.secondary", vars: ["DATABASE_URL_2"], severity: "recommended" },

  // Cron + Health (required + recommended)
  { id: "cron.secret", vars: ["CRON_SECRET"], severity: "required" },
  {
    id: "alerts.warnWebhook",
    vars: ["CONSULT_HEALTH_WARN_WEBHOOK_URL", "CONSULT_HEALTH_SLACK_WEBHOOK_URL"],
    severity: "recommended",
  },
  {
    id: "alerts.pageWebhook",
    vars: ["CONSULT_HEALTH_PAGE_WEBHOOK_URL", "CONSULT_HEALTH_PAGERDUTY_WEBHOOK_URL"],
    severity: "recommended",
  },
  { id: "alerts.cooldownMs", vars: ["CONSULT_HEALTH_ALERT_COOLDOWN_MS"], severity: "optional" },

  // Booking (recommended + optional)
  { id: "booking.cal_demo", vars: ["NEXT_PUBLIC_CAL_DEMO_URL"], severity: "recommended" },
  { id: "booking.cal_strategy", vars: ["NEXT_PUBLIC_CAL_STRATEGY_URL"], severity: "optional" },
  { id: "booking.cal_audit", vars: ["NEXT_PUBLIC_CAL_AUDIT_URL"], severity: "optional" },

  // Affiliate (optional)
  { id: "affiliate.accounts", vars: ["AFFILIATE_CONNECT_ACCOUNTS"], severity: "optional" },
  { id: "affiliate.rate", vars: ["AFFILIATE_COMMISSION_RATE"], severity: "optional" },

  // Killswitches (optional)
  { id: "killswitches.all_apis", vars: ["DISABLE_ALL_APIS"], severity: "optional" },
  { id: "killswitches.ai_features", vars: ["DISABLE_AI_FEATURES"], severity: "optional" },
]

function isConfigured(vars: string[]): boolean {
  for (const name of vars) {
    const value = process.env[name]
    if (typeof value === "string" && value.trim().length > 0) return true
  }
  return false
}

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

function verifyCronSecret(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const auth = req.headers.get("authorization") ?? ""
  const param = req.nextUrl.searchParams.get("secret") ?? ""
  return auth === `Bearer ${secret}` || param === secret
}

type Summary = {
  total: number
  configured: number
  missing: string[]
}

type EnvCheckResult = {
  status: "ok" | "degraded" | "broken"
  checkedAt: string
  summary: {
    required: Summary
    recommended: Summary
    optional: Summary
  }
  configured: Record<string, boolean>
}

function emptySummary(): Summary {
  return { total: 0, configured: 0, missing: [] }
}

function classify(checks: EnvCheck[]): EnvCheckResult {
  const summary = {
    required: emptySummary(),
    recommended: emptySummary(),
    optional: emptySummary(),
  }
  const configured: Record<string, boolean> = {}
  const resendDisabled = isConfigured(["RESEND_DISABLED"])

  for (const check of checks) {
    const ok = isConfigured(check.vars)
    configured[check.id] = ok

    // Special-case: when RESEND_DISABLED is set, RESEND_API_KEY is not required.
    let effectiveSeverity: Severity = check.severity
    if (check.id === "email.resend" && resendDisabled) {
      effectiveSeverity = "optional"
    }

    const bucket = summary[effectiveSeverity]
    bucket.total += 1
    if (ok) {
      bucket.configured += 1
    } else {
      bucket.missing.push(check.id)
    }
  }

  let status: EnvCheckResult["status"] = "ok"
  if (summary.required.missing.length > 0) {
    status = "broken"
  } else if (summary.recommended.missing.length > 0) {
    status = "degraded"
  }

  return {
    status,
    checkedAt: new Date().toISOString(),
    summary,
    configured,
  }
}

export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) return unauthorized()

  const result = classify(ENV_CHECKS)

  return NextResponse.json(result, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  })
}
