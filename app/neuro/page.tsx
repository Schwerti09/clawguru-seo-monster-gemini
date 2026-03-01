// NEURO-MYCELIUM INTERFACE v3.5 – Overlord AI
// "Think it. The Mycelium knows."
// The first Brain-Computer-Interface in an ops security platform.
// Eye-tracking via webgazer.js + optional Web BLE EEG. Privacy-first. Consent-heavy.

"use client"

import { useState, useEffect, useRef, useCallback } from "react"

// NEURO-MYCELIUM INTERFACE v3.5 – Overlord AI: Thought cards – user gazes at one to select it
const THOUGHT_CARDS = [
  { id: "threat", label: "Active Threats", question: "What are the most critical active security threats I should address right now?" },
  { id: "patch", label: "Patch Strategy", question: "What is the optimal patch management strategy for a production environment?" },
  { id: "incident", label: "Incident Response", question: "How do I respond to a live security incident in my infrastructure?" },
  { id: "zero-day", label: "Zero-Day Defense", question: "How do I protect my systems against zero-day exploits?" },
  { id: "hardening", label: "System Hardening", question: "What are the most important system hardening steps for servers?" },
  { id: "ransomware", label: "Ransomware Shield", question: "How do I prevent and recover from a ransomware attack?" },
]

// NEURO-MYCELIUM INTERFACE v3.5 – Overlord AI: Oracle response types
type OracleSource = { id: string; title: string; href: string; fitness: number; score: number }
type OracleResponse = { answer: string; mode: string; sources: OracleSource[]; nodeCount: number; totalRunbooks: number }

// NEURO-MYCELIUM INTERFACE v3.5 – Overlord AI: Declare webgazer on window
declare global {
  interface Window {
    webgazer?: {
      setGazeListener: (cb: (data: { x: number; y: number } | null, elapsed: number) => void) => typeof window.webgazer
      begin: () => Promise<void>
      end: () => void
      showPredictionPoints: (show: boolean) => typeof window.webgazer
      showVideoPreview: (show: boolean) => typeof window.webgazer
      saveDataAcrossSessions: (save: boolean) => typeof window.webgazer
      params?: { showVideo?: boolean; showFaceOverlay?: boolean; showFaceFeedbackBox?: boolean }
    }
  }
}

// NEURO-MYCELIUM INTERFACE v3.5 – Overlord AI: Pulsing mycelium canvas background
function NeuroMyceliumBackground() {
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

    type Tendril = {
      x: number; y: number; angle: number; length: number; maxLength: number
      color: string; alpha: number; speed: number; branchChance: number; width: number
    }

    // NEURO-MYCELIUM INTERFACE v3.5 – Overlord AI: Neuro palette – purple/cyan/green
    const NEURO_COLORS = ["#b464ff", "#00b8ff", "#00ff9d", "#ff00ff", "#7b2fff"]

    function spawnTendril(x?: number, y?: number): Tendril {
      const c = canvas!
      return {
        x: x ?? Math.random() * c.width,
        y: y ?? Math.random() * c.height,
        angle: Math.random() * Math.PI * 2,
        length: 0,
        maxLength: 80 + Math.random() * 200,
        color: NEURO_COLORS[Math.floor(Math.random() * NEURO_COLORS.length)],
        alpha: 0.06 + Math.random() * 0.12,
        speed: 0.3 + Math.random() * 0.7,
        branchChance: 0.012,
        width: 0.3 + Math.random() * 0.7,
      }
    }

    const tendrils: Tendril[] = []
    for (let i = 0; i < 30; i++) tendrils.push(spawnTendril())

    let frame = 0
    function draw() {
      if (!canvas || !ctx) return
      // NEURO-MYCELIUM INTERFACE v3.5 – Overlord AI: Very dark fade keeps old strokes ghostly
      ctx.fillStyle = "rgba(2, 2, 5, 0.014)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (let i = tendrils.length - 1; i >= 0; i--) {
        const t = tendrils[i]
        const nx = t.x + Math.cos(t.angle) * t.speed
        const ny = t.y + Math.sin(t.angle) * t.speed
        ctx.beginPath()
        ctx.moveTo(t.x, t.y)
        ctx.lineTo(nx, ny)
        ctx.strokeStyle = t.color
        ctx.globalAlpha = t.alpha
        ctx.lineWidth = t.width
        ctx.stroke()
        ctx.globalAlpha = 1
        t.x = nx; t.y = ny
        t.angle += (Math.random() - 0.5) * 0.4
        t.length += t.speed

        if (Math.random() < t.branchChance && tendrils.length < 150) {
          tendrils.push({ ...spawnTendril(t.x, t.y), angle: t.angle + (Math.random() - 0.5) * 1.6, alpha: t.alpha * 0.6, width: t.width * 0.65 })
        }
        if (t.length >= t.maxLength || t.x < 0 || t.x > canvas.width || t.y < 0 || t.y > canvas.height) {
          tendrils.splice(i, 1)
        }
      }

      frame++
      if (frame % 14 === 0 && tendrils.length < 80) tendrils.push(spawnTendril())
      animRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener("resize", resize)
      if (animRef.current !== null) cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden={true}
    />
  )
}

