import { NextResponse } from "next/server"
import { bucketsAF, bucketsTagsAF, count100kSitemapPages } from "@/lib/pseo"
import { BASE_URL } from "@/lib/config"
import { SUPPORTED_LOCALES } from "@/lib/i18n"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

function isoDate(d = new Date()) {
  return d.toISOString().slice(0, 10)
}

export async function GET() {
  try {
    const base = BASE_URL
    const lastmod = isoDate()

    const rb = bucketsAF()
    const tg = bucketsTagsAF()

    const sitemapUrls = [
      `${base}/sitemaps/main.xml`,
      `${base}/sitemaps/providers.xml`,

      `${base}/sitemaps/runbooks-a-f.xml`,
      `${base}/sitemaps/runbooks-g-l.xml`,
      `${base}/sitemaps/runbooks-m-r.xml`,
      `${base}/sitemaps/runbooks-s-z.xml`,
      `${base}/sitemaps/runbooks-0-9.xml`,

      `${base}/sitemaps/tags-a-f.xml`,
      `${base}/sitemaps/tags-g-l.xml`,
      `${base}/sitemaps/tags-m-r.xml`,
      `${base}/sitemaps/tags-s-z.xml`,
      `${base}/sitemaps/tags-0-9.xml`,

      // 100K CONTENT EMPIRE: paginated sitemaps (50k URLs each)
      ...Array.from({ length: count100kSitemapPages() }, (_, i) => `${base}/sitemaps/runbook100k-${i}.xml`),

      // NEXT-LEVEL UPGRADE 2026: Language-specific sitemaps for all 10 locales
      ...SUPPORTED_LOCALES.map((locale) => `${base}/sitemaps/i18n-${locale}.xml`),

      // GENESIS PROTOKOLL: Issue / Service / Year hub sitemaps
      `${base}/sitemaps/issues.xml`,
      `${base}/sitemaps/services.xml`,
      `${base}/sitemaps/years.xml`,
    ]

    const active = sitemapUrls.filter((u) => {
      if (u.includes("runbooks-a-f")) return rb["a-f"].length > 0
      if (u.includes("runbooks-g-l")) return rb["g-l"].length > 0
      if (u.includes("runbooks-m-r")) return rb["m-r"].length > 0
      if (u.includes("runbooks-s-z")) return rb["s-z"].length > 0
      if (u.includes("runbooks-0-9")) return rb["0-9"].length > 0

      if (u.includes("tags-a-f")) return tg["a-f"].length > 0
      if (u.includes("tags-g-l")) return tg["g-l"].length > 0
      if (u.includes("tags-m-r")) return tg["m-r"].length > 0
      if (u.includes("tags-s-z")) return tg["s-z"].length > 0
      if (u.includes("tags-0-9")) return tg["0-9"].length > 0

      // 100K CONTENT EMPIRE and i18n sitemaps: always include
      return true
    })

    const xml =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      active.map((loc) => `  <sitemap><loc>${loc}</loc><lastmod>${lastmod}</lastmod></sitemap>`).join("\n") +
      `\n</sitemapindex>\n`

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      }
    })
  } catch {
    // Always return a valid sitemap index even on error to avoid "cannot be retrieved" errors
    const base = BASE_URL
    const lastmod = isoDate()
    const fallback =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      `  <sitemap><loc>${base}/sitemaps/main.xml</loc><lastmod>${lastmod}</lastmod></sitemap>\n` +
      `</sitemapindex>\n`
    return new NextResponse(fallback, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=300, s-maxage=300",
      }
    })
  }
}
