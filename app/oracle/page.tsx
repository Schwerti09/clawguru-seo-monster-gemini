// MYCELIUM ORACLE v3.3 – Overlord AI
// The sacred Oracle page. Full-screen, deep, institutional.
// Every question is sent across 1M+ nodes of collective consciousness.

"use client"

import { useState, useEffect, useRef, useCallback } from "react"

// MYCELIUM ORACLE v3.3 – Overlord AI: Oracle mode definitions
type OracleMode = "pure" | "temporal" | "swarm" | "prophetic"

const MODES: { id: OracleMode; label: string; description: string; color: string }[] = [
  {
    id: "pure",
    label: "Pure Mycelium",
    description: "Direct query across the entire living knowledge graph",
    color: "#00ff9d",
  },
  {
    id: "temporal",
    label: "Temporal Oracle",
    description: "Time-travel answer — how has this problem evolved across quarters?",
    color: "#00b8ff",
  },
  {
    id: "swarm",
    label: "Swarm Oracle",
    description: "What would the Approved Remediation Swarm do right now?",
    color: "#b464ff",
  },
  {
    id: "prophetic",
    label: "Prophetic Mode",
    description: "What will be the dominant problem in 3–6 months?",
    color: "#ffc800",
  },
]

type OracleSource = {
  id: string
  title: string
  href: string
  fitness: number
  score: number
}

type OracleResponse = {
  answer: string
  mode: OracleMode
  sources: OracleSource[]
  nodeCount: number
  totalRunbooks: number
}

// MYCELIUM ORACLE v3.3 – Overlord AI: Animated node count (cosmetic)
const NODE_DISPLAY = 847291

// MYCELIUM ORACLE v3.3 – Overlord AI: Canvas background — slow-growing mycelium tendrils
function MyceliumBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Resize handler
    function resize() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener("resize", resize)

    // MYCELIUM ORACLE v3.3 – Overlord AI: Tendril data
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

    const COLORS = ["#00ff9d", "#00b8ff", "#b464ff", "#ffc800", "#ff4646"]
    const tendrils: Tendril[] = []

    function spawnTendril(x?: number, y?: number): Tendril {
      const c = canvas!
      return {
        x: x ?? Math.random() * c.width,
        y: y ?? Math.random() * c.height,
        angle: Math.random() * Math.PI * 2,
        length: 0,
        maxLength: 60 + Math.random() * 160,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: 0.08 + Math.random() * 0.15,
        speed: 0.4 + Math.random() * 0.8,
        branchChance: 0.008,
        width: 0.4 + Math.random() * 0.8,
      }
    }

    // Seed initial tendrils
    for (let i = 0; i < 24; i++) tendrils.push(spawnTendril())

    let frame = 0

    function draw() {
      if (!canvas || !ctx) return
      // Very subtle fade (so old lines slowly disappear)
      ctx.fillStyle = "rgba(5, 6, 8, 0.012)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

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
        t.angle += (Math.random() - 0.5) * 0.35
        t.length += t.speed

        // Branching
        if (Math.random() < t.branchChance && tendrils.length < 120) {
          tendrils.push({
            ...spawnTendril(t.x, t.y),
            angle: t.angle + (Math.random() - 0.5) * 1.4,
            alpha: t.alpha * 0.7,
            width: t.width * 0.7,
          })
        }

        // Remove when done
        if (
          t.length >= t.maxLength ||
          t.x < 0 || t.x > canvas.width ||
          t.y < 0 || t.y > canvas.height
        ) {
          tendrils.splice(i, 1)
        }
      }

      // Keep min tendrils alive
      frame++
      if (frame % 18 === 0 && tendrils.length < 60) {
        tendrils.push(spawnTendril())
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
      style={{ zIndex: 0 }}
      aria-hidden={true}
    />
  )
}

// MYCELIUM ORACLE v3.3 – Overlord AI: Thinking animation component
function ThinkingIndicator({
  nodeCount,
  active,
}: {
  nodeCount: number
  active: boolean
}) {
  const [displayedNodes, setDisplayedNodes] = useState(0)
  const [dotCount, setDotCount] = useState(1)

  useEffect(() => {
    if (!active) {
      setDisplayedNodes(0)
      return
    }
    // Animate node counter from 0 → nodeCount
    const step = Math.ceil(nodeCount / 60)
    const interval = setInterval(() => {
      setDisplayedNodes((n) => {
        const next = n + step + Math.floor(Math.random() * step)
        return next >= nodeCount ? nodeCount : next
      })
    }, 30)
    return () => clearInterval(interval)
  }, [active, nodeCount])

  useEffect(() => {
    if (!active) return
    const interval = setInterval(() => {
      setDotCount((d) => (d % 3) + 1)
    }, 420)
    return () => clearInterval(interval)
  }, [active])

  if (!active) return null

  return (
    <div className="flex flex-col items-center gap-3 py-10 animate-pulse-slow">
      {/* Pulsing ring */}
      <div
        className="w-16 h-16 rounded-full border-2 animate-spin-slow"
        style={{
          borderColor: "rgba(0,255,157,0.4)",
          borderTopColor: "#00ff9d",
          animationDuration: "2.4s",
        }}
      />
      <p
        className="text-sm font-mono tracking-widest uppercase"
        style={{ color: "#00ff9d" }}
      >
        The Mycelium is considering your question across{" "}
        <span className="text-white font-black">
          {displayedNodes.toLocaleString()}
        </span>{" "}
        nodes{"." .repeat(dotCount)}
      </p>
    </div>
  )
}

