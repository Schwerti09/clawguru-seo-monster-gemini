import type { Metadata } from "next";
import { SUPPORTED_LOCALES, type Locale, localeAlternates } from "@/lib/i18n";
import { BASE_URL } from "@/lib/config";
import { getCoreSecurityLinks } from "@/lib/core-security-links";

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
      ? "Tailscale PAM: Privileged Access Management 2026 | Zero Trust SSH"
      : "Tailscale PAM: Privileged Access Management 2026 | Zero Trust SSH",
    description: locale === "de"
      ? "Kompletter Tailscale PAM Guide 2026: Privileged Access Management, Zero Trust SSH, Device Trust & Netzwerksegmentierung. Enterprise Security Setup."
      : "Complete Tailscale PAM Guide 2026: Privileged Access Management, Zero Trust SSH, Device Trust & network segmentation. Enterprise security setup.",
    keywords: [
      "Tailscale PAM",
      "Tailscale privileged access",
      "Tailscale SSH",
      "Tailscale zero trust",
      "Tailscale device trust",
      "Tailscale ACL",
      "Tailscale policy",
      "Tailscale enterprise",
      "Tailscale security",
      "Tailscale compliance",
      "Tailscale audit",
      "Tailscale SSO",
      "Tailscale RBAC",
    ],
    alternates: {
      ...localeAlternates(`/${locale}/tailscale-pam`),
    },
    openGraph: {
      title: "Tailscale PAM 2026: Zero Trust Privileged Access",
      description: "Complete guide to Tailscale PAM implementation with Zero Trust SSH, Device Trust & enterprise security.",
      type: "article",
      url: `${BASE_URL}/${locale}/tailscale-pam`,
    },
  };
}

