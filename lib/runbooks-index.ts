// lib/runbooks-index.ts
// NOTE (2026-03): Lightweight in-memory index for runbooks used by API routes.
// - Exports: isReady(), warmup(), ensureReadyWithin(ms), search(q, tags, page, limit)
// - Data source: lib/pseo (materializedRunbooks() or buildRunbooksClient(n)) → materialized to docs
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

const STOPWORDS = new Set<string>([
  "der","die","das","ein","eine","einer","eines","und","oder","aber","den","dem","des","mit","ohne","von","für","auf","in","im","an","am","als","auch","ist","sind","war","waren","ich","du","er","sie","es","wir","ihr","man","was","wie","wo","wann","jetzt","heute","sofort","bitte","habe","hat","haben","kritische","kritisch","groß","klein","schnell","langsam","mein","meine","dein","deine","sein","seine","ihr","ihre","einfach","so","nur","noch","schon","mal","viel","viele","wenig","keine","nicht",
])

function filterMeaningful(tokens: string[]): string[] {
  const keepShort = new Set(["ssh","aws","gcp","api","cve","nginx","k8s","dns","tls","ssl"])
  return tokens.filter((t) => keepShort.has(t) || (!STOPWORDS.has(t) && t.length >= 3))
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
      list = pseo.materializedRunbooks()
    }
  } catch {
    list = pseo.materializedRunbooks()
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
  const rawTerms = tokenSplit(q)
  const terms = filterMeaningful(rawTerms)
  const tagTerms = filterMeaningful((tags || []).map((t) => String(t).toLowerCase()))
  const all = [...new Set([...terms, ...tagTerms])]

  // If nothing meaningful, return first page (fallback)
  if (all.length === 0) {
    const total = idx.docs.length
    const start = Math.max(0, (page - 1) * limit)
    return { total, items: idx.docs.slice(start, start + limit) }
  }

  // Union-based scoring: each matching token adds 1 (tags add +2)
  const scores = new Map<number, number>()
  for (const t of all) {
    const s = idx.postings.get(t)
    if (!s) continue
    const boost = tagTerms.includes(t) ? 2 : 1
    for (const i of s) scores.set(i, (scores.get(i) || 0) + boost)
  }
  const ids = Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([i]) => i)

  const total = ids.length
  const start = Math.max(0, (page - 1) * limit)
  const pageIds = ids.slice(start, start + limit)
  const items = pageIds
    .map((i) => idx.docs[i])
    .sort((a, b) => (b.clawScore ?? 0) - (a.clawScore ?? 0))
  return { total, items }
}
