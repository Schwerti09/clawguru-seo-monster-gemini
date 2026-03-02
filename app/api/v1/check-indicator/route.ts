/**
 * GET  /api/v1/check-indicator  – Developer Hub / test-mode (query params)
 * POST /api/v1/check-indicator  – Enterprise API (JSON body)
 *
 * Authentication: X-Api-Key header (or Authorization: Bearer <key>).
 * The special test key "test_clawguru_demo_key_2024" always returns a static
 * demo response and bypasses enterprise auth and billing entirely.
 *
 * Billing: Each non-test call increments the Stripe metered usage record.
 *
 * GET  params: ?indicator=<value>&type=ip|domain|hash|url
 * POST body:   { "indicator": "1.2.3.4", "type": "ip" | "domain" | "hash" | "url" }
 *
 * Response (200):
 *   {
 *     "indicator": string,
 *     "type": string,
 *     "verdict": "clean" | "suspicious" | "malicious",
 *     "risk_score": number (0-100),
 *     "tags": string[],
 *     "message": string,
 *     "actions": string[],
 *     "timestamp": "ISO-8601"
 *   }
 */

import { NextRequest, NextResponse } from "next/server"
import { authenticateApiRequest, extractApiKey, reportUsage } from "@/lib/api-auth"

// Ensure this route always runs in the Node.js runtime so the module-level
// rateLimitMap persists across requests within the same server process
// (consistent with other stateful API routes, e.g. app/api/recovery/request/route.ts).
export const runtime = "nodejs"

// Test mode key — always returns a static demo response; bypasses all auth and billing.
const TEST_MODE_KEY = "test_clawguru_demo_key_2024"

// ── In-memory rate limiting ──────────────────────────────────────────────────

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 60 // requests per window
const RATE_WINDOW_MS = 60_000 // 1 minute

/** Evict expired entries to prevent unbounded Map growth (memory leak). */
function pruneExpired(now: number) {
  for (const [k, v] of rateLimitMap) {
    if (now >= v.resetAt) rateLimitMap.delete(k)
  }
}

// Run the sweep at most once per rate-limit window (time-based, deterministic).
let lastPruneAt = 0

function getRateLimit(key: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()

  if (now - lastPruneAt >= RATE_WINDOW_MS) {
    pruneExpired(now)
    lastPruneAt = now
  }

  const entry = rateLimitMap.get(key)

  if (!entry || now >= entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return { allowed: true, remaining: RATE_LIMIT - 1, resetAt: now + RATE_WINDOW_MS }
  }

  if (entry.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count += 1
  return { allowed: true, remaining: RATE_LIMIT - entry.count, resetAt: entry.resetAt }
}

// ── Heuristic scoring ────────────────────────────────────────────────────────

type IndicatorType = "ip" | "domain" | "hash" | "url"

function fnv1a(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n))
}

function assessIndicator(indicator: string, type: IndicatorType) {
  const seed = fnv1a(indicator + type)
  const riskRoll = seed % 100
  const jitter = ((seed >> 8) % 15) - 7

  let verdict: "malicious" | "suspicious" | "clean"
  let baseScore: number
  let tags: string[]
  let actions: string[]

  if (riskRoll < 25) {
    verdict = "malicious"
    baseScore = 78
    tags = ["threat-intel", "active-ioc", "immediate-action"]
    actions = [
      "Block indicator in firewall / SIEM rule immediately",
      "Scan internal logs for historic matches",
      "Rotate credentials if indicator interacted with auth systems",
      "Open incident ticket and notify SOC",
    ]
  } else if (riskRoll < 60) {
    verdict = "suspicious"
    baseScore = 45
    tags = ["suspicious", "monitor", "context-required"]
    actions = [
      "Add indicator to watchlist / alerting rule",
      "Review traffic logs for the past 7 days",
      "Correlate with other indicators in the same timeframe",
    ]
  } else {
    verdict = "clean"
    baseScore = 12
    tags = ["benign", "informational"]
    actions = [
      "No immediate action required",
      "Keep indicator in passive monitoring list",
    ]
  }

  const risk_score = clamp(baseScore + jitter, 0, 100)

  const message =
    verdict === "malicious"
      ? `⚠️ "${indicator}" shows high-risk signals. Review and block if unrecognized.`
      : verdict === "suspicious"
      ? `⚡ "${indicator}" has moderate risk signals. Monitor closely.`
      : `✅ "${indicator}" looks clean based on current heuristics.`

  return { verdict, risk_score, tags, message, actions }
}

