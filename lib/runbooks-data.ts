import fs from 'fs'
import path from 'path'
import { SITE_URL } from './config'

// Paths to try for the runbooks JSON file on different environments
const FS_PATHS = [
  'public/runbooks.json',
  '.next/server/public/runbooks.json',
  '.next/server/app/runbooks.json',
  '../public/runbooks.json',
]

function tryReadFromMultiplePaths(): MinimalRunbook[] | null {
  for (const rel of FS_PATHS) {
    try {
      const abs = path.isAbsolute(rel) ? rel : path.join(process.cwd(), rel)
      const buf = fs.readFileSync(abs)
      const arr = JSON.parse(buf.toString('utf8')) as MinimalRunbook[]
      if (Array.isArray(arr) && arr.length >= 5) return arr
    } catch { /* try next path */ }
  }
  // Also try __dirname-relative (works when bundled by Vercel)
  try {
    const abs = path.join(__dirname, '..', 'public', 'runbooks.json')
    const buf = fs.readFileSync(abs)
    const arr = JSON.parse(buf.toString('utf8')) as MinimalRunbook[]
    if (Array.isArray(arr) && arr.length >= 5) return arr
  } catch { /* ignore */ }
  return null
}

export type MinimalRunbook = {
  slug: string
  title: string
  summary: string
  tags: string[]
  lastmod?: string
  clawScore?: number
}

type CacheState = { data: MinimalRunbook[] | null; ts: number }
const g = globalThis as any
if (!g.__RUNBOOKS_DATA__) g.__RUNBOOKS_DATA__ = { data: null, ts: 0 } as CacheState

export async function loadRunbooks(jsonRelPath: string = 'public/runbooks.json'): Promise<MinimalRunbook[]> {
  const st: CacheState = g.__RUNBOOKS_DATA__

  async function loadFromFs(): Promise<MinimalRunbook[] | null> {
    // Try the specified path first
    const abs = path.isAbsolute(jsonRelPath) ? jsonRelPath : path.join(process.cwd(), jsonRelPath)
    try {
      const buf = fs.readFileSync(abs)
      const arr = JSON.parse(buf.toString('utf8')) as MinimalRunbook[]
      if (Array.isArray(arr) && arr.length >= 5) return arr
    } catch { /* ignore */ }
    // Try multiple known paths (Vercel, local dev, etc.)
    return tryReadFromMultiplePaths()
  }

  async function loadFromHttp(): Promise<MinimalRunbook[] | null> {
    try {
      const url = `${SITE_URL}/runbooks.json`
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) return null
      const arr = (await res.json()) as MinimalRunbook[]
      return Array.isArray(arr) ? arr : []
    } catch {
      return null
    }
  }

  // If cache exists and looks healthy (>= 5 items), return it.
  if (st.data && Array.isArray(st.data) && st.data.length >= 5) return st.data

  const preferHttp = process.env.NODE_ENV === 'production' || process.env.PREFER_HTTP_RUNBOOKS === '1'

  // Always try FS first — it's faster and avoids self-referencing HTTP issues on Vercel cold starts
  const fsData = await loadFromFs()
  if (fsData && fsData.length >= 5) {
    st.data = fsData
    st.ts = Date.now()
    return st.data
  }

  // Try preferred source next
  const primary = preferHttp ? await loadFromHttp() : null
  if (primary && primary.length >= 5) {
    st.data = primary
    st.ts = Date.now()
    return st.data
  }

  // Try secondary source next
  const secondary = preferHttp ? await loadFromFs() : await loadFromHttp()
  if (secondary && secondary.length) {
    st.data = secondary
    st.ts = Date.now()
    return st.data
  }

  // Final safety fallback (tiny demo)
  const fallback: MinimalRunbook[] = [
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
  ]
  st.data = fallback
  st.ts = Date.now()
  return st.data
}
