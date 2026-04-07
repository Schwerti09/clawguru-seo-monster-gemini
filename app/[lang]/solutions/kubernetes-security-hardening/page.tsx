import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps { params: { lang: string }; }
const LANGS = ['de','en','es','fr','pt','it','ru','zh','ja','ko','ar','hi','tr','pl','nl'];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'Kubernetes Security Hardening mit ClawGuru: CIS Benchmark 2024',
    description: 'Kubernetes Security Hardening mit ClawGuru. CIS Kubernetes Benchmark, RBAC Setup, Network Policies, Pod Security Standards und automatisiertes K8s Scanning.',
    keywords: ['kubernetes security hardening','cis kubernetes benchmark','rbac kubernetes','network policies k8s','pod security standards','kubernetes scanning'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'Kubernetes Security Hardening mit ClawGuru 2024', description: 'K8s Hardening mit CIS Benchmark.', type: 'article', url: `https://clawguru.org/${lang}/solutions/kubernetes-security-hardening` },
    alternates: { canonical: `https://clawguru.org/${lang}/solutions/kubernetes-security-hardening`, languages: Object.fromEntries(LANGS.map(l => [l, `https://clawguru.org/${l}/solutions/kubernetes-security-hardening`])) },
    robots: 'index, follow',
  };
}

export default function KubernetesSecurityPage({ params }: PageProps) {
  const { lang } = params;
  if (!LANGS.includes(lang)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8 text-sm">
          <strong>ClawGuru K8s</strong>: Automatisiertes CIS Benchmark Scanning und Policy Enforcement für Kubernetes-Cluster.
        </div>
        <h1 className="text-4xl font-bold mb-4">Kubernetes Security Hardening</h1>
        <p className="text-lg text-gray-600 mb-8">CIS Kubernetes Benchmark Score von 0% auf 95%+ — mit automatisierten Checks, RBAC-Konfiguration und Network Policies.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">🎯 CIS Benchmark Bereiche</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { area: 'Control Plane Components', checks: 42, passing: 40, score: 95 },
              { area: 'etcd', checks: 7, passing: 7, score: 100 },
              { area: 'Control Plane Configuration', checks: 4, passing: 4, score: 100 },
              { area: 'Worker Nodes', checks: 28, passing: 25, score: 89 },
              { area: 'Kubernetes Policies', checks: 33, passing: 30, score: 91 },
              { area: 'RBAC & Service Accounts', checks: 21, passing: 19, score: 90 },
            ].map(({ area, checks, passing, score }) => (
              <div key={area} className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-sm">{area}</div>
                  <div className={`text-sm font-bold ${score >= 95 ? 'text-green-600' : score >= 85 ? 'text-yellow-600' : 'text-red-600'}`}>{score}%</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className={`h-2 rounded-full ${score >= 95 ? 'bg-green-500' : score >= 85 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${score}%` }} />
                </div>
                <div className="text-xs text-gray-500">{passing}/{checks} Checks bestanden</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">🔗 ClawGuru für K8s</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100"><div className="font-semibold text-blue-600">🛡️ Security Check</div><div className="text-sm text-gray-600">K8s Cluster Scan</div></a>
            <a href="/runbooks" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100"><div className="font-semibold text-blue-600">📚 K8s Runbooks</div><div className="text-sm text-gray-600">CIS Guides</div></a>
            <a href="/oracle" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100"><div className="font-semibold text-blue-600">🔮 Oracle</div><div className="text-sm text-gray-600">CVE Intelligence</div></a>
            <a href="/solutions" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100"><div className="font-semibold text-blue-600">🏢 Enterprise K8s</div><div className="text-sm text-gray-600">Managed Hardening</div></a>
          </div>
        </section>
      </div>
    </div>
  );
}
