import { NextRequest, NextResponse } from "next/server"
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale, localeDir } from "@/lib/i18n"
import { getRequestId, getRequestIdHeaderName } from "@/lib/ops/request-id"

const LOCALE_COOKIE_NAME = "cg_locale"
const LOCALE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365

// Lightweight per-IP rate limiter (per edge isolate) – 5 req/min per bucket
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 60 * 1000
type Bucket = { count: number; resetAt: number }
const RL = new Map<string, Bucket>()

function getClientIp(request: NextRequest): string {
  return (
    request.ip ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "0.0.0.0"
  )
}

function routeBucket(pathname: string): string | null {
  if (pathname === "/api/live-wall") return "live-wall"
  if (/^\/(?:[a-z]{2}(?:-[a-z]{2})?)\/runbook\//i.test(pathname) || /^\/runbook\//i.test(pathname)) return "runbook-detail"
  if (/^\/(?:[a-z]{2}(?:-[a-z]{2})?)\/tag\//i.test(pathname) || /^\/tag\//i.test(pathname)) return "tag-detail"
  if (/^\/(?:[a-z]{2}(?:-[a-z]{2})?)\/runbooks\/?$/i.test(pathname) || /^\/runbooks\/?$/i.test(pathname)) return "runbooks-index"
  return null
}

function checkRateLimit(ip: string, bucket: string): { ok: boolean; retryAfter: number } {
  const key = `${bucket}:${ip}`
  const now = Date.now()
  const entry = RL.get(key)
  if (!entry || now >= entry.resetAt) {
    RL.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return { ok: true, retryAfter: 0 }
  }
  if (entry.count < RATE_LIMIT_MAX) {
    entry.count++
    return { ok: true, retryAfter: 0 }
  }
  return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
}

function isPublicFile(pathname: string): boolean {
  return pathname.includes(".")
}

function shouldBypassMiddleware(pathname: string): boolean {
  if (pathname.startsWith("/api/") && pathname !== "/api/live-wall") return true
  if (pathname.startsWith("/admin")) return true
  if (pathname.startsWith("/_next/")) return true
  if (pathname === "/favicon.ico") return true
  if (pathname === "/robots.txt") return true
  if (pathname === "/sitemap.xml") return true
  if (pathname === "/sitemap-index") return true
  if (pathname.startsWith("/sitemap/")) return true
  if (pathname.startsWith("/sitemaps")) return true
  if (pathname.startsWith("/stripe/webhooks")) return true
  if (pathname.startsWith("/maintenance")) return true
  if (pathname.startsWith("/success")) return true
  if (pathname.startsWith("/checkout")) return true
  if (isPublicFile(pathname)) return true
  return false
}

function localeFromPathname(pathname: string): Locale | null {
  const first = pathname.split("/").filter(Boolean)[0]?.toLowerCase() as Locale | undefined
  if (!first) return null
  return SUPPORTED_LOCALES.includes(first) ? first : null
}

function localeFromCookie(request: NextRequest): Locale | null {
  const value = request.cookies.get(LOCALE_COOKIE_NAME)?.value as Locale | undefined
  if (!value) return null
  return SUPPORTED_LOCALES.includes(value) ? value : null
}

function localeFromAcceptLanguage(request: NextRequest): Locale | null {
  const header = request.headers.get("accept-language")
  if (!header) return null

  const candidates = header
    .split(",")
    .map((part) => part.split(";")[0]?.trim().toLowerCase())
    .filter(Boolean)

  for (const candidate of candidates) {
    const base = candidate.split("-")[0] as Locale
    if (SUPPORTED_LOCALES.includes(base)) return base
  }

  return null
}

function preferredLocale(request: NextRequest): Locale {
  return localeFromCookie(request) ?? localeFromAcceptLanguage(request) ?? DEFAULT_LOCALE
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const requestId = getRequestId(request.headers)
  const method = request.method

  // Compatibility rewrite: serve /api/clawlink.js from /api/clawlink
  if (pathname === "/api/clawlink.js") {
    const url = request.nextUrl.clone()
    url.pathname = "/api/clawlink"
    const res = NextResponse.rewrite(url)
    res.headers.set(getRequestIdHeaderName(), requestId)
    return res
  }

  // Compatibility rewrite: route /api/runbooks/search to the new index-backed endpoint
  if (pathname === "/api/runbooks/search") {
    const url = request.nextUrl.clone()
    url.pathname = "/api/runbooks/search-index"
    const res = NextResponse.rewrite(url)
    res.headers.set(getRequestIdHeaderName(), requestId)
    return res
  }

  // Apply per-IP rate limiting for hot routes
  const bucket = routeBucket(pathname)
  if (bucket) {
    const ip = getClientIp(request)
    const rl = checkRateLimit(ip, bucket)
    if (!rl.ok) {
      const res = NextResponse.json({ error: "rate_limited", bucket }, { status: 429 })
      res.headers.set("Retry-After", String(rl.retryAfter))
      res.headers.set(getRequestIdHeaderName(), requestId)
      return res
    }
  }

  if (shouldBypassMiddleware(pathname)) {
    const res = NextResponse.next()
    res.headers.set(getRequestIdHeaderName(), requestId)
    return res
  }

  const locale = localeFromPathname(pathname)

  // Enforce locale-prefix-only routing:
  // /runbook/x -> /de/runbook/x
  if (!locale) {
    const targetLocale = preferredLocale(request)
    const url = request.nextUrl.clone()
    url.pathname = `/${targetLocale}${pathname}`
    const res = NextResponse.redirect(url, 308)
    res.headers.set("x-claw-locale", targetLocale)
    res.headers.set("x-claw-dir", localeDir(targetLocale))
    res.headers.set(getRequestIdHeaderName(), requestId)
    res.cookies.set(LOCALE_COOKIE_NAME, targetLocale, {
      path: "/",
      maxAge: LOCALE_COOKIE_MAX_AGE_SECONDS,
      sameSite: "lax",
    })
    return res
  }

  // Pass locale+dir to the app for SSR-safe html lang/dir.
  const res = NextResponse.next()
  res.headers.set("x-claw-locale", locale)
  res.headers.set("x-claw-dir", localeDir(locale))
  res.headers.set(getRequestIdHeaderName(), requestId)
  // Light CDN caching for Tag pages to lower CPU
  if (method === "GET") {
    const isTagDetail = /^\/(?:[a-z]{2}(?:-[a-z]{2})?)\/tag\//i.test(pathname) || /^\/tag\//i.test(pathname)
    const isTagIndex = /^\/(?:[a-z]{2}(?:-[a-z]{2})?)\/tags\/?$/i.test(pathname) || /^\/tags\/?$/i.test(pathname)
    if (isTagDetail || isTagIndex) {
      res.headers.set("Cache-Control", "public, s-maxage=600, stale-while-revalidate=60")
    }
  }
  if (request.cookies.get(LOCALE_COOKIE_NAME)?.value !== locale) {
    res.cookies.set(LOCALE_COOKIE_NAME, locale, {
      path: "/",
      maxAge: LOCALE_COOKIE_MAX_AGE_SECONDS,
      sameSite: "lax",
    })
  }
  return res
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)", "/api/live-wall", "/api/runbooks/search"],
}
