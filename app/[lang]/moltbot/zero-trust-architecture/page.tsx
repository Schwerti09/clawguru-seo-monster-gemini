import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps { params: { lang: string }; }
const LANGS = ['de','en','es','fr','pt','it','ru','zh','ja','ko','ar','hi','tr','pl','nl'];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'Moltbot Zero Trust Architecture: Never Trust, Always Verify 2024',
    description: 'Zero Trust Implementierung für Moltbot. Micro-Segmentierung, Identity-basierter Zugriff, Continuous Verification und Least-Privilege-Prinzip. Komplette ZTA-Architektur mit Code-Beispielen.',
    keywords: ['moltbot zero trust','zero trust architecture','micro segmentation','identity based access','least privilege','continuous verification'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'Moltbot Zero Trust Architecture: Never Trust, Always Verify 2024', description: 'Zero Trust Implementierung für Moltbot.', type: 'article', url: `https://clawguru.org/${lang}/moltbot/zero-trust-architecture` },
    alternates: { canonical: `https://clawguru.org/${lang}/moltbot/zero-trust-architecture`, languages: Object.fromEntries(LANGS.map(l => [l, `https://clawguru.org/${l}/moltbot/zero-trust-architecture`])) },
    robots: 'index, follow',
  };
}

export default function MoltbotZeroTrustPage({ params }: PageProps) {
  const { lang } = params;
  if (!LANGS.includes(lang)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-sm">
          <strong>"Not a Pentest" Trust-Anker</strong>: Zero Trust ist ein Sicherheitsmodell, kein Angriffswerkzeug. Dieser Guide dient ausschließlich der Absicherung von Systemen.
        </div>
        <h1 className="text-4xl font-bold mb-4">Moltbot Zero Trust Architecture</h1>
        <p className="text-lg text-gray-600 mb-8">Zero Trust bedeutet: Kein implizites Vertrauen – weder intern noch extern. Jeder Zugriff wird kontinuierlich verifiziert, unabhängig von Netzwerkposition oder Identität.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">🏗️ ZTA Kernprinzipien</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { title: 'Never Trust', icon: '🚫', desc: 'Kein automatisches Vertrauen – auch nicht bei internen Netzwerken oder bekannten Geräten' },
              { title: 'Always Verify', icon: '✅', desc: 'Jeder Zugriff wird explizit authentifiziert, autorisiert und kontinuierlich verifiziert' },
              { title: 'Least Privilege', icon: '🔒', desc: 'Minimale Zugriffsrechte für jeden User, Service und Device – nur was wirklich benötigt wird' },
            ].map(({ title, icon, desc }) => (
              <div key={title} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-3xl mb-2">{icon}</div>
                <h3 className="font-bold text-blue-800 mb-2">{title}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">🔐 Identity-Based Access Middleware</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
            <pre>{`// moltbot/middleware/zero-trust.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/access-token';

interface ZeroTrustContext {
  userId: string;
  deviceId: string;
  riskScore: number;
  permissions: string[];
}

export async function zeroTrustMiddleware(req: NextRequest): Promise<NextResponse | null> {
  // 1. Verify Identity (JWT)
  const token = req.cookies.get('access_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const payload = await verifyAccessToken(token);
  if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  // 2. Continuous Risk Assessment
  const riskScore = await calculateRiskScore({
    ip: req.ip ?? '0.0.0.0',
    userAgent: req.headers.get('user-agent') ?? '',
    userId: payload.sub as string,
    requestPath: req.nextUrl.pathname,
  });

  // 3. Block high-risk requests even with valid tokens
  if (riskScore > 80) {
    return NextResponse.json({ error: 'Step-up authentication required' }, { status: 403 });
  }

  // 4. Least Privilege: Check specific permission
  const requiredPermission = getRequiredPermission(req.nextUrl.pathname);
  if (requiredPermission && !(payload.permissions as string[]).includes(requiredPermission)) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
  }

  return null; // Allow request
}`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">🌐 Micro-Segmentierung (K8s)</h2>
          <div className="bg-gray-900 text-blue-400 p-4 rounded-lg font-mono text-sm">
            <pre>{`# Zero Trust Network Policies für Moltbot
# Jeder Pod kommuniziert nur mit explizit erlaubten Services

apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: moltbot-zero-trust
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: moltbot
  policyTypes: [Ingress, Egress]
  ingress:
    - from:
        - podSelector: { matchLabels: { role: api-gateway } }
      ports: [{ protocol: TCP, port: 3000 }]
  egress:
    - to:
        - podSelector: { matchLabels: { app: postgres } }
      ports: [{ protocol: TCP, port: 5432 }]
    - to:
        - podSelector: { matchLabels: { app: redis } }
      ports: [{ protocol: TCP, port: 6379 }]
    - ports: [{ protocol: UDP, port: 53 }]  # DNS only`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">🔗 Weiterführende Ressourcen</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100"><div className="font-semibold text-blue-600">🛡️ Security Check</div><div className="text-sm text-gray-600">ZTA Assessment</div></a>
            <a href="/openclaw" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100"><div className="font-semibold text-blue-600">🔓 OpenClaw</div><div className="text-sm text-gray-600">ZTA Framework</div></a>
            <a href="/runbooks" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100"><div className="font-semibold text-blue-600">📚 Runbooks</div><div className="text-sm text-gray-600">Zero Trust Guides</div></a>
            <a href="/solutions" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100"><div className="font-semibold text-blue-600">🏢 Enterprise ZTA</div><div className="text-sm text-gray-600">Managed Zero Trust</div></a>
          </div>
        </section>
      </div>
    </div>
  );
}
