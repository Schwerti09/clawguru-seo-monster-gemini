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
    title: locale === "de" 
      ? "Prometheus VPN Monitoring 2026 | Secure Metrics Collection"
      : "Prometheus VPN Monitoring 2026 | Secure Metrics Collection",
    description: locale === "de"
      ? "Prometheus über VPN: Sichere Metrik-Erfassung hinter Firewalls, Tailscale, WireGuard & Zero Trust. Federation, Remote Write & mTLS."
      : "Prometheus over VPN: Secure metrics collection behind firewalls, Tailscale, WireGuard & Zero Trust. Federation, remote write & mTLS.",
    keywords: [
      "Prometheus VPN",
      "Prometheus remote write",
      "Prometheus federation",
      "Prometheus tailscale",
      "Prometheus wireguard",
      "Prometheus zerotrust",
      "Secure monitoring",
      "Private prometheus",
      "Metrics over vpn",
      "Prometheus mTLS",
    ],
    alternates: {
      ...localeAlternates(`/${locale}/prometheus-vpn`),
    },
    openGraph: {
      title: "Prometheus VPN Monitoring 2026: Secure Metrics",
      description: "Collect Prometheus metrics securely over VPN with Tailscale, WireGuard & Zero Trust.",
      type: "article",
      url: `${BASE_URL}/${locale}/prometheus-vpn`,
    },
  };
}

