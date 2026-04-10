import { NextRequest, NextResponse } from 'next/server';

import { BASE_URL } from '@/lib/config';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
import { logTelemetry } from "@/lib/ops/telemetry"
import { getRequestId } from "@/lib/ops/request-id"

function isoDate(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SITEMAP_HEADERS = {
  'Content-Type': 'application/xml; charset=utf-8',
  // Shorter TTL to reflect env-driven bucket/locale changes faster
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=30, max-age=300',
} as const;

export async function GET(req: NextRequest) {
  const requestId = getRequestId(req.headers)
  const startedAt = Date.now()
  const lastmod = isoDate();
  const label = 'sitemap:index'
  const ua = req.headers.get('user-agent') || ''
  console.log("SITEMAP DEBUG", { path: req.nextUrl.pathname, start: Date.now() })
  const timeLabel = `sitemap-gen:${requestId}`
  console.time(timeLabel)
  console.time(label)
  
  // REDUCED: Only quality pages, no 100k mass-generated duplicates
  // This was causing SEO penalty for duplicate/thin content
  const buckets = ["a-f", "g-l", "m-r", "s-z", "0-9"] as const
  const bucketCount = Math.max(1, Math.min(5, parseInt(process.env.SITEMAP_BUCKETS || "3", 10) || 3))
  const bucketsToUse = buckets.slice(0, bucketCount)
  const localesCfg = (process.env.SITEMAP_100K_LOCALES || "").split(",").map((s) => s.trim()).filter(Boolean)
  const selectedLocales = localesCfg.length ? (localesCfg as Locale[]) : SUPPORTED_LOCALES

  const base = `${BASE_URL}/sitemaps`

  // CORE PAGES ONLY — quality over quantity.
  // Hub sitemaps (providers/issues/services/years) each contain only 1-2 URLs and signal
  // an inflated site to Google. They are merged into the main sitemap instead.
  const main = selectedLocales.map((loc) => `${base}/main-${loc}.xml`)

  const geoRunbooks = process.env.GEO_MATRIX_SITEMAP === "1"
    ? selectedLocales.map((loc) => `${base}/geo-runbooks-${loc}.xml`)
    : []
  
  // LIMIT tags and runbooks to prevent duplicate content penalty (configurable via SITEMAP_BUCKETS)
  const tags = selectedLocales.flatMap((loc) => bucketsToUse.map((b) => `${base}/tags-${loc}-${b}.xml`))
  const runbooks = selectedLocales.flatMap((loc) => bucketsToUse.map((b) => `${base}/runbooks-${loc}-${b}.xml`))
  
  // 100K synthetic sitemaps PERMANENTLY DISABLED — they were the primary cause of Google
  // indexing 400k+ thin/duplicate pages and penalising the domain's crawl budget.
  // These are NOT behind a flag anymore; they must never be re-enabled.

  const legacyCompat: string[] = [
    `${base}/main.xml`,
  ]

  const listed = [
    ...main,
    ...geoRunbooks,
    ...tags,
    ...runbooks,
    ...legacyCompat,
  ]

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
    console.log('sitemap request', { kind: 'index', requestId, status: 200, durationMs, count: listed.length, ua: ua.slice(0, 64) })
    logTelemetry("sitemap.index.success", { requestId, sitemapCount: listed.length, durationMs })
    console.timeEnd(timeLabel)
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
    console.timeEnd(timeLabel)
    console.log("SITEMAP RESPONSE", { status: 200, length: fallback.length, first50: fallback.slice(0,50) + "..." })
    return new NextResponse(fallback, { status: 200, headers: SITEMAP_HEADERS })
  }
}
