"use client"
// MYCELIAL SINGULARITY v3.0 – Full-page interactive mycelium visualization
// Canvas-based force-directed graph with genetic evolution sidebar and oracle mode.

import { useEffect, useRef, useState, useCallback } from "react"
import type {
  MyceliumGraph,
  MycelNode,
  MycelEdge,
  EvolutionEvent,
  OracleResult,
  RunbookSummary,
} from "@/lib/mycelium"
import {
  generateEvolutionEvents,
  generateSingleEvent,
  oracleSearch,
  geneticCrossover,
} from "@/lib/mycelium"

// MYCELIAL SINGULARITY v3.0 – Edge glow colors mapped to semantic relationship kind
const EDGE_COLORS: Record<string, string> = {
  "prevents":    "rgba(0, 255, 157, 0.45)",
  "causes":      "rgba(255, 70, 70, 0.45)",
  "depends-on":  "rgba(0, 184, 255, 0.40)",
  "evolves-from":"rgba(180, 100, 255, 0.45)",
  "mutates-into":"rgba(255, 200, 0, 0.45)",
}

const EDGE_LABEL_COLORS: Record<string, string> = {
  "prevents":    "#00ff9d",
  "causes":      "#ff4646",
  "depends-on":  "#00b8ff",
  "evolves-from":"#b464ff",
  "mutates-into":"#ffc800",
}

// MYCELIAL SINGULARITY v3.0 – Node color derived from fitness tier
function fitnessColor(fitness: number, alpha = 1): string {
  if (fitness >= 92) return `rgba(0, 255, 157, ${alpha})`    // elite: neon green
  if (fitness >= 80) return `rgba(0, 184, 255, ${alpha})`    // strong: cyber blue
  if (fitness >= 65) return `rgba(180, 100, 255, ${alpha})`  // mid: violet
  return `rgba(120, 120, 140, ${alpha})`                      // weak: gray
}