export default async function TailscalePAMPage({
  params,
}: {
  params: { lang: string };
}) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale)
    ? params.lang
    : "de") as Locale;
  const prefix = `/${locale}`;
  const coreLinks = getCoreSecurityLinks(locale);

  const isGerman = locale === "de";

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-slate-900 to-blue-800 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm mb-4">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              {isGerman ? "Zero Trust Security 2026" : "Zero Trust Security 2026"}
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Tailscale PAM
            </h1>
            <p className="text-2xl text-blue-200 mb-4 font-light">
              {isGerman 
                ? "Privileged Access Management mit Zero Trust SSH"
                : "Privileged Access Management with Zero Trust SSH"}
            </p>
            <p className="text-xl text-slate-300 mb-8">
              {isGerman
                ? "Der umfassende Guide für Enterprise-Tailscale: Device Trust, ACLs, Audit-Logging & Compliance. Ersatz für traditionelles VPN und Bastion Hosts."
                : "The comprehensive enterprise Tailscale guide: Device Trust, ACLs, audit logging & compliance. Replace traditional VPN and bastion hosts."}
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="px-4 py-2 bg-blue-600/30 text-blue-200 rounded-lg">Zero Trust Network</span>
              <span className="px-4 py-2 bg-blue-600/30 text-blue-200 rounded-lg">WireGuard</span>
              <span className="px-4 py-2 bg-blue-600/30 text-blue-200 rounded-lg">Device Trust</span>
              <span className="px-4 py-2 bg-blue-600/30 text-blue-200 rounded-lg">SOC 2 Compliant</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* TOC */}
          <div className="bg-slate-50 rounded-xl p-6 mb-12 border border-slate-200">
            <h2 className="font-semibold text-slate-900 mb-4">{isGerman ? "Inhaltsverzeichnis" : "Table of Contents"}</h2>
            <div className="grid md:grid-cols-2 gap-2 text-sm">
              <a href="#overview" className="text-blue-600 hover:underline">→ {isGerman ? "Was ist Tailscale PAM?" : "What is Tailscale PAM?"}</a>
              <a href="#device-trust" className="text-blue-600 hover:underline">→ Device Trust & Posture</a>
              <a href="#acl" className="text-blue-600 hover:underline">→ ACL Policies (Zero Trust)</a>
              <a href="#ssh" className="text-blue-600 hover:underline">→ SSH & Session Recording</a>
              <a href="#compliance" className="text-blue-600 hover:underline">→ Compliance (SOC 2, ISO 27001)</a>
              <a href="#setup" className="text-blue-600 hover:underline">→ Enterprise Setup Guide</a>
            </div>
          </div>

          {/* What is Tailscale PAM */}
          <section id="overview" className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              {isGerman ? "Was ist Tailscale PAM (Privileged Access Management)?" : "What is Tailscale PAM (Privileged Access Management)?"}
            </h2>
            
            <p className="text-slate-700 text-lg mb-6 leading-relaxed">
              {isGerman
                ? "Tailscale PAM ist die moderne Alternative zu traditionellen VPN-Lösungen und Jump Hosts. Basierend auf WireGuard bietet es Zero Trust Network Access (ZTNA) mit integriertem Privileged Access Management für DevOps, SREs und Entwicklerteams."
                : "Tailscale PAM is the modern alternative to traditional VPN solutions and jump hosts. Built on WireGuard, it offers Zero Trust Network Access (ZTNA) with integrated privileged access management for DevOps, SREs, and development teams."}
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="text-3xl mb-3">🔐</div>
                <h3 className="font-semibold text-slate-900 mb-2">{isGerman ? "Zero Trust" : "Zero Trust"}</h3>
                <p className="text-slate-600 text-sm">
                  {isGerman 
                    ? "Kein implizites Vertrauen. Jede Verbindung wird authentifiziert und autorisiert."
                    : "No implicit trust. Every connection is authenticated and authorized."}
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-semibold text-slate-900 mb-2">WireGuard</h3>
                <p className="text-slate-600 text-sm">
                  {isGerman
                    ? "Modernes, schnelles VPN-Protokoll. 3-5x schneller als OpenVPN/IPsec."
                    : "Modern, fast VPN protocol. 3-5x faster than OpenVPN/IPsec."}
                </p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <div className="text-3xl mb-3">🛡️</div>
                <h3 className="font-semibold text-slate-900 mb-2">Device Trust</h3>
                <p className="text-slate-600 text-sm">
                  {isGerman
                    ? "Überprüfung der Gerätesicherheit vor Netzwerkzugriff."
                    : "Verification of device security before network access."}
                </p>
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-6 text-slate-300 mb-8">
              <h3 className="text-white font-semibold mb-4">{isGerman ? "Tailscale vs Traditionelles VPN" : "Tailscale vs Traditional VPN"}</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-red-400 font-medium mb-2">{isGerman ? "Traditionell (Alt)" : "Traditional (Old)"}</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Zentrale VPN-Server (Single Point of Failure)</li>
                    <li>• Komplexe Netzwerkrouten</li>
                    <li>• Manuelle Schlüsselverwaltung</li>
                    <li>• Hohe Latenz</li>
                    <li>• Kein Device Trust</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-green-400 font-medium mb-2">Tailscale (Modern)</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Mesh-Netzwerk (dezentral)</li>
                    <li>• Automatische NAT-Traversal</li>
                    <li>• Identitätsbasierte ACLs</li>
                    <li>• Direkte P2P-Verbindungen</li>
                    <li>• Integriertes Device Trust</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Device Trust */}
          <section id="device-trust" className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Device Trust & Posture Management</h2>
            
            <p className="text-slate-700 mb-6">
              {isGerman
                ? "Device Trust ist das Fundament von Tailscale PAM. Nur geprüfte und verifizierte Geräte erhalten Netzwerkzugriff. Die Sicherheitslage (Posture) jedes Geräts wird kontinuierlich überwacht."
                : "Device Trust is the foundation of Tailscale PAM. Only inspected and verified devices receive network access. The security posture of each device is continuously monitored."}
            </p>

            <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-slate-900 mb-4">{isGerman ? "Device Trust Checks" : "Device Trust Checks"}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded bg-green-100 text-green-600 flex items-center justify-center text-sm">✓</span>
                    <div>
                      <span className="font-medium text-slate-900">OS Version</span>
                      <p className="text-sm text-slate-600">{isGerman ? "Aktuelles Betriebssystem erforderlich" : "Current operating system required"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded bg-green-100 text-green-600 flex items-center justify-center text-sm">✓</span>
                    <div>
                      <span className="font-medium text-slate-900">Disk Encryption</span>
                      <p className="text-sm text-slate-600">{isGerman ? "BitLocker/FileVault aktiviert" : "BitLocker/FileVault enabled"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded bg-green-100 text-green-600 flex items-center justify-center text-sm">✓</span>
                    <div>
                      <span className="font-medium text-slate-900">Screen Lock</span>
                      <p className="text-sm text-slate-600">{isGerman ? "Automatische Bildschirmsperre" : "Automatic screen lock"}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded bg-green-100 text-green-600 flex items-center justify-center text-sm">✓</span>
                    <div>
                      <span className="font-medium text-slate-900">Anti-Virus</span>
                      <p className="text-sm text-slate-600">{isGerman ? "ESET, CrowdStrike, etc. aktiv" : "ESET, CrowdStrike, etc. active"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded bg-green-100 text-green-600 flex items-center justify-center text-sm">✓</span>
                    <div>
                      <span className="font-medium text-slate-900">Firewall</span>
                      <p className="text-sm text-slate-600">{isGerman ? "System-Firewall aktiviert" : "System firewall enabled"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded bg-green-100 text-green-600 flex items-center justify-center text-sm">✓</span>
                    <div>
                      <span className="font-medium text-slate-900">Certificate</span>
                      <p className="text-sm text-slate-600">{isGerman ? "MDM-Zertifikat vorhanden" : "MDM certificate present"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <h3 className="text-white font-semibold mb-4">{isGerman ? "Device Trust Konfiguration (ACL)" : "Device Trust Configuration (ACL)"}</h3>
              <pre className="font-mono text-sm text-green-400">
{`{
  "nodeAttrs": [
    {
      "target": ["autogroup:member"],
      "attr": ["funnel",
        "device:os:windows",
        "device:os:macos",
        "device:os:linux"
      ]
    }
  ],
  "postures": {
    "windowsRequired": {
      "type": "device",
      "rules": [
        {
          "type": "osVersion",
          "minVersion": "10.0.19044",  // Windows 10 21H2
          "maxVersion": "",
          "operator": ">="
        },
        {
          "type": "firewall",
          "firewallEnabled": true
        },
        {
          "type": "diskEncryption",
          "diskEncryptionEnabled": true
        }
      ]
    }
  }
}`}
              </pre>
            </div>
          </section>

          {/* ACL */}
          <section id="acl" className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">ACL Policies: Zero Trust Network Access</h2>
            
            <p className="text-slate-700 mb-6">
              {isGerman
                ? "Tailscale ACLs (Access Control Lists) definieren wer was darf. Basiert auf Identität (SSO), nicht IP-Adressen."
                : "Tailscale ACLs (Access Control Lists) define who can do what. Based on identity (SSO), not IP addresses."}
            </p>

            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 px-6 py-3 border-b border-slate-200">
                  <span className="font-semibold text-slate-700">{isGerman ? "Beispiel: DevOps Team Zugriff" : "Example: DevOps Team Access"}</span>
                </div>
                <div className="p-6 bg-slate-900 overflow-x-auto">
                  <pre className="font-mono text-sm text-green-400">
{`{
  "groups": {
    "group:devops": ["alice@company.com", "bob@company.com"],
    "group:sre": ["charlie@company.com"],
    "group:qa": ["dave@company.com"]
  },
  "acls": [
    // DevOps: Full production access
    {
      "action": "accept",
      "src": ["group:devops"],
      "dst": ["tag:prod:*"],
      "proto": "tcp",
      "srcPort": ""
    },
    // SRE: Read-only monitoring access
    {
      "action": "accept",
      "src": ["group:sre"],
      "dst": ["tag:monitoring:9090", "tag:monitoring:3000"]
    },
    // QA: Staging only
    {
      "action": "accept",
      "src": ["group:qa"],
      "dst": ["tag:staging:*"]
    }
  ],
  "tagOwners": {
    "tag:prod": ["group:devops"],
    "tag:staging": ["group:devops", "group:qa"],
    "tag:monitoring": ["group:sre"]
  }
}`}
                  </pre>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-8">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Principle of Least Privilege</h4>
                <p className="text-sm text-blue-800">{isGerman ? "Nur notwendige Zugriffe erlauben" : "Only allow necessary access"}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Identity-Based</h4>
                <p className="text-sm text-blue-800">{isGerman ? "SSO/IdP statt IP-Whitelists" : "SSO/IdP instead of IP whitelists"}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Just-in-Time</h4>
                <p className="text-sm text-blue-800">{isGerman ? "Temporäre Zugriffsrechte" : "Temporary access rights"}</p>
              </div>
            </div>
          </section>

          {/* SSH */}
          <section id="ssh" className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">SSH & Session Recording</h2>
            
            <p className="text-slate-700 mb-6">
              {isGerman
                ? "Tailscale SSH ersetzt traditionelle SSH-Keys. Authentifizierung über Identity Provider, Session Recording für Compliance."
                : "Tailscale SSH replaces traditional SSH keys. Authentication via Identity Provider, session recording for compliance."}
            </p>

            <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-slate-900 mb-4">{isGerman ? "Tailscale SSH Features" : "Tailscale SSH Features"}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> {isGerman ? "Keine SSH-Keys mehr nötig" : "No SSH keys needed"}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> SSO-Authentifizierung (OIDC/SAML)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> {isGerman ? "Automatische User-Provisioning" : "Automatic user provisioning"}
                  </li>
                </ul>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> {isGerman ? "Session Recording (Video)" : "Session recording (video)"}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> {isGerman ? "Audit-Logs (who, what, when)" : "Audit logs (who, what, when)"}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> {isGerman ? "JIT Access (temporär)" : "JIT access (temporary)"}
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <h3 className="text-white font-semibold mb-4">SSH ACL Configuration</h3>
              <pre className="font-mono text-sm text-green-400">
{`{
  "ssh": [
    {
      "action": "check",
      "src": ["group:devops"],
      "dst": ["tag:prod"],
      "users": ["root", "ubuntu"],
      "checkPeriod": "2h"  // Re-auth every 2 hours
    },
    {
      "action": "accept",
      "src": ["group:sre"],
      "dst": ["tag:monitoring"],
      "users": ["readonly"]
    }
  ]
}`}
              </pre>
            </div>
          </section>

          {/* Compliance */}
          <section id="compliance" className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Compliance & Certifications</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold">SOC<br/><span className="text-xs">2</span></div>
                  <div>
                    <h3 className="font-semibold text-slate-900">SOC 2 Type II</h3>
                    <p className="text-sm text-slate-500">Tailscale Inc. ist SOC 2 Type II zertifiziert</p>
                  </div>
                </div>
                <ul className="text-sm text-slate-700 space-y-2">
                  <li>• {isGerman ? "CC6.1: Logische und physische Zugangsbeschränkungen" : "CC6.1: Logical and physical access restrictions"}</li>
                  <li>• {isGerman ? "CC6.2: Vor Privilegierechtezuweisung authentifizieren" : "CC6.2: Authenticate before privilege assignment"}</li>
                  <li>• {isGerman ? "CC6.3: Zugang über Berechtigungen hinaus entfernen" : "CC6.3: Remove access beyond privileges"}</li>
                  <li>• {isGerman ? "CC7.2: Systemmonitoring" : "CC7.2: System monitoring"}</li>
                </ul>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-xs">ISO<br/>27001</div>
                  <div>
                    <h3 className="font-semibold text-slate-900">ISO 27001:2022</h3>
                    <p className="text-sm text-slate-500">{isGerman ? "Unterstützt Compliance-Anforderungen" : "Supports compliance requirements"}</p>
                  </div>
                </div>
                <ul className="text-sm text-slate-700 space-y-2">
                  <li>• {isGerman ? "A.5.18: Zugriffsrechte" : "A.5.18: Access rights"}</li>
                  <li>• {isGerman ? "A.8.2: Privilegierechte" : "A.8.2: Privileged access rights"}</li>
                  <li>• {isGerman ? "A.8.7: Schutz gegen Malware" : "A.8.7: Protection against malware"}</li>
                  <li>• {isGerman ? "A.8.9: Sichere Konfiguration" : "A.8.9: Secure configuration"}</li>
                </ul>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mt-6">
              <h3 className="font-semibold text-green-900 mb-3">{isGerman ? "Audit-Logging für Compliance" : "Audit Logging for Compliance"}</h3>
              <p className="text-green-800 text-sm mb-4">
                {isGerman
                  ? "Tailscale protokolliert alle Netzwerkverbindungen und Zugriffe. Exportieren Sie Logs zu SIEM-Systemen wie Splunk, Datadog oder ELK."
                  : "Tailscale logs all network connections and access. Export logs to SIEM systems like Splunk, Datadog, or ELK."}
              </p>
              <div className="bg-white rounded-lg p-4 font-mono text-xs text-slate-700">
{`{
  "log": {
    "config": {
      "src": "net-100.64.0.1:1234",
      "dst": "tag:prod:22",
      "proto": "tcp",
      "user": "alice@company.com",
      "action": "accept"
    }
  }
}`}
              </div>
            </div>
          </section>

          {/* Setup Guide */}
          <section id="setup" className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Enterprise Setup Guide</h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">1</div>
                <div>
                  <h3 className="font-semibold text-slate-900">Identity Provider (SSO) konfigurieren</h3>
                  <p className="text-slate-600 text-sm mt-1">
                    {isGerman 
                      ? "Verbinden Sie Tailscale mit Ihrem IdP (Okta, Azure AD, Google Workspace). Erzwingen Sie MFA."
                      : "Connect Tailscale to your IdP (Okta, Azure AD, Google Workspace). Enforce MFA."}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">2</div>
                <div>
                  <h3 className="font-semibold text-slate-900">Device Trust Policies definieren</h3>
                  <p className="text-slate-600 text-sm mt-1">
                    {isGerman
                      ? "Legen Sie Mindestanforderungen fest: OS-Version, Encryption, Firewall, EDR."
                      : "Define minimum requirements: OS version, encryption, firewall, EDR."}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">3</div>
                <div>
                  <h3 className="font-semibold text-slate-900">ACLs & Tags strukturieren</h3>
                  <p className="text-slate-600 text-sm mt-1">
                    {isGerman
                      ? "Erstellen Sie eine klare Tag-Hierarchie (prod, staging, dev). Definieren Sie ACLs pro Team."
                      : "Create a clear tag hierarchy (prod, staging, dev). Define ACLs per team."}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">4</div>
                <div>
                  <h3 className="font-semibold text-slate-900">Subnet Routes & Exit Nodes</h3>
                  <p className="text-slate-600 text-sm mt-1">
                    {isGerman
                      ? "Konfigurieren Sie Subnet-Router für nicht-Tailscale-Geräte. Exit Nodes für sicheren Internet-Zugriff."
                      : "Configure subnet routers for non-Tailscale devices. Exit nodes for secure internet access."}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">5</div>
                <div>
                  <h3 className="font-semibold text-slate-900">Monitoring & Alerting</h3>
                  <p className="text-slate-600 text-sm mt-1">
                    {isGerman
                      ? "Exportieren Sie Logs zu Ihrem SIEM. Richten Sie Alerts für ungewöhnliche Zugriffe ein."
                      : "Export logs to your SIEM. Set up alerts for unusual access patterns."}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">
              {isGerman ? "Bereit für Zero Trust Networking?" : "Ready for Zero Trust Networking?"}
            </h2>
            <p className="mb-6 max-w-2xl mx-auto">
              {isGerman
                ? "Starten Sie Ihre Tailscale PAM Migration mit ClawGuru's Security-Assessment."
                : "Start your Tailscale PAM migration with ClawGuru's security assessment."}
            </p>
            <a 
              href={coreLinks.check} 
              className="inline-block px-6 py-3 bg-white text-blue-800 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
            >
              {isGerman ? "Security Assessment Starten" : "Start Security Assessment"}
            </a>
          </section>
        </div>
      </div>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: isGerman ? "Tailscale PAM 2026: Privileged Access Management Guide" : "Tailscale PAM 2026: Privileged Access Management Guide",
        author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        publisher: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        datePublished: "2026-03-29",
        dateModified: "2026-03-29",
      })}} />
    </main>
  );
}
