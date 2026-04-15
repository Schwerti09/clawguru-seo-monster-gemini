import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/compare/openclaw-vs-tenable"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "OpenClaw vs Tenable: Security-Vergleich 2026 | ClawGuru"
    : "OpenClaw vs Tenable: Security Comparison 2026 | ClawGuru"
  const description = isDE
    ? "OpenClaw vs Tenable im Security-Vergleich: Self-Hosted vs SaaS, Vulnerability Management, Kosten und GDPR-Compliance. Tenable.io vs OpenClaw direkt verglichen 2026."
    : "OpenClaw vs Tenable security comparison: self-hosted vs SaaS, vulnerability management, cost and GDPR compliance. Tenable.io vs OpenClaw directly compared 2026."
  return {
    title, description,
    keywords: ["openclaw vs tenable", "tenable alternative self-hosted", "tenable io comparison", "vulnerability management self-hosted", "openclaw tenable 2026"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const COMPARISON = [
  { feature: "Deployment", openclaw: "100% Self-Hosted", tenable: "SaaS (Tenable.io) or On-Prem (Tenable.sc)", winner: "tie" },
  { feature: "GDPR / Data Sovereignty", openclaw: "Full control, no cloud", tenable: "Cloud data if using Tenable.io", winner: "openclaw" },
  { feature: "Cost (annual)", openclaw: "Infrastructure only", tenable: "$30k–$200k+/year", winner: "openclaw" },
  { feature: "Vulnerability Coverage", openclaw: "Self-hosted services focused", tenable: "100,000+ plugins, broadest coverage", winner: "tenable" },
  { feature: "CVE Detection Speed", openclaw: "Community-updated plugins", tenable: "0-day coverage, rapid plugin updates", winner: "tenable" },
  { feature: "AI System Scanning", openclaw: "Built-in AI/LLM security checks", tenable: "Limited AI security coverage", winner: "openclaw" },
  { feature: "Container/K8s Security", openclaw: "Native container security", tenable: "Tenable.cs for containers (extra cost)", winner: "openclaw" },
  { feature: "Compliance Reports", openclaw: "Custom templates", tenable: "PCI, HIPAA, CIS, NIST built-in", winner: "tenable" },
  { feature: "Scan Performance", openclaw: "Depends on infra", tenable: "Highly optimized scanners", winner: "tenable" },
  { feature: "Vendor Lock-in", openclaw: "None", tenable: "High (Tenable platform)", winner: "openclaw" },
]

const FAQ = [
  { q: "Is OpenClaw a viable alternative to Tenable for vulnerability management?", a: "OpenClaw and Tenable serve different market segments. Tenable is the industry leader for traditional vulnerability management — broadest CVE coverage, fastest plugin updates, enterprise compliance reports. OpenClaw excels for: self-hosted infrastructure where data sovereignty is required, AI/LLM security scanning, container and Kubernetes native security. For organizations with pure self-hosted infrastructure and GDPR requirements, OpenClaw provides focused coverage at a fraction of the cost. For broad enterprise vulnerability management, Tenable has deeper coverage." },
  { q: "What is the difference between Tenable.io and Tenable.sc?", a: "Tenable.io is the cloud-based SaaS version — easy to set up, no infrastructure to manage, but data sent to Tenable cloud. Tenable.sc (formerly SecurityCenter) is the on-premises version — full data control, but requires infrastructure investment and management. For GDPR-sensitive organizations: Tenable.sc provides data sovereignty. OpenClaw is also on-premises, with lower total cost of ownership and built-in AI security features that Tenable.sc lacks." },
  { q: "How does OpenClaw scan for AI/LLM vulnerabilities that Tenable misses?", a: "Tenable's scanner is designed for traditional CVEs in software packages. AI/LLM vulnerabilities require different detection: prompt injection testing, model configuration security checks, LLM API exposure scanning, AI framework CVE detection, and inference endpoint hardening checks. OpenClaw integrates Moltbot security scanning for these AI-specific vectors — something Tenable's plugin library doesn't cover. Organizations running AI workloads need both traditional vulnerability scanning (Tenable-style) and AI-specific security scanning (OpenClaw/Moltbot)." },
  { q: "What does Tenable cost vs OpenClaw?", a: "Tenable.io pricing starts at approximately $3,000-5,000/year for small deployments and scales to $50,000-200,000+/year for enterprise. Tenable.sc (on-premises) typically starts at $10,000+/year. OpenClaw cost is infrastructure only — for 100 servers, infrastructure costs typically $5,000-20,000/year. Total 3-year cost comparison for 100 servers: Tenable ~$150k-600k vs OpenClaw ~$15k-60k. The tradeoff: Tenable provides broader CVE coverage, managed updates, and enterprise compliance reporting." },
]

export default function OpenclawVsTenablePage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Compare", item: `${SITE_URL}/${locale}/compare` },
      { "@type": "ListItem", position: 3, name: "OpenClaw vs Tenable", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Security-Vergleich für eigene Infrastruktur-Entscheidungen." : "Security comparison to help you choose your own security infrastructure."}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Compare · Batch 17</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "OpenClaw vs Tenable" : "OpenClaw vs Tenable"}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {isDE
            ? "Tenable ist der Industriestandard für Vulnerability Management — aber teuer, cloud-basiert und blind für AI-Security. OpenClaw ist selbst gehostet, günstiger und scannt auch LLM- und Container-Workloads."
            : "Tenable is the industry standard for vulnerability management — but expensive, cloud-based and blind to AI security. OpenClaw is self-hosted, cheaper, and scans LLM and container workloads too."}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Feature-Vergleich" : "Feature Comparison"}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">{isDE ? "Merkmal" : "Feature"}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase">OpenClaw</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Tenable</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={i} className={`border-b border-gray-700 ${i % 2 === 0 ? "" : "bg-gray-800/50"}`}>
                    <td className="px-6 py-3 text-sm font-medium text-gray-300">{row.feature}</td>
                    <td className="px-6 py-3 text-sm"><span className={row.winner === "openclaw" ? "text-green-400 font-semibold" : "text-gray-300"}>{row.openclaw}</span></td>
                    <td className="px-6 py-3 text-sm"><span className={row.winner === "tenable" ? "text-green-400 font-semibold" : "text-gray-300"}>{row.tenable}</span></td>
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
            <a href={`/${locale}/compare/openclaw-vs-prisma-cloud`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">OpenClaw vs Prisma Cloud</div>
              <div className="text-sm text-gray-300">{isDE ? "Prisma-Cloud-Vergleich" : "Prisma Cloud comparison"}</div>
            </a>
            <a href={`/${locale}/compare/moltbot-vs-autogen`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Moltbot vs AutoGen</div>
              <div className="text-sm text-gray-300">{isDE ? "AutoGen-Vergleich" : "AutoGen comparison"}</div>
            </a>
            <a href={`/${locale}/openclaw`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">OpenClaw Framework</div>
              <div className="text-sm text-gray-300">{isDE ? "OpenClaw Docs" : "OpenClaw docs"}</div>
            </a>
            <a href={`/${locale}/compare`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">All Comparisons</div>
              <div className="text-sm text-gray-300">{isDE ? "Alle Vergleiche" : "All comparisons"}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
