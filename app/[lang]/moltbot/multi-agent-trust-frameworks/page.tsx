import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/multi-agent-trust-frameworks"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "Multi-Agent Trust Frameworks: Vertrauensmodelle für Multi-Agent-Systeme | ClawGuru"
    : "Multi-Agent Trust Frameworks: Trust Models for Multi-Agent Systems | ClawGuru"
  const description = isDE
    ? "Multi-Agent Trust Frameworks für Moltbot-Deployments. Reputation Systems, Capability Tokens, Secure Communication und Trust Orchestration für Multi-Agent-Systeme. Mit Moltbot automatisierbar."
    : "Multi-agent trust frameworks for Moltbot deployments. Reputation systems, capability tokens, secure communication and trust orchestration for multi-agent systems. Automatable with Moltbot."
  return {
    title,
    description,
    keywords: [
      "multi agent trust", "reputation systems", "capability tokens",
      "secure communication", "trust orchestration", "multi agent security",
      "moltbot security", "ai agent trust", "trust frameworks 2026",
      "security check", "runbooks", "openclaw"
    ],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: {
      title,
      description,
      type: "article",
      url: pageUrl,
      images: ["/og-image.png"]
    },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow"
  }
}

export default function MultiAgentTrustFrameworksPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {isDE ? "Multi-Agent Trust Frameworks" : "Multi-Agent Trust Frameworks"}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {isDE
              ? "Multi-Agent Trust Frameworks für Moltbot-Deployments. Reputation Systems, Capability Tokens, Secure Communication und Trust Orchestration für Multi-Agent-Systeme."
              : "Multi-agent trust frameworks for Moltbot deployments. Reputation systems, capability tokens, secure communication and trust orchestration for multi-agent systems."}
          </p>
        </div>

        {/* Not a Pentest Notice */}
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE
            ? "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools."
            : "This guide is for hardening your own systems. No attack tools."}
        </div>

        {/* Core Concepts */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {isDE ? "Kernkonzepte" : "Core Concepts"}
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "1. Reputation Systems" : "1. Reputation Systems"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Reputation-Systeme für Multi-Agent-Trust. Score-basiertes Trust-Modell mit History und Decay."
                  : "Reputation systems for multi-agent trust. Score-based trust model with history and decay."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "2. Capability Tokens" : "2. Capability Tokens"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Capability Tokens für Agent-Berechtigungen. Fine-grained Access Control für Multi-Agent-Systeme."
                  : "Capability tokens for agent permissions. Fine-grained access control for multi-agent systems."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "3. Secure Communication" : "3. Secure Communication"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Sichere Kommunikation zwischen Agents. mTLS, Signed Message Envelopes und E2E Encryption."
                  : "Secure communication between agents. mTLS, signed message envelopes and E2E encryption."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "4. Trust Orchestration" : "4. Trust Orchestration"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Trust Orchestration für Multi-Agent-Workflows. Trust Propagation und Delegation."
                  : "Trust orchestration for multi-agent workflows. Trust propagation and delegation."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "5. Zero Trust für Agents" : "5. Zero Trust for Agents"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Zero Trust Prinzip für Multi-Agent-Systeme. Never Trust, Always Verify für alle Agent-Interaktionen."
                  : "Zero trust principle for multi-agent systems. Never trust, always verify for all agent interactions."}
              </p>
            </div>
          </div>
        </section>

        {/* Advanced Techniques */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {isDE ? "Fortgeschrittene Techniken" : "Advanced Techniques"}
          </h2>
          <div className="space-y-4">
            <div className="bg-green-900 p-4 rounded-lg border border-green-700">
              <h3 className="font-semibold text-green-300 mb-2">
                {isDE ? "Behavioral Trust Scoring" : "Behavioral Trust Scoring"}
              </h3>
              <p className="text-sm text-green-200">
                {isDE
                  ? "Verhaltens-basiertes Trust Scoring für Agents. Anomalie-Erkennung und Pattern Matching."
                  : "Behavior-based trust scoring for agents. Anomaly detection and pattern matching."}
              </p>
            </div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">
                {isDE ? "Attestation & Provenance" : "Attestation & Provenance"}
              </h3>
              <p className="text-sm text-blue-200">
                {isDE
                  ? "Attestation und Provenance für Agent-Identität. Cryptographic Proofs und Chain of Trust."
                  : "Attestation and provenance for agent identity. Cryptographic proofs and chain of trust."}
              </p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">
                {isDE ? "Trust Revocation" : "Trust Revocation"}
              </h3>
              <p className="text-sm text-yellow-200">
                {isDE
                  ? "Trust Revocation für kompromittierte Agents. Revocation Lists und Real-time Updates."
                  : "Trust revocation for compromised agents. Revocation lists and real-time updates."}
              </p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">
                {isDE ? "Multi-Tenant Isolation" : "Multi-Tenant Isolation"}
              </h3>
              <p className="text-sm text-red-200">
                {isDE
                  ? "Multi-Tenant Isolation für Agent-Workspaces. Namespace-Isolation und Resource Quotas."
                  : "Multi-tenant isolation for agent workspaces. Namespace isolation and resource quotas."}
              </p>
            </div>
          </div>
        </section>

        {/* Implementation Steps */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {isDE ? "Implementierungsschritte" : "Implementation Steps"}
          </h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Reputation System aufbauen" : "Build reputation system"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Implementieren Sie ein Reputation-System für Multi-Agent-Trust. Score, History und Decay."
                    : "Implement a reputation system for multi-agent trust. Score, history and decay."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Capability Tokens implementieren" : "Implement capability tokens"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Implementieren Sie Capability Tokens für Agent-Berechtigungen. JWT-basiert mit Scopes."
                    : "Implement capability tokens for agent permissions. JWT-based with scopes."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Secure Communication einrichten" : "Set up secure communication"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Richten Sie mTLS und Signed Message Envelopes für Agent-Kommunikation ein."
                    : "Set up mTLS and signed message envelopes for agent communication."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Trust Orchestration implementieren" : "Implement trust orchestration"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Implementieren Sie Trust Orchestration für Multi-Agent-Workflows. Trust Propagation."
                    : "Implement trust orchestration for multi-agent workflows. Trust propagation."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">5</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Monitoring & Auditing" : "Monitoring & Auditing"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Überwachen Sie Trust-Scores und Agent-Interaktionen. Audit Logging für Trust-Entscheidungen."
                    : "Monitor trust scores and agent interactions. Audit logging for trust decisions."}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Further Resources */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {isDE ? "Weiterführende Ressourcen" : "Further Resources"}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">
                {isDE ? "Security Check" : "Security Check"}
              </div>
              <div className="text-sm text-gray-300">
                {isDE ? "Überprüfen Sie Ihre Infrastruktur auf Schwachstellen" : "Check your infrastructure for vulnerabilities"}
              </div>
            </a>
            <a href={`/${locale}/runbooks`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">
                {isDE ? "Runbooks" : "Runbooks"}
              </div>
              <div className="text-sm text-gray-300">
                {isDE ? "Expert-validierte Security Runbooks" : "Expert-validated security runbooks"}
              </div>
            </a>
            <a href={`/${locale}/openclaw`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">
                {isDE ? "OpenClaw" : "OpenClaw"}
              </div>
              <div className="text-sm text-gray-300">
                {isDE ? "OpenClaw Security Framework" : "OpenClaw Security Framework"}
              </div>
            </a>
            <a href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">
                {isDE ? "Roast My Moltbot" : "Roast My Moltbot"}
              </div>
              <div className="text-sm text-gray-300">
                {isDE ? "Moltbot Security Testing" : "Moltbot security testing"}
              </div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
