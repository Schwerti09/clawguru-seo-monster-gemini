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
      ? "RabbitMQ Security 2026 | Message Broker Hardening Guide"
      : "RabbitMQ Security 2026 | Message Broker Hardening Guide",
    description: locale === "de"
      ? "RabbitMQ Security: TLS, SASL, OAuth 2.0, Management UI, Federation, Shovel & Queue/Levy Limits. Enterprise Messaging Security."
      : "RabbitMQ security: TLS, SASL, OAuth 2.0, management UI, federation, shovel & queue/levy limits. Enterprise messaging security.",
    keywords: [
      "RabbitMQ security",
      "RabbitMQ hardening",
      "RabbitMQ TLS",
      "RabbitMQ OAuth 2.0",
      "RabbitMQ management",
      "RabbitMQ federation",
      "RabbitMQ shovel",
      "RabbitMQ authorization",
      "Message broker security",
      "AMQP security",
    ],
    alternates: {
      ...localeAlternates(`/${locale}/rabbitmq-security`),
    },
    openGraph: {
      title: "RabbitMQ Security 2026: Message Broker Protection",
      description: "Comprehensive RabbitMQ security with TLS, OAuth 2.0, management hardening & federation.",
      type: "article",
      url: `${BASE_URL}/${locale}/rabbitmq-security`,
    },
  };
}

export default async function RabbitMQSecurityPage({
  params,
}: {
  params: { lang: string };
}) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale;
  const prefix = `/${locale}`;
  const coreLinks = getCoreSecurityLinks(locale);
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-orange-700 to-amber-800 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">RabbitMQ Security</h1>
            <p className="text-2xl text-orange-200 mb-4">Message Broker Security 2026</p>
            <p className="text-xl text-white/80 mb-8">TLS, OAuth 2.0, Management UI Security, Federation, Shovel & Resource Limits</p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">TLS 1.3</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">OAuth 2.0</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">mTLS</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Federation</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">RabbitMQ TLS Configuration</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# rabbitmq.conf - TLS 1.3 Only Configuration

# Main listener with TLS
listeners.ssl.default = 5671
ssl_options.cacertfile = /etc/rabbitmq/ssl/ca.crt
ssl_options.certfile   = /etc/rabbitmq/ssl/server.crt
ssl_options.keyfile    = /etc/rabbitmq/ssl/server.key

# TLS 1.3 with modern cipher suites
ssl_options.versions.1 = tlsv1.3
ssl_options.ciphers.1  = TLS_AES_256_GCM_SHA384
ssl_options.ciphers.2  = TLS_CHACHA20_POLY1305_SHA256
ssl_options.ciphers.3  = TLS_AES_128_GCM_SHA256

# Require peer verification (mTLS)
ssl_options.verify     = verify_peer
ssl_options.fail_if_no_peer_cert = true

# Management UI HTTPS
management.ssl.port       = 15671
management.ssl.cacertfile = /etc/rabbitmq/ssl/ca.crt
management.ssl.certfile   = /etc/rabbitmq/ssl/management.crt
management.ssl.keyfile    = /etc/rabbitmq/ssl/management.key

# Clustering (inter-node TLS)
clustering.use_tls = true
clustering.tls.cacertfile = /etc/rabbitmq/ssl/ca.crt
clustering.tls.certfile   = /etc/rabbitmq/ssl/cluster.crt
clustering.tls.keyfile    = /etc/rabbitmq/ssl/cluster.key
clustering.tls.verify     = verify_peer

