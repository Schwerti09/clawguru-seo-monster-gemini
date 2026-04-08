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
  const title = "CI/CD Security Pipeline: GitLab DevSecOps Setup 2026"
  const description = "Complete CI/CD security pipeline guide with GitLab, secrets management, SAST, DAST, and container scanning for DevSecOps automation."
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

export default function CicdSecurityPipelinePage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-sm">
          <strong>"Not a Pentest" Notice</strong>: This guide is for hardening your own systems. No attack tools.
        </div>
        <h1 className="text-4xl font-bold mb-4">CI/CD Security Pipeline: GitLab DevSecOps Setup</h1>
        <p className="text-lg text-gray-600 mb-8">Complete DevSecOps pipeline implementation with automated security testing, secrets management, and compliance checks.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Pipeline Security Fundamentals</h2>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-2">Security Stages</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Pre-commit hooks and local validation</li>
              <li>Static Application Security Testing (SAST)</li>
              <li>Dependency scanning and vulnerability checks</li>
              <li>Container image security scanning</li>
              <li>Dynamic Application Security Testing (DAST)</li>
              <li>Infrastructure as Code security testing</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">GitLab CI/CD Security Configuration</h2>
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
          <h2 className="text-2xl font-semibold mb-4">Advanced Security Pipeline</h2>
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
          <h2 className="text-2xl font-semibold mb-4">Security Policy Configuration</h2>
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
          <h2 className="text-2xl font-semibold mb-4">Security Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Secrets Management</h3>
              <p className="text-sm text-blue-700">Use GitLab CI/CD variables with masked secrets and integrate with HashiCorp Vault.</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Fail-Fast Security</h3>
              <p className="text-sm text-green-700">Fail the pipeline on critical security issues to prevent deployment.</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Compliance Integration</h3>
              <p className="text-sm text-yellow-700">Integrate compliance checks for SOC2, ISO27001, and GDPR requirements.</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-2">Continuous Monitoring</h3>
              <p className="text-sm text-red-700">Monitor pipeline security metrics and maintain audit trails.</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Further Resources</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/securitycheck`} className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100">
              <div className="font-semibold text-blue-600">Security Check</div>
              <div className="text-sm text-gray-600">Scan your system now</div>
            </a>
            <a href={`/${locale}/runbooks`} className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100">
              <div className="font-semibold text-blue-600">Runbooks</div>
              <div className="text-sm text-gray-600">600+ security playbooks</div>
            </a>
            <a href={`/${locale}/openclaw`} className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100">
              <div className="font-semibold text-blue-600">OpenClaw Framework</div>
              <div className="text-sm text-gray-600">Self-hosted security</div>
            </a>
            <a href={`/${locale}/solutions/kubernetes-security-hardening`} className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100">
              <div className="font-semibold text-blue-600">Kubernetes Security</div>
              <div className="text-sm text-gray-600">Complete hardening guide</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
