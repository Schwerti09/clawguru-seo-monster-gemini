import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { Users, Award, Share2, ArrowRight, Check } from "lucide-react"
import Link from "next/link"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/ambassadors"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "Roast Influencers — Ambassador Program | ClawGuru"
    : "Roast Influencers — Ambassador Program | ClawGuru"
  const description = isDE
    ? "Influencer-Partnerschaften für Reach. Ambassador Program. Keine Mock-Daten."
    : "Influencer partnerships for reach. Ambassador program. No mock data."
  return {
    title,
    description,
    keywords: ["roast influencers", "ambassador program", "influencer partnerships", "reach", "brand ambassador"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const getBenefits = (isDE: boolean) => [
  {
    icon: Award,
    title: isDE ? "Exclusive Access" : "Exclusive Access",
    description: isDE
      ? "Frühzeitiger Zugang zu neuen Features und Produkten vor der Veröffentlichung."
      : "Early access to new features and products before public release.",
  },
  {
    icon: Users,
    title: isDE ? "Community Recognition" : "Community Recognition",
    description: isDE
      ? "Offizielle Anerkennung als ClawGuru Ambassador im Security-Ökosystem."
      : "Official recognition as ClawGuru ambassador in the security ecosystem.",
  },
  {
    icon: Share2,
    title: isDE ? "Revenue Share" : "Revenue Share",
    description: isDE
      ? "Revenue-Share auf Conversions, die über deine Ambassador-Links generiert werden."
      : "Revenue share on conversions generated through your ambassador links.",
  },
]

const getRequirements = (isDE: boolean) => [
  {
    title: isDE ? "Security-Expertise" : "Security Expertise",
    description: isDE
      ? "Nachweisbare Erfahrung in Security-Hardening, OpenClaw oder Moltbot."
      : "Proven experience in security hardening, OpenClaw, or Moltbot.",
  },
  {
    title: isDE ? "Social Media Presence" : "Social Media Presence",
    description: isDE
      ? "Aktive Social-Media-Präsenz mit Fokus auf Security oder Tech."
      : "Active social media presence focused on security or tech.",
  },
  {
    title: isDE ? "Content Creation" : "Content Creation",
    description: isDE
      ? "Fähigkeit, qualitativ hochwertige Security-Content zu erstellen und zu teilen."
      : "Ability to create and share high-quality security content.",
  },
]

export default function AmbassadorsPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const benefits = getBenefits(isDE)
  const requirements = getRequirements(isDE)

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {isDE ? "Roast Influencers — Ambassador Program" : "Roast Influencers — Ambassador Program"}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {isDE
              ? "Influencer-Partnerschaften für Reach. Ambassador Program."
              : "Influencer partnerships for reach. Ambassador program."}
          </p>
          <p className="text-sm text-cyan-400 font-medium">
            {isDE ? "→ Werde Teil des ClawGuru Ambassador-Netzwerks." : "→ Join the ClawGuru ambassador network."}
          </p>
        </div>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE
            ? "Dieses Ambassador-Programm dient zur Security-Education. Keine Angriffstools."
            : "This ambassador program is for security education. No attack tools."}
        </div>

        {/* Benefits */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Vorteile" : "Benefits"}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div key={index} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="flex items-start gap-4">
                    <div className="bg-cyan-900 p-3 rounded-lg">
                      <Icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-cyan-400 mb-2">{benefit.title}</h3>
                      <p className="text-sm text-gray-300">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Requirements */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Voraussetzungen" : "Requirements"}</h2>
          <div className="space-y-4">
            {requirements.map((requirement, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-2">{requirement.title}</h3>
                <p className="text-sm text-gray-300">{requirement.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How to Apply */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Wie bewerben?" : "How to apply?"}</h2>
          <div className="space-y-4">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">{isDE ? "Schritt 1: Bewerbung einreichen" : "Step 1: Submit application"}</h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Fülle das Bewerbungsformular mit deinen Social-Media-Daten und Security-Expertise aus."
                  : "Fill out the application form with your social media details and security expertise."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">{isDE ? "Schritt 2: Review" : "Step 2: Review"}</h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Unser Team prüft deine Bewerbung und kontaktiert dich innerhalb von 5 Werktagen."
                  : "Our team reviews your application and contacts you within 5 business days."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">{isDE ? "Schritt 3: Onboarding" : "Step 3: Onboarding"}</h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Bei Annahme erhältst du Zugriff auf das Ambassador-Portal und deine einzigartigen Links."
                  : "Upon acceptance, you get access to the ambassador portal and your unique links."}
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-cyan-900/40 to-purple-900/40 border border-cyan-700/50 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold text-cyan-300 mb-2">
              {isDE ? "Bereit für Ambassador?" : "Ready for Ambassador?"}
            </h3>
            <p className="text-sm text-cyan-200/70 mb-4">
              {isDE
                ? "Werde Teil des ClawGuru Ambassador-Netzwerks und erreiche Millionen von Security-Professionals."
                : "Join the ClawGuru ambassador network and reach millions of security professionals."}
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-semibold text-white transition-colors">
              {isDE ? "Jetzt bewerben" : "Apply Now"}
            </button>
          </div>
        </section>

        {/* Further Resources */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Weiterführende Ressourcen" : "Further resources"}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href={`/${locale}/community`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? "Community" : "Community"}</div>
              <div className="text-sm text-gray-300">{isDE ? "Forum/Discord" : "Forum/Discord"}</div>
            </Link>
            <Link href={`/${locale}/events`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? "Events" : "Events"}</div>
              <div className="text-sm text-gray-300">{isDE ? "IRL/Virtual Conferences" : "IRL/Virtual conferences"}</div>
            </Link>
            <Link href={`/${locale}/academy/certification`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? "Academy" : "Academy"}</div>
              <div className="text-sm text-gray-300">{isDE ? "Certification Program" : "Certification program"}</div>
            </Link>
            <Link href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? "Roast My Moltbot" : "Roast My Moltbot"}</div>
              <div className="text-sm text-gray-300">{isDE ? "Roast starten" : "Start the roast"}</div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
