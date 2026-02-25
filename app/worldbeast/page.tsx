// WORLD BEAST: app/worldbeast/page.tsx
// Worldbeast Status Page – public-facing "we are live" page for 2026/27.
// Shows all WORLD BEAST features in one place. Ready to go live tomorrow.

import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import { RUNBOOKS } from "@/lib/pseo"
import { SUPPORTED_LOCALES } from "@/lib/i18n"

export const metadata = {
  title: "ClawGuru Worldbeast Status 2026 | Nr. 1 Ops Intelligence Platform",
  description:
    "ClawGuru Worldbeast 2026: Multi-Language, AI Agent Swarm, Viral Engine, Monetization Rocket. Live. Skalierbar. Unaufhaltbar.",
  alternates: { canonical: "/worldbeast" },
}

// WORLD BEAST: revalidate every 10 minutes
export const revalidate = 600

const FEATURES = [
  {
    icon: "🌍",
    title: "Multi-Language System",
    status: "live",
    desc: `Vollautomatische Übersetzung aller Runbooks via Gemini. Sprachen: ${SUPPORTED_LOCALES.map((l) => l.toUpperCase()).join(", ")}. URL-Struktur: /en/runbook/..., /es/runbook/..., /fr/runbook/...`,
    links: [
      { label: "EN Runbooks", href: "/en/runbook/kubernetes-pod-crashloopbackoff-fix-2025" },
      { label: "ES Runbooks", href: "/es/runbook/kubernetes-pod-crashloopbackoff-fix-2025" },
      { label: "FR Runbooks", href: "/fr/runbook/kubernetes-pod-crashloopbackoff-fix-2025" },
    ],
  },
  {
    icon: "🤖",
    title: "AI Agent Swarm",
    status: "live",
    desc: "3 spezialisierte Agenten laufen täglich: Vulnerability Hunter (CVEs), Viral Content Agent (Twitter/LinkedIn/Reddit), Growth Agent (Keywords + Landingpages).",
    links: [
      { label: "Agent API", href: "/api/agents" },
    ],
  },
  {
    icon: "💰",
    title: "Monetization Rocket",
    status: "live",
    desc: "Yearly Plans, Enterprise (499€/mo), White-Label (999€/mo), Affiliate Dashboard mit 20% Provision. Automatische Upsell-Popups nach 3 Checks.",
    links: [
      { label: "Pricing", href: "/pricing" },
      { label: "Affiliate Dashboard", href: "/dashboard" },
    ],
  },
  {
    icon: "🚀",
    title: "Viral & Community Engine",
    status: "live",
    desc: "One-Click Share mit fertigen Threads + ClawGuru Watermark. Discord Auto-Post in #hotfixes. Anonymes Public Leaderboard: Top 100 Ops Heroes.",
    links: [
      { label: "Share Runbook", href: "/share/kubernetes-pod-crashloopbackoff-fix-2025" },
      { label: "Leaderboard", href: "/leaderboard" },
    ],
  },
  {
    icon: "📊",
    title: "Dashboard 2.0",
    status: "live",
    desc: "Live Worldbeast Score (Health + Revenue + Content). Global Rank. One-Click World Domination Button. Agent-Status. Multi-Language Status.",
    links: [
      { label: "Worldbeast Dashboard", href: "/dashboard/worldbeast" },
    ],
  },
  {
    icon: "🔍",
    title: "SEO & Indexing Turbo",
    status: "live",
    desc: `${RUNBOOKS.length.toLocaleString("de-DE")}+ programmatische Seiten. Auto-Submit an Google + Bing nach jedem Heal-Zyklus via IndexNow. Internationale Keywords in 4 Sprachen.`,
    links: [
      { label: "Sitemaps", href: "/sitemap.xml" },
      { label: "Runbooks", href: "/runbooks" },
    ],
  },
]

function FeatureCard({
  icon,
  title,
  status,
  desc,
  links,
}: {
  icon: string
  title: string
  status: string
  desc: string
  links: { label: string; href: string }[]
}) {
  return (
    <div className="p-6 rounded-3xl border border-gray-800 bg-black/30 hover:border-cyan-500/30 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{icon}</span>
        <span className="font-black">{title}</span>
        <span className="ml-auto text-xs px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400">
          ✅ {status}
        </span>
      </div>
      <p className="text-sm text-gray-400 leading-relaxed mb-4">{desc}</p>
      <div className="flex flex-wrap gap-2">
        {links.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="px-3 py-1.5 rounded-xl border border-gray-700 text-xs text-cyan-300 hover:border-cyan-500 transition-colors"
          >
            {label} →
          </a>
        ))}
      </div>
    </div>
  )
}

export default function WorldbeastStatusPage() {
  const totalRunbooks = RUNBOOKS.length
  const totalPages = totalRunbooks * SUPPORTED_LOCALES.length

  return (
    <Container>
      <div className="py-16 max-w-5xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-xs text-cyan-400 font-black mb-6 animate-pulse">
            🌍 WORLDBEAST 2026 – ALLE SYSTEME AKTIV
          </div>
          <SectionTitle
            kicker="ClawGuru Worldbeast"
            title="Nr. 1 Ops Intelligence Platform"
            subtitle="Multi-Language · AI Agents · Viral Engine · Auto-Monetization · Live."
          />
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="/dashboard/worldbeast"
              className="px-8 py-3 rounded-2xl font-black bg-gradient-to-r from-brand-cyan to-brand-violet hover:opacity-90"
            >
              🚀 Worldbeast Dashboard öffnen →
            </a>
            <a
              href="/check"
              className="px-8 py-3 rounded-2xl border border-gray-700 hover:border-gray-500 font-bold text-gray-200"
            >
              Security Check starten
            </a>
          </div>
        </div>

        {/* Live metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Runbooks", value: totalRunbooks.toLocaleString("de-DE"), icon: "📚" },
            { label: "SEO Seiten", value: totalPages.toLocaleString("de-DE") + "+", icon: "🔍" },
            { label: "Sprachen", value: SUPPORTED_LOCALES.length, icon: "🌍" },
            { label: "AI Agenten", value: 3, icon: "🤖" },
          ].map(({ label, value, icon }) => (
            <div
              key={label}
              className="p-5 rounded-3xl border border-gray-800 bg-black/30 text-center"
            >
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-2xl font-black text-cyan-400">{value}</div>
              <div className="text-xs text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Feature grid */}
        <h2 className="text-xl font-black mb-6 text-gray-100">✅ Alle Worldbeast Features – Live</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>

        {/* Quick navigation */}
        <div className="p-6 rounded-3xl border border-gray-800 bg-black/20">
          <div className="text-sm font-black text-gray-200 mb-4">🗺️ Worldbeast Quick Navigation</div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            {[
              ["/dashboard/worldbeast", "📊 Worldbeast Dashboard"],
              ["/leaderboard", "🏆 Leaderboard"],
              ["/runbooks", "📚 Runbooks (DE)"],
              ["/en/runbook/kubernetes-pod-crashloopbackoff-fix-2025", "🇬🇧 EN Runbook"],
              ["/share/kubernetes-pod-crashloopbackoff-fix-2025", "📣 Share Template"],
              ["/pricing", "💰 Pricing"],
              ["/check", "🔐 Security Check"],
              ["/copilot", "🤖 AI Copilot"],
              ["/intel", "📡 Intel Feed"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href as string}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-800 hover:border-gray-600 text-gray-300 hover:text-cyan-400 transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-600">
          ClawGuru Worldbeast 2026 · Built with Next.js 14 · Gemini AI · Auto-Healing · Full Passive Mode
        </div>
      </div>
    </Container>
  )
}
