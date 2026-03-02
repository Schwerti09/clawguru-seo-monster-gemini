// NEXT-LEVEL UPGRADE 2026: Browser language detection middleware
// Automatically redirects to the user's preferred language on first visit,
// respecting a persistent cookie for user language choice.

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, type Locale } from "@/lib/i18n"

const LOCALE_COOKIE = "cg_locale"
const GEO_COOKIE_NAME = "cg_geo_country"

// ---------------------------------------------------------------------------
// Maintenance Mode / Kill-Switch
// ---------------------------------------------------------------------------
const BYPASS_HEADER = "x-clawguru-bypass"
const BYPASS_COOKIE = "cg_bypass"

/**
 * Returns true when the request should bypass maintenance mode.
 * Bypass conditions (checked in order):
 *  1. Path starts with /admin or /maintenance (always pass-through)
 *  2. Secret bypass header X-ClawGuru-Bypass matches BYPASS_SECRET env var
 *  3. Secret bypass cookie `cg_bypass` matches BYPASS_SECRET env var
 *  4. Requester IP matches ADMIN_IP env var
 */
function shouldBypassMaintenance(request: NextRequest): boolean {
  const { pathname } = request.nextUrl

  // Always allow the maintenance page itself and admin routes through
  if (pathname.startsWith("/admin") || pathname.startsWith("/maintenance")) {
    return true
  }

  const secret = process.env.BYPASS_SECRET
  if (secret) {
    // Check bypass header
    if (request.headers.get(BYPASS_HEADER) === secret) return true
    // Check bypass cookie
    if (request.cookies.get(BYPASS_COOKIE)?.value === secret) return true
  }

  // Check admin IP
  const adminIp = process.env.ADMIN_IP
  if (adminIp) {
    const requestIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      ""
    if (requestIp && requestIp === adminIp) return true
  }

  return false
}

/**
 * Detect the best matching locale from the Accept-Language header.
 * Returns the first supported locale that matches any browser preference.
 */
function detectLocaleFromHeader(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE

  const languages = acceptLanguage
    .split(",")
    .map((lang) => {
      const [tag, q] = lang.trim().split(";q=")
      return { tag: tag.trim().toLowerCase(), q: q ? parseFloat(q) : 1 }
    })
    .sort((a, b) => b.q - a.q)

  for (const { tag } of languages) {
    // Match full locale code (e.g. "zh-cn" → "zh")
    const primary = tag.split("-")[0] as Locale
    if (SUPPORTED_LOCALES.includes(primary)) {
      return primary
    }
  }

  return DEFAULT_LOCALE
}

/** Paths that should never be redirected */
function isStaticOrApi(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/sitemaps") ||
    pathname.startsWith("/sitemap") ||
    pathname.startsWith("/robots") ||
    pathname.startsWith("/go/") ||
    pathname.includes(".") // static files with extensions
  )
}

function detectGeoCountry(request: NextRequest): string | null {
  const country =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("x-nf-country") ||
    request.headers.get("cf-ipcountry") ||
    request.headers.get("x-country")
  if (!country) return null
  const cleaned = country.trim().toUpperCase()
  return cleaned.length === 2 ? cleaned : null
}

function applyGeoHeaders(response: NextResponse, country: string | null) {
  if (!country) return response
  response.headers.set("x-clawguru-geo", country)
  response.cookies.set(GEO_COOKIE_NAME, country, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
    sameSite: "lax",
  })
  return response
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const geoCountry = detectGeoCountry(request)
  if (request.method !== "GET" && request.method !== "HEAD") {
    return applyGeoHeaders(NextResponse.next(), geoCountry)
  }

  // ---------------------------------------------------------------------------
  // Maintenance Mode check – redirect everyone except bypass users
  // ---------------------------------------------------------------------------
  if (process.env.MAINTENANCE_MODE === "true" && !isStaticOrApi(pathname)) {
    if (!shouldBypassMaintenance(request)) {
      const url = request.nextUrl.clone()
      url.pathname = "/maintenance"
      return applyGeoHeaders(NextResponse.redirect(url, { status: 307 }), geoCountry)
    }
  }

  // Skip static assets, API routes and special paths
  if (isStaticOrApi(pathname)) {
    return applyGeoHeaders(NextResponse.next(), geoCountry)
  }

  // Check if the URL already contains a supported locale prefix
  const firstSegment = pathname.split("/").filter(Boolean)[0] as Locale
  if (SUPPORTED_LOCALES.includes(firstSegment)) {
    // Persist the chosen locale in a cookie for future visits
    const response = NextResponse.next()
    response.cookies.set(LOCALE_COOKIE, firstSegment, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
      sameSite: "lax",
    })
    return applyGeoHeaders(response, geoCountry)
  }

  // 301 redirect: legacy non-language-prefixed content paths → /de/...
  // e.g. /runbook/contabo-xyz → /de/runbook/contabo-xyz
  const LOCALIZED_PATHS = [
    "/runbook/",
    "/runbooks/",
    "/provider/",
    "/tag/",
    "/tags/",
  ]
  const isLocalizedContent = LOCALIZED_PATHS.some((p) => pathname.startsWith(p))
  if (isLocalizedContent) {
    const url = request.nextUrl.clone()
    url.pathname = `/de${pathname}`
    return applyGeoHeaders(NextResponse.redirect(url, { status: 301 }), geoCountry)
  }

  // Only redirect on the root path to avoid disrupting existing non-localized routes
  if (pathname !== "/") {
    return applyGeoHeaders(NextResponse.next(), geoCountry)
  }

  // Check for persisted user cookie first
  // If the cookie is set (even to the default locale), always respect it and
  // do NOT let the Accept-Language header override the user's explicit choice.
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value as Locale | undefined
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) {
    if (cookieLocale !== DEFAULT_LOCALE) {
      const url = request.nextUrl.clone()
      url.pathname = `/${cookieLocale}`
      return applyGeoHeaders(NextResponse.redirect(url, { status: 302 }), geoCountry)
    }
    // Cookie explicitly set to default locale (de) – stay on root, skip header detection
    return applyGeoHeaders(NextResponse.next(), geoCountry)
  }

  // No cookie – detect from Accept-Language header
  const acceptLanguage = request.headers.get("accept-language")
  const detected = detectLocaleFromHeader(acceptLanguage)

  // Only redirect if detected locale differs from default
  if (detected !== DEFAULT_LOCALE) {
    const url = request.nextUrl.clone()
    url.pathname = `/${detected}`
    return applyGeoHeaders(NextResponse.redirect(url, { status: 302 }), geoCountry)
  }

  return applyGeoHeaders(NextResponse.next(), geoCountry)
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, robots.txt, etc.
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|sitemaps|api|manifest.json|og-image.png).*)",
  ],
}
