import type { Metadata } from "next";
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n";
import { BASE_URL } from "@/lib/config";
import { getCoreSecurityLinks } from "@/lib/core-security-links";

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
      ? "GitLab CI/CD Security 2026 | Pipeline Security & Compliance"
      : "GitLab CI/CD Security 2026 | Pipeline Security & Compliance",
    description: locale === "de"
      ? "GitLab CI/CD Security: Secrets Management, SAST/DAST, Container Scanning, Compliance Pipelines, OIDC & Vault Integration."
      : "GitLab CI/CD security: secrets management, SAST/DAST, container scanning, compliance pipelines, OIDC & Vault integration.",
    keywords: [
      "GitLab CI/CD security",
      "GitLab pipeline security",
      "GitLab SAST",
      "GitLab DAST",
      "GitLab secrets",
      "GitLab compliance",
      "GitLab OIDC",
      "GitLab Vault",
      "DevSecOps",
      "Pipeline security",
    ],
    alternates: buildLocalizedAlternates(locale, "/gitlab-cicd-security"),
    openGraph: {
      images: ["/og-image.png"],
      title: "GitLab CI/CD Security 2026: DevSecOps Pipeline Protection",
      description: "Secure GitLab CI/CD with SAST, secrets management, compliance & OIDC.",
      type: "article",
      url: `${BASE_URL}/${locale}/gitlab-cicd-security`,
    },
  };
}

