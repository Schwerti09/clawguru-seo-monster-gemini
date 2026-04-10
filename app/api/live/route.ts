import { NextResponse } from "next/server"
import { materializedRunbooks, PROVIDERS, totalSitemapUrls } from "@/lib/pseo"
import { STATS } from "@/lib/stats"
import { getLiveWallCached } from "@/app/api/live-wall/route"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 15

export async function GET() {
  try {
    // Core counts derived from local dataset (no external calls)
    const runbooks = materializedRunbooks()
    const totalRunbooks = STATS.totalRunbooks
    const uniqueTags = new Set<string>(runbooks.flatMap((r) => r.tags)).size
    const providers = PROVIDERS.length
    const sitemapUrls = STATS.totalSitemapUrls || totalSitemapUrls()

    // Quality distribution (use existing runbook.clawScore field)
    const sample = runbooks.slice(0, Math.min(5000, totalRunbooks))
    const scores = sample.map((r) => Number(r.clawScore || 0) || 0)
    const avgClaw = STATS.avgClawScore
    const p90Claw = scores.length ? scores.slice().sort((a, b) => a - b)[Math.floor(scores.length * 0.9)] : 0
    const gold = sample.filter((r) => (r.clawScore || 0) >= 85).length
    const silver = sample.filter((r) => (r.clawScore || 0) >= 75 && (r.clawScore || 0) < 85).length

    // Live wall payload (top tags, trending, optional CVEs, pulse)
    const live = await getLiveWallCached()

    // Latest intel feed (public endpoint, limit 10)
    let intel: { items: Array<{ id: string; title: string; severity: string; category: string; when: string; tags: string[] }>; total: number; updatedAt: string } | null = null
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"}/api/v1/intel-feed/latest?limit=10`, { cache: "no-store" })
      if (res.ok) intel = await res.json()
    } catch {}

    // Top runbooks by quality score
    const topRunbooks = runbooks
      .slice(0, Math.min(15000, totalRunbooks))
      .sort((a, b) => (b.clawScore || 0) - (a.clawScore || 0))
      .slice(0, 10)
      .map((r) => ({ slug: r.slug, title: r.title, summary: r.summary, clawScore: r.clawScore }))

    return NextResponse.json({
      ok: true,
      counts: { runbooks: totalRunbooks, tags: uniqueTags, providers, sitemapUrls },
      quality: { avgClaw, p90Claw, gold, silver, sampleSize: scores.length },
      live,
      intel: intel?.items ? { items: intel.items, total: intel.total, updatedAt: intel.updatedAt } : null,
      topRunbooks,
      generatedAt: new Date().toISOString(),
    }, { headers: { "Cache-Control": "public, s-maxage=15, stale-while-revalidate=30" } })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 })
  }
}
