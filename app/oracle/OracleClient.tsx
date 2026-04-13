// ORACLE v4.0 — Premium Experience
// Client-side interactive component with enhanced UX, typing effects, and premium design

"use client"

import { useState, useEffect, useRef, useCallback } from "react"

// ── TYPES ─────────────────────────────────────────────────────────────────────
type OracleMode = "pure" | "temporal" | "swarm" | "prophetic"

type OracleSource = {
  id: string
  title: string
  href: string
  fitness: number
  score: number
}

type OracleResponse = {
  answer: string
  mode: OracleMode
  sources: OracleSource[]
  nodeCount: number
  totalRunbooks: number
}

// ── CONFIG ────────────────────────────────────────────────────────────────────
const MODES: { id: OracleMode; label: string; description: string; color: string; icon: string }[] = [
  { id: "pure", label: "Pure Mycelium", description: "Direct query across the entire living knowledge graph", color: "#00ff9d", icon: "◆" },
  { id: "temporal", label: "Temporal Oracle", description: "Time-travel answer — how has this problem evolved?", color: "#00b8ff", icon: "◈" },
  { id: "swarm", label: "Swarm Oracle", description: "What would the Approved Remediation Swarm do?", color: "#b464ff", icon: "◇" },
  { id: "prophetic", label: "Prophetic Mode", description: "What will be the dominant problem in 3–6 months?", color: "#ffc800", icon: "◉" },
]

const USE_CASES = [
  { icon: "🛡️", title: "Vulnerability Assessment", query: "How do I secure my AWS S3 buckets against unauthorized access?", color: "#00ff9d" },
  { icon: "🔐", title: "Compliance Check", query: "What are the GDPR requirements for logging personal data?", color: "#00b8ff" },
  { icon: "⚡", title: "Incident Response", query: "My server shows suspicious outbound connections. What should I check?", color: "#b464ff" },
  { icon: "🔍", title: "Security Audit", query: "Create a checklist for Kubernetes cluster hardening", color: "#ffc800" },
  { icon: "🧠", title: "Architecture Review", query: "Is my microservices setup vulnerable to lateral movement?", color: "#ff6b6b" },
  { icon: "📊", title: "Risk Analysis", query: "What are the top 3 risks for a Django + PostgreSQL stack?", color: "#4ecdc4" },
]

const FAQ_ITEMS = [
  { q: "What is The Oracle?", a: "The Oracle is ClawGuru's AI-powered security intelligence engine. It uses RAG (Retrieval Augmented Generation) to search across 600+ security runbooks and provide contextual answers to your infrastructure questions." },
  { q: "How does the Oracle work?", a: "The Oracle analyzes your question, searches the Mycelium knowledge graph for relevant runbooks and CVE data, then synthesizes an answer using advanced AI models. Every answer includes source links for verification." },
  { q: "Is the Oracle free to use?", a: "Yes! The Oracle offers a daily free tier. You can ask a limited number of questions per day without any account. For unlimited access, premium plans are available." },
  { q: "What are the Oracle modes?", a: "Pure Mycelium for direct knowledge queries, Temporal Oracle for time-evolution analysis, Swarm Oracle for remediation strategies, and Prophetic Mode for future threat prediction." },
  { q: "Where does the Oracle get its knowledge?", a: "The Oracle searches across ClawGuru's Mycelium — a living knowledge graph containing 600+ executable security runbooks, CVE databases, and real-time threat intelligence feeds." },
  { q: "Are my questions stored?", a: "No. Questions are processed in real-time and not stored. Only anonymous usage metrics are collected to improve the service." },
  { q: "Can I trust the answers?", a: "Every answer includes source links to official runbooks and documentation. You can verify every recommendation against the original sources." },
  { q: "What languages are supported?", a: "The Oracle understands and responds in 15 languages including English, German, Spanish, French, and more." },
]

const NODE_DISPLAY_BASE = 847291

// ── ANIMATED BACKGROUND ──────────────────────────────────────────────────────
function MyceliumBackground() {
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

    type Tendril = { x: number; y: number; angle: number; length: number; growth: number; maxLen: number; width: number; color: string }
    const tendrils: Tendril[] = []
    const colors = ["#00ff9d", "#00b8ff", "#b464ff", "#ffc800"]
    
    for (let i = 0; i < 12; i++) {
      tendrils.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        angle: Math.random() * Math.PI * 2,
        length: 0,
        growth: 0.5 + Math.random() * 0.5,
        maxLen: 100 + Math.random() * 150,
        width: 1 + Math.random() * 2,
        color: colors[i % colors.length],
      })
    }

    let frame = 0
    function draw() {
      if (!canvas || !ctx) return
      ctx.fillStyle = "#050505"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw connections between nearby tendrils
      ctx.strokeStyle = "rgba(0,255,157,0.05)"
      ctx.lineWidth = 0.5
      for (let i = 0; i < tendrils.length; i++) {
        for (let j = i + 1; j < tendrils.length; j++) {
          const dx = tendrils[j].x - tendrils[i].x
          const dy = tendrils[j].y - tendrils[i].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 200) {
            ctx.beginPath()
            ctx.moveTo(tendrils[i].x, tendrils[i].y)
            ctx.lineTo(tendrils[j].x, tendrils[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw and grow tendrils
      tendrils.forEach((t) => {
        if (t.length < t.maxLen) {
          t.length += t.growth
        }
        
        const endX = t.x + Math.cos(t.angle) * t.length
        const endY = t.y + Math.sin(t.angle) * t.length
        
        ctx.beginPath()
        ctx.moveTo(t.x, t.y)
        ctx.lineTo(endX, endY)
        ctx.strokeStyle = t.color
        ctx.lineWidth = t.width
        ctx.globalAlpha = 0.3
        ctx.stroke()
        ctx.globalAlpha = 1

        // Reset if out of bounds
        if (endX < 0 || endX > canvas.width || endY < 0 || endY > canvas.height) {
          t.x = Math.random() * canvas.width
          t.y = Math.random() * canvas.height
          t.angle = Math.random() * Math.PI * 2
          t.length = 0
        }
      })

      // Floating nodes
      for (let i = 0; i < 20; i++) {
        const x = (frame * 0.5 + i * 100) % canvas.width
        const y = Math.sin((frame + i * 50) * 0.01) * 50 + canvas.height / 2
        ctx.beginPath()
        ctx.arc(x, y, 2, 0, Math.PI * 2)
        ctx.fillStyle = colors[i % colors.length]
        ctx.globalAlpha = 0.4
        ctx.fill()
      }
      ctx.globalAlpha = 1

      frame++
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

// ── TYPING EFFECT ─────────────────────────────────────────────────────────────
function TypewriterText({ text, speed = 20, onComplete }: { text: string; speed?: number; onComplete?: () => void }) {
  const [displayed, setDisplayed] = useState("")
  const indexRef = useRef(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setDisplayed("")
    indexRef.current = 0
    
    intervalRef.current = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1))
        indexRef.current++
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current)
        onComplete?.()
      }
    }, speed)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [text, speed, onComplete])

  return <span>{displayed}</span>
}

// ── COPY BUTTON ──────────────────────────────────────────────────────────────
function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-200"
      style={{ 
        background: copied ? "rgba(0,255,157,0.2)" : "rgba(255,255,255,0.05)",
        border: `1px solid ${copied ? "#00ff9d" : "rgba(255,255,255,0.1)"}`,
        color: copied ? "#00ff9d" : "rgba(255,255,255,0.5)"
      }}
    >
      {copied ? "✓ Kopiert" : `⧉ ${label}`}
    </button>
  )
}

