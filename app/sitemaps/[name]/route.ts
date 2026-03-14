import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { BASE_URL } from "@/lib/config"
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale, getLocaleHrefLang, localizePath, stripLocalePrefix } from "@/lib/i18n"
import { logTelemetry } from "@/lib/ops/telemetry"
import { getRequestId } from "@/lib/ops/request-id"
import { validateRunbook } from "@/lib/quality-gate"
import type { Runbook } from "@/lib/pseo"
import { KNOWN_CVES, SERVICE_CHECKS } from "@/lib/cve-pseo"

// IMPORTANT: This route must stay dynamic (Netlify prerender can call it without params)
export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const SITEMAP_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "no-store, no-cache, must-revalidate",
} as const

function bucketsAFQualityPassed(runbooks: Runbook[]) {
  const groups: Record<"a-f" | "g-l" | "m-r" | "s-z" | "0-9", Runbook[]> = {
    "a-f": [],
    "g-l": [],
    "m-r": [],
    "s-z": [],
    "0-9": [],
  }

  for (const runbook of runbooks) {
    if (validateRunbook(runbook).violations.some((v) => v.severity === "error")) continue
    const c = (runbook.slug[0] || "").toLowerCase()
    if (c >= "a" && c <= "f") groups["a-f"].push(runbook)
    else if (c >= "g" && c <= "l") groups["g-l"].push(runbook)
    else if (c >= "m" && c <= "r") groups["m-r"].push(runbook)
    else if (c >= "s" && c <= "z") groups["s-z"].push(runbook)
    else groups["0-9"].push(runbook)
  }

  return groups
}

function isoDate(d = new Date()) {
  return d.toISOString().slice(0, 10)
}

function buildAlternateLinks(loc: string): string[] {
  let pathname = "/"
  try {
    pathname = new URL(loc).pathname || "/"
  } catch {
    pathname = "/"
  }

  const canonicalPath = stripLocalePrefix(pathname)
  const links = SUPPORTED_LOCALES.map(
    (locale) =>
      `    <xhtml:link rel="alternate" hreflang="${getLocaleHrefLang(locale)}" href="${BASE_URL}${localizePath(locale, canonicalPath)}" />`
  )
  links.push(
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${localizePath(DEFAULT_LOCALE, canonicalPath)}" />`
  )
  return links
}

