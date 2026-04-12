import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'Enterprise SIEM Integration mit ClawGuru: Splunk & Datadog 2024',
    description: 'SIEM Integration für Enterprise mit ClawGuru. Splunk, Datadog, Elastic Stack und Microsoft Sentinel Anbindung. Log Aggregation, Korrelationsregeln und SOC-Ready Dashboards.',
    keywords: ['enterprise siem integration','splunk security','datadog siem','elastic security','microsoft sentinel','soc security operations'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: {
      images: ["/og-image.png"], title: 'Enterprise SIEM Integration mit ClawGuru 2024', description: 'SIEM für Enterprise mit ClawGuru.', type: 'article', url: `https://clawguru.org/${lang}/solutions/enterprise-siem-integration` },
    alternates: buildLocalizedAlternates(lang as Locale, '/solutions/enterprise-siem-integration'),
    robots: 'index, follow',
  };
}

export default function EnterpriseSiemPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound();
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: lang === 'de' ? 'Was ist ein SIEM und warum braucht jedes Unternehmen eines?' : 'What is a SIEM and why does every company need one?', acceptedAnswer: { '@type': 'Answer', text: lang === 'de' ? 'SIEM (Security Information and Event Management) aggregiert Logs aus allen Quellen, korreliert Events und erkennt Angriffsmuster. Ohne SIEM: kein zentraler Überblick, keine Korrelation, lange Detection-Zeit (MTTD). Enterprise-Standard: MTTD < 24h. Compliance (PCI DSS, ISO 27001, SOC 2) fordert zentrales Log-Management.' : 'SIEM (Security Information and Event Management) aggregates logs from all sources, correlates events and detects attack patterns. Without SIEM: no central overview, no correlation, long detection time (MTTD). Enterprise standard: MTTD < 24h. Compliance (PCI DSS, ISO 27001, SOC 2) requires central log management.' } },
      { '@type': 'Question', name: lang === 'de' ? 'Splunk vs Elastic SIEM: Was ist besser für Self-Hosting?' : 'Splunk vs Elastic SIEM: Which is better for self-hosting?', acceptedAnswer: { '@type': 'Answer', text: lang === 'de' ? 'Elastic SIEM (ELK Stack): Open Source, selbst gehostet, keine Lizenzkosten, gute K8s-Integration. Splunk Enterprise: teuer (~$150-200/GB/Tag), aber marktführend, beste SIEM-Regeln, größte Community. Für Self-Hosted: Elastic SIEM mit Moltbot-Integration ideal. Für Enterprise mit Budget: Splunk oder Microsoft Sentinel (Azure-native).' : 'Elastic SIEM (ELK Stack): open source, self-hosted, no license costs, good K8s integration. Splunk Enterprise: expensive (~$150-200/GB/day), but market-leading, best SIEM rules, largest community. For self-hosted: Elastic SIEM with Moltbot integration ideal. For enterprise with budget: Splunk or Microsoft Sentinel (Azure-native).' } },
      { '@type': 'Question', name: lang === 'de' ? 'Wie integriere ich ClawGuru in meinen bestehenden SIEM?' : 'How do I integrate ClawGuru into my existing SIEM?', acceptedAnswer: { '@type': 'Answer', text: lang === 'de' ? 'ClawGuru SIEM-Integration: Webhook-Output sendet strukturierte JSON-Events bei Security-Findings. Splunk: HTTP Event Collector (HEC). Elastic: Logstash HTTP Input. Datadog: Events API. Microsoft Sentinel: Custom Connector. Alle Events enthalten: severity, finding_type, resource, remediation_url. ClawGuru-Dashboard ergänzt SIEM mit kontextualisierten Runbooks.' : 'ClawGuru SIEM integration: webhook output sends structured JSON events on security findings. Splunk: HTTP Event Collector (HEC). Elastic: Logstash HTTP input. Datadog: Events API. Microsoft Sentinel: Custom Connector. All events contain: severity, finding_type, resource, remediation_url. ClawGuru dashboard complements SIEM with contextualized runbooks.' } },
      { '@type': 'Question', name: lang === 'de' ? 'Was sind SIEM Korrelationsregeln und wie erstelle ich sie?' : 'What are SIEM correlation rules and how do I create them?', acceptedAnswer: { '@type': 'Answer', text: lang === 'de' ? 'Korrelationsregeln verbinden mehrere Events zu einem Angriffsmuster. Beispiel: 10 fehlgeschlagene Logins in 5 Minuten + erfolgreicher Login = Brute Force. Sigma-Format für plattform-übergreifende Regeln. Detection-as-Code in Git versionieren. MITRE ATT&CK-Framework als Basis für Regelkatalog. Falsch-Positiv-Rate < 5% als Ziel.' : 'Correlation rules connect multiple events into an attack pattern. Example: 10 failed logins in 5 minutes + successful login = brute force. Sigma format for cross-platform rules. Detection-as-code versioned in Git. MITRE ATT&CK framework as basis for rule catalog. Target false positive rate < 5%.' } },
    ],
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 border-l-4 border-gray-400 p-4 mb-8 text-sm">
          <strong>Enterprise SOC</strong>: ClawGuru integriert nahtlos in bestehende SIEM-Umgebungen und liefert strukturierte Security-Events für Korrelation und Alerting.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Enterprise SIEM Integration</h1>
        <p className="text-lg text-gray-300 mb-8">ClawGuru als Security Event Source für deinen SOC — strukturierte JSON-Events für Splunk, Datadog, Elastic und Sentinel.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔌 SIEM Integrationen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { siem: 'Splunk Enterprise', method: 'HTTP Event Collector (HEC)', format: 'JSON', status: 'GA' },
              { siem: 'Datadog', method: 'Logs API / Agent', format: 'JSON', status: 'GA' },
              { siem: 'Elastic/Kibana', method: 'Beats / Logstash', format: 'ECS JSON', status: 'GA' },
              { siem: 'Microsoft Sentinel', method: 'Log Analytics API', format: 'JSON', status: 'GA' },
              { siem: 'IBM QRadar', method: 'Syslog CEF', format: 'CEF', status: 'Beta' },
              { siem: 'Sumo Logic', method: 'HTTP Source', format: 'JSON', status: 'GA' },
            ].map(({ siem, method, format, status }) => (
              <div key={siem} className="bg-gray-800 p-4 rounded-lg border border-gray-700 border">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-sm">{siem}</div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status === 'GA' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{status}</span>
                </div>
                <div className="text-xs text-gray-400">{method}</div>
                <div className="text-xs text-gray-400 mt-1">Format: {format}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">📊 SIEM Event Schema</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
            <pre>{`// ClawGuru Security Event (JSON Schema)
{
  "event_id": "evt_01JQ...",
  "timestamp": "2024-04-07T14:30:00Z",
  "source": "clawguru",
  "severity": "HIGH",  // CRITICAL, HIGH, MEDIUM, LOW, INFO
  "event_type": "security.threat_detected",
  "customer_id": "cust_123",
  "actor": { "type": "ip", "value": "192.168.1.100" },
  "target": { "type": "api_endpoint", "value": "/api/auth/login" },
  "action": "brute_force_attempt",
  "outcome": "blocked",
  "threat_score": 85,
  "geo": { "country": "DE", "city": "Berlin" },
  "details": {
    "attempts": 47,
    "timeframe_minutes": 5,
    "blocked": true,
    "block_duration_seconds": 3600
  }
}`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔗 ClawGuru Enterprise</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🛡️ Security Check</div><div className="text-sm text-gray-300">SOC Assessment</div></a>
            <a href="/runbooks" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">📚 SIEM Runbooks</div><div className="text-sm text-gray-300">Integration Guides</div></a>
            <a href="/oracle" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🔮 Oracle</div><div className="text-sm text-gray-300">Threat Intelligence Feed</div></a>
            <a href="/solutions" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🏢 Enterprise</div><div className="text-sm text-gray-300">Managed SOC</div></a>
          </div>
        </section>
      </div>
    </div>
  );
}
