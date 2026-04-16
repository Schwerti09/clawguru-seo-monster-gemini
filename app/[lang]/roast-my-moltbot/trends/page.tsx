import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { TrendingUp, Flame, AlertTriangle, Zap, ArrowUpRight } from "lucide-react"
import Link from "next/link"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/roast-my-moltbot/trends"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "Roast Trends: Was ist heiß | ClawGuru"
    : "Roast Trends: What's Hot | ClawGuru"
  const description = isDE
    ? "Trending Stacks, heiße Vulnerabilities und die schnellsten Score-Sprünge."
    : "Trending stacks, hot vulnerabilities, and fastest score jumps."
  return {
    title,
    description,
    keywords: ["roast trends", "trending stacks", "security trends", "moltbot"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const trendingStacks = [
  { name: "Next.js + Prisma + PostgreSQL", score: 45, change: -12, volume: "1.2K" },
  { name: "Django + Redis + Celery", score: 62, change: +8, volume: "892" },
  { name: "FastAPI + MongoDB + Docker", score: 38, change: -23, volume: "756" },
  { name: "Spring Boot + Kafka + K8s", score: 71, change: +15, volume: "634" },
]

const hotVulns = [
  { id: "CVE-2025-50201", name: "Log4j Reload", severity: "CRITICAL", mentions: 2.4 },
  { id: "CVE-2025-50189", name: "Docker Socket Exposure", severity: "HIGH", mentions: 1.8 },
  { id: "CVE-2025-50123", name: "Redis Unauthorized", severity: "HIGH", mentions: 1.2 },
]

const topJumps = [
  { stack: "Startup-MVP", from: 28, to: 74, time: "3 Tage" },
  { stack: "Legacy-Monolith", from: 31, to: 68, time: "5 Tage" },
  { stack: "Cloud-Native", from: 42, to: 89, time: "7 Tage" },
]

export default function RoastTrendsPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-900/50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-100">{isDE ? "Roast Trends" : "Roast Trends"}</h1>
              <p className="text-amber-400">{isDE ? "Live: 1.2K aktive Roasts" : "Live: 1.2K active roasts"}</p>
            </div>
          </div>
          <p className="text-lg text-gray-300">
            {isDE
              ? "Was gerade heiß läuft: Trending Stacks, neue Vulnerabilities, Score-Sprünge."
              : "What's hot right now: trending stacks, new vulnerabilities, score jumps."}
          </p>
        </div>

        {/* Trending Stacks */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100 flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-400" />
            {isDE ? "Trending Stacks" : "Trending Stacks"}
          </h2>
          <div className="space-y-3">
            {trendingStacks.map((stack) => (
              <div key={stack.name} className="bg-gray-800 rounded-xl border border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-100">{stack.name}</div>
                    <div className="text-sm text-zinc-500">{stack.volume} {isDE ? "Roasts" : "roasts"} this week</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      stack.score >= 80 ? "text-green-400" : 
                      stack.score >= 50 ? "text-amber-400" : "text-red-400"
                    }`}>
                      {stack.score}
                    </div>
                    <div className={`text-sm flex items-center gap-1 ${
                      stack.change > 0 ? "text-green-400" : "text-red-400"
                    }`}>
                      {stack.change > 0 ? "↑" : "↓"} {Math.abs(stack.change)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Hot Vulnerabilities */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            {isDE ? "Heiße Vulnerabilities" : "Hot Vulnerabilities"}
          </h2>
          <div className="space-y-3">
            {hotVulns.map((vuln) => (
              <div key={vuln.id} className="bg-gray-800 rounded-xl border border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`px-2 py-1 rounded text-xs font-bold ${
                      vuln.severity === "CRITICAL" ? "bg-red-900 text-red-300" : "bg-amber-900 text-amber-300"
                    }`}>
                      {vuln.severity}
                    </div>
                    <div>
                      <div className="font-medium text-gray-100">{vuln.id}</div>
                      <div className="text-sm text-zinc-400">{vuln.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-zinc-400">{vuln.mentions}K {isDE ? "Erwähnungen" : "mentions"}</div>
                    <Link href={`/${locale}/academy/cve/${vuln.id}`} className="text-xs text-cyan-400 hover:underline">
                      {isDE ? "Fix ansehen →" : "View fix →"}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top Score Jumps */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            {isDE ? "Schnellste Score-Sprünge" : "Fastest Score Jumps"}
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {topJumps.map((jump, idx) => (
              <div key={jump.stack} className="bg-gradient-to-br from-green-900/30 to-gray-800 rounded-xl border border-green-700/50 p-4">
                <div className="text-sm text-zinc-400 mb-1">#{idx + 1} {jump.stack}</div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-red-400 font-bold">{jump.from}</span>
                  <ArrowUpRight className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-bold text-xl">{jump.to}</span>
                </div>
                <div className="text-xs text-green-300">+{jump.to - jump.from} {isDE ? "in" : "in"} {jump.time}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-amber-900/40 to-red-900/40 border border-amber-700/50 rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold text-amber-300 mb-2">
            {isDE ? "Mach mit bei den Trends" : "Join the trends"}
          </h3>
          <p className="text-sm text-amber-200/70 mb-4">
            {isDE ? "Roast deinen Stack und sieh, wo du im Ranking stehst" : "Roast your stack and see where you rank"}
          </p>
          <Link 
            href={`/${locale}/roast-my-moltbot`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 rounded-lg font-semibold text-white transition-colors"
          >
            <Flame className="w-5 h-5" />
            {isDE ? "Jetzt rosten" : "Roast now"}
          </Link>
        </div>
      </div>
    </div>
  )
}
