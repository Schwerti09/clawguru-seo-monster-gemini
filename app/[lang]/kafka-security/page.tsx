import type { Metadata } from "next";
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n";
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
      ? "Apache Kafka Security 2026 | Enterprise Streaming Platform Security"
      : "Apache Kafka Security 2026 | Enterprise Streaming Platform Security",
    description: locale === "de"
      ? "Umfassender Kafka Security Guide: SSL/TLS, SASL, ACLs, Ranger Integration, Audit Logs, Encryption & Compliance. Enterprise Event Streaming Security."
      : "Comprehensive Kafka security guide: SSL/TLS, SASL, ACLs, Ranger integration, audit logs, encryption & compliance. Enterprise event streaming security.",
    keywords: [
      "Kafka security",
      "Kafka hardening",
      "Apache Kafka SSL",
      "Kafka SASL",
      "Kafka ACL",
      "Kafka authorization",
      "Kafka encryption",
      "Kafka Ranger",
      "Kafka audit",
      "Kafka compliance",
      "Event streaming security",
      "Kafka mTLS",
    ],
    alternates: buildLocalizedAlternates(locale, "/kafka-security"),
    openGraph: {
      images: ["/og-image.png"],
      title: "Apache Kafka Security 2026: Enterprise Streaming Security",
      description: "Comprehensive Kafka security with SSL/TLS, SASL, ACLs, Ranger & audit logging.",
      type: "article",
      url: `${BASE_URL}/${locale}/kafka-security`,
    },
  };
}

