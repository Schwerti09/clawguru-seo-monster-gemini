import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/clawguru-vs-orca-security"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "ClawGuru vs Orca Security: Self-Hosted vs agentloser Cloud-Scanner | ClawGuru", "ClawGuru vs Orca Security: Self-Hosted vs Agentless Cloud Scanner | ClawGuru")
  const description = pick(isDE, "ClawGuru vs Orca Security Vergleich: Self-Hosted-Kontrolle gegen agentlosen SaaS-Cloud-Scan. Datenschutz, Preisstruktur, Kubernetes-Support und AI-Agent-Sicherheit im direkten Vergleich.", "ClawGuru vs Orca Security comparison: self-hosted control vs agentless SaaS cloud scan. Data privacy, pricing structure, Kubernetes support and AI agent security in direct comparison.")
  return {
    title, description,
    keywords: ["clawguru vs orca security", "orca security alternative", "orca security self-hosted", "cloud security posture management alternative", "cspm self-hosted", "orca security vs clawguru"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const COMPARISON = [
  { feature: "Deployment model", clawguru: "Self-hosted — on-prem or your cloud VPC", orca: "SaaS-only — data processed in Orca's cloud" },
  { feature: "Data sovereignty", clawguru: "100% — data never leaves your infrastructure", orca: "❌ — scan data sent to Orca SaaS platform" },
  { feature: "GDPR/DSGVO compliance", clawguru: "Full — self-hosted, EU-first", orca: "Requires DPA + trust in Orca's EU data handling" },
  { feature: "Agentless scanning", clawguru: "OpenClaw runtime + API-based scanning", orca: "✓ — SideScanning technology, no agents needed" },
  { feature: "Kubernetes security", clawguru: "Deep K8s native — RBAC audit, PodSec, workload risk", orca: "Cloud K8s support (EKS, AKS, GKE) — limited on-prem" },
  { feature: "AI / LLM security", clawguru: "Moltbot: prompt injection, agent RBAC, context isolation", orca: "No dedicated AI agent security layer" },
  { feature: "On-premises support", clawguru: "✓ — designed for bare metal and private cloud", orca: "❌ — cloud-native only (AWS, Azure, GCP)" },
  { feature: "Self-hosted AI inference", clawguru: "✓ — scan self-hosted LLMs and Moltbot deployments", orca: "❌ — no self-hosted AI/ML workload coverage" },
  { feature: "Pricing model", clawguru: "Open core — transparent self-hosted tier", orca: "Enterprise SaaS — per-asset pricing, quote-based" },
  { feature: "Compliance automation", clawguru: "SOC 2, ISO 27001, NIS2, DSGVO — evidence auto-generated", orca: "CIS, PCI DSS, SOC 2 — SaaS-based reports" },
]

const FAQ = [
  { q: "What is Orca Security's core strength vs ClawGuru?", a: "Orca Security's primary strength is its SideScanning technology: it scans cloud workloads (AWS, Azure, GCP) without installing agents, by reading cloud storage snapshots through out-of-band API access. This means zero performance impact on workloads and no agent management overhead. ClawGuru's core strength is the opposite: complete control and data sovereignty for self-hosted and on-premises environments. ClawGuru runs entirely within your infrastructure — no data leaves your network. For organizations with strict data sovereignty requirements (financial services, healthcare, EU-regulated industries), this is decisive." },
  { q: "Can Orca Security scan on-premises or self-hosted infrastructure?", a: "Orca Security is primarily designed for public cloud environments (AWS, Azure, GCP). For on-premises infrastructure: Orca has limited support via their hybrid connector, but core SideScanning requires cloud provider API access. Self-hosted Kubernetes (bare metal, private cloud) has limited coverage. Self-hosted AI/ML workloads (Moltbot agents, local LLMs) are not in Orca's scope. If your infrastructure is primarily on-premises or a private cloud, ClawGuru with OpenClaw provides deeper coverage through runtime scanning that works without cloud provider dependencies." },
  { q: "How do the pricing models compare?", a: "Orca Security: enterprise SaaS with asset-based pricing. Pricing is quote-based and typically starts at $50,000-$200,000+/year for mid-to-large deployments. Costs scale with cloud asset count. No self-hosted option. ClawGuru: open core model with a self-hosted free tier for core functionality. Enterprise features (AI security, compliance automation, multi-tenant) available in commercial tier. Transparent pricing — no surprise per-asset fees. For organizations already running self-hosted infrastructure, ClawGuru eliminates the SaaS premium and keeps operational costs predictable." },
  { q: "Which tool covers AI and LLM workload security?", a: "ClawGuru — Moltbot is specifically designed for AI agent security: prompt injection detection, LLM context isolation, agent RBAC, multi-model orchestration security, supply chain verification for AI models. Orca Security does not have a dedicated AI agent security capability as of 2026. For organizations deploying LLM-based systems or AI agents, this is a critical gap in Orca's coverage that ClawGuru directly addresses. If your primary concern is cloud infrastructure CSPM for AWS/Azure/GCP workloads (non-AI), Orca has mature capabilities there." },
]

export default function ClawguruVsOrcaSecurityPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Compare", item: `${SITE_URL}/${locale}/compare` },
      { "@type": "ListItem", position: 3, name: "ClawGuru vs Orca Security", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Objektiver Produktvergleich für Kaufentscheidungen.", "Objective product comparison for purchasing decisions.")}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Compare · Batch 13</span></div>
        <h1 className="text-4xl font-bold mb-2 text-gray-100">ClawGuru vs Orca Security</h1>
        <p className="text-xl text-cyan-400 mb-4">{pick(isDE, "Self-Hosted-Kontrolle vs agentloser Cloud-SaaS-Scan", "Self-Hosted Control vs Agentless Cloud SaaS Scan")}</p>
        <p className="text-lg text-gray-300 mb-8">
          {pick(isDE, "Orca Security ist stark im agentlosen Public-Cloud-Scan — aber nur als SaaS, nur für AWS/Azure/GCP, ohne AI-Agent-Security. ClawGuru deckt Self-Hosted, On-Premises und KI-Workloads mit voller Datensouveränität ab.", "Orca Security excels at agentless public cloud scanning — but SaaS-only, only for AWS/Azure/GCP, without AI agent security. ClawGuru covers self-hosted, on-premises and AI workloads with full data sovereignty.")}
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Direktvergleich", "Direct Comparison")}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Feature</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-cyan-400 uppercase">ClawGuru</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Orca Security</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature} className={`border-b border-gray-700 ${i % 2 === 1 ? "bg-gray-800/50" : ""}`}>
                    <td className="px-4 py-3 text-sm text-gray-300 font-medium">{row.feature}</td>
                    <td className="px-4 py-3 text-sm text-cyan-300">{row.clawguru}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{row.orca}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Wer sollte was wählen?", "Who Should Choose What?")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-cyan-900 border border-cyan-700 p-4 rounded-lg">
              <h3 className="font-bold text-cyan-300 mb-2">{pick(isDE, "ClawGuru ist besser wenn…", "ClawGuru is better when…")}</h3>
              <ul className="text-sm text-cyan-200 space-y-1">
                <li>▸ {pick(isDE, "On-Premises oder Private Cloud", "On-premises or private cloud")}</li>
                <li>▸ {pick(isDE, "GDPR/DSGVO Datensouveränität erforderlich", "GDPR/DSGVO data sovereignty required")}</li>
                <li>▸ {pick(isDE, "AI-Agenten oder LLM-Deployments", "AI agents or LLM deployments")}</li>
                <li>▸ {pick(isDE, "Self-Hosted Kubernetes (bare metal)", "Self-hosted Kubernetes (bare metal)")}</li>
                <li>▸ {pick(isDE, "Transparente, kalkulierbare Kosten", "Transparent, predictable costs")}</li>
              </ul>
            </div>
            <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg">
              <h3 className="font-bold text-gray-300 mb-2">{pick(isDE, "Orca ist besser wenn…", "Orca is better when…")}</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>▸ {pick(isDE, "Reiner Public-Cloud-Stack (AWS/Azure/GCP)", "Pure public cloud stack (AWS/Azure/GCP)")}</li>
                <li>▸ {pick(isDE, "Agentless-Scan ohne Ops-Aufwand", "Agentless scan with zero ops overhead")}</li>
                <li>▸ {pick(isDE, "Keine On-Premises-Anforderungen", "No on-premises requirements")}</li>
                <li>▸ {pick(isDE, "Enterprise-Budget für SaaS verfügbar", "Enterprise budget for SaaS available")}</li>
              </ul>
            </div>
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Weiterführende Vergleiche", "Further Comparisons")}</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/clawguru-vs-wiz`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">ClawGuru vs Wiz</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Ähnlicher SaaS-CNAPP-Vergleich", "Similar SaaS CNAPP comparison")}</div>
            </a>
            <a href={`/${locale}/clawguru-vs-aquasec`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">ClawGuru vs Aqua Security</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Container-Security-Vergleich", "Container security comparison")}</div>
            </a>
            <a href={`/${locale}/clawguru-vs-prisma-cloud`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">ClawGuru vs Prisma Cloud</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Palo Alto CNAPP vs Self-Hosted", "Palo Alto CNAPP vs self-hosted")}</div>
            </a>
            <a href={`/${locale}/neuro`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Live Security Check</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Stack direkt scannen", "Scan your stack directly")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
