"use client"

import React, { useEffect, useState, useRef } from "react"
import { motion, useReducedMotion } from "framer-motion"

type Node = { id: string; title: string; slug: string; score: number; x: number; y: number; vx: number; vy: number }
type Edge = [string, string]
type IntelDict = { myceliumPreview_header?: string }

export default function MyceliumPreview({ prefix = "", dict = {} as IntelDict }: { prefix?: string; dict?: IntelDict }) {
  const reduce = useReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [hover, setHover] = useState<Node | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const nodesRef = useRef<Node[]>([])
  const edgesRef = useRef<Edge[]>([])
  const retryRef = useRef<number>(30000)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    let alive = true
    async function load() {
      try {
        const r = await fetch("/api/intel?op=preview", { cache: "no-store" })
        if (!alive) return
        if (r.status === 429) {
          setErr("429")
          const ra = Number(r.headers.get("Retry-After") || "30") * 1000 || 30000
          const next = Math.min(Math.max(retryRef.current, ra), 300000)
          retryRef.current = Math.min(next * 2, 300000)
          if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
          timeoutRef.current = window.setTimeout(() => { if (alive) load() }, next)
          return
        }
        if (!r.ok) {
          setErr(String(r.status))
          return
        }
        const j = (await r.json()) as { nodes?: Array<{ id: string; title: string; slug: string; score: number }>; edges?: Edge[] }
        const rnd = (i: number) => { const t = (i * 9301 + 49297) % 233280; return t / 233280 }
        const srcNodes = Array.isArray(j?.nodes) ? j.nodes! : []
        const srcEdges = Array.isArray(j?.edges) ? j.edges! : []
        const ns: Node[] = srcNodes.map((n, i) => ({ ...n, x: 40 + rnd(i) * 220, y: 40 + rnd(i + 1) * 140, vx: 0, vy: 0 }))
        setErr(null)
        setNodes(ns)
        setEdges(srcEdges)
        nodesRef.current = ns
        edgesRef.current = srcEdges
        retryRef.current = 30000
      } catch {
        setErr("load")
      }
    }
    timeoutRef.current = window.setTimeout(() => { if (alive) load() }, 10000)
    return () => { alive = false; if (timeoutRef.current) window.clearTimeout(timeoutRef.current) }
  }, [])

  useEffect(() => {
    if (!canvasRef.current || reduce) return
    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return
    const canvas = canvasRef.current
    const W = canvas.width
    const H = canvas.height
    const nodes = nodesRef.current
    const edges = edgesRef.current
    ctx.clearRect(0, 0, W, H)
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j]
        const dx = b.x - a.x, dy = b.y - a.y
        const d2 = Math.max(25, dx * dx + dy * dy)
        const f = 1200 / d2
        const fx = f * dx, fy = f * dy
        a.vx -= fx * 0.0005; a.vy -= fy * 0.0005
        b.vx += fx * 0.0005; b.vy += fy * 0.0005
      }
    }
    for (const e of edges) {
      const a = nodes.find((n) => n.id === e[0])
      const b = nodes.find((n) => n.id === e[1])
      if (!a || !b) continue
      const dx = b.x - a.x, dy = b.y - a.y
      const d = Math.sqrt(dx * dx + dy * dy) || 1
      const k = (d - 80) * 0.02
      const nx = (dx / d) * k, ny = (dy / d) * k
      a.vx += nx; a.vy += ny
      b.vx -= nx; b.vy -= ny
    }
    for (const n of nodes) {
      n.vx *= 0.92; n.vy *= 0.92
      n.x = Math.min(W - 20, Math.max(20, n.x + n.vx))
      n.y = Math.min(H - 20, Math.max(20, n.y + n.vy))
    }
    ctx.strokeStyle = "rgba(0,184,255,0.25)"
    ctx.lineWidth = 1
    for (const e of edges) {
      const a = nodes.find((n) => n.id === e[0])
      const b = nodes.find((n) => n.id === e[1])
      if (!a || !b) continue
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
    }
    for (const n of nodes) {
      ctx.shadowBlur = 12
      ctx.shadowColor = "rgba(0,184,255,0.4)"
      ctx.fillStyle = "rgba(0,184,255,0.2)"
      ctx.strokeStyle = "rgba(255,255,255,0.2)"
      ctx.beginPath(); ctx.arc(n.x, n.y, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
    }
  }, [reduce])

  useEffect(() => { nodesRef.current = nodes }, [nodes])
  useEffect(() => { edgesRef.current = edges }, [edges])

  function onPointerMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left, y = e.clientY - rect.top
    let best: Node | null = null
    let bd = 16
    for (const n of nodes) {
      const d = Math.hypot(n.x - x, n.y - y)
      if (d < bd) { bd = d; best = n }
    }
    setHover(best)
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-4 relative">
      <div className="text-sm font-semibold text-white mb-3">{dict.myceliumPreview_header || "Mycelium Preview"}</div>
      <div className="relative">
        {err === "429" && (
          <div className="mb-2 text-[11px] text-amber-300">Threat Feed wird gerade aktualisiert… (429)</div>
        )}
        <canvas
          ref={canvasRef}
          onMouseMove={onPointerMove}
          width={320}
          height={220}
          className="w-full h-56 rounded-xl border border-white/10 bg-[#07090f]"
          aria-label="Mycelium preview"
        />
        {hover && (
          <motion.a
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            href={`${prefix}/runbook/${hover.slug}`.replace(/\/\//g, "/")}
            className="absolute left-2 bottom-2 rounded-lg border border-emerald-400/40 bg-emerald-500/10 text-emerald-100 text-xs px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
          >
            {hover.title}
          </motion.a>
        )}
      </div>
    </div>
  )
}
