import type { Metadata } from "next";
import { SUPPORTED_LOCALES, type Locale, localeAlternates } from "@/lib/i18n";
import { BASE_URL } from "@/lib/config";

export const dynamic = "force-static";
export const revalidate = 86400;
export const runtime = "nodejs";

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale)
    ? params.lang
    : "de") as Locale;

  return {
    title: locale === "de" 
      ? "InfluxDB HIPAA Compliance 2026 | Healthcare Data Security"
      : "InfluxDB HIPAA Compliance 2026 | Healthcare Data Security",
    description: locale === "de"
      ? "Vollständiger InfluxDB HIPAA Compliance Guide: PHI Protection, Encryption, Audit Logging, Access Controls. Healthcare Timeseries Database Security."
      : "Complete InfluxDB HIPAA compliance guide: PHI protection, encryption, audit logging, access controls. Healthcare timeseries database security.",
    keywords: [
      "InfluxDB HIPAA",
      "InfluxDB compliance",
      "Healthcare database",
      "PHI protection",
      "Timeseries healthcare",
      "HIPAA timeseries",
      "Medical IoT database",
      "Patient data security",
      "ePHI protection",
      "Healthcare monitoring",
    ],
    alternates: {
      canonical: `/${locale}/influxdb-hipaa-compliance`,
      ...localeAlternates(`/${locale}/influxdb-hipaa-compliance`),
    },
    openGraph: {
      title: "InfluxDB HIPAA Compliance 2026: Healthcare Database Security",
      description: "Secure patient health data in InfluxDB with HIPAA-compliant configuration.",
      type: "article",
      url: `${BASE_URL}/${locale}/influxdb-hipaa-compliance`,
    },
  };
}

