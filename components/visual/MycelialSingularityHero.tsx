"use client"

import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import { motion, useInView } from "framer-motion"
import { useI18n } from "@/components/i18n/I18nProvider"
import dynamic from "next/dynamic"
import Typewriter from "@/components/visual/Typewriter"
import MagicCTAButton from "@/components/ui/MagicCTAButton"

// LUXURY DESIGN 2026: Mycelial Singularity Graph – hoverable canvas nodes
// Pure Canvas API: no SSR issues, no extra bundle size beyond what's needed.

interface Node {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  label: string
  color: string
  glowColor: string
  connections: number[]
  hovered: boolean
  pulse: number
}

const NODE_DATA = [
  { label: "Runbooks", color: "#d4af37", glow: "rgba(212,175,55,0.6)" },
  { label: "Copilot", color: "#00b8ff", glow: "rgba(0,184,255,0.6)" },
  { label: "Intel", color: "#00ff9d", glow: "rgba(0,255,157,0.6)" },
  { label: "Vault", color: "#d4af37", glow: "rgba(212,175,55,0.6)" },
  { label: "Academy", color: "#00b8ff", glow: "rgba(0,184,255,0.6)" },
  { label: "Oracle", color: "#00ff9d", glow: "rgba(0,255,157,0.6)" },
  { label: "Mycelium", color: "#e8cc6a", glow: "rgba(232,204,106,0.7)" },
  { label: "Darwinian", color: "#00b8ff", glow: "rgba(0,184,255,0.6)" },
  { label: "Genesis", color: "#d4af37", glow: "rgba(212,175,55,0.6)" },
  { label: "Swarm", color: "#00ff9d", glow: "rgba(0,255,157,0.6)" },
  { label: "Neuro", color: "#00b8ff", glow: "rgba(0,184,255,0.6)" },
  { label: "Temporal", color: "#d4af37", glow: "rgba(212,175,55,0.6)" },
]

// Physics constants
const REPULSION_RADIUS = 120
const EDGE_FADE_DISTANCE = 280
const MYCELIUM_NODE_INDEX = 6

function initNodes(w: number, h: number): Node[] {
  return NODE_DATA.map((d, i) => ({
    id: i,
    x: w * 0.1 + Math.random() * w * 0.8,
    y: h * 0.1 + Math.random() * h * 0.8,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    radius: i === MYCELIUM_NODE_INDEX ? 10 : 5 + Math.random() * 4,
    label: d.label,
    color: d.color,
    glowColor: d.glow,
    connections: [],
    hovered: false,
    pulse: Math.random() * Math.PI * 2,
  }))
}

