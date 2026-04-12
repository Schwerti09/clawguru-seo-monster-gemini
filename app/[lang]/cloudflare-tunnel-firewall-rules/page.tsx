import type { Metadata } from "next";
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n";
import { BASE_URL } from "@/lib/config";
import { getCoreSecurityLinks } from "@/lib/core-security-links";
import { t } from "@/lib/article-i18n"

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
      ? "Cloudflare Tunnel Firewall Rules 2026 | Zero Trust Network Access"
      : "Cloudflare Tunnel Firewall Rules 2026 | Zero Trust Network Access",
    description: locale === "de"
      ? "Cloudflare Tunnel Firewall Rules Guide: Zero Trust Access, WAF Integration, DDoS Protection & Bot Management. Sichern Sie interne Services ohne Öffnen von Ports."
      : "Cloudflare Tunnel Firewall Rules Guide: Zero Trust Access, WAF Integration, DDoS Protection & Bot Management. Secure internal services without opening ports.",
    keywords: [
      "Cloudflare Tunnel",
      "Cloudflare Zero Trust",
      "Cloudflare Access",
      "Cloudflare Tunnel firewall",
      "Cloudflare tunnel rules",
      "Cloudflare warp",
      "Zero Trust Network Access",
      "ZTNA",
      "Cloudflare secure tunnel",
      "Internal services expose",
      "Cloudflare daemon",
      "cloudflared",
    ],
    alternates: buildLocalizedAlternates(locale, "/cloudflare-tunnel-firewall-rules"),
    openGraph: {
      images: ["/og-image.png"],
      title: "Cloudflare Tunnel Firewall Rules 2026: Zero Trust Guide",
      description: "Secure internal services with Cloudflare Tunnel: firewall rules, access policies, and Zero Trust implementation.",
      type: "article",
      url: `${BASE_URL}/${locale}/cloudflare-tunnel-firewall-rules`,
    },
  };
}

