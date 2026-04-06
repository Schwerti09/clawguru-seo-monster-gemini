import { NextRequest, NextResponse } from 'next/server'
import { loadRunbooks } from '@/lib/runbooks-data'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const MIN_RUNBOOKS_FOR_HEALTHY_INDEX = 10
const DEFAULT_LIMIT = 24
const EMPTY_INDEX: any[] = []

function normalize(str: string) {
  return (str || '').toLowerCase()
}

function parseTags(searchParams: URLSearchParams): string[] {
  const tagsParams = searchParams.getAll('tags')
  // support both tags=foo,bar and repeated tags=foo&tags=bar
  const list: string[] = []
  for (const t of tagsParams) {
    for (const p of t.split(',').map((s) => s.trim()).filter(Boolean)) list.push(p)
  }
  const arr = searchParams.getAll('tags[]')
  for (const t of arr) list.push(t)
  return Array.from(new Set(list.map((t) => t.toLowerCase())))
}

function searchRunbooks(runbooks: any[], q: string, tags: string[], page: number, limit: number) {
  const qn = normalize(q)
  const terms = qn.split(/\s+/).filter(Boolean)

  const filtered = runbooks.filter((r) => {
    if (tags.length) {
      const rtags = (r.tags || []).map((t: string) => t.toLowerCase())
      for (const t of tags) if (!rtags.includes(t)) return false
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
    const rawLimit = Math.max(1, parseInt(sp.get('limit') || String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT)
    const limit = Math.min(100, rawLimit)

    // loadRunbooks() uses global in-process caching and FS/HTTP fallback chaining.
    // Load materialized runbooks so result slugs resolve to real runbook detail pages
    // instead of redirecting back to the runbooks hub.
    let base = EMPTY_INDEX
    try {
      base = await loadRunbooks()
    } catch (loadError) {
      console.error('runbooks/search loadRunbooks failed', loadError)
    }
    const { total, items } = searchRunbooks(base, q, tags, page, limit)

    const payload: Record<string, any> = { q, tags, page, limit, total, items }
    if (base.length < MIN_RUNBOOKS_FOR_HEALTHY_INDEX) {
      payload.warning = 'Degraded mode: using lightweight fallback index to ensure fast responses'
    }

    const res = NextResponse.json(payload)
    res.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30')
    return res
  } catch (e) {
    console.error('runbooks/search error', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
