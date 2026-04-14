import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/openclaw/cicd-security-pipeline"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const title = "CI/CD Security Pipeline: GitLab DevSecOps Setup 2026 | OpenClaw"
  const description = "CI/CD Security Pipeline mit GitLab DevSecOps: SAST, DAST, Secrets Management und Container Scanning für automatisierte Security-Prüfungen in der Pipeline."
  return {
    title,
    description,
    keywords: ["cicd security", "gitlab security", "devsecops pipeline", "sast dast", "security automation"],
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

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Was ist eine sichere CI/CD-Pipeline?', acceptedAnswer: { '@type': 'Answer', text: 'Eine sichere CI/CD-Pipeline integriert automatisierte Security-Checks in jeden Build: SAST (Static Code Analysis), DAST (Dynamic Testing), Dependency-Scanning, Container-Image-Scanning und Secrets-Detection — bevor Code in Produktion geht.' } },
    { '@type': 'Question', name: 'Was ist der Unterschied zwischen SAST und DAST?', acceptedAnswer: { '@type': 'Answer', text: 'SAST (Static Application Security Testing) analysiert Quellcode ohne Ausführung. DAST (Dynamic Application Security Testing) testet laufende Anwendungen auf Schwachstellen. Beide sind notwendig für vollständige CI/CD Security Coverage.' } },
    { '@type': 'Question', name: 'Wie schütze ich Secrets in CI/CD-Pipelines?', acceptedAnswer: { '@type': 'Answer', text: 'Secrets nie in Code oder Umgebungsvariablen hardcoden. Nutze GitLab CI/CD Variables (masked), HashiCorp Vault, oder AWS Secrets Manager. Automatisiertes Secret-Scanning (Gitleaks, GitGuardian) in Pre-Commit-Hooks und Pipeline-Steps.' } },
    { '@type': 'Question', name: 'Welche Tools empfiehlt OpenClaw für CI/CD Security?', acceptedAnswer: { '@type': 'Answer', text: 'OpenClaw empfiehlt: Trivy für Container-Scanning, Semgrep/Bandit für SAST, OWASP ZAP für DAST, Gitleaks für Secret-Detection, Renovate für Dependency-Updates — alle integrierbar in GitLab CI, GitHub Actions und Jenkins.' } },
  ],
}

