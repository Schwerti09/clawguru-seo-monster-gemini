import type { Metadata } from "next";
import { SUPPORTED_LOCALES, type Locale, localeAlternates } from "@/lib/i18n";
import { BASE_URL } from "@/lib/config";
import { getCoreSecurityLinks } from "@/lib/core-security-links";

export const dynamic = "force-static";
export const revalidate = 86400;

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
    title: "Moltbot Threat Detection: Live Monitoring Setup",
    description:
      "Schritt-für-Schritt Anleitung für Threat Detection und Monitoring mit Moltbot. Complete Live Monitoring Setup mit Real-time Alerting und Security Analytics.",
    keywords: [
      "moltbot threat detection",
      "live monitoring",
      "security monitoring",
      "threat detection setup",
      "real-time alerting",
      "security analytics",
    ],
    alternates: {
      ...localeAlternates(`/${locale}/moltbot/threat-detection-setup`),
    },
    openGraph: {
      title: "Moltbot Threat Detection: Live Monitoring Setup",
      description:
        "Schritt-für-Schritt Anleitung für Threat Detection und Monitoring mit Moltbot.",
      type: "article",
      url: `${BASE_URL}/${locale}/moltbot/threat-detection-setup`,
    },
  };
}

export default async function MoltbotThreatDetectionPage({
  params,
}: {
  params: { lang: string };
}) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale)
    ? params.lang
    : "de") as Locale;
  const prefix = `/${locale}`;
  const coreLinks = getCoreSecurityLinks(locale);

  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-sm mb-4">
              Threat Detection 2024
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Threat Detection Setup
            </h1>
            <p className="text-2xl text-blue-200 mb-4">
              Live Monitoring &amp; Security Analytics
            </p>
            <p className="text-xl text-white/80 mb-8">
              Real-time Threat Detection, Machine Learning Analytics, Automated Response, Compliance Monitoring – proaktive Security Operations.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Real-time</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">ML Detection</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Auto Response</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">SIEM</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-12">
            <p className="text-amber-900 font-semibold">
              🛡️ &quot;Not a Pentest&quot; Trust-Anker: Dieser Guide dient ausschließlich zur Implementierung von Threat Detection und Monitoring Systemen. Keine Angriffswerkzeuge, keine illegalen Aktivitäten.
            </p>
          </div>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🎯 Executive Summary</h2>
            <p className="text-slate-700 text-lg mb-6">
              Das <strong>Moltbot Threat Detection System</strong> bietet eine umfassende Lösung für Echtzeit-Überwachung und Bedrohungserkennung. Mit fortschrittlicher Machine Learning Integration und automatisierter Response Capabilities ermöglicht es proaktive Security Operations.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🏗️ Architecture Overview</h2>
            <p className="text-slate-700 text-lg mb-6">
              Mehrschichtige Threat Detection Architecture mit Data Collection Layer, Processing Engine, ML Detection, Alert System und Response Automation.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">📊 Data Collection &amp; Ingestion</h2>
            <div className="bg-slate-900 rounded-xl p-6 mb-6">
              <h4 className="text-white font-semibold mb-4">Log Collection Configuration</h4>
              <pre className="font-mono text-sm text-green-400 overflow-x-auto">
{`# Moltbot Log Collection Config
log_collection:
  sources:
    - type: syslog
      port: 514
      protocol: tcp
      tls: true
    - type: filebeat
      paths:
        - /var/log/moltbot/*.log
        - /var/log/auth.log
    - type: api_gateway
      endpoint: /api/v1/logs
      format: json
  
  processing:
    - parse_json
    - enrich_geoip
    - normalize_timestamps
    - extract_security_events
  
  output:
    elasticsearch:
      hosts: ["https://es-cluster:9200"]
      index: "moltbot-security-%{+yyyy.MM.dd}"`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🧠 Machine Learning Detection Engine</h2>
            <div className="bg-slate-900 rounded-xl p-6 mb-6">
              <h4 className="text-white font-semibold mb-4">Anomaly Detection</h4>
              <pre className="font-mono text-sm text-green-400 overflow-x-auto">
{`class AnomalyDetector {
  private model: IsolationForest;
  private threshold: number = 0.85;

  async detectAnomalies(events: SecurityEvent[]): Promise<Anomaly[]> {
    const features = this.extractFeatures(events);
    const predictions = await this.model.predict(features);

    return predictions
      .filter(p => p.anomalyScore > this.threshold)
      .map(p => ({
        event: events[p.index],
        score: p.anomalyScore,
        type: this.classifyAnomaly(p),
        confidence: p.confidence,
      }));
  }

  private classifyAnomaly(prediction: Prediction): string {
    if (prediction.features.loginFrequency > 3) return 'BRUTE_FORCE';
    if (prediction.features.geoDistance > 1000) return 'IMPOSSIBLE_TRAVEL';
    if (prediction.features.dataVolume > 10) return 'DATA_EXFILTRATION';
    return 'UNKNOWN_ANOMALY';
  }
}`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🚨 Real-time Alerting System</h2>
            <p className="text-slate-700 text-lg mb-6">
              Multi-Channel Alerting über Slack, PagerDuty, Email und Webhook mit konfigurierbaren Severity-Leveln und Escalation Policies.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">📊 Dashboard &amp; Visualization</h2>
            <p className="text-slate-700 text-lg mb-6">
              Security Operations Dashboard mit Echtzeit-Metriken, Threat Heatmaps, Timeline-Views und Compliance-Status für vollständige Visibility.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🤖 Automated Response System</h2>
            <p className="text-slate-700 text-lg mb-6">
              SOAR (Security Orchestration, Automation and Response) mit automatisierten Playbooks, IP-Blocking, Session-Invalidierung und Incident-Ticketing.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">📋 Implementation Guide</h2>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <ul className="space-y-2 text-slate-700">
                <li>✅ Log Collection konfiguriert (Syslog, Filebeat, API)</li>
                <li>✅ Elasticsearch/OpenSearch Cluster</li>
                <li>✅ ML Detection Engine trainiert</li>
                <li>✅ Real-time Alerting aktiv</li>
                <li>✅ Security Dashboard deployed</li>
                <li>✅ Automated Response Playbooks</li>
                <li>✅ Escalation Policies konfiguriert</li>
                <li>✅ Compliance Monitoring aktiv</li>
              </ul>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">📈 Performance Optimization</h2>
            <p className="text-slate-700 text-lg mb-6">
              Query Optimization, Index Management, Shard-Strategie und Caching für hochperformante Threat Detection auch bei großen Datenmengen.
            </p>
          </section>

          <section className="bg-gradient-to-r from-blue-700 to-indigo-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Threat Detection Assessment</h2>
            <p className="mb-6">Validieren Sie Ihre Monitoring-Konfiguration mit unserem automatisierten Check.</p>
            <a href={coreLinks.check} className="inline-block px-6 py-3 bg-white text-blue-700 rounded-lg font-semibold">
              Security Assessment starten
            </a>
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
              <a href={`${prefix}/moltbot/security-framework`} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">Security Framework</a>
              <a href={`${prefix}/moltbot/network-security-firewall`} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">Network Security</a>
              <a href={`${prefix}/runbooks/security`} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">Security Runbooks</a>
              <a href={coreLinks.methodology} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">Methodology</a>
            </div>
          </section>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "Moltbot Threat Detection: Live Monitoring Setup",
        author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        datePublished: "2024-04-06",
      })}} />
    </main>
  );
}
