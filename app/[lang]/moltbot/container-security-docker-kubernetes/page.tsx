import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'Moltbot Container Security: Docker & Kubernetes Hardening 2024',
    description: 'Container Security für Moltbot in Docker und Kubernetes. Dockerfile Hardening, K8s Network Policies, RBAC, Pod Security Standards und Runtime Protection mit Falco.',
    keywords: ['moltbot container security','docker hardening','kubernetes security','pod security','falco runtime','container rbac'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'Moltbot Container Security: Docker & Kubernetes Hardening 2024', description: 'Container Security für Moltbot in Docker und Kubernetes.', type: 'article', url: `https://clawguru.org/${lang}/moltbot/container-security-docker-kubernetes`, images: ['/og-moltbot-container.jpg'] },
    alternates: buildLocalizedAlternates(lang as Locale, '/moltbot/container-security-docker-kubernetes'),
    robots: 'index, follow',
  };
}

export default function MoltbotContainerSecurityPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound();

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
            url: "https://clawguru.org/de/moltbot/container-security-docker-kubernetes"
          }
        ]) }} />
      </div>
    </div>
  );
}
