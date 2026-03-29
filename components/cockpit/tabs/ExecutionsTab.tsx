'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  Pause, 
  RotateCcw,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Download,
  Eye,
  Filter,
  Calendar,
  Cpu,
  Shield,
  Zap,
  Brain,
  Target,
  TrendingUp,
  FileText,
  Terminal,
  Settings,
  ChevronDown,
  ChevronRight
} from 'lucide-react'

interface ExecutionsTabProps {
  isShadowed: boolean
}

export function ExecutionsTab({ isShadowed }: ExecutionsTabProps) {
  const [selectedExecution, setSelectedExecution] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')
  const [timeRange, setTimeRange] = useState('24h')
  const [liveExecutions, setLiveExecutions] = useState<Set<string>>(new Set())

  // Enhanced mock execution data with more details
  const executions = [
    {
      id: 'exec-001',
      name: 'AWS SSH Hardening 2026',
      type: 'summon',
      status: 'completed',
      startTime: '2024-03-29T10:30:00Z',
      endTime: '2024-03-29T10:45:00Z',
      risk: 'low',
      output: 'Successfully hardened SSH configuration across 12 instances',
      duration: 15,
      successRate: 100,
      resourcesUsed: { cpu: 45, memory: 32, network: 12 },
      threats: 3,
      recommendations: 5,
      logs: ['[INFO] Starting SSH hardening...', '[SUCCESS] Configuration updated on instance i-12345', '[INFO] Validating security policies...']
    },
    {
      id: 'exec-002',
      name: 'Kubernetes RBAC Audit',
      type: 'oracle',
      status: 'running',
      startTime: '2024-03-29T11:00:00Z',
      endTime: null,
      risk: 'medium',
      output: null,
      duration: null,
      successRate: 85,
      resourcesUsed: { cpu: 67, memory: 58, network: 34 },
      threats: 7,
      recommendations: 12,
      logs: ['[INFO] Initializing RBAC audit...', '[SCAN] Analyzing cluster roles...', '[INFO] Checking service accounts...']
    },
    {
      id: 'exec-003',
      name: 'Docker Security Scan',
      type: 'neuro',
      status: 'failed',
      startTime: '2024-03-29T09:15:00Z',
      endTime: '2024-03-29T09:20:00Z',
      risk: 'high',
      output: 'Failed to connect to Docker daemon',
      duration: 5,
      successRate: 0,
      resourcesUsed: { cpu: 12, memory: 8, network: 2 },
      threats: 0,
      recommendations: 0,
      logs: ['[ERROR] Docker daemon not accessible', '[ERROR] Connection timeout after 30s', '[FAIL] Unable to complete scan']
    },
    {
      id: 'exec-004',
      name: 'Network Security Assessment',
      type: 'check',
      status: 'completed',
      startTime: '2024-03-29T08:00:00Z',
      endTime: '2024-03-29T08:30:00Z',
      risk: 'medium',
      output: 'Identified 12 potential vulnerabilities in network configuration',
      duration: 30,
      successRate: 92,
      resourcesUsed: { cpu: 78, memory: 65, network: 89 },
      threats: 12,
      recommendations: 8,
      logs: ['[INFO] Starting network assessment...', '[SCAN] Checking firewall rules...', '[WARN] Potential security gap detected']
    },
    {
      id: 'exec-005',
      name: 'Database Security Audit',
      type: 'oracle',
      status: 'running',
      startTime: '2024-03-29T11:30:00Z',
      endTime: null,
      risk: 'high',
      output: null,
      duration: null,
      successRate: 78,
      resourcesUsed: { cpu: 89, memory: 92, network: 45 },
      threats: 15,
      recommendations: 20,
      logs: ['[INFO] Connecting to database cluster...', '[SCAN] Analyzing user permissions...', '[INFO] Checking encryption settings...']
    }
  ]

  // Simulate live execution updates
  useEffect(() => {
    const runningExecutions = executions.filter(exec => exec.status === 'running')
    const newLiveExecutions = new Set(runningExecutions.map(exec => exec.id))
    setLiveExecutions(newLiveExecutions)

    const interval = setInterval(() => {
      setLiveExecutions(prev => {
        const updated = new Set(prev)
        // Simulate random updates to running executions
        updated.forEach(id => {
          if (Math.random() > 0.7) {
            // Randomly remove some executions to simulate completion
            if (Math.random() > 0.8) {
              updated.delete(id)
            }
          }
        })
        return updated
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-500'
      case 'medium': return 'text-yellow-500'
      case 'high': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500'
      case 'running': return 'text-blue-500'
      case 'failed': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle
      case 'running': return Activity
      case 'failed': return XCircle
      default: return Clock
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'summon': return Zap
      case 'oracle': return Brain
      case 'neuro': return Activity
      case 'check': return Shield
      default: return Terminal
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'summon': return 'from-yellow-500 to-orange-500'
      case 'oracle': return 'from-purple-500 to-pink-500'
      case 'neuro': return 'from-blue-500 to-cyan-500'
      case 'check': return 'from-green-500 to-emerald-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const filteredExecutions = executions.filter(exec => 
    filter === 'all' || exec.status === filter
  )

  return (
    <div className="p-8">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white mb-2">Executions & Runbooks</h2>
              <p className="text-gray-400 text-lg">
                Monitor and manage your security tool executions and runbook history.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <motion.button
              className="px-4 py-2 bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-lg text-white font-medium transition-all hover:border-cyan-500/40 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Calendar className="w-4 h-4" />
              Schedule
            </motion.button>
            <motion.button
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white font-medium transition-all hover:opacity-90 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Play className="w-4 h-4" />
              New Execution
            </motion.button>
          </div>
        </div>
        
        {/* Global Stats */}
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 text-cyan-400 mb-1">
              <Activity className="w-4 h-4" />
              <span className="text-xs uppercase">Running</span>
            </div>
            <div className="text-2xl font-bold text-white">{executions.filter(e => e.status === 'running').length}</div>
          </div>
          <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-400 mb-1">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs uppercase">Completed</span>
            </div>
            <div className="text-2xl font-bold text-white">{executions.filter(e => e.status === 'completed').length}</div>
          </div>
          <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-400 mb-1">
              <XCircle className="w-4 h-4" />
              <span className="text-xs uppercase">Failed</span>
            </div>
            <div className="text-2xl font-bold text-white">{executions.filter(e => e.status === 'failed').length}</div>
          </div>
          <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 text-purple-400 mb-1">
              <Target className="w-4 h-4" />
              <span className="text-xs uppercase">Success Rate</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {Math.round(executions.reduce((acc, exec) => acc + exec.successRate, 0) / executions.length)}%
            </div>
          </div>
          <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 text-orange-400 mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs uppercase">Threats Found</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {executions.reduce((acc, exec) => acc + exec.threats, 0)}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400">Filter:</span>
        </div>
        <div className="flex gap-2">
          {['all', 'running', 'completed', 'failed'].map((status) => (
            <motion.button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                filter === status
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-black/40 text-gray-400 border border-gray-700 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </motion.button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 ml-auto">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400">Time Range:</span>
        </div>
        <div className="flex gap-2">
          {['1h', '24h', '7d', '30d'].map((range) => (
            <motion.button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                timeRange === range
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'bg-black/40 text-gray-400 border border-gray-700 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {range}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Enhanced Execution List */}
      <div className="space-y-4">
        {filteredExecutions.map((execution, index) => {
          const StatusIcon = getStatusIcon(execution.status)
          const TypeIcon = getTypeIcon(execution.type)
          const isExpanded = selectedExecution === execution.id
          const isLive = liveExecutions.has(execution.id)
          
          return (
            <motion.div
              key={execution.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative group cursor-pointer ${
                isShadowed ? 'pointer-events-none' : ''
              }`}
              onClick={() => setSelectedExecution(isExpanded ? null : execution.id)}
            >
              <div className={`p-6 rounded-xl border transition-all backdrop-blur-xl ${
                isExpanded
                  ? 'border-cyan-500/50 bg-cyan-500/10'
                  : 'border-cyan-500/20 bg-black/40 hover:border-cyan-500/30'
              }`}>
                {/* Shadow Overlay for locked features */}
                {isShadowed && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl" />
                )}

                <div className="relative">
                  {/* Main Content */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Type Icon */}
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getTypeColor(execution.type)} flex items-center justify-center`}>
                        <TypeIcon className="w-6 h-6 text-white" />
                      </div>
                      
                      {/* Execution Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{execution.name}</h3>
                          
                          {/* Status Badge */}
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(execution.status)} bg-current/10`}>
                            <StatusIcon className="w-3 h-3" />
                            {execution.status}
                          </div>
                          
                          {/* Risk Badge */}
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(execution.risk)} bg-current/10`}>
                            {execution.risk} risk
                          </div>
                          
                          {/* Live Indicator */}
                          {isLive && (
                            <motion.div
                              className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-500"
                              animate={{ opacity: [1, 0.5, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              <div className="w-2 h-2 rounded-full bg-red-500" />
                              LIVE
                            </motion.div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(execution.startTime).toLocaleString()}
                          </div>
                          {execution.duration && (
                            <div className="flex items-center gap-1">
                              <Activity className="w-3 h-3" />
                              {execution.duration}min
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            {execution.successRate}% success
                          </div>
                          <div className="flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {execution.threats} threats
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Expand/Collapse Icon */}
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      className="text-gray-400 ml-4"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-6 pt-6 border-t border-cyan-500/20"
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Resources Used */}
                          <div>
                            <h4 className="text-sm font-medium text-cyan-400 mb-3 flex items-center gap-2">
                              <Cpu className="w-4 h-4" />
                              Resources Used
                            </h4>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">CPU</span>
                                <span className="text-white font-medium">{execution.resourcesUsed.cpu}%</span>
                              </div>
                              <div className="w-full bg-gray-800 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                                  style={{ width: `${execution.resourcesUsed.cpu}%` }}
                                />
                              </div>
                              
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Memory</span>
                                <span className="text-white font-medium">{execution.resourcesUsed.memory}%</span>
                              </div>
                              <div className="w-full bg-gray-800 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                                  style={{ width: `${execution.resourcesUsed.memory}%` }}
                                />
                              </div>
                              
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Network</span>
                                <span className="text-white font-medium">{execution.resourcesUsed.network}%</span>
                              </div>
                              <div className="w-full bg-gray-800 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                                  style={{ width: `${execution.resourcesUsed.network}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Recent Logs */}
                          <div>
                            <h4 className="text-sm font-medium text-cyan-400 mb-3 flex items-center gap-2">
                              <Terminal className="w-4 h-4" />
                              Recent Logs
                            </h4>
                            <div className="bg-black/50 rounded-lg p-3 h-32 overflow-y-auto">
                              <div className="space-y-1 text-xs font-mono">
                                {execution.logs.map((log, logIndex) => (
                                  <div 
                                    key={logIndex}
                                    className={`${
                                      log.includes('[ERROR]') ? 'text-red-400' :
                                      log.includes('[WARN]') ? 'text-yellow-400' :
                                      log.includes('[SUCCESS]') ? 'text-green-400' :
                                      log.includes('[INFO]') ? 'text-cyan-400' :
                                      'text-gray-400'
                                    }`}
                                  >
                                    {log}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Output/Results */}
                        {execution.output && (
                          <div className="mt-6">
                            <h4 className="text-sm font-medium text-cyan-400 mb-3 flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              Results
                            </h4>
                            <div className="bg-black/50 rounded-lg p-4">
                              <p className="text-sm text-gray-300">{execution.output}</p>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 mt-6">
                          <motion.button
                            className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors flex items-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </motion.button>
                          <motion.button
                            className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors flex items-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Download className="w-4 h-4" />
                            Download Logs
                          </motion.button>
                          {execution.status === 'running' && (
                            <motion.button
                              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-2"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Pause className="w-4 h-4" />
                              Stop
                            </motion.button>
                          )}
                          {execution.status === 'failed' && (
                            <motion.button
                              className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-colors flex items-center gap-2"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <RotateCcw className="w-4 h-4" />
                              Retry
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {filteredExecutions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400">No executions found</div>
        </div>
      )}
    </div>
  )
}
