import { NextRequest, NextResponse } from "next/server"
import { BASE_URL } from "@/lib/config"
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/i18n"
import { getTopCities } from "@/lib/geo-cities"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 60

type Probe = { city: string; url: string; status: number; ok: boolean; finalUrl?: string }
const PROBE_TIMEOUT_MS = 8_000
const MAX_CITY_LIMIT = 24
const CACHE_TTL_MS = 30_000
const responseCache = new Map<string, { expiresAt: number; payload: any }>()

async function probeUrl(url: string): Promise<{ status: number; finalUrl?: string }> {
  const res = await fetch(url, {
    redirect: "manual",
    cache: "no-store",
    signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
  })
  if ((res.status === 307 || res.status === 308) && res.headers.get("location")) {
    const nextUrl = new URL(res.headers.get("location") || "", url)
    // Security hardening: only follow redirects on our own domain.
    if (nextUrl.origin !== BASE_URL) {
      return { status: 0, finalUrl: nextUrl.toString() }
    }
    const second = await fetch(nextUrl.toString(), {
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
    })
    return { status: second.status, finalUrl: nextUrl.toString() }
  }
  return { status: res.status, finalUrl: url }
}

function toCsv(rows: Probe[]) {
  const header = "city,url,status,ok,final_url"
  const lines = rows.map((r) => `${r.city},${r.url},${r.status},${r.ok ? "1" : "0"},${r.finalUrl || ""}`)
  return [header, ...lines].join("\n")
}

export async function GET(req: NextRequest) {
  const startedAt = Date.now()
  const format = (req.nextUrl.searchParams.get("format") || "json").toLowerCase()
  const localeRaw = (req.nextUrl.searchParams.get("locale") || DEFAULT_LOCALE).toLowerCase()
  const locale = SUPPORTED_LOCALES.includes(localeRaw as any) ? localeRaw : DEFAULT_LOCALE
  const slugRaw = req.nextUrl.searchParams.get("slug") || "aws-ssh-hardening-2026"
  const slug = /^[a-z0-9-]+$/i.test(slugRaw) ? slugRaw : "aws-ssh-hardening-2026"
  const parsedLimit = parseInt(req.nextUrl.searchParams.get("limit") || process.env.GEO_INDEX_HEALTH_CITY_LIMIT || "12", 10) || 12
  const cityLimit = Math.max(1, Math.min(MAX_CITY_LIMIT, parsedLimit))
  const cacheKey = `${locale}:${slug}:${cityLimit}:${format}`
  const cached = responseCache.get(cacheKey)
  if (cached && cached.expiresAt > Date.now()) {
    if (format === "csv") {
      return new NextResponse(cached.payload as string, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60, max-age=300",
        },
      })
    }
    return NextResponse.json(cached.payload, {
      status: (cached.payload as any).ok ? 200 : 500,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60, max-age=300",
      },
    })
  }
  const cities = (await getTopCities(cityLimit)).map((city) => city.slug)

  const probeResults = await Promise.allSettled(cities.map(async (city): Promise<Probe> => {
    const url = `${BASE_URL}/${locale}/runbook/${slug}-${city}`
    try {
      const p = await probeUrl(url)
      return { city, url, status: p.status, ok: p.status === 200, finalUrl: p.finalUrl }
    } catch {
      return { city, url, status: 0, ok: false }
    }
  }))

  const probes: Probe[] = probeResults.map((result, idx) =>
    result.status === "fulfilled"
      ? result.value
      : { city: cities[idx], url: `${BASE_URL}/${locale}/runbook/${slug}-${cities[idx]}`, status: 0, ok: false }
  )

  const okCount = probes.filter((x) => x.ok).length
  const score = Math.round((okCount / Math.max(1, probes.length)) * 100)
  const durationMs = Date.now() - startedAt

  if (format === "csv") {
    const csv = toCsv(probes)
    responseCache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, payload: csv })
    return new NextResponse(toCsv(probes), {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60, max-age=300",
      },
    })
  }

  const payload = {
    ok: score >= 80,
    score,
    locale,
    slug,
    durationMs,
    totalCities: probes.length,
    healthyCities: okCount,
    generatedAt: new Date().toISOString(),
    probes,
  }
  responseCache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, payload })

  return NextResponse.json(
    payload,
    {
      status: score >= 80 ? 200 : 500,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60, max-age=300",
      },
    }
  )
}
