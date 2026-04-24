import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { Laugh, AlertCircle, Info } from "lucide-react"
import { pick } from "@/lib/i18n-pick"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}/april-fools`
  const isDE = locale === "de"
  const title = pick(isDE, "Best Security Practices (April Fools) | ClawGuru", "Best Security Practices (April Fools) | ClawGuru")
  const description = pick(isDE, "Die besten Security Practices — Satire für Aprilscherze", "The best security practices — Satire for April Fools")
  return {
    title,
    description,
    keywords: ["april-fools", "satire", "security", "humor", "moltbot"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, "/april-fools"),
    robots: "index, follow",
  }
}

const satiricalPractices = [
  {
    id: "1",
    title: "Use 'password123' for everything",
    subtitle: "It's easy to remember and nobody will guess it",
    irony: "This is the #1 most common password in breach databases",
    realAdvice: "Use unique, complex passwords with a password manager",
  },
  {
    id: "2",
    title: "Disable all firewalls — they're just annoying",
    subtitle: "Firewalls block legitimate traffic anyway",
    irony: "Firewalls are your first line of defense against attacks",
    realAdvice: "Keep firewalls enabled and properly configured",
  },
  {
    id: "3",
    title: "Never update your software — updates introduce bugs",
    subtitle: "If it works, don't fix it",
    irony: "Unpatched vulnerabilities are the #1 attack vector",
    realAdvice: "Apply security updates immediately",
  },
  {
    id: "4",
    title: "Share your API keys on GitHub",
    subtitle: "Open source means sharing everything",
    irony: "Exposed API keys lead to instant account compromise",
    realAdvice: "Never commit secrets — use environment variables",
  },
  {
    id: "5",
    title: "Turn off 2FA — it's too much hassle",
    subtitle: "Who has time for extra login steps?",
    irony: "2FA blocks 99.9% of automated attacks",
    realAdvice: "Enable 2FA everywhere possible",
  },
  {
    id: "6",
    title: "Use admin/admin as credentials",
    subtitle: "Default credentials are there for a reason",
    irony: "Default credentials are the first thing attackers try",
    realAdvice: "Change all default credentials immediately",
  },
]

export default function AprilFoolsPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Laugh className="w-8 h-8 text-amber-400" />
            <h1 className="text-4xl font-bold text-gray-100">
              {pick(isDE, "Best Security Practices", "Best Security Practices")}
            </h1>
          </div>
          <p className="text-lg text-gray-300">
            {pick(isDE, "Die ultimativen Security-Tipps — für Aprilscherze (Satire)", "The ultimate security tips — for April Fools (satire)")}
          </p>
        </div>

        {/* Satire Notice */}
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-100">Satire Warning:</strong> {pick(isDE, "Dies ist eine Satire. Bitte befolge NICHT diese „Practices“. Das Gegenteil ist richtig.", "This is satire. Please DO NOT follow these 'practices'. The opposite is true.")}
            </div>
          </div>
        </div>

        {/* Satirical Practices */}
        <div className="space-y-6">
          {satiricalPractices.map((practice) => (
            <div key={practice.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              {/* Header */}
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-100 mb-2">{practice.title}</h3>
                <p className="text-zinc-500 italic">{practice.subtitle}</p>
              </div>

              {/* Irony */}
              <div className="mb-4 bg-red-900/20 rounded-lg p-4 border border-red-800/50">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm text-zinc-500 mb-1">
                      {pick(isDE, "Warum das falsch ist", "Why this is wrong")}
                    </div>
                    <div className="text-red-400">{practice.irony}</div>
                  </div>
                </div>
              </div>

              {/* Real Advice */}
              <div className="bg-green-900/20 rounded-lg p-4 border border-green-800/50">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <div className="text-sm text-zinc-500 mb-1">
                      {pick(isDE, "Echter Rat", "Real advice")}
                    </div>
                    <div className="text-green-400">{practice.realAdvice}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="text-6xl mb-4">🎭</div>
          <p className="text-zinc-500 text-sm">
            {pick(isDE, "Happy April Fools! — Security ist ernst, aber Humor hilft beim Lernen.", "Happy April Fools! — Security is serious, but humor helps learning.")}
          </p>
        </div>
      </div>
    </div>
  )
}
