import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { Building2, TrendingUp, ExternalLink, Flame } from "lucide-react"
import { pick } from "@/lib/i18n-pick"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}/startup-roasts`
  const isDE = locale === "de"
  const title = pick(isDE, "Startup Roasts | ClawGuru", "Startup Roasts | ClawGuru")
  const description = pick(isDE, "Roasts bekannter Startups und ihrer Tech-Stacks", "Roasts of famous startups and their tech stacks")
  return {
    title,
    description,
    keywords: ["startup", "roast", "tech-stack", "famous", "moltbot"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, "/startup-roasts"),
    robots: "index, follow",
  }
}

const startupRoasts = [
  {
    id: "1",
    name: "Stripe",
    stack: "Ruby + Rails + PostgreSQL + Redis",
    score: 88,
    roast: "Stripe's security is legendary, but their Ruby monolith is becoming a bottleneck. Time to microservices?",
    strengths: ["Excellent API security", "Proven reliability", "Strong team culture"],
    weaknesses: ["Monolith scaling limits", "Ruby performance ceiling", "Complex deployment"],
  },
  {
    id: "2",
    name: "Airbnb",
    stack: "React + Node.js + Java + MySQL",
    score: 72,
    roast: "Airbnb's polyglot architecture is impressive until you have to debug a distributed monolith.",
    strengths: ["Modern frontend", "Scalable backend", "Strong data science"],
    weaknesses: ["Language fragmentation", "Complex CI/CD", "Debugging hell"],
  },
  {
    id: "3",
    name: "Notion",
    stack: "React + TypeScript + Electron + PostgreSQL",
    score: 85,
    roast: "Notion's stack is clean, but Electron is eating all your RAM. Time for Tauri?",
    strengths: ["Type-first approach", "Clean architecture", "Great DX"],
    weaknesses: ["Electron bloat", "Desktop performance", "Sync complexity"],
  },
  {
    id: "4",
    name: "Vercel",
    stack: "Next.js + Edge Functions + Redis + PostgreSQL",
    score: 94,
    roast: "Vercel eats their own dog food — and it's delicious. But vendor lock-in is real.",
    strengths: ["Cutting-edge tech", "Developer experience", "Performance"],
    weaknesses: ["Vendor lock-in", "Edge limitations", "Cost at scale"],
  },
]

export default function StartupRoastsPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {pick(isDE, "Startup Roasts", "Startup Roasts")}
          </h1>
          <p className="text-lg text-gray-300">
            {pick(isDE, "Roasts bekannter Startups und ihrer Tech-Stacks", "Roasts of famous startups and their tech stacks")}
          </p>
        </div>

        {/* Startup Roasts */}
        <div className="space-y-6">
          {startupRoasts.map((startup) => (
            <div key={startup.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Building2 className="w-6 h-6 text-cyan-400" />
                  <div>
                    <div className="font-semibold text-gray-100">{startup.name}</div>
                    <div className="text-sm text-zinc-500">{startup.stack}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-400" />
                  <span className="text-2xl font-bold text-cyan-400">{startup.score}</span>
                </div>
              </div>

              {/* Roast */}
              <div className="mb-4 bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <div className="text-gray-300 italic">"{startup.roast}"</div>
              </div>

              {/* Strengths */}
              <div className="mb-4">
                <div className="text-sm text-zinc-500 mb-2">
                  {pick(isDE, "Stärken", "Strengths")}
                </div>
                <div className="flex flex-wrap gap-2">
                  {startup.strengths.map((strength, index) => (
                    <span key={index} className="px-3 py-1 bg-green-900/50 text-green-400 rounded-full text-xs">
                      ✓ {strength}
                    </span>
                  ))}
                </div>
              </div>

              {/* Weaknesses */}
              <div className="mb-4">
                <div className="text-sm text-zinc-500 mb-2">
                  {pick(isDE, "Schwächen", "Weaknesses")}
                </div>
                <div className="flex flex-wrap gap-2">
                  {startup.weaknesses.map((weakness, index) => (
                    <span key={index} className="px-3 py-1 bg-red-900/50 text-red-400 rounded-full text-xs">
                      ✗ {weakness}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-gray-700">
                <a
                  href={`https://${startup.name.toLowerCase()}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300"
                >
                  {pick(isDE, "Website besuchen", "Visit website")}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Notice */}
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mt-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Startup Roasts sind öffentliche Informationen. Keine Angriffe.", "Startup roasts are public information. No attacks.")}
        </div>
      </div>
    </div>
  )
}