# Disable non-TLS listeners
listeners.tcp = none`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">OAuth 2.0 / OIDC Integration</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# rabbitmq.conf - OAuth 2.0 Authentication

auth_mechanisms.1 = PLAIN
auth_mechanisms.2 = AMQPLAIN
auth_mechanisms.3 = EXTERNAL

# OAuth 2.0 Backend
auth_backends.1 = oauth2
auth_backends.2 = internal

# OAuth 2.0 Configuration
oauth2.issuer = https://auth.company.com
oauth2.token_endpoint = https://auth.company.com/token
oauth2.jwks_url = https://auth.company.com/.well-known/jwks.json
oauth2.scopes.openid_profile = openid profile

# Resource Server ID (RabbitMQ itself)
oauth2.resource_server_id = rabbitmq-production

# Scope-to-Permission Mapping
oauth2.additional_scopes = rabbitmq.read:*/* rabbitmq.write:*/* rabbitmq.configure:*/*

# Token verification
transport.oauth2.refresh_interval_in_seconds = 300
transport.oauth2.https.verify_peer = true
transport.oauth2.https.fail_if_no_peer_cert = true

# Advanced: Token transformation
oauth2.preferred_username_claims.1 = sub
oauth2.preferred_username_claims.2 = preferred_username
oauth2.preferred_username_claims.3 = email

# JWT Algorithm restrictions
oauth2.signing_keys = RS256 RS384 RS512`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Management UI Security</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# rabbitmq.conf - Management Plugin Security

# Enable management with security restrictions
management.load_definitions = /etc/rabbitmq/definitions.json

# Session timeout (security)
management.session_timeout = 1800  # 30 minutes
management.sample_retention_policies.global.minute = 5
management.sample_retention_policies.global.hour   = 60
management.sample_retention_policies.global.day    = 1200

# CORS restrictions
management.cors.allow_origins.1 = https://rabbitmq-ui.company.com
management.cors.allow_origins.2 = https://internal-admin.company.com
management.cors.allow_credentials = false
management.cors.max_age = 3600

# Path prefix (security through obscurity, not primary defense)
management.path_prefix = /admin/messaging

# Disable HTTP Basic Auth (use OAuth/mTLS only)
management.basic_auth = false

# Enable Prometheus metrics (with auth)
management.prometheus.path = /metrics
management.prometheus.port = 15692

# Strict Content-Type validation
management.content_security_policy = "default-src 'self'; script-src 'self'; object-src 'none';"

