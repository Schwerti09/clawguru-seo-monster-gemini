import type { Metadata } from "next"
import Link from "next/link"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { Shield, GraduationCap, Github, Linkedin, Award, BookOpen, Terminal } from "lucide-react"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/team"

export const revalidate = 3600

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"

  const title = isDE
    ? "Team & Expertise — ClawGuru Security Research"
    : "Team & Expertise — ClawGuru Security Research"

  const description = isDE
    ? "Das ClawGuru-Team: DevOps-Engineers, Security-Researcher und Incident-Responder mit jahrelanger Praxiserfahrung in Self-Hosted, Kubernetes und AI-Agent Security."
    : "The ClawGuru team: DevOps engineers, security researchers, and incident responders with years of hands-on experience in self-hosted, Kubernetes, and AI-agent security."

  return {
    title,
    description,
    keywords: ["clawguru team", "security team", "devops experts", "security researchers", "e-e-a-t"],
    authors: [{ name: "ClawGuru Team" }],
    openGraph: {
      title,
      description,
      type: "profile",
      url: pageUrl,
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

interface TeamMember {
  id: string
  name: string
  role_de: string
  role_en: string
  bio_de: string
  bio_en: string
  expertise: string[]
  experience_years: number
  credentials: string[]
  github?: string
  linkedin?: string
  initials: string
  color: string
}

const TEAM: TeamMember[] = [
  {
    id: "rolf",
    name: "Rolf S.",
    role_de: "Founder · Ops / Research",
    role_en: "Founder · Ops / Research",
    bio_de: "Baut seit über 12 Jahren Bots, Pipelines und Deployments. Hat mehr als 200 Production-Incidents nachts um 03:00 Uhr behoben. Spezialisiert auf Runbook-basierte Incident Response und Self-Hosted Kubernetes Security.",
    bio_en: "Has been building bots, pipelines, and deployments for over 12 years. Resolved 200+ production incidents at 3am. Specialized in runbook-based incident response and self-hosted Kubernetes security.",
    expertise: ["Kubernetes Security", "Incident Response", "Runbook Engineering", "Self-Hosted Stacks", "Docker Hardening"],
    experience_years: 12,
    credentials: ["CKS (Certified Kubernetes Security Specialist)", "AWS Security Specialty", "HashiCorp Certified: Vault Associate"],
    github: "https://github.com/clawguru",
    linkedin: undefined,
    initials: "RS",
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: "mara",
    name: "Mara K.",
    role_de: "Security Engineering Lead",
    role_en: "Security Engineering Lead",
    bio_de: "Threat Modeling, Default-Hardening, Incident-Forensik. Hat über 50 Security-Audits für EU-Mittelstand durchgeführt. Allergisch gegen 'wird schon'. NIS2-Spezialistin mit Fokus auf technische Controls.",
    bio_en: "Threat modeling, default hardening, incident forensics. Conducted 50+ security audits for EU SMBs. Allergic to 'it'll be fine'. NIS2 specialist focused on technical controls.",
    expertise: ["Threat Modeling", "NIS2 Compliance", "GDPR Technical Controls", "AI Agent Security", "Prompt Injection Defense"],
    experience_years: 9,
    credentials: ["OSCP (Offensive Security Certified Professional)", "ISO 27001 Lead Auditor", "CISM (Certified Information Security Manager)"],
    github: "https://github.com/clawguru",
    linkedin: undefined,
    initials: "MK",
    color: "from-purple-500 to-pink-600",
  },
  {
    id: "jonas",
    name: "Jonas P.",
    role_de: "Platform & Reliability Engineer",
    role_en: "Platform & Reliability Engineer",
    bio_de: "Observability, SLOs, Kosten & Stabilität. 8 Jahre Plattform-Engineering. Hat Systeme für 100k+ DAU gebaut und Kosten-Optimierungen von 40%+ erreicht. Macht Systeme langweilig — das ist ein Kompliment.",
    bio_en: "Observability, SLOs, cost & stability. 8 years of platform engineering. Built systems for 100k+ DAU and achieved 40%+ cost optimizations. Makes systems boring — that's a compliment.",
    expertise: ["Platform Engineering", "Observability (OpenTelemetry)", "SLO/SLA Design", "Cost Optimization", "Reliability Engineering"],
    experience_years: 8,
    credentials: ["Google Cloud Professional Cloud Architect", "Prometheus Certified Associate", "CKA (Certified Kubernetes Administrator)"],
    github: "https://github.com/clawguru",
    linkedin: undefined,
    initials: "JP",
    color: "from-emerald-500 to-teal-600",
  },
]

export default function TeamPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": isDE ? "Startseite" : "Home", "item": `${SITE_URL}/${locale}` },
          { "@type": "ListItem", "position": 2, "name": isDE ? "Team" : "Team", "item": `${SITE_URL}/${locale}${PATH}` },
        ],
      },
      {
        "@type": "Organization",
        "name": "ClawGuru",
        "url": SITE_URL,
        "logo": `${SITE_URL}/favicon-512.png`,
        "foundingDate": "2024",
        "description": isDE
          ? "ClawGuru baut Ops- und Security-Command-Center für Self-Hosted-Teams und AI-Agent-Infrastruktur."
          : "ClawGuru builds ops and security command centers for self-hosted teams and AI-agent infrastructure.",
        "member": TEAM.map((m) => ({
          "@type": "Person",
          "name": m.name,
          "jobTitle": isDE ? m.role_de : m.role_en,
          "description": isDE ? m.bio_de : m.bio_en,
          "worksFor": { "@type": "Organization", "name": "ClawGuru" },
          "knowsAbout": m.expertise,
          "hasCredential": m.credentials.map((c) => ({
            "@type": "EducationalOccupationalCredential",
            "name": c,
          })),
          ...(m.github && { "sameAs": [m.github, ...(m.linkedin ? [m.linkedin] : [])] }),
        })),
      },
      ...TEAM.map((m) => ({
        "@type": "Person",
        "@id": `${SITE_URL}/${locale}${PATH}#${m.id}`,
        "name": m.name,
        "jobTitle": isDE ? m.role_de : m.role_en,
        "description": isDE ? m.bio_de : m.bio_en,
        "worksFor": { "@type": "Organization", "name": "ClawGuru", "url": SITE_URL },
        "knowsAbout": m.expertise,
        "hasCredential": m.credentials.map((c) => ({
          "@type": "EducationalOccupationalCredential",
          "name": c,
          "credentialCategory": "professional certification",
        })),
        ...(m.github && { "sameAs": [m.github, ...(m.linkedin ? [m.linkedin] : [])] }),
      })),
    ],
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-cyan-900 border border-cyan-700 text-cyan-300 text-xs font-bold px-3 py-1 rounded-full mb-4">
            <Shield className="w-3 h-3" />
            {isDE ? "E-E-A-T · TRANSPARENZ" : "E-E-A-T · TRANSPARENCY"}
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-gray-100">
            {isDE ? "Das Team hinter ClawGuru" : "The Team Behind ClawGuru"}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {isDE
              ? "Keine Marketing-Personas. Keine KI-generierten Profile. Echte DevOps- und Security-Experten mit nachweisbarer Erfahrung."
              : "No marketing personas. No AI-generated profiles. Real DevOps and security experts with verifiable experience."}
          </p>
        </div>

        {/* Combined Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-16">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-3xl font-black text-cyan-400">{TEAM.reduce((sum, m) => sum + m.experience_years, 0)}+</div>
            <div className="text-xs text-gray-400 mt-1">{isDE ? "Jahre Praxis-Erfahrung (zusammen)" : "Years of hands-on experience (combined)"}</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-3xl font-black text-purple-400">{TEAM.reduce((sum, m) => sum + m.credentials.length, 0)}</div>
            <div className="text-xs text-gray-400 mt-1">{isDE ? "Zertifizierungen" : "Certifications"}</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-3xl font-black text-emerald-400">250+</div>
            <div className="text-xs text-gray-400 mt-1">{isDE ? "Production Incidents behoben" : "Production incidents resolved"}</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-3xl font-black text-orange-400">4.200+</div>
            <div className="text-xs text-gray-400 mt-1">{isDE ? "Runbooks veröffentlicht" : "Runbooks published"}</div>
          </div>
        </div>

        {/* Team Members */}
        <div className="space-y-8 mb-16">
          {TEAM.map((member) => (
            <article
              key={member.id}
              id={member.id}
              className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden"
              itemScope
              itemType="https://schema.org/Person"
            >
              <div className="grid md:grid-cols-3 gap-0">
                {/* Avatar & Basic Info */}
                <div className={`bg-gradient-to-br ${member.color} p-8 flex flex-col items-center justify-center text-center`}>
                  <div className="w-24 h-24 rounded-full bg-[#0a0a0a] border-4 border-white/20 flex items-center justify-center text-3xl font-black text-white mb-4">
                    {member.initials}
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1" itemProp="name">
                    {member.name}
                  </h2>
                  <div className="text-sm text-white/80" itemProp="jobTitle">
                    {isDE ? member.role_de : member.role_en}
                  </div>
                  <div className="mt-3 text-xs text-white/60">
                    {member.experience_years}+ {isDE ? "Jahre Erfahrung" : "years of experience"}
                  </div>
                  {(member.github || member.linkedin) && (
                    <div className="flex gap-2 mt-4">
                      {member.github && (
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer me"
                          className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                          aria-label="GitHub"
                        >
                          <Github className="w-4 h-4 text-white" />
                        </a>
                      )}
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer me"
                          className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                          aria-label="LinkedIn"
                        >
                          <Linkedin className="w-4 h-4 text-white" />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Bio & Details */}
                <div className="md:col-span-2 p-8">
                  <p className="text-gray-300 leading-relaxed mb-6" itemProp="description">
                    {isDE ? member.bio_de : member.bio_en}
                  </p>

                  {/* Expertise */}
                  <div className="mb-5">
                    <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Terminal className="w-3 h-3" />
                      {isDE ? "Expertise" : "Expertise"}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {member.expertise.map((skill) => (
                        <span
                          key={skill}
                          className="text-xs bg-gray-900 border border-gray-700 text-gray-300 px-2 py-1 rounded-full"
                          itemProp="knowsAbout"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Credentials */}
                  <div>
                    <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Award className="w-3 h-3" />
                      {isDE ? "Zertifizierungen" : "Certifications"}
                    </h3>
                    <ul className="space-y-1">
                      {member.credentials.map((cred) => (
                        <li
                          key={cred}
                          className="text-sm text-gray-400 flex items-start gap-2"
                        >
                          <GraduationCap className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                          <span>{cred}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* How we build authority */}
        <section className="bg-gray-800 border border-gray-700 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            {isDE ? "Wie wir Autorität bauen" : "How we build authority"}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: isDE ? "Runbooks statt Blog-Noise" : "Runbooks instead of blog noise",
                desc: isDE
                  ? "Jeder Artikel enthält ausführbare Commands, keine Theorie-Keywords."
                  : "Every article contains executable commands, no theory keywords.",
              },
              {
                title: isDE ? "Transparenz bei Affiliate-Links" : "Transparency with affiliate links",
                desc: isDE
                  ? "Alle Partner-Links werden klar markiert. Keine versteckten Empfehlungen."
                  : "All partner links are clearly marked. No hidden recommendations.",
              },
              {
                title: isDE ? "Echte Incident-Cases" : "Real incident cases",
                desc: isDE
                  ? "Alle Post-Mortems basieren auf tatsächlich behobenen Production-Incidents (anonymisiert)."
                  : "All post-mortems are based on actually resolved production incidents (anonymized).",
              },
              {
                title: isDE ? "Responsible Disclosure" : "Responsible disclosure",
                desc: isDE
                  ? "Security-Issues meldest du an security@clawguru.org — wir antworten in <48h."
                  : "Report security issues to security@clawguru.org — we respond in <48h.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                <div className="font-bold text-gray-100 text-sm mb-2">{item.title}</div>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="bg-gradient-to-r from-cyan-900 to-purple-900 border border-cyan-700 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-100 mb-3">
            {isDE ? "Fragen ans Team?" : "Questions for the team?"}
          </h2>
          <p className="text-gray-300 mb-6">
            {isDE
              ? "Wir antworten persönlich — keine Ticket-Bots."
              : "We reply personally — no ticket bots."}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:team@clawguru.org"
              className="bg-white text-gray-900 font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              team@clawguru.org
            </a>
            <a
              href="mailto:security@clawguru.org"
              className="bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-100 font-bold px-6 py-3 rounded-lg transition-colors"
            >
              {isDE ? "Responsible Disclosure" : "Responsible Disclosure"}
            </a>
          </div>
        </section>

        {/* Cross-Links */}
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4 text-gray-100">
            {isDE ? "Mehr Ressourcen" : "More Resources"}
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Link href={`/${locale}/ueber-uns`} className="block bg-gray-800 hover:bg-gray-700 p-4 rounded-lg border border-gray-700 hover:border-cyan-500 transition-colors">
              <div className="font-semibold text-cyan-400 mb-1">{isDE ? "Über uns" : "About Us"}</div>
              <div className="text-xs text-gray-400">{isDE ? "Mission & Vision" : "Mission & Vision"}</div>
            </Link>
            <Link href={`/${locale}/manifesto`} className="block bg-gray-800 hover:bg-gray-700 p-4 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors">
              <div className="font-semibold text-purple-400 mb-1">Manifesto</div>
              <div className="text-xs text-gray-400">{isDE ? "Unsere Grundsätze" : "Our principles"}</div>
            </Link>
            <Link href={`/${locale}/trust-security`} className="block bg-gray-800 hover:bg-gray-700 p-4 rounded-lg border border-gray-700 hover:border-emerald-500 transition-colors">
              <div className="font-semibold text-emerald-400 mb-1">{isDE ? "Trust Center" : "Trust Center"}</div>
              <div className="text-xs text-gray-400">{isDE ? "Security & Compliance" : "Security & compliance"}</div>
            </Link>
            <Link href={`/${locale}/impressum`} className="block bg-gray-800 hover:bg-gray-700 p-4 rounded-lg border border-gray-700 hover:border-orange-500 transition-colors">
              <div className="font-semibold text-orange-400 mb-1">{isDE ? "Impressum" : "Legal"}</div>
              <div className="text-xs text-gray-400">{isDE ? "Kontakt & Rechtliches" : "Contact & legal"}</div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
