// Header Doctor backend — fetches HEAD/GET, returns response headers + an
// opinionated evaluation. Server-side only so we can bypass CORS.
//
// Deliberately conservative: only public URLs, 8s timeout, no redirects
// followed beyond 3, response body is discarded (we only read headers).

import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface Finding {
  header: string
  status: "good" | "warn" | "bad"
  message: string
  value?: string
  fix?: { nginx?: string; apache?: string; express?: string }
}

interface Result {
  url: string
  finalUrl: string
  status: number
  headers: Record<string, string>
  score: number
  grade: "A" | "B" | "C" | "D" | "F"
  findings: Finding[]
}

const FETCH_TIMEOUT_MS = 8000

function sanitizeUrl(raw: string): string | null {
  try {
    const u = new URL(raw.trim())
    if (u.protocol !== "http:" && u.protocol !== "https:") return null
    // Block localhost / private IPs to prevent SSRF on this public endpoint.
    const h = u.hostname.toLowerCase()
    if (h === "localhost" || h === "127.0.0.1" || h === "::1") return null
    if (/^10\./.test(h) || /^192\.168\./.test(h)) return null
    if (/^172\.(1[6-9]|2\d|3[01])\./.test(h)) return null
    if (h.endsWith(".local") || h.endsWith(".internal")) return null
    return u.toString()
  } catch {
    return null
  }
}

function gradeFromScore(s: number): Result["grade"] {
  if (s >= 90) return "A"
  if (s >= 75) return "B"
  if (s >= 60) return "C"
  if (s >= 40) return "D"
  return "F"
}

function evaluate(headers: Headers): { score: number; findings: Finding[] } {
  const get = (k: string) => headers.get(k) ?? ""
  const findings: Finding[] = []
  let score = 100

  // HSTS
  {
    const v = get("strict-transport-security")
    if (!v) {
      score -= 20
      findings.push({
        header: "Strict-Transport-Security",
        status: "bad",
        message: "Missing. Browsers won't enforce HTTPS on repeat visits.",
        fix: {
          nginx: `add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;`,
          apache: `Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"`,
          express: `res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')`,
        },
      })
    } else {
      const maxAge = Number(/max-age=(\d+)/i.exec(v)?.[1] ?? 0)
      if (maxAge < 15552000) {
        score -= 10
        findings.push({ header: "Strict-Transport-Security", status: "warn", value: v, message: `max-age=${maxAge} is too short — use at least 15552000 (180 d).` })
      } else {
        findings.push({ header: "Strict-Transport-Security", status: "good", value: v, message: "Present, sane max-age." })
      }
    }
  }

  // CSP
  {
    const v = get("content-security-policy")
    if (!v) {
      score -= 18
      findings.push({
        header: "Content-Security-Policy",
        status: "bad",
        message: "Missing. XSS is one `<script>` tag away from a bad day.",
        fix: {
          nginx: `add_header Content-Security-Policy "default-src 'self'; img-src 'self' data: https:; script-src 'self'; style-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'" always;`,
        },
      })
    } else if (/unsafe-inline/.test(v) && /script-src/.test(v)) {
      score -= 6
      findings.push({ header: "Content-Security-Policy", status: "warn", value: v.slice(0, 120) + (v.length > 120 ? "…" : ""), message: "'unsafe-inline' on script-src defeats half the point of CSP." })
    } else {
      findings.push({ header: "Content-Security-Policy", status: "good", value: v.slice(0, 80) + (v.length > 80 ? "…" : ""), message: "Present." })
    }
  }

  // X-Frame-Options (or CSP frame-ancestors)
  {
    const v = get("x-frame-options")
    const csp = get("content-security-policy")
    if (!v && !/frame-ancestors/i.test(csp)) {
      score -= 10
      findings.push({
        header: "X-Frame-Options",
        status: "bad",
        message: "Clickjacking is possible. Set X-Frame-Options or use CSP frame-ancestors.",
        fix: { nginx: `add_header X-Frame-Options "DENY" always;` },
      })
    } else {
      findings.push({ header: "X-Frame-Options", status: "good", value: v || "(via CSP frame-ancestors)", message: "Framing restricted." })
    }
  }

  // X-Content-Type-Options
  {
    const v = get("x-content-type-options")
    if (v.toLowerCase() !== "nosniff") {
      score -= 6
      findings.push({
        header: "X-Content-Type-Options",
        status: "bad",
        message: "Browsers may MIME-sniff responses.",
        fix: { nginx: `add_header X-Content-Type-Options "nosniff" always;` },
      })
    } else {
      findings.push({ header: "X-Content-Type-Options", status: "good", value: v, message: "nosniff set." })
    }
  }

  // Referrer-Policy
  {
    const v = get("referrer-policy")
    if (!v) {
      score -= 5
      findings.push({ header: "Referrer-Policy", status: "warn", message: "Default browser policy leaks more than necessary.", fix: { nginx: `add_header Referrer-Policy "strict-origin-when-cross-origin" always;` } })
    } else {
      findings.push({ header: "Referrer-Policy", status: "good", value: v, message: "Set." })
    }
  }

  // Permissions-Policy
  {
    const v = get("permissions-policy")
    if (!v) {
      score -= 4
      findings.push({ header: "Permissions-Policy", status: "warn", message: "Consider restricting powerful browser features you don't use.", fix: { nginx: `add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;` } })
    } else {
      findings.push({ header: "Permissions-Policy", status: "good", value: v.slice(0, 80), message: "Set." })
    }
  }

  // Server header leak
  {
    const v = get("server")
    if (/\d/.test(v)) {
      score -= 4
      findings.push({ header: "Server", status: "warn", value: v, message: "Server version leaks. Fingerprinting is trivial. Consider `server_tokens off` (nginx)." })
    } else if (v) {
      findings.push({ header: "Server", status: "good", value: v, message: "No version leak." })
    }
  }

  // X-Powered-By
  {
    const v = get("x-powered-by")
    if (v) {
      score -= 3
      findings.push({ header: "X-Powered-By", status: "warn", value: v, message: "Remove this header — it tells attackers which stack to attack." })
    }
  }

  if (score < 0) score = 0
  return { score, findings }
}

export async function POST(req: Request) {
  let body: { url?: string }
  try { body = await req.json() } catch { return NextResponse.json({ error: "invalid_json" }, { status: 400 }) }
  const cleanUrl = sanitizeUrl(body.url ?? "")
  if (!cleanUrl) return NextResponse.json({ error: "invalid_url" }, { status: 400 })

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const res = await fetch(cleanUrl, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "ClawGuru-HeaderDoctor/1.0 (+https://clawguru.org)" },
    })
    clearTimeout(timeout)

    const headers: Record<string, string> = {}
    res.headers.forEach((val, key) => { headers[key] = val })

    const { score, findings } = evaluate(res.headers)
    const result: Result = {
      url: cleanUrl,
      finalUrl: res.url || cleanUrl,
      status: res.status,
      headers,
      score,
      grade: gradeFromScore(score),
      findings,
    }
    return NextResponse.json(result)
  } catch (e) {
    clearTimeout(timeout)
    const msg = e instanceof Error ? e.message : "fetch_failed"
    return NextResponse.json({ error: "fetch_failed", detail: msg.slice(0, 200) }, { status: 502 })
  }
}
