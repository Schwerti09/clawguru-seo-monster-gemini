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
    title: "Moltbot Authentication: OAuth2 & JWT Setup",
    description:
      "Sichere Authentication mit OAuth2 und JWT Integration für Moltbot. Complete Authentication Setup mit Multi-Factor Auth und Session Management.",
    keywords: [
      "moltbot authentication",
      "oauth2 jwt setup",
      "multi-factor authentication",
      "session management",
      "jwt security",
      "oauth2 integration",
    ],
    alternates: {
      ...localeAlternates(`/${locale}/moltbot/authentication-oauth2-jwt`),
    },
    openGraph: {
      title: "Moltbot Authentication: OAuth2 & JWT Setup",
      description:
        "Sichere Authentication mit OAuth2 und JWT Integration für Moltbot.",
      type: "article",
      url: `${BASE_URL}/${locale}/moltbot/authentication-oauth2-jwt`,
    },
  };
}

export default async function MoltbotAuthenticationPage({
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
              Authentication Security 2024
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              OAuth2 &amp; JWT Setup
            </h1>
            <p className="text-2xl text-blue-200 mb-4">
              Moltbot Authentication Guide
            </p>
            <p className="text-xl text-white/80 mb-8">
              Zero Trust Authentication, Defense in Depth, Secure by Default, Privacy by Design – enterprise-grade Security.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">OAuth2</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">JWT</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">MFA</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Session Mgmt</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-12">
            <p className="text-amber-900 font-semibold">
              🛡️ &quot;Not a Pentest&quot; Trust-Anker: Dieser Guide dient ausschließlich zur Implementierung von Authentication Systemen. Keine Angriffswerkzeuge, keine illegalen Aktivitäten.
            </p>
          </div>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🎯 Executive Summary</h2>
            <p className="text-slate-700 text-lg mb-6">
              Die <strong>Moltbot Authentication</strong> stellt einen umfassenden, modernen Ansatz für Benutzerauthentifizierung dar. Mit OAuth2 Integration, JWT Token Management und Multi-Factor Authentication bietet sie enterprise-grade Security bei gleichzeitig exzellenter User Experience.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🏗️ Authentication Architecture</h2>
            <p className="text-slate-700 text-lg mb-6">
              Mehrschichtige Authentication mit Identity Provider, Token Service, Session Manager und Access Control Layer.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🔐 OAuth2 Integration</h2>
            <div className="bg-slate-900 rounded-xl p-6 mb-6">
              <h4 className="text-white font-semibold mb-4">OAuth2 Configuration</h4>
              <pre className="font-mono text-sm text-green-400 overflow-x-auto">
{`// OAuth2 Provider Configuration
const oauth2Config = {
  providers: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      scopes: ['openid', 'profile', 'email'],
      authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scopes: ['read:user', 'user:email'],
      authorizationUrl: 'https://github.com/login/oauth/authorize',
      tokenUrl: 'https://github.com/login/oauth/access_token',
    },
  },
  session: {
    maxAge: 3600,       // 1 hour
    refreshWindow: 300,  // 5 minutes before expiry
  },
};`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🎫 JWT Token Management</h2>
            <div className="bg-slate-900 rounded-xl p-6 mb-6">
              <h4 className="text-white font-semibold mb-4">JWT Service</h4>
              <pre className="font-mono text-sm text-green-400 overflow-x-auto">
{`import jwt from 'jsonwebtoken';

interface JWTPayload {
  sub: string;
  email: string;
  roles: string[];
  iat: number;
  exp: number;
}

class JWTService {
  private readonly secret: string;
  private readonly accessTokenTTL = '15m';
  private readonly refreshTokenTTL = '7d';

  generateAccessToken(user: User): string {
    return jwt.sign(
      { sub: user.id, email: user.email, roles: user.roles },
      this.secret,
      { expiresIn: this.accessTokenTTL, algorithm: 'RS256' }
    );
  }

  verifyToken(token: string): JWTPayload {
    return jwt.verify(token, this.secret) as JWTPayload;
  }
}`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🛡️ Multi-Factor Authentication</h2>
            <p className="text-slate-700 text-lg mb-6">
              TOTP (Time-based One-Time Password), SMS Verification, Email Codes und Hardware Security Keys (FIDO2/WebAuthn) für maximale Account-Sicherheit.
            </p>
            <div className="bg-slate-900 rounded-xl p-6 mb-6">
              <h4 className="text-white font-semibold mb-4">TOTP Setup</h4>
              <pre className="font-mono text-sm text-green-400 overflow-x-auto">
{`import speakeasy from 'speakeasy';

// Generate TOTP secret
const secret = speakeasy.generateSecret({
  name: 'Moltbot Security',
  issuer: 'ClawGuru',
  length: 32,
});

// Verify TOTP token
const isValid = speakeasy.totp.verify({
  secret: secret.base32,
  encoding: 'base32',
  token: userToken,
  window: 1,
});`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">📱 Session Management</h2>
            <p className="text-slate-700 text-lg mb-6">
              Secure Session Storage, Session Rotation, Concurrent Session Control und Session Fixation Protection.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🔍 Authentication Middleware</h2>
            <p className="text-slate-700 text-lg mb-6">
              Request Authentication, Token Validation, Permission Checking und Audit Logging als zentrale Middleware-Schicht.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">📋 Implementation Guide</h2>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <ul className="space-y-2 text-slate-700">
                <li>✅ OAuth2 Provider konfiguriert</li>
                <li>✅ JWT Token Management implementiert</li>
                <li>✅ Multi-Factor Authentication aktiv</li>
                <li>✅ Session Management gehärtet</li>
                <li>✅ Authentication Middleware aktiv</li>
                <li>✅ CSRF Protection</li>
                <li>✅ Token Rotation implementiert</li>
                <li>✅ Audit Logging für Auth Events</li>
              </ul>
            </div>
          </section>

          <section className="bg-gradient-to-r from-blue-700 to-indigo-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Authentication Security Assessment</h2>
            <p className="mb-6">Validieren Sie Ihre Authentication-Konfiguration mit unserem automatisierten Check.</p>
            <a href={coreLinks.check} className="inline-block px-6 py-3 bg-white text-blue-700 rounded-lg font-semibold">
              Security Assessment starten
            </a>
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
              <a href={`${prefix}/moltbot/security-framework`} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">Security Framework</a>
              <a href={`${prefix}/moltbot/api-security-protection`} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">API Security</a>
              <a href={`${prefix}/runbooks/security`} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">Security Runbooks</a>
              <a href={coreLinks.methodology} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">Methodology</a>
            </div>
          </section>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "Moltbot Authentication: OAuth2 & JWT Setup",
        author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        datePublished: "2024-04-06",
      })}} />
    </main>
  );
}
