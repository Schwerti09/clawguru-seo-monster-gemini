import type { Metadata } from "next"
import Link from "next/link"
import { Shield, Lock, FileCheck, Scale, TrendingUp, Check, AlertTriangle, Building2 } from "lucide-react"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import BookingButton from "@/components/booking/BookingButton"
import RoiCalculator from "@/components/roi/RoiCalculator"
import AuthorBox from "@/components/seo/AuthorBox"
import LastUpdated from "@/components/seo/LastUpdated"
import { buildAuthoredArticleSchema } from "@/lib/seo/author"
import { pick } from "@/lib/i18n-pick"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/for-fintech"
const PUBLISHED = "2026-04-20"
const MODIFIED = "2026-04-20"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const title = pick(isDE, "Security für FinTech — DORA, PSD2, BaFin, MaRisk | ClawGuru", "Security for FinTech — DORA, PSD2, BaFin, MaRisk | ClawGuru")
  const description = pick(isDE, "Security-Compliance für FinTechs und regulierte Finanzdienstleister. DORA-Readiness, PSD2-SCA, BaFin-Audit, MaRisk-Controls. Strategy Call kostenlos.", "Security compliance for FinTechs and regulated financial services. DORA readiness, PSD2-SCA, BaFin audit, MaRisk controls. Free strategy call.")
  return {
    title,
    description,
    keywords: ["fintech security", "dora compliance", "psd2 security", "bafin audit", "marisk", "financial services compliance", "banking security"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const getPains = (isDE: boolean) => [
  {
    icon: Scale,
    title: pick(isDE, "DORA-Deadline läuft", "DORA deadline is running"),
    desc: pick(isDE, "Digital Operational Resilience Act seit 17.01.2025 verpflichtend. ICT-Third-Party-Risk, TLPT, Incident-Reporting — und der Regulator schaut hin.", "Digital Operational Resilience Act mandatory since 17 Jan 2025. ICT third-party risk, TLPT, incident reporting — and the regulator is watching."),
  },
  {
    icon: AlertTriangle,
    title: pick(isDE, "BaFin-Audit = Millionenrisiko", "BaFin audit = millions at risk"),
    desc: pick(isDE, "MaRisk AT 7.2, BAIT, KAIT: Lückenhafte Controls kosten Lizenz oder Millionen-Bußgeld. Post-Wirecard-Enforcement ist real.", "MaRisk AT 7.2, BAIT, KAIT: missing controls cost your license or millions in fines. Post-Wirecard enforcement is real."),
  },
  {
    icon: Lock,
    title: pick(isDE, "PSD2-SCA ist kein Einmal-Projekt", "PSD2-SCA is not a one-off project"),
    desc: pick(isDE, "Strong Customer Authentication muss kontinuierlich gepflegt werden. Neue Angriffsmuster (SIM-Swap, OTP-Phishing) brauchen laufende Controls.", "Strong customer authentication needs continuous maintenance. New attack patterns (SIM-swap, OTP phishing) require ongoing controls."),
  },
  {
    icon: TrendingUp,
    title: pick(isDE, "Sub-Processor-Kaskade außer Kontrolle", "Sub-processor cascade out of control"),
    desc: pick(isDE, "Jeder Cloud-Anbieter, SaaS-Tool, API-Provider = ICT-Third-Party-Risk. DORA fordert vollständiges Register mit Konzentrationsrisiko-Analyse.", "Every cloud vendor, SaaS tool, API provider = ICT third-party risk. DORA requires complete register with concentration-risk analysis."),
  },
]

const getSolutions = (isDE: boolean) => [
  {
    icon: FileCheck,
    title: pick(isDE, "DORA-Compliance-Package", "DORA compliance package"),
    desc: pick(isDE, "Vollständige ICT-Risk-Framework-Dokumentation, TLPT-Scoping, Incident-Classification-Playbook, Third-Party-Register-Template.", "Complete ICT risk framework documentation, TLPT scoping, incident classification playbook, third-party register template."),
  },
  {
    icon: Shield,
    title: pick(isDE, "BaFin/MaRisk/BAIT-Controls", "BaFin/MaRisk/BAIT controls"),
    desc: pick(isDE, "Fertige Control-Library für IT-Governance, Change-Management, Risk-Management, Access-Control — audit-ready, deutsche Regulator-Sprache.", "Pre-built control library for IT governance, change management, risk management, access control — audit-ready, German regulator language."),
  },
  {
    icon: Lock,
    title: pick(isDE, "PSD2-SCA Monitoring & Updates", "PSD2-SCA monitoring & updates"),
    desc: pick(isDE, "Laufende Pflege der SCA-Controls. Neue Attack-Vektoren (SIM-Swap, OTP-Phishing, Call-Center-Social-Engineering) sofort abgedeckt.", "Ongoing SCA control maintenance. New attack vectors (SIM-swap, OTP phishing, call-center social engineering) covered instantly."),
  },
  {
    icon: Building2,
    title: pick(isDE, "Deutsche Regulator-Erfahrung", "German regulator experience"),
    desc: pick(isDE, "Wir kennen BaFin-Prüfer, MaRisk-Auslegung, IT-Prüfungsverband-Praxis. Keine generischen US-SOC-2-Templates übersetzt.", "We know BaFin examiners, MaRisk interpretation, IT-auditing practice. Not generic US SOC 2 templates translated."),
  },
]

const getRegulations = (isDE: boolean) => [
  { name: "DORA", desc: pick(isDE, "Digital Operational Resilience Act — EU-weit", "Digital Operational Resilience Act — EU-wide") },
  { name: "PSD2", desc: pick(isDE, "Payment Services Directive — SCA, TPP-Access", "Payment Services Directive — SCA, TPP access") },
  { name: "MaRisk", desc: pick(isDE, "BaFin Mindestanforderungen an das Risikomanagement", "BaFin minimum requirements for risk management") },
  { name: "BAIT", desc: pick(isDE, "Bankaufsichtliche Anforderungen an die IT", "Banking supervisory requirements for IT") },
  { name: "KAIT", desc: pick(isDE, "Kapitalverwaltungsaufsichtliche Anforderungen IT", "Capital-management supervisory IT requirements") },
  { name: "ISO 27001", desc: pick(isDE, "Information Security Management System", "Information security management system") },
]

export default function ForFintechPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const pains = getPains(isDE)
  const solutions = getSolutions(isDE)
  const regs = getRegulations(isDE)

  const articleSchema = buildAuthoredArticleSchema({
    headline: pick(isDE, "Security für FinTech — DORA, PSD2, BaFin, MaRisk", "Security for FinTech — DORA, PSD2, BaFin, MaRisk"),
    description: pick(isDE, "Security-Compliance für regulierte Finanzdienstleister. DORA-Readiness, PSD2-SCA, BaFin-Audit-Vorbereitung.", "Security compliance for regulated financial services. DORA readiness, PSD2-SCA, BaFin audit preparation."),
    url: `${SITE_URL}/${locale}${PATH}`,
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    inLanguage: locale,
    articleType: "Article",
  })

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href={`/${locale}`} className="hover:text-cyan-400">ClawGuru</Link></li>
            <li>/</li>
            <li className="text-gray-300">{pick(isDE, "Für FinTech", "For FinTech")}</li>
          </ol>
        </nav>

        {/* HERO */}
        <section className="mb-14">
          <div className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold border border-amber-500/30 bg-amber-500/10 text-amber-300">
            {pick(isDE, "Vertikal: FinTech & regulierte Finanzdienstleister", "Vertical: FinTech & regulated financial services")}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
            {pick(isDE, "DORA-Ready. BaFin-Audit-Safe. Ohne Legal-Team in der IT.", "DORA-ready. BaFin-audit-safe. Without a legal team inside IT.")}
          </h1>
          <LastUpdated date={MODIFIED} publishedDate={PUBLISHED} showPublished locale={locale} className="mb-4" />
          <p className="text-lg text-gray-300 max-w-3xl mb-6">
            {pick(isDE, "Fertige Controls für DORA, PSD2, MaRisk, BAIT, KAIT. Deutsche Regulator-Praxis. ICT-Third-Party-Register. TLPT-Scoping. Für FinTechs, Neo-Banken, Payment-Provider, Krypto-Dienstleister.", "Pre-built controls for DORA, PSD2, MaRisk, BAIT, KAIT. German regulator practice. ICT third-party register. TLPT scoping. For FinTechs, neo-banks, payment providers, crypto services.")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <BookingButton
              type="audit"
              label={pick(isDE, "DORA-Readiness Scoping (kostenlos)", "Free DORA readiness scoping")}
              locale={locale}
              source="for_fintech_hero_primary"
              variant="primary"
              subject={pick(isDE, "DORA-Readiness FinTech", "DORA readiness FinTech")}
            />
            <Link
              href={`/${locale}/check`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-white/15 hover:border-cyan-400/40 font-bold text-gray-200 transition-all"
            >
              <Shield className="h-4 w-4" aria-hidden />
              {pick(isDE, "Kostenlosen Security Check starten", "Start free security check")}
            </Link>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            <span>✓ {pick(isDE, "EU-Hosting, DSGVO", "EU-hosted, GDPR")}</span>
            <span>✓ {pick(isDE, "Deutsche Regulator-Erfahrung", "German regulator experience")}</span>
            <span>✓ {pick(isDE, "Audit-ready Dokumentation", "Audit-ready documentation")}</span>
          </div>
        </section>

        {/* REGULATION-PROOF BAR */}
        <section className="mb-14">
          <div className="text-xs font-mono uppercase tracking-widest mb-3 text-amber-400">
            {pick(isDE, "Abgedeckte Regulierungen", "Covered regulations")}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {regs.map((r, i) => (
              <div key={i} className="bg-gradient-to-br from-amber-900/10 to-transparent border border-amber-700/30 rounded-lg p-4">
                <div className="font-bold text-amber-300">{r.name}</div>
                <div className="text-xs text-gray-400 mt-1">{r.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* PROBLEM */}
        <section className="mb-14">
          <div className="text-xs font-mono uppercase tracking-widest mb-2 text-red-400">
            {pick(isDE, "FinTech-Realität 2026", "FinTech reality 2026")}
          </div>
          <h2 className="text-3xl font-bold text-white mb-6">
            {pick(isDE, "Warum dein CTO nachts wach liegt", "Why your CTO isn't sleeping")}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {pains.map((p, i) => {
              const Icon = p.icon
              return (
                <div key={i} className="bg-gray-900 border border-red-900/40 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 bg-red-900/30 p-2 rounded-lg">
                      <Icon className="h-5 w-5 text-red-400" aria-hidden />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-100 mb-2">{p.title}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* SOLUTION */}
        <section className="mb-14">
          <div className="text-xs font-mono uppercase tracking-widest mb-2 text-amber-400">
            {pick(isDE, "Mit ClawGuru FinTech-Pack", "With ClawGuru FinTech pack")}
          </div>
          <h2 className="text-3xl font-bold text-white mb-6">
            {pick(isDE, "Regulator-ready in Monaten, nicht Jahren", "Regulator-ready in months, not years")}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {solutions.map((s, i) => {
              const Icon = s.icon
              return (
                <div key={i} className="bg-gray-900 border border-amber-900/40 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 bg-amber-900/30 p-2 rounded-lg">
                      <Icon className="h-5 w-5 text-amber-400" aria-hidden />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-100 mb-2">{s.title}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* PRICING */}
        <section className="mb-14">
          <div className="text-xs font-mono uppercase tracking-widest mb-2 text-amber-400">
            {pick(isDE, "Engagement-Modell", "Engagement model")}
          </div>
          <h2 className="text-3xl font-bold text-white mb-6">
            {pick(isDE, "FinTech Security Engagement", "FinTech Security Engagement")}
          </h2>
          <div className="bg-gradient-to-br from-amber-900/20 to-cyan-900/10 border-2 border-amber-500/40 rounded-2xl p-8 max-w-3xl">
            <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
              <div>
                <div className="text-sm text-amber-400 font-semibold">{pick(isDE, "6-Monate-Retainer", "6-month retainer")}</div>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {pick(isDE, "DORA + MaRisk Full-Stack", "DORA + MaRisk Full-Stack")}
                </h3>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-amber-300">{pick(isDE, "ab €45.000", "from €45,000")}</div>
                <div className="text-xs text-gray-400">{pick(isDE, "Fixed Fee", "fixed fee")}</div>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-gray-300 mb-6">
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />{pick(isDE, "DORA ICT-Risk-Framework komplett dokumentiert", "DORA ICT risk framework fully documented")}</li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />{pick(isDE, "MaRisk AT 7.2 + BAIT-Controls implementiert", "MaRisk AT 7.2 + BAIT controls implemented")}</li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />{pick(isDE, "PSD2-SCA Monitoring & Update-Loop", "PSD2-SCA monitoring & update loop")}</li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />{pick(isDE, "ICT-Third-Party-Register + Konzentrationsrisiko-Analyse", "ICT third-party register + concentration-risk analysis")}</li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />{pick(isDE, "Incident-Classification & Reporting-Playbook", "Incident classification & reporting playbook")}</li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />{pick(isDE, "TLPT-Scoping-Dokument", "TLPT scoping document")}</li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />{pick(isDE, "BaFin-Prüfungs-Vorbereitung (Dry-Run)", "BaFin examination prep (dry run)")}</li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />{pick(isDE, "Monatliche Office-Hours mit SecOps- und Compliance-Experten", "Monthly office hours with SecOps and compliance experts")}</li>
            </ul>
            <BookingButton
              type="audit"
              label={pick(isDE, "DORA-Scoping Call buchen", "Book DORA scoping call")}
              locale={locale}
              source="for_fintech_pricing"
              variant="primary"
              subject={pick(isDE, "FinTech DORA + MaRisk Engagement", "FinTech DORA + MaRisk engagement")}
              className="w-full justify-center"
            />
            <p className="text-xs text-gray-500 text-center mt-3">
              {pick(isDE, "Enterprise-Projekt (Bank, BaFin-Volllizenz)? ", "Enterprise project (bank, full BaFin license)? ")}
              <span className="text-amber-400">{pick(isDE, "Individuelle Preise nach Scoping.", "Custom pricing after scoping.")}</span>
            </p>
          </div>
        </section>

        {/* ROI Calculator */}
        <section className="mb-14">
          <div className="text-xs font-mono uppercase tracking-widest mb-2 text-amber-400">
            {pick(isDE, "DORA-Readiness Kostenrechner", "DORA readiness cost calculator")}
          </div>
          <h2 className="text-3xl font-bold text-white mb-6">
            {pick(isDE, "Was kostet dich DORA-Non-Compliance?", "What does DORA non-compliance cost you?")}
          </h2>
          <RoiCalculator locale={locale} source="for_fintech_embed" />
        </section>

        {/* FINAL CTA */}
        <section className="mb-14">
          <div className="bg-gradient-to-r from-amber-900/30 to-cyan-900/30 border border-amber-700/50 rounded-2xl p-10 text-center">
            <h2 className="text-3xl font-bold text-white mb-3">
              {pick(isDE, "DORA-Deadline tickt. Starten wir?", "DORA deadline is ticking. Shall we start?")}
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              {pick(isDE, "30-min Scoping Call: Wir identifizieren deine Top-5 Compliance-Lücken und geben konkreten Next-Step-Plan.", "30-min scoping call: we identify your top-5 compliance gaps and give a concrete next-step plan.")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={`/${locale}/check`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-black shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all"
              >
                <Shield className="h-4 w-4" aria-hidden />
                {pick(isDE, "Free Security Check", "Free Security Check")}
              </Link>
              <BookingButton
                type="audit"
                label={pick(isDE, "DORA-Scoping buchen", "Book DORA scoping")}
                locale={locale}
                source="for_fintech_final_cta"
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
