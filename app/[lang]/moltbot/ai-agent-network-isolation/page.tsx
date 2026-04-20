import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-network-isolation"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE ? "AI Agent Network Isolation: Netzwerk-Isolierung für AI-Agents | ClawGuru" : "AI Agent Network Isolation: Network Isolation for AI Agents | ClawGuru"
  const description = isDE ? "AI Agent Network Isolation für Moltbot. Network Policies, Micro-Segmentation, Egress Control und Air-Gapped Deployments für maximale AI-Agent-Sicherheit." : "AI agent network isolation for Moltbot. Network policies, micro-segmentation, egress control and air-gapped deployments for maximum AI agent security."
  return {
    title, description,
    keywords: ["ai agent network isolation", "network policies", "micro segmentation", "egress control", "air gapped", "moltbot security 2026"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow"
  }
}

export default function AIAgentNetworkIsolationPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "AI Agent Network Isolation" : "AI Agent Network Isolation"}</h1>
          <p className="text-lg text-gray-300 mb-4">{isDE ? "AI Agent Network Isolation für Moltbot. Network Policies, Micro-Segmentation, Egress Control und Air-Gapped Deployments für maximale AI-Agent-Sicherheit." : "AI agent network isolation for Moltbot. Network policies, micro-segmentation, egress control and air-gapped deployments for maximum AI agent security."}</p>
        </div>
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools." : "This guide is for hardening your own systems. No attack tools."}
        </div>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Kernkonzepte" : "Core Concepts"}</h2>
          <div className="space-y-4">
            {[
              ["1. Network Policies", isDE ? "Kubernetes Network Policies für granulare Pod-zu-Pod Kommunikationskontrolle. Default-Deny und explizite Allowlists." : "Kubernetes Network Policies for granular pod-to-pod communication control. Default-deny and explicit allowlists."],
              ["2. Micro-Segmentation", isDE ? "Feinkörnige Netzwerk-Segmentierung für jeden AI-Agent-Typ. Verhindert laterale Bewegung bei Kompromittierung." : "Fine-grained network segmentation for each AI agent type. Prevents lateral movement on compromise."],
              ["3. Egress Control", isDE ? "Strikte Kontrolle ausgehender Verbindungen von AI-Agents. Nur explizit erlaubte externe Endpunkte erreichbar." : "Strict control of outgoing connections from AI agents. Only explicitly allowed external endpoints reachable."],
              ["4. Service Mesh Security", isDE ? "mTLS für alle Service-zu-Service Kommunikation über Istio oder Linkerd. Verschlüsselung und Authentifizierung im Cluster." : "mTLS for all service-to-service communication via Istio or Linkerd. Encryption and authentication in the cluster."],
              ["5. DNS Security", isDE ? "Sichere DNS-Auflösung für AI-Agents. DNS-over-TLS, DNSSEC und Filterung von Malicious Domains." : "Secure DNS resolution for AI agents. DNS-over-TLS, DNSSEC and filtering of malicious domains."],
            ].map(([t, d]) => (
              <div key={t as string} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-2">{t}</h3>
                <p className="text-sm text-gray-300">{d}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Fortgeschrittene Techniken" : "Advanced Techniques"}</h2>
          <div className="space-y-4">
            <div className="bg-green-900 p-4 rounded-lg border border-green-700"><h3 className="font-semibold text-green-300 mb-2">{isDE ? "eBPF-basierte Netzwerksicherheit" : "eBPF-based Network Security"}</h3><p className="text-sm text-green-200">{isDE ? "Cilium mit eBPF für hochperformante Netzwerkpolicies. L7-Sichtbarkeit ohne Performance-Einbußen." : "Cilium with eBPF for high-performance network policies. L7 visibility without performance overhead."}</p></div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700"><h3 className="font-semibold text-blue-300 mb-2">{isDE ? "Air-Gapped Deployments" : "Air-Gapped Deployments"}</h3><p className="text-sm text-blue-200">{isDE ? "Vollständig isolierte AI-Agent-Deployments ohne Internet-Zugang. Für hochsensible Anwendungsfälle." : "Fully isolated AI agent deployments without internet access. For highly sensitive use cases."}</p></div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700"><h3 className="font-semibold text-yellow-300 mb-2">{isDE ? "Network Traffic Analysis" : "Network Traffic Analysis"}</h3><p className="text-sm text-yellow-200">{isDE ? "Echtzeit-Analyse des Netzwerkverkehrs auf Anomalien. Erkennung von Data Exfiltration und C2-Kommunikation." : "Real-time network traffic analysis for anomalies. Detection of data exfiltration and C2 communication."}</p></div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700"><h3 className="font-semibold text-red-300 mb-2">{isDE ? "Private Endpoints" : "Private Endpoints"}</h3><p className="text-sm text-red-200">{isDE ? "Alle Cloud-Service-Verbindungen über Private Endpoints. Kein Traffic über Public Internet für sensitive Daten." : "All cloud service connections via private endpoints. No traffic over public internet for sensitive data."}</p></div>
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Implementierungsschritte" : "Implementation Steps"}</h2>
          <div className="space-y-6">
            {[
              [1, isDE ? "Netzwerk-Topologie planen" : "Plan network topology", isDE ? "AI-Agent-Netzwerke segmentieren. DMZ für externe Agents, interne Zone für sensitive Verarbeitung." : "Segment AI agent networks. DMZ for external agents, internal zone for sensitive processing."],
              [2, isDE ? "Default-Deny Policy einrichten" : "Set up default-deny policy", isDE ? "Kubernetes NetworkPolicy mit Default-Deny für alle Pods. Dann explizite Allowlists definieren." : "Kubernetes NetworkPolicy with default-deny for all pods. Then define explicit allowlists."],
              [3, isDE ? "Egress-Filterung aktivieren" : "Enable egress filtering", isDE ? "Ausgehende Verbindungen auf erlaubte Endpunkte beschränken. FQDN-basierte Policies mit Cilium." : "Restrict outgoing connections to allowed endpoints. FQDN-based policies with Cilium."],
              [4, isDE ? "Service Mesh deployen" : "Deploy service mesh", isDE ? "Istio oder Linkerd für mTLS im Cluster einrichten. Alle Agent-zu-Agent-Verbindungen verschlüsselt." : "Set up Istio or Linkerd for mTLS in the cluster. All agent-to-agent connections encrypted."],
              [5, isDE ? "Netzwerk-Monitoring aktivieren" : "Enable network monitoring", isDE ? "Network Flow Logs aktivieren und an SIEM weiterleiten. Alerts bei ungewöhnlichen Verbindungen." : "Enable network flow logs and forward to SIEM. Alerts on unusual connections."],
            ].map(([n, t, d]) => (
              <div key={n as number} className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">{n}</div>
                <div><div className="font-semibold text-gray-100 mb-2">{t}</div><div className="text-sm text-gray-300">{d}</div></div>
              </div>
            ))}
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Weiterführende Ressourcen" : "Further Resources"}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"><div className="font-semibold text-cyan-400">Security Check</div><div className="text-sm text-gray-300">{isDE ? "Infrastruktur prüfen" : "Check infrastructure"}</div></a>
            <a href={`/${locale}/runbooks`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"><div className="font-semibold text-cyan-400">Runbooks</div><div className="text-sm text-gray-300">{isDE ? "Expert-validierte Security Runbooks" : "Expert-validated security runbooks"}</div></a>
            <a href={`/${locale}/openclaw`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"><div className="font-semibold text-cyan-400">OpenClaw</div><div className="text-sm text-gray-300">{isDE ? "OpenClaw Security Framework" : "OpenClaw Security Framework"}</div></a>
            <a href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"><div className="font-semibold text-cyan-400">Roast My Moltbot</div><div className="text-sm text-gray-300">{isDE ? "Moltbot Security Testing" : "Moltbot security testing"}</div></a>
          </div>
        </section>
      </div>
    </div>
  )
}
