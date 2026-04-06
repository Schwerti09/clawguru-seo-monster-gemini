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
    title: "Moltbot API Security: REST Endpoints Protection",
    description:
      "API Security Best Practices und Endpoint Hardening für Moltbot REST APIs. Complete API Protection mit Authentication, Rate Limiting und Input Validation.",
    keywords: [
      "moltbot api security",
      "rest endpoint protection",
      "api hardening",
      "rate limiting",
      "input validation",
      "api authentication",
    ],
    alternates: {
      ...localeAlternates(`/${locale}/moltbot/api-security-protection`),
    },
    openGraph: {
      title: "Moltbot API Security: REST Endpoints Protection",
      description:
        "API Security Best Practices und Endpoint Hardening für Moltbot REST APIs.",
      type: "article",
      url: `${BASE_URL}/${locale}/moltbot/api-security-protection`,
    },
  };
}

export default async function MoltbotApiSecurityPage({
  params,
}: {
  params: { lang: string };
}) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale)
    ? params.lang
    : "de") as Locale;
  const prefix = `/${locale}`;
  const coreLinks = getCoreSecurityLinks(locale);

  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-sm mb-4">
              API Security 2024
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              API Security &amp; Protection
            </h1>
            <p className="text-2xl text-blue-200 mb-4">
              REST Endpoints Hardening
            </p>
            <p className="text-xl text-white/80 mb-8">
              Defense in Depth, Zero Trust, Principle of Least Privilege, Secure by Default – vollständige API-Absicherung.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Auth</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Rate Limiting</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Validation</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Headers</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-12">
            <p className="text-amber-900 font-semibold">
              🛡️ &quot;Not a Pentest&quot; Trust-Anker: Dieser Guide dient ausschließlich zur Absicherung von REST APIs. Keine Angriffswerkzeuge, keine illegalen Aktivitäten.
            </p>
          </div>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🎯 Executive Summary</h2>
            <p className="text-slate-700 text-lg mb-6">
              Die <strong>Moltbot API Security</strong> stellt einen umfassenden Ansatz für die Absicherung von REST Endpoints dar. In einer Zeit, in der APIs die primäre Angriffsfläche für moderne Anwendungen sind, ist robuste API Security überlebenswichtig.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🏗️ API Security Architecture</h2>
            <p className="text-slate-700 text-lg mb-6">
              Mehrschichtige API Security mit API Gateway, Authentication Layer, Rate Limiter, Input Validator, Business Logic und Audit Layer.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🔐 Authentication &amp; Authorization</h2>
            <div className="bg-slate-900 rounded-xl p-6 mb-6">
              <h4 className="text-white font-semibold mb-4">API Authentication Middleware</h4>
              <pre className="font-mono text-sm text-green-400 overflow-x-auto">
{`import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

interface AuthConfig {
  publicRoutes: string[];
  rateLimits: Record<string, number>;
}

async function authenticateRequest(req: NextRequest, config: AuthConfig) {
  const path = req.nextUrl.pathname;

  // Skip auth for public routes
  if (config.publicRoutes.some(r => path.startsWith(r))) {
    return NextResponse.next();
  }

  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Missing or invalid authorization header' },
      { status: 401 }
    );
  }

  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    // Attach user to request context
    const response = NextResponse.next();
    response.headers.set('x-user-id', (payload as any).sub);
    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🚦 Rate Limiting &amp; DDoS Protection</h2>
            <div className="bg-slate-900 rounded-xl p-6 mb-6">
              <h4 className="text-white font-semibold mb-4">Sliding Window Rate Limiter</h4>
              <pre className="font-mono text-sm text-green-400 overflow-x-auto">
{`class SlidingWindowRateLimiter {
  private windows: Map<string, number[]> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(clientId: string): boolean {
    const now = Date.now();
    const timestamps = this.windows.get(clientId) || [];

    // Remove expired entries
    const valid = timestamps.filter(t => now - t < this.windowMs);

    if (valid.length >= this.maxRequests) {
      return false;
    }

    valid.push(now);
    this.windows.set(clientId, valid);
    return true;
  }
}`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🔍 Input Validation &amp; Sanitization</h2>
            <div className="bg-slate-900 rounded-xl p-6 mb-6">
              <h4 className="text-white font-semibold mb-4">Zod Schema Validation</h4>
              <pre className="font-mono text-sm text-green-400 overflow-x-auto">
{`import { z } from 'zod';

const UserCreateSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().min(2).max(100).regex(/^[a-zA-Z\\s]+$/),
  password: z.string().min(12).max(128)
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[a-z]/, 'Must contain lowercase')
    .regex(/[0-9]/, 'Must contain number')
    .regex(/[^a-zA-Z0-9]/, 'Must contain special char'),
  role: z.enum(['viewer', 'operator', 'admin']),
});

// Validate and sanitize
function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🛡️ API Security Headers</h2>
            <div className="bg-slate-900 rounded-xl p-6 mb-6">
              <h4 className="text-white font-semibold mb-4">Security Headers Configuration</h4>
              <pre className="font-mono text-sm text-green-400 overflow-x-auto">
{`const securityHeaders = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self'",
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'X-Request-Id': crypto.randomUUID(),
};`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🔍 API Monitoring &amp; Logging</h2>
            <p className="text-slate-700 text-lg mb-6">
              Structured Logging, Request Tracing, Performance Metrics, Error Tracking und Security Event Monitoring für vollständige API Observability.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">📋 Implementation Guide</h2>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <ul className="space-y-2 text-slate-700">
                <li>✅ JWT/OAuth2 Authentication</li>
                <li>✅ Sliding Window Rate Limiting</li>
                <li>✅ Zod Input Validation</li>
                <li>✅ Security Headers konfiguriert</li>
                <li>✅ CORS Policy</li>
                <li>✅ API Monitoring &amp; Logging</li>
                <li>✅ DDoS Protection</li>
                <li>✅ Request Tracing</li>
              </ul>
            </div>
          </section>

          <section className="bg-gradient-to-r from-blue-700 to-indigo-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">API Security Assessment</h2>
            <p className="mb-6">Validieren Sie Ihre API-Konfiguration mit unserem automatisierten Check.</p>
            <a href={coreLinks.check} className="inline-block px-6 py-3 bg-white text-blue-700 rounded-lg font-semibold">
              Security Assessment starten
            </a>
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
              <a href={`${prefix}/moltbot/authentication-oauth2-jwt`} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">Authentication Guide</a>
              <a href={`${prefix}/moltbot/security-framework`} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">Security Framework</a>
              <a href={`${prefix}/runbooks/security`} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">Security Runbooks</a>
              <a href={coreLinks.methodology} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">Methodology</a>
            </div>
          </section>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "Moltbot API Security: REST Endpoints Protection",
        author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        datePublished: "2024-04-06",
      })}} />
    </main>
  );
}
