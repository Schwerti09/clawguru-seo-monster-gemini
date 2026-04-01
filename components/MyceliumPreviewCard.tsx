"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic"
import FeaturePreviewCard from "./FeaturePreviewCard"
import Skeleton from "./ui/Skeleton"
import { STATS } from "@/lib/stats"

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

type Props = { prefix?: string; dict?: Record<string, string> }

export default function MyceliumPreviewCard({ prefix = "", dict = {} }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "200px" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [counter, setCounter] = useState(0)
  const [topNodes, setTopNodes] = useState<Array<{ id: string; title: string; fitness: number }>>([])
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, glow: 0 })

  // Lazy‑load heavy visual only when in view
  const MyceliumClientLoader = useMemo(() => (
    dynamic(() => import("@/components/visual/MyceliumClientLoader"), { ssr: false })
  ), [])

  useEffect(() => {
    if (!inView) return
    let canceled = false
    setLoading(true)
    setError(null)
    // Load small live sample for ticker + availability
    fetch(`/api/mycelium?limit=18`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j) => {
        if (canceled) return
        const nodes = Array.isArray(j?.nodes) ? j.nodes as Array<{ id: string; title: string; fitness: number }> : []
        const sorted = nodes.slice().sort((a, b) => (b.fitness ?? 0) - (a.fitness ?? 0))
        setTopNodes(sorted.slice(0, 10))
      })
      .catch(() => { if (!canceled) setError(null) })
      .finally(() => { if (!canceled) setLoading(false) })
    return () => { canceled = true }
  }, [inView])

  // Animated stat counter
  useEffect(() => {
    if (!inView) return
    const target = STATS.totalRunbooks || 1247891
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

  return (
    <div ref={ref}>
      <FeaturePreviewCard
        title="Mycelium"
        description="Live‑Graph deines Wissens – jetzt als Neon‑Embed."
        link={`${prefix}/mycelium`}
      >
        <div
          className="relative w-full overflow-hidden rounded-2xl border border-white/10"
          style={{
            aspectRatio: "16/9",
            background: "linear-gradient(135deg, rgba(0,184,255,0.10), rgba(0,255,157,0.06))",
            transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
            transition: "transform 120ms ease-out, box-shadow 150ms ease-out, border-color 150ms ease-out",
            boxShadow: `0 10px 30px rgba(0,0,0,0.35), 0 0 ${20 + tilt.glow * 20}px rgba(0,255,157,${0.10 + tilt.glow * 0.25})`,
            borderColor: `rgba(0,255,157,${0.10 + tilt.glow * 0.25})`,
            willChange: "transform, box-shadow",
          }}
          onMouseMove={(e) => {
            const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
            const x = (e.clientX - r.left) / r.width
            const y = (e.clientY - r.top) / r.height
            const ry = (x - 0.5) * 6
            const rx = -(y - 0.5) * 4
            setTilt({ rx, ry, glow: 1 })
          }}
          onMouseLeave={() => setTilt({ rx: 0, ry: 0, glow: 0 })}
        >
          {/* Subtle grid and glow */}
          <div aria-hidden className="pointer-events-none absolute inset-0" style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "3px 3px",
            maskImage: "radial-gradient(70% 70% at 50% 50%, black, transparent)",
          }} />

          {loading && (
            <div className="absolute inset-0 p-4">
              <div className="h-full w-full rounded-2xl border border-white/10 bg-black/35">
                <div className="p-4 space-y-2">
                  <div className="text-xs text-gray-400">Initialisiere Live‑Graph…</div>
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            </div>
          )}

          {/* Embed the live Mycelium view (limited, no pointer events) */}
          {inView && (
            <div className="absolute inset-0">
              <MyceliumClientLoader ui="embed" />
            </div>
          )}

          {/* Overlays */}
          <div className="absolute top-2 left-2 text-[11px] text-emerald-300 bg-black/50 border border-emerald-400/30 rounded px-2 py-0.5 font-mono tracking-wider">
            LIVE MYCELIUM
          </div>
          <div className="absolute top-2 right-2 text-[11px] text-gray-300 bg-black/40 border border-white/10 rounded px-2 py-0.5">
            {new Intl.NumberFormat("de-DE").format(counter)} Runbooks vernetzt
          </div>
          <a
            href={`${prefix}/mycelium`}
            className="absolute bottom-2 right-2 text-[11px] text-black px-2 py-1 rounded-md"
            style={{
              background: "linear-gradient(135deg,#00ff9d,#00b8ff)",
              boxShadow: `0 0 ${6 + tilt.glow * 8}px rgba(0,184,255,0.45)`
            }}
          >
            Vollbild öffnen ↗
          </a>

          {/* Top Nodes ticker */}
          {topNodes.length > 0 && (
            <div className="absolute left-0 right-0 bottom-0 h-8 overflow-hidden" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.55), rgba(0,0,0,0.35))", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="absolute inset-0 pointer-events-none" style={{ maskImage: "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)" }} />
              <div className="absolute whitespace-nowrap will-change-transform" style={{ left: 0, top: 0, animation: "mycelTicker 24s linear infinite" }}>
                {topNodes.concat(topNodes).map((n, i) => (
                  <a key={`${n.id}-${i}`} href={`${prefix}/runbook/${encodeURIComponent(n.id)}`} className="inline-flex items-center gap-2 mx-4 my-1 text-[11px]">
                    <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: n.fitness >= 92 ? "#00ff9d" : n.fitness >= 80 ? "#00b8ff" : "#b464ff" }} />
                    <span className="text-gray-300 hover:text-white transition-colors">{n.title || n.id}</span>
                    <span className="text-gray-500 font-mono">{Math.round(n.fitness)}%</span>
                  </a>
                ))}
              </div>
            </div>
          )}
          <style>{`@keyframes mycelTicker { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
        </div>
        <div className="mt-3 flex justify-between items-center">
          <div className="text-[11px] text-gray-500">Echte Daten · Canvas‑Graph · Evolvierend</div>
          <a href={`${prefix}/mycelium`} className="text-sm text-cyan-400 hover:text-cyan-300 transition">Das Mycelium erkunden →</a>
        </div>
      </FeaturePreviewCard>
    </div>
  )
}
