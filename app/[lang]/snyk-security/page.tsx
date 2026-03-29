import type { Metadata } from "next";
import { SUPPORTED_LOCALES, type Locale, localeAlternates } from "@/lib/i18n";
import { BASE_URL } from "@/lib/config";

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
      ? "Snyk Security 2026 | Developer-First Security Platform"
      : "Snyk Security 2026 | Developer-First Security Platform",
    description: locale === "de"
      ? "Snyk Security: SAST, SCA, Container Security, IaC Security & Code Advisor. Entwickler-zentrierte Sicherheit."
      : "Snyk security: SAST, SCA, container security, IaC security & code advisor. Developer-first security.",
    keywords: [
      "Snyk security",
      "Snyk SAST",
      "Snyk SCA",
      "Snyk container",
      "Snyk IaC",
      "Developer security",
      "Code security",
      "Dependency scanning",
      "Vulnerability management",
      "DevSecOps platform",
    ],
    alternates: {
      canonical: `/${locale}/snyk-security`,
      ...localeAlternates(`/${locale}/snyk-security`),
    },
    openGraph: {
      title: "Snyk Security 2026: Developer-First Protection",
      description: "Secure code with Snyk SAST, SCA, container scanning & IaC security.",
      type: "article",
      url: `${BASE_URL}/${locale}/snyk-security`,
    },
  };
}

