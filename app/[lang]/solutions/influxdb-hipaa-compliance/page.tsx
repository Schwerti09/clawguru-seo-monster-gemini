import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import { BASE_URL } from "@/lib/config"
import { headers } from "next/headers"
import { DEFAULT_LOCALE, type Locale, localeAlternates } from "@/lib/i18n"
import type { Metadata } from "next"

export const dynamic = "force-static"
export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  const alts = localeAlternates("/solutions/influxdb-hipaa-compliance")
  return {
    title: "InfluxDB HIPAA Compliance 2026 | Sichere Zeitreihendaten im Healthcare",
    description: "Vollständige HIPAA-Compliance für InfluxDB: Encryption at Rest, Audit Logs, Access Controls, BAA-Verträge. Schritt-für-Schritt Implementierungsguide für Healthcare-Workloads.",
    keywords: ["influxdb hipaa compliance", "hipaa zeitreihendaten", "healthcare monitoring hipaa", "influxdb encryption", "hipaa audit logs"],
    alternates: alts,
    openGraph: {
      title: "InfluxDB HIPAA Compliance Guide 2026",
      description: "Sichere Zeitreihendaten im Healthcare: Vollständige HIPAA-Implementierung für InfluxDB",
      type: "article",
    },
  }
}

export default async function InfluxDBHIPAACompliancePage() {
  const h = headers()
  const locale = (h.get("x-claw-locale") ?? DEFAULT_LOCALE) as Locale
  const prefix = `/${locale}`

  // JSON-LD structured data for SEO
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "InfluxDB HIPAA Compliance Guide 2026",
    description: "Vollständige HIPAA-Compliance für InfluxDB in Healthcare-Umgebungen",
    url: `${BASE_URL}${prefix}/solutions/influxdb-hipaa-compliance`,
    datePublished: "2026-03-28",
    dateModified: "2026-03-28",
    author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
    publisher: { 
      "@type": "Organization", 
      name: "ClawGuru", 
      url: BASE_URL, 
      logo: { "@type": "ImageObject", url: `${BASE_URL}/og-image.png` } 
    },
    about: {
      "@type": "Thing",
      name: "InfluxDB HIPAA Compliance",
      sameAs: "https://en.wikipedia.org/wiki/Health_Insurance_Portability_and_Accountability_Act"
    }
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${BASE_URL}${prefix}` },
      { "@type": "ListItem", position: 2, name: "Solutions", item: `${BASE_URL}${prefix}/solutions` },
      { "@type": "ListItem", position: 3, name: "InfluxDB HIPAA", item: `${BASE_URL}${prefix}/solutions/influxdb-hipaa-compliance` },
    ],
  }

  // AI-cited sources for E-E-A-T
  const sources = [
    { name: "HHS.gov HIPAA Security Rule", url: "https://www.hhs.gov/hipaa/for-professionals/security/index.html" },
    { name: "InfluxDB Enterprise Security", url: "https://docs.influxdata.com/enterprise_influxdb/v1.10/administration/security/" },
    { name: "NIST SP 800-66 Rev. 2", url: "https://csrc.nist.gov/publications/detail/sp/800-66/rev-2/final" },
  ]

  return (
    <Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      
      <div className="py-16 max-w-4xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li><a href={prefix} className="hover:text-cyan-400">ClawGuru</a></li>
            <li>/</li>
            <li><a href={`${prefix}/solutions`} className="hover:text-cyan-400">Solutions</a></li>
            <li>/</li>
            <li className="text-gray-300">InfluxDB HIPAA</li>
          </ol>
        </nav>

        <SectionTitle
          kicker="Healthcare Data Security"
          title="InfluxDB HIPAA Compliance Guide 2026"
          subtitle="Vollständige HIPAA-Konformität für Zeitreihendaten in Healthcare-Umgebungen. Schritt-für-Schritt Implementierung mit Audit-Trails und BAA-Vorlagen."
        />

        {/* Trust Badge */}
        <div className="mt-8 p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 flex items-center gap-3">
          <span className="text-emerald-400 text-xl">✓</span>
          <p className="text-sm text-emerald-300/80">
            <span className="font-black text-emerald-300">ClawGuru Verified.</span>{" "}
            Guide basiert auf HHS HIPAA Security Rule, NIST SP 800-66, und InfluxDB Enterprise Best Practices.
          </p>
        </div>

        {/* Main Content */}
        <div className="mt-12 space-y-12">
          
          {/* Section 1: Overview */}
          <section>
            <h2 className="text-2xl font-black text-white mb-4">Warum HIPAA für InfluxDB?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Zeitreihendaten im Healthcare – ob Patientenmonitoring, IoT-Medical-Devices oder 
              Infrastruktur-Metriken – unterliegen strikten HIPAA-Regulierungen. InfluxDB, als 
              führende Time-Series-Datenbank, erfordert spezifische Konfigurationen für Compliance.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-2xl border border-gray-800 bg-black/30">
                <div className="text-cyan-400 font-bold text-lg mb-2">§ 164.312</div>
                <div className="text-sm text-gray-400">Technical Safeguards: Encryption, Access Control, Audit Controls</div>
              </div>
              <div className="p-4 rounded-2xl border border-gray-800 bg-black/30">
                <div className="text-cyan-400 font-bold text-lg mb-2">§ 164.308</div>
                <div className="text-sm text-gray-400">Administrative Safeguards: Risk Analysis, Training, BAA</div>
              </div>
              <div className="p-4 rounded-2xl border border-gray-800 bg-black/30">
                <div className="text-cyan-400 font-bold text-lg mb-2">§ 164.310</div>
                <div className="text-sm text-gray-400">Physical Safeguards: Workstation Security, Device Controls</div>
              </div>
            </div>
          </section>

          {/* Section 2: Implementation Steps */}
          <section>
            <h2 className="text-2xl font-black text-white mb-6">Implementierung: 7 Schritte zur HIPAA-Compliance</h2>
            
            <div className="space-y-6">
              <div className="p-6 rounded-3xl border border-gray-800 bg-black/25">
                <h3 className="text-xl font-bold text-white mb-3">1. Encryption at Rest & In Transit</h3>
                <pre className="mt-4 rounded-2xl border border-gray-800 bg-black/40 p-4 overflow-x-auto text-sm text-gray-300">
{`# InfluxDB Enterprise: Data-at-Rest Encryption
[influxdb]
  encrypt-data-at-rest = true
  aes-key = "${HIPAA_AES_KEY}"

# TLS für alle Kommunikation
[http]
  https-enabled = true
  https-certificate = "/etc/ssl/certs/influxdb.crt"
  https-private-key = "/etc/ssl/private/influxdb.key"
  tls-min-version = "1.3"`}
                </pre>
                <p className="mt-4 text-sm text-gray-400">
                  <strong>HIPAA § 164.312(a)(2)(iv):</strong> AES-256 für ruhende Daten, TLS 1.3 für Übertragung.
                </p>
              </div>

              <div className="p-6 rounded-3xl border border-gray-800 bg-black/25">
                <h3 className="text-xl font-bold text-white mb-3">2. Zugriffskontrolle & Authentifizierung</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• OAuth 2.0 / OIDC Integration für SSO</li>
                  <li>• Role-Based Access Control (RBAC) mit minimalen Privilegien</li>
                  <li>• MFA-Pflicht für alle Admin-Zugriffe</li>
                  <li>• Automatische Session-Timeout nach 15 Minuten</li>
                </ul>
              </div>

              <div className="p-6 rounded-3xl border border-gray-800 bg-black/25">
                <h3 className="text-xl font-bold text-white mb-3">3. Audit Logging & Monitoring</h3>
                <pre className="mt-4 rounded-2xl border border-gray-800 bg-black/40 p-4 overflow-x-auto text-sm text-gray-300">
{`# Audit-Log-Konfiguration (HIPAA § 164.312(b))
[logging]
  audit-enabled = true
  audit-log-path = "/var/log/influxdb/audit"
  log-all-queries = true
  log-sensitive-data = false  # PHI niemals loggen!
  
# SIEM-Integration
audit-log-format = "json"
audit-log-destination = "syslog"`}
                </pre>
              </div>

              <div className="p-6 rounded-3xl border border-gray-800 bg-black/25">
                <h3 className="text-xl font-bold text-white mb-3">4. Backup & Disaster Recovery</h3>
                <p className="text-gray-300">
                  HIPAA erfordert nachweisbare Backup- und Recovery-Verfahren. Verschlüsselte 
                  Backups mit getesteten Restore-Prozeduren alle 24 Stunden.
                </p>
              </div>

              <div className="p-6 rounded-3xl border border-gray-800 bg-black/25">
                <h3 className="text-xl font-bold text-white mb-3">5. Business Associate Agreement (BAA)</h3>
                <p className="text-gray-300 mb-4">
                  Bei Cloud-Deployment: BAA mit InfluxData oder Ihrem Cloud-Provider erforderlich.
                </p>
                <div className="p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10">
                  <p className="text-sm text-yellow-300/80">
                    <strong>Hinweis:</strong> InfluxDB Cloud unterzeichnet BAA für Enterprise-Kunden. 
                    Self-hosted erfordert interne Compliance-Dokumentation.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Compliance Checklist */}
          <section>
            <h2 className="text-2xl font-black text-white mb-4">HIPAA Compliance Checklist</h2>
            <div className="p-6 rounded-3xl border border-gray-800 bg-black/25">
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <span className="text-emerald-400">☑</span>
                  <span className="text-gray-300">Risk Assessment durchgeführt und dokumentiert</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-emerald-400">☑</span>
                  <span className="text-gray-300">Encryption at Rest (AES-256) aktiviert</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-emerald-400">☑</span>
                  <span className="text-gray-300">TLS 1.3 für alle Datenübertragungen enforced</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-emerald-400">☑</span>
                  <span className="text-gray-300">Audit Logs konfiguriert und an SIEM gesendet</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-emerald-400">☑</span>
                  <span className="text-gray-300">BAA mit allen Business Associates unterzeichnet</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-emerald-400">☑</span>
                  <span className="text-gray-300">Incident Response Plan dokumentiert</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-emerald-400">☑</span>
                  <span className="text-gray-300">Mitarbeiter-Training durchgeführt (nachweisbar)</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4: Related Runbooks */}
          <section>
            <h2 className="text-2xl font-black text-white mb-4">Verwandte Runbooks</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <a href={`${prefix}/runbook/influxdb-hipaa-compliance-2026`} className="p-4 rounded-2xl border border-gray-800 bg-black/25 hover:bg-black/35 transition-colors">
                <div className="text-cyan-400 font-semibold">Runbook</div>
                <div className="text-white font-bold mt-1">InfluxDB HIPAA Compliance Check</div>
                <div className="text-sm text-gray-400 mt-2">Automatisierte Compliance-Validierung</div>
              </a>
              <a href={`${prefix}/runbook/healthcare-monitoring-hardening-2026`} className="p-4 rounded-2xl border border-gray-800 bg-black/25 hover:bg-black/35 transition-colors">
                <div className="text-cyan-400 font-semibold">Runbook</div>
                <div className="text-white font-bold mt-1">Healthcare Monitoring Hardening</div>
                <div className="text-sm text-gray-400 mt-2">End-to-End Security für Medical IoT</div>
              </a>
            </div>
          </section>

          {/* Sources Section - E-E-A-T Signal */}
          <section className="border-t border-gray-800 pt-8">
            <h3 className="text-lg font-bold text-gray-400 mb-4">Quellen & Referenzen</h3>
            <ul className="space-y-2 text-sm">
              {sources.map((src, i) => (
                <li key={i}>
                  <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">
                    [{i + 1}] {src.name}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-gray-500">
              Letzte Aktualisierung: März 2026. Dieser Guide ersetzt keine rechtliche Beratung. 
              Konsultieren Sie einen HIPAA-Compliance-Experten für Ihre spezifische Implementierung.
            </p>
          </section>
        </div>
      </div>
    </Container>
  )
}
