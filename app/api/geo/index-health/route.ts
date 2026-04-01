import { NextRequest, NextResponse } from "next/server"
import { BASE_URL } from "@/lib/config"
import { DEFAULT_LOCALE } from "@/lib/i18n"
import { getTopCities } from "@/lib/geo-cities"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type Probe = { city: string; url: string; status: number; ok: boolean; finalUrl?: string }

async function probeUrl(url: string): Promise<{ status: number; finalUrl?: string }> {
  const res = await fetch(url, { redirect: "manual", cache: "no-store" })
  if ((res.status === 307 || res.status === 308) && res.headers.get("location")) {
    const nextUrl = new URL(res.headers.get("location") || "", url).toString()
    const second = await fetch(nextUrl, { redirect: "manual", cache: "no-store" })
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
  const locale = (req.nextUrl.searchParams.get("locale") || DEFAULT_LOCALE).toLowerCase()
  const slug = req.nextUrl.searchParams.get("slug") || "aws-ssh-hardening-2026"
  const cityLimit = parseInt(req.nextUrl.searchParams.get("limit") || process.env.GEO_INDEX_HEALTH_CITY_LIMIT || "12", 10) || 12
  const cities = (await getTopCities(cityLimit)).map((city) => city.slug)

  const probes: Probe[] = []
  for (const city of cities) {
    const url = `${BASE_URL}/${locale}/runbook/${slug}-${city}`
    try {
      const p = await probeUrl(url)
      probes.push({ city, url, status: p.status, ok: p.status === 200, finalUrl: p.finalUrl })
    } catch {
      probes.push({ city, url, status: 0, ok: false })
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
