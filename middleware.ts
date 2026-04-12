import { NextRequest, NextResponse } from "next/server"
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale, localeDir } from "@/lib/i18n"
import { getRequestId, getRequestIdHeaderName } from "@/lib/ops/request-id"
import { buildGeoSlug, getGeoProfileFromHeaders, parseGeoVariantSlug, slugifyCity } from "@/lib/geo-matrix"

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

// Per-IP limits for sensitive auth endpoints (edge isolate – first line of defense)
const AUTH_RATE_LIMIT_MAX = 5
const AUTH_RATE_LIMIT_WINDOW_MS = 60 * 1000

function routeBucket(pathname: string): string | null {
  if (pathname === "/api/live-wall") return "live-wall"
  if (pathname === "/api/auth/activate") return "auth-activate"
  if (pathname === "/api/auth/recover") return "auth-recover"
  return null
}

function getBucketConfig(bucket: string): { max: number; windowMs: number } {
  if (bucket === "auth-activate" || bucket === "auth-recover") {
    return { max: AUTH_RATE_LIMIT_MAX, windowMs: AUTH_RATE_LIMIT_WINDOW_MS }
  }
  return { max: RATE_LIMIT_MAX, windowMs: RATE_LIMIT_WINDOW_MS }
}

function checkRateLimit(ip: string, bucket: string): { ok: boolean; retryAfter: number } {
  const key = `${bucket}:${ip}`
  const now = Date.now()
  const { max, windowMs } = getBucketConfig(bucket)
  const entry = RL.get(key)
  if (!entry || now >= entry.resetAt) {
    RL.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, retryAfter: 0 }
  }
  if (entry.count < max) {
    entry.count++
    return { ok: true, retryAfter: 0 }
  }
  return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
}

function isPublicFile(pathname: string): boolean {
  return pathname.includes(".")
}

const RATE_LIMITED_API_PATHS = new Set(["/api/live-wall", "/api/auth/activate", "/api/auth/recover"])

