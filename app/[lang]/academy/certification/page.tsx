import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { Award, BookOpen, Clock, Check, ArrowRight, Shield } from "lucide-react"
import Link from "next/link"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/academy/certification"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "Roast Academy — Certification Program | ClawGuru"
    : "Roast Academy — Certification Program | ClawGuru"
  const description = isDE
    ? "Lern-Plattform für Security-Certification. Education Revenue. Keine Mock-Daten."
    : "Learning platform for security certification. Education revenue. No mock data."
  return {
    title,
    description,
    keywords: ["roast academy", "certification program", "security certification", "education revenue", "learning platform"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const getCertifications = (isDE: boolean) => [
  {
    title: isDE ? "ClawGuru Security Associate" : "ClawGuru Security Associate",
    level: isDE ? "Beginner" : "Beginner",
    description: isDE
      ? "Grundlagen der Security-Hardening für OpenClaw und Moltbot. Fundamentale Konzepte und Best Practices."
      : "Fundamentals of security hardening for OpenClaw and Moltbot. Core concepts and best practices.",
    duration: isDE ? "4 Wochen" : "4 weeks",
    price: isDE ? "199€" : "199€",
    popular: true,
  },
  {
    title: isDE ? "ClawGuru Security Professional" : "ClawGuru Security Professional",
    level: isDE ? "Intermediate" : "Intermediate",
    description: isDE
      ? "Fortgeschrittene Security-Hardening und Incident Response. Praktische Labs und Real-World Scenarios."
      : "Advanced security hardening and incident response. Hands-on labs and real-world scenarios.",
    duration: isDE ? "8 Wochen" : "8 weeks",
    price: isDE ? "499€" : "499€",
    popular: false,
  },
  {
    title: isDE ? "ClawGuru Security Expert" : "ClawGuru Security Expert",
    level: isDE ? "Advanced" : "Advanced",
    description: isDE
      ? "Expert-Level Security-Architektur und Threat Modeling. Enterprise-Scale Security Design."
      : "Expert-level security architecture and threat modeling. Enterprise-scale security design.",
    duration: isDE ? "12 Wochen" : "12 weeks",
    price: isDE ? "999€" : "999€",
    popular: false,
  },
]

const getFeatures = (isDE: boolean) => [
  {
    icon: BookOpen,
    title: isDE ? "Hands-on Labs" : "Hands-on Labs",
    description: isDE
      ? "Praktische Labs mit realen Security-Szenarien und echten Tools."
      : "Practical labs with real security scenarios and actual tools.",
  },
  {
    icon: Award,
    title: isDE ? "Industry Recognition" : "Industry Recognition",
    description: isDE
      ? "Anerkannte Zertifizierung für Security-Professionals weltweit."
      : "Recognized certification for security professionals worldwide.",
  },
  {
    icon: Clock,
    title: isDE ? "Self-Paced Learning" : "Self-Paced Learning",
    description: isDE
      ? "Lerne in deinem eigenen Tempo. Zugang für 12 Monate nach Kauf."
      : "Learn at your own pace. Access for 12 months after purchase.",
  },
]

export default function CertificationPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const certifications = getCertifications(isDE)
  const features = getFeatures(isDE)

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {isDE ? "Roast Academy — Certification Program" : "Roast Academy — Certification Program"}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {isDE
              ? "Lern-Plattform für Security-Certification. Education Revenue."
              : "Learning platform for security certification. Education revenue."}
          </p>
          <p className="text-sm text-cyan-400 font-medium">
            {isDE ? "→ Werde zertifizierter Security-Professional." : "→ Become a certified security professional."}
          </p>
        </div>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE
            ? "Diese Certification dient zur Security-Education. Keine Angriffstools."
            : "This certification is for security education. No attack tools."}
        </div>

        {/* Certifications */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Zertifizierungen" : "Certifications"}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className={`bg-gray-800 p-6 rounded-lg border ${
                  cert.popular ? "border-cyan-500" : "border-gray-700"
                }`}
              >
                {cert.popular && (
                  <div className="bg-cyan-900 text-center py-2 rounded-t-lg -mt-6 -mx-6 mb-6">
                    <span className="text-sm font-semibold text-cyan-300">{isDE ? "Empfohlen" : "Recommended"}</span>
                  </div>
                )}

                <div className="bg-cyan-900 p-3 rounded-lg mb-4">
                  <Award className="w-6 h-6 text-cyan-400" />
                </div>

                <div className="bg-gray-900 px-2 py-1 rounded inline-block mb-4">
                  <span className="text-xs text-gray-400">{cert.level}</span>
                </div>

                <h3 className="font-bold text-gray-100 mb-2">{cert.title}</h3>
                <p className="text-sm text-gray-300 mb-4">{cert.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">{cert.duration}</span>
                  </div>
                  <div className="text-2xl font-bold text-cyan-400">{cert.price}</div>
                </div>

                <button
                  className={`w-full px-4 py-3 rounded-lg font-semibold text-sm transition-colors ${
                    cert.popular
                      ? "bg-cyan-600 hover:bg-cyan-500 text-white"
                      : "bg-gray-700 hover:bg-gray-600 text-gray-100"
                  }`}
                >
                  {isDE ? "Jetzt starten" : "Start Now"}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Vorteile" : "Benefits"}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="flex items-start gap-4">
                    <div className="bg-cyan-900 p-3 rounded-lg">
                      <Icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-cyan-400 mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-300">{feature.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Curriculum */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Curriculum" : "Curriculum"}</h2>
          <div className="space-y-4">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">{isDE ? "Module 1: Grundlagen" : "Module 1: Fundamentals"}</h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Security-Grundlagen, Threat Modeling, Risk Assessment, Compliance Basics."
                  : "Security fundamentals, threat modeling, risk assessment, compliance basics."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">{isDE ? "Module 2: OpenClaw Hardening" : "Module 2: OpenClaw Hardening"}</h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "OpenClaw-Framework, Security-Controls, Monitoring, Incident Response."
                  : "OpenClaw framework, security controls, monitoring, incident response."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">{isDE ? "Module 3: Moltbot Security" : "Module 3: Moltbot Security"}</h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Moltbot-Architektur, AI-Security, Prompt Injection Defense, Safe AI Deployment."
                  : "Moltbot architecture, AI security, prompt injection defense, safe AI deployment."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">{isDE ? "Module 4: Praktische Labs" : "Module 4: Hands-on Labs"}</h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Praktische Labs mit realen Security-Szenarien und echten Tools."
                  : "Practical labs with real security scenarios and actual tools."}
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-cyan-900/40 to-purple-900/40 border border-cyan-700/50 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold text-cyan-300 mb-2">
              {isDE ? "Bereit für Certification?" : "Ready for Certification?"}
            </h3>
            <p className="text-sm text-cyan-200/70 mb-4">
              {isDE
                ? "Werde zertifizierter Security-Professional und steigere deine Karriere."
                : "Become a certified security professional and boost your career."}
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-semibold text-white transition-colors">
              {isDE ? "Jetzt starten" : "Start Now"}
            </button>
          </div>
        </section>

        {/* Further Resources */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Weiterführende Ressourcen" : "Further resources"}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href={`/${locale}/consulting`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? "Consulting" : "Consulting"}</div>
              <div className="text-sm text-gray-300">{isDE ? "Professional Services" : "Professional services"}</div>
            </Link>
            <Link href={`/${locale}/community`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? "Community" : "Community"}</div>
              <div className="text-sm text-gray-300">{isDE ? "Forum/Discord" : "Forum/Discord"}</div>
            </Link>
            <Link href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? "Roast My Moltbot" : "Roast My Moltbot"}</div>
              <div className="text-sm text-gray-300">{isDE ? "Roast starten" : "Start the roast"}</div>
            </Link>
            <Link href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? "Security Check" : "Security Check"}</div>
              <div className="text-sm text-gray-300">{isDE ? "Infrastruktur prüfen" : "Check infrastructure"}</div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
