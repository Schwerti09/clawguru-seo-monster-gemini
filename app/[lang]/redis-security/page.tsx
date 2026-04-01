import type { Metadata } from "next";
import { SUPPORTED_LOCALES, type Locale, localeAlternates } from "@/lib/i18n";
import { BASE_URL } from "@/lib/config";

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
      ? "Redis Security 2026 | Cache & Session Security"
      : "Redis Security 2026 | Cache & Session Security",
    description: locale === "de"
      ? "Redis Security: ACL, TLS, AUTH, Keyspace Notifications, Memory Limits & Persistence Security. Enterprise Cache Hardening."
      : "Redis security: ACL, TLS, AUTH, keyspace notifications, memory limits & persistence security. Enterprise cache hardening.",
    keywords: [
      "Redis security",
      "Redis hardening",
      "Redis ACL",
      "Redis TLS",
      "Redis AUTH",
      "Redis encryption",
      "Cache security",
      "Redis compliance",
      "Redis Sentinel",
      "Redis Cluster",
    ],
    alternates: {
      ...localeAlternates(`/${locale}/redis-security`),
    },
    openGraph: {
      title: "Redis Security 2026: Cache Security",
      description: "Secure Redis with ACL, TLS, AUTH & monitoring.",
      type: "article",
      url: `${BASE_URL}/${locale}/redis-security`,
    },
  };
}

export default async function RedisSecurityPage({
  params,
}: {
  params: { lang: string };
}) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale;
  const prefix = `/${locale}`;
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-orange-700 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Redis Security</h1>
            <p className="text-2xl text-red-200 mb-4">Cache & Session Security 2026</p>
            <p className="text-xl text-white/80 mb-8">ACL, TLS, AUTH, Keyspace Notifications & Memory Protection</p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">ACL</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">TLS</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">AUTH</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Sentinel</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Redis ACL (Access Control)</h2>
            <div className="bg-slate-900 rounded-xl p-6">
              <pre className="font-mono text-sm text-green-400">
{`# redis.conf - ACL Configuration
aclfile /etc/redis/users.acl

# Or inline:
user default on >strong_password ~* &* +@all

# App user: Limited access
user app_user on >app_pass ~app:* resetchannels -@all +@read +@write +@connection +@pubsub

# Monitoring user: Read-only
user monitor on >monitor_pass ~* resetchannels -@all +@read +@connection +info +slowlog

# Admin: Full access but dangerous commands removed
user admin on >admin_pass ~* &* -@dangerous +@all

# Disable default user after setup
user default off`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">TLS/SSL Configuration</h2>
            <div className="bg-slate-900 rounded-xl p-6">
              <pre className="font-mono text-sm text-green-400">
{`# redis.conf - TLS
port 0  # Disable plaintext
tls-port 6379
tls-cert-file /etc/redis/redis.crt
tls-key-file /etc/redis/redis.key
tls-ca-cert-file /etc/redis/ca.crt
tls-dh-params-file /etc/redis/redis.dh

# Require TLS for replication
tls-replication yes

# Require TLS for cluster bus
tls-cluster yes

# Client certificate authentication (mTLS)
tls-auth-clients yes

# Cipher suite
tls-ciphersuites TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256
tls-protocols "TLSv1.3"`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Security Hardening</h2>
            <div className="bg-slate-900 rounded-xl p-6">
              <pre className="font-mono text-sm text-green-400">
{`# redis.conf - Security Settings
requirepass off  # Use ACL instead!

# Rename dangerous commands
rename-command FLUSHDB ""
rename-command FLUSHALL ""
rename-command CONFIG "a_config_b9f2"
rename-command DEBUG ""
rename-command SHUTDOWN "a_shutdown_x7k3"

# Memory limits to prevent DoS
maxmemory 2gb
maxmemory-policy allkeys-lru

# Disable THP (Transparent Huge Pages)
# echo never > /sys/kernel/mm/transparent_hugepage/enabled

# Keyspace notifications for audit
notify-keyspace-events Ex$`}
              </pre>
            </div>
          </section>

          <section className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Redis Security Assessment</h2>
            <a href={`${prefix}/check`} className="inline-block px-6 py-3 bg-white text-red-600 rounded-lg font-semibold">Assessment Starten</a>
          </section>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "Redis Security 2026",
        author: { "@type": "Organization", name: "ClawGuru" },
        datePublished: "2026-03-29",
      })}} />
    </main>
  );
}
