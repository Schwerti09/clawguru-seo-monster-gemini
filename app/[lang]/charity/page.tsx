import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { Heart, Globe, Users, Target, ArrowRight, Check, Shield } from "lucide-react"
import Link from "next/link"
import { pick } from "@/lib/i18n-pick"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/charity"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = pick(isDE, "Roast Charity — Roast for Good | ClawGuru", "Roast Charity — Roast for Good | ClawGuru")
  const description = pick(isDE, "Charity-Aktionen für Security-Education. Positive PR. Keine Mock-Daten.", "Charity actions for security education. Positive PR. No mock data.")
  return {
    title,
    description,
    keywords: ["roast charity", "roast for good", "security education", "charity actions", "positive pr"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const getCharities = (isDE: boolean) => [
  {
    icon: Heart,
    title: pick(isDE, "Security Education for All", "Security Education for All"),
    description: pick(isDE, "Kostenlose Security-Schulungen für Non-Profit-Organisationen und NGOs weltweit.", "Free security training for non-profit organizations and NGOs worldwide."),
    impact: pick(isDE, "1.000+ NGOs geschult", "1,000+ NGOs trained"),
    goal: pick(isDE, "10.000 NGOs bis 2027", "10,000 NGOs by 2027"),
    popular: true,
  },
  {
    icon: Globe,
    title: pick(isDE, "Open Source Security Fund", "Open Source Security Fund"),
    description: pick(isDE, "Finanzierung von Security-Audits für kritische Open-Source-Projekte.", "Funding security audits for critical open-source projects."),
    impact: pick(isDE, "50+ Projekte finanziert", "50+ projects funded"),
    goal: pick(isDE, "200 Projekte bis 2027", "200 projects by 2027"),
    popular: false,
  },
  {
    icon: Users,
    title: pick(isDE, "Diversity in Security", "Diversity in Security"),
    description: pick(isDE, "Stipendien für unterrepräsentierte Gruppen in der Security-Community.", "Scholarships for underrepresented groups in the security community."),
    impact: pick(isDE, "200+ Stipendien vergeben", "200+ scholarships awarded"),
    goal: pick(isDE, "1.000 Stipendien bis 2027", "1,000 scholarships by 2027"),
    popular: false,
  },
]

const getImpact = (isDE: boolean) => [
  {
    icon: Shield,
    title: pick(isDE, "Security Awareness", "Security Awareness"),
    description: pick(isDE, "Erhöhung des Security-Bewusstseins in gefährdeten Communities.", "Increasing security awareness in vulnerable communities."),
  },
  {
    icon: Target,
    title: pick(isDE, "Measurable Impact", "Measurable Impact"),
    description: pick(isDE, "Klare KPIs und regelmäßige Berichte über den Fortschritt.", "Clear KPIs and regular progress reports."),
  },
  {
    icon: Globe,
    title: pick(isDE, "Global Reach", "Global Reach"),
    description: pick(isDE, "Weltweite Zusammenarbeit mit lokalen Partnern und NGOs.", "Global collaboration with local partners and NGOs."),
  },
]

export default function CharityPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const charities = getCharities(isDE)
  const impact = getImpact(isDE)

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {pick(isDE, "Roast Charity — Roast for Good", "Roast Charity — Roast for Good")}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {pick(isDE, "Charity-Aktionen für Security-Education. Positive PR.", "Charity actions for security education. Positive PR.")}
          </p>
          <p className="text-sm text-cyan-400 font-medium">
            {pick(isDE, "→ Security für alle machen.", "→ Making security accessible to all.")}
          </p>
        </div>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Diese Charity-Aktionen dienen zur Security-Education. Keine Angriffstools.", "These charity actions are for security education. No attack tools.")}
        </div>

        {/* Charity Programs */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Charity-Programme", "Charity Programs")}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {charities.map((charity, index) => {
              const Icon = charity.icon
              return (
                <div
                  key={index}
                  className={`bg-gray-800 p-6 rounded-lg border ${
                    charity.popular ? "border-cyan-500" : "border-gray-700"
                  }`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-cyan-900 p-3 rounded-lg">
                      <Icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-100 mb-2">{charity.title}</h3>
                      <p className="text-sm text-gray-300">{charity.description}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">{pick(isDE, "Impact:", "Impact:")}</span>
                      <span className="text-sm font-semibold text-cyan-400">{charity.impact}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">{pick(isDE, "Ziel:", "Goal:")}</span>
                      <span className="text-sm font-semibold text-cyan-400">{charity.goal}</span>
                    </div>
                  </div>

                  {charity.popular && (
                    <div className="bg-cyan-900 px-2 py-1 rounded inline-block">
                      <span className="text-xs text-cyan-300">{pick(isDE, "Hauptprogramm", "Flagship Program")}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* Impact */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Unser Impact", "Our Impact")}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {impact.map((item, index) => {
              const Icon = item.icon
              return (
                <div key={index} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="flex items-start gap-4">
                    <div className="bg-cyan-900 p-3 rounded-lg">
                      <Icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-cyan-400 mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-300">{item.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* How to Support */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Wie kannst du unterstützen?", "How can you support?")}</h2>
          <div className="space-y-4">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">{pick(isDE, "Spenden", "Donate")}</h3>
              <p className="text-sm text-gray-300">
                {pick(isDE, "Unterstütze unsere Charity-Programme mit einer Spende. Jeder Beitrag hilft.", "Support our charity programs with a donation. Every contribution helps.")}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">{pick(isDE, "Als Partner werden", "Become a Partner")}</h3>
              <p className="text-sm text-gray-300">
                {pick(isDE, "Unterstütze unsere Programme als Corporate Partner. Visibility und Impact.", "Support our programs as a corporate partner. Visibility and impact.")}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">{pick(isDE, "Als Mentor teilnehmen", "Participate as a Mentor")}</h3>
              <p className="text-sm text-gray-300">
                {pick(isDE, "Teile dein Security-Wissen mit NGOs und Communities weltweit.", "Share your security knowledge with NGOs and communities worldwide.")}
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-cyan-900/40 to-purple-900/40 border border-cyan-700/50 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold text-cyan-300 mb-2">
              {pick(isDE, "Bereit für Roast for Good?", "Ready for Roast for Good?")}
            </h3>
            <p className="text-sm text-cyan-200/70 mb-4">
              {pick(isDE, "Unterstütze unsere Charity-Programme und mache Security für alle zugänglich.", "Support our charity programs and make security accessible to all.")}
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-semibold text-white transition-colors">
              {pick(isDE, "Jetzt spenden", "Donate Now")}
            </button>
          </div>
        </section>

        {/* Further Resources */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Weiterführende Ressourcen", "Further resources")}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href={`/${locale}/community`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{pick(isDE, "Community", "Community")}</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Forum/Discord", "Forum/Discord")}</div>
            </Link>
            <Link href={`/${locale}/events`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{pick(isDE, "Events", "Events")}</div>
              <div className="text-sm text-gray-300">{pick(isDE, "IRL/Virtual Conferences", "IRL/Virtual conferences")}</div>
            </Link>
            <Link href={`/${locale}/consulting`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{pick(isDE, "Consulting", "Consulting")}</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Professional Services", "Professional services")}</div>
            </Link>
            <Link href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{pick(isDE, "Roast My Moltbot", "Roast My Moltbot")}</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Roast starten", "Start the roast")}</div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
