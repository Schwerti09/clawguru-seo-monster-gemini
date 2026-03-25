"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import { useMemo, useRef } from "react"
import { useReducedMotion } from "framer-motion"
import { usePathname } from "next/navigation"

type Props = { tags: string[]; counts?: Record<string, number>; avgClaw?: Record<string, number> }

function colorFor(score: number): string {
  // 0..100 -> hue 200 (blue) .. 20 (orange/red)
  const s = Math.max(0, Math.min(100, isNaN(score) ? 0 : score))
  const hue = 200 - (180 * s) / 100
  const sat = 85
  const light = 60
  return `hsl(${hue} ${sat}% ${light}%)`
}

function sizeFor(count: number, maxCount: number): number {
  const c = Math.max(1, count)
  const m = Math.max(1, maxCount)
  const r = c / m // 0..1
  return 0.85 + r * 0.9 // scale factor
}

function OrbitGroup({ tags, prefix, counts = {}, avgClaw = {} }: { tags: string[]; prefix: string; counts?: Record<string, number>; avgClaw?: Record<string, number> }) {
  const prefersReduced = useReducedMotion()
  const group = useRef<any>(null!)
  const targetTilt = useRef<[number, number]>([0, 0])

  const points = useMemo(() => {
    const items = tags.slice(0, 180)
    const out: Array<{ pos: [number, number, number]; t: string; c: number; s: number }> = []
    const rings = 8
    for (let r = 0; r < rings; r++) {
      const radius = 2 + r * 0.5
      const count = Math.max(8, Math.floor(items.length / rings))
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (r % 2 === 0 ? 0 : Math.PI / count)
        const y = -1.2 + (r / (rings - 1)) * 2.4
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const idx = (r * count + i) % items.length
        const t = items[idx]!
        const c = counts[t] || 1
        const s = avgClaw[t] || 0
        out.push({ pos: [x, y, z], t, c, s })
      }
    }
    return out
  }, [tags, counts, avgClaw])

  useFrame((state) => {
    if (!group.current) return
    if (!prefersReduced) {
      group.current.rotation.y += 0.003
      const [tx, ty] = targetTilt.current
      group.current.rotation.x += (ty - group.current.rotation.x) * 0.06
      group.current.rotation.z += (tx - group.current.rotation.z) * 0.06
    }
  })

  return (
    <group
      ref={group}
      onPointerMove={(e) => {
        const nx = (e.pointer.x ?? 0) // -1..1
        const ny = (e.pointer.y ?? 0)
        targetTilt.current = [nx * 0.08, -ny * 0.08]
      }}
    >
      {points.map((p, i) => (
        <Html
          key={`${p.t}-${i}`}
          position={p.pos}
          transform
          distanceFactor={6}
          occlude
        >
          <a
            href={`${prefix}/tag/${encodeURIComponent(p.t)}`}
            className="group relative px-3 py-1.5 rounded-xl border border-white/10 bg-black/30 text-sm text-gray-100 will-change-transform transition-all duration-200 hover:scale-110 hover:shadow-[0_0_0_1px_rgba(34,211,238,0.35)_inset,0_10px_24px_-12px_rgba(34,211,238,0.35)]"
            style={{ color: colorFor(p.s), boxShadow: "0 0 0 1px rgba(255,255,255,0.04) inset" , transform: `scale(${sizeFor(p.c, Math.max(1, Math.max(...tags.map(t => counts[t] || 1))))})` }}
          >
            {p.t}
            <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-[11px] text-gray-200 px-2 py-1 rounded-lg border border-white/10 whitespace-nowrap">
              {p.c} Runbooks • Ø {avgClaw[p.t] ?? 0}
            </span>
          </a>
        </Html>
      ))}
    </group>
  )
}

export default function TagOrbitCloud3D({ tags, counts, avgClaw }: Props) {
  const prefersReduced = useReducedMotion()
  const pathname = usePathname()
  const prefix = useMemo(() => {
    const first = (pathname || "").split("/")[1] || ""
    const isLang = /^[a-z]{2}(-[A-Z]{2})?$/.test(first)
    return isLang ? `/${first}` : ""
  }, [pathname])
  return (
    <div className="relative mx-auto my-10 h-[460px] max-w-5xl rounded-[36px] overflow-hidden">
      <Canvas camera={{ position: [0, 0, 7.5], fov: 50 }} dpr={[1, 1.75]} gl={{ antialias: true }}>
        <ambientLight intensity={0.5} />
        <directionalLight intensity={0.6} position={[4, 6, 5]} />
        {!prefersReduced && (
          <fog attach="fog" args={["#03040a", 12, 20]} />
        )}
        <OrbitGroup tags={tags} prefix={prefix} counts={counts} avgClaw={avgClaw} />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 rounded-[36px] border border-cyan-500/10 bg-gradient-to-br from-cyan-500/5 to-transparent" />
    </div>
  )
}
