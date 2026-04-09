import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps { params: { lang: string }; }
const LANGS = ['de','en','es','fr','pt','it','ru','zh','ja','ko','ar','hi','tr','pl','nl'];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'Moltbot Cloud Native Security: Kubernetes, Containers, Microservices 2024',
    description: 'Cloud Native Security für Moltbot. Kubernetes Security, Container Hardening, Microservices Security, Service Mesh und Cloud Native Protection.',
    keywords: ['moltbot cloud native security','kubernetes security','container security','microservices security','service mesh','cloud native protection'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'Moltbot Cloud Native Security 2024', description: 'Cloud Native Security für Moltbot.', type: 'article', url: `https://clawguru.org/${lang}/moltbot/cloud-native-security` },
    alternates: { canonical: `https://clawguru.org/${lang}/moltbot/cloud-native-security`, languages: Object.fromEntries(LANGS.map(l => [l, `https://clawguru.org/${l}/moltbot/cloud-native-security`])) },
    robots: 'index, follow',
  };
}

export default function MoltbotCloudNativePage({ params }: PageProps) {
  const { lang } = params;
  if (!LANGS.includes(lang)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Trust-Anker</strong>: Cloud Native Security schützt eigene Container-Infrastrukturen. Keine Angriffswerkzeuge.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Moltbot Cloud Native Security</h1>
        <p className="text-lg text-gray-300 mb-8">Cloud Native Umgebungen sind komplex. Kubernetes, Container und Microservices benötigen spezialisierte Security-Strategien.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Cloud Native Security Layers</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead><tr className="bg-gray-800 text-white"><th className="p-3 text-left">Layer</th><th className="p-3 text-left">Schutz vor</th><th className="p-3 text-left">Tools</th><th className="p-3 text-left">Impact</th></tr></thead>
              <tbody>
                {[
                  ['Container Security', 'Container Vulnerabilities', 'Trivy, Clair', 'Hoch'],
                  ['Kubernetes Security', 'Cluster Misconfigurations', 'OPA, Falco', 'Hoch'],
                  ['Network Security', 'East-West Traffic', 'Calico, Cilium', 'Mittel'],
                  ['Runtime Security', 'Runtime Threats', 'Sysdig, Aqua', 'Hoch'],
                  ['Supply Chain', 'Image Integrity', 'Notary, Cosign', 'Mittel'],
                ].map(([layer, threat, tools, impact]) => (
                  <tr key={layer} className="border-b hover:bg-gray-800">
                    <td className="p-3 font-medium">{layer}</td>
                    <td className="p-3 text-sm">{threat}</td>
                    <td className="p-3 text-sm">{tools}</td>
                    <td className="p-3 text-sm">{impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Kubernetes Security Best Practices</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{`// Kubernetes Security Policy für Moltbot
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: moltbot-restricted
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'projected'
    - 'secret'
    - 'downwardAPI'
    - 'persistentVolumeClaim'
  runAsUser:
    rule: 'MustRunAsNonRoot'
  seLinux:
    rule: 'RunAsAny'
  fsGroup:
    rule: 'RunAsAny'
  readOnlyRootFilesystem: true
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    fsGroup: 1000
    capabilities:
      drop:
        - ALL
    allowPrivilegeEscalation: false
    readOnlyRootFilesystem: true

// Network Policy
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: moltbot-network-policy
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
          app: moltbot-frontend
    ports:
    - protocol: TCP
      port: 8080
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: moltbot-backend
    ports:
    - protocol: TCP
      port: 5432`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Container Security</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{`# Dockerfile Security Best Practices für Moltbot
FROM node:18-alpine AS builder

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S moltbot -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY --chown=moltbot:nodejs . .

# Remove unnecessary packages
RUN apk del --purge \
    unzip \
    zip \
    && rm -rf /var/cache/apk/*

# Security hardening
RUN chmod -R 755 /app && \
    chmod -R 644 /app/*.js && \
    find /app -type f -name "*.sh" -exec chmod 755 {} \;

# Switch to non-root user
USER moltbot

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# Expose port
EXPOSE 8080

# Start application
CMD ["node", "server.js"]

# Runtime security configuration
# docker run --security-opt no-new-privileges \
#   --cap-drop ALL \
#   --cap-add CHOWN \
#   --cap-add SETGID \
#   --cap-add SETUID \
#   --read-only \
#   --tmpfs /tmp \
#   moltbot:latest`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Resources</h2>
          <ul className="list-disc pl-4 space-y-2">
            <li><a href="https://clawguru.org/de/security/kubernetes-security" target="_blank" rel="noopener noreferrer">Kubernetes Security Guide</a></li>
            <li><a href="https://clawguru.org/de/security/container-security" target="_blank" rel="noopener noreferrer">Container Security</a></li>
            <li><a href="https://clawguru.org/de/security/microservices-security" target="_blank" rel="noopener noreferrer">Microservices Security</a></li>
            <li><a href="https://clawguru.org/de/security/service-mesh" target="_blank" rel="noopener noreferrer">Service Mesh Security</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
}