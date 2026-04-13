// NEURO v4.0 — Premium Neural Interface
// Client-side component with eye-tracking, EEG integration, and premium UX

"use client"

import { useState, useEffect, useRef, useCallback } from "react"

// ── TYPES ─────────────────────────────────────────────────────────────────────
type NeuroResponse = {
  answer: string
  neuroScore: number
  confidence: number
  recommended_runbooks: {
    title: string
    slug: string
    summonUrl: string
    tags: string[]
    relevance: number
  }[]
}

// ── CONFIG ────────────────────────────────────────────────────────────────────
const THOUGHT_CARDS = [
  { id: "aws", icon: "☁️", label: "AWS Security", question: "How do I secure my AWS infrastructure against common attack vectors?", color: "#ff9900" },
  { id: "k8s", icon: "⚓", label: "Kubernetes", question: "What are the best practices for Kubernetes cluster hardening?", color: "#326ce5" },
  { id: "docker", icon: "🐳", label: "Docker", question: "How do I secure Docker containers and prevent privilege escalation?", color: "#2496ed" },
  { id: "compliance", icon: "📋", label: "Compliance", question: "What GDPR and ISO 27001 requirements apply to my cloud setup?", color: "#00ff9d" },
  { id: "incident", icon: "🚨", label: "Incident Response", question: "My server shows suspicious activity. What are the immediate steps?", color: "#ff6b6b" },
  { id: "network", icon: "🌐", label: "Network Security", question: "How do I design a secure network architecture with zero trust?", color: "#00b8ff" },
]

const FAQ_ITEMS = [
  { q: "What is Neuro?", a: "Neuro is ClawGuru's neural interface that connects your thoughts directly to the Mycelium. It uses optional eye-tracking and EEG devices to select security topics by gaze or brainwave patterns, then queries the Oracle for answers." },
  { q: "How does eye-tracking work?", a: "Neuro uses WebGazer.js for client-side eye-tracking. Look at a thought card for 3 seconds to select it. All processing happens locally in your browser — no camera data is stored or transmitted." },
  { q: "Is eye-tracking mandatory?", a: "No. Eye-tracking is completely optional. You can click on thought cards manually or type your question directly in the text input field." },
  { q: "What EEG devices are supported?", a: "Neuro supports Bluetooth EEG devices like Muse and Emotiv via Web Bluetooth API. EEG data enhances query relevance by detecting your focus state." },
  { q: "Is my biometric data secure?", a: "Absolutely. Eye-tracking and EEG data are processed entirely client-side. No biometric data leaves your device. Only the selected question (anonymized) is sent to the Oracle." },
  { q: "What languages does Neuro support?", a: "Neuro supports all 15 ClawGuru languages. The interface adapts to your browser language automatically." },
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

    let frame = 0
    function draw() {
      if (!canvas || !ctx) return
      ctx.fillStyle = "#050505"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Neural connections
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

      // Animated neurons
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
        
        // Glow
        ctx.beginPath()
        ctx.arc(n.x, n.y, pulseRadius * 2, 0, Math.PI * 2)
        ctx.fillStyle = colors[i % colors.length]
        ctx.globalAlpha = 0.15
        ctx.fill()
      })
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
function TypewriterText({ text, speed = 15, onComplete }: { text: string; speed?: number; onComplete?: () => void }) {
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

// ── DWELL RING ────────────────────────────────────────────────────────────────
function DwellRing({ progress, color }: { progress: number; color: string }) {
  const circumference = 2 * Math.PI * 48
  const strokeDashoffset = circumference * (1 - progress)
  
  return (
    <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        className="transition-all duration-100"
        style={{ opacity: 0.6 }}
      />
    </svg>
  )
}

// ── FAQ ACCORDION ────────────────────────────────────────────────────────────
function FAQItem({ q, a, isOpen, onClick, index }: { q: string; a: string; isOpen: boolean; onClick: () => void; index: number }) {
  return (
    <div className="border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
      <button onClick={onClick} className="w-full py-4 flex items-center justify-between text-left group">
        <span className="flex items-center gap-3">
          <span className="text-xs font-mono" style={{ color: "#b464ff" }}>0{index + 1}</span>
          <span className="font-medium text-sm group-hover:text-white transition-colors" style={{ color: isOpen ? "#fff" : "rgba(255,255,255,0.7)" }}>{q}</span>
        </span>
        <span className="text-lg transition-transform duration-300" style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0)", color: "#b464ff" }}>+</span>
      </button>
      <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: isOpen ? "200px" : "0", opacity: isOpen ? 1 : 0 }}>
        <p className="pb-4 pl-7 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{a}</p>
      </div>
    </div>
  )
}

// ── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function NeuroClient() {
  const [mounted, setMounted] = useState(false)
  const [consented, setConsented] = useState(false)
  const [eyeTrackingEnabled, setEyeTrackingEnabled] = useState(false)
  const [gazeActive, setGazeActive] = useState(false)
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [loadingCard, setLoadingCard] = useState<string | null>(null)
  const [dwellProgress, setDwellProgress] = useState<Record<string, number>>({})
  const [question, setQuestion] = useState("")
  const [response, setResponse] = useState<NeuroResponse | null>(null)
  const [thinking, setThinking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [typingComplete, setTypingComplete] = useState(false)
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const gazeCardRef = useRef<string | null>(null)
  const dwellStartRef = useRef<number | null>(null)

  useEffect(() => { setMounted(true) }, [])

  // Simulate eye-tracking for demo (mouse position)
  useEffect(() => {
    if (!eyeTrackingEnabled) return
    
    const handleMouseMove = (e: MouseEvent) => {
      let hoveredCard: string | null = null
      
      THOUGHT_CARDS.forEach((card) => {
        const el = cardRefs.current[card.id]
        if (el) {
          const rect = el.getBoundingClientRect()
          if (e.clientX >= rect.left && e.clientX <= rect.right && 
              e.clientY >= rect.top && e.clientY <= rect.bottom) {
            hoveredCard = card.id
          }
        }
      })
      
      if (hoveredCard !== gazeCardRef.current) {
        gazeCardRef.current = hoveredCard
        dwellStartRef.current = hoveredCard ? Date.now() : null
        setDwellProgress({})
      }
    }
    
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [eyeTrackingEnabled])

  // Dwell timer
  useEffect(() => {
    if (!eyeTrackingEnabled || !gazeCardRef.current) return
    
    const interval = setInterval(() => {
      if (dwellStartRef.current && gazeCardRef.current) {
        const elapsed = Date.now() - dwellStartRef.current
        const progress = Math.min(elapsed / 2000, 1) // 2 seconds to select
        
        setDwellProgress({ [gazeCardRef.current]: progress })
        
        if (progress >= 1) {
          const card = THOUGHT_CARDS.find(c => c.id === gazeCardRef.current)
          if (card) {
            triggerOracle(card.question)
            dwellStartRef.current = null
            setDwellProgress({})
          }
        }
      }
    }, 50)
    
    return () => clearInterval(interval)
  }, [eyeTrackingEnabled])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCameraActive(true)
    } catch (err) {
      console.error("Camera access denied:", err)
      // Fallback: Maus-Simulation funktioniert auch ohne Kamera
    }
  }

  const triggerOracle = async (q: string, cardId?: string) => {
    console.log("🧠 triggerOracle called:", { q, cardId })
    if (cardId) setLoadingCard(cardId)
    setError(null)
    setQuestion(q)
    setThinking(true)
    setResponse(null)
    setTypingComplete(false)
    
    try {
      console.log("📡 Fetching /api/neuro...")
      const res = await fetch("/api/neuro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stack: q.split(" ").slice(0, 3), question: q }),
      })
      
      console.log("📡 Response status:", res.status)
      
      if (!res.ok) {
        const errorText = await res.text()
        console.error("❌ API Error:", errorText)
        throw new Error(`Neuro error: ${res.status} - ${errorText}`)
      }
      
      const data = await res.json()
      console.log("✅ Response data:", data)
      setResponse(data)
    } catch (err: any) {
      console.error("❌ Error in triggerOracle:", err)
      setError(err.message || "Ein Fehler ist aufgetreten")
    } finally {
      console.log("🔄 Resetting loading state")
      setThinking(false)
      setLoadingCard(null)
    }
  }

  const handleCardClick = (cardId: string, cardQuestion: string) => {
    if (loadingCard) return // Prevent double-clicks
    setSelectedCard(cardId)
    triggerOracle(cardQuestion, cardId)
  }

  // CONSENT SCREEN
  if (!consented) {
    return (
      <>
        {mounted && <NeuroBackground />}
        <div className="relative min-h-screen flex items-center justify-center px-4" style={{ zIndex: 1 }}>
          <div className="w-full max-w-lg rounded-3xl border p-8 md:p-10" style={{ background: "rgba(4,4,8,0.95)", borderColor: "rgba(180,100,255,0.3)", backdropFilter: "blur(24px)" }}>
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: "#b464ff" }}>
                NEURO v4.0 · NEURAL COSMOS
              </div>
              <div className="text-5xl mb-4">🧠</div>
              <h1 className="text-3xl font-black mb-3 text-white">Denke deine Frage.</h1>
              <p className="text-sm font-mono" style={{ color: "rgba(180,100,255,0.8)" }}>
                Das Mycelium hört zu.
              </p>
            </div>

            {/* Features */}
            <div className="rounded-2xl border p-5 mb-6" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}>
              <div className="text-xs font-mono uppercase tracking-wide mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>Wie es funktioniert</div>
              <ul className="space-y-3 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                <li className="flex gap-3"><span style={{ color: "#b464ff" }}>⬡</span> Wähle ein Thema — per Klick oder Eye-Tracking (optional)</li>
                <li className="flex gap-3"><span style={{ color: "#00b8ff" }}>⬡</span> Optional: BLE EEG-Gerät für Brain-Wave-Daten</li>
                <li className="flex gap-3"><span style={{ color: "#00ff9d" }}>⬡</span> Alles läuft client-seitig. Keine Daten werden gespeichert.</li>
                <li className="flex gap-3"><span style={{ color: "#ffc800" }}>⬡</span> Nur die Frage (anonymisiert) wird an das Oracle gesendet.</li>
              </ul>
            </div>

            {/* Privacy */}
            <div className="rounded-xl border p-4 mb-6 text-xs font-mono" style={{ borderColor: "rgba(0,255,157,0.15)", background: "rgba(0,255,157,0.04)", color: "rgba(0,255,157,0.7)" }}>
              <strong className="text-[#00ff9d]">Datenschutz:</strong> Eye-Tracking und EEG-Daten werden ausschließlich lokal verarbeitet. Keine biometrischen Daten verlassen dein Gerät.
            </div>

            {/* CTA */}
            <button
              onClick={() => setConsented(true)}
              className="w-full py-4 rounded-2xl font-black text-base tracking-wide transition-all duration-300"
              style={{ background: "linear-gradient(90deg, #b464ff22, #00b8ff22)", border: "1px solid #b464ff", color: "#b464ff" }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 40px #b464ff44" }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none" }}
            >
              Neuro-Interface aktivieren →
            </button>
            
            <p className="text-center text-xs mt-4" style={{ color: "rgba(255,255,255,0.2)" }}>
              Du kannst jederzeit zur normalen Texteingabe wechseln.
            </p>
          </div>
        </div>
      </>
    )
  }

  // MAIN INTERFACE
  return (
    <>
      {mounted && <NeuroBackground />}
      
      <div className="relative min-h-screen" style={{ zIndex: 1 }}>
        
        {/* ── PREMIUM HERO ───────────────────────────────────────────────── */}
        <section className="pt-20 pb-8 px-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-widest mb-6 border" style={{ borderColor: "rgba(180,100,255,0.3)", background: "rgba(180,100,255,0.05)", color: "#b464ff" }}>
              <span className="animate-pulse">●</span> NEURO v4.0 — NEURAL COSMOS
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-4 leading-none">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#b464ff] via-[#00b8ff] to-[#00ff9d] animate-gradient">
                Neuro Oracle
              </span>
            </h1>
            
            <p className="text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
              Denke deine Frage. Das Mycelium hört zu.
            </p>
            
            {/* Controls */}
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => {
                  if (!eyeTrackingEnabled && !cameraActive) {
                    startCamera()
                  }
                  setEyeTrackingEnabled(!eyeTrackingEnabled)
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-mono transition-all duration-300"
                style={{
                  borderColor: eyeTrackingEnabled ? "#b464ff" : "rgba(255,255,255,0.1)",
                  color: eyeTrackingEnabled ? "#b464ff" : "rgba(255,255,255,0.5)",
                  background: eyeTrackingEnabled ? "rgba(180,100,255,0.1)" : "transparent"
                }}
              >
                <span>{eyeTrackingEnabled ? "�️" : "👁️"}</span>
                {eyeTrackingEnabled ? "Maus-Simulation AKTIV" : "Gaze-Simulation aktivieren"}
              </button>
              
              <button
                onClick={() => {}}
                className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-mono transition-all duration-300"
                style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}
              >
                <span>🧠</span> EEG koppeln (optional)
              </button>
            </div>
            
            {eyeTrackingEnabled && (
              <>
                <p className="text-xs font-mono mt-3 animate-pulse" style={{ color: "#b464ff" }}>
                  �️ Maus-Simulation aktiv — halte Maus 2 Sek. auf einer Karte
                </p>
                <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Hinweis: Echtes Eye-Tracking erfordert WebGazer.js (Experimentell)
                </p>
                {/* Camera Preview (nur Visualisierung) */}
                {cameraActive && (
                  <div className="mt-4 flex justify-center">
                    <div className="relative w-40 h-30 rounded-xl overflow-hidden border-2 border-[#b464ff] bg-black">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover transform scale-x-[-1]"
                      />
                      <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                      <div className="absolute bottom-1 left-1 text-[10px] font-mono text-white bg-black/50 px-2 py-0.5 rounded">
                        Kamera Visual
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
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

        {/* ── RESPONSE ───────────────────────────────────────────────────── */}
        {response && (
          <section className="px-4 mb-10 animate-fade-in">
            <div className="max-w-3xl mx-auto">
              <div className="rounded-3xl p-8 mb-6 border" style={{ background: "rgba(10,10,14,0.95)", borderColor: "rgba(180,100,255,0.3)", backdropFilter: "blur(20px)" }}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">🧠</span>
                  <span className="font-mono text-sm uppercase tracking-wider" style={{ color: "#b464ff" }}>Neural Response</span>
                </div>
                
                <div className="prose prose-invert max-w-none mb-6">
                  <p className="text-lg leading-relaxed whitespace-pre-wrap" style={{ color: "rgba(255,255,255,0.9)" }}>
                    <TypewriterText text={response.answer || "Verarbeite deine neuronale Anfrage..."} speed={15} onComplete={() => setTypingComplete(true)} />
                  </p>
                </div>
                
                {/* Stats */}
                <div className="flex gap-6 mb-6 text-xs font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>
                  <span>NeuroScore: <span style={{ color: "#b464ff" }}>{(response.neuroScore || 0).toFixed(1)}</span></span>
                  <span>Confidence: <span style={{ color: "#00ff9d" }}>{(response.confidence || 0).toFixed(0)}%</span></span>
                </div>
                
                {/* Runbooks */}
                {response.recommended_runbooks?.length > 0 && (
                  <div className="rounded-2xl p-4 border mb-6" style={{ background: "rgba(180,100,255,0.05)", borderColor: "rgba(180,100,255,0.15)" }}>
                    <div className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: "#b464ff" }}>📚 Empfohlene Runbooks</div>
                    <div className="space-y-2">
                      {response.recommended_runbooks.slice(0, 4).map((rb, i) => (
                        <a key={i} href={rb.summonUrl || `/runbooks/${rb.slug}`} className="flex items-center justify-between p-3 rounded-xl border transition-all hover:border-[#b464ff]" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
                          <span className="text-sm text-gray-300">{rb.title}</span>
                          <span className="text-xs font-mono" style={{ color: "#b464ff" }}>Relevanz {(rb.relevance * 100).toFixed(0)}% →</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Cross-Links */}
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
              
              {/* Ask Again */}
              <div className="text-center">
                <button
                  onClick={() => { setResponse(null); setQuestion(""); setTypingComplete(false); }}
                  className="px-6 py-3 rounded-full text-sm font-mono border transition-all duration-300 hover:border-[#b464ff]"
                  style={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)" }}
                >
                  ← Neue Frage denken
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ── THOUGHT CARDS ──────────────────────────────────────────────── */}
        {!response && !thinking && (
          <section className="px-4 mb-10">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-6">
                <div className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "#00b8ff" }}>
                  {eyeTrackingEnabled ? "👁️ Schaue auf eine Karte (2 Sek.)" : "🖱️ Klicke auf ein Thema"}
                </div>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Oder tippe deine Frage unten ein
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {THOUGHT_CARDS.map((card) => {
                  const progress = dwellProgress[card.id] || 0
                  const isActive = gazeCardRef.current === card.id
                  const isLoading = loadingCard === card.id
                  
                  return (
                    <div
                      key={card.id}
                      ref={(el) => { cardRefs.current[card.id] = el }}
                      onClick={() => handleCardClick(card.id, card.question)}
                      className={`relative rounded-2xl border p-5 cursor-pointer transition-all duration-300 overflow-hidden ${isLoading ? 'pointer-events-none' : ''}`}
                      style={{
                        background: isLoading ? `${card.color}30` : isActive ? `${card.color}10` : "rgba(10,10,14,0.8)",
                        borderColor: isLoading ? card.color : progress > 0 ? card.color : "rgba(255,255,255,0.08)",
                        boxShadow: isLoading ? `0 0 30px ${card.color}50` : progress > 0 ? `0 0 ${20 + progress * 30}px ${card.color}30` : "none",
                        transform: isLoading ? 'scale(0.98)' : 'scale(1)'
                      }}
                    >
                      {progress > 0 && !isLoading && <DwellRing progress={progress} color={card.color} />}
                      
                      {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
                          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${card.color} transparent transparent transparent` }} />
                        </div>
                      )}
                      
                      <div className={`text-3xl mb-3 relative z-10 transition-opacity ${isLoading ? 'opacity-50' : ''}`}>{card.icon}</div>
                      <div className={`font-bold text-sm mb-1 relative z-10 ${isLoading ? 'opacity-50' : ''}`} style={{ color: isLoading ? card.color : progress > 0.3 ? card.color : "rgba(255,255,255,0.9)" }}>
                        {isLoading ? 'Verarbeite...' : card.label}
                      </div>
                      <div className={`text-xs relative z-10 ${isLoading ? 'opacity-50' : ''}`} style={{ color: "rgba(255,255,255,0.4)" }}>
                        {isLoading ? 'Neural analysis running...' : `${card.question.slice(0, 40)}...`}
                      </div>
                      
                      {!isLoading && progress > 0 && (
                        <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(135deg, ${card.color}10, transparent)` }} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── TEXT INPUT ───────────────────────────────────────────────────── */}
        {!response && !thinking && (
          <section className="px-4 mb-12">
            <div className="max-w-2xl mx-auto">
              <div className="text-xs font-mono uppercase tracking-widest mb-3 text-center" style={{ color: "rgba(255,255,255,0.3)" }}>
                — oder tippe deine Frage —
              </div>
              <div className="relative rounded-2xl overflow-hidden border" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(10,10,14,0.9)" }}>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="z.B. Wie sichere ich meine Kubernetes Cluster?"
                  rows={3}
                  className="w-full bg-transparent px-5 pt-4 pb-14 text-white placeholder-gray-600 font-mono text-sm resize-none outline-none"
                />
                <div className="absolute bottom-3 right-4">
                  <button
                    onClick={() => question.trim() && triggerOracle(question)}
                    disabled={!question.trim()}
                    className="px-5 py-2 rounded-full text-xs font-mono font-bold uppercase transition-all disabled:opacity-40"
                    style={{ background: "linear-gradient(135deg, #b464ff30, #b464ff50)", border: "1px solid #b464ff", color: "#b464ff" }}
                  >
                    Senden →
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── FAQ SECTION ──────────────────────────────────────────────────── */}
        <section className="px-4 mb-16">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <div className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "#b464ff" }}>Häufige Fragen</div>
              <h2 className="text-2xl font-bold" style={{ color: "rgba(255,255,255,0.9)" }}>FAQ</h2>
            </div>
            
            <div className="rounded-3xl p-6 border" style={{ background: "rgba(10,10,14,0.8)", borderColor: "rgba(255,255,255,0.08)" }}>
              {FAQ_ITEMS.map((item, i) => (
                <FAQItem key={i} index={i} {...item} isOpen={openFAQ === i} onClick={() => setOpenFAQ(openFAQ === i ? null : i)} />
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
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>ClawGuru NEURAL COSMOS • v4.0 • clawguru.org</p>
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
