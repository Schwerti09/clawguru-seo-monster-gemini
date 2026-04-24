import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/llm-gateway-advanced-security"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = pick(isDE, "LLM Gateway Advanced Security: Fortgeschrittene Härtung für LLM Gateways | ClawGuru", "LLM Gateway Advanced Security: Advanced Hardening for LLM Gateways | ClawGuru")
  const description = pick(isDE, "Fortgeschrittene LLM Gateway Security für Moltbot-Deployments. Auth, Rate Limiting, Audit Logging, Input Validation und Output Sanitization für Ollama/LocalAI/LiteLLM. Mit Moltbot automatisierbar.", "Advanced LLM gateway security for Moltbot deployments. Auth, rate limiting, audit logging, input validation and output sanitization for Ollama/LocalAI/LiteLLM. Automatable with Moltbot.")
  return {
    title,
    description,
    keywords: [
      "llm gateway security", "ollama security", "localai security",
      "litellm security", "rate limiting", "audit logging",
      "moltbot security", "ai agent gateway", "llm hardening 2026",
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

export default function LLMGatewayAdvancedSecurityPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {pick(isDE, "LLM Gateway Advanced Security", "LLM Gateway Advanced Security")}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {pick(isDE, "Fortgeschrittene LLM Gateway Security für Moltbot-Deployments. Auth, Rate Limiting, Audit Logging, Input Validation und Output Sanitization für Ollama/LocalAI/LiteLLM.", "Advanced LLM gateway security for Moltbot deployments. Auth, rate limiting, audit logging, input validation and output sanitization for Ollama/LocalAI/LiteLLM.")}
          </p>
        </div>

        {/* Not a Pentest Notice */}
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools.", "This guide is for hardening your own systems. No attack tools.")}
        </div>

        {/* Core Concepts */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {pick(isDE, "Kernkonzepte", "Core Concepts")}
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {pick(isDE, "1. Authentication & Authorization", "1. Authentication & Authorization")}
              </h3>
              <p className="text-sm text-gray-300">
                {pick(isDE, "mTLS, API Keys und JWT für LLM Gateway Auth. OAuth2/OIDC Integration für SSO.", "mTLS, API keys and JWT for LLM gateway auth. OAuth2/OIDC integration for SSO.")}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {pick(isDE, "2. Rate Limiting", "2. Rate Limiting")}
              </h3>
              <p className="text-sm text-gray-300">
                {pick(isDE, "Rate Limiting für LLM Gateway APIs. Token-bucket Algorithmus und IP-basierte Limits.", "Rate limiting for LLM gateway APIs. Token-bucket algorithm and IP-based limits.")}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {pick(isDE, "3. Audit Logging", "3. Audit Logging")}
              </h3>
              <p className="text-sm text-gray-300">
                {pick(isDE, "Audit Logging für alle LLM Gateway Requests. Prompt, Response, User und Timestamp loggen.", "Audit logging for all LLM gateway requests. Log prompt, response, user and timestamp.")}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {pick(isDE, "4. Input Validation", "4. Input Validation")}
              </h3>
              <p className="text-sm text-gray-300">
                {pick(isDE, "Input Validation für LLM Prompts. Länge, Encoding und Malicious Pattern Detection.", "Input validation for LLM prompts. Length, encoding and malicious pattern detection.")}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {pick(isDE, "5. Output Sanitization", "5. Output Sanitization")}
              </h3>
              <p className="text-sm text-gray-300">
                {pick(isDE, "Output Sanitization für LLM Responses. HTML/Script Stripping und Sensitive Data Filtering.", "Output sanitization for LLM responses. HTML/script stripping and sensitive data filtering.")}
              </p>
            </div>
          </div>
        </section>

        {/* Advanced Techniques */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {pick(isDE, "Fortgeschrittene Techniken", "Advanced Techniques")}
          </h2>
          <div className="space-y-4">
            <div className="bg-green-900 p-4 rounded-lg border border-green-700">
              <h3 className="font-semibold text-green-300 mb-2">
                {pick(isDE, "Prompt Injection Defense", "Prompt Injection Defense")}
              </h3>
              <p className="text-sm text-green-200">
                {pick(isDE, "Prompt Injection Defense im LLM Gateway. Input Filtering und Runtime Detection.", "Prompt injection defense in LLM gateway. Input filtering and runtime detection.")}
              </p>
            </div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">
                {pick(isDE, "Model Access Control", "Model Access Control")}
              </h3>
              <p className="text-sm text-blue-200">
                {pick(isDE, "Model Access Control für LLM Gateway. User-basierte Model-Zuweisung und RBAC.", "Model access control for LLM gateway. User-based model assignment and RBAC.")}
              </p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">
                {pick(isDE, "Context Window Management", "Context Window Management")}
              </h3>
              <p className="text-sm text-yellow-200">
                {pick(isDE, "Context Window Management für LLM Gateway. Token-Limits und Memory Management.", "Context window management for LLM gateway. Token limits and memory management.")}
              </p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">
                {pick(isDE, "Cost Controls", "Cost Controls")}
              </h3>
              <p className="text-sm text-red-200">
                {pick(isDE, "Cost Controls für LLM Gateway. Token-basierte Abrechnung und Budget-Limits.", "Cost controls for LLM gateway. Token-based billing and budget limits.")}
              </p>
            </div>
          </div>
        </section>

        {/* Implementation Steps */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {pick(isDE, "Implementierungsschritte", "Implementation Steps")}
          </h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {pick(isDE, "Auth Middleware implementieren", "Implement auth middleware")}
                </div>
                <div className="text-sm text-gray-300">
                  {pick(isDE, "Implementieren Sie mTLS und JWT Auth Middleware für LLM Gateway.", "Implement mTLS and JWT auth middleware for LLM gateway.")}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {pick(isDE, "Rate Limiter konfigurieren", "Configure rate limiter")}
                </div>
                <div className="text-sm text-gray-300">
                  {pick(isDE, "Konfigurieren Sie Rate Limiting für LLM Gateway APIs. Token-bucket und IP-basierte Limits.", "Configure rate limiting for LLM gateway APIs. Token-bucket and IP-based limits.")}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {pick(isDE, "Audit Logger einrichten", "Set up audit logger")}
                </div>
                <div className="text-sm text-gray-300">
                  {pick(isDE, "Richten Sie Audit Logging für alle LLM Gateway Requests ein. Prompt, Response und User loggen.", "Set up audit logging for all LLM gateway requests. Log prompt, response and user.")}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {pick(isDE, "Input/Output Sanitization", "Input/Output sanitization")}
                </div>
                <div className="text-sm text-gray-300">
                  {pick(isDE, "Implementieren Sie Input Validation und Output Sanitization für LLM Gateway.", "Implement input validation and output sanitization for LLM gateway.")}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">5</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {pick(isDE, "Monitoring & Alerting", "Monitoring & Alerting")}
                </div>
                <div className="text-sm text-gray-300">
                  {pick(isDE, "Überwachen Sie LLM Gateway Metriken und richten Sie Alerting für Anomalien ein.", "Monitor LLM gateway metrics and set up alerting for anomalies.")}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Further Resources */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {pick(isDE, "Weiterführende Ressourcen", "Further Resources")}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">
                {pick(isDE, "Security Check", "Security Check")}
              </div>
              <div className="text-sm text-gray-300">
                {pick(isDE, "Überprüfen Sie Ihre Infrastruktur auf Schwachstellen", "Check your infrastructure for vulnerabilities")}
              </div>
            </a>
            <a href={`/${locale}/runbooks`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">
                {pick(isDE, "Runbooks", "Runbooks")}
              </div>
              <div className="text-sm text-gray-300">
                {pick(isDE, "Expert-validierte Security Runbooks", "Expert-validated security runbooks")}
              </div>
            </a>
            <a href={`/${locale}/openclaw`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">
                {pick(isDE, "OpenClaw", "OpenClaw")}
              </div>
              <div className="text-sm text-gray-300">
                {pick(isDE, "OpenClaw Security Framework", "OpenClaw Security Framework")}
              </div>
            </a>
            <a href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">
                {pick(isDE, "Roast My Moltbot", "Roast My Moltbot")}
              </div>
              <div className="text-sm text-gray-300">
                {pick(isDE, "Moltbot Security Testing", "Moltbot security testing")}
              </div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
