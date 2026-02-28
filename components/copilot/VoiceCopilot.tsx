'use client'

// NEXT-LEVEL UPGRADE 2026: Voice-Controlled Claw Copilot
// Web Speech API + Gemini – speak your issue, get spoken + visual Runbook answer.
// Falls back gracefully when Speech API is unavailable.

import { useState, useRef, useCallback, useEffect } from "react"
import { Mic, MicOff, Volume2, VolumeX, Loader2, Zap } from "lucide-react"

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

// NEXT-LEVEL UPGRADE 2026: Safe accessor for vendor-prefixed Speech API
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSpeechRecognition(): (new () => any) | undefined {
  if (typeof window === "undefined") return undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any
  return w.SpeechRecognition || w.webkitSpeechRecognition || undefined
}

export default function VoiceCopilot({ lang = "de", onTranscript, onReply }: VoiceCopilotProps) {
  const [state, setState] = useState<VoiceState>("idle")
  const [transcript, setTranscript] = useState("")
  const [reply, setReply] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [supported, setSupported] = useState(true)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)
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
    setError(null)

    const recognition = new SpeechAPI()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = LANG_SPEECH[lang] || "de-DE"

    recognition.onresult = (event: { results: SpeechRecognitionResultList }) => {
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
          <span className="text-xs text-gray-500 font-mono">Web Speech + Gemini</span>
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

      {/* Mic button */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={state === "idle" ? startListening : stopListening}
          disabled={state === "processing" || state === "speaking"}
          className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
            state === "listening"
              ? "bg-red-500/20 border-2 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)] animate-pulse"
              : state === "processing" || state === "speaking"
              ? "bg-gray-800 border-2 border-gray-700 cursor-not-allowed"
              : "bg-[#00ff9d]/10 border-2 border-[#00ff9d]/50 hover:bg-[#00ff9d]/20 hover:border-[#00ff9d] shadow-[0_0_20px_rgba(0,255,157,0.2)]"
          }`}
        >
          {state === "processing" ? (
            <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
          ) : state === "listening" ? (
            <MicOff className="w-6 h-6 text-red-400" />
          ) : (
            <Mic className="w-6 h-6 text-[#00ff9d]" />
          )}
          {/* NEXT-LEVEL UPGRADE 2026: Pulse ring while listening */}
          {state === "listening" && (
            <span className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-30" />
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          {state === "idle" && "Klick zum Sprechen"}
          {state === "listening" && "Höre zu… Klick zum Stoppen"}
          {state === "processing" && "Verarbeite…"}
          {state === "speaking" && "Antwort wird vorgelesen…"}
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
        <div className="p-3 rounded-xl border border-[#00ff9d]/20 bg-[#00ff9d]/5">
          <p className="text-xs text-[#00ff9d] mb-1">Copilot Antwort:</p>
          <p className="text-sm text-gray-200 leading-relaxed line-clamp-6">{reply}</p>
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