export default function InfluxDBHIPAAPage({
  params,
}: {
  params: { lang: string };
}) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale)
    ? params.lang
    : "de") as Locale;

  const isGerman = locale === "de";

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-600 via-pink-700 to-purple-800 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-400/30 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-sm mb-4">
              <span className="w-2 h-2 rounded-full bg-pink-300 animate-pulse" />
              Healthcare Compliance 2026
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              InfluxDB HIPAA
            </h1>
            <p className="text-2xl text-pink-200 mb-4 font-light">
              {isGerman 
                ? "Healthcare Timeseries Compliance"
                : "Healthcare Timeseries Compliance"}
            </p>
            <p className="text-xl text-white/80 mb-8">
              {isGerman
                ? "PHI Protection, Encryption at Rest & Transit, Audit Logging & Access Controls. Für Medizin-IoT, Patient Monitoring & Healthcare Analytics."
                : "PHI protection, encryption at rest & transit, audit logging & access controls. For medical IoT, patient monitoring & healthcare analytics."}
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">HIPAA</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">PHI/ePHI</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">TLS 1.3</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Encryption</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* HIPAA Overview */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              {isGerman ? "HIPAA für Timeseries-Datenbanken" : "HIPAA for Timeseries Databases"}
            </h2>
            
            <p className="text-slate-700 text-lg mb-6 leading-relaxed">
              {isGerman
                ? "Healthcare-IoT, Patientenmonitore und medizinische Geräte generieren massive Datenströme. InfluxDB ist die führende Timeseries-Datenbank für diese Use-Cases. Doch mit HIPAA-Compliance entsteht eine neue Komplexitätsebene: Protected Health Information (PHI) erfordert besonderen Schutz."
                : "Healthcare IoT, patient monitors, and medical devices generate massive data streams. InfluxDB is the leading timeseries database for these use cases. But with HIPAA compliance comes a new layer of complexity: Protected Health Information (PHI) requires special protection."}
            </p>

            <div className="bg-rose-50 border-l-4 border-rose-500 rounded-r-xl p-6 mb-8">
              <h3 className="text-rose-900 font-semibold mb-2">HIPAA Security Rule (45 CFR 164.312)</h3>
              <p className="text-rose-800 text-sm">
                {isGerman 
                  ? "Administrative, physische und technische Schutzmaßnahmen für elektronische PHI (ePHI) sind Pflicht. Verstöße können mit bis zu $1.5M pro Vorfall geahndet werden."
                  : "Administrative, physical, and technical safeguards for electronic PHI (ePHI) are mandatory. Violations can result in penalties up to $1.5M per incident."}
              </p>
            </div>
          </section>

          {/* ePHI in InfluxDB */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              {isGerman ? "ePHI in Timeseries-Daten" : "ePHI in Timeseries Data"}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-3">Patient Monitoring Data</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500">●</span> Heart rate, BP, SpO2
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500">●</span> ECG waveforms
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500">●</span> Device identifiers
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500">●</span> Room/location data
                  </li>
                </ul>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-3">Medical IoT Sensors</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500">●</span> Glucose monitors
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500">●</span> Insulin pumps
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500">●</span> Pacemaker telemetry
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500">●</span> Wearable health data
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Encryption */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Encryption: At Rest & In Transit</h2>
            
            <div className="bg-slate-900 rounded-xl p-6 mb-6">
              <h3 className="text-white font-semibold mb-4">InfluxDB Enterprise: Encryption at Rest</h3>
              <pre className="font-mono text-sm text-green-400 overflow-x-auto">
{`[enterprise]
  enabled = true

[data]
  # Enable TSI (Time Series Index) for performance
  index-version = "tsi1"
  
[encryption]
  enabled = true
  # AES-256-GCM encryption for data files
  store = "secret-store"
  
[secret-store]
  # HashiCorp Vault integration
  type = "vault"
  address = "https://vault.hospital.internal:8200"
  role = "influxdb-encryption"
  token = "$VAULT_TOKEN"
  
[http]
  # TLS Configuration
  https-enabled = true
  https-certificate = "/etc/ssl/certs/influxdb.crt"
  https-private-key = "/etc/ssl/private/influxdb.key"
  https-strict-ciphersuites = true
  tls-min-version = "1.3"`}
              </pre>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-4">TLS 1.3 Configuration</h3>
              <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-green-400">
{`# influxdb.conf - TLS Settings
[tls]
  min-version = "1.3"
  max-version = "1.3"
  
  # Perfect Forward Secrecy
  curve-preferences = [
    "X25519",
    "P-256",
    "P-384"
  ]
  
  # Cipher suites (TLS 1.3 auto-selected)
  # No RC4, 3DES, or SHA1`}
              </div>
            </div>
          </section>

          {/* Access Controls */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Access Controls & Authentication</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-6">
                <h3 className="font-semibold text-rose-900 mb-3">RBAC Requirements</h3>
                <ul className="space-y-2 text-sm text-rose-800">
                  <li>• Unique user IDs per person</li>
                  <li>• Role-based access (minimum necessary)</li>
                  <li>• Automatic logout (15 min idle)</li>
                  <li>• Emergency access procedures</li>
                  <li>• No shared accounts</li>
                </ul>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <h3 className="font-semibold text-purple-900 mb-3">Audit Requirements</h3>
                <ul className="space-y-2 text-sm text-purple-800">
                  <li>• All ePHI access logged</li>
                  <li>• Failed access attempts</li>
                  <li>• 6+ years retention</li>
                  <li>• Tamper-proof storage</li>
                  <li>• Regular review (quarterly)</li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <h3 className="text-white font-semibold mb-4">InfluxDB 3.0 RBAC Configuration</h3>
              <pre className="font-mono text-sm text-green-400">
{`# Create roles for HIPAA compliance
influx auth create \\
  --user doctor.smith \\
  --read-bucket patient-vitals \\
  --description "Cardiologist - Patient Vitals Read"
  
influx auth create \\
  --user nurse.jones \\
  --read-bucket patient-vitals \\
  --read-bucket room-telemetry \\
  --write-bucket nursing-notes \\
  --description "ICU Nurse - Multi-read + Notes Write"
  
# Admin role (IT only, no PHI access for routine)
influx auth create \\
  --user it.admin \\
  --read-bucket _monitoring \\
  --write-bucket _monitoring \\
  --description "IT Admin - Infrastructure Only"
  
# Break-glass emergency access
influx auth create \\
  --user emergency.breakglass \\
  --all-access \\
  --description "EMERGENCY ACCESS - Audit Required"`}
              </pre>
            </div>
          </section>

          {/* Audit Logging */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Audit Logging & Monitoring</h2>
            
            <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-slate-900 mb-4">HIPAA Audit Events</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-slate-800 mb-2">User Actions</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Login/logout events</li>
                    <li>• Query execution</li>
                    <li>• Data write operations</li>
                    <li>• Permission changes</li>
                    <li>• Token creation/revocation</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-slate-800 mb-2">System Events</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Configuration changes</li>
                    <li>• Backup operations</li>
                    <li>• Encryption key rotation</li>
                    <li>• Access control modifications</li>
                    <li>• Security alerts</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <h3 className="text-white font-semibold mb-4">Audit Configuration</h3>
              <pre className="font-mono text-sm text-green-400">
{`# Fluentd configuration for HIPAA audit logs
<source>
  @type tail
  path /var/log/influxdb/audit.log
  pos_file /var/log/fluent/influxdb-audit.pos
  tag influxdb.audit
  <parse>
    @type json
    time_key timestamp
    time_format %iso8601
  </parse>
</source>

<filter influxdb.audit>
  @type grep
  <regexp>
    key action
    pattern /(query|write|auth|admin)/
  </regexp>
</filter>

<match influxdb.audit>
  @type splunk_hec
  host splunk.hospital.internal
  port 8088
  token $SPLUNK_TOKEN
  index hipaa_audit
  sourcetype influxdb:audit
  
  # Ensure tamper-evident delivery
  <buffer>
    @type file
    path /var/log/fluent/buffer/audit
    flush_interval 5s
    retry_forever true
  </buffer>
</match>`}
              </pre>
            </div>
          </section>

          {/* Data Retention & Disposal */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Data Retention & Secure Disposal</h2>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-yellow-900 mb-3">Retention Requirements</h3>
              <p className="text-yellow-800 text-sm mb-4">
                {isGerman
                  ? "Verschiedene Datentypen haben unterschiedliche Aufbewahrungspflichten. Automatisierte Lifecycle-Policies sind essentiell."
                  : "Different data types have different retention requirements. Automated lifecycle policies are essential."}
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white rounded-lg p-3">
                  <span className="font-medium text-slate-800">Real-time Vitals</span>
                  <p className="text-slate-600 mt-1">30 days (high frequency)</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <span className="font-medium text-slate-800">Aggregated Data</span>
                  <p className="text-slate-600 mt-1">7 years (HIPAA requirement)</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <span className="font-medium text-slate-800">Audit Logs</span>
                  <p className="text-slate-600 mt-1">6 years (NIST 800-53)</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Retention Policies</h3>
              <pre className="font-mono text-sm text-green-400">
{`# InfluxDB Retention Policies for HIPAA
influx bucket create \\
  --name patient-vitals-raw \\
  --retention 30d \\
  --description "Raw patient vitals (30 days)"
  
influx bucket create \\
  --name patient-vitals-historical \\
  --retention 2555d \\
  --description "Downsampled patient data (7 years)"
  
# Automated downsampling task
influx task create -n 'downsample-vitals' -d 'HIPAA compliance downsampling' '` + 
option task = \$'{name: "downsample-vitals", every: 1h}

from(bucket: "patient-vitals-raw")
  |> range(start: -task.every)
  |> aggregateWindow(every: 5m, fn: mean)
  |> to(bucket: "patient-vitals-historical")' +
  
# Secure deletion (overwrite before delete)
influx bucket delete --name temp-research-data --force`}
              </pre>
            </div>
          </section>

          {/* BAA & Compliance */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Business Associate Agreement (BAA)</h2>
            
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <p className="text-slate-700 mb-6">
                {isGerman
                  ? "Wenn InfluxDB Cloud genutzt wird, ist ein Business Associate Agreement (BAA) mit InfluxData erforderlich. Bei self-hosted InfluxDB Enterprise sind Sie selbst Covered Entity."
                  : "When using InfluxDB Cloud, a Business Associate Agreement (BAA) with InfluxData is required. With self-hosted InfluxDB Enterprise, you are the Covered Entity."}
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">InfluxDB Cloud</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>✓ BAA with InfluxData required</li>
                    <li>✓ SOC 2 Type II certification</li>
                    <li>✓ Encrypted storage (AWS/Azure/GCP)</li>
                    <li>✓ Audit logging available</li>
                  </ul>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Self-Hosted Enterprise</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>✓ Full control over data</li>
                    <li>✓ Air-gapped deployment possible</li>
                    <li>✓ Custom encryption keys (BYOK)</li>
                    <li>⚠ All compliance responsibility on you</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Checklist */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">HIPAA Compliance Checklist</h2>
            
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Technical Safeguards (§164.312)</h3>
                  {[
                    "Access Control - Unique User ID",
                    "Audit Controls - Activity logging",
                    "Integrity - Data validation",
                    "Person/Entity Authentication",
                    "Transmission Security - TLS 1.3",
                    "Encryption - At rest & in transit",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                      <span className="w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center text-xs text-slate-400">☐</span>
                      <span className="text-slate-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Administrative Safeguards (§164.308)</h3>
                  {[
                    "Security Management Process",
                    "Assigned Security Responsibilities",
                    "Workforce Security",
                    "Information Access Management",
                    "Security Awareness Training",
                    "Security Incident Procedures",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                      <span className="w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center text-xs text-slate-400">☐</span>
                      <span className="text-slate-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-r from-rose-600 to-pink-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">
              {isGerman ? "HIPAA Compliance Assessment" : "HIPAA Compliance Assessment"}
            </h2>
            <p className="mb-6 max-w-2xl mx-auto">
              {isGerman
                ? "Validieren Sie Ihre InfluxDB-Konfiguration auf HIPAA-Konformität."
                : "Validate your InfluxDB configuration for HIPAA compliance."}
            </p>
            <a 
              href="/check" 
              className="inline-block px-6 py-3 bg-white text-rose-600 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
            >
              {isGerman ? "Compliance Check Starten" : "Start Compliance Check"}
            </a>
          </section>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "InfluxDB HIPAA Compliance 2026",
        author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        datePublished: "2026-03-29",
      })}} />
    </main>
  );
}
