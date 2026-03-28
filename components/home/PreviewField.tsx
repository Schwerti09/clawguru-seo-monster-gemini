"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Suspense, useEffect, useMemo, useRef, useState } from "react"

function Particles() {
  const group = useRef<any>(null!)
  const positions = useMemo(() => {
    const pts: Array<[number, number, number]> = []
    const isMobile = typeof window !== "undefined" ? window.innerWidth < 768 : false
    const N = isMobile ? 28 : 48
    for (let i = 0; i < N; i++) {
      const r = 3 + Math.random() * 3
      const a = Math.random() * Math.PI * 2
      const y = (Math.random() - 0.5) * 2.5
      pts.push([Math.cos(a) * r, y, Math.sin(a) * r])
    }
    return pts
  }, [])

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.getElapsedTime()
    group.current.rotation.y = t * 0.06
    group.current.position.y = Math.sin(t * 0.6) * 0.1
  })

  return (
    <group ref={group}>
      {positions.map((p, i) => (
        <mesh key={i} position={p as any}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshBasicMaterial color={i % 3 === 0 ? "#00b8ff" : i % 3 === 1 ? "#d4af37" : "#00ff9d"} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  )
}

export default function PreviewField() {
  const [enabled, setEnabled] = useState(true)
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
      const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
      const webgl = canUseWebGL()
      setEnabled(!reduce && webgl)
    } catch {
      setEnabled(true)
    }
  }, [])
  if (!enabled) return null
  return (
    <div className="absolute inset-0" aria-hidden>
      <Canvas camera={{ position: [0, 1.4, 6], fov: 55 }} dpr={[1, 1.3]} gl={{ antialias: false, powerPreference: "low-power" }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <Particles />
        </Suspense>
      </Canvas>
    </div>
  )
}
