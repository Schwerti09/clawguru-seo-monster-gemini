// NEXT-LEVEL UPGRADE 2026: Browser language detection middleware
// Automatically redirects to the user's preferred language on first visit,
// respecting a persistent cookie for user language choice.

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, type Locale } from "@/lib/i18n"

const LOCALE_COOKIE = "cg_locale"

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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip static assets, API routes and special paths
  if (isStaticOrApi(pathname)) {
    return NextResponse.next()
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
    return response
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
    return NextResponse.redirect(url, { status: 301 })
  }

  // Only redirect on the root path to avoid disrupting existing non-localized routes
  if (pathname !== "/") {
    return NextResponse.next()
  }

  // Check for persisted user cookie first
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value as Locale | undefined
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale) && cookieLocale !== DEFAULT_LOCALE) {
    const url = request.nextUrl.clone()
    url.pathname = `/${cookieLocale}`
    return NextResponse.redirect(url, { status: 302 })
  }

  // Detect from Accept-Language header
  const acceptLanguage = request.headers.get("accept-language")
  const detected = detectLocaleFromHeader(acceptLanguage)

  // Only redirect if detected locale differs from default
  if (detected !== DEFAULT_LOCALE) {
    const url = request.nextUrl.clone()
    url.pathname = `/${detected}`
    return NextResponse.redirect(url, { status: 302 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, robots.txt, etc.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
