"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronRight, Sparkles, Shield, Brain, BookOpen, Radar, Zap } from "lucide-react"

interface GuideStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  action?: string
  href?: string
}

const GUIDE_STEPS: GuideStep[] = [
  {
    id: "welcome",
    title: "Willkommen an Bord, Commander!",
    description: "Du hast das Mycylium Singularity Raumschiff betreten. Ich bin dein Copilot und helfe dir, die Kontrolle zu übernehmen.",
    icon: <Sparkles className="w-6 h-6" />,
  },
  {
    id: "live",
    title: "🔴 LIVE - Das Herzstück",
    description: "Hier siehst du Echtzeit-Bedrohungen, System-Status und was gerade im Cyberspace passiert. Dein taktisches Cockpit.",
    icon: <Radar className="w-6 h-6" />,
    href: "/live",
    action: "Zum Cockpit",
  },
  {
    id: "check",
    title: "🛡️ SECURITY CHECK - Dein Schild",
    description: "Lass deine Systeme scannen. Finde Schwachstellen bevor Angreifer es tun. Komplett kostenlos und sofort.",
    icon: <Shield className="w-6 h-6" />,
    href: "/check",
    action: "System scannen",
  },
  {
    id: "copilot",
    title: "🤖 COPILOT - Dein KI-Assistent",
    description: "Beschreibe dein Problem und die KI löst es für dich. Wie ein DevOps Ingenieur in deiner Tasche.",
    icon: <Brain className="w-6 h-6" />,
    href: "/copilot",
    action: "Copilot starten",
  },
  {
    id: "runbooks",
    title: "📚 RUNBOOKS - Dein Wissensarchiv",
    description: "600+ vorgefertigte Lösungen für jede Situation. Von Kubernetes bis GDPR - alles sofort einsatzbereit.",
    icon: <BookOpen className="w-6 h-6" />,
    href: "/runbooks",
    action: "Runbooks durchsuchen",
  },
  {
    id: "intel",
    title: "📡 INTEL FEED - Dein Geheimdienst",
    description: "Echtzeit-Infos aus der Dark Web, CVE-Datenbanken und Threat Intelligence. Immer einen Schritt voraus.",
    icon: <Zap className="w-6 h-6" />,
    href: "/intel",
    action: "Intel einsehen",
  },
]

export default function WelcomeGuide() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isMinimized, setIsMinimized] = useState(false)

  useEffect(() => {
    // Show guide after a short delay
    const timer = setTimeout(() => {
      const dismissed = localStorage.getItem("welcome_guide_dismissed")
      if (!dismissed) {
        setIsVisible(true)
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    localStorage.setItem("welcome_guide_dismissed", "1")
    setIsVisible(false)
  }

  const handleNext = () => {
    if (currentStep < GUIDE_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleDismiss()
    }
  }

  const handleAction = () => {
    const step = GUIDE_STEPS[currentStep]
    if (step.href) {
      window.location.href = step.href
    }
    handleNext()
  }

  if (!isVisible) return null

  const step = GUIDE_STEPS[currentStep]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-6 right-6 z-50 max-w-sm"
      >
        <div
          className="rounded-2xl border backdrop-blur-xl p-6 shadow-2xl"
          style={{
            background: "rgba(10,10,10,0.95)",
            borderColor: "rgba(212,175,55,0.2)",
            boxShadow: "0 0 60px rgba(212,175,55,0.15), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #d4af37, #e8cc6a)",
                  boxShadow: "0 0 20px rgba(212,175,55,0.3)",
                }}
              >
                {step.icon}
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">{step.title}</h3>
                <div className="flex items-center gap-1 mt-1">
                  {GUIDE_STEPS.map((_, index) => (
                    <div
                      key={index}
                      className="h-1 rounded-full transition-all duration-300"
                      style={{
                        width: index === currentStep ? "24px" : "8px",
                        background: index <= currentStep ? "#d4af37" : "rgba(255,255,255,0.2)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {!isMinimized && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <p className="text-gray-300 text-sm leading-relaxed">{step.description}</p>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  {step.action && (
                    <button
                      onClick={handleAction}
                      className="flex-1 flex items-center justify-center gap-2 px-4 -2 rounded-xl font-bold text-sm transition-all duration-200 hover:brightness-110"
                      style={{
                        background: "linear-gradient(135deg, #d4af37, #e8cc6a)",
                        color: "#0a0a0a",
                        boxShadow: "0 0 16px rgba(212,175,55,0.25)",
                      }}
                    >
                      {step.action}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={handleNext}
                    className="px-cke py-2 rounded-xl font-medium text-sm border border-white/20 text-gray-300 hover:text-white transition-colors"
                  >
                    {currentStep === GUIDE_STEPS.length - 1 ? "Fertig" : "Überspringen"}
                  </button>
                </div>

                {/* Progress indicator */}
                <div className="text-center">
                  <p className="text-xs text-gray-400">
                    Schritt {currentStep + 1} von {GUIDE_STEPS.length}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Minimized state */}
          {isMinimized && (
            <div className="flex items-center justify-center">
              <button
                onClick={() => setIsMinimized(false)}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                Tour fortsetzen
              </button>
            </div>
          )}
        </div>

        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-2xl opacity-30 blur-xl"
          style={{
            background: "radial-gradient(circle at center, rgba(212,175,55,0.3), transparent)",
            zIndex: -1,
          }}
        />
      </motion.div>
    </AnimatePresence>
  )
}
