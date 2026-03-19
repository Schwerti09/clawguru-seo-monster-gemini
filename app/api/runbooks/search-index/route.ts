import { NextRequest, NextResponse } from 'next/server'
import { ensureReadyWithin, search as indexSearch, isReady } from '@/lib/runbooks-index'

export const runtime = 'nodejs'
const INDEX_TIMEOUT_MS = Number(process.env.RUNBOOKS_INDEX_TIMEOUT_MS || 300)

// Mirror the minimal static fallback used by the legacy route to guarantee results before index warmup
const FALLBACK: Array<{
  slug: string
  title: string
  summary: string
  tags: string[]
  lastmod?: string
  clawScore?: number
}> = [
  {
    slug: 'aws-ssh-hardening-2026',
    title: 'SSH Hardening auf AWS (2026)',
    summary: 'CIS-konforme SSH-Härtung: Schlüssel-Policy, Rate-Limits, MFA‑Gate, Audit‑Logs.',
    tags: ['aws', 'ssh', 'hardening', 'security'],
    lastmod: '2026-02-25',
    clawScore: 92,
  },
  {
    slug: 'aws-nginx-csp-2026',
    title: 'Nginx CSP Harden (AWS, 2026)',
    summary: 'Content Security Policy korrekt setzen, XFO/XCTO anziehen, Subresource Integrity.',
    tags: ['aws', 'nginx', 'csp', 'hardening'],
    lastmod: '2026-02-25',
    clawScore: 88,
  },
  {
    slug: 'gcp-kubernetes-zero-trust-2026',
    title: 'Kubernetes Zero‑Trust (GCP, 2026)',
    summary: 'RBAC minimieren, PodSecurity, NetworkPolicies, Image‑Scanning, Admission‑Controls.',
    tags: ['gcp', 'kubernetes', 'hardening', 'zero-trust'],
    lastmod: '2026-02-25',
    clawScore: 90,
  },
  {
    slug: 'hetzner-ssh-hardening-2026',
    title: 'SSH Hardening auf Hetzner (2026)',
    summary: 'Key‑Rotation, Fail2ban, Port‑Knocking optional, Logging & Alerting baseline.',
    tags: ['hetzner', 'ssh', 'hardening'],
    lastmod: '2026-02-25',
    clawScore: 86,
  },
  {
    slug: 'azure-docker-csp-2026',
    title: 'Docker CSP & Registry Hygiene (Azure, 2026)',
    summary: 'Trusted Base Images, Signierung, CSP im Ingress, Secrets aus Vault.',
    tags: ['azure', 'docker', 'csp', 'security'],
    lastmod: '2026-02-25',
    clawScore: 84,
  },
  {
    slug: 'aws-kubernetes-zero-trust-2026',
    title: 'Kubernetes Zero‑Trust (AWS, 2026)',
    summary: 'OPA Gatekeeper, mTLS Service Mesh, least privilege IAM/RBAC.',
    tags: ['aws', 'kubernetes', 'zero-trust', 'security'],
    lastmod: '2026-02-25',
    clawScore: 91,
  },
]

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
    let warning: string | undefined
    let source: 'index' | 'fallback' = 'fallback'

    try {
      const ready = await ensureReadyWithin(INDEX_TIMEOUT_MS)
      if (ready && isReady()) {
        const r = indexSearch(q, tags, page, limit)
        total = r.total
        items = r.items
        source = 'index'
      } else {
        const r = searchFallback(FALLBACK, q, tags, page, limit)
        total = r.total
        items = r.items
        warning = 'Index not warm yet: using lightweight fallback set'
      }
    } catch {
      const r = searchFallback(FALLBACK, q, tags, page, limit)
      total = r.total
      items = r.items
      warning = 'Index error: using lightweight fallback set'
    }

    const payload: Record<string, any> = { q, tags, page, limit, total, items, source }
    if (warning) payload.warning = warning

    const res = NextResponse.json(payload)
    res.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30')
    return res
  } catch (e) {
    console.error('runbooks/search-index error', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
