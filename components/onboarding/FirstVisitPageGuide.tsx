"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { useI18n } from "@/components/i18n/I18nProvider"
import { SUPPORTED_LOCALES } from "@/lib/i18n"

type GuideConfig = {
  title: string
  value: string
  points: string[]
}

const STORAGE_PREFIX = "cg_page_guide_seen_v1:"

const GUIDE_MAP_DE: Record<string, GuideConfig> = {
  "/live": {
    title: "Live-Cockpit in 20 Sekunden",
    value: "Du siehst sofort kritische Signale und Prioritaeten statt roher Datenflut.",
    points: ["Realtime-Lagebild", "Fokus auf kritische Events", "Direkter Sprung zu Maßnahmen"],
  },
  "/check": {
    title: "Security-Check mit Sofortnutzen",
    value: "In Minuten erkennst du Schwachstellen und erhältst konkrete nächste Schritte.",
    points: ["Ohne Setup", "Schnelle Risiko-Orientierung", "Direkt umsetzbare Hinweise"],
  },
  "/copilot": {
    title: "Copilot für echte Incidents",
    value: "Beschreibe dein Problem und erhalte strukturierte, ausführbare Lösungen.",
    points: ["Problem -> Plan", "Fix + Verify + Rollback", "Weniger Trial-and-Error"],
  },
  "/runbooks": {
    title: "Runbooks schneller finden",
    value: "Greife in Sekunden auf passende Playbooks statt lange Suche zurück.",
    points: ["Filterbare Wissensbasis", "Sofort einsetzbare Abläufe", "Klarer Umsetzungsfokus"],
  },
  "/intel": {
    title: "Intel mit Priorisierung",
    value: "Statt Noise bekommst du eine priorisierte Sicht auf relevante Risiken.",
    points: ["Signal statt Lärm", "CVE- und Threat-Fokus", "Bessere Reaktionsgeschwindigkeit"],
  },
  "/pricing": {
    title: "Schneller Plan-Überblick",
    value: "Wähle den Zugang, der zu deinem aktuellen Bedarf passt.",
    points: ["Day Pass für sofortigen Start", "Klare Leistungsunterschiede", "Upgrade jederzeit möglich"],
  },
}

const GUIDE_MAP_EN: Record<string, GuideConfig> = {
  "/live": {
    title: "Live cockpit in 20 seconds",
    value: "See critical signals first instead of drowning in raw telemetry.",
    points: ["Real-time overview", "Critical-event focus", "Fast path to action"],
  },
  "/check": {
    title: "Security check with immediate value",
    value: "Find weak points in minutes and get concrete next actions.",
    points: ["No setup required", "Fast risk orientation", "Actionable guidance"],
  },
  "/copilot": {
    title: "Copilot for real incidents",
    value: "Describe your issue and get structured, executable responses.",
    points: ["Problem to plan", "Fix + verify + rollback", "Less trial and error"],
  },
  "/runbooks": {
    title: "Find runbooks faster",
    value: "Access relevant playbooks in seconds instead of searching manually.",
    points: ["Filterable knowledge base", "Ready-to-execute flows", "Execution-first structure"],
  },
  "/intel": {
    title: "Prioritized intel, less noise",
    value: "Get a focused view on relevant risks instead of alert overload.",
    points: ["Signal over noise", "CVE and threat focus", "Faster response loops"],
  },
  "/pricing": {
    title: "Quick plan clarity",
    value: "Pick the access model that matches your current stage.",
    points: ["Day pass for instant start", "Clear plan differences", "Upgrade anytime"],
  },
}

function normalizePath(pathname: string | null): string {
  if (!pathname) return "/"
  const parts = pathname.split("/").filter(Boolean)
  if (parts.length === 0) return "/"
  const first = parts[0]?.toLowerCase()
  if (first && SUPPORTED_LOCALES.includes(first as any)) {
    const rest = parts.slice(1)
    return rest.length ? `/${rest.join("/")}` : "/"
  }
  return pathname
}

export default function FirstVisitPageGuide() {
  const pathname = usePathname()
  const { locale } = useI18n()
  const [open, setOpen] = useState(false)
  const cleanPath = useMemo(() => normalizePath(pathname), [pathname])
  const isEn = locale === "en"
  const labels = isEn
    ? { title: "Quick Welcome", dismiss: "Got it", never: "Do not show again" }
    : { title: "Schneller Einstieg", dismiss: "Verstanden", never: "Nicht mehr zeigen" }

  const guide = useMemo(() => {
    const map = isEn ? GUIDE_MAP_EN : GUIDE_MAP_DE
    return map[cleanPath] ?? null
  }, [cleanPath, isEn])

  useEffect(() => {
    if (!guide) {
      setOpen(false)
      return
    }
    if (cleanPath === "/vorstellung") {
      setOpen(false)
      return
    }
    if (cleanPath.startsWith("/admin")) {
      setOpen(false)
      return
    }
    const key = `${STORAGE_PREFIX}${cleanPath}`
    const seen = window.localStorage.getItem(key) === "1"
    if (seen) {
      setOpen(false)
      return
    }
    const timer = window.setTimeout(() => setOpen(true), 900)
    return () => window.clearTimeout(timer)
  }, [cleanPath, guide])

  const dismiss = () => {
    if (!guide) return
    const key = `${STORAGE_PREFIX}${cleanPath}`
    window.localStorage.setItem(key, "1")
    setOpen(false)
  }

  if (!guide) return null

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px]" onClick={dismiss} />
          <motion.div
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 18, opacity: 0 }}
            className="relative w-full max-w-xl rounded-3xl border border-cyan-300/25 bg-zinc-950/95 p-5 sm:p-6 text-white shadow-[0_20px_50px_-30px_rgba(34,211,238,0.45)]"
          >
            <p className="text-[11px] uppercase tracking-widest text-cyan-200">{labels.title}</p>
            <h3 className="mt-1 text-xl font-black">{guide.title}</h3>
            <p className="mt-2 text-sm text-zinc-200">{guide.value}</p>
            <ul className="mt-4 space-y-2">
              {guide.points.map((p) => (
                <li key={p} className="text-sm text-zinc-300 flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-300" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={dismiss}
                className="px-3 py-1.5 rounded-lg border border-white/15 text-xs text-zinc-300 hover:bg-white/10"
              >
                {labels.never}
              </button>
              <button
                type="button"
                onClick={dismiss}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-300/35 text-xs text-cyan-100 hover:bg-cyan-500/30"
              >
                {labels.dismiss}
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
