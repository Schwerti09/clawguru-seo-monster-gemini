"use client"

// components/admin/UniverseManual.tsx
// The 'Universal-Manual' – Bento-Grid overview of every ClawGuru technical module.
// Target audience: new developer or partner – must understand the 100k-page machine in 2 minutes.

import { motion } from "framer-motion"
import {
  Globe,
  Zap,
  CreditCard,
  GitBranch,
  Languages,
  Shield,
  Link2,
  Cpu,
  BarChart3,
  Settings,
  BookOpen,
  ArrowLeft,
} from "lucide-react"

// ---------------------------------------------------------------------------
// Module definitions
// ---------------------------------------------------------------------------

type ManualModule = {
  id: string
  icon: React.ElementType
  title: string
  badge: string
  color: string
  borderColor: string
  glowColor: string
  description: string
  envVars: string[]
  link?: string
  /** Bento grid span – "wide" takes 2 columns on large screens */
  span?: "wide" | "normal"
}

const MANUAL_MODULES: ManualModule[] = [
  {
    id: "indexing-api",
    icon: Globe,
    title: "Google Indexing API",
    badge: "SEO Engine",
    color: "text-cyan-400",
    borderColor: "border-cyan-500/30",
    glowColor: "rgba(34,211,238,0.12)",
    span: "wide",
    description:
      "Every morning a cron-job submits up to 200 fresh URLs directly to Google's Indexing API — bypassing the regular crawl queue and pushing new pages into the index within hours. The daily quota (200 requests) is divided across high-value targets first: /check, /runbooks, and /solutions pages. Without this, a 100k-page site would take weeks to get fully indexed.",
    envVars: ["GOOGLE_INDEXER_KEY"],
    link: "/api/admin/overview",
  },
  {
    id: "stripe-webhooks",
    icon: CreditCard,
    title: "Stripe Webhooks",
    badge: "Revenue",
    color: "text-green-400",
    borderColor: "border-green-500/30",
    glowColor: "rgba(34,197,94,0.12)",
    description:
      "Stripe fires webhooks on every payment, subscription update, and trial conversion. Our endpoint at /api/webhooks/stripe validates each event with HMAC-SHA256, then updates the user's access tier in real-time. This is the single source of truth for who has paid access — no polling, no delays.",
    envVars: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"],
    link: "https://dashboard.stripe.com/webhooks",
  },
  {
    id: "gemini-runbooks",
    icon: Cpu,
    title: "Gemini Runbooks",
    badge: "AI Engine",
    color: "text-purple-400",
    borderColor: "border-purple-500/30",
    glowColor: "rgba(168,85,247,0.12)",
    description:
      "ClawGuru uses Gemini (with OpenAI as fallback) to auto-generate actionable security runbooks for every CVE and CWE. Each runbook is pre-rendered at build time via programmatic SEO, resulting in ~100k unique, high-quality pages that rank for long-tail security queries and drive organic traffic around the clock.",
    envVars: ["GEMINI_API_KEY", "OPENAI_API_KEY"],
    link: "/runbooks",
  },
  {
    id: "i18n-logic",
    icon: Languages,
    title: "i18n Logic",
    badge: "Localisation",
    color: "text-yellow-400",
    borderColor: "border-yellow-500/30",
    glowColor: "rgba(250,204,21,0.12)",
    description:
      "All user-facing text lives in /dictionaries/{locale}.json. The middleware.ts detects the browser locale, rewrites the URL to /[lang]/..., and passes the correct dictionary to every server component via getDictionary(). Adding a new language is a single JSON file — no code changes needed.",
    envVars: [],
    link: "/dictionaries",
  },
  {
    id: "pseo-engine",
    icon: GitBranch,
    title: "Programmatic SEO",
    badge: "100k Pages",
    color: "text-orange-400",
    borderColor: "border-orange-500/30",
    glowColor: "rgba(251,146,60,0.12)",
    span: "wide",
    description:
      "The PSEO engine in lib/pseo.ts generates metadata, Open Graph tags, and structured data for every dynamic route at build time using generateStaticParams(). It reads CVE/CWE data from lib/cve-pseo.ts and composes unique titles, descriptions, and canonical URLs for all ~100k pages. This is why ClawGuru ranks for thousands of security keywords without manual content writing.",
    envVars: [],
    link: "/sitemaps/main.xml",
  },
  {
    id: "sentinel-health",
    icon: Shield,
    title: "Sentinel Health Check",
    badge: "Monitoring",
    color: "text-red-400",
    borderColor: "border-red-500/30",
    glowColor: "rgba(239,68,68,0.12)",
    description:
      "lib/sentinel.ts pings all critical external APIs (Gemini, Stripe, Newsletter) every 30 seconds from the admin dashboard. Failed checks flip the module status to DEGRADED, triggering a visual alert in the Universe Explorer. The self-healing cron in lib/selfhealth.ts automatically retries and logs recovery events.",
    envVars: ["GEMINI_API_KEY", "STRIPE_SECRET_KEY"],
    link: "/api/admin/sentinel-check",
  },
  {
    id: "affiliate-network",
    icon: Link2,
    title: "Affiliate Network",
    badge: "Growth",
    color: "text-pink-400",
    borderColor: "border-pink-500/30",
    glowColor: "rgba(236,72,153,0.12)",
    description:
      "Referral links are tracked via a short-lived JWT in the URL. When a visitor converts, the Stripe webhook resolves the affiliate ID and schedules a payout. The affiliate dashboard at /admin/profit-dashboard shows real-time conversion rates and pending commissions. It's the viral growth engine that turns partners into a distributed sales team.",
    envVars: ["AFFILIATE_SECRET", "NEXT_PUBLIC_AFFILIATE_PROGRAM_URL"],
    link: "/admin/profit-dashboard",
  },
  {
    id: "analytics",
    icon: BarChart3,
    title: "Analytics Pipeline",
    badge: "Insights",
    color: "text-blue-400",
    borderColor: "border-blue-500/30",
    glowColor: "rgba(59,130,246,0.12)",
    description:
      "lib/analytics.ts fires lightweight server-side events for every page view, badge share, and CTA click — no client-side JS overhead. Events are batched and forwarded to the configured analytics endpoint. The result is zero impact on Core Web Vitals while still capturing the full conversion funnel.",
    envVars: ["ANALYTICS_ENDPOINT"],
    link: "/api/live-wall",
  },
  {
    id: "netlify-ops",
    icon: Settings,
    title: "Netlify Operations",
    badge: "Infrastructure",
    color: "text-teal-400",
    borderColor: "border-teal-500/30",
    glowColor: "rgba(20,184,166,0.12)",
    description:
      "lib/netlify-api.ts wraps the Netlify REST API to toggle environment variables (e.g. MAINTENANCE_MODE) and trigger new deploys — all from within the admin UI. The NETLIFY_ACCOUNT_ID ('rolf-schwertfechter') scopes every request to the correct team. No SSH, no CLI — one-click kill-switch from the browser.",
    envVars: ["NETLIFY_API_KEY", "NETLIFY_SITE_ID", "NETLIFY_ACCOUNT_ID"],
    link: "https://app.netlify.com",
  },
  {
    id: "security-layer",
    icon: Zap,
    title: "Security Layer",
    badge: "Zero-Trust",
    color: "text-violet-400",
    borderColor: "border-violet-500/30",
    glowColor: "rgba(139,92,246,0.12)",
    description:
      "Every admin route is protected by an HMAC-signed HttpOnly cookie (lib/admin-auth.ts). Public API endpoints are rate-limited (lib/rate-limit.ts) and validate payloads against strict JSON schemas (lib/payload-validator.ts). The security/headers.ts middleware injects CSP, HSTS, and X-Frame-Options on every response.",
    envVars: ["ADMIN_USERNAME", "ADMIN_PASSWORD", "ADMIN_SESSION_SECRET"],
    link: "/api/health",
  },
]

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function EnvBadge({ name }: { name: string }) {
  return (
    <code className="inline-block px-2 py-0.5 rounded text-xs bg-white/5 border border-white/10 text-gray-300 font-mono">
      {name}
    </code>
  )
}

