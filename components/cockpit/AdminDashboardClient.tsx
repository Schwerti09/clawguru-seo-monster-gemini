'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User } from '@/lib/tier-access'

interface AdminDashboardClientProps {
  user: User
  initialData: {
    totalUsers: number
    activeUsers: number
    revenueToday: number
    revenueMonth: number
    totalExecutions: number
    systemHealth: {
      cpu: number
      memory: number
      storage: number
      uptime: number
    }
    geminiUsage: {
      tokensUsed: number
      requestsToday: number
      costToday: number
    }
  }
}

export function AdminDashboardClient({ user, initialData }: AdminDashboardClientProps) {
  const [godMode, setGodMode] = useState(false)
  const [selectedSection, setSelectedSection] = useState('overview')
  const [realTimeData, setRealTimeData] = useState(initialData)
  const [users, setUsers] = useState<any[]>([])
  const [executions, setExecutions] = useState<any[]>([])
  const [revenueData, setRevenueData] = useState<any[]>([])

  // Real-time data updates
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Fetch real-time system health
        const healthResponse = await fetch('/api/admin/system-health')
        if (healthResponse.ok) {
          const health = await healthResponse.json()
          setRealTimeData(prev => ({ ...prev, systemHealth: health }))
        }

        // Fetch real-time user stats
        const usersResponse = await fetch('/api/admin/users/stats')
        if (usersResponse.ok) {
          const stats = await usersResponse.json()
          setRealTimeData(prev => ({ 
            ...prev, 
            totalUsers: stats.total,
            activeUsers: stats.active
          }))
        }

        // Fetch real-time revenue
        const revenueResponse = await fetch('/api/admin/revenue/stats')
        if (revenueResponse.ok) {
          const revenue = await revenueResponse.json()
          setRealTimeData(prev => ({ 
            ...prev, 
            revenueToday: revenue.today,
            revenueMonth: revenue.month
          }))
        }

        // Fetch real-time executions
        const execResponse = await fetch('/api/admin/executions/stats')
        if (execResponse.ok) {
          const exec = await execResponse.json()
          setRealTimeData(prev => ({ ...prev, totalExecutions: exec.total }))
        }

        // Fetch real-time Gemini usage
        const geminiResponse = await fetch('/api/admin/gemini/stats')
        if (geminiResponse.ok) {
          const gemini = await geminiResponse.json()
          setRealTimeData(prev => ({ ...prev, geminiUsage: gemini }))
        }
      } catch (error) {
        console.error('Failed to fetch real-time data:', error)
      }
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  // Fetch detailed data when section changes
  useEffect(() => {
    const fetchSectionData = async () => {
      try {
        switch (selectedSection) {
          case 'users':
            const usersResponse = await fetch('/api/admin/users')
            if (usersResponse.ok) {
              const usersData = await usersResponse.json()
              setUsers(usersData)
            }
            break
          case 'executions':
            const execResponse = await fetch('/api/admin/executions')
            if (execResponse.ok) {
              const execData = await execResponse.json()
              setExecutions(execData)
            }
            break
          case 'revenue':
            const revenueResponse = await fetch('/api/admin/revenue')
            if (revenueResponse.ok) {
              const revenue = await revenueResponse.json()
              setRevenueData(revenue)
            }
            break
        }
      } catch (error) {
        console.error('Failed to fetch section data:', error)
      }
    }

    fetchSectionData()
  }, [selectedSection])

  const sections = [
    { id: 'overview', label: 'Mission Control', icon: '🎯' },
    { id: 'users', label: 'User Matrix', icon: '👥' },
    { id: 'revenue', label: 'Revenue Feed', icon: '💰' },
    { id: 'executions', label: 'Execution Logs', icon: '🚀' },
    { id: 'system', label: 'System Health', icon: '🛡️' },
    { id: 'gemini', label: 'Gemini Usage', icon: '🧠' }
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* NASA-style Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)]" />
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div key={`h-${i}`} className="absolute w-full border-t border-blue-500/20" style={{ top: `${i * 5}%` }} />
          ))}
          {[...Array(20)].map((_, i) => (
            <div key={`v-${i}`} className="absolute h-full border-l border-blue-500/20" style={{ left: `${i * 5}%` }} />
          ))}
        </div>
      </div>

      {/* Main Layout */}
      <div className="relative z-10 flex h-screen">
        {/* Left Sidebar - Navigation */}
        <div className="w-80 bg-gray-900/60 backdrop-blur-xl border-r border-blue-500/30">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-blue-400 mb-2">ADMIN CONTROL</h1>
            <p className="text-xs text-gray-400 mb-6">CLAWGURU MISSION CONTROL</p>
            
            {/* God Mode Toggle */}
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-red-400">GOD MODE</div>
                  <div className="text-xs text-gray-400">Full System Access</div>
                </div>
                <motion.button
                  onClick={() => setGodMode(!godMode)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    godMode ? 'bg-red-600' : 'bg-gray-700'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="w-5 h-5 bg-white rounded-full"
                    animate={{ x: godMode ? 24 : 2 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  />
                </motion.button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setSelectedSection(section.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                    selectedSection === section.id
                      ? 'bg-blue-600/20 border border-blue-500/50 text-blue-400'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <span className="text-xl">{section.icon}</span>
                  <span className="font-medium">{section.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* User Info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user.email?.[0]?.toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">Enterprise Admin</div>
                <div className="text-xs text-gray-400">{user.email}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <header className="h-16 bg-gray-900/40 backdrop-blur-xl border-b border-blue-500/30 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-blue-400">
                {sections.find(s => s.id === selectedSection)?.label}
              </h2>
              {godMode && (
                <motion.div
                  className="px-3 py-1 bg-red-600/20 border border-red-500/50 rounded-full text-xs font-bold text-red-400"
                  animate={{
                    opacity: [1, 0.5, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  GOD MODE ACTIVE
                </motion.div>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>System Time: {new Date().toLocaleTimeString()}</span>
              <span>Status: OPERATIONAL</span>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 p-8 overflow-auto">
            <motion.div
              key={selectedSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderSection()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )

  function renderSection() {
    switch (selectedSection) {
      case 'overview':
        return <OverviewSection data={realTimeData} />
      case 'users':
        return <UsersSection users={users} />
      case 'revenue':
        return <RevenueSection data={realTimeData} revenueData={revenueData} />
      case 'executions':
        return <ExecutionsSection executions={executions} />
      case 'system':
        return <SystemSection health={realTimeData.systemHealth} />
      case 'gemini':
        return <GeminiSection usage={realTimeData.geminiUsage} />
      default:
        return null
    }
  }
}

// Section Components
function OverviewSection({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-blue-400 mb-6">Mission Overview</h3>
      
      <div className="grid grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value={data.totalUsers.toLocaleString()}
          trend="+12%"
          color="from-blue-500 to-cyan-500"
        />
        <MetricCard
          title="Active Users"
          value={data.activeUsers.toLocaleString()}
          trend="+8%"
          color="from-green-500 to-emerald-500"
        />
        <MetricCard
          title="Revenue Today"
          value={`$${data.revenueToday.toLocaleString()}`}
          trend="+23%"
          color="from-yellow-500 to-orange-500"
        />
        <MetricCard
          title="Total Executions"
          value={data.totalExecutions.toLocaleString()}
          trend="+15%"
          color="from-purple-500 to-pink-500"
        />
      </div>

      {/* System Monitors */}
      <div className="grid grid-cols-2 gap-6">
        <SystemMonitor health={data.systemHealth} />
        <GeminiMonitor usage={data.geminiUsage} />
      </div>
    </div>
  )
}

function MetricCard({ title, value, trend, color }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-6 bg-gray-900/50 backdrop-blur-xl rounded-xl border border-blue-500/30`}
    >
      <div className="text-gray-400 text-sm mb-2">{title}</div>
      <div className={`text-3xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent mb-2`}>
        {value}
      </div>
      <div className={`text-sm ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
        {trend}
      </div>
    </motion.div>
  )
}

function SystemMonitor({ health }: { health: any }) {
  return (
    <div className="p-6 bg-gray-900/50 backdrop-blur-xl rounded-xl border border-blue-500/30">
      <h4 className="text-lg font-semibold text-blue-400 mb-4">System Health</h4>
      <div className="space-y-4">
        {[
          { label: 'CPU Usage', value: health.cpu, color: 'from-blue-500 to-cyan-500' },
          { label: 'Memory', value: health.memory, color: 'from-green-500 to-emerald-500' },
          { label: 'Storage', value: health.storage, color: 'from-yellow-500 to-orange-500' },
          { label: 'Uptime', value: health.uptime, color: 'from-purple-500 to-pink-500' }
        ].map((metric) => (
          <div key={metric.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">{metric.label}</span>
              <span className="text-white">{metric.value}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className={`h-2 rounded-full bg-gradient-to-r ${metric.color}`}
                style={{ width: `${metric.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function GeminiMonitor({ usage }: { usage: any }) {
  return (
    <div className="p-6 bg-gray-900/50 backdrop-blur-xl rounded-xl border border-blue-500/30">
      <h4 className="text-lg font-semibold text-purple-400 mb-4">Gemini AI Usage</h4>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-400">Tokens Used</span>
          <span className="text-white">{usage.tokensUsed.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Requests Today</span>
          <span className="text-white">{usage.requestsToday.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Cost Today</span>
          <span className="text-white">${usage.costToday.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

function UsersSection({ users }: { users: any[] }) {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-blue-400 mb-6">User Matrix</h3>
      
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-blue-500/30 p-6">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white">Active Users</h4>
            <div className="text-sm text-gray-400">Total: {users.length}</div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 px-3 text-gray-400">Email</th>
                  <th className="text-left py-2 px-3 text-gray-400">Tier</th>
                  <th className="text-left py-2 px-3 text-gray-400">Joined</th>
                  <th className="text-left py-2 px-3 text-gray-400">Status</th>
                  <th className="text-left py-2 px-3 text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                    <td className="py-2 px-3 text-white">{user.email}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.tier === 'enterprise' ? 'bg-yellow-500/20 text-yellow-400' :
                        user.tier === 'pro' ? 'bg-purple-500/20 text-purple-400' :
                        user.tier === 'daypass' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {user.tier}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-gray-300">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-3">
                      <span className={`w-2 h-2 rounded-full inline-block ${
                        user.last_active ? 'bg-green-500' : 'bg-gray-500'
                      }`} />
                    </td>
                    <td className="py-2 px-3">
                      <button className="text-blue-400 hover:text-blue-300 text-xs">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function RevenueSection({ data, revenueData }: { data: any; revenueData: any[] }) {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-blue-400 mb-6">Revenue Feed</h3>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <MetricCard
          title="Revenue Today"
          value={`$${data.revenueToday.toLocaleString()}`}
          trend="+23%"
          color="from-green-500 to-emerald-500"
        />
        <MetricCard
          title="Revenue Month"
          value={`$${data.revenueMonth.toLocaleString()}`}
          trend="+18%"
          color="from-blue-500 to-cyan-500"
        />
      </div>

      <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-blue-500/30 p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Recent Transactions</h4>
        
        <div className="space-y-3">
          {revenueData.map((transaction, index) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
              <div>
                <div className="text-white font-medium">{transaction.user_email}</div>
                <div className="text-xs text-gray-400">{transaction.tier} • {transaction.created_at}</div>
              </div>
              <div className="text-right">
                <div className="text-green-400 font-semibold">${transaction.amount}</div>
                <div className="text-xs text-gray-400 capitalize">{transaction.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ExecutionsSection({ executions }: { executions: any[] }) {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-blue-400 mb-6">Execution Logs</h3>
      
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-blue-500/30 p-6">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white">Recent Executions</h4>
            <div className="text-sm text-gray-400">Total: {executions.length}</div>
          </div>
          
          <div className="space-y-3">
            {executions.map((execution, index) => (
              <div key={execution.id} className="p-4 bg-gray-800/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white font-medium">{execution.runbook_name}</div>
                  <div className={`px-2 py-1 rounded text-xs ${
                    execution.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    execution.status === 'running' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {execution.status}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm text-gray-400">
                  <div>
                    <div className="text-xs text-gray-500">User</div>
                    <div>{execution.user_email}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Duration</div>
                    <div>{execution.duration || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Success Rate</div>
                    <div>{execution.success_rate || 0}%</div>
                  </div>
                </div>
                
                {execution.output && (
                  <div className="mt-3 p-2 bg-black/50 rounded text-xs text-gray-300 font-mono">
                    {execution.output}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SystemSection({ health }: { health: any }) {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-blue-400 mb-6">System Health</h3>
      <SystemMonitor health={health} />
    </div>
  )
}

function GeminiSection({ usage }: { usage: any }) {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-purple-400 mb-6">Gemini AI Usage</h3>
      <GeminiMonitor usage={usage} />
    </div>
  )
}
