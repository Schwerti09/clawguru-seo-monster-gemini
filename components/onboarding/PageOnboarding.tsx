"use client"

import { motion } from "framer-motion"
import { Info, Lightbulb, Target, Zap, ArrowRight } from "lucide-react"

interface OnboardingCardProps {
  title: string
  description: string
  primaryAction: string
  secondaryAction?: string
  icon: React.ReactNode
  variant: "hero" | "standard" | "feature"
  onPrimaryAction?: () => void
  onSecondaryAction?: () => void
}

function OnboardingCard({
  title,
  description,
  primaryAction,
  secondaryAction,
  icon,
  variant,
  onPrimaryAction,
  onSecondaryAction,
}: OnboardingCardProps) {
  const baseClasses = "rounded-2xl border backdrop-blur-xl p-6 transition-all duration-300 hover:shadow-2xl"
  const bgStyles = {
    background: "rgba(10,10,10,0.95)",
    borderColor: "rgba(212,175,55,0.2)",
  }

  const iconWrapper = (
    <div
      className="p-3 rounded-xl flex items-center justify-center mb-4"
      style={{
        background: "linear-gradient(135deg, #d4af37, #e8cc6a)",
        boxShadow: "0 0 20px rgba(212,175,55,0.3)",
      }}
    >
      {icon}
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={baseClasses}
      style={bgStyles}
    >
      {iconWrapper}
      <h3 className="font-bold text-white text-xl mb-3">{title}</h3>
      <p className="text-gray-300 text-sm leading-relaxed mb-6">{description}</p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onPrimaryAction}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:brightness-110"
          style={{
            background: "linear-gradient(135deg, #d4af37, #e8cc6a)",
            color: "#0a0a0a",
            boxShadow: "0 0 16px rgba(212,175,55,0.25)",
          }}
        >
          {primaryAction}
          <ArrowRight className="w-4 h-4" />
        </button>
        
        {secondaryAction && (
          <button
            onClick={onSecondaryAction}
            className="flex-1 px-4 py-3 rounded-xl font-medium text-sm border border-white/20 text-gray-300 hover:text-white transition-colors"
          >
            {secondaryAction}
          </button>
        )}
      </div>
    </motion.div>
  )
}

interface PageOnboardingProps {
  pageType: "live" | "check" | "copilot" | "runbooks" | "intel"
  onDismiss?: () => void
}

const ONBOARDING_CONTENT = {
  live: {
    title: "🔴 LIVE Cockpit",
    description: "Dies ist dein taktisches Kommandozentrum. Hier siehst du Echtzeit-Status aller Systeme, aktuelle Bedrohungen und was gerade im Cyberspace passiert.",
    primaryAction: "Systeme überwachen",
    secondaryAction: "Benachrichtigungen einstellen",
    icon: <Target className="w-6 h-6 text-black" />,
    tips: [
      "Die farblichen Indikatoren zeigen sofort den System-Status",
      "Klicke auf任何 Eintrag für detaillierte Informationen",
      "Aktiviere Desktop-Benachrichtigungen für kritische Ereignisse",
    ],
  },
  check: {
    title: "🛡️ Security Check",
    description: "Lass deine Systeme auf Schwachstellen scannen. Unsere KI analysiert Konfigurationen, Abhängigkeiten und potenzielle Angriffsvektoren.",
    primaryAction: "Scan starten",
    secondaryAction: "Scan-Optionen konfigurieren",
    icon: <Info className="w-6 h-6 text-black" />,
    tips: [
      "Scans sind komplett kostenlos und benötigen keine Installation",
      "Du erhältst sofortige Ergebnisse mit Prioritäts-Einstufung",
      "Wiederholte Scans zeigen den Fortschritt deiner Sicherheitsmaßnahmen",
    ],
  },
  copilot: {
    title: "🤖 KI Copilot",
    description: "Beschreibe dein Problem in natürlicher Sprache und unsere KI löst es für dich. Wie ein erfahrener DevOps Ingenieur in deiner Tasche.",
    primaryAction: "Copilot starten",
    secondaryAction: "Beispiele ansehen",
    icon: <Lightbulb className="w-6 h-6 text-black" />,
    tips: [
      "Sei so spezifisch wie möglich bei der Beschreibung deines Problems",
      "Du kannst Code-Schnipsel, Logs oder Fehlermeldungen einfügen",
      "Die KI lernt aus deinen Präferenzen und wird immer besser",
    ],
  },
  runbooks: {
    title: "📚 Runbooks Archiv",
    description: "600+ vorgefertigte Lösungen für jede Situation. Von Kubernetes über GDPR bis hin zu Incident Response - alles sofort einsatzbereit.",
    primaryAction: "Runbooks durchsuchen",
    secondaryAction: "Kategorien ansehen",
    icon: <Target className="w-6 h-6 text-black" />,
    tips: [
      "Nutze die Suche für schnelle Ergebnisse",
      "Jedes Runbook enthält Schritt-für-Schritt Anleitungen",
      "Runbooks können an deine Infrastruktur angepasst werden",
    ],
  },
  intel: {
    title: "📡 Intel Feed",
    description: "Echtzeit-Infos aus Dark Web, CVE-Datenbanken und Threat Intelligence Quellen. Immer einen Schritt vor Angreifern.",
    primaryAction: "Intel durchsuchen",
    secondaryAction: "Benachrichtigungen konfigurieren",
    icon: <Zap className="w-6 h-6 text-black" />,
    tips: [
      "Bedrohungen werden nach Schwere und Relevanz sortiert",
      "Setze Alerts für spezifische CVEs oder Threats",
      "Exportiere Berichte für dein Security Team",
    ],
  },
}

