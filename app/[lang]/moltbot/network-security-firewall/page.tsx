import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'Moltbot Network Security: Firewall & DDoS Protection 2024',
    description: 'Network Security für Moltbot: Firewall-Konfiguration, DDoS-Schutz, IP-Allowlisting, WAF-Setup und Netzwerk-Segmentierung. Konkrete iptables, nginx und Cloudflare Konfigurationen.',
    keywords: ['moltbot network security','firewall configuration','ddos protection','waf setup','ip allowlisting','network segmentation'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'Moltbot Network Security: Firewall & DDoS Protection 2024', description: 'Network Security für Moltbot mit Firewall, DDoS-Schutz und WAF.', type: 'article', url: `https://clawguru.org/${lang}/moltbot/network-security-firewall`, images: ['/og-moltbot-network.jpg'] },
    alternates: buildLocalizedAlternates(lang as Locale, '/moltbot/network-security-firewall'),
    robots: 'index, follow',
  };
}

export default function MoltbotNetworkSecurityPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Trust-Anker</strong>: Dieser Guide dient ausschließlich zur Absicherung von Netzwerk-Infrastrukturen. Keine Angriffswerkzeuge, keine illegalen Aktivitäten.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Moltbot Network Security: Firewall &amp; DDoS Protection</h1>
        <p className="text-lg text-gray-300 mb-8">Netzwerk-Absicherung für Moltbot — von iptables-Regeln über nginx WAF bis hin zu Cloudflare DDoS-Schutz und IP-Allowlisting.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔥 iptables Firewall Rules</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-4">
            <pre>{`#!/bin/bash
# moltbot-firewall.sh — Produktions-Firewall für Moltbot

# Standard-Policy: Alles verweigern
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# Bestehende Verbindungen erlauben
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# Loopback erlauben
iptables -A INPUT -i lo -j ACCEPT

# SSH (nur von Management-Netz)
iptables -A INPUT -p tcp --dport 22 -s 10.0.1.0/24 -j ACCEPT

# HTTP/HTTPS
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Moltbot API (nur intern)
iptables -A INPUT -p tcp --dport 3000 -s 10.0.0.0/8 -j ACCEPT

# DDoS Protection: Rate Limiting
iptables -A INPUT -p tcp --dport 443 -m limit --limit 100/min --limit-burst 200 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j DROP

# Logging verdächtiger Pakete
iptables -A INPUT -j LOG --log-prefix "MOLTBOT-DROP: " --log-level 7`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🌐 nginx WAF Konfiguration</h2>
          <div className="bg-gray-900 text-blue-400 p-4 rounded-lg font-mono text-sm mb-4">
            <pre>{`# /etc/nginx/conf.d/moltbot-security.conf
server {
    listen 443 ssl http2;
    server_name clawguru.org;

    # TLS Hardening
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    add_header Strict-Transport-Security "max-age=63072000" always;

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=moltbot_api:10m rate=10r/s;
    limit_req zone=moltbot_api burst=20 nodelay;

    # Block common attacks
    location ~ \.(git|env|htpasswd|htaccess)$ {
        deny all;
    }

    # SQL Injection / XSS basic WAF
    if ($query_string ~* "(union|select|insert|update|delete|drop|<script)") {
        return 403;
    }

    location /api/ {
        proxy_pass http://moltbot:3000;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">☁️ Cloudflare DDoS Rules</h2>
          <div className="bg-gray-900 text-yellow-400 p-4 rounded-lg font-mono text-sm mb-4">
            <pre>{`# Cloudflare Firewall Rules (via API)
# Block bekannte Bad Bots
{
  "expression": "(cf.threat_score gt 50) or (not cf.client.bot)",
  "action": "challenge"
}

# Rate Limit für Moltbot API
{
  "expression": "http.request.uri.path matches \"^/api/\"",
  "action": "block",
  "ratelimit": {
    "characteristics": ["ip.src"],
    "period": 60,
    "requests_per_period": 100
  }
}

# Geo-Blocking (optional)
{
  "expression": "ip.geoip.country in {\"XX\" \"YY\"}",
  "action": "block"
}`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔗 Weiterführende Ressourcen</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700">
              <div className="font-semibold text-cyan-400">🛡️ Security Check</div>
              <div className="text-sm text-gray-300">Netzwerk live scannen</div>
            </a>
            <a href="/runbooks" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700">
              <div className="font-semibold text-cyan-400">📚 Network Runbooks</div>
              <div className="text-sm text-gray-300">Firewall Playbooks</div>
            </a>
            <a href="/neuro" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700">
              <div className="font-semibold text-cyan-400">🧠 Neuro AI</div>
              <div className="text-sm text-gray-300">Anomalie-Erkennung</div>
            </a>
            <a href="/solutions" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700">
              <div className="font-semibold text-cyan-400">🏢 Enterprise</div>
              <div className="text-sm text-gray-300">Managed Firewall</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
