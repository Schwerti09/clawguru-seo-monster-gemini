import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/openclaw-vs-tenable"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const title = "OpenClaw vs Tenable: Vulnerability Management for Self-Hosted | ClawGuru"
  const description = "OpenClaw vs Tenable (Nessus/Tenable.io): vulnerability management comparison for self-hosted infrastructure. Tenable is agent-based SaaS — OpenClaw delivers continuous scanning fully on-premises."
  return {
    title, description,
    keywords: ["openclaw vs tenable", "tenable nessus comparison", "tenable self-hosted", "tenable alternative", "vulnerability management self-hosted", "nessus alternative"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const COMPARISON = [
  { feature: "Deployment Model", openclaw: "100% self-hosted, agentless option", tenable: "SaaS (Tenable.io) or on-prem (Tenable.sc) with agents" },
  { feature: "CVE Coverage", openclaw: "NVD + OSV + vendor advisories, real-time", tenable: "Tenable Research + NVD, 200k+ plugins" },
  { feature: "Scan Coverage", openclaw: "Containers, K8s, hosts, IaC, code", tenable: "Network, hosts, cloud, web apps (Nessus)" },
  { feature: "Container Security", openclaw: "Native container + K8s manifest scanning", tenable: "Tenable Container Security (separate product)" },
  { feature: "SBOM Integration", openclaw: "Native SBOM generation + CVE matching", tenable: "No SBOM generation" },
  { feature: "AI/LLM Security", openclaw: "Moltbot integration for AI agent scanning", tenable: "No AI/LLM-specific coverage" },
  { feature: "Continuous Scanning", openclaw: "Event-driven + scheduled continuous scanning", tenable: "Scheduled scans; continuous in SaaS tier" },
  { feature: "Compliance Reporting", openclaw: "Custom policy-as-code reports", tenable: "Pre-built PCI, HIPAA, CIS reports" },
  { feature: "GDPR / Data Residency", openclaw: "All scan data stays on-premises", tenable: "Tenable.io: scan data in Tenable cloud" },
  { feature: "API / Automation", openclaw: "Full REST API + OpenClaw CLI", tenable: "REST API + Tenable SDK" },
  { feature: "Pricing", openclaw: "OSS + self-hosted infrastructure cost", tenable: "$3k-$50k+/year (Tenable.sc) or per-asset SaaS" },
  { feature: "Plugin Ecosystem", openclaw: "OSS plugin model", tenable: "200k+ proprietary Nessus plugins" },
]

const FAQ = [
  { q: "What is the main difference between Tenable Nessus and Tenable.io?", a: "Nessus is the on-premises scanner (Nessus Professional, Nessus Manager). Tenable.io is the SaaS platform that centralizes results from Nessus agents and cloud connectors. Tenable.sc (Security Center) is the enterprise on-premises management platform. For GDPR / data residency: Tenable.sc + Nessus keeps scan data on-premises. Tenable.io sends scan results to Tenable's cloud. OpenClaw is the alternative that provides centralized vulnerability management with no cloud dependency." },
  { q: "Does OpenClaw cover network vulnerability scanning like Nessus?", a: "OpenClaw's primary strength is container, Kubernetes, and IaC vulnerability scanning — not traditional network/host scanning. For network-layer vulnerability scanning (open ports, service fingerprinting, network protocol vulnerabilities), Nessus remains the gold standard with 200k+ plugins. The recommended architecture for self-hosted: OpenClaw for container/IaC/AI security + OpenVAS (open-source Nessus alternative) for network scanning. This covers the full stack without SaaS dependencies." },
  { q: "How does SBOM-based vulnerability scanning compare to Tenable?", a: "Tenable scans installed packages by querying the OS package manager or running agent-based scans. OpenClaw generates a full SBOM (Software Bill of Materials) from container images and source code, then matches every component against CVE databases. SBOM-based scanning has key advantages: works in CI/CD before deployment, catches vulnerabilities in vendored dependencies that agent scans miss, provides complete component inventory for supply chain analysis. Tenable does not generate SBOMs — it's purely a vulnerability scanner." },
  { q: "Which is better for Kubernetes security posture?", a: "OpenClaw is better for Kubernetes security posture management. Tenable's Kubernetes support requires the Tenable.cs (Cloud Security) product or Kubernetes connector for Tenable.io — both are additional SKUs. OpenClaw natively scans: Kubernetes manifest misconfigurations (CIS Kubernetes benchmarks), RBAC policy analysis, network policy gaps, pod security standards violations, and runtime container behavior via Falco integration. All of this without additional SaaS products or per-cluster licensing." },
]

export default function OpenclawVsTenablePage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "OpenClaw vs Tenable", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: Vulnerability management tooling comparison for your own infrastructure.
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Compare · Batch 10</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">OpenClaw vs Tenable: Vulnerability Management</h1>
        <p className="text-lg text-gray-300 mb-6">Tenable/Nessus is the industry standard for network vulnerability scanning — 200k+ plugins, decades of research. OpenClaw wins for container, Kubernetes, and AI security with zero SaaS dependency. This comparison maps exactly where each tool belongs in a self-hosted security stack.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Feature</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-cyan-400 uppercase">OpenClaw</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Tenable</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature} className={`border-b border-gray-700 ${i % 2 === 1 ? "bg-gray-800/50" : ""}`}>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-100">{row.feature}</td>
                    <td className="px-4 py-3 text-sm text-green-300">{row.openclaw}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{row.tenable}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Recommended Architecture</h2>
          <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-300 mb-4">For full-stack self-hosted vulnerability management without Tenable SaaS:</p>
            <div className="space-y-2">
              {[
                { layer: "Network/Host CVEs", tool: "OpenVAS (Greenbone) — open-source Nessus alternative", color: "blue" },
                { layer: "Container/K8s CVEs", tool: "OpenClaw + Trivy + Grype", color: "cyan" },
                { layer: "IaC Misconfigs", tool: "OpenClaw + Checkov + OPA", color: "cyan" },
                { layer: "SBOM + Supply Chain", tool: "OpenClaw + Syft + Sigstore", color: "cyan" },
                { layer: "Runtime Detection", tool: "OpenClaw + Falco (eBPF)", color: "green" },
                { layer: "AI/LLM Security", tool: "Moltbot — OWASP LLM Top 10", color: "purple" },
              ].map((l) => (
                <div key={l.layer} className={`flex items-center gap-3 bg-${l.color}-900/30 border border-${l.color}-800 p-3 rounded-lg`}>
                  <span className={`text-xs font-bold text-${l.color}-400 w-32 flex-shrink-0`}>{l.layer}</span>
                  <span className="text-sm text-gray-300">{l.tool}</span>
                </div>
              ))}
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
            <a href={`/${locale}/clawguru-vs-aquasec`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">ClawGuru vs Aqua Security</div>
              <div className="text-sm text-gray-300">Container runtime security comparison</div>
            </a>
            <a href={`/${locale}/openclaw-vs-snyk`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">OpenClaw vs Snyk</div>
              <div className="text-sm text-gray-300">Developer-first scanning comparison</div>
            </a>
            <a href={`/${locale}/academy/cve-feed`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">CVE Feed</div>
              <div className="text-sm text-gray-300">Live CVEs with fix runbooks</div>
            </a>
            <a href={`/${locale}/neuro`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Stack MRI</div>
              <div className="text-sm text-gray-300">Scan your stack now</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
