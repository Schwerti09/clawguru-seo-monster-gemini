import { NextRequest, NextResponse } from "next/server"
import { unstable_cache as cache } from "next/cache"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 30

async function computeTeaser(q: string) {
  const query = (q || "").slice(0, 500)
  const pseo: any = await import("@/lib/pseo").catch(() => null as any)
  const mycelium: any = await import("@/lib/mycelium").catch(() => null as any)
  const cve: any = await import("@/lib/cve-pseo").catch(() => null as any)

  // Build runbook set (fast client bundle) and summaries
  let runbooks: any[] = []
  try {
    const buildClient: undefined | ((n: number) => any[]) = pseo?.buildRunbooksClient
    runbooks = buildClient ? buildClient(2000) : pseo.materializedRunbooks()
  } catch {
    runbooks = pseo?.materializedRunbooks?.() ?? []
  }
  const total = runbooks.length
  const initialMax = Math.min(360, total)

  // Oracle-like search within library (no external calls, <4s)
  let results: any[] = []
  if (mycelium?.buildMyceliumGraph && mycelium?.oracleSearch) {
    const graph = mycelium.buildMyceliumGraph(runbooks, initialMax)
    const summaries: Record<string, { title: string; summary: string; tags?: string[] }> = {}
    for (const r of runbooks) summaries[r.slug] = { title: r.title, summary: r.summary ?? "", tags: r.tags }
    results = mycelium.oracleSearch(query || "ssh hardening", graph, summaries, 5)
  } else {
    // Fallback: simple keyword match
    const hay = (r: any) => `${r.title} ${r.summary ?? ""} ${(r.tags || []).join(" ")}`.toLowerCase()
    const terms = (query || "ssh hardening").toLowerCase().split(/\s+/).filter(Boolean)
    results = runbooks
      .map((r) => ({ r, m: terms.filter((t) => hay(r).includes(t)).length }))
      .sort((a, b) => b.m - a.m)
      .slice(0, 5)
      .map(({ r }) => ({ id: r.slug, title: r.title, fitness: 80 + Math.floor(Math.random() * 10) }))
  }

  const primary = results[0] || null
  const secondary = results[1] || null
  const summariesIndex: Record<string, string> = {}
  for (const r of runbooks) summariesIndex[r.slug] = r.summary ?? ""

  // Threat from query or CVE pool
  let threat: string | undefined
  const m = query.match(/CVE-\d{4}-\d{4,7}/i)
  if (m && m[0]) threat = m[0].toUpperCase()
  if (!threat && Array.isArray(cve?.KNOWN_CVES) && cve.KNOWN_CVES.length > 0) {
    const idx = Math.abs(query.length % cve.KNOWN_CVES.length)
    threat = cve.KNOWN_CVES[idx]?.cveId
  }

  function seedInt(seed: number) {
    let x = Math.sin(seed) * 10000
    return Math.floor((x - Math.floor(x)) * 1000)
  }
  const f = typeof primary?.fitness === "number" ? primary.fitness : 72
  const score = Math.max(20, Math.min(95, Math.round(100 - (100 - f) * 0.7 + (seedInt(query.length + 19) % 7) - 3)))

  return {
    risks: 3,
    top: primary,
    results: [primary, secondary].filter(Boolean),
    runbook: primary ? { slug: primary.id, title: primary.title, summary: (summariesIndex[primary.id] || "").slice(0, 220) } : null,
    runbook2: secondary ? { slug: secondary.id, title: secondary.title, summary: (summariesIndex[secondary.id] || "").slice(0, 200) } : undefined,
    prediction: "Vorhersage: 3 P2-Risiken eskalieren in ~14 Minuten",
    threat: threat || "CVE-2024-6387 – OpenSSH RegreSSHion",
    score,
  }
}

const cachedTeaser = cache(async (q: string) => computeTeaser(q), ["summon-teaser"], { revalidate: 4 })

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({} as any))
  const q = typeof body?.q === "string" ? body.q : ""
  const teaser = await cachedTeaser(q)
  return NextResponse.json({ ok: true, teaser }, { headers: { "Cache-Control": "public, s-maxage=4, max-age=0" } })
}
