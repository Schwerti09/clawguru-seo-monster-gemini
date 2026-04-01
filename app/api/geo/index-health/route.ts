import { NextRequest, NextResponse } from "next/server"
import { BASE_URL } from "@/lib/config"
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/i18n"
import { getTopCities } from "@/lib/geo-cities"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 60

type Probe = { city: string; url: string; status: number; ok: boolean; finalUrl?: string }

const PROBE_TIMEOUT_MS = 8_000
/** Safe slug pattern: only lowercase alphanumerics and hyphens, no path traversal. */
const SAFE_SLUG_RE = /^[a-z0-9-]+$/i

async function probeUrl(url: string): Promise<{ status: number; finalUrl?: string }> {
  const res = await fetch(url, { redirect: "manual", cache: "no-store", signal: AbortSignal.timeout(PROBE_TIMEOUT_MS) })
  if ((res.status === 307 || res.status === 308) && res.headers.get("location")) {
    const rawLocation = res.headers.get("location") || ""
    const nextUrl = new URL(rawLocation, url).toString()
    // Only follow redirects that stay within our own origin to prevent open redirects.
    if (!nextUrl.startsWith(BASE_URL)) {
      return { status: res.status, finalUrl: url }
    }
    const second = await fetch(nextUrl, { redirect: "manual", cache: "no-store", signal: AbortSignal.timeout(PROBE_TIMEOUT_MS) })
    return { status: second.status, finalUrl: nextUrl }
  }
  return { status: res.status, finalUrl: url }
}

function toCsv(rows: Probe[]) {
  const header = "city,url,status,ok,final_url"
  const lines = rows.map((r) => `${r.city},${r.url},${r.status},${r.ok ? "1" : "0"},${r.finalUrl || ""}`)
  return [header, ...lines].join("\n")
}

export async function GET(req: NextRequest) {
  const format = (req.nextUrl.searchParams.get("format") || "json").toLowerCase()
  const rawLocale = (req.nextUrl.searchParams.get("locale") || DEFAULT_LOCALE).toLowerCase()
  const locale = SUPPORTED_LOCALES.includes(rawLocale as any) ? rawLocale : DEFAULT_LOCALE
  const rawSlug = req.nextUrl.searchParams.get("slug") || "aws-ssh-hardening-2026"
  const slug = SAFE_SLUG_RE.test(rawSlug) ? rawSlug : "aws-ssh-hardening-2026"
  const cityLimit = parseInt(req.nextUrl.searchParams.get("limit") || process.env.GEO_INDEX_HEALTH_CITY_LIMIT || "12", 10) || 12
  const cities = (await getTopCities(cityLimit)).map((city) => city.slug)

  const probes: Probe[] = []
  const results = await Promise.allSettled(
    cities.map(async (city) => {
      const url = `${BASE_URL}/${locale}/runbook/${slug}-${city}`
      const p = await probeUrl(url)
      return { city, url, status: p.status, ok: p.status === 200, finalUrl: p.finalUrl } as Probe
    })
  )
  for (const [i, result] of results.entries()) {
    if (result.status === "fulfilled") {
      probes.push(result.value)
    } else {
      const city = cities[i]
      probes.push({ city, url: `${BASE_URL}/${locale}/runbook/${slug}-${city}`, status: 0, ok: false })
    }
  }

  const okCount = probes.filter((x) => x.ok).length
  const score = Math.round((okCount / Math.max(1, probes.length)) * 100)

  if (format === "csv") {
    return new NextResponse(toCsv(probes), {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60, max-age=300",
      },
    })
  }

  return NextResponse.json(
    {
      ok: score >= 80,
      score,
      locale,
      slug,
      totalCities: probes.length,
      healthyCities: okCount,
      generatedAt: new Date().toISOString(),
      probes,
    },
    {
      status: score >= 80 ? 200 : 500,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60, max-age=300",
      },
    }
  )
}