export default async function PrometheusVPNPage({
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
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-red-600 to-pink-700 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-sm mb-4">
              Secure Observability 2026
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Prometheus VPN
            </h1>
            <p className="text-2xl text-orange-100 mb-4">
              {isGerman ? "Sichere Metriken über VPN" : "Secure Metrics Over VPN"}
            </p>
            <p className="text-xl text-white/80 mb-8">
              Tailscale, WireGuard, Zero Trust. Remote Write, Federation & mTLS für private Infrastrukturen.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Remote Write</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Federation</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">mTLS</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Tailscale</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              {isGerman ? "Das Problem: Metriken hinter Firewalls" : "The Problem: Metrics Behind Firewalls"}
            </h2>
            <p className="text-slate-700 text-lg mb-6">
              {isGerman
                ? "Prometheus pull-based Monitoring funktioniert nicht, wenn Targets hinter NAT/Firewalls sind. Lösungen: Reverse Tunnel, VPN oder Push-basiertes Remote Write."
                : "Prometheus pull-based monitoring doesn't work when targets are behind NAT/firewalls. Solutions: Reverse tunnel, VPN, or push-based remote write."}
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-orange-50 border border-orange-700 rounded-xl p-6">
                <h3 className="font-semibold text-orange-900 mb-2">Tailscale</h3>
                <p className="text-sm text-orange-700">Zero Trust Mesh VPN. Einfachste Lösung.</p>
              </div>
              <div className="bg-blue-900 border border-blue-700 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-2">WireGuard</h3>
                <p className="text-sm text-blue-700">Selbst-gehostete VPN. Volle Kontrolle.</p>
              </div>
              <div className="bg-purple-50 border border-purple-700 rounded-xl p-6">
                <h3 className="font-semibold text-purple-900 mb-2">Remote Write</h3>
                <p className="text-sm text-purple-700">Push-basiert zu central Prometheus.</p>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Tailscale + Prometheus</h2>
            
            <div className="bg-slate-900 rounded-xl p-6 mb-6">
              <h3 className="text-white font-semibold mb-4">Prometheus Config (scrape über Tailscale)</h3>
              <pre className="font-mono text-sm text-green-400 overflow-x-auto">
{`global:
  scrape_interval: 15s

scrape_configs:
  # Scraping via Tailscale IPs (100.x.x.x)
  - job_name: 'nodes-tailscale'
    static_configs:
      - targets:
        - '100.64.1.1:9100'  # node-exporter via Tailscale
        - '100.64.1.2:9100'
        - '100.64.2.1:8080'  # app metrics
    relabel_configs:
      - source_labels: [__address__]
        target_label: instance
        regex: '([^:]+):\d+'
        replacement: '${1}'
      
  # Kubernetes über Tailscale
  - job_name: 'k8s-tailscale'
    kubernetes_sd_configs:
      - api_server: 'https://100.64.10.1:6443'
        tls_config:
          ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
        bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
        tls_config:
          server_name: 'kubernetes.default.svc.cluster.local'`}
              </pre>
            </div>

            <div className="bg-slate-900 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Docker Compose mit Tailscale Sidecar</h3>
              <pre className="font-mono text-sm text-green-400 overflow-x-auto">
{`services:
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    networks:
      - monitoring
      
  # Tailscale sidecar für Netzwerkzugriff
  tailscale:
    image: tailscale/tailscale:latest
    environment:
      - TS_AUTHKEY=$TAILSCALE_AUTHKEY
      - TS_USERSPACE=false
      - TS_ACCEPT_DNS=true
    volumes:
      - /var/lib/tailscale:/var/lib/tailscale
    devices:
      - /dev/net/tun:/dev/net/tun
    cap_add:
      - NET_ADMIN
      - NET_RAW
    network_mode: "service:prometheus"  # Shared network`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Remote Write: Push statt Pull</h2>
            
            <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-slate-900 mb-4">Wann Remote Write?</h3>
              <ul className="space-y-2 text-slate-700">
                <li>• Edge/IoT-Geräte ohne öffentliche IP</li>
                <li>• Kunden-Premises (Multi-Tenant)</li>
                <li>• Mobile/Wechselnde Netzwerke</li>
                <li>• Firewall-restrictive Umgebungen</li>
              </ul>
            </div>

            <div className="bg-slate-900 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Prometheus Agent Config (Edge)</h3>
              <pre className="font-mono text-sm text-green-400">
{`# /etc/prometheus/agent.yml
mode: agent

global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'local-metrics'
    static_configs:
      - targets: ['localhost:9100']

remote_write:
  - url: "https://prometheus.central.company.com/api/v1/write"
    tls_config:
      cert_file: /certs/client.crt
      key_file: /certs/client.key
      ca_file: /certs/ca.crt
      server_name: "prometheus.central.company.com"
      insecure_skip_verify: false
    
    # Queue & Retry
    queue_config:
      capacity: 10000
      max_samples_per_send: 2000
      batch_send_deadline: 5s
      
    # Metadata
    metadata_config:
      send: true
      
    # Relabel für Tenant-ID (Multi-Tenant)
    write_relabel_configs:
      - source_labels: [__name__]
        regex: '.*'
        target_label: tenant_id
        replacement: 'customer-abc'`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">mTLS für Prometheus</h2>
            
            <div className="bg-slate-900 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Prometheus mTLS Config</h3>
              <pre className="font-mono text-sm text-green-400">
{`scrape_configs:
  - job_name: 'secure-targets'
    scheme: https
    tls_config:
      # Client certificate for mTLS
      cert_file: /etc/prometheus/certs/client.crt
      key_file: /etc/prometheus/certs/client.key
      
      # Server verification
      ca_file: /etc/prometheus/certs/ca.crt
      server_name: "target.service.internal"
      insecure_skip_verify: false
      
    static_configs:
      - targets: ['target.service.internal:443']

# Alternative: TLS Config per Target
tls_config:
  cert_file: /certs/prometheus.crt
  key_file: /certs/prometheus.key
  ca_file: /certs/ca.crt`}
              </pre>
            </div>
          </section>

          <section className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">VPN Monitoring Setup</h2>
            <p className="mb-6">Implementieren Sie sichere Prometheus-Monitoring über VPN.</p>
            <a href={coreLinks.check} className="inline-block px-6 py-3 bg-white text-orange-400 rounded-lg font-semibold">
              Setup Assessment
            </a>
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
              <a href={`${prefix}/openclaw-security-check`} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">OpenClaw Security Hub</a>
              <a href={`${prefix}/ai-agent-security`} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">AI Agent Security</a>
              <a href={`${prefix}/runbooks/security`} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">Security Runbooks</a>
              <a href={coreLinks.methodology} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">Methodology</a>
            </div>

          </section>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "Prometheus VPN Monitoring 2026",
        author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        datePublished: "2026-03-29",
      })}} />
    </main>
  );
}
