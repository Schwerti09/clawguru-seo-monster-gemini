'use client'

import { useState, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { Brain, Lock, RotateCcw, Download } from 'lucide-react'
import type { DashboardNode } from '@/types/dashboard'

/* ── Types ── */
interface GraphNode {
  id: number
  position: THREE.Vector3
  type: 'threat' | 'runbook' | 'oracle' | 'neuro'
  connections: number[]
}

interface MyceliumTabProps {
  isShadowed: boolean
  nodes: DashboardNode[]
}

/* ── Gold-tinted node colors ── */
function getNodeColor(type: string): string {
  switch (type) {
    case 'threat': return '#EF4444'
    case 'runbook': return '#EAB308'
    case 'oracle': return '#A1A1AA'
    case 'neuro': return '#D4A017'
    default: return '#71717A'
  }
}

/* ── Build graph from real DB nodes (or generate visual placeholders) ── */
function useGraphData(dbNodes: DashboardNode[]) {
  return useMemo(() => {
    // Use real nodes if available, otherwise generate visual placeholders
    const count = dbNodes.length > 0 ? Math.max(dbNodes.length, 20) : 30
    const nodes: GraphNode[] = Array.from({ length: count }, (_, i) => {
      const dbNode = dbNodes[i]
      return {
        id: i,
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 4
        ),
        type: dbNode ? dbNode.type : (['threat', 'runbook', 'oracle', 'neuro'] as const)[Math.floor(Math.random() * 4)],
        connections: [] as number[]
      }
    })

    nodes.forEach((node, i) => {
      nodes.slice(i + 1).forEach((other) => {
        if (node.position.distanceTo(other.position) < 2.5) {
          node.connections.push(other.id)
        }
      })
    })

    return nodes
  }, [dbNodes])
}

/* ── 3D Node Sphere ── */
function NodeSphere({ node, onSelect }: { node: GraphNode; onSelect: (n: GraphNode) => void }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const color = getNodeColor(node.type)

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    meshRef.current.position.y = node.position.y + Math.sin(t * 0.8 + node.id) * 0.06
    const s = hovered ? 1.6 : 1
    meshRef.current.scale.setScalar(s)
  })

  return (
    <mesh
      ref={meshRef}
      position={[node.position.x, node.position.y, node.position.z]}
      onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default' }}
      onClick={() => onSelect(node)}
    >
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={hovered ? 1.2 : 0.5}
        roughness={0.3}
        metalness={0.7}
      />
    </mesh>
  )
}

/* ── Connection Lines ── */
function ConnectionLines({ nodes }: { nodes: GraphNode[] }) {
  const linesRef = useRef<THREE.LineSegments>(null)

  const geometry = useMemo(() => {
    const positions: number[] = []
    nodes.forEach(node => {
      node.connections.forEach(targetId => {
        const target = nodes[targetId]
        if (target) {
          positions.push(node.position.x, node.position.y, node.position.z)
          positions.push(target.position.x, target.position.y, target.position.z)
        }
      })
    })
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return geo
  }, [nodes])

  useFrame(({ clock }) => {
    if (!linesRef.current) return
    const mat = linesRef.current.material as THREE.LineBasicMaterial
    mat.opacity = 0.12 + Math.sin(clock.getElapsedTime() * 0.5) * 0.04
  })

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial color="#EAB308" transparent opacity={0.15} depthWrite={false} />
    </lineSegments>
  )
}

/* ── Ambient Particles ── */
function AmbientParticles() {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const arr = new Float32Array(300 * 3)
    for (let i = 0; i < 300; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.02
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={300} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#EAB308" transparent opacity={0.25} depthWrite={false} sizeAttenuation />
    </points>
  )
}

/* ── Full 3D Scene ── */
function MyceliumScene({ nodes, onSelectNode }: { nodes: GraphNode[]; onSelectNode: (n: GraphNode) => void }) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#EAB308" />
      <pointLight position={[-5, -3, 3]} intensity={0.4} color="#A1A1AA" />

      <ConnectionLines nodes={nodes} />
      {nodes.map(node => (
        <NodeSphere key={node.id} node={node} onSelect={onSelectNode} />
      ))}
      <AmbientParticles />

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={3}
        maxDistance={15}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </>
  )
}

/* ── Main Export ── */
export function MyceliumTab({ isShadowed, nodes: dbNodes }: MyceliumTabProps) {
  const nodes = useGraphData(dbNodes)
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)

  return (
    <div className="h-full relative" style={{ background: '#0A0A0A' }}>
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <MyceliumScene nodes={nodes} onSelectNode={setSelectedNode} />
        </Canvas>
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: 'linear-gradient(rgba(234,179,8,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.4) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      {/* Shadow Overlay */}
      {isShadowed && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center border"
              style={{ background: 'rgba(234,179,8,0.08)', borderColor: 'rgba(234,179,8,0.2)' }}
            >
              <Brain className="w-8 h-8" style={{ color: '#EAB308' }} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Living Mycelium Network</h3>
            <p className="text-gray-500 mb-6 max-w-md text-sm leading-relaxed">
              Erlebe den Echtzeit-Security-Graphen, der Bedrohungen, Runbooks und
              Intelligence im gesamten ClawGuru-Ökosystem verbindet.
            </p>
            <div className="flex items-center justify-center gap-5 text-[11px] text-gray-600">
              {[
                { label: 'Threats', color: '#EF4444' },
                { label: 'Runbooks', color: '#EAB308' },
                { label: 'Oracle', color: '#A1A1AA' },
                { label: 'Neuro', color: '#D4A017' }
              ].map(item => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: item.color, boxShadow: `0 0 6px ${item.color}50` }} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Node Info Panel */}
      {selectedNode && !isShadowed && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-4 right-4 w-72 rounded-2xl border p-5 z-20"
          style={{
            background: 'rgba(10,10,10,0.9)',
            borderColor: 'rgba(234,179,8,0.15)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 0 40px rgba(234,179,8,0.05)'
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-white tracking-wide">Node Details</h4>
            <button onClick={() => setSelectedNode(null)} className="text-gray-600 hover:text-white text-xs">✕</button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Type</span>
              <span className="font-medium" style={{ color: getNodeColor(selectedNode.type) }}>{selectedNode.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Connections</span>
              <span className="text-white font-medium">{selectedNode.connections.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">ID</span>
              <span className="text-gray-400 font-mono text-xs">#{selectedNode.id}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Controls */}
      <div className="absolute bottom-4 left-4 flex gap-2 z-20">
        {['Reset View', 'Export Graph'].map(label => (
          <button
            key={label}
            className="px-3 py-2 rounded-xl text-[11px] font-medium text-gray-400 border transition-all hover:text-white hover:border-yellow-500/20"
            style={{ background: 'rgba(10,10,10,0.8)', borderColor: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Stats overlay */}
      <div className="absolute top-4 left-4 z-20">
        <div
          className="rounded-xl border px-4 py-3"
          style={{ background: 'rgba(10,10,10,0.85)', borderColor: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }}
        >
          <div className="text-[10px] font-semibold tracking-[0.15em] uppercase text-gray-600 mb-1">Mycelium Network</div>
          <div className="flex items-center gap-4">
            <div>
              <span className="text-lg font-black text-white">{nodes.length}</span>
              <span className="text-[10px] text-gray-500 ml-1">Nodes</span>
            </div>
            <div className="w-px h-4 bg-white/5" />
            <div>
              <span className="text-lg font-black" style={{ color: '#EAB308' }}>
                {nodes.reduce((acc, n) => acc + n.connections.length, 0)}
              </span>
              <span className="text-[10px] text-gray-500 ml-1">Links</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
