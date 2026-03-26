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

type RBNode = { id: string; title: string; fitness: number; x: number; y: number; cat: "Security"|"Cloud"|"Kubernetes" }
type RBEdge = { source: string; target: string }
type GraphResp = { nodes: RBNode[]; edges: RBEdge[] }
type Props = { prefix?: string }

export default function MyceliumPreviewCard({ prefix = "" }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "200px" })
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const [data, setData] = useState<GraphResp | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<{[k in RBNode["cat"]]: boolean}>({ Security: true, Cloud: true, Kubernetes: true })
  const [hover, setHover] = useState<{ x: number; y: number; node?: RBNode } | null>(null)
  const [panning, setPanning] = useState<{ on: boolean; sx: number; sy: number; ox: number; oy: number }>({ on: false, sx: 0, sy: 0, ox: 0, oy: 0 })
  const [view, setView] = useState<{ scale: number; ox: number; oy: number }>({ scale: 1, ox: 0, oy: 0 })

  // Fetch or fallback demo data (stable seeded)
  useEffect(() => {
    if (!inView) return
    let canceled = false
    const lcg = (seed: number) => { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296) }
    const makeDemo = (): GraphResp => {
      const rnd = lcg(1337)
      const cats: Array<RBNode["cat"]> = ["Security", "Cloud", "Kubernetes"]
      const N = 82
      const nodes: RBNode[] = Array.from({ length: N }).map((_, i) => {
        const cat = cats[Math.floor(rnd() * cats.length)]
        return {
          id: `rb-${i}`,
          title: ["Zero‑Trust", "TLS‑HSTS", "CSP", "SSH‑Hardening", "RBAC", "SIEM Ingest", "K8s‑NetworkPolicy"][i % 7] + ` ${i}`,
          fitness: 70 + Math.floor(rnd() * 30),
          x: (rnd() - 0.5) * 2,
          y: (rnd() - 0.5) * 2,
          cat,
        }
      })
      const edges: RBEdge[] = []
      for (let i = 0; i < N * 1.8; i++) {
        const a = Math.floor(rnd() * N)
        let b = Math.floor(rnd() * N)
        if (a === b) b = (b + 1) % N
        edges.push({ source: nodes[a].id, target: nodes[b].id })
      }
      return { nodes, edges }
    }
    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        const r = await fetch(`/api/mycelium?limit=80`)
        if (!r.ok) throw new Error(String(r.status))
        const j = (await r.json()) as GraphResp
        // If API returns minimal schema, enrich categories
        const enr: GraphResp = {
          nodes: j.nodes.map((n, i) => ({ ...(n as any), cat: (i % 3 === 0 ? "Security" : i % 3 === 1 ? "Cloud" : "Kubernetes") })) as RBNode[],
          edges: j.edges,
        }
        if (!canceled) setData(enr)
      } catch {
        if (!canceled) setData(makeDemo())
      } finally {
        if (!canceled) setLoading(false)
      }
    }
    run()
    return () => { canceled = true }
  }, [inView])

  // Canvas renderer with glow, particles, and gentle animation
  useEffect(() => {
    if (!inView) return
    const cvs = canvasRef.current
    const wrap = wrapRef.current
    if (!cvs || !wrap || !data) return
    let raf = 0
    const ctx = cvs.getContext("2d")!
    const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
    const resize = () => {
      const r = wrap.getBoundingClientRect()
      cvs.width = Math.floor(r.width * DPR)
      cvs.height = Math.floor(r.height * DPR)
      cvs.style.width = `${r.width}px`
      cvs.style.height = `${r.height}px`
    }
    resize()
    const onResize = () => { resize() }
    window.addEventListener("resize", onResize)

    const rnd = (() => { let s = 4242; return () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff) })()
    const particles = Array.from({ length: 80 }).map(() => ({
      x: (rnd() - 0.5) * 2,
      y: (rnd() - 0.5) * 2,
      v: 0.001 + rnd() * 0.002,
      a: rnd() * Math.PI * 2,
    }))

    const colorFor = (c: RBNode["cat"], hi: boolean) => {
      if (c === "Security") return hi ? "#00ff9d" : "rgba(0,255,157,0.7)"
      if (c === "Cloud") return hi ? "#00b8ff" : "rgba(0,184,255,0.75)"
      return hi ? "#8b5cf6" : "rgba(139,92,246,0.75)"
    }

    const WtoS = (x: number, y: number) => {
      const cx = cvs.width / 2, cy = cvs.height / 2
      return [cx + (x + view.ox) * view.scale * cy, cy + (y + view.oy) * view.scale * cy]
    }
    const draw = (t: number) => {
      ctx.clearRect(0, 0, cvs.width, cvs.height)
      // Scanlines + background
      const g = ctx.createLinearGradient(0, 0, cvs.width, cvs.height)
      g.addColorStop(0, "rgba(0,184,255,0.05)")
      g.addColorStop(1, "rgba(0,255,157,0.04)")
      ctx.fillStyle = g
      ctx.fillRect(0, 0, cvs.width, cvs.height)
      for (let y = 0; y < cvs.height; y += 3) {
        ctx.fillStyle = "rgba(255,255,255,0.02)"
        ctx.fillRect(0, y, cvs.width, 1)
      }

      // Edges
      ctx.lineWidth = 1 * Math.max(1, DPR * 0.6)
      ctx.shadowBlur = 0
      const visible = new Set(Object.entries(filters).filter(([, v]) => v).map(([k]) => k))
      const nodes = data.nodes
      for (const e of data.edges) {
        const a = nodes.find((n) => n.id === e.source)
        const b = nodes.find((n) => n.id === e.target)
        if (!a || !b) continue
        if (!visible.has(a.cat) || !visible.has(b.cat)) continue
        const [ax, ay] = WtoS(a.x, a.y)
        const [bx, by] = WtoS(b.x, b.y)
        ctx.strokeStyle = "rgba(255,255,255,0.09)"
        ctx.beginPath()
        ctx.moveTo(ax, ay)
        ctx.lineTo(bx, by)
        ctx.stroke()
      }

      // Particles
      for (const p of particles) {
        p.a += 0.002
        p.x += Math.cos(p.a) * p.v
        p.y += Math.sin(p.a) * p.v
        const [px, py] = WtoS(p.x, p.y)
        ctx.fillStyle = "rgba(0,184,255,0.35)"
        ctx.beginPath()
        ctx.arc(px, py, 1.2 * DPR, 0, Math.PI * 2)
        ctx.fill()
      }

      // Nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        if (!visible.has(n.cat)) continue
        const [x, y] = WtoS(n.x, n.y)
        const pulse = 0.85 + 0.15 * Math.sin((t / 600) + i)
        const r = (4 + Math.max(0, (n.fitness - 70) * 0.18)) * DPR * pulse
        ctx.shadowColor = colorFor(n.cat, true)
        ctx.shadowBlur = 12 * DPR
        ctx.fillStyle = colorFor(n.cat, false)
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
    }
  }, [inView, data, view, filters])

  // Pointer interactions: hover, pan, zoom
  useEffect(() => {
    if (!inView) return
    const cvs = canvasRef.current
    if (!cvs || !data) return
    const getWorld = (cx: number, cy: number) => {
      const rect = cvs.getBoundingClientRect()
      const x = (cx - rect.left) * (cvs.width / rect.width)
      const y = (cy - rect.top) * (cvs.height / rect.height)
      const sc = cvs.height / 2
      const wx = (x - cvs.width / 2) / (view.scale * sc) - view.ox
      const wy = (y - cvs.height / 2) / (view.scale * sc) - view.oy
      return { wx, wy }
    }
    const onMove = (e: PointerEvent) => {
      if (panning.on) {
        const dx = (e.clientX - panning.sx) / 240
        const dy = (e.clientY - panning.sy) / 240
        setView((v) => ({ ...v, ox: panning.ox + dx / v.scale, oy: panning.oy + dy / v.scale }))
        return
      }
      const { wx, wy } = getWorld(e.clientX, e.clientY)
      let nearest: RBNode | undefined
      let best = 1e9
      for (const n of data.nodes) {
        if (!filters[n.cat]) continue
        const d = (n.x - wx) ** 2 + (n.y - wy) ** 2
        if (d < best) { best = d; nearest = n }
      }
      if (nearest && best < 0.015) {
        setHover({ x: e.clientX, y: e.clientY, node: nearest })
      } else {
        setHover(null)
      }
    }
    const onDown = (e: PointerEvent) => {
      setPanning({ on: true, sx: e.clientX, sy: e.clientY, ox: view.ox, oy: view.oy })
      ;(e.target as Element).setPointerCapture(e.pointerId)
    }
    const onUp = (e: PointerEvent) => {
      setPanning((p) => ({ ...p, on: false }))
      try { (e.target as Element).releasePointerCapture(e.pointerId) } catch {}
    }
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const ds = Math.exp(-e.deltaY * 0.001)
      setView((v) => ({ ...v, scale: Math.max(0.6, Math.min(2.4, v.scale * ds)) }))
    }
    cvs.addEventListener("pointermove", onMove)
    cvs.addEventListener("pointerdown", onDown)
    window.addEventListener("pointerup", onUp)
    cvs.addEventListener("wheel", onWheel, { passive: false })
    return () => {
      cvs.removeEventListener("pointermove", onMove)
      cvs.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointerup", onUp)
      cvs.removeEventListener("wheel", onWheel)
    }
  }, [inView, data, view, panning.on, filters])

  const statBlock = (
    <div className="flex flex-col gap-2 text-[11px] text-gray-300">
      <div className="flex items-center justify-between gap-4">
        <span className="text-gray-400">68 Evolutions pro Stunde</span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-white/10 bg-black/40">Live</span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-gray-400">13.892 Mycelium Nodes</span>
        <span className="text-emerald-300">+142</span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-gray-400">Zero Known Breaches 2026</span>
        <span className="text-emerald-300">OK</span>
      </div>
    </div>
  )

  return (
    <div ref={ref}>
      <FeaturePreviewCard
        title="Mycelium"
        description="Dein Wissen, visualisiert – ein lebender Graph."
        link={`${prefix}/mycelium`}
      >
        <div ref={wrapRef} className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-black/30" style={{ aspectRatio: "7/3" }}>
          {loading && (
            <div className="absolute inset-0 p-4">
              <div className="h-full w-full rounded-xl border border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 animate-pulse" style={{ background: "radial-gradient(circle at 30% 20%, rgba(0,184,255,0.12), transparent 40%), radial-gradient(circle at 70% 80%, rgba(0,255,157,0.1), transparent 45%)" }} />
                <div className="absolute inset-0" aria-hidden>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="absolute h-px w-full bg-white/5" style={{ top: `${(i+1)*7}%` }} />
                  ))}
                </div>
                <div className="absolute inset-0 p-4 space-y-2">
                  <div className="text-xs text-gray-400">Initialisiere den lebenden Graph…</div>
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            </div>
          )}
          {!loading && error && <div className="p-4 text-sm text-red-400">{error}</div>}
          {!loading && !error && (
            <>
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
              {/* Top-left mega metric */}
              <div className="absolute top-2 left-2">
                <div className="px-2 py-1 rounded-md text-[10px] font-mono tracking-widest uppercase text-[#00ff9d] bg-black/40 border border-emerald-400/20 inline-block">Mycelium</div>
                <div className="mt-1 text-xl sm:text-2xl font-black text-white drop-shadow" style={{ textShadow: "0 0 16px rgba(0,255,157,0.25)" }}>4,2 Millionen Runbooks vernetzt</div>
              </div>
              {/* Filters */}
              <div className="absolute top-2 right-2 flex items-center gap-2">
                {["Security", "Cloud", "Kubernetes"].map((k) => (
                  <button key={k} onClick={() => setFilters((f) => ({ ...f, [k]: !f[k as keyof typeof f] }))} className={`text-[11px] px-2 py-0.5 rounded-full border ${filters[k as keyof typeof filters] ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-200" : "border-white/10 bg-black/40 text-gray-300"}`}>{k}</button>
                ))}
              </div>
              {/* Right-side stats */}
              <div className="hidden md:block absolute right-2 bottom-2 w-56 rounded-xl border border-white/10 bg-black/30 p-3 backdrop-blur-sm">
                <div className="text-xs font-semibold text-white mb-1">Live‑Stats</div>
                {statBlock}
              </div>
              {/* CTA */}
              <div className="absolute left-2 bottom-2 flex items-center gap-3">
                <a href={`${prefix}/mycelium`} className="text-sm text-cyan-300 hover:text-cyan-200 underline">Graph erkunden →</a>
                <span className="text-[11px] text-gray-400">Drag • Zoom • Hover</span>
              </div>
              {/* Hover tooltip */}
              {hover?.node && (
                <div className="fixed z-10 pointer-events-none rounded-lg border border-white/10 bg-black/80 text-white text-[11px] p-2 shadow-xl" style={{ left: hover.x + 10, top: hover.y + 10 }}>
                  <div className="text-[11px] text-gray-300">{hover.node.title}</div>
                  <div className="text-[10px] text-gray-400">Relation: {["evolves from","prevents","causes"][hover.node.fitness % 3]}</div>
                  <div className="text-[10px] text-emerald-300">ClawScore {hover.node.fitness}</div>
                </div>
              )}
            </>
          )}
          {/* Glass edges */}
          <div className="pointer-events-none absolute inset-0 rounded-xl" style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06), 0 0 48px rgba(0,184,255,0.08), 0 0 64px rgba(0,255,157,0.06)" }} />
        </div>
        <div className="mt-3 flex justify-end">
          <a href={`${prefix}/mycelium`} className="text-sm text-cyan-400 hover:text-cyan-300 transition">Das Mycelium erkunden →</a>
        </div>
      </FeaturePreviewCard>
    </div>
  )
}
