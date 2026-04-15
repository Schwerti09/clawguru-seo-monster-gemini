import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/compare/clawguru-vs-wiz-code"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "ClawGuru vs Wiz Code: Vergleich | ClawGuru Compare"
    : "ClawGuru vs Wiz Code: Comparison | ClawGuru Compare"
  const description = isDE
    ? "ClawGuru vs Wiz Code: Self-Hosted vs Cloud. Deployment, Security, Compliance, Pricing und Control vergleichen. Executable Runbooks für Self-Hosted Security-Checks."
    : "ClawGuru vs Wiz Code: Self-Hosted vs Cloud. Compare deployment, security, compliance, pricing and control. Executable runbooks for self-hosted security checks."
  return {
    title, description,
    keywords: ["clawguru vs wiz code", "self-hosted security", "wiz code security", "cloud security comparison", "clawguru security", "wiz pricing"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const COMPARISON = [
  { category: "Deployment", clawguru: "Self-Hosted on your infrastructure", wiz: "SaaS cloud platform" },
  { category: "Data Privacy", clawguru: "Code never leaves your infrastructure", wiz: "Code analyzed in Wiz cloud" },
  { category: "Compliance", clawguru: "Full control over compliance (GDPR, SOC 2)", wiz: "Wiz compliance certifications" },
  { category: "Pricing", clawguru: "Infrastructure costs only (no per-repo fees)", wiz: "Per-repo + per-user pricing" },
  { category: "Custom Rules", clawguru: "Create custom security rules in YAML", wiz: "Limited custom rule capabilities" },
  { category: "Control", clawguru: "Full control over security rules and pipelines", wiz: "Managed security rules" },
  { category: "Security", clawguru: "Hardened by default with OpenClaw framework", wiz: "Wiz security controls" },
  { category: "Vendor Lock-in", clawguru: "No vendor lock-in (open-source)", wiz: "Wiz ecosystem lock-in" },
]

const FAQ = [
  { q: "Which is better for data privacy: ClawGuru or Wiz Code?", a: "ClawGuru is better for data privacy because code never leaves your infrastructure. You have full control over where your code is analyzed and stored. Wiz Code analyzes code in the Wiz cloud, which may not meet your data residency requirements. For organisations with strict data privacy requirements (GDPR, healthcare, finance, government), ClawGuru's self-hosted deployment provides the strongest data privacy guarantees." },
  { q: "How does pricing compare between ClawGuru and Wiz Code?", a: "ClawGuru has no per-repo or per-user fees — you only pay for infrastructure. This makes ClawGuru cost-effective for organisations with many repositories. Wiz Code charges per-repo and per-user pricing. For organisations with hundreds of repositories and developers, ClawGuru can be 5-20x cheaper than Wiz Code. ClawGuru's predictable infrastructure costs also make budgeting easier." },
  { q: "Can I create custom security rules with ClawGuru?", a: "Yes, ClawGuru supports custom security rules defined in YAML. You can create rules for your specific security requirements, industry standards, or internal policies. Wiz Code has limited custom rule capabilities and is primarily focused on pre-built rules. If you need highly customised security rules, ClawGuru is the better choice." },
  { q: "Which is more secure: ClawGuru or Wiz Code?", a: "Both are secure, but in different ways. Wiz Code leverages Wiz's cloud security infrastructure (encryption, IAM, compliance). ClawGuru provides hardened security controls specifically for self-hosted security checks (OpenClaw framework, executable runbooks, audit logging). ClawGuru also gives you full visibility into security controls, while Wiz Code's controls are managed by Wiz. For organisations that need to demonstrate security controls to auditors, ClawGuru's transparency is advantageous." },
]

export default function ClawguruVsWizCodePage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Compare", item: `${SITE_URL}/${locale}/compare` },
      { "@type": "ListItem", position: 3, name: "ClawGuru vs Wiz Code", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Vergleich für eigene Architekturentscheidung." : "Comparison for your own architecture decision."}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Compare · Batch 15</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "ClawGuru vs Wiz Code" : "ClawGuru vs Wiz Code"}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {isDE
            ? "Self-Hosted vs Cloud: Deployment, Security, Compliance, Pricing und Control vergleichen."
            : "Self-Hosted vs Cloud: Compare deployment, security, compliance, pricing and control."}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Vergleichstabelle" : "Comparison Table"}</h2>
          <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">{isDE ? "Kategorie" : "Category"}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">ClawGuru</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Wiz Code</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {COMPARISON.map((c, i) => (
                  <tr key={i} className={i % 2 === 0 ? "" : "bg-gray-800/50"}>
                    <td className="px-6 py-4 text-sm text-gray-300 font-semibold">{c.category}</td>
                    <td className="px-6 py-4 text-sm text-green-400">{c.clawguru}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{c.wiz}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Häufige Fragen" : "Frequently Asked Questions"}</h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <details key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <summary className="font-semibold text-gray-100 cursor-pointer">{f.q}</summary>
                <p className="mt-3 text-sm text-gray-300 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Weiterführende Ressourcen" : "Further Resources"}</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/openclaw/openclaw-security-2026`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">OpenClaw Security 2026</div>
              <div className="text-sm text-gray-300">{isDE ? "OpenClaw-Framework" : "OpenClaw framework"}</div>
            </a>
            <a href={`/${locale}/solutions/soc2-compliance-automation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">SOC 2 Compliance Automation</div>
              <div className="text-sm text-gray-300">{isDE ? "Compliance" : "Compliance"}</div>
            </a>
            <a href={`/${locale}/compare`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">All Comparisons</div>
              <div className="text-sm text-gray-300">{isDE ? "Compare-Übersicht" : "Compare overview"}</div>
            </a>
            <a href={`/${locale}/check`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Security Check</div>
              <div className="text-sm text-gray-300">{isDE ? "Live-Check" : "Live check"}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
