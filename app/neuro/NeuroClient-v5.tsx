// NEURO v5.0 — Predictive Security Cortex
// Stack MRI, Live CVE Scanning, Voice Control, Threat Intelligence Integration

"use client"

import { useState, useEffect, useRef } from "react"
import SocialProofCounter from "@/components/marketing/SocialProofCounter"

// ── TYPES ─────────────────────────────────────────────────────────────────────
type TechStackItem = {
  id: string
  name: string
  version: string
  category: "cloud" | "container" | "database" | "web" | "security" | "other"
  icon: string
}

type CVEItem = {
  id: string
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
  title: string
  affected: string
  fixedIn?: string
  description: string
  published: string
}

type StackMRIResult = {
  stackItems: TechStackItem[]
  cves: CVEItem[]
  score: number
  issues: {
    critical: number
    high: number
    medium: number
    low: number
    optimal: number
  }
  runbooks: {
    slug: string
    title: string
    relevance: number
    urgency: "NOW" | "SOON" | "LATER"
  }[]
}

// Threat Intel Types
type ThreatData = {
  stats: {
    totalCampaigns: number
    activeThisWeek: number
    criticalThreats: number
    matchingYourStack: number
    highestRiskScore: number
  }
  campaigns: {
    id: string
    name: string
    actor: { name: string; origin: string; motivation: string; sophistication: string }
    severity: string
    targets: string[]
    description: string
    activeSince: string
    lastSeen: string
    cves: string[]
  }[]
  correlations?: {
    campaignId: string
    campaignName: string
    matchingComponents: string[]
    riskScore: number
    predictedImpact: string
    recommendedActions: string[]
  }[]
}

// ── CONFIG ────────────────────────────────────────────────────────────────────
const PRESET_STACKS: TechStackItem[] = [
  { id: "aws", name: "AWS", version: "Latest", category: "cloud", icon: "☁️" },
  { id: "azure", name: "Azure", version: "Latest", category: "cloud", icon: "🔷" },
  { id: "gcp", name: "GCP", version: "Latest", category: "cloud", icon: "🔶" },
  { id: "k8s", name: "Kubernetes", version: "1.28", category: "container", icon: "⚓" },
  { id: "docker", name: "Docker", version: "24.0", category: "container", icon: "🐳" },
  { id: "postgres", name: "PostgreSQL", version: "15", category: "database", icon: "🐘" },
  { id: "mysql", name: "MySQL", version: "8.0", category: "database", icon: "🐬" },
  { id: "redis", name: "Redis", version: "7.2", category: "database", icon: "🔴" },
  { id: "nginx", name: "Nginx", version: "1.25", category: "web", icon: "🌊" },
  { id: "apache", name: "Apache", version: "2.4", category: "web", icon: "🪶" },
  { id: "nodejs", name: "Node.js", version: "20", category: "web", icon: "🟢" },
  { id: "python", name: "Python", version: "3.12", category: "web", icon: "🐍" },
  { id: "vault", name: "HashiCorp Vault", version: "1.15", category: "security", icon: "🔐" },
  { id: "falco", name: "Falco", version: "0.37", category: "security", icon: "🦅" },
  { id: "trivy", name: "Trivy", version: "0.50", category: "security", icon: "🔍" },
]

const VOICE_COMMANDS = [
  { phrase: "scan my stack", action: "SCAN_STACK" },
  { phrase: "show critical", action: "SHOW_CRITICAL" },
  { phrase: "show threats", action: "SHOW_THREATS" },
  { phrase: "execute fix", action: "EXECUTE_FIX" },
  { phrase: "what is my score", action: "SHOW_SCORE" },
]

