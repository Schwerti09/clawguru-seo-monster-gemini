import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/openclaw/service-mesh-security"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const title = "Service Mesh Security: Istio Linkerd Guide 2026"
  const description = "Complete service mesh security guide for Istio and Linkerd. Learn mTLS, access control, observability, and best practices for microservices security."
  return {
    title,
    description,
    keywords: ["service mesh security", "istio security", "linkerd security", "microservices security", "mtls"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: {
      title,
      description,
      type: "article",
      url: pageUrl,
      images: ["/og-image.png"],
    },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

export default function ServiceMeshSecurityPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: This guide is for hardening your own systems. No attack tools.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Service Mesh Security: Istio & Linkerd Guide</h1>
        <p className="text-lg text-gray-300 mb-8">Complete security implementation for service mesh architectures with mTLS, access control, and observability.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Service Mesh Security Fundamentals</h2>
          <div className="bg-gray-800 p-4 rounded-lg mb-4 border border-gray-700">
            <h3 className="font-semibold mb-2 text-gray-100">Key Security Components</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              <li>Automatic mTLS encryption between services</li>
              <li>Fine-grained access control policies</li>
              <li>Service-to-service authentication</li>
              <li>Traffic management and security rules</li>
              <li>Observability and audit logging</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Istio Security Implementation</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre>
{`# Enable mTLS globally
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: istio-system
spec:
  mtls:
    mode: STRICT

# Authorization policy example
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: allow-frontend
  namespace: default
spec:
  selector:
    matchLabels:
      app: backend
  rules:
  - from:
    - source:
        principals: ["cluster.local/ns/default/sa/frontend-sa"]
  - to:
    - operation:
        methods: ["GET", "POST"]`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Linkerd Security Configuration</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre>
{`# Install Linkerd with automatic mTLS
linkerd install | kubectl apply -f -

# Enable mTLS for a namespace
linkerd inject ns/default | kubectl apply -f -

# Service profile for traffic policies
apiVersion: linkerd.io/v1alpha2
kind: ServiceProfile
metadata:
  name: frontend
  namespace: default
spec:
  routes:
  - name: /api
    condition:
      method: GET
      pathRegex: /api/.*`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Security Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">Network Policies</h3>
              <p className="text-sm text-blue-200">Combine service mesh policies with Kubernetes Network Policies for defense-in-depth.</p>
            </div>
            <div className="bg-green-900 p-4 rounded-lg border border-green-700">
              <h3 className="font-semibold text-green-300 mb-2">Certificate Management</h3>
              <p className="text-sm text-green-200">Automate certificate rotation and monitor expiration dates.</p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">Observability</h3>
              <p className="text-sm text-yellow-200">Monitor security metrics and audit logs for compliance.</p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">Zero Trust Network</h3>
              <p className="text-sm text-red-200">Implement least privilege access for all service communications.</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Further Resources</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Security Check</div>
              <div className="text-sm text-gray-300">Scan your system now</div>
            </a>
            <a href={`/${locale}/runbooks`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Runbooks</div>
              <div className="text-sm text-gray-300">600+ security playbooks</div>
            </a>
            <a href={`/${locale}/openclaw`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">OpenClaw Framework</div>
              <div className="text-sm text-gray-300">Self-hosted security</div>
            </a>
            <a href={`/${locale}/solutions/kubernetes-security-hardening`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Kubernetes Security</div>
              <div className="text-sm text-gray-300">Complete hardening guide</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