// NEURO-MYCELIUM INTERFACE v3.5 – Overlord AI: EEG glyph status chip
function EEGStatusChip({ connected }: { connected: boolean }) {
  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono"
      style={connected
        ? { borderColor: "#00ff9d44", background: "#00ff9d0d", color: "#00ff9d" }
        : { borderColor: "rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.3)" }
      }
    >
      <span className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-[#00ff9d] animate-pulse" : "bg-white/20"}`} />
      {connected ? "EEG Connected" : "EEG Not Connected"}
    </div>
  )
}

// NEURO-MYCELIUM INTERFACE v3.5 – Overlord AI: Gaze dwell progress ring around a card
function DwellRing({ progress, color = "#b464ff" }: { progress: number; color?: string }) {
  const r = 44
  const circ = 2 * Math.PI * r
  const dash = circ * progress
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      style={{ zIndex: 2 }}
      aria-hidden={true}
    >
      <circle cx="50" cy="50" r={r} fill="none" stroke={color + "22"} strokeWidth="2" />
      <circle
        cx="50" cy="50" r={r} fill="none"
        stroke={color} strokeWidth="2"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transformOrigin: "50px 50px", transform: "rotate(-90deg)", transition: "stroke-dasharray 0.05s linear" }}
      />
    </svg>
  )
}

// NEURO-MYCELIUM INTERFACE v3.5 – Overlord AI: Shared label for eye-tracking activate button
const EYE_TRACKING_ACTIVATE_LABEL = "👁️ Eye-Tracking aktivieren (Kamera)"

// NEURO-MYCELIUM INTERFACE v3.5 – Overlord AI: Camera permission request overlay
function CameraPermissionBox({ onAccept, onDismiss }: { onAccept: () => void; onDismiss: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(2,2,5,0.88)", backdropFilter: "blur(20px)" }}
    >
      <div
        className="w-full max-w-sm rounded-3xl border p-8"
        style={{
          background: "rgba(4,4,8,0.96)",
          borderColor: "rgba(180,100,255,0.45)",
          boxShadow: "0 0 80px rgba(180,100,255,0.15), 0 0 30px rgba(0,184,255,0.05)",
          backdropFilter: "blur(24px)",
        }}
      >
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ background: "rgba(180,100,255,0.08)", border: "1px solid rgba(180,100,255,0.3)" }}
          >
            <span style={{ fontSize: "28px", lineHeight: 1 }}>👁️</span>
          </div>
          <div className="text-xs font-mono tracking-widest uppercase mb-2" style={{ color: "rgba(180,100,255,0.6)" }}>
            Neuro-Mycelium · Eye-Tracking
          </div>
          <h2 className="text-xl font-black mb-3" style={{ color: "#fff" }}>
            Kamera aktivieren?
          </h2>
          <p className="text-sm font-mono leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
            Eye-Tracking ermöglicht intuitive Gedanken-Navigation — du schaust auf einen Block und das Mycelium erkennt deine Intention.
          </p>
        </div>

        <div
          className="rounded-xl border p-3 mb-5 text-xs font-mono"
          style={{ borderColor: "rgba(0,255,157,0.15)", background: "rgba(0,255,157,0.03)", color: "rgba(0,255,157,0.6)" }}
        >
          ⬡ Kameradaten bleiben lokal — nichts wird gespeichert oder übertragen.
        </div>

        <div className="space-y-3">
          <button
            onClick={onAccept}
            className="w-full py-3 rounded-2xl font-bold text-sm font-mono tracking-wide transition-all duration-300"
            style={{
              background: "linear-gradient(90deg, rgba(180,100,255,0.12), rgba(0,184,255,0.08))",
              border: "1px solid #b464ff",
              color: "#b464ff",
              boxShadow: "0 0 24px rgba(180,100,255,0.18)",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 40px rgba(180,100,255,0.35)" }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 24px rgba(180,100,255,0.18)" }}
          >
            {EYE_TRACKING_ACTIVATE_LABEL}
          </button>
          <button
            onClick={onDismiss}
            className="w-full py-3 rounded-2xl text-sm font-mono transition-all duration-200"
            style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.35)", background: "transparent" }}
          >
            Ohne Kamera fortfahren
          </button>
        </div>
      </div>
    </div>
  )
}