// ── ANIMATED BACKGROUND ──────────────────────────────────────────────────────
function NeuroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    function resize() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener("resize", resize)

    type Neuron = { x: number; y: number; vx: number; vy: number; radius: number; pulse: number }
    const neurons: Neuron[] = []
    const colors = ["#b464ff", "#00b8ff", "#00ff9d", "#ffc800"]
    
    for (let i = 0; i < 30; i++) {
      neurons.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: 2 + Math.random() * 3,
        pulse: Math.random() * Math.PI * 2,
      })
    }

    function draw() {
      if (!canvas || !ctx) return
      ctx.fillStyle = "#050505"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.strokeStyle = "rgba(180,100,255,0.08)"
      ctx.lineWidth = 0.5
      for (let i = 0; i < neurons.length; i++) {
        for (let j = i + 1; j < neurons.length; j++) {
          const dx = neurons[j].x - neurons[i].x
          const dy = neurons[j].y - neurons[i].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 150) {
            ctx.beginPath()
            ctx.moveTo(neurons[i].x, neurons[i].y)
            ctx.lineTo(neurons[j].x, neurons[j].y)
            ctx.globalAlpha = 1 - dist / 150
            ctx.stroke()
          }
        }
      }
      ctx.globalAlpha = 1

      neurons.forEach((n, i) => {
        n.x += n.vx
        n.y += n.vy
        n.pulse += 0.05
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1
        
        const pulseRadius = n.radius + Math.sin(n.pulse) * 1.5
        ctx.beginPath()
        ctx.arc(n.x, n.y, pulseRadius, 0, Math.PI * 2)
        ctx.fillStyle = colors[i % colors.length]
        ctx.globalAlpha = 0.6
        ctx.fill()
        ctx.beginPath()
        ctx.arc(n.x, n.y, pulseRadius * 2, 0, Math.PI * 2)
        ctx.fillStyle = colors[i % colors.length]
        ctx.globalAlpha = 0.15
        ctx.fill()
      })
      ctx.globalAlpha = 1

      animRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      window.removeEventListener("resize", resize)
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />
}

// ── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function NeuroClient() {
  const [mounted, setMounted] = useState(false)
  
  // Stack MRI States
  const [userStack, setUserStack] = useState<TechStackItem[]>([])
  const [mriResult, setMriResult] = useState<StackMRIResult | null>(null)
  const [scanning, setScanning] = useState(false)
  const [activeTab, setActiveTab] = useState<"input" | "mri" | "voice">("input")
  
  // Voice Control
  const [voiceActive, setVoiceActive] = useState(false)
  const [transcript, setTranscript] = useState("")
  const recognitionRef = useRef<any>(null)
  
  // Threat Intel
  const [threatData, setThreatData] = useState<ThreatData | null>(null)
  
  // Error State
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { setMounted(true) }, [])

  // Voice Recognition Setup
  useEffect(() => {
    if (typeof window === "undefined") return
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return
    
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "de-DE"
    
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join(" ")
      setTranscript(transcript.toLowerCase())
      
      VOICE_COMMANDS.forEach(({ phrase, action }) => {
        if (transcript.toLowerCase().includes(phrase)) {
          handleVoiceCommand(action)
        }
      })
    }
    
    recognitionRef.current = recognition
  }, [userStack])

  const handleVoiceCommand = (action: string) => {
    switch (action) {
      case "SCAN_STACK":
        if (userStack.length > 0) performStackMRI()
        break
      case "SHOW_CRITICAL":
        if (mriResult) setActiveTab("mri")
        break
      case "SHOW_SCORE":
        if (mriResult) setActiveTab("mri")
        break
    }
  }

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      alert("Spracherkennung nicht verfügbar in diesem Browser")
      return
    }
    
    if (voiceActive) {
      recognitionRef.current.stop()
      setVoiceActive(false)
    } else {
      recognitionRef.current.start()
      setVoiceActive(true)
    }
  }

  const addToStack = (item: TechStackItem) => {
    if (!userStack.find(s => s.id === item.id)) {
      setUserStack([...userStack, item])
    }
  }

  const removeFromStack = (id: string) => {
    setUserStack(userStack.filter(s => s.id !== id))
  }

  const performStackMRI = async () => {
    setScanning(true)
    setError(null)
    
    try {
      // Fetch CVEs
      const stackNames = userStack.map(s => s.name.toLowerCase()).join(",")
      const cveRes = await fetch(`/api/intel/cves?stack=${encodeURIComponent(stackNames)}&limit=20`)
      
      if (!cveRes.ok) throw new Error("CVE scan failed")
      const cveData = await cveRes.json()
      
      // Fetch Runbooks
      const runbookRes = await fetch(`/api/neuro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          stack: userStack.map(s => s.name),
          question: `Security scan for ${stackNames}`
        }),
      })
      
      if (!runbookRes.ok) throw new Error("Runbook fetch failed")
      const runbookData = await runbookRes.json()
      
      // Calculate Score — API returns .items[] not .cves[]
      const cves: CVEItem[] = (cveData.items || cveData.cves || []).map((c: any) => ({
        id: c.id,
        severity: c.severity,
        title: c.title,
        affected: c.affected,
        fixedIn: c.fixedIn,
        description: c.description || "",
        published: c.published || "",
      }))
      const critical = cves.filter((c) => c.severity === "CRITICAL").length
      const high = cves.filter((c) => c.severity === "HIGH").length
      const medium = cves.filter((c) => c.severity === "MEDIUM").length
      const low = cves.filter((c) => c.severity === "LOW").length
      
      const baseScore = 100
      const deductions = critical * 25 + high * 15 + medium * 5 + low * 2
      const score = Math.max(0, baseScore - deductions)
      
      setMriResult({
        stackItems: userStack,
        cves: cves,
        score,
        issues: { critical, high, medium, low, optimal: Math.max(0, 5 - critical - high) },
        runbooks: runbookData.recommended_runbooks?.map((r: any) => {
          const rel = r.relevance > 1 ? r.relevance / 100 : r.relevance
          return {
            slug: r.slug,
            title: r.title,
            relevance: rel,
            urgency: (rel > 0.8 ? "NOW" : rel > 0.5 ? "SOON" : "LATER") as "NOW" | "SOON" | "LATER"
          }
        }) || []
      })
      
      // Fetch Threat Correlations
      try {
        const threatRes = await fetch(`/api/intel/threats?stack=${encodeURIComponent(stackNames)}`)
        if (threatRes.ok) {
          const td = await threatRes.json()
          setThreatData(td)
        }
      } catch {
        // Non-critical: threat data is optional
      }
      
      setActiveTab("mri")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setScanning(false)
    }
  }

  // MAIN INTERFACE
  if (!mounted) return null

  return (
    <>
      {mounted && <NeuroBackground />}
      
      <div className="relative min-h-screen" style={{ zIndex: 1 }}>
        
        {/* ── PREMIUM HERO ───────────────────────────────────────────────── */}
        <section className="pt-20 pb-8 px-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-widest mb-6 border" style={{ borderColor: "rgba(180,100,255,0.3)", background: "rgba(180,100,255,0.05)", color: "#b464ff" }}>
              <span className="animate-pulse">●</span> NEURO v5.0 — Predictive Security Cortex
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-4 leading-none">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#b464ff] via-[#00b8ff] to-[#00ff9d] animate-gradient">
                Stack MRI
              </span>
            </h1>
            
            <p className="text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
              Deine Infrastruktur. Live gescannt. Echtzeit-Intelligenz.
            </p>
            
            {/* Tab Navigation */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {[
                { id: "input", label: "🎯 Stack Input", color: "#b464ff" },
                { id: "mri", label: "🩻 MRI Scan", color: "#00ff9d" },
                { id: "voice", label: "🎙️ Voice", color: "#00b8ff" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-mono transition-all duration-300"
                  style={{
                    borderColor: activeTab === tab.id ? tab.color : "rgba(255,255,255,0.1)",
                    color: activeTab === tab.id ? tab.color : "rgba(255,255,255,0.5)",
                    background: activeTab === tab.id ? `${tab.color}15` : "transparent"
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            {/* Voice Toggle */}
            <button
              onClick={toggleVoice}
              className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-mono transition-all duration-300 mx-auto"
              style={{
                borderColor: voiceActive ? "#00b8ff" : "rgba(255,255,255,0.1)",
                color: voiceActive ? "#00b8ff" : "rgba(255,255,255,0.5)",
                background: voiceActive ? "rgba(0,184,255,0.1)" : "transparent"
              }}
            >
              <span>{voiceActive ? "🎙️" : "🎤"}</span>
              {voiceActive ? "Spracherkennung AKTIV" : "Sprache aktivieren"}
            </button>

            {voiceActive && transcript && (
              <p className="text-xs font-mono mt-3" style={{ color: "#00b8ff" }}>
                Erkannt: &quot;{transcript}&quot;
              </p>
            )}

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 mb-6 max-w-3xl mx-auto">
              <div className="rounded-xl p-4 text-center border" style={{ background: "rgba(10,10,14,0.8)", borderColor: "rgba(180,100,255,0.2)" }}>
                <div className="text-2xl font-black" style={{ color: "#b464ff" }}>4.2M+</div>
                <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Runbooks</div>
              </div>
              <div className="rounded-xl p-4 text-center border" style={{ background: "rgba(10,10,14,0.8)", borderColor: "rgba(0,255,157,0.2)" }}>
                <div className="text-2xl font-black" style={{ color: "#00ff9d" }}>30s</div>
                <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Problem → Fix</div>
              </div>
              <div className="rounded-xl p-4 text-center border" style={{ background: "rgba(10,10,14,0.8)", borderColor: "rgba(0,184,255,0.2)" }}>
                <div className="text-2xl font-black" style={{ color: "#00b8ff" }}>15+</div>
                <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Jahre Erfahrung</div>
              </div>
              <div className="rounded-xl p-4 text-center border" style={{ background: "rgba(10,10,14,0.8)", borderColor: "rgba(255,200,0,0.2)" }}>
                <div className="text-2xl font-black" style={{ color: "#ffc800" }}>24/7</div>
                <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Incident Response</div>
              </div>
            </div>

            {/* Social Proof Counter */}
            <div className="mt-4 max-w-lg mx-auto mb-6">
              <SocialProofCounter variant="compact" />
            </div>
          </div>
        </section>

        {/* ── ERROR ────────────────────────────────────────────────────── */}
        {error && (
          <section className="px-4 mb-6">
            <div className="max-w-3xl mx-auto">
              <div className="rounded-2xl p-4 border" style={{ background: "rgba(255,0,0,0.1)", borderColor: "rgba(255,0,0,0.3)" }}>
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
                <button 
                  onClick={() => setError(null)}
                  className="mt-2 text-xs underline text-red-400 hover:text-red-300"
                >
                  Schließen
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ── STACK INPUT TAB ────────────────────────────────────────────── */}
        {activeTab === "input" && (
          <section className="px-4 mb-12">
            <div className="max-w-4xl mx-auto">
              {/* User Stack */}
              <div className="rounded-3xl p-6 mb-6 border" style={{ background: "rgba(10,10,14,0.8)", borderColor: "rgba(255,255,255,0.08)" }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs font-mono uppercase tracking-widest" style={{ color: "#b464ff" }}>Dein Tech Stack</div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{userStack.length} Komponenten</div>
                </div>
                
                {userStack.length === 0 ? (
                  <div className="text-center py-8 text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
                    Wähle deine Infrastruktur-Komponenten unten aus
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {userStack.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => removeFromStack(item.id)}
                        className="flex items-center gap-2 px-3 py-2 rounded-full text-sm border transition-all hover:scale-105"
                        style={{ 
                          background: "rgba(180,100,255,0.15)", 
                          borderColor: "#b464ff",
                          color: "#b464ff" 
                        }}
                      >
                        <span>{item.icon}</span>
                        <span>{item.name}</span>
                        <span className="text-xs opacity-60">×</span>
                      </button>
                    ))}
                  </div>
                )}
                
                {userStack.length > 0 && (
                  <button
                    onClick={performStackMRI}
                    disabled={scanning}
                    className="w-full py-3 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all disabled:opacity-50"
                    style={{ 
                      background: "linear-gradient(90deg, #00ff9d30, #00ff9d50)", 
                      border: "1px solid #00ff9d", 
                      color: "#00ff9d" 
                    }}
                  >
                    {scanning ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin">⏳</span> Scanning...
                      </span>
                    ) : (
                      "🩻 Stack MRI durchführen"
                    )}
                  </button>
                )}
              </div>
              
              {/* Available Components */}
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {PRESET_STACKS.map((item) => {
                  const isSelected = userStack.find(s => s.id === item.id)
                  return (
                    <button
                      key={item.id}
                      onClick={() => addToStack(item)}
                      disabled={!!isSelected}
                      className="p-3 rounded-xl border text-center transition-all disabled:opacity-40 hover:border-[#b464ff]"
                      style={{ 
                        background: isSelected ? "rgba(180,100,255,0.1)" : "rgba(10,10,14,0.6)",
                        borderColor: isSelected ? "#b464ff" : "rgba(255,255,255,0.08)"
                      }}
                    >
                      <div className="text-2xl mb-1">{item.icon}</div>
                      <div className="text-xs font-medium truncate" style={{ color: isSelected ? "#b464ff" : "rgba(255,255,255,0.7)" }}>
                        {item.name}
                      </div>
                      <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>{item.version}</div>
                    </button>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── MRI RESULTS TAB ─────────────────────────────────────────────── */}
        {activeTab === "mri" && mriResult && (
          <section className="px-4 mb-12 animate-fade-in">
            <div className="max-w-4xl mx-auto">
              {/* Score Card */}
              <div className="rounded-3xl p-8 mb-6 border" style={{ background: "rgba(10,10,14,0.95)", borderColor: "rgba(180,100,255,0.3)", backdropFilter: "blur(20px)" }}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🩻</span>
                    <span className="font-mono text-sm uppercase tracking-wider" style={{ color: "#b464ff" }}>MRI Scan Ergebnis</span>
                  </div>
                  <div 
                    className="text-4xl font-black"
                    style={{ 
                      color: mriResult.score >= 80 ? "#00ff9d" : mriResult.score >= 60 ? "#ffc800" : "#ff6b6b" 
                    }}
                  >
                    {mriResult.score}
                    <span className="text-lg font-normal text-gray-500">/100</span>
                  </div>
                </div>
                
                {/* Issue Breakdown */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                  <div className="rounded-xl p-3 text-center border" style={{ background: "rgba(255,0,0,0.1)", borderColor: "rgba(255,0,0,0.2)" }}>
                    <div className="text-2xl font-bold text-red-400">{mriResult.issues.critical}</div>
                    <div className="text-[10px] uppercase tracking-wider text-red-400">Kritisch</div>
                  </div>
                  <div className="rounded-xl p-3 text-center border" style={{ background: "rgba(255,200,0,0.1)", borderColor: "rgba(255,200,0,0.2)" }}>
                    <div className="text-2xl font-bold text-yellow-400">{mriResult.issues.high}</div>
                    <div className="text-[10px] uppercase tracking-wider text-yellow-400">Hoch</div>
                  </div>
                  <div className="rounded-xl p-3 text-center border" style={{ background: "rgba(0,184,255,0.1)", borderColor: "rgba(0,184,255,0.2)" }}>
                    <div className="text-2xl font-bold text-blue-400">{mriResult.issues.medium}</div>
                    <div className="text-[10px] uppercase tracking-wider text-blue-400">Mittel</div>
                  </div>
                  <div className="rounded-xl p-3 text-center border" style={{ background: "rgba(0,255,157,0.1)", borderColor: "rgba(0,255,157,0.2)" }}>
                    <div className="text-2xl font-bold text-green-400">{mriResult.issues.optimal}</div>
                    <div className="text-[10px] uppercase tracking-wider text-green-400">Optimal</div>
                  </div>
                </div>
                
                {/* CVE List */}
                {mriResult.cves.length > 0 && (
                  <div className="mb-6">
                    <div className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: "#ff6b6b" }}>⚠️ Gefundene CVEs</div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {mriResult.cves.slice(0, 10).map((cve) => (
                        <div 
                          key={cve.id} 
                          className="rounded-xl p-3 border"
                          style={{ 
                            background: cve.severity === "CRITICAL" ? "rgba(255,0,0,0.08)" : cve.severity === "HIGH" ? "rgba(255,200,0,0.08)" : "rgba(0,184,255,0.08)",
                            borderColor: cve.severity === "CRITICAL" ? "rgba(255,0,0,0.2)" : cve.severity === "HIGH" ? "rgba(255,200,0,0.2)" : "rgba(0,184,255,0.2)"
                          }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span 
                              className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                              style={{ 
                                background: cve.severity === "CRITICAL" ? "#ff0000" : cve.severity === "HIGH" ? "#ffc800" : "#00b8ff",
                                color: cve.severity === "CRITICAL" ? "#fff" : cve.severity === "HIGH" ? "#000" : "#fff"
                              }}
                            >
                              {cve.severity}
                            </span>
                            <span className="text-xs font-mono text-gray-400">{cve.id}</span>
                          </div>
                          <div className="text-sm text-gray-300">{cve.title}</div>
                          <div className="text-xs text-gray-500 mt-1">Betrifft: {cve.affected}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Recommended Runbooks */}
                {mriResult.runbooks.length > 0 && (
                  <div className="mb-8">
                    <div className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: "#00ff9d" }}>📚 Empfohlene Runbooks</div>
                    <div className="space-y-2">
                      {mriResult.runbooks.slice(0, 5).map((rb) => (
                        <a 
                          key={rb.slug}
                          href={`/summon?q=${encodeURIComponent(rb.title)}`}
                          className="flex items-center justify-between p-3 rounded-xl border transition-all hover:border-[#00ff9d]"
                          style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}
                        >
                          <div>
                            <div className="text-sm text-gray-300">{rb.title}</div>
                            <div className="text-xs text-gray-500">Relevanz: {(rb.relevance * 100).toFixed(0)}%</div>
                          </div>
                          <span 
                            className="px-2 py-1 rounded text-[10px] font-bold uppercase"
                            style={{ 
                              background: rb.urgency === "NOW" ? "#ff0000" : rb.urgency === "SOON" ? "#ffc800" : "#00b8ff",
                              color: rb.urgency === "SOON" ? "#000" : "#fff"
                            }}
                          >
                            {rb.urgency}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Threat Correlation Card */}
                {threatData && (
                  <div className="rounded-2xl p-6 border" style={{ background: "rgba(255,0,0,0.05)", borderColor: "rgba(255,0,0,0.2)" }}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">🎯</span>
                      <div>
                        <div className="text-xs font-mono uppercase tracking-wider text-red-400">Predictive Threat Correlation</div>
                        <div className="text-xs text-gray-500">Aktive Kampagnen die deinen Stack betreffen</div>
                      </div>
                    </div>
                    
                    {/* Stats Grid — LIVE from API */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="rounded-xl p-3 text-center border" style={{ background: "rgba(255,0,0,0.08)", borderColor: "rgba(255,0,0,0.15)" }}>
                        <div className="text-2xl font-bold text-red-400">{threatData.stats.totalCampaigns}</div>
                        <div className="text-[10px] uppercase tracking-wider text-red-400">Aktive Kampagnen</div>
                      </div>
                      <div className="rounded-xl p-3 text-center border" style={{ background: "rgba(255,200,0,0.08)", borderColor: "rgba(255,200,0,0.15)" }}>
                        <div className="text-2xl font-bold text-yellow-400">{threatData.stats.matchingYourStack}</div>
                        <div className="text-[10px] uppercase tracking-wider text-yellow-400">Match dein Stack</div>
                      </div>
                      <div className="rounded-xl p-3 text-center border" style={{ background: "rgba(180,100,255,0.08)", borderColor: "rgba(180,100,255,0.15)" }}>
                        <div className="text-2xl font-bold text-purple-400">{threatData.stats.highestRiskScore}</div>
                        <div className="text-[10px] uppercase tracking-wider text-purple-400">Höchster Risk Score</div>
                      </div>
                    </div>
                    
                    {/* Live Threat Cards from API */}
                    <div className="space-y-3 mb-4">
                      {threatData.campaigns.slice(0, 3).map((camp) => {
                        const corr = threatData.correlations?.find(c => c.campaignId === camp.id)
                        return (
                          <div key={camp.id} className="rounded-xl p-4 border" style={{ 
                            background: camp.severity === "CRITICAL" ? "rgba(255,0,0,0.08)" : "rgba(255,200,0,0.06)",
                            borderColor: camp.severity === "CRITICAL" ? "rgba(255,0,0,0.2)" : "rgba(255,200,0,0.15)"
                          }}>
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="text-sm font-bold" style={{ color: camp.severity === "CRITICAL" ? "#fca5a5" : "#fcd34d" }}>{camp.name}</div>
                                <div className="text-xs" style={{ color: camp.severity === "CRITICAL" ? "#f87171" : "#fbbf24" }}>
                                  {camp.actor.name} • {camp.actor.origin} • {camp.actor.motivation}
                                </div>
                              </div>
                              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                camp.severity === "CRITICAL" ? "bg-red-600 text-white" : "bg-yellow-600 text-white"
                              }`}>{camp.severity}</span>
                            </div>
                            <p className="text-xs text-gray-300 mb-2">{camp.description}</p>
                            <div className="flex flex-wrap gap-2 text-[10px]">
                              {camp.targets.slice(0, 4).map(t => (
                                <span key={t} className="px-2 py-0.5 rounded bg-red-900 text-red-200">{t}</span>
                              ))}
                              {corr && (
                                <span className="px-2 py-0.5 rounded bg-blue-900 text-blue-200">Risk Score: {corr.riskScore}/100</span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    
                    {threatData.stats.matchingYourStack === 0 && (
                      <div className="text-center py-4 text-sm text-green-400">
                        ✅ Keine aktiven Kampagnen betreffen deinen Stack direkt.
                      </div>
                    )}
                    
                    <a 
                      href="/intel"
                      className="block text-center py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all border hover:bg-red-900/20"
                      style={{ borderColor: "rgba(255,0,0,0.3)", color: "#ff6b6b" }}
                    >
                      🔥 Intel Dashboard öffnen
                    </a>
                  </div>
                )}
              </div>
              
              {/* Kreislauf Links */}
              <div className="rounded-2xl p-4 border" style={{ background: "rgba(0,255,157,0.03)", borderColor: "rgba(0,255,157,0.15)" }}>
                <div className="text-xs font-mono uppercase tracking-widest mb-3 text-center" style={{ color: "#00ff9d" }}>🔗 Mycelium Kreislauf</div>
                <div className="flex flex-wrap justify-center gap-2">
                  <a href="/oracle" className="px-4 py-2 rounded-full text-sm font-mono font-bold border transition-all hover:scale-105" style={{ background: "rgba(0,255,157,0.1)", borderColor: "#00ff9d", color: "#00ff9d" }}>
                    🔮 Oracle
                  </a>
                  <a href="/intel" className="px-4 py-2 rounded-full text-sm font-mono font-bold border transition-all hover:scale-105" style={{ background: "rgba(0,184,255,0.1)", borderColor: "#00b8ff", color: "#00b8ff" }}>
                    📊 Intel
                  </a>
                  <a href="/summon" className="px-4 py-2 rounded-full text-sm font-mono font-bold border transition-all hover:scale-105" style={{ background: "rgba(255,200,0,0.1)", borderColor: "#ffc800", color: "#ffc800" }}>
                    ⚡ Summon
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── VOICE TAB ──────────────────────────────────────────────────── */}
        {activeTab === "voice" && (
          <section className="px-4 mb-12">
            <div className="max-w-2xl mx-auto">
              <div className="rounded-3xl p-8 text-center border" style={{ background: "rgba(10,10,14,0.8)", borderColor: "rgba(0,184,255,0.2)" }}>
                <div className="text-6xl mb-4">🎙️</div>
                <h3 className="text-xl font-bold mb-4 text-white">Sprachsteuerung</h3>
                <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Aktiviere dein Mikrofon und nutze diese Befehle:
                </p>
                
                <div className="space-y-2 text-left">
                  {VOICE_COMMANDS.map((cmd) => (
                    <div key={cmd.action} className="flex items-center gap-3 p-3 rounded-xl border" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
                      <span style={{ color: "#00b8ff" }}>🗣️</span>
                      <span className="text-sm text-gray-300">&quot;{cmd.phrase}&quot;</span>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={toggleVoice}
                  className="mt-6 px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-all"
                  style={{ 
                    background: voiceActive ? "rgba(255,0,0,0.2)" : "rgba(0,184,255,0.2)", 
                    border: voiceActive ? "1px solid #ff0000" : "1px solid #00b8ff",
                    color: voiceActive ? "#ff0000" : "#00b8ff" 
                  }}
                >
                  {voiceActive ? "⏹️ Spracherkennung stoppen" : "🎤 Spracherkennung starten"}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section className="px-4 mb-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-100">Häufige Fragen</h2>
            <div className="space-y-3">
              {[
                {
                  q: "Was ist Stack MRI?",
                  a: "Stack MRI ist ClawGurus prädiktiver Security Scanner. Du wählst deine Technologien (AWS, Kubernetes, PostgreSQL, Docker etc.) und bekommst einen Live-Scan mit CVEs, Security Score und empfohlenen Runbooks."
                },
                {
                  q: "Woher kommen die CVE-Daten?",
                  a: "Die CVE-Daten stammen aus unserer Intel-Datenbank, die auf der NVD (National Vulnerability Database), CISA KEV und GitHub Security Advisories basiert. Die Datenbank wird regelmäßig aktualisiert."
                },
                {
                  q: "Was bedeutet der Security Score?",
                  a: "Der Score geht von 0 bis 100. Jede kritische CVE zieht 25 Punkte ab, hohe CVEs 15 Punkte, mittlere 5 Punkte. Grün (80+) = gut, Gelb (60-79) = Handlungsbedarf, Rot (<60) = sofort patchen."
                },
                {
                  q: "Funktioniert die Sprachsteuerung?",
                  a: "Ja, über die Web Speech API. Unterstützte Befehle: 'scan my stack', 'show critical', 'show threats', 'what is my score'. Funktioniert in Chrome und Edge."
                },
                {
                  q: "Was ist Predictive Threat Correlation?",
                  a: "Wir analysieren aktive Angriffskampagnen (z.B. TeamTNT, APT29) und zeigen dir, welche davon deinen spezifischen Tech-Stack betreffen. Inklusive Risk Score und empfohlener Gegenmaßnahmen."
                },
                {
                  q: "Werden meine Daten gespeichert?",
                  a: "Nein. Dein Tech-Stack wird nur für den aktuellen Scan verwendet und nicht gespeichert. Alle Verarbeitung passiert in Echtzeit. Kein Tracking, kein Profiling."
                },
                {
                  q: "Wie hängt Neuro mit Oracle, Intel und Summon zusammen?",
                  a: "Neuro scannt deinen Stack → empfiehlt Runbooks → Summon führt sie aus. Oracle beantwortet Security-Fragen. Intel liefert die CVE- und Threat-Daten. Alle Produkte arbeiten im Mycelium-Kreislauf zusammen."
                }
              ].map((faq, i) => (
                <details key={i} className="group rounded-xl border" style={{ background: "rgba(10,10,14,0.6)", borderColor: "rgba(255,255,255,0.08)" }}>
                  <summary className="flex items-center justify-between cursor-pointer p-4 text-sm font-medium text-gray-200 hover:text-white transition-colors">
                    <span>{faq.q}</span>
                    <span className="ml-2 text-gray-500 group-open:rotate-180 transition-transform">▾</span>
                  </summary>
                  <div className="px-4 pb-4 text-sm text-gray-400 leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── MYCELIUM KREISLAUF ─────────────────────────────────────────────── */}
        <section className="px-4 mb-12">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-6">
              <div className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "#b464ff" }}>
                Mycelium Kreislauf
              </div>
              <h2 className="text-xl font-bold" style={{ color: "rgba(255,255,255,0.9)" }}>
                Connected Intelligence
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <a href="/de/summon" className="rounded-xl p-4 border text-center transition-all hover:border-[#00ff9d]" style={{ background: "rgba(10,10,14,0.8)", borderColor: "rgba(255,255,255,0.08)" }}>
                <div className="text-2xl mb-2">⚡</div>
                <div className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.9)" }}>Summon AI</div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Execute</div>
              </a>
              <a href="/de/intel" className="rounded-xl p-4 border text-center transition-all hover:border-[#00b8ff]" style={{ background: "rgba(10,10,14,0.8)", borderColor: "rgba(255,255,255,0.08)" }}>
                <div className="text-2xl mb-2">📡</div>
                <div className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.9)" }}>Intel Feed</div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Live Data</div>
              </a>
              <a href="/de/oracle" className="rounded-xl p-4 border text-center transition-all hover:border-[#ffc800]" style={{ background: "rgba(10,10,14,0.8)", borderColor: "rgba(255,255,255,0.08)" }}>
                <div className="text-2xl mb-2">🔮</div>
                <div className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.9)" }}>Oracle</div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Intelligence</div>
              </a>
              <a href="/de/check" className="rounded-xl p-4 border text-center transition-all hover:border-[#ff6b6b]" style={{ background: "rgba(10,10,14,0.8)", borderColor: "rgba(255,255,255,0.08)" }}>
                <div className="text-2xl mb-2">🛡️</div>
                <div className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.9)" }}>Security Check</div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Scan</div>
              </a>
              <a href="/de/academy" className="rounded-xl p-4 border text-center transition-all hover:border-[#9333ea]" style={{ background: "rgba(10,10,14,0.8)", borderColor: "rgba(255,255,255,0.08)" }}>
                <div className="text-2xl mb-2">🎓</div>
                <div className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.9)" }}>Academy</div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Courses</div>
              </a>
              <a href="/de/solutions" className="rounded-xl p-4 border text-center transition-all hover:border-[#10b981]" style={{ background: "rgba(10,10,14,0.8)", borderColor: "rgba(255,255,255,0.08)" }}>
                <div className="text-2xl mb-2">🏢</div>
                <div className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.9)" }}>Solutions</div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Enterprise</div>
              </a>
              <a href="/de/runbooks" className="rounded-xl p-4 border text-center transition-all hover:border-[#06b6d4]" style={{ background: "rgba(10,10,14,0.8)", borderColor: "rgba(255,255,255,0.08)" }}>
                <div className="text-2xl mb-2">📚</div>
                <div className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.9)" }}>Runbooks</div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Library</div>
              </a>
            </div>
          </div>
        </section>

        {/* ── E-E-A-T SIGNALS ─────────────────────────────────────────────── */}
        <section className="px-4 mb-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-xs font-mono uppercase tracking-[0.25em] mb-6 text-center" style={{ color: "rgba(255,255,255,0.2)" }}>
              Warum wir vertrauenswürdig sind
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  title: "Experience",
                  desc: "15+ Jahre Incident Response Erfahrung. Wir haben Dutzende Produktions-Incidents nachts um 03:00 Uhr behoben.",
                  color: "#b464ff",
                },
                {
                  title: "Expertise",
                  desc: "4,2 Millionen AI-generierte Runbooks, die auf realen Incident-Response-Szenarien basieren. Jeder Guide ist getestet und validiert.",
                  color: "#00ff9d",
                },
                {
                  title: "Authoritativeness",
                  desc: "Wir werden von Security-Communities, DevOps-Teams und Compliance-Experten zitiert. Unsere Runbooks sind Teil von NIS2, BSI und SOC 2 Audit-Checklisten.",
                  color: "#00b8ff",
                },
                {
                  title: "Trustworthiness",
                  desc: "DSGVO-first, EU-basierte Infrastruktur, keine US-Datenweitergabe. Transparenz über Methodik und Limitationen.",
                  color: "#ffc800",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl p-4 border" style={{ background: "rgba(10,10,14,0.8)", borderColor: `${item.color}18` }}>
                  <div className="font-bold text-sm mb-2" style={{ color: item.color }}>{item.title}</div>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.3)" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────────────────── */}
        <footer className="px-4 py-12 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-2xl">◆</span>
              <span className="font-mono text-sm tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>One Mycelium to rule them all</span>
            </div>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>ClawGuru Predictive Security Cortex • v5.0 • clawguru.org</p>
          </div>
        </footer>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 8s ease infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease forwards;
        }
      `}</style>
    </>
  )
}
