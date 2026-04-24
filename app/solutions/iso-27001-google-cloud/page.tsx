import Container from "@/components/shared/Container"
import { BASE_URL } from "@/lib/config"
import { headers } from "next/headers"
import { DEFAULT_LOCALE, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import type { Metadata } from "next"
import { pick } from "@/lib/i18n-pick"

export const dynamic = "force-static"
export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ISO 27001 auf Google Cloud 2026 | Komplettes ISMS-Implementation Guide",
    description: "ISO 27001 Zertifizierung auf GCP: Risk Assessment, Annex A Controls, IAM, Logging, Backup/DR. Schritt-für-Schritt zum audit-sicheren ISMS mit Google Cloud.",
    keywords: ["iso 27001 google cloud", "iso 27001 gcp", "isms google cloud", "iso 27001 compliance gcp", "gcp security controls"],
    alternates: buildLocalizedAlternates(DEFAULT_LOCALE, "/solutions/iso-27001-google-cloud"),
    openGraph: {
      title: "ISO 27001 auf Google Cloud – Kompletter Guide 2026",
      description: "Praxisleitfaden für ISO 27001 Zertifizierung auf Google Cloud Platform",
      type: "article",
    },
  }
}

export default async function ISO27001GCPPage() {
  const h = headers()
  const locale = (h.get("x-claw-locale") ?? DEFAULT_LOCALE) as Locale
  const prefix = `/${locale}`

  // JSON-LD structured data for SEO
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "ISO 27001 auf Google Cloud – Kompletter Implementation Guide 2026",
    description: "Praxisleitfaden für ISO 27001 Zertifizierung auf Google Cloud Platform",
    url: `${BASE_URL}${prefix}/solutions/iso-27001-google-cloud`,
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
      name: "ISO 27001 Information Security Management",
      sameAs: "https://en.wikipedia.org/wiki/ISO/IEC_27001"
    }
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${BASE_URL}${prefix}` },
      { "@type": "ListItem", position: 2, name: "Solutions", item: `${BASE_URL}${prefix}/solutions` },
      { "@type": "ListItem", position: 3, name: "ISO 27001 GCP", item: `${BASE_URL}${prefix}/solutions/iso-27001-google-cloud` },
    ],
  }

  // AI-cited sources for E-E-A-T
  const sources = [
    { name: "ISO/IEC 27001:2022 Standard", url: "https://www.iso.org/standard/72812.html" },
    { name: "Google Cloud Compliance Reports", url: "https://cloud.google.com/security/compliance" },
    { name: "GCP Security Best Practices", url: "https://cloud.google.com/architecture/security-best-practices" },
  ]
  const isDE = locale === 'de'
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: pick(isDE, 'Ist Google Cloud ISO 27001 zertifiziert?', 'Is Google Cloud ISO 27001 certified?'), acceptedAnswer: { '@type': 'Answer', text: pick(isDE, 'Ja, Google Cloud Platform ist ISO/IEC 27001:2022 zertifiziert. Das Zertifikat deckt GCP-Infrastruktur und viele Managed Services ab. GCP-Kunden können die GCP-Zertifizierung im eigenen ISMS-Scope referenzieren (Shared Responsibility). Zertifikat auf cloud.google.com/security/compliance einsehbar.', 'Yes, Google Cloud Platform is ISO/IEC 27001:2022 certified. The certificate covers GCP infrastructure and many managed services. GCP customers can reference the GCP certification in their own ISMS scope (shared responsibility). Certificate viewable at cloud.google.com/security/compliance.') } },
      { '@type': 'Question', name: pick(isDE, 'Welche GCP Services unterstützen ISO 27001 Compliance?', 'Which GCP services support ISO 27001 compliance?'), acceptedAnswer: { '@type': 'Answer', text: pick(isDE, 'GCP ISO 27001 relevante Services: Cloud Audit Logs (A.12.4 Logging), Cloud KMS (A.10 Kryptographie), VPC Service Controls (A.13 Netzwerksicherheit), Secret Manager (A.9.4 Zugangskontrolle), Cloud Armor (A.13.1 Netzwerksicherheit), Binary Authorization (A.12.6 Schwachstellenmanagement), Chronicle SIEM (A.16 Incident Management).', 'GCP ISO 27001 relevant services: Cloud Audit Logs (A.12.4 logging), Cloud KMS (A.10 cryptography), VPC Service Controls (A.13 network security), Secret Manager (A.9.4 access control), Cloud Armor (A.13.1 network security), Binary Authorization (A.12.6 vulnerability management), Chronicle SIEM (A.16 incident management).') } },
      { '@type': 'Question', name: pick(isDE, 'Wie implementiere ich das Statement of Applicability (SoA) für GCP?', 'How do I implement the Statement of Applicability (SoA) for GCP?'), acceptedAnswer: { '@type': 'Answer', text: pick(isDE, 'SoA für GCP: Alle 93 Annex A Controls bewerten, für jeden Control Applicability-Entscheidung dokumentieren (Applicable/Not Applicable + Begründung). GCP-spezifisch: Cloud-nativen Kontrollen den ISO-Controls mappen (z.B. VPC Service Controls zu A.13.1). GCP Compliance Reports als Evidenz nutzen. Jeder Control braucht Implementation Status und Verantwortlichen.', 'SoA for GCP: evaluate all 93 Annex A controls, document applicability decision for each control (Applicable/Not Applicable + justification). GCP-specific: map cloud-native controls to ISO controls (e.g. VPC Service Controls to A.13.1). Use GCP Compliance Reports as evidence. Each control needs implementation status and owner.') } },
      { '@type': 'Question', name: pick(isDE, 'Was kostet ISO 27001 auf Google Cloud?', 'What does ISO 27001 on Google Cloud cost?'), acceptedAnswer: { '@type': 'Answer', text: pick(isDE, 'ISO 27001 auf GCP zusätzliche Kosten: Cloud Audit Logs Speicher (~$0.01/GB), Cloud KMS ($0.06/Schlüssel/Monat), VPC Service Controls (Premium/Enterprise Tier). GRC-Tool für Dokumentation: 200-2.000 EUR/Monat. Größter Kostenfaktor: interner Aufwand für Dokumentation und Controls-Implementierung (100-500 Personentage). Zertifizierungsstelle: 8.000-25.000 EUR.', 'ISO 27001 on GCP additional costs: Cloud Audit Logs storage (~$0.01/GB), Cloud KMS ($0.06/key/month), VPC Service Controls (Premium/Enterprise Tier). GRC tool for documentation: 200-2,000 EUR/month. Biggest cost factor: internal effort for documentation and controls implementation (100-500 person days). Certification body: 8,000-25,000 EUR.') } },
    ],
  }

  return (
    <Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      
      <div className="py-16 max-w-4xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li><a href={prefix} className="hover:text-cyan-400">ClawGuru</a></li>
            <li>/</li>
            <li><a href={`${prefix}/solutions`} className="hover:text-cyan-400">Solutions</a></li>
            <li>/</li>
            <li className="text-gray-300">ISO 27001 GCP</li>
          </ol>
        </nav>

        <h1 className="text-4xl font-black mb-4 text-gray-100">ISO 27001 auf Google Cloud 2026</h1>
        <p className="text-lg text-gray-300 mb-8">Kompletter Praxisleitfaden für ISO 27001 Zertifizierung auf GCP. Von Risk Assessment bis Audit – mit Annex A Controls &amp; Google Cloud Security Services.</p>

        {/* Trust Badge */}
        <div className="mt-8 p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 flex items-center gap-3">
          <span className="text-emerald-400 text-xl">✓</span>
          <p className="text-sm text-emerald-300/80">
            <span className="font-black text-emerald-300">ClawGuru Verified.</span>{" "}
            Basierend auf ISO 27001:2022, Google Cloud Security Best Practices, und BSI-Grundschutz.
          </p>
        </div>

        {/* Main Content */}
        <div className="mt-12 space-y-12">
          
          {/* Section 1: Overview */}
          <section>
            <h2 className="text-2xl font-black text-white mb-4">Warum ISO 27001 auf Google Cloud?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Google Cloud bietet eine robuste Infrastruktur für ISO 27001-konforme Informationssicherheitsmanagementsysteme (ISMS). 
              Mit integrierten Security Controls, Compliance-Zertifizierungen und Audit-Logging kann das Zertifizierungsziel 
              deutlich effizienter erreicht werden als in On-Premise-Umgebungen.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-2xl border border-gray-800 bg-black/30">
                <div className="text-cyan-400 font-bold text-lg mb-2">A.5</div>
                <div className="text-sm text-gray-400">Organisatorische Controls: Policies, Rollen, Verantwortlichkeiten</div>
              </div>
              <div className="p-4 rounded-2xl border border-gray-800 bg-black/30">
                <div className="text-cyan-400 font-bold text-lg mb-2">A.8</div>
                <div className="text-sm text-gray-400">Technologische Controls: IAM, Encryption, Logging, Monitoring</div>
              </div>
              <div className="p-4 rounded-2xl border border-gray-800 bg-black/30">
                <div className="text-cyan-400 font-bold text-lg mb-2">A.7</div>
                <div className="text-sm text-gray-400">Physikalische Controls: Cloud-nativ via GCP Regionen/Zonen</div>
              </div>
            </div>
          </section>

          {/* Section 2: Implementation Phases */}
          <section>
            <h2 className="text-2xl font-black text-white mb-6">ISMS-Implementierung: 5 Phasen auf GCP</h2>
            
            <div className="space-y-6">
              <div className="p-6 rounded-3xl border border-gray-800 bg-black/25">
                <h3 className="text-xl font-bold text-white mb-3">Phase 1: Scope & Risk Assessment</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>Scope-Definition:</strong> Welche GCP-Projekte, -Services und -Daten sind im ISMS?</li>
                  <li>• <strong>Asset-Inventory:</strong> Cloud Asset Inventory für vollständige Ressourcen-Erfassung</li>
                  <li>• <strong>Risk-Assessment:</strong> Security Command Center für Threat-Intelligence</li>
                  <li>• <strong>Risk-Treatment:</strong> Risiko-Akzeptanz vs. Mitigation-Plan</li>
                </ul>
              </div>

              <div className="p-6 rounded-3xl border border-gray-800 bg-black/25">
                <h3 className="text-xl font-bold text-white mb-3">Phase 2: Annex A Controls Umsetzung</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-gray-700 bg-black/20">
                    <h4 className="font-semibold text-cyan-400 mb-2">A.5.7 – Threat Intelligence</h4>
                    <p className="text-sm text-gray-300">Security Command Center + Chronicle SIEM für proactive Threat Detection</p>
                  </div>
                  <div className="p-4 rounded-xl border border-gray-700 bg-black/20">
                    <h4 className="font-semibold text-cyan-400 mb-2">A.8.4 – Removal of Assets</h4>
                    <p className="text-sm text-gray-300">Cloud Asset Inventory + Access Transparency für vollständige Nachverfolgbarkeit</p>
                  </div>
                  <div className="p-4 rounded-xl border border-gray-700 bg-black/20">
                    <h4 className="font-semibold text-cyan-400 mb-2">A.8.5 – Authentication Information</h4>
                    <p className="text-sm text-gray-300">Cloud IAM + Secret Manager + Identity-Aware Proxy für sichere Authentifizierung</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl border border-gray-800 bg-black/25">
                <h3 className="text-xl font-bold text-white mb-3">Phase 3: Logging & Monitoring</h3>
                <pre className="mt-4 rounded-2xl border border-gray-800 bg-black/40 p-4 overflow-x-auto text-sm text-gray-300">
{`# Cloud Logging Konfiguration für ISO 27001 Audit
# A.8.15 – Logging

