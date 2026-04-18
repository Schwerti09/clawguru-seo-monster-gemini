import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { User, Star, ExternalLink, Loader2 } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface PageProps { params: { lang: string; expert: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"

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

export async function generateStaticParams() {
  const stats = await getRoastStatistics()
  const experts = stats?.topScores?.slice(0, 10).map((entry: any, idx: number) => 
    `guest-${idx + 1}`
  ) || ["guest-1", "guest-2", "guest-3"]
  return SUPPORTED_LOCALES.flatMap((lang) => 
    experts.map((expert: string) => ({ lang, expert }))
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const expertName = params.expert.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  const pageUrl = `${SITE_URL}/${locale}/roast-my-moltbot/guest/${params.expert}`
  const isDE = locale === "de"
  const title = isDE 
    ? `Guest Roast: ${expertName} | ClawGuru` 
    : `Guest Roast: ${expertName} | ClawGuru`
  const description = isDE
    ? `${expertName} roastet seinen Stack — Brutal ehrlich.`
    : `${expertName} roasts their stack — Brutally honest.`
  return {
    title,
    description,
    keywords: ["guest roast", expertName, "security expert", "moltbot"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, `/roast-my-moltbot/guest/${params.expert}`),
    robots: "index, follow",
  }
}

export default async function GuestRoastPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const stats = await getRoastStatistics()

  // Parse expert index from params.expert (e.g., "guest-1" -> 1)
  const expertIndex = parseInt(params.expert.replace(/\D/g, "")) - 1
  const expert = stats?.topScores?.[expertIndex] || null

  if (!expert) {
    notFound()
  }

  const isGood = expert.score >= 80
  const initials = expert.stack_summary?.split(" ").map((w: string) => w[0]).join("").substring(0, 2).toUpperCase() || "XX"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-900/50 to-cyan-900/50 rounded-2xl flex items-center justify-center text-3xl font-bold text-white">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <User className="w-5 h-5 text-cyan-400" />
              <h1 className="text-3xl font-bold text-gray-100">{isDE ? `Gast #${expertIndex + 1}` : `Guest #${expertIndex + 1}`}</h1>
            </div>
            <p className="text-zinc-500">{isDE ? "Anonymisierter Stack" : "Anonymized stack"}</p>
          </div>
        </div>

        {/* Score Banner */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-500 mb-2">{isDE ? "Gerösteter Stack" : "Roasted Stack"}</p>
              <div className="text-xl font-semibold text-gray-100">{expert.stack_summary?.substring(0, 60)}...</div>
            </div>
            <div className={`text-5xl font-bold ${isGood ? "text-green-400" : "text-amber-400"}`}>
              {expert.score}
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className="bg-gradient-to-r from-purple-900/30 to-gray-800 rounded-xl border border-purple-700/50 p-6 mb-8">
          <div className="flex gap-3 mb-3">
            <Star className="w-5 h-5 text-amber-400" />
            <span className="text-sm text-amber-400 font-medium">{isDE ? "Was er sagt" : "What they say"}</span>
          </div>
          <p className="text-lg text-gray-300 italic">
            {isDE 
              ? "Dieser Stack wurde von der Community geprüft und verbessert." 
              : "This stack was reviewed and improved by the community."}
          </p>
        </div>

        {/* Key Findings */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Key Findings" : "Key Findings"}</h2>
          {!expert.weaknesses || expert.weaknesses.length === 0 ? (
            <div className="text-center text-zinc-500 py-4">
              {isDE ? "Keine Findings verfügbar" : "No findings available"}
            </div>
          ) : (
            <div className="space-y-3">
              {expert.weaknesses.slice(0, 3).map((weakness: string, index: number) => (
                <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="text-sm text-zinc-500 mb-1">
                    {index === 0 ? (isDE ? "Kritisch" : "Critical") : index === 1 ? (isDE ? "Mittel" : "Medium") : (isDE ? "Gering" : "Low")}
                  </div>
                  <div className="text-gray-300">{weakness}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-cyan-900/40 to-purple-900/40 border border-cyan-700/50 rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold text-cyan-300 mb-2">
            {isDE ? "Roaste deinen Stack wie ein Profi" : "Roast your stack like a pro"}
          </h3>
          <p className="text-sm text-cyan-200/70 mb-4">
            {isDE ? "Wenn dieser Stack es kann, du auch." : "If this stack can do it, so can you."}
          </p>
          <Link 
            href={`/${locale}/roast-my-moltbot`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-semibold text-white transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
            {isDE ? "Jetzt rosten" : "Roast now"}
          </Link>
        </div>
      </div>
    </div>
  )
}
