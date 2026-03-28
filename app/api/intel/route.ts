import { NextRequest, NextResponse } from "next/server"
import { ensureReadyWithin, search as searchRunbooks } from "@/lib/runbooks-index"
import { STATS } from "@/lib/stats"

export const runtime = "nodejs"

// --- In-memory rate limit + cache (per instance) ---
const MINUTE_MS = 60_000
declare global {
  // eslint-disable-next-line no-var
  var __INTEL_RL_MIN__: Map<string, { count: number; reset: number }> | undefined
  // eslint-disable-next-line no-var
  var __INTEL_CACHE__: Map<string, { exp: number; data: any }> | undefined
}
const RATE_LIMIT = 200
const RL = (globalThis as any).__INTEL_RL_MIN__ || ((globalThis as any).__INTEL_RL_MIN__ = new Map())
const CACHE = (globalThis as any).__INTEL_CACHE__ || ((globalThis as any).__INTEL_CACHE__ = new Map())
function now() { return Date.now() }
function getClientKey(req: NextRequest): string {
  const cookieKey = req.cookies.get("cg_uid")?.value || req.cookies.get("intel_uid")?.value || ""
  if (cookieKey) return `cookie:${cookieKey}`
  const fwd = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim()
  const ip = fwd || req.headers.get("x-real-ip") || "0.0.0.0"
  const ua = req.headers.get("user-agent") || "unknown"
  return `ip:${ip}|ua:${ua.slice(0, 42)}`
}
function checkRateLimit(key: string) {
  const rec = RL.get(key)
  const t = now()
  if (!rec || rec.reset <= t) {
    RL.set(key, { count: 1, reset: t + MINUTE_MS })
    return { ok: true, remaining: RATE_LIMIT - 1, reset: t + MINUTE_MS }
  }
  if (rec.count >= RATE_LIMIT) return { ok: false, remaining: 0, reset: rec.reset }
  rec.count += 1
  return { ok: true, remaining: RATE_LIMIT - rec.count, reset: rec.reset }
}

const DEFAULT_TTL = 45_000
function cacheKeyFor(op: string, url: URL) {
  const qs = url.searchParams.toString() || "_"
  return `intel:${op}:${qs}`
}
function getCached<T>(key: string): T | undefined {
  const rec = CACHE.get(key)
  if (!rec) return undefined
  if (rec.exp <= now()) { CACHE.delete(key); return undefined }
  return rec.data as T
}
function setCached<T>(key: string, data: T, ttl = DEFAULT_TTL) {
  CACHE.set(key, { data, exp: now() + ttl })
}

type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
type Source = "NVD" | "EXPLOIT_DB" | "CLAWGURU"

type FeedItem = {
  id: string
  title: string
  severity: Severity
  source: Source
  published: string
  clawScore: number
  runbook?: { slug: string; title: string; clawScore: number }
}

type AnalyzeResult = {
  id: string
  title: string
  summary: string
  cvss: number
  severity: Severity
  exploitStatus: "ACTIVE" | "POC" | "NONE"
  affected: string[]
  published: string
  clawScore: number
  recommendedRunbook?: { slug: string; title: string; clawScore: number }
  steps: string[]
  references: string[]
}

type RadarNode = {
  id: string
  title: string
  severity: Severity
  x: number
  y: number
  z: number
  pulse: number
  runbook?: { slug: string; title: string; clawScore: number }
}

type PreviewGraph = {
  nodes: Array<{ id: string; title: string; slug: string; score: number }>
  edges: Array<[string, string]>
}

function seeded(seed: string) {
  let h = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    const t = (h ^= h >>> 16) >>> 0
    return (t % 100000) / 100000
  }
}

