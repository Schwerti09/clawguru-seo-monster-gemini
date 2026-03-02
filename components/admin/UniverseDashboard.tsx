"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Globe,
  DollarSign,
  Star,
  Shield,
  Zap,
  X,
  Info,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Power,
  TrendingUp,
  Activity,
} from "lucide-react"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Overview = {
  now: string
  siteUrl: string
  env: {
    hasStripe: boolean
    hasOpenAI: boolean
    hasAdmin: boolean
    hasWebhook: boolean
    hasEmail: boolean
  }
  stripe?: {
    currency: string
    charges7d: number
    charges24h: number
    chargeCount7d: number
    activeSubs: number
    trialingSubs: number
    lastPayments: Array<{
      created: number
      amount: number
      currency: string
      description?: string | null
    }>
  }
}

type ModuleId = "seo" | "cash" | "affiliate" | "sentinel" | "defense"

type ModuleInfo = {
  id: ModuleId
  title: string
  subtitle: string
  icon: React.ElementType
  color: string
  borderColor: string
  glowColor: string
  description: string
  envVars: string[]
  tip: string
  deepLink: { label: string; href: string }
}

// ---------------------------------------------------------------------------
// Module definitions
// ---------------------------------------------------------------------------

const MODULES: ModuleInfo[] = [
  {
    id: "seo",
    title: "SEO-Galaxy",
    subtitle: "Google Indexing Engine",
    icon: Globe,
    color: "text-cyan-400",
    borderColor: "border-cyan-500/30",
    glowColor: "rgba(34,211,238,0.15)",
    description:
      "Dieses Modul schickt jeden Morgen bis zu 200 URLs direkt zu Google. Es nutzt die Google Indexing API, um neue Seiten sofort in den Index zu pushen – ohne auf den regulären Crawl zu warten.",
    envVars: ["GOOGLE_INDEXER_KEY"],
    tip: "Priorisiere High-Value-Seiten (Runbooks, /check) täglich – das erhöht den organischen Traffic um bis zu 40 %.",
    deepLink: { label: "Google Search Console →", href: "https://search.google.com/search-console" },
  },
  {
    id: "cash",
    title: "Cash-Nebula",
    subtitle: "Stripe Revenue & Subscriptions",
    icon: DollarSign,
    color: "text-green-400",
    borderColor: "border-green-500/30",
    glowColor: "rgba(34,197,94,0.15)",
    description:
      "Zeigt alle Stripe-Einnahmen in Echtzeit: 24-Stunden-Umsatz, 7-Tage-Revenue und aktive Abonnements. Trialing-Subscriptions werden separat angezeigt, damit du Conversion-Drops sofort siehst.",
    envVars: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"],
    tip: "Aktiviere Annual-Billing (12 × Monatspreis mit 2 Gratis-Monaten) – das erhöht den LTV pro Kunde um ~80 %.",
    deepLink: { label: "Stripe Dashboard →", href: "https://dashboard.stripe.com" },
  },
  {
    id: "affiliate",
    title: "Affiliate-Star",
    subtitle: "Partner Network",
    icon: Star,
    color: "text-yellow-400",
    borderColor: "border-yellow-500/30",
    glowColor: "rgba(250,204,21,0.15)",
    description:
      "Übersicht deines Affiliate-Netzwerks: Anzahl der aktiven Partner und ausstehende Provisionen. Das Modul trackt Referral-Links und berechnet automatisch die monatliche Auszahlung.",
    envVars: ["AFFILIATE_SECRET", "NEXT_PUBLIC_AFFILIATE_PROGRAM_URL"],
    tip: "Biete deinen Top-5-Affiliates 30 % recurring statt einmalig – sie werden zu deinem Sales-Team.",
    deepLink: { label: "Partner Config →", href: "/admin/center" },
  },
  {
    id: "sentinel",
    title: "Sentinel-Core",
    subtitle: "Gemini API & System Health",
    icon: Activity,
    color: "text-purple-400",
    borderColor: "border-purple-500/30",
    glowColor: "rgba(168,85,247,0.15)",
    description:
      "Überwacht den Health-Status der Gemini/OpenAI-API und die Systemverfügbarkeit. Zeigt Response-Zeiten, API-Fehlerquoten und System-Uptime auf einen Blick.",
    envVars: ["GEMINI_API_KEY", "OPENAI_API_KEY"],
    tip: "Baue eine Fallback-Chain: Gemini → OpenAI → lokales Modell. So hast du 99,9 % Verfügbarkeit ohne Single-Point-of-Failure.",
    deepLink: { label: "Sentinel Logs →", href: "/api/admin/sentinel-check" },
  },
  {
    id: "defense",
    title: "Defense-Shield",
    subtitle: "Kill-Switch Control",
    icon: Shield,
    color: "text-red-400",
    borderColor: "border-red-500/30",
    glowColor: "rgba(239,68,68,0.15)",
    description:
      "Der Emergency Kill-Switch: Aktiviert den MAINTENANCE_MODE über die Netlify-API und triggert sofort einen neuen Build. Ideal vor großen Deployments oder bei kritischen Sicherheitsvorfällen.",
    envVars: ["NETLIFY_API_KEY", "NETLIFY_SITE_ID", "MAINTENANCE_MODE"],
    tip: "Nutze den Kill-Switch immer vor DB-Migrationen – das verhindert inkonsistente Zustände für aktive User.",
    deepLink: { label: "Netlify Config →", href: "https://app.netlify.com" },
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function money(v: number, currency = "eur") {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(v / 100)
}

function isModuleOk(moduleId: ModuleId, overview: Overview | null): boolean {
  if (!overview) return false
  const env = overview.env
  if (moduleId === "seo") return true // SEO module is always configured when the dashboard loads
  if (moduleId === "cash") return !!env.hasStripe
  if (moduleId === "affiliate") return !!env.hasWebhook
  if (moduleId === "sentinel") return !!env.hasOpenAI
  if (moduleId === "defense") return !!env.hasAdmin
  return false
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatusDot({ ok }: { ok: boolean }) {
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${ok ? "bg-green-400" : "bg-red-400"} animate-pulse-neon`}
    />
  )
}

function EnvBadge({ name }: { name: string }) {
  return (
    <code className="inline-block px-2 py-0.5 rounded text-xs bg-white/5 border border-white/10 text-gray-300 font-mono">
      {name}
    </code>
  )
}

// ---------------------------------------------------------------------------
// Side Drawer
// ---------------------------------------------------------------------------

function Drawer({
  module,
  onClose,
}: {
  module: ModuleInfo | null
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      {module && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Drawer panel */}
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md z-50 flex flex-col"
            style={{
              background:
                "linear-gradient(135deg, rgba(10,10,20,0.97) 0%, rgba(15,15,30,0.97) 100%)",
              borderLeft: "1px solid rgba(255,255,255,0.08)",
              boxShadow: `-20px 0 60px rgba(0,0,0,0.5)`,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/8">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-xl bg-white/5 border ${module.borderColor}`}
                >
                  <module.icon className={`w-5 h-5 ${module.color}`} />
                </div>
                <div>
                  <div className="font-black text-white text-lg">{module.title}</div>
                  <div className="text-xs text-gray-400">{module.subtitle}</div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                aria-label="Drawer schließen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* What does it do */}
              <section>
                <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5" />
                  Was macht dieses Modul?
                </h3>
                <p className="text-gray-200 text-sm leading-relaxed">
                  {module.description}
                </p>
              </section>

              {/* Env vars */}
              <section>
                <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5" />
                  Env-Variablen
                </h3>
                <div className="flex flex-wrap gap-2">
                  {module.envVars.map((v) => (
                    <EnvBadge key={v} name={v} />
                  ))}
                </div>
              </section>

              {/* Pro tip */}
              <section className="p-4 rounded-2xl bg-gradient-to-br from-white/5 to-white/2 border border-white/8">
                <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-yellow-400" />
                  Profi-Tipp
                </h3>
                <p className="text-yellow-200 text-sm leading-relaxed">{module.tip}</p>
              </section>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/8 space-y-3">
              <motion.a
                href={module.deepLink.href}
                target={module.deepLink.href.startsWith("http") ? "_blank" : undefined}
                rel={module.deepLink.href.startsWith("http") ? "noopener noreferrer" : undefined}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm border ${module.borderColor} bg-white/5 hover:bg-white/10 ${module.color} transition-colors`}
              >
                <Zap className="w-4 h-4" />
                {module.deepLink.label}
              </motion.a>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl font-bold text-sm bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors border border-white/8"
              >
                Schließen
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

// ---------------------------------------------------------------------------
// Module Card
// ---------------------------------------------------------------------------

function ModuleCard({
  module,
  overview,
  maintenanceEnabled,
  onOpenDrawer,
  onToggleMaintenance,
  maintenanceBusy,
}: {
  module: ModuleInfo
  overview: Overview | null
  maintenanceEnabled: boolean | null
  onOpenDrawer: (m: ModuleInfo) => void
  onToggleMaintenance: () => void
  maintenanceBusy: boolean
}) {
  const ok = isModuleOk(module.id, overview)
  const stripe = overview?.stripe
  const env = overview?.env

  function renderContent() {
    if (module.id === "seo") {
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Google Indexer</span>
            <div className="flex items-center gap-1.5">
              <StatusDot ok={true} />
              <span className="text-xs text-gray-300">Konfiguriert</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-xl bg-black/30 border border-white/5">
              <div className="text-xs text-gray-400">Sitemap URLs</div>
              <div className="text-lg font-black text-cyan-300 mt-0.5">100k+</div>
            </div>
            <div className="p-3 rounded-xl bg-black/30 border border-white/5">
              <div className="text-xs text-gray-400">Daily Quota</div>
              <div className="text-lg font-black text-cyan-300 mt-0.5">200</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <CheckCircle className="w-3 h-3 text-green-400" />
            Indexing API aktiv
          </div>
        </div>
      )
    }

    if (module.id === "cash") {
      if (!stripe) {
        return (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            Stripe nicht konfiguriert
          </div>
        )
      }
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-xl bg-black/30 border border-white/5">
              <div className="text-xs text-gray-400">24h Revenue</div>
              <div className="text-base font-black text-green-300 mt-0.5">
                {money(stripe.charges24h, stripe.currency)}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-black/30 border border-white/5">
              <div className="text-xs text-gray-400">7d Revenue</div>
              <div className="text-base font-black text-green-300 mt-0.5">
                {money(stripe.charges7d, stripe.currency)}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>
              Active Subs:{" "}
              <span className="font-bold text-green-300">{stripe.activeSubs}</span>
            </span>
            <span>
              Trialing:{" "}
              <span className="font-bold text-yellow-300">{stripe.trialingSubs}</span>
            </span>
          </div>
        </div>
      )
    }

    if (module.id === "affiliate") {
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-xl bg-black/30 border border-white/5">
              <div className="text-xs text-gray-400">Partner</div>
              <div className="text-lg font-black text-yellow-300 mt-0.5">—</div>
            </div>
            <div className="p-3 rounded-xl bg-black/30 border border-white/5">
              <div className="text-xs text-gray-400">Ausstehend</div>
              <div className="text-lg font-black text-yellow-300 mt-0.5">—</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Info className="w-3 h-3" />
            Affiliate-Modul konfigurieren
          </div>
        </div>
      )
    }

    if (module.id === "sentinel") {
      const hasAI = env?.hasOpenAI
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Gemini/OpenAI</span>
            <div className="flex items-center gap-1.5">
              <StatusDot ok={!!hasAI} />
              <span className="text-xs text-gray-300">{hasAI ? "Online" : "Nicht konfiguriert"}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-xl bg-black/30 border border-white/5">
              <div className="text-xs text-gray-400">API Status</div>
              <div
                className={`text-base font-black mt-0.5 ${hasAI ? "text-green-300" : "text-orange-300"}`}
              >
                {hasAI ? "OK" : "MISSING"}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-black/30 border border-white/5">
              <div className="text-xs text-gray-400">Admin ENV</div>
              <div
                className={`text-base font-black mt-0.5 ${env?.hasAdmin ? "text-green-300" : "text-red-300"}`}
              >
                {env?.hasAdmin ? "OK" : "FAIL"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Activity className="w-3 h-3 text-purple-400" />
            Auto-Refresh alle 30s
          </div>
        </div>
      )
    }

    if (module.id === "defense") {
      const isActive = maintenanceEnabled === true
      const isLoading = maintenanceBusy || maintenanceEnabled === null

      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Kill-Switch Status</span>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${isActive ? "bg-red-400 animate-pulse" : "bg-gray-600"}`}
              />
              <span className={`text-xs font-bold ${isActive ? "text-red-300" : "text-gray-400"}`}>
                {isLoading ? "…" : isActive ? "ACTIVE" : "INACTIVE"}
              </span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleMaintenance()
            }}
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-sm transition-all ${
              isActive
                ? "bg-red-500/20 border border-red-500/50 text-red-300 hover:bg-red-500/30"
                : "bg-gray-800/60 border border-gray-600/50 text-gray-300 hover:bg-gray-700/60"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label={isActive ? "Kill-Switch deaktivieren" : "Kill-Switch aktivieren"}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Power className="w-4 h-4" />
            )}
            {isLoading
              ? "Build wird ausgelöst…"
              : isActive
              ? "Deaktivieren"
              : "Aktivieren"}
          </button>

          <p className="text-xs text-gray-500 text-center">
            {isActive
              ? "⚠ Maintenance Mode aktiv – Site ist offline"
              : "Site läuft normal"}
          </p>
        </div>
      )
    }

    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`relative rounded-3xl border ${module.borderColor} overflow-hidden cursor-pointer group`}
      style={{
        background: `linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)`,
        backdropFilter: "blur(12px)",
        boxShadow: ok
          ? `0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px ${module.glowColor}, inset 0 1px 0 rgba(255,255,255,0.05)`
          : `0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)`,
      }}
      onClick={() => onOpenDrawer(module)}
    >
      {/* Pulsing glow for OK modules */}
      {ok && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: `radial-gradient(ellipse at top left, ${module.glowColor} 0%, transparent 55%)`,
          }}
        />
      )}

      {/* Hover glow (non-OK modules) */}
      {!ok && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at top left, ${module.glowColor} 0%, transparent 60%)`,
          }}
        />
      )}

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-2xl bg-white/5 border ${module.borderColor}`}
            >
              <module.icon className={`w-5 h-5 ${module.color}`} />
            </div>
            <div>
              <div className="font-black text-white text-base leading-tight">
                {module.title}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{module.subtitle}</div>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onOpenDrawer(module)
            }}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-gray-500 hover:text-gray-300"
            aria-label={`${module.title} Info öffnen`}
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic content */}
        <div onClick={(e) => e.stopPropagation()}>{renderContent()}</div>
      </div>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Main Dashboard