export default function PageOnboarding({ pageType, onDismiss }: PageOnboardingProps) {
  const content = ONBOARDING_CONTENT[pageType]
  
  if (!content) return null

  const handlePrimaryAction = () => {
    // Navigate to the main action of the page
    console.log(`Primary action for ${pageType}`)
  }

  const handleSecondaryAction = () => {
    // Show secondary options
    console.log(`Secondary action for ${pageType}`)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="font-black text-4xl md:text-5xl text-white mb-4 tracking-tight">
          {content.title}
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          {content.description}
        </p>
      </motion.div>

      {/* Main Action Card */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <OnboardingCard
          title="Direkt loslegen"
          description={content.description}
          primaryAction={content.primaryAction}
          secondaryAction={content.secondaryAction}
          icon={content.icon}
          variant="hero"
          onPrimaryAction={handlePrimaryAction}
          onSecondaryAction={handleSecondaryAction}
        />

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border backdrop-blur-xl p-6"
          style={{
            background: "rgba(10,10,10,0.95)",
            borderColor: "rgba(212,175,55,0.2)",
          }}
        >
          <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5" style={{ color: "#d4af37" }} />
            Schnelltipps
          </h3>
          <ul className="space-y-3">
            {content.tips.map((tip, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-3"
              >
                <div
                  className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                  style={{ background: "#d4af37" }}
                />
                <span className="text-gray-300 text-sm leading-relaxed">{tip}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border backdrop-blur-xl p-6 text-center"
          style={{
            background: "rgba(10,10,10,0.95)",
            borderColor: "rgba(212,175,55,0.2)",
          }}
        >
          <div className="text-3xl font-bold" style={{ color: "#d4af37" }}>
            600+
          </div>
          <div className="text-white font-medium mb-2">Runbooks</div>
          <div className="text-gray-400 text-sm">Fertige Lösungen</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border backdrop-blur-xl p-6 text-center"
          style={{
            background: "rgba(10,10,10,0.95)",
            borderColor: "rgba(212,175,55,0.2)",
          }}
        >
          <div className="text-3xl font-bold" style={{ color: "#d4af37" }}>
            24/7
          </div>
          <div className="text-white font-medium mb-2">Monitoring</div>
          <div className="text-gray-400 text-sm">Echtzeit-Überwachung</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl border backdrop-blur-xl p-6 text-center"
          style={{
            background: "rgba(10,10,10,0.95)",
            borderColor: "rgba(212,175,55,0.2)",
          }}
        >
          <div className="text-3xl font-bold" style={{ color: "#d4af37" }}>
            KI
          </div>
          <div className="text-white font-medium mb-2">Powered</div>
          <div className="text-gray-400 text-sm">Intelligente Hilfe</div>
        </motion.div>
      </div>

      {/* Dismiss Button */}
      {onDismiss && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-12"
        >
          <button
            onClick={onDismiss}
            className="px-6 py-3 rounded-xl font-medium text-sm border border-white/20 text-gray-400 hover:text-white transition-colors"
          >
            Tour beenden und zum Dashboard
          </button>
        </motion.div>
      )}
    </div>
  )
}