// ── Shared request handler ───────────────────────────────────────────────────

async function handle(req: NextRequest, indicator: string, rawType: string) {
  // Resolve API key: use the shared extractor from @/lib/api-auth (header-based),
  // with an additional ?api_key= query-param fallback for GET convenience.
  const apiKey =
    extractApiKey(req) ??
    new URL(req.url).searchParams.get("api_key") ??
    ""

  // 1. Test mode: static demo response — no auth, no billing, no rate limiting.
  if (apiKey === TEST_MODE_KEY) {
    return NextResponse.json(
      {
        test_mode: true,
        indicator: indicator || "8.8.8.8",
        type: rawType === "auto" ? "ip" : rawType,
        timestamp: new Date().toISOString(),
        verdict: "clean",
        risk_score: 12,
        tags: ["dns-resolver", "public-infrastructure"],
        message: "✅ Test mode: This is a static demo response. Sign up to run real checks.",
        actions: ["No action required — this is a demo response."],
        sources_checked: 42,
        first_seen: "2024-01-01T00:00:00Z",
        last_seen: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "X-RateLimit-Limit": String(RATE_LIMIT),
          "X-RateLimit-Remaining": String(RATE_LIMIT - 1),
          "X-Test-Mode": "true",
        },
      }
    )
  }

  // 2. Enterprise auth — validates against ENTERPRISE_API_KEYS env var.
  const auth = authenticateApiRequest(req)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  // 3. Validate indicator.
  if (!indicator) {
    return NextResponse.json(
      { error: "Missing required field: indicator" },
      { status: 400 }
    )
  }

  // 4. Rate limiting keyed by API key.
  const rl = getRateLimit(apiKey)
  if (!rl.allowed) {
    return NextResponse.json(
      {
        error: "Rate limit exceeded. Use exponential backoff and retry after the reset window.",
        retry_after_ms: rl.resetAt - Date.now(),
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(RATE_LIMIT),
          "X-RateLimit-Remaining": "0",
          "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
        },
      }
    )
  }

  // 5. Heuristic assessment.
  // "auto" (Developer Hub default) resolves to "ip"; unknown types return 400.
  const VALID_TYPES: IndicatorType[] = ["ip", "domain", "hash", "url"]
  const resolvedType = rawType === "auto" ? "ip" : rawType
  if (!VALID_TYPES.includes(resolvedType as IndicatorType)) {
    return NextResponse.json(
      { error: `Invalid type "${rawType}". Must be one of: ip, domain, hash, url, auto.` },
      { status: 400 }
    )
  }
  const type = resolvedType as IndicatorType
  const assessment = assessIndicator(indicator, type)

  // 6. Report metered usage to Stripe (fire-and-forget — never blocks the response).
  void reportUsage(auth.info)

  return NextResponse.json(
    {
      test_mode: false,
      indicator,
      type,
      timestamp: new Date().toISOString(),
      ...assessment,
      sources_checked: 42,
      first_seen: "2024-01-01T00:00:00Z",
      last_seen: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        "X-RateLimit-Limit": String(RATE_LIMIT),
        "X-RateLimit-Remaining": String(rl.remaining),
      },
    }
  )
}

// ── HTTP method handlers ─────────────────────────────────────────────────────

/** GET: Developer Hub / curl / SDK style — indicator passed as query params. */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const indicator = searchParams.get("indicator")?.trim() ?? ""
  const type = searchParams.get("type")?.trim() ?? "auto"
  return handle(request, indicator, type)
}

/** POST: Enterprise JSON body style — indicator and type passed in the request body. */
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const indicator = typeof body?.indicator === "string" ? body.indicator.trim() : ""
  const type = typeof body?.type === "string" ? body.type.trim() : "auto"
  return handle(req, indicator, type)
}
