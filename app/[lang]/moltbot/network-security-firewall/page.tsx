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
    title: "Moltbot Network Security: Firewall Konfiguration",
    description:
      "Network Security Setup und Firewall Rules für Moltbot. Complete Firewall Configuration mit iptables, UFW und Cloud Security Best Practices.",
    keywords: [
      "moltbot network security",
      "firewall configuration",
      "iptables",
      "ufw",
      "cloud security",
      "network hardening",
    ],
    alternates: {
      ...localeAlternates(`/${locale}/moltbot/network-security-firewall`),
    },
    openGraph: {
      title: "Moltbot Network Security: Firewall Konfiguration",
      description:
        "Network Security Setup und Firewall Rules für Moltbot mit iptables, UFW und Cloud Security.",
      type: "article",
      url: `${BASE_URL}/${locale}/moltbot/network-security-firewall`,
    },
  };
}

export default async function MoltbotNetworkSecurityPage({
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
              Network Security 2024
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Network Security &amp; Firewall
            </h1>
            <p className="text-2xl text-blue-200 mb-4">
              Moltbot Firewall Konfiguration
            </p>
            <p className="text-xl text-white/80 mb-8">
              Defense in Depth, Principle of Least Privilege, Zero Trust Network, Continuous Monitoring – vollständige Netzwerk-Absicherung.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">UFW</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">iptables</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Cloud Security</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">IDS/IPS</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-12">
            <p className="text-amber-900 font-semibold">
              🛡️ &quot;Not a Pentest&quot; Trust-Anker: Dieser Guide dient ausschließlich zur Konfiguration von Network Security und Firewalls. Keine Angriffswerkzeuge, keine illegalen Aktivitäten.
            </p>
          </div>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🎯 Executive Summary</h2>
            <p className="text-slate-700 text-lg mb-6">
              Die <strong>Moltbot Network Security</strong> stellt einen umfassenden Ansatz für die Absicherung von Netzwerk-Infrastrukturen dar. Robuste Firewall-Konfiguration ist überlebenswichtig gegen zunehmend sophistizierte Netzwerk-Angriffe.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🏗️ Network Security Architecture</h2>
            <p className="text-slate-700 text-lg mb-6">
              Mehrschichtige Netzwerk-Sicherheit mit Perimeter Firewall, Application Firewall (WAF), Intrusion Detection/Prevention und Network Monitoring.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🔥 UFW Firewall Configuration</h2>
            <div className="bg-slate-900 rounded-xl p-6 mb-6">
              <h4 className="text-white font-semibold mb-4">Basic UFW Setup</h4>
              <pre className="font-mono text-sm text-green-400 overflow-x-auto">
{`#!/bin/bash
# Moltbot UFW Firewall Configuration

# Reset UFW
ufw --force reset

# Default policies
ufw default deny incoming
ufw default allow outgoing

# Allow SSH (rate-limited)
ufw limit 22/tcp comment 'Rate-limited SSH'

# Allow HTTPS
ufw allow 443/tcp comment 'HTTPS'

# Allow Moltbot API
ufw allow 8080/tcp comment 'Moltbot API'

# Enable UFW
ufw --force enable
ufw status verbose`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🛡️ iptables Advanced Configuration</h2>
            <div className="bg-slate-900 rounded-xl p-6 mb-6">
              <h4 className="text-white font-semibold mb-4">iptables Security Rules</h4>
              <pre className="font-mono text-sm text-green-400 overflow-x-auto">
{`#!/bin/bash
# Flush existing rules
iptables -F
iptables -X

# Default policies
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# Allow loopback
iptables -A INPUT -i lo -j ACCEPT

# Allow established connections
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# SYN flood protection
iptables -A INPUT -p tcp --syn -m limit --limit 1/s --limit-burst 3 -j ACCEPT

# Port scanning protection
iptables -A INPUT -p tcp --tcp-flags ALL NONE -j DROP
iptables -A INPUT -p tcp --tcp-flags ALL ALL -j DROP`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">☁️ Cloud Security Configuration</h2>
            <p className="text-slate-700 text-lg mb-6">
              AWS Security Groups, Azure NSGs, GCP Firewall Rules – Cloud-native Firewall-Konfiguration für Moltbot Deployments in allen großen Cloud-Providern.
            </p>
            <div className="bg-slate-900 rounded-xl p-6 mb-6">
              <h4 className="text-white font-semibold mb-4">AWS Security Group</h4>
              <pre className="font-mono text-sm text-green-400 overflow-x-auto">
{`# Terraform: AWS Security Group
resource "aws_security_group" "moltbot" {
  name        = "moltbot-sg"
  description = "Moltbot Security Group"

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🔍 Intrusion Detection System</h2>
            <p className="text-slate-700 text-lg mb-6">
              Snort/Suricata IDS/IPS Setup, Rule Management, Alert-Konfiguration und automatisierte Response für Echtzeit-Netzwerk-Überwachung.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">📊 Network Monitoring</h2>
            <p className="text-slate-700 text-lg mb-6">
              Prometheus + Grafana Network Dashboards, NetFlow Analysis, Bandwidth Monitoring und Traffic Anomaly Detection.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🔧 Automated Security Scripts</h2>
            <p className="text-slate-700 text-lg mb-6">
              Automatisierte Firewall-Updates, Security Scans, Compliance Checks und Incident Response Scripts für den operativen Betrieb.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">📋 Implementation Guide</h2>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <ul className="space-y-2 text-slate-700">
                <li>✅ UFW/iptables Firewall konfiguriert</li>
                <li>✅ Default-Deny Policy aktiv</li>
                <li>✅ SYN Flood Protection</li>
                <li>✅ Port Scanning Protection</li>
                <li>✅ Cloud Security Groups konfiguriert</li>
                <li>✅ IDS/IPS aktiv (Snort/Suricata)</li>
                <li>✅ Network Monitoring (Prometheus/Grafana)</li>
                <li>✅ Automated Security Scripts</li>
              </ul>
            </div>
          </section>

          <section className="bg-gradient-to-r from-blue-700 to-indigo-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Network Security Assessment</h2>
            <p className="mb-6">Validieren Sie Ihre Firewall-Konfiguration mit unserem automatisierten Check.</p>
            <a href={coreLinks.check} className="inline-block px-6 py-3 bg-white text-blue-700 rounded-lg font-semibold">
              Security Assessment starten
            </a>
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
              <a href={`${prefix}/moltbot/hardening-guide-2024`} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">Hardening Guide</a>
              <a href={`${prefix}/moltbot/security-framework`} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">Security Framework</a>
              <a href={`${prefix}/runbooks/security`} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">Security Runbooks</a>
              <a href={coreLinks.methodology} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">Methodology</a>
            </div>
          </section>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "Moltbot Network Security: Firewall Konfiguration",
        author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        datePublished: "2024-04-06",
      })}} />
    </main>
  );
}
