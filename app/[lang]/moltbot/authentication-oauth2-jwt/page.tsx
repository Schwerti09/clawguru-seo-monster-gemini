import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'Moltbot Authentication: OAuth2 & JWT Setup Guide 2024',
    description: 'Sichere Authentication mit OAuth2 und JWT für Moltbot. MFA, Session Management, Token Rotation und PKCE Flow – mit vollständigen TypeScript-Implementierungsbeispielen.',
    keywords: ['moltbot authentication','oauth2 jwt','mfa setup','session management','jwt security','oauth2 pkce'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'Moltbot Authentication: OAuth2 & JWT Setup Guide 2024', description: 'Sichere Authentication mit OAuth2 und JWT für Moltbot.', type: 'article', url: `https://clawguru.org/${lang}/moltbot/authentication-oauth2-jwt`, images: ['/og-moltbot-auth.jpg'] },
    alternates: buildLocalizedAlternates(lang as Locale, '/moltbot/authentication-oauth2-jwt'),
    robots: 'index, follow',
  };
}

export default function MoltbotAuthPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Trust-Anker</strong>: Dieser Guide dient ausschließlich zur Implementierung sicherer Authentication-Systeme. Keine Angriffswerkzeuge.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Moltbot Authentication: OAuth2 &amp; JWT Setup</h1>
        <p className="text-lg text-gray-300 mb-8">Production-ready Authentication für Moltbot mit OAuth2 PKCE Flow, JWT Token Rotation, MFA und sicherem Session Management.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔐 OAuth2 PKCE Flow</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-4">
            <pre>{`// moltbot/lib/oauth2.ts
import crypto from 'crypto';

export function generatePKCEChallenge() {
  const verifier = crypto.randomBytes(32).toString('base64url');
  const challenge = crypto
    .createHash('sha256')
    .update(verifier)
    .digest('base64url');
  return { verifier, challenge };
}

export function buildAuthorizationURL(challenge: string) {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.OAUTH2_CLIENT_ID!,
    redirect_uri: process.env.OAUTH2_REDIRECT_URI!,
    scope: 'openid profile email',
    code_challenge: challenge,
    code_challenge_method: 'S256',
    state: crypto.randomBytes(16).toString('hex'),
  });
  return \`\${process.env.OAUTH2_AUTH_URL}?\${params}\`;
}`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔄 JWT Token Rotation</h2>
          <div className="bg-gray-900 text-blue-400 p-4 rounded-lg font-mono text-sm mb-4">
            <pre>{`// moltbot/lib/token-rotation.ts
import { SignJWT, jwtVerify } from 'jose';

const ACCESS_SECRET = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);
const REFRESH_SECRET = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET!);

export async function issueTokenPair(userId: string) {
  const accessToken = await new SignJWT({ sub: userId, type: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')  // Short-lived access token
    .setIssuer('clawguru-moltbot')
    .sign(ACCESS_SECRET);

  const refreshToken = await new SignJWT({ sub: userId, type: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')   // Longer-lived refresh token
    .setIssuer('clawguru-moltbot')
    .sign(REFRESH_SECRET);

  return { accessToken, refreshToken };
}`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">📱 TOTP Multi-Factor Authentication</h2>
          <div className="bg-gray-900 text-yellow-400 p-4 rounded-lg font-mono text-sm mb-4">
            <pre>{`// moltbot/lib/mfa.ts
import { authenticator } from 'otplib';
import QRCode from 'qrcode';

authenticator.options = { step: 30, window: 1 };

export function generateMFASecret(userEmail: string) {
  const secret = authenticator.generateSecret(32);
  const otpauth = authenticator.keyuri(userEmail, 'ClawGuru Moltbot', secret);
  return { secret, otpauth };
}

export async function generateQRCode(otpauth: string): Promise<string> {
  return QRCode.toDataURL(otpauth);
}

export function verifyMFAToken(token: string, secret: string): boolean {
  return authenticator.verify({ token, secret });
}`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔗 Weiterführende Ressourcen</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700">
              <div className="font-semibold text-cyan-400">🛡️ Security Check</div>
              <div className="text-sm text-gray-300">Auth-Setup live prüfen</div>
            </a>
            <a href="/runbooks" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700">
              <div className="font-semibold text-cyan-400">📚 Auth Runbooks</div>
              <div className="text-sm text-gray-300">Implementierungsguides</div>
            </a>
            <a href="/oracle" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700">
              <div className="font-semibold text-cyan-400">🔮 Oracle</div>
              <div className="text-sm text-gray-300">Security Intelligence</div>
            </a>
            <a href="/solutions" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700">
              <div className="font-semibold text-cyan-400">🏢 Enterprise SSO</div>
              <div className="text-sm text-gray-300">Enterprise Solutions</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
