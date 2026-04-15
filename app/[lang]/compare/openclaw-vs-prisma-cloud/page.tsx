import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/compare/openclaw-vs-prisma-cloud"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "OpenClaw vs Prisma Cloud: Security-Vergleich 2026 | ClawGuru"
    : "OpenClaw vs Prisma Cloud: Security Comparison 2026 | ClawGuru"
  const description = isDE
    ? "OpenClaw vs Prisma Cloud im Security-Vergleich: Self-Hosted vs SaaS, CSPM, Container Security, Kosten und GDPR-Compliance im direkten Vergleich 2026."
    : "OpenClaw vs Prisma Cloud security comparison: self-hosted vs SaaS, CSPM, container security, cost and GDPR compliance compared 2026."
  return {
    title, description,
    keywords: ["openclaw vs prisma cloud", "prisma cloud alternative", "self-hosted cspm", "openclaw security", "prisma cloud comparison 2026"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const COMPARISON = [
  { feature: "Deployment", openclaw: "100% Self-Hosted", prisma: "SaaS (Palo Alto cloud)", winner: "openclaw" },
  { feature: "GDPR / Data Sovereignty", openclaw: "Full control, on-premises", prisma: "Data sent to Palo Alto cloud", winner: "openclaw" },
  { feature: "Cost (annual)", openclaw: "Infrastructure cost only", prisma: "$100k–$500k+/year", winner: "openclaw" },
  { feature: "CSPM Coverage", openclaw: "Self-hosted infra focused", prisma: "AWS, Azure, GCP, multi-cloud", winner: "prisma" },
  { feature: "Container Security", openclaw: "Docker, Kubernetes, native", prisma: "Broad container support", winner: "tie" },
  { feature: "AI Security Features", openclaw: "Moltbot AI agent security", prisma: "AI Security Posture (limited)", winner: "openclaw" },
  { feature: "Compliance Reports", openclaw: "Custom templates", prisma: "500+ compliance frameworks", winner: "prisma" },
  { feature: "Setup Complexity", openclaw: "Moderate (self-managed)", prisma: "Low (SaaS)", winner: "prisma" },
  { feature: "Vendor Lock-in", openclaw: "None", prisma: "High (Palo Alto ecosystem)", winner: "openclaw" },
  { feature: "Customization", openclaw: "Full code access", prisma: "Limited (SaaS)", winner: "openclaw" },
]

const FAQ = [
  { q: "Is OpenClaw a viable alternative to Prisma Cloud?", a: "Yes, for organizations with specific requirements. OpenClaw excels at: 1) Self-hosted infrastructure security. 2) GDPR/data sovereignty requirements where data cannot leave your environment. 3) Cost-sensitive organizations (Prisma Cloud starts at $100k+/year). 4) Organizations needing deep AI agent security (Moltbot integration). Prisma Cloud excels at: 1) Multi-cloud (AWS, Azure, GCP) coverage. 2) Large compliance report libraries. 3) SaaS convenience with minimal setup. The choice depends on whether SaaS or self-hosted better fits your security model." },
  { q: "What is CSPM and how does OpenClaw compare?", a: "CSPM (Cloud Security Posture Management) continuously monitors cloud infrastructure for misconfigurations. Prisma Cloud is a leading commercial CSPM. OpenClaw focuses on self-hosted infrastructure posture management — it detects misconfigurations in Docker, Kubernetes, bare-metal Linux, and self-hosted services. If your primary infrastructure is self-hosted (not AWS/Azure/GCP), OpenClaw provides comparable coverage. For pure cloud deployments, Prisma Cloud has broader native cloud service coverage." },
  { q: "How much does Prisma Cloud cost vs OpenClaw?", a: "Prisma Cloud pricing starts at approximately $100,000-500,000/year depending on modules and credits. OpenClaw is self-hosted — costs are your infrastructure (typically $5,000-50,000/year for hardware/VMs). The cost difference is significant. For 100 servers: Prisma Cloud ~$150k/year vs OpenClaw ~$20k/year infrastructure. The tradeoff: Prisma Cloud includes managed updates, support, and SaaS convenience. OpenClaw requires your team to manage and maintain the platform." },
  { q: "Can OpenClaw cover multi-cloud environments?", a: "OpenClaw is primarily designed for self-hosted infrastructure but can monitor cloud VMs when the OpenClaw agent is installed. For native cloud service monitoring (S3 bucket policies, IAM misconfigurations, Azure RBAC), you would need additional tooling (e.g., Prowler, ScoutSuite, or cloud-native security tools) alongside OpenClaw. For truly multi-cloud SaaS-managed CSPM, Prisma Cloud has a stronger native cloud integration story." },
]

export default function OpenclawVsPrismaCloudPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Compare", item: `${SITE_URL}/${locale}/compare` },
      { "@type": "ListItem", position: 3, name: "OpenClaw vs Prisma Cloud", item: `${SITE_URL}/${locale}${PATH}` },
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
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Compare · Batch 16</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "OpenClaw vs Prisma Cloud" : "OpenClaw vs Prisma Cloud"}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {isDE
            ? "Prisma Cloud kostet ab 100.000€/Jahr und schickt deine Daten in die Palo-Alto-Cloud. OpenClaw läuft selbst gehostet, kostet einen Bruchteil und gibt dir volle Datensouveränität."
            : "Prisma Cloud starts at $100k/year and sends your data to the Palo Alto cloud. OpenClaw runs self-hosted, costs a fraction of that, and gives you full data sovereignty."}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Feature-Vergleich" : "Feature Comparison"}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">{isDE ? "Merkmal" : "Feature"}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase">OpenClaw</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Prisma Cloud</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={i} className={`border-b border-gray-700 ${i % 2 === 0 ? "" : "bg-gray-800/50"}`}>
                    <td className="px-6 py-3 text-sm font-medium text-gray-300">{row.feature}</td>
                    <td className="px-6 py-3 text-sm">
                      <span className={row.winner === "openclaw" ? "text-green-400 font-semibold" : "text-gray-300"}>{row.openclaw}</span>
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <span className={row.winner === "prisma" ? "text-green-400 font-semibold" : "text-gray-300"}>{row.prisma}</span>
                    </td>
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
            <a href={`/${locale}/compare/clawguru-vs-wiz-code`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">ClawGuru vs Wiz Code</div>
              <div className="text-sm text-gray-300">{isDE ? "Wiz-Vergleich" : "Wiz comparison"}</div>
            </a>
            <a href={`/${locale}/compare/moltbot-vs-langchain-agents`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Moltbot vs LangChain Agents</div>
              <div className="text-sm text-gray-300">{isDE ? "AI-Agent-Vergleich" : "AI agent comparison"}</div>
            </a>
            <a href={`/${locale}/openclaw`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">OpenClaw Security Framework</div>
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
