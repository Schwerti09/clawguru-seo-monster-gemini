"use client"

// Live Mycelium Preview — R3F Canvas
// Loaded lazily via next/dynamic({ ssr: false }) from MyceliumPanel

import { useRef, useMemo, useCallback, Suspense } from "react"
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber"
import { OrbitControls, Html, Float } from "@react-three/drei"
import * as THREE from "three"

// ─── Color palette (reusing QV system) ──────────────────────────────────────
const COLORS = {
  void: "#050505",
  threat: "#ff4444",
  threatGlow: "rgba(255,68,68,0.4)",
  runbook: "#00b8ff",
  runbookGlow: "rgba(0,184,255,0.3)",
  security: "#00ff9d",
  securityGlow: "rgba(0,255,157,0.3)",
  infrastructure: "#c9a84c",
  infraGlow: "rgba(201,168,76,0.3)",
  compliance: "#8b6cdf",
  complianceGlow: "rgba(139,108,223,0.3)",
  edge: "rgba(255,255,255,0.06)",
}

export type NodeType = "threat" | "runbook" | "security" | "infrastructure" | "compliance"

export interface MyceliumNode {
  id: string
  type: NodeType
  label: string
  description: string
  severity?: "critical" | "high" | "medium" | "low"
  position: [number, number, number]
  speed: number
  phase: number
  size: number
}

interface NodeMeshProps {
  node: MyceliumNode
  isSelected: boolean
  visibleTypes: Set<NodeType>
  onSelect: (id: string | null) => void
}

function getColor(type: NodeType): string {
  return COLORS[type] ?? COLORS.security
}

function NodeMesh({ node, isSelected, visibleTypes, onSelect }: NodeMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const visible = visibleTypes.has(node.type)

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    // Floating drift
    meshRef.current.position.y = node.position[1] + Math.sin(t * node.speed + node.phase) * 0.18
    meshRef.current.position.x = node.position[0] + Math.cos(t * node.speed * 0.7 + node.phase) * 0.12
    // Pulse scale for threats
    if (node.type === "threat") {
      const p = 0.85 + Math.abs(Math.sin(t * 2.5 + node.phase)) * 0.35
      meshRef.current.scale.setScalar(p * node.size)
    } else {
      const p = 0.9 + Math.sin(t * node.speed * 1.2 + node.phase) * 0.1
      meshRef.current.scale.setScalar(p * node.size)
    }
    // Selected ring rotate
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 1.5
    }
  })

  if (!visible) return null

  const color = getColor(node.type)

  return (
    <mesh
      ref={meshRef}
      position={node.position}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation()
        onSelect(isSelected ? null : node.id)
      }}
    >
      <sphereGeometry args={[0.05, 12, 12]} />
      <meshBasicMaterial color={color} transparent opacity={isSelected ? 1 : 0.82} />

      {/* Selection ring */}
      {isSelected && (
        <mesh ref={ringRef}>
          <ringGeometry args={[0.09, 0.11, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Hover / selected label */}
      {isSelected && (
        <Html distanceFactor={10} center>
          <div
            style={{
              background: "rgba(5,5,5,0.92)",
              border: `1px solid ${color}55`,
              borderRadius: 8,
              padding: "6px 10px",
              pointerEvents: "none",
              whiteSpace: "nowrap",
              fontSize: 11,
              color: "#e2e8f0",
              boxShadow: `0 0 12px ${color}33`,
            }}
          >
            <div style={{ fontWeight: 700, color, marginBottom: 2 }}>{node.label}</div>
            <div style={{ color: "#94a3b8", fontSize: 10 }}>{node.description}</div>
          </div>
        </Html>
      )}
    </mesh>
  )
}

function Edges({
  nodes,
  visibleTypes,
}: {
  nodes: MyceliumNode[]
  visibleTypes: Set<NodeType>
}) {
  const geometry = useMemo(() => {
    const pts: THREE.Vector3[] = []
    const threshold = 1.8
    const visible = nodes.filter((n) => visibleTypes.has(n.type))
    for (let i = 0; i < visible.length; i++) {
      for (let j = i + 1; j < visible.length; j++) {
        const [ax, ay, az] = visible[i].position
        const [bx, by, bz] = visible[j].position
        const dist = Math.sqrt((bx - ax) ** 2 + (by - ay) ** 2 + (bz - az) ** 2)
        if (dist < threshold) {
          pts.push(new THREE.Vector3(ax, ay, az))
          pts.push(new THREE.Vector3(bx, by, bz))
        }
      }
    }
    return new THREE.BufferGeometry().setFromPoints(pts)
  }, [nodes, visibleTypes])

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#ffffff" transparent opacity={0.055} />
    </lineSegments>
  )
}

function ParticleField() {
  const count = 80
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8
    }
    return arr
  }, [])
  const ref = useRef<THREE.Points>(null)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.008
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.018} color="#ffffff" transparent opacity={0.15} sizeAttenuation />
    </points>
  )
}

function SceneGroup({
  nodes,
  selectedId,
  visibleTypes,
  rotating,
  onSelect,
}: {
  nodes: MyceliumNode[]
  selectedId: string | null
  visibleTypes: Set<NodeType>
  rotating: boolean
  onSelect: (id: string | null) => void
}) {
  const groupRef = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (groupRef.current && rotating) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.045
    }
  })
  return (
    <group ref={groupRef}>
      <ParticleField />
      <Edges nodes={nodes} visibleTypes={visibleTypes} />
      {nodes.map((n) => (
        <NodeMesh
          key={n.id}
          node={n}
          isSelected={selectedId === n.id}
          visibleTypes={visibleTypes}
          onSelect={onSelect}
        />
      ))}
    </group>
  )
}

interface MyceliumCanvasProps {
  nodes: MyceliumNode[]
  selectedId: string | null
  visibleTypes: Set<NodeType>
  rotating: boolean
  onSelect: (id: string | null) => void
}

export default function MyceliumCanvas({
  nodes,
  selectedId,
  visibleTypes,
  rotating,
  onSelect,
}: MyceliumCanvasProps) {
  const handleBg = useCallback((e: ThreeEvent<MouseEvent>) => {
    onSelect(null)
  }, [onSelect])

  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 58 }}
      gl={{ antialias: true, alpha: false }}
      style={{ background: COLORS.void, borderRadius: "inherit" }}
      onPointerMissed={() => onSelect(null)}
    >
      <Suspense fallback={null}>
        <SceneGroup
          nodes={nodes}
          selectedId={selectedId}
          visibleTypes={visibleTypes}
          rotating={rotating}
          onSelect={onSelect}
        />
      </Suspense>
      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.55}
        zoomSpeed={0.8}
        minDistance={2}
        maxDistance={18}
        enablePan={false}
        autoRotate={false}
      />
    </Canvas>
  )
}
