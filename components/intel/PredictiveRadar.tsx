"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Canvas, ThreeEvent } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { motion, useReducedMotion } from "framer-motion"
import { fetchWithRetry } from "@/lib/fetch-retry"

type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
type RadarNode = {
  id: string
  title: string
  severity: Severity
  x: number
  y: number
  z: number
  pulse: number
  runbook?: { slug: string; title: string; clawScore: number }
}
type IntelDict = {
  predictive_header?: string
  predictive_loading?: string
  predictive_error?: string
  fix_link_label?: string
}

export default function PredictiveRadar({ prefix = "", dict = {} as IntelDict }: { prefix?: string; dict?: IntelDict }) {
  const reduce = useReducedMotion()
  const [nodes, setNodes] = useState<RadarNode[] | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [hover, setHover] = useState<RadarNode | null>(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const r = await fetchWithRetry("/api/intel?op=radar", { cache: "no-store" })
        if (!r.ok) throw new Error(String(r.status))
        const j = (await r.json()) as { nodes: RadarNode[] }
        if (alive) setNodes(j.nodes.slice(0, 50))
      } catch (e: unknown) {
        if (alive) setErr(e instanceof Error ? e.message : "Load error")
      }
    })()
    return () => { alive = false }
  }, [])

  const header = dict.predictive_header || "Predictive Threat Radar"
  const loading = dict.predictive_loading || "Loading predictions…"
  const errorText = dict.predictive_error || "Oracle error"

  if (reduce) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-4 relative">
        <div className="text-sm font-semibold text-white mb-3">{header}</div>
        <div className="h-72 rounded-xl border border-white/10 bg-[#07090f] grid place-items-center text-[11px] text-gray-300">
          {loading}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-4 relative">
      <div className="text-sm font-semibold text-white mb-3">{header}</div>

      {!nodes && !err && <div className="h-72 rounded-xl border border-white/10 bg-white/5 animate-pulse grid place-items-center text-[11px] text-gray-300">{loading}</div>}
      {err && <div className="text-xs text-red-300">{errorText}: {err}</div>}

      {nodes && (
        <div className="relative">
          <div className="h-72 rounded-xl overflow-hidden border border-white/10">
            <Canvas orthographic={reduce} dpr={[1, 2]} gl={{ antialias: true, powerPreference: "low-power" }}>
              {!reduce && <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.4} />}
              <ambientLight intensity={0.4} />
              <color attach="background" args={["#07090f"]} />
              <group>
                <ThreatPoints data={nodes} reduce={reduce} onHover={setHover} />
              </group>
            </Canvas>
          </div>
          {hover && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-2 left-2 right-2 rounded-xl border border-white/10 bg-black/80 backdrop-blur p-3 text-xs text-gray-200"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold text-white">{hover.title}</div>
                <a
                  href={`${prefix}/runbook/${hover.runbook?.slug ?? ""}`.replace(/\/\//g, "/")}
                  className="px-2 py-1 rounded-md border border-cyan-400/40 bg-cyan-500/10 text-cyan-100 text-[11px]"
                >
                  {dict.fix_link_label || "Fix page"}
                </a>
              </div>
              <div className="mt-1 text-[11px]">
                <span className={`mr-2 px-2 py-[2px] rounded-full border ${
                  hover.severity === "CRITICAL" ? "border-red-500/40 text-red-300" :
                  hover.severity === "HIGH" ? "border-orange-500/40 text-orange-300" :
                  hover.severity === "MEDIUM" ? "border-yellow-500/40 text-yellow-200" : "border-green-500/40 text-green-300"
                }`}>{hover.severity}</span>
                <span className="text-cyan-200">{hover.runbook?.title || ""}</span>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}

function ThreatPoints({ data, reduce, onHover }: { data: RadarNode[]; reduce: boolean; onHover: (n: RadarNode | null) => void }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(data.length * 3)
    data.forEach((n, i) => {
      arr[i * 3 + 0] = n.x * 2 - 1
      arr[i * 3 + 1] = n.y * 2 - 1
      arr[i * 3 + 2] = reduce ? 0 : n.z * 2 - 1
    })
    return arr
  }, [data, reduce])
  const colors = useMemo(() => {
    const arr = new Float32Array(data.length * 3)
    const col = (s: Severity) => (s === "CRITICAL" ? [1, 0.2, 0.2] : s === "HIGH" ? [1, 0.5, 0.2] : s === "MEDIUM" ? [1, 0.9, 0.2] : [0.4, 1, 0.7])
    data.forEach((n, i) => {
      const c = col(n.severity)
      arr[i * 3 + 0] = c[0]
      arr[i * 3 + 1] = c[1]
      arr[i * 3 + 2] = c[2]
    })
    return arr
  }, [data])

  function handlePointerMove(e: ThreeEvent<PointerEvent>) {
    const idx = e.index ?? -1
    onHover(idx >= 0 ? data[idx] : null)
  }
  function handlePointerOut() {
    onHover(null)
  }

  return (
    <points onPointerMove={handlePointerMove} onPointerOut={handlePointerOut}>
      <bufferGeometry attach="geometry">
        <bufferAttribute attach="attributes-position" count={positions.length / 3} itemSize={3} array={positions} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} itemSize={3} array={colors} />
      </bufferGeometry>
      <pointsMaterial attach="material" size={reduce ? 6 : 10} sizeAttenuation={false} vertexColors />
    </points>
  )
}
