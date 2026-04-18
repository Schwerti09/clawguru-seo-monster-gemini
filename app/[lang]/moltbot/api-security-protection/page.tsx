import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'
import DirectAnswerBox from '@/components/DirectAnswerBox'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'Moltbot API Security: REST Endpoints Absichern 2024',
    description: 'Komplette API Security für Moltbot REST Endpoints. Authentication, Rate Limiting, Input Validation, JWT Hardening und DDoS-Schutz mit konkreten Code-Beispielen.',
    keywords: ['moltbot api security','rest endpoint protection','api hardening','rate limiting','input validation','api authentication'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'Moltbot API Security: REST Endpoints Absichern 2024', description: 'Komplette API Security für Moltbot REST Endpoints.', type: 'article', url: `https://clawguru.org/${lang}/moltbot/api-security-protection`, images: ['/og-moltbot-api-security.jpg'] },
    alternates: buildLocalizedAlternates(lang as Locale, '/moltbot/api-security-protection'),
    robots: 'index, follow',
  };
}

export default function MoltbotApiSecurityPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Trust-Anker</strong>: Dieser Guide dient ausschließlich zur Absicherung von API-Endpoints. Keine Angriffswerkzeuge, keine illegalen Aktivitäten.
        </div>
        <DirectAnswerBox
          question="Was ist API Security Protection?"
          answer="API Security Protection umfasst die Absicherung von REST Endpoints durch JWT Hardening, Rate Limiting, Input Validation und DDoS-Schutz. Es schützt API-gesteuerte Systeme vor unautorisiertem Zugriff und Missbrauch durch mehrschichtige Sicherheitskontrollen."
          fact="70% aller API-Sicherheitsvorfälle resultieren aus fehlender Authentifizierung oder Rate Limiting."
        />
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Moltbot API Security: REST Endpoints Protection</h1>
        <p className="text-lg text-gray-300 mb-8">Vollständige API Security für Moltbot — von JWT-Hardening über Rate Limiting bis hin zu Input Validation und DDoS-Schutz.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔐 JWT Authentication Hardening</h2>
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">⚡ Rate Limiting mit Redis</h2>
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🛡️ Input Validation Schema</h2>
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔗 Weiterführende Ressourcen</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700">
              <div className="font-semibold text-cyan-400">🛡️ Security Check</div>
              <div className="text-sm text-gray-300">API live testen</div>
            </a>
            <a href="/runbooks" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700">
              <div className="font-semibold text-cyan-400">📚 Runbooks</div>
              <div className="text-sm text-gray-300">API Security Playbooks</div>
            </a>
            <a href="/openclaw" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700">
              <div className="font-semibold text-cyan-400">🔓 OpenClaw</div>
              <div className="text-sm text-gray-300">Open Source Framework</div>
            </a>
            <a href="/neuro" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700">
              <div className="font-semibold text-cyan-400">🧠 Neuro AI</div>
              <div className="text-sm text-gray-300">AI Threat Detection</div>
            </a>
          </div>
        </section>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Was ist Moltbot Security?", acceptedAnswer: { "@type": "Answer", text: "Moltbot ist eine Security-Automation-Plattform mit 600+ Executable Runbooks, Live-Score und Compliance-Dashboard f&#xFC;r Self-Hosting-Infrastrukturen." } },
              { "@type": "Question", name: "Ist dieser Guide ein Penetrationstest?", acceptedAnswer: { "@type": "Answer", text: "Nein. Dieser Guide dient ausschlie&#xDF;lich zur Absicherung eigener Systeme. Kein Angriffs-Tool, keine illegalen Aktivit&#xE4;ten." } },
              { "@type": "Question", name: "Wo finde ich zugeh&#xF6;rige Runbooks?", acceptedAnswer: { "@type": "Answer", text: "Alle Runbooks sind unter /runbooks abrufbar. Jeder Befund im Security-Check enth&#xE4;lt einen direkten Link zum passenden Runbook." } }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Moltbot Security Guide",
            description: "Executable Security Runbooks und Hardening-Guides f&#xFC;r Moltbot-Infrastrukturen.",
            url: "https://clawguru.org/de/moltbot/api-security-protection"
          }
        ]) }} />
      </div>
    </div>
  );
}