export default async function GitLabSecurityPage({
  params,
}: {
  params: { lang: string };
}) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale;
  const prefix = `/${locale}`;
  const coreLinks = getCoreSecurityLinks(locale);
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: locale === 'de' ? 'Wie sichere ich GitLab CI/CD Secrets ab?' : 'How do I secure GitLab CI/CD secrets?', acceptedAnswer: { '@type': 'Answer', text: locale === 'de' ? 'GitLab CI/CD Variables in den Project/Group Settings speichern, nicht im .gitlab-ci.yml. Protected Variables nur für Protected Branches/Tags. Masked Variables werden in Logs ausgeblendet. Für Enterprise: HashiCorp Vault Integration für dynamische Secrets.' : 'Store GitLab CI/CD variables in Project/Group Settings, not in .gitlab-ci.yml. Protected Variables only for protected branches/tags. Masked Variables are hidden in logs. For enterprise: HashiCorp Vault integration for dynamic secrets.' } },
      { '@type': 'Question', name: locale === 'de' ? 'Was sind GitLab Protected Branches?' : 'What are GitLab protected branches?', acceptedAnswer: { '@type': 'Answer', text: locale === 'de' ? 'Protected Branches verhindern direktes Pushen auf main/production ohne Merge Request. Konfiguration: Settings > Repository > Protected Branches. Allowed to merge: Maintainers, Allowed to push: No one. Erzwingt Code Review und verhindert direkten Code-Push in Production.' : 'Protected branches prevent direct pushing to main/production without merge request. Configuration: Settings > Repository > Protected Branches. Allowed to merge: Maintainers, Allowed to push: No one. Enforces code review and prevents direct code push to production.' } },
      { '@type': 'Question', name: locale === 'de' ? 'Wie aktiviere ich SAST in GitLab CI?' : 'How do I enable SAST in GitLab CI?', acceptedAnswer: { '@type': 'Answer', text: locale === 'de' ? 'GitLab SAST in .gitlab-ci.yml einbinden: include: template: Security/SAST.gitlab-ci.yml. Unterstützt 15+ Sprachen automatisch. Findings erscheinen im Merge Request als Security-Report. GitLab Ultimate: Vulnerability Management Dashboard für zentrales Tracking.' : 'Include GitLab SAST in .gitlab-ci.yml: include: template: Security/SAST.gitlab-ci.yml. Supports 15+ languages automatically. Findings appear in merge request as security report. GitLab Ultimate: Vulnerability Management Dashboard for central tracking.' } },
      { '@type': 'Question', name: locale === 'de' ? 'Wie schütze ich GitLab Runner?' : 'How do I protect GitLab Runner?', acceptedAnswer: { '@type': 'Answer', text: locale === 'de' ? 'GitLab Runner Hardening: Eigene Runner (nicht Shared) für sensitive Pipelines. Runner Tags für Job-Routing. Runner auf dedizierter VM isolieren. Docker Executor mit --no-new-privileges. Regelmäßige Runner-Updates. Runner Token rotieren. Job Timeout konfigurieren.' : 'GitLab Runner hardening: own runners (not shared) for sensitive pipelines. Runner tags for job routing. Isolate runner on dedicated VM. Docker executor with --no-new-privileges. Regular runner updates. Rotate runner token. Configure job timeout.' } },
    ],
  }
  return (
    <main className="min-h-screen bg-gray-800">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-red-600 to-pink-700 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">GitLab CI/CD Security</h1>
            <p className="text-2xl text-orange-200 mb-4">DevSecOps Pipeline Protection 2026</p>
            <p className="text-xl text-white/80 mb-8">SAST, DAST, Secrets Management, Compliance, OIDC & Vault Integration</p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">SAST</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">DAST</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">OIDC</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Vault</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">GitLab CI/CD Security Architecture</h2>
            <p className="text-gray-200 text-lg mb-6">
              Moderne CI/CD-Pipelines sind High-Value Targets. GitLab bietet integrierte DevSecOps-Funktionen: Statische und dynamische Sicherheitstests, Secret Detection, Container Scanning und Compliance-Pipelines.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-orange-50 border border-orange-700 rounded-xl p-6">
                <h3 className="font-semibold text-orange-900 mb-2">Code Security</h3>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• SAST (Statische Analyse)</li>
                  <li>• Secret Detection</li>
                  <li>• Dependency Scanning</li>
                  <li>• License Compliance</li>
                </ul>
              </div>
              <div className="bg-red-900 border border-red-700 rounded-xl p-6">
                <h3 className="font-semibold text-red-900 mb-2">Runtime Security</h3>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• DAST (Dynamische Tests)</li>
                  <li>• Container Scanning</li>
                  <li>• Fuzz Testing</li>
                  <li>• Coverage-guided</li>
                </ul>
              </div>
              <div className="bg-pink-50 border border-pink-200 rounded-xl p-6">
                <h3 className="font-semibold text-pink-900 mb-2">Pipeline Security</h3>
                <ul className="text-sm text-pink-800 space-y-1">
                  <li>• OIDC Authentication</li>
                  <li>• Vault Integration</li>
                  <li>• Compliance Pipelines</li>
                  <li>• Approval Gates</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Secure CI/CD Pipeline (.gitlab-ci.yml)</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# .gitlab-ci.yml - Secure DevSecOps Pipeline

stages:
  - test
  - security
  - build
  - deploy

variables:
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: "/certs"
  # Never embed secrets in variables
  VAULT_ADDR: "https://vault.company.com"

# Security Templates
include:
  - template: Security/SAST.gitlab-ci.yml
  - template: Security/Secret-Detection.gitlab-ci.yml
  - template: Security/Dependency-Scanning.gitlab-ci.yml
  - template: Security/Container-Scanning.gitlab-ci.yml
  - template: Security/DAST.gitlab-ci.yml

# Pre-job: Authenticate to Vault
.vault-auth:
  id_tokens:
    VAULT_ID_TOKEN:
      aud: $\${VAULT_ADDR}
  script:
    - export VAULT_TOKEN=$(
        curl -s --request POST \\\n          --header "X-Vault-Namespace: admin" \\\n          --data "{ \\"jwt\\": \\"$\${VAULT_ID_TOKEN}\\", \\"role\\": \\"$\${CI_PROJECT_NAME}\\" }" \\\n          $\${VAULT_ADDR}/v1/auth/jwt/login | jq -r '.auth.client_token'
      )
    - vault kv get -field=api_key secret/data/$\${CI_PROJECT_NAME}/prod

# SAST Configuration
sast:
  stage: security
  variables:
    SAST_EXCLUDED_PATHS: "spec, test, tests, tmp, node_modules"
    SAST_ANALYZER_IMAGE_TAG: "latest"
  artifacts:
    reports:
      sast: gl-sast-report.json
    paths:
      - gl-sast-report.json
    expire_in: 1 week

# Secret Detection
secret_detection:
  stage: security
  variables:
    SECRET_DETECTION_HISTORIC_SCAN: "false"
    SECRET_DETECTION_EXCLUDED_PATHS: "tests/"
  artifacts:
    reports:
      secret_detection: gl-secret-detection-report.json
    expire_in: 1 week

# Dependency Scanning
dependency_scanning:
  stage: security
  variables:
    DS_EXCLUDED_PATHS: "tests/"
    DS_DEFAULT_ANALYZERS: "bundler-audit,gemnasium,gemnasium-maven"
  artifacts:
    reports:
      dependency_scanning: gl-dependency-scanning-report.json
    expire_in: 1 week

# Container Scanning with Trivy
container_scanning:
  stage: security
  image: aquasec/trivy:latest
  variables:
    TRIVY_CACHE_DIR: ".trivycache/"
    TRIVY_NO_PROGRESS: "true"
    TRIVY_EXIT_CODE: "1"  # Fail on CRITICAL
    TRIVY_SEVERITY: "CRITICAL,HIGH"
  script:
    - trivy fs --scanners vuln,secret,misconfig .
    - trivy image --exit-code $\${TRIVY_EXIT_CODE} \\\n        --severity $\${TRIVY_SEVERITY} \\\n        $\${CI_REGISTRY_IMAGE}:$\${CI_COMMIT_SHA}
  cache:
    paths:
      - .trivycache/

# DAST (Dynamic Application Security Testing)
dast:
  stage: security
  variables:
    DAST_WEBSITE: "$\${CI_ENVIRONMENT_URL}"
    DAST_FULL_SCAN_ENABLED: "true"
    DAST_ZAP_USE_AJAX_SPIDER: "true"
    DAST_ZAP_ACTIVE_SCAN: "true"
  rules:
    - if: $CI_PIPELINE_SOURCE == "schedule"  # Nightly only
      when: always
    - if: $CI_COMMIT_BRANCH == "main"
      when: manual  # Manual on main

# Build with security hardening
build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build \\\n        --build-arg VAULT_TOKEN=$\${VAULT_TOKEN} \\\n        --tag $\${CI_REGISTRY_IMAGE}:$\${CI_COMMIT_SHA} \\\n        --tag $\${CI_REGISTRY_IMAGE}:latest \\\n        --file Dockerfile \\\n        .
    - docker push $\${CI_REGISTRY_IMAGE}:$\${CI_COMMIT_SHA}
  rules:
    - if: $CI_COMMIT_BRANCH == "main"

# Deploy with approval
deploy_production:
  stage: deploy
  environment:
    name: production
    url: https://app.company.com
  script:
    - kubectl set image deployment/app app=$\${CI_REGISTRY_IMAGE}:$\${CI_COMMIT_SHA}
  needs:
    - job: container_scanning
      artifacts: true
    - job: sast
      artifacts: true
    - job: dependency_scanning
      artifacts: true
  when: manual  # Require manual approval
  only:
    - main`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">OIDC Authentication (Vault/AWS/Azure)</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# .gitlab-ci.yml - OIDC Authentication (No Long-Term Secrets)

# AWS OIDC Authentication
.aws-oidc:
  id_tokens:
    GITLAB_ID_TOKEN:
      aud: https://gitlab.company.com
  script:
    - |
      # Configure AWS with OIDC
      export AWS_WEB_IDENTITY_TOKEN=$\${GITLAB_ID_TOKEN}
      export AWS_ROLE_ARN=arn:aws:iam::123456789:role/GitLabCIRole
      
      # Assume role via OIDC
      aws sts assume-role-with-web-identity \\\n        --role-arn $\${AWS_ROLE_ARN} \\\n        --web-identity-token $\${GITLAB_ID_TOKEN} \\\n        --duration-seconds 3600 > /tmp/credentials.json
      
      export AWS_ACCESS_KEY_ID=$(cat /tmp/credentials.json | jq -r '.Credentials.AccessKeyId')
      export AWS_SECRET_ACCESS_KEY=$(cat /tmp/credentials.json | jq -r '.Credentials.SecretAccessKey')
      export AWS_SESSION_TOKEN=$(cat /tmp/credentials.json | jq -r '.Credentials.SessionToken')

# Vault OIDC Authentication
.vault-oidc:
  id_tokens:
    VAULT_JWT:
      aud: vault.company.com
  script:
    - |
      # Authenticate to Vault via OIDC
      VAULT_TOKEN=$(curl -s -X POST \\\n        -H "Content-Type: application/json" \\\n        -d "{ \\"role\\": \\"$\${CI_PROJECT_PATH_SLUG}\\", \\"jwt\\": \\"$\${VAULT_JWT}\\" }" \\\n        https://vault.company.com/v1/auth/jwt/login | jq -r '.auth.client_token')
      
      export VAULT_TOKEN
      
      # Fetch dynamic AWS credentials from Vault
      aws_creds=$(vault read -format=json aws/creds/deploy-role)
      export AWS_ACCESS_KEY_ID=$(echo $aws_creds | jq -r '.data.access_key')
      export AWS_SECRET_ACCESS_KEY=$(echo $aws_creds | jq -r '.data.secret_key')

# Azure OIDC
.azure-oidc:
  id_tokens:
    GITLAB_ID_TOKEN:
      aud: api://AzureADTokenExchange
  script:
    - |
      # Azure OIDC login
      az login --service-principal \\\n        --username $\${AZURE_CLIENT_ID} \\\n        --tenant $\${AZURE_TENANT_ID} \\\n        --federated-token $\${GITLAB_ID_TOKEN} \\\n        --allow-no-subscriptions
      
      # Get AKS credentials
      az aks get-credentials \\\n        --resource-group production-rg \\\n        --name production-cluster`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Compliance Pipeline (SOC 2/ISO 27001)</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# .gitlab-ci.yml - Compliance Pipeline

compliance_check:
  stage: .pre
  image: alpine:latest
  script:
    # Check branch naming convention
    - |
      if [[ ! "$\${CI_COMMIT_BRANCH}" =~ ^(feature|bugfix|hotfix|release)/.*$ ]]; then
        echo "ERROR: Branch name does not follow convention"
        exit 1
      fi
    
    # Require issue link in commit
    - |
      if ! git log -1 --pretty=%B | grep -qE "(Closes|Fixes|Refs) #[0-9]+"; then
        echo "WARNING: No issue reference in commit"
      fi
    
    # Check DCO sign-off
    - |
      if ! git log -1 --pretty=%B | grep -q "Signed-off-by:"; then
        echo "ERROR: DCO sign-off missing"
        exit 1
      fi

# Artifact retention for compliance
.compliance_retention:
  artifacts:
    expire_in: 7 years  # SOC 2 requirement
    reports:
      junit: junit.xml
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

# Audit trail
audit_trail:
  stage: deploy
  script:
    - |
      # Log deployment to audit system
      curl -X POST https://audit.company.com/api/events \\\n        -H "Authorization: Bearer $\${AUDIT_TOKEN}" \\\n        -d "{
          \\"event_type\\": \\"deployment\\",
          \\"project\\": \\"$\${CI_PROJECT_PATH}\\",
          \\"commit_sha\\": \\"$\${CI_COMMIT_SHA}\\",
          \\"user\\": \\"$\${GITLAB_USER_LOGIN}\\",
          \\"environment\\": \\"$\${CI_ENVIRONMENT_NAME}\\",
          \\"pipeline_id\\": \\"$\${CI_PIPELINE_ID}\\"
        }"`}
              </pre>
            </div>
          </section>

          <section className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">GitLab CI/CD Security Assessment</h2>
            <a href={coreLinks.check} className="inline-block px-6 py-3 bg-gray-800 text-orange-400 rounded-lg font-semibold">Assessment Starten</a>
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
        headline: "GitLab CI/CD Security 2026",
        author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        datePublished: "2026-03-29",
      })}} />
    </main>
  );
}
