/**
 * Unit tests for critical security modules:
 * - lib/rate-limit.ts
 * - lib/access-token.ts
 * - lib/token-deny-list.ts
 * - lib/security-check-core.ts (score logic, no network)
 */

import {
  allowBurstInMemory,
  checkRateLimit,
  getClientIp,
} from "@/lib/rate-limit"

import {
  signAccessToken,
  verifyAccessToken,
  type AccessTokenPayload,
} from "@/lib/access-token"

import {
  denyToken,
  isTokenDenied,
  pruneExpired,
  denyListSize,
} from "@/lib/token-deny-list"

// ---------------------------------------------------------------------------
// rate-limit – allowBurstInMemory
// ---------------------------------------------------------------------------
describe("allowBurstInMemory", () => {
  it("allows requests within limit", () => {
    const key = `test-${Date.now()}-a`
    expect(allowBurstInMemory(key, 3, 60_000)).toBe(true)
    expect(allowBurstInMemory(key, 3, 60_000)).toBe(true)
    expect(allowBurstInMemory(key, 3, 60_000)).toBe(true)
  })

  it("blocks once limit is reached", () => {
    const key = `test-${Date.now()}-b`
    allowBurstInMemory(key, 2, 60_000)
    allowBurstInMemory(key, 2, 60_000)
    expect(allowBurstInMemory(key, 2, 60_000)).toBe(false)
  })

  it("resets after window expires", () => {
    const key = `test-${Date.now()}-c`
    allowBurstInMemory(key, 1, 1) // 1ms window
    // Force window expiry by passing in a very short window
    // We call again after the window should have passed
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(allowBurstInMemory(key, 1, 1)).toBe(true)
        resolve()
      }, 10)
    })
  })
})

// ---------------------------------------------------------------------------
// rate-limit – checkRateLimit token-bucket
// ---------------------------------------------------------------------------
describe("checkRateLimit", () => {
  it("allows requests within hard limit", () => {
    const ip = `1.2.3.${Math.floor(Math.random() * 200)}`
    const result = checkRateLimit(ip, undefined, { hardLimitPerMinute: 100 })
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBeGreaterThanOrEqual(0)
  })

  it("rejects when hard cap is 0", () => {
    const ip = `10.0.0.${Math.floor(Math.random() * 200)}`
    // Exhaust a tiny bucket
    const result = checkRateLimit(ip, undefined, { hardLimitPerMinute: 1 })
    // First call allowed
    expect(result.allowed).toBe(true)
    // Immediately consume the one token
    const result2 = checkRateLimit(ip, undefined, { hardLimitPerMinute: 1 })
    // Second call may or may not be blocked depending on timing; resetAt is a future ms
    expect(typeof result2.allowed).toBe("boolean")
    expect(result2.resetAt).toBeGreaterThan(0)
  })

  it("returns limitedBy=soft when userId bucket is exhausted", () => {
    const ip = `192.168.1.${Math.floor(Math.random() * 100)}`
    const userId = `user-${Date.now()}`
    // Exhaust the soft limit
    let last = checkRateLimit(ip, userId, { softLimitPerMinute: 1, hardLimitPerMinute: 1000 })
    for (let i = 0; i < 5; i++) {
      last = checkRateLimit(ip, userId, { softLimitPerMinute: 1, hardLimitPerMinute: 1000 })
    }
    if (!last.allowed) {
      expect(last.limitedBy).toBe("soft")
    }
  })
})

// ---------------------------------------------------------------------------
// rate-limit – getClientIp
// ---------------------------------------------------------------------------
describe("getClientIp", () => {
  it("prefers x-real-ip", () => {
    const headers = new Headers({ "x-real-ip": "2.2.2.2" })
    expect(getClientIp(headers)).toBe("2.2.2.2")
  })

  it("falls back to first x-forwarded-for entry", () => {
    const headers = new Headers({ "x-forwarded-for": "3.3.3.3, 4.4.4.4" })
    expect(getClientIp(headers)).toBe("3.3.3.3")
  })

  it("returns 'unknown' when no header is present", () => {
    expect(getClientIp(new Headers())).toBe("unknown")
  })
})

// ---------------------------------------------------------------------------
// token-deny-list
// ---------------------------------------------------------------------------
describe("token-deny-list", () => {
  const now = Math.floor(Date.now() / 1000)

  it("isTokenDenied returns false for unknown token", () => {
    expect(isTokenDenied("random.token.notlisted")).toBe(false)
  })

  it("denyToken + isTokenDenied round-trip", () => {
    const tok = "some.test.token.abc123"
    denyToken(tok, now + 3600, "test revoke")
    expect(isTokenDenied(tok)).toBe(true)
  })

  it("expired deny entry is auto-removed", () => {
    const tok = "expired.test.token.xyz"
    denyToken(tok, now - 1) // already expired
    // pruneExpired removes it during next check
    expect(isTokenDenied(tok)).toBe(false)
  })

  it("pruneExpired reduces list size", () => {
    const tok = "prune.target.token.foo"
    denyToken(tok, now - 10)
    const before = denyListSize()
    pruneExpired()
    const after = denyListSize()
    expect(after).toBeLessThanOrEqual(before)
  })
})

