import { NextRequest, NextResponse } from "next/server"
import { BASE_URL } from "@/lib/config"
import { SUPPORTED_LOCALES } from "@/lib/i18n"
import { logTelemetry } from "@/lib/ops/telemetry"
import { getRequestId } from "@/lib/ops/request-id"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(req: NextRequest) {
  const requestId = getRequestId(req.headers)
  const startedAt = Date.now()
  const base = BASE_URL
  const allowChunk = process.env.SITEMAP_ALLOW_CHUNK === '1'
  const localeDisallows = SUPPORTED_LOCALES.flatMap((l) => [
    `Disallow: /${l}/admin/`,
    `Disallow: /${l}/api/`,
    `Disallow: /${l}/dashboard/`,
    `Disallow: /${l}/search`,
    `Disallow: /${l}/search/`,
    `Disallow: /${l}/search?*`,
    `Disallow: /${l}/checkout/`,
    `Disallow: /${l}/success/`,
  ])
  const body = [
    "User-agent: *",
    "Allow: /",
    // Explicitly allow public embed script under /api
    "Allow: /api/clawlink.js",
    "",
    "# CRITICAL: Block mass-generated duplicate content (was causing SEO penalty)",
    "Disallow: */runbook100k-*",
    // Allow curated sitemap chunks when enabled
    ...(allowChunk ? [] : [
      "Disallow: */runbooks-*-*.xml",
      "Disallow: */tags-*-*.xml",
    ]),
    "",
    "# Blockiere Admin & Backend",
    "Disallow: /admin/",
    "Disallow: /api/",
    "Disallow: /dashboard/",
    "",
    "# Blockiere interne Suchergebnisse (Spider Trap)",
    "Disallow: /search",
    "Disallow: /search/",
    "Disallow: /search?*",
    "",
    "# Blockiere Checkout/Success",
    "Disallow: /checkout/",
    "Disallow: /success/",
    ...localeDisallows,
    "",
    `Sitemap: ${base}/sitemap.xml`
  ].join("\n")

  logTelemetry("robots.success", {
    requestId,
    localeCount: SUPPORTED_LOCALES.length,
    durationMs: Date.now() - startedAt,
  })

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=30, max-age=300"
    }
  })
}
