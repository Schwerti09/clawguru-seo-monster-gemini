import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/openclaw-vs-falcosidekick"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const title = "OpenClaw vs Falcosidekick: Runtime Security Comparison | ClawGuru"
  const description = "OpenClaw vs Falcosidekick: runtime security and alerting comparison for self-hosted Kubernetes. Falcosidekick routes Falco events — OpenClaw provides full security observability and automated response."
  return {
    title, description,
    keywords: ["openclaw vs falcosidekick", "falcosidekick security", "falco alerting", "kubernetes runtime security", "openclaw falco comparison", "container runtime detection"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const COMPARISON = [
  { feature: "Primary Purpose", openclaw: "Full security observability platform + automated response", falco: "Event routing/fan-out for Falco alerts" },
  { feature: "Data Sources", openclaw: "Falco, Sysdig, network flows, logs, CVE feeds, SBOM", falco: "Falco events only" },
  { feature: "Alert Routing", openclaw: "50+ destinations + automated runbooks", falco: "80+ output destinations (fan-out)" },
  { feature: "Automated Response", openclaw: "Auto-quarantine containers, block IPs, rotate secrets", falco: "Can trigger webhooks — response is external" },
  { feature: "Threat Correlation", openclaw: "Cross-source correlation (network + syscall + log)", falco: "Single-source: Falco events only" },
  { feature: "CVE Integration", openclaw: "Live CVE feed → SBOM matching → alert on affected containers", falco: "No CVE tracking" },
  { feature: "RBAC / Multi-Tenant", openclaw: "Per-team namespaces, role-based alert policies", falco: "No built-in RBAC" },
  { feature: "Compliance Evidence", openclaw: "Structured evidence export for SOC 2, ISO 27001", falco: "Raw event export — manual correlation required" },
  { feature: "Self-Hosted", openclaw: "Yes — full self-hosted, no SaaS required", falco: "Yes — Falcosidekick runs in-cluster" },
  { feature: "Deployment Complexity", openclaw: "Medium — full platform", falco: "Low — single container, Falco dependency" },
  { feature: "Resource Footprint", openclaw: "Higher — full platform", falco: "Very low — lightweight event router" },
]

const FAQ = [
  { q: "What is Falcosidekick and what does it do?", a: "Falcosidekick is an open-source project that receives Falco security events and fans them out to 80+ destinations (Slack, PagerDuty, Elasticsearch, AWS Lambda, webhooks, etc.). It acts as a smart event router for Falco's runtime security detections. Falcosidekick does not generate detections itself — it depends entirely on Falco running in your cluster." },
  { q: "When should I use Falco + Falcosidekick vs OpenClaw?", a: "Falco + Falcosidekick is the right choice when: you need a lightweight, focused runtime security solution; you already have Falco deployed and need alert routing; you want maximum integration flexibility (80+ destinations); your team is comfortable writing Falco rules. OpenClaw is the right choice when: you need correlation across multiple data sources; you want automated response (not just alerting); you need compliance evidence collection; you want CVE-to-container matching; you have multi-team or multi-cluster deployments." },
  { q: "Can OpenClaw and Falcosidekick work together?", a: "Yes — OpenClaw can consume Falco events via its Falco integration, making Falcosidekick redundant if OpenClaw is your primary platform. Alternatively: use Falcosidekick to route Falco events to both your SIEM and OpenClaw simultaneously. OpenClaw then adds correlation, CVE matching, and automated response on top of raw Falco detections." },
  { q: "What is the overhead of running Falco + Falcosidekick?", a: "Falco uses eBPF for syscall monitoring — extremely low overhead (< 1% CPU on modern kernels with the modern probe). Falcosidekick is a lightweight Go binary with minimal resource usage. The combination is one of the most efficient runtime security solutions available. OpenClaw has higher resource usage because it does more — correlation engine, CVE matching, response automation require more compute. For resource-constrained environments, Falco + Falcosidekick + a targeted response webhook is the leaner option." },
]

export default function OpenclawVsFalcosidekickPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "OpenClaw vs Falcosidekick", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: Runtime security configuration guide for your own Kubernetes infrastructure.
        </div>

        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Compare · Batch 9</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">OpenClaw vs Falcosidekick: Runtime Security</h1>
        <p className="text-lg text-gray-300 mb-6">
          Falcosidekick is excellent at one thing: routing Falco runtime events to 80+ destinations. OpenClaw does more — correlation, CVE matching, automated response, compliance evidence. This comparison maps exactly where each tool fits in a self-hosted Kubernetes security stack.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Feature</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-cyan-400 uppercase">OpenClaw</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Falcosidekick</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature} className={`border-b border-gray-700 ${i % 2 === 1 ? "bg-gray-800/50" : ""}`}>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-100">{row.feature}</td>
                    <td className="px-4 py-3 text-sm text-green-300">{row.openclaw}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{row.falco}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Architecture Options</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-bold text-blue-300 mb-2">Option A — Minimal</h3>
              <div className="text-sm text-blue-200 space-y-1">
                <div>Falco (eBPF probe)</div>
                <div>↓</div>
                <div>Falcosidekick</div>
                <div>↓</div>
                <div>Slack / PagerDuty / SIEM</div>
              </div>
              <p className="text-xs text-blue-300 mt-3">Best for: small clusters, lean resource budget, Falco-only detection scope</p>
            </div>
            <div className="bg-green-900 p-4 rounded-lg border border-green-700">
              <h3 className="font-bold text-green-300 mb-2">Option B — Full Platform</h3>
              <div className="text-sm text-green-200 space-y-1">
                <div>Falco + Network + Logs + CVE</div>
                <div>↓</div>
                <div>OpenClaw (correlation)</div>
                <div>↓</div>
                <div>Auto-response + Compliance</div>
              </div>
              <p className="text-xs text-green-300 mt-3">Best for: multi-cluster, compliance requirements, automated response</p>
            </div>
            <div className="bg-purple-900 p-4 rounded-lg border border-purple-700">
              <h3 className="font-bold text-purple-300 mb-2">Option C — Hybrid</h3>
              <div className="text-sm text-purple-200 space-y-1">
                <div>Falco</div>
                <div>↓</div>
                <div>Falcosidekick → SIEM</div>
                <div>↓ (also)</div>
                <div>OpenClaw → Auto-response</div>
              </div>
              <p className="text-xs text-purple-300 mt-3">Best for: existing Falcosidekick install + adding response capabilities</p>
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
            <a href={`/${locale}/openclaw/security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">OpenClaw Security</div>
              <div className="text-sm text-gray-300">Full OpenClaw hardening guide</div>
            </a>
            <a href={`/${locale}/openclaw-vs-falco`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">OpenClaw vs Falco</div>
              <div className="text-sm text-gray-300">Core Falco comparison</div>
            </a>
            <a href={`/${locale}/moltbot/ai-red-teaming`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Red Teaming</div>
              <div className="text-sm text-gray-300">Test your runtime detection rules</div>
            </a>
            <a href={`/${locale}/academy/cve-feed`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">CVE Feed</div>
              <div className="text-sm text-gray-300">CVE-to-container matching</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
