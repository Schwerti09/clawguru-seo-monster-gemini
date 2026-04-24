import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-identity-verification"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = pick(isDE, "AI Agent Identity Verification: Identitätsverifizierung für AI-Agents | ClawGuru", "AI Agent Identity Verification: Identity Verification for AI Agents | ClawGuru")
  const description = pick(isDE, "AI Agent Identity Verification für Moltbot. SPIFFE/SPIRE, mTLS, Agent Attestation und starke Authentifizierung für AI-Agent-Identitäten in Zero-Trust-Architekturen.", "AI agent identity verification for Moltbot. SPIFFE/SPIRE, mTLS, agent attestation and strong authentication for AI agent identities in zero-trust architectures.")
  return {
    title, description,
    keywords: ["ai agent identity verification", "spiffe spire", "agent attestation", "mtls", "zero trust identity", "moltbot security 2026"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow"
  }
}

export default function AIAgentIdentityVerificationPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">{pick(isDE, "AI Agent Identity Verification", "AI Agent Identity Verification")}</h1>
          <p className="text-lg text-gray-300 mb-4">{pick(isDE, "AI Agent Identity Verification für Moltbot. SPIFFE/SPIRE, mTLS, Agent Attestation und starke Authentifizierung für AI-Agent-Identitäten in Zero-Trust-Architekturen.", "AI agent identity verification for Moltbot. SPIFFE/SPIRE, mTLS, agent attestation and strong authentication for AI agent identities in zero-trust architectures.")}</p>
        </div>
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools.", "This guide is for hardening your own systems. No attack tools.")}
        </div>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Kernkonzepte", "Core Concepts")}</h2>
          <div className="space-y-4">
            {[
              ["1. SPIFFE/SPIRE", pick(isDE, "Secure Production Identity Framework For Everyone. Kryptographische Identitäten für jeden AI-Agent-Workload.", "Secure Production Identity Framework For Everyone. Cryptographic identities for every AI agent workload.")],
              ["2. Agent Attestation", pick(isDE, "Kryptographische Verifikation der Agent-Identität vor jeder Verbindung. Hardware-basierte Attestation für maximale Sicherheit.", "Cryptographic verification of agent identity before every connection. Hardware-based attestation for maximum security.")],
              ["3. mTLS Everywhere", pick(isDE, "Mutual TLS für alle Agent-Kommunikation. Beide Seiten authentifizieren sich gegenseitig — keine Ein-Wege-Authentifizierung.", "Mutual TLS for all agent communication. Both sides authenticate each other — no one-way authentication.")],
              ["4. Short-lived Certificates", pick(isDE, "Kurzlebige X.509-Zertifikate für AI-Agent-Identitäten. Automatische Rotation ohne manuelle Eingriffe.", "Short-lived X.509 certificates for AI agent identities. Automatic rotation without manual intervention.")],
              ["5. Identity Federation", pick(isDE, "Föderierte Identitäten über Cluster- und Cloud-Grenzen hinweg. Einheitliche Identity-Policy für alle Environments.", "Federated identities across cluster and cloud boundaries. Unified identity policy for all environments.")],
            ].map(([t, d]) => (
              <div key={t as string} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-2">{t}</h3>
                <p className="text-sm text-gray-300">{d}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Fortgeschrittene Techniken", "Advanced Techniques")}</h2>
          <div className="space-y-4">
            <div className="bg-green-900 p-4 rounded-lg border border-green-700"><h3 className="font-semibold text-green-300 mb-2">{pick(isDE, "TPM-basierte Attestation", "TPM-based Attestation")}</h3><p className="text-sm text-green-200">{pick(isDE, "Trusted Platform Module für hardware-gebundene Agent-Identitäten. Unveränderlicher Beweis der Agent-Integrität.", "Trusted Platform Module for hardware-bound agent identities. Immutable proof of agent integrity.")}</p></div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700"><h3 className="font-semibold text-blue-300 mb-2">{pick(isDE, "Continuous Authentication", "Continuous Authentication")}</h3><p className="text-sm text-blue-200">{pick(isDE, "Laufende Re-Authentifizierung von AI-Agents während aktiver Sessions. Token-Refresh und Session-Validierung.", "Ongoing re-authentication of AI agents during active sessions. Token refresh and session validation.")}</p></div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700"><h3 className="font-semibold text-yellow-300 mb-2">{pick(isDE, "Identity Threat Detection", "Identity Threat Detection")}</h3><p className="text-sm text-yellow-200">{pick(isDE, "Erkennung von kompromittierten Agent-Identitäten. Anomalie-Detection in Authentifizierungsmustern.", "Detection of compromised agent identities. Anomaly detection in authentication patterns.")}</p></div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700"><h3 className="font-semibold text-red-300 mb-2">{pick(isDE, "Emergency Identity Revocation", "Emergency Identity Revocation")}</h3><p className="text-sm text-red-200">{pick(isDE, "Sofortiger Widerruf aller Credentials bei kompromittierten Agents. Automatisierter Revocation-Prozess.", "Immediate revocation of all credentials for compromised agents. Automated revocation process.")}</p></div>
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Implementierungsschritte", "Implementation Steps")}</h2>
          <div className="space-y-6">
            {[
              [1, pick(isDE, "SPIRE Server deployen", "Deploy SPIRE Server"), pick(isDE, "SPIRE Server als zentralen Identity Provider einrichten. HA-Konfiguration für Production.", "Set up SPIRE Server as central identity provider. HA configuration for production.")],
              [2, pick(isDE, "SPIRE Agent auf allen Nodes", "SPIRE Agent on all nodes"), pick(isDE, "SPIRE Agent DaemonSet auf allen Kubernetes Nodes deployen. Node Attestation konfigurieren.", "Deploy SPIRE Agent DaemonSet on all Kubernetes nodes. Configure node attestation.")],
              [3, pick(isDE, "SVID-Ausstellung konfigurieren", "Configure SVID issuance"), pick(isDE, "Workload Attestation für AI-Agent-Pods konfigurieren. SPIFFE IDs nach Naming Convention vergeben.", "Configure workload attestation for AI agent pods. Assign SPIFFE IDs according to naming convention.")],
              [4, pick(isDE, "mTLS in Service Mesh", "mTLS in service mesh"), pick(isDE, "SPIRE mit Istio oder Envoy integrieren für automatisches mTLS. Cert-Manager Alternative evaluieren.", "Integrate SPIRE with Istio or Envoy for automatic mTLS. Evaluate Cert-Manager alternative.")],
              [5, pick(isDE, "Identity Monitoring einrichten", "Set up identity monitoring"), pick(isDE, "Authentication Events loggen und auf Anomalien monitoren. Alert bei unbekannten Agent-Identitäten.", "Log authentication events and monitor for anomalies. Alert on unknown agent identities.")],
            ].map(([n, t, d]) => (
              <div key={n as number} className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">{n}</div>
                <div><div className="font-semibold text-gray-100 mb-2">{t}</div><div className="text-sm text-gray-300">{d}</div></div>
              </div>
            ))}
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Weiterführende Ressourcen", "Further Resources")}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"><div className="font-semibold text-cyan-400">Security Check</div><div className="text-sm text-gray-300">{pick(isDE, "Infrastruktur prüfen", "Check infrastructure")}</div></a>
            <a href={`/${locale}/runbooks`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"><div className="font-semibold text-cyan-400">Runbooks</div><div className="text-sm text-gray-300">{pick(isDE, "Expert-validierte Security Runbooks", "Expert-validated security runbooks")}</div></a>
            <a href={`/${locale}/openclaw`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"><div className="font-semibold text-cyan-400">OpenClaw</div><div className="text-sm text-gray-300">{pick(isDE, "OpenClaw Security Framework", "OpenClaw Security Framework")}</div></a>
            <a href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"><div className="font-semibold text-cyan-400">Roast My Moltbot</div><div className="text-sm text-gray-300">{pick(isDE, "Moltbot Security Testing", "Moltbot security testing")}</div></a>
          </div>
        </section>
      </div>
    </div>
  )
}
