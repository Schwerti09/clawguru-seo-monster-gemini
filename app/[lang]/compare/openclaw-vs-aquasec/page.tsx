import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/compare/openclaw-vs-aquasec"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "OpenClaw vs Aqua Security: Security-Vergleich 2026 | ClawGuru", "OpenClaw vs Aqua Security: Security Comparison 2026 | ClawGuru")
  const description = pick(isDE, "OpenClaw vs Aqua Security im Container-Security-Vergleich: Self-Hosted vs SaaS, Kubernetes-Security, CSPM und AI-Workload-Schutz direkt verglichen 2026.", "OpenClaw vs Aqua Security container security comparison: self-hosted vs SaaS, Kubernetes security, CSPM and AI workload protection compared 2026.")
  return {
    title, description,
    keywords: ["openclaw vs aquasec", "aqua security alternative", "container security comparison 2026", "kubernetes security self-hosted", "aqua security vs openclaw"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const COMPARISON = [
  { feature: "Deployment", openclaw: "100% Self-Hosted", aquasec: "SaaS or on-premises", winner: "tie" },
  { feature: "GDPR / Data Sovereignty", openclaw: "Full control, no cloud", aquasec: "Cloud data risk with SaaS", winner: "openclaw" },
  { feature: "Container Scanning", openclaw: "Native container/image scanning", aquasec: "Industry-leading image scanning", winner: "aquasec" },
  { feature: "Kubernetes Security", openclaw: "K8s native security checks", aquasec: "Deep Kubernetes integration (Aqua Kube-Bench)", winner: "aquasec" },
  { feature: "AI Workload Security", openclaw: "Built-in AI/LLM scanning", aquasec: "Limited AI security coverage", winner: "openclaw" },
  { feature: "Runtime Protection", openclaw: "Rule-based runtime monitoring", aquasec: "Advanced behavioral runtime protection", winner: "aquasec" },
  { feature: "CSPM (Cloud Security Posture)", openclaw: "Self-hosted infra focus", aquasec: "Full multi-cloud CSPM", winner: "aquasec" },
  { feature: "Cost", openclaw: "Infrastructure only", aquasec: "$50k–$500k+/year", winner: "openclaw" },
  { feature: "Vendor Lock-in", openclaw: "None", aquasec: "High (Aqua platform)", winner: "openclaw" },
  { feature: "Compliance Reports", openclaw: "Custom templates", aquasec: "PCI, HIPAA, CIS, SOC2 built-in", winner: "aquasec" },
]

const FAQ = [
  { q: "What is Aqua Security and how does it compare to OpenClaw?", a: "Aqua Security is an enterprise cloud-native security platform focused on containers, Kubernetes, and serverless. It provides image scanning, runtime protection, CSPM, and compliance reporting. OpenClaw is a self-hosted security scanner focused on infrastructure hardening, vulnerability detection, and AI workload security. Key differences: Aqua has broader container/K8s security depth and enterprise compliance features. OpenClaw has no vendor lock-in, lower cost, and built-in AI security scanning that Aqua lacks. Organizations with cloud-native infrastructure and enterprise compliance requirements often choose Aqua; self-hosted-first organizations with cost sensitivity and AI workloads choose OpenClaw." },
  { q: "Is Aqua Security worth the cost?", a: "Aqua Security pricing typically starts at $50,000-100,000/year for enterprise and scales to $500,000+. It is worth the cost if: 1) You have large-scale Kubernetes deployments (1000+ pods). 2) You need enterprise compliance reports (PCI, HIPAA, SOC2) out of the box. 3) You need advanced runtime behavioral protection. 4) You have a dedicated security team to operate the platform. It may not be worth the cost if: 1) Self-hosted infrastructure with fewer containers. 2) Cost sensitivity is high. 3) AI workload security is a priority (Aqua covers this poorly). 4) You want to avoid vendor lock-in." },
  { q: "How does OpenClaw scan AI workloads that Aqua Security misses?", a: "Aqua Security's scanner is designed for container images and Kubernetes configurations — it detects OS CVEs, misconfigurations, and compliance gaps. It does not scan for AI-specific security issues: prompt injection vulnerabilities, LLM API exposure, AI framework CVEs (PyTorch, Transformers, vLLM), model configuration security, or AI inference endpoint hardening. OpenClaw integrates Moltbot's AI security scanning to cover these vectors. For organizations running AI workloads in containers (the most common pattern), you need both container security (Aqua/OpenClaw) and AI-specific security (Moltbot)." },
  { q: "When would I use both OpenClaw and Aqua Security?", a: "Many security teams use OpenClaw alongside Aqua Security in complementary roles: Aqua for: enterprise K8s runtime protection, cloud CSPM, compliance reporting. OpenClaw for: AI workload security scanning, self-hosted infra checks, cost-effective coverage of non-K8s systems. This combination provides: deep container/K8s security (Aqua) + AI security (OpenClaw/Moltbot) + self-hosted infra coverage (OpenClaw) + enterprise compliance (Aqua). Alternative: use OpenClaw as primary scanner with Aqua only where its unique runtime protection or compliance features are required." },
]

export default function OpenclawVsAquasecPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Compare", item: `${SITE_URL}/${locale}/compare` },
      { "@type": "ListItem", position: 3, name: "OpenClaw vs Aqua Security", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Security-Vergleich für eigene Container-Infrastruktur-Entscheidungen.", "Security comparison to help you choose your own container security infrastructure.")}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Compare · Batch 18</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{pick(isDE, "OpenClaw vs Aqua Security", "OpenClaw vs Aqua Security")}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "Aqua Security ist der Enterprise-Standard für Container-Security — aber teuer und blind für AI-Workloads. OpenClaw ist günstiger, selbst gehostet und scannt auch LLM-Infrastruktur.", "Aqua Security is the enterprise standard for container security — but expensive and blind to AI workloads. OpenClaw is cheaper, self-hosted, and scans LLM infrastructure too.")}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Feature-Vergleich", "Feature Comparison")}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">{pick(isDE, "Merkmal", "Feature")}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase">OpenClaw</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Aqua Security</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={i} className={`border-b border-gray-700 ${i % 2 === 0 ? "" : "bg-gray-800/50"}`}>
                    <td className="px-6 py-3 text-sm font-medium text-gray-300">{row.feature}</td>
                    <td className="px-6 py-3 text-sm"><span className={row.winner === "openclaw" ? "text-green-400 font-semibold" : "text-gray-300"}>{row.openclaw}</span></td>
                    <td className="px-6 py-3 text-sm"><span className={row.winner === "aquasec" ? "text-green-400 font-semibold" : "text-gray-300"}>{row.aquasec}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Häufige Fragen", "Frequently Asked Questions")}</h2>
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Weiterführende Ressourcen", "Further Resources")}</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/compare/openclaw-vs-tenable`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">OpenClaw vs Tenable</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Tenable-Vergleich", "Tenable comparison")}</div>
            </a>
            <a href={`/${locale}/compare/moltbot-vs-crewai`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Moltbot vs CrewAI</div>
              <div className="text-sm text-gray-300">{pick(isDE, "CrewAI-Vergleich", "CrewAI comparison")}</div>
            </a>
            <a href={`/${locale}/openclaw`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">OpenClaw Framework</div>
              <div className="text-sm text-gray-300">{pick(isDE, "OpenClaw Docs", "OpenClaw docs")}</div>
            </a>
            <a href={`/${locale}/compare`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">All Comparisons</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Alle Vergleiche", "All comparisons")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
