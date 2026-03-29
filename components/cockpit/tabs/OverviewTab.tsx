'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp, 
  Activity, 
  Zap, 
  Shield, 
  AlertTriangle, 
  Target,
  ArrowUp,
  ArrowDown,
  Globe,
  Cpu,
  Database,
  Wifi,
  Radar,
  Brain,
  Eye
} from 'lucide-react'

interface OverviewTabProps {
  data: {
    clawScore: number
    activeThreats: number
    executionsToday: number
    myceliumNodes: number
    successRate: number
  }
  isShadowed: boolean
}

export function OverviewTab({ data, isShadowed }: OverviewTabProps) {
  const [animatedValues, setAnimatedValues] = useState({
    clawScore: 0,
    activeThreats: 0,
    executionsToday: 0,
    myceliumNodes: 0,
    successRate: 0
  })
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [threatLevel, setThreatLevel] = useState(75)
  const [systemPulse, setSystemPulse] = useState(0)

  // Animate numbers on mount
  useEffect(() => {
    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      
      setAnimatedValues({
        clawScore: Math.floor(data.clawScore * progress),
        activeThreats: Math.floor(data.activeThreats * progress),
        executionsToday: Math.floor(data.executionsToday * progress),
        myceliumNodes: Math.floor(data.myceliumNodes * progress),
        successRate: Math.floor(data.successRate * progress)
      })

      if (currentStep >= steps) {
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [data])

  // NASA-Style Threat Gauge Animation
  useEffect(() => {
    const interval = setInterval(() => {
      setThreatLevel(prev => {
        const change = (Math.random() - 0.5) * 10
        const newValue = prev + change
        return Math.max(0, Math.min(100, newValue))
      })
      setSystemPulse(prev => (prev + 0.1) % (Math.PI * 2))
    }, 100)

    return () => clearInterval(interval)
  }, [])

  // Draw Threat Gauge
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    canvas.width = 300
    canvas.height = 200
    
    const drawGauge = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw gauge arc
      const centerX = canvas.width / 2
      const centerY = canvas.height - 50
      const radius = 100
      
      // Background arc
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, Math.PI, 0, false)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.lineWidth = 20
      ctx.stroke()
      
      // Threat level arc with gradient
      const gradient = ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY)
      if (threatLevel < 30) {
        gradient.addColorStop(0, '#00FF9F')
        gradient.addColorStop(1, '#00D4FF')
      } else if (threatLevel < 70) {
        gradient.addColorStop(0, '#F59E0B')
        gradient.addColorStop(1, '#F59E0B')
      } else {
        gradient.addColorStop(0, '#FF0033')
        gradient.addColorStop(1, '#FF0033')
      }
      
      ctx.beginPath()
      const endAngle = Math.PI + (Math.PI * threatLevel / 100)
      ctx.arc(centerX, centerY, radius, Math.PI, endAngle, false)
      ctx.strokeStyle = gradient
      ctx.lineWidth = 20
      ctx.stroke()
      
      // Draw needle
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(endAngle - Math.PI)
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(0, -radius + 30)
      ctx.strokeStyle = '#FFFFFF'
      ctx.lineWidth = 3
      ctx.stroke()
      ctx.restore()
      
      // Draw center dot
      ctx.beginPath()
      ctx.arc(centerX, centerY, 8, 0, Math.PI * 2)
      ctx.fillStyle = '#FF0033'
      ctx.fill()
      
      // Draw text
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 24px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(`${Math.round(threatLevel)}%`, centerX, centerY - 40)
      
      ctx.font = '12px monospace'
      ctx.fillStyle = '#00FF9F'
      ctx.fillText('THREAT LEVEL', centerX, centerY + 20)
    }
    
    drawGauge()
  }, [threatLevel])

  const metrics = [
    {
      title: 'Claw Score',
      value: animatedValues.clawScore,
      icon: Target,
      color: 'from-red-500 to-orange-500',
      trend: { value: 12, isUp: true },
      unit: ''
    },
    {
      title: 'Active Threats',
      value: animatedValues.activeThreats,
      icon: AlertTriangle,
      color: 'from-yellow-500 to-red-500',
      trend: { value: 3, isUp: false },
      unit: ''
    },
    {
      title: 'Executions Today',
      value: animatedValues.executionsToday,
      icon: Zap,
      color: 'from-cyan-500 to-blue-500',
      trend: { value: 28, isUp: true },
      unit: ''
    },
    {
      title: 'Mycelium Nodes',
      value: animatedValues.myceliumNodes,
      icon: Activity,
      color: 'from-green-500 to-emerald-500',
      trend: { value: 5, isUp: true },
      unit: ''
    },
    {
      title: 'Success Rate',
      value: animatedValues.successRate,
      icon: Shield,
      color: 'from-purple-500 to-pink-500',
      trend: { value: 2, isUp: true },
      unit: '%'
    }
  ]

  const systemStatus = [
    { name: 'Global Network', status: 'online', icon: Globe, color: 'text-green-400' },
    { name: 'CPU Usage', status: 'optimal', icon: Cpu, color: 'text-cyan-400' },
    { name: 'Database', status: 'synced', icon: Database, color: 'text-purple-400' },
    { name: 'API Gateway', status: 'active', icon: Wifi, color: 'text-blue-400' }
  ]

  const recentActivity = [
    { time: '2 min ago', action: 'Threat detected and neutralized', severity: 'high' },
    { time: '5 min ago', action: 'Mycelium node synchronized', severity: 'low' },
    { time: '12 min ago', action: 'Automated backup completed', severity: 'medium' },
    { time: '18 min ago', action: 'Security scan initiated', severity: 'medium' },
    { time: '25 min ago', action: 'Performance optimization applied', severity: 'low' }
  ]

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Central ClawScore Ring with NASA-Style Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* ClawScore Ring */}
            <div className="relative flex justify-center">
              <motion.div
                className="relative w-48 h-48"
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                {/* Outer Ring */}
                <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20" />
                
                {/* Animated Progress Ring */}
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <motion.circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: animatedValues.clawScore / 1000 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FF0033" />
                      <stop offset="50%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#00FF9F" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.div
                    className="text-4xl font-bold text-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {animatedValues.clawScore}
                  </motion.div>
                  <div className="text-xs text-cyan-400 uppercase tracking-wider">Claw Score</div>
                </div>
                
                {/* Pulsing Glow */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{
                    boxShadow: [
                      '0 0 30px rgba(255, 0, 51, 0.3)',
                      '0 0 60px rgba(255, 0, 51, 0.1)',
                      '0 0 30px rgba(255, 0, 51, 0.3)',
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </div>
            
            {/* NASA-Style Threat Gauge */}
            <div className="flex justify-center">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  className="rounded-lg"
                />
                <motion.div
                  className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-500"
                  animate={{
                    opacity: [1, 0.5, 1],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </div>
            
            {/* Live Stats */}
            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4 border border-cyan-500/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 uppercase">System Pulse</span>
                  <Brain className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-bold text-cyan-400">
                  {Math.round(Math.sin(systemPulse) * 50 + 50)}%
                </div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4 border border-cyan-500/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 uppercase">Active Nodes</span>
                  <Activity className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-green-400">
                  {animatedValues.myceliumNodes}
                </div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4 border border-cyan-500/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 uppercase">Success Rate</span>
                  <Shield className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-purple-400">
                  {animatedValues.successRate}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-4 hover:border-cyan-500/40 transition-all">
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity`} />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-5 h-5 text-cyan-400" />
                    <div className={`flex items-center gap-1 text-xs ${
                      metric.trend.isUp ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {metric.trend.isUp ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                      {metric.trend.value}%
                    </div>
                  </div>
                  
                  <div className="text-2xl font-bold text-white mb-1">
                    {metric.value.toLocaleString()}{metric.unit}
                  </div>
                  
                  <div className="text-xs text-gray-400">
                    {metric.title}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* System Status & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            System Status
          </h3>
          
          <div className="space-y-3">
            {systemStatus.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-cyan-500/10"
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${item.color}`} />
                    <span className="text-sm text-gray-300">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-green-400 capitalize">{item.status}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Activity
          </h3>
          
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-cyan-500/10"
              >
                <div className={`w-2 h-2 rounded-full mt-1.5 ${
                  activity.severity === 'high' ? 'bg-red-400' :
                  activity.severity === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-300">{activity.action}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Performance Chart Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Performance Overview
        </h3>
        
        <div className="h-64 flex items-center justify-center border border-cyan-500/10 rounded-lg bg-white/5">
          <div className="text-center">
            <div className="text-4xl font-bold text-cyan-400 mb-2">98.5%</div>
            <div className="text-sm text-gray-400">Overall System Health</div>
            <div className="text-xs text-gray-500 mt-2">Real-time monitoring active</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
