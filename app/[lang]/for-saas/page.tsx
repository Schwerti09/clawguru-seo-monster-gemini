import type { Metadata } from "next"
import Link from "next/link"
import { Shield, Zap, Lock, Users, TrendingUp, Check, AlertTriangle } from "lucide-react"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import BookingButton from "@/components/booking/BookingButton"
import RoiCalculator from "@/components/roi/RoiCalculator"
import AuthorBox from "@/components/seo/AuthorBox"
import LastUpdated from "@/components/seo/LastUpdated"
import { buildAuthoredArticleSchema } from "@/lib/seo/author"
import { pick } from "@/lib/i18n-pick"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/for-saas"
const PUBLISHED = "2026-04-20"
const MODIFIED = "2026-04-20"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const title = pick(isDE, "Security für SaaS-Companies — SOC 2, GDPR, Zero-Trust | ClawGuru", "Security for SaaS Companies — SOC 2, GDPR, Zero-Trust | ClawGuru")
  const description = pick(isDE, "Security-Hardening für B2B-SaaS. SOC 2 Type II, GDPR-Compliance, Multi-Tenant-Isolation, Customer-Audit-Survival. Strategy Call kostenlos.", "Security hardening for B2B SaaS. SOC 2 Type II, GDPR compliance, multi-tenant isolation, customer audit survival. Free strategy call.")
  return {
    title,
    description,
    keywords: ["saas security", "soc 2 compliance", "gdpr saas", "multi-tenant security", "saas audit", "customer security questionnaire"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const getPains = (isDE: boolean) => [
  {
    icon: AlertTriangle,
    title: pick(isDE, "Security-Questionnaire-Hölle", "Security-questionnaire hell"),
    desc: pick(isDE, "Jeder Enterprise-Kunde schickt dir 200+ Fragen. Dein Team verbringt Wochen mit Copy-Paste statt Produkt-Entwicklung.", "Every enterprise customer sends 200+ questions. Your team wastes weeks on copy-paste instead of shipping product."),
  },
  {
    icon: Lock,
    title: pick(isDE, "Multi-Tenant-Leaks = Existenzbedrohung", "Multi-tenant leaks = existential threat"),
    desc: pick(isDE, "Ein einziger Cross-Tenant-Bug killt das Vertrauen. 73% der SaaS-Breaches kommen aus falsch konfigurierter Isolation.", "One cross-tenant bug destroys trust. 73% of SaaS breaches come from misconfigured isolation."),
  },
  {
    icon: TrendingUp,
    title: pick(isDE, "SOC 2 Audit blockt Deals", "SOC 2 audit blocks deals"),
    desc: pick(isDE, "Ohne SOC 2 Type II: kein Enterprise-Kunde. Mit SOC 2: 9-12 Monate Vorbereitung, €50k+ Aufwand.", "Without SOC 2 Type II: no enterprise customer. With SOC 2: 9-12 months prep, €50k+ effort."),
  },
  {
    icon: Users,
    title: pick(isDE, "DevOps-Team überlastet", "DevOps team overloaded"),
    desc: pick(isDE, "Security-Arbeit zieht deine 2-3 besten Engineers aus Feature-Arbeit. ROI negativ.", "Security work pulls your 2-3 best engineers off feature work. ROI negative."),
  },
]

const getSolutions = (isDE: boolean) => [
  {
    icon: Shield,
    title: pick(isDE, "Audit-Ready in 90 Tagen", "Audit-ready in 90 days"),
    desc: pick(isDE, "Fertige SOC 2 Controls Playbooks, GDPR DPAs, Customer-Questionnaire-Bibliothek. Kein Wheel-Reinvention.", "Pre-built SOC 2 control playbooks, GDPR DPAs, customer questionnaire library. No wheel-reinvention."),
  },
  {
    icon: Lock,
    title: pick(isDE, "Multi-Tenant-Hardening Playbook", "Multi-tenant hardening playbook"),
    desc: pick(isDE, "47 Runbooks für Row-Level Security, JWT-Isolation, Rate-Limiting pro Tenant, audit-ready Logging.", "47 runbooks for row-level security, JWT isolation, per-tenant rate limits, audit-ready logging."),
  },
  {
    icon: Zap,
    title: pick(isDE, "Customer-Security-Portal", "Customer security portal"),
    desc: pick(isDE, "Ein shareable Trust-Page-Template mit SOC 2 Badge, Pentest-Reports, Sub-Processors-Liste. Schließt Deals schneller.", "A shareable trust-page template with SOC 2 badge, pentest reports, sub-processors list. Closes deals faster."),
  },
  {
    icon: Users,
    title: pick(isDE, "Ohne Engineering-Team-Drain", "Without engineering-team drain"),
    desc: pick(isDE, "Fixed-Fee Consulting statt Vollzeit-SecOps-Hire. 5-10× günstiger für Series-A/B SaaS.", "Fixed-fee consulting instead of full-time SecOps hire. 5-10× cheaper for Series A/B SaaS."),
  },
]

const getProof = (isDE: boolean) => [
  { metric: "90d", label: pick(isDE, "Audit-Ready statt 9 Monate", "Audit-ready vs 9 months") },
  { metric: "€50k+", label: pick(isDE, "Gespart vs interne SOC 2", "Saved vs internal SOC 2") },
  { metric: "47", label: pick(isDE, "Runbooks Multi-Tenant", "Runbooks multi-tenant") },
  { metric: "4.2M+", label: pick(isDE, "Expert-Reviewed Runbooks total", "Expert-reviewed runbooks total") },
]

export default function ForSaasPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const pains = getPains(isDE)
  const solutions = getSolutions(isDE)
  const proof = getProof(isDE)

  const articleSchema = buildAuthoredArticleSchema({
    headline: pick(isDE, "Security für SaaS-Companies — SOC 2, GDPR, Zero-Trust", "Security for SaaS Companies — SOC 2, GDPR, Zero-Trust"),
    description: pick(isDE, "Audit-Readiness, Multi-Tenant-Hardening und Customer-Questionnaire-Survival für B2B-SaaS.", "Audit-readiness, multi-tenant hardening, and customer-questionnaire survival for B2B SaaS."),
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
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href={`/${locale}`} className="hover:text-cyan-400">ClawGuru</Link></li>
            <li>/</li>
            <li className="text-gray-300">{pick(isDE, "Für SaaS", "For SaaS")}</li>
          </ol>
        </nav>

        {/* HERO — Twin-Track CTAs */}
        <section className="mb-14">
          <div className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
            {pick(isDE, "Vertikal: B2B-SaaS", "Vertical: B2B SaaS")}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
            {pick(isDE, "Security, die Enterprise-Deals schließt — nicht deine Engineers bindet", "Security that closes enterprise deals — without pulling your engineers")}
          </h1>
          <LastUpdated date={MODIFIED} publishedDate={PUBLISHED} showPublished locale={locale} className="mb-4" />
          <p className="text-lg text-gray-300 max-w-3xl mb-6">
            {pick(isDE, "SOC 2 Type II in 90 Tagen. GDPR-konforme Multi-Tenant-Isolation. Customer-Security-Questionnaires vorgefertigt. Ohne Vollzeit-SecOps-Hire.", "SOC 2 Type II in 90 days. GDPR-compliant multi-tenant isolation. Customer security questionnaires pre-built. Without a full-time SecOps hire.")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <BookingButton
              type="audit"
              label={pick(isDE, "SOC 2 Scoping Call (kostenlos)", "Free SOC 2 scoping call")}
              locale={locale}
              source="for_saas_hero_primary"
              variant="primary"
              subject={pick(isDE, "SOC 2 Audit-Readiness SaaS", "SOC 2 audit-readiness SaaS")}
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
            <span>✓ {pick(isDE, "Keine Kreditkarte", "No credit card")}</span>
            <span>✓ {pick(isDE, "In 30 Sekunden", "30 seconds")}</span>
            <span>✓ {pick(isDE, "EU-Hosting, DSGVO", "EU-hosted, GDPR")}</span>
          </div>
        </section>

        {/* SOCIAL PROOF BAR */}
        <section className="mb-14 grid grid-cols-2 md:grid-cols-4 gap-4">
          {proof.map((p, i) => (
            <div key={i} className="bg-gradient-to-br from-cyan-900/20 to-transparent border border-cyan-700/30 rounded-lg p-4 text-center">
              <div className="text-2xl sm:text-3xl font-black text-cyan-300">{p.metric}</div>
              <div className="text-xs text-gray-400 mt-1">{p.label}</div>
            </div>
          ))}
        </section>

        {/* PROBLEM — Pain points */}
        <section className="mb-14">
          <div className="text-xs font-mono uppercase tracking-widest mb-2 text-red-400">
            {pick(isDE, "SaaS-Security heute", "SaaS security today")}
          </div>
          <h2 className="text-3xl font-bold text-white mb-6">
            {pick(isDE, "Warum Security dich ausbremst", "Why security slows you down")}
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

        {/* SOLUTION — How ClawGuru solves it */}
        <section className="mb-14">
          <div className="text-xs font-mono uppercase tracking-widest mb-2 text-cyan-400">
            {pick(isDE, "Mit ClawGuru", "With ClawGuru")}
          </div>
          <h2 className="text-3xl font-bold text-white mb-6">
            {pick(isDE, "Security, die Deals beschleunigt", "Security that accelerates deals")}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {solutions.map((s, i) => {
              const Icon = s.icon
              return (
                <div key={i} className="bg-gray-900 border border-cyan-900/40 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 bg-cyan-900/30 p-2 rounded-lg">
                      <Icon className="h-5 w-5 text-cyan-400" aria-hidden />
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

        {/* WHAT YOU GET — concrete deliverables */}
        <section className="mb-14">
          <h2 className="text-3xl font-bold text-white mb-6">
            {pick(isDE, "Was du konkret bekommst", "What you actually get")}
          </h2>
          <div className="bg-gradient-to-br from-cyan-900/10 to-purple-900/10 border border-cyan-700/30 rounded-2xl p-8">
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                pick(isDE, "SOC 2 Type II Readiness Assessment", "SOC 2 Type II readiness assessment"),
                pick(isDE, "GDPR Data Processing Agreement Templates", "GDPR data processing agreement templates"),
                pick(isDE, "47 Multi-Tenant-Hardening Runbooks", "47 multi-tenant hardening runbooks"),
                pick(isDE, "Customer Security Questionnaire Bibliothek (200+ Antworten)", "Customer security questionnaire library (200+ answers)"),
                pick(isDE, "Pentest-Report-Template & Remediation-Tracker", "Pentest report template & remediation tracker"),
                pick(isDE, "Sub-Processor-Management-Playbook", "Sub-processor management playbook"),
                pick(isDE, "Incident-Response-Playbooks (DSGVO-konform)", "Incident response playbooks (GDPR-compliant)"),
                pick(isDE, "Quarterly Security-Review Template", "Quarterly security review template"),
                pick(isDE, "Trust-Page-Template für deine Customer", "Customer-facing trust page template"),
                pick(isDE, "Live Office-Hours mit SecOps-Experten", "Live office hours with SecOps experts"),
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-200">
                  <Check className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" aria-hidden />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING — single focused offer */}
        <section className="mb-14">
          <div className="text-xs font-mono uppercase tracking-widest mb-2 text-cyan-400">
            {pick(isDE, "Fixed-Fee Pricing", "Fixed-fee pricing")}
          </div>
          <h2 className="text-3xl font-bold text-white mb-6">
            {pick(isDE, "SaaS Security Package", "SaaS Security Package")}
          </h2>
          <div className="bg-gray-900 border-2 border-cyan-500/50 rounded-2xl p-8 max-w-2xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm text-cyan-400 font-semibold">{pick(isDE, "90 Tage Engagement", "90-day engagement")}</div>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {pick(isDE, "SOC 2 + GDPR Full-Stack", "SOC 2 + GDPR Full-Stack")}
                </h3>
              </div>
              <div className="text-right">
                <div className="text-4xl font-black text-cyan-300">€15.000</div>
                <div className="text-xs text-gray-400">{pick(isDE, "Fixed Fee", "fixed fee")}</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-6">
              {pick(isDE, "Alles oben enthalten. Zahlbar in 3 Raten. 30-Tage-Geld-zurück bei unzureichenden Fortschritten. Für Series A/B SaaS.", "Everything above included. Payable in 3 installments. 30-day money-back if insufficient progress. For Series A/B SaaS.")}
            </p>
            <BookingButton
              type="audit"
              label={pick(isDE, "Scoping Call buchen (30 Min, kostenlos)", "Book scoping call (30 min, free)")}
              locale={locale}
              source="for_saas_pricing"
              variant="primary"
              subject={pick(isDE, "SaaS Security Package — Scoping", "SaaS Security Package — Scoping")}
              className="w-full justify-center"
            />
            <p className="text-xs text-gray-500 text-center mt-3">
              {pick(isDE, "Noch keine Bereitschaft? ", "Not ready yet? ")}
              <Link href={`/${locale}/check`} className="text-cyan-400 hover:text-cyan-300 underline">
                {pick(isDE, "Starte mit kostenlosem Security Check →", "Start with a free security check →")}
              </Link>
            </p>
          </div>
        </section>

        {/* ROI Calculator — embed for high-intent visitors */}
        <section className="mb-14">
          <div className="text-xs font-mono uppercase tracking-widest mb-2 text-cyan-400">
            {pick(isDE, "Rechne selbst nach", "Run the numbers yourself")}
          </div>
          <h2 className="text-3xl font-bold text-white mb-6">
            {pick(isDE, "Was kostet dich dein aktueller Status Quo?", "What is your current status quo costing you?")}
          </h2>
          <RoiCalculator locale={locale} source="for_saas_embed" />
        </section>

        {/* FAQ — objection removal */}
        <section className="mb-14">
          <h2 className="text-3xl font-bold text-white mb-6">
            {pick(isDE, "Häufige Fragen", "Frequently asked")}
          </h2>
          <div className="space-y-4">
            {[
              {
                q: pick(isDE, "Wir haben schon einen SOC 2 Berater — warum ClawGuru?", "We already have a SOC 2 consultant — why ClawGuru?"),
                a: pick(isDE, "Die meisten SOC 2 Berater decken nur den Audit-Prozess ab, nicht die technische Implementierung. Wir liefern die Runbooks, die dein DevOps-Team tatsächlich ausführt — nicht nur die Policy-Dokumente.", "Most SOC 2 consultants cover only the audit process, not the technical implementation. We deliver the runbooks your DevOps team actually runs — not just policy documents."),
              },
              {
                q: pick(isDE, "Was wenn wir noch nicht audit-ready sind?", "What if we're not audit-ready yet?"),
                a: pick(isDE, "Genau dafür existiert das 90-Tage-Package. Wir starten mit einem Gap-Assessment (Woche 1), priorisieren die Top-10-Risks (Woche 2-4) und arbeiten dich systematisch zum Audit (Woche 5-12).", "That's exactly what the 90-day package is for. We start with a gap assessment (week 1), prioritize the top-10 risks (weeks 2-4), and systematically drive you to audit (weeks 5-12)."),
              },
              {
                q: pick(isDE, "Können wir mit einem kleineren Commitment starten?", "Can we start with a smaller commitment?"),
                a: pick(isDE, "Ja — der kostenlose Security Check zeigt dir in 30 Sekunden deine 3 größten Risiken. Der Strategy Call (kostenlos, 30 Min) gibt konkrete Next-Steps ohne Vertrag.", "Yes — the free security check shows your top 3 risks in 30 seconds. The strategy call (free, 30 min) gives concrete next steps without contract."),
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

        {/* FINAL CTA — Twin track */}
        <section className="mb-14">
          <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 border border-cyan-700/50 rounded-2xl p-10 text-center">
            <h2 className="text-3xl font-bold text-white mb-3">
              {pick(isDE, "Bereit, Enterprise-Deals schneller zu schließen?", "Ready to close enterprise deals faster?")}
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              {pick(isDE, "Starte mit dem kostenlosen Check. Oder buche direkt den Scoping Call.", "Start with the free check. Or book a scoping call directly.")}
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
                label={pick(isDE, "Scoping Call buchen", "Book scoping call")}
                locale={locale}
                source="for_saas_final_cta"
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
