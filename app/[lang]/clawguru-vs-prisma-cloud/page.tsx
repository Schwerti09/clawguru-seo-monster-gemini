import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/clawguru-vs-prisma-cloud"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const title = "ClawGuru vs Prisma Cloud: Self-Hosted CNAPP Alternative | ClawGuru"
  const description = "ClawGuru vs Palo Alto Prisma Cloud: cloud-native security comparison. Prisma Cloud is powerful but SaaS-only at $300k+/year. ClawGuru delivers CNAPP-equivalent coverage self-hosted for infrastructure cost only."
  return {
    title, description,
    keywords: ["clawguru vs prisma cloud", "prisma cloud alternative", "prisma cloud self-hosted", "cnapp self-hosted", "palo alto prisma cloud comparison", "cnapp open source"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const COMPARISON = [
  { feature: "Platform Type", clawguru: "Self-hosted CNAPP stack (OSS)", prisma: "SaaS CNAPP (Cloud-native)" },
  { feature: "Pricing", clawguru: "Infrastructure cost only", prisma: "$150k-$500k+/year (workload-based)" },
  { feature: "Data Residency", clawguru: "100% on-premises, zero cloud egress", prisma: "All security data sent to Palo Alto cloud" },
  { feature: "Cloud CSPM", clawguru: "OpenClaw + custom policies + OPA", prisma: "Native multi-cloud CSPM (AWS/Azure/GCP)" },
  { feature: "Container Security", clawguru: "Falco + Trivy + OpenClaw", prisma: "Prisma Cloud Compute (Twistlock)" },
  { feature: "K8s Security", clawguru: "OPA Gatekeeper + Cilium + Falco", prisma: "Defender DaemonSet + policy enforcement" },
  { feature: "SBOM / Supply Chain", clawguru: "Syft + Sigstore + Grype", prisma: "Software composition analysis (SCA)" },
  { feature: "AI/LLM Security", clawguru: "Moltbot — OWASP LLM Top 10", prisma: "No AI/LLM-specific security module" },
  { feature: "IaC Scanning", clawguru: "Checkov + OPA + OpenClaw", prisma: "Prisma Cloud IaC scanning (Checkov-based)" },
  { feature: "Secrets Detection", clawguru: "Trufflehog + Gitleaks + custom", prisma: "Built-in secrets scanning" },
  { feature: "Incident Response", clawguru: "Moltbot IR playbook + OpenClaw alerts", prisma: "Alert-only — response requires external SOAR" },
  { feature: "GDPR / EU Compliance", clawguru: "Self-hosted, EU data residency native", prisma: "Data sent to US/EU Palo Alto datacenters" },
]

const FAQ = [
  { q: "What is Prisma Cloud and what makes it unique?", a: "Prisma Cloud (formerly Twistlock + RedLock + PureSec, acquired by Palo Alto Networks) is the leading commercial CNAPP (Cloud-Native Application Protection Platform). It covers: CSPM (cloud security posture), CWPP (workload protection), CIEM (cloud identity), IaC scanning, and supply chain security in a single pane of glass. Its strength is breadth — native integrations with AWS, Azure, GCP, and a huge library of compliance policies. Its weakness: cost (enterprise-only pricing), SaaS architecture (all data to Palo Alto cloud), and no self-hosted option." },
  { q: "Can ClawGuru match Prisma Cloud's multi-cloud CSPM?", a: "For self-hosted and hybrid environments: yes, ClawGuru matches or exceeds Prisma Cloud's coverage. For pure public cloud CSPM (AWS/Azure/GCP posture management without self-hosted infrastructure): Prisma Cloud has native cloud API integrations that ClawGuru's OpenClaw currently focuses less on. The honest answer: if you're 100% public cloud with zero self-hosted, Prisma Cloud's cloud-native CSPM is stronger. If you have any self-hosted, Kubernetes, or AI/LLM workloads — ClawGuru's stack is more relevant and dramatically cheaper." },
  { q: "What is the real cost of Prisma Cloud vs ClawGuru?", a: "Prisma Cloud pricing is workload-based: typically $75-$150/workload/year. For a mid-size company with 1,000 workloads (containers, VMs, functions): $75k-$150k/year minimum. Enterprise deployments commonly run $200k-$500k+/year. ClawGuru's OSS stack (Falco, Trivy, OpenClaw, OPA, Moltbot) costs: infrastructure (run on existing Kubernetes cluster — typically $0 additional hardware) plus operational overhead for setup and tuning (one-time ~40-80 hours). Year 1: $10k-$30k in engineer time. Year 2+: minimal maintenance cost." },
  { q: "Does Prisma Cloud have a self-hosted option?", a: "No. Prisma Cloud is SaaS-only — there is no on-premises or self-hosted deployment option. All security data (vulnerability scan results, runtime events, cloud configuration findings, container metadata) is sent to Palo Alto Networks' cloud. For organizations with strict data residency requirements (GDPR, German data sovereignty, air-gapped environments, defense/government), this is a fundamental blocker. ClawGuru's self-hosted architecture is the answer for these requirements." },
]

export default function ClawguruVsPrismaCloudPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "ClawGuru vs Prisma Cloud", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: Security tooling comparison for your own infrastructure decisions.
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Compare · Batch 12</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">ClawGuru vs Prisma Cloud</h1>
        <p className="text-lg text-gray-300 mb-6">Prisma Cloud is the Palo Alto Networks CNAPP — the gold standard commercial platform at $150k-$500k+/year. ClawGuru delivers CNAPP-equivalent coverage self-hosted at infrastructure cost. For EU data residency, AI security, and self-hosted K8s: ClawGuru wins on every axis.</p>

        <div className="bg-orange-900 border border-orange-700 p-4 rounded-lg mb-8">
          <h3 className="font-bold text-orange-300 mb-1">⚠ Prisma Cloud: SaaS-Only Constraint</h3>
          <p className="text-sm text-orange-200">Prisma Cloud has no self-hosted deployment option. All vulnerability data, runtime events, and security findings are sent to Palo Alto Networks' cloud. For GDPR Art. 44+ cross-border transfers, German BSI requirements, or air-gapped environments: Prisma Cloud is architecturally incompatible.</p>
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Feature</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-cyan-400 uppercase">ClawGuru</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Prisma Cloud</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature} className={`border-b border-gray-700 ${i % 2 === 1 ? "bg-gray-800/50" : ""}`}>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-100">{row.feature}</td>
                    <td className="px-4 py-3 text-sm text-green-300">{row.clawguru}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{row.prisma}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Frequently Asked Questions</h2>
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Further Resources</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/clawguru-vs-wiz`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">ClawGuru vs Wiz</div>
              <div className="text-sm text-gray-300">CSPM comparison</div>
            </a>
            <a href={`/${locale}/clawguru-vs-aquasec`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">ClawGuru vs Aqua Security</div>
              <div className="text-sm text-gray-300">Container security comparison</div>
            </a>
            <a href={`/${locale}/openclaw/runtime-policy-enforcement`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Runtime Policy Enforcement</div>
              <div className="text-sm text-gray-300">OPA + Falco vs Prisma Defender</div>
            </a>
            <a href={`/${locale}/neuro`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Stack MRI</div>
              <div className="text-sm text-gray-300">Free security posture scan</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
