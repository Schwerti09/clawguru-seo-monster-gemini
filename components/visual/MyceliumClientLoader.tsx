"use client"

import { useEffect, useState } from "react"
import MyceliumView from "@/components/visual/MyceliumView"
import type { MyceliumGraph, RunbookSummary } from "@/lib/mycelium"
import type { Runbook } from "@/lib/pseo"

export default function MyceliumClientLoader(props: { ui?: "full" | "embed"; filterSlugs?: string[] } = {}) {
  const ui = props.ui ?? "full"
  const filterSlugs = Array.isArray(props.filterSlugs) ? props.filterSlugs : []
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
        if (filterSlugs.length > 0) {
          const set = new Set(filterSlugs)
          const filtered = runbooks.filter((r) => set.has(r.slug))
          if (filtered.length > 0) runbooks = filtered
        }
        const total = (typeof pseo.count100kSlugs === "function") ? pseo.count100kSlugs() : runbooks.length
        const { buildMyceliumGraph } = await import("@/lib/mycelium")
        const initialMax = ui === "embed" ? Math.min(360, runbooks.length) : Math.min(500, runbooks.length)
        let graph = buildMyceliumGraph(runbooks, initialMax)
        const summaries: Record<string, RunbookSummary> = {}
        for (const r of runbooks) {
          summaries[r.slug] = { title: r.title, summary: r.summary ?? "", tags: r.tags }
        }
        if (mounted) setData({ graph, summaries, total })

        // staged growth to ~1200 nodes for full-page view only (desktop, no reduced motion)
        if (mounted && ui !== "embed") {
          try {
            const isDesktop = typeof window !== "undefined" && (window.innerWidth >= 1024 || (navigator as any)?.hardwareConcurrency >= 6)
            const prefersReduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
            if (isDesktop && !prefersReduced) {
              const target1 = Math.min(800, runbooks.length)
              const target2 = Math.min(1200, runbooks.length)
              setTimeout(() => {
                if (!mounted) return
                try {
                  const g1 = buildMyceliumGraph(runbooks, target1)
                  if (mounted) setData((prev) => prev ? { ...prev, graph: g1 } : prev)
                } catch {}
              }, 2000)
              setTimeout(() => {
                if (!mounted) return
                try {
                  const g2 = buildMyceliumGraph(runbooks, target2)
                  if (mounted) setData((prev) => prev ? { ...prev, graph: g2 } : prev)
                } catch {}
              }, 7000)
            }
          } catch {}
        }
      } catch {
        // leave null → small placeholder rendered
      }
    })()
    return () => {
      mounted = false
    }
  }, [ui])

  if (!data) return <div className="text-sm text-gray-500 py-10 text-center">Lade Mycelium…</div>

  return <MyceliumView graph={data.graph} summaries={data.summaries} totalRunbooks={data.total} ui={ui} />
}
