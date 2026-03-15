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
  // DEBUG: bypass CDN cache to validate live behaviour; switch back to 86400 after verification
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  'X-Debug-Sitemap': 'true',
} as const;

export async function GET(req: NextRequest) {
  const requestId = getRequestId(req.headers)
  const startedAt = Date.now()
  const lastmod = isoDate();
  const label = 'sitemap:index'
  const ua = req.headers.get('user-agent') || ''
  console.log("SITEMAP DEBUG", { path: req.nextUrl.pathname, start: Date.now() })
  console.time("sitemap-gen")
  console.time(label)
  const PAGES_100K = 69
  const MAX_INDEX_ENTRIES = 100

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

  // Also include non-locale bucket sitemaps for compatibility and quick crawl seeds
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
  const listed = all.slice(0, MAX_INDEX_ENTRIES)

  try {
    const xml =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      listed
        .map(
          (loc) =>
            `  <sitemap>\n` +
            `    <loc>${loc}</loc>\n` +
            `    <lastmod>${lastmod}</lastmod>\n` +
            `  </sitemap>`
        )
        .join("\n") +
      `\n</sitemapindex>\n`;

    const durationMs = Date.now() - startedAt
    console.timeEnd(label)
    console.log('sitemap request', { kind: 'index', requestId, status: 200, durationMs, count: listed.length, total: all.length, ua: ua.slice(0, 64) })
    logTelemetry("sitemap.index.success", { requestId, sitemapCount: listed.length, total: all.length, durationMs })
    console.timeEnd("sitemap-gen")
    console.log("SITEMAP RESPONSE", { status: 200, length: xml.length, first50: xml.slice(0,50) + "..." })

    return new NextResponse(xml, {
      status: 200,
      headers: SITEMAP_HEADERS,
    });
  } catch (error) {
    const durationMs = Date.now() - startedAt
    console.timeEnd(label)
    console.error('sitemap request', { kind: 'index', requestId, status: 200, durationMs, error: String(error) })
    // Minimal valid fallback index so crawlers always get 200
    const fallback =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      `  <sitemap>\n` +
      `    <loc>${BASE_URL}/sitemaps/main.xml</loc>\n` +
      `    <lastmod>${lastmod}</lastmod>\n` +
      `    <changefreq>daily</changefreq>\n` +
      `  </sitemap>\n` +
      `</sitemapindex>\n`
    logTelemetry("sitemap.index.fallback", { requestId, sitemapCount: 1, durationMs })
    console.timeEnd("sitemap-gen")
    console.log("SITEMAP RESPONSE", { status: 200, length: fallback.length, first50: fallback.slice(0,50) + "..." })
    return new NextResponse(fallback, { status: 200, headers: SITEMAP_HEADERS })
  }
}