# Clickjacking protection
management.clickjacking_protection = true`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Resource Limits & DoS Protection</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# rabbitmq.conf - Resource Limits (Prevent DoS)

# Connection limits per user/virtual host
max_connections = 10000

# Queue limits
max_queues = 5000

# Message size limit (prevent memory exhaustion)
max_message_size = 16777216  # 16 MB

# Queue length limits (overflow handling)
overflow = reject-publish  # or drop-head, dead-letter

# Per-virtual host limits
vhost_limits.vhost1.max_connections = 1000
vhost_limits.vhost1.max_queues = 500

# Disk space thresholds
disk_free_limit.absolute = 2GB

# Memory thresholds
vm_memory_high_watermark.relative = 0.7
vm_memory_high_watermark_paging_ratio = 0.5

# Consumer timeout (detect stuck consumers)
consumer_timeout = 900000  # 15 minutes

# Channel limits per connection
channel_max = 2047

# Frame size limits
frame_max = 131072  # 128 KB

# Heartbeat (detect dead connections)
heartbeat = 60

# TCP buffer sizes (tune for your network)
tcp_listen_options.backlog = 4096
tcp_listen_options.nodelay = true
tcp_listen_options.linger.on = true
tcp_listen_options.linger.timeout = 0
tcp_listen_options.sndbuf = 196608
tcp_listen_options.recbuf = 196608`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Policy-Based Authorization</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# definitions.json - User & Permission Definitions
{
  "users": [
    {
      "name": "app-producer",
      "password_hash": "HASH_HERE",
      "hashing_algorithm": "rabbit_password_hashing_sha256",
      "tags": ""
    },
    {
      "name": "app-consumer",
      "password_hash": "HASH_HERE",
      "hashing_algorithm": "rabbit_password_hashing_sha256",
      "tags": ""
    },
    {
      "name": "monitoring",
      "password_hash": "HASH_HERE",
      "hashing_algorithm": "rabbit_password_hashing_sha256",
      "tags": "monitoring"
    },
    {
      "name": "admin",
      "password_hash": "HASH_HERE",
      "hashing_algorithm": "rabbit_password_hashing_sha256",
      "tags": "administrator"
    }
  ],
  "vhosts": [
    {
      "name": "production"
    },
    {
      "name": "staging"
    }
  ],
  "permissions": [
    {
      "user": "app-producer",
      "vhost": "production",
      "configure": "^$",  # No queue/exchange creation
      "write": "orders\\.exchange|payments\\.exchange",
      "read": "^$"
    },
    {
      "user": "app-consumer",
      "vhost": "production",
      "configure": "^$",
      "write": "^$",
      "read": "orders\\.queue|payments\\.queue"
    },
    {
      "user": "monitoring",
      "vhost": "production",
      "configure": "^$",
      "write": "^$",
      "read": "^$"  # Read-only monitoring
    }
  ],
  "topic_permissions": [
    {
      "user": "app-producer",
      "vhost": "production",
      "exchange": "amq.topic",
      "write": "orders\\..*",
      "read": "^$"
    }
  ]
}`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Federation & Shovel Security</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# rabbitmq.conf - Federation Configuration

# Federation plugin
federation-upstream-set.add = all

# Upstream definition (secure remote cluster)
federation-upstream.upstream1.uri = amqps://federation-user:password@remote-rabbitmq:5671/production
federation-upstream.upstream1.uri = amqps://federation-user:password@remote-rabbitmq-backup:5671/production
federation-upstream.upstream1.expires = 3600000
federation-upstream.upstream1.message-ttl = 300000
federation-upstream.upstream1.prefetch-count = 1000
federation-upstream.upstream1.reconnect-delay = 5
federation-upstream.upstream1.ack-mode = on-confirm
federation-upstream.upstream1.trust-user-id = false  # Security!

# Shovel configuration (one-way bridge)
shovel shovel1.src-uri = amqps://shovel-user:password@source-rabbitmq:5671/
shovel shovel1.src-queue = source-queue
shovel shovel1.dest-uri = amqps://shovel-user:password@dest-rabbitmq:5671/
shovel shovel1.dest-queue = dest-queue
shovel shovel1.prefetch-count = 1000
shovel shovel1.ack-mode = on-confirm
shovel shovel1.reconnect-delay = 5
shovel shovel1.add-forward-headers = false
shovel shovel1.publish-properties.content-type = application/json

# TLS for federation/shovel
ssl_options.verify = verify_peer
ssl_options.cacertfile = /etc/rabbitmq/ssl/ca.crt
ssl_options.certfile = /etc/rabbitmq/ssl/federation.crt
ssl_options.keyfile = /etc/rabbitmq/ssl/federation.key`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Security Best Practices Checklist</h2>
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Network Security</h3>
                  {[
                    "TLS 1.3 enforced (no older versions)",
                    "mTLS for sensitive connections",
                    "Management UI behind VPN/reverse proxy",
                    "Firewall: 5671, 15671 only from known IPs",
                    "Network segmentation (VLANs)",
                    "Disable non-TLS listeners completely",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                      <span className="w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center text-xs text-slate-400">☐</span>
                      <span className="text-slate-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Authentication & Authorization</h3>
                  {[
                    "OAuth 2.0 or LDAP (not default users)",
                    "Principle of least privilege",
                    "Regular password rotation (90 days)",
                    "Separate users per service/app",
                    "No guest user in production",
                    "Topic-level permissions configured",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                      <span className="w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center text-xs text-slate-400">☐</span>
                      <span className="text-slate-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">RabbitMQ Security Assessment</h2>
            <a href={coreLinks.check} className="inline-block px-6 py-3 bg-white text-orange-600 rounded-lg font-semibold">Assessment Starten</a>
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
        headline: "RabbitMQ Security 2026",
        author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        datePublished: "2026-03-29",
      })}} />
    </main>
  );
}
