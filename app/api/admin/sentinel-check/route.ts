// app/api/admin/sentinel-check/route.ts
// Sentinel – admin-secured health-guard endpoint.
//
// GET /api/admin/sentinel-check
//   Runs all Sentinel checks (Stripe, DB, Redis, Intel-API) and returns a
//   structured JSON report. Triggers auto-recovery as a side-effect.
//
// POST /api/admin/sentinel-check
//   Body: { replayWebhookEventId?: string }
//   Optionally replay a failed Stripe webhook event by ID.
//
// Secured by the standard admin session cookie (same as /api/admin/overview).

import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { adminCookieName, verifyAdminToken } from "@/lib/admin-auth"
import {
  runSentinelChecks,
  validateEnv,
  replayFailedStripeWebhook,
} from "@/lib/sentinel"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 })
}

async function isAuthorized(): Promise<boolean> {
  const token = (await cookies()).get(adminCookieName())?.value || ""
  return Boolean(token && verifyAdminToken(token))
}

/** GET – run all Sentinel checks and return the report. */
export async function GET() {
  if (!(await isAuthorized())) return unauthorized()

  const report = await runSentinelChecks()

  return NextResponse.json({
    module: "Sentinel",
    ...report,
    // Also expose circuit-breaker states for transparency
    circuitBreakers: await import("@/lib/circuit-breaker").then(
      (m) => m.listCircuitBreakers()
    ),
  })
}

/** POST – optionally replay a failed Stripe webhook event. */
export async function POST(req: NextRequest) {
  if (!(await isAuthorized())) return unauthorized()

  const rawBody = await req.json().catch(() => ({}))
  const body = rawBody && typeof rawBody === "object" ? rawBody as { replayWebhookEventId?: unknown } : {}
  const replayId = typeof body.replayWebhookEventId === "string" ? body.replayWebhookEventId : undefined

  if (replayId) {
    const result = await replayFailedStripeWebhook(replayId)
    return NextResponse.json({ module: "Sentinel", action: "webhook-replay", result })
  }

  // Fallback: just run the full check suite
  const report = await runSentinelChecks()
  return NextResponse.json({ module: "Sentinel", ...report })
}

/** HEAD – lightweight liveness probe (no auth required, no side-effects). */
export async function HEAD() {
  const envChecks = validateEnv()
  const hasFailures = envChecks.some((c) => c.status === "fail")
  return new NextResponse(null, { status: hasFailures ? 503 : 200 })
}
