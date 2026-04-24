import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-data-integrity"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = pick(isDE, "AI Agent Data Integrity: Datenintegrität für AI-Agents | ClawGuru", "AI Agent Data Integrity: Data Integrity for AI Agents | ClawGuru")
  const description = pick(isDE, "AI Agent Data Integrity für Moltbot. Cryptographic Hashing, Merkle Trees, Tamper Detection und Immutable Audit Logs für AI-Agent-Datensicherheit.", "AI agent data integrity for Moltbot. Cryptographic hashing, Merkle trees, tamper detection and immutable audit logs for AI agent data security.")
  return {
    title, description,
    keywords: ["ai agent data integrity", "cryptographic hashing", "merkle trees", "tamper detection", "immutable audit logs", "moltbot security 2026"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow"
  }
}

export default function AIAgentDataIntegrityPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">{pick(isDE, "AI Agent Data Integrity", "AI Agent Data Integrity")}</h1>
          <p className="text-lg text-gray-300 mb-4">{pick(isDE, "AI Agent Data Integrity für Moltbot. Cryptographic Hashing, Merkle Trees, Tamper Detection und Immutable Audit Logs für AI-Agent-Datensicherheit.", "AI agent data integrity for Moltbot. Cryptographic hashing, Merkle trees, tamper detection and immutable audit logs for AI agent data security.")}</p>
        </div>
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools.", "This guide is for hardening your own systems. No attack tools.")}
        </div>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Kernkonzepte", "Core Concepts")}</h2>
          <div className="space-y-4">
            {[
              ["1. Cryptographic Hashing", pick(isDE, "SHA-256/SHA-3 Hashing für alle AI-Agent-Daten und Modell-Checkpoints. Integritätsnachweis bei jedem Zugriff.", "SHA-256/SHA-3 hashing for all AI agent data and model checkpoints. Integrity proof at every access.")],
              ["2. Merkle Trees", pick(isDE, "Merkle Trees für effiziente Integritätsprüfung großer Datensätze. Änderungserkennung ohne vollständigen Daten-Scan.", "Merkle trees for efficient integrity checking of large datasets. Change detection without full data scan.")],
              ["3. Digital Signatures", pick(isDE, "Digitale Signaturen für AI-Agent-Outputs und Entscheidungen. Kryptographischer Nachweis der Urheberschaft.", "Digital signatures for AI agent outputs and decisions. Cryptographic proof of authorship.")],
              ["4. Immutable Audit Logs", pick(isDE, "Unveränderliche Audit Logs für alle Agent-Aktionen. Write-Once-Storage oder Blockchain-basierte Logs.", "Immutable audit logs for all agent actions. Write-once storage or blockchain-based logs.")],
              ["5. Tamper Detection", pick(isDE, "Automatische Erkennung von Datenmanipulation. Continuous Integrity Checks und Alert bei Abweichungen.", "Automatic detection of data manipulation. Continuous integrity checks and alert on deviations.")],
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
            <div className="bg-green-900 p-4 rounded-lg border border-green-700"><h3 className="font-semibold text-green-300 mb-2">{pick(isDE, "Content Addressable Storage", "Content Addressable Storage")}</h3><p className="text-sm text-green-200">{pick(isDE, "Inhalts-adressierter Speicher für AI-Modelle. Hash ist Adresse — identische Hashes garantieren identische Inhalte.", "Content-addressable storage for AI models. Hash is address — identical hashes guarantee identical content.")}</p></div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700"><h3 className="font-semibold text-blue-300 mb-2">{pick(isDE, "WORM Storage", "WORM Storage")}</h3><p className="text-sm text-blue-200">{pick(isDE, "Write Once Read Many Storage für kritische AI-Agent-Logs. Compliance-konformes Audit Trail.", "Write Once Read Many storage for critical AI agent logs. Compliance-compliant audit trail.")}</p></div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700"><h3 className="font-semibold text-yellow-300 mb-2">{pick(isDE, "Transparency Logs", "Transparency Logs")}</h3><p className="text-sm text-yellow-200">{pick(isDE, "Certificate Transparency-ähnliche Logs für AI-Agent-Aktionen. Öffentlich verifizierbare Audit Trails.", "Certificate Transparency-like logs for AI agent actions. Publicly verifiable audit trails.")}</p></div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700"><h3 className="font-semibold text-red-300 mb-2">{pick(isDE, "Model Provenance", "Model Provenance")}</h3><p className="text-sm text-red-200">{pick(isDE, "Vollständige Herkunftsverfolgung für AI-Modelle. Von Trainingsdaten bis Deployment lückenloser Nachweis.", "Full provenance tracking for AI models. Seamless proof from training data to deployment.")}</p></div>
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Implementierungsschritte", "Implementation Steps")}</h2>
          <div className="space-y-6">
            {[
              [1, pick(isDE, "Kritische Daten identifizieren", "Identify critical data"), pick(isDE, "Welche Daten müssen auf Integrität geprüft werden? Modelle, Configs, Trainingsdaten, Logs.", "Which data needs integrity checking? Models, configs, training data, logs.")],
              [2, pick(isDE, "Hash-Baseline erstellen", "Create hash baseline"), pick(isDE, "Initiale Hashes aller kritischen Dateien berechnen und sicher speichern. Referenzpunkt für spätere Checks.", "Calculate initial hashes of all critical files and store securely. Reference point for later checks.")],
              [3, pick(isDE, "Continuous Integrity Checks", "Continuous integrity checks"), pick(isDE, "Automatisierte Integrity Checks in CI/CD und zur Laufzeit. Alert bei Hash-Abweichungen.", "Automated integrity checks in CI/CD and at runtime. Alert on hash deviations.")],
              [4, pick(isDE, "Immutable Logging einrichten", "Set up immutable logging"), pick(isDE, "WORM-Storage für Audit Logs konfigurieren. AWS S3 Object Lock oder Azure Immutable Blob Storage.", "Configure WORM storage for audit logs. AWS S3 Object Lock or Azure Immutable Blob Storage.")],
              [5, pick(isDE, "Signing Pipeline implementieren", "Implement signing pipeline"), pick(isDE, "Alle Modell-Releases und Outputs digital signieren. Sigstore oder GPG für transparente Signaturen.", "Digitally sign all model releases and outputs. Sigstore or GPG for transparent signatures.")],
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