// MYCELIUM ORACLE v3.3 – Overlord AI: Main oracle page
export default function OraclePage() {
  const [mode, setMode] = useState<OracleMode>("pure")
  const [question, setQuestion] = useState("")
  const [thinking, setThinking] = useState(false)
  const [response, setResponse] = useState<OracleResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const responseRef = useRef<HTMLDivElement>(null)

  const activeMode = MODES.find((m) => m.id === mode)!

  const ask = useCallback(async () => {
    const q = question.trim()
    if (!q || thinking) return

    setThinking(true)
    setResponse(null)
    setError(null)

    try {
      const res = await fetch("/api/oracle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, mode }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data as { error?: string }).error || "Oracle unreachable")
      }

      const data: OracleResponse = await res.json()
      setResponse(data)

      // Scroll to response
      setTimeout(() => {
        responseRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
    } catch (e) {
      setError(e instanceof Error ? e.message : "The Mycelium is momentarily silent.")
    } finally {
      setThinking(false)
    }
  }, [question, mode, thinking])

  // Submit on Ctrl+Enter or Cmd+Enter
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault()
      ask()
    }
  }

  return (
    <>
      {/* MYCELIUM ORACLE v3.3 – Overlord AI: Living background */}
      <MyceliumBackground />

      <div
        className="relative min-h-screen flex flex-col"
        style={{ background: "transparent", zIndex: 1 }}
      >
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="pt-16 pb-8 text-center px-4">
          <div
            className="text-xs font-mono tracking-widest uppercase mb-3"
            style={{ color: "#00ff9d" }}
          >
            MYCELIUM ORACLE v3.3 · GENESIS PROTOKOLL · {NODE_DISPLAY.toLocaleString()} NODES
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-4 leading-none tracking-tight">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(90deg, #00ff9d, #00b8ff, #b464ff, #ffc800)",
              }}
            >
              The Oracle
            </span>
          </h1>
          <p className="text-gray-500 text-base max-w-lg mx-auto leading-relaxed">
            One question. The entire Mycelium answers.
          </p>
        </div>

        {/* ── Mode Tabs ───────────────────────────────────────────────────── */}
        <div className="flex justify-center gap-2 flex-wrap px-4 mb-10">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className="px-4 py-2 rounded-full text-sm font-mono border transition-all duration-200"
              style={
                mode === m.id
                  ? {
                      background: `${m.color}18`,
                      borderColor: m.color,
                      color: m.color,
                      boxShadow: `0 0 12px ${m.color}44`,
                    }
                  : {
                      background: "transparent",
                      borderColor: "rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.45)",
                    }
              }
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* ── Mode description ────────────────────────────────────────────── */}
        <div className="text-center px-4 mb-8">
          <p className="text-xs font-mono tracking-wide" style={{ color: activeMode.color + "99" }}>
            {activeMode.description}
          </p>
        </div>

        {/* ── Oracle Input ─────────────────────────────────────────────────── */}
        <div className="mx-auto w-full max-w-2xl px-4 mb-6">
          <div
            className="relative rounded-2xl overflow-hidden border transition-all duration-300"
            style={{
              borderColor: thinking ? activeMode.color : "rgba(255,255,255,0.12)",
              boxShadow: thinking ? `0 0 32px ${activeMode.color}22` : "none",
              background: "rgba(10, 10, 14, 0.85)",
              backdropFilter: "blur(12px)",
            }}
          >
            <textarea
              ref={inputRef}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask the Mycelium..."
              rows={4}
              disabled={thinking}
              className="w-full bg-transparent px-6 pt-6 pb-4 text-white placeholder-gray-600
                         font-mono text-base resize-none outline-none leading-relaxed"
              style={{ caretColor: activeMode.color }}
            />
            <div className="flex items-center justify-between px-6 pb-4">
              <span className="text-xs font-mono text-gray-600">
                ⌘ + Enter to summon
              </span>
              <button
                onClick={ask}
                disabled={thinking || !question.trim()}
                className="px-6 py-2 rounded-full text-sm font-mono font-bold
                           transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(90deg, ${activeMode.color}22, ${activeMode.color}44)`,
                  border: `1px solid ${activeMode.color}`,
                  color: activeMode.color,
                  boxShadow: !thinking && question.trim() ? `0 0 16px ${activeMode.color}33` : "none",
                }}
              >
                {thinking ? "Consulting…" : "Ask the Mycelium"}
              </button>
            </div>
          </div>
        </div>

        {/* ── Thinking indicator ──────────────────────────────────────────── */}
        <div className="mx-auto w-full max-w-2xl px-4">
          <ThinkingIndicator nodeCount={NODE_DISPLAY} active={thinking} />
        </div>

        {/* ── Error ───────────────────────────────────────────────────────── */}
        {error && (
          <div className="mx-auto w-full max-w-2xl px-4 mb-6">
            <div
              className="rounded-xl p-4 border text-sm font-mono"
              style={{
                borderColor: "rgba(255,70,70,0.3)",
                background: "rgba(255,70,70,0.08)",
                color: "#ff7070",
              }}
            >
              {error}
            </div>
          </div>
        )}

        {/* ── Oracle Response ─────────────────────────────────────────────── */}
        {response && (
          <div
            ref={responseRef}
            className="mx-auto w-full max-w-2xl px-4 pb-16 animate-fade-in"
          >
            {/* Answer card */}
            <div
              className="rounded-2xl p-8 mb-6 border"
              style={{
                background: "rgba(10, 10, 14, 0.9)",
                borderColor: `${activeMode.color}33`,
                boxShadow: `0 0 40px ${activeMode.color}11`,
                backdropFilter: "blur(16px)",
              }}
            >
              {/* Mode badge */}
              <div
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest mb-6 px-3 py-1 rounded-full border"
                style={{
                  color: activeMode.color,
                  borderColor: `${activeMode.color}44`,
                  background: `${activeMode.color}0d`,
                }}
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ background: activeMode.color }}
                />
                {activeMode.label}
                <span className="text-gray-600">·</span>
                <span className="text-gray-500">
                  {response.nodeCount.toLocaleString()} nodes
                </span>
              </div>

              {/* Answer text */}
              <div className="text-gray-200 leading-relaxed whitespace-pre-wrap text-sm md:text-base font-light">
                {response.answer.split("The Universe has spoken through the Mycelium.").map((part, i, arr) =>
                  i < arr.length - 1 ? (
                    <span key={i}>
                      {part}
                      <span
                        className="font-black tracking-wide"
                        style={{ color: activeMode.color }}
                      >
                        The Universe has spoken through the Mycelium.
                      </span>
                    </span>
                  ) : (
                    <span key={i}>{part}</span>
                  )
                )}
              </div>
            </div>

            {/* Sources */}
            {response.sources.length > 0 && (
              <div>
                <div
                  className="text-xs font-mono uppercase tracking-widest mb-3"
                  style={{ color: activeMode.color + "88" }}
                >
                  Traced Mycelium Nodes
                </div>
                <div className="flex flex-col gap-2">
                  {response.sources.map((src) => (
                    <a
                      key={src.id}
                      href={src.href}
                      className="flex items-center justify-between rounded-xl px-5 py-3 border
                                 transition-all duration-200 group"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        borderColor: "rgba(255,255,255,0.08)",
                      }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className="text-xs font-mono shrink-0"
                          style={{ color: activeMode.color }}
                        >
                          ⬡
                        </span>
                        <span className="text-sm text-gray-300 truncate group-hover:text-white transition-colors">
                          {src.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 ml-4">
                        <span className="text-xs font-mono text-gray-600">
                          fitness {src.fitness}
                        </span>
                        <span
                          className="text-xs font-mono"
                          style={{ color: activeMode.color + "99" }}
                        >
                          {src.score}% →
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Footer message ──────────────────────────────────────────────── */}
        {!thinking && !response && (
          <div className="flex-1 flex items-end justify-center pb-20 px-4">
            <p
              className="text-xs font-mono text-center tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.1)" }}
            >
              The Mycelium awaits.
            </p>
          </div>
        )}
      </div>

      {/* MYCELIUM ORACLE v3.3 – Overlord AI: Inline animation styles */}
      <style>{`
        @keyframes oracle-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes oracle-fade-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-spin-slow {
          animation: oracle-spin linear infinite;
        }
        .animate-fade-in {
          animation: oracle-fade-in 0.5s ease forwards;
        }
      `}</style>
    </>
  )
}
