import type { Metadata } from "next";
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n";
import { BASE_URL } from "@/lib/config";
import { getCoreSecurityLinks } from "@/lib/core-security-links";
import { t } from "@/lib/article-i18n"

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
    title: locale === "de" 
      ? "Kubernetes Network Policies 2026 | Zero Trust K8s Networking"
      : "Kubernetes Network Policies 2026 | Zero Trust K8s Networking",
    description: locale === "de"
      ? "Kubernetes Network Policies Guide: Zero Trust Pod-to-Pod Security, Cilium, Calico, Ingress/Egress Rules. Cluster Network Segmentation."
      : "Kubernetes Network Policies guide: Zero Trust pod-to-pod security, Cilium, Calico, ingress/egress rules. Cluster network segmentation.",
    keywords: [
      "Kubernetes network policies",
      "K8s network security",
      "Kubernetes zero trust",
      "Cilium network policy",
      "Calico network policy",
      "Pod security policy",
      "Kubernetes segmentation",
      "K8s firewall",
      "Service mesh security",
      "Kubernetes egress",
    ],
    alternates: buildLocalizedAlternates(locale, "/kubernetes-network-policies"),
    openGraph: {
      images: ["/og-image.png"],
      title: "Kubernetes Network Policies 2026: Zero Trust Networking",
      description: "Implement Zero Trust in Kubernetes with Network Policies, Cilium & Calico.",
      type: "article",
      url: `${BASE_URL}/${locale}/kubernetes-network-policies`,
    },
  };
}

