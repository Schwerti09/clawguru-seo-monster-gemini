import { NextResponse } from "next/server"
import { BASE_URL } from "@/lib/config"
import { DEFAULT_LOCALE } from "@/lib/i18n"
import { materializedRunbooks } from "@/lib/pseo"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  const locale = DEFAULT_LOCALE
  const now = new Date().toISOString()
  const runbooks = materializedRunbooks()
    .sort((a, b) => b.clawScore - a.clawScore)
    .slice(0, 150)
    .map((r) => ({
      id: r.slug,
      title: r.title,
      summary: r.summary,
      score: r.clawScore,
      updated_at: r.lastmod,
      url: `${BASE_URL}/${locale}/runbook/${r.slug}`,
      tags: r.tags.slice(0, 8),
    }))

  const hubs = [
    { id: "intel", url: `${BASE_URL}/${locale}/intel`, title: "Intel Threat Feed" },
    { id: "runbooks", url: `${BASE_URL}/${locale}/runbooks`, title: "Runbook Library" },
    { id: "solutions", url: `${BASE_URL}/${locale}/solutions`, title: "CVE Solutions" },
    { id: "issues", url: `${BASE_URL}/${locale}/issues`, title: "Issue Hubs" },
  ]

  return NextResponse.json(
    {
      site: BASE_URL,
      generated_at: now,
      locale,
      version: "1.0",
      hubs,
      runbooks,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=120, max-age=600",
      },
    }
  )
}
