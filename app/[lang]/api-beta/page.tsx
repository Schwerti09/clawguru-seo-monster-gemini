import type { Metadata } from "next"
import Link from "next/link"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { Shield, Code, Zap, Key, Terminal, BookOpen, Lock } from "lucide-react"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/api-beta"

export const revalidate = 60

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"

  const title = isDE
    ? "ClawGuru Security API — Public Beta | Security Checks in deiner CI/CD"
    : "ClawGuru Security API — Public Beta | Security Checks in your CI/CD"

  const description = isDE
    ? "Integriere Security Checks, CVE-Lookups und Runbook-Execution direkt in deine CI/CD Pipeline. Öffentliche Beta verfügbar."
    : "Integrate security checks, CVE lookups, and runbook execution directly into your CI/CD pipeline. Public Beta available."

  return {
    title,
    description,
    keywords: ["security api", "ci/cd security", "cve api", "runbook api", "devops security", "security automation"],
    authors: [{ name: "ClawGuru API Team" }],
    openGraph: {
      title,
      description,
      type: "website",
      url: pageUrl,
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

export default function ApiBetaPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  const faqItems = isDE
    ? [
        {
          q: "Ist die API kostenlos?",
          a: "Die Public Beta ist kostenlos nutzbar für Entwickler. Production-Keys mit SLA sind Teil des Pro/Enterprise Plans (ab 49€/Monat).",
        },
        {
          q: "Welche Rate Limits gelten?",
          a: "Beta: 100 Requests/Stunde pro Key. Pro: 1.000 Requests/Stunde. Enterprise: unlimitiert mit dediziertem Endpoint.",
        },
        {
          q: "Wie bekomme ich einen API Key?",
          a: "Schreibe eine Mail an api@clawguru.org mit deinem Use-Case. Wir vergeben Keys manuell für die Beta-Phase.",
        },
        {
          q: "Ist die API DSGVO-konform?",
          a: "Ja. Alle Endpoints laufen auf EU-Servern (Frankfurt). Keine Daten verlassen die EU. Zero-Log-Policy für Free-Tier.",
        },
      ]
    : [
        {
          q: "Is the API free?",
          a: "The Public Beta is free for developers. Production keys with SLA are part of the Pro/Enterprise plan (starting at €49/month).",
        },
        {
          q: "What rate limits apply?",
          a: "Beta: 100 requests/hour per key. Pro: 1,000 requests/hour. Enterprise: unlimited with dedicated endpoint.",
        },
        {
          q: "How do I get an API key?",
          a: "Email api@clawguru.org with your use case. We manually provision keys during the beta phase.",
        },
        {
          q: "Is the API GDPR-compliant?",
          a: "Yes. All endpoints run on EU servers (Frankfurt). No data leaves the EU. Zero-log policy for free tier.",
        },
      ]

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": isDE ? "Startseite" : "Home", "item": `${SITE_URL}/${locale}` },
          { "@type": "ListItem", "position": 2, "name": "API Beta", "item": `${SITE_URL}/${locale}${PATH}` },
        ],
      },
      {
        "@type": "SoftwareApplication",
        "name": "ClawGuru Security API",
        "applicationCategory": "SecurityApplication",
        "operatingSystem": "Web API",
        "description": isDE
          ? "Security Check, CVE Lookup und Runbook Execution als REST API."
          : "Security check, CVE lookup and runbook execution as REST API.",
        "url": `${SITE_URL}/${locale}${PATH}`,
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "EUR",
          "availability": "https://schema.org/InStock",
        },
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqItems.map((item) => ({
          "@type": "Question",
          "name": item.q,
          "acceptedAnswer": { "@type": "Answer", "text": item.a },
        })),
      },
    ],
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="mb-12 text-center">
          <div className="inline-block bg-cyan-900 border border-cyan-700 text-cyan-300 text-xs font-bold px-3 py-1 rounded-full mb-4 animate-pulse">
            {isDE ? "🚀 PUBLIC BETA VERFÜGBAR" : "🚀 PUBLIC BETA AVAILABLE"}
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-gray-100">
            {isDE ? "ClawGuru Security API" : "ClawGuru Security API"}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {isDE
              ? "Integriere Security Checks, CVE-Lookups und Runbook-Execution direkt in deine CI/CD Pipeline."
              : "Integrate security checks, CVE lookups, and runbook execution directly into your CI/CD pipeline."}
          </p>
        </div>

        {/* Trust Anchor */}
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-12 text-sm text-amber-100 max-w-4xl mx-auto">
          <strong className="text-amber-100">"Not a Pentest" Notice:</strong>{" "}
          {isDE
            ? "Die API prüft öffentlich zugängliche Informationen und Best-Practice-Konfigurationen. Keine Angriffstools. Keine intrusiven Scans."
            : "The API checks publicly accessible information and best-practice configurations. No attack tools. No intrusive scans."}
        </div>

        {/* API Endpoints */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-100">
            {isDE ? "3 Kern-Endpunkte" : "3 Core Endpoints"}
          </h2>
          <div className="space-y-6">
            {/* Endpoint 1 */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <div className="flex items-center gap-3 p-4 border-b border-gray-700">
                <div className="bg-green-900 p-2 rounded">
                  <Shield className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-900 text-green-300 text-xs font-bold px-2 py-1 rounded">GET</span>
                    <code className="text-cyan-400 font-mono">/api/v1/check?domain=example.com</code>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {isDE ? "Security Score & Empfehlungen für eine Domain" : "Security score & recommendations for a domain"}
                  </p>
                </div>
              </div>
              <div className="bg-gray-900 p-4">
                <div className="text-xs text-gray-500 mb-2">{isDE ? "Beispiel Request:" : "Example Request:"}</div>
                <pre className="text-sm text-green-400 font-mono overflow-x-auto">
{`curl -H "Authorization: Bearer YOUR_API_KEY" \\
  "https://clawguru.org/api/v1/check?domain=example.com"

# Response
{
  "score": 72,
  "grade": "B",
  "issues": [
    { "severity": "high", "title": "Missing HSTS header" },
    { "severity": "medium", "title": "Weak cipher suite" }
  ]
}`}
                </pre>
              </div>
            </div>

            {/* Endpoint 2 */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <div className="flex items-center gap-3 p-4 border-b border-gray-700">
                <div className="bg-orange-900 p-2 rounded">
                  <Zap className="w-5 h-5 text-orange-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-900 text-green-300 text-xs font-bold px-2 py-1 rounded">GET</span>
                    <code className="text-cyan-400 font-mono">/api/v1/cve?id=CVE-2024-6387</code>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {isDE ? "CVE Details + Fix Guide" : "CVE details + fix guide"}
                  </p>
                </div>
              </div>
              <div className="bg-gray-900 p-4">
                <div className="text-xs text-gray-500 mb-2">{isDE ? "Beispiel Request:" : "Example Request:"}</div>
                <pre className="text-sm text-green-400 font-mono overflow-x-auto">
{`curl -H "Authorization: Bearer YOUR_API_KEY" \\
  "https://clawguru.org/api/v1/cve?id=CVE-2024-6387"

# Response
{
  "cve_id": "CVE-2024-6387",
  "cvss": 8.1,
  "severity": "high",
  "affected": ["openssh < 9.8p1"],
  "fix_runbook_url": "https://clawguru.org/runbooks/regresshion-cve-2024-6387"
}`}
                </pre>
              </div>
            </div>

            {/* Endpoint 3 */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <div className="flex items-center gap-3 p-4 border-b border-gray-700">
                <div className="bg-purple-900 p-2 rounded">
                  <Terminal className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-900 text-blue-300 text-xs font-bold px-2 py-1 rounded">POST</span>
                    <code className="text-cyan-400 font-mono">/api/v1/runbook/execute</code>
                    <span className="bg-yellow-900 text-yellow-300 text-xs font-bold px-2 py-1 rounded">PRO</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {isDE ? "Runbook gegen eigene Infrastruktur ausführen" : "Execute runbook against your own infrastructure"}
                  </p>
                </div>
              </div>
              <div className="bg-gray-900 p-4">
                <div className="text-xs text-gray-500 mb-2">{isDE ? "Beispiel Request:" : "Example Request:"}</div>
                <pre className="text-sm text-green-400 font-mono overflow-x-auto">
{`curl -X POST -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"runbook_id": "nginx-hardening-2026", "target": "prod.example.com"}' \\
  "https://clawguru.org/api/v1/runbook/execute"

# Response
{
  "execution_id": "exec_abc123",
  "status": "queued",
  "estimated_duration_seconds": 120
}`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* CTAs */}
        <section className="grid md:grid-cols-2 gap-6 mb-12">
          <a
            href="mailto:api@clawguru.org?subject=API%20Key%20Request&body=Team%20Size%3A%0AUse%20Case%3A%0AExpected%20Volume%3A"
            className="group bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 p-8 rounded-xl border border-cyan-500 transition-all hover:scale-[1.02]"
          >
            <Key className="w-8 h-8 text-white mb-3" />
            <h3 className="text-2xl font-bold text-white mb-2">
              {isDE ? "API Key anfragen" : "Request API Key"}
            </h3>
            <p className="text-cyan-100">
              {isDE ? "Schicke uns deinen Use-Case — Antwort innerhalb von 24h." : "Send us your use case — reply within 24h."}
            </p>
          </a>
          <Link
            href={`/${locale}/api-docs`}
            className="group bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-cyan-500 p-8 rounded-xl transition-all hover:scale-[1.02]"
          >
            <BookOpen className="w-8 h-8 text-cyan-400 mb-3" />
            <h3 className="text-2xl font-bold text-gray-100 mb-2">
              {isDE ? "Vollständige Dokumentation" : "Full Documentation"}
            </h3>
            <p className="text-gray-400">
              {isDE ? "Endpoints, Response-Schemas, Error Codes." : "Endpoints, response schemas, error codes."}
            </p>
          </Link>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-100">FAQ</h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <details key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-4 group">
                <summary className="cursor-pointer font-semibold text-gray-100 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  {item.q}
                </summary>
                <p className="mt-3 text-sm text-gray-300">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Cross-Links (Mycelium Kreislauf) */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-100">
            {isDE ? "Weitere Ressourcen" : "More Resources"}
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Link href={`/${locale}/check`} className="block bg-gray-800 hover:bg-gray-700 p-4 rounded-lg border border-gray-700 hover:border-cyan-500 transition-colors">
              <div className="font-semibold text-cyan-400 mb-1">Security Check</div>
              <div className="text-xs text-gray-400">{isDE ? "Web-basierter Check" : "Web-based check"}</div>
            </Link>
            <Link href={`/${locale}/runbooks`} className="block bg-gray-800 hover:bg-gray-700 p-4 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors">
              <div className="font-semibold text-purple-400 mb-1">Runbooks</div>
              <div className="text-xs text-gray-400">{isDE ? "4.200+ Fix-Anleitungen" : "4,200+ fix guides"}</div>
            </Link>
            <Link href={`/${locale}/intel`} className="block bg-gray-800 hover:bg-gray-700 p-4 rounded-lg border border-gray-700 hover:border-orange-500 transition-colors">
              <div className="font-semibold text-orange-400 mb-1">Intel Feed</div>
              <div className="text-xs text-gray-400">{isDE ? "Live CVE Feed" : "Live CVE feed"}</div>
            </Link>
            <Link href={`/${locale}/pricing`} className="block bg-gray-800 hover:bg-gray-700 p-4 rounded-lg border border-gray-700 hover:border-green-500 transition-colors">
              <div className="font-semibold text-green-400 mb-1">{isDE ? "Preise" : "Pricing"}</div>
              <div className="text-xs text-gray-400">{isDE ? "Pro & Enterprise Plans" : "Pro & Enterprise plans"}</div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