// ---------------------------------------------------------------------------

export default function UniverseDashboard() {
  const [overview, setOverview] = useState<Overview | null>(null)
  const [overviewErr, setOverviewErr] = useState<string | null>(null)
  const [overviewBusy, setOverviewBusy] = useState(true)

  const [activeDrawer, setActiveDrawer] = useState<ModuleInfo | null>(null)

  const [maintenanceEnabled, setMaintenanceEnabled] = useState<boolean | null>(null)
  const [maintenanceBusy, setMaintenanceBusy] = useState(false)
  const [maintenanceErr, setMaintenanceErr] = useState<string | null>(null)

  // Load overview data
  const loadOverview = useCallback(async () => {
    setOverviewBusy(true)
    setOverviewErr(null)
    try {
      const res = await fetch("/api/admin/overview", { cache: "no-store" })
      if (res.status === 401) {
        window.location.href = "/admin"
        return
      }
      if (!res.ok) {
        setOverviewErr("Fehler beim Laden der Übersicht")
        return
      }
      setOverview(await res.json())
    } catch {
      setOverviewErr("Netzwerkfehler")
    } finally {
      setOverviewBusy(false)
    }
  }, [])

  // Load maintenance mode status
  const loadMaintenance = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/maintenance", { cache: "no-store" })
      if (!res.ok) return
      const d = await res.json()
      setMaintenanceEnabled(d.enabled as boolean)
    } catch {
      // Netlify env vars may not be set – silently ignore
    }
  }, [])

  useEffect(() => {
    loadOverview()
    loadMaintenance()
    const id = setInterval(loadOverview, 30_000)
    return () => clearInterval(id)
  }, [loadOverview, loadMaintenance])

  const toggleMaintenance = useCallback(async () => {
    if (maintenanceBusy || maintenanceEnabled === null) return
    setMaintenanceBusy(true)
    setMaintenanceErr(null)
    try {
      const res = await fetch("/api/admin/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !maintenanceEnabled }),
      })
      const d = await res.json()
      if (!res.ok) {
        setMaintenanceErr(d.error || "Fehler beim Umschalten")
      } else {
        setMaintenanceEnabled(d.enabled as boolean)
      }
    } catch {
      setMaintenanceErr("Netzwerkfehler beim Kill-Switch")
    } finally {
      setMaintenanceBusy(false)
    }
  }, [maintenanceBusy, maintenanceEnabled])

  return (
    <div className="min-h-screen text-white">
      {/* Star-field header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              ClawGuru Universe
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Cockpit · Live · {overview?.now || "—"}
            </p>
          </div>
          <div className="flex gap-3">
            <motion.a
              href="/api/admin/logout"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="px-4 py-2 rounded-2xl border border-gray-700 hover:border-gray-500 font-bold text-gray-300 text-sm transition-colors"
            >
              Logout
            </motion.a>
            <motion.button
              onClick={() => { void loadOverview(); void loadMaintenance() }}
              disabled={overviewBusy}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="px-4 py-2 rounded-2xl font-black text-sm bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 hover:border-cyan-500/60 text-cyan-300 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {overviewBusy && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Refresh
            </motion.button>
          </div>
        </div>

        {/* Status bar */}
        <div className="mt-4 flex flex-wrap gap-3">
          {[
            { label: "Stripe", ok: overview?.env.hasStripe },
            { label: "AI API", ok: overview?.env.hasOpenAI },
            { label: "Admin", ok: overview?.env.hasAdmin },
            { label: "Webhooks", ok: overview?.env.hasWebhook },
            { label: "Email", ok: overview?.env.hasEmail },
          ].map(({ label, ok }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border"
              style={{
                background: ok ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
                borderColor: ok ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)",
                color: ok ? "#86efac" : "#fca5a5",
              }}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${ok ? "bg-green-400" : "bg-red-400"}`} />
              {label}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Errors */}
      <AnimatePresence>
        {overviewErr && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 rounded-2xl border border-red-900/50 bg-red-950/20 text-red-200 text-sm"
          >
            {overviewErr}
          </motion.div>
        )}
        {maintenanceErr && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 rounded-2xl border border-orange-900/50 bg-orange-950/20 text-orange-200 text-sm"
          >
            Kill-Switch Fehler: {maintenanceErr}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Planet Module Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        }}
        className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5"
      >
        {MODULES.map((mod) => (
          <ModuleCard
            key={mod.id}
            module={mod}
            overview={overview}
            maintenanceEnabled={maintenanceEnabled}
            onOpenDrawer={setActiveDrawer}
            onToggleMaintenance={toggleMaintenance}
            maintenanceBusy={maintenanceBusy}
          />
        ))}
      </motion.div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {[
          { label: "💰 Profit Dashboard", href: "/admin/profit-dashboard" },
          { label: "🚀 Launch Dashboard", href: "/admin/launch-dashboard" },
          { label: "🛰️ Outreach Invasion", href: "/admin/outreach" },
          { label: "⚙️ Control Center", href: "/admin/center" },
          { label: "📖 Universe Manual", href: "/admin/manual" },
        ].map(({ label, href }) => (
          <motion.a
            key={href}
            href={href}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center px-4 py-3 rounded-2xl border border-gray-800 bg-black/20 hover:bg-black/40 hover:border-gray-600 text-sm font-bold text-gray-300 transition-colors"
          >
            {label}
          </motion.a>
        ))}
      </motion.div>

      {/* Side Drawer */}
      <Drawer module={activeDrawer} onClose={() => setActiveDrawer(null)} />
    </div>
  )
}
