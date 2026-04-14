import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/clawguru-vs-aquasec"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const title = "ClawGuru vs Aqua Security: Self-Hosted Container Security Comparison | ClawGuru"
  const description = "ClawGuru vs Aqua Security: container and cloud-native security comparison. Aqua requires SaaS or complex deployment — ClawGuru delivers full security observability self-hosted with zero vendor lock-in."
  return {
    title, description,
    keywords: ["clawguru vs aquasec", "aqua security comparison", "aqua security self-hosted", "container security comparison", "aqua security alternative", "cloud native security self-hosted"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const COMPARISON = [
  { feature: "Deployment Model", clawguru: "100% self-hosted, no SaaS required", aqua: "SaaS-primary; self-hosted (DTA) requires enterprise contract" },
  { feature: "Vendor Lock-In", clawguru: "Zero — open data formats, exportable", aqua: "High — proprietary data formats, SaaS dependency" },
  { feature: "Pricing Model", clawguru: "Transparent, self-hosted cost", aqua: "Per-node/workload enterprise pricing (often $100k+/year)" },
  { feature: "Container Scanning", clawguru: "Trivy + Grype + custom rules", aqua: "Deep scanning with malware detection" },
  { feature: "Runtime Protection", clawguru: "Falco-based eBPF runtime detection", aqua: "MicroEnforcer agent — in-container instrumentation" },
  { feature: "SBOM Generation", clawguru: "Syft-based, SPDX + CycloneDX output", aqua: "Built-in SBOM with commercial tooling" },
  { feature: "Kubernetes Security", clawguru: "Policy-as-code, admission webhooks, runtime alerts", aqua: "KubeEnforcer + RBAC + runtime protection" },
  { feature: "CI/CD Integration", clawguru: "Trivy + OpenClaw pipeline plugins", aqua: "Commercial pipeline scanner (Aqua Scanner)" },
  { feature: "AI Agent Security", clawguru: "Moltbot integration — OWASP LLM Top 10", aqua: "No AI/LLM-specific security features" },
  { feature: "GDPR / Data Residency", clawguru: "All data stays in your infra", aqua: "SaaS model sends data to Aqua cloud" },
  { feature: "Community / OSS", clawguru: "Built on OSS stack (Falco, Trivy, OPA)", aqua: "Proprietary scanner on OSS base" },
  { feature: "SME Accessible", clawguru: "Yes — no enterprise contract required", aqua: "Primarily enterprise — pricing excludes SMEs" },
]

const FAQ = [
  { q: "What does Aqua Security do that ClawGuru doesn't?", a: "Aqua Security's key differentiators over ClawGuru's open stack: 1) In-container MicroEnforcer agent with microsegmentation. 2) Commercial malware detection in container images (beyond CVE scanning). 3) Built-in compliance reporting for PCI DSS, HIPAA with pre-built dashboards. 4) Serverless function security (AWS Lambda, Azure Functions). For most self-hosted use cases, ClawGuru's OSS stack (Falco + Trivy + OPA) covers the critical security requirements without the $100k+ annual spend." },
  { q: "Is Aqua Security truly self-hosted?", a: "Aqua offers a 'Data Plane' self-hosted deployment for enterprise customers, but the management plane (console, policy management) still communicates with Aqua's cloud in the standard configuration. A fully air-gapped deployment requires their Disconnected Tier Architecture (DTA) which adds significant deployment complexity and cost. ClawGuru is designed from the ground up for self-hosted deployment — no cloud connectivity required." },
  { q: "Which is better for a startup or SME?", a: "ClawGuru is significantly more accessible for startups and SMEs. Aqua Security's pricing is enterprise-tier (typically $80k-$200k+/year based on node count). ClawGuru uses an OSS-first stack that you can deploy and operate yourself. For most startups: deploy Falco + Trivy + OpenClaw + Moltbot — you get 80% of Aqua's security coverage at infrastructure cost only. Aqua makes sense when you need their specific enterprise features and have the budget." },
  { q: "How does ClawGuru handle container image scanning compared to Aqua?", a: "ClawGuru integrates Trivy and Grype for container image scanning — covering CVEs, misconfigurations, secrets, and SBOM generation. Aqua's commercial scanner adds: proprietary malware detection (detects packed/obfuscated malware beyond CVEs), supply chain attack indicators, and commercial threat intelligence feeds. For CVE-based vulnerability detection, Trivy/Grype match or exceed Aqua's coverage. For advanced malware detection, Aqua's commercial scanner has an edge." },
]

export default function ClawguruVsAquasecPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "ClawGuru vs Aqua Security", item: `${SITE_URL}/${locale}${PATH}` },
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
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Compare · Batch 10</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">ClawGuru vs Aqua Security</h1>
        <p className="text-lg text-gray-300 mb-6">Aqua Security is a powerful enterprise container security platform. ClawGuru delivers comparable runtime and vulnerability security fully self-hosted — without the six-figure annual contract, vendor lock-in, or cloud data egress. Here's the exact breakdown.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Feature</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-cyan-400 uppercase">ClawGuru</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Aqua Security</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature} className={`border-b border-gray-700 ${i % 2 === 1 ? "bg-gray-800/50" : ""}`}>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-100">{row.feature}</td>
                    <td className="px-4 py-3 text-sm text-green-300">{row.clawguru}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{row.aqua}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Decision Guide</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-cyan-900 p-4 rounded-lg border border-cyan-700">
              <h3 className="font-semibold text-cyan-300 mb-2">Choose ClawGuru when:</h3>
              <ul className="space-y-1 text-sm text-cyan-200">
                <li>▸ Self-hosted is non-negotiable (GDPR, data residency)</li>
                <li>▸ Budget under $50k/year for security tooling</li>
                <li>▸ AI/LLM workloads requiring Moltbot integration</li>
                <li>▸ Prefer OSS transparency over black-box commercial</li>
                <li>▸ Kubernetes + self-hosted infrastructure focus</li>
              </ul>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
              <h3 className="font-semibold text-gray-300 mb-2">Aqua Security fits when:</h3>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>▸ Enterprise budget available ($100k+ OK)</li>
                <li>▸ Need commercial malware detection in images</li>
                <li>▸ Large multi-cloud deployment with central management</li>
                <li>▸ Serverless (Lambda/Azure Functions) security required</li>
                <li>▸ Pre-built PCI DSS / HIPAA compliance dashboards needed</li>
              </ul>
            </div>
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
              <div className="text-sm text-gray-300">Cloud security posture comparison</div>
            </a>
            <a href={`/${locale}/openclaw-vs-snyk`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">OpenClaw vs Snyk</div>
              <div className="text-sm text-gray-300">Vulnerability scanning comparison</div>
            </a>
            <a href={`/${locale}/neuro`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Stack MRI</div>
              <div className="text-sm text-gray-300">Scan your container stack now</div>
            </a>
            <a href={`/${locale}/academy/cve-feed`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">CVE Feed</div>
              <div className="text-sm text-gray-300">Container CVEs with fix guides</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