function buildConnections(nodes: Node[]): Node[] {
  const edges = [
    [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [7, 6], [8, 6], [9, 6], [10, 6], [11, 6],
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [0, 7], [1, 8], [9, 10], [10, 11], [0, 9],
  ]
  edges.forEach(([a, b]) => {
    if (!nodes[a].connections.includes(b)) nodes[a].connections.push(b)
    if (!nodes[b].connections.includes(a)) nodes[b].connections.push(a)
  })
  return nodes
}

export default function MycelialSingularityHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef<Node[]>([])
  const animFrameRef = useRef<number>(0)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  const { locale, dict } = useI18n()
  const prefix = `/${locale}`
  const isGerman = locale === "de"

  const R3FField = useRef<any>(null)
  const R3FComp = useMemo(() => dynamic(() => import("@/components/visual/ThreeMyceliumField"), { ssr: false, loading: () => null }), [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const W = canvas.width
    const H = canvas.height
    const nodes = nodesRef.current
    const mx = mouseRef.current.x
    const my = mouseRef.current.y

    // Clear
    ctx.clearRect(0, 0, W, H)

    // Physics tick
    nodes.forEach((n) => {
      n.pulse += 0.025
      // Attract to center gently
      const cx = W / 2, cy = H / 2
      n.vx += (cx - n.x) * 0.00008
      n.vy += (cy - n.y) * 0.00008
      // Repel from each other
      nodes.forEach((m) => {
        if (m.id === n.id) return
        const dx = n.x - m.x, dy = n.y - m.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        if (dist < REPULSION_RADIUS) {
          const force = (REPULSION_RADIUS - dist) / REPULSION_RADIUS * 0.015
          n.vx += dx / dist * force
          n.vy += dy / dist * force
        }
      })
      n.vx *= 0.98
      n.vy *= 0.98
      n.x += n.vx
      n.y += n.vy
      // Boundary
      if (n.x < 30) n.vx += 0.3
      if (n.x > W - 30) n.vx -= 0.3
      if (n.y < 30) n.vy += 0.3
      if (n.y > H - 30) n.vy -= 0.3
      // Hover detection
      const dx = mx - n.x, dy = my - n.y
      n.hovered = Math.sqrt(dx * dx + dy * dy) < n.radius + 16
    })

    // Draw edges
    nodes.forEach((n) => {
      n.connections.forEach((ci) => {
        if (ci <= n.id) return
        const m = nodes[ci]
        const dist = Math.hypot(n.x - m.x, n.y - m.y)
        const alpha = Math.max(0, 1 - dist / EDGE_FADE_DISTANCE) * 0.25
        if (alpha <= 0) return
        const isHighlighted = n.hovered || m.hovered
        ctx.beginPath()
        ctx.moveTo(n.x, n.y)
        // Slight curve for organic feel
        const mx2 = (n.x + m.x) / 2 + (m.y - n.y) * 0.08
        const my2 = (n.y + m.y) / 2 + (n.x - m.x) * 0.08
        ctx.quadraticCurveTo(mx2, my2, m.x, m.y)
        if (isHighlighted) {
          const grad = ctx.createLinearGradient(n.x, n.y, m.x, m.y)
          grad.addColorStop(0, n.color + "99")
          grad.addColorStop(1, m.color + "99")
          ctx.strokeStyle = grad
          ctx.lineWidth = 1.2
          ctx.globalAlpha = Math.min(1, alpha * 3.5)
        } else {
          ctx.strokeStyle = `rgba(212,175,55,${alpha * 0.8})`
          ctx.lineWidth = 0.6
          ctx.globalAlpha = 1
        }
        ctx.stroke()
        ctx.globalAlpha = 1
      })
    })

    // Draw nodes
    let newHovered: Node | null = null
    nodes.forEach((n) => {
      const pulseScale = 1 + Math.sin(n.pulse) * 0.12
      const r = n.radius * (n.hovered ? 1.6 : 1) * pulseScale
      if (n.hovered) newHovered = n

      // Glow
      const glowR = r * (n.hovered ? 5 : 3)
      const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR)
      grd.addColorStop(0, n.hovered ? n.glowColor : n.glowColor.replace(/[\d.]+\)$/, "0.35)"))
      grd.addColorStop(1, "transparent")
      ctx.beginPath()
      ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2)
      ctx.fillStyle = grd
      ctx.globalAlpha = n.hovered ? 0.9 : 0.5
      ctx.fill()
      ctx.globalAlpha = 1

      // Node body
      ctx.beginPath()
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
      ctx.fillStyle = n.color
      ctx.fill()

      // Inner highlight
      ctx.beginPath()
      ctx.arc(n.x - r * 0.2, n.y - r * 0.2, r * 0.45, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(255,255,255,0.35)"
      ctx.fill()

      // Label (on hover or central node)
      if (n.hovered || n.id === MYCELIUM_NODE_INDEX) {
        ctx.font = `${n.hovered ? 700 : 600} ${n.hovered ? 12 : 10}px 'Space Grotesk', system-ui`
        ctx.fillStyle = n.hovered ? n.color : "rgba(255,255,255,0.8)"
        ctx.textAlign = "center"
        ctx.fillText(n.label, n.x, n.y + r + 16)
        if (n.hovered) {
          // Soft shadow behind label
          ctx.shadowColor = n.color
          ctx.shadowBlur = 8
          ctx.fillText(n.label, n.x, n.y + r + 16)
          ctx.shadowBlur = 0
        }
      }
    })

    setHoveredNode(newHovered)
    animFrameRef.current = requestAnimationFrame(draw)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const setSize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
      nodesRef.current = buildConnections(initNodes(canvas.width, canvas.height))
    }
    setSize()
    window.addEventListener("resize", setSize)

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 }
    }
    canvas.addEventListener("mousemove", onMouseMove)
    canvas.addEventListener("mouseleave", onMouseLeave)

    // Touch support
    const onTouchMove = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect()
      const t = e.touches[0]
      mouseRef.current = { x: t.clientX - rect.left, y: t.clientY - rect.top }
    }
    canvas.addEventListener("touchmove", onTouchMove, { passive: true })

    animFrameRef.current = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener("resize", setSize)
      canvas.removeEventListener("mousemove", onMouseMove)
      canvas.removeEventListener("mouseleave", onMouseLeave)
      canvas.removeEventListener("touchmove", onTouchMove)
    }
  }, [draw])

  const headingVariants = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: "easeOut" as const },
    },
  }
  const staggerContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
  }
  const fadeSlide = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
  }

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center"
      style={{ background: "var(--surface-0)" }}
      aria-label="Mycelial Singularity Engine Hero"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <R3FComp />
      </div>
      {/* Luxury ambient orbs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute animate-orb-drift"
          style={{
            top: "-15%", left: "-10%",
            width: "70vw", height: "70vw", maxWidth: 700, maxHeight: 700,
            background: "radial-gradient(ellipse, rgba(212,175,55,0.06) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute animate-[orbDrift_16s_ease-in-out_infinite_reverse]"
          style={{
            bottom: "-15%", right: "-10%",
            width: "60vw", height: "60vw", maxWidth: 600, maxHeight: 600,
            background: "radial-gradient(ellipse, rgba(0,184,255,0.06) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "40vw", height: "40vw", maxWidth: 400, maxHeight: 400,
            background: "radial-gradient(ellipse, rgba(212,175,55,0.04) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      {/* Interactive Canvas */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{ cursor: hoveredNode ? "pointer" : "default" }}
      >
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto pt-28 pb-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="flex flex-col items-center"
        >
          {/* Kicker badge */}
          <motion.div variants={fadeSlide}>
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-vault mb-8">
              <span
                className="w-2 h-2 rounded-full animate-gold-pulse"
                style={{ background: "#d4af37", boxShadow: "0 0 8px rgba(212,175,55,0.8)" }}
              />
              <span className="text-xs font-mono tracking-[0.25em] uppercase" style={{ color: "#d4af37" }}>
                {dict.hero.badge}
              </span>
            </div>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            variants={headingVariants}
            className="font-display font-black leading-[1.02] tracking-tight"
            style={{ fontSize: "clamp(2.8rem, 7vw, 6.5rem)" }}
          >
            <span className="text-white">{isGerman ? "ClawGuru" : "Enter the"}</span>
            <br />
            <span className="text-gold-shimmer">{isGerman ? dict.hero.titleSuffix : "Mycelium"}</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={fadeSlide}
            className="mt-6 text-gray-300 max-w-2xl leading-relaxed"
            style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)" }}
          >
            {dict.hero.subtitle}
          </motion.p>

          <div className="mt-4 text-cyan-200 font-mono text-sm sm:text-base">
            <Typewriter
              text={isGerman ? "ClawGuru – Runbooks. Live Intel. Zero Bullshit." : "ClawGuru – Runbooks. Live Intel. Zero Bullshit."}
              speed={28}
              cursor
            />
          </div>

          {/* CTA buttons */}
          <motion.div variants={fadeSlide} className="mt-10 flex flex-wrap gap-4 justify-center">
            <a
              href={`${prefix}/mycelium`}
              className="btn-luxury-gold px-8 py-4 rounded-2xl text-sm font-black tracking-wide shadow-neon-gold"
            >
              {dict.hero.ctaMycelium}
            </a>
            <a
              href={`${prefix}/copilot`}
              className="px-8 py-4 rounded-2xl text-sm font-bold glass-vault luxury-border-gold text-gray-100 hover:text-white transition-all duration-300"
            >
              {dict.hero.ctaCopilot}
            </a>
            <MagicCTAButton href={`${prefix}/pricing`} label={dict.hero.ctaProKits} />
          </motion.div>

          {/* Stats row */}
          <motion.div variants={fadeSlide} className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
            {[
              { value: "1M+", label: "Runbooks" },
              { value: "94", label: "Security Score" },
              { value: "∞", label: dict.hero.knowledgeEdges },
              { value: "v3.0", label: dict.hero.genesisProtocol },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-5 rounded-2xl border border-white/10 bg-black/30"
              >
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Hover tooltip */}
        {hoveredNode && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-2xl border border-gray-800 bg-black/60 backdrop-blur px-4 py-2"
          >
            <span className="text-sm font-bold" style={{ color: hoveredNode.color }}>
              {hoveredNode.label}
            </span>
            <span className="text-xs text-gray-400 ml-2">· {dict.hero.nodeTooltip}</span>
          </motion.div>
        )}
      </div>

      <div className="pointer-events-none absolute right-6 top-24 sm:right-12 sm:top-28 z-10 hidden md:block" aria-hidden="true">
        <div className="grid gap-3" style={{ transform: "rotate(-2deg)" }}>
          {["Nginx 502 Gateway Timeout", "Stripe Webhook Signature", "Docker Secrets Rotation"].map((t, i) => (
            <a
              key={t}
              href={`${prefix}/runbooks?q=` + encodeURIComponent(t.split(" ")[0])}
              className="pointer-events-auto block p-4 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:rotate-1 hover:shadow-[0_10px_30px_-10px_rgba(0,184,255,0.35)]"
              style={{ boxShadow: i === 0 ? "0 0 0 1px rgba(0,184,255,0.25) inset" : undefined }}
            >
              <div className="text-xs text-cyan-300 font-mono">Runbook</div>
              <div className="font-bold text-gray-100">{t}</div>
              <div className="mt-1 text-xs text-gray-400">Hover für Tiefe · Neon‑Pulse</div>
            </a>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="text-xs text-gray-500 tracking-widest uppercase">{dict.hero.scrollLabel}</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-px h-8"
          style={{ background: "linear-gradient(to bottom, rgba(212,175,55,0.5), transparent)" }}
        />
      </motion.div>
    </section>
  )
}
