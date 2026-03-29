import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import { BASE_URL } from "@/lib/config"
import { headers } from "next/headers"
import { DEFAULT_LOCALE, type Locale, localeAlternates } from "@/lib/i18n"
import type { Metadata } from "next"

export const dynamic = "force-static"
export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  const alts = localeAlternates("/solutions/github-actions-bare-metal")
  return {
    title: "GitHub Actions auf Bare Metal 2026 | Self-Hosted Runner Deployment Guide",
    description: "Sichere GitHub Actions Self-Hosted Runner auf Bare Metal: Installation, Isolation, Secrets-Management, Canary Deployments. Kompletter Hardering-Guide für CI/CD auf eigenen Servern.",
    keywords: ["github actions bare metal", "self hosted runner", "github actions hardening", "ci/cd security", "bare metal deployment"],
    alternates: alts,
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

  return (
    <Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      
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

        <SectionTitle
          kicker="CI/CD Security"
          title="GitHub Actions auf Bare Metal 2026"
          subtitle="Sichere Self-Hosted Runner auf eigenen Servern: Installation, Isolation, Secrets-Management und Canary Deployments für Enterprise-CI/CD."
        />

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
      
      # Azure OIDC`}
              </pre>
            </div>
          </section>
        </div>
      </div>
    </Container>
  )
}
