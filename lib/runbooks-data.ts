import fs from 'fs'
import path from 'path'

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
  if (st.data) return st.data
  const abs = path.isAbsolute(jsonRelPath) ? jsonRelPath : path.join(process.cwd(), jsonRelPath)
  try {
    const buf = fs.readFileSync(abs)
    const arr = JSON.parse(buf.toString('utf8')) as MinimalRunbook[]
    st.data = Array.isArray(arr) ? arr : []
    st.ts = Date.now()
    return st.data
  } catch {
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
}