function urlset(urls: Array<{ loc: string; lastmod?: string; changefreq?: string; priority?: string }>) {
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
    urls
      .map((u) => {
        const alternates = buildAlternateLinks(u.loc)
        const parts = [
          `  <url>`,
          `    <loc>${u.loc}</loc>`,
          u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>` : "",
          u.changefreq ? `    <changefreq>${u.changefreq}</changefreq>` : "",
          u.priority ? `    <priority>${u.priority}</priority>` : "",
          ...alternates,
          `  </url>`
        ].filter(Boolean)
        return parts.join("\n")
      })
      .join("\n") +
    `\n</urlset>\n`
  return xml
}

export async function GET(
  req: NextRequest,
  { params }: { params: { name: string } }
) {
  const requestId = getRequestId(req.headers)
  const startedAt = Date.now()
  const base = BASE_URL
  const lastmod = isoDate()
  const name = params.name.replace(/\.xml$/, "")
  const {
    bucketsTagsAF,
    allProviders,
    get100kSlugsPage,
    allIssues100k,
    allServices100k,
    allYears100k,
    RUNBOOKS,
  } = await import("@/lib/pseo")

  const rb = bucketsAFQualityPassed(RUNBOOKS)
  const tg = bucketsTagsAF()
  logTelemetry("sitemap.chunk.request", {
    requestId,
    name,
  })

  // Live debug hooks
  console.log("SITEMAP DEBUG", { path: req.nextUrl.pathname, start: Date.now() })
  console.time("sitemap-gen")
  function respond(xml: string) {
    console.timeEnd("sitemap-gen")
    console.log("SITEMAP RESPONSE", { status: 200, length: xml.length, first50: xml.slice(0,50) + "..." })
    return new NextResponse(xml, { status: 200, headers: SITEMAP_HEADERS })
  }

  const localeMatch = name.match(/-([a-z]{2})(?:-|$)/i)
  const locale = (SUPPORTED_LOCALES.includes((localeMatch?.[1] ?? "") as Locale) ? localeMatch?.[1] : DEFAULT_LOCALE) as Locale

  if (!name) {
    logTelemetry("sitemap.chunk.error", {
      requestId,
      name,
      reason: "missing_name",
      durationMs: Date.now() - startedAt,
    })
    return new NextResponse("Not Found", { status: 404 })
  }

  try {
    if (name === `main-${locale}` || name === "main") {
      const HUB_SLUGS = ["cloud", "docker", "kubernetes", "security"]
      const hubUrls = HUB_SLUGS.map((hub) => ({
        loc: `${base}/${locale}/runbooks/${hub}`,
        lastmod,
        changefreq: "weekly",
        priority: "0.85",
      }))
      const urls = [
        { loc: `${base}/${locale}`, lastmod, changefreq: "daily", priority: "1.0" },
        { loc: `${base}/${locale}/live`, lastmod, changefreq: "daily", priority: "0.95" },
        { loc: `${base}/${locale}/check`, lastmod, changefreq: "daily", priority: "0.9" },
        { loc: `${base}/${locale}/emergency`, lastmod, changefreq: "weekly", priority: "0.9" },
        { loc: `${base}/${locale}/copilot`, lastmod, changefreq: "weekly", priority: "0.9" },
        { loc: `${base}/${locale}/runbooks`, lastmod, changefreq: "daily", priority: "0.9" },
        { loc: `${base}/${locale}/solutions`, lastmod, changefreq: "weekly", priority: "0.85" },
        { loc: `${base}/${locale}/tools`, lastmod, changefreq: "weekly", priority: "0.8" },
        { loc: `${base}/${locale}/tags`, lastmod, changefreq: "weekly", priority: "0.8" },
        { loc: `${base}/${locale}/issues`, lastmod, changefreq: "weekly", priority: "0.85" },
        { loc: `${base}/${locale}/services`, lastmod, changefreq: "weekly", priority: "0.85" },
        { loc: `${base}/${locale}/years`, lastmod, changefreq: "monthly", priority: "0.8" },
        { loc: `${base}/${locale}/intel`, lastmod, changefreq: "daily", priority: "0.8" },
        { loc: `${base}/${locale}/academy`, lastmod, changefreq: "weekly", priority: "0.8" },
        { loc: `${base}/${locale}/pricing`, lastmod, changefreq: "weekly", priority: "0.7" },
        { loc: `${base}/${locale}/downloads`, lastmod, changefreq: "weekly", priority: "0.7" },
        { loc: `${base}/${locale}/clawverse`, lastmod, changefreq: "weekly", priority: "0.85" },
        { loc: `${base}/${locale}/universe`, lastmod, changefreq: "weekly", priority: "0.9" },
        { loc: `${base}/${locale}/temporal`, lastmod, changefreq: "weekly", priority: "0.85" },
        { loc: `${base}/${locale}/clawlink`, lastmod, changefreq: "weekly", priority: "0.8" },
        ...hubUrls,
      ]
      return new NextResponse(urlset(urls), {
        status: 200,
        headers: SITEMAP_HEADERS
      })
    }


    if (name === `providers-${locale}` || name === "providers") {
      const providersList = allProviders()
      const urls = providersList.map((p) => ({
        loc: `${base}/${locale}/provider/${p.slug}`,
        lastmod,
        changefreq: "weekly",
        priority: "0.7"
      }))
      return new NextResponse(urlset(urls), {
        status: 200,
        headers: SITEMAP_HEADERS
      })
    }

    const rbMap: Record<string, keyof typeof rb> = {
      "runbooks-a-f": "a-f",
      "runbooks-g-l": "g-l",
      "runbooks-m-r": "m-r",
      "runbooks-s-z": "s-z",
      "runbooks-0-9": "0-9"
    }

    const rbLocaleMatch = name.match(/^runbooks-([a-z]{2})-(a-f|g-l|m-r|s-z|0-9)$/i)
    if (rbLocaleMatch?.[1] && rbLocaleMatch?.[2]) {
      const loc = (SUPPORTED_LOCALES.includes(rbLocaleMatch[1] as Locale) ? rbLocaleMatch[1] : DEFAULT_LOCALE) as Locale
      const bucket = rbLocaleMatch[2] as keyof typeof rb
      const urls = rb[bucket].map((r) => ({
        loc: `${base}/${loc}/runbook/${r.slug}`,
        lastmod: r.lastmod || lastmod,
        changefreq: "weekly",
        priority: "0.8"
      }))
      return new NextResponse(urlset(urls), { status: 200, headers: SITEMAP_HEADERS })
    }

    const tgMap: Record<string, keyof typeof tg> = {
      "tags-a-f": "a-f",
      "tags-g-l": "g-l",
      "tags-m-r": "m-r",
      "tags-s-z": "s-z",
      "tags-0-9": "0-9"
    }

    const tgLocaleMatch = name.match(/^tags-([a-z]{2})-(a-f|g-l|m-r|s-z|0-9)$/i)
    if (tgLocaleMatch?.[1] && tgLocaleMatch?.[2]) {
      const loc = (SUPPORTED_LOCALES.includes(tgLocaleMatch[1] as Locale) ? tgLocaleMatch[1] : DEFAULT_LOCALE) as Locale
      const bucket = tgLocaleMatch[2] as keyof typeof tg
      const urls = tg[bucket].map((t) => ({
        loc: `${base}/${loc}/tag/${encodeURIComponent(t)}`,
        lastmod,
        changefreq: "weekly",
        priority: "0.6"
      }))
      return respond(urlset(urls))
    }

    if (rbMap[name]) {
      const key = rbMap[name]
      const urls = rb[key].map((r) => ({
        loc: `${base}/${DEFAULT_LOCALE}/runbook/${r.slug}`,
        lastmod: r.lastmod || lastmod,
        changefreq: "weekly",
        priority: "0.8"
      }))
      return respond(urlset(urls))
    }

    if (tgMap[name]) {
      const key = tgMap[name]
      const urls = tg[key].map((t) => ({
        loc: `${base}/${DEFAULT_LOCALE}/tag/${encodeURIComponent(t)}`,
        lastmod,
        changefreq: "weekly",
        priority: "0.6"
      }))
      return new NextResponse(urlset(urls), {
        status: 200,
        headers: SITEMAP_HEADERS
      })
    }

    // 100K CONTENT EMPIRE: paginated runbook sitemaps (runbook100k-0, runbook100k-1, …)
    const pageMatch100kLocale = name.match(/^runbook100k-([a-z]{2})-(\d+)$/i)
    const pageMatch100kLegacy = name.match(/^runbook100k-(\d+)$/i)
    if (pageMatch100kLocale || pageMatch100kLegacy) {
      const loc = (pageMatch100kLocale?.[1] && SUPPORTED_LOCALES.includes(pageMatch100kLocale[1] as Locale)
        ? pageMatch100kLocale[1]
        : DEFAULT_LOCALE) as Locale
      const page = parseInt((pageMatch100kLocale?.[2] ?? pageMatch100kLegacy?.[1]) as string, 10)
      const slugsFull = get100kSlugsPage(page)
      const BATCH_LIMIT = 5000
      const slugs = slugsFull.slice(0, BATCH_LIMIT)
      const urls = slugs.map((slug) => ({
        loc: `${base}/${loc}/runbook/${slug}`,
        lastmod,
        changefreq: "monthly",
        priority: "0.8",
      }))
      return respond(urlset(urls))
    }

    // NEXT-LEVEL UPGRADE 2026: Language-specific sitemaps for i18n runbook pages
    if (name.startsWith("i18n-")) {
      const locale = name.slice(5) as Locale
      if (!SUPPORTED_LOCALES.includes(locale)) {
        logTelemetry("sitemap.chunk.error", {
          requestId,
          name,
          reason: "invalid_i18n_locale",
          durationMs: Date.now() - startedAt,
        })
        return new NextResponse("Not Found", { status: 404 })
      }
      // Top 200 runbooks in localized URLs for crawlability
      const allRunbooks = [
        ...rb["a-f"],
        ...rb["g-l"],
        ...rb["m-r"],
        ...rb["s-z"],
        ...rb["0-9"],
      ].slice(0, 200)
      const i18nUrls = allRunbooks.map((r) => ({
        loc: `${base}/${locale}/runbook/${r.slug}`,
        lastmod: r.lastmod || lastmod,
        changefreq: "weekly",
        priority: "0.7",
      }))
      return new NextResponse(urlset(i18nUrls), {
        status: 200,
        headers: SITEMAP_HEADERS,
      })
    }

    // GENESIS PROTOKOLL: Issue hub sitemap
    if (name === "issues") {
      const issues = allIssues100k()
      const urls = [
        { loc: `${base}/${DEFAULT_LOCALE}/issues`, lastmod, changefreq: "weekly", priority: "0.85" },
        ...issues.map((issue) => ({
          loc: `${base}/${DEFAULT_LOCALE}/issue/${issue.slug}`,
          lastmod,
          changefreq: "weekly",
          priority: "0.8",
        })),
      ]
      return new NextResponse(urlset(urls), { status: 200, headers: SITEMAP_HEADERS })
    }

    if (name === `issues-${locale}`) {
      const issues = allIssues100k()
      const urls = [
        { loc: `${base}/${locale}/issues`, lastmod, changefreq: "weekly", priority: "0.85" },
        ...issues.map((issue) => ({
          loc: `${base}/${locale}/issue/${issue.slug}`,
          lastmod,
          changefreq: "weekly",
          priority: "0.8",
        })),
      ]
      return new NextResponse(urlset(urls), { status: 200, headers: SITEMAP_HEADERS })
    }

    // GENESIS PROTOKOLL: Service hub sitemap
    if (name === "services") {
      const services = allServices100k()
      const urls = [
        { loc: `${base}/${DEFAULT_LOCALE}/services`, lastmod, changefreq: "weekly", priority: "0.85" },
        ...services.map((service) => ({
          loc: `${base}/${DEFAULT_LOCALE}/service/${service.slug}`,
          lastmod,
          changefreq: "weekly",
          priority: "0.8",
        })),
      ]
      return new NextResponse(urlset(urls), { status: 200, headers: SITEMAP_HEADERS })
    }

    if (name === `services-${locale}`) {
      const services = allServices100k()
      const urls = [
        { loc: `${base}/${locale}/services`, lastmod, changefreq: "weekly", priority: "0.85" },
        ...services.map((service) => ({
          loc: `${base}/${locale}/service/${service.slug}`,
          lastmod,
          changefreq: "weekly",
          priority: "0.8",
        })),
      ]
      return new NextResponse(urlset(urls), { status: 200, headers: SITEMAP_HEADERS })
    }

    // GENESIS PROTOKOLL: Year hub sitemap
    if (name === "years") {
      const years = allYears100k()
      const urls = [
        { loc: `${base}/${DEFAULT_LOCALE}/years`, lastmod, changefreq: "monthly", priority: "0.8" },
        ...years.map((year) => ({
          loc: `${base}/${DEFAULT_LOCALE}/year/${year}`,
          lastmod,
          changefreq: "monthly",
          priority: "0.75",
        })),
      ]
      return new NextResponse(urlset(urls), { status: 200, headers: SITEMAP_HEADERS })
    }

    if (name === `years-${locale}`) {
      const years = allYears100k()
      const urls = [
        { loc: `${base}/${locale}/years`, lastmod, changefreq: "monthly", priority: "0.8" },
        ...years.map((year) => ({
          loc: `${base}/${locale}/year/${year}`,
          lastmod,
          changefreq: "monthly",
          priority: "0.75",
        })),
      ]
      return new NextResponse(urlset(urls), { status: 200, headers: SITEMAP_HEADERS })
    }

    // PROGRAMMATIC SEO: CVE Solutions sitemap (/solutions/fix-CVE-*)
    if (name === "solutions-cve" || name === "solutions" || name === "cves") {
      const urls = [
        { loc: `${base}/${DEFAULT_LOCALE}/solutions`, lastmod, changefreq: "weekly", priority: "0.85" },
        ...KNOWN_CVES.map((cve) => ({
          loc: `${base}/${DEFAULT_LOCALE}/solutions/fix-${cve.cveId}`,
          lastmod: cve.publishedDate,
          changefreq: "monthly",
          priority: "0.85",
        })),
      ]
      return new NextResponse(urlset(urls), { status: 200, headers: SITEMAP_HEADERS })
    }

    if (name === `solutions-cve-${locale}`) {
      const urls = [
        { loc: `${base}/${locale}/solutions`, lastmod, changefreq: "weekly", priority: "0.85" },
        ...KNOWN_CVES.map((cve) => ({
          loc: `${base}/${locale}/solutions/fix-${cve.cveId}`,
          lastmod: cve.publishedDate,
          changefreq: "monthly",
          priority: "0.85",
        })),
      ]
      return new NextResponse(urlset(urls), { status: 200, headers: SITEMAP_HEADERS })
    }

    // PROGRAMMATIC SEO: Service Check Tools sitemap (/tools/check-*)
    if (name === "tools-check") {
      const urls = [
        { loc: `${base}/${DEFAULT_LOCALE}/tools`, lastmod, changefreq: "weekly", priority: "0.8" },
        ...SERVICE_CHECKS.map((svc) => ({
          loc: `${base}/${DEFAULT_LOCALE}/tools/check-${svc.slug}`,
          lastmod,
          changefreq: "monthly",
          priority: "0.8",
        })),
      ]
      return new NextResponse(urlset(urls), { status: 200, headers: SITEMAP_HEADERS })
    }

    if (name === `tools-check-${locale}`) {
      const urls = [
        { loc: `${base}/${locale}/tools`, lastmod, changefreq: "weekly", priority: "0.8" },
        ...SERVICE_CHECKS.map((svc) => ({
          loc: `${base}/${locale}/tools/check-${svc.slug}`,
          lastmod,
          changefreq: "monthly",
          priority: "0.8",
        })),
      ]
      return new NextResponse(urlset(urls), { status: 200, headers: SITEMAP_HEADERS })
    }

    logTelemetry("sitemap.chunk.error", {
      requestId,
      name,
      reason: "sitemap_not_found",
      durationMs: Date.now() - startedAt,
    })
    console.timeEnd("sitemap-gen")
    console.log("SITEMAP RESPONSE", { status: 404, length: 0, first50: "" })
    return new NextResponse("Not Found", { status: 404 })
  } catch (error) {
    // Return a minimal valid urlset with at least one URL so crawlers always get a 200
    logTelemetry("sitemap.chunk.error", {
      requestId,
      name,
      reason: "generator_exception",
      durationMs: Date.now() - startedAt,
    })
    console.error("SITEMAP CRASH", { name, error: String(error) })
    const minimal = urlset([
      { loc: `${BASE_URL}/en/runbook/test-debug-slug`, lastmod },
    ])
    console.timeEnd("sitemap-gen")
    console.log("SITEMAP RESPONSE", { status: 200, length: minimal.length, first50: minimal.slice(0,50) + "..." })
    return new NextResponse(minimal, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      }
    })
  }
}
