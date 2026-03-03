'use client'

// NEXT-LEVEL UPGRADE 2026: Voice-Controlled Claw Copilot
// Web Speech API + Gemini – speak your issue, get spoken + visual Runbook answer.
// Falls back gracefully when Speech API is unavailable.

import { useState, useRef, useCallback, useEffect } from "react"
import { Mic, MicOff, Volume2, VolumeX, Loader2, Zap, Save, GitFork, Sparkles, BookOpen } from "lucide-react"

type VoiceState = "idle" | "listening" | "processing" | "speaking"

interface VoiceCopilotProps {
  /** Locale code, e.g. "de", "en", "ar" */
  lang?: string
  /** Callback with the final transcript so parent can prefill text input */
  onTranscript?: (text: string) => void
  /** Callback with Gemini reply text */
  onReply?: (reply: string) => void
}

const LANG_SPEECH: Record<string, string> = {
  de: "de-DE",
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  pt: "pt-BR",
  it: "it-IT",
  ru: "ru-RU",
  zh: "zh-CN",
  ja: "ja-JP",
  ar: "ar-SA",
}

// NEXT-LEVEL UPGRADE 2026: Extract a runbook search keyword from user text
function extractRunbookKeyword(text: string): string | null {
  const lower = text.toLowerCase()
  const KEYWORDS: Array<[RegExp, string]> = [
    [/nginx|webserver|proxy/, "nginx"],
    [/docker|container|dockerfile/, "docker"],
    [/kubernetes|k8s|kubectl|pod/, "kubernetes"],
    [/ssl|tls|zertifikat|certificate/, "ssl-tls"],
    [/ssh|remote access|fernzugriff/, "ssh"],
    [/firewall|iptables|ufw/, "firewall"],
    [/sql|database|datenbank|postgres|mysql/, "database"],
    [/backup|sicherung|restore/, "backup"],
    [/api key|secret|credentials|zugangsdaten/, "api-security"],
    [/dns|domain|nameserver/, "dns"],
    [/log|monitoring|alert|überwachung/, "monitoring"],
    [/linux|ubuntu|debian|centos/, "linux-hardening"],
  ]
  for (const [pattern, slug] of KEYWORDS) {
    if (pattern.test(lower)) return slug
  }
  return null
}

// NEXT-LEVEL UPGRADE 2026: Safe accessor for vendor-prefixed Speech API
function getSpeechRecognition(): (new () => SpeechRecognition) | undefined {
  if (typeof window === "undefined") return undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any
  return w.SpeechRecognition || w.webkitSpeechRecognition || undefined
}

