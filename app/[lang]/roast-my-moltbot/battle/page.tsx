import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { Swords, Trophy, TrendingUp, Users, Loader2 } from "lucide-react"
import Link from "next/link"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/roast-my-moltbot/battle"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "Roast Battle: 1v1 Stack Vergleich | ClawGuru"
    : "Roast Battle: 1v1 Stack Comparison | ClawGuru"
  const description = isDE
    ? "Zwei Stacks gegeneinander. Community votet. Wer hat die bessere Security?"
    : "Two stacks battle. Community votes. Who has better security?"
  return {
    title,
    description,
    keywords: ["roast battle", "stack comparison", "security battle", "1v1 roast", "moltbot"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

async function getRoastStatistics() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
    const response = await fetch(`${baseUrl}/api/roast-statistics`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    })
    if (!response.ok) {
      return null
    }
    return await response.json()
  } catch (error) {
    console.error("Failed to fetch roast statistics:", error)
    return null
  }
}

export default async function RoastBattlePage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const stats = await getRoastStatistics()

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* VIRAL: Stats Banner */}
        <div className="mb-6 flex flex-wrap justify-center gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-900/40 border border-red-700/50 rounded-full text-sm">
            <Swords className="w-4 h-4 text-red-400" />
            <span className="text-red-200">
              {stats ? `⚔️ ${stats.totalRoasts.toLocaleString()} Roasts` : <Loader2 className="w-4 h-4 animate-spin inline" />}
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-900/40 border border-cyan-700/50 rounded-full text-sm">
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-200">
              {stats ? `👥 ${stats.eliteStacks.toLocaleString()} Elite Stacks` : <Loader2 className="w-4 h-4 animate-spin inline" />}
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-900/40 border border-amber-700/50 rounded-full text-sm">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-amber-200">
              {stats ? `🏆 Ø Score: ${stats.avgScore}/100` : <Loader2 className="w-4 h-4 animate-spin inline" />}
            </span>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "Roast Battle" : "Roast Battle"}</h1>
          <p className="text-lg text-gray-300 mb-2">
            {isDE
              ? "Zwei Stacks. Eine Community. Ein Gewinner. Vote für den besseren Roast!"
              : "Two stacks. One community. One winner. Vote for the better roast!"}
          </p>
          <p className="text-sm text-amber-400 font-medium">
            {isDE ? "→ Starte dein eigenes Battle und challenge die Community" : "→ Start your own battle and challenge the community"}
          </p>
        </div>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE
            ? "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools."
            : "This guide is for hardening your own systems. No attack tools."}
        </div>

        {/* Coming Soon */}
        <section className="mb-10">
          <div className="bg-gray-800 p-12 rounded-xl border border-gray-700 text-center">
            <Swords className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-100 mb-2">{isDE ? "Roast Battle Coming Soon" : "Roast Battle Coming Soon"}</h2>
            <p className="text-zinc-400 mb-6">
              {isDE
                ? "Wir entwickeln gerade das Battle-Feature. Bald kannst du Stacks gegeneinander antreten lassen und die Community voten lassen."
                : "We're developing the battle feature. Soon you'll be able to pit stacks against each other and let the community vote."}
            </p>
            <Link
              href={`/${locale}/roast-my-moltbot`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 rounded-lg font-semibold text-white transition-colors"
            >
              {isDE ? "Roast starten" : "Start a roast"}
            </Link>
          </div>
        </section>

        {/* Links */}
        <nav className="flex flex-wrap justify-center gap-4 text-sm text-zinc-400">
          <Link href={`/${locale}/roast-my-moltbot`} className="hover:text-cyan-300 font-medium">
            {isDE ? "Roast My Moltbot" : "Roast My Moltbot"}
          </Link>
          <Link href={`/${locale}/roast-my-moltbot/hall-of-fame`} className="hover:text-cyan-300 font-medium">
            {isDE ? "Hall of Fame" : "Hall of Fame"}
          </Link>
          <Link href={`/${locale}/roast-my-moltbot/hall-of-shame`} className="hover:text-cyan-300 font-medium">
            {isDE ? "Hall of Shame" : "Hall of Shame"}
          </Link>
        </nav>
      </div>
    </div>
  )
}
