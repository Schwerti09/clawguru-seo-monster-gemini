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
      ? "Trivy Security 2026 | Container & Cloud-Native Scanner"
      : "Trivy Security 2026 | Container & Cloud-Native Scanner",
    description: locale === "de"
      ? "Trivy Security: Container Images, Kubernetes, Infrastructure as Code & Repository Scanning."
      : "Trivy security: container images, Kubernetes, infrastructure as code & repository scanning.",
    keywords: [
      "Trivy security",
      "Trivy scanner",
      "Container scanning",
      "Kubernetes security scanning",
      "IaC scanning",
      "Aqua Security",
      "Vulnerability scanner",
      "SBOM generation",
      "Open source scanner",
      "DevSecOps scanning",
    ],
    alternates: {
      canonical: `/${locale}/trivy-security`,
      ...localeAlternates(`/${locale}/trivy-security`),
    },
    openGraph: {
      title: "Trivy Security 2026: Cloud-Native Scanning",
      description: "Scan containers, Kubernetes, IaC & repositories with Trivy open source scanner.",
      type: "article",
      url: `${BASE_URL}/${locale}/trivy-security`,
    },
  };
}

export default async function TrivySecurityPage({
  params,
}: {
  params: { lang: string };
}) {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Trivy Security</h1>
            <p className="text-2xl text-cyan-200 mb-4">Cloud-Native Security Scanner 2026</p>
            <p className="text-xl text-white/80 mb-8">Container Images, Kubernetes, Infrastructure as Code & Repository Scanning</p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Containers</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Kubernetes</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">IaC</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">SBOM</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Trivy Scanner Overview</h2>
            <p className="text-slate-700 text-lg mb-6">
              Trivy ist der führende Open-Source Security Scanner von Aqua Security. Ein einziges Tool für Container Images, Filesystem, Git Repositories, Kubernetes und Infrastructure as Code.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-6">
                <h3 className="font-semibold text-cyan-900 mb-2">Image Scanning</h3>
                <ul className="text-sm text-cyan-800 space-y-1">
                  <li>• OS Packages</li>
                  <li>• Language Packages</li>
                  <li>• Secret Detection</li>
                  <li>• Misconfigurations</li>
                </ul>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-2">Kubernetes</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Cluster Scanning</li>
                  <li>• Resource Scanning</li>
                  <li>• RBAC Analysis</li>
                  <li>• Compliance Checks</li>
                </ul>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                <h3 className="font-semibold text-indigo-900 mb-2">IaC & Repos</h3>
                <ul className="text-sm text-indigo-800 space-y-1">
                  <li>• Terraform</li>
                  <li>• CloudFormation</li>
                  <li>• Dockerfile</li>
                  <li>• Git Repository</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Trivy CLI & CI/CD</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# Trivy Installation

# macOS
brew install aquasecurity/trivy/trivy

# Linux
curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin

# Docker
docker pull aquasec/trivy:latest

# Container Image Scanning
trivy image nginx:latest
trivy image --severity HIGH,CRITICAL nginx:latest
trivy image --exit-code 1 --severity CRITICAL nginx:latest

# Scan with SBOM output
trivy image --format cyclonedx -o sbom.json nginx:latest
trivy image --format spdx-json -o spdx.json nginx:latest

# Filesystem Scanning
trivy filesystem /path/to/project
trivy fs --scanners vuln,secret,config /path/to/project

# Git Repository Scanning
trivy repo https://github.com/myorg/myrepo
trivy repo --branch main /path/to/local/repo

# Kubernetes Scanning
trivy kubernetes --report summary cluster
trivy k8s --namespace production deployment/myapp

# Config/IaC Scanning
trivy config /path/to/terraform
trivy config --severity HIGH /path/to/k8s-manifests

# CI/CD - GitHub Actions
# .github/workflows/trivy.yml
name: Trivy Security Scan

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * 1'  # Weekly on Monday

jobs:
  image-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Build Docker Image
        run: docker build -t myapp:${{ github.sha }} .
      
      - name: Trivy Image Scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'myapp:${{ github.sha }}'
          format: 'sarif'
          output: 'trivy-image-results.sarif'
          severity: 'CRITICAL,HIGH'
          exit-code: '1'
      
      - name: Upload SARIF
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-image-results.sarif'

  filesystem-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Trivy FS Scan
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-fs-results.sarif'
          scanners: 'vuln,secret,config'
          severity: 'CRITICAL,HIGH'
      
      - name: Upload SARIF
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-fs-results.sarif'

# GitLab CI
# .gitlab-ci.yml

trivy-image:
  stage: security
  image: docker:stable
  services:
    - docker:dind
  script:
    - docker build -t $CI_PROJECT_NAME:$CI_COMMIT_SHA .
    - docker run --rm -v /var/run/docker.sock:/var/run/docker.sock
        -v $(pwd):/tmp
        aquasec/trivy:latest image
        --exit-code 1
        --severity CRITICAL
        --format template
        --template "@/contrib/gitlab.tpl"
        -o /tmp/gl-container-scanning-report.json
        $CI_PROJECT_NAME:$CI_COMMIT_SHA
  artifacts:
    reports:
      container_scanning: gl-container-scanning-report.json
  only:
    - merge_requests
    - main`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Trivy Configuration & Policies</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# trivy.yaml - Configuration File

# Global options
severity:
  - HIGH
  - CRITICAL

vulnerability:
  type:
    - os
    - library
  
  # Skip vulnerabilities by ID
  ignore-unfixed: false
  
scan:
  # Scanners to use
  scanners:
    - vuln
    - misconfig
    - secret
  
  # Skip directories
  skip-dirs:
    - ./vendor
    - ./node_modules
    - ./test
    - ./tests
  
  # Skip files
  skip-files:
    - "*.test.js"
    - "*_test.go"

# Secret detection
secret:
  config-path: .trivy-secret.yaml
  
# Misconfiguration
misconfiguration:
  terraform:
    exclude-downloaded-modules: true
  
  # Skip checks by ID
  skip-checks:
    - AVD-DS-0001  # Skip specific Dockerfile check

# Database update
db:
  repository: ghcr.io/aquasecurity/trivy-db
  java-repository: ghcr.io/aquasecurity/trivy-java-db

# Output format
format: table

# Ignore file (vulnerabilities to skip)
# .trivyignore

# Ignore specific CVEs
CVE-2023-1234
CVE-2023-5678

# Ignore with expiration
CVE-2023-9999 exp:2026-06-01

# Ignore with comment
CVE-2023-1111 # Not affected - internal network only

# Ignore by severity
# (in trivy.yaml or CLI)

# Custom Secret Detection Rules
# .trivy-secret.yaml

rules:
  # Custom API Key Pattern
  - id: custom-api-key
    category: api-key
    title: Custom API Key
    severity: CRITICAL
    regex: (?i)custom-api-key\\s*=\\s*["\']([a-z0-9]{32})["\']
    keywords:
      - custom-api-key
  
  # Internal JWT Pattern  
  - id: internal-jwt
    category: jwt
    title: Internal JWT Token
    severity: HIGH
    regex: eyJ[a-zA-Z0-9_-]*\.eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*
    keywords:
      - eyJ

# Kubernetes Scanning with Trivy Operator
# trivy-operator-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: trivy-operator
  namespace: trivy-system
spec:
  replicas: 1
  selector:
    matchLabels:
      app: trivy-operator
  template:
    metadata:
      labels:
        app: trivy-operator
    spec:
      containers:
      - name: operator
        image: aquasec/trivy-operator:latest
        env:
        - name: OPERATOR_LOG_DEV_MODE
          value: "false"
        - name: OPERATOR_SCANNER_REPORT_TTL
          value: "24h"
        - name: OPERATOR_CONCURRENT_SCAN_JOBS_LIMIT
          value: "10"
        - name: OPERATOR_SCAN_JOB_TIMEOUT
          value: "5m"`}
              </pre>
            </div>
          </section>

          <section className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Trivy Security Assessment</h2>
            <a href="/check" className="inline-block px-6 py-3 bg-white text-cyan-600 rounded-lg font-semibold">Assessment Starten</a>
          </section>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "Trivy Security 2026",
        author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        datePublished: "2026-03-29",
      })}} />
    </main>
  );
}
