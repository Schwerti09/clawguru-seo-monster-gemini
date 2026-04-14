import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/openclaw-vs-trivy"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const title = "OpenClaw vs Trivy: Vulnerability Scanning Comparison | ClawGuru"
  const description = "OpenClaw vs Aqua Trivy: vulnerability scanner comparison for containers, Kubernetes and IaC. Trivy is a best-in-class scanner — OpenClaw orchestrates Trivy plus adds runtime monitoring, response automation and compliance."
  return {
    title, description,
    keywords: ["openclaw vs trivy", "trivy vulnerability scanner", "trivy comparison", "trivy vs openclaw", "aqua trivy alternative", "container scanning comparison"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const COMPARISON = [
  { feature: "Primary Role", openclaw: "Security observability platform (uses Trivy internally)", trivy: "Best-in-class vulnerability scanner" },
  { feature: "Container Scanning", openclaw: "Trivy + Grype + custom rules (orchestrated)", trivy: "Native — excellent CVE coverage" },
  { feature: "K8s Cluster Scanning", openclaw: "Trivy Operator + runtime correlation", trivy: "Trivy Operator (in-cluster scanning)" },
  { feature: "IaC Scanning", openclaw: "Trivy + Checkov + OPA policies", trivy: "Native Terraform/CloudFormation/Helm scanning" },
  { feature: "SBOM Generation", openclaw: "Trivy SBOM export + enrichment", trivy: "Native SPDX + CycloneDX SBOM generation" },
  { feature: "Runtime Detection", openclaw: "Falco eBPF runtime + Trivy for image context", trivy: "Scan-only — no runtime detection" },
  { feature: "CVE Feed Integration", openclaw: "Live CVE → running container matching", trivy: "Database updated on scan (not continuous)" },
  { feature: "Automated Response", openclaw: "Alert → quarantine container → notify", trivy: "Reporting only — no automated response" },
  { feature: "Compliance Evidence", openclaw: "Structured audit log for SOC 2, ISO 27001", trivy: "Report generation — not audit-structured" },
  { feature: "CI/CD Integration", openclaw: "Trivy scanner plugin + policy gate", trivy: "Excellent native CI/CD integration (GitHub Actions, etc.)" },
  { feature: "Secret Detection", openclaw: "Trivy secrets + custom patterns", trivy: "Native secret scanning in repos + images" },
  { feature: "Self-Hosted", openclaw: "Yes — full platform self-hosted", trivy: "Yes — single binary, very easy to deploy" },
]

const FAQ = [
  { q: "Should I use Trivy or OpenClaw — or both?", a: "Both — they are complementary, not competing. Trivy is the scanner engine: best-in-class CVE detection in containers, IaC, and source code. OpenClaw is the security platform that orchestrates Trivy alongside Falco (runtime), Grype (additional scanning), OPA (policy enforcement), and automated response. The recommended architecture: OpenClaw as the central platform, with Trivy as the primary scanner engine feeding results into OpenClaw. You get Trivy's scanning accuracy plus OpenClaw's runtime detection, response automation, and compliance evidence." },
  { q: "What does Trivy miss that OpenClaw catches?", a: "Trivy is a point-in-time scanner — it detects vulnerabilities at scan time. It misses: 1) Runtime anomalies — a container that starts clean but downloads malware at runtime (detected by Falco in OpenClaw). 2) Newly disclosed CVEs in already-running containers — OpenClaw continuously matches live CVE feed against running container inventory. 3) Cross-container correlation — an image without CVEs but with suspicious network behavior (detected by OpenClaw's correlation engine). 4) Automated response — Trivy reports vulnerabilities; OpenClaw can automatically quarantine affected containers or trigger runbooks." },
  { q: "Is Trivy better than Grype?", a: "Trivy and Grype are both excellent open-source vulnerability scanners with very similar CVE coverage (both use NVD + OS vendor advisories). Key differences: Trivy has broader scope (containers, IaC, git repos, secrets) in a single tool. Grype is container/package-only but has a slightly faster scan speed and richer API. OpenClaw runs both by default — Trivy as primary, Grype as secondary for validation. Running both reduces false negative rate." },
  { q: "How does Trivy Operator differ from standalone Trivy?", a: "Standalone Trivy: CLI tool you run on demand (or in CI/CD). Scans one image/repo/path at a time. Trivy Operator: Kubernetes operator that continuously monitors the cluster. Automatically scans every new image deployed, generates VulnerabilityReport and ConfigAuditReport custom resources, integrates with K8s RBAC. OpenClaw integrates with Trivy Operator: reads VulnerabilityReports from K8s API, correlates with runtime Falco events, generates unified security dashboard across scan-time and runtime findings." },
]

export default function OpenclawVsTrivyPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "OpenClaw vs Trivy", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: Vulnerability scanning tooling comparison for your own infrastructure.
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Compare · Batch 12</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">OpenClaw vs Trivy: Better Together</h1>
        <p className="text-lg text-gray-300 mb-6">Trivy is one of the best open-source vulnerability scanners available — OpenClaw uses Trivy as its core scanning engine. This isn't an either/or comparison: it's about understanding what each tool does and how they work together for complete security coverage.</p>

        <div className="bg-blue-900 border border-blue-700 p-4 rounded-lg mb-8">
          <h3 className="font-bold text-blue-300 mb-1">Recommended Architecture</h3>
          <p className="text-sm text-blue-200">OpenClaw (platform) + Trivy (scanner) + Falco (runtime) = complete coverage. Trivy excels at scan-time detection. Falco catches runtime anomalies. OpenClaw correlates both, adds response automation and compliance evidence.</p>
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Feature</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-cyan-400 uppercase">OpenClaw</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Trivy</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature} className={`border-b border-gray-700 ${i % 2 === 1 ? "bg-gray-800/50" : ""}`}>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-100">{row.feature}</td>
                    <td className="px-4 py-3 text-sm text-green-300">{row.openclaw}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{row.trivy}</td>
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
            <a href={`/${locale}/clawguru-vs-trivy`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">ClawGuru vs Trivy</div>
              <div className="text-sm text-gray-300">Platform-level comparison</div>
            </a>
            <a href={`/${locale}/openclaw-vs-snyk`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">OpenClaw vs Snyk</div>
              <div className="text-sm text-gray-300">Developer scanning comparison</div>
            </a>
            <a href={`/${locale}/academy/cve/CVE-2025-30065`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">CVE-2025-30065</div>
              <div className="text-sm text-gray-300">Apache Parquet RCE — Trivy detects it</div>
            </a>
            <a href={`/${locale}/academy/cve-feed`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">CVE Feed</div>
              <div className="text-sm text-gray-300">CVEs Trivy finds — with fix guides</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
