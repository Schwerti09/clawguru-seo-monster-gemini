import Container from "@/components/shared/Container"
import { BASE_URL } from "@/lib/config"
import { headers } from "next/headers"
import { DEFAULT_LOCALE, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import type { Metadata } from "next"

export const dynamic = "force-static"
export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "RabbitMQ Audit & Compliance 2026 | Logging, RBAC & SIEM Integration",
    description: "Vollständige RabbitMQ Audit-Lösung: TLS-Konfiguration, RBAC, Policy-Management, SIEM-Integration. Compliance-ready für SOC2, ISO 27001.",
    keywords: ["rabbitmq audit", "rabbitmq compliance", "rabbitmq logging", "rabbitmq rbac", "message queue security"],
    alternates: buildLocalizedAlternates(DEFAULT_LOCALE, "/solutions/rabbitmq-audit"),
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

  const isDE = locale === 'de'
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: isDE ? 'Wie aktiviere ich Audit-Logging in RabbitMQ?' : 'How do I enable audit logging in RabbitMQ?', acceptedAnswer: { '@type': 'Answer', text: isDE ? 'RabbitMQ Audit-Logging via rabbitmq_event_exchange Plugin: rabbit mq-plugins enable rabbitmq_event_exchange. Events werden an den Exchange amq.rabbitmq.event geroutet. Alle Admin-Aktionen (Queue erstellen/löschen, User erstellen, Policy ändern) werden geloggt. Für Compliance: Events in Elasticsearch oder Splunk weiterleiten.' : 'RabbitMQ audit logging via rabbitmq_event_exchange plugin: rabbitmq-plugins enable rabbitmq_event_exchange. Events are routed to the exchange amq.rabbitmq.event. All admin actions (create/delete queue, create user, change policy) are logged. For compliance: forward events to Elasticsearch or Splunk.' } },
      { '@type': 'Question', name: isDE ? 'Wie konfiguriere ich TLS für RabbitMQ?' : 'How do I configure TLS for RabbitMQ?', acceptedAnswer: { '@type': 'Answer', text: isDE ? 'RabbitMQ TLS-Konfiguration in rabbitmq.conf: ssl_options.cacertfile, ssl_options.certfile, ssl_options.keyfile setzen. AMQPS-Port 5671 statt 5672 aktivieren. Management UI auf Port 15671 mit TLS. Minimum TLS 1.2 erzwingen: ssl_options.versions = [tlsv1.2, tlsv1.3]. Client-Zertifikate für Mutual TLS (mTLS) empfohlen.' : 'RabbitMQ TLS configuration in rabbitmq.conf: set ssl_options.cacertfile, ssl_options.certfile, ssl_options.keyfile. Enable AMQPS port 5671 instead of 5672. Management UI on port 15671 with TLS. Enforce minimum TLS 1.2: ssl_options.versions = [tlsv1.2, tlsv1.3]. Client certificates for mutual TLS (mTLS) recommended.' } },
      { '@type': 'Question', name: isDE ? 'Wie implementiere ich RBAC in RabbitMQ?' : 'How do I implement RBAC in RabbitMQ?', acceptedAnswer: { '@type': 'Answer', text: isDE ? 'RabbitMQ RBAC via Virtual Hosts und User-Tags: Separate VHosts für verschiedene Applikationen/Teams. User-Tags: administrator, monitoring, management, policymaker. Per-VHost Permissions: configure (Queue/Exchange erstellen), write (publish), read (consume). Applikations-User: nur Permissions auf eigenen VHost, keine management-Tag.' : 'RabbitMQ RBAC via virtual hosts and user tags: separate vhosts for different applications/teams. User tags: administrator, monitoring, management, policymaker. Per-vhost permissions: configure (create queue/exchange), write (publish), read (consume). Application users: permissions only on own vhost, no management tag.' } },
      { '@type': 'Question', name: isDE ? 'Wie integriere ich RabbitMQ in ein SIEM für SOC2?' : 'How do I integrate RabbitMQ into a SIEM for SOC2?', acceptedAnswer: { '@type': 'Answer', text: isDE ? 'RabbitMQ SIEM-Integration für SOC2: Filebeat auf RabbitMQ-Knoten für Log-Shipping. rabbitmq_event_exchange Events via Consumer-Service in strukturiertes JSON transformieren. Kritische Events: failed.authentication, user.created, user.deleted, permission.created. Retention: SOC2 fordert 1 Jahr Log-Aufbewahrung. Alerting auf suspicious patterns.' : 'RabbitMQ SIEM integration for SOC2: Filebeat on RabbitMQ nodes for log shipping. Transform rabbitmq_event_exchange events to structured JSON via consumer service. Critical events: failed.authentication, user.created, user.deleted, permission.created. Retention: SOC2 requires 1 year log retention. Alerting on suspicious patterns.' } },
    ],
  }

  return (
    <Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
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

        <h1 className="text-4xl font-black mb-4 text-gray-100">RabbitMQ Audit &amp; Compliance 2026</h1>
        <p className="text-lg text-gray-300 mb-8">Vollständige Audit-Lösung für RabbitMQ: TLS, RBAC, Policy-Management und SIEM-Integration. Compliance-ready für SOC2 und ISO 27001.</p>

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