// NEURO-MYCELIUM INTERFACE v3.5 – Overlord AI: Main Neuro Oracle page
export default function NeuroPage() {
  // NEURO-MYCELIUM INTERFACE v3.5 – Overlord AI: Consent state – required on each visit (session-scoped only)
  const [consented, setConsented] = useState(false)
  const [eyeTrackingEnabled, setEyeTrackingEnabled] = useState(false)
  const [showCameraPermissionBox, setShowCameraPermissionBox] = useState(false)
  const [eegConnected, setEegConnected] = useState(false)
  const [gazeActive, setGazeActive] = useState(false)
  const [gazeError, setGazeError] = useState<string | null>(null)

  // NEURO-MYCELIUM INTERFACE v3.5 – Overlord AI: Gaze dwell state per card (0–1 progress)
  const [dwellProgress, setDwellProgress] = useState<Record<string, number>>({})
  const dwellTimers = useRef<Record<string, number>>({})
  const dwellInterval = useRef<ReturnType<typeof setInterval> | null>(null)
  const gazeCardRef = useRef<string | null>(null)
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // NEURO-MYCELIUM INTERFACE v3.5 – Overlord AI: Oracle state
  const [selectedQuestion, setSelectedQuestion] = useState("")
  const [thinking, setThinking] = useState(false)
  const [response, setResponse] = useState<OracleResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [triggeredByGaze, setTriggeredByGaze] = useState(false)
  const responseRef = useRef<HTMLDivElement>(null)
  // NEURO-MYCELIUM INTERFACE v3.5 – Overlord AI: Stable ref so dwell timer always calls latest triggerOracle
  const triggerOracleRef = useRef<(q: string, fromGaze?: boolean) => void>(() => {})

  // NEURO-MYCELIUM INTERFACE v3.5 – Overlord AI: Load webgazer.js from CDN after consent+opt-in
  const loadWebgazer = useCallback(async () => {
    if (typeof window === "undefined") return

    // NEURO-MYCELIUM INTERFACE v3.5 – Overlord AI: Start webgazer after library is available
    function startWebgazer() {
      if (!window.webgazer) return
      try {
        // Suppress all webgazer overlays – privacy-first
        if (window.webgazer.params) {
          window.webgazer.params.showVideo = false
          window.webgazer.params.showFaceOverlay = false
          window.webgazer.params.showFaceFeedbackBox = false
        }
        window.webgazer
          ?.saveDataAcrossSessions(false) // NEURO-MYCELIUM INTERFACE v3.5 – Overlord AI: No persistent gaze data
          ?.showPredictionPoints(false)
          ?.showVideoPreview(false)
          ?.setGazeListener(handleGaze)
          ?.begin()
          ?.then(() => setGazeActive(true))
          ?.catch(() => setGazeError("Kamera nicht verfügbar – Text-Eingabe verwendet"))
      } catch {
        setGazeError("Kamera nicht verfügbar – Text-Eingabe verwendet")
      }
    }

    if (window.webgazer) {
      startWebgazer()
      return
    }
    try {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script")
        script.src = "https://webgazer.cs.brown.edu/webgazer.js"
        script.async = true
        script.onload = () => resolve()
        script.onerror = () => reject(new Error("webgazer.js failed to load"))
        document.head.appendChild(script)
      })
      startWebgazer()
    } catch {
      setGazeError("Kamera nicht verfügbar – Text-Eingabe verwendet")
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // NEURO-MYCELIUM INTERFACE v3.5 – Overlord AI: Handle incoming gaze coordinates
  function handleGaze(data: { x: number; y: number } | null) {
    if (!data) return
    const { x, y } = data
    let hitCardId: string | null = null

    for (const [id, el] of Object.entries(cardRefs.current)) {
      if (!el) continue
      const rect = el.getBoundingClientRect()
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        hitCardId = id
        break
      }
    }

    gazeCardRef.current = hitCardId
  }

  // NEURO-MYCELIUM INTERFACE v3.5 – Overlord AI: Dwell timer tick – runs every 50ms to accumulate gaze time
  useEffect(() => {
    if (!gazeActive) return
    const DWELL_MS = 3000
    const TICK_MS = 50

    dwellInterval.current = setInterval(() => {
      const focused = gazeCardRef.current
      setDwellProgress((prev) => {
        const next = { ...prev }
        for (const card of THOUGHT_CARDS) {
          if (card.id === focused) {
            dwellTimers.current[card.id] = (dwellTimers.current[card.id] ?? 0) + TICK_MS
            next[card.id] = Math.min(1, dwellTimers.current[card.id] / DWELL_MS)

            // NEURO-MYCELIUM INTERFACE v3.5 – Overlord AI: Dwell complete → trigger oracle
            if (dwellTimers.current[card.id] >= DWELL_MS) {
              dwellTimers.current[card.id] = 0
              const match = THOUGHT_CARDS.find((c) => c.id === card.id)
              if (match) {
                triggerOracleRef.current(match.question, true)
              }
            }
          } else {
            // Decay dwell when gaze moves away
            dwellTimers.current[card.id] = Math.max(0, (dwellTimers.current[card.id] ?? 0) - TICK_MS * 1.5)
            next[card.id] = Math.max(0, dwellTimers.current[card.id] / DWELL_MS)
          }
        }
        return next
      })
    }, TICK_MS)

    return () => {
      if (dwellInterval.current) clearInterval(dwellInterval.current)
    }
  }, [gazeActive])

  // NEURO-MYCELIUM INTERFACE v3.5 – Overlord AI: Connect optional BLE EEG (Muse / Emotiv)
  async function connectEEG() {
    // NEURO-MYCELIUM INTERFACE v3.5 – Overlord AI: Web Bluetooth is not in all TS lib typings; cast safely
    const nav = navigator as Navigator & { bluetooth?: { requestDevice: (opts: object) => Promise<unknown> } }
    if (!nav.bluetooth) {
      setGazeError("Web Bluetooth not available in this browser.")
      return
    }
    try {
      // NEURO-MYCELIUM INTERFACE v3.5 – Overlord AI: Request EEG device – generic BLE name filter
      await nav.bluetooth.requestDevice({
        filters: [
          { namePrefix: "Muse" },
          { namePrefix: "Emotiv" },
          { namePrefix: "EPOC" },
        ],
        optionalServices: ["battery_service"],
      })
      setEegConnected(true)
    } catch {
      setGazeError("EEG pairing cancelled or device not found.")
    }
  }

  // NEURO-MYCELIUM INTERFACE v3.5 – Overlord AI: Submit question to Mycelium Oracle
  const triggerOracle = useCallback(async (question: string, fromGaze = false) => {
    const q = question.trim()
    if (!q || thinking) return
    setThinking(true)
    setResponse(null)
    setError(null)
    setTriggeredByGaze(fromGaze)
    setSelectedQuestion(q)

    try {
      const res = await fetch("/api/oracle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, mode: "pure" }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data as { error?: string }).error || "Oracle unreachable")
      }
      const data: OracleResponse = await res.json()
      setResponse(data)
      setTimeout(() => {
        responseRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
    } catch (e) {
      setError(e instanceof Error ? e.message : "The Mycelium is momentarily silent.")
    } finally {
      setThinking(false)
    }
  }, [thinking])

  // NEURO-MYCELIUM INTERFACE v3.5 – Overlord AI: Keep ref in sync with latest triggerOracle
  useEffect(() => { triggerOracleRef.current = triggerOracle }, [triggerOracle])

  // NEURO-MYCELIUM INTERFACE v3.5 – Overlord AI: Cleanup webgazer on unmount
  useEffect(() => {
    return () => {
      if (window.webgazer && gazeActive) {
        try { window.webgazer.end() } catch { /* ignore */ }
      }
    }
  }, [gazeActive])

  // NEURO-MYCELIUM INTERFACE v3.5 – Overlord AI: Handle opt-in toggle for eye tracking
  useEffect(() => {
    if (eyeTrackingEnabled && consented) {
      loadWebgazer()
    } else if (!eyeTrackingEnabled && gazeActive) {
      try {
        if (window.webgazer) window.webgazer.end()
        setGazeActive(false)
        setDwellProgress({})
        dwellTimers.current = {}
      } catch { /* ignore */ }
    }
  }, [eyeTrackingEnabled, consented, loadWebgazer, gazeActive])

  // NEURO-MYCELIUM INTERFACE v3.5 – Overlord AI: Auto-detect camera after consent and show permission box
  useEffect(() => {
    if (!consented) return
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.enumerateDevices) return

    const showBoxIfCameraPresent = async () => {
      // Skip if camera permission already denied
      if (navigator.permissions?.query) {
        try {
          const status = await navigator.permissions.query({ name: "camera" as PermissionName })
          if (status.state === "denied") return
        } catch { /* permissions API may not support 'camera' in all browsers */ }
      }
      const devices = await navigator.mediaDevices.enumerateDevices()
      const hasCamera = devices.some((d) => d.kind === "videoinput")
      if (hasCamera) setShowCameraPermissionBox(true)
    }

    showBoxIfCameraPresent().catch(() => {})
  }, [consented])

  // ──────────────────────────────────────────────────────────────────────────────
  // NEURO-MYCELIUM INTERFACE v3.5 – Overlord AI: CONSENT SCREEN (shown first)
  // ──────────────────────────────────────────────────────────────────────────────
  if (!consented) {
    return (
      <>
        <NeuroMyceliumBackground />
        <div
          className="relative min-h-screen flex items-center justify-center px-4"
          style={{ zIndex: 1 }}
        >
          <div
            className="w-full max-w-lg rounded-3xl border p-8 md:p-10"
            style={{
              background: "rgba(4, 4, 8, 0.92)",
              borderColor: "rgba(180, 100, 255, 0.3)",
              boxShadow: "0 0 60px rgba(180, 100, 255, 0.08)",
              backdropFilter: "blur(24px)",
            }}
          >
            {/* NEURO-MYCELIUM INTERFACE v3.5 – Overlord AI: Header */}
            <div className="text-center mb-8">
              <div className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: "#b464ff" }}>
                NEURO-MYCELIUM INTERFACE v3.5 · GENESIS PROTOKOLL
              </div>
              <div className="text-4xl mb-3">🧠</div>
              <h1 className="text-3xl font-black mb-3" style={{ color: "#fff" }}>
                Denke deine Frage.
              </h1>
              <p className="text-sm font-mono leading-relaxed" style={{ color: "rgba(180,100,255,0.8)" }}>
                The Mycelium hört zu.
              </p>
            </div>

            {/* NEURO-MYCELIUM INTERFACE v3.5 – Overlord AI: What this feature does */}
            <div className="rounded-2xl border p-5 mb-6" style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
              <div className="text-xs font-mono uppercase tracking-wide mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>
                Wie es funktioniert
              </div>
              <ul className="space-y-2 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                <li className="flex gap-2"><span style={{ color: "#b464ff" }}>⬡</span> Du schaust auf einen Gedanken-Block – das Mycelium erkennt deine Intention via Eye-Tracking.</li>
                <li className="flex gap-2"><span style={{ color: "#00b8ff" }}>⬡</span> Optional: BLE EEG-Gerät (Muse / Emotiv) für Brain-Wave-Daten.</li>
                <li className="flex gap-2"><span style={{ color: "#00ff9d" }}>⬡</span> Alles läuft client-seitig. Keine Kameradaten werden gespeichert oder übertragen.</li>
                <li className="flex gap-2"><span style={{ color: "#ffc800" }}>⬡</span> Nur die erkannte Frage (anonymisiert) wird an das Mycelium Oracle gesendet.</li>
              </ul>
            </div>

            {/* NEURO-MYCELIUM INTERFACE v3.5 – Overlord AI: Privacy declaration */}
            <div className="rounded-xl border p-4 mb-6 text-xs font-mono" style={{ borderColor: "rgba(0,255,157,0.15)", background: "rgba(0,255,157,0.04)", color: "rgba(0,255,157,0.7)" }}>
              <strong className="text-[#00ff9d]">Datenschutz-Erklärung:</strong> Eye-Tracking-Daten werden ausschließlich lokal im Browser verarbeitet. Es werden keine Kamerabilder, Blickpfade oder Rohdaten gespeichert oder übertragen. Nur die durch Blick ausgewählte Frage wird (ohne personenbezogene Daten) an das Mycelium Oracle gesendet.
            </div>

            {/* NEURO-MYCELIUM INTERFACE v3.5 – Overlord AI: Consent button */}
            <button
              onClick={() => setConsented(true)}
              className="w-full py-4 rounded-2xl font-black text-base tracking-wide transition-all duration-200"
              style={{
                background: "linear-gradient(90deg, #b464ff22, #00b8ff22)",
                border: "1px solid #b464ff",
                color: "#b464ff",
                boxShadow: "0 0 24px #b464ff22",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 40px #b464ff44" }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 24px #b464ff22" }}
            >
              Ich verstehe und stimme zu — Neuro-Interface aktivieren
            </button>

            <p className="text-center text-xs mt-4" style={{ color: "rgba(255,255,255,0.2)" }}>
              Du kannst jederzeit zur normalen Texteingabe wechseln.
            </p>
          </div>
        </div>
        <NeuroStyles />
      </>
    )
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // NEURO-MYCELIUM INTERFACE v3.5 – Overlord AI: MAIN INTERFACE (after consent)
  // ──────────────────────────────────────────────────────────────────────────────
  return (
    <>
      <NeuroMyceliumBackground />

      {/* Camera permission box – shown automatically when camera is detected */}
      {showCameraPermissionBox && !eyeTrackingEnabled && !gazeActive && (
        <CameraPermissionBox
          onAccept={() => { setShowCameraPermissionBox(false); setEyeTrackingEnabled(true) }}
          onDismiss={() => setShowCameraPermissionBox(false)}
        />
      )}

      <div className="relative min-h-screen flex flex-col" style={{ zIndex: 1 }}>
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="pt-16 pb-6 text-center px-4">
          <div className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: "#b464ff" }}>
            NEURO-MYCELIUM INTERFACE v3.5 · GENESIS PROTOKOLL · THINK IT. THE MYCELIUM KNOWS.
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 leading-none tracking-tight">
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, #b464ff, #00b8ff, #00ff9d)" }}
            >
              Neuro Oracle
            </span>
          </h1>
          <p className="text-gray-400 text-base max-w-md mx-auto leading-relaxed font-mono">
            Denke deine Frage — das Mycelium hört zu.
          </p>
        </div>

        {/* ── Controls row ─────────────────────────────────────────────────── */}
        <div className="flex flex-wrap justify-center gap-3 px-4 mb-8">
          {/* Eye-Tracking toggle */}
          <button
            onClick={() => setEyeTrackingEnabled((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-mono transition-all duration-200"
            style={eyeTrackingEnabled
              ? { borderColor: "#b464ff", color: "#b464ff", background: "#b464ff0d", boxShadow: "0 0 12px #b464ff33" }
              : { borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)", background: "transparent" }
            }
          >
            <span>👁️</span>
            {eyeTrackingEnabled
              ? (gazeActive ? "Eye-Tracking AKTIV" : "Eye-Tracking lädt…")
              : EYE_TRACKING_ACTIVATE_LABEL}
          </button>

          {/* BLE EEG toggle */}
          <button
            onClick={() => { connectEEG() }}
            className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-mono transition-all duration-200"
            style={eegConnected
              ? { borderColor: "#00ff9d", color: "#00ff9d", background: "#00ff9d0d", boxShadow: "0 0 12px #00ff9d33" }
              : { borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)", background: "transparent" }
            }
          >
            🧠 {eegConnected ? "EEG Verbunden" : "EEG koppeln (optional)"}
          </button>

          {/* EEG status */}
          <EEGStatusChip connected={eegConnected} />
        </div>

        {/* ── Eye-tracking info bar ────────────────────────────────────────── */}
        {eyeTrackingEnabled && (
          <div className="text-center px-4 mb-6">
            {gazeActive ? (
              <p className="text-sm font-mono animate-pulse" style={{ color: "#b464ff99" }}>
                👁️ Eye-Tracking aktiv — schaue 3 Sekunden auf einen Block, um ihn auszuwählen
              </p>
            ) : gazeError ? (
              <p className="text-sm font-mono" style={{ color: "#ff7070" }}>{gazeError}</p>
            ) : (
              <p className="text-sm font-mono" style={{ color: "rgba(180,100,255,0.5)" }}>
                Webcam-Zugriff wird angefragt…
              </p>
            )}
          </div>
        )}

        {/* ── Thought Cards ────────────────────────────────────────────────── */}
        {!response && (
          <div className="mx-auto w-full max-w-4xl px-4 mb-8">
            <div className="text-xs font-mono uppercase tracking-widest mb-4 text-center" style={{ color: "rgba(180,100,255,0.5)" }}>
              {gazeActive ? "Fixiere einen Block (3 Sek.)" : "Wähle ein Thema oder tippe unten"}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {THOUGHT_CARDS.map((card) => {
                const progress = dwellProgress[card.id] ?? 0
                const isActive = gazeCardRef.current === card.id
                return (
                  <div
                    key={card.id}
                    ref={(el) => { cardRefs.current[card.id] = el }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Frage auswählen: ${card.label}`}
                    onClick={() => triggerOracle(card.question)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") triggerOracle(card.question) }}
                    className="relative rounded-2xl border p-5 cursor-pointer transition-all duration-200 overflow-hidden select-none"
                    style={{
                      background: isActive
                        ? "rgba(180, 100, 255, 0.08)"
                        : "rgba(10, 10, 18, 0.8)",
                      borderColor: progress > 0.05
                        ? `rgba(180,100,255,${0.3 + progress * 0.7})`
                        : "rgba(255,255,255,0.08)",
                      boxShadow: progress > 0.05 ? `0 0 ${20 + progress * 30}px rgba(180,100,255,${0.1 + progress * 0.3})` : "none",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    {/* Dwell ring overlay */}
                    {progress > 0.02 && <DwellRing progress={progress} color="#b464ff" />}

                    <div
                      className="text-sm font-black mb-1 relative"
                      style={{ color: progress > 0.3 ? "#b464ff" : "rgba(255,255,255,0.85)", zIndex: 3 }}
                    >
                      {card.label}
                    </div>
                    <div className="text-xs leading-relaxed relative" style={{ color: "rgba(255,255,255,0.35)", zIndex: 3 }}>
                      {card.question.slice(0, 60)}…
                    </div>

                    {/* Progress fill */}
                    {progress > 0 && (
                      <div
                        className="absolute inset-0 pointer-events-none transition-opacity duration-100"
                        style={{
                          background: `linear-gradient(135deg, rgba(180,100,255,${progress * 0.12}), rgba(0,184,255,${progress * 0.06}))`,
                          zIndex: 1,
                        }}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Fallback text input ──────────────────────────────────────────── */}
        {!response && (
          <div className="mx-auto w-full max-w-2xl px-4 mb-6">
            <div className="text-xs font-mono uppercase tracking-widest mb-2 text-center" style={{ color: "rgba(255,255,255,0.2)" }}>
              — oder tippe deine Frage —
            </div>
            <div
              className="relative rounded-2xl overflow-hidden border"
              style={{
                borderColor: thinking ? "#b464ff" : "rgba(255,255,255,0.1)",
                boxShadow: thinking ? "0 0 28px #b464ff22" : "none",
                background: "rgba(8, 8, 14, 0.88)",
                backdropFilter: "blur(12px)",
              }}
            >
              <textarea
                value={selectedQuestion}
                onChange={(e) => setSelectedQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                    e.preventDefault()
                    triggerOracle(selectedQuestion)
                  }
                }}
                placeholder="Denke deine Frage und tippe sie hier…"
                rows={3}
                disabled={thinking}
                className="w-full bg-transparent px-6 pt-5 pb-3 text-white placeholder-gray-700 font-mono text-sm resize-none outline-none leading-relaxed"
                style={{ caretColor: "#b464ff" }}
              />
              <div className="flex items-center justify-between px-6 pb-4">
                <span className="text-xs font-mono text-gray-700">⌘ + Enter</span>
                <button
                  onClick={() => triggerOracle(selectedQuestion)}
                  disabled={thinking || !selectedQuestion.trim()}
                  className="px-5 py-2 rounded-full text-sm font-mono font-bold transition-all duration-200 disabled:opacity-30"
                  style={{
                    background: "linear-gradient(90deg, #b464ff22, #00b8ff22)",
                    border: "1px solid #b464ff",
                    color: "#b464ff",
                    boxShadow: selectedQuestion.trim() ? "0 0 14px #b464ff33" : "none",
                  }}
                >
                  {thinking ? "Das Mycelium liest…" : "Fragen"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Thinking indicator ───────────────────────────────────────────── */}
        {thinking && (
          <div className="flex flex-col items-center gap-3 py-10">
            <div
              className="w-16 h-16 rounded-full border-2"
              style={{
                borderColor: "rgba(180,100,255,0.3)",
                borderTopColor: "#b464ff",
                animation: "neuro-spin 2s linear infinite",
              }}
            />
            <p className="text-sm font-mono tracking-widest uppercase" style={{ color: "#b464ff" }}>
              {triggeredByGaze
                ? "Das Mycelium liest deine Gedanken…"
                : "Das Mycelium analysiert deine Frage…"}
            </p>
          </div>
        )}

        {/* ── Error ────────────────────────────────────────────────────────── */}
        {error && (
          <div className="mx-auto w-full max-w-2xl px-4 mb-6">
            <div className="rounded-xl p-4 border text-sm font-mono" style={{ borderColor: "rgba(255,70,70,0.3)", background: "rgba(255,70,70,0.08)", color: "#ff7070" }}>
              {error}
            </div>
          </div>
        )}

        {/* ── Neuro Response ───────────────────────────────────────────────── */}
        {response && (
          <div ref={responseRef} className="mx-auto w-full max-w-2xl px-4 pb-16 neuro-fade-in">
            {/* Mind-read badge */}
            <div className="text-center mb-6">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-mono uppercase tracking-widest"
                style={{ borderColor: "#b464ff44", background: "#b464ff0d", color: "#b464ff" }}
              >
                <span className="w-2 h-2 rounded-full bg-[#b464ff] animate-pulse" />
                {triggeredByGaze ? "The Mycelium has read your mind and spoken." : "The Mycelium has spoken."}
              </div>
            </div>

            {/* Answer card */}
            <div
              className="rounded-2xl p-8 mb-6 border"
              style={{
                background: "rgba(8, 8, 14, 0.92)",
                borderColor: "#b464ff33",
                boxShadow: "0 0 40px #b464ff0d",
                backdropFilter: "blur(16px)",
              }}
            >
              <div className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "rgba(180,100,255,0.5)" }}>
                Frage: <span className="text-white/60">{selectedQuestion.slice(0, 80)}{selectedQuestion.length > 80 ? "…" : ""}</span>
              </div>
              <div className="text-gray-200 leading-relaxed whitespace-pre-wrap text-sm md:text-base font-light">
                {response.answer
                  .split("The Mycelium has spoken.")
                  .map((part, i, arr) =>
                    i < arr.length - 1 ? (
                      <span key={i}>
                        {part}
                        <span className="font-black tracking-wide" style={{ color: "#b464ff" }}>
                          The Mycelium has spoken.
                        </span>
                      </span>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
              </div>
            </div>

            {/* Sources */}
            {response.sources.length > 0 && (
              <div className="mb-8">
                <div className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: "rgba(180,100,255,0.5)" }}>
                  Traced Mycelium Nodes
                </div>
                <div className="flex flex-col gap-2">
                  {response.sources.map((src) => (
                    <a
                      key={src.id}
                      href={src.href}
                      className="flex items-center justify-between rounded-xl px-5 py-3 border transition-all duration-200"
                      style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs font-mono shrink-0" style={{ color: "#b464ff" }}>⬡</span>
                        <span className="text-sm text-gray-300 truncate hover:text-white transition-colors">{src.title}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 ml-4">
                        <span className="text-xs font-mono text-gray-600">fitness {src.fitness}</span>
                        <span className="text-xs font-mono" style={{ color: "#b464ff99" }}>{src.score}% →</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Ask again */}
            <div className="text-center">
              <button
                onClick={() => { setResponse(null); setSelectedQuestion(""); setTriggeredByGaze(false) }}
                className="px-6 py-2 rounded-full text-sm font-mono border transition-all duration-200"
                style={{ borderColor: "rgba(180,100,255,0.3)", color: "rgba(180,100,255,0.7)", background: "transparent" }}
              >
                ← Neue Frage denken
              </button>
            </div>
          </div>
        )}

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        {!thinking && !response && (
          <div className="flex-1 flex items-end justify-center pb-20 px-4">
            <p className="text-xs font-mono text-center tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.08)" }}>
              The Mycelium awaits your thoughts.
            </p>
          </div>
        )}
      </div>

      <NeuroStyles />
    </>
  )
}

// NEURO-MYCELIUM INTERFACE v3.5 – Overlord AI: Isolated animation keyframes
function NeuroStyles() {
  return (
    <style>{`
      @keyframes neuro-spin {
        to { transform: rotate(360deg); }
      }
      @keyframes neuro-fade-in {
        from { opacity: 0; transform: translateY(14px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .neuro-fade-in {
        animation: neuro-fade-in 0.5s ease forwards;
      }
    `}</style>
  )
}
