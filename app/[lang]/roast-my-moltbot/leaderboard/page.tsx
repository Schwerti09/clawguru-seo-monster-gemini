import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { Trophy, Medal, Crown, TrendingUp, Flame } from "lucide-react"
import Link from "next/link"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/roast-my-moltbot/leaderboard"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE ? "Roast Leaderboard | ClawGuru" : "Roast Leaderboard | ClawGuru"
  const description = isDE
    ? "Die Top-Performer der Roast-Community. Wer hat den höchsten Score?"
    : "Top performers in the roast community. Who has the highest score?"
  return {
    title,
    description,
    keywords: ["roast leaderboard", "top scores", "security ranking", "moltbot"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const topUsers = [
  { rank: 1, name: "EliteSec_Ops", score: 98, industry: "Fintech", streak: 12, avatar: "🥇" },
  { rank: 2, name: "DevOps_Ninja", score: 96, industry: "Crypto", streak: 8, avatar: "🥈" },
  { rank: 3, name: "Cloud_Guardian", score: 94, industry: "SaaS", streak: 15, avatar: "🥉" },
  { rank: 4, name: "Security_First", score: 92, industry: "HealthTech", streak: 6, avatar: "🔥" },
  { rank: 5, name: "ZeroTrust_Pro", score: 91, industry: "Enterprise", streak: 9, avatar: "🛡️" },
  { rank: 6, name: "Infra_Wizard", score: 89, industry: "Gaming", streak: 4, avatar: "⚡" },
  { rank: 7, name: "Code_Hardened", score: 87, industry: "AI/ML", streak: 3, avatar: "💪" },
  { rank: 8, name: "Stack_Master", score: 85, industry: "E-Commerce", streak: 7, avatar: "🏆" },
  { rank: 9, name: "SysAdmin_Pro", score: 84, industry: "Media", streak: 2, avatar: "⭐" },
  { rank: 10, name: "Cyber_Defender", score: 82, industry: "Fintech", streak: 5, avatar: "🔒" },
]

const risingStars = [
  { name: "Startup_Founder", score: 76, improvement: +45, time: "2 weeks" },
  { name: "CTO_TechCorp", score: 81, improvement: +38, time: "3 weeks" },
  { name: "FullStack_Dev", score: 74, improvement: +36, time: "1 month" },
]

export default function LeaderboardPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-900/40 border border-amber-700/50 rounded-full text-sm mb-4">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="text-amber-200">🏆 2,847 Teilnehmer weltweit</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-100 mb-2">{isDE ? "Roast Leaderboard" : "Roast Leaderboard"}</h1>
          <p className="text-lg text-gray-300">
            {isDE ? "Die Elite der Security-Community. Wer rostet am besten?" : "The elite of the security community. Who roasts best?"}
          </p>
        </div>

        {/* Top 3 Podium */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {topUsers.slice(0, 3).map((user, idx) => {
            const sizes = ["scale-100", "scale-110", "scale-100"]
            const orders = [2, 1, 3]
            const medals = ["bg-gray-400", "bg-amber-400", "bg-orange-400"]
            
            return (
              <div 
                key={user.name}
                className={`${sizes[idx]} ${orders[idx] === 1 ? "md:-mt-4" : ""} bg-gray-800 rounded-xl border border-gray-700 p-6 text-center relative`}
              >
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 ${medals[idx]} rounded-full flex items-center justify-center font-bold text-gray-900`}>
                  {user.rank}
                </div>
                <div className="text-4xl mb-2">{user.avatar}</div>
                <div className="font-semibold text-gray-100">{user.name}</div>
                <div className="text-3xl font-bold text-amber-400 my-2">{user.score}</div>
                <div className="text-sm text-zinc-500">{user.industry}</div>
                <div className="text-xs text-amber-400 mt-1">🔥 {user.streak} {isDE ? "Wochen Streak" : "week streak"}</div>
              </div>
            )
          })}
        </div>

        {/* Full Leaderboard */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            {isDE ? "Top 10" : "Top 10"}
          </h2>
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            {topUsers.map((user) => (
              <div 
                key={user.name} 
                className="flex items-center gap-4 p-4 border-b border-gray-700/50 last:border-0 hover:bg-gray-700/30 transition-colors"
              >
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center font-bold text-sm text-gray-300">
                  {user.rank}
                </div>
                <div className="text-2xl">{user.avatar}</div>
                <div className="flex-1">
                  <div className="font-medium text-gray-100">{user.name}</div>
                  <div className="text-sm text-zinc-500">{user.industry}</div>
                </div>
                <div className="text-right">
                  <div className={`text-xl font-bold ${
                    user.score >= 90 ? "text-amber-400" :
                    user.score >= 80 ? "text-green-400" : "text-cyan-400"
                  }`}>
                    {user.score}
                  </div>
                  <div className="text-xs text-zinc-500">🔥 {user.streak}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Rising Stars */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            {isDE ? "Rising Stars" : "Rising Stars"}
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {risingStars.map((star) => (
              <div key={star.name} className="bg-gradient-to-br from-green-900/30 to-gray-800 rounded-xl border border-green-700/50 p-4">
                <div className="font-semibold text-gray-100">{star.name}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-2xl font-bold text-green-400">{star.score}</span>
                  <span className="text-sm text-green-300">+{star.improvement} in {star.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-amber-900/40 to-red-900/40 border border-amber-700/50 rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold text-amber-300 mb-2">
            {isDE ? "Schaffst du es in die Top 10?" : "Can you make it to the Top 10?"}
          </h3>
          <p className="text-sm text-amber-200/70 mb-4">
            {isDE ? "Roste deinen Stack und zeig, was du kannst" : "Roast your stack and show what you've got"}
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
