import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps { params: { lang: string }; }
const LANGS = ['de','en','es','fr','pt','it','ru','zh','ja','ko','ar','hi','tr','pl','nl'];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'Moltbot API Security: REST Endpoints Absichern 2024',
    description: 'Komplette API Security für Moltbot REST Endpoints. Authentication, Rate Limiting, Input Validation, JWT Hardening und DDoS-Schutz mit konkreten Code-Beispielen.',
    keywords: ['moltbot api security','rest endpoint protection','api hardening','rate limiting','input validation','api authentication'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'Moltbot API Security: REST Endpoints Absichern 2024', description: 'Komplette API Security für Moltbot REST Endpoints.', type: 'article', url: `https://clawguru.org/${lang}/moltbot/api-security-protection`, images: ['/og-moltbot-api-security.jpg'] },
    alternates: { canonical: `https://clawguru.org/${lang}/moltbot/api-security-protection`, languages: { de: 'https://clawguru.org/de/moltbot/api-security-protection', en: 'https://clawguru.org/en/moltbot/api-security-protection', es: 'https://clawguru.org/es/moltbot/api-security-protection', fr: 'https://clawguru.org/fr/moltbot/api-security-protection', pt: 'https://clawguru.org/pt/moltbot/api-security-protection', it: 'https://clawguru.org/it/moltbot/api-security-protection', ru: 'https://clawguru.org/ru/moltbot/api-security-protection', zh: 'https://clawguru.org/zh/moltbot/api-security-protection', ja: 'https://clawguru.org/ja/moltbot/api-security-protection', ko: 'https://clawguru.org/ko/moltbot/api-security-protection', ar: 'https://clawguru.org/ar/moltbot/api-security-protection', hi: 'https://clawguru.org/hi/moltbot/api-security-protection', tr: 'https://clawguru.org/tr/moltbot/api-security-protection', pl: 'https://clawguru.org/pl/moltbot/api-security-protection', nl: 'https://clawguru.org/nl/moltbot/api-security-protection' } },
    robots: 'index, follow',
  };
}

export default function MoltbotApiSecurityPage({ params }: PageProps) {
  const { lang } = params;
  if (!LANGS.includes(lang)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-sm">
          <strong>"Not a Pentest" Trust-Anker</strong>: Dieser Guide dient ausschließlich zur Absicherung von API-Endpoints. Keine Angriffswerkzeuge, keine illegalen Aktivitäten.
        </div>
        <h1 className="text-4xl font-bold mb-4">Moltbot API Security: REST Endpoints Protection</h1>
        <p className="text-lg text-gray-600 mb-8">Vollständige API Security für Moltbot — von JWT-Hardening über Rate Limiting bis hin zu Input Validation und DDoS-Schutz.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">🔐 JWT Authentication Hardening</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-4">
            <pre>{`// moltbot/middleware/jwt-auth.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, JWTPayload } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function verifyJWT(req: NextRequest): Promise<JWTPayload | null> {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: 'clawguru-moltbot',
      audience: 'moltbot-api',
      algorithms: ['HS256'],
    });
    return payload;
  } catch {
    return null;
  }
}`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">⚡ Rate Limiting mit Redis</h2>
          <div className="bg-gray-900 text-blue-400 p-4 rounded-lg font-mono text-sm mb-4">
            <pre>{`// moltbot/middleware/rate-limit.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function rateLimit(ip: string, limit = 100, window = 60) {
  const key = \`rl:\${ip}\`;
  const current = await redis.incr(key);
  if (current === 1) await redis.expire(key, window);
  return { allowed: current <= limit, remaining: Math.max(0, limit - current) };
}`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">🛡️ Input Validation Schema</h2>
          <div className="bg-gray-900 text-yellow-400 p-4 rounded-lg font-mono text-sm mb-4">
            <pre>{`// moltbot/lib/validation.ts
import { z } from 'zod';

export const MoltbotRequestSchema = z.object({
  target: z.string().url('Muss eine gültige URL sein').max(2048),
  action: z.enum(['check', 'scan', 'audit']),
  options: z.object({
    depth: z.number().int().min(1).max(5).default(2),
    timeout: z.number().int().min(1000).max(30000).default(5000),
  }).optional(),
});

export type MoltbotRequest = z.infer<typeof MoltbotRequestSchema>;`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">🔗 Weiterführende Ressourcen</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100">
              <div className="font-semibold text-blue-600">🛡️ Security Check</div>
              <div className="text-sm text-gray-600">API live testen</div>
            </a>
            <a href="/runbooks" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100">
              <div className="font-semibold text-blue-600">📚 Runbooks</div>
              <div className="text-sm text-gray-600">API Security Playbooks</div>
            </a>
            <a href="/openclaw" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100">
              <div className="font-semibold text-blue-600">🔓 OpenClaw</div>
              <div className="text-sm text-gray-600">Open Source Framework</div>
            </a>
            <a href="/neuro" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100">
              <div className="font-semibold text-blue-600">🧠 Neuro AI</div>
              <div className="text-sm text-gray-600">AI Threat Detection</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
