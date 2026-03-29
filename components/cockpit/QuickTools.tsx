'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserTier } from '@/lib/tier-access'

interface QuickToolsProps {
  tier: UserTier
}

export function QuickTools({ tier }: QuickToolsProps) {
  const [activeTool, setActiveTool] = useState<string | null>(null)

  const tools = [
    { id: 'summon', icon: '⚡', label: 'Summon', color: 'from-yellow-500 to-orange-500' },
    { id: 'oracle', icon: '🔮', label: 'Oracle', color: 'from-purple-500 to-pink-500' },
    { id: 'neuro', icon: '🧠', label: 'Neuro', color: 'from-blue-500 to-cyan-500' },
    { id: 'check', icon: '🛡️', label: 'Check', color: 'from-green-500 to-emerald-500' }
  ]

  const canAccessTool = (toolId: string) => {
    if (tier === 'explorer') return false
    if (tier === 'daypass' || tier === 'pro' || tier === 'enterprise') return true
    return false
  }

  return (
    <div className="h-full flex flex-col py-4">
      {/* Header */}
      <div className="px-3 mb-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Quick Tools</h3>
      </div>

      {/* Tool Buttons */}
      <div className="flex-1 flex flex-col gap-3 px-3">
        {tools.map((tool) => {
          const isAccessible = canAccessTool(tool.id)
          const isActive = activeTool === tool.id
          
          return (
            <motion.button
              key={tool.id}
              className={`relative w-14 h-14 rounded-xl flex flex-col items-center justify-center transition-all ${
                isAccessible 
                  ? `bg-gradient-to-br ${tool.color} text-white` 
                  : 'bg-gray-800 text-gray-600'
              }`}
              whileHover={isAccessible ? { scale: 1.05 } : { scale: 1 }}
              whileTap={isAccessible ? { scale: 0.95 } : { scale: 1 }}
              onClick={() => isAccessible && setActiveTool(isActive ? null : tool.id)}
              disabled={!isAccessible}
            >
              {/* Tool Icon */}
              <span className="text-xl mb-1">{tool.icon}</span>
              
              {/* Tool Label */}
              <span className="text-xs font-medium">{tool.label}</span>
              
              {/* Active Indicator */}
              {isActive && isAccessible && (
                <motion.div
                  className="absolute inset-0 rounded-xl border-2 border-white"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                />
              )}
              
              {/* Locked Overlay */}
              {!isAccessible && (
                <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                  <span className="text-xs">🔒</span>
                </div>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Tool Preview Panel */}
      <AnimatePresence>
        {activeTool && canAccessTool(activeTool) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-full left-0 right-0 mb-2 p-3 bg-gray-900/95 backdrop-blur-xl rounded-lg border border-gray-800/50"
          >
            <div className="text-center">
              <div className="text-2xl mb-1">
                {tools.find(t => t.id === activeTool)?.icon}
              </div>
              <div className="text-xs font-medium text-white mb-1">
                {tools.find(t => t.id === activeTool)?.label}
              </div>
              <div className="text-xs text-gray-400">
                Click to activate
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Spacer */}
      <div className="h-4" />
    </div>
  )
}
