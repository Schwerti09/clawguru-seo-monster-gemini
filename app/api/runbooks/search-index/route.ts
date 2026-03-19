import { NextRequest, NextResponse } from 'next/server'
import { loadRunbooks } from '@/lib/runbooks-data'

export const runtime = 'nodejs'

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

function searchFallback(runbooks: any[], q: string, tags: string[], page: number, limit: number) {
  const qn = normalize(q)
  const terms = qn.split(/\s+/).filter(Boolean)
  const filtered = runbooks.filter((r) => {
    if (tags.length) {
      const rtags = (r.tags || []).map((t: any) => String(t).toLowerCase())
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
    const rawLimit = Math.max(1, parseInt(sp.get('limit') || '24', 10) || 24)
    const limit = Math.min(100, rawLimit)

    let total = 0
    let items: any[] = []

    const data = await loadRunbooks()
    const r = searchFallback(data, q, tags, page, limit)
    total = r.total
    items = r.items

    const payload: Record<string, any> = { q, tags, page, limit, total, items }

    const res = NextResponse.json(payload)
    res.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30')
    return res
  } catch (e) {
    console.error('runbooks/search-index error', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