function shouldBypassMiddleware(pathname: string): boolean {
  // All API routes bypass locale-enforcement (rate limiting already ran before this check)
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
  // Allow direct access to the Perfection generator without locale prefix
  if (pathname === "/perfection") return true
  if (pathname.startsWith("/dashboard")) return true
  if (pathname.startsWith("/account")) return true
  // Allow root runbooks page to be served directly without locale prefix
  if (pathname === "/runbooks") return true
  // Allow root temporal and provenance pages to be served directly so that the
  // localizedTemporal / localizedProvenance 308 redirects don't create a loop
  // with the locale-enforcement section below.
  if (/^\/runbook\/[^/]+\/temporal\/?$/i.test(pathname)) return true
  if (/^\/provenance\/[^/]+\/?$/i.test(pathname)) return true
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

function edgeGeoFromRequest(request: NextRequest) {
  const city = request.headers.get("x-vercel-ip-city") || ""
  const region = request.headers.get("x-vercel-ip-country-region") || ""
  const country = request.headers.get("x-vercel-ip-country") || ""
  if (city || region || country) return { city, region, country }
  const fallback = getGeoProfileFromHeaders(request.headers)
  return { city: fallback.city, region: fallback.region, country: fallback.country }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const requestId = getRequestId(request.headers)
  const method = request.method
  const edgeGeo = edgeGeoFromRequest(request)

  // EARLY BYPASS: minimize Edge CPU for most API/static routes, keep only required API rewrites
  const isApi = pathname.startsWith("/api/")
  if (isApi) {
    const keep = pathname === "/api/live-wall" || pathname === "/api/runbooks/search" || pathname === "/api/clawlink.js"
      || RATE_LIMITED_API_PATHS.has(pathname)
    if (!keep) {
      const res = NextResponse.next()
      res.headers.set(getRequestIdHeaderName(), requestId)
      return res
    }
  }
  if (isPublicFile(pathname)) {
    const res = NextResponse.next()
    res.headers.set(getRequestIdHeaderName(), requestId)
    return res
  }

  // Compatibility rewrite: serve /api/clawlink.js from /api/clawlink
  if (pathname === "/api/clawlink.js") {
    const url = request.nextUrl.clone()
    url.pathname = "/api/clawlink"
    const res = NextResponse.rewrite(url)
    res.headers.set(getRequestIdHeaderName(), requestId)
    return res
  }

  // Compatibility rewrite (env-gated): /api/runbooks/search -> /api/runbooks/search-index
  // Enable by setting RUNBOOKS_SEARCH_REWRITE=1 in the environment
  if (pathname === "/api/runbooks/search" && process.env.RUNBOOKS_SEARCH_REWRITE === '1') {
    const url = request.nextUrl.clone()
    url.pathname = "/api/runbooks/search-index"
    const res = NextResponse.rewrite(url)
    res.headers.set(getRequestIdHeaderName(), requestId)
    return res
  }

  // Compatibility rewrite: map localized dashboard/success/account paths to root
  // Example: /de/dashboard -> /dashboard, /de/success -> /success
  const localizedAuthPath = pathname.match(/^\/([a-z]{2}(?:-[a-z]{2})?)\/(dashboard|success|account)\/?(.*)$/i)
  if (localizedAuthPath) {
    const url = request.nextUrl.clone()
    const rest = localizedAuthPath[3] ? `/${localizedAuthPath[3]}` : ""
    url.pathname = `/${localizedAuthPath[2].toLowerCase()}${rest}`
    const res = NextResponse.rewrite(url)
    res.headers.set("x-claw-locale", localizedAuthPath[1].toLowerCase())
    res.headers.set("x-claw-dir", localeDir(localizedAuthPath[1].toLowerCase() as any))
    res.headers.set(getRequestIdHeaderName(), requestId)
    return res
  }

  // Compatibility rewrite: map localized generator route to root generator route
  // Example: /de/perfection -> /perfection
  const localizedPerfection = pathname.match(/^\/([a-z]{2}(?:-[a-z]{2})?)\/perfection\/?$/i)
  if (localizedPerfection) {
    const url = request.nextUrl.clone()
    url.pathname = "/perfection"
    const res = NextResponse.rewrite(url)
    res.headers.set("x-claw-locale", localizedPerfection[1].toLowerCase())
    res.headers.set("x-claw-dir", localeDir(localizedPerfection[1].toLowerCase() as any))
    res.headers.set(getRequestIdHeaderName(), requestId)
    return res
  }

  const localizedGuidesHub = pathname.match(/^\/([a-z]{2}(?:-[a-z]{2})?)\/(gsc-optimize)\/?$/i)
  if (localizedGuidesHub) {
    const url = request.nextUrl.clone()
    url.pathname = "/gsc-optimize"
    const res = NextResponse.rewrite(url)
    res.headers.set("x-claw-locale", localizedGuidesHub[1].toLowerCase())
    res.headers.set("x-claw-dir", localeDir(localizedGuidesHub[1].toLowerCase() as any))
    res.headers.set(getRequestIdHeaderName(), requestId)
    return res
  }

  // Compatibility rewrite: localized share pages map to root share route
  // Example: /de/share/foo -> /share/foo
  const localizedShare = pathname.match(/^\/([a-z]{2}(?:-[a-z]{2})?)\/share\/([^/]+)\/?$/i)
  if (localizedShare) {
    const url = request.nextUrl.clone()
    url.pathname = `/share/${localizedShare[2]}`
    const res = NextResponse.rewrite(url)
    res.headers.set("x-claw-locale", localizedShare[1].toLowerCase())
    res.headers.set("x-claw-dir", localeDir(localizedShare[1].toLowerCase() as any))
    res.headers.set(getRequestIdHeaderName(), requestId)
    return res
  }

  // Recovery redirect for stale CVE solution URLs from search engines.
  // Example: /solutions/fix-CVE-2025-29927 -> /de/solutions?q=CVE-2025-29927
  const rootFixCveUpper = pathname.match(/^\/solutions\/fix-CVE-(.+)$/)
  if (rootFixCveUpper) {
    const url = request.nextUrl.clone()
    url.pathname = `/${DEFAULT_LOCALE}/solutions`
    url.searchParams.set("q", `CVE-${rootFixCveUpper[1]}`)
    const res = NextResponse.redirect(url, 308)
    res.headers.set("x-claw-locale", DEFAULT_LOCALE)
    res.headers.set("x-claw-dir", localeDir(DEFAULT_LOCALE))
    res.headers.set(getRequestIdHeaderName(), requestId)
    return res
  }

  const localizedFixCveUpper = pathname.match(/^\/([a-z]{2}(?:-[a-z]{2})?)\/solutions\/fix-CVE-(.+)$/)
  if (localizedFixCveUpper) {
    const localeFromPath = localizedFixCveUpper[1].toLowerCase() as Locale
    const targetLocale = SUPPORTED_LOCALES.includes(localeFromPath) ? localeFromPath : DEFAULT_LOCALE
    const url = request.nextUrl.clone()
    url.pathname = `/${targetLocale}/solutions`
    url.searchParams.set("q", `CVE-${localizedFixCveUpper[2]}`)
    const res = NextResponse.redirect(url, 308)
    res.headers.set("x-claw-locale", targetLocale)
    res.headers.set("x-claw-dir", localeDir(targetLocale))
    res.headers.set(getRequestIdHeaderName(), requestId)
    return res
  }

  // Apply per-IP rate limiting for hot routes (env-gated to reduce Edge CPU when not needed)
  if (process.env.MW_RL_ENABLED === '1') {
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
  }

  if (shouldBypassMiddleware(pathname)) {
    const res = NextResponse.next()
    res.headers.set(getRequestIdHeaderName(), requestId)
    return res
  }

  // SEO redirects: legacy short slugs -> dedicated landing pages.
  // Keep locale-specific targets so users and crawlers land on canonical intent pages.
  if (pathname === "/moltbot" || pathname === "/clawbot") {
    const targetLocale = preferredLocale(request)
    const url = request.nextUrl.clone()
    url.pathname = pathname === "/moltbot" ? `/${targetLocale}/moltbot-hardening` : `/${targetLocale}/ai-agent-security`
    const res = NextResponse.redirect(url, 308)
    res.headers.set("x-claw-locale", targetLocale)
    res.headers.set("x-claw-dir", localeDir(targetLocale))
    res.headers.set(getRequestIdHeaderName(), requestId)
    return res
  }

  const localizedLegacyLanding = pathname.match(/^\/([a-z]{2}(?:-[a-z]{2})?)\/(moltbot|clawbot)\/?$/i)
  if (localizedLegacyLanding) {
    const localeFromPath = localizedLegacyLanding[1].toLowerCase() as Locale
    const targetLocale = SUPPORTED_LOCALES.includes(localeFromPath) ? localeFromPath : DEFAULT_LOCALE
    const targetSlug = localizedLegacyLanding[2].toLowerCase() === "moltbot" ? "moltbot-hardening" : "ai-agent-security"
    const url = request.nextUrl.clone()
    url.pathname = `/${targetLocale}/${targetSlug}`
    const res = NextResponse.redirect(url, 308)
    res.headers.set("x-claw-locale", targetLocale)
    res.headers.set("x-claw-dir", localeDir(targetLocale))
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
    if (edgeGeo.city) res.headers.set("x-claw-geo-city", edgeGeo.city)
    if (edgeGeo.region) res.headers.set("x-claw-geo-region", edgeGeo.region)
    if (edgeGeo.country) res.headers.set("x-claw-geo-country", edgeGeo.country)
    res.headers.set(getRequestIdHeaderName(), requestId)
    res.cookies.set(LOCALE_COOKIE_NAME, targetLocale, {
      path: "/",
      maxAge: LOCALE_COOKIE_MAX_AGE_SECONDS,
      sameSite: "lax",
    })
    return res
  }

  // Determine allowed locales for high-volume routes. If env var is missing or empty, fall back to sane defaults.
  const rawAllowed = process.env.SITEMAP_100K_LOCALES
  let allowedLocales = (rawAllowed ?? "de,en").split(",").map((s) => s.trim()).filter(Boolean)
  if (allowedLocales.length === 0) {
    allowedLocales = ["de", "en"]
  }
  if (!allowedLocales.includes(locale)) {
    const isRunbookDetail = new RegExp(`^/${locale}/runbook/`, "i").test(pathname)
    const isTagDetail = new RegExp(`^/${locale}/tag/`, "i").test(pathname)
    const isRunbooksIndex = new RegExp(`^/${locale}/runbooks(?:/|$)`, "i").test(pathname)
    if (isRunbookDetail || isTagDetail || isRunbooksIndex) {
      // SEO Fix: Don't redirect non-allowed locales — let the page handler return 404.
      // 308 redirects were causing massive redirect chains that Google penalised.
      // Pass through with noindex header so the page handler can decide (404 or render).
      const res = NextResponse.next()
      res.headers.set("x-claw-locale", locale)
      res.headers.set("x-claw-dir", localeDir(locale as any))
      if (edgeGeo.city) res.headers.set("x-claw-geo-city", edgeGeo.city)
      if (edgeGeo.region) res.headers.set("x-claw-geo-region", edgeGeo.region)
      if (edgeGeo.country) res.headers.set("x-claw-geo-country", edgeGeo.country)
      res.headers.set(getRequestIdHeaderName(), requestId)
      res.headers.set("X-Robots-Tag", "noindex, follow")
      return res
    }
  }

  // Geo-Living Matrix: optionally rewrite base runbook slug to geo-variant slug on demand.
  // Example: /de/runbook/kubernetes-hardening -> /de/runbook/kubernetes-hardening-berlin
  if (process.env.GEO_MATRIX_ENABLED === "1" && process.env.GEO_MATRIX_AUTO_REWRITE === "1") {
    const m = pathname.match(/^\/([a-z]{2}(?:-[a-z]{2})?)\/runbook\/([^/]+)\/?$/i)
    if (m) {
      const lang = m[1]
      const slug = decodeURIComponent(m[2])
      const parsed = parseGeoVariantSlug(slug)
      if (!parsed.citySlug) {
        const citySlug = slugifyCity(edgeGeo.city)
        if (citySlug) {
          const geoSlug = buildGeoSlug(parsed.baseSlug, citySlug)
          const url = request.nextUrl.clone()
          url.pathname = `/${lang}/runbook/${geoSlug}`
          const res = NextResponse.rewrite(url)
          res.headers.set("x-claw-locale", lang.toLowerCase())
          res.headers.set("x-claw-dir", localeDir(lang.toLowerCase() as any))
          if (edgeGeo.city) res.headers.set("x-claw-geo-city", edgeGeo.city)
          if (edgeGeo.region) res.headers.set("x-claw-geo-region", edgeGeo.region)
          if (edgeGeo.country) res.headers.set("x-claw-geo-country", edgeGeo.country)
          res.headers.set(getRequestIdHeaderName(), requestId)
          return res
        }
      }
    }
  }

  // Compatibility redirect: map localized temporal page to root temporal page
  // Use redirect (308) so external checks see a proper redirect status
  const localizedTemporal = pathname.match(/^\/([a-z]{2}(?:-[a-z]{2})?)\/runbook\/([^/]+)\/temporal\/?$/i)
  if (localizedTemporal) {
    const slug = localizedTemporal[2]
    const url = request.nextUrl.clone()
    url.pathname = `/runbook/${slug}/temporal`
    const res = NextResponse.redirect(url, 308)
    res.headers.set("x-claw-locale", locale)
    res.headers.set("x-claw-dir", localeDir(locale))
    res.headers.set(getRequestIdHeaderName(), requestId)
    return res
  }

  // Compatibility redirect: map localized provenance page to root provenance page
  // Use redirect (308) so external checks see a proper redirect status
  const localizedProvenance = pathname.match(/^\/([a-z]{2}(?:-[a-z]{2})?)\/provenance\/([^/]+)\/?$/i)
  if (localizedProvenance) {
    const slug = localizedProvenance[2]
    const url = request.nextUrl.clone()
    url.pathname = `/provenance/${slug}`
    const res = NextResponse.redirect(url, 308)
    res.headers.set("x-claw-locale", locale)
    res.headers.set("x-claw-dir", localeDir(locale))
    res.headers.set(getRequestIdHeaderName(), requestId)
    return res
  }

  // Pass locale+dir to the app for SSR-safe html lang/dir.
  const res = NextResponse.next()
  res.headers.set("x-claw-locale", locale)
  res.headers.set("x-claw-dir", localeDir(locale))
  if (edgeGeo.city) res.headers.set("x-claw-geo-city", edgeGeo.city)
  if (edgeGeo.region) res.headers.set("x-claw-geo-region", edgeGeo.region)
  if (edgeGeo.country) res.headers.set("x-claw-geo-country", edgeGeo.country)
  res.headers.set(getRequestIdHeaderName(), requestId)

  // SEO: noindex for non-primary-locale content pages whose body text is not translated.
  // Only de and en have real content; other locales show duplicate English text.
  // Translated pages (homepage, runbooks, tags) are explicitly excluded.
  const indexableLocales = (process.env.SITEMAP_100K_LOCALES || "de,en").split(",").map((s) => s.trim())
  if (!indexableLocales.includes(locale)) {
    // Pages that ARE translated via dictionary system — keep indexable
    const translatedRoutePatterns = [
      /^\/[a-z]{2}(?:-[a-z]{2})?\/?$/i,                  // homepage
      /^\/[a-z]{2}(?:-[a-z]{2})?\/runbooks?\b/i,         // runbooks index + detail
      /^\/[a-z]{2}(?:-[a-z]{2})?\/tags?\b/i,             // tags index + detail
      /^\/[a-z]{2}(?:-[a-z]{2})?\/roast-my-/i,           // roast-my-* (dictionary-driven)
      /^\/[a-z]{2}(?:-[a-z]{2})?\/summon\b/i,            // summon (dictionary-driven)
      /^\/[a-z]{2}(?:-[a-z]{2})?\/vorstellung\b/i,       // vorstellung (dictionary-driven)
    ]
    const isTranslated = translatedRoutePatterns.some((re) => re.test(pathname))
    if (!isTranslated) {
      res.headers.set("X-Robots-Tag", "noindex, follow")
    }
  }

  // Light CDN caching for Tag pages to lower CPU
  if (method === "GET") {
    const isTagDetail = /^\/(?:[a-z]{2}(?:-[a-z]{2})?)\/tag\//i.test(pathname) || /^\/tag\//i.test(pathname)
    const isTagIndex = /^\/(?:[a-z]{2}(?:-[a-z]{2})?)\/tags\/?$/i.test(pathname) || /^\/tags\/?$/i.test(pathname)
    const isRunbookDetail = /^\/(?:[a-z]{2}(?:-[a-z]{2})?)\/runbook\//i.test(pathname) || /^\/runbook\//i.test(pathname)
    const isTemporalDetail = /\/(?:[a-z]{2}(?:-[a-z]{2})?)?\/runbook\/[^/]+\/temporal\/?$/i.test(pathname)
    if (isTagDetail || isTagIndex || (isRunbookDetail && !isTemporalDetail)) {
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
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\..*).*)",
    "/api/live-wall",
    "/api/runbooks/search",
    "/api/auth/activate",
    "/api/auth/recover",
  ],
}
