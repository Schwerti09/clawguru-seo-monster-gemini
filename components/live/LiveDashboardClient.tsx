'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Cpu, Database, Globe, Zap, AlertTriangle, CheckCircle, Clock, TrendingUp, Shield, Wifi } from 'lucide-react'

interface SystemMetrics {
  cpu: number
  memory: number
  storage: number
  network: number
  uptime: number
  activeConnections: number
  requestsPerSecond: number
  errorRate: number
}

interface ServiceStatus {
  name: string
  status: 'healthy' | 'warning' | 'critical'
  responseTime: number
  lastCheck: string
  description: string
}

export default function LiveDashboardClient() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 45,
    memory: 67,
    storage: 23,
    network: 89,
    uptime: 99.9,
    activeConnections: 1247,
    requestsPerSecond: 342,
    errorRate: 0.02
  })

  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: 'API Gateway',
      status: 'healthy',
      responseTime: 45,
      lastCheck: 'vor 2 Sekunden',
      description: 'Haupt-API-Endpunkt für alle Client-Anfragen'
    },
    {
      name: 'Database',
      status: 'healthy',
      responseTime: 12,
      lastCheck: 'vor 1 Sekunde',
      description: 'PostgreSQL Datenbank mit automatischen Backups'
    },
    {
      name: 'Redis Cache',
      status: 'healthy',
      responseTime: 3,
      lastCheck: 'vor 3 Sekunden',
      description: 'In-Memory Cache für schnelle Datenabfragen'
    },
    {
      name: 'AI Engine',
      status: 'warning',
      responseTime: 234,
      lastCheck: 'vor 5 Sekunden',
      description: 'Gemini KI für Runbook-Generierung und Analysen'
    },
    {
      name: 'Security Scanner',
      status: 'healthy',
      responseTime: 156,
      lastCheck: 'vor 2 Sekunden',
      description: 'Echtzeit-Sicherheitsscanner für Bedrohungserkennung'
    }
  ])

  const [isLive, setIsLive] = useState(true)

  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      // Simulate real-time metrics updates
      setMetrics(prev => ({
        ...prev,
        cpu: Math.max(10, Math.min(90, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(20, Math.min(85, prev.memory + (Math.random() - 0.5) * 5)),
        network: Math.max(30, Math.min(95, prev.network + (Math.random() - 0.5) * 15)),
        activeConnections: Math.max(800, Math.min(2000, prev.activeConnections + Math.floor((Math.random() - 0.5) * 100))),
        requestsPerSecond: Math.max(100, Math.min(600, prev.requestsPerSecond + Math.floor((Math.random() - 0.5) * 50))),
        errorRate: Math.max(0, Math.min(0.1, prev.errorRate + (Math.random() - 0.5) * 0.01))
      }))

      // Update service statuses
      setServices(prev => prev.map(service => ({
        ...service,
        responseTime: Math.max(1, service.responseTime + Math.floor((Math.random() - 0.5) * 20)),
        lastCheck: 'vor 1 Sekunde',
        status: Math.random() > 0.95 ? (Math.random() > 0.5 ? 'warning' : 'critical') : 'healthy'
      })))
    }, 2000)

    return () => clearInterval(interval)
  }, [isLive])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400 bg-green-400/10 border-green-400/30'
      case 'warning': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
      case 'critical': return 'text-red-400 bg-red-400/10 border-red-400/30'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4" />
      case 'warning': return <AlertTriangle className="w-4 h-4" />
      case 'critical': return <AlertTriangle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getMetricColor = (value: number, type: string) => {
    if (type === 'cpu' || type === 'memory' || type === 'storage') {
      if (value > 80) return 'text-red-400'
      if (value > 60) return 'text-yellow-400'
      return 'text-green-400'
    }
    if (type === 'network' || type === 'uptime') {
      if (value > 95) return 'text-green-400'
      if (value > 85) return 'text-yellow-400'
      return 'text-red-400'
    }
    return 'text-cyan-400'
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Live System Dashboard
            </h1>
            <p className="text-gray-400 text-lg">
              Echtzeit-Überwachung der ClawGuru Security Infrastructure
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
              <span className="text-sm text-gray-400">
                {isLive ? 'Live' : 'Pausiert'}
              </span>
            </div>
            <button
              onClick={() => setIsLive(!isLive)}
              className="px-4 py-2 rounded-lg border border-cyan-400/30 bg-cyan-400/10 text-cyan-400 hover:bg-cyan-400/20 transition-all"
            >
              {isLive ? 'Pausieren' : 'Fortsetzen'}
            </button>
          </div>
        </div>

        {/* System Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">CPU</div>
                  <div className={`text-2xl font-bold ${getMetricColor(metrics.cpu, 'cpu')}`}>
                    {metrics.cpu.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                style={{ width: `${metrics.cpu}%` }}
                animate={{ width: `${metrics.cpu}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center">
                  <Database className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Memory</div>
                  <div className={`text-2xl font-bold ${getMetricColor(metrics.memory, 'memory')}`}>
                    {metrics.memory.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                style={{ width: `${metrics.memory}%` }}
                animate={{ width: `${metrics.memory}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-400/10 flex items-center justify-center">
                  <Wifi className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Network</div>
                  <div className={`text-2xl font-bold ${getMetricColor(metrics.network, 'network')}`}>
                    {metrics.network.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
                style={{ width: `${metrics.network}%` }}
                animate={{ width: `${metrics.network}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Uptime</div>
                  <div className={`text-2xl font-bold ${getMetricColor(metrics.uptime, 'uptime')}`}>
                    {metrics.uptime.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-400"
                style={{ width: `${metrics.uptime}%` }}
                animate={{ width: `${metrics.uptime}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-400/10 flex items-center justify-center">
                <Activity className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Active Connections</div>
                <div className="text-xl font-bold text-blue-400">
                  {metrics.activeConnections.toLocaleString()}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-green-400/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Requests/Second</div>
                <div className="text-xl font-bold text-green-400">
                  {metrics.requestsPerSecond}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-red-400/10 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Error Rate</div>
                <div className="text-xl font-bold text-red-400">
                  {(metrics.errorRate * 100).toFixed(2)}%
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Service Status */}
        <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <Shield className="w-5 h-5 text-cyan-400" />
            Service Status
          </h2>
          <div className="space-y-4">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className={`rounded-xl border p-4 transition-all ${getStatusColor(service.status)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(service.status)}
                    <div>
                      <div className="font-semibold text-white">{service.name}</div>
                      <div className="text-sm opacity-80">{service.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm">
                      {service.responseTime}ms
                    </div>
                    <div className="text-xs opacity-60">
                      {service.lastCheck}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
