"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import RunbooksSearch from "@/components/shared/RunbooksSearch"
import type { Runbook } from "@/lib/pseo"

type Item = {
  slug: string
  title: string
  summary: string
  tags: string[]
  severity: "critical" | "high" | "medium" | "info"
  fixReadiness: number
}

function deriveSeverity(tags: string[]): Item["severity"] {
  const t = tags.join(" ").toLowerCase()
  if (/(critical|incident|notfall|p1)/.test(t)) return "critical"
  if (/(security|hardening|firewall|leak|breach)/.test(t)) return "high"
  if (/(monitoring|setup|ops|deploy)/.test(t)) return "medium"
  if (/(docs|template|howto)/.test(t)) return "info"
  return "medium"
}

function deriveReadiness(r: Runbook): number {
  const steps = r.howto?.steps?.length ?? 3
  return Math.min(95, 50 + steps * 8)
}

export default function RunbooksClientLoader() {
  const [items, setItems] = useState<Item[] | null>(null)
  const [total, setTotal] = useState<number | null>(null)
  const hostRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [idle, setIdle] = useState(false)

  useEffect(() => {
    let done = false
    try {
      const cb = () => { if (!done) setIdle(true) }
      const ric = (window as any).requestIdleCallback as undefined | ((fn: () => void, opts?: any) => any)
      if (ric) {
        const id = ric(cb, { timeout: 800 })
        return () => { done = true; try { (window as any).cancelIdleCallback?.(id) } catch {} }
      } else {
        const t = window.setTimeout(cb, 400)
        return () => { done = true; window.clearTimeout(t) }
      }
    } catch {
      setIdle(true)
      return undefined
    }
  }, [])

  useEffect(() => {
    if (!hostRef.current) { setVisible(true); return }
    let obs: IntersectionObserver | null = null
    try {
      obs = new IntersectionObserver((entries) => {
        const v = entries.some((e) => e.isIntersecting && e.intersectionRatio > 0)
        if (v) { setVisible(true); if (obs) obs.disconnect() }
      }, { threshold: [0, 0.1] })
      obs.observe(hostRef.current)
    } catch {
      setVisible(true)
    }
    return () => { try { obs && obs.disconnect() } catch {} }
  }, [])

  useEffect(() => {
    if (!visible || !idle || items) return
    let mounted = true
    ;(async () => {
      try {
        const pseo: any = await import("@/lib/pseo")
        const buildClient: undefined | ((n: number) => Runbook[]) = pseo.buildRunbooksClient
        const totalCount: number = typeof pseo.count100kSlugs === "function" ? pseo.count100kSlugs() : 0
        if (mounted) setTotal(totalCount || null)

        let list: Runbook[] = []
        try {
          list = buildClient ? buildClient(60) : pseo.materializedRunbooks().slice(0, 60)
        } catch {
          list = (pseo.materializedRunbooks() as Runbook[]).slice(0, 60)
        }
        const mapped = list.map((r) => ({
          slug: r.slug,
          title: r.title,
          summary: r.summary,
          tags: r.tags,
          severity: deriveSeverity(r.tags),
          fixReadiness: deriveReadiness(r),
        }))
        if (mounted) setItems(mapped)

        try {
          const isDesktop = typeof window !== "undefined" && (window.innerWidth >= 1024 || (navigator as any)?.hardwareConcurrency >= 6)
          const prefersReduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
          if (isDesktop && !prefersReduced && buildClient) {
            setTimeout(() => {
              if (!mounted) return
              try {
                const l2 = buildClient(160)
                const mapped2 = l2.map((r) => ({
                  slug: r.slug,
                  title: r.title,
                  summary: r.summary,
                  tags: r.tags,
                  severity: deriveSeverity(r.tags),
                  fixReadiness: deriveReadiness(r),
                }))
                if (mounted) setItems(mapped2)
              } catch {}
            }, 2000)
            setTimeout(() => {
              if (!mounted) return
              try {
                const l3 = buildClient(400)
                const mapped3 = l3.map((r) => ({
                  slug: r.slug,
                  title: r.title,
                  summary: r.summary,
                  tags: r.tags,
                  severity: deriveSeverity(r.tags),
                  fixReadiness: deriveReadiness(r),
                }))
                if (mounted) setItems(mapped3)
              } catch {}
            }, 5000)
            setTimeout(() => {
              if (!mounted) return
              try {
                const l4 = buildClient(800)
                const mapped4 = l4.map((r) => ({
                  slug: r.slug,
                  title: r.title,
                  summary: r.summary,
                  tags: r.tags,
                  severity: deriveSeverity(r.tags),
                  fixReadiness: deriveReadiness(r),
                }))
                if (mounted) setItems(mapped4)
              } catch {}
            }, 10000)
          }
        } catch {}
      } catch {
        // ignore → fallback UI below
      }
    })()
    return () => {
      mounted = false
    }
  }, [visible, idle, items])

  const header = useMemo(() => {
    const short = total && (total >= 1000000 ? `${(total / 1000000).toFixed(1)}M+` : new Intl.NumberFormat().format(total))
    return (
      <div className="mt-6 text-xs font-mono text-gray-400" style={{ minHeight: "1.25rem" }}>
        {short ? (
          <>Total library: <span className="text-white">{short}</span></>
        ) : (
          <span style={{ visibility: "hidden" }}>placeholder</span>
        )}
      </div>
    )
  }, [total])

  return (
    <div ref={hostRef}>
      {header}
      <RunbooksSearch items={items ?? []} />
    </div>
  )
}