// NEXT-LEVEL UPGRADE 2026: Animated waveform bars (5 bars, staggered animation)
function Waveform() {
  const bars = [0.4, 0.8, 1.0, 0.7, 0.45]
  return (
    <div className="flex items-end gap-[3px] h-8" aria-hidden>
      {bars.map((scale, i) => (
        <span
          key={i}
          className="w-1.5 rounded-full bg-[#00ff9d] origin-bottom"
          style={{
            height: `${Math.round(scale * 100)}%`,
            animation: `voiceWave 0.9s ease-in-out ${i * 0.13}s infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes voiceWave {
          from { transform: scaleY(0.25); opacity: 0.5; }
          to   { transform: scaleY(1);    opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default function VoiceCopilot({ lang = "de", onTranscript, onReply }: VoiceCopilotProps) {
  const [state, setState] = useState<VoiceState>("idle")
  const [transcript, setTranscript] = useState("")
  const [reply, setReply] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [supported, setSupported] = useState(true)
  const [saved, setSaved] = useState(false)
  const [forked, setForked] = useState(false)
  const [evolving, setEvolving] = useState(false)
  const [runbookSlug, setRunbookSlug] = useState<string | null>(null)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  // NEXT-LEVEL UPGRADE 2026: Use ref to avoid stale closure in onend callback
  const transcriptRef = useRef("")
  // Track intentional abort (cleanup on unmount) to suppress spurious callbacks
  const abortedRef = useRef(false)

  // NEXT-LEVEL UPGRADE 2026: Check for API support on mount
  useEffect(() => {
    if (!getSpeechRecognition()) {
      setSupported(false)
    }
  }, [])

  // Cleanup: stop recognition & synthesis when component unmounts
  useEffect(() => {
    return () => {
      abortedRef.current = true
      recognitionRef.current?.abort()
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  // NEXT-LEVEL UPGRADE 2026: Send transcript to Gemini via /api/copilot
  const sendToGemini = useCallback(
    async (text: string) => {
      setState("processing")
      setError(null)
      setSaved(false)
      setForked(false)
      try {
        const res = await fetch("/api/copilot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, history: [] }),
        })
        if (!res.ok) throw new Error("API error")
        const data = (await res.json()) as { reply?: string }
        const replyText = data.reply || "Keine Antwort erhalten."
        setReply(replyText)
        onReply?.(replyText)

        // NEXT-LEVEL UPGRADE 2026: Detect matching runbook from transcript
        const slug = extractRunbookKeyword(text)
        setRunbookSlug(slug)

        // NEXT-LEVEL UPGRADE 2026: Speak the reply via Web Speech Synthesis
        if (!isMuted && typeof window !== "undefined" && "speechSynthesis" in window) {
          setState("speaking")
          const utter = new SpeechSynthesisUtterance(replyText.slice(0, 500))
          utter.lang = LANG_SPEECH[lang] || "de-DE"
          utter.rate = 1.0
          utter.pitch = 1.0
          utter.onend = () => setState("idle")
          utteranceRef.current = utter
          window.speechSynthesis.speak(utter)
        } else {
          setState("idle")
        }
      } catch {
        setError("Verbindungsfehler – bitte erneut versuchen.")
        setState("idle")
      }
    },
    [lang, isMuted, onReply]
  )

  // NEXT-LEVEL UPGRADE 2026: "Evolve this" – re-send to Gemini with evolution prompt
  const handleEvolve = useCallback(async () => {
    if (!reply || evolving) return
    setEvolving(true)
    setSaved(false)
    setForked(false)
    try {
      const evolvePrompt = `Evolve and improve this security answer with advanced hardening steps, newer CVE mitigations, and Darwinian best-practice updates:\n\n${reply}`
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: evolvePrompt, history: [] }),
      })
      if (!res.ok) throw new Error("API error")
      const data = (await res.json()) as { reply?: string }
      const evolved = data.reply || reply
      setReply(evolved)
      onReply?.(evolved)
    } catch {
      setError("Evolve fehlgeschlagen – bitte erneut versuchen.")
    } finally {
      setEvolving(false)
    }
  }, [reply, evolving, onReply])

  // NEXT-LEVEL UPGRADE 2026: Save session to localStorage
  const handleSave = useCallback(() => {
    if (!reply) return
    try {
      const raw = JSON.parse(localStorage.getItem("cg_voice_sessions") || "[]")
      const sessions = Array.isArray(raw) ? raw : []
      sessions.unshift({ transcript, reply, runbookSlug, ts: new Date().toISOString() })
      localStorage.setItem("cg_voice_sessions", JSON.stringify(sessions.slice(0, 20)))
      setSaved(true)
    } catch {
      setSaved(true) // still mark saved even if storage fails
    }
  }, [transcript, reply, runbookSlug])

  // NEXT-LEVEL UPGRADE 2026: Fork – store a named fork in localStorage
  const handleFork = useCallback(() => {
    if (!reply) return
    try {
      const raw = JSON.parse(localStorage.getItem("cg_voice_forks") || "[]")
      const forks = Array.isArray(raw) ? raw : []
      const forkId = typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Date.now().toString(36)
      forks.unshift({
        id: forkId,
        transcript,
        reply,
        runbookSlug,
        forkedAt: new Date().toISOString(),
        label: `Voice Fork – ${new Date().toLocaleString()}`,
      })
      localStorage.setItem("cg_voice_forks", JSON.stringify(forks.slice(0, 20)))
      setForked(true)
    } catch {
      setForked(true)
    }
  }, [transcript, reply, runbookSlug])

  const startListening = useCallback(() => {
    const SpeechAPI = getSpeechRecognition()
    if (!SpeechAPI) return

    // Reset abort flag so a fresh session always processes onend correctly,
    // even when React Strict Mode ran the cleanup (abortedRef.current = true)
    // and then remounted the component without creating a new ref instance.
    abortedRef.current = false
    setState("listening")
    setTranscript("")
    transcriptRef.current = ""
    setReply("")
    setRunbookSlug(null)
    setSaved(false)
    setForked(false)
    setError(null)

    const recognition = new SpeechAPI()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = LANG_SPEECH[lang] || "de-DE"

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = ""
      let final = ""
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          final += result[0].transcript
        } else {
          interim += result[0].transcript
        }
      }
      const text = final || interim
      setTranscript(text)
      transcriptRef.current = text
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "aborted") return
      if (event.error === "not-allowed") {
        setError("Mikrofonzugriff verweigert – bitte in den Browser-Einstellungen erlauben.")
      } else if (event.error === "audio-capture") {
        setError("Kein Mikrofon gefunden – bitte Mikrofon anschließen.")
      } else {
        setError("Spracherkennung fehlgeschlagen. Bitte erneut versuchen.")
      }
      setState("idle")
    }

    recognition.onend = () => {
      if (abortedRef.current) return
      const text = transcriptRef.current
      if (text) {
        onTranscript?.(text)
        sendToGemini(text)
      } else {
        setState("idle")
      }
    }

    recognitionRef.current = recognition
    try {
      recognition.start()
    } catch (err) {
      console.error("Failed to start speech recognition:", err)
      setError("Mikrofon konnte nicht gestartet werden. Bitte erneut versuchen.")
      setState("idle")
      recognitionRef.current = null
    }
  }, [lang, onTranscript, sendToGemini])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
  }, [])

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }
    setState("idle")
  }, [])

  const toggleMute = useCallback(() => {
    if (state === "speaking") {
      stopSpeaking()
    }
    setIsMuted((m) => !m)
  }, [state, stopSpeaking])

  if (!supported) {
    return (
      <div className="p-4 rounded-xl border border-gray-800 bg-black/30 text-sm text-gray-500 text-center">
        Sprachsteuerung nicht unterstützt (Chrome/Edge empfohlen).
      </div>
    )
  }

  return (
    // NEXT-LEVEL UPGRADE 2026: Voice Copilot UI with glassmorphism 2.0
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#00ff9d]" />
          <span className="text-sm font-bold text-[#00ff9d]">Voice Copilot</span>
          <span className="text-xs text-gray-500 font-mono">Web Speech + Gemini 2.0</span>
        </div>
        <button
          onClick={toggleMute}
          className="p-1.5 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors"
          title={isMuted ? "Ton einschalten" : "Ton ausschalten"}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-gray-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-gray-300" />
          )}
        </button>
      </div>

      {/* Mic button + Waveform */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={state === "idle" ? startListening : stopListening}
          disabled={state === "processing" || state === "speaking"}
          className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
            state === "listening"
              ? "bg-red-500/20 border-2 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.5)] animate-pulse"
              : state === "processing" || state === "speaking"
              ? "bg-gray-800 border-2 border-gray-700 cursor-not-allowed"
              : "bg-[#00ff9d]/10 border-2 border-[#00ff9d]/50 hover:bg-[#00ff9d]/20 hover:border-[#00ff9d] shadow-[0_0_30px_rgba(0,255,157,0.25)]"
          }`}
          aria-label={state === "listening" ? "Aufnahme stoppen" : "Sprechen starten"}
        >
          {state === "processing" ? (
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          ) : state === "listening" ? (
            <MicOff className="w-8 h-8 text-red-400" />
          ) : (
            <Mic className="w-8 h-8 text-[#00ff9d]" />
          )}
          {/* NEXT-LEVEL UPGRADE 2026: Pulse ring while listening */}
          {state === "listening" && (
            <span className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-30" />
          )}
        </button>

        {/* NEXT-LEVEL UPGRADE 2026: Waveform animation while speaking */}
        {state === "speaking" && <Waveform />}

        <p className="text-xs text-gray-500 text-center">
          {state === "idle" && "🎤 Klick zum Sprechen"}
          {state === "listening" && "🔴 Höre zu… Klick zum Stoppen"}
          {state === "processing" && "⚙️ Verarbeite…"}
          {state === "speaking" && "🔊 Antwort wird vorgelesen…"}
        </p>
      </div>

      {/* Transcript display */}
      {transcript && (
        <div className="p-3 rounded-xl border border-white/10 bg-black/30">
          <p className="text-xs text-gray-500 mb-1">Erkannter Text:</p>
          <p className="text-sm text-gray-200 font-mono">&quot;{transcript}&quot;</p>
        </div>
      )}

      {/* Reply display */}
      {reply && (
        <div className="p-3 rounded-xl border border-[#00ff9d]/20 bg-[#00ff9d]/5 space-y-3">
          <p className="text-xs text-[#00ff9d] mb-1">Copilot Antwort:</p>
          <p className="text-sm text-gray-200 leading-relaxed line-clamp-6">{reply}</p>

          {/* NEXT-LEVEL UPGRADE 2026: Runbook suggestion */}
          {runbookSlug && (
            <a
              href={`/runbooks/${runbookSlug}`}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#00ff9d]/30 bg-[#00ff9d]/5 hover:bg-[#00ff9d]/10 text-xs text-[#00ff9d] transition-colors w-fit"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Passendes Runbook: <span className="font-mono font-bold">{runbookSlug}</span>
            </a>
          )}

          {/* NEXT-LEVEL UPGRADE 2026: Action buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            {/* Evolve this */}
            <button
              onClick={handleEvolve}
              disabled={evolving}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#c9a84c]/40 bg-[#c9a84c]/10 hover:bg-[#c9a84c]/20 text-[#c9a84c] text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {evolving ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Sparkles className="w-3 h-3" />
              )}
              Evolve this
            </button>

            {/* Fork this version */}
            <button
              onClick={handleFork}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                forked
                  ? "border-purple-500/40 bg-purple-500/15 text-purple-400 cursor-default"
                  : "border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300"
              }`}
            >
              <GitFork className="w-3 h-3" />
              {forked ? "Geforkt ✓" : "Version forken"}
            </button>

            {/* Save to my account */}
            <button
              onClick={handleSave}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                saved
                  ? "border-[#00ff9d]/40 bg-[#00ff9d]/15 text-[#00ff9d] cursor-default"
                  : "border-gray-600 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300"
              }`}
            >
              <Save className="w-3 h-3" />
              {saved ? "Gespeichert ✓" : "In Account speichern"}
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/5">
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}
    </div>
  )
}
