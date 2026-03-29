'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export function ThreatLevelGauge() {
  const [threatLevel, setThreatLevel] = useState(0)
  const [status, setStatus] = useState<'low' | 'medium' | 'high' | 'critical'>('low')

  useEffect(() => {
    // Simulate real-time threat level updates
    const interval = setInterval(() => {
      const newLevel = Math.random() * 100
      setThreatLevel(newLevel)
      
      if (newLevel < 25) setStatus('low')
      else if (newLevel < 50) setStatus('medium')
      else if (newLevel < 75) setStatus('high')
      else setStatus('critical')
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = () => {
    switch (status) {
      case 'low': return 'rgb(34, 197, 94)'
      case 'medium': return 'rgb(251, 191, 36)'
      case 'high': return 'rgb(249, 115, 22)'
      case 'critical': return 'rgb(239, 68, 68)'
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
      {/* Gauge Container */}
      <div className="relative w-16 h-8">
        {/* Gauge Background */}
        <svg className="w-full h-full" viewBox="0 0 64 32">
          {/* Background Arc */}
          <path
            d="M 8 24 A 24 24 0 0 1 56 24"
            fill="none"
            stroke="rgb(55, 65, 81)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          
          {/* Threat Level Arc */}
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
        
        {/* Center Dot */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
          style={{ backgroundColor: getStatusColor() }}
          animate={{
            boxShadow: `0 0 10px ${getStatusColor()}`
          }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>

      {/* Status Text */}
      <div className="flex flex-col">
        <motion.span
          className="text-xs font-bold"
          style={{ color: getStatusColor() }}
          key={status}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {getStatusText()}
        </motion.span>
        <span className="text-xs text-gray-400">Threat Level</span>
      </div>
    </div>
  )
}
