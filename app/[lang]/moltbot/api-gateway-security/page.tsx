import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps { params: { lang: string }; }
const LANGS = ['de','en','es','fr','pt','it','ru','zh','ja','ko','ar','hi','tr','pl','nl'];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'Moltbot API Gateway Security: Kong & Rate Limiting 2024',
    description: 'API Gateway Security für Moltbot mit Kong. Authentication Plugins, Rate Limiting, IP Whitelisting, Request Validation und API Key Management. Production-ready Gateway Konfiguration.',
    keywords: ['moltbot api gateway','kong security','api key management','rate limiting gateway','request validation','api authentication'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'Moltbot API Gateway Security: Kong & Rate Limiting 2024', description: 'API Gateway Security für Moltbot mit Kong.', type: 'article', url: `https://clawguru.org/${lang}/moltbot/api-gateway-security` },
    alternates: { canonical: `https://clawguru.org/${lang}/moltbot/api-gateway-security`, languages: Object.fromEntries(LANGS.map(l => [l, `https://clawguru.org/${l}/moltbot/api-gateway-security`])) },
    robots: 'index, follow',
  };
}

export default function MoltbotApiGatewayPage({ params }: PageProps) {
  const { lang } = params;
  if (!LANGS.includes(lang)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Trust-Anker</strong>: API Gateway Security schützt deine Endpoints. Keine Angriffswerkzeuge.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Moltbot API Gateway Security</h1>
        <p className="text-lg text-gray-300 mb-8">Zentralisierte API-Absicherung für Moltbot — Authentication, Rate Limiting, Request Validation und Threat Detection als Gateway-Layer.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🚪 Kong Gateway Konfiguration</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
            <pre>{`# Kong declarative config (deck) für Moltbot
_format_version: "3.0"

services:
  - name: moltbot-api
    url: http://moltbot:3000
    routes:
      - name: moltbot-api-route
        paths: [/api/v1]
        strip_path: true

plugins:
  # 1. JWT Authentication
  - name: jwt
    service: moltbot-api
    config:
      secret_is_base64: false
      claims_to_verify: [exp, nbf]

  # 2. Rate Limiting (pro Consumer)
  - name: rate-limiting
    service: moltbot-api
    config:
      second: 10
      minute: 100
      hour: 1000
      policy: redis
      redis_host: redis
      redis_port: 6379
      hide_client_headers: false

  # 3. IP Restriction
  - name: ip-restriction
    service: moltbot-api
    config:
      deny: [0.0.0.0/0]  # Alles blockieren außer Whitelist
      allow: [10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16]

  # 4. Request Size Limiting
  - name: request-size-limiting
    service: moltbot-api
    config:
      allowed_payload_size: 1  # 1 MB max
      size_unit: megabytes

  # 5. CORS
  - name: cors
    service: moltbot-api
    config:
      origins: [https://clawguru.org]
      methods: [GET, POST, PUT, DELETE]
      headers: [Authorization, Content-Type]
      credentials: true`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔑 API Key Management</h2>
          <div className="bg-gray-900 text-blue-400 p-4 rounded-lg font-mono text-sm">
            <pre>{`// moltbot/lib/api-key-manager.ts
import crypto from 'crypto';
import { db } from './db';

export async function generateApiKey(customerId: string, name: string, permissions: string[]) {
  const rawKey = crypto.randomBytes(32).toString('hex');
  const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
  const prefix = rawKey.substring(0, 8);

  await db.query(
    'INSERT INTO api_keys (customer_id, name, key_hash, prefix, permissions, created_at) VALUES ($1, $2, $3, $4, $5, NOW())',
    [customerId, name, keyHash, prefix, JSON.stringify(permissions)]
  );

  // Nur einmal zurückgeben (danach nur Hash gespeichert)
  return { key: 'moltbot_' + rawKey, prefix, permissions };
}

export async function validateApiKey(rawKey: string) {
  const keyHash = crypto.createHash('sha256').update(rawKey.replace('moltbot_', '')).digest('hex');
  const result = await db.query(
    'SELECT * FROM api_keys WHERE key_hash = $1 AND revoked_at IS NULL',
    [keyHash]
  );
  return result.rows[0] ?? null;
}`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔗 Weiterführende Ressourcen</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🛡️ Security Check</div><div className="text-sm text-gray-300">API Gateway prüfen</div></a>
            <a href="/runbooks" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">📚 API Runbooks</div><div className="text-sm text-gray-300">Gateway Playbooks</div></a>
            <a href="/openclaw" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🔓 OpenClaw</div><div className="text-sm text-gray-300">API Framework</div></a>
            <a href="/solutions" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🏢 Enterprise</div><div className="text-sm text-gray-300">Managed API Gateway</div></a>
          </div>
        </section>
      </div>
    </div>
  );
}
