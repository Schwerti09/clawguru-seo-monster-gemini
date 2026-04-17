import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { AlertTriangle, CheckCircle, XCircle, TrendingUp } from "lucide-react"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}/security-myths`
  const isDE = locale === "de"
  const title = isDE ? "Security Myths Busted | ClawGuru" : "Security Myths Busted | ClawGuru"
  const description = isDE 
    ? "Kontroverse Security-Statements — Myths entlarvt" 
    : "Controversial security statements — Myths busted"
  return {
    title,
    description,
    keywords: ["security", "myths", "busted", "controversial", "moltbot"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, "/security-myths"),
    robots: "index, follow",
  }
}

const myths = [
  {
    id: "1",
    myth: "Firewalls make you secure",
    busted: true,
    explanation: "Firewalls are just one layer. If your app has vulnerabilities, a firewall won't help. Defense in depth is required.",
    evidence: "95% of breaches bypass firewalls through app-level vulnerabilities",
    controversy: "high",
  },
  {
    id: "2",
    myth: "Open source is less secure",
    busted: true,
    explanation: "Open source has more eyes on code. Vulnerabilities are found and fixed faster. Closed source = security by obscurity.",
    evidence: "Linux powers 96% of web servers with fewer critical vulnerabilities than proprietary alternatives",
    controversy: "medium",
  },
  {
    id: "3",
    myth: "Complex passwords are enough",
    busted: true,
    explanation: "Password complexity doesn't stop phishing, reuse, or social engineering. MFA is mandatory.",
    evidence: "81% of breaches involve compromised credentials, often despite complex passwords",
    controversy: "low",
  },
  {
    id: "4",
    myth: "AI will replace security engineers",
    busted: true,
    explanation: "AI can help, but it hallucinates and lacks context. Security requires human judgment and understanding.",
    evidence: "AI security tools have 23% false positive rate, human oversight still required",
    controversy: "high",
  },
  {
    id: "5",
    myth: "You don't need security if you're small",
    busted: true,
    explanation: "43% of cyber attacks target small businesses. Automation makes it cheap to attack anyone.",
    evidence: "Small businesses are 3x more likely to be breached due to limited security resources",
    controversy: "medium",
  },
]

export default function SecurityMythsPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {isDE ? "Security Myths Busted" : "Security Myths Busted"}
          </h1>
          <p className="text-lg text-gray-300">
            {isDE 
              ? "Kontroverse Security-Statements — Myths entlarvt" 
              : "Controversial security statements — Myths busted"}
          </p>
        </div>

        {/* Myths */}
        <div className="space-y-6">
          {myths.map((myth) => (
            <div key={myth.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {myth.busted ? (
                    <XCircle className="w-6 h-6 text-red-400" />
                  ) : (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  )}
                  <div className="font-semibold text-gray-100">"{myth.myth}"</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  myth.controversy === "high" ? "bg-red-900/50 text-red-400" : 
                  myth.controversy === "medium" ? "bg-amber-900/50 text-amber-400" : 
                  "bg-gray-700 text-zinc-400"
                }`}>
                  {myth.controversy} controversy
                </div>
              </div>

              {/* Explanation */}
              <div className="mb-4">
                <div className="text-sm text-zinc-500 mb-2">
                  {isDE ? "Erklärung" : "Explanation"}
                </div>
                <div className="text-gray-300">{myth.explanation}</div>
              </div>

              {/* Evidence */}
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <div className="text-sm text-zinc-500 mb-2">
                  {isDE ? "Beweis" : "Evidence"}
                </div>
                <div className="text-cyan-400">{myth.evidence}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8 bg-gradient-to-r from-cyan-900/30 to-gray-800 rounded-xl border border-cyan-700/50 p-6">
          <div className="flex items-center gap-4">
            <TrendingUp className="w-8 h-8 text-cyan-400" />
            <div>
              <div className="text-sm text-zinc-500 mb-1">
                {isDE ? "Fazit" : "Summary"}
              </div>
              <div className="text-xl font-bold text-gray-100">
                {isDE 
                  ? "Alle 5 Myths sind busted — Security ist komplexer als man denkt" 
                  : "All 5 myths are busted — Security is more complex than you think"}
              </div>
            </div>
          </div>
        </div>

        {/* Trust Notice */}
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mt-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE 
            ? "Security Myths Busted basieren auf öffentlichen Daten und Experten-Meinungen." 
            : "Security Myths Busted are based on public data and expert opinions."}
        </div>
      </div>
    </div>
  )
}
