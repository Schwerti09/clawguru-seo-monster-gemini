"use client"

import { useEffect, useState } from "react"
import MyceliumView from "@/components/visual/MyceliumView"
import type { MyceliumGraph, RunbookSummary } from "@/lib/mycelium"
import type { Runbook } from "@/lib/pseo"

export default function MyceliumClientLoader() {
  const [data, setData] = useState<{
    graph: MyceliumGraph
    summaries: Record<string, RunbookSummary>
    total: number
  } | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const pseo: any = await import("@/lib/pseo")
        const buildClient: undefined | ((n: number) => Runbook[]) = pseo.buildRunbooksClient
        let runbooks: Runbook[] = []
        try {
          runbooks = buildClient ? buildClient(8000) : (pseo.RUNBOOKS ?? [])
        } catch {
          runbooks = (pseo.RUNBOOKS ?? []) as Runbook[]
        }
        const total = (typeof pseo.count100kSlugs === "function") ? pseo.count100kSlugs() : runbooks.length
        const { buildMyceliumGraph } = await import("@/lib/mycelium")
        const maxNodes = Math.min(500, runbooks.length)
        const graph = buildMyceliumGraph(runbooks, maxNodes)
        const summaries: Record<string, RunbookSummary> = {}
        for (const r of runbooks) {
          summaries[r.slug] = { title: r.title, summary: r.summary ?? "", tags: r.tags }
        }
        if (mounted) setData({ graph, summaries, total })
      } catch {
        // leave null → small placeholder rendered
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  if (!data) return <div className="text-sm text-gray-500 py-10 text-center">Lade Mycelium…</div>

  return <MyceliumView graph={data.graph} summaries={data.summaries} totalRunbooks={data.total} />
}
