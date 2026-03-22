import { NextRequest, NextResponse } from 'next/server'
import { loadRunbooks } from '@/lib/runbooks-data'
import { SITE_URL } from '@/lib/config'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Data is loaded from public/runbooks.json via loadRunbooks() and cached in globalThis

function normalize(str: string) {
  return (str || '').toLowerCase()
}

function parseTags(searchParams: URLSearchParams): string[] {
  const tagsParams = searchParams.getAll('tags')
  const list: string[] = []
  for (const t of tagsParams) {
    for (const p of t.split(',').map((s) => s.trim()).filter(Boolean)) list.push(p)
  }
  const arr = searchParams.getAll('tags[]')
  for (const t of arr) list.push(t)
  return Array.from(new Set(list.map((t) => t.toLowerCase())))
}

// Supports optional min_clawScore to filter by runbook quality (0-100)
function searchFallback(runbooks: any[], q: string, tags: string[], page: number, limit: number, minScore?: number) {
  const qn = normalize(q)
  const terms = qn.split(/\s+/).filter(Boolean)
  const filtered = runbooks.filter((r) => {
    if (tags.length) {
      const rtags = (r.tags || []).map((t: any) => String(t).toLowerCase())
      for (const t of tags) if (!rtags.includes(t)) return false
    }
    if (typeof minScore === 'number' && Number.isFinite(minScore)) {
      if (typeof r.clawScore === 'number') {
        if (r.clawScore < minScore) return false
      }
    }
    if (!terms.length) return true
    const hay = normalize(`${r.title} ${r.summary} ${(r.tags || []).join(' ')}`)
    return terms.every((t) => hay.includes(t))
  })
  const total = filtered.length
  const start = Math.max(0, (page - 1) * limit)
  const items = filtered.slice(start, start + limit).map((r) => ({
    slug: r.slug,
    title: r.title,
    summary: r.summary,
    tags: r.tags,
    lastmod: r.lastmod,
    clawScore: r.clawScore,
  }))
  return { total, items }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const sp = url.searchParams
    const q = sp.get('q') || ''
    const tags = parseTags(sp)
    const page = Math.max(1, parseInt(sp.get('page') || '1', 10) || 1)
    const rawLimit = Math.max(1, parseInt(sp.get('limit') || '24', 10) || 24)
    const limit = Math.min(100, rawLimit)
    const minScoreParam = sp.get('min_clawScore')
    const minScore = minScoreParam != null ? Math.max(0, Math.min(100, parseInt(minScoreParam, 10))) : undefined

    let total = 0
    let items: any[] = []

    let data: any[] = []
    try {
      const res = await fetch(`${SITE_URL}/runbooks.json`, { cache: 'no-store' })
      if (res.ok) {
        const arr = (await res.json()) as any[]
        if (Array.isArray(arr) && arr.length) data = arr
      }
    } catch {}

    if (!Array.isArray(data) || data.length < 10) {
      const fsData = await loadRunbooks()
      if (Array.isArray(fsData) && fsData.length) data = fsData
    }
    const r = searchFallback(data, q, tags, page, limit, minScore)
    total = r.total
    items = r.items

    // API Params:
    // - q: free-text query
    // - tags: comma-separated or repeated tags[]
    // - page: 1-based
    // - limit: max 100
    // - min_clawScore: optional integer 0..100, filters by quality score
    const payload: Record<string, any> = { q, tags, page, limit, min_clawScore: minScore, total, items }

    const res = NextResponse.json(payload)
    res.headers.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=300')
    return res
  } catch (e) {
    console.error('runbooks/search-index error', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