# Audit Logs für alle GCP Services aktivieren
# Logs Router Sink zu SIEM (Chronicle/Splunk)

gcloud logging sinks create iso27001-audit-sink \
  bigquery.googleapis.com/projects/PROJECT_ID/datasets/audit_logs \
  --log-filter='protoPayload.serviceName!=""'

# Data Access Logs für敏感 Daten
gcloud projects get-iam-policy PROJECT_ID --audit-log-config=all`}
                </pre>
              </div>

              <div className="p-6 rounded-3xl border border-gray-800 bg-black/25">
                <h3 className="text-xl font-bold text-white mb-3">Phase 4: Backup & Business Continuity</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>Cloud Storage:</strong> Cross-region replication für kritische Daten</li>
                  <li>• <strong>Backup for GKE:</strong> Kubernetes-Workload-Backup mit Application Consistency</li>
                  <li>• <strong>Cloud SQL:</strong> Automated backups + Point-in-time recovery</li>
                  <li>• <strong>Disaster Recovery:</strong> Geo-redundanz mit multi-region Deployment</li>
                </ul>
              </div>

              <div className="p-6 rounded-3xl border border-gray-800 bg-black/25">
                <h3 className="text-xl font-bold text-white mb-3">Phase 5: Audit & Dokumentation</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>Statement of Applicability (SoA):</strong> Dokumentierte Begründung für alle Annex A Controls</li>
                  <li>• <strong>Risk Register:</strong> Aktuelle Risiko-Bewertung mit Treatment-Plänen</li>
                  <li>• <strong>Internal Audit:</strong> Regelmäßige Prüfung mit Security Command Center Reports</li>
                  <li>• <strong>Management Review:</strong> Quartalsweise ISMS-Bewertung</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3: GCP Security Services */}
          <section>
            <h2 className="text-2xl font-black text-white mb-4">Google Cloud Security Services für ISO 27001</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-gray-800 bg-black/25">
                <div className="text-cyan-400 font-semibold">Security Command Center</div>
                <div className="text-white font-bold mt-1">Unified Security Management</div>
                <div className="text-sm text-gray-400 mt-2">Asset Discovery, Vulnerability Scanning, Threat Detection</div>
              </div>
              <div className="p-4 rounded-2xl border border-gray-800 bg-black/25">
                <div className="text-cyan-400 font-semibold">Cloud IAM</div>
                <div className="text-white font-bold mt-1">Identity & Access Management</div>
                <div className="text-sm text-gray-400 mt-2">Least Privilege, MFA, Service Account Management</div>
              </div>
              <div className="p-4 rounded-2xl border border-gray-800 bg-black/25">
                <div className="text-cyan-400 font-semibold">Cloud KMS + HSM</div>
                <div className="text-white font-bold mt-1">Key Management</div>
                <div className="text-sm text-gray-400 mt-2">FIPS 140-2 Level 3, Automatic Rotation</div>
              </div>
              <div className="p-4 rounded-2xl border border-gray-800 bg-black/25">
                <div className="text-cyan-400 font-semibold">Cloud Logging + Chronicle</div>
                <div className="text-white font-bold mt-1">SIEM & Audit Trail</div>
                <div className="text-sm text-gray-400 mt-2">Audit-Logging, Log Retention, Threat Analysis</div>
              </div>
            </div>
          </section>

          {/* Section 4: Compliance Checklist */}
          <section>
            <h2 className="text-2xl font-black text-white mb-4">ISO 27001 Compliance Checklist für GCP</h2>
            <div className="p-6 rounded-3xl border border-gray-800 bg-black/25">
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <span className="text-emerald-400">☑</span>
                  <span className="text-gray-300">ISMS Scope dokumentiert und freigegeben</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-emerald-400">☑</span>
                  <span className="text-gray-300">Risk Assessment durchgeführt (SCC Asset Inventory)</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-emerald-400">☑</span>
                  <span className="text-gray-300">Statement of Applicability (SoA) vollständig</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-emerald-400">☑</span>
                  <span className="text-gray-300">Alle 93 Annex A Controls implementiert oder begründet</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-emerald-400">☑</span>
                  <span className="text-gray-300">Security Policies dokumentiert und kommuniziert</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-emerald-400">☑</span>
                  <span className="text-gray-300">Incident Response Plan getestet</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-emerald-400">☑</span>
                  <span className="text-gray-300">Internal Audit durchgeführt mit Ergebnisbericht</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-emerald-400">☑</span>
                  <span className="text-gray-300">Management Review durchgeführt</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 5: Related Runbooks */}
          <section>
            <h2 className="text-2xl font-black text-white mb-4">Verwandte Runbooks</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <a href={`${prefix}/runbook/gcp-iso27001-audit-2026`} className="p-4 rounded-2xl border border-gray-800 bg-black/25 hover:bg-black/35 transition-colors">
                <div className="text-cyan-400 font-semibold">Runbook</div>
                <div className="text-white font-bold mt-1">ISO 27001 Audit-Readiness Check</div>
                <div className="text-sm text-gray-400 mt-2">Automatisierte Compliance-Validierung für GCP</div>
              </a>
              <a href={`${prefix}/runbook/gcp-security-controls-hardening-2026`} className="p-4 rounded-2xl border border-gray-800 bg-black/25 hover:bg-black/35 transition-colors">
                <div className="text-cyan-400 font-semibold">Runbook</div>
                <div className="text-white font-bold mt-1">GCP Security Controls Hardening</div>
                <div className="text-sm text-gray-400 mt-2">End-to-End Security für Google Cloud</div>
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
              Letzte Aktualisierung: März 2026. Dieser Guide ersetzt keine professionelle Beratung. 
              Engagieren Sie einen ISO 27001-Zertifizierer für Ihre spezifische Implementierung.
            </p>
          </section>
        </div>
      </div>
    </Container>
  )
}
