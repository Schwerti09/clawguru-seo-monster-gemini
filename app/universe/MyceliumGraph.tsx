// UNIVERSE 2050 – Quantum Void Elegance – 3D Mycelium Scene
// Isolated R3F module – imported with `dynamic({ ssr: false })` to prevent WebGL/SSR crashes.

"use client"

import { useRef, useMemo, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"
import { QV } from "./qv"

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

  const geometry = useMemo(
    () => new THREE.BufferGeometry().setFromPoints(lineSegments),
    [lineSegments]
  )

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color={QV.gold} transparent opacity={0.08} />
    </lineSegments>
  )
}

function MyceliumScene() {
  const groupRef = useRef<THREE.Group>(null)

  const nodes = useMemo(() => {
    const colors = [QV.gold, QV.violet, QV.coldWhite, QV.green, QV.blue]
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
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
      {nodes.map((n) => (
        <MyceliumNode key={n.id} {...n} />
      ))}
    </group>
  )
}

export default function MyceliumGraph() {
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