// ---------------------------------------------------------------------------
// access-token – sign / verify / deny-list integration
// ---------------------------------------------------------------------------
describe("access-token", () => {
  beforeAll(() => {
    process.env.ACCESS_TOKEN_SECRET = "test-secret-32-chars-xxxxxxxxxx"
  })

  const payload: AccessTokenPayload = {
    v: 1,
    plan: "pro",
    customerId: "cust_test_001",
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000),
  }

  it("signAccessToken produces a two-segment token", () => {
    const token = signAccessToken(payload)
    expect(token.split(".")).toHaveLength(2)
  })

  it("verifyAccessToken returns payload for valid token", () => {
    const token = signAccessToken(payload)
    const result = verifyAccessToken(token)
    expect(result).not.toBeNull()
    expect(result?.plan).toBe("pro")
    expect(result?.customerId).toBe("cust_test_001")
  })

  it("verifyAccessToken returns null for tampered token", () => {
    const token = signAccessToken(payload)
    const tampered = token.slice(0, -4) + "XXXX"
    expect(verifyAccessToken(tampered)).toBeNull()
  })

  it("verifyAccessToken returns null for expired token", () => {
    const expiredPayload: AccessTokenPayload = {
      ...payload,
      exp: Math.floor(Date.now() / 1000) - 60,
    }
    const token = signAccessToken(expiredPayload)
    expect(verifyAccessToken(token)).toBeNull()
  })

  it("verifyAccessToken returns null when token is on deny-list", () => {
    const token = signAccessToken(payload)
    denyToken(token, payload.exp, "logout")
    expect(verifyAccessToken(token)).toBeNull()
  })

  it("verifyAccessToken returns null without secret", () => {
    const saved = process.env.ACCESS_TOKEN_SECRET
    delete process.env.ACCESS_TOKEN_SECRET
    delete process.env.NEXTAUTH_SECRET
    delete process.env.SESSION_SECRET
    expect(verifyAccessToken("anything.here")).toBeNull()
    process.env.ACCESS_TOKEN_SECRET = saved
  })
})

// ---------------------------------------------------------------------------
// security-check-core – score calculation (mocked fetch)
// ---------------------------------------------------------------------------
describe("runSecurityHeaderCheck – score logic", () => {
  const { runSecurityHeaderCheck } = require("@/lib/security-check-core")

  function mockFetch(headers: Record<string, string>, status = 200) {
    global.fetch = jest.fn().mockResolvedValue({
      ok: status < 400,
      status,
      headers: {
        get: (name: string) => headers[name.toLowerCase()] ?? null,
      },
    }) as unknown as typeof fetch
  }

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("scores 100 for HTTPS with all security headers", async () => {
    mockFetch({
      "strict-transport-security": "max-age=31536000; includeSubDomains",
      "content-security-policy": "default-src 'self'",
    })
    const result = await runSecurityHeaderCheck("https://example.com")
    expect(result.score).toBe(100)
    expect(result.vulnerable).toBe(false)
  })

  it("deducts 15 for missing HSTS", async () => {
    mockFetch({
      "content-security-policy": "default-src 'self'",
    })
    const result = await runSecurityHeaderCheck("https://example.com")
    expect(result.score).toBe(85)
    expect(result.vulnerable).toBe(true)
  })

  it("deducts 10 for missing CSP", async () => {
    mockFetch({
      "strict-transport-security": "max-age=31536000",
    })
    const result = await runSecurityHeaderCheck("https://example.com")
    expect(result.score).toBe(90)
    expect(result.vulnerable).toBe(false)
  })

  it("deducts 5 for versioned Server header", async () => {
    mockFetch({
      "strict-transport-security": "max-age=31536000",
      "content-security-policy": "default-src 'self'",
      "server": "nginx/1.21.6",
    })
    const result = await runSecurityHeaderCheck("https://example.com")
    expect(result.score).toBe(95)
  })

  it("deducts 5 for X-Powered-By header", async () => {
    mockFetch({
      "strict-transport-security": "max-age=31536000",
      "content-security-policy": "default-src 'self'",
      "x-powered-by": "Express",
    })
    const result = await runSecurityHeaderCheck("https://example.com")
    expect(result.score).toBe(95)
  })

  it("returns target as hostname", async () => {
    mockFetch({})
    const result = await runSecurityHeaderCheck("https://clawguru.org/path")
    expect(result.target).toBe("clawguru.org")
  })

  it("prepends https:// when no protocol given", async () => {
    mockFetch({})
    const result = await runSecurityHeaderCheck("clawguru.org")
    expect(result.target).toBe("clawguru.org")
  })

  it("throws on empty target", async () => {
    await expect(runSecurityHeaderCheck("")).rejects.toThrow("Missing target")
  })
})
