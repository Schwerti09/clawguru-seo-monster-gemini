import { NextRequest, NextResponse } from 'next/server';
import { BASE_URL } from '@/lib/config';
import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
import { logTelemetry } from "@/lib/ops/telemetry"
import { getRequestId } from "@/lib/ops/request-id"

function isoDate(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

const SITEMAP_HEADERS = {
  'Content-Type': 'application/xml; charset=utf-8',
  // Enable CDN caching to emulate ISR behaviour
  'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=60',
} as const;

export async function GET(req: NextRequest) {
  const requestId = getRequestId(req.headers)
  const startedAt = Date.now()
  const lastmod = isoDate();
  const PAGES_100K = Number(process.env.SITEMAP_100K_PAGES || 69)
  const label = 'sitemap:legacy_index'
  console.time(label)

  const buckets = ["a-f", "g-l", "m-r", "s-z", "0-9"] as const
  const pages100k = PAGES_100K
  const locales = SUPPORTED_LOCALES as readonly Locale[]

  const subSitemaps: string[] = locales.flatMap((locale) => {
    const base = `${BASE_URL}/sitemaps`

    const main = [`${base}/main-${locale}.xml`]
    const hubs = [
      `${base}/providers-${locale}.xml`,
      `${base}/issues-${locale}.xml`,
      `${base}/services-${locale}.xml`,
      `${base}/years-${locale}.xml`,
    ]
    const tools = [`${base}/tools-check-${locale}.xml`]
    const solutions = [`${base}/solutions-cve-${locale}.xml`]
    const tags = buckets.map((b) => `${base}/tags-${locale}-${b}.xml`)
    const runbooks = buckets.map((b) => `${base}/runbooks-${locale}-${b}.xml`)
    const runbook100k = Array.from({ length: pages100k }, (_, page) => `${base}/runbook100k-${locale}-${page}.xml`)

    return [...main, ...hubs, ...tools, ...solutions, ...tags, ...runbooks, ...runbook100k]
  })

  const bucketNoLocale: string[] = [
    `${BASE_URL}/sitemaps/runbooks-a-f.xml`,
    `${BASE_URL}/sitemaps/runbooks-g-l.xml`,
    `${BASE_URL}/sitemaps/runbooks-m-r.xml`,
    `${BASE_URL}/sitemaps/runbooks-s-z.xml`,
    `${BASE_URL}/sitemaps/runbooks-0-9.xml`,
    `${BASE_URL}/sitemaps/tags-a-f.xml`,
    `${BASE_URL}/sitemaps/tags-g-l.xml`,
    `${BASE_URL}/sitemaps/tags-m-r.xml`,
    `${BASE_URL}/sitemaps/tags-s-z.xml`,
    `${BASE_URL}/sitemaps/tags-0-9.xml`,
  ]

  const legacyCompat: string[] = [
    `${BASE_URL}/sitemaps/main.xml`,
    `${BASE_URL}/sitemaps/providers.xml`,
    `${BASE_URL}/sitemaps/issues.xml`,
    `${BASE_URL}/sitemaps/services.xml`,
    `${BASE_URL}/sitemaps/years.xml`,
    `${BASE_URL}/sitemaps/tools-check.xml`,
    `${BASE_URL}/sitemaps/solutions-cve.xml`,
    `${BASE_URL}/sitemaps/solutions.xml`,
    `${BASE_URL}/sitemaps/cves.xml`,
  ]

  const all = Array.from(new Set([...subSitemaps, ...bucketNoLocale, ...legacyCompat]))

  try {
    const xml =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      all
        .map(
          (loc) =>
            `  <sitemap>\n` +
            `    <loc>${loc}</loc>\n` +
            `    <lastmod>${lastmod}</lastmod>\n` +
            `    <changefreq>daily</changefreq>\n` +
            `  </sitemap>`
        )
        .join("\n") +
      `\n</sitemapindex>\n`;

    const durationMs = Date.now() - startedAt
    console.timeEnd(label)
    console.log('sitemap request', { kind: 'legacy_index', requestId, status: 200, durationMs, count: all.length })
    logTelemetry("sitemap.legacy_index.success", { requestId, sitemapCount: all.length, durationMs })

    return new NextResponse(xml, {
      status: 200,
      headers: SITEMAP_HEADERS,
    });
  } catch (error) {
    const durationMs = Date.now() - startedAt
    console.timeEnd(label)
    console.error('sitemap request', { kind: 'legacy_index', requestId, status: 200, durationMs, error: String(error) })
    const fallback =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      `  <sitemap>\n` +
      `    <loc>${BASE_URL}/sitemaps/main.xml</loc>\n` +
      `    <lastmod>${lastmod}</lastmod>\n` +
      `    <changefreq>daily</changefreq>\n` +
      `  </sitemap>\n` +
      `</sitemapindex>\n`;
    logTelemetry("sitemap.legacy_index.fallback", { requestId, sitemapCount: 1, durationMs })
    return new NextResponse(fallback, { status: 200, headers: SITEMAP_HEADERS })
  }
}
