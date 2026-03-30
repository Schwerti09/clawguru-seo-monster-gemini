'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'

interface ThreatLevelGaugeProps {
  activeThreats: number
}

export function ThreatLevelGauge({ activeThreats }: ThreatLevelGaugeProps) {
  // Derive threat level from real active threats count
  const { threatLevel, status } = useMemo(() => {
    let level: number
    let s: 'low' | 'medium' | 'high' | 'critical'
    if (activeThreats === 0) { level = 5; s = 'low' }
    else if (activeThreats <= 3) { level = 20; s = 'low' }
    else if (activeThreats <= 10) { level = 45; s = 'medium' }
    else if (activeThreats <= 25) { level = 70; s = 'high' }
    else { level = 90; s = 'critical' }
    return { threatLevel: level, status: s }
  }, [activeThreats])

  const getStatusColor = () => {
    switch (status) {
      case 'low': return '#A1A1AA'
      case 'medium': return '#EAB308'
      case 'high': return '#D4A017'
      case 'critical': return '#EF4444'
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'low': return 'LOW'
      case 'medium': return 'MEDIUM'
      case 'high': return 'HIGH'
      case 'critical': return 'CRITICAL'
    }
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-16 h-8">
        <svg className="w-full h-full" viewBox="0 0 64 32">
          <path d="M 8 24 A 24 24 0 0 1 56 24" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" strokeLinecap="round" />
          <motion.path
            d="M 8 24 A 24 24 0 0 1 56 24"
            fill="none"
            stroke={getStatusColor()}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${threatLevel * 1.5} 150`}
            initial={{ strokeDasharray: '0 150' }}
            animate={{ strokeDasharray: `${threatLevel * 1.5} 150` }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: getStatusColor() }}
          animate={{ boxShadow: `0 0 8px ${getStatusColor()}` }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>
      <div className="flex flex-col">
        <motion.span
          className="text-[10px] font-bold tracking-wider"
          style={{ color: getStatusColor() }}
          key={status}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {getStatusText()}
        </motion.span>
        <span className="text-[10px] text-gray-600">Threat Level</span>
      </div>
    </div>
  )
}
