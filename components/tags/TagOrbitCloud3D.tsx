"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import { useMemo, useRef } from "react"
import { useReducedMotion } from "framer-motion"
import * as THREE from "three"

type Props = { tags: string[] }

function OrbitGroup({ tags }: Props) {
  const prefersReduced = useReducedMotion()
  const group = useRef<THREE.Group>(null!)
  const targetTilt = useRef<[number, number]>([0, 0])

  const points = useMemo(() => {
    const items = tags.slice(0, 60)
    const out: Array<{ pos: THREE.Vector3; t: string }> = []
    const rings = 5
    for (let r = 0; r < rings; r++) {
      const radius = 2 + r * 0.5
      const count = Math.max(6, Math.floor(items.length / rings))
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (r % 2 === 0 ? 0 : Math.PI / count)
        const y = -1.2 + (r / (rings - 1)) * 2.4
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const idx = (r * count + i) % items.length
        out.push({ pos: new THREE.Vector3(x, y, z), t: items[idx]! })
      }
    }
    return out
  }, [tags])

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
            href={`/tag/${encodeURIComponent(p.t)}`}
            className="px-3 py-1.5 rounded-xl border border-gray-800 bg-black/30 text-sm text-gray-200 will-change-transform hover:shadow-[0_0_0_1px_rgba(34,211,238,0.35)_inset,0_10px_24px_-12px_rgba(34,211,238,0.35)]"
          >
            {p.t}
          </a>
        </Html>
      ))}
    </group>
  )
}

export default function TagOrbitCloud3D({ tags }: Props) {
  const prefersReduced = useReducedMotion()
  return (
    <div className="relative mx-auto my-10 h-[460px] max-w-5xl rounded-[36px] overflow-hidden">
      <Canvas camera={{ position: [0, 0, 7.5], fov: 50 }} dpr={[1, 1.75]} gl={{ antialias: true }}>
        <ambientLight intensity={0.5} />
        <directionalLight intensity={0.6} position={[4, 6, 5]} />
        {!prefersReduced && (
          <fog attach="fog" args={["#03040a", 12, 20]} />
        )}
        <OrbitGroup tags={tags} />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 rounded-[36px] border border-cyan-500/10 bg-gradient-to-br from-cyan-500/5 to-transparent" />
    </div>
  )
}
