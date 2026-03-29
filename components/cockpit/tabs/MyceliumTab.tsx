'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Activity, Zap, Shield, Database, Globe, Cpu, Wifi, AlertTriangle, Settings, Lock, Eye, Download, RotateCcw } from 'lucide-react'

interface MyceliumTabProps {
  isShadowed: boolean
}

export function MyceliumTab({ isShadowed }: MyceliumTabProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const [hoveredNode, setHoveredNode] = useState<any>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Generate Mycelium network data
    const nodes = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 3 + 2,
      type: ['threat', 'runbook', 'oracle', 'neuro'][Math.floor(Math.random() * 4)],
      connections: []
    }))

    // Create connections
    nodes.forEach((node, i) => {
      nodes.slice(i + 1).forEach(otherNode => {
        const distance = Math.sqrt(
          Math.pow(node.x - otherNode.x, 2) + 
          Math.pow(node.y - otherNode.y, 2)
        )
        if (distance < 150) {
          node.connections.push(otherNode.id)
        }
      })
    })

    // Animation loop
    let animationId: number
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update node positions
      nodes.forEach(node => {
        node.x += node.vx
        node.y += node.vy

        // Bounce off walls
        if (node.x < node.radius || node.x > canvas.width - node.radius) {
          node.vx *= -1
        }
        if (node.y < node.radius || node.y > canvas.height - node.radius) {
          node.vy *= -1
        }
      })

      // Draw connections
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.lineWidth = 1
      nodes.forEach(node => {
        node.connections.forEach(targetId => {
          const target = nodes[targetId]
          if (target) {
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(target.x, target.y)
            ctx.stroke()
          }
        })
      })

      // Draw nodes
      nodes.forEach(node => {
        const getNodeColor = (type: string) => {
          switch (type) {
            case 'threat': return 'rgb(239, 68, 68)'
            case 'runbook': return 'rgb(34, 197, 94)'
            case 'oracle': return 'rgb(59, 130, 246)'
            case 'neuro': return 'rgb(168, 85, 247)'
            default: return 'rgb(156, 163, 175)'
          }
        }

        ctx.fillStyle = getNodeColor(node.type)
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fill()

        // Glow effect for hovered node
        if (hoveredNode?.id === node.id) {
          ctx.shadowBlur = 20
          ctx.shadowColor = getNodeColor(node.type)
          ctx.fill()
          ctx.shadowBlur = 0
        }
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [hoveredNode])

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isShadowed) return
    
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Find clicked node (simplified)
    console.log('Canvas clicked at', x, y)
  }

  return (
    <div className="h-full relative">
      {/* Canvas Container */}
      <div className="absolute inset-0">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          onClick={handleCanvasClick}
        />
      </div>

      {/* Shadow Overlay */}
      {isShadowed && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="text-6xl mb-4">🧠</div>
            <h3 className="text-2xl font-bold text-white mb-2">Living Mycelium Network</h3>
            <p className="text-gray-400 mb-6 max-w-md">
              Experience the real-time security graph that connects threats, runbooks, 
              and intelligence across the entire ClawGuru ecosystem.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span>Threats</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span>Runbooks</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span>Oracle</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span>Neuro</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Node Info Panel */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-4 right-4 w-80 bg-gray-900/90 backdrop-blur-xl rounded-lg border border-gray-800/50 p-4 z-20"
        >
          <h4 className="font-semibold text-white mb-2">Node Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Type:</span>
              <span className="text-white">{selectedNode.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Connections:</span>
              <span className="text-white">{selectedNode.connections?.length || 0}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Controls */}
      <div className="absolute bottom-4 left-4 flex gap-2 z-20">
        <button className="px-3 py-2 bg-gray-900/90 backdrop-blur-xl rounded-lg border border-gray-800/50 text-sm text-white hover:bg-gray-800/90 transition-colors">
          Reset View
        </button>
        <button className="px-3 py-2 bg-gray-900/90 backdrop-blur-xl rounded-lg border border-gray-800/50 text-sm text-white hover:bg-gray-800/90 transition-colors">
          Export Graph
        </button>
      </div>
    </div>
  )
}
