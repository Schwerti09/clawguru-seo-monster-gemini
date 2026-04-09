import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps { params: { lang: string }; }
const LANGS = ['de','en','es','fr','pt','it','ru','zh','ja','ko','ar','hi','tr','pl','nl'];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'Moltbot Container Security: Docker & Kubernetes Hardening 2024',
    description: 'Container Security für Moltbot in Docker und Kubernetes. Dockerfile Hardening, K8s Network Policies, RBAC, Pod Security Standards und Runtime Protection mit Falco.',
    keywords: ['moltbot container security','docker hardening','kubernetes security','pod security','falco runtime','container rbac'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'Moltbot Container Security: Docker & Kubernetes Hardening 2024', description: 'Container Security für Moltbot in Docker und Kubernetes.', type: 'article', url: `https://clawguru.org/${lang}/moltbot/container-security-docker-kubernetes`, images: ['/og-moltbot-container.jpg'] },
    alternates: { canonical: `https://clawguru.org/${lang}/moltbot/container-security-docker-kubernetes`, languages: { de: 'https://clawguru.org/de/moltbot/container-security-docker-kubernetes', en: 'https://clawguru.org/en/moltbot/container-security-docker-kubernetes', es: 'https://clawguru.org/es/moltbot/container-security-docker-kubernetes', fr: 'https://clawguru.org/fr/moltbot/container-security-docker-kubernetes', pt: 'https://clawguru.org/pt/moltbot/container-security-docker-kubernetes', it: 'https://clawguru.org/it/moltbot/container-security-docker-kubernetes', ru: 'https://clawguru.org/ru/moltbot/container-security-docker-kubernetes', zh: 'https://clawguru.org/zh/moltbot/container-security-docker-kubernetes', ja: 'https://clawguru.org/ja/moltbot/container-security-docker-kubernetes', ko: 'https://clawguru.org/ko/moltbot/container-security-docker-kubernetes', ar: 'https://clawguru.org/ar/moltbot/container-security-docker-kubernetes', hi: 'https://clawguru.org/hi/moltbot/container-security-docker-kubernetes', tr: 'https://clawguru.org/tr/moltbot/container-security-docker-kubernetes', pl: 'https://clawguru.org/pl/moltbot/container-security-docker-kubernetes', nl: 'https://clawguru.org/nl/moltbot/container-security-docker-kubernetes' } },
    robots: 'index, follow',
  };
}

export default function MoltbotContainerSecurityPage({ params }: PageProps) {
  const { lang } = params;
  if (!LANGS.includes(lang)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Trust-Anker</strong>: Dieser Guide dient ausschließlich zur Absicherung von Container-Infrastrukturen. Keine Angriffswerkzeuge, keine illegalen Aktivitäten.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Moltbot Container Security: Docker &amp; Kubernetes</h1>
        <p className="text-lg text-gray-300 mb-8">Umfassende Container Security für Moltbot — von gehärteten Dockerfiles über Kubernetes Network Policies bis hin zu Runtime Protection mit Falco.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🐳 Gehärtetes Dockerfile</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-4">
            <pre>{`# Moltbot Production Dockerfile (gehärtet)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
# Security: Non-root user
RUN addgroup -g 1001 -S moltbot && adduser -S moltbot -u 1001 -G moltbot
WORKDIR /app

# Security: Read-only filesystem
COPY --chown=moltbot:moltbot --from=builder /app/.next/standalone ./
COPY --chown=moltbot:moltbot --from=builder /app/public ./public

USER moltbot
EXPOSE 3000
ENV NODE_ENV=production PORT=3000

# Security: No privileged operations
CMD ["node", "server.js"]`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">☸️ Kubernetes Network Policy</h2>
          <div className="bg-gray-900 text-blue-400 p-4 rounded-lg font-mono text-sm mb-4">
            <pre>{`# moltbot-network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: moltbot-netpol
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: moltbot
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              role: ingress-controller
      ports:
        - protocol: TCP
          port: 3000
  egress:
    - to:
        - podSelector:
            matchLabels:
              app: postgres
      ports:
        - protocol: TCP
          port: 5432
    - to:
        - namespaceSelector:
            matchLabels:
              name: kube-system
      ports:
        - protocol: UDP
          port: 53  # DNS`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🛡️ Pod Security Standards</h2>
          <div className="bg-gray-900 text-yellow-400 p-4 rounded-lg font-mono text-sm mb-4">
            <pre>{`# moltbot-deployment.yaml (security context)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: moltbot
spec:
  template:
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1001
        fsGroup: 1001
        seccompProfile:
          type: RuntimeDefault
      containers:
        - name: moltbot
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities:
              drop: ["ALL"]
          resources:
            limits:
              cpu: "500m"
              memory: "512Mi"
            requests:
              cpu: "100m"
              memory: "128Mi"`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔗 Weiterführende Ressourcen</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700">
              <div className="font-semibold text-cyan-400">🛡️ Security Check</div>
              <div className="text-sm text-gray-300">Container-Setup prüfen</div>
            </a>
            <a href="/runbooks" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700">
              <div className="font-semibold text-cyan-400">📚 K8s Runbooks</div>
              <div className="text-sm text-gray-300">Container Security Guides</div>
            </a>
            <a href="/openclaw" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700">
              <div className="font-semibold text-cyan-400">🔓 OpenClaw</div>
              <div className="text-sm text-gray-300">Open Source Framework</div>
            </a>
            <a href="/neuro" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700">
              <div className="font-semibold text-cyan-400">🧠 Neuro AI</div>
              <div className="text-sm text-gray-300">Runtime Threat Detection</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
