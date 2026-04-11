import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const pseo: any = await import("@/lib/pseo")
    let list: any[] = []
    try {
      // Use cached materializedRunbooks() to avoid generating 10k runbooks on every request
      list = pseo.materializedRunbooks()
    } catch {
      list = []
    }

    const setUniq = new Set<string>()
    const cMap = new Map<string, number>()
    const sMap = new Map<string, number>()

    for (const r of list) {
      const score = Number(r?.clawScore || 0) || 0
      const tags: string[] = Array.isArray(r?.tags) ? r.tags : []
      for (const t of tags) {
        const key = String(t)
        setUniq.add(key)
        cMap.set(key, (cMap.get(key) || 0) + 1)
        sMap.set(key, (sMap.get(key) || 0) + score)
      }
    }

    const counts: Record<string, number> = {}
    const avgClaw: Record<string, number> = {}
    for (const t of setUniq) {
      const c = cMap.get(t) || 0
      const s = sMap.get(t) || 0
      counts[t] = c
      avgClaw[t] = c ? Math.round((s / c) * 10) / 10 : 0
    }
    const tags = Array.from(setUniq).sort((a, b) => a.localeCompare(b))
    const runbookCount = Array.isArray(list) ? list.length : 0

    const res = NextResponse.json({ tags, counts, avgClaw, runbookCount })
    res.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=60")
    return res
  } catch (err) {
    return NextResponse.json({ tags: [], counts: {}, avgClaw: {} }, { status: 200 })
  }
}
