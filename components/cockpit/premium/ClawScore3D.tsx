'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function ScoreRing({ score, maxScore = 1000 }: { score: number; maxScore?: number }) {
  const ringRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const sphereRef = useRef<THREE.Mesh>(null)
  const progress = score / maxScore

  const particlePositions = useMemo(() => {
    const positions = new Float32Array(200 * 3)
    for (let i = 0; i < 200; i++) {
      const angle = (i / 200) * Math.PI * 2
      const radius = 1.8 + Math.random() * 0.4
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = Math.sin(angle) * radius
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3
    }
    return positions
  }, [])

  const ringGeometry = useMemo(() => {
    const shape = new THREE.Shape()
    const outerRadius = 1.6
    const innerRadius = 1.35
    const segments = 64
    const arcLength = Math.PI * 2 * progress

    for (let i = 0; i <= segments; i++) {
      const angle = -Math.PI / 2 + (i / segments) * arcLength
      const x = Math.cos(angle) * outerRadius
      const y = Math.sin(angle) * outerRadius
      if (i === 0) shape.moveTo(x, y)
      else shape.lineTo(x, y)
    }
    for (let i = segments; i >= 0; i--) {
      const angle = -Math.PI / 2 + (i / segments) * arcLength
      const x = Math.cos(angle) * innerRadius
      const y = Math.sin(angle) * innerRadius
      shape.lineTo(x, y)
    }
    shape.closePath()

    return new THREE.ShapeGeometry(shape)
  }, [progress])

  const bgRingGeometry = useMemo(() => {
    const shape = new THREE.Shape()
    const outerRadius = 1.6
    const innerRadius = 1.35
    const segments = 64

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      const x = Math.cos(angle) * outerRadius
      const y = Math.sin(angle) * outerRadius
      if (i === 0) shape.moveTo(x, y)
      else shape.lineTo(x, y)
    }
    for (let i = segments; i >= 0; i--) {
      const angle = (i / segments) * Math.PI * 2
      const x = Math.cos(angle) * innerRadius
      const y = Math.sin(angle) * innerRadius
      shape.lineTo(x, y)
    }
    shape.closePath()

    return new THREE.ShapeGeometry(shape)
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (ringRef.current) {
      ringRef.current.rotation.z = Math.sin(t * 0.3) * 0.02
    }
    if (glowRef.current) {
      const scale = 1 + Math.sin(t * 2) * 0.03
      glowRef.current.scale.set(scale, scale, 1)
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.z = t * 0.05
    }
    if (sphereRef.current) {
      sphereRef.current.position.y = Math.sin(t * 1.5) * 0.05
      sphereRef.current.rotation.y = t * 0.5
    }
  })

  return (
    <group>
      {/* Background Ring */}
      <mesh geometry={bgRingGeometry}>
        <meshBasicMaterial color="#1a1a1a" transparent opacity={0.6} />
      </mesh>

      {/* Score Progress Ring */}
      <mesh ref={ringRef} geometry={ringGeometry}>
        <meshBasicMaterial color="#EAB308" transparent opacity={0.9} />
      </mesh>

      {/* Gold Glow */}
      <mesh ref={glowRef} geometry={ringGeometry}>
        <meshBasicMaterial color="#EAB308" transparent opacity={0.15} />
      </mesh>

      {/* Floating Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={200}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color="#EAB308"
          transparent
          opacity={0.4}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Center Sphere - floating gold orb */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial
          color="#EAB308"
          emissive="#EAB308"
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </group>
  )
}

interface ClawScore3DProps {
  score: number
  maxScore?: number
  className?: string
}

export default function ClawScore3D({ score, maxScore = 1000, className = '' }: ClawScore3DProps) {
  return (
    <div className={`relative ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[2, 2, 5]} intensity={1} color="#EAB308" />
        <pointLight position={[-2, -2, 5]} intensity={0.5} color="#A1A1AA" />
        <ScoreRing score={score} maxScore={maxScore} />
      </Canvas>

      {/* Score Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-5xl font-black text-white tracking-tight" style={{ textShadow: '0 0 40px rgba(234,179,8,0.4)' }}>
          {score}
        </div>
        <div className="text-xs font-semibold tracking-[0.3em] uppercase mt-1" style={{ color: '#EAB308' }}>
          Claw Score
        </div>
        <div className="text-[10px] text-gray-500 mt-1">
          von {maxScore}
        </div>
      </div>
    </div>
  )
}
