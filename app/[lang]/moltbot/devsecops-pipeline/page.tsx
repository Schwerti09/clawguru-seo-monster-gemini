import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'Moltbot DevSecOps Pipeline: Security im CI/CD 2024',
    description: 'DevSecOps für Moltbot: Security-Gates im CI/CD-Pipeline, SAST/DAST-Integration, Dependency Scanning, Container Scanning und automatisierte Compliance-Checks. GitHub Actions Konfiguration.',
    keywords: ['moltbot devsecops','cicd security','sast dast','dependency scanning','container scanning','github actions security'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: 'Moltbot DevSecOps Pipeline: Security im CI/CD 2024', description: 'DevSecOps für Moltbot mit Security-Gates im CI/CD.', type: 'article', url: `https://clawguru.org/${lang}/moltbot/devsecops-pipeline` },
    alternates: buildLocalizedAlternates(lang as Locale, '/moltbot/devsecops-pipeline'),
    robots: 'index, follow',
  };
}

export default function MoltbotDevSecOpsPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Trust-Anker</strong>: DevSecOps integriert Security in den Entwicklungsprozess. Kein Angriffswerkzeug, ausschließlich zur Absicherung.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Moltbot DevSecOps Pipeline: Security im CI/CD</h1>
        <p className="text-lg text-gray-300 mb-8">Security von Anfang an — nicht als Nachgedanke. Integriere automatisierte Security-Checks direkt in deine CI/CD-Pipeline.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔄 GitHub Actions Security Pipeline</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
            <pre>{`# .github/workflows/moltbot-security.yml
name: Moltbot Security Pipeline

on: [push, pull_request]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # 1. Dependency Vulnerability Scan
      - name: npm audit
        run: npm audit --audit-level=high

      # 2. SAST — Static Application Security Testing
      - name: CodeQL Analysis
        uses: github/codeql-action/analyze@v3
        with:
          languages: javascript, typescript

      # 3. Secrets Detection
      - name: TruffleHog Secrets Scan
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: BRANCH_NAME

      # 4. Container Scan
      - name: Build Docker image
        run: docker build -t moltbot:COMMIT_SHA .

      - name: Trivy Container Scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: moltbot:COMMIT_SHA
          severity: CRITICAL,HIGH
          exit-code: 1

      # 5. DAST — Dynamic Security Testing (nur auf Staging)
      - name: OWASP ZAP Scan
        if: github.ref == refs/heads/staging
        uses: zaproxy/action-baseline@v0.10.0
        with:
          target: https://staging.clawguru.org
# Hinweis: Ersetze COMMIT_SHA mit github.sha und BRANCH_NAME mit github.event.repository.default_branch`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">📊 Security Gate Metriken</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { metric: 'SAST Critical Findings', threshold: '0 akzeptiert', icon: '🔴' },
              { metric: 'Dependency CVEs (Critical)', threshold: '0 akzeptiert', icon: '🔴' },
              { metric: 'Container CVEs (Critical)', threshold: '0 akzeptiert', icon: '🔴' },
              { metric: 'Secrets im Code', threshold: '0 akzeptiert', icon: '🔴' },
              { metric: 'SAST High Findings', threshold: '≤ 2 pro Sprint', icon: '🟡' },
              { metric: 'Test Coverage', threshold: '≥ 80%', icon: '🟢' },
              { metric: 'Dependency CVEs (High)', threshold: '≤ 5 gesamt', icon: '🟡' },
              { metric: 'Security Score', threshold: '≥ 85/100', icon: '🟢' },
            ].map(({ metric, threshold, icon }) => (
              <div key={metric} className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg">
                <span className="text-xl">{icon}</span>
                <div>
                  <div className="font-medium text-sm">{metric}</div>
                  <div className="text-xs text-gray-400 font-mono">{threshold}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔗 Weiterführende Ressourcen</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🛡️ Security Check</div><div className="text-sm text-gray-300">Pipeline Status prüfen</div></a>
            <a href="/runbooks" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">📚 DevSecOps Runbooks</div><div className="text-sm text-gray-300">CI/CD Security Guides</div></a>
            <a href="/openclaw" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🔓 OpenClaw</div><div className="text-sm text-gray-300">Open Source Security</div></a>
            <a href="/solutions" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🏢 Enterprise</div><div className="text-sm text-gray-300">Managed DevSecOps</div></a>
          </div>
        </section>
      </div>
    </div>
  );
}
