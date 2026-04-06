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
    title: "Moltbot Hardening Guide: 2024 Standards",
    description:
      "Aktuelle Hardening-Standards und Konfigurationsrichtlinien für Moltbot Production Deployment. Complete Security Hardening Guide mit Best Practices.",
    keywords: [
      "moltbot hardening",
      "security hardening 2024",
      "production security",
      "moltbot configuration",
      "security standards",
      "bot hardening",
    ],
    alternates: {
      ...localeAlternates(`/${locale}/moltbot/hardening-guide-2024`),
    },
    openGraph: {
      title: "Moltbot Hardening Guide: 2024 Standards",
      description:
        "Aktuelle Hardening-Standards und Konfigurationsrichtlinien für Moltbot Production Deployment.",
      type: "article",
      url: `${BASE_URL}/${locale}/moltbot/hardening-guide-2024`,
    },
  };
}

export default async function MoltbotHardeningGuidePage({
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
              Moltbot Hardening 2024
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Hardening Guide 2024
            </h1>
            <p className="text-2xl text-blue-200 mb-4">
              Production Security Standards
            </p>
            <p className="text-xl text-white/80 mb-8">
              Attack Surface Reduction, Defense in Depth, Compliance Readiness, Operational Security – vollständiges Hardening.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">OS Hardening</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">App Security</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Network</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Container</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-12">
            <p className="text-amber-900 font-semibold">
              🛡️ &quot;Not a Pentest&quot; Trust-Anker: Dieser Hardening Guide dient ausschließlich zur Absicherung von Systemen. Keine Angriffswerkzeuge, keine illegalen Aktivitäten.
            </p>
          </div>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🎯 Executive Summary</h2>
            <p className="text-slate-700 text-lg mb-6">
              Das <strong>Moltbot Hardening Guide 2024</strong> definiert die aktuellen Sicherheitsstandards für Production-Deployment von Moltbot-Systemen. In Anbetracht zunehmender Threat-Landschaften und strengerer Compliance-Anforderungen ist proaktives Hardening überlebenswichtig.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Attack Surface Reduction</h3>
                <p className="text-blue-800 text-sm">Minimierung potenzieller Angriffsvektoren</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Defense in Depth</h3>
                <p className="text-blue-800 text-sm">Mehrschichtige Sicherheitskontrollen</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Compliance Readiness</h3>
                <p className="text-blue-800 text-sm">Erfüllung regulatorischer Anforderungen</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Operational Security</h3>
                <p className="text-blue-800 text-sm">Sichere Betriebsprozesse</p>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🛡️ System Hardening</h2>
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Linux Hardening Checklist</h3>
            <div className="bg-slate-900 rounded-xl p-6 mb-6">
              <h4 className="text-white font-semibold mb-4">OS Hardening Script</h4>
              <pre className="font-mono text-sm text-green-400 overflow-x-auto">
{`#!/bin/bash
# Moltbot OS Hardening Script

echo "🔒 Starting Moltbot OS Hardening..."

# 1. System Updates
apt update && apt upgrade -y

# 2. Remove unnecessary packages
apt remove -y telnet ftp rsh rlogin talk
apt autoremove -y

# 3. Secure SSH Configuration
cat > /etc/ssh/sshd_config << 'EOF'
Port 22
Protocol 2
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
EOF

# 4. Kernel Hardening
sysctl -w net.ipv4.ip_forward=0
sysctl -w net.ipv4.conf.all.accept_redirects=0`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🔐 Application Security Hardening</h2>
            <p className="text-slate-700 text-lg mb-6">
              Dependency Management, Code Analysis, Runtime Protection und Secret Management bilden die Grundlage der Application-Level-Sicherheit.
            </p>
            <div className="bg-slate-900 rounded-xl p-6 mb-6">
              <h4 className="text-white font-semibold mb-4">Dependency Security Check</h4>
              <pre className="font-mono text-sm text-green-400 overflow-x-auto">
{`# Automated Dependency Check
npm audit --production
pip-audit --strict
trivy fs --security-checks vuln .

# SAST: Static Application Security Testing
semgrep --config p/owasp-top-ten .
bandit -r src/ -f json`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🌐 Network Security Hardening</h2>
            <p className="text-slate-700 text-lg mb-6">
              Firewall-Konfiguration, TLS/SSL-Enforcement, Network Segmentation und DNS Security für eine gehärtete Netzwerk-Infrastruktur.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🔍 Monitoring &amp; Logging Hardening</h2>
            <p className="text-slate-700 text-lg mb-6">
              Centralized Logging, Security Event Monitoring, Audit Trails und Alert-Systeme für vollständige Visibility.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🛡️ Container Security Hardening</h2>
            <div className="bg-slate-900 rounded-xl p-6 mb-6">
              <h4 className="text-white font-semibold mb-4">Secure Dockerfile</h4>
              <pre className="font-mono text-sm text-green-400 overflow-x-auto">
{`# Multi-stage Build for Security
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM gcr.io/distroless/nodejs20-debian12
COPY --from=builder /app/node_modules ./node_modules
COPY . .
USER nonroot:nonroot
EXPOSE 8080
CMD ["server.js"]`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">📊 Performance &amp; Resource Hardening</h2>
            <p className="text-slate-700 text-lg mb-6">
              Resource Limits, Memory Protection, CPU Isolation und I/O Throttling für sichere Performance-Optimierung.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🔍 Security Testing &amp; Validation</h2>
            <p className="text-slate-700 text-lg mb-6">
              Automatisierte Security Tests, Penetration Testing Frameworks, Vulnerability Scanning und Compliance Audits.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">📋 Hardening Checklist</h2>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <ul className="space-y-2 text-slate-700">
                <li>✅ OS-Updates &amp; Patch-Management</li>
                <li>✅ SSH Hardening (Key-only, no root)</li>
                <li>✅ Kernel-Parameter gehärtet</li>
                <li>✅ Unnecessary Services entfernt</li>
                <li>✅ Dependency Auditing aktiv</li>
                <li>✅ Container Security (distroless, nonroot)</li>
                <li>✅ Network Segmentation</li>
                <li>✅ TLS 1.3 enforced</li>
                <li>✅ Centralized Logging</li>
                <li>✅ Security Testing Pipeline</li>
              </ul>
            </div>
          </section>

          <section className="bg-gradient-to-r from-blue-700 to-indigo-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Moltbot Hardening Assessment</h2>
            <p className="mb-6">Validieren Sie Ihre Hardening-Konfiguration mit unserem automatisierten Check.</p>
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
        headline: "Moltbot Hardening Guide: 2024 Standards",
        author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        datePublished: "2024-04-06",
      })}} />
    </main>
  );
}
