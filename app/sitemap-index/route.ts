import { NextRequest, NextResponse } from 'next/server';
import { BASE_URL } from '@/lib/config';
import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
import { logTelemetry } from "@/lib/ops/telemetry"
import { getRequestId } from "@/lib/ops/request-id"

function isoDate(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

const SITEMAP_HEADERS = {
  'Content-Type': 'application/xml; charset=utf-8',
  'Cache-Control': 'public, max-age=86400',
} as const;

export async function GET(req: NextRequest) {
  const requestId = getRequestId(req.headers)
  const startedAt = Date.now()
  const lastmod = isoDate();
  const { count100kSitemapPages } = await import("@/lib/pseo")

  const buckets = ["a-f", "g-l", "m-r", "s-z", "0-9"] as const
  const pages100k = count100kSitemapPages()
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

  const legacyCompat: string[] = [
    `${BASE_URL}/sitemaps/main.xml`,
    `${BASE_URL}/sitemaps/providers.xml`,
    `${BASE_URL}/sitemaps/issues.xml`,
    `${BASE_URL}/sitemaps/services.xml`,
    `${BASE_URL}/sitemaps/years.xml`,
    `${BASE_URL}/sitemaps/tools-check.xml`,
    `${BASE_URL}/sitemaps/solutions-cve.xml`,
  ]

  const all = Array.from(new Set([...subSitemaps, ...legacyCompat]))

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    all
      .map(
        (loc) =>
          `  <sitemap>\n` +
          `    <loc>${loc}</loc>\n` +
          `    <lastmod>${lastmod}</lastmod>\n` +
          `  </sitemap>`
      )
      .join("\n") +
    `\n</sitemapindex>\n`;

  logTelemetry("sitemap.legacy_index.success", {
    requestId,
    sitemapCount: all.length,
    durationMs: Date.now() - startedAt,
  })

  return new NextResponse(xml, {
    status: 200,
    headers: SITEMAP_HEADERS,
  });
}
