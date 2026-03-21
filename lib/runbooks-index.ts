// lib/runbooks-index.ts
// NOTE (2026-03): Lightweight in-memory index for runbooks used by API routes.
// - Exports: isReady(), warmup(), ensureReadyWithin(ms), search(q, tags, page, limit)
// - Data source: lib/pseo (RUNBOOKS or buildRunbooksClient(n)) → materialized to docs
// - Tags filter in search(): treats provided tags as intersection
// - Use ensureReadyWithin() before calling search() on cold starts

export type RunbookDoc = {
  slug: string
  title: string
  summary: string
  tags: string[]
  lastmod?: string
  clawScore?: number
}

type Index = { docs: RunbookDoc[]; postings: Map<string, Set<number>> }

type IndexState = {
  ready: boolean
  index: Index | null
  building: Promise<void> | null
  ts: number
}

const g = globalThis as any
if (!g.__RB_INDEX) {
  const state: IndexState = { ready: false, index: null, building: null, ts: 0 }
  g.__RB_INDEX = state
}

function tokenSplit(s: string): string[] {
  return (s || "").toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)
}

function mapDoc(r: any): RunbookDoc {
  return {
    slug: String(r.slug || ""),
    title: String(r.title || ""),
    summary: String(r.summary || ""),
    tags: Array.isArray(r.tags) ? r.tags.map((t: any) => String(t)) : [],
    lastmod: r.lastmod ? String(r.lastmod) : undefined,
    clawScore: typeof r.clawScore === "number" ? r.clawScore : undefined,
  }
}

async function materializeDocs(): Promise<RunbookDoc[]> {
  const pseo: any = await import("@/lib/pseo")
  let list: any[] = []
  try {
    if (typeof pseo.buildRunbooksClient === "function") {
      const n = Number(process.env.PSEO_INDEX_COUNT || 2000)
      list = pseo.buildRunbooksClient(n)
    } else {
      list = (pseo.RUNBOOKS ?? []) as any[]
    }
  } catch {
    list = (pseo.RUNBOOKS ?? []) as any[]
  }
  return list.map(mapDoc)
}

async function build(): Promise<void> {
  const st: IndexState = g.__RB_INDEX
  if (st.building) return st.building
  st.building = (async () => {
    const docs = await materializeDocs()
    const postings = new Map<string, Set<number>>()
    for (let i = 0; i < docs.length; i++) {
      const d = docs[i]
      const toks = new Set<string>([
        ...tokenSplit(d.title),
        ...tokenSplit(d.summary),
        ...d.tags.map((t) => t.toLowerCase()),
      ])
      for (const t of toks) {
        let s = postings.get(t)
        if (!s) {
          s = new Set<number>()
          postings.set(t, s)
        }
        s.add(i)
      }
    }
    st.index = { docs, postings }
    st.ready = true
    st.ts = Date.now()
  })()
  await st.building
}

function promiseWithTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const id = setTimeout(() => reject(new Error("timeout")), ms)
    p.then(
      (v) => {
        clearTimeout(id)
        resolve(v)
      },
      (e) => {
        clearTimeout(id)
        reject(e)
      },
    )
  })
}

function intersect(a: Set<number>, b: Set<number>): Set<number> {
  const out = new Set<number>()
  for (const v of a) if (b.has(v)) out.add(v)
  return out
}

export function isReady(): boolean {
  const st: IndexState = g.__RB_INDEX
  return !!st.ready && !!st.index
}

export async function warmup(): Promise<{ count: number; ready: boolean; ts: number }> {
  await build()
  const st: IndexState = g.__RB_INDEX
  const count = st.index?.docs.length || 0
  return { count, ready: st.ready, ts: st.ts }
}

export async function ensureReadyWithin(ms: number): Promise<boolean> {
  if (isReady()) return true
  try {
    await promiseWithTimeout(build(), ms)
    return isReady()
  } catch {
    return isReady()
  }
}

export function search(q: string, tags: string[], page: number, limit: number): { total: number; items: RunbookDoc[] } {
  const st: IndexState = g.__RB_INDEX
  const idx = st.index
  if (!idx) return { total: 0, items: [] }
  const terms = tokenSplit(q)
  const tagTerms = (tags || []).map((t) => String(t).toLowerCase()).filter(Boolean)
  const all = [...terms, ...tagTerms]
  if (all.length === 0) {
    const total = idx.docs.length
    const start = Math.max(0, (page - 1) * limit)
    return { total, items: idx.docs.slice(start, start + limit) }
  }
  let cand: Set<number> | null = null
  for (const t of all) {
    const s = idx.postings.get(t)
    if (!s) return { total: 0, items: [] }
    cand = cand ? intersect(cand, s) : new Set<number>(s)
    if (cand.size === 0) return { total: 0, items: [] }
  }
  const ids = Array.from(cand!)
  const total = ids.length
  const start = Math.max(0, (page - 1) * limit)
  const pageIds = ids.slice(start, start + limit)
  const items = pageIds.map((i) => idx.docs[i])
  return { total, items }
}
