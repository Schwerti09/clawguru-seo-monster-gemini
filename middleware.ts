import { NextRequest, NextResponse } from "next/server"
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale, localeDir } from "@/lib/i18n"
import { getRequestId, getRequestIdHeaderName } from "@/lib/ops/request-id"

const LOCALE_COOKIE_NAME = "cg_locale"
const LOCALE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365

function isPublicFile(pathname: string): boolean {
  return pathname.includes(".")
}

function shouldBypassMiddleware(pathname: string): boolean {
  if (pathname.startsWith("/api/")) return true
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
  matcher: ["/((?!api|_next/static|_next/image).*)"],
}
