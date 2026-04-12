import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import { BASE_URL } from "@/lib/config"
import { headers } from "next/headers"
import { DEFAULT_LOCALE, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import type { Metadata } from "next"

export const dynamic = "force-static"
export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "GitHub Actions auf Bare Metal 2026 | Self-Hosted Runner Deployment Guide",
    description: "Sichere GitHub Actions Self-Hosted Runner auf Bare Metal: Installation, Isolation, Secrets-Management, Canary Deployments. Kompletter Hardering-Guide für CI/CD auf eigenen Servern.",
    keywords: ["github actions bare metal", "self hosted runner", "github actions hardening", "ci/cd security", "bare metal deployment"],
    alternates: buildLocalizedAlternates(DEFAULT_LOCALE, "/solutions/github-actions-bare-metal"),
    openGraph: {
      title: "GitHub Actions auf Bare Metal – Security Guide 2026",
      description: "Self-Hosted Runner sicher betreiben: Isolation, Secrets, Canary Deployments",
      type: "article",
    },
  }
}

export default async function GitHubActionsBareMetalPage() {
  const h = headers()
  const locale = (h.get("x-claw-locale") ?? DEFAULT_LOCALE) as Locale
  const prefix = `/${locale}`

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "GitHub Actions auf Bare Metal – Self-Hosted Runner Security Guide 2026",
    description: "Sichere CI/CD mit GitHub Actions Self-Hosted Runnern auf Bare Metal",
    url: `${BASE_URL}${prefix}/solutions/github-actions-bare-metal`,
    datePublished: "2026-03-28",
    dateModified: "2026-03-28",
    author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
    publisher: { 
      "@type": "Organization", 
      name: "ClawGuru", 
      url: BASE_URL, 
      logo: { "@type": "ImageObject", url: `${BASE_URL}/og-image.png` } 
    }
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${BASE_URL}${prefix}` },
      { "@type": "ListItem", position: 2, name: "Solutions", item: `${BASE_URL}${prefix}/solutions` },
      { "@type": "ListItem", position: 3, name: "GitHub Actions Bare Metal", item: `${BASE_URL}${prefix}/solutions/github-actions-bare-metal` },
    ],
  }

  const sources = [
    { name: "GitHub Actions Security Best Practices", url: "https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions" },
    { name: "GitHub Self-Hosted Runner Hardening", url: "https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/about-self-hosted-runners" },
    { name: "OWASP CI/CD Security", url: "https://owasp.org/www-project-top-10-ci-cd-security-risks/" },
  ]
  const isDE = locale === 'de'
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: isDE ? 'Was sind GitHub Actions Self-Hosted Runner?' : 'What are GitHub Actions self-hosted runners?', acceptedAnswer: { '@type': 'Answer', text: isDE ? 'Self-Hosted Runner sind eigene Server die GitHub Actions Workflows ausführen. Vorteile: Zugriff auf interne Ressourcen, keine Minutenlimits, dedizierte Hardware, compliance-konforme Datenverarbeitung.' : 'Self-hosted runners are your own servers running GitHub Actions workflows. Advantages: access to internal resources, no minute limits, dedicated hardware, compliance-compliant data processing.' } },
      { '@type': 'Question', name: isDE ? 'Wie isoliere ich GitHub Actions Runner sicher?' : 'How do I securely isolate GitHub Actions runners?', acceptedAnswer: { '@type': 'Answer', text: isDE ? 'Ephemeral Runner (nach jedem Job neu erstellen). Docker-in-Docker für Job-Isolation. Separater Linux-User ohne sudo. Network Policies: Runner dürfen nur GitHub API und interne Registry erreichen.' : 'Ephemeral runners (recreate after each job). Docker-in-Docker for job isolation. Separate Linux user without sudo. Network policies: runners may only reach GitHub API and internal registry.' } },
      { '@type': 'Question', name: isDE ? 'Wie manage ich Secrets in GitHub Actions?' : 'How do I manage secrets in GitHub Actions?', acceptedAnswer: { '@type': 'Answer', text: isDE ? 'Repository-Secrets für repo-spezifische Credentials. Environment Secrets für prod/staging. Niemals Secrets in Logs ausgeben. HashiCorp Vault Action für dynamische Secrets. Rotation alle 90 Tage.' : 'Repository secrets for repo-specific credentials. Environment secrets for prod/staging. Never output secrets in logs. HashiCorp Vault Action for dynamic secrets. Rotate every 90 days.' } },
      { '@type': 'Question', name: isDE ? 'Was ist ein Canary Deployment mit GitHub Actions?' : 'What is a canary deployment with GitHub Actions?', acceptedAnswer: { '@type': 'Answer', text: isDE ? 'Canary Deployment rollt neue Versionen schrittweise aus: 5% Traffic zuerst, dann 25%, 50%, 100%. Bei Fehlerrate > 1%: automatisches Rollback via GitHub Environments mit required reviews.' : 'Canary deployment rolls out new versions gradually: 5% traffic first, then 25%, 50%, 100%. On error rate > 1%: automatic rollback via GitHub Environments with required reviews.' } },
    ],
  }

  return (
    <Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      
      <div className="py-16 max-w-4xl mx-auto">
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li><a href={prefix} className="hover:text-cyan-400">ClawGuru</a></li>
            <li>/</li>
            <li><a href={`${prefix}/solutions`} className="hover:text-cyan-400">Solutions</a></li>
            <li>/</li>
            <li className="text-gray-300">GitHub Actions</li>
          </ol>
        </nav>

        <h1 className="text-4xl font-black mb-4 text-gray-100">GitHub Actions auf Bare Metal 2026</h1>
        <p className="text-lg text-gray-300 mb-8">Sichere Self-Hosted Runner auf eigenen Servern: Installation, Isolation, Secrets-Management und Canary Deployments für Enterprise-CI/CD.</p>

        <div className="mt-8 p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 flex items-center gap-3">
          <span className="text-emerald-400 text-xl">✓</span>
          <p className="text-sm text-emerald-300/80">
            <span className="font-black text-emerald-300">ClawGuru Verified.</span>{" "}
            Basierend auf GitHub Security Best Practices, OWASP CI/CD Top 10, und Bare Metal Hardening Guidelines.
          </p>
        </div>

        <div className="mt-12 space-y-12">
          <section>
            <h2 className="text-2xl font-black text-white mb-4">Warum Self-Hosted Runner auf Bare Metal?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              GitHub Actions Self-Hosted Runner auf Bare Metal bieten maximale Kontrolle, Performance und 
              Compliance-Flexibilität. Ideal für regulated Industries, air-gapped Umgebungen oder 
              spezifische Hardware-Requirements.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-2xl border border-gray-800 bg-black/30">
                <div className="text-cyan-400 font-bold text-lg mb-2">Performance</div>
                <div className="text-sm text-gray-400">Dedizierte CPU/Ressourcen, keine Noisy-Neighbors</div>
              </div>
              <div className="p-4 rounded-2xl border border-gray-800 bg-black/30">
                <div className="text-cyan-400 font-bold text-lg mb-2">Compliance</div>
                <div className="text-sm text-gray-400">Data Residency, Air-Gapped, Custom Encryption</div>
              </div>
              <div className="p-4 rounded-2xl border border-gray-800 bg-black/30">
                <div className="text-cyan-400 font-bold text-lg mb-2">Kosten</div>
                <div className="text-sm text-gray-400">Bei hoher Utilization günstiger als GitHub-hosted</div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-6">Installation & Hardening</h2>
            
            <div className="space-y-6">
              <div className="p-6 rounded-3xl border border-gray-800 bg-black/25">
                <h3 className="text-xl font-bold text-white mb-3">1. Runner Installation</h3>
                <pre className="mt-4 rounded-2xl border border-gray-800 bg-black/40 p-4 overflow-x-auto text-sm text-gray-300">
{`# GitHub Actions Runner auf Bare Metal installieren
# Download und Setup
mkdir -p /opt/github-runner && cd /opt/github-runner
curl -o actions-runner-linux-x64-2.319.0.tar.gz \\
  -L https://github.com/actions/runner/releases/download/v2.319.0/...

# Entpacken und konfigurieren
tar xzf actions-runner-linux-x64-2.319.0.tar.gz
./config.sh --url https://github.com/ORG/REPO \\
  --token TOKEN --name "bare-metal-runner-01" \\
  --labels "bare-metal,production,self-hosted"

# Als Service registrieren (systemd)
sudo ./svc.sh install
sudo ./svc.sh start`}
                </pre>
              </div>

              <div className="p-6 rounded-3xl border border-gray-800 bg-black/25">
                <h3 className="text-xl font-bold text-white mb-3">2. Container-Isolation mit Docker</h3>
                <pre className="mt-4 rounded-2xl border border-gray-800 bg-black/40 p-4 overflow-x-auto text-sm text-gray-300">
{`# Docker-in-Docker (DinD) für Job-Isolation
# /etc/docker/daemon.json
{
  "userns-remap": "runner",
  "live-restore": true,
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "seccomp-profile": "/etc/docker/seccomp-default.json"
}

# Runner mit eingeschränkten Privilegien
--docker-userns-remap runner
--disable-update`}
                </pre>
              </div>

              <div className="p-6 rounded-3xl border border-gray-800 bg-black/25">
                <h3 className="text-xl font-bold text-white mb-3">3. Netzwerk-Isolation & Firewall</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Ausgehende Verbindungen auf notwendige Ports beschränken (443, 22)</li>
                  <li>• VLAN-Segmentierung für CI/CD-Netzwerk</li>
                  <li>• Egress-Filtering für Secrets-Exfiltration Prevention</li>
                  <li>• Proxy für alle externen Requests erzwingen</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">Secrets & OIDC Configuration</h2>
            <div className="p-6 rounded-3xl border border-gray-800 bg-black/25">
              <h3 className="text-xl font-bold text-white mb-3">OIDC für Secrets-less Authentication</h3>
              <pre className="mt-4 rounded-2xl border border-gray-800 bg-black/40 p-4 overflow-x-auto text-sm text-gray-300">
{`# GitHub Actions Workflow mit OIDC
# .github/workflows/deploy.yml
jobs:
  deploy:
    runs-on: [self-hosted, bare-metal]
    permissions:
      id-token: write  # OIDC Token
      contents: read
    steps:
      - uses: actions/checkout@v4
      
      # AWS OIDC Auth (keine Long-Lived Secrets!)
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::ACCOUNT:role/GithubActionsRole
          aws-region: eu-central-1
      
      # Azure OIDC
      - name: Azure Login
        uses: azure/login@v2
        with:
          client-id: \${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: \${{ secrets.AZURE_TENANT_ID }}
          subscription-id: \${{ secrets.AZURE_SUBSCRIPTION_ID }}`}
              </pre>
              <div className="mt-4 p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10">
                <p className="text-sm text-yellow-300/80">
                  <strong>Best Practice:</strong> OIDC eliminiert die Notwendigkeit für long-lived Access Keys.
                  Tokens sind nur 5 Minuten gültig.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">Canary & Blue-Green Deployments</h2>
            <div className="p-6 rounded-3xl border border-gray-800 bg-black/25">
              <ul className="space-y-3 text-gray-300">
                <li>• <strong>Argo Rollouts:</strong> Progressive Delivery mit automatischer Promotion</li>
                <li>• <strong>Flagger:</strong> Canary-Deployments mit Prometheus-Metriken</li>
                <li>• <strong>Health Probes:</strong> Readiness/Liveness vor Traffic-Shift</li>
                <li>• <strong>Auto-Rollback:</strong> Bei Error-Rate &gt; 1% oder Latenz-Spikes</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">Security Checklist</h2>
            <div className="p-6 rounded-3xl border border-gray-800 bg-black/25">
              <ul className="space-y-3">
                <li className="flex items-center gap-3"><span className="text-emerald-400">☑</span><span className="text-gray-300">Runner in isolierter Netzwerk-Segmentierung</span></li>
                <li className="flex items-center gap-3"><span className="text-emerald-400">☑</span><span className="text-gray-300">OIDC statt Long-Lived Secrets verwendet</span></li>
                <li className="flex items-center gap-3"><span className="text-emerald-400">☑</span><span className="text-gray-300">Container-Isolation mit User Namespaces</span></li>
                <li className="flex items-center gap-3"><span className="text-emerald-400">☑</span><span className="text-gray-300">Audit-Logging für alle Deployments aktiv</span></li>
                <li className="flex items-center gap-3"><span className="text-emerald-400">☑</span><span className="text-gray-300">Automatisches Runner-Updates deaktiviert (manuelles Review)</span></li>
                <li className="flex items-center gap-3"><span className="text-emerald-400">☑</span><span className="text-gray-300">Ephemeral Runner (Einweg-VMs für sensitive Jobs)</span></li>
              </ul>
            </div>
          </section>

          <section className="border-t border-gray-800 pt-8">
            <h3 className="text-lg font-bold text-gray-400 mb-4">Quellen & Referenzen</h3>
            <ul className="space-y-2 text-sm">
              {sources.map((src, i) => (
                <li key={i}>
                  <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">
                    [{i + 1}] {src.name}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </Container>
  )
}
