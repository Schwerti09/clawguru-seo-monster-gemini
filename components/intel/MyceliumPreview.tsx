"use client"

import React, { useEffect, useState, useRef } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { fetchWithRetry } from "@/lib/fetch-retry"

type Node = { id: string; title: string; slug: string; score: number; x: number; y: number; vx: number; vy: number }
type Edge = [string, string]
type IntelDict = { myceliumPreview_header?: string }

export default function MyceliumPreview({ prefix = "", dict = {} as IntelDict }: { prefix?: string; dict?: IntelDict }) {
  const reduce = useReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [hover, setHover] = useState<Node | null>(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const r = await fetchWithRetry("/api/intel?op=preview", { cache: "no-store" })
        const j = (await r.json()) as { nodes: Array<{ id: string; title: string; slug: string; score: number }>; edges: Edge[] }
        if (!alive) return
        const rnd = (i: number) => {
          const t = (i * 9301 + 49297) % 233280
          return t / 233280
        }
        const ns: Node[] = j.nodes.map((n, i) => ({
          ...n,
          x: 40 + rnd(i) * 220,
          y: 40 + rnd(i + 1) * 140,
          vx: 0,
          vy: 0,
        }))
        setNodes(ns)
        setEdges(j.edges)
      } catch {
        // ignore
      }
    })()
    return () => { alive = false }
  }, [])

  useEffect(() => {
    if (!canvasRef.current || reduce) return
    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return
    let raf = 0
    function step() {
      if (!ctx) return
      const W = canvasRef.current!.width
      const H = canvasRef.current!.height
      ctx.clearRect(0, 0, W, H)
      // physics lite
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
        const a = nodes.find((n) => n.id === e[0])!, b = nodes.find((n) => n.id === e[1])!
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
      // draw edges
      ctx.strokeStyle = "rgba(0,184,255,0.25)"
      ctx.lineWidth = 1
      for (const e of edges) {
        const a = nodes.find((n) => n.id === e[0])!, b = nodes.find((n) => n.id === e[1])!
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
      }
      // draw nodes
      for (const n of nodes) {
        ctx.shadowBlur = 12
        ctx.shadowColor = "rgba(0,184,255,0.4)"
        ctx.fillStyle = "rgba(0,184,255,0.2)"
        ctx.strokeStyle = "rgba(255,255,255,0.2)"
        ctx.beginPath(); ctx.arc(n.x, n.y, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [nodes, edges, reduce])

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
