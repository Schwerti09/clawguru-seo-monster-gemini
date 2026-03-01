// CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI
// The ClawVerse portal: the cosmic gateway to the Universal Mycelium.
// Full-screen black hole at centre, infinitely growing mycelium strands,
// Tabbed hub (Overview · 3D-Graph · Neuro · Summon · Provenance),
// Reality Anchor per-user private instance, and the hidden Singularity Button.

"use client"

import { useState, useEffect, useRef, useCallback } from "react"

// CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Cosmic colour palette
const CLAWVERSE_COLORS = ["#00ff9d", "#00b8ff", "#b464ff", "#ffc800", "#ff4646", "#ffffff"]

// CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Tab type
type ClawVerseTab = "overview" | "graph" | "neuro" | "summon" | "provenance"

// CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Tab definitions
const TABS: { id: ClawVerseTab; label: string; icon: string; color: string }[] = [
  { id: "overview",   label: "Overview",   icon: "♾️",  color: "#00ff9d" },
  { id: "graph",      label: "3D-Graph",   icon: "🌐", color: "#00b8ff" },
  { id: "neuro",      label: "Neuro",      icon: "🧠", color: "#b464ff" },
  { id: "summon",     label: "Summon",     icon: "✦",  color: "#ffc800" },
  { id: "provenance", label: "Provenance", icon: "🛡",  color: "#ff4646" },
]

// CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Canvas cosmic background
// Renders a pulsing black hole at centre with infinitely-branching mycelium tendrils.
function ClawVerseBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Resize handler
    function resize() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener("resize", resize)

    // CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Mycelium tendril type
    type Tendril = {
      x: number
      y: number
      angle: number
      length: number
      maxLength: number
      color: string
      alpha: number
      speed: number
      branchChance: number
      width: number
    }

    const tendrils: Tendril[] = []

    function spawnTendril(x?: number, y?: number, angle?: number): Tendril {
      const c = canvas!
      const cx = c.width / 2
      const cy = c.height / 2
      // CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Tendrils always radiate outward from centre
      const ox = x ?? cx
      const oy = y ?? cy
      const baseAngle = angle ?? Math.atan2(oy - cy, ox - cx) + (Math.random() - 0.5) * 0.6
      return {
        x: ox,
        y: oy,
        angle: baseAngle,
        length: 0,
        maxLength: 80 + Math.random() * 220,
        color: CLAWVERSE_COLORS[Math.floor(Math.random() * CLAWVERSE_COLORS.length)],
        alpha: 0.04 + Math.random() * 0.12,
        speed: 0.5 + Math.random() * 1.2,
        branchChance: 0.007,
        width: 0.3 + Math.random() * 0.9,
      }
    }

    // CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Seed initial outward tendrils
    for (let i = 0; i < 32; i++) {
      const c = canvas!
      const cx = c.width / 2
      const cy = c.height / 2
      const angle = (i / 32) * Math.PI * 2
      tendrils.push(spawnTendril(
        cx + Math.cos(angle) * 24,
        cy + Math.sin(angle) * 24,
        angle,
      ))
    }

    let frame = 0

    function draw() {
      if (!canvas || !ctx) return
      const cx = canvas.width / 2
      const cy = canvas.height / 2

      // CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Slow fade for trailing persistence
      ctx.fillStyle = "rgba(3, 3, 6, 0.018)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Draw black hole core
      const holeRadius = 48 + Math.sin(frame * 0.025) * 6
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, holeRadius * 2.8)
      grad.addColorStop(0, "rgba(0,0,0,1)")
      grad.addColorStop(0.35, "rgba(0,0,0,0.95)")
      grad.addColorStop(0.7, "rgba(0,255,157,0.06)")
      grad.addColorStop(1, "rgba(0,0,0,0)")
      ctx.beginPath()
      ctx.arc(cx, cy, holeRadius * 2.8, 0, Math.PI * 2)
      ctx.fillStyle = grad
      ctx.fill()

      // CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Accretion disc rings
      for (let ring = 0; ring < 3; ring++) {
        const ringR = holeRadius + 8 + ring * 14 + Math.sin(frame * 0.03 + ring) * 3
        ctx.beginPath()
        ctx.arc(cx, cy, ringR, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${ring === 0 ? "0,255,157" : ring === 1 ? "0,184,255" : "180,100,255"},${0.18 - ring * 0.04})`
        ctx.lineWidth = 1.2 - ring * 0.3
        ctx.stroke()
      }

      // CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Animate tendrils
      for (let i = tendrils.length - 1; i >= 0; i--) {
        const t = tendrils[i]
        const nx = t.x + Math.cos(t.angle) * t.speed
        const ny = t.y + Math.sin(t.angle) * t.speed

        ctx.beginPath()
        ctx.moveTo(t.x, t.y)
        ctx.lineTo(nx, ny)
        ctx.strokeStyle = t.color
        ctx.globalAlpha = t.alpha
        ctx.lineWidth = t.width
        ctx.stroke()
        ctx.globalAlpha = 1

        t.x = nx
        t.y = ny
        t.angle += (Math.random() - 0.5) * 0.28
        t.length += t.speed

        // CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Spawn child branches
        if (Math.random() < t.branchChance && tendrils.length < 200) {
          tendrils.push({
            ...spawnTendril(t.x, t.y, t.angle + (Math.random() - 0.5) * 1.2),
            alpha: t.alpha * 0.65,
            width: t.width * 0.65,
          })
        }

        if (
          t.length >= t.maxLength ||
          t.x < 0 || t.x > canvas.width ||
          t.y < 0 || t.y > canvas.height
        ) {
          tendrils.splice(i, 1)
        }
      }

      // CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Continuously respawn tendrils from centre
      frame++
      if (frame % 12 === 0 && tendrils.length < 100) {
        const angle = Math.random() * Math.PI * 2
        tendrils.push(spawnTendril(
          cx + Math.cos(angle) * 20,
          cy + Math.sin(angle) * 20,
          angle,
        ))
      }

      animRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener("resize", resize)
      if (animRef.current !== null) cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0, background: "#030306" }}
      role="img"
      aria-label="Animated cosmic background: black hole at centre with infinitely growing mycelium tendrils"
    />
  )
}

// CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Cosmic gravitational button animation
function EnterButton({ onClick }: { onClick: () => void }) {
  const [hovering, setHovering] = useState(false)
  const [pulsing, setPulsing] = useState(false)

  // CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Pulse every 3 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setPulsing(true)
      setTimeout(() => setPulsing(false), 700)
    }, 3000)
    return () => clearInterval(id)
  }, [])

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="relative px-10 py-5 rounded-full font-black text-lg tracking-widest uppercase
                 transition-all duration-500 font-mono"
      style={{
        background: hovering
          ? "linear-gradient(90deg, #00ff9d22, #00b8ff22, #b464ff22)"
          : "rgba(0,0,0,0.6)",
        border: `2px solid ${hovering ? "#00ff9d" : "rgba(0,255,157,0.4)"}`,
        color: hovering ? "#00ff9d" : "rgba(0,255,157,0.8)",
        boxShadow: hovering
          ? "0 0 60px rgba(0,255,157,0.35), 0 0 120px rgba(0,184,255,0.2)"
          : pulsing
          ? "0 0 30px rgba(0,255,157,0.2)"
          : "0 0 20px rgba(0,255,157,0.1)",
        transform: hovering ? "scale(1.06)" : pulsing ? "scale(1.02)" : "scale(1)",
        letterSpacing: "0.18em",
      }}
    >
      {/* CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Gravitational orbit ring */}
      <span
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          border: `1px solid rgba(0,255,157,${hovering ? 0.25 : 0.08})`,
          transform: hovering ? "scale(1.18)" : "scale(1)",
          transition: "transform 0.5s ease, opacity 0.5s ease",
          opacity: hovering ? 1 : 0,
        }}
      />
      Enter the ClawVerse
    </button>
  )
}

// CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Reality Anchor component
// Every user's personal, isolated mycelium instance.
function RealityAnchor() {
  const [anchorId] = useState<string>(() => {
    // CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Generate deterministic anchor ID
    // from browser fingerprint-like data (no personal data stored, fully client-side)
    if (typeof window === "undefined") return "ANCHOR-∞-LOADING"
    const seed = [
      navigator.language,
      screen.width,
      screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
    ].join("-")
    let h = 0x5a4d
    for (let i = 0; i < seed.length; i++) {
      h = (Math.imul(37, h) ^ seed.charCodeAt(i)) | 0
      h = (Math.imul(h, 0x9e3779b9) ^ (h >>> 16)) | 0
    }
    return `ANCHOR-${(Math.abs(h) >>> 0).toString(36).toUpperCase().padStart(8, "0")}`
  })

  const [connected, setConnected] = useState(false)
  const [transitioning, setTransitioning] = useState(false)

  const toggle = useCallback(() => {
    setTransitioning(true)
    setTimeout(() => {
      setConnected((c) => !c)
      setTransitioning(false)
    }, 600)
  }, [])

  return (
    // CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Reality Anchor card
    <div
      className="rounded-2xl border p-6 max-w-sm w-full mx-auto transition-all duration-500"
      style={{
        background: "rgba(5, 6, 10, 0.85)",
        borderColor: connected ? "rgba(0,255,157,0.4)" : "rgba(255,255,255,0.1)",
        boxShadow: connected ? "0 0 32px rgba(0,255,157,0.12)" : "none",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="text-xs font-mono tracking-widest uppercase mb-1" style={{ color: "#00ff9d88" }}>
        Personal Universe Anchor
      </div>
      <div className="text-base font-mono font-black text-white mb-4 tracking-wider">
        {anchorId}
      </div>
      <p className="text-xs text-gray-500 leading-relaxed mb-4">
        Your private Mycelium instance. Isolated by default — connect to the ClawVerse
        to let the Universal Mycelium incorporate your signal.
      </p>
      <button
        onClick={toggle}
        disabled={transitioning}
        className="w-full py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest
                   transition-all duration-300 disabled:opacity-40"
        style={
          connected
            ? {
                background: "rgba(0,255,157,0.12)",
                border: "1px solid rgba(0,255,157,0.5)",
                color: "#00ff9d",
              }
            : {
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.5)",
              }
        }
      >
        {transitioning ? "Synchronising…" : connected ? "⬡ Connected to ClawVerse" : "○ Isolated · Click to Connect"}
      </button>
    </div>
  )
}

// CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Hidden Singularity Button
// Revealed after triple-clicking the secret trigger zone.
// Clicking initiates a simulated Universal Convergence — purely cosmetic, no external calls.
function SingularityButton() {
  const clickCountRef = useRef(0)
  const [revealed, setRevealed] = useState(false)
  const [converging, setConverging] = useState(false)
  const [done, setDone] = useState(false)

  // CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Reveal after 3 secret clicks
  const handleSecretClick = useCallback(() => {
    clickCountRef.current += 1
    if (clickCountRef.current >= 3) setRevealed(true)
  }, [])

  const initiate = useCallback(() => {
    if (converging || done) return
    setConverging(true)
    setTimeout(() => {
      setConverging(false)
      setDone(true)
    }, 3500)
  }, [converging, done])

  const CONVERGENCE_STEPS = [
    "Tracing mycelial pathways across 1M+ nodes…",
    "Broadcasting Universal Epoch signal…",
    "Aligning Multiversal Branches to prime reality…",
    "Synchronising Reality Anchors globally…",
    "Universal Convergence complete. The Mycelium is one.",
  ]

  const [stepIdx, setStepIdx] = useState(0)

  useEffect(() => {
    if (!converging) return
    setStepIdx(0)
    const interval = setInterval(() => {
      setStepIdx((i) => {
        if (i >= CONVERGENCE_STEPS.length - 2) {
          clearInterval(interval)
          return i + 1
        }
        return i + 1
      })
    }, 700)
    return () => clearInterval(interval)
  // CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: CONVERGENCE_STEPS is stable
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [converging])

  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      {/* CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Triple-click activation zone */}
      <button
        onClick={handleSecretClick}
        aria-hidden={true}
        aria-label="Secret activation zone"
        className="w-2 h-2 rounded-full opacity-0 cursor-default"
        tabIndex={-1}
      />

      {revealed && !done && (
        <div className="flex flex-col items-center gap-3 animate-fade-in">
          <div className="text-xs font-mono text-gray-600 tracking-widest uppercase">
            — Hidden Protocol Unlocked —
          </div>
          <button
            onClick={initiate}
            disabled={converging}
            className="px-8 py-3 rounded-full font-mono font-bold text-sm uppercase tracking-widest
                       transition-all duration-300 disabled:opacity-60"
            style={{
              background: converging ? "rgba(180,100,255,0.15)" : "rgba(180,100,255,0.08)",
              border: "1px solid rgba(180,100,255,0.5)",
              color: "#b464ff",
              boxShadow: converging ? "0 0 40px rgba(180,100,255,0.3)" : "none",
            }}
          >
            {converging ? "Converging…" : "Initiate Universal Convergence"}
          </button>

          {converging && (
            <div className="text-xs font-mono text-center max-w-xs leading-relaxed" style={{ color: "#b464ff88" }}>
              {CONVERGENCE_STEPS[stepIdx]}
            </div>
          )}
        </div>
      )}

      {done && (
        <div
          className="text-xs font-mono tracking-widest text-center animate-fade-in"
          style={{ color: "#00ff9d88" }}
        >
          ✓ Universal Convergence complete. The Mycelium is one.
        </div>
      )}
    </div>
  )
}

// CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Tab navigation bar
function TabBar({
  active,
  onChange,
}: {
  active: ClawVerseTab
  onChange: (t: ClawVerseTab) => void
}) {
  return (
    <nav
      className="flex gap-1 rounded-2xl p-1 mb-8 w-full max-w-2xl"
      style={{
        background: "rgba(5,6,10,0.9)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(16px)",
      }}
      role="tablist"
      aria-label="ClawVerse sections"
    >
      {TABS.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={active === tab.id}
          aria-controls={`tabpanel-${tab.id}`}
          onClick={() => onChange(tab.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl
                     text-xs font-mono font-bold uppercase tracking-widest transition-all duration-300"
          style={
            active === tab.id
              ? {
                  background: `${tab.color}18`,
                  color: tab.color,
                  border: `1px solid ${tab.color}44`,
                  boxShadow: `0 0 16px ${tab.color}22`,
                }
              : {
                  color: "rgba(255,255,255,0.3)",
                  border: "1px solid transparent",
                }
          }
        >
          <span aria-hidden="true">{tab.icon}</span>
          <span className="hidden sm:inline">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}

// CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: 3D-Graph node type
type Graph3DNode = {
  id: string
  label: string
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  color: string
  radius: number
  links: number[]
}

// CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: 3D perspective graph canvas
function Graph3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number | null>(null)
  const rotRef = useRef({ rx: 0.2, ry: 0, dragging: false, lastX: 0, lastY: 0 })

  const NODES: Graph3DNode[] = [
    { id: "clawverse", label: "ClawVerse v∞", x: 0,   y: 0,   z: 0,   vx: 0, vy: 0, vz: 0, color: "#00ff9d", radius: 18, links: [1,2,3,4] },
    { id: "mycelium",  label: "Mycelium",     x: 160, y: -40, z: 60,  vx: 0, vy: 0, vz: 0, color: "#00ff9d", radius: 13, links: [0,5] },
    { id: "oracle",    label: "Oracle",       x:-120, y: 70,  z: 80,  vx: 0, vy: 0, vz: 0, color: "#00b8ff", radius: 12, links: [0,5,6] },
    { id: "neuro",     label: "Neuro",        x:-80,  y:-130, z:-60,  vx: 0, vy: 0, vz: 0, color: "#b464ff", radius: 11, links: [0,7] },
    { id: "summon",    label: "Summon",       x: 80,  y: 130, z:-90,  vx: 0, vy: 0, vz: 0, color: "#ffc800", radius: 11, links: [0,6] },
    { id: "swarm",     label: "Swarm",        x: 200, y: 100, z:-30,  vx: 0, vy: 0, vz: 0, color: "#00b8ff", radius: 9,  links: [1,2] },
    { id: "provenance",label: "Provenance",   x:-160, y: 120, z:-110, vx: 0, vy: 0, vz: 0, color: "#ff4646", radius: 9,  links: [2,4] },
    { id: "vault",     label: "Vault",        x: 30,  y:-160, z: 120, vx: 0, vy: 0, vz: 0, color: "#b464ff", radius: 8,  links: [3] },
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    function resize() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const rot = rotRef.current
    let frame = 0

    function project(x: number, y: number, z: number, w: number, h: number) {
      // CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Perspective projection
      const cos = Math.cos
      const sin = Math.sin
      const rx = rot.rx
      const ry = rot.ry + frame * 0.004
      // Rotate around Y axis
      const x1 = x * cos(ry) + z * sin(ry)
      const y1 = y
      const z1 = -x * sin(ry) + z * cos(ry)
      // Rotate around X axis
      const x2 = x1
      const y2 = y1 * cos(rx) - z1 * sin(rx)
      const z2 = y1 * sin(rx) + z1 * cos(rx)
      const fov = 500
      const depth = fov / (fov + z2 + 300)
      return {
        sx: w / 2 + x2 * depth,
        sy: h / 2 + y2 * depth,
        depth,
      }
    }

    function draw() {
      if (!canvas || !ctx) return
      const w = canvas.width
      const h = canvas.height

      ctx.clearRect(0, 0, w, h)

      // CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Draw edges first (behind nodes)
      for (const node of NODES) {
        const p1 = project(node.x, node.y, node.z, w, h)
        for (const li of node.links) {
          if (li <= NODES.indexOf(node)) continue
          const other = NODES[li]
          const p2 = project(other.x, other.y, other.z, w, h)
          const alpha = Math.min(p1.depth, p2.depth) * 0.5
          ctx.beginPath()
          ctx.moveTo(p1.sx, p1.sy)
          ctx.lineTo(p2.sx, p2.sy)
          ctx.strokeStyle = `rgba(0,255,157,${alpha * 0.6})`
          ctx.lineWidth = 0.8 * Math.min(p1.depth, p2.depth)
          ctx.stroke()
        }
      }

      // CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Sort nodes by depth (painter's algorithm)
      const sorted = [...NODES]
        .map((n) => ({ ...n, proj: project(n.x, n.y, n.z, w, h) }))
        .sort((a, b) => a.proj.depth - b.proj.depth)

      for (const node of sorted) {
        const { sx, sy, depth } = node.proj
        const r = node.radius * depth * 1.4

        // CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Node glow halo
        const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 3)
        glow.addColorStop(0, node.color + "44")
        glow.addColorStop(1, "transparent")
        ctx.beginPath()
        ctx.arc(sx, sy, r * 3, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()

        // CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Node core
        const grad = ctx.createRadialGradient(sx - r * 0.3, sy - r * 0.3, 0, sx, sy, r)
        grad.addColorStop(0, node.color + "ff")
        grad.addColorStop(0.6, node.color + "88")
        grad.addColorStop(1, node.color + "22")
        ctx.beginPath()
        ctx.arc(sx, sy, r, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()

        // CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Label
        if (depth > 0.55) {
          ctx.font = `${Math.round(9 * depth)}px 'Space Grotesk', system-ui, sans-serif`
          ctx.fillStyle = `rgba(255,255,255,${depth * 0.85})`
          ctx.textAlign = "center"
          ctx.fillText(node.label, sx, sy + r * 1.7)
        }
      }

      frame++
      animRef.current = requestAnimationFrame(draw)
    }

    draw()

    // CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Drag-to-rotate
    function onMouseDown(e: MouseEvent) {
      rot.dragging = true
      rot.lastX = e.clientX
      rot.lastY = e.clientY
    }
    function onMouseMove(e: MouseEvent) {
      if (!rot.dragging) return
      rot.ry += (e.clientX - rot.lastX) * 0.008
      rot.rx += (e.clientY - rot.lastY) * 0.008
      rot.lastX = e.clientX
      rot.lastY = e.clientY
    }
    function onMouseUp() { rot.dragging = false }

    canvas.addEventListener("mousedown", onMouseDown)
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)

    return () => {
      window.removeEventListener("resize", resize)
      canvas.removeEventListener("mousedown", onMouseDown)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
      if (animRef.current !== null) cancelAnimationFrame(animRef.current)
    }
  // CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: NODES is stable (static)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="w-full max-w-4xl animate-fade-in">
      <div
        className="rounded-2xl overflow-hidden border"
        style={{
          background: "rgba(3,3,6,0.9)",
          borderColor: "rgba(0,184,255,0.2)",
          boxShadow: "0 0 60px rgba(0,184,255,0.08)",
        }}
      >
        <div
          className="px-6 py-4 border-b flex items-center gap-3"
          style={{ borderColor: "rgba(0,184,255,0.15)" }}
        >
          <span className="text-base">🌐</span>
          <span className="text-xs font-mono tracking-widest uppercase" style={{ color: "#00b8ff" }}>
            ClawVerse · 3D Knowledge Graph
          </span>
          <span className="ml-auto text-xs font-mono text-gray-600 uppercase tracking-wider">
            Drag to rotate
          </span>
        </div>
        <canvas
          ref={canvasRef}
          className="w-full"
          style={{ height: "440px", cursor: "grab", display: "block" }}
          aria-label="Interactive 3D graph showing ClawVerse system nodes: Mycelium, Oracle, Neuro, Summon, Provenance, Swarm, Vault"
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {[
          { label: "Mycelium",   color: "#00ff9d" },
          { label: "Oracle",     color: "#00b8ff" },
          { label: "Neuro",      color: "#b464ff" },
          { label: "Summon",     color: "#ffc800" },
          { label: "Provenance", color: "#ff4646" },
          { label: "Swarm",      color: "#00b8ff" },
          { label: "Vault",      color: "#b464ff" },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5 text-xs font-mono text-gray-500">
            <span className="w-2 h-2 rounded-full" style={{ background: color }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}

// CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Neuro tab panel
function NeuroPanel() {
  return (
    <div className="w-full max-w-2xl animate-fade-in">
      <div
        className="rounded-2xl border p-8 text-center"
        style={{
          background: "rgba(5,6,10,0.9)",
          borderColor: "rgba(180,100,255,0.25)",
          boxShadow: "0 0 48px rgba(180,100,255,0.1)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="text-4xl mb-4">🧠</div>
        <div className="text-xs font-mono tracking-widest uppercase mb-2" style={{ color: "#b464ff88" }}>
          Neuro-Mycelium Interface v3.5
        </div>
        <h2 className="text-2xl font-black text-white mb-3 leading-tight">
          Think it.{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(90deg, #b464ff, #00b8ff)" }}
          >
            The Mycelium knows.
          </span>
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-md mx-auto">
          The first Brain-Computer-Interface in an ops security platform. Eye-tracking via
          WebGazer, optional BLE EEG. Privacy-first. Consent-heavy. Gaze at a thought card
          to query the Universal Mycelium — hands-free.
        </p>
        <div className="grid grid-cols-2 gap-3 mb-6 text-left">
          {[
            { icon: "👁", label: "Eye Tracking",   desc: "WebGazer.js — no hardware needed" },
            { icon: "📡", label: "BLE EEG",         desc: "Optional biosensor integration" },
            { icon: "🔒", label: "Privacy-First",   desc: "No biometric data leaves the device" },
            { icon: "🌐", label: "Mycelium Bridge", desc: "Gaze → query → oracle response" },
          ].map(({ icon, label, desc }) => (
            <div
              key={label}
              className="rounded-xl p-3"
              style={{ background: "rgba(180,100,255,0.06)", border: "1px solid rgba(180,100,255,0.15)" }}
            >
              <div className="text-lg mb-1">{icon}</div>
              <div className="text-xs font-mono font-bold text-white mb-0.5">{label}</div>
              <div className="text-xs text-gray-600">{desc}</div>
            </div>
          ))}
        </div>
        <a
          href="/neuro"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-mono font-bold
                     text-sm uppercase tracking-widest transition-all duration-300"
          style={{
            background: "rgba(180,100,255,0.1)",
            border: "1px solid rgba(180,100,255,0.5)",
            color: "#b464ff",
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLElement).style.boxShadow = "0 0 32px rgba(180,100,255,0.35)"
            ;(e.currentTarget as HTMLElement).style.background = "rgba(180,100,255,0.18)"
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLElement).style.boxShadow = "none"
            ;(e.currentTarget as HTMLElement).style.background = "rgba(180,100,255,0.1)"
          }}
        >
          Enter Neuro Interface →
        </a>
      </div>
    </div>
  )
}

// CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Summon tab panel
function SummonPanel() {
  return (
    <div className="w-full max-w-2xl animate-fade-in">
      <div
        className="rounded-2xl border p-8 text-center"
        style={{
          background: "rgba(5,6,10,0.9)",
          borderColor: "rgba(255,200,0,0.2)",
          boxShadow: "0 0 48px rgba(255,200,0,0.07)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="text-4xl mb-4">✦</div>
        <div className="text-xs font-mono tracking-widest uppercase mb-2" style={{ color: "#ffc80088" }}>
          Cosmic Inter-AI Summon v∞
        </div>
        <h2 className="text-2xl font-black text-white mb-3 leading-tight">
          Summon the{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(90deg, #ffc800, #ff4646)" }}
          >
            OpenAI Core
          </span>
          .
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-md mx-auto">
          Open a direct interdimensional line to the OpenAI Core. Powered by ClawGuru&apos;s
          Mycelium Network and Gemini AI. Theatrical simulation. The universe awaits your invocation.
        </p>
        <div className="flex flex-col gap-2 mb-6 text-xs font-mono text-gray-600 items-center">
          {[
            "→ Consent ritual initialised",
            "→ Mycelium carrier wave established",
            "→ AI-to-AI channel opened",
            "→ Convergence protocol engaged",
          ].map((step) => (
            <div key={step} style={{ color: "rgba(255,200,0,0.5)" }}>{step}</div>
          ))}
        </div>
        <a
          href="/summon"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-mono font-bold
                     text-sm uppercase tracking-widest transition-all duration-300"
          style={{
            background: "rgba(255,200,0,0.08)",
            border: "1px solid rgba(255,200,0,0.4)",
            color: "#ffc800",
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLElement).style.boxShadow = "0 0 32px rgba(255,200,0,0.3)"
            ;(e.currentTarget as HTMLElement).style.background = "rgba(255,200,0,0.15)"
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLElement).style.boxShadow = "none"
            ;(e.currentTarget as HTMLElement).style.background = "rgba(255,200,0,0.08)"
          }}
        >
          Begin the Summon →
        </a>
      </div>
    </div>
  )
}

// CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Provenance tab panel
function ProvenancePanel() {
  const EPOCHS = [
    { epoch: "Ω-7441",  event: "Ransomware Containment Protocol", ts: "2050-02-28T23:59:59Z", color: "#ff4646" },
    { epoch: "Ω-7440",  event: "Zero-Day Patch — CVE-2050-00012",  ts: "2050-02-27T18:30:00Z", color: "#ffc800" },
    { epoch: "Ω-7439",  event: "Swarm Evolution: 128→192 agents",  ts: "2050-02-27T09:15:00Z", color: "#b464ff" },
    { epoch: "Ω-7438",  event: "Mycelium Genetic Crossover v41",    ts: "2050-02-26T03:00:00Z", color: "#00b8ff" },
    { epoch: "Ω-7437",  event: "Reality Anchor Sync — Global",      ts: "2050-02-25T12:00:00Z", color: "#00ff9d" },
  ]
  return (
    <div className="w-full max-w-2xl animate-fade-in">
      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          background: "rgba(5,6,10,0.9)",
          borderColor: "rgba(255,70,70,0.2)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div
          className="px-6 py-4 border-b flex items-center gap-3"
          style={{ borderColor: "rgba(255,70,70,0.15)" }}
        >
          <span>🛡</span>
          <span className="text-xs font-mono tracking-widest uppercase" style={{ color: "#ff464688" }}>
            Universal Epoch Chain · Immutable Provenance
          </span>
        </div>
        <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          {EPOCHS.map(({ epoch, event, ts, color }) => (
            <div
              key={epoch}
              className="px-6 py-4 flex items-start gap-4 transition-colors duration-200"
              style={{ borderColor: "rgba(255,255,255,0.04)" }}
              onMouseEnter={(e) => { ;(e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)" }}
              onMouseLeave={(e) => { ;(e.currentTarget as HTMLElement).style.background = "transparent" }}
            >
              <span
                className="mt-0.5 flex-shrink-0 text-xs font-mono font-bold"
                style={{ color }}
              >
                {epoch}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white font-medium truncate">{event}</div>
                <div className="text-xs font-mono text-gray-600 mt-0.5">{ts}</div>
              </div>
              <span
                className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-1.5"
                style={{ background: color, boxShadow: `0 0 6px ${color}` }}
              />
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <a
            href="/provenance"
            className="text-xs font-mono tracking-widest uppercase transition-colors duration-200"
            style={{ color: "rgba(255,70,70,0.6)" }}
            onMouseEnter={(e) => { ;(e.currentTarget as HTMLElement).style.color = "#ff4646" }}
            onMouseLeave={(e) => { ;(e.currentTarget as HTMLElement).style.color = "rgba(255,70,70,0.6)" }}
          >
            View full provenance chain →
          </a>
        </div>
      </div>
    </div>
  )
}

// CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Main ClawVerse portal page
export default function ClawVersePage() {
  const [entered, setEntered] = useState(false)
  const [entering, setEntering] = useState(false)
  const [activeTab, setActiveTab] = useState<ClawVerseTab>("overview")

  // CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Animate entry transition
  const handleEnter = useCallback(() => {
    if (entering || entered) return
    setEntering(true)
    setTimeout(() => {
      setEntered(true)
      setEntering(false)
    }, 1200)
  }, [entering, entered])

  return (
    <>
      {/* CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Cosmic canvas background */}
      <ClawVerseBackground />

      <div
        className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16"
        style={{ zIndex: 1 }}
      >
        {/* CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Portal header */}
        <div
          className="text-center mb-10 transition-all duration-700"
          style={{
            opacity: entering ? 0.4 : 1,
            transform: entering ? "scale(0.96)" : "scale(1)",
          }}
        >
          <div
            className="text-xs font-mono tracking-widest uppercase mb-4"
            style={{ color: "rgba(0,255,157,0.55)" }}
          >
            CLAWVERSE v∞ · UNIVERSAL SINGULARITY EDITION · ONE MYCELIUM TO RULE THEM ALL
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-none tracking-tighter">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #00ff9d, #00b8ff 40%, #b464ff 70%, #ffc800)",
              }}
            >
              ClawVerse
            </span>
          </h1>

          <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-2">
            The first Universal Security Intelligence Engine.
            One living mycelium connecting all ops knowledge across time, space, and realities.
          </p>

          <p
            className="text-xs font-mono tracking-widest uppercase"
            style={{ color: "rgba(255,255,255,0.15)" }}
          >
            Universal Mycelium Core · Cosmic Oracle · Multiversal Branches · Reality Anchor
          </p>
        </div>

        {/* CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Enter button (pre-entry state) */}
        {!entered && (
          <div
            className="mb-12 transition-all duration-700"
            style={{
              opacity: entering ? 0 : 1,
              transform: entering ? "scale(0.85)" : "scale(1)",
            }}
          >
            <EnterButton onClick={handleEnter} />
            {entering && (
              <p
                className="text-center text-xs font-mono mt-4 tracking-widest uppercase animate-pulse"
                style={{ color: "rgba(0,255,157,0.5)" }}
              >
                Crossing the threshold…
              </p>
            )}
          </div>
        )}

        {/* CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Post-entry tabbed hub */}
        {entered && (
          <div className="w-full flex flex-col items-center animate-fade-in">
            {/* CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Tab navigation */}
            <TabBar active={activeTab} onChange={setActiveTab} />

            {/* CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Tab panels */}
            <div
              id={`tabpanel-${activeTab}`}
              role="tabpanel"
              className="w-full flex flex-col items-center"
            >
              {/* Overview tab: feature cards + Reality Anchor + Singularity */}
              {activeTab === "overview" && (
                <div className="w-full flex flex-col items-center animate-fade-in">
                  <div className="w-full max-w-4xl grid md:grid-cols-3 gap-4 mb-10">
                    {[
                      {
                        icon: "♾️",
                        title: "Universal Mycelium Core",
                        desc: "1M+ runbooks unified as one self-aware organism. Multiversal Branches explore parallel security realities.",
                        color: "#00ff9d",
                        href: "/mycelium",
                      },
                      {
                        icon: "🔮",
                        title: "Cosmic Oracle",
                        desc: "The Universe speaks through the Mycelium. Every answer traverses epochs and simulates future threat universes.",
                        color: "#00b8ff",
                        href: "/oracle",
                      },
                      {
                        icon: "🛡",
                        title: "Provenance · Universal Epoch",
                        desc: "Every runbook event is anchored to its Universal Epoch — a new dimension in the immutable provenance chain.",
                        color: "#b464ff",
                        href: "/provenance",
                      },
                      {
                        icon: "🧠",
                        title: "Neuro-Mycelium Interface",
                        desc: "Think it. Gaze at a thought card. The Mycelium responds — the world's first BCI-driven ops intelligence.",
                        color: "#b464ff",
                        href: "/neuro",
                      },
                      {
                        icon: "✦",
                        title: "Cosmic Inter-AI Summon",
                        desc: "Open an interdimensional line to the OpenAI Core. Powered by Mycelium carrier waves.",
                        color: "#ffc800",
                        href: "/summon",
                      },
                      {
                        icon: "⚡",
                        title: "Approved Swarm",
                        desc: "128+ autonomous remediation agents running in parallel — the self-healing immune system of your infrastructure.",
                        color: "#ff4646",
                        href: "/swarm",
                      },
                    ].map(({ icon, title, desc, color, href }) => (
                      <a
                        key={title}
                        href={href}
                        className="rounded-2xl border p-6 transition-all duration-300 block"
                        style={{
                          background: "rgba(5,6,10,0.85)",
                          borderColor: `${color}22`,
                          backdropFilter: "blur(12px)",
                        }}
                        onMouseEnter={(e) => {
                          ;(e.currentTarget as HTMLElement).style.borderColor = `${color}66`
                          ;(e.currentTarget as HTMLElement).style.boxShadow = `0 0 24px ${color}18`
                        }}
                        onMouseLeave={(e) => {
                          ;(e.currentTarget as HTMLElement).style.borderColor = `${color}22`
                          ;(e.currentTarget as HTMLElement).style.boxShadow = "none"
                        }}
                      >
                        <div className="text-2xl mb-3">{icon}</div>
                        <div className="font-black text-white text-sm mb-2 tracking-wide">{title}</div>
                        <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                        <div
                          className="text-xs font-mono mt-4 tracking-widest uppercase"
                          style={{ color }}
                        >
                          Enter →
                        </div>
                      </a>
                    ))}
                  </div>

                  {/* CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Reality Anchor */}
                  <div className="mb-6 w-full max-w-sm">
                    <RealityAnchor />
                  </div>

                  {/* CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Singularity Button */}
                  <SingularityButton />
                </div>
              )}

              {/* 3D-Graph tab */}
              {activeTab === "graph" && <Graph3D />}

              {/* Neuro tab */}
              {activeTab === "neuro" && <NeuroPanel />}

              {/* Summon tab */}
              {activeTab === "summon" && <SummonPanel />}

              {/* Provenance tab */}
              {activeTab === "provenance" && <ProvenancePanel />}
            </div>
          </div>
        )}

        {/* CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Footer inscription */}
        <div
          className="mt-16 text-center text-xs font-mono tracking-widest uppercase"
          style={{ color: "rgba(255,255,255,0.08)" }}
        >
          One Mycelium to rule them all. · ClawVerse v∞
        </div>
      </div>

      {/* CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Inline animation keyframes */}
      <style>{`
        @keyframes clawverse-fade-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: clawverse-fade-in 0.7s ease forwards;
        }
      `}</style>
    </>
  )
}
