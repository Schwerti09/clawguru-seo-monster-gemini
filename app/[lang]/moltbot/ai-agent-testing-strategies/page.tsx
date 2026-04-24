import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-testing-strategies"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = pick(isDE, "AI Agent Testing Strategies: Teststrategien für AI-Agents | ClawGuru", "AI Agent Testing Strategies: Testing Strategies for AI Agents | ClawGuru")
  const description = pick(isDE, "AI Agent Testing Strategies für Moltbot-Deployments. Unit Testing, Integration Testing, Adversarial Testing und Performance Testing für AI-Agents. Mit Moltbot automatisierbar.", "AI agent testing strategies for Moltbot deployments. Unit testing, integration testing, adversarial testing and performance testing for AI agents. Automatable with Moltbot.")
  return {
    title,
    description,
    keywords: [
      "ai agent testing", "unit testing", "integration testing",
      "adversarial testing", "performance testing", "ai agent quality",
      "moltbot security", "ai agent test strategies", "testing 2026",
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

export default function AIAgentTestingStrategiesPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {pick(isDE, "AI Agent Testing Strategies", "AI Agent Testing Strategies")}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {pick(isDE, "AI Agent Testing Strategies für Moltbot-Deployments. Unit Testing, Integration Testing, Adversarial Testing und Performance Testing für AI-Agents.", "AI agent testing strategies for Moltbot deployments. Unit testing, integration testing, adversarial testing and performance testing for AI agents.")}
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
                {pick(isDE, "1. Unit Testing", "1. Unit Testing")}
              </h3>
              <p className="text-sm text-gray-300">
                {pick(isDE, "Unit Testing für AI-Agent-Komponenten. Isolierte Tests für einzelne Agent-Funktionen und Logik.", "Unit testing for AI agent components. Isolated tests for individual agent functions and logic.")}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {pick(isDE, "2. Integration Testing", "2. Integration Testing")}
              </h3>
              <p className="text-sm text-gray-300">
                {pick(isDE, "Integration Testing für Multi-Agent-Systeme. End-to-End Tests für Agent-Workflows und Kommunikation.", "Integration testing for multi-agent systems. End-to-end tests for agent workflows and communication.")}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {pick(isDE, "3. Adversarial Testing", "3. Adversarial Testing")}
              </h3>
              <p className="text-sm text-gray-300">
                {pick(isDE, "Adversarial Testing für AI-Agents. Prompt Injection, Jailbreaks und Evasion Attacks testen.", "Adversarial testing for AI agents. Test prompt injection, jailbreaks and evasion attacks.")}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {pick(isDE, "4. Performance Testing", "4. Performance Testing")}
              </h3>
              <p className="text-sm text-gray-300">
                {pick(isDE, "Performance Testing für AI-Agents. Latency, Throughput und Resource Usage messen.", "Performance testing for AI agents. Measure latency, throughput and resource usage.")}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {pick(isDE, "5. Regression Testing", "5. Regression Testing")}
              </h3>
              <p className="text-sm text-gray-300">
                {pick(isDE, "Regression Testing für AI-Agents. Automatisierte Tests nach Updates und Deployments.", "Regression testing for AI agents. Automated tests after updates and deployments.")}
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
                {pick(isDE, "Behavioral Testing", "Behavioral Testing")}
              </h3>
              <p className="text-sm text-green-200">
                {pick(isDE, "Verhaltens-basiertes Testing für AI-Agents. Expected Behavior vs. Actual Behavior vergleichen.", "Behavior-based testing for AI agents. Compare expected behavior vs actual behavior.")}
              </p>
            </div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">
                {pick(isDE, "Property-Based Testing", "Property-Based Testing")}
              </h3>
              <p className="text-sm text-blue-200">
                {pick(isDE, "Property-Based Testing für AI-Agents. Invariante und Eigenschaften über viele Testfälle validieren.", "Property-based testing for AI agents. Validate invariants and properties across many test cases.")}
              </p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">
                {pick(isDE, "Chaos Engineering", "Chaos Engineering")}
              </h3>
              <p className="text-sm text-yellow-200">
                {pick(isDE, "Chaos Engineering für Multi-Agent-Systeme. Fault Injection und Resilience Testing.", "Chaos engineering for multi-agent systems. Fault injection and resilience testing.")}
              </p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">
                {pick(isDE, "Continuous Testing", "Continuous Testing")}
              </h3>
              <p className="text-sm text-red-200">
                {pick(isDE, "Continuous Testing für AI-Agents. Automatisierte Tests in CI/CD-Pipelines integrieren.", "Continuous testing for AI agents. Integrate automated tests in CI/CD pipelines.")}
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
                  {pick(isDE, "Test Framework aufbauen", "Build test framework")}
                </div>
                <div className="text-sm text-gray-300">
                  {pick(isDE, "Implementieren Sie ein Test Framework für AI-Agents. Unit, Integration und Adversarial Tests.", "Implement a test framework for AI agents. Unit, integration and adversarial tests.")}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {pick(isDE, "Test Suites erstellen", "Create test suites")}
                </div>
                <div className="text-sm text-gray-300">
                  {pick(isDE, "Erstellen Sie Test Suites für verschiedene Agent-Szenarien. Happy Path und Edge Cases.", "Create test suites for various agent scenarios. Happy path and edge cases.")}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {pick(isDE, "Adversarial Test Cases", "Adversarial test cases")}
                </div>
                <div className="text-sm text-gray-300">
                  {pick(isDE, "Entwickeln Sie Adversarial Test Cases. Prompt Injection, Jailbreaks und Evasion Patterns.", "Develop adversarial test cases. Prompt injection, jailbreaks and evasion patterns.")}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {pick(isDE, "CI/CD Integration", "CI/CD integration")}
                </div>
                <div className="text-sm text-gray-300">
                  {pick(isDE, "Integrieren Sie Tests in CI/CD-Pipelines. Automatisierte Tests bei jedem Deployment.", "Integrate tests in CI/CD pipelines. Automated tests on every deployment.")}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">5</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {pick(isDE, "Reporting & Coverage", "Reporting & Coverage")}
                </div>
                <div className="text-sm text-gray-300">
                  {pick(isDE, "Erstellen Sie Test Reports und messen Sie Code Coverage. Test Metriken tracken.", "Create test reports and measure code coverage. Track test metrics.")}
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
