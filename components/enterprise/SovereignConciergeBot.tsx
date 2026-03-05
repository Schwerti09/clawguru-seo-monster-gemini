"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

// ── Types ─────────────────────────────────────────────────────────────────────

type StepId =
  | "welcome"
  | "company_size"
  | "use_cases"
  | "security_req"
  | "num_users"
  | "budget"
  | "timeline"
  | "summary"

interface Step {
  id: StepId
  botMessage: string
  inputType: "choice" | "text" | "none"
  choices?: string[]
  placeholder?: string
  next: StepId | null
}

interface Message {
  role: "bot" | "user"
  text: string
}

// ── Conversation flow ─────────────────────────────────────────────────────────

const STEPS: Step[] = [
  {
    id: "welcome",
    botMessage:
      "Willkommen. Ich bin **Sovereign** – dein persönlicher Enterprise Concierge.\n\nIch führe dich in wenigen Minuten zur perfekten Enterprise-Lösung für dein Unternehmen. Bereit?",
    inputType: "choice",
    choices: ["Ja, lass uns starten →"],
    next: "company_size",
  },
  {
    id: "company_size",
    botMessage: "Wie groß ist dein Unternehmen?",
    inputType: "choice",
    choices: ["1–10 Mitarbeiter", "11–50 Mitarbeiter", "51–250 Mitarbeiter", "250+ Mitarbeiter"],
    next: "use_cases",
  },
  {
    id: "use_cases",
    botMessage: "Welche Use-Cases sind für euch am wichtigsten?",
    inputType: "choice",
    choices: [
      "Incident Response & Runbooks",
      "Security Monitoring & Threat Intel",
      "API-Integration in SIEM/SOC",
      "Compliance & Reporting",
    ],
    next: "security_req",
  },
  {
    id: "security_req",
    botMessage:
      "Welche Security-Anforderungen habt ihr?\n*(z. B. ISO 27001, SOC 2, DSGVO, Zero-Trust …)*",
    inputType: "text",
    placeholder: "z. B. ISO 27001, Zero-Trust, On-Premise-Option …",
    next: "num_users",
  },
  {
    id: "num_users",
    botMessage: "Wie viele Nutzer sollen die Plattform verwenden?",
    inputType: "choice",
    choices: ["1–5 User", "6–20 User", "21–100 User", "100+ User"],
    next: "budget",
  },
  {
    id: "budget",
    botMessage: "Was ist euer monatliches Budget für Security-Tooling?",
    inputType: "choice",
    choices: ["< 500 €/Monat", "500–2.000 €/Monat", "2.000–10.000 €/Monat", "10.000+ €/Monat"],
    next: "timeline",
  },
  {
    id: "timeline",
    botMessage: "Wann soll die Lösung einsatzbereit sein?",
    inputType: "choice",
    choices: ["Sofort (diese Woche)", "Innerhalb eines Monats", "Innerhalb von 3 Monaten", "Noch offen"],
    next: "summary",
  },
  {
    id: "summary",
    botMessage:
      "✦ Perfekt, ich habe alles für dich vorbereitet.\n\nBasierend auf deinen Antworten ist **ClawGuru Enterprise** die ideale Lösung: Unbegrenzte API-Calls, dediziertes Onboarding, SLA-Garantie und direkter Zugang zum Security-Runbook-Vault.\n\nStarte jetzt dein Enterprise-Abo für **299 € / Monat**.",
    inputType: "none",
    next: null,
  },
]

// ── Constants ─────────────────────────────────────────────────────────────────

const TYPING_DELAY_MS = 900
const CHAT_AREA_MAX_HEIGHT = "55vh"
const PARTICLE_COLORS = ["#ffaa00", "#00b8ff", "#00ff9d"]



function Particles() {
  const particles = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 4,
    color: PARTICLE_COLORS[i % 3],
  }))

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full opacity-30"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            filter: `blur(${p.size / 2}px)`,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }}
          animate={{
            y: [0, -18, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

// ── Typing indicator ──────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ background: "#ffaa00" }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, delay: i * 0.18, repeat: Infinity }}
        />
      ))}
    </div>
  )
}