export default async function SnykSecurityPage({
  params,
}: {
  params: { lang: string };
}) {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Snyk Security</h1>
            <p className="text-2xl text-purple-200 mb-4">Developer-First Security Platform 2026</p>
            <p className="text-xl text-white/80 mb-8">SAST, SCA, Container Security, IaC Security & Code Advisor</p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">SAST</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">SCA</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Container</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">IaC</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Snyk Security Platform</h2>
            <p className="text-slate-700 text-lg mb-6">
              Snyk ist die führende Developer-First Security Platform. Entwickler können direkt in ihrer IDE und CI/CD Security Issues finden und fixen - ohne Security-Experten zu blockieren.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <h3 className="font-semibold text-purple-900 mb-2">Snyk Code (SAST)</h3>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Static Analysis</li>
                  <li>• IDE Integration</li>
                  <li>• AI Fix Suggestions</li>
                  <li>• Custom Rules</li>
                </ul>
              </div>
              <div className="bg-violet-50 border border-violet-200 rounded-xl p-6">
                <h3 className="font-semibold text-violet-900 mb-2">Snyk Open Source</h3>
                <ul className="text-sm text-violet-800 space-y-1">
                  <li>• Dependency Scanning</li>
                  <li>• License Compliance</li>
                  <li>• Fix PRs</li>
                  <li>• SBOM Generation</li>
                </ul>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                <h3 className="font-semibold text-indigo-900 mb-2">Snyk Container</h3>
                <ul className="text-sm text-indigo-800 space-y-1">
                  <li>• Base Image Scan</li>
                  <li>• Dockerfile Analysis</li>
                  <li>• Kubernetes Scan</li>
                  <li>• Remediation Advice</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Snyk CLI & CI/CD Integration</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# Snyk CLI Installation & Authentication

# Install Snyk CLI
npm install -g snyk
# oder
brew install snyk
# oder
curl -sL https://static.snyk.io/cli/latest/snyk-linux -o snyk && chmod +x snyk

# Authenticate
snyk auth
# Öffnet Browser für SSO/SAML Auth

# Test Project
snyk test
snyk test --severity-threshold=high
snyk test --json > snyk-report.json

# Monitor für kontinuierliches Tracking
snyk monitor --project-name=my-app

# GitHub Actions Integration
# .github/workflows/snyk.yml
name: Snyk Security

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Install Snyk CLI
        uses: snyk/actions/setup@master
      
      - name: Snyk Code (SAST)
        run: snyk code test --severity-threshold=medium
        env:
          SNYK_TOKEN: $\{\{ secrets.SNYK_TOKEN }\}
        continue-on-error: true
      
      - name: Snyk Open Source (SCA)
        run: snyk test --severity-threshold=high
        env:
          SNYK_TOKEN: $\{\{ secrets.SNYK_TOKEN }\}
      
      - name: Snyk Container
        run: snyk container test myapp:latest --file=Dockerfile
        env:
          SNYK_TOKEN: $\{\{ secrets.SNYK_TOKEN }\}
      
      - name: Snyk IaC
        run: snyk iac test
        env:
          SNYK_TOKEN: $\{\{ secrets.SNYK_TOKEN }\}
      
      - name: Upload SARIF to GitHub
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: snyk.sarif

# GitLab CI Integration
# .gitlab-ci.yml

stages:
  - test
  - security

snyk-sast:
  stage: security
  image: node:20-alpine
  script:
    - npm install -g snyk
    - snyk auth $SNYK_TOKEN
    - snyk code test --severity-threshold=medium
  only:
    - merge_requests
    - main

snyk-sca:
  stage: security
  image: node:20-alpine
  script:
    - npm install -g snyk
    - snyk auth $SNYK_TOKEN
    - snyk test --severity-threshold=high
  only:
    - merge_requests
    - main

snyk-container:
  stage: security
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t $CI_PROJECT_NAME:$CI_COMMIT_SHA .
    - snyk auth $SNYK_TOKEN
    - snyk container test $CI_PROJECT_NAME:$CI_COMMIT_SHA
  only:
    - merge_requests
    - main`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Snyk Policies & Security Gates</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# Snyk Policy File (.snyk)

# Ignore specific vulnerabilities (with reason!)
ignore:
  SNYK-JS-LODASH-567890:
    - '*':
        reason: 'Not affected - we dont use the vulnerable function'
        expires: '2026-06-01T00:00:00.000Z'
        created: '2026-03-29T10:00:00.000Z'
  
  SNYK-JS-AXIOS-123456:
    - 'axios@0.21.0':
        reason: 'Internal API only, not exposed'
        expires: '2026-04-01T00:00:00.000Z'

# Patch vulnerabilities (Snyk patches)
patch:
  SNYK-JS-EVENTSTREAM-12345:
    - '*':
        patched: '2026-03-29T10:00:00.000Z'

# Policy für License Compliance
version: v1.25.0
ignore: {}
patch: {}
licensePolicy:
  severity: high
  rules:
    # Allow these licenses
    - license: MIT
      severity: none
    - license: Apache-2.0
      severity: none
    - license: BSD-3-Clause
      severity: none
    - license: ISC
      severity: none
    
    # Flag these licenses
    - license: GPL-2.0
      severity: high
      reason: 'Copyleft license requires open sourcing'
    - license: GPL-3.0
      severity: high
      reason: 'Copyleft license requires open sourcing'
    - license: AGPL-3.0
      severity: critical
      reason: 'Strong copyleft, network usage triggers obligations'

# Snyk Code (SAST) Configuration
# .snyk für Code Analysis
code:
  analysis:
    severityThreshold: medium
    
  # Custom Rules (Enterprise)
  rules:
    - id: custom-no-hardcoded-secrets
      name: 'No Hardcoded Secrets'
      severity: critical
      pattern: '(password|secret|key|token)\\s*=\\s*["\'][^"\']+["\']'

# snyk.config.json (Project Level)
{
  "severityThreshold": "high",
  "failOn": "all",
  "json": false,
  "sarif": true,
  "prune-repeated-subdependencies": true,
  "show-vulnerable-paths": true,
  "strict-out-of-sync": true,
  "trust-policies": true,
  "experimental-dep-graph": true,
  "all-projects": false
}

# Org-Level Policies (Snyk Web UI)
# Settings > Policies > Security Policy

securityPolicy:
  name: "Production Security Gate"
  rules:
    - type: vulnerability
      severity: [critical, high]
      exploitMaturity: [mature, proof-of-concept]
      action: block
      
    - type: license
      severities: [high, critical]
      action: block
      
    - type: cvssScore
      score: 7.0
      action: block`}
              </pre>
            </div>
          </section>

          <section className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Snyk Security Assessment</h2>
            <a href="/check" className="inline-block px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold">Assessment Starten</a>
          </section>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "Snyk Security 2026",
        author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        datePublished: "2026-03-29",
      })}} />
    </main>
  );
}
