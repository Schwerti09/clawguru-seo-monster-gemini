import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'Moltbot Threat Detection: Live Monitoring Setup 2024',
    description: 'Threat Detection für Moltbot: Echtzeit-Bedrohungserkennung mit Falco, Prometheus Alerting, SIEM-Integration und automatisierter Incident Response. Mit vollständigen Konfigurationsbeispielen.',
    keywords: ['moltbot threat detection','live monitoring','falco security','prometheus alerting','siem integration','incident response'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'Moltbot Threat Detection: Live Monitoring Setup 2024', description: 'Threat Detection für Moltbot mit Falco und Prometheus.', type: 'article', url: `https://clawguru.org/${lang}/moltbot/threat-detection-setup`, images: ['/og-moltbot-threat-detection.jpg'] },
    alternates: buildLocalizedAlternates(lang as Locale, '/moltbot/threat-detection-setup'),
    robots: 'index, follow',
  };
}

export default function MoltbotThreatDetectionPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Trust-Anker</strong>: Dieser Guide dient ausschließlich zur Implementierung von Bedrohungserkennungssystemen. Keine Angriffswerkzeuge, keine illegalen Aktivitäten.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Moltbot Threat Detection: Live Monitoring Setup</h1>
        <p className="text-lg text-gray-300 mb-8">Echtzeit-Bedrohungserkennung für Moltbot — von Falco Runtime Security über Prometheus Alerting bis hin zur automatisierten Incident Response.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🦅 Falco Runtime Security Rules</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-4">
            <pre>{`# falco-rules-moltbot.yaml
- rule: Moltbot Unexpected Network Connection
  desc: Moltbot container öffnet unerwartete Netzwerkverbindung
  condition: >
    evt.type = connect
    and container.name = "moltbot"
    and not (fd.sport in (80, 443, 3000, 5432))
  output: >
    Unerwartete Verbindung von Moltbot
    (user=%user.name container=%container.name
     sport=%fd.sport dport=%fd.dport)
  priority: WARNING
  tags: [network, moltbot]

- rule: Moltbot Privilege Escalation Attempt
  desc: Erkenne Privilege-Escalation-Versuche im Moltbot-Container
  condition: >
    evt.type in (setuid, setgid)
    and container.name = "moltbot"
    and not proc.name in (node)
  output: >
    Privilege Escalation in Moltbot-Container
    (proc=%proc.name user=%user.name)
  priority: CRITICAL
  tags: [privilege_escalation, moltbot]`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">📊 Prometheus Alerting Rules</h2>
          <div className="bg-gray-900 text-blue-400 p-4 rounded-lg font-mono text-sm mb-4">
            <pre>{`# prometheus/alerts/moltbot-security.yml
groups:
  - name: moltbot-security
    rules:
      - alert: MoltbotHighAuthFailureRate
        expr: |
          rate(moltbot_auth_failures_total[5m]) > 10
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "Hohe Authentifizierungsfehlerrate"
          description: "{{ $value }} Fehlschläge/s – möglicher Brute-Force-Angriff"

      - alert: MoltbotSuspiciousAPIActivity
        expr: |
          rate(moltbot_api_requests_total{status="429"}[1m]) > 50
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Verdächtige API-Aktivität erkannt"
          description: "{{ $value }} Rate-Limited Requests/s"

      - alert: MoltbotDatabaseQueryAnomaly
        expr: |
          histogram_quantile(0.99, rate(moltbot_db_query_duration_seconds_bucket[5m])) > 5
        for: 3m
        labels:
          severity: warning
        annotations:
          summary: "Anomale Datenbankabfrage-Latenz"
          description: "P99 Latenz: {{ $value }}s"}`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">⚡ Automatisierte Incident Response</h2>
          <div className="bg-gray-900 text-yellow-400 p-4 rounded-lg font-mono text-sm mb-4">
            <pre>{`// moltbot/lib/incident-response.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({ url: process.env.UPSTASH_REDIS_REST_URL!, token: process.env.UPSTASH_REDIS_REST_TOKEN! });

export async function handleSecurityIncident(incident: {
  type: 'brute_force' | 'injection' | 'anomaly';
  ip: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: Record<string, unknown>;
}) {
  // 1. IP blockieren bei kritischen Incidents
  if (incident.severity === 'critical' || incident.severity === 'high') {
    await redis.setex(\`block:\${incident.ip}\`, 3600, '1');
  }

  // 2. Incident loggen
  await redis.lpush('incidents', JSON.stringify({
    ...incident,
    timestamp: new Date().toISOString(),
  }));

  // 3. Alert senden
  if (incident.severity === 'critical') {
    await fetch(process.env.SLACK_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: \`🚨 CRITICAL Security Incident: \${incident.type} from \${incident.ip}\`,
      }),
    });
  }
}`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔗 Weiterführende Ressourcen</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700">
              <div className="font-semibold text-cyan-400">🛡️ Security Check</div>
              <div className="text-sm text-gray-300">Live Threat Scan</div>
            </a>
            <a href="/neuro" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700">
              <div className="font-semibold text-cyan-400">🧠 Neuro AI</div>
              <div className="text-sm text-gray-300">AI-gestützte Erkennung</div>
            </a>
            <a href="/runbooks" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700">
              <div className="font-semibold text-cyan-400">📚 IR Runbooks</div>
              <div className="text-sm text-gray-300">Incident Response Guides</div>
            </a>
            <a href="/oracle" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700">
              <div className="font-semibold text-cyan-400">🔮 Oracle</div>
              <div className="text-sm text-gray-300">Threat Intelligence</div>
            </a>
          </div>
        </section>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Was ist Moltbot Security?", acceptedAnswer: { "@type": "Answer", text: "Moltbot ist eine Security-Automation-Plattform mit 600+ Executable Runbooks, Live-Score und Compliance-Dashboard f&#xFC;r Self-Hosting-Infrastrukturen." } },
              { "@type": "Question", name: "Ist dieser Guide ein Penetrationstest?", acceptedAnswer: { "@type": "Answer", text: "Nein. Dieser Guide dient ausschlie&#xDF;lich zur Absicherung eigener Systeme. Kein Angriffs-Tool, keine illegalen Aktivit&#xE4;ten." } },
              { "@type": "Question", name: "Wo finde ich zugeh&#xF6;rige Runbooks?", acceptedAnswer: { "@type": "Answer", text: "Alle Runbooks sind unter /runbooks abrufbar. Jeder Befund im Security-Check enth&#xE4;lt einen direkten Link zum passenden Runbook." } }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Moltbot Security Guide",
            description: "Executable Security Runbooks und Hardening-Guides f&#xFC;r Moltbot-Infrastrukturen.",
            url: "https://clawguru.org/de/moltbot/threat-detection-setup"
          }
        ]) }} />
      </div>
    </div>
  );
}
