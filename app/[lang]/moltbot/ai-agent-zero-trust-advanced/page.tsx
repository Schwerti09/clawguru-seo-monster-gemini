import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-zero-trust-advanced"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "AI Agent Zero Trust Advanced: Fortgeschrittene Zero Trust für AI-Agents | ClawGuru"
    : "AI Agent Zero Trust Advanced: Advanced Zero Trust for AI Agents | ClawGuru"
  const description = isDE
    ? "AI Agent Zero Trust Advanced für Moltbot-Deployments. Never Trust, Always Verify für AI-Agents. Identity Verification, Least Privilege, Continuous Validation und Micro-Segmentation. Mit Moltbot automatisierbar."
    : "AI agent zero trust advanced for Moltbot deployments. Never trust, always verify for AI agents. Identity verification, least privilege, continuous validation and micro-segmentation. Automatable with Moltbot."
  return {
    title,
    description,
    keywords: [
      "ai agent zero trust", "never trust always verify", "identity verification",
      "least privilege", "continuous validation", "micro segmentation",
      "moltbot security", "ai agent zero trust 2026",
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

export default function AIAgentZeroTrustAdvancedPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {isDE ? "AI Agent Zero Trust Advanced" : "AI Agent Zero Trust Advanced"}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {isDE
              ? "AI Agent Zero Trust Advanced für Moltbot-Deployments. Never Trust, Always Verify für AI-Agents. Identity Verification, Least Privilege, Continuous Validation und Micro-Segmentation."
              : "AI agent zero trust advanced for Moltbot deployments. Never trust, always verify for AI agents. Identity verification, least privilege, continuous validation and micro-segmentation."}
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
                {isDE ? "1. Never Trust, Always Verify" : "1. Never Trust, Always Verify"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Zero Trust Prinzip für AI-Agents. Keine implizite Vertrauenswürdigkeit, immer verifizieren."
                  : "Zero trust principle for AI agents. No implicit trust, always verify."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "2. Identity Verification" : "2. Identity Verification"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Identity Verification für AI-Agents. Strong Authentication, Multi-Factor und Device Trust."
                  : "Identity verification for AI agents. Strong authentication, multi-factor and device trust."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "3. Least Privilege" : "3. Least Privilege"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Least Privilege für AI-Agents. Minimale Berechtigungen, Just-in-Time Access und Dynamic Permissions."
                  : "Least privilege for AI agents. Minimal permissions, just-in-time access and dynamic permissions."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "4. Continuous Validation" : "4. Continuous Validation"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Continuous Validation für AI-Agents. Real-time Trust Scoring und Behavioral Analysis."
                  : "Continuous validation for AI agents. Real-time trust scoring and behavioral analysis."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "5. Micro-Segmentation" : "5. Micro-Segmentation"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Micro-Segmentation für AI-Agents. Network Isolation, Perimeter-less Security und Blast Radius Reduction."
                  : "Micro-segmentation for AI agents. Network isolation, perimeter-less security and blast radius reduction."}
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
                {isDE ? "Dynamic Trust Scoring" : "Dynamic Trust Scoring"}
              </h3>
              <p className="text-sm text-green-200">
                {isDE
                  ? "Dynamisches Trust Scoring für AI-Agents. Context-basierte Trust-Entscheidungen in Echtzeit."
                  : "Dynamic trust scoring for AI agents. Context-based trust decisions in real-time."}
              </p>
            </div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">
                {isDE ? "Adaptive Access Control" : "Adaptive Access Control"}
              </h3>
              <p className="text-sm text-blue-200">
                {isDE
                  ? "Adaptive Access Control für AI-Agents. Risk-basierte Autorisierung und Dynamic Policies."
                  : "Adaptive access control for AI agents. Risk-based authorization and dynamic policies."}
              </p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">
                {isDE ? "Zero Trust Networking" : "Zero Trust Networking"}
              </h3>
              <p className="text-sm text-yellow-200">
                {isDE
                  ? "Zero Trust Networking für AI-Agents. mTLS, Mutual Auth und Encrypted East-West Traffic."
                  : "Zero trust networking for AI agents. mTLS, mutual auth and encrypted east-west traffic."}
              </p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">
                {isDE ? "Trust Orchestration" : "Trust Orchestration"}
              </h3>
              <p className="text-sm text-red-200">
                {isDE
                  ? "Trust Orchestration für Multi-Agent-Systeme. Centralized Trust Management und Policy Enforcement."
                  : "Trust orchestration for multi-agent systems. Centralized trust management and policy enforcement."}
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
                  {isDE ? "Identity Layer implementieren" : "Implement identity layer"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Implementieren Sie Strong Identity Verification für AI-Agents. MFA und Device Trust."
                    : "Implement strong identity verification for AI agents. MFA and device trust."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Least Privilege enforce" : "Enforce least privilege"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Implementieren Sie Least Privilege mit Just-in-Time Access und Dynamic Permissions."
                    : "Implement least privilege with just-in-time access and dynamic permissions."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Continuous Validation" : "Continuous validation"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Implementieren Sie Continuous Validation mit Real-time Trust Scoring und Behavioral Analysis."
                    : "Implement continuous validation with real-time trust scoring and behavioral analysis."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Micro-Segmentation" : "Micro-segmentation"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Implementieren Sie Micro-Segmentation mit Network Isolation und Blast Radius Reduction."
                    : "Implement micro-segmentation with network isolation and blast radius reduction."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">5</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Trust Dashboard" : "Trust dashboard"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Erstellen Sie ein Trust Dashboard für Monitoring und Auditing. Real-time Trust Scores."
                    : "Create a trust dashboard for monitoring and auditing. Real-time trust scores."}
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
