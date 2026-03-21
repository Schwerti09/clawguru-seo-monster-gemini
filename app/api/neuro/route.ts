// MYCELIUM NEURO v1 – Personalized recommendations based on tech stack
// NOTE (2026-03): Real data via in-memory index. Data sources:
// - lib/runbooks-index.ts: ensureReadyWithin() and search(q,tags,page,limit)
// - public/runbooks.json: materialized at build (indirectly used by index)

import { NextRequest, NextResponse } from "next/server"
import { ensureReadyWithin, search as searchIndex } from "@/lib/runbooks-index"

export const runtime = "nodejs"

function parseStack(sp: URLSearchParams): string[] {
  const raw = (sp.get("stack") || "").toLowerCase()
  return Array.from(new Set(raw.split(/[\s,;|]+/).map((s) => s.trim()).filter(Boolean)))
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const tags = parseStack(url.searchParams)
    const rawLimit = Math.max(1, parseInt(url.searchParams.get("limit") || "5", 10) || 5)
    const limit = Math.min(20, rawLimit)

    if (!tags.length) {
      return NextResponse.json({ error: "Parameter 'stack' erforderlich (z.B. aws,nginx,postgres)" }, { status: 400 })
    }

    await ensureReadyWithin(1500)

    type Item = { slug: string; title: string; summary: string; tags: string[]; clawScore?: number }

    // 1) Versuche Intersection (alle Tags müssen vorkommen)
    const inter = searchIndex("", tags, 1, 400)
    let baseItems: Item[] = inter.items as Item[]

    // 2) Fallback: Union – pro Tag einzeln suchen und vereinigen
    if (!baseItems?.length) {
      const pool = new Map<string, Item>()
      for (const t of tags) {
        const r = searchIndex(t, [], 1, 200)
        for (const it of r.items as Item[]) if (!pool.has(it.slug)) pool.set(it.slug, it)
      }
      baseItems = Array.from(pool.values())
    }

    // Relevanz berechnen: Anteil übereinstimmender Tags in den Item-Tags
    const scored = baseItems.map((rb) => {
      const itemTags = (rb.tags || []).map((x) => x.toLowerCase())
      const matches = tags.filter((t) => itemTags.includes(t)).length
      const relevance = Math.round((matches / Math.max(1, tags.length)) * 100)
      return { ...rb, relevance, clawScore: rb.clawScore ?? 0 }
    })

    scored.sort((a, b) => (b.relevance - a.relevance) || ((b.clawScore || 0) - (a.clawScore || 0)))
    const top = scored.slice(0, limit)

    const execution_plan = top.length
      ? `Reihenfolge: ${top.map((r, i) => `${i + 1}. ${r.title}`).join(" → ")}`
      : "Keine passenden Runbooks gefunden."
    const estimated_time = `${top.length * 5 || 5} Minuten`

    const payload = {
      recommended_runbooks: top.map((r) => ({
        slug: r.slug,
        title: r.title,
        clawScore: r.clawScore || 0,
        relevance: r.relevance,
        summary: r.summary,
      })),
      execution_plan,
      estimated_time,
    }

    const res = NextResponse.json(payload)
    res.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=60")
    return res
  } catch (err) {
    console.error("[/api/neuro] error", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
