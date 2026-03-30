"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import * as THREE from "three"

function MyceliumPoints({ count = 9000 }: { count?: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 2.2 * Math.sqrt(Math.random())
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)
      arr[i * 3] = x
      arr[i * 3 + 1] = y
      arr[i * 3 + 2] = z
    }
    return arr
  }, [count])

  const speeds = useMemo(() => Float32Array.from({ length: count }, () => 0.15 + Math.random() * 0.7), [count])
  const ref = useRef<THREE.Points>(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const g = ref.current?.geometry as THREE.BufferGeometry | undefined
    if (!g) return
    const pos = g.attributes.position as THREE.BufferAttribute
    const array = pos.array as Float32Array
    for (let i = 0; i < count; i++) {
      const ix = i * 3
      const x = array[ix]
      const y = array[ix + 1]
      const z = array[ix + 2]
      const s = speeds[i]
      array[ix] = x + 0.002 * Math.sin(t * s + y * 1.5)
      array[ix + 1] = y + 0.002 * Math.cos(t * s + z * 1.5)
      array[ix + 2] = z + 0.002 * Math.sin(t * s + x * 1.5)
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.012} color="#7dd3fc" sizeAttenuation depthWrite={false} transparent opacity={0.8} />
    </points>
  )
}

export default function ThreeMyceliumField() {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5], fov: 55 }} className="absolute inset-0">
      <fog attach="fog" args={["#03040a", 6, 12]} />
      <MyceliumPoints />
    </Canvas>
  )
}