// ── Internal simulation state (lives in a ref, never in React state) ──────────
interface SimState {
  nodes: (MycelNode & { vx: number; vy: number })[]
  edges: MycelEdge[]
  zoom: number
  panX: number
  panY: number
  isPanning: boolean
  lastMouse: { x: number; y: number }
  hoverNode: MycelNode | null
  tick: number
  edgesVisible: number  // grows 0→edges.length over first ~200 ticks (growth animation)
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  graph: MyceliumGraph
  summaries: Record<string, RunbookSummary>
  totalRunbooks: number
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function MyceliumView({ graph, summaries, totalRunbooks }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const simRef = useRef<SimState>({
    nodes: [],
    edges: [],
    zoom: 0.9,
    panX: 0,
    panY: 0,
    isPanning: false,
    lastMouse: { x: 0, y: 0 },
    hoverNode: null,
    tick: 0,
    edgesVisible: 0,
  })
  const dimsRef = useRef({ w: 900, h: 600 })
  const highlightRef = useRef<string[]>([])
  const selectedRef = useRef<MycelNode | null>(null)

  const [selectedNode, setSelectedNode] = useState<MycelNode | null>(null)
  const [events, setEvents] = useState<EvolutionEvent[]>([])
  const [oracle, setOracle] = useState("")
  const [oracleResults, setOracleResults] = useState<OracleResult[]>([])
  const [oracleLoading, setOracleLoading] = useState(false)
  const [sidebarTab, setSidebarTab] = useState<"log" | "oracle">("log")
  const [evolvedCount, setEvolvedCount] = useState(0)
  const eventSeedRef = useRef(100)

  // MYCELIAL SINGULARITY v3.0 – Sync selected node to ref (used inside canvas loop)
  useEffect(() => {
    selectedRef.current = selectedNode
  }, [selectedNode])

  // MYCELIAL SINGULARITY v3.0 – Initialize simulation from graph prop
  useEffect(() => {
    const s = simRef.current
    s.nodes = graph.nodes.map((n) => ({ ...n, vx: 0, vy: 0 }))
    s.edges = graph.edges
    s.tick = 0
    s.edgesVisible = 0
    s.hoverNode = null
    setEvolvedCount(graph.nodes.filter((n) => n.evolved).length)
    setEvents(generateEvolutionEvents(graph, 10))
  }, [graph])

  // MYCELIAL SINGULARITY v3.0 – Live evolution event ticker (new event every 5s)
  useEffect(() => {
    const id = setInterval(() => {
      const seed = ++eventSeedRef.current
      const evt = generateSingleEvent(graph, seed)
      setEvents((prev) => [evt, ...prev].slice(0, 24))

      // MYCELIAL SINGULARITY v3.0 – Periodically perform genetic crossover
      // and inject evolved child node into simulation
      if (seed % 4 === 0 && simRef.current.nodes.length > 10) {
        const s = simRef.current
        const i1 = seed % s.nodes.length
        const i2 = (seed * 37) % s.nodes.length
        if (i1 !== i2) {
          const child = geneticCrossover(s.nodes[i1], s.nodes[i2], graph.generation + 1)
          // MYCELIAL SINGULARITY v3.0 – Inject child into live simulation
          s.nodes.push({ ...child, vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2 })
          s.edges.push({
            source: child.id,
            target: s.nodes[i1].id,
            kind: "evolves-from",
            weight: 0.7,
          })
          setEvolvedCount((c) => c + 1)
        }
      }
    }, 5000)
    return () => clearInterval(id)
  }, [graph])

  // MYCELIAL SINGULARITY v3.0 – Canvas resize observer
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const parent = canvas.parentElement!
    const obs = new ResizeObserver(() => {
      const w = parent.offsetWidth
      const h = parent.offsetHeight
      canvas.width = w
      canvas.height = h
      dimsRef.current = { w, h }
    })
    obs.observe(parent)
    canvas.width = parent.offsetWidth
    canvas.height = parent.offsetHeight
    dimsRef.current = { w: parent.offsetWidth, h: parent.offsetHeight }
    return () => obs.disconnect()
  }, [])

  // MYCELIAL SINGULARITY v3.0 – Main animation loop (force simulation + render)
  useEffect(() => {
    function simulate() {
      const s = simRef.current
      const nodes = s.nodes
      const edges = s.edges
      // MYCELIAL SINGULARITY v3.0 – Cooling schedule: alpha decays then stabilizes
      const alpha = Math.max(0.008, 0.4 * Math.exp(-s.tick * 0.003))

      // MYCELIAL SINGULARITY v3.0 – Coulomb repulsion (O(n²), fine for ≤500 nodes)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x
          const dy = nodes[j].y - nodes[i].y
          const d2 = dx * dx + dy * dy + 4
          const d = Math.sqrt(d2)
          const repulse = (6400 / d2) * alpha
          const fx = (dx / d) * repulse
          const fy = (dy / d) * repulse
          nodes[i].vx -= fx
          nodes[i].vy -= fy
          nodes[j].vx += fx
          nodes[j].vy += fy
        }
      }

      // MYCELIAL SINGULARITY v3.0 – Hooke spring attraction along edges
      const nodeIndex = new Map(nodes.map((n, i) => [n.id, i]))
      for (const edge of edges) {
        const si = nodeIndex.get(edge.source)
        const ti = nodeIndex.get(edge.target)
        if (si == null || ti == null) continue
        const src = nodes[si]
        const tgt = nodes[ti]
        const dx = tgt.x - src.x
        const dy = tgt.y - src.y
        const d = Math.sqrt(dx * dx + dy * dy) + 0.01
        const ideal = 60 + (1 - edge.weight) * 80
        const spring = ((d - ideal) / d) * 0.25 * alpha
        src.vx += dx * spring
        src.vy += dy * spring
        tgt.vx -= dx * spring
        tgt.vy -= dy * spring
      }

      // MYCELIAL SINGULARITY v3.0 – Weak center-of-mass gravity (prevents drift)
      for (const n of nodes) {
        n.vx -= n.x * 0.015 * alpha
        n.vy -= n.y * 0.015 * alpha
      }

      // MYCELIAL SINGULARITY v3.0 – Velocity damping + position integration
      for (const n of nodes) {
        n.vx *= 0.82
        n.vy *= 0.82
        n.x += n.vx
        n.y += n.vy
      }

      // MYCELIAL SINGULARITY v3.0 – Edge growth animation (mycelium "grows" edges in)
      if (s.edgesVisible < edges.length) {
        s.edgesVisible = Math.min(edges.length, s.edgesVisible + Math.ceil(edges.length / 80))
      }

      s.tick++
    }

    function render(ctx: CanvasRenderingContext2D) {
      const s = simRef.current
      const { w, h } = dimsRef.current
      const nodes = s.nodes
      const edges = s.edges
      const cx = w / 2 + s.panX
      const cy = h / 2 + s.panY
      const z = s.zoom
      const t = s.tick
      const highlight = highlightRef.current
      const sel = selectedRef.current

      // MYCELIAL SINGULARITY v3.0 – Deep-space background
      ctx.fillStyle = "#050608"
      ctx.fillRect(0, 0, w, h)

      // MYCELIAL SINGULARITY v3.0 – Subtle animated grid
      ctx.save()
      const gridSize = 44 * z
      const offsetX = ((cx % gridSize) + gridSize) % gridSize
      const offsetY = ((cy % gridSize) + gridSize) % gridSize
      ctx.strokeStyle = "rgba(0,255,157,0.03)"
      ctx.lineWidth = 1
      for (let x = offsetX - gridSize; x < w + gridSize; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke()
      }
      for (let y = offsetY - gridSize; y < h + gridSize; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
      }
      ctx.restore()

      ctx.save()
      ctx.translate(cx, cy)
      ctx.scale(z, z)

      const visibleEdges = edges.slice(0, s.edgesVisible)

      // MYCELIAL SINGULARITY v3.0 – Render edges (skip if too zoomed-out)
      if (z > 0.2) {
        const nodePos = new Map(nodes.map((n) => [n.id, { x: n.x, y: n.y }]))
        for (const edge of visibleEdges) {
          const sp = nodePos.get(edge.source)
          const tp = nodePos.get(edge.target)
          if (!sp || !tp) continue

          const isOnPath =
            highlight.includes(edge.source) && highlight.includes(edge.target)

          ctx.beginPath()
          ctx.moveTo(sp.x, sp.y)
          ctx.lineTo(tp.x, tp.y)

          if (isOnPath) {
            // MYCELIAL SINGULARITY v3.0 – Pulsing oracle path
            const pulse = 0.6 + 0.4 * Math.sin(t * 0.08)
            ctx.strokeStyle = `rgba(255, 200, 0, ${pulse})`
            ctx.lineWidth = 2.5 / z
          } else {
            ctx.strokeStyle = EDGE_COLORS[edge.kind] ?? "rgba(100,100,120,0.3)"
            ctx.lineWidth = Math.max(0.5, (edge.weight * 1.5)) / z
          }
          ctx.stroke()
        }
      }

      // MYCELIAL SINGULARITY v3.0 – Render nodes
      for (const node of nodes) {
        const isHighlighted = highlight.includes(node.id)
        const isHovered = s.hoverNode?.id === node.id
        const isSelected = sel?.id === node.id
        const f = node.fitness

        // MYCELIAL SINGULARITY v3.0 – Node radius scales with fitness
        const baseR = 2.5 + (f / 100) * 6
        const nodeR = baseR / z

        // MYCELIAL SINGULARITY v3.0 – LOD: skip sub-pixel nodes unless highlighted
        if (nodeR * z < 0.8 && !isHighlighted && !isSelected) continue

        // MYCELIAL SINGULARITY v3.0 – Pulsing outer glow for elite nodes
        if (isHighlighted || isHovered || isSelected || f >= 80) {
          const pulse = 1 + 0.2 * Math.sin(t * 0.06 + node.x * 0.005)
          const glowR = nodeR * 4 * pulse
          const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowR)
          grad.addColorStop(0, fitnessColor(f, isHighlighted ? 0.5 : 0.25))
          grad.addColorStop(1, "transparent")
          ctx.beginPath()
          ctx.arc(node.x, node.y, glowR, 0, Math.PI * 2)
          ctx.fillStyle = grad
          ctx.fill()
        }

        // MYCELIAL SINGULARITY v3.0 – Node core
        ctx.beginPath()
        ctx.arc(node.x, node.y, nodeR, 0, Math.PI * 2)
        if (isSelected) {
          ctx.fillStyle = "#ffffff"
        } else if (isHighlighted) {
          ctx.fillStyle = "rgba(255, 200, 0, 1)"
        } else {
          ctx.fillStyle = fitnessColor(f)
        }
        ctx.fill()

        // MYCELIAL SINGULARITY v3.0 – "Evolved" golden badge dot
        if (node.evolved) {
          ctx.beginPath()
          ctx.arc(node.x + nodeR * 0.75, node.y - nodeR * 0.75, nodeR * 0.38, 0, Math.PI * 2)
          ctx.fillStyle = "#ffc800"
          ctx.fill()
        }

        // MYCELIAL SINGULARITY v3.0 – Label (only when sufficiently zoomed in)
        if (z >= 0.75 && (isHovered || isSelected || isHighlighted)) {
          const label = node.title.length > 34 ? node.title.slice(0, 34) + "…" : node.title
          const fontSize = Math.max(10, 11 / z)
          ctx.font = `${fontSize}px monospace`
          ctx.textAlign = "center"
          // Shadow for readability
          ctx.fillStyle = "rgba(0,0,0,0.8)"
          ctx.fillText(label, node.x + 0.5, node.y - nodeR - 3 / z + 0.5)
          ctx.fillStyle = isHighlighted ? "#ffc800" : "#ffffff"
          ctx.fillText(label, node.x, node.y - nodeR - 3 / z)
        }
      }

      ctx.restore()
    }

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!

    function loop() {
      simulate()
      render(ctx)
      animRef.current = requestAnimationFrame(loop)
    }
    animRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animRef.current)
  }, []) // MYCELIAL SINGULARITY v3.0 – Truly single run; all data accessed via refs

  // ── Mouse / Wheel interactions ──────────────────────────────────────────────

  const toSimCoords = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const s = simRef.current
    const { w, h } = dimsRef.current
    return {
      x: (clientX - rect.left - w / 2 - s.panX) / s.zoom,
      y: (clientY - rect.top - h / 2 - s.panY) / s.zoom,
    }
  }, [])

  const hitTest = useCallback((sx: number, sy: number): MycelNode | null => {
    const nodes = simRef.current.nodes
    const z = simRef.current.zoom
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i]
      const r = (2.5 + (n.fitness / 100) * 6) / z + 6 / z
      if ((n.x - sx) ** 2 + (n.y - sy) ** 2 <= r * r) return n
    }
    return null
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const s = simRef.current
      if (s.isPanning) {
        s.panX += e.clientX - s.lastMouse.x
        s.panY += e.clientY - s.lastMouse.y
        s.lastMouse = { x: e.clientX, y: e.clientY }
      } else {
        const { x, y } = toSimCoords(e.clientX, e.clientY)
        s.hoverNode = hitTest(x, y)
        if (canvasRef.current)
          canvasRef.current.style.cursor = s.hoverNode ? "pointer" : "grab"
      }
    },
    [toSimCoords, hitTest]
  )

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return
      const { x, y } = toSimCoords(e.clientX, e.clientY)
      if (!hitTest(x, y)) {
        simRef.current.isPanning = true
        simRef.current.lastMouse = { x: e.clientX, y: e.clientY }
      }
    },
    [toSimCoords, hitTest]
  )

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      const s = simRef.current
      if (!s.isPanning) {
        const { x, y } = toSimCoords(e.clientX, e.clientY)
        const node = hitTest(x, y)
        if (node) {
          setSelectedNode((prev) => (prev?.id === node.id ? null : node))
          selectedRef.current = node
        }
      }
      s.isPanning = false
    },
    [toSimCoords, hitTest]
  )

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const s = simRef.current
    const factor = e.deltaY < 0 ? 1.12 : 0.89
    s.zoom = Math.max(0.08, Math.min(8, s.zoom * factor))
  }, [])

  // ── Oracle handler ──────────────────────────────────────────────────────────

  function handleOracle(e: React.FormEvent) {
    e.preventDefault()
    if (!oracle.trim()) return
    setOracleLoading(true)
    setSidebarTab("oracle")
    // MYCELIAL SINGULARITY v3.0 – Client-side oracle search (no API key required)
    const results = oracleSearch(oracle, { ...graph, nodes: simRef.current.nodes }, summaries)
    setOracleResults(results)
    // MYCELIAL SINGULARITY v3.0 – Highlight the oracle path in the graph
    const pathNodes = results.flatMap((r) => r.path)
    highlightRef.current = [...new Set(pathNodes)]
    setOracleLoading(false)
  }

  // ── Event type styling ──────────────────────────────────────────────────────

  const eventStyle: Record<EvolutionEvent["type"], { color: string; icon: string }> = {
    mutation:  { color: "#00ff9d", icon: "⚡" },
    crossover: { color: "#00b8ff", icon: "✕" },
    selection: { color: "#ffc800", icon: "★" },
    death:     { color: "#b464ff", icon: "↻" },
    growth:    { color: "#ff6464", icon: "↗" },
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-120px)] min-h-[600px] gap-0">

      {/* ── Canvas graph area ─────────────────────────────────────────────── */}
      <div className="relative flex-1 min-h-[400px] lg:min-h-0 bg-[#050608] border border-white/8 rounded-xl overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          style={{ cursor: "grab" }}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => { simRef.current.isPanning = false }}
          onWheel={handleWheel}
        />

        {/* MYCELIAL SINGULARITY v3.0 – Top-left stats overlay */}
        <div className="absolute top-3 left-3 bg-black/70 border border-white/10 rounded-xl px-4 py-3 text-xs space-y-1 backdrop-blur-sm">
          <div className="font-black text-[#00ff9d] text-sm mb-1 tracking-wider">
            MYCELIAL SINGULARITY v3.0
          </div>
          <div className="text-gray-400">
            Total library: <span className="text-white font-mono">{totalRunbooks.toLocaleString()}+</span> runbooks
          </div>
          <div className="text-gray-400">
            Active nodes: <span className="text-white font-mono">{graph.nodes.length}</span>
          </div>
          <div className="text-gray-400">
            Edges: <span className="text-white font-mono">{graph.edges.length}</span>
          </div>
          <div className="text-gray-400">
            Evolved: <span className="text-[#ffc800] font-mono">{evolvedCount}</span>
          </div>
          <div className="text-gray-400">
            Generation: <span className="text-[#b464ff] font-mono">{graph.generation}</span>
          </div>
        </div>

        {/* MYCELIAL SINGULARITY v3.0 – Edge legend */}
        <div className="absolute top-3 right-3 bg-black/70 border border-white/10 rounded-xl px-3 py-3 text-xs backdrop-blur-sm space-y-1">
          {(Object.entries(EDGE_LABEL_COLORS) as [string, string][]).map(([kind, color]) => (
            <div key={kind} className="flex items-center gap-2">
              <div className="w-5 h-px" style={{ backgroundColor: color }} />
              <span className="text-gray-400">{kind}</span>
            </div>
          ))}
          <div className="border-t border-white/10 mt-1 pt-1 space-y-0.5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00ff9d]" />
              <span className="text-gray-400">elite (≥92)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00b8ff]" />
              <span className="text-gray-400">strong (80-91)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: "rgb(180,100,255)" }} />
              <span className="text-gray-400">mid (65-79)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#ffc800]" />
              <span className="text-gray-400">★ evolved</span>
            </div>
          </div>
        </div>

        {/* MYCELIAL SINGULARITY v3.0 – Selected node inspector */}
        {selectedNode && (
          <div className="absolute bottom-4 left-4 max-w-[280px] bg-black/85 border border-[#00ff9d]/30 rounded-xl p-4 backdrop-blur-sm text-sm shadow-neon-green">
            <div className="flex justify-between items-start mb-2">
              <span className="font-black text-[#00ff9d] text-xs tracking-wide uppercase">Node Inspector</span>
              <button
                onClick={() => {
                  setSelectedNode(null)
                  selectedRef.current = null
                  highlightRef.current = []
                }}
                className="text-gray-500 hover:text-white transition-colors text-xs"
              >
                ✕
              </button>
            </div>
            <div className="font-bold text-white mb-1 leading-tight">{selectedNode.title}</div>
            <div className="flex items-center gap-3 mb-2 text-xs">
              <span className="text-gray-400">Fitness:</span>
              <span
                className="font-mono font-black"
                style={{ color: fitnessColor(selectedNode.fitness) }}
              >
                {selectedNode.fitness.toFixed(1)}
              </span>
              <span className="text-gray-400">Score:</span>
              <span className="font-mono text-white">{selectedNode.clawScore}</span>
            </div>
            {selectedNode.evolved && (
              <div className="mb-2 text-[#ffc800] text-xs font-bold">★ EVOLVED — Generation {selectedNode.generation}</div>
            )}
            <div className="flex flex-wrap gap-1 mb-3">
              {selectedNode.tags.slice(0, 5).map((t) => (
                <span key={t} className="text-xs bg-white/5 px-1.5 py-0.5 rounded text-gray-300 font-mono">
                  {t}
                </span>
              ))}
            </div>
            {!selectedNode.evolved && (
              <a
                href={`/runbook/${selectedNode.id}`}
                className="text-[#00b8ff] hover:underline text-xs font-mono"
              >
                → Open Runbook ↗
              </a>
            )}
          </div>
        )}

        {/* MYCELIAL SINGULARITY v3.0 – Navigation hint */}
        <div className="absolute bottom-3 right-3 text-gray-600 text-xs pointer-events-none">
          scroll to zoom · drag to pan · click node to inspect
        </div>
      </div>

      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-80 flex flex-col bg-gray-950/80 border border-white/8 rounded-xl ml-0 lg:ml-3 overflow-hidden">

        {/* MYCELIAL SINGULARITY v3.0 – Sidebar header */}
        <div className="px-4 py-3 border-b border-white/10">
          <div className="text-xs font-black text-[#00ff9d] tracking-widest mb-0.5 uppercase">
            The Mycelium is thinking…
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setSidebarTab("log")}
              className={`text-xs px-3 py-1 rounded-lg transition-colors font-mono ${
                sidebarTab === "log"
                  ? "bg-[#00ff9d]/15 text-[#00ff9d] border border-[#00ff9d]/30"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Evolution Log
            </button>
            <button
              onClick={() => setSidebarTab("oracle")}
              className={`text-xs px-3 py-1 rounded-lg transition-colors font-mono ${
                sidebarTab === "oracle"
                  ? "bg-[#00b8ff]/15 text-[#00b8ff] border border-[#00b8ff]/30"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Ask the Singularity
            </button>
          </div>
        </div>

        {/* ── Oracle tab ──────────────────────────────────────────────────── */}
        {sidebarTab === "oracle" && (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10">
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                Describe your incident or problem. The Mycelium will trace the optimal path
                through the entire knowledge graph and surface the most evolved runbook.
              </p>
              <form onSubmit={handleOracle} className="flex gap-2">
                <input
                  type="text"
                  value={oracle}
                  onChange={(e) => setOracle(e.target.value)}
                  placeholder="e.g. nginx 502 after deploy"
                  className="flex-1 bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#00b8ff]/50 font-mono"
                />
                <button
                  type="submit"
                  disabled={oracleLoading || !oracle.trim()}
                  className="px-3 py-2 rounded-lg bg-[#00b8ff]/15 border border-[#00b8ff]/30 text-[#00b8ff] text-xs font-black hover:bg-[#00b8ff]/25 transition-colors disabled:opacity-40"
                >
                  {oracleLoading ? "…" : "⟶"}
                </button>
              </form>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {oracleResults.length === 0 && (
                <div className="text-xs text-gray-600 italic text-center mt-8">
                  The Mycelium awaits your query…
                </div>
              )}
              {oracleResults.map((r, i) => (
                <div
                  key={r.id}
                  className="rounded-xl border border-white/10 bg-black/30 p-3 cursor-pointer hover:border-[#00b8ff]/30 transition-colors"
                  onClick={() => {
                    highlightRef.current = r.path
                    const node = simRef.current.nodes.find((n) => n.id === r.id)
                    if (node) {
                      setSelectedNode(node)
                      selectedRef.current = node
                    }
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs font-black font-mono px-1.5 py-0.5 rounded"
                      style={{
                        color: i === 0 ? "#ffc800" : "#00b8ff",
                        background: i === 0 ? "rgba(255,200,0,0.1)" : "rgba(0,184,255,0.1)",
                        border: `1px solid ${i === 0 ? "rgba(255,200,0,0.3)" : "rgba(0,184,255,0.3)"}`,
                      }}
                    >
                      {i === 0 ? "ORACLE" : `#${i + 1}`}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                      score {(r.score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="text-sm text-white font-semibold leading-tight mb-1">
                    {r.title}
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="font-mono font-black"
                      style={{ color: fitnessColor(r.fitness) }}
                    >
                      fitness {r.fitness.toFixed(1)}
                    </span>
                    {!r.id.startsWith("evolved-") && (
                      <a
                        href={`/runbook/${r.id}`}
                        className="text-[#00b8ff] hover:underline font-mono"
                        onClick={(e) => e.stopPropagation()}
                      >
                        open ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
              {oracleResults.length > 0 && (
                <div className="text-xs text-[#00ff9d]/60 text-center italic mt-2">
                  The Mycelium has spoken.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Evolution log tab ───────────────────────────────────────────── */}
        {sidebarTab === "log" && (
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
            {events.map((evt) => {
              const style = eventStyle[evt.type]
              const ago = Math.floor((Date.now() - evt.timestamp) / 1000)
              const agoStr = ago < 60 ? `${ago}s` : `${Math.floor(ago / 60)}m`
              return (
                <div
                  key={evt.id}
                  className="rounded-lg bg-black/30 border border-white/8 px-3 py-2 text-xs"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="font-black text-xs px-1.5 py-0.5 rounded font-mono"
                      style={{
                        color: style.color,
                        background: `${style.color}18`,
                        border: `1px solid ${style.color}30`,
                      }}
                    >
                      {style.icon} {evt.type.toUpperCase()}
                    </span>
                    <span className="text-gray-600 ml-auto font-mono">{agoStr} ago</span>
                  </div>
                  <div className="text-gray-300 leading-relaxed font-mono text-[11px] break-words">
                    {evt.message}
                  </div>
                  {evt.fitness != null && (
                    <div
                      className="mt-1 font-mono text-[10px]"
                      style={{ color: fitnessColor(evt.fitness, 0.8) }}
                    >
                      fitness: {evt.fitness.toFixed(1)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* MYCELIAL SINGULARITY v3.0 – Sidebar footer status */}
        <div className="px-4 py-2 border-t border-white/10 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00ff9d] animate-pulse" />
          <span className="text-[10px] text-gray-500 font-mono">
            GENOME ACTIVE · {graph.edges.length} synapses · evolving
          </span>
        </div>
      </div>
    </div>
  )
}
