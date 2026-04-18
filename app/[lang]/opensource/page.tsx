import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { Code, Star, GitBranch, Shield, ArrowRight, Check } from "lucide-react"
import Link from "next/link"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/opensource"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "Roast Open Source — Roast the World | ClawGuru"
    : "Roast Open Source — Roast the World | ClawGuru"
  const description = isDE
    ? "OSS-Projekte rosten für Developer Love. Security-Audits für Open Source. Keine Mock-Daten."
    : "Roast OSS projects for developer love. Security audits for open source. No mock data."
  return {
    title,
    description,
    keywords: ["roast open source", "oss projects", "security audits", "developer love", "open source security"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const getProjects = (isDE: boolean) => [
  {
    name: "Linux Kernel",
    description: isDE
      ? "Security-Audit für Linux Kernel. Kernel-Hardening, Memory Safety, Secure Boot."
      : "Security audit for Linux kernel. Kernel hardening, memory safety, secure boot.",
    stars: isDE ? "100k+" : "100k+",
    language: "C",
    popular: true,
  },
  {
    name: "Docker",
    description: isDE
      ? "Container-Security Audit. Docker Daemon, Container Escape Prevention, Image Hardening."
      : "Container security audit. Docker daemon, container escape prevention, image hardening.",
    stars: isDE ? "70k+" : "70k+",
    language: "Go",
    popular: false,
  },
  {
    name: "Kubernetes",
    description: isDE
      ? "Orchestration-Security Audit. RBAC, Network Policies, Pod Security Standards."
      : "Orchestration security audit. RBAC, network policies, pod security standards.",
    stars: isDE ? "90k+" : "90k+",
    language: "Go",
    popular: false,
  },
  {
    name: "Nginx",
    description: isDE
      ? "Webserver-Security Audit. Configuration Hardening, TLS Security, WAF Integration."
      : "Webserver security audit. Configuration hardening, TLS security, WAF integration.",
    stars: isDE ? "20k+" : "20k+",
    language: "C",
    popular: false,
  },
]

const getBenefits = (isDE: boolean) => [
  {
    icon: Shield,
    title: isDE ? "Free Security Audits" : "Free Security Audits",
    description: isDE
      ? "Kostenlose Security-Audits für kritische Open-Source-Projekte."
      : "Free security audits for critical open-source projects.",
  },
  {
    icon: Star,
    title: isDE ? "Developer Love" : "Developer Love",
    description: isDE
      ? "Zeige Developer Love, indem du Open-Source-Sicherheit verbesserst."
      : "Show developer love by improving open-source security.",
  },
  {
    icon: GitBranch,
    title: isDE ? "Community Impact" : "Community Impact",
    description: isDE
      ? "Sicherheitsverbesserungen profitieren die gesamte Community."
      : "Security improvements benefit the entire community.",
  },
]

export default function OpenSourcePage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const projects = getProjects(isDE)
  const benefits = getBenefits(isDE)

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {isDE ? "Roast Open Source — Roast the World" : "Roast Open Source — Roast the World"}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {isDE
              ? "OSS-Projekte rosten für Developer Love. Security-Audits für Open Source."
              : "Roast OSS projects for developer love. Security audits for open source."}
          </p>
          <p className="text-sm text-cyan-400 font-medium">
            {isDE ? "→ Mach die Welt sicherer, ein Projekt nach dem anderen." : "→ Make the world safer, one project at a time."}
          </p>
        </div>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE
            ? "Diese Security-Audits dienen zur Härtung von Open-Source-Projekten. Keine Angriffstools."
            : "These security audits are for hardening open-source projects. No attack tools."}
        </div>

        {/* Projects */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Audited Projects" : "Audited Projects"}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <div
                key={index}
                className={`bg-gray-800 p-6 rounded-lg border ${
                  project.popular ? "border-cyan-500" : "border-gray-700"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-cyan-900 p-3 rounded-lg">
                    <Code className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="bg-gray-900 px-2 py-1 rounded">
                    <span className="text-xs text-gray-400">{project.language}</span>
                  </div>
                </div>

                <h3 className="font-bold text-gray-100 mb-2">{project.name}</h3>
                <p className="text-sm text-gray-300 mb-4">{project.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">{project.stars}</span>
                  </div>
                </div>

                <a
                  href={`https://github.com/${project.name.toLowerCase()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold text-gray-100 text-sm transition-colors"
                >
                  {isDE ? "GitHub ansehen" : "View on GitHub"}
                </a>

                {project.popular && (
                  <div className="mt-3 bg-cyan-900 px-2 py-1 rounded inline-block">
                    <span className="text-xs text-cyan-300">{isDE ? "Highlight" : "Highlight"}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Warum Open Source rosten?" : "Why roast open source?"}</h2>
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

        {/* How to Submit */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Projekt einreichen" : "Submit a project"}</h2>
          <div className="space-y-4">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">{isDE ? "Kriterien" : "Criteria"}</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  {isDE ? "Open-Source-Projekt mit aktiver Community" : "Open-source project with active community"}
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  {isDE ? "Kritische Infrastruktur oder hohe Nutzerbasis" : "Critical infrastructure or high user base"}
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  {isDE ? "Willingness to accept security contributions" : "Willingness to accept security contributions"}
                </li>
              </ul>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">{isDE ? "Einreichungsprozess" : "Submission process"}</h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Reiche dein Projekt über GitHub ein. Wir prüfen es und führen einen Security-Audit durch."
                  : "Submit your project via GitHub. We review it and perform a security audit."}
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-cyan-900/40 to-purple-900/40 border border-cyan-700/50 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold text-cyan-300 mb-2">
              {isDE ? "Bereit für Roast the World?" : "Ready for Roast the World?"}
            </h3>
            <p className="text-sm text-cyan-200/70 mb-4">
              {isDE
                ? "Reiche dein Open-Source-Projekt ein und mach die Welt sicherer."
                : "Submit your open-source project and make the world safer."}
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-semibold text-white transition-colors">
              {isDE ? "Projekt einreichen" : "Submit Project"}
            </button>
          </div>
        </section>

        {/* Further Resources */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Weiterführende Ressourcen" : "Further resources"}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href={`/${locale}/charity`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? "Charity" : "Charity"}</div>
              <div className="text-sm text-gray-300">{isDE ? "Roast for Good" : "Roast for Good"}</div>
            </Link>
            <Link href={`/${locale}/partners`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? "Partners" : "Partners"}</div>
              <div className="text-sm text-gray-300">{isDE ? "Integration Marketplace" : "Integration marketplace"}</div>
            </Link>
            <Link href={`/${locale}/community`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? "Community" : "Community"}</div>
              <div className="text-sm text-gray-300">{isDE ? "Forum/Discord" : "Forum/Discord"}</div>
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
