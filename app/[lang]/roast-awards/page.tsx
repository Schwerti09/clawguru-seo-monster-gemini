import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { Trophy, Award, Star, Calendar, Users } from "lucide-react"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}/roast-awards`
  const isDE = locale === "de"
  const title = isDE ? "Roast Awards — Stack Oscars | ClawGuru" : "Roast Awards — Stack Oscars | ClawGuru"
  const description = isDE 
    ? "Jährliche Awards — Die besten und schlechtesten Stacks" 
    : "Annual awards — The best and worst stacks"
  return {
    title,
    description,
    keywords: ["awards", "oscars", "stack", "recognition", "moltbot"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, "/roast-awards"),
    robots: "index, follow",
  }
}

const awardCategories = [
  {
    id: "1",
    category: "Best Security Stack",
    winner: "Stripe",
    stack: "Ruby + Rails + PostgreSQL + Redis",
    score: 92,
    nominees: ["Vercel", "GitHub", "Cloudflare"],
    reason: "Proven security track record with minimal incidents",
  },
  {
    id: "2",
    category: "Worst Security Stack",
    winner: "Legacy Corp",
    stack: "PHP 5.6 + MySQL 5.5 + Apache 2.2",
    score: 12,
    nominees: ["Startup X", "Small Business Y", "Enterprise Z"],
    reason: "15 years past EOL, no TLS 1.3, SQL injection vulnerabilities",
  },
  {
    id: "3",
    category: "Most Improved Stack",
    winner: "Data Science Co",
    stack: "Python 3.11 + Django 4.2 + PostgreSQL",
    score: 78,
    nominees: ["Startup X", "Small Business Y", "Enterprise Z"],
    reason: "Migrated from Python 2.7 to 3.11, fixed all critical vulnerabilities",
  },
  {
    id: "4",
    category: "Best Cloud Architecture",
    winner: "Vercel",
    stack: "Next.js + Edge Functions + Redis + PostgreSQL",
    score: 94,
    nominees: ["Stripe", "GitHub", "Cloudflare"],
    reason: "Edge-first architecture with excellent performance and security",
  },
  {
    id: "5",
    category: "Most Creative Hack",
    winner: "Anonymous",
    stack: "Go + Kubernetes + Istio",
    score: 85,
    nominees: ["Security Ninja", "DevOps Pro", "Cloud Guardian"],
    reason: "Used Istio service mesh to bypass firewall rules (now fixed)",
  },
]

export default function RoastAwardsPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-amber-400" />
            <h1 className="text-4xl font-bold text-gray-100">
              {isDE ? "Roast Awards 2025" : "Roast Awards 2025"}
            </h1>
          </div>
          <p className="text-lg text-gray-300">
            {isDE 
              ? "Die Stack Oscars — Die besten und schlechtesten Stacks des Jahres" 
              : "The Stack Oscars — The best and worst stacks of the year"}
          </p>
        </div>

        {/* Awards */}
        <div className="space-y-6">
          {awardCategories.map((award) => (
            <div key={award.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-amber-400" />
                  <div>
                    <div className="font-semibold text-gray-100">{award.category}</div>
                    <div className="text-sm text-zinc-500">{award.stack}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-cyan-400">{award.score}</div>
                  <div className="text-xs text-zinc-500">{isDE ? "Score" : "Score"}</div>
                </div>
              </div>

              {/* Winner */}
              <div className="mb-4 bg-gradient-to-r from-amber-900/30 to-gray-800 rounded-lg p-4 border border-amber-700/50">
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="text-sm text-zinc-500 mb-1">
                      {isDE ? "Gewinner" : "Winner"}
                    </div>
                    <div className="font-semibold text-gray-100">{award.winner}</div>
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="mb-4">
                <div className="text-sm text-zinc-500 mb-2">
                  {isDE ? "Begründung" : "Reason"}
                </div>
                <div className="text-gray-300">{award.reason}</div>
              </div>

              {/* Nominees */}
              <div>
                <div className="text-sm text-zinc-500 mb-2">
                  {isDE ? "Nominierte" : "Nominees"}
                </div>
                <div className="flex flex-wrap gap-2">
                  {award.nominees.map((nominee, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
                      {nominee}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-8 bg-gradient-to-r from-cyan-900/30 to-gray-800 rounded-xl border border-cyan-700/50 p-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <Users className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-100">12,547</div>
              <div className="text-xs text-zinc-500">{isDE ? "Teilnehmer" : "Participants"}</div>
            </div>
            <div className="text-center">
              <Trophy className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-100">5</div>
              <div className="text-xs text-zinc-500">{isDE ? "Kategorien" : "Categories"}</div>
            </div>
            <div className="text-center">
              <Calendar className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-100">Jährlich</div>
              <div className="text-xs text-zinc-500">{isDE ? "Jährlich" : "Annual"}</div>
            </div>
          </div>
        </div>

        {/* Trust Notice */}
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mt-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE 
            ? "Roast Awards basieren auf anonymisierten Roast-Daten." 
            : "Roast awards are based on anonymized roast data."}
        </div>
      </div>
    </div>
  )
}
