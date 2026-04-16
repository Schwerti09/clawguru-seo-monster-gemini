import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/agentic-rag-security-patterns"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "Agentic RAG Security Patterns: Sicherheit für RAG-Systeme | ClawGuru"
    : "Agentic RAG Security Patterns: Security for RAG Systems | ClawGuru"
  const description = isDE
    ? "Agentic RAG Security Patterns für Moltbot-Deployments. Vector DB Security, Retrieval Access Control, Document Filtering und Injection Protection für RAG-Systeme. Mit Moltbot automatisierbar."
    : "Agentic RAG security patterns for Moltbot deployments. Vector DB security, retrieval access control, document filtering and injection protection for RAG systems. Automatable with Moltbot."
  return {
    title,
    description,
    keywords: [
      "rag security", "vector db security", "retrieval access control",
      "document filtering", "injection protection", "agentic rag",
      "moltbot security", "ai agent rag", "rag security patterns 2026",
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

export default function AgenticRAGSecurityPatternsPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {isDE ? "Agentic RAG Security Patterns" : "Agentic RAG Security Patterns"}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {isDE
              ? "Agentic RAG Security Patterns für Moltbot-Deployments. Vector DB Security, Retrieval Access Control, Document Filtering und Injection Protection für RAG-Systeme."
              : "Agentic RAG security patterns for Moltbot deployments. Vector DB security, retrieval access control, document filtering and injection protection for RAG systems."}
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
                {isDE ? "1. Vector DB Security" : "1. Vector DB Security"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Vector Database Security für RAG-Systeme. Auth, Encryption, Network Isolation und RBAC."
                  : "Vector database security for RAG systems. Auth, encryption, network isolation and RBAC."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "2. Retrieval Access Control" : "2. Retrieval Access Control"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Retrieval Access Control für RAG. User-basierte Document Filtering und Row-Level Security."
                  : "Retrieval access control for RAG. User-based document filtering and row-level security."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "3. Document Filtering" : "3. Document Filtering"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Document Filtering für RAG-Systeme. PII Removal, Sensitive Data Masking und Content Classification."
                  : "Document filtering for RAG systems. PII removal, sensitive data masking and content classification."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "4. Injection Protection" : "4. Injection Protection"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Injection Protection für RAG. Prompt Injection Detection und Retrieval Poisoning Prevention."
                  : "Injection protection for RAG. Prompt injection detection and retrieval poisoning prevention."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "5. Context Window Security" : "5. Context Window Security"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Context Window Security für RAG. Token-Limits, Truncation und Relevance Filtering."
                  : "Context window security for RAG. Token limits, truncation and relevance filtering."}
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
                {isDE ? "Hybrid Search Security" : "Hybrid Search Security"}
              </h3>
              <p className="text-sm text-green-200">
                {isDE
                  ? "Hybrid Search Security für RAG. Keyword + Vector Search mit Security Filtering."
                  : "Hybrid search security for RAG. Keyword + vector search with security filtering."}
              </p>
            </div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">
                {isDE ? "Chunking Security" : "Chunking Security"}
              </h3>
              <p className="text-sm text-blue-200">
                {isDE
                  ? "Chunking Security für RAG-Dokumente. Secure Chunking und Boundary Detection."
                  : "Chunking security for RAG documents. Secure chunking and boundary detection."}
              </p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">
                {isDE ? "Embedding Security" : "Embedding Security"}
              </h3>
              <p className="text-sm text-yellow-200">
                {isDE
                  ? "Embedding Security für RAG. Embedding Access Control und Model Isolation."
                  : "Embedding security for RAG. Embedding access control and model isolation."}
              </p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">
                {isDE ? "Reranking Security" : "Reranking Security"}
              </h3>
              <p className="text-sm text-red-200">
                {isDE
                  ? "Reranking Security für RAG. Bias Detection und Fairness Filtering."
                  : "Reranking security for RAG. Bias detection and fairness filtering."}
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
                  {isDE ? "Vector DB sichern" : "Secure vector DB"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Sichern Sie Vector Database mit Auth, Encryption und Network Isolation."
                    : "Secure vector database with auth, encryption and network isolation."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Retrieval Access Control implementieren" : "Implement retrieval access control"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Implementieren Sie Retrieval Access Control mit User-basiertem Document Filtering."
                    : "Implement retrieval access control with user-based document filtering."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Document Filtering Pipeline" : "Document filtering pipeline"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Erstellen Sie eine Document Filtering Pipeline mit PII Removal und Sensitive Data Masking."
                    : "Create a document filtering pipeline with PII removal and sensitive data masking."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Injection Protection hinzufügen" : "Add injection protection"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Fügen Sie Prompt Injection Detection und Retrieval Poisoning Prevention hinzu."
                    : "Add prompt injection detection and retrieval poisoning prevention."}
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
                    ? "Überwachen Sie RAG-Queries und Retrieval-Results. Audit Logging für Access Control."
                    : "Monitor RAG queries and retrieval results. Audit logging for access control."}
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
                {isDE ? "KI-generierte Security Runbooks" : "AI-generated security runbooks"}
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
