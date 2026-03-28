"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Suspense, useEffect, useMemo, useRef, useState } from "react"

function Orbits() {
  const group = useRef<any>(null)
  const pts = useMemo(() => {
    const isMobile = typeof window !== "undefined" ? window.innerWidth < 768 : false
    const N = isMobile ? 12 : 24
    const items: Array<{ r: number; a: number; y: number; c: string }> = []
    const colors = ["#00b8ff", "#d4af37", "#00ff9d"]
    for (let i = 0; i < N; i++) {
      const r = 1.6 + (i % 6) * 0.12
      const a = (i / N) * Math.PI * 2
      const y = ((i % 5) - 2) * 0.08
      items.push({ r, a, y, c: colors[i % colors.length] })
    }
    return items
  }, [])

  useFrame(({ clock }) => {
    if (!group.current) return
    const t = clock.getElapsedTime()
    group.current.rotation.y = t * 0.35
  })

  return (
    <group ref={group}>
      {pts.map((p, i) => (
        <mesh key={i} position={[Math.cos(p.a) * p.r, p.y, Math.sin(p.a) * p.r] as any}>
          <sphereGeometry args={[0.05, 10, 10]} />
          <meshBasicMaterial color={p.c} transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  )
}

export default function OrbitingLogo() {
  const [useStatic, setUseStatic] = useState(true)
  const canUseWebGL = () => {
    try {
      const c = document.createElement("canvas")
      const gl = (c.getContext("webgl") || c.getContext("experimental-webgl")) as WebGLRenderingContext | null
      return !!gl
    } catch {
      return false
    }
  }
  useEffect(() => {
    try {
      const isMobile = window.innerWidth < 768
      const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
      const webgl = canUseWebGL()
      setUseStatic(isMobile || reduce || !webgl ? true : false)
    } catch {
      setUseStatic(true)
    }
  }, [])
  return (
    <div className="relative w-full max-w-xs mx-auto aspect-square">
      {useStatic ? (
        <div className="w-full h-full rounded-full grid place-items-center" aria-hidden>
          <div className="w-[55%] h-[55%] rounded-full border border-white/10" style={{ boxShadow: "0 0 24px rgba(0,184,255,0.25), inset 0 0 24px rgba(0,255,157,0.15)" }} />
        </div>
      ) : (
      <Canvas camera={{ position: [0, 0.8, 3.2], fov: 55 }} dpr={[1, 1.25]} gl={{ antialias: false, powerPreference: "low-power" }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <Orbits />
          <mesh>
            <sphereGeometry args={[0.28, 16, 16]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
          </mesh>
        </Suspense>
      </Canvas>
      )}
    </div>
  )
}
