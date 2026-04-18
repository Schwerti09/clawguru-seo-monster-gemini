import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { Trophy, Target, Clock, Users, CheckCircle2 } from "lucide-react"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}/challenges`
  const isDE = locale === "de"
  const title = isDE ? "Roast Challenges | ClawGuru" : "Roast Challenges | ClawGuru"
  const description = isDE 
    ? "Wöchentliche Roast Challenges — Belohnte Wettbewerbe für Security-Enthusiasten" 
    : "Weekly Roast Challenges — Rewarded competitions for security enthusiasts"
  return {
    title,
    description,
    keywords: ["challenges", "weekly", "competition", "security", "moltbot"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, "/challenges"),
    robots: "index, follow",
  }
}

const weeklyChallenges = [
  {
    id: "1",
    title: "Roast 5 Databases",
    description: "Roast 5 different database stacks this week",
    reward: "500 XP + Badge",
    participants: 234,
    deadline: "3 days left",
    progress: { current: 2, total: 5 },
    icon: "🗄️",
  },
  {
    id: "2",
    title: "Fix 10 Critical Issues",
    description: "Fix 10 critical vulnerabilities found in roasts",
    reward: "1000 XP + Pro Day",
    participants: 156,
    deadline: "5 days left",
    progress: { current: 7, total: 10 },
    icon: "🔧",
  },
  {
    id: "3",
    title: "Roast Your Company Stack",
    description: "Roast your own company's tech stack",
    reward: "750 XP + Company Badge",
    participants: 89,
    deadline: "7 days left",
    progress: null,
    icon: "🏢",
  },
]

export default function ChallengesPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {isDE ? "Roast Challenges" : "Roast Challenges"}
          </h1>
          <p className="text-lg text-gray-300">
            {isDE 
              ? "Wöchentliche Challenges mit Belohnungen. Zeig, was du kannst." 
              : "Weekly challenges with rewards. Show what you can do."}
          </p>
        </div>

        {/* Active Challenges */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {isDE ? "Aktive Challenges" : "Active Challenges"}
          </h2>
          <div className="space-y-4">
            {weeklyChallenges.map((challenge) => (
              <div key={challenge.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{challenge.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-100">{challenge.title}</h3>
                      <span className="px-2 py-1 bg-amber-900/50 text-amber-400 text-xs rounded-full">
                        {challenge.reward}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500 mb-3">{challenge.description}</p>
                    
                    {/* Progress */}
                    {challenge.progress && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
                          <span>{isDE ? "Fortschritt" : "Progress"}</span>
                          <span>{challenge.progress.current}/{challenge.progress.total}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-cyan-500 h-2 rounded-full transition-all"
                            style={{
                              width: `${(challenge.progress.current / challenge.progress.total) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex gap-4 text-xs text-zinc-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{challenge.participants} {isDE ? "Teilnehmer" : "participants"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{challenge.deadline}</span>
                      </div>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-sm font-medium text-white transition-colors">
                    {challenge.progress && challenge.progress.current > 0
                      ? isDE ? "Weiter" : "Continue"
                      : isDE
                        ? "Starten"
                        : "Start"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Completed */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {isDE ? "Abgeschlossen" : "Completed"}
          </h2>
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span className="text-sm text-zinc-500">{isDE ? "Diese Woche abgeschlossen" : "Completed this week"}</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-300">
                <span>🎯 Roast 3 Cloud Stacks</span>
                <span className="text-green-400">✓ 300 XP</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-300">
                <span>🔥 7-Day Streak</span>
                <span className="text-green-400">✓ Badge</span>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Notice */}
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE 
            ? "Challenges sind zum Härten eigener Systeme. Keine Angriffstools." 
            : "Challenges are for hardening your own systems. No attack tools."}
        </div>
      </div>
    </div>
  )
}