// ── Bot message renderer (bold via **text**) ──────────────────────────────────

function BotText({ text }: { text: string }) {
  const lines = text.split("\n")
  return (
    <span>
      {lines.map((line, li) => {
        const parts = line.split(/(\*\*[^*]+\*\*)/)
        return (
          <span key={li}>
            {parts.map((part, pi) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <strong key={pi} style={{ color: "#ffaa00" }}>
                  {part.slice(2, -2)}
                </strong>
              ) : (
                <span key={pi}>{part}</span>
              )
            )}
            {li < lines.length - 1 && <br />}
          </span>
        )
      })}
    </span>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  open: boolean
  onClose: () => void
}

export default function SovereignConciergeBot({ open, onClose }: Props) {
  const [stepIndex, setStepIndex] = useState(0)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const currentStep = STEPS[stepIndex]

  // Initialise conversation when modal opens
  useEffect(() => {
    if (!open) return
    setStepIndex(0)
    setMessages([])
    setInputValue("")
    setCheckoutError(null)
    setIsTyping(true)
    const t = setTimeout(() => {
      setMessages([{ role: "bot", text: STEPS[0].botMessage }])
      setIsTyping(false)
    }, 700)
    return () => clearTimeout(t)
  }, [open])

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  function advance(userAnswer: string) {
    const step = STEPS[stepIndex]
    const nextId = step.next
    const nextIndex = nextId ? STEPS.findIndex((s) => s.id === nextId) : -1

    setMessages((prev) => [...prev, { role: "user", text: userAnswer }])
    setInputValue("")

    if (nextIndex === -1) return

    setIsTyping(true)
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", text: STEPS[nextIndex].botMessage }])
      setIsTyping(false)
      setStepIndex(nextIndex)
    }, TYPING_DELAY_MS)
  }

  async function handleCheckout() {
    setCheckoutLoading(true)
    setCheckoutError(null)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "enterprise" }),
      })
      const data = await res.json()
      if (data?.url) {
        window.location.href = data.url
      } else {
        setCheckoutError(data?.error ?? "Checkout fehlgeschlagen. Bitte versuche es erneut.")
      }
    } catch {
      setCheckoutError("Netzwerkfehler. Bitte versuche es erneut.")
    } finally {
      setCheckoutLoading(false)
    }
  }

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-lg flex flex-col rounded-3xl overflow-hidden"
              style={{
                background: "rgba(8, 6, 14, 0.92)",
                border: "1px solid rgba(255,170,0,0.25)",
                boxShadow:
                  "0 0 80px rgba(255,170,0,0.12), 0 0 40px rgba(0,184,255,0.08), inset 0 1px 0 rgba(255,255,255,0.05)",
                backdropFilter: "blur(24px)",
                maxHeight: "90vh",
              }}
              initial={{ scale: 0.92, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 24, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Particles />

              {/* Header */}
              <div
                className="relative flex items-center justify-between px-6 py-4 shrink-0"
                style={{ borderBottom: "1px solid rgba(255,170,0,0.12)" }}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div
                    className="relative w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #ffaa00 0%, #ff5000 60%, #00b8ff 100%)",
                      boxShadow: "0 0 20px rgba(255,170,0,0.4)",
                    }}
                  >
                    ✦
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ border: "1px solid rgba(255,170,0,0.6)" }}
                      animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-black text-white tracking-wide">Sovereign</div>
                    <div
                      className="text-[10px] font-mono uppercase tracking-[0.2em]"
                      style={{ color: "#ffaa00" }}
                    >
                      Enterprise Concierge · ClawGuru
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-white transition-colors text-xl leading-none p-1"
                  aria-label="Schließen"
                >
                  ×
                </button>
              </div>

              {/* Chat area */}
              <div className="relative flex-1 overflow-y-auto px-4 py-5 space-y-4 min-h-0" style={{ maxHeight: CHAT_AREA_MAX_HEIGHT }}>
                <AnimatePresence initial={false}>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
                        style={
                          msg.role === "bot"
                            ? {
                                background: "rgba(255,170,0,0.08)",
                                border: "1px solid rgba(255,170,0,0.18)",
                                color: "#e5e7eb",
                              }
                            : {
                                background: "linear-gradient(135deg, rgba(0,184,255,0.18) 0%, rgba(0,255,157,0.12) 100%)",
                                border: "1px solid rgba(0,184,255,0.25)",
                                color: "#fff",
                              }
                        }
                      >
                        {msg.role === "bot" ? <BotText text={msg.text} /> : msg.text}
                      </div>
                    </motion.div>
                  ))}

                  {isTyping && (
                    <motion.div
                      key="typing"
                      className="flex justify-start"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <div
                        className="rounded-2xl"
                        style={{
                          background: "rgba(255,170,0,0.08)",
                          border: "1px solid rgba(255,170,0,0.18)",
                        }}
                      >
                        <TypingDots />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={bottomRef} />
              </div>

              {/* Input area */}
              <div
                className="relative px-4 py-4 shrink-0"
                style={{ borderTop: "1px solid rgba(255,170,0,0.1)" }}
              >
                {!isTyping && currentStep.id === "summary" && (
                  <div className="space-y-3">
                    <motion.button
                      onClick={handleCheckout}
                      disabled={checkoutLoading}
                      className="w-full py-4 px-6 rounded-2xl font-black text-sm text-black transition-all duration-200 disabled:opacity-60"
                      style={{
                        background: "linear-gradient(135deg, #ffaa00 0%, #ff5000 50%, #ff8c00 100%)",
                        boxShadow: "0 0 40px rgba(255,170,0,0.4), 0 4px 20px rgba(255,80,0,0.3)",
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {checkoutLoading
                        ? "Weiterleitung zu Stripe …"
                        : "✦ Jetzt Enterprise für 299 € buchen"}
                    </motion.button>
                    {checkoutError && (
                      <p className="text-xs text-red-400 text-center">{checkoutError}</p>
                    )}
                    <p className="text-xs text-gray-500 text-center">
                      Sicherer Checkout via Stripe · Jederzeit kündbar
                    </p>
                  </div>
                )}

                {!isTyping && currentStep.inputType === "choice" && (
                  <div className="flex flex-col gap-2">
                    {currentStep.choices?.map((choice) => (
                      <motion.button
                        key={choice}
                        onClick={() => advance(choice)}
                        className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,170,0,0.2)",
                          color: "#e5e7eb",
                        }}
                        whileHover={{
                          background: "rgba(255,170,0,0.1)",
                          borderColor: "rgba(255,170,0,0.5)",
                          color: "#fff",
                          x: 4,
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {choice}
                      </motion.button>
                    ))}
                  </div>
                )}

                {!isTyping && currentStep.inputType === "text" && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      if (inputValue.trim()) advance(inputValue.trim())
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={currentStep.placeholder ?? "Antwort eingeben …"}
                      className="flex-1 rounded-xl px-4 py-3 text-sm outline-none transition-all"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,170,0,0.25)",
                        color: "#fff",
                      }}
                      autoFocus
                    />
                    <motion.button
                      type="submit"
                      disabled={!inputValue.trim()}
                      className="px-4 py-3 rounded-xl font-black text-sm text-black disabled:opacity-40 transition-all"
                      style={{
                        background: "linear-gradient(135deg, #ffaa00 0%, #ff5000 100%)",
                      }}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      →
                    </motion.button>
                  </form>
                )}
              </div>

              {/* Progress indicator */}
              <div
                className="px-4 pb-4 shrink-0"
              >
                <div className="flex gap-1 justify-center">
                  {STEPS.slice(0, -1).map((_, i) => (
                    <div
                      key={i}
                      className="h-[3px] rounded-full transition-all duration-500"
                      style={{
                        flex: 1,
                        background: i < stepIndex
                          ? "linear-gradient(90deg, #ffaa00, #ff5000)"
                          : i === stepIndex
                          ? "rgba(255,170,0,0.4)"
                          : "rgba(255,255,255,0.08)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
