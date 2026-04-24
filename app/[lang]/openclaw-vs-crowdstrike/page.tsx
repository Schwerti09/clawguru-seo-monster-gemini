import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/openclaw-vs-crowdstrike"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "OpenClaw vs CrowdStrike Falcon: Self-Hosted EDR vs Cloud-Only XDR | ClawGuru", "OpenClaw vs CrowdStrike Falcon: Self-Hosted EDR vs Cloud-Only XDR | ClawGuru")
  const description = pick(isDE, "OpenClaw vs CrowdStrike Falcon: Datensouveränität, Self-Hosted-Deployment, Kosten und KI-Agent-Sicherheit im Vergleich. Für wen ist CrowdStrike die falsche Wahl?", "OpenClaw vs CrowdStrike Falcon: data sovereignty, self-hosted deployment, cost and AI agent security compared. For whom is CrowdStrike the wrong choice?")
  return {
    title, description,
    keywords: ["openclaw vs crowdstrike", "crowdstrike alternative self-hosted", "crowdstrike falcon alternative", "self-hosted edr", "crowdstrike vs open source edr", "openclaw edr"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const COMPARISON = [
  { feature: "Deployment model", openclaw: "100% self-hosted — on-prem or private cloud", crowdstrike: "Cloud-only SaaS — all telemetry to CrowdStrike cloud" },
  { feature: "Data residency", openclaw: "Data never leaves your infrastructure", crowdstrike: "Telemetry processed in CrowdStrike US/EU data centres" },
  { feature: "GDPR / DSGVO", openclaw: "Fully compliant — no data transfers required", crowdstrike: "Requires DPA, data transfer to US under SCCs" },
  { feature: "Internet dependency", openclaw: "Fully air-gapped capable", crowdstrike: "Requires internet connectivity for detection updates" },
  { feature: "AI agent telemetry", openclaw: "Native Moltbot integration — agent-level syscall + tool-call audit", crowdstrike: "General EDR telemetry, no AI agent-specific visibility" },
  { feature: "eBPF runtime detection", openclaw: "Cilium Tetragon + Falco eBPF — kernel-level enforcement", crowdstrike: "eBPF-based agent available (Falcon Insight)" },
  { feature: "Kubernetes support", openclaw: "Native K8s operator — full cluster visibility", crowdstrike: "Falcon Container Security add-on (additional cost)" },
  { feature: "Pricing model", openclaw: "Open core — free tier + enterprise license", crowdstrike: "Per-endpoint subscription — expensive at scale" },
  { feature: "July 2024 outage risk", openclaw: "N/A — no kernel sensor auto-update", crowdstrike: "Faulty CSO update crashed 8.5M Windows hosts globally" },
  { feature: "Custom detection rules", openclaw: "Full YAML policy customisation, no approval process", crowdstrike: "Custom IOAs available, limited in lower tiers" },
  { feature: "Incident response tooling", openclaw: "Integrated with Moltbot IR workflows, audit chain export", crowdstrike: "Falcon Insight XDR — strong but cloud-dependent" },
  { feature: "Compliance evidence", openclaw: "On-demand SOC2/ISO27001 audit export", crowdstrike: "Report generation via Falcon portal" },
]

const FAQ = [
  { q: "What caused the CrowdStrike global outage in July 2024 and how does OpenClaw avoid this risk?", a: "The July 19, 2024 CrowdStrike outage was caused by a faulty content configuration update (Channel File 291) pushed automatically to the CrowdStrike Falcon sensor. The sensor read out-of-bounds memory, causing Windows kernel panics (BSODs) on 8.5 million endpoints worldwide — grounding airlines, shutting down hospitals, and disrupting critical infrastructure globally. Root cause: automatic kernel-level sensor updates with insufficient testing — the update was pushed to production without staging validation. OpenClaw's architectural difference: no kernel module auto-updates — policy updates are YAML files reviewed and applied through your own change management process. No automatic push from an external vendor. Kernel-level components (if using eBPF) don't change unless you explicitly update and deploy them through your standard CI/CD pipeline." },
  { q: "Is CrowdStrike Falcon GDPR compliant for EU customers?", a: "CrowdStrike operates under a GDPR compliance framework with EU Standard Contractual Clauses (SCCs) for data transfers to the US. However: all telemetry data (process events, network connections, file access, user behaviour) is sent to CrowdStrike's cloud infrastructure. Even with SCCs, this means: your endpoint telemetry — which may contain sensitive business data — is processed in CrowdStrike's infrastructure. You must include CrowdStrike as a data processor in your Art. 30 Records of Processing Activities. For organizations in sectors with strict data localisation requirements (financial services under DORA, healthcare, government), this creates compliance complexity. OpenClaw keeps all telemetry within your infrastructure — no DPA required with a third-party vendor, full Art. 5(1)(f) integrity and confidentiality without relying on vendor assurances." },
  { q: "Does CrowdStrike provide coverage for AI agent and LLM workloads?", a: "CrowdStrike Falcon provides general EDR/XDR telemetry for any process running on monitored endpoints — including processes running AI workloads. However, it has no AI-agent-specific security capabilities: no LLM prompt/output monitoring, no tool-call audit trail, no Moltbot/LangChain integration, no understanding of multi-agent trust boundaries or prompt injection. OpenClaw + Moltbot integration provides: kernel-level syscall attribution per agent session (which agent made which OS call), tool call audit trail (which tool was called with what arguments), anomaly detection on agent behaviour patterns, integration with HMAC-signed audit chains. For organizations running AI agents in production, the combination of OpenClaw (infrastructure EDR) + Moltbot (AI-specific security) provides coverage that no pure-play EDR vendor currently offers." },
  { q: "Who should choose CrowdStrike over OpenClaw?", a: "CrowdStrike Falcon makes sense for: Organizations with large Windows desktop fleets where CrowdStrike's threat intelligence and behavioral AI is a primary defence (CrowdStrike's threat intel is among the best in the industry). Organizations without the engineering capacity to self-manage security tooling — CrowdStrike is a fully managed service. Environments where internet-connected SaaS is acceptable and data sovereignty is not a constraint. Organizations where the Falcon XDR ecosystem (Falcon Discover, Falcon Identity, Falcon Spotlight) provides integrated value across the entire security stack. OpenClaw makes more sense for: Self-hosted infrastructure with strict data sovereignty requirements. Kubernetes/container-native environments where per-endpoint pricing is prohibitive. Organizations running AI agent workloads needing AI-specific observability. Air-gapped or regulated environments where cloud-based telemetry is prohibited." },
]

export default function OpenclawVsCrowdstrikePage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Compare", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 3, name: "OpenClaw vs CrowdStrike", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Produktvergleich für eigene Infrastruktur-Entscheidungen.", "Product comparison for your own infrastructure decisions.")}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Compare · Batch 14</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">OpenClaw vs CrowdStrike Falcon</h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "CrowdStrike ist Marktführer im EDR/XDR-Markt — aber die July-2024-Katastrophe, Cloud-only-Architektur und Datensouveränitätsprobleme machen es zur falschen Wahl für Self-Hosted-Infrastrukturen. Ein ehrlicher Vergleich.", "CrowdStrike leads the EDR/XDR market — but the July 2024 disaster, cloud-only architecture and data sovereignty issues make it the wrong choice for self-hosted infrastructure. An honest comparison.")}
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Feature-Vergleich", "Feature Comparison")}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Feature</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-cyan-400 uppercase">OpenClaw</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">CrowdStrike Falcon</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature} className={`border-b border-gray-700 ${i % 2 === 0 ? "" : "bg-gray-800/40"}`}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-300">{row.feature}</td>
                    <td className="px-4 py-3 text-sm text-green-400">{row.openclaw}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{row.crowdstrike}</td>
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
            <a href={`/${locale}/openclaw/ebpf-security-monitoring`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">eBPF Security Monitoring</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Kernel-Security ohne Vendor-Lock", "Kernel security without vendor lock")}</div>
            </a>
            <a href={`/${locale}/openclaw/runtime-policy-enforcement`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Runtime Policy Enforcement</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Falco + OPA als Alternative", "Falco + OPA as alternative")}</div>
            </a>
            <a href={`/${locale}/clawguru-vs-orca-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">ClawGuru vs Orca Security</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Weiterer Cloud-vs-Self-Hosted-Vergleich", "Another cloud vs self-hosted comparison")}</div>
            </a>
            <a href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Live Security Check</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Eigene Infrastruktur prüfen", "Check your own infrastructure")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
