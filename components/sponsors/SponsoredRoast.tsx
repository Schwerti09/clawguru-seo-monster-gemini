import { Check, Star } from "lucide-react"
import { pick } from "@/lib/i18n-pick"

/**
 * Phase 5 Schritt 84 — Sponsored Roasts — „Roast powered by X"
 * Sponsored Roast Component for B2B partnerships
 * No mock data - real sponsor data from database
 */

export interface Sponsor {
  id: string
  name: string
  logo?: string
  website?: string
  tier: "gold" | "silver" | "bronze"
  featured: boolean
  roastCount: number
  avgScore: number
  createdAt: string
}

interface SponsoredRoastProps {
  sponsor: Sponsor
  locale?: string
}

export default function SponsoredRoast({ sponsor, locale = "de" }: SponsoredRoastProps) {
  const isDE = locale === "de"

  const tierColors = {
    gold: "from-yellow-900/30 to-amber-900/30 border-yellow-600",
    silver: "from-gray-800/50 to-gray-900/50 border-gray-400",
    bronze: "from-orange-900/30 to-amber-900/30 border-orange-600",
  }

  return (
    <div
      className={`bg-gradient-to-br ${tierColors[sponsor.tier]} border rounded-lg p-6 relative overflow-hidden`}
    >
      {sponsor.featured && (
        <div className="absolute top-2 right-2">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
        </div>
      )}

      <div className="flex items-start gap-4 mb-4">
        {sponsor.logo ? (
          <img
            src={sponsor.logo}
            alt={sponsor.name}
            className="w-12 h-12 rounded-lg object-cover bg-gray-800"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 font-bold">
            {sponsor.name.charAt(0)}
          </div>
        )}
        <div>
          <h3 className="font-bold text-gray-100">{sponsor.name}</h3>
          <div className="text-sm text-gray-400 capitalize">{sponsor.tier} Sponsor</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-900/50 p-3 rounded-lg">
          <div className="text-xs text-gray-400 mb-1">
            {pick(isDE, "Roasts", "Roasts")}
          </div>
          <div className="text-lg font-bold text-cyan-400">{sponsor.roastCount.toLocaleString()}</div>
        </div>
        <div className="bg-gray-900/50 p-3 rounded-lg">
          <div className="text-xs text-gray-400 mb-1">
            {pick(isDE, "Ø Score", "Avg Score")}
          </div>
          <div className="text-lg font-bold text-cyan-400">{sponsor.avgScore.toFixed(1)}</div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Check className="w-3 h-3 text-green-400" />
        {pick(isDE, "Powered by ClawGuru", "Powered by ClawGuru")}
      </div>

      {sponsor.website && (
        <a
          href={sponsor.website}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-4 text-center text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          {pick(isDE, "Website besuchen", "Visit website")} →
        </a>
      )}
    </div>
  )
}

// Component for displaying multiple sponsored roasts
interface SponsoredRoastsListProps {
  sponsors: Sponsor[]
  locale?: string
}

export function SponsoredRoastsList({ sponsors, locale = "de" }: SponsoredRoastsListProps) {
  const isDE = locale === "de"

  if (!sponsors || sponsors.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 text-center">
        <p className="text-sm text-gray-400">
          {pick(isDE, "Keine Sponsored Roasts verfügbar.", "No sponsored roasts available.")}
        </p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sponsors.map((sponsor) => (
        <SponsoredRoast key={sponsor.id} sponsor={sponsor} locale={locale} />
      ))}
    </div>
  )
}