export default function CicdSecurityPipelinePage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">&quot;Not a Pentest&quot; Hinweis</strong>: Dieser Guide dient der Absicherung eigener CI/CD-Pipelines. Kein Angriffs-Tool.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">CI/CD Security Pipeline: GitLab DevSecOps Setup</h1>
        <p className="text-lg text-gray-300 mb-8">Vollständige DevSecOps-Pipeline mit automatisierten Security-Tests, Secrets Management und Compliance-Checks — für jedes Commit.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Pipeline Security Grundlagen</h2>
          <div className="bg-gray-800 p-4 rounded-lg mb-4 border border-gray-700">
            <h3 className="font-semibold mb-2 text-gray-100">Security Stages</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              <li>Pre-Commit Hooks und lokale Validierung</li>
              <li>Static Application Security Testing (SAST)</li>
              <li>Dependency Scanning und Schwachstellen-Checks</li>
              <li>Container-Image Security Scanning</li>
              <li>Dynamic Application Security Testing (DAST)</li>
              <li>Infrastructure-as-Code Security Testing</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">GitLab CI/CD Security-Konfiguration</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre>
{`# .gitlab-ci.yml - Complete Security Pipeline
stages:
  - pre-build
  - build
  - test
  - security
  - deploy

variables:
  SECURE_LOG_LEVEL: "info"
  SAST_ANALYZER_IMAGE_PREFIX: "$CI_TEMPLATE_REGISTRY_HOST/security-products"
  DAST_ANALYZER_IMAGE_PREFIX: "$CI_TEMPLATE_REGISTRY_HOST/security-products"

# Pre-build security checks
pre-commit-security:
  stage: pre-build
  script:
    - echo "Running pre-commit security checks"
    - git secrets --scan
    - pre-commit run --all-files
  rules:
    - if: '$CI_PIPELINE_SOURCE == "push"'

# SAST - Static Application Security Testing
sast:
  stage: security
  artifacts:
    reports:
      sast: gl-sast-report.json
  rules:
    - if: '$CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH'

# Dependency Scanning
dependency-scanning:
  stage: security
  artifacts:
    reports:
      dependency_scanning: gl-dependency-scanning-report.json
  rules:
    - if: '$CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH'

# Container Scanning
container-scanning:
  stage: security
  variables:
    GIT_STRATEGY: none
  artifacts:
    reports:
      container_scanning: gl-container-scanning-report.json
  rules:
    - if: '$CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH'
      exists:
        - Dockerfile

# Secret Detection
secret-detection:
  stage: security
  artifacts:
    reports:
      secret_detection: gl-secret-detection-report.json
  rules:
    - if: '$CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH'`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Erweiterte Security Pipeline</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre>
{`# Advanced security scanning with custom tools
advanced-security:
  stage: security
  image: python:3.11
  before_script:
    - pip install bandit semgrep safety
  script:
    # Python security scanning
    - bandit -r . -f json -o bandit-report.json
    - semgrep --config=auto --json --output=semgrep-report.json .
    - safety check --json --output=safety-report.json
    
    # Infrastructure security scanning
    - pip install tfsec-checkov
    - checkov --framework terraform --output json --output-file checkov-report.json .
    
    # Container security scanning
    - docker build -t temp-image .
    - trivy image --format json --output trivy-report.json temp-image
  artifacts:
    reports:
      sast: bandit-report.json
    paths:
      - semgrep-report.json
      - safety-report.json
      - checkov-report.json
      - trivy-report.json
  rules:
    - if: '$CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH'

# DAST - Dynamic Application Security Testing
dast:
  stage: security
  variables:
    DAST_WEBSITE: "https://$CI_ENVIRONMENT_URL"
    DAST_FULL_SCAN_ENABLED: "true"
    DAST_BROWSER_SCAN: "true"
  artifacts:
    reports:
      dast: gl-dast-report.json
  rules:
    - if: '$CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH'
      when: manual`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Security Policy Configuration</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre>
{`# .gitlab/security-policy.yml
# Security policy for vulnerability management
security_policy:
  vulnerability_management:
    enabled: true
    cadence: "monthly"
    auto_resolve: false
    
    # Critical vulnerabilities require immediate action
    critical_vulnerabilities:
      auto_create_issue: true
      due_in: "7 days"
      
    # High vulnerabilities
    high_vulnerabilities:
      auto_create_issue: true
      due_in: "30 days"
      
    # Medium vulnerabilities
    medium_vulnerabilities:
      auto_create_issue: false
      due_in: "90 days"

# Approval policies for security
approval_policies:
  security_approvals:
    enabled: true
    rules:
      - name: "Security team approval for critical changes"
        conditions:
          - when: "critical_security_change"
            approvals_required: 2
            eligible_approvers: ["security-team"]`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Security Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">Secrets Management</h3>
              <p className="text-sm text-blue-200">Use GitLab CI/CD variables with masked secrets and integrate with HashiCorp Vault.</p>
            </div>
            <div className="bg-green-900 p-4 rounded-lg border border-green-700">
              <h3 className="font-semibold text-green-300 mb-2">Fail-Fast Security</h3>
              <p className="text-sm text-green-200">Fail the pipeline on critical security issues to prevent deployment.</p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">Compliance Integration</h3>
              <p className="text-sm text-yellow-200">Integrate compliance checks for SOC2, ISO27001, and GDPR requirements.</p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">Continuous Monitoring</h3>
              <p className="text-sm text-red-200">Monitor pipeline security metrics and maintain audit trails.</p>
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
            { "@type": "Question", name: "Was ist eine sichere CI/CD-Pipeline für OpenClaw?", acceptedAnswer: { "@type": "Answer", text: "Eine DevSecOps-Pipeline integriert SAST, DAST, Container-Scanning, Secret-Detection und Signierung in jeden Build — Security-Gates stoppen fehlerhafte Deployments automatisch." } },
            { "@type": "Question", name: "Welche SAST-Tools eignen sich für OpenClaw?", acceptedAnswer: { "@type": "Answer", text: "Semgrep (kostenlos, schnell), Bandit (Python), ESLint-Security (JS/TS). Für Containers: Trivy und Grype. Alle lassen sich in GitHub Actions, GitLab CI und Jenkins integrieren." } },
            { "@type": "Question", name: "Wie verhindere ich Secret-Leaks in der Pipeline?", acceptedAnswer: { "@type": "Answer", text: "git-secrets oder truffleHog als Pre-Commit-Hook. GitLeaks in CI-Pipeline. Niemals Secrets in Umgebungsvariablen im Klartext — immer über Vault oder CI/CD-Secret-Store." } },
          ]},
          { "@context": "https://schema.org", "@type": "WebPage", name: "OpenClaw CI/CD Security Pipeline", description: "DevSecOps Pipeline für OpenClaw: SAST, DAST, Container-Scanning.", url: "https://clawguru.org/de/openclaw/cicd-security-pipeline" },
          { "@context": "https://schema.org", "@type": "HowTo", name: "Sichere CI/CD-Pipeline für OpenClaw aufbauen",
            description: "DevSecOps Pipeline mit SAST, Secret-Detection, Container-Scanning und Signierung für OpenClaw einrichten.",
            totalTime: "PT120M",
            step: [
              { "@type": "HowToStep", name: "Pre-Commit Hooks einrichten", text: "pre-commit install. .pre-commit-config.yaml mit git-secrets, detect-secrets und trailing-whitespace." },
              { "@type": "HowToStep", name: "SAST in Pipeline integrieren", text: "Semgrep-Job in CI hinzufügen: semgrep --config=auto --error. Bei Findings Build abbrechen." },
              { "@type": "HowToStep", name: "Container-Scanning hinzufügen", text: "trivy image --exit-code 1 --severity HIGH,CRITICAL $IMAGE_NAME nach dem Build-Schritt ausführen." },
              { "@type": "HowToStep", name: "Image signieren", text: "cosign sign --key $COSIGN_KEY $IMAGE@$DIGEST nach erfolgreichem Scan. Verify bei Deployment erzwingen." },
              { "@type": "HowToStep", name: "Deployment-Gates konfigurieren", text: "Deployment nur erlauben wenn: alle Tests grün, SAST clean, Image signiert und Scan < 24h alt." },
            ]
          }
        ]) }} />
      </div>
    </div>
  )
}
