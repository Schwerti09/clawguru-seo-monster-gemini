'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { UserTier } from '@/lib/tier-access'

interface MyceliumMinimapProps {
  tier: UserTier
}

export function MyceliumMinimap({ tier }: MyceliumMinimapProps) {
  const [nodes, setNodes] = useState<Array<{ id: string; x: number; y: number; type: string; strength: number }>>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  useEffect(() => {
    // Simulate real-time Mycelium network data
    const interval = setInterval(() => {
      const newNodes = Array.from({ length: 20 }, (_, i) => ({
        id: `node-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        type: ['threat', 'runbook', 'oracle', 'neuro'][Math.floor(Math.random() * 4)],
        strength: Math.random()
      }))
      setNodes(newNodes)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'threat': return 'rgb(239, 68, 68)'
      case 'runbook': return 'rgb(34, 197, 94)'
      case 'oracle': return 'rgb(59, 130, 246)'
      case 'neuro': return 'rgb(168, 85, 247)'
      default: return 'rgb(156, 163, 175)'
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-800/50">
        <h3 className="text-lg font-semibold text-white mb-1">Mycelium Network</h3>
        <p className="text-xs text-gray-400">
          {tier === 'explorer' ? 'Preview Mode' : 'Live Network'}
        </p>
      </div>

      {/* Minimap Canvas */}
      <div className="flex-1 relative p-4">
        <div className="w-full h-full bg-gray-900/50 rounded-lg border border-gray-800/50 relative overflow-hidden">
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(10)].map((_, i) => (
              <div key={`h-${i}`} className="absolute w-full border-t border-gray-800" style={{ top: `${i * 10}%` }} />
            ))}
            {[...Array(10)].map((_, i) => (
              <div key={`v-${i}`} className="absolute h-full border-l border-gray-800" style={{ left: `${i * 10}%` }} />
            ))}
          </div>

          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full">
            {nodes.map((node, i) => 
              nodes.slice(i + 1).map((otherNode, j) => {
                const distance = Math.sqrt(
                  Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
                )
                if (distance < 30) {
                  return (
                    <line
                      key={`${i}-${j}`}
                      x1={`${node.x}%`}
                      y1={`${node.y}%`}
                      x2={`${otherNode.x}%`}
                      y2={`${otherNode.y}%`}
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeWidth="1"
                    />
                  )
                }
                return null
              })
            )}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => (
            <motion.div
              key={node.id}
              className="absolute w-3 h-3 rounded-full cursor-pointer"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                backgroundColor: getNodeColor(node.type),
                transform: 'translate(-50%, -50%)'
              }}
              animate={{
                scale: selectedNode === node.id ? 1.5 : 1,
                boxShadow: selectedNode === node.id ? `0 0 20px ${getNodeColor(node.type)}` : 'none'
              }}
              whileHover={{ scale: 1.3 }}
              onClick={() => setSelectedNode(node.id)}
            />
          ))}

          {/* Shadow Overlay for Explorer Tier */}
          {tier === 'explorer' && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">🔒</div>
                <p className="text-xs text-gray-400">Upgrade to view live network</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Node Info */}
      <div className="p-4 border-t border-gray-800/50">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-gray-400">Threats</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-gray-400">Runbooks</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-gray-400">Oracle</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-gray-400">Neuro</span>
            </div>
          </div>
          <div className="text-gray-400">
            {nodes.length} nodes
          </div>
        </div>
      </div>
    </div>
  )
}
