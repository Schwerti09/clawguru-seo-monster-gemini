'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Zap, 
  Brain, 
  Shield, 
  Radar, 
  Play, 
  Pause, 
  RotateCcw,
  Activity,
  Cpu,
  Database,
  Wifi,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  Sparkles,
  Target,
  Lock
} from 'lucide-react'

interface ToolsTabProps {
  isShadowed: boolean
}

export function ToolsTab({ isShadowed }: ToolsTabProps) {
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const [executionProgress, setExecutionProgress] = useState(0)
  const [executionStatus, setExecutionStatus] = useState<'idle' | 'running' | 'completed' | 'error'>('idle')
  const [hoveredTool, setHoveredTool] = useState<string | null>(null)

  const tools = [
    {
      id: 'summon',
      name: 'ClawGuru Summon',
      description: 'Instant security analysis with AI-powered threat detection',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      features: ['Real-time Analysis', 'Threat Intelligence', 'Automated Response'],
      status: 'ready',
      executionTime: '2-5 min',
      lastUsed: '2 hours ago',
      successRate: 98.5,
      category: 'Offensive'
    },
    {
      id: 'oracle',
      name: 'Security Oracle',
      description: 'Predictive security insights powered by advanced ML models',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      features: ['72h Forecast', 'Risk Assessment', 'Strategic Planning'],
      status: 'ready',
      executionTime: '5-10 min',
      lastUsed: '1 day ago',
      successRate: 96.2,
      category: 'Intelligence'
    },
    {
      id: 'neuro',
      name: 'Neuro Security',
      description: 'Neural network-based security pattern recognition',
      icon: Activity,
      color: 'from-blue-500 to-cyan-500',
      features: ['Pattern Detection', 'Anomaly Recognition', 'Learning System'],
      status: 'ready',
      executionTime: '3-7 min',
      lastUsed: '3 hours ago',
      successRate: 94.8,
      category: 'Defensive'
    },
    {
      id: 'check',
      name: 'Security Check',
      description: 'Comprehensive security audit and vulnerability assessment',
      icon: Shield,
      color: 'from-green-500 to-emerald-500',
      features: ['Full Audit', 'Compliance Check', 'Remediation Guide'],
      status: 'ready',
      executionTime: '10-15 min',
      lastUsed: '6 hours ago',
      successRate: 99.1,
      category: 'Audit'
    }
  ]

  const handleToolExecute = (toolId: string) => {
    if (isShadowed) return
    setActiveTool(toolId)
    setExecutionStatus('running')
    setExecutionProgress(0)
    
    // Simulate execution progress
    const interval = setInterval(() => {
      setExecutionProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setExecutionStatus('completed')
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 500)
    
    // Auto-complete after 3 seconds
    setTimeout(() => {
      setExecutionStatus('completed')
      setExecutionProgress(100)
      clearInterval(interval)
    }, 3000)
  }

  const handleStopExecution = () => {
    setExecutionStatus('idle')
    setExecutionProgress(0)
    setActiveTool(null)
  }

  const handleResetExecution = () => {
    setExecutionStatus('idle')
    setExecutionProgress(0)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">Tools Command Center</h2>
            <p className="text-gray-400 text-lg">
              Execute security tools with one click. Real-time results powered by ClawGuru AI.
            </p>
          </div>
        </div>
        
        {/* Global Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 text-cyan-400 mb-1">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs uppercase">Active Tools</span>
            </div>
            <div className="text-2xl font-bold text-white">{tools.length}</div>
          </div>
          <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-400 mb-1">
              <Activity className="w-4 h-4" />
              <span className="text-xs uppercase">Avg Success Rate</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {Math.round(tools.reduce((acc, tool) => acc + tool.successRate, 0) / tools.length)}%
            </div>
          </div>
          <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 text-purple-400 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs uppercase">Last Execution</span>
            </div>
            <div className="text-2xl font-bold text-white">2h</div>
          </div>
          <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 text-orange-400 mb-1">
              <Target className="w-4 h-4" />
              <span className="text-xs uppercase">Total Runs</span>
            </div>
            <div className="text-2xl font-bold text-white">247</div>
          </div>
        </div>
      </motion.div>

      {/* Tools Grid */}
      <div className="grid grid-cols-2 gap-6">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative group cursor-pointer ${
              isShadowed ? 'pointer-events-none' : ''
            }`}
            onClick={() => handleToolExecute(tool.id)}
          >
            {/* Tool Card */}
            <div className={`relative p-6 rounded-2xl border transition-all ${
              isShadowed
                ? 'bg-gray-900/30 border-gray-800/30'
                : 'bg-gray-900/50 border-gray-800/50 hover:border-gray-700/50'
            } backdrop-blur-xl`}>
              {/* Shadow Overlay */}
              {isShadowed && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl" />
              )}

              <div className="relative">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center`}>
                      <tool.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{tool.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                          tool.status === 'ready' 
                            ? 'bg-green-500/20 text-green-500' 
                            : 'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          {tool.status}
                        </div>
                        <div className="text-xs text-gray-400">{tool.category}</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Success Rate</div>
                    <div className="text-lg font-bold text-green-400">{tool.successRate}%</div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-400 mb-4">{tool.description}</p>

                {/* Tool Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs">Execution Time</span>
                    </div>
                    <div className="text-sm font-semibold text-white">{tool.executionTime}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <Activity className="w-3 h-3" />
                      <span className="text-xs">Last Used</span>
                    </div>
                    <div className="text-sm font-semibold text-white">{tool.lastUsed}</div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {tool.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="text-green-500">✓</span>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Execute Button */}
                <motion.button
                  className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    isShadowed
                      ? 'bg-gray-800 text-gray-600'
                      : `bg-gradient-to-r ${tool.color} text-white hover:opacity-90`
                  }`}
                  whileHover={!isShadowed ? { scale: 1.02 } : {}}
                  whileTap={!isShadowed ? { scale: 0.98 } : {}}
                  disabled={isShadowed}
                >
                  {isShadowed ? (
                    <>
                      <Lock className="w-4 h-4" />
                      Upgrade Required
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Execute Tool
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Hover Effect */}
            {!isShadowed && (
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{ zIndex: -1 }}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Active Tool Execution Panel */}
      <AnimatePresence>
        {activeTool && !isShadowed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8 p-6 bg-black/40 backdrop-blur-xl rounded-2xl border border-cyan-500/20"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  {(() => {
                    const tool = tools.find(t => t.id === activeTool)
                    const IconComponent = tool?.icon
                    return IconComponent ? <IconComponent className="w-6 h-6 text-white" /> : null
                  })()}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Executing: {tools.find(t => t.id === activeTool)?.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${
                      executionStatus === 'running' ? 'bg-green-500 animate-pulse' :
                      executionStatus === 'completed' ? 'bg-blue-500' :
                      executionStatus === 'error' ? 'bg-red-500' : 'bg-gray-500'
                    }`} />
                    <span className={`text-sm capitalize ${
                      executionStatus === 'running' ? 'text-green-500' :
                      executionStatus === 'completed' ? 'text-blue-500' :
                      executionStatus === 'error' ? 'text-red-500' : 'text-gray-500'
                    }`}>
                      {executionStatus}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {executionStatus === 'running' && (
                  <motion.button
                    onClick={handleStopExecution}
                    className="px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Pause className="w-4 h-4" />
                    Stop
                  </motion.button>
                )}
                
                {executionStatus === 'completed' && (
                  <motion.button
                    onClick={handleResetExecution}
                    className="px-4 py-2 bg-cyan-500/20 text-cyan-500 rounded-lg hover:bg-cyan-500/30 transition-colors flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </motion.button>
                )}
                
                <button
                  onClick={() => setActiveTool(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            
            {/* Progress Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Execution Progress</span>
                <span className="text-cyan-400 font-semibold">{Math.round(executionProgress)}%</span>
              </div>
              
              <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full relative"
                  style={{ width: `${executionProgress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </motion.div>
              </div>
              
              {/* Execution Details */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-cyan-400 mb-1">
                    <Cpu className="w-3 h-3" />
                    <span className="text-xs">CPU Usage</span>
                  </div>
                  <div className="text-lg font-bold text-white">
                    {Math.round(Math.sin(Date.now() / 1000) * 20 + 45)}%
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-green-400 mb-1">
                    <Database className="w-3 h-3" />
                    <span className="text-xs">Memory</span>
                  </div>
                  <div className="text-lg font-bold text-white">
                    {Math.round(Math.sin(Date.now() / 1500) * 15 + 60)}%
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-purple-400 mb-1">
                    <Wifi className="w-3 h-3" />
                    <span className="text-xs">Network</span>
                  </div>
                  <div className="text-lg font-bold text-white">
                    {Math.round(Math.sin(Date.now() / 2000) * 25 + 35)}%
                  </div>
                </div>
              </div>
              
              {/* Results Preview */}
              {executionStatus === 'completed' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-green-500 font-semibold">Execution Completed Successfully</span>
                  </div>
                  <div className="text-sm text-gray-300">
                    Tool execution completed in 2.3 seconds. Found 3 potential threats and 2 optimization opportunities.
                  </div>
                </motion.div>
              )}
              
              {executionStatus === 'running' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-cyan-500 animate-pulse" />
                    <span className="text-cyan-500 font-semibold">Analyzing Security Patterns...</span>
                  </div>
                  <div className="text-sm text-gray-300">
                    Currently scanning system vulnerabilities and threat vectors. Results will appear here.
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