const SEVERITIES: Severity[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"]
const SOURCES: Source[] = ["NVD", "EXPLOIT_DB", "CLAWGURU"]

function synthesizeFeed(n = 24, seed = "feed"): FeedItem[] {
  const rnd = seeded(seed + new Date().toISOString().slice(0, 10))
  const items: FeedItem[] = []
  for (let i = 0; i < n; i++) {
    const sev = SEVERITIES[Math.floor(rnd() * SEVERITIES.length)]
    const src = SOURCES[Math.floor(rnd() * SOURCES.length)]
    const id = `CVE-${2020 + Math.floor(rnd() * 6)}-${1000 + Math.floor(rnd() * 8999)}`
    const title = `${sev === "CRITICAL" ? "RCE" : "Vuln"} in ${["OpenSSH", "Nginx", "PostgreSQL", "Kubernetes", "OpenSSL"][Math.floor(rnd() * 5)]}`
    const published = new Date(Date.now() - Math.floor(rnd() * 1000 * 3600 * 24 * 7)).toISOString()
    const clawScore = Math.round(70 + rnd() * 30)
    items.push({ id, title, severity: sev, source: src, published, clawScore })
  }
  return items
}

async function attachRunbook(title: string) {
  await ensureReadyWithin(1000)
  const r = searchRunbooks(title, [], 1, 1)
  const best = r.items?.[0]
  return best ? { slug: best.slug, title: best.title, clawScore: best.clawScore ?? 0 } : undefined
}

async function synthesizeAnalyze(id: string): Promise<AnalyzeResult> {
  const rnd = seeded(id)
  const sev = SEVERITIES[Math.floor(rnd() * SEVERITIES.length)]
  const cvss = Math.round((6 + rnd() * 4) * 10) / 10
  const affected = ["Ubuntu 22.04", "Debian 12", "Alpine 3.19", "AWS EC2", "Nginx 1.25"].filter(() => rnd() > 0.45)
  const title = `${id}: ${sev === "CRITICAL" ? "Remote Code Execution" : "Vulnerability"} in ${affected[0] || "Common Service"}`
  const recommendedRunbook = await attachRunbook(title)
  return {
    id,
    title,
    summary:
      "Potential exploitation via weak input validation. Restrict network exposure, update to patched versions, and apply least privilege.",
    cvss,
    severity: sev,
    exploitStatus: rnd() > 0.6 ? "ACTIVE" : rnd() > 0.5 ? "POC" : "NONE",
    affected,
    published: new Date(Date.now() - Math.floor(rnd() * 1000 * 3600 * 72)).toISOString(),
    clawScore: Math.round(60 + rnd() * 40),
    recommendedRunbook,
    steps: [
      "Identify exposed endpoints and restrict ingress.",
      "Upgrade to patched version via vendor advisory.",
      "Apply WAF rule set for immediate mitigation.",
      "Verify remediation with targeted probes.",
    ],
    references: ["https://nvd.nist.gov/", "https://clawguru.org/runbooks"],
  }
}

async function synthesizeRadar(n = 36): Promise<RadarNode[]> {
  const base = synthesizeFeed(n, "radar")
  const nodes: RadarNode[] = []
  for (const it of base) {
    const r = seeded(it.id)
    const runbook = await attachRunbook(it.title)
    nodes.push({
      id: it.id,
      title: it.title,
      severity: it.severity,
      x: r(),
      y: r(),
      z: r(),
      pulse: 0.5 + r() * 0.5,
      runbook,
    })
  }
  return nodes
}

async function synthesizePreview(): Promise<PreviewGraph> {
  await ensureReadyWithin(1000)
  const items = searchRunbooks("nginx ssh postgres kubernetes", [], 1, 10).items || []
  const nodes = items.slice(0, 12).map((it) => ({ id: it.slug, title: it.title, slug: it.slug, score: it.clawScore ?? 0 }))
  const edges: Array<[string, string]> = []
  for (let i = 0; i < nodes.length - 1; i++) {
    if (i % 3 === 0 && nodes[i + 1]) edges.push([nodes[i].id, nodes[i + 1].id])
    if (i + 2 < nodes.length && i % 4 === 0) edges.push([nodes[i].id, nodes[i + 2].id])
  }
  return { nodes, edges }
}

function synthesizeStats() {
  const todaySeed = new Date().toISOString().slice(0, 10)
  const r = seeded("stats:" + todaySeed)
  const pts = Array.from({ length: 24 }, (_, i) => Math.round(20 + Math.sin(i / 2) * 8 + r() * 12))
  return {
    newCvesToday: Math.round(40 + r() * 30),
    activeExploits: STATS.activeExploitsToday,
    avgClawScore: STATS.avgClawScore,
    threatLevel: Math.round(50 + r() * 45),
    series: pts,
  }
}

export async function GET(req: NextRequest) {
  try {
    // Enforce per-minute limit for Intel API operations (lenient)
    const key = getClientKey(req)
    const rl = checkRateLimit(key)
    if (!rl.ok) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          code: "RATE_LIMIT",
          message: "Too many requests. Please retry shortly.",
          resetAt: rl.reset,
        },
        { status: 429, headers: { "Retry-After": Math.max(1, Math.ceil((rl.reset - now()) / 1000)).toString() } },
      )
    }

    const url = new URL(req.url)
    const op = (url.searchParams.get("op") || "bundle").toLowerCase()

    // Try cache for inexpensive GET operations
    if (["feed", "radar", "preview", "stats", "bundle"].includes(op)) {
      const k = cacheKeyFor(op, url)
      const cached = getCached<any>(k)
      if (cached) {
        const res = NextResponse.json(cached)
        res.headers.set("Cache-Control", "public, s-maxage=45, stale-while-revalidate=30")
        return res
      }
    }

    if (op === "feed") {
      const sev = (url.searchParams.get("severity") || "").toUpperCase() as Severity
      const src = (url.searchParams.get("source") || "").toUpperCase() as Source
      let items = synthesizeFeed(28)
      if (["CRITICAL", "HIGH", "MEDIUM", "LOW"].includes(sev)) items = items.filter((x) => x.severity === sev)
      if (["NVD", "EXPLOIT_DB", "CLAWGURU"].includes(src)) items = items.filter((x) => x.source === src)
      await ensureReadyWithin(800)
      await Promise.all(
        items.slice(0, 12).map(async (it) => {
          if (!it.runbook) it.runbook = await attachRunbook(it.title)
        })
      )
      const withLinks = items.map((it) => ({ ...it, oracleUrl: `/oracle?cve=${encodeURIComponent(it.id)}` }))
      const payload = { items: withLinks }
      setCached(cacheKeyFor(op, url), payload)
      const res = NextResponse.json(payload)
      res.headers.set("Cache-Control", "public, s-maxage=45, stale-while-revalidate=30")
      return res
    }

    if (op === "analyze") {
      const id = (url.searchParams.get("id") || "").toUpperCase()
      if (!/^CVE-\d{4}-\d{4,7}$/.test(id)) {
        return NextResponse.json({ error: "Invalid CVE ID" }, { status: 400 })
      }
      const result = await synthesizeAnalyze(id)
      return NextResponse.json({ ...result, oracleUrl: `/oracle?cve=${encodeURIComponent(id)}` })
    }

    if (op === "radar") {
      const nodes = await synthesizeRadar(40)
      const payload = { nodes }
      setCached(cacheKeyFor(op, url), payload)
      const res = NextResponse.json(payload)
      res.headers.set("Cache-Control", "public, s-maxage=45, stale-while-revalidate=30")
      return res
    }

    if (op === "preview") {
      const graph = await synthesizePreview()
      setCached(cacheKeyFor(op, url), graph)
      const res = NextResponse.json(graph)
      res.headers.set("Cache-Control", "public, s-maxage=45, stale-while-revalidate=30")
      return res
    }

    if (op === "stats") {
      const payload = synthesizeStats()
      setCached(cacheKeyFor(op, url), payload)
      const res = NextResponse.json(payload)
      res.headers.set("Cache-Control", "public, s-maxage=45, stale-while-revalidate=30")
      return res
    }

    const [feed, radar, stats] = await Promise.all([
      (async () => {
        const items = synthesizeFeed(10)
        await ensureReadyWithin(600)
        await Promise.all(items.slice(0, 6).map(async (it) => (it.runbook = await attachRunbook(it.title))))
        return items
      })(),
      synthesizeRadar(24),
      Promise.resolve(synthesizeStats()),
    ])

    const bundle = { feed, radar, stats }
    setCached(cacheKeyFor("bundle", url), bundle)
    const res = NextResponse.json(bundle)
    res.headers.set("Cache-Control", "public, s-maxage=45, stale-while-revalidate=30")
    return res
  } catch (err) {
    console.error("[/api/intel] error", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as { ids?: string[] }
    const ids = Array.isArray(body.ids) ? body.ids.slice(0, 10) : []
    if (!ids.length) {
      return NextResponse.json({ error: "Provide ids: string[]" }, { status: 400 })
    }
    const out: Record<string, AnalyzeResult> = {}
    for (const id of ids) {
      out[id] = await synthesizeAnalyze(id.toUpperCase())
    }
    return NextResponse.json({ results: out })
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
}
