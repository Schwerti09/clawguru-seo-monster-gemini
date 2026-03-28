import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import { BASE_URL } from "@/lib/config"
import { headers } from "next/headers"
import { DEFAULT_LOCALE, type Locale, localeAlternates } from "@/lib/i18n"
import type { Metadata } from "next"

export const dynamic = "force-static"
export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  const alts = localeAlternates("/solutions/rabbitmq-audit")
  return {
    title: "RabbitMQ Audit & Compliance 2026 | Logging, RBAC & SIEM Integration",
    description: "Vollständige RabbitMQ Audit-Lösung: TLS-Konfiguration, RBAC, Policy-Management, SIEM-Integration. Compliance-ready für SOC2, ISO 27001.",
    keywords: ["rabbitmq audit", "rabbitmq compliance", "rabbitmq logging", "rabbitmq rbac", "message queue security"],
    alternates: alts,
    openGraph: {
      title: "RabbitMQ Audit & Compliance Guide 2026",
      description: "Audit-Logging und Compliance für RabbitMQ-Cluster",
      type: "article",
    },
  }
}

export default async function RabbitMQAuditPage() {
  const h = headers()
  const locale = (h.get("x-claw-locale") ?? DEFAULT_LOCALE) as Locale
  const prefix = `/${locale}`

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "RabbitMQ Audit & Compliance Guide 2026",
    url: `${BASE_URL}${prefix}/solutions/rabbitmq-audit`,
    datePublished: "2026-03-28",
    author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${BASE_URL}${prefix}` },
      { "@type": "ListItem", position: 2, name: "Solutions", item: `${BASE_URL}${prefix}/solutions` },
      { "@type": "ListItem", position: 3, name: "RabbitMQ Audit", item: `${BASE_URL}${prefix}/solutions/rabbitmq-audit` },
    ],
  }

  return (
    <Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="py-16 max-w-4xl mx-auto">
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li><a href={prefix} className="hover:text-cyan-400">ClawGuru</a></li>
            <li>/</li>
            <li><a href={`${prefix}/solutions`} className="hover:text-cyan-400">Solutions</a></li>
            <li>/</li>
            <li className="text-gray-300">RabbitMQ Audit</li>
          </ol>
        </nav>

        <SectionTitle
          kicker="Message Queue Security"
          title="RabbitMQ Audit & Compliance 2026"
          subtitle="Vollständige Audit-Lösung für RabbitMQ: TLS, RBAC, Policy-Management und SIEM-Integration. Compliance-ready für SOC2 und ISO 27001."
        />

        <div className="mt-12 space-y-12">
          <section>
            <h2 className="text-2xl font-black text-white mb-4">RabbitMQ Audit-Grundlagen</h2>
            <p className="text-gray-300 mb-4">
              RabbitMQ ist das Rückgrat vieler verteilter Systeme. Audit-Logging und Zugriffskontrolle 
              sind essentiell für Compliance und Security-Monitoring.
            </p>
            <div className="p-6 rounded-3xl border border-gray-800 bg-black/25">
              <h3 className="text-xl font-bold text-white mb-3">1. TLS & Client-Auth</h3>
              <pre className="mt-4 rounded-2xl border border-gray-800 bg-black/40 p-4 overflow-x-auto text-sm text-gray-300">
{`# rabbitmq.conf - TLS Konfiguration
listeners.ssl.default = 5671
ssl_options.cacertfile = /etc/rabbitmq/ssl/ca.crt
ssl_options.certfile = /etc/rabbitmq/ssl/server.crt
ssl_options.keyfile = /etc/rabbitmq/ssl/server.key
ssl_options.verify = verify_peer
ssl_options.fail_if_no_peer_cert = true

# TLS 1.3 only
ssl_options.versions.1 = tlsv1.3
ssl_options.ciphers.1 = TLS_AES_256_GCM_SHA384`}
              </pre>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">Audit-Logging aktivieren</h2>
            <div className="p-6 rounded-3xl border border-gray-800 bg-black/25">
              <h3 className="text-xl font-bold text-white mb-3">JSON-Logging für SIEM</h3>
              <pre className="mt-4 rounded-2xl border border-gray-800 bg-black/40 p-4 overflow-x-auto text-sm text-gray-300">
{`# rabbitmq.conf - Audit Logging
log.file.level = info
log.file.formatter = json
log.file.rotation.size = 104857600
log.file.rotation.count = 5

# Connection/Channel Events loggen
log.connection.level = info
log.channel.level = info

# Queue/Exchange Events
log.queue.level = info
log.exchange.level = info`}
              </pre>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">RBAC & Policy Management</h2>
            <div className="p-6 rounded-3xl border border-gray-800 bg-black/25">
              <ul className="space-y-3 text-gray-300">
                <li>• <strong>Prinzip der minimalen Rechte:</strong> Jeder User nur notwendige Permissions</li>
                <li>• <strong>Virtual Hosts:</strong> Segmentierung nach Teams/Environments</li>
                <li>• <strong>Topic Permissions:</strong> Feingranulare Publish/Subscribe-Kontrolle</li>
                <li>• <strong>Federation/Shovel:</strong> Cross-Cluster-Replication mit Auth</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">SIEM Integration</h2>
            <div className="p-6 rounded-3xl border border-gray-800 bg-black/25">
              <p className="text-gray-300 mb-4">
                RabbitMQ-Logs in Elasticsearch, Splunk oder Datadog für zentrale Monitoring und Alerting.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>• Filebeat/Fluentd für Log-Shipment</li>
                <li>• Dashboards für Queue-Depth, Connection-Rates</li>
                <li>• Alerting bei Failed Auth Attempts</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </Container>
  )
}