export default async function K8sNetworkPoliciesPage({
  params,
}: {
  params: { lang: string };
}) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale)
    ? params.lang
    : "de") as Locale;
  const prefix = `/${locale}`;
  const coreLinks = getCoreSecurityLinks(locale);
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: locale === 'de' ? 'Was sind Kubernetes Network Policies?' : 'What are Kubernetes Network Policies?', acceptedAnswer: { '@type': 'Answer', text: locale === 'de' ? 'Network Policies sind Kubernetes-Ressourcen die Pod-zu-Pod-Kommunikation auf Netzwerkebene kontrollieren. By default: alle Pods können miteinander kommunizieren. Mit Network Policies: explizites Whitelist-Prinzip. Erfordern einen CNI-Plugin der Policies unterstützt (Calico, Cilium, Weave).' : 'Network Policies are Kubernetes resources that control pod-to-pod communication at the network level. By default: all pods can communicate with each other. With Network Policies: explicit whitelist principle. Require a CNI plugin that supports policies (Calico, Cilium, Weave).' } },
      { '@type': 'Question', name: locale === 'de' ? 'Wie implementiere ich Default-Deny in Kubernetes?' : 'How do I implement default-deny in Kubernetes?', acceptedAnswer: { '@type': 'Answer', text: locale === 'de' ? 'Default-Deny Policy für jeden Namespace: NetworkPolicy mit podSelector: {} und leeren ingress/egress Regeln erstellt eine Deny-All Policy. Dann explizit erlaubte Verbindungen hinzufügen. Wichtig: DNS (Port 53) für alle Pods explizit erlauben damit Service Discovery funktioniert.' : 'Default-Deny policy for each namespace: NetworkPolicy with podSelector: {} and empty ingress/egress rules creates a deny-all policy. Then explicitly add allowed connections. Important: explicitly allow DNS (port 53) for all pods so service discovery works.' } },
      { '@type': 'Question', name: locale === 'de' ? 'Was ist der Unterschied zwischen Calico und Cilium?' : 'What is the difference between Calico and Cilium?', acceptedAnswer: { '@type': 'Answer', text: locale === 'de' ? 'Calico ist battle-tested, weit verbreitet, unterstützt Kubernetes Network Policies + eigene GlobalNetworkPolicy. Cilium nutzt eBPF für Layer 7 Visibility und höhere Performance, unterstützt HTTP/gRPC-aware Policies. Für neue Cluster: Cilium empfohlen. Für bestehende: Calico bewährt.' : 'Calico is battle-tested, widely used, supports Kubernetes Network Policies + own GlobalNetworkPolicy. Cilium uses eBPF for layer 7 visibility and higher performance, supports HTTP/gRPC-aware policies. For new clusters: Cilium recommended. For existing: Calico proven.' } },
      { '@type': 'Question', name: locale === 'de' ? 'Wie teste ich ob Network Policies funktionieren?' : 'How do I test if network policies work?', acceptedAnswer: { '@type': 'Answer', text: locale === 'de' ? 'Test-Pod deployen: kubectl run test --image=busybox --rm -it -- /bin/sh, dann wget oder nc zu anderen Services testen. netassert und network-policy-explorer visualisieren Policies. Hubble (Cilium) zeigt allowed/denied Traffic in Echtzeit.' : 'Deploy test pod: kubectl run test --image=busybox --rm -it -- /bin/sh, then test wget or nc to other services. netassert and network-policy-explorer visualize policies. Hubble (Cilium) shows allowed/denied traffic in real time.' } },
    ],
  }

  return (
    <main className="min-h-screen bg-gray-800">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-sm mb-4">
              Kubernetes Security 2026
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              K8s Network Policies
            </h1>
            <p className="text-2xl text-blue-200 mb-4">
              Zero Trust Pod-to-Pod Security
            </p>
            <p className="text-xl text-white/80 mb-8">
              Kubernetes Network Policies, Cilium, Calico, Ingress/Egress, DNS Policies. Cluster segmentation.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Zero Trust</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Cilium</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Calico</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">eBPF</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Default-Deny: Zero Trust Foundation</h2>
            
            <p className="text-gray-200 text-lg mb-6">
              {t(locale, "Standardmäßig können alle Pods in Kubernetes miteinander kommunizieren. Das ist ein Security-Risiko. Zero Trust bedeutet: Default-Deny, explizite Erlaubnis.", "By default, all pods in Kubernetes can communicate with each other. This is a security risk. Zero Trust means: default-deny, explicit allow.")}
            </p>

            <div className="bg-slate-900 rounded-xl p-6 mb-6">
              <h3 className="text-white font-semibold mb-4">Global Default-Deny Policy</h3>
              <pre className="font-mono text-sm text-green-400 overflow-x-auto">
{`# default-deny-all.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: production
spec:
  podSelector: {}  # All pods
  policyTypes:
  - Ingress
  - Egress
  # No ingress/egress rules = deny everything`}
              </pre>
            </div>

            <div className="bg-red-900 border border-red-700 rounded-xl p-6">
              <h3 className="font-semibold text-red-900 mb-2">⚠️ Wichtig: Reihenfolge</h3>
              <p className="text-red-800 text-sm">
                Deployen Sie Default-Deny NICHT bevor explizite Allow-Policies existieren! Sonst ist alles offline.
              </p>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Application-Specific Policies</h2>
            
            <div className="bg-slate-900 rounded-xl p-6 mb-6">
              <h3 className="text-white font-semibold mb-4">Frontend → Backend → Database</h3>
              <pre className="font-mono text-sm text-green-400 overflow-x-auto">
{`# frontend-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: frontend-policy
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: frontend
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
    ports:
    - protocol: TCP
      port: 3000
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: backend
    ports:
    - protocol: TCP
      port: 8080
  - to:  # DNS
    - namespaceSelector: {}
    ports:
    - protocol: UDP
      port: 53
---
# backend-policy.yaml  
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-policy
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 8080
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: database
    ports:
    - protocol: TCP
      port: 5432`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Egress Control: Outbound Traffic</h2>
            
            <div className="bg-slate-900 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Restrict External Access</h3>
              <pre className="font-mono text-sm text-green-400 overflow-x-auto">
{`# egress-allow-specific.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: egress-external-api
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: payment-service
  policyTypes:
  - Egress
  egress:
  # Allow Stripe API only
  - to:
    - ipBlock:
        cidr: 54.187.216.0/21  # Stripe IP range
    ports:
    - protocol: TCP
      port: 443
  
  # Allow DNS
  - to:
    - namespaceSelector: {}
    ports:
    - protocol: UDP
      port: 53
    - protocol: TCP
      port: 53
  
  # Allow internal cluster
  - to:
    - podSelector: {}
    - namespaceSelector: {}

---
# Cilium: DNS-based policy (more flexible)
apiVersion: cilium.io/v2
kind: CiliumNetworkPolicy
metadata:
  name: egress-dns-based
spec:
  endpointSelector:
    matchLabels:
      app: api-service
  egress:
  - toFQDNs:
    - matchName: "api.stripe.com"
    - matchName: "api.github.com"
    toPorts:
    - ports:
      - port: "443"
        protocol: TCP`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Cilium: Advanced Policies</h2>
            
            <div className="bg-slate-900 rounded-xl p-6 mb-6">
              <h3 className="text-white font-semibold mb-4">Layer 7 HTTP Policy</h3>
              <pre className="font-mono text-sm text-green-400">
{`apiVersion: cilium.io/v2
kind: CiliumNetworkPolicy
metadata:
  name: l7-http-restrict
spec:
  endpointSelector:
    matchLabels:
      app: frontend
  ingress:
  - fromEndpoints:
    - matchLabels:
        io.kubernetes.pod.namespace: ingress-nginx
    toPorts:
    - ports:
      - port: "3000"
        protocol: TCP
      rules:
        http:
        - method: GET
          path: "/api/.*"
        - method: POST
          path: "/api/users"
          headers:
          - name: Content-Type
            value: application/json
        - method: "^GET$"
          path: "/health"
  egress:
  - toEndpoints:
    - matchLabels:
        app: backend
    toPorts:
    - ports:
      - port: "8080"
        protocol: TCP
      rules:
        http:
        - method: GET
          path: "/internal/.*"
          headers:
          - name: X-Internal-Auth
            required: true`}
              </pre>
            </div>

            <div className="bg-slate-900 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">TLS Inspection (mTLS)</h3>
              <pre className="font-mono text-sm text-green-400">
{`apiVersion: cilium.io/v2
kind: CiliumNetworkPolicy
metadata:
  name: mtls-enforcement
spec:
  mutualAuth: true  # Require mTLS
  endpointSelector:
    matchLabels:
      app: secure-service
  ingress:
  - fromEndpoints:
    - matchLabels:
        trusted-client: "true"
    toPorts:
    - ports:
      - port: "8443"
        protocol: TCP`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Policy Troubleshooting</h2>
            
            <div className="bg-slate-900 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Debug Commands</h3>
              <pre className="font-mono text-sm text-green-400">
{`# Check if policy is applied
kubectl describe netpol -n production frontend-policy

# Cilium: Check policy enforcement
cilium policy get -n production
cilium endpoint list

# Test connectivity
kubectl run test --rm -it --image=nicolaka/netshoot -- /bin/bash
nc -zv backend 8080

# Enable policy audit mode (log only, don't block)
apiVersion: cilium.io/v2
kind: CiliumNetworkPolicy
metadata:
  annotations:
    io.cilium.policy.audit-mode: "true"`}
              </pre>
            </div>
          </section>

          <section className="bg-gradient-to-r from-blue-700 to-indigo-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">K8s Network Security Assessment</h2>
            <p className="mb-6">Validieren Sie Ihre Kubernetes Network Policies.</p>
            <a href={coreLinks.check} className="inline-block px-6 py-3 bg-gray-800 text-blue-700 rounded-lg font-semibold">
              Security Assessment
            </a>
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
              <a href={`${prefix}/openclaw-security-check`} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">OpenClaw Security Hub</a>
              <a href={`${prefix}/ai-agent-security`} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">AI Agent Security</a>
              <a href={`${prefix}/runbooks/security`} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">Security Runbooks</a>
              <a href={coreLinks.methodology} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">Methodology</a>
            </div>

          </section>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "Kubernetes Network Policies 2026",
        author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        datePublished: "2026-03-29",
      })}} />
    </main>
  );
}
