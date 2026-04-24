import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/solutions/zero-trust-architecture"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "Zero Trust Architecture für Self-Hosted Infrastruktur 2026 | ClawGuru", "Zero Trust Architecture for Self-Hosted Infrastructure 2026 | ClawGuru")
  const description = pick(isDE, "Zero Trust vollständig selbst hosten: Identity, Device Trust, Micro-Segmentierung, SASE-Alternativen und AI-Agent-Integration. Schritt-für-Schritt-Implementierung ohne Vendor-Lock-in.", "Self-hosted Zero Trust architecture: identity, device trust, micro-segmentation, SASE alternatives and AI agent integration. Step-by-step implementation without vendor lock-in.")
  return {
    title, description,
    keywords: ["zero trust architecture self-hosted", "zero trust implementation", "zero trust without vendor lock-in", "ztna self-hosted", "zero trust ai agents", "zero trust 2026"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const ZT_PILLARS = [
  { id: "P1", name: "Identity", desc: "Every user, service, and agent must authenticate before access. No implicit trust based on network location.", tools: ["Keycloak (self-hosted IdP)", "Authelia (reverse proxy auth)", "mTLS for service identities", "Moltbot capability tokens for agents"], status: "Foundational" },
  { id: "P2", name: "Device Trust", desc: "Verify device posture before granting access. Unmanaged or compromised devices denied regardless of user identity.", tools: ["Tailscale (device-based VPN)", "WireGuard with device certificates", "Headscale (self-hosted Tailscale control plane)", "OpenWRT with certificate-based access"], status: "High Value" },
  { id: "P3", name: "Network Micro-Segmentation", desc: "Split the network into small segments. Compromise of one segment cannot reach others without explicit policy.", tools: ["Kubernetes NetworkPolicy", "Cilium (eBPF-based network policy)", "Istio service mesh (mTLS + authz)", "Linux namespaces + iptables"], status: "Critical" },
  { id: "P4", name: "Application Access", desc: "Access granted per-application, not per-network. Users access specific apps, not the whole network.", tools: ["Nginx + Authelia (app-level auth)", "Teleport (self-hosted app access)", "Boundary (HashiCorp)", "OAuth2-Proxy + Keycloak"], status: "High Value" },
  { id: "P5", name: "Data Protection", desc: "Data classified and protected at rest and in transit. Access logged, DLP in place.", tools: ["MinIO with encryption at rest", "Vault (secrets management)", "Cryptomator for client-side encryption", "PostgreSQL TDE"], status: "Compliance" },
  { id: "P6", name: "Continuous Monitoring", desc: "All access events logged, anomalies detected in real-time. Trust is continuously re-evaluated.", tools: ["OpenClaw (security observability)", "Falco (runtime detection)", "Loki + Grafana (log monitoring)", "Moltbot (AI agent monitoring)"], status: "Ongoing" },
]

const FAQ = [
  { q: "What is Zero Trust and why does it matter for self-hosted infrastructure?", a: "Zero Trust is a security model where no user, device, or service is trusted by default — even inside the network perimeter. Traditional security assumed that everything inside the network was safe. Zero Trust assumes breach: every request must be authenticated, authorized, and audited regardless of source. For self-hosted infrastructure this matters because: 1) You control the perimeter — you can implement proper ZT without SaaS lock-in. 2) Self-hosted means more attack surface (exposed services, SSH, admin panels). 3) AI agents add non-human actors that require explicit trust policies." },
  { q: "How do I start implementing Zero Trust without buying commercial SASE?", a: "Start with the highest-value steps: 1) Identity (free): Deploy Keycloak or Authelia — SSO for all internal services. 2) Device trust (cheap): Tailscale or Headscale — VPN that requires device certificates. 3) Micro-segmentation (free for K8s): Kubernetes NetworkPolicy — deny all, allow explicit. 4) Remove VPN/firewall implicit trust: replace 'inside network = trusted' with per-service authentication. This 4-step foundation gives you 80% of Zero Trust benefits without any commercial tooling." },
  { q: "How does Zero Trust integrate with AI agents?", a: "AI agents are non-human principals that require special Zero Trust treatment: 1) Agent Identity: each agent gets an mTLS client certificate — identity verified on every request. 2) Capability tokens: fine-grained authorization per operation (scope, tools, data access). 3) Micro-segmentation: each agent in its own network segment — cannot reach outside declared services. 4) Continuous verification: behavioral monitoring with automatic suspension on anomaly. 5) Audit logging: all agent actions logged with cryptographic integrity. Moltbot implements all of this as an AI-specific Zero Trust layer." },
  { q: "What is the difference between ZTNA and Zero Trust Architecture?", a: "ZTNA (Zero Trust Network Access) is one component of Zero Trust Architecture — specifically the network access layer that replaces traditional VPN. Full Zero Trust Architecture is broader: ZTNA (network access) + Identity and Access Management (IAM) + Device Trust + Micro-segmentation + Data Classification + Continuous Monitoring. Commercial SASE (Secure Access Service Edge) vendors bundle these into a cloud service. Self-hosted Zero Trust builds each component independently using open-source tools — more control, no vendor lock-in, full data residency." },
]

export default function ZeroTrustArchitecturePage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Solutions", item: `${SITE_URL}/${locale}/solutions` },
      { "@type": "ListItem", position: 3, name: "Zero Trust Architecture", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@context": "https://schema.org", "@type": "HowTo", name: "Implement Zero Trust Architecture Self-Hosted", totalTime: "PT80H",
      step: ZT_PILLARS.map((p) => ({ "@type": "HowToStep", name: p.name, text: p.desc })),
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Architektur-Leitfaden für eigene Infrastruktur.", "Architecture guide for your own infrastructure.")}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Solutions · Batch 5</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          {pick(isDE, "Zero Trust Architecture: Self-Hosted ohne Vendor-Lock-in", "Zero Trust Architecture: Self-Hosted Without Vendor Lock-in")}
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "Zero Trust bedeutet nicht SASE kaufen. Es bedeutet: jeden Zugriff explizit authentifizieren, autorisieren und loggen — mit Open-Source-Tools, die du selbst kontrollierst. Sechs Säulen, konkrete Tools, klare Prioritäten.", "Zero Trust doesn't mean buying SASE. It means: explicitly authenticate, authorize and log every access — with open-source tools you control. Six pillars, concrete tools, clear priorities.")}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { value: "6", label: pick(isDE, "ZT-Säulen", "ZT pillars") },
            { value: "0", label: pick(isDE, "Implizites Vertrauen", "Implicit trust") },
            { value: "100%", label: pick(isDE, "OSS-Stack", "OSS stack") },
            { value: "0", label: "Vendor Lock-in" },
          ].map((s) => (
            <div key={s.label} className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
              <div className="text-2xl font-black text-cyan-400">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Die 6 Zero-Trust-Säulen", "The 6 Zero Trust Pillars")}</h2>
          <div className="space-y-4">
            {ZT_PILLARS.map((p) => (
              <div key={p.id} className="bg-gray-800 p-5 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-cyan-400 bg-gray-900 px-2 py-0.5 rounded">{p.id}</span>
                    <span className="font-semibold text-gray-100 text-lg">{p.name}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    p.status === "Critical" ? "bg-red-900 text-red-300"
                    : p.status === "Foundational" ? "bg-blue-900 text-blue-300"
                    : p.status === "High Value" ? "bg-green-900 text-green-300"
                    : p.status === "Ongoing" ? "bg-purple-900 text-purple-300"
                    : "bg-yellow-900 text-yellow-300"
                  }`}>{p.status}</span>
                </div>
                <p className="text-sm text-gray-300 mb-3">{p.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {p.tools.map((t) => <span key={t} className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">{t}</span>)}
                </div>
              </div>
            ))}
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
            <a href={`/${locale}/moltbot/zero-trust-ai-agents`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Zero Trust AI Agents</div>
              <div className="text-sm text-gray-300">{pick(isDE, "ZT für KI-Agenten", "ZT for AI agents")}</div>
            </a>
            <a href={`/${locale}/solutions/nist-csf-compliance`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">NIST CSF 2.0</div>
              <div className="text-sm text-gray-300">{pick(isDE, "ZT maps to NIST Protect", "ZT maps to NIST Protect")}</div>
            </a>
            <a href={`/${locale}/solutions/eu-ai-act-compliance`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">EU AI Act</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Art. 15 Cybersecurity", "Art. 15 Cybersecurity")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security Hub</div>
              <div className="text-sm text-gray-300">OWASP LLM Top 10</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
