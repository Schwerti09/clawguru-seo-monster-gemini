"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import FeaturePreviewCard from "./FeaturePreviewCard"
import Skeleton from "./ui/Skeleton"

function useInView<T extends HTMLElement>(opts?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (!ref.current || inView) return
    const el = ref.current
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); io.disconnect() }
    }, opts)
    io.observe(el)
    return () => io.disconnect()
  }, [opts, inView])
  return { ref, inView }
}

type Node = { id: string; title: string; fitness: number; x: number; y: number }

type Edge = { source: string; target: string }

type GraphResp = { nodes: Node[]; edges: Edge[] }

type Props = { prefix?: string }

export default function MyceliumPreviewCard({ prefix = "" }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "200px" })
  const [data, setData] = useState<GraphResp | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [seed, setSeed] = useState(0)
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    if (!inView) return
    let canceled = false
    setLoading(true)
    setError(null)
    fetch(`/api/mycelium?limit=18`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j) => { if (!canceled) setData(j) })
      .catch(() => { if (!canceled) setError("Fehler beim Laden") })
      .finally(() => { if (!canceled) setLoading(false) })
    return () => { canceled = true }
  }, [inView])

  // Mild breathing animation
  useEffect(() => {
    if (!inView) return
    const id = setInterval(() => setSeed((s) => (s + 1) % 1000000), 1800)
    return () => clearInterval(id)
  }, [inView])

  // Animated stat counter
  useEffect(() => {
    if (!inView) return
    const target = 1247891
    let raf: number
    const start = performance.now()
    const dur = 1200
    const ease = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * t)
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur)
      const v = Math.round(target * ease(p))
      setCounter(v)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView])

  const dims = { w: 560, h: 240, pad: 18 }

  const norm = useMemo(() => {
    if (!data?.nodes?.length) return { nodes: [], edges: [] as Edge[] }
    const xs = data.nodes.map((n) => n.x)
    const ys = data.nodes.map((n) => n.y)
    const minX = Math.min(...xs), maxX = Math.max(...xs)
    const minY = Math.min(...ys), maxY = Math.max(...ys)
    const sx = (dims.w - dims.pad * 2) / Math.max(1, maxX - minX)
    const sy = (dims.h - dims.pad * 2) / Math.max(1, maxY - minY)
    const s = Math.min(sx, sy)
    const nodes = data.nodes.map((n, i) => ({
      ...n,
      nx: Math.round((n.x - minX) * s + dims.pad),
      ny: Math.round((n.y - minY) * s + dims.pad),
      r: 6 + Math.max(0, Math.min(10, (n.fitness - 70) / 3)),
      hi: (i + seed) % 7 === 0,
    })) as Array<Node & { nx: number; ny: number; r: number; hi: boolean }>
    return { nodes, edges: data.edges }
  }, [data, seed])

  return (
    <div ref={ref}>
      <FeaturePreviewCard
        title="Mycelium"
        description="Dein Wissen, visualisiert – ein lebender Graph."
        link={`${prefix}/mycelium`}
      >
        <div className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-black/30" style={{ aspectRatio: "7/3" }}>
          {loading && (
            <div className="absolute inset-0 p-4">
              <div className="h-full w-full rounded-xl border border-white/10">
                <div className="p-4 space-y-2">
                  <div className="text-xs text-gray-400">Visualisiere das Runbook‑Universum…</div>
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            </div>
          )}
          {!loading && error && <div className="p-4 text-sm text-red-400">{error}</div>}
          {!loading && !error && data && (
            <svg width="100%" height="100%" viewBox={`0 0 ${dims.w} ${dims.h}`} preserveAspectRatio="xMidYMid meet">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <g opacity="0.5">
                {norm.edges.map((e, i) => {
                  const a = (norm.nodes as any).find((n: any) => n.id === e.source)
                  const b = (norm.nodes as any).find((n: any) => n.id === e.target)
                  if (!a || !b) return null
                  return (
                    <line key={i} x1={a.nx} y1={a.ny} x2={b.nx} y2={b.ny} stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
                  )
                })}
              </g>
              <g>
                {(norm.nodes as any).map((n: any, i: number) => (
                  <a key={n.id} href={`${prefix}/runbook/${encodeURIComponent(n.id)}`} target="_blank" rel="noreferrer">
                    <circle cx={n.nx} cy={n.ny} r={n.r} fill={n.hi ? "#00ff9d" : "#8b5cf6"} opacity={n.hi ? 0.85 : 0.65} filter="url(#glow)">
                      <title>{`${n.title || n.id} — ${n.fitness >= 85 ? "Wird in 80% aller Sicherheitspläne verwendet" : "Basis für Compliance"}`}</title>
                    </circle>
                  </a>
                ))}
              </g>
            </svg>
          )}
          <div className="absolute top-2 left-2 text-[11px] text-gray-300 bg-black/40 border border-white/10 rounded px-2 py-0.5">
            {new Intl.NumberFormat("de-DE").format(counter)} Runbooks vernetzt
          </div>
          <div className="absolute bottom-2 right-2 text-[11px] text-gray-400">Live Preview</div>
        </div>
        <div className="mt-3 flex justify-end">
          <a href={`${prefix}/mycelium`} className="text-sm text-cyan-400 hover:text-cyan-300 transition">Das Mycelium erkunden →</a>
        </div>
      </FeaturePreviewCard>
    </div>
  )
}
