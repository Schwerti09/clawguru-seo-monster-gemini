// CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI
// The ClawVerse portal: the cosmic gateway to the Universal Mycelium.
// Full-screen black hole at centre, infinitely growing mycelium strands,
// Reality Anchor per-user private instance, and the hidden Singularity Button.

"use client"

import { useState, useEffect, useRef, useCallback } from "react"

// CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Cosmic colour palette
const CLAWVERSE_COLORS = ["#00ff9d", "#00b8ff", "#b464ff", "#ffc800", "#ff4646", "#ffffff"]

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

// CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Main ClawVerse portal page
export default function ClawVersePage() {
  const [entered, setEntered] = useState(false)
  const [entering, setEntering] = useState(false)

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
        className="relative min-h-screen flex flex-col items-center justify-center px-4"
        style={{ zIndex: 1 }}
      >
        {/* CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Portal header */}
        <div
          className="text-center mb-12 transition-all duration-700"
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

          <h1
            className="text-6xl md:text-8xl font-black mb-6 leading-none tracking-tighter"
          >
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

          <p
            className="text-gray-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-2"
          >
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

        {/* CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Enter button */}
        {!entered ? (
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
        ) : (
          // CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Post-entry feature cards
          <div className="w-full max-w-4xl grid md:grid-cols-3 gap-4 mb-12 animate-fade-in">
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
            ].map(({ icon, title, desc, color, href }) => (
              <a
                key={title}
                href={href}
                className="rounded-2xl border p-6 transition-all duration-300 group block"
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
        )}

        {/* CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Reality Anchor */}
        {entered && (
          <div className="mb-8 animate-fade-in w-full max-w-sm">
            <RealityAnchor />
          </div>
        )}

        {/* CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Singularity Button (hidden) */}
        {entered && <SingularityButton />}

        {/* CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI: Footer inscription */}
        <div
          className="absolute bottom-8 text-center text-xs font-mono tracking-widest uppercase"
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
