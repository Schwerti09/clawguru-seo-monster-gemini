import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { TrendingDown, AlertTriangle, Calendar, Award, Flame } from "lucide-react"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}/year-in-review`
  const isDE = locale === "de"
  const title = isDE ? "Year in Review 2025 | ClawGuru" : "Year in Review 2025 | ClawGuru"
  const description = isDE 
    ? "Die schlechtesten Stacks von 2025 — Jahresrückblick" 
    : "The worst stacks of 2025 — Year in review"
  return {
    title,
    description,
    keywords: ["year-in-review", "2025", "worst", "stacks", "moltbot"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, "/year-in-review"),
    robots: "index, follow",
  }
}

const worstStacks = [
  {
    id: "1",
    rank: 1,
    stack: "PHP 5.6 + MySQL 5.5 + Apache 2.2",
    score: 12,
    company: "Legacy Corp",
    issues: ["EOL versions", "No TLS 1.3", "SQL injection", "XSS vulnerabilities"],
    roast: "This stack belongs in a museum, not production. It's 15 years past EOL.",
    category: "EOL Nightmare",
  },
  {
    id: "2",
    rank: 2,
    stack: "Node.js 10 + MongoDB 3.6 + Redis 4",
    score: 18,
    company: "Startup X",
    issues: ["Outdated dependencies", "No authentication", "Open MongoDB", "Debug mode enabled"],
    roast: "They shipped fast, but security was an afterthought. Now they're paying the price.",
    category: "Speed Over Security",
  },
  {
    id: "3",
    rank: 3,
    stack: "WordPress + 47 Plugins + Shared Hosting",
    score: 22,
    company: "Small Business Y",
    issues: ["47 vulnerable plugins", "No updates", "Shared hosting", "No backups"],
    roast: "WordPress isn't the problem. 47 unmaintained plugins on shared hosting is.",
    category: "Plugin Hell",
  },
  {
    id: "4",
    rank: 4,
    stack: "Java 8 + Spring Boot 1.5 + Oracle DB",
    score: 28,
    company: "Enterprise Z",
    issues: ["Legacy Java", "No dependency updates", "Hardcoded credentials", "No RBAC"],
    roast: "Enterprise security is a myth when you hardcode credentials in config files.",
    category: "Enterprise Anti-Pattern",
  },
  {
    id: "5",
    rank: 5,
    stack: "Python 2.7 + Django 1.11 + SQLite",
    score: 31,
    company: "Data Science Co",
    issues: ["Python 2 EOL", "Django 1.11 EOL", "SQLite in production", "No encryption"],
    roast: "Data scientists love Python 2, but production hates it. Migrate or suffer.",
    category: "Science Project in Production",
  },
]

const stats = {
  totalRoasts: 12547,
  averageScore: 67,
  worstScore: 8,
  bestScore: 98,
  mostCommonIssue: "Outdated dependencies",
}

export default function YearInReviewPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-8 h-8 text-cyan-400" />
            <h1 className="text-4xl font-bold text-gray-100">
              {isDE ? "Year in Review 2025" : "Year in Review 2025"}
            </h1>
          </div>
          <p className="text-lg text-gray-300">
            {isDE 
              ? "Die schlechtesten Stacks von 2025 — Jahresrückblick" 
              : "The worst stacks of 2025 — Year in review"}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
            <div className="text-2xl font-bold text-cyan-400">{stats.totalRoasts.toLocaleString()}</div>
            <div className="text-xs text-zinc-500">{isDE ? "Roasts" : "Roasts"}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
            <div className="text-2xl font-bold text-gray-100">{stats.averageScore}</div>
            <div className="text-xs text-zinc-500">{isDE ? "Ø Score" : "Avg Score"}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
            <div className="text-2xl font-bold text-red-400">{stats.worstScore}</div>
            <div className="text-xs text-zinc-500">{isDE ? "Schlechtester" : "Worst"}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
            <div className="text-2xl font-bold text-green-400">{stats.bestScore}</div>
            <div className="text-xs text-zinc-500">{isDE ? "Bester" : "Best"}</div>
          </div>
        </div>

        {/* Worst Stacks */}
        <div className="space-y-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <TrendingDown className="w-6 h-6 text-red-400" />
            <h2 className="text-2xl font-semibold text-gray-100">
              {isDE ? "Die 5 schlechtesten Stacks" : "The 5 worst stacks"}
            </h2>
          </div>

          {worstStacks.map((stack) => (
            <div key={stack.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="bg-red-900/50 text-red-400 rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold">
                    #{stack.rank}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-100">{stack.stack}</div>
                    <div className="text-sm text-zinc-500">{stack.company}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-red-400">{stack.score}</div>
                  <div className="text-xs text-zinc-500">{isDE ? "Score" : "Score"}</div>
                </div>
              </div>

              {/* Category */}
              <div className="mb-4">
                <span className="px-3 py-1 bg-amber-900/50 text-amber-400 rounded-full text-xs">
                  {stack.category}
                </span>
              </div>

              {/* Roast */}
              <div className="mb-4 bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <div className="text-gray-300 italic">"{stack.roast}"</div>
              </div>

              {/* Issues */}
              <div>
                <div className="text-sm text-zinc-500 mb-2">
                  {isDE ? "Probleme" : "Issues"}
                </div>
                <div className="flex flex-wrap gap-2">
                  {stack.issues.map((issue, index) => (
                    <span key={index} className="px-3 py-1 bg-red-900/50 text-red-400 rounded-full text-xs">
                      {issue}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Most Common Issue */}
        <div className="bg-gradient-to-r from-amber-900/30 to-gray-800 rounded-xl border border-amber-700/50 p-6 mb-8">
          <div className="flex items-center gap-4">
            <AlertTriangle className="w-8 h-8 text-amber-400" />
            <div>
              <div className="text-sm text-zinc-500 mb-1">
                {isDE ? "Häufigstes Problem" : "Most common issue"}
              </div>
              <div className="text-xl font-bold text-gray-100">
                {stats.mostCommonIssue}
              </div>
            </div>
          </div>
        </div>

        {/* Trust Notice */}
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE 
            ? "Year in Review basiert auf anonymisierten Roast-Daten." 
            : "Year in review is based on anonymized roast data."}
        </div>
      </div>
    </div>
  )
}
