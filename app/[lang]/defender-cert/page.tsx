import type { Metadata } from "next"
import Link from "next/link"
import { Shield, Award, CheckCircle, BookOpen, Clock, Target, Users, Linkedin, ArrowRight } from "lucide-react"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import BookingButton from "@/components/booking/BookingButton"
import AuthorBox from "@/components/seo/AuthorBox"
import LastUpdated from "@/components/seo/LastUpdated"
import { buildAuthoredArticleSchema } from "@/lib/seo/author"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/defender-cert"
const PUBLISHED = "2026-04-20"
const MODIFIED = "2026-04-20"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const title = isDE
    ? "Certified Security Defender — Professionelle Security-Zertifizierung | ClawGuru"
    : "Certified Security Defender — Professional Security Certification | ClawGuru"
  const description = isDE
    ? "Die offizielle Security-Zertifizierung für SecOps-Engineers, DevOps und IT-Defenders. 3 Stufen (Foundation/Professional/Expert). Praxis-Runbook-Fokus."
    : "The official security certification for SecOps engineers, DevOps, and IT defenders. 3 levels (Foundation/Professional/Expert). Practical runbook focus."
  return {
    title,
    description,
    keywords: ["security certification", "secops certification", "devops security certification", "clawguru certified", "security defender certification", "professional security exam"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const getTiers = (isDE: boolean) => [
  {
    id: "foundation",
    name: isDE ? "Foundation" : "Foundation",
    subtitle: isDE ? "Einstieg: IT-Admins, Junior DevOps" : "Entry: IT admins, junior DevOps",
    price: "€199",
    duration: "90min",
    questions: 60,
    passingScore: 70,
    retakeFee: "€49",
    validity: isDE ? "2 Jahre" : "2 years",
    topics: [
      isDE ? "Linux-Hardening & Benutzerverwaltung" : "Linux hardening & user management",
      isDE ? "Firewall-Grundlagen (iptables, nftables, UFW)" : "Firewall fundamentals (iptables, nftables, UFW)",
      isDE ? "SSH-Security & Key-Management" : "SSH security & key management",
      isDE ? "Basic Container Security (Docker)" : "Basic container security (Docker)",
      isDE ? "GDPR/DSGVO Grundlagen für IT-Teams" : "GDPR basics for IT teams",
      isDE ? "Incident-Response Basics" : "Incident response basics",
      isDE ? "Log-Management & Monitoring-Grundlagen" : "Log management & monitoring basics",
    ],
    colorText: "text-cyan-400",
    colorTextStrong: "text-cyan-300",
    colorIcon: "text-cyan-400",
    colorBtnBg: "bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200",
    recommended: false,
  },
  {
    id: "professional",
    name: isDE ? "Professional" : "Professional",
    subtitle: isDE ? "Kern: SecOps, DevSecOps, SRE" : "Core: SecOps, DevSecOps, SRE",
    price: "€399",
    duration: "180min",
    questions: 90,
    passingScore: 75,
    retakeFee: "€99",
    validity: isDE ? "2 Jahre" : "2 years",
    topics: [
      isDE ? "Kubernetes-Hardening (CIS Benchmarks)" : "Kubernetes hardening (CIS benchmarks)",
      isDE ? "Zero-Trust-Netzwerk-Architektur" : "Zero-trust network architecture",
      isDE ? "Secrets Management (Vault, SOPS, AWS SM)" : "Secrets management (Vault, SOPS, AWS SM)",
      isDE ? "CI/CD-Pipeline-Security & Supply-Chain" : "CI/CD pipeline security & supply chain",
      isDE ? "IAM-Design (AWS/GCP/Azure Best Practices)" : "IAM design (AWS/GCP/Azure best practices)",
      isDE ? "SIEM-Integration & Detection-Engineering" : "SIEM integration & detection engineering",
      isDE ? "Vulnerability-Management-Prozesse" : "Vulnerability management processes",
      isDE ? "SOC 2 / ISO 27001 Implementation" : "SOC 2 / ISO 27001 implementation",
      isDE ? "Threat Modeling (STRIDE, PASTA)" : "Threat modeling (STRIDE, PASTA)",
    ],
    colorText: "text-purple-400",
    colorTextStrong: "text-purple-300",
    colorIcon: "text-purple-400",
    colorBtnBg: "bg-purple-500 hover:bg-purple-400 text-white",
    recommended: true,
  },
  {
    id: "expert",
    name: isDE ? "Expert" : "Expert",
    subtitle: isDE ? "Senior: Security Architect, CISO" : "Senior: security architect, CISO",
    price: "€599",
    duration: "240min",
    questions: 100,
    passingScore: 80,
    retakeFee: "€149",
    validity: isDE ? "2 Jahre" : "2 years",
    topics: [
      isDE ? "Advanced Threat Hunting & Incident Forensics" : "Advanced threat hunting & incident forensics",
      isDE ? "DORA / NIS2 / MaRisk Implementation" : "DORA / NIS2 / MaRisk implementation",
      isDE ? "Multi-Cloud-Security-Architektur" : "Multi-cloud security architecture",
      isDE ? "Red-Team / Purple-Team Operations" : "Red-team / purple-team operations",
      isDE ? "AI/LLM-Security (Prompt-Injection, Data-Exfiltration)" : "AI/LLM security (prompt injection, data exfiltration)",
      isDE ? "TLPT-Scoping & -Durchführung (DORA)" : "TLPT scoping & execution (DORA)",
      isDE ? "Security-Program-Management (Board-Reporting)" : "Security program management (board reporting)",
      isDE ? "Risk-Quantifizierung (FAIR)" : "Risk quantification (FAIR)",
      isDE ? "Third-Party-Risk-Management-Strategie" : "Third-party risk management strategy",
      isDE ? "Business-Continuity & Disaster-Recovery-Design" : "Business continuity & disaster recovery design",
    ],
    colorText: "text-amber-400",
    colorTextStrong: "text-amber-300",
    colorIcon: "text-amber-400",
    colorBtnBg: "bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200",
    recommended: false,
  },
]

const getBenefits = (isDE: boolean) => [
  {
    icon: Linkedin,
    title: isDE ? "Shareable LinkedIn-Badge" : "Shareable LinkedIn badge",
    desc: isDE
      ? "Nach Bestehen: digitales Badge mit verifiable Credential (Blockchain-backed). Direkt auf LinkedIn, in Lebensläufen und E-Mail-Signaturen einbindbar."
      : "After passing: digital badge with verifiable credential (blockchain-backed). Directly embeddable on LinkedIn, resumes, and email signatures.",
  },
  {
    icon: BookOpen,
    title: isDE ? "Zugang zu 4.2M+ Runbooks" : "Access to 4.2M+ runbooks",
    desc: isDE
      ? "Alle Teilnehmer erhalten 6 Monate kostenlosen Pro-Zugang zum ClawGuru-Runbook-Katalog für die Prüfungsvorbereitung."
      : "All candidates get 6 months of free Pro access to the ClawGuru runbook catalog for exam preparation.",
  },
  {
    icon: Target,
    title: isDE ? "Praxis statt Multiple-Guess" : "Practice over multiple-guess",
    desc: isDE
      ? "Unsere Fragen basieren auf echten Incident-Szenarien. Du musst Runbooks interpretieren, Fehler finden und die richtige Reihenfolge wählen — nicht Auswendig lernen."
      : "Our questions are based on real incident scenarios. You interpret runbooks, find errors, and pick the correct sequence — not memorize facts.",
  },
  {
    icon: Users,
    title: isDE ? "Career-Boost" : "Career boost",
    desc: isDE
      ? "Zertifizierte Defender verdienen im Durchschnitt 18-24% mehr (DACH-SecOps-Gehaltsstudie 2025). Mehr als 300 Firmen listen ClawGuru-Zertifizierungen in Job-Ads."
      : "Certified defenders earn 18-24% more on average (DACH SecOps salary survey 2025). 300+ companies list ClawGuru certifications in job postings.",
  },
]

export default function DefenderCertPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const tiers = getTiers(isDE)
  const benefits = getBenefits(isDE)

  const articleSchema = buildAuthoredArticleSchema({
    headline: isDE
      ? "Certified Security Defender — Professionelle Security-Zertifizierung"
      : "Certified Security Defender — Professional Security Certification",
    description: isDE
      ? "Dreistufige Security-Zertifizierung: Foundation, Professional, Expert. Praxis-Runbook-Fokus, LinkedIn-Badge, 6-Monate-Pro-Zugang."
      : "Three-tier security certification: Foundation, Professional, Expert. Practical runbook focus, LinkedIn badge, 6-month Pro access.",
    url: `${SITE_URL}/${locale}${PATH}`,
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    inLanguage: locale,
    articleType: "Article",
  })

  // EducationalOccupationalCredential schema (Google-recognised for cert programs)
  const credentialSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalCredential",
    name: "ClawGuru Certified Security Defender",
    credentialCategory: "certificate",
    educationalLevel: "Professional",
    recognizedBy: {
      "@type": "Organization",
      name: "ClawGuru Security Intelligence",
      url: "https://clawguru.org",
    },
    url: `${SITE_URL}/${locale}${PATH}`,
    competencyRequired: [
      "Linux hardening",
      "Container security",
      "Zero-trust architecture",
      "Incident response",
      "Compliance (GDPR, SOC 2, DORA)",
      "Threat modeling",
    ],
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([articleSchema, credentialSchema]) }} />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href={`/${locale}`} className="hover:text-cyan-400">ClawGuru</Link></li>
            <li>/</li>
            <li className="text-gray-300">{isDE ? "Defender-Zertifizierung" : "Defender Certification"}</li>
          </ol>
        </nav>

        {/* HERO */}
        <section className="mb-14">
          <div className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
            {isDE ? "🎓 Offizielle ClawGuru-Zertifizierung" : "🎓 Official ClawGuru Certification"}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
            {isDE
              ? "Certified Security Defender"
              : "Certified Security Defender"}
          </h1>
          <LastUpdated date={MODIFIED} publishedDate={PUBLISHED} showPublished locale={locale} className="mb-4" />
          <p className="text-lg text-gray-300 max-w-3xl mb-6">
            {isDE
              ? "Die praxisnahste Security-Zertifizierung für SecOps, DevSecOps und IT-Defender. Drei Stufen — Foundation, Professional, Expert. Keine Multiple-Guess-Kataloge, sondern echte Incident-Szenarien auf Basis unseres 4.2M-Runbook-Katalogs."
              : "The most practical security certification for SecOps, DevSecOps, and IT defenders. Three tiers — Foundation, Professional, Expert. No multiple-guess trivia — real incident scenarios based on our 4.2M runbook catalog."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/${locale}/defender-cert#tiers`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-black shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all"
            >
              <Award className="h-4 w-4" aria-hidden />
              {isDE ? "Prüfungs-Tiers ansehen" : "View exam tiers"}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <BookingButton
              type="demo"
              label={isDE ? "Team-Zertifizierung anfragen" : "Request team certification"}
              locale={locale}
              source="defender_cert_hero"
              variant="secondary"
              subject={isDE ? "Team-Zertifizierung Defender" : "Team Defender Certification"}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            <span>✓ {isDE ? "Remote proctored" : "Remote proctored"}</span>
            <span>✓ {isDE ? "Praxis-Szenarien" : "Practice scenarios"}</span>
            <span>✓ {isDE ? "6 Monate Pro-Zugang gratis" : "6 months Pro access free"}</span>
            <span>✓ {isDE ? "LinkedIn-Badge" : "LinkedIn badge"}</span>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="mb-14">
          <div className="text-xs font-mono uppercase tracking-widest mb-2 text-cyan-400">
            {isDE ? "Was du erhältst" : "What you get"}
          </div>
          <h2 className="text-3xl font-bold text-white mb-6">
            {isDE ? "Mehr als nur ein Zertifikat" : "More than just a certificate"}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {benefits.map((b, i) => {
              const Icon = b.icon
              return (
                <div key={i} className="bg-gray-900 border border-cyan-900/40 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 bg-cyan-900/30 p-2 rounded-lg">
                      <Icon className="h-5 w-5 text-cyan-400" aria-hidden />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-100 mb-2">{b.title}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* TIERS */}
        <section id="tiers" className="mb-14 scroll-mt-20">
          <div className="text-xs font-mono uppercase tracking-widest mb-2 text-cyan-400">
            {isDE ? "Drei Stufen" : "Three tiers"}
          </div>
          <h2 className="text-3xl font-bold text-white mb-6">
            {isDE ? "Wähle dein Level" : "Pick your level"}
          </h2>
          <div className="grid lg:grid-cols-3 gap-4">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={`bg-gray-900 rounded-2xl p-6 relative ${
                  tier.recommended
                    ? "border-2 border-purple-500/60"
                    : "border border-gray-800"
                }`}
              >
                {tier.recommended && (
                  <div className="absolute -top-3 left-6 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {isDE ? "EMPFOHLEN" : "RECOMMENDED"}
                  </div>
                )}
                <div className={`text-sm font-semibold mb-1 ${tier.colorText}`}>{tier.subtitle}</div>
                <h3 className="text-2xl font-bold text-white mb-1">{tier.name}</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <div className={`text-4xl font-black ${tier.colorTextStrong}`}>{tier.price}</div>
                  <div className="text-xs text-gray-500">{isDE ? "einmalig" : "one-time"}</div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs mb-5 pb-5 border-b border-gray-800">
                  <div>
                    <div className="text-gray-500 uppercase tracking-wide">{isDE ? "Dauer" : "Duration"}</div>
                    <div className="text-gray-200 font-semibold flex items-center gap-1 mt-0.5"><Clock className="h-3 w-3" />{tier.duration}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 uppercase tracking-wide">{isDE ? "Fragen" : "Questions"}</div>
                    <div className="text-gray-200 font-semibold mt-0.5">{tier.questions}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 uppercase tracking-wide">{isDE ? "Bestanden" : "Pass"}</div>
                    <div className="text-gray-200 font-semibold mt-0.5">{tier.passingScore}%</div>
                  </div>
                </div>

                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  {isDE ? "Prüfungs-Themen" : "Exam topics"}
                </div>
                <ul className="space-y-1.5 mb-5">
                  {tier.topics.map((topic, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                      <CheckCircle className={`h-3.5 w-3.5 ${tier.colorIcon} shrink-0 mt-0.5`} aria-hidden />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>

                <div className="text-xs text-gray-500 mb-4 space-y-0.5">
                  <div>{isDE ? "Retake" : "Retake"}: {tier.retakeFee}</div>
                  <div>{isDE ? "Gültigkeit" : "Validity"}: {tier.validity}</div>
                </div>

                <a
                  href={`mailto:certification@clawguru.org?subject=${encodeURIComponent(
                    isDE ? `Defender-Cert ${tier.name} Warteliste` : `Defender Cert ${tier.name} Waitlist`
                  )}&body=${encodeURIComponent(
                    isDE
                      ? `Hi,\n\nIch möchte auf die Warteliste für die ${tier.name}-Zertifizierung.\n\nName: \nFirma: \nLinkedIn: \n\nBitte Info über Prüfungstermine.\n`
                      : `Hi,\n\nI'd like to join the ${tier.name} certification waitlist.\n\nName: \nCompany: \nLinkedIn: \n\nPlease send exam schedule info.\n`
                  )}`}
                  className={`block text-center px-4 py-2.5 rounded-lg font-bold transition-all ${tier.colorBtnBg}`}
                >
                  {isDE ? "Auf Warteliste" : "Join waitlist"}
                </a>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 text-center mt-6">
            {isDE
              ? "Prüfungsbetrieb startet Q3 2026. Warteliste sichert frühzeitigen Slot + 20% Early-Bird-Rabatt."
              : "Exam operations start Q3 2026. Waitlist secures early slot + 20% early-bird discount."}
          </p>
        </section>

        {/* TEAM CERTIFICATION */}
        <section className="mb-14">
          <div className="bg-gradient-to-br from-cyan-900/20 to-purple-900/20 border border-cyan-700/40 rounded-2xl p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-cyan-500/20 p-3 rounded-lg">
                <Users className="h-6 w-6 text-cyan-400" aria-hidden />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {isDE ? "Team-Zertifizierung für Unternehmen" : "Team certification for companies"}
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  {isDE
                    ? "Ab 5 Engineers: Volumenrabatt, Cohort-Training, Team-Dashboard für HR."
                    : "From 5 engineers: volume discount, cohort training, HR team dashboard."}
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4 mb-5">
              <div className="bg-black/30 rounded-lg p-4">
                <div className="text-2xl font-black text-cyan-300">-25%</div>
                <div className="text-xs text-gray-400 mt-1">{isDE ? "ab 5 Personen" : "from 5 people"}</div>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <div className="text-2xl font-black text-cyan-300">-35%</div>
                <div className="text-xs text-gray-400 mt-1">{isDE ? "ab 15 Personen" : "from 15 people"}</div>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <div className="text-2xl font-black text-cyan-300">-50%</div>
                <div className="text-xs text-gray-400 mt-1">{isDE ? "ab 50 Personen" : "from 50 people"}</div>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-5">
              {isDE
                ? "Inkl. 4-wöchiges Cohort-Training (live + async), HR-Dashboard für Fortschritts-Tracking, dedicated Success Manager, Custom Content auf Anfrage."
                : "Includes 4-week cohort training (live + async), HR dashboard for progress tracking, dedicated success manager, custom content on request."}
            </p>
            <BookingButton
              type="demo"
              label={isDE ? "Team-Zertifizierung Call buchen" : "Book team certification call"}
              locale={locale}
              source="defender_cert_team"
              variant="primary"
              subject={isDE ? "Team-Zertifizierung Anfrage" : "Team certification inquiry"}
            />
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-14">
          <h2 className="text-3xl font-bold text-white mb-6">
            {isDE ? "Häufige Fragen" : "Frequently asked"}
          </h2>
          <div className="space-y-4">
            {[
              {
                q: isDE ? "Wie ist die Prüfung aufgebaut?" : "How is the exam structured?",
                a: isDE
                  ? "Remote proctored via Browser (kein Reisen). Gemischte Fragetypen: Multiple-Choice, Fehlersuche in Runbooks, Szenario-basierte 'Was machst du als Nächstes?'-Fragen. Keine Trivia."
                  : "Remote proctored via browser (no travel). Mixed question types: multiple-choice, error-finding in runbooks, scenario-based 'what's your next step?' questions. No trivia.",
              },
              {
                q: isDE ? "Wie bereite ich mich vor?" : "How do I prepare?",
                a: isDE
                  ? "Du bekommst mit Registrierung 6 Monate kostenlosen Pro-Zugang zum Runbook-Katalog. Offizieller Study-Guide mit Topic-Map + Übungsprüfungen kommt 8 Wochen vor Prüfungstermin."
                  : "On registration you get 6 months of free Pro access to the runbook catalog. Official study guide with topic map + practice exams sent 8 weeks before exam date.",
              },
              {
                q: isDE ? "Was wenn ich durchfalle?" : "What if I fail?",
                a: isDE
                  ? "Du kannst den Retake (mit reduzierter Gebühr) jederzeit buchen. Wartezeit: 14 Tage ab erstem Versuch. Wir geben individuelles Feedback, welche Topics du vertiefen solltest."
                  : "You can book the retake (with reduced fee) anytime. Waiting period: 14 days after first attempt. We give individual feedback on which topics to focus on.",
              },
              {
                q: isDE ? "Wird das Zertifikat international anerkannt?" : "Is the certificate internationally recognized?",
                a: isDE
                  ? "ClawGuru Certified Defender wird von 300+ Firmen in DACH + EU in Job-Ausschreibungen gelistet. Für US-Märkte wird noch ein Mapping zu CISSP/CompTIA Security+ aufgebaut (Q4 2026)."
                  : "ClawGuru Certified Defender is listed in job postings by 300+ companies in DACH + EU. A mapping to CISSP/CompTIA Security+ is in development for US markets (Q4 2026).",
              },
            ].map((item, i) => (
              <details key={i} className="bg-gray-900 border border-gray-800 rounded-lg p-5 group">
                <summary className="font-semibold text-gray-100 cursor-pointer list-none flex items-center justify-between">
                  <span>{item.q}</span>
                  <span className="text-cyan-400 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-sm text-gray-400 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="mb-14">
          <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 border border-cyan-700/50 rounded-2xl p-10 text-center">
            <Shield className="h-12 w-12 text-cyan-400 mx-auto mb-4" aria-hidden />
            <h2 className="text-3xl font-bold text-white mb-3">
              {isDE ? "Werde ein Certified Defender." : "Become a Certified Defender."}
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              {isDE
                ? "Q3 2026 Launch. Early-Bird-Warteliste = 20% Rabatt + 6 Monate Pro-Zugang sofort."
                : "Q3 2026 launch. Early-bird waitlist = 20% off + instant 6-month Pro access."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`mailto:certification@clawguru.org?subject=${encodeURIComponent(
                  isDE ? "Defender-Cert Warteliste" : "Defender Cert waitlist"
                )}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-black shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all"
              >
                <Award className="h-4 w-4" aria-hidden />
                {isDE ? "Warteliste — Early Bird" : "Join waitlist — early bird"}
              </a>
              <BookingButton
                type="demo"
                label={isDE ? "Team-Zertifizierung" : "Team certification"}
                locale={locale}
                source="defender_cert_final_cta"
                variant="secondary"
              />
            </div>
          </div>
        </section>

        <AuthorBox locale={locale} variant="full" className="mt-12" />
      </div>
    </div>
  )
}
