'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { UserTier } from '@/lib/tier-access'
import { Lock } from 'lucide-react'
import type { DashboardNode } from '@/types/dashboard'

interface MyceliumMinimapProps {
  tier: UserTier
  dbNodes: DashboardNode[]
}

export function MyceliumMinimap({ tier, dbNodes }: MyceliumMinimapProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  // Build minimap nodes from real DB data with stable positions
  const nodes = useMemo(() => {
    if (dbNodes.length === 0) return []
    return dbNodes.map((n, i) => {
      // Generate stable position from node id hash
      const hash = n.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
      return {
        id: n.id,
        x: ((hash * 7 + i * 31) % 80) + 10,
        y: ((hash * 13 + i * 17) % 80) + 10,
        type: n.type,
        strength: n.status === 'active' ? 1 : 0.4
      }
    })
  }, [dbNodes])

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'threat': return '#EF4444'
      case 'runbook': return '#EAB308'
      case 'oracle': return '#A1A1AA'
      case 'neuro': return '#D4A017'
      default: return '#71717A'
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <h3 className="text-sm font-semibold text-white mb-0.5">Mycelium Network</h3>
        <p className="text-[10px] text-gray-600">
          {tier === 'explorer' ? 'Preview Mode' : 'Live Network'}
        </p>
      </div>

      {/* Minimap */}
      <div className="flex-1 relative p-3">
        <div
          className="w-full h-full rounded-xl relative overflow-hidden border"
          style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255,255,255,0.04)' }}
        >
          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(rgba(234,179,8,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.5) 1px, transparent 1px)', backgroundSize: '20px 20px' }}
          />

          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full">
            {nodes.map((node, i) =>
              nodes.slice(i + 1).map((otherNode, j) => {
                const distance = Math.sqrt(Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2))
                if (distance < 30) {
                  return (
                    <line key={`${i}-${j}`} x1={`${node.x}%`} y1={`${node.y}%`} x2={`${otherNode.x}%`} y2={`${otherNode.y}%`} stroke="rgba(234,179,8,0.08)" strokeWidth="1" />
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
              className="absolute w-2.5 h-2.5 rounded-full cursor-pointer"
              style={{ left: `${node.x}%`, top: `${node.y}%`, backgroundColor: getNodeColor(node.type), transform: 'translate(-50%, -50%)', boxShadow: `0 0 6px ${getNodeColor(node.type)}30` }}
              animate={{ scale: selectedNode === node.id ? 1.5 : 1, boxShadow: selectedNode === node.id ? `0 0 12px ${getNodeColor(node.type)}60` : `0 0 6px ${getNodeColor(node.type)}30` }}
              whileHover={{ scale: 1.3 }}
              onClick={() => setSelectedNode(node.id)}
            />
          ))}

          {/* Shadow Overlay */}
          {tier === 'explorer' && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <Lock className="w-5 h-5 mx-auto mb-1.5" style={{ color: '#EAB308', opacity: 0.6 }} />
                <p className="text-[10px] text-gray-600">Upgrade für Live-Netzwerk</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-3">
            {[
              { label: 'Threats', color: '#EF4444' },
              { label: 'Runbooks', color: '#EAB308' },
              { label: 'Oracle', color: '#A1A1AA' },
              { label: 'Neuro', color: '#D4A017' }
            ].map(item => (
              <div key={item.label} className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: item.color }} />
                <span className="text-gray-600">{item.label}</span>
              </div>
            ))}
          </div>
          <span className="text-gray-600">{nodes.length}</span>
        </div>
      </div>
    </div>
  )
}
