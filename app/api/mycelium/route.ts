import { NextRequest, NextResponse } from "next/server"
import { buildMyceliumGraph } from "@/lib/mycelium"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const rawLimit = Math.max(6, parseInt(url.searchParams.get("limit") || "18", 10) || 18)
    const limit = Math.min(60, rawLimit)

    const pseo: any = await import("@/lib/pseo")
    let runbooks: any[] = []
    try {
      if (typeof pseo.buildRunbooksClient === "function") {
        runbooks = pseo.buildRunbooksClient(Math.max(120, limit * 4))
      } else {
        runbooks = (pseo.RUNBOOKS ?? []) as any[]
      }
    } catch {
      runbooks = (pseo.RUNBOOKS ?? []) as any[]
    }

    const graph = buildMyceliumGraph(runbooks, Math.max(60, limit * 3))

    const nodes = graph.nodes.slice(0, limit).map((n) => ({
      id: n.id,
      title: n.title,
      fitness: n.fitness,
      x: n.x,
      y: n.y,
    }))
    const nodeSet = new Set(nodes.map((n) => n.id))
    const edges = graph.edges
      .filter((e) => nodeSet.has(e.source) && nodeSet.has(e.target))
      .slice(0, Math.max(20, limit * 2))
      .map((e) => ({ source: e.source, target: e.target }))

    const res = NextResponse.json({ nodes, edges })
    res.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=60")
    return res
  } catch (err) {
    console.error("[/api/mycelium] error", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
