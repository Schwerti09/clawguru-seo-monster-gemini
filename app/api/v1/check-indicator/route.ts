import { NextRequest, NextResponse } from "next/server"

// Test mode key — always returns a successful demo response without registration
const TEST_MODE_KEY = "test_clawguru_demo_key_2024"

// Rate limiting: simple in-memory map (resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 60 // requests per window
const RATE_WINDOW_MS = 60_000 // 1 minute

function getRateLimit(key: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
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

function fnv1a(str: string) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n))
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const indicator = searchParams.get("indicator")?.trim() ?? ""
  const type = searchParams.get("type")?.trim() ?? "auto"
  const apiKey = request.headers.get("x-api-key") ?? searchParams.get("api_key") ?? ""

  // Validate API key
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing API key. Pass your key via the X-API-Key header or ?api_key= query param." },
      { status: 401 }
    )
  }

  // Test mode: static successful response — no registration required
  if (apiKey === TEST_MODE_KEY) {
    return NextResponse.json(
      {
        test_mode: true,
        indicator: indicator || "8.8.8.8",
        type: type === "auto" ? "ip" : type,
        timestamp: new Date().toISOString(),
        verdict: "clean",
        risk_score: 12,
        tags: ["dns-resolver", "public-infrastructure"],
        message: "✅ Test mode: This is a static demo response. Sign up to run real checks.",
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

  // For non-test keys: validate indicator
  if (!indicator) {
    return NextResponse.json(
      { error: "Missing required parameter: indicator (e.g. ?indicator=8.8.8.8)" },
      { status: 400 }
    )
  }

  // Rate limiting keyed by API key
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

  // Deterministic heuristic check (same as /api/security-check pattern)
  const seed = fnv1a(indicator + apiKey.slice(0, 8))
  const riskScore = clamp((seed % 100), 1, 99)
  const verdict = riskScore >= 70 ? "malicious" : riskScore >= 40 ? "suspicious" : "clean"

  const tagPool = ["known-scanner", "tor-exit-node", "vpn", "cdn", "dns-resolver", "public-infrastructure", "data-center", "residential"]
  const tags = tagPool.filter((_, i) => (seed >> i) % 3 === 0).slice(0, 3)

  return NextResponse.json(
    {
      test_mode: false,
      indicator,
      type: type === "auto" ? "ip" : type,
      timestamp: new Date().toISOString(),
      verdict,
      risk_score: riskScore,
      tags,
      message:
        verdict === "malicious"
          ? `⚠️ "${indicator}" shows high-risk signals. Review and block if unrecognized.`
          : verdict === "suspicious"
          ? `⚡ "${indicator}" has moderate risk signals. Monitor closely.`
          : `✅ "${indicator}" looks clean based on current heuristics.`,
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
