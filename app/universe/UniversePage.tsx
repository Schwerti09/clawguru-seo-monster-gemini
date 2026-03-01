// UNIVERSE 2050 – FINAL – Quantum Void Elegance – ClawGuru GENESIS PROTOKOLL
// ClawVerse Core: The central universe interface. Orbital navigation, living
// mycelium graph (React Three Fiber 3D), pulse stats, neuro indicator, inter-AI summon.

"use client"

import { useState, useEffect, useRef, useCallback, Suspense, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"

/* ── Quantum Void colour tokens ── */
const QV = {
  void: "#050505",
  gold: "#c9a84c",
  goldGlow: "rgba(201,168,76,0.25)",
  violet: "#8b6cdf",
  violetGlow: "rgba(139,108,223,0.2)",
  coldWhite: "#d4dce8",
  coldWhiteGlow: "rgba(212,220,232,0.15)",
  green: "#00ff9d",
  blue: "#00b8ff",
  glass: "rgba(255,255,255,0.03)",
  glassBorder: "rgba(255,255,255,0.08)",
} as const

/* ── Tab definitions (full names per spec) ── */
const TABS = [
  "Temporal Mycelium",
  "Approved Swarm",
  "Mycelium Oracle",
  "Provenance Singularity",
  "Neuro Interface",
  "ClawLink",
] as const
type TabId = (typeof TABS)[number]

const TAB_CONTENT: Record<
  TabId,
  { title: string; desc: string; accent: string; href: string }
> = {
  "Temporal Mycelium": {
    title: "Temporal Mycelium",
    desc: "Traverse security events across all epochs. Temporal pattern analysis reveals hidden threat vectors through the living memory of the mycelium.",
    accent: QV.gold,
    href: "/temporal",
  },
  "Approved Swarm": {
    title: "Approved Swarm",
    desc: "Distributed autonomous agents operating in concert. Real-time threat response orchestrated through collective intelligence protocols.",
    accent: QV.violet,
    href: "/swarm",
  },
  "Mycelium Oracle": {
    title: "Mycelium Oracle",
    desc: "The Universe speaks. Every answer traverses epochs and simulates future threat universes with quantum-grade precision.",
    accent: QV.blue,
    href: "/oracle",
  },
  "Provenance Singularity": {
    title: "Provenance Singularity",
    desc: "Every runbook event anchored to its Universal Epoch — immutable provenance across all dimensions of the security multiverse.",
    accent: QV.green,
    href: "/provenance",
  },
  "Neuro Interface": {
    title: "Neuro Interface",
    desc: "The living neural substrate. Adaptive learning pathways that evolve with every interaction, forging deeper security consciousness.",
    accent: QV.coldWhite,
    href: "/neuro",
  },
  ClawLink: {
    title: "ClawLink Connector",
    desc: "Bridge universes. Connect your infrastructure to the living Mycelium and let collective intelligence amplify your security posture.",
    accent: QV.gold,
    href: "/clawlink",
  },
}

/* ── R3F: 3D Mycelium Node ── */
function MyceliumNode({
  position,
  color,
  speed,
  phase,
}: {
  position: [number, number, number]
  color: string
  speed: number
  phase: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    meshRef.current.position.y = position[1] + Math.sin(t * speed + phase) * 0.15
    meshRef.current.position.x = position[0] + Math.cos(t * speed * 0.7 + phase) * 0.1
    const s = 0.8 + Math.sin(t * speed * 1.3 + phase) * 0.2
    meshRef.current.scale.setScalar(s)
  })
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.75} />
    </mesh>
  )
}

/* ── R3F: 3D Mycelium Edges ── */
function MyceliumEdges({ positions }: { positions: [number, number, number][] }) {
  const lineSegments = useMemo(() => {
    const pts: THREE.Vector3[] = []
    const connectionDist = 1.6
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const dx = positions[j][0] - positions[i][0]
        const dy = positions[j][1] - positions[i][1]
        const dz = positions[j][2] - positions[i][2]
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if (dist < connectionDist) {
          pts.push(new THREE.Vector3(...positions[i]))
          pts.push(new THREE.Vector3(...positions[j]))
        }
      }
    }
    return pts
  }, [positions])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(lineSegments)
    return geo
  }, [lineSegments])

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color={QV.gold} transparent opacity={0.08} />
    </lineSegments>
  )
}

/* ── R3F: Full 3D Mycelium Scene ── */
function MyceliumScene() {
  const groupRef = useRef<THREE.Group>(null)

  const nodes = useMemo(() => {
    const colors = [QV.gold, QV.violet, QV.coldWhite, QV.green, QV.blue]
    return Array.from({ length: 60 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 7,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 4,
      ] as [number, number, number],
      color: colors[i % colors.length],
      speed: 0.3 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
    }))
  }, [])

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.04
    }
  })

  return (
    <group ref={groupRef}>
      <MyceliumEdges positions={nodes.map((n) => n.position)} />
      {nodes.map((n, i) => (
        <MyceliumNode key={i} {...n} />
      ))}
    </group>
  )
}

