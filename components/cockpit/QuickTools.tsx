'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserTier } from '@/lib/tier-access'
import { Lock } from 'lucide-react'

interface QuickToolsProps {
  tier: UserTier
}

export function QuickTools({ tier }: QuickToolsProps) {
  const [activeTool, setActiveTool] = useState<string | null>(null)

  const tools = [
    { id: 'summon', icon: '⚡', label: 'Summon' },
    { id: 'oracle', icon: '🔮', label: 'Oracle' },
    { id: 'neuro', icon: '🧠', label: 'Neuro' },
    { id: 'check', icon: '🛡️', label: 'Check' }
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
        <h3 className="text-[10px] font-semibold text-gray-600 uppercase tracking-[0.15em]">Quick Tools</h3>
      </div>

      {/* Tool Buttons */}
      <div className="flex-1 flex flex-col gap-2.5 px-3">
        {tools.map((tool) => {
          const isAccessible = canAccessTool(tool.id)
          const isActive = activeTool === tool.id

          return (
            <motion.button
              key={tool.id}
              className="relative w-14 h-14 rounded-xl flex flex-col items-center justify-center transition-all border"
              style={
                isAccessible
                  ? {
                      background: isActive ? 'rgba(234,179,8,0.12)' : 'rgba(234,179,8,0.04)',
                      borderColor: isActive ? 'rgba(234,179,8,0.3)' : 'rgba(255,255,255,0.06)',
                      color: isActive ? '#EAB308' : '#A1A1AA'
                    }
                  : {
                      background: 'rgba(255,255,255,0.02)',
                      borderColor: 'rgba(255,255,255,0.04)',
                      color: '#3F3F46'
                    }
              }
              whileHover={isAccessible ? { scale: 1.05, borderColor: 'rgba(234,179,8,0.2)' } : {}}
              whileTap={isAccessible ? { scale: 0.95 } : {}}
              onClick={() => isAccessible && setActiveTool(isActive ? null : tool.id)}
              disabled={!isAccessible}
            >
              <span className="text-lg mb-0.5">{tool.icon}</span>
              <span className="text-[9px] font-medium">{tool.label}</span>

              {isActive && isAccessible && (
                <motion.div
                  className="absolute inset-0 rounded-xl border"
                  style={{ borderColor: 'rgba(234,179,8,0.4)', boxShadow: '0 0 12px rgba(234,179,8,0.1)' }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                />
              )}

              {!isAccessible && (
                <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                  <Lock className="w-3 h-3" style={{ color: '#EAB308', opacity: 0.4 }} />
                </div>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Preview */}
      <AnimatePresence>
        {activeTool && canAccessTool(activeTool) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-0 right-0 mb-2 p-3 rounded-xl border"
            style={{ background: 'rgba(10,10,10,0.95)', borderColor: 'rgba(234,179,8,0.15)', backdropFilter: 'blur(20px)' }}
          >
            <div className="text-center">
              <div className="text-xl mb-1">{tools.find(t => t.id === activeTool)?.icon}</div>
              <div className="text-[11px] font-medium text-white mb-0.5">{tools.find(t => t.id === activeTool)?.label}</div>
              <div className="text-[10px] text-gray-600">Klicken zum Aktivieren</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-4" />
    </div>
  )
}
