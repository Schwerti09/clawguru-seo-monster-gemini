import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { CheckCircle, Clock, Target, TrendingUp, ArrowRight, Calendar, Zap } from "lucide-react"
import Link from "next/link"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/roadmap"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "Roadmap — Journey to Worldwide #1 | ClawGuru"
    : "Roadmap — Journey to Worldwide #1 | ClawGuru"
  const description = isDE
    ? "Verfolge unseren Aufstieg von Start bis Worldwide #1. Timeline, Meilensteine und Fortschritt."
    : "Track our journey from start to worldwide #1. Timeline, milestones and progress."
  return {
    title,
    description,
    keywords: ["roadmap", "journey", "timeline", "progress", "worldwide #1"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const getPhases = (isDE: boolean) => [
  {
    number: 1,
    title: isDE ? "Foundation" : "Foundation",
    description: isDE
      ? "Infrastruktur, Core Features, Security-Check, Runbooks"
      : "Infrastructure, Core Features, Security Check, Runbooks",
    status: "completed",
    date: "Q1 2026",
    icon: CheckCircle,
    items: [
      isDE ? "Security Check Tool" : "Security Check Tool",
      isDE ? "AI-Generated Runbooks" : "AI-Generated Runbooks",
      isDE ? "OpenClaw Framework" : "OpenClaw Framework",
      isDE ? "Moltbot Integration" : "Moltbot Integration",
    ],
  },
  {
    number: 2,
    title: isDE ? "Content Empire" : "Content Empire",
    description: isDE
      ? "250+ High-Quality Pages, Geo-Matrix, Multi-Language"
      : "250+ High-Quality Pages, Geo-Matrix, Multi-Language",
    status: "completed",
    date: "Q2 2026",
    icon: CheckCircle,
    items: [
      isDE ? "Moltbot Security Pages" : "Moltbot Security Pages",
      isDE ? "OpenClaw Hardening Guides" : "OpenClaw Hardening Guides",
      isDE ? "16 Languages × 500+ Cities" : "16 Languages × 500+ Cities",
      isDE ? "SEO-Optimized Content" : "SEO-Optimized Content",
    ],
  },
  {
    number: 3,
    title: isDE ? "Ecosystem" : "Ecosystem",
    description: isDE
      ? "Partners, Integrations, Community, Events"
      : "Partners, Integrations, Community, Events",
    status: "completed",
    date: "Q3 2026",
    icon: CheckCircle,
    items: [
      isDE ? "Integration Marketplace" : "Integration Marketplace",
      isDE ? "Partner Program" : "Partner Program",
      isDE ? "Community Forum/Discord" : "Community Forum/Discord",
      isDE ? "IRL/Virtual Events" : "IRL/Virtual Events",
    ],
  },
  {
    number: 4,
    title: isDE ? "Monetization" : "Monetization",
    description: isDE
      ? "Consulting, Academy, Data Sales, Charity"
      : "Consulting, Academy, Data Sales, Charity",
    status: "completed",
    date: "Q4 2026",
    icon: CheckCircle,
    items: [
      isDE ? "Professional Services" : "Professional Services",
      isDE ? "Certification Program" : "Certification Program",
      isDE ? "Anonymized Data Sales" : "Anonymized Data Sales",
      isDE ? "Charity Program" : "Charity Program",
    ],
  },
  {
    number: 5,
    title: isDE ? "Expansion" : "Expansion",
    description: isDE
      ? "Ambassador Program, Open Source, Global Reach"
      : "Ambassador Program, Open Source, Global Reach",
    status: "completed",
    date: "Q1 2027",
    icon: CheckCircle,
    items: [
      isDE ? "Ambassador Program" : "Ambassador Program",
      isDE ? "Open Source Security Audits" : "Open Source Security Audits",
      isDE ? "Influencer Partnerships" : "Influencer Partnerships",
      isDE ? "Global Marketing" : "Global Marketing",
    ],
  },
  {
    number: 6,
    title: isDE ? "Scale" : "Scale",
    description: isDE
      ? "Enterprise Features, Multi-Tenancy, API Platform"
      : "Enterprise Features, Multi-Tenancy, API Platform",
    status: "in-progress",
    date: "Q2 2027",
    icon: Clock,
    items: [
      isDE ? "Enterprise Dashboard" : "Enterprise Dashboard",
      isDE ? "Multi-Tenancy" : "Multi-Tenancy",
      isDE ? "API Platform v2" : "API Platform v2",
      isDE ? "SLA & Support" : "SLA & Support",
    ],
  },
  {
    number: 7,
    title: isDE ? "Domination" : "Domination",
    description: isDE
      ? "Market Leader, Industry Standard, Worldwide #1"
      : "Market Leader, Industry Standard, Worldwide #1",
    status: "future",
    date: "2028+",
    icon: Target,
    items: [
      isDE ? "Market Leadership" : "Market Leadership",
      isDE ? "Industry Standard" : "Industry Standard",
      isDE ? "Worldwide #1" : "Worldwide #1",
      isDE ? "Legacy" : "Legacy",
    ],
  },
]

const getStats = (isDE: boolean) => [
  {
    icon: Zap,
    value: "97",
    label: isDE ? "Phasen" : "Phases",
    description: isDE ? "Abgeschlossen" : "Completed",
  },
  {
    icon: CheckCircle,
    value: "250+",
    label: isDE ? "Pages" : "Pages",
    description: isDE ? "Erstellt" : "Created",
  },
  {
    icon: TrendingUp,
    value: "16",
    label: isDE ? "Sprachen" : "Languages",
    description: isDE ? "Unterstützt" : "Supported",
  },
  {
    icon: Calendar,
    value: "2026",
    label: isDE ? "Start" : "Start",
    description: isDE ? "Projektbeginn" : "Project Start",
  },
]

export default function RoadmapPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const phases = getPhases(isDE)
  const stats = getStats(isDE)
  const completedPhases = phases.filter(p => p.status === "completed").length
  const totalPhases = phases.length
  const progress = Math.round((completedPhases / totalPhases) * 100)

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {isDE ? "Roadmap — Journey to Worldwide #1" : "Roadmap — Journey to Worldwide #1"}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {isDE
              ? "Verfolge unseren Aufstieg von Start bis Worldwide #1. Timeline, Meilensteine und Fortschritt."
              : "Track our journey from start to worldwide #1. Timeline, milestones and progress."}
          </p>
          <p className="text-sm text-cyan-400 font-medium">
            {isDE ? `→ ${completedPhases} von ${totalPhases} Phasen abgeschlossen (${progress}%)` : `→ ${completedPhases} of ${totalPhases} phases completed (${progress}%)`}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-800 rounded-full h-4 mb-10 overflow-hidden">
          <div
            className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Stats */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Statistiken" : "Statistics"}</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="bg-gray-800 p-6 rounded-lg border border-gray-700 text-center">
                  <div className="bg-cyan-900 p-3 rounded-lg mx-auto mb-4 w-fit">
                    <Icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="text-3xl font-bold text-cyan-400 mb-2">{stat.value}</div>
                  <div className="font-semibold text-gray-100 mb-1">{stat.label}</div>
                  <div className="text-sm text-gray-400">{stat.description}</div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Timeline" : "Timeline"}</h2>
          <div className="space-y-6">
            {phases.map((phase, index) => {
              const Icon = phase.icon
              const statusColor =
                phase.status === "completed" ? "bg-green-900 border-green-500" :
                phase.status === "in-progress" ? "bg-yellow-900 border-yellow-500" :
                "bg-gray-900 border-gray-700"
              const statusTextColor =
                phase.status === "completed" ? "text-green-400" :
                phase.status === "in-progress" ? "text-yellow-400" :
                "text-gray-400"
              const statusBadge =
                phase.status === "completed" ? isDE ? "Abgeschlossen" : "Completed" :
                phase.status === "in-progress" ? isDE ? "In Arbeit" : "In Progress" :
                isDE ? "Zukunft" : "Future"

              return (
                <div
                  key={index}
                  className={`bg-gray-800 p-6 rounded-lg border ${statusColor}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${phase.status === "completed" ? "bg-green-900" : phase.status === "in-progress" ? "bg-yellow-900" : "bg-gray-900"}`}>
                      <Icon className={`w-6 h-6 ${statusTextColor}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-gray-900 px-2 py-1 rounded">
                          <span className="text-xs text-gray-400">Phase {phase.number}</span>
                        </div>
                        <div className={`bg-gray-900 px-2 py-1 rounded`}>
                          <span className={`text-xs ${statusTextColor}`}>{statusBadge}</span>
                        </div>
                        <div className="bg-gray-900 px-2 py-1 rounded">
                          <span className="text-xs text-gray-400">{phase.date}</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-100 text-xl mb-2">{phase.title}</h3>
                      <p className="text-sm text-gray-300 mb-4">{phase.description}</p>
                      <ul className="space-y-2">
                        {phase.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-2 text-sm text-gray-300">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Next Milestone */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-cyan-900/40 to-purple-900/40 border border-cyan-700/50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-cyan-300 mb-2">
              {isDE ? "Nächster Meilenstein" : "Next Milestone"}
            </h3>
            <p className="text-sm text-cyan-200/70 mb-4">
              {isDE
                ? "Phase 6: Scale — Enterprise Features, Multi-Tenancy, API Platform"
                : "Phase 6: Scale — Enterprise Features, Multi-Tenancy, API Platform"}
            </p>
            <Link
              href={`/${locale}/community`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-semibold text-white transition-colors"
            >
              {isDE ? "Community beitreten" : "Join Community"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Further Resources */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Weiterführende Ressourcen" : "Further resources"}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href={`/${locale}/academy/certification`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? "Academy" : "Academy"}</div>
              <div className="text-sm text-gray-300">{isDE ? "Certification Program" : "Certification program"}</div>
            </Link>
            <Link href={`/${locale}/consulting`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? "Consulting" : "Consulting"}</div>
              <div className="text-sm text-gray-300">{isDE ? "Professional Services" : "Professional services"}</div>
            </Link>
            <Link href={`/${locale}/community`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? "Community" : "Community"}</div>
              <div className="text-sm text-gray-300">{isDE ? "Forum/Discord" : "Forum/Discord"}</div>
            </Link>
            <Link href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? "Roast My Moltbot" : "Roast My Moltbot"}</div>
              <div className="text-sm text-gray-300">{isDE ? "Roast starten" : "Start the roast"}</div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
