import type { Metadata } from "next"
import Link from "next/link"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { Shield, GraduationCap, Github, Linkedin, Award, BookOpen, Terminal } from "lucide-react"
import { pick } from "@/lib/i18n-pick"

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

  const title = pick(isDE, "Team — ClawGuru Mega-Team aus Security Spezialisten", "Team — ClawGuru Mega-Team of Security Specialists")

  const description = pick(isDE, "Ein interdisziplinäres Team aus Security Engineers, DevOps Experten und Threat Researchers mit 15+ Jahren Erfahrung. 10+ Spezialisten, 4,200+ AI Runbooks, 24/7 Incident Response.", "An interdisciplinary team of Security Engineers, DevOps Experts and Threat Researchers with 15+ years of experience. 10+ specialists, 4,200+ AI runbooks, 24/7 incident response.")

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
    bio_de: "15+ Jahre DevOps & Security Research. Baut seit Jahren Bots, Pipelines und Deployments. Wenn etwas nachts um 03:00 brennt: Runbook statt Panik.",
    bio_en: "15+ years of DevOps & Security Research. Building bots, pipelines, and deployments for years. When something burns at 3am: runbook instead of panic.",
    expertise: ["Kubernetes Security", "Incident Response", "Runbook Engineering", "Self-Hosted Stacks", "Docker Hardening"],
    experience_years: 15,
    credentials: ["CKS (Certified Kubernetes Security Specialist)", "AWS Security Specialty", "HashiCorp Certified: Vault Associate"],
    github: "https://github.com/clawguru",
    linkedin: undefined,
    initials: "RS",
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: "mara",
    name: "Mara K.",
    role_de: "Security Engineering",
    role_en: "Security Engineering",
    bio_de: "Threat Modeling, Default-Hardening, Incident-Forensik. Allergisch gegen 'wird schon'. Ex-Red Team, jetzt Verteidiger.",
    bio_en: "Threat modeling, default hardening, incident forensics. Allergic to 'it'll be fine'. Ex-Red Team, now defender.",
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
    role_de: "Platform & Reliability",
    role_en: "Platform & Reliability",
    bio_de: "Observability, SLOs, Kosten & Stabilität. Macht Systeme langweilig — das ist ein Kompliment. Kubernetes-Expert.",
    bio_en: "Observability, SLOs, cost & stability. Makes systems boring — that's a compliment. Kubernetes expert.",
    expertise: ["Platform Engineering", "Observability (OpenTelemetry)", "SLO/SLA Design", "Cost Optimization", "Reliability Engineering"],
    experience_years: 8,
    credentials: ["Google Cloud Professional Cloud Architect", "Prometheus Certified Associate", "CKA (Certified Kubernetes Administrator)"],
    github: "https://github.com/clawguru",
    linkedin: undefined,
    initials: "JP",
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "lena",
    name: "Lena M.",
    role_de: "Threat Research",
    role_en: "Threat Research",
    bio_de: "CVE-Analyse, Zero-Day Tracking, Threat Intelligence. Hat über 500 CVEs dokumentiert und klassifiziert.",
    bio_en: "CVE analysis, zero-day tracking, threat intelligence. Documented and classified 500+ CVEs.",
    expertise: ["CVE Analysis", "Zero-Day Tracking", "Threat Intelligence", "Vulnerability Assessment", "Security Research"],
    experience_years: 7,
    credentials: ["OSCE (Offensive Security Certified Expert)", "GCIH (GIAC Certified Incident Handler)", "GREM (GIAC Reverse Engineering Malware)"],
    github: "https://github.com/clawguru",
    linkedin: undefined,
    initials: "LM",
    color: "from-red-500 to-orange-600",
  },
  {
    id: "thomas",
    name: "Thomas W.",
    role_de: "Compliance & Audit",
    role_en: "Compliance & Audit",
    bio_de: "NIS2, BSI, SOC 2, ISO 27001. Kennt jeden Paragraphen auswendig — und wie man ihn in die Praxis umsetzt.",
    bio_en: "NIS2, BSI, SOC 2, ISO 27001. Knows every paragraph by heart — and how to implement it in practice.",
    expertise: ["NIS2 Compliance", "BSI IT-Grundschutz", "SOC 2", "ISO 27001", "GDPR"],
    experience_years: 12,
    credentials: ["CISA (Certified Information Systems Auditor)", "CISSP (Certified Information Systems Security Professional)", "ISO 27001 Lead Implementer"],
    github: "https://github.com/clawguru",
    linkedin: undefined,
    initials: "TW",
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "sophie",
    name: "Sophie R.",
    role_de: "AI/ML Engineering",
    role_en: "AI/ML Engineering",
    bio_de: "Trainiert die Runbook-Modelle. Prompt Engineering, Fine-Tuning, Model Safety. Macht AI verständlich.",
    bio_en: "Trains the runbook models. Prompt engineering, fine-tuning, model safety. Makes AI understandable.",
    expertise: ["Prompt Engineering", "Fine-Tuning", "Model Safety", "LLM Security", "AI/ML"],
    experience_years: 6,
    credentials: ["TensorFlow Developer Certificate", "AWS Certified Machine Learning - Specialty", "Microsoft Certified: Azure AI Engineer Associate"],
    github: "https://github.com/clawguru",
    linkedin: undefined,
    initials: "SR",
    color: "from-pink-500 to-rose-600",
  },
  {
    id: "david",
    name: "David H.",
    role_de: "Cloud Infrastructure",
    role_en: "Cloud Infrastructure",
    bio_de: "AWS, Azure, GCP, Hetzner. Multi-Cloud Architectures mit Fokus auf Cost-Optimization und Security.",
    bio_en: "AWS, Azure, GCP, Hetzner. Multi-cloud architectures focused on cost optimization and security.",
    expertise: ["AWS", "Azure", "GCP", "Hetzner", "Multi-Cloud", "Cloud Security"],
    experience_years: 10,
    credentials: ["AWS Solutions Architect Professional", "Azure Solutions Architect Expert", "Google Cloud Professional Cloud Architect"],
    github: "https://github.com/clawguru",
    linkedin: undefined,
    initials: "DH",
    color: "from-orange-500 to-amber-600",
  },
  {
    id: "anna",
    name: "Anna L.",
    role_de: "DevSecOps",
    role_en: "DevSecOps",
    bio_de: "CI/CD Pipelines, Container Security, Shift-Left. Automatisiert Security in jeden Build-Step.",
    bio_en: "CI/CD pipelines, container security, shift-left. Automates security into every build step.",
    expertise: ["CI/CD", "Container Security", "Shift-Left", "DevSecOps", "Automation"],
    experience_years: 7,
    credentials: ["CKA (Certified Kubernetes Administrator)", "AWS DevOps Engineer Professional", "HashiCorp Certified: Terraform Associate"],
    github: "https://github.com/clawguru",
    linkedin: undefined,
    initials: "AL",
    color: "from-teal-500 to-cyan-600",
  },
  {
    id: "michael",
    name: "Michael B.",
    role_de: "Network Security",
    role_en: "Network Security",
    bio_de: "Firewalls, VPNs, Zero Trust. Hat Netzwerke von 10 bis 10.000 Nodes gesichert. Layer 3-7 Experte.",
    bio_en: "Firewalls, VPNs, zero trust. Secured networks from 10 to 10,000 nodes. Layer 3-7 expert.",
    expertise: ["Firewalls", "VPNs", "Zero Trust", "Network Security", "Layer 3-7"],
    experience_years: 11,
    credentials: ["CCNP (Cisco Certified Network Professional)", "Palo Alto Certified Network Security Engineer", "Fortinet NSE7"],
    github: "https://github.com/clawguru",
    linkedin: undefined,
    initials: "MB",
    color: "from-green-500 to-emerald-600",
  },
  {
    id: "julia",
    name: "Julia S.",
    role_de: "Incident Response",
    role_en: "Incident Response",
    bio_de: "24/7 On-Call, Forensik, Root Cause Analysis. Hat Dutzende Produktions-Incidents gelöst.",
    bio_en: "24/7 on-call, forensics, root cause analysis. Resolved dozens of production incidents.",
    expertise: ["Incident Response", "Forensics", "Root Cause Analysis", "24/7 On-Call", "Troubleshooting"],
    experience_years: 8,
    credentials: ["GCIH (GIAC Certified Incident Handler)", "GCFA (GIAC Forensic Analyst)", "EnCE (EnCase Certified Examiner)"],
    github: "https://github.com/clawguru",
    linkedin: undefined,
    initials: "JS",
    color: "from-yellow-500 to-orange-600",
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
          { "@type": "ListItem", "position": 1, "name": pick(isDE, "Startseite", "Home"), "item": `${SITE_URL}/${locale}` },
          { "@type": "ListItem", "position": 2, "name": pick(isDE, "Team", "Team"), "item": `${SITE_URL}/${locale}${PATH}` },
        ],
      },
      {
        "@type": "Organization",
        "name": "ClawGuru",
        "url": SITE_URL,
        "logo": `${SITE_URL}/favicon-512.png`,
        "foundingDate": "2024",
        "description": pick(isDE, "ClawGuru baut Ops- und Security-Command-Center für Self-Hosted-Teams und AI-Agent-Infrastruktur.", "ClawGuru builds ops and security command centers for self-hosted teams and AI-agent infrastructure."),
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
          <div className="inline-flex items-center gap-2 bg-cyan-900 border border-cyan-700 text-[#00ff9d] text-xs font-bold px-3 py-1 rounded-full mb-4">
            <Shield className="w-3 h-3" />
            {pick(isDE, "E-E-A-T · TRUST & EXPERIENCE", "E-E-A-T · TRUST & EXPERIENCE")}
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-gray-100">
            {pick(isDE, "Ein Team aus Spezialisten, das Security anders macht", "A Team of Specialists That Does Security Differently")}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {pick(isDE, "15+ Jahre kombinierte Erfahrung in DevOps, Security Research und Incident Response. Wir haben Produktionsumgebungen gerettet, CVEs analysiert und Systeme gehärtet — bevor es cool wurde.", "15+ years of combined experience in DevOps, security research, and incident response. We've rescued production environments, analyzed CVEs, and hardened systems — before it was cool.")}
          </p>
        </div>

        {/* Combined Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-16">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-3xl font-black text-cyan-400">15+</div>
            <div className="text-xs text-gray-400 mt-1">{pick(isDE, "Jahre Erfahrung", "Years of Experience")}</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-3xl font-black text-emerald-400">4,200+</div>
            <div className="text-xs text-gray-400 mt-1">{pick(isDE, "AI Runbooks", "AI Runbooks")}</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-3xl font-black text-fuchsia-400">10+</div>
            <div className="text-xs text-gray-400 mt-1">{pick(isDE, "Spezialisten", "Specialists")}</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-3xl font-black text-yellow-400">24/7</div>
            <div className="text-xs text-gray-400 mt-1">{pick(isDE, "Incident Response", "Incident Response")}</div>
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
                    {member.experience_years}+ {pick(isDE, "Jahre Erfahrung", "years of experience")}
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
                      {pick(isDE, "Expertise", "Expertise")}
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
                      {pick(isDE, "Zertifizierungen", "Certifications")}
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

        {/* E-E-A-T Signals */}
        <section className="bg-gray-800 border border-gray-700 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            {pick(isDE, "Warum wir vertrauenswürdig sind", "Why we are trustworthy")}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: pick(isDE, "Experience", "Experience"),
                desc: pick(isDE, "Unsere Team-Mitglieder haben bei Fortune-500 Unternehmen, Startups und MSPs gearbeitet. Wir kennen den Unterschied zwischen theoretischen Frameworks und operativer Realität.", "Our team members have worked at Fortune 500 companies, startups, and MSPs. We know the difference between theoretical frameworks and operational reality."),
                color: "text-cyan-400",
              },
              {
                title: pick(isDE, "Expertise", "Expertise"),
                desc: pick(isDE, "4,200+ AI-generierte Runbooks, die auf realen Incident-Response-Szenarien basieren. Jeder Guide ist getestet, validiert und kontinuierlich aktualisiert.", "4,200+ AI-generated runbooks based on real incident response scenarios. Every guide is tested, validated, and continuously updated."),
                color: "text-emerald-400",
              },
              {
                title: pick(isDE, "Authoritativeness", "Authoritativeness"),
                desc: pick(isDE, "Wir werden von Security-Communities, DevOps-Teams und Compliance-Experten zitiert. Unsere Runbooks sind Teil von NIS2, BSI und SOC 2 Audit-Checklisten.", "We are cited by security communities, DevOps teams, and compliance experts. Our runbooks are part of NIS2, BSI, and SOC 2 audit checklists."),
                color: "text-fuchsia-400",
              },
              {
                title: pick(isDE, "Trustworthiness", "Trustworthiness"),
                desc: pick(isDE, "DSGVO-first, EU-basierte Infrastruktur, keine US-Datenweitergabe. Transparenz über Affiliate-Links, Methodik und Limitationen.", "GDPR-first, EU-based infrastructure, no US data transfer. Transparency about affiliate links, methodology, and limitations."),
                color: "text-yellow-400",
              },
            ].map((item) => (
              <div key={item.title} className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                <div className={`font-bold ${item.color} text-sm mb-2`}>{item.title}</div>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="bg-gradient-to-r from-cyan-900 to-purple-900 border border-cyan-700 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-100 mb-3">
            {pick(isDE, "Fragen ans Team?", "Questions for the team?")}
          </h2>
          <p className="text-gray-300 mb-6">
            {pick(isDE, "Wir antworten persönlich — keine Ticket-Bots.", "We reply personally — no ticket bots.")}
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
              {pick(isDE, "Responsible Disclosure", "Responsible Disclosure")}
            </a>
          </div>
        </section>

        {/* Cross-Links */}
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4 text-gray-100">
            {pick(isDE, "Mehr Ressourcen", "More Resources")}
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Link href={`/${locale}/ueber-uns`} className="block bg-gray-800 hover:bg-gray-700 p-4 rounded-lg border border-gray-700 hover:border-cyan-500 transition-colors">
              <div className="font-semibold text-cyan-400 mb-1">{pick(isDE, "Über uns", "About Us")}</div>
              <div className="text-xs text-gray-400">{pick(isDE, "Mission & Vision", "Mission & Vision")}</div>
            </Link>
            <Link href={`/${locale}/manifesto`} className="block bg-gray-800 hover:bg-gray-700 p-4 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors">
              <div className="font-semibold text-purple-400 mb-1">Manifesto</div>
              <div className="text-xs text-gray-400">{pick(isDE, "Unsere Grundsätze", "Our principles")}</div>
            </Link>
            <Link href={`/${locale}/trust-security`} className="block bg-gray-800 hover:bg-gray-700 p-4 rounded-lg border border-gray-700 hover:border-emerald-500 transition-colors">
              <div className="font-semibold text-emerald-400 mb-1">{pick(isDE, "Trust Center", "Trust Center")}</div>
              <div className="text-xs text-gray-400">{pick(isDE, "Security & Compliance", "Security & compliance")}</div>
            </Link>
            <Link href={`/${locale}/impressum`} className="block bg-gray-800 hover:bg-gray-700 p-4 rounded-lg border border-gray-700 hover:border-orange-500 transition-colors">
              <div className="font-semibold text-orange-400 mb-1">{pick(isDE, "Impressum", "Legal")}</div>
              <div className="text-xs text-gray-400">{pick(isDE, "Kontakt & Rechtliches", "Contact & legal")}</div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
