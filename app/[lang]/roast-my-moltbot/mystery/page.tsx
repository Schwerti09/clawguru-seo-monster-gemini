import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { HelpCircle, Trophy, Clock, Users } from "lucide-react"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}/roast-my-moltbot/mystery`
  const isDE = locale === "de"
  const title = isDE ? "Mystery Stack | ClawGuru" : "Mystery Stack | ClawGuru"
  const description = isDE 
    ? "Rate den Stack anhand des Roasts — Täglich neues Rätsel" 
    : "Guess the stack from the roast — Daily puzzle"
  return {
    title,
    description,
    keywords: ["mystery", "guess", "puzzle", "game", "moltbot"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, "/roast-my-moltbot/mystery"),
    robots: "index, follow",
  }
}

const mysteryStacks = [
  {
    id: "1",
    hints: [
      "API keys found in environment variables",
      "Missing rate limiting on public endpoints",
      "No input validation on user uploads",
      "Using default admin credentials",
    ],
    answer: "Express + MongoDB + AWS",
    difficulty: "Easy",
    participants: 234,
    timeLeft: "2 hours",
  },
]

export default function MysteryStackPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const mystery = mysteryStacks[0]

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {isDE ? "Mystery Stack" : "Mystery Stack"}
          </h1>
          <p className="text-lg text-gray-300">
            {isDE 
              ? "Rate den Tech-Stack anhand der Roast-Ergebnisse" 
              : "Guess the tech stack from the roast results"}
          </p>
        </div>

        {/* Game Card */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-8">
          {/* Stats */}
          <div className="flex gap-4 mb-6 text-sm text-zinc-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{mystery.timeLeft}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{mystery.participants} {isDE ? "spielen" : "playing"}</span>
            </div>
            <div className="flex items-center gap-1">
              <HelpCircle className="w-4 h-4" />
              <span>{mystery.difficulty}</span>
            </div>
          </div>

          {/* Hints */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">
              {isDE ? "Hinweise" : "Hints"}
            </h2>
            <div className="space-y-3">
              {mystery.hints.map((hint, index) => (
                <div key={index} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-900/50 text-amber-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-300">{hint}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Answer Input */}
          <div className="mb-4">
            <label className="text-sm text-zinc-500 block mb-2">
              {isDE ? "Deine Antwort" : "Your answer"}
            </label>
            <input
              type="text"
              placeholder={isDE ? "z.B. Kubernetes + Docker + Postgres" : "e.g. Kubernetes + Docker + Postgres"}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 placeholder-zinc-500"
            />
          </div>

          {/* Submit */}
          <button className="w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-semibold text-white transition-colors">
            {isDE ? "Antworten" : "Submit"}
          </button>
        </div>

        {/* Leaderboard */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-gray-100">
              {isDE ? "Beste Spieler" : "Top Players"}
            </h3>
          </div>
          <div className="space-y-2">
            {[
              { name: "Stack_Detective", time: "2m 34s" },
              { name: "Security_Guru", time: "3m 12s" },
              { name: "Cloud_Watcher", time: "4m 56s" },
            ].map((player, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-300">
                  #{index + 1} {player.name}
                </span>
                <span className="text-zinc-500">{player.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Notice */}
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mt-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE 
            ? "Dies ist ein Rätselspiel zum Lernen. Keine echten Angriffe." 
            : "This is a puzzle game for learning. No real attacks."}
        </div>
      </div>
    </div>
  )
}