function ModuleCard({ mod, index }: { mod: ManualModule; index: number }) {
  const Icon = mod.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, type: "spring", stiffness: 280, damping: 28 }}
      className={`relative rounded-3xl border ${mod.borderColor} overflow-hidden group ${
        mod.span === "wide" ? "sm:col-span-2" : ""
      }`}
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at top left, ${mod.glowColor} 0%, transparent 60%)`,
        }}
      />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl bg-white/5 border ${mod.borderColor} shrink-0`}>
              <Icon className={`w-5 h-5 ${mod.color}`} />
            </div>
            <div>
              <div className="font-black text-white text-base leading-tight">{mod.title}</div>
              <div className={`text-xs font-bold mt-0.5 ${mod.color}`}>{mod.badge}</div>
            </div>
          </div>
          {mod.link && (
            <motion.a
              href={mod.link}
              target={mod.link.startsWith("http") ? "_blank" : undefined}
              rel={mod.link.startsWith("http") ? "noopener noreferrer" : undefined}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold border ${mod.borderColor} ${mod.color} bg-white/5 hover:bg-white/10 transition-colors`}
            >
              Open →
            </motion.a>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-300 leading-relaxed mb-4">{mod.description}</p>

        {/* Env vars */}
        {mod.envVars.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {mod.envVars.map((v) => (
              <EnvBadge key={v} name={v} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function UniverseManual() {
  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <motion.a
          href="/admin/dashboard"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Universe Explorer
        </motion.a>

        <div className="flex items-start gap-4">
          <div
            className="p-3 rounded-2xl border border-white/10 bg-white/5"
            aria-hidden
          >
            <BookOpen className="w-7 h-7 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Universe Manual
            </h1>
            <p className="text-gray-400 text-sm mt-1 max-w-xl">
              Das Handbuch des ClawGuru-Universums. Nach 2 Minuten Lesen verstehst du, wie
              die 100k-Seiten-Maschine funktioniert.
            </p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="mt-6 flex flex-wrap gap-3">
          {[
            { label: "Module", value: String(MANUAL_MODULES.length) },
            { label: "Seiten (pSEO)", value: "100k+" },
            { label: "Crons / Tag", value: "2" },
            { label: "Zero-CLS", value: "✓" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-white/10 bg-white/5 text-sm"
            >
              <span className="font-black text-white">{value}</span>
              <span className="text-gray-400">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bento Grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {MANUAL_MODULES.map((mod, i) => (
          <ModuleCard key={mod.id} mod={mod} index={i} />
        ))}
      </div>

      {/* Footer note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-10 text-center text-xs text-gray-600"
      >
        ClawGuru Universe Manual · Cyberpunk-Minimalismus · Schwarz × Deep-Purple × Cyan
      </motion.p>
    </div>
  )
}