export default async function CloudflareTunnelPage({
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
    <main className="min-h-screen bg-gray-800">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-300/30 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-sm mb-4">
              <span className="w-2 h-2 rounded-full bg-orange-200 animate-pulse" />
              Zero Trust Network Access 2026
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Cloudflare Tunnel
            </h1>
            <p className="text-2xl text-orange-100 mb-4 font-light">
              Firewall Rules & Zero Trust Access
            </p>
            <p className="text-xl text-white/80 mb-8">
              {t(locale, "Sichere interne Services ohne Öffnen von Ports. WAF, DDoS Protection, Bot Management & Access Policies in einem.", "Secure internal services without opening ports. WAF, DDoS protection, bot management & access policies combined.")}
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">cloudflared</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Zero Trust</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">No Open Ports</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">WAF Integration</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Why Cloudflare Tunnel */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">
              {t(locale, "Warum Cloudflare Tunnel?", "Why Cloudflare Tunnel?")}
            </h2>
            
            <p className="text-gray-200 text-lg mb-6 leading-relaxed">
              {t(locale, "Cloudflare Tunnel (früher Argo Tunnel) ermöglicht sicheren Zugriff auf interne Services ohne VPN und ohne Öffnen von Firewall-Ports. Der Traffic wird über Cloudflares globales Netzwerk mit integriertem DDoS-Schutz und WAF geroutet.", "Cloudflare Tunnel (formerly Argo Tunnel) enables secure access to internal services without VPN and without opening firewall ports. Traffic is routed through Cloudflare's global network with integrated DDoS protection and WAF.")}
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-900 rounded-xl p-6 text-white">
                <h3 className="font-semibold mb-4 text-orange-400">{t(locale, "Traditionell (Alt)", "Traditional (Old)")}</h3>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">✗</span>
                    {t(locale, "VPN-Server öffentlich exponiert", "VPN server publicly exposed")}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">✗</span>
                    {t(locale, "Ports 443/80 öffnen", "Open ports 443/80")}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">✗</span>
                    {t(locale, "DDoS-Anfälligkeit", "DDoS vulnerability")}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">✗</span>
                    {t(locale, "Statische IP-Whitelists", "Static IP whitelists")}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">✗</span>
                    {t(locale, "Komplexe VPN-Config", "Complex VPN configuration")}
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-700 rounded-xl p-6">
                <h3 className="font-semibold mb-4 text-orange-700">Cloudflare Tunnel (Modern)</h3>
                <ul className="space-y-3 text-sm text-gray-200">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    {t(locale, "Keine öffentlichen Ports nötig", "No public ports needed")}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    {t(locale, "Ausgehende Verbindung nur (HTTPS)", "Outbound connection only (HTTPS)")}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    {t(locale, "Integrierter DDoS-Schutz", "Integrated DDoS protection")}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    {t(locale, "Identity-basierter Zugriff", "Identity-based access")}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    {t(locale, "Globale Edge-Performance", "Global edge performance")}
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Architecture */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Cloudflare Tunnel Architektur</h2>
            
            <div className="bg-slate-900 rounded-xl p-8 mb-8">
              <div className="flex flex-col items-center">
                <div className="grid grid-cols-3 gap-8 w-full">
                  {/* User */}
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl mb-3">👤</div>
                    <span className="text-white font-medium">User/Browser</span>
                    <p className="text-xs text-slate-400 mt-1">SSO Auth</p>
                  </div>
                  
                  {/* Cloudflare */}
                  <div className="text-center relative">
                    <div className="absolute top-10 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-orange-500 to-green-600" />
                    <div className="w-24 h-24 mx-auto bg-orange-500 rounded-full flex items-center justify-center text-white font-bold mb-3 relative z-10">
                      CF
                    </div>
                    <span className="text-white font-medium">Cloudflare Edge</span>
                    <p className="text-xs text-slate-400 mt-1">WAF + DDoS + Access</p>
                  </div>
                  
                  {/* Internal */}
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto bg-green-600 rounded-lg flex items-center justify-center text-white text-3xl mb-3">🏢</div>
                    <span className="text-white font-medium">Internal Service</span>
                    <p className="text-xs text-slate-400 mt-1">No public IP</p>
                  </div>
                </div>
                
                {/* Tunnel Connection */}
                <div className="mt-8 bg-slate-800 rounded-lg p-4 w-full">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-400">🔒 Outbound HTTPS (Port 443)</span>
                    <span className="text-slate-400">cloudflared daemon</span>
                    <span className="text-orange-400">🔐 TLS 1.3 + QUIC</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Installation */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">cloudflared Installation</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-900 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Docker Compose</h3>
                <pre className="font-mono text-xs text-green-400 overflow-x-auto">
{`services:
  cloudflared:
    image: cloudflare/cloudflared:latest
    command: tunnel --no-autoupdate run
    environment:
      - TUNNEL_TOKEN=$TUNNEL_TOKEN
    restart: unless-stopped
    
  # Your internal service
  web:
    image: nginx:alpine
    networks:
      - internal`}
                </pre>
              </div>
              <div className="bg-slate-900 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Kubernetes</h3>
                <pre className="font-mono text-xs text-green-400 overflow-x-auto">
{`apiVersion: apps/v1
kind: Deployment
metadata:
  name: cloudflared
spec:
  replicas: 2
  selector:
    matchLabels:
      app: cloudflared
  template:
    spec:
      containers:
      - name: cloudflared
        image: cloudflare/cloudflared:latest
        args:
        - tunnel
        - --no-autoupdate
        - run
        - --token
        - $(TUNNEL_TOKEN)
        env:
        - name: TUNNEL_TOKEN
          valueFrom:
            secretKeyRef:
              name: tunnel-token
              key: token`}
                </pre>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-700 rounded-xl p-6">
              <h3 className="font-semibold text-orange-900 mb-3">Token Management</h3>
              <p className="text-orange-800 text-sm mb-4">
                {t(locale, "Speichern Sie den Tunnel-Token sicher in Kubernetes Secrets, Docker Secrets oder Vault. Niemals in Git committen!", "Store the tunnel token securely in Kubernetes Secrets, Docker Secrets, or Vault. Never commit to Git!")}
              </p>
              <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-green-400">
{`# Create tunnel token secret
kubectl create secret generic tunnel-token \\
  --from-literal=token=$TUNNEL_TOKEN \\
  --namespace production`}
              </div>
            </div>
          </section>

          {/* Firewall Rules */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Cloudflare Access Policies</h2>
            
            <p className="text-gray-200 mb-6">
              {t(locale, "Cloudflare Access Policies definieren wer Zugriff auf Ihre Tunnels erhält. Integriert mit OIDC, SAML, OTP und Service Tokens.", "Cloudflare Access Policies define who gets access to your tunnels. Integrated with OIDC, SAML, OTP, and Service Tokens.")}
            </p>

            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto mb-6">
              <h3 className="text-white font-semibold mb-4">Access Policy Configuration</h3>
              <pre className="font-mono text-sm text-green-400">
{`# cloudflare-access.yaml
name: "Internal Dashboard"
include:
  # Require SSO authentication
  - idp:
      name: "Company Okta"
      
  # OR require Service Token (for APIs)
  - service_token:
      name: "api-service-token"
      
  # AND require specific email domains
  - email:
      domain: "company.com"
      
  # AND require country
  - geo:
      country: ["DE", "AT", "CH"]
      
exclude:
  # Block specific users
  - email:
      email: "ex-employee@company.com"
      
require:
  # Require MFA
  - authentication_method:
      methods: ["mfa"]`}
              </pre>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-800 border border-slate-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-100 mb-3">IdP Integration</h3>
                <ul className="space-y-2 text-sm text-gray-200">
                  <li>• Okta / Azure AD / Google</li>
                  <li>• OneLogin / Ping Identity</li>
                  <li>• GitHub / GitLab OAuth</li>
                  <li>• Generic OIDC / SAML 2.0</li>
                </ul>
              </div>
              <div className="bg-gray-800 border border-slate-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-100 mb-3">Service Tokens</h3>
                <ul className="space-y-2 text-sm text-gray-200">
                  <li>• API-to-API Authentication</li>
                  <li>• CI/CD Pipeline Access</li>
                  <li>• Service Mesh Integration</li>
                  <li>• mTLS Alternative</li>
                </ul>
              </div>
            </div>
          </section>

          {/* WAF Integration */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">WAF & Security Integration</h2>
            
            <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-700 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-orange-900 mb-4">Security Layers</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold">1</div>
                  <div>
                    <span className="font-medium text-gray-100">DDoS Protection</span>
                    <p className="text-sm text-slate-600">Layer 3/4/7 DDoS mitigation automatisch</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold">2</div>
                  <div>
                    <span className="font-medium text-gray-100">Bot Management</span>
                    <p className="text-sm text-slate-600">AI-gestützte Bot-Erkennung</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-yellow-600 text-white flex items-center justify-center font-bold">3</div>
                  <div>
                    <span className="font-medium text-gray-100">WAF Rules</span>
                    <p className="text-sm text-slate-600">OWASP Top 10, SQLi, XSS Protection</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-green-600 text-white flex items-center justify-center font-bold">4</div>
                  <div>
                    <span className="font-medium text-gray-100">Access Policies</span>
                    <p className="text-sm text-slate-600">Identity-based access control</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <h3 className="text-white font-semibold mb-4">Custom WAF Rule for Tunnel</h3>
              <pre className="font-mono text-sm text-green-400">
{`resource "cloudflare_ruleset" "tunnel_waf" {
  zone_id = var.zone_id
  name    = "Tunnel Security Rules"
  kind    = "zone"
  phase   = "http_request_firewall_custom"

  # Block known bad bots
  rules {
    action      = "block"
    expression  = "(cf.bot_management.score lt 10)"
    description = "Block low-reputation bots"
  }

  # Rate limiting per IP
  rules {
    action      = "block"
    expression  = "(http.request.uri.path contains \"/api/\" and cf.threat_score gt 50)"
    description = "Block high-risk IPs on API"
  }

  # Geo-blocking if needed
  rules {
    action      = "block"
    expression  = "(not ip.geoip.country in {\"DE\" \"AT\" \"CH\"})"
    description = "Block non-DACH countries"
  }
}`}
              </pre>
            </div>
          </section>

          {/* Best Practices */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Best Practices 2026</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-800 border border-slate-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-100 mb-4">High Availability</h3>
                <ul className="space-y-3 text-sm text-gray-200">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    {t(locale, "Mindestens 2 cloudflared Replicas", "Minimum 2 cloudflared replicas")}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    {t(locale, "Multi-Region Deployment", "Multi-region deployment")}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    {t(locale, "Health Checks konfigurieren", "Configure health checks")}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    {t(locale, "Automatisches Failover", "Automatic failover")}
                  </li>
                </ul>
              </div>
              <div className="bg-gray-800 border border-slate-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-100 mb-4">Security</h3>
                <ul className="space-y-3 text-sm text-gray-200">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    {t(locale, "SSO für alle internen Services", "SSO for all internal services")}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    {t(locale, "Service Tokens für APIs", "Service tokens for APIs")}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    {t(locale, "Audit Logging aktivieren", "Enable audit logging")}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    {t(locale, "Session timeouts konfigurieren", "Configure session timeouts")}
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">
              {t(locale, "Bereit für Zero Trust?", "Ready for Zero Trust?")}
            </h2>
            <p className="mb-6 max-w-2xl mx-auto">
              {t(locale, "Migrieren Sie Ihre internen Services zu Cloudflare Tunnel. Keine öffentlichen Ports mehr nötig.", "Migrate your internal services to Cloudflare Tunnel. No public ports needed anymore.")}
            </p>
            <a 
              href={coreLinks.check} 
              className="inline-block px-6 py-3 bg-gray-800 text-orange-400 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
            >
              Migration Assessment
            </a>
          </section>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "Cloudflare Tunnel Firewall Rules 2026",
        author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        datePublished: "2026-03-29",
      })}} />
    </main>
  );
}
