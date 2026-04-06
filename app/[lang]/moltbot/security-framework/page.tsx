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
    title: "Moltbot Security Framework: Kompletter Überblick 2024",
    description:
      "Fundamentale Architektur und Security-Prinzipien von Moltbot mit Best Practices für 2024. Complete Security Framework Guide mit Implementierungsstrategien.",
    keywords: [
      "moltbot security framework",
      "moltbot architecture",
      "security prinzipien",
      "bot security",
      "ai agent security",
      "security best practices 2024",
    ],
    alternates: {
      ...localeAlternates(`/${locale}/moltbot/security-framework`),
    },
    openGraph: {
      title: "Moltbot Security Framework: Kompletter Überblick 2024",
      description:
        "Fundamentale Architektur und Security-Prinzipien von Moltbot mit Best Practices für 2024.",
      type: "article",
      url: `${BASE_URL}/${locale}/moltbot/security-framework`,
    },
  };
}

export default async function MoltbotSecurityFrameworkPage({
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
              Moltbot Security 2024
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Moltbot Security Framework
            </h1>
            <p className="text-2xl text-blue-200 mb-4">
              Kompletter Überblick &amp; Implementierungsguide
            </p>
            <p className="text-xl text-white/80 mb-8">
              Zero Trust Architecture, Defense in Depth, Secure by Design, Continuous Monitoring – alles in einem Framework.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Zero Trust</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Defense in Depth</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Secure by Design</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Monitoring</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-12">
            <p className="text-amber-900 font-semibold">
              🛡️ &quot;Not a Pentest&quot; Trust-Anker: Dieser Guide dient ausschließlich zu Bildungs- und Hardening-Zwecken. Keine Angriffswerkzeuge, keine illegalen Aktivitäten.
            </p>
          </div>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🎯 Executive Summary</h2>
            <p className="text-slate-700 text-lg mb-6">
              Das <strong>Moltbot Security Framework</strong> stellt einen umfassenden Ansatz für die Absicherung von autonomen Bot-Systemen dar. In einer Zeit, in der AI-gesteuerte Automatisierung kritische Geschäftsprozesse steuert, ist ein robustes Security Framework überlebenswichtig.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Zero Trust Architecture</h3>
                <p className="text-blue-800 text-sm">Jede Anfrage muss verifiziert werden</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Defense in Depth</h3>
                <p className="text-blue-800 text-sm">Mehrschichtige Sicherheitskontrollen</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Secure by Design</h3>
                <p className="text-blue-800 text-sm">Security von Anfang an integriert</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Continuous Monitoring</h3>
                <p className="text-blue-800 text-sm">Permanente Überwachung und Anpassung</p>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🏗️ Framework-Architektur</h2>

            <h3 className="text-xl font-semibold text-slate-800 mb-4">Schicht 1: Perimeter Security</h3>
            <div className="bg-slate-900 rounded-xl p-6 mb-6">
              <h4 className="text-white font-semibold mb-4">Network Security Konfiguration</h4>
              <pre className="font-mono text-sm text-green-400 overflow-x-auto">
{`# Beispiel: Network Security Konfiguration
network_security:
  firewall_rules:
    - allow: "10.0.0.0/8"
      ports: [443, 8080]
      description: "Internal network access"
    - deny: "0.0.0.0/0"
      ports: [22, 3389]
      description: "Block remote management"
  ddos_protection:
    rate_limit: "1000 req/min"
    burst_limit: "5000 req"
    blacklist_duration: "3600s"`}
              </pre>
            </div>

            <div className="bg-slate-900 rounded-xl p-6 mb-6">
              <h4 className="text-white font-semibold mb-4">API Gateway Middleware</h4>
              <pre className="font-mono text-sm text-green-400 overflow-x-auto">
{`interface APIGatewayConfig {
  rateLimiting: {
    requests: number;
    window: string;
    burst: number;
  };
  authentication: {
    required: boolean;
    methods: ('JWT' | 'OAuth2' | 'API-Key')[];
  };
  validation: {
    schema: object;
    sanitization: boolean;
  };
}`}
              </pre>
            </div>

            <h3 className="text-xl font-semibold text-slate-800 mb-4">Schicht 2: Application Security</h3>
            <p className="text-slate-700 mb-4">Input Validation, Sanitization und Rate Limiting als zentrale Schutzmechanismen.</p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🔐 Authentication &amp; Authorization</h2>
            <p className="text-slate-700 text-lg mb-6">
              Multi-Factor Authentication (MFA) und Role-Based Access Control (RBAC) bilden das Rückgrat der Zugriffskontrolle.
            </p>
            <div className="bg-slate-900 rounded-xl p-6 mb-6">
              <h4 className="text-white font-semibold mb-4">RBAC Configuration</h4>
              <pre className="font-mono text-sm text-green-400 overflow-x-auto">
{`roles:
  admin:
    permissions:
      - "user:*"
      - "system:*"
      - "audit:read"
  operator:
    permissions:
      - "bot:read"
      - "bot:update"
      - "monitoring:read"
  viewer:
    permissions:
      - "bot:read"
      - "monitoring:read"`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🛡️ Threat Detection &amp; Response</h2>
            <p className="text-slate-700 text-lg mb-6">
              Automatisierte Threat Detection mit SQL-Injection-, XSS-, CSRF- und Anomalie-Erkennung. Incident Response mit automatisierten Playbooks.
            </p>
            <div className="bg-slate-900 rounded-xl p-6 mb-6">
              <h4 className="text-white font-semibold mb-4">Incident Response Playbook</h4>
              <pre className="font-mono text-sm text-green-400 overflow-x-auto">
{`incident_response:
  automated_actions:
    high_risk_threat:
      - block_ip: true
      - invalidate_sessions: true
      - notify_admin: true
    medium_risk_threat:
      - increase_monitoring: true
      - require_mfa: true
    low_risk_threat:
      - log_event: true
      - update_risk_score: true`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">📊 Monitoring &amp; Logging</h2>
            <p className="text-slate-700 text-lg mb-6">
              Security Event Monitoring, Audit Logging und Real-time Dashboards für vollständige Transparenz.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🔧 Implementation Guide</h2>
            <div className="bg-slate-900 rounded-xl p-6 mb-6">
              <h4 className="text-white font-semibold mb-4">Step 1: Foundation Setup</h4>
              <pre className="font-mono text-sm text-green-400 overflow-x-auto">
{`# Security Dependencies Installation
npm install helmet cors express-rate-limit bcryptjs jsonwebtoken
npm install @types/bcryptjs @types/jsonwebtoken --save-dev

# Environment Configuration
cp .env.example .env.local`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">📈 Performance &amp; Scalability</h2>
            <p className="text-slate-700 text-lg mb-6">
              Security-Maßnahmen optimiert für Performance: Connection Pooling, Caching, Load Balancing und horizontale Skalierung.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">📋 Security Checklist</h2>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <ul className="space-y-2 text-slate-700">
                <li>✅ Zero Trust Architecture implementiert</li>
                <li>✅ Multi-Factor Authentication aktiv</li>
                <li>✅ RBAC konfiguriert</li>
                <li>✅ Threat Detection &amp; Response aktiv</li>
                <li>✅ Security Event Monitoring</li>
                <li>✅ Incident Response Playbooks</li>
                <li>✅ Regular Security Audits</li>
                <li>✅ Compliance Monitoring</li>
              </ul>
            </div>
          </section>

          <section className="bg-gradient-to-r from-blue-700 to-indigo-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Moltbot Security Assessment</h2>
            <p className="mb-6">Validieren Sie Ihr Moltbot Security Framework mit unserem automatisierten Check.</p>
            <a href={coreLinks.check} className="inline-block px-6 py-3 bg-white text-blue-700 rounded-lg font-semibold">
              Security Assessment starten
            </a>
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
              <a href={`${prefix}/moltbot/hardening-guide-2024`} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">Hardening Guide</a>
              <a href={`${prefix}/moltbot/threat-detection-setup`} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">Threat Detection</a>
              <a href={`${prefix}/runbooks/security`} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">Security Runbooks</a>
              <a href={coreLinks.methodology} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">Methodology</a>
            </div>
          </section>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "Moltbot Security Framework: Kompletter Überblick 2024",
        author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        datePublished: "2024-04-06",
      })}} />
    </main>
  );
}
