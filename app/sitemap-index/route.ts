import { NextRequest, NextResponse } from 'next/server';
import { BASE_URL } from '@/lib/config';
import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
import { logTelemetry } from "@/lib/ops/telemetry"
import { getRequestId } from "@/lib/ops/request-id"

function isoDate(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SITEMAP_HEADERS = {
  'Content-Type': 'application/xml; charset=utf-8',
  // Enable CDN caching to emulate ISR behaviour
  'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=60',
} as const;

export async function GET(req: NextRequest) {
  const target = new URL('/sitemap.xml', req.url)
  return NextResponse.redirect(target, 308)
}