export default async function KafkaSecurityPage({
  params,
}: {
  params: { lang: string };
}) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale;
  const prefix = `/${locale}`;
  const coreLinks = getCoreSecurityLinks(locale);
  return (
    <main className="min-h-screen bg-gray-800">
      <section className="relative overflow-hidden bg-gradient-to-br from-cyan-700 via-blue-800 to-indigo-900 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Kafka Security</h1>
            <p className="text-2xl text-cyan-200 mb-4">Enterprise Streaming Security 2026</p>
            <p className="text-xl text-white/80 mb-8">SSL/TLS, SASL, ACLs, Ranger Integration, Audit Logs & Encryption</p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">SSL</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">SASL</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">ACLs</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Ranger</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Kafka Security Architecture</h2>
            <p className="text-gray-200 text-lg mb-6">
              Apache Kafka ist das Rückgrat moderner Event-Driven-Architekturen. Ohne Security ist jeder Topic offen für alle Producer und Consumer. Dieser Guide deckt Transport Encryption, Authentication, Authorization und Audit für Enterprise-Kafka-Cluster ab.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-6">
                <h3 className="font-semibold text-cyan-900 mb-2">Transport Security</h3>
                <ul className="text-sm text-cyan-800 space-y-1">
                  <li>• SSL/TLS für alle Verbindungen</li>
                  <li>• mTLS für Service-Accounts</li>
                  <li>• TLS 1.3 Enforcement</li>
                  <li>• Certificate Rotation</li>
                </ul>
              </div>
              <div className="bg-blue-900 border border-blue-700 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-2">Authentication</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• SASL/SCRAM-SHA-512</li>
                  <li>• SASL/GSSAPI (Kerberos)</li>
                  <li>• SASL/OAUTHBEARER</li>
                  <li>• Certificate-based (mTLS)</li>
                </ul>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                <h3 className="font-semibold text-indigo-900 mb-2">Authorization</h3>
                <ul className="text-sm text-indigo-800 space-y-1">
                  <li>• ACL-basierte Zugriffskontrolle</li>
                  <li>• Ranger Integration</li>
                  <li>• Row-Level Filtering</li>
                  <li>• Column Masking</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Broker SSL/TLS Configuration</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# server.properties - Production SSL Configuration

# TLS 1.3 Only
ssl.protocol=TLSv1.3
ssl.enabled.protocols=TLSv1.3
ssl.cipher.suites=TLS_AES_256_GCM_SHA384,TLS_CHACHA20_POLY1305_SHA256

# Broker Certificate
ssl.keystore.location=/etc/kafka/certs/server.keystore.jks
ssl.keystore.password=$KEYSTORE_PASSWORD
ssl.keystore.type=PKCS12
ssl.key.password=$KEY_PASSWORD

# Truststore for client certificates
ssl.truststore.location=/etc/kafka/certs/server.truststore.jks
ssl.truststore.password=$TRUSTSTORE_PASSWORD
ssl.truststore.type=PKCS12

# Require client certificates (mTLS)
ssl.client.auth=required

# Endpoint Identification (prevent MITM)
ssl.endpoint.identification.algorithm=HTTPS

# Disable insecure renegotiation
ssl.secure.random.implementation=SHA1PRNG

# Listeners with SSL
listeners=SSL://:9093,INTERNAL_SSL://:9094
listener.security.protocol.map=SSL:SSL,INTERNAL_SSL:SSL
inter.broker.listener.name=INTERNAL_SSL

# Alternative: SASL_SSL (for username/password auth)
# listeners=SASL_SSL://:9093
# security.inter.broker.protocol=SASL_SSL`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">SASL/SCRAM Authentication</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# server.properties - SASL Configuration

# Enable SASL mechanisms
sasl.enabled.mechanisms=SCRAM-SHA-512,SCRAM-SHA-256
sasl.mechanism.inter.broker.protocol=SCRAM-SHA-512

# JAAS configuration for broker
listener.name.sasl_ssl.scram-sha-512.sasl.jaas.config=\\
  org.apache.kafka.common.security.scram.ScramLoginModule required \\\n  username="broker-admin" \\\n  password="$BROKER_PASSWORD" \\\n  user_broker-admin="$BROKER_PASSWORD";

# Create SCRAM users via CLI
kafka-configs.sh \\\n  --bootstrap-server kafka-1:9093 \\\n  --command-config admin.properties \\\n  --alter \\\n  --add-config 'SCRAM-SHA-512=[iterations=8192,password=secret]' \\\n  --entity-type users \\\n  --entity-name app-producer

# Consumer user (read-only)
kafka-configs.sh \\\n  --bootstrap-server kafka-1:9093 \\\n  --command-config admin.properties \\\n  --alter \\\n  --add-config 'SCRAM-SHA-512=[password=consumer123]' \\\n  --entity-type users \\\n  --entity-name app-consumer

# JAAS for client (consumer/producer)
cat > consumer.properties << EOF
security.protocol=SASL_SSL
sasl.mechanism=SCRAM-SHA-512
sasl.jaas.config=org.apache.kafka.common.security.scram.ScramLoginModule required \\\n  username="app-consumer" \\\n  password="consumer123";
ssl.truststore.location=/etc/kafka/certs/client.truststore.jks
ssl.truststore.password=$TRUSTSTORE_PASSWORD
EOF`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">ACL-Based Authorization</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# Enable ACLs
# server.properties
authorizer.class.name=kafka.security.authorizer.AclAuthorizer
allow.everyone.if.no.acl.found=false

# Super users (admins)
super.users=User:admin;User:kafka-admin

# ACL Operations

# 1. Allow producer to write to specific topic
kafka-acls.sh \\\n  --bootstrap-server kafka-1:9093 \\\n  --command-config admin.properties \\\n  --add \\\n  --allow-principal User:app-producer \\\n  --operation Write \\\n  --topic orders

# 2. Allow consumer group to read from topic
kafka-acls.sh \\\n  --bootstrap-server kafka-1:9093 \\\n  --command-config admin.properties \\\n  --add \\\n  --allow-principal User:app-consumer \\\n  --operation Read \\\n  --topic orders \\\n  --group order-processors

# 3. Deny specific user access (explicit deny)
kafka-acls.sh \\\n  --bootstrap-server kafka-1:9093 \\\n  --command-config admin.properties \\\n  --add \\\n  --deny-principal User:legacy-app \\\n  --operation All \\\n  --topic sensitive-data

# 4. Allow topic creation (admin only)
kafka-acls.sh \\\n  --bootstrap-server kafka-1:9093 \\\n  --command-config admin.properties \\\n  --add \\\n  --allow-principal User:kafka-admin \\\n  --operation Create \\\n  --topic '*'

# 5. List all ACLs
kafka-acls.sh \\\n  --bootstrap-server kafka-1:9093 \\\n  --command-config admin.properties \\\n  --list`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Apache Ranger Integration</h2>
            <p className="text-gray-200 mb-6">
              Ranger bietet zentrale Policy-Verwaltung für Kafka mit Audit-Logging und feingranularer Zugriffskontrolle.
            </p>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# ranger-kafka-security.xml
<configuration>
  <property>
    <name>ranger.plugin.kafka.service.name</name>
    <value>kafka_production</value>
  </property>
  <property>
    <name>ranger.plugin.kafka.policy.source.impl</name>
    <value>org.apache.ranger.admin.client.RangerAdminJersey2RESTClient</value>
  </property>
  <property>
    <name>ranger.plugin.kafka.policy.rest.url</name>
    <value>http://ranger-admin:6080</value>
  </property>
  <property>
    <name>ranger.plugin.kafka.policy.pollIntervalMs</name>
    <value>30000</value>
  </property>
</configuration>

# Ranger Policy Example (JSON)
{
  "name": "payment-topic-policy",
  "service": "kafka_production",
  "resources": {
    "topic": {
      "values": ["payments", "payment-*"],
      "isExcludes": false,
      "isRecursive": false
    }
  },
  "accesses": [
    {
      "user": "payment-service",
      "accessTypes": ["publish", "consume"],
      "isAllowed": true
    },
    {
      "user": "audit-service",
      "accessTypes": ["consume"],
      "isAllowed": true
    },
    {
      "group": "developers",
      "accessTypes": ["consume"],
      "isAllowed": false  # Explicit deny
    }
  ],
  "rowFilterInfo": {
    "filterExpr": "country='DE'"  # Row-level security
  }
}`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Audit Logging & Monitoring</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# server.properties - Audit Configuration

# Authorizer logging
log4j.logger.kafka.authorizer.logger=INFO, authorizerAppender
log4j.additivity.kafka.authorizer.logger=false

log4j.appender.authorizerAppender=org.apache.log4j.RollingFileAppender
log4j.appender.authorizerAppender.File=/var/log/kafka/authorizer.log
log4j.appender.authorizerAppender.layout=org.apache.log4j.PatternLayout
log4j.appender.authorizerAppender.layout.ConversionPattern=[%d] %p %m (%c)%n

# Log all authorization decisions
authorizer.log.authorization.decisions=true

# OpenTelemetry/Metrics for security monitoring
metric.reporters=org.apache.kafka.common.metrics.JmxReporter,io.opentelemetry.instrumentation.kafkaclients.OpenTelemetryMetricsReporter

# Alert on failed auth (SIEM integration via Filebeat)
# /etc/filebeat/filebeat.yml
filebeat.inputs:
- type: log
  paths:
    - /var/log/kafka/authorizer.log
  multiline.pattern: '^\\['
  multiline.negate: true
  multiline.match: after
  fields:
    service: kafka
    environment: production
  fields_under_root: true
  
processors:
- dissect:
    tokenizer: "[%{timestamp}] %{log_level} %{message} (%{class})"
    field: "message"
    target_prefix: ""
    
- drop_fields:
    when:
      not:
        has_fields: ['message']
    fields: ['message']

output.elasticsearch:
  hosts: ["https://elasticsearch:9200"]
  index: "kafka-security-%{+yyyy.MM.dd}"`}
              </pre>
            </div>
          </section>

          <section className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Kafka Security Assessment</h2>
            <a href={coreLinks.check} className="inline-block px-6 py-3 bg-gray-800 text-cyan-600 rounded-lg font-semibold">Assessment Starten</a>
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
        headline: "Apache Kafka Security 2026",
        author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        datePublished: "2026-03-29",
      })}} />
    </main>
  );
}
