import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { Users, Crown, TrendingUp, Target, Zap } from "lucide-react"
import Link from "next/link"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/roast-my-moltbot/team"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE ? "Team Roast Challenge | ClawGuru" : "Team Roast Challenge | ClawGuru"
  const description = isDE
    ? "Roste als Team. Challenge deine Kollegen. Wer hat den sichersten Stack?"
    : "Roast as a team. Challenge your colleagues. Who has the most secure stack?"
  return {
    title,
    description,
    keywords: ["team roast", "multiplayer", "security challenge", "moltbot"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const activeTeams = [
  { name: "Security First Inc.", members: 12, avgScore: 78, totalImprovement: 156, rank: 1 },
  { name: "DevOps Allstars", members: 8, avgScore: 74, totalImprovement: 134, rank: 2 },
  { name: "Cloud Ninjas", members: 15, avgScore: 71, totalImprovement: 198, rank: 3 },
  { name: "Zero Trust Squad", members: 6, avgScore: 69, totalImprovement: 87, rank: 4 },
]

const challenges = [
  { name: "30-Day Sprint", desc: "Alle Teams müssen in 30 Tagen +20 Punkte erreichen", reward: "🏆 Team Badge", participants: 23 },
  { name: "Critical Fix Week", desc: "Fixe alle Critical Vulns in einer Woche", reward: "🔥 Fire Badge", participants: 18 },
  { name: "Hall of Fame Race", desc: "Wer schafft es zuerst in die Hall of Fame?", reward: "👑 Crown Badge", participants: 12 },
]

export default function TeamRoastPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-900/40 border border-cyan-700/50 rounded-full text-sm mb-4">
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-200">👥 47 aktive Teams • 312 Mitglieder</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-100 mb-2">{isDE ? "Team Roast" : "Team Roast"}</h1>
          <p className="text-lg text-gray-300">
            {isDE ? "Gemeinsam rosten, gemeinsam wachsen. Challenge dein Team!" : "Roast together, grow together. Challenge your team!"}
          </p>
        </div>

        {/* How it Works */}
        <section className="mb-10">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 text-center">
              <div className="w-12 h-12 bg-cyan-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="font-semibold text-gray-100 mb-1">{isDE ? "1. Team bilden" : "1. Form Team"}</h3>
              <p className="text-sm text-zinc-500">{isDE ? "Lade Kollegen ein, erstelle ein Team" : "Invite colleagues, create a team"}</p>
            </div>
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 text-center">
              <div className="w-12 h-12 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="font-semibold text-gray-100 mb-1">{isDE ? "2. Roaste" : "2. Roast"}</h3>
              <p className="text-sm text-zinc-500">{isDE ? "Jeder rostet seinen Stack" : "Everyone roasts their stack"}</p>
            </div>
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 text-center">
              <div className="w-12 h-12 bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-100 mb-1">{isDE ? "3. Gewinne" : "3. Win"}</h3>
              <p className="text-sm text-zinc-500">{isDE ? "Sammle Punkte, steige auf" : "Collect points, climb up"}</p>
            </div>
          </div>
        </section>

        {/* Active Teams */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100 flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            {isDE ? "Aktive Teams" : "Active Teams"}
          </h2>
          <div className="space-y-3">
            {activeTeams.map((team) => (
              <div key={team.name} className="bg-gray-800 rounded-xl border border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center font-bold text-amber-400">
                      #{team.rank}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-100">{team.name}</div>
                      <div className="text-sm text-zinc-500">{team.members} {isDE ? "Mitglieder" : "members"}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-cyan-400">{team.avgScore}</div>
                    <div className="text-sm text-green-400">+{team.totalImprovement} total</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Challenges */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-red-400" />
            {isDE ? "Aktive Challenges" : "Active Challenges"}
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {challenges.map((challenge) => (
              <div key={challenge.name} className="bg-gradient-to-br from-amber-900/30 to-gray-800 rounded-xl border border-amber-700/50 p-4">
                <div className="font-semibold text-amber-300 mb-1">{challenge.name}</div>
                <p className="text-sm text-zinc-400 mb-3">{challenge.desc}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-amber-400">{challenge.reward}</span>
                  <span className="text-zinc-500">{challenge.participants} {isDE ? "Teams" : "teams"}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-700/50 rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold text-cyan-300 mb-2">
            {isDE ? "Starte dein Team" : "Start your team"}
          </h3>
          <p className="text-sm text-cyan-200/70 mb-4">
            {isDE ? "Kostenlos. Bis zu 20 Mitglieder pro Team." : "Free. Up to 20 members per team."}
          </p>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-semibold text-white transition-colors">
            <Users className="w-5 h-5" />
            {isDE ? "Team erstellen" : "Create team"}
          </button>
        </div>
      </div>
    </div>
  )
}
