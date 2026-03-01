import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { bucketsAF, bucketsTagsAF, allProviders, get100kSlugsPage, allIssues100k, allServices100k, allYears100k } from "@/lib/pseo"
import { BASE_URL } from "@/lib/config"
import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"

// IMPORTANT: This route must stay dynamic (Netlify prerender can call it without params)
export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const SITEMAP_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=3600, s-maxage=3600",
} as const

function isoDate(d = new Date()) {
  return d.toISOString().slice(0, 10)
}

function urlset(urls: Array<{ loc: string; lastmod?: string; changefreq?: string; priority?: string }>) {
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map((u) => {
        const parts = [
          `  <url>`,
          `    <loc>${u.loc}</loc>`,
          u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>` : "",
          u.changefreq ? `    <changefreq>${u.changefreq}</changefreq>` : "",
          u.priority ? `    <priority>${u.priority}</priority>` : "",
          `  </url>`
        ].filter(Boolean)
        return parts.join("\n")
      })
      .join("\n") +
    `\n</urlset>\n`
  return xml
}

export async function GET(
  _req: NextRequest,
  context?: { params?: { name?: string } }
) {
  const base = BASE_URL
  const lastmod = isoDate()
  const name = (context?.params?.name ?? "").replace(/\.xml$/, "")

  if (!name) {
    return new NextResponse("Not Found", { status: 404 })
  }

  try {
    if (name === "main") {
      const HUB_SLUGS = ["cloud", "docker", "kubernetes", "security"]
      const hubUrls = SUPPORTED_LOCALES.flatMap((locale) =>
        HUB_SLUGS.map((hub) => ({
          loc: `${base}/${locale}/runbooks/${hub}`,
          lastmod,
          changefreq: "weekly",
          priority: "0.85",
        }))
      )
      const urls = [
        { loc: `${base}/`, lastmod, changefreq: "daily", priority: "1.0" },
        { loc: `${base}/live`, lastmod, changefreq: "daily", priority: "0.95" },
        { loc: `${base}/check`, lastmod, changefreq: "daily", priority: "0.9" },
        { loc: `${base}/copilot`, lastmod, changefreq: "weekly", priority: "0.9" },
        { loc: `${base}/runbooks`, lastmod, changefreq: "daily", priority: "0.9" },
        { loc: `${base}/tags`, lastmod, changefreq: "weekly", priority: "0.8" },
        { loc: `${base}/issues`, lastmod, changefreq: "weekly", priority: "0.85" },
        { loc: `${base}/services`, lastmod, changefreq: "weekly", priority: "0.85" },
        { loc: `${base}/years`, lastmod, changefreq: "monthly", priority: "0.8" },
        { loc: `${base}/intel`, lastmod, changefreq: "daily", priority: "0.8" },
        { loc: `${base}/academy`, lastmod, changefreq: "weekly", priority: "0.8" },
        { loc: `${base}/pricing`, lastmod, changefreq: "weekly", priority: "0.7" },
        { loc: `${base}/downloads`, lastmod, changefreq: "weekly", priority: "0.7" },
        { loc: `${base}/clawverse`, lastmod, changefreq: "weekly", priority: "0.85" },
        { loc: `${base}/universe`, lastmod, changefreq: "weekly", priority: "0.9" },
        ...hubUrls,
      ]
      return new NextResponse(urlset(urls), {
        status: 200,
        headers: SITEMAP_HEADERS
      })
    }


    if (name === "providers") {
      const urls = allProviders().map((p) => ({
        loc: `${base}/provider/${p.slug}`,
        lastmod,
        changefreq: "weekly",
        priority: "0.7"
      }))
      return new NextResponse(urlset(urls), {
        status: 200,
        headers: SITEMAP_HEADERS
      })
    }

    const rb = bucketsAF()
    const tg = bucketsTagsAF()

    const rbMap: Record<string, keyof typeof rb> = {
      "runbooks-a-f": "a-f",
      "runbooks-g-l": "g-l",
      "runbooks-m-r": "m-r",
      "runbooks-s-z": "s-z",
      "runbooks-0-9": "0-9"
    }

    const tgMap: Record<string, keyof typeof tg> = {
      "tags-a-f": "a-f",
      "tags-g-l": "g-l",
      "tags-m-r": "m-r",
      "tags-s-z": "s-z",
      "tags-0-9": "0-9"
    }

    if (rbMap[name]) {
      const key = rbMap[name]
      const urls = rb[key].map((r) => ({
        loc: `${base}/runbook/${r.slug}`,
        lastmod: r.lastmod || lastmod,
        changefreq: "weekly",
        priority: "0.8"
      }))
      return new NextResponse(urlset(urls), {
        status: 200,
        headers: SITEMAP_HEADERS
      })
    }

    if (tgMap[name]) {
      const key = tgMap[name]
      const urls = tg[key].map((t) => ({
        loc: `${base}/tag/${encodeURIComponent(t)}`,
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
    const pageMatch100k = name.match(/^runbook100k-(\d+)$/)
    if (pageMatch100k) {
      const page = parseInt(pageMatch100k[1], 10)
      const slugs = get100kSlugsPage(page)
      const urls = slugs.map((slug) => ({
        loc: `${base}/runbook/${slug}`,
        lastmod: "2026-02-25",
        changefreq: "monthly",
        priority: "0.8",
      }))
      return new NextResponse(urlset(urls), { status: 200, headers: SITEMAP_HEADERS })
    }

    // NEXT-LEVEL UPGRADE 2026: Language-specific sitemaps for i18n runbook pages
    if (name.startsWith("i18n-")) {
      const locale = name.slice(5) as Locale
      if (!SUPPORTED_LOCALES.includes(locale)) {
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
        { loc: `${base}/issues`, lastmod, changefreq: "weekly", priority: "0.85" },
        ...issues.map((issue) => ({
          loc: `${base}/issue/${issue.slug}`,
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
        { loc: `${base}/services`, lastmod, changefreq: "weekly", priority: "0.85" },
        ...services.map((service) => ({
          loc: `${base}/service/${service.slug}`,
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
        { loc: `${base}/years`, lastmod, changefreq: "monthly", priority: "0.8" },
        ...years.map((year) => ({
          loc: `${base}/year/${year}`,
          lastmod,
          changefreq: "monthly",
          priority: "0.75",
        })),
      ]
      return new NextResponse(urlset(urls), { status: 200, headers: SITEMAP_HEADERS })
    }

    return new NextResponse("Not Found", { status: 404 })
  } catch {
    // Return a minimal valid urlset on error so crawlers always get a 200
    const empty = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n`
    return new NextResponse(empty, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=300, s-maxage=300",
      }
    })
  }
}