/* ── React Three Fiber: Interactive 3D Mycelium Graph ── */
function MyceliumGraph() {
  return (
    <div
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
      role="img"
      aria-label="Interactive 3D mycelium network graph"
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: QV.void }}
      >
        <Suspense fallback={null}>
          <MyceliumScene />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={false}
            maxPolarAngle={Math.PI}
            minPolarAngle={0}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

/* ── Cosmic Inter-AI Summon Button (top-right, subtly pulsing) ── */
function SummonButton() {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href="/summon"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full
                 font-mono text-xs tracking-widest uppercase transition-all duration-500"
      style={{
        background: hovered ? "rgba(220,50,50,0.12)" : QV.glass,
        border: `1px solid ${hovered ? "rgba(220,50,50,0.5)" : QV.glassBorder}`,
        color: hovered ? "#dc3232" : "rgba(255,255,255,0.45)",
        boxShadow: hovered ? "0 0 24px rgba(220,50,50,0.2)" : "none",
        animation: hovered ? "none" : "universe-pulse 3s ease-in-out infinite",
      }}
    >
      <span style={{ fontSize: "10px", lineHeight: 1 }}>◆</span>
      Summon AI
    </a>
  )
}

/* ── Live Universe Pulse Stats ── */
function UniversePulse() {
  const [stats, setStats] = useState({ runbooks: 0, evolutions: 0, nodes: 0 })

  useEffect(() => {
    setStats({
      runbooks: 1_042_731 + Math.floor(Math.random() * 200),
      evolutions: 47 + Math.floor(Math.random() * 30),
      nodes: 12_847 + Math.floor(Math.random() * 500),
    })
    const id = setInterval(() => {
      setStats((s) => ({
        runbooks: s.runbooks + Math.floor(Math.random() * 3),
        evolutions: s.evolutions + (Math.random() > 0.7 ? 1 : 0),
        nodes: s.nodes + Math.floor(Math.random() * 5),
      }))
    }, 4000)
    return () => clearInterval(id)
  }, [])

  const items = [
    {
      label: "Runbooks Breathing",
      value: stats.runbooks.toLocaleString("de-DE"),
      accent: QV.gold,
    },
    {
      label: "Evolutions / hr",
      value: stats.evolutions.toString(),
      accent: QV.violet,
    },
    {
      label: "Mycelium Nodes",
      value: stats.nodes.toLocaleString("de-DE"),
      accent: QV.coldWhite,
    },
  ]

  return (
    <div className="flex flex-wrap justify-center gap-6 md:gap-10">
      {items.map((item) => (
        <div key={item.label} className="text-center">
          <div
            className="text-xl md:text-2xl font-black font-heading tabular-nums"
            style={{ color: item.accent }}
          >
            {item.value}
          </div>
          <div
            className="text-[10px] font-mono tracking-widest uppercase mt-1"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            {item.label}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── Neuro-Mycelium Eye-Tracking Indicator ── */
function NeuroIndicator() {
  const [pos, setPos] = useState({ x: 50, y: 50 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setPos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }
    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  return (
    <div
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2"
      style={{ color: "rgba(255,255,255,0.15)" }}
    >
      <div
        className="w-5 h-5 rounded-full border relative overflow-hidden"
        style={{ borderColor: "rgba(139,108,223,0.3)" }}
      >
        <div
          className="absolute w-1.5 h-1.5 rounded-full transition-all duration-200"
          style={{
            background: QV.violet,
            opacity: 0.6,
            left: `${pos.x * 0.6 + 10}%`,
            top: `${pos.y * 0.6 + 10}%`,
          }}
        />
      </div>
      <span className="text-[9px] font-mono tracking-widest uppercase">Neuro</span>
    </div>
  )
}

/* ── Orbital Navigation Bar ── */
function OrbitalBar({
  active,
  onSelect,
}: {
  active: TabId | null
  onSelect: (t: TabId) => void
}) {
  return (
    <nav
      className="w-full flex justify-center px-4 py-3 z-40 relative"
      role="tablist"
      aria-label="Universe navigation"
    >
      <div
        className="flex gap-1 md:gap-2 rounded-full px-2 py-1.5 overflow-x-auto"
        style={{
          background: "rgba(5,5,5,0.7)",
          border: `1px solid ${QV.glassBorder}`,
          backdropFilter: "blur(20px)",
        }}
      >
        {TABS.map((tab) => {
          const isActive = active === tab
          const accent = TAB_CONTENT[tab].accent
          return (
            <button
              key={tab}
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelect(tab)}
              className="px-3 md:px-4 py-2 rounded-full text-[10px] md:text-[11px] font-mono
                         tracking-widest uppercase transition-all duration-300 whitespace-nowrap"
              style={{
                background: isActive ? `${accent}12` : "transparent",
                color: isActive ? accent : "rgba(255,255,255,0.35)",
                borderBottom: isActive
                  ? `1px solid ${accent}`
                  : "1px solid transparent",
              }}
            >
              {tab}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

/* ── Void Panel (full-height tab content overlay) ── */
function VoidPanel({ tab, onClose }: { tab: TabId; onClose: () => void }) {
  const content = TAB_CONTENT[tab]
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  const handleClose = useCallback(() => {
    setVisible(false)
    setTimeout(onClose, 350)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center"
      style={{
        background: "rgba(5,5,5,0.92)",
        backdropFilter: "blur(32px)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.35s ease",
      }}
    >
      <div
        className="relative max-w-2xl w-full mx-4 p-8 md:p-12 rounded-3xl"
        style={{
          background: QV.glass,
          border: `1px solid ${content.accent}18`,
          transform: visible
            ? "translateY(0) scale(1)"
            : "translateY(24px) scale(0.97)",
          opacity: visible ? 1 : 0,
          transition: "transform 0.4s ease, opacity 0.35s ease",
        }}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-5 text-xs font-mono tracking-widest uppercase
                     transition-colors duration-200"
          style={{ color: "rgba(255,255,255,0.3)" }}
          aria-label="Close panel"
        >
          ✕ Close
        </button>

        <div
          className="text-[10px] font-mono tracking-[0.25em] uppercase mb-4"
          style={{ color: `${content.accent}88` }}
        >
          Universe · {tab}
        </div>

        <h2
          className="text-3xl md:text-4xl font-black font-heading mb-4 leading-tight"
          style={{ color: content.accent }}
        >
          {content.title}
        </h2>

        <p
          className="text-sm md:text-base leading-relaxed mb-8"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          {content.desc}
        </p>

        <a
          href={content.href}
          className="inline-block px-6 py-3 rounded-full font-mono text-xs font-bold
                     uppercase tracking-widest transition-all duration-300"
          style={{
            background: `${content.accent}10`,
            border: `1px solid ${content.accent}44`,
            color: content.accent,
          }}
        >
          Enter {tab} →
        </a>
      </div>
    </div>
  )
}

/* ── ClawLink Connector Button ── */
function ClawLinkConnector() {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href="/summon"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-mono text-xs
                 font-bold uppercase tracking-widest transition-all duration-300"
      style={{
        background: hovered ? `${QV.gold}12` : QV.glass,
        border: `1px solid ${hovered ? `${QV.gold}55` : QV.glassBorder}`,
        color: hovered ? QV.gold : "rgba(255,255,255,0.4)",
        boxShadow: hovered ? `0 0 32px ${QV.goldGlow}` : "none",
      }}
    >
      <span style={{ fontSize: "8px" }}>⬡</span>
      Connect Universe
    </a>
  )
}

/* ── Main Universe Client Component ── */
export default function UniversePage() {
  const [activeTab, setActiveTab] = useState<TabId | null>(null)

  const handleTabSelect = useCallback((tab: TabId) => {
    setActiveTab((prev) => (prev === tab ? null : tab))
  }, [])

  return (
    <>
      <SummonButton />
      <NeuroIndicator />

      <div className="relative min-h-screen" style={{ background: QV.void }}>
        {/* Mycelium Graph Background */}
        <div className="absolute inset-0 overflow-hidden" style={{ height: "100vh" }}>
          <MyceliumGraph />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, transparent 60%, #050505 100%)",
            }}
          />
        </div>

        {/* Content Layer */}
        <div className="relative z-10">
          <div className="min-h-screen flex flex-col">
            {/* Orbital Bar */}
            <div className="pt-16 md:pt-12">
              <OrbitalBar active={activeTab} onSelect={handleTabSelect} />
            </div>

            {/* Hero Center */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
              <div
                className="text-[10px] font-mono tracking-[0.3em] uppercase mb-6"
                style={{ color: `${QV.gold}88` }}
              >
                Genesis Protokoll · Quantum Void Elegance · v2050-final
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-8xl font-black font-heading mb-6 leading-none tracking-tighter">
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${QV.gold}, ${QV.coldWhite} 45%, ${QV.violet} 75%, ${QV.gold})`,
                  }}
                >
                  Universe
                </span>
              </h1>

              <p
                className="text-sm md:text-base max-w-lg mx-auto leading-relaxed mb-8"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                The ClawVerse Core. One living mycelium connecting all
                operational knowledge across time, space, and realities.
              </p>

              {/* Live Universe Pulse Stats */}
              <div className="mb-10">
                <UniversePulse />
              </div>

              {/* ClawLink Connector */}
              <ClawLinkConnector />
            </div>

            {/* Bottom Inscription */}
            <div className="pb-8 text-center">
              <div
                className="text-[9px] font-mono tracking-[0.3em] uppercase"
                style={{ color: "rgba(255,255,255,0.07)" }}
              >
                One Mycelium to rule them all · Universe 2050 Final · ClawGuru.org
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Void Panel overlay */}
      {activeTab && <VoidPanel tab={activeTab} onClose={() => setActiveTab(null)} />}

      {/* Animation keyframes */}
      <style>{`
        @keyframes universe-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </>
  )
}