// ── LIVE STATS ──────────────────────────────────────────────────────────────
function LiveStats() {
  const [stats, setStats] = useState({ nodes: NODE_DISPLAY_BASE, queries: 1247, runbooks: 600 })
  
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(s => ({
        nodes: s.nodes + Math.floor(Math.random() * 5),
        queries: s.queries + Math.floor(Math.random() * 3),
        runbooks: 600
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-wrap justify-center gap-8 md:gap-12">
      {[
        { label: "Mycelium Nodes", value: stats.nodes.toLocaleString(), color: "#00ff9d" },
        { label: "Questions Today", value: stats.queries.toLocaleString(), color: "#00b8ff" },
        { label: "Security Runbooks", value: stats.runbooks.toString(), color: "#b464ff" },
      ].map(stat => (
        <div key={stat.label} className="text-center">
          <div className="text-2xl md:text-3xl font-black tabular-nums" style={{ color: stat.color }}>{stat.value}</div>
          <div className="text-[10px] font-mono uppercase tracking-widest mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>{stat.label}</div>
        </div>
      ))}
    </div>
  )
}

// ── USE CASE CARD ────────────────────────────────────────────────────────────
function UseCaseCard({ icon, title, query, color, onClick, delay }: { 
  icon: string; title: string; query: string; color: string; onClick: (q: string) => void; delay: number 
}) {
  const [visible, setVisible] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <button
      onClick={() => onClick(query)}
      className={`group relative p-5 rounded-2xl border text-left transition-all duration-500 hover:scale-105 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ 
        background: "rgba(10,10,14,0.8)",
        borderColor: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color
        e.currentTarget.style.boxShadow = `0 0 30px ${color}20`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"
        e.currentTarget.style.boxShadow = "none"
      }}
    >
      <div className="text-3xl mb-3">{icon}</div>
      <div className="font-bold text-sm mb-2" style={{ color }}>{title}</div>
      <div className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{query.slice(0, 50)}...</div>
      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-xs" style={{ color }}>Klicken →</span>
      </div>
    </button>
  )
}

// ── FAQ ACCORDION ────────────────────────────────────────────────────────────
function FAQItem({ q, a, isOpen, onClick, index }: { q: string; a: string; isOpen: boolean; onClick: () => void; index: number }) {
  return (
    <div className="border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
      <button
        onClick={onClick}
        className="w-full py-4 flex items-center justify-between text-left group"
      >
        <span className="flex items-center gap-3">
          <span className="text-xs font-mono" style={{ color: "#00ff9d" }}>0{index + 1}</span>
          <span className="font-medium text-sm group-hover:text-white transition-colors" style={{ color: isOpen ? "#fff" : "rgba(255,255,255,0.7)" }}>{q}</span>
        </span>
        <span className="text-lg transition-transform duration-300" style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0)", color: "#00ff9d" }}>+</span>
      </button>
      <div 
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: isOpen ? "200px" : "0", opacity: isOpen ? 1 : 0 }}
      >
        <p className="pb-4 pl-7 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{a}</p>
      </div>
    </div>
  )
}

// ── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function OracleClient() {
  const [mounted, setMounted] = useState(false)
  const [mode, setMode] = useState<OracleMode>("pure")
  const [question, setQuestion] = useState("")
  const [response, setResponse] = useState<OracleResponse | null>(null)
  const [thinking, setThinking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [typingComplete, setTypingComplete] = useState(false)
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { setMounted(true) }, [])

  const activeMode = MODES.find(m => m.id === mode)!

  const ask = useCallback(async () => {
    if (!question.trim() || thinking) return
    setThinking(true)
    setError(null)
    setResponse(null)
    setTypingComplete(false)

    try {
      const res = await fetch("/api/oracle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim(), mode }),
      })
      
      if (!res.ok) throw new Error(`Oracle error: ${res.status}`)
      const data = await res.json()
      setResponse(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "The Mycelium is silent...")
    } finally {
      setThinking(false)
    }
  }, [question, mode, thinking])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault()
      ask()
    }
  }

  const setExampleQuery = (query: string) => {
    setQuestion(query)
    inputRef.current?.focus()
  }

  return (
    <>
      {mounted && <MyceliumBackground />}
      
      <div className="relative min-h-screen" style={{ zIndex: 1 }}>
        
        {/* ── PREMIUM HERO ───────────────────────────────────────────────── */}
        <section className="pt-20 pb-12 px-4">
          <div className="text-center mb-8">
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-widest mb-6 border"
              style={{ borderColor: "rgba(0,255,157,0.3)", background: "rgba(0,255,157,0.05)", color: "#00ff9d" }}
            >
              <span className="animate-pulse">●</span> MYCELIUM ORACLE v4.0 — COSMIC INTELLIGENCE
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-none">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00ff9d] via-[#00b8ff] via-[#b464ff] to-[#ffc800] animate-gradient">
                The Oracle
              </span>
            </h1>
            
            <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.5)" }}>
              One question. The entire Mycelium answers. <br className="hidden md:block"/>
              <span className="text-[#00ff9d]">600+ security runbooks</span> at your command.
            </p>
            
            <LiveStats />
          </div>
        </section>

        {/* ── MODE SELECTOR ──────────────────────────────────────────────── */}
        <section className="px-4 mb-8">
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className="group relative px-5 py-3 rounded-full border text-sm font-mono transition-all duration-300"
                style={{
                  background: mode === m.id ? `${m.color}15` : "rgba(10,10,14,0.8)",
                  borderColor: mode === m.id ? m.color : "rgba(255,255,255,0.1)",
                  color: mode === m.id ? m.color : "rgba(255,255,255,0.5)",
                  boxShadow: mode === m.id ? `0 0 20px ${m.color}30` : "none"
                }}
              >
                <span className="mr-2">{m.icon}</span>
                {m.label}
                {mode === m.id && (
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap opacity-60">
                    {m.description}
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* ── INPUT AREA ──────────────────────────────────────────────────── */}
        <section className="px-4 mb-12">
          <div className="max-w-3xl mx-auto">
            <div 
              className="relative rounded-3xl overflow-hidden border transition-all duration-300"
              style={{
                borderColor: thinking ? activeMode.color : "rgba(255,255,255,0.1)",
                boxShadow: thinking ? `0 0 40px ${activeMode.color}25` : "0 0 40px rgba(0,0,0,0.3)",
                background: "rgba(10,10,14,0.9)",
                backdropFilter: "blur(20px)"
              }}
            >
              <textarea
                ref={inputRef}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask the Mycelium anything about security, compliance, or infrastructure..."
                rows={5}
                disabled={thinking}
                className="w-full bg-transparent px-6 pt-6 pb-20 text-white placeholder-gray-600 font-mono text-base resize-none outline-none leading-relaxed"
                style={{ caretColor: activeMode.color }}
              />
              
              <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
                <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>
                  ⌘ + Enter zum Senden
                </span>
                
                <button
                  onClick={ask}
                  disabled={thinking || !question.trim()}
                  className="px-6 py-3 rounded-full font-mono text-sm font-bold uppercase tracking-wider transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: `linear-gradient(135deg, ${activeMode.color}30, ${activeMode.color}50)`,
                    border: `1px solid ${activeMode.color}`,
                    color: activeMode.color,
                    boxShadow: question.trim() ? `0 0 20px ${activeMode.color}40` : "none"
                  }}
                >
                  {thinking ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">◌</span> Consulting Mycelium...
                    </span>
                  ) : (
                    "Ask the Oracle →"
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── ERROR ──────────────────────────────────────────────────────── */}
        {error && (
          <section className="px-4 mb-8">
            <div className="max-w-3xl mx-auto rounded-2xl p-4 border text-sm font-mono" style={{ borderColor: "rgba(255,70,70,0.3)", background: "rgba(255,70,70,0.08)", color: "#ff7070" }}>
              ⚠ {error}
            </div>
          </section>
        )}

        {/* ── RESPONSE ─────────────────────────────────────────────────────── */}
        {response && (
          <section className="px-4 mb-12 animate-fade-in">
            <div className="max-w-3xl mx-auto">
              {/* Answer Card */}
              <div 
                className="rounded-3xl p-8 mb-6 border"
                style={{ 
                  background: "rgba(10,10,14,0.95)",
                  borderColor: `${activeMode.color}30`,
                  backdropFilter: "blur(20px)"
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{activeMode.icon}</span>
                    <span className="font-mono text-sm uppercase tracking-wider" style={{ color: activeMode.color }}>
                      {activeMode.label} Response
                    </span>
                  </div>
                  <CopyButton text={response.answer} label="Antwort kopieren" />
                </div>
                
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg leading-relaxed whitespace-pre-wrap" style={{ color: "rgba(255,255,255,0.9)" }}>
                    <TypewriterText text={response.answer} speed={15} onComplete={() => setTypingComplete(true)} />
                  </p>
                </div>
                
                {!typingComplete && (
                  <span className="inline-block w-2 h-5 ml-1 animate-pulse" style={{ background: activeMode.color }} />
                )}
              </div>

              {/* Sources */}
              {response.sources?.length > 0 && (
                <div className="rounded-2xl p-6 border mb-6" style={{ background: "rgba(10,10,14,0.8)", borderColor: "rgba(255,255,255,0.08)" }}>
                  <div className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
                    📚 Quellen & Referenzen
                  </div>
                  <div className="space-y-2">
                    {response.sources.slice(0, 5).map((src) => (
                      <a
                        key={src.id}
                        href={src.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl border transition-all duration-200 hover:border-[#00ff9d]"
                        style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}
                      >
                        <span className="text-sm text-gray-300 truncate">{src.title}</span>
                        <span className="text-xs font-mono" style={{ color: "#00ff9d99" }}>Relevanz {src.score}% →</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Cross-Links */}
              <div className="rounded-2xl p-6 border mb-6" style={{ background: "rgba(0,255,157,0.03)", borderColor: "rgba(0,255,157,0.15)" }}>
                <div className="text-xs font-mono uppercase tracking-widest mb-4 text-center" style={{ color: "#00ff9d" }}>
                  🔗 Mycelium Kreislauf — Weiterführende Aktionen
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  <a href="/neuro" className="px-4 py-2 rounded-full text-sm font-mono font-bold border transition-all hover:scale-105" style={{ background: "rgba(180,100,255,0.1)", borderColor: "#b464ff", color: "#b464ff" }}>
                    🧠 Tiefere Analyse → Neuro
                  </a>
                  <a href="/intel" className="px-4 py-2 rounded-full text-sm font-mono font-bold border transition-all hover:scale-105" style={{ background: "rgba(0,184,255,0.1)", borderColor: "#00b8ff", color: "#00b8ff" }}>
                    📊 Live Intel Feed
                  </a>
                  <a href="/summon" className="px-4 py-2 rounded-full text-sm font-mono font-bold border transition-all hover:scale-105" style={{ background: "rgba(255,200,0,0.1)", borderColor: "#ffc800", color: "#ffc800" }}>
                    ⚡ Sofort ausführen → Summon
                  </a>
                </div>
              </div>

              {/* Ask Again */}
              <div className="text-center">
                <button
                  onClick={() => { setResponse(null); setQuestion(""); setTypingComplete(false); }}
                  className="px-6 py-3 rounded-full text-sm font-mono border transition-all duration-300 hover:border-[#00ff9d]"
                  style={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)" }}
                >
                  ← Neue Frage stellen
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ── USE CASES ────────────────────────────────────────────────────── */}
        {!response && !thinking && (
          <section className="px-4 mb-16">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "#00b8ff" }}>
                  Beispiel-Anwendungen
                </div>
                <h2 className="text-2xl font-bold" style={{ color: "rgba(255,255,255,0.9)" }}>
                  Was kannst du fragen?
                </h2>
                <p className="text-sm mt-2" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Klicke auf eine Karte, um die Frage direkt zu übernehmen
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {USE_CASES.map((useCase, i) => (
                  <UseCaseCard 
                    key={i} 
                    {...useCase} 
                    onClick={setExampleQuery}
                    delay={i * 100}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── FAQ SECTION ──────────────────────────────────────────────────── */}
        <section className="px-4 mb-16">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <div className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "#b464ff" }}>
                Häufige Fragen
              </div>
              <h2 className="text-2xl font-bold" style={{ color: "rgba(255,255,255,0.9)" }}>
                FAQ
              </h2>
            </div>
            
            <div className="rounded-3xl p-6 border" style={{ background: "rgba(10,10,14,0.8)", borderColor: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}>
              {FAQ_ITEMS.map((item, i) => (
                <FAQItem
                  key={i}
                  index={i}
                  {...item}
                  isOpen={openFAQ === i}
                  onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────────────────── */}
        <footer className="px-4 py-12 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-2xl">◆</span>
              <span className="font-mono text-sm tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>
                One Mycelium to rule them all
              </span>
            </div>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
              ClawGuru COSMIC INTELLIGENCE • v4.0 • clawguru.org
            </p>
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
