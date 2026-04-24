import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { Trophy, Clock, Users, Award, ChevronRight } from "lucide-react"
import { pick } from "@/lib/i18n-pick"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}/tournaments`
  const isDE = locale === "de"
  const title = pick(isDE, "Roast Tournaments | ClawGuru", "Roast Tournaments | ClawGuru")
  const description = pick(isDE, "Wöchentliche Roast-Turniere — Kämpfe um den Titel", "Weekly roast tournaments — Battle for the title")
  return {
    title,
    description,
    keywords: ["tournament", "bracket", "competition", "battle", "moltbot"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, "/tournaments"),
    robots: "index, follow",
  }
}

const tournaments = [
  {
    id: "1",
    name: "Spring Security Showdown 2026",
    status: "active",
    round: "Quarter Finals",
    participants: 64,
    prize: "Pro Year + $500",
    endTime: "3 days",
    bracket: [
      { match: 1, player1: "Security_Ninja", player2: "DevOps_Pro", score: "3-2", winner: "Security_Ninja" },
      { match: 2, player1: "Cloud_Guardian", player2: "ZeroTrust_Expert", score: "2-3", winner: "ZeroTrust_Expert" },
      { match: 3, player1: "AI_Security", player2: "Stack_Master", score: "3-1", winner: "AI_Security" },
      { match: 4, player1: "Kubernetes_King", player2: "Docker_Devil", score: "3-0", winner: "Kubernetes_King" },
    ],
  },
  {
    id: "2",
    name: "Cloud Wars Tournament",
    status: "upcoming",
    round: "Registration",
    participants: 0,
    prize: "Pro Month + Badge",
    endTime: "5 days",
    bracket: [],
  },
]

export default function TournamentsPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {pick(isDE, "Roast Tournaments", "Roast Tournaments")}
          </h1>
          <p className="text-lg text-gray-300">
            {pick(isDE, "Wöchentliche Turniere — Kämpfe um den Titel und Preise", "Weekly tournaments — Battle for the title and prizes")}
          </p>
        </div>

        {/* Tournaments */}
        <div className="space-y-6">
          {tournaments.map((tournament) => (
            <div key={tournament.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-1">{tournament.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-zinc-500">
                    <span className={`px-2 py-1 rounded-full ${
                      tournament.status === "active" ? "bg-green-900/50 text-green-400" : "bg-amber-900/50 text-amber-400"
                    }`}>
                      {tournament.status === "active" ? tournament.round : pick(isDE, "Anmeldung", "Registration")}
                    </span>
                    <span>{tournament.participants} {pick(isDE, "Teilnehmer", "participants")}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-zinc-500 mb-1">{pick(isDE, "Preis", "Prize")}</div>
                  <div className="text-lg font-bold text-amber-400">{tournament.prize}</div>
                </div>
              </div>

              {/* Bracket */}
              {tournament.bracket.length > 0 ? (
                <div className="mb-4">
                  <div className="text-sm text-zinc-500 mb-3">
                    {pick(isDE, "Aktuelle Matches", "Current matches")}
                  </div>
                  <div className="space-y-2">
                    {tournament.bracket.map((match) => (
                      <div key={match.match} className="bg-gray-900/50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <span className={`font-medium ${match.winner === match.player1 ? "text-green-400" : "text-gray-300"}`}>
                              {match.player1}
                            </span>
                            <span className="text-zinc-500">vs</span>
                            <span className={`font-medium ${match.winner === match.player2 ? "text-green-400" : "text-gray-300"}`}>
                              {match.player2}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-cyan-400 font-bold">{match.score}</span>
                            {match.winner && (
                              <Award className="w-4 h-4 text-amber-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mb-4 text-center py-8">
                  <div className="text-4xl mb-2">🏆</div>
                  <div className="text-zinc-500">{pick(isDE, "Turnier startet bald", "Tournament starting soon")}</div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <Clock className="w-4 h-4" />
                  <span>{tournament.endTime}</span>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-sm font-medium text-white transition-colors">
                  {tournament.status === "active" 
                    ? pick(isDE, "Ansehen", "View")
                    : pick(isDE, "Teilnehmen", "Join")}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Notice */}
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mt-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Turniere sind zum Härten eigener Systeme. Keine Angriffstools.", "Tournaments are for hardening your own systems. No attack tools.")}
        </div>
      </div>
    </div>
  )
}
