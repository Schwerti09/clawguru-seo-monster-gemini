import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'Kubernetes Security Hardening mit ClawGuru: CIS Benchmark 2024',
    description: 'Kubernetes Security Hardening mit ClawGuru. CIS Kubernetes Benchmark, RBAC Setup, Network Policies, Pod Security Standards und automatisiertes K8s Scanning.',
    keywords: ['kubernetes security hardening','cis kubernetes benchmark','rbac kubernetes','network policies k8s','pod security standards','kubernetes scanning'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'Kubernetes Security Hardening mit ClawGuru 2024', description: 'K8s Hardening mit CIS Benchmark.', type: 'article', url: `https://clawguru.org/${lang}/solutions/kubernetes-security-hardening` },
    alternates: buildLocalizedAlternates(lang as Locale, '/solutions/kubernetes-security-hardening'),
    robots: 'index, follow',
  };
}

export default function KubernetesSecurityPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-blue-900 border-l-4 border-blue-500 p-4 mb-8 text-sm text-blue-100">
          <strong>ClawGuru K8s</strong>: Automatisiertes CIS Benchmark Scanning und Policy Enforcement für Kubernetes-Cluster.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Kubernetes Security Hardening</h1>
        <p className="text-lg text-gray-300 mb-8">CIS Kubernetes Benchmark Score von 0% auf 95%+ — mit automatisierten Checks, RBAC-Konfiguration und Network Policies.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🎯 CIS Benchmark Bereiche</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { area: 'Control Plane Components', checks: 42, passing: 40, score: 95 },
              { area: 'etcd', checks: 7, passing: 7, score: 100 },
              { area: 'Control Plane Configuration', checks: 4, passing: 4, score: 100 },
              { area: 'Worker Nodes', checks: 28, passing: 25, score: 89 },
              { area: 'Kubernetes Policies', checks: 33, passing: 30, score: 91 },
              { area: 'RBAC & Service Accounts', checks: 21, passing: 19, score: 90 },
            ].map(({ area, checks, passing, score }) => (
              <div key={area} className="bg-gray-800 p-4 rounded-lg border border-gray-700 border">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-sm">{area}</div>
                  <div className={`text-sm font-bold ${score >= 95 ? 'text-green-400' : score >= 85 ? 'text-yellow-400' : 'text-red-400'}`}>{score}%</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className={`h-2 rounded-full ${score >= 95 ? 'bg-green-9000' : score >= 85 ? 'bg-amber-9000' : 'bg-red-9000'}`} style={{ width: `${score}%` }} />
                </div>
                <div className="text-xs text-gray-400">{passing}/{checks} Checks bestanden</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔗 ClawGuru für K8s</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🛡️ Security Check</div><div className="text-sm text-gray-300">K8s Cluster Scan</div></a>
            <a href="/runbooks" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">📚 K8s Runbooks</div><div className="text-sm text-gray-300">CIS Guides</div></a>
            <a href="/oracle" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🔮 Oracle</div><div className="text-sm text-gray-300">CVE Intelligence</div></a>
            <a href="/solutions" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🏢 Enterprise K8s</div><div className="text-sm text-gray-300">Managed Hardening</div></a>
          </div>
        </section>
      </div>
    </div>
  );
}
