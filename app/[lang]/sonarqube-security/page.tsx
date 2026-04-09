import type { Metadata } from "next";
import { SUPPORTED_LOCALES, type Locale, localeAlternates } from "@/lib/i18n";
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
      ? "SonarQube Security 2026 | SAST Security & Code Quality"
      : "SonarQube Security 2026 | SAST Security & Code Quality",
    description: locale === "de"
      ? "SonarQube Security: Authentication, Permissions, Quality Gates, Secret Detection & Clean Code."
      : "SonarQube security: authentication, permissions, quality gates, secret detection & clean code.",
    keywords: [
      "SonarQube security",
      "SonarQube hardening",
      "SonarQube permissions",
      "SonarQube quality gate",
      "SonarQube secret detection",
      "SAST security",
      "Code quality security",
      "SonarQube authentication",
      "SonarQube best practices",
      "Clean code security",
    ],
    alternates: {
      ...localeAlternates(`/${locale}/sonarqube-security`),
    },
    openGraph: {
      title: "SonarQube Security 2026: SAST Protection",
      description: "Secure SonarQube with authentication, permissions, quality gates & secret detection.",
      type: "article",
      url: `${BASE_URL}/${locale}/sonarqube-security`,
    },
  };
}

export default async function SonarQubeSecurityPage({
  params,
}: {
  params: { lang: string };
}) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale;
  const prefix = `/${locale}`;
  const coreLinks = getCoreSecurityLinks(locale);
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">SonarQube Security</h1>
            <p className="text-2xl text-blue-200 mb-4">SAST & Code Quality Security 2026</p>
            <p className="text-xl text-white/80 mb-8">Authentication, Permissions, Quality Gates, Secret Detection & Clean Code</p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">SAST</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Quality Gate</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Secrets</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Permissions</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">SonarQube Security Architecture</h2>
            <p className="text-slate-700 text-lg mb-6">
              SonarQube enthält Source Code und Sicherheitsberichte. Kompromittierte Instanz = Source Code Leak. Strikte Authentifizierung, Quality Gates und Secret Detection sind essentiell.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-6">
                <h3 className="font-semibold text-sky-900 mb-2">Authentication</h3>
                <ul className="text-sm text-sky-800 space-y-1">
                  <li>• SAML/SSO</li>
                  <li>• LDAP</li>
                  <li>• GitHub OAuth</li>
                  <li>• Token Management</li>
                </ul>
              </div>
              <div className="bg-blue-900 border border-blue-700 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-2">Access Control</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Permissions Templates</li>
                  <li>• Project Visibility</li>
                  <li>• Group Management</li>
                  <li>• Portfolio Access</li>
                </ul>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                <h3 className="font-semibold text-indigo-900 mb-2">Security Analysis</h3>
                <ul className="text-sm text-indigo-800 space-y-1">
                  <li>• Quality Gates</li>
                  <li>• Secret Detection</li>
                  <li>• Vulnerability Rules</li>
                  <li>• Hotspot Review</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Authentication & SSO Configuration</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# sonar.properties - Security Configuration
# /opt/sonarqube/conf/sonar.properties

# Disable force authentication (require for public projects only)
sonar.forceAuthentication=true

# Session settings
sonar.web.sessionTimeoutInMinutes=480

# SSO Configuration (SAML)
sonar.auth.saml.enabled=true
sonar.auth.saml.applicationId=sonarqube
sonar.auth.saml.providerId=https://company.okta.com/exk1234567890/sso/saml
sonar.auth.saml.providerName=Okta SSO
sonar.auth.saml.signRequest=true
sonar.auth.saml.samlGroupAttribute=groups
sonar.auth.saml.samlNameIdFormat=urn:oasis:names:tc:SAML:2.0:nameid-format:persistent
sonar.auth.saml.certificate.secured=-----BEGIN CERTIFICATE-----\\n...
sonar.auth.saml.privateKey.secured=-----BEGIN PRIVATE KEY-----\\n...

# LDAP Configuration (Alternative)
sonar.security.realm=LDAP
ldap.url=ldaps://ldap.company.com:636
ldap.bindDn=cn=sonarqube,dc=company,dc=com
ldap.bindPassword=\${env:LDAP_PASSWORD}
ldap.authentication=simple
ldap.user.baseDn=ou=users,dc=company,dc=com
ldap.user.request=(&(objectClass=person)(uid={login}))
ldap.user.realNameAttribute=cn
ldap.user.emailAttribute=mail

# LDAP Group Mapping
ldap.group.baseDn=ou=groups,dc=company,dc=com
ldap.group.request=(&(objectClass=group)(member={dn}))
ldap.group.idAttribute=cn

# GitHub OAuth (for GitHub Enterprise)
sonar.auth.github.enabled=true
sonar.auth.github.clientId.secured=Iv1.xxxxxxxxxxxxxxxx
sonar.auth.github.clientSecret.secured=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
sonar.auth.github.groupsSync=true
sonar.auth.github.apiUrl=https://github.company.com/api/v3/
sonar.auth.github.webUrl=https://github.company.com/
sonar.auth.github.allowedOrganizations=company

# Force base URL
sonar.core.serverBaseURL=https://sonarqube.company.com

# Proxy settings (if behind reverse proxy)
sonar.web.javaAdditionalOpts=-Djava.net.useSystemProxies=true

# Security headers
sonar.web.http.responseHeaders=Strict-Transport-Security: max-age=31536000; includeSubDomains\\nX-Frame-Options: DENY\\nX-Content-Type-Options: nosniff\\nContent-Security-Policy: default-src 'self'`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Permissions & Templates</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# SonarQube Permission Templates

## Default Template - Production Projects
# Name: production-template
# Description: Default permissions for production projects

# Permissions Matrix:
# User/Group              | See Source | See Project | Admin | Issue Admin | Scan | Execute Analysis
# ------------------------|------------|-------------|-------|-------------|------|------------------
# sonar-users             | ✓          | ✓           |       |             |      |
# developers              | ✓          | ✓           |       | ✓           |      |
# devops                  | ✓          | ✓           |       | ✓           |      | ✓
# project-admins          | ✓          | ✓           | ✓     | ✓           | ✓    | ✓
# ci-service              |            | ✓           |       |             |      | ✓

## API - Create Permission Template
POST /api/permissions/create_template
{
  "name": "production-template",
  "description": "Production project permissions",
  "projectKeyPattern": "production.*"
}

## API - Set Default Template
POST /api/permissions/set_default_template
{
  "templateName": "production-template",
  "qualifier": "TRK"
}

## API - Add Group Permission
POST /api/permissions/add_group_to_template
{
  "templateName": "production-template",
  "groupName": "developers",
  "permission": "codeviewer"
}

# Project Visibility Settings
## Private Projects (Recommended)
# Admin > Projects > Project Settings > Permissions
# Visibility: Private
# Only authorized users can see project

## Public Projects (Documentation only)
# Use for open source projects
# Still require authentication for analysis

# Portfolio Access
## Application Portfolio (Enterprise)
# Create portfolios for team organization
# Application: Group of projects
# Portfolio: Group of applications

# API - Create Portfolio
POST /api/views/create
{
  "key": "platform-portfolio",
  "name": "Platform Engineering",
  "description": "All platform services",
  "visibility": "private"
}

# API - Add Projects to Portfolio
POST /api/views/set_projects
{
  "portfolio": "platform-portfolio",
  "projects": "platform-api,platform-auth,platform-db"
}`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Quality Gates & Security</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# SonarQube Quality Gate - Security Focused

## Quality Gate: Production-Security

### Security (Blocker)
# 0 new security hotspots
new_security_hotspots: 0

# 0 new vulnerabilities (Blocker/Critical)
new_vulnerabilities: 0

# Security rating on new code = A
new_security_rating: A

# Security review rating = A
security_review_rating: A

### Reliability (High)
# 0 new bugs (Blocker/Critical)
new_bugs: 0

# Reliability rating on new code = A
new_reliability_rating: A

### Maintainability
# Technical Debt Ratio on new code <= 5%
new_technical_debt_ratio: 5

# Code smells (Major+) on new code <= 10
new_code_smells: 10

# Maintainability rating on new code = A
new_maintainability_rating: A

### Coverage (Enforced)
# Coverage on new code >= 80%
new_coverage: 80

# Duplicated lines on new code <= 3%
new_duplicated_lines_density: 3

# API - Create Quality Gate
POST /api/qualitygates/create
{
  "name": "Production-Security"
}

# API - Create Condition
POST /api/qualitygates/create_condition
{
  "gateName": "Production-Security",
  "metric": "new_vulnerabilities",
  "op": "GT",
  "error": "0"
}

POST /api/qualitygates/create_condition
{
  "gateName": "Production-Security",
  "metric": "new_security_hotspots",
  "op": "GT", 
  "error": "0"
}

POST /api/qualitygates/create_condition
{
  "gateName": "Production-Security",
  "metric": "new_coverage",
  "op": "LT",
  "error": "80"
}

# Set as Default
POST /api/qualitygates/set_as_default
{
  "name": "Production-Security"
}

# Secret Detection Configuration
## Built-in Rules (SonarSecrets)
# - AWS Access Keys
# - Azure Service Principals
# - GCP Service Account Keys
# - GitHub Tokens
# - Slack Tokens
# - Generic Secrets (heuristic)

## Custom Secrets Pattern (Enterprise)
# Admin > Configuration > Secrets
# Add custom regex patterns for internal secrets

# Pattern: Internal API Key
# Regex: internal-api-[a-zA-Z0-9]{32}
# Category: API Key

# Pattern: Database Password
# Regex: DB_PASSWORD\s*=\s*["'][^"']+["']
# Category: Database`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">CI/CD Integration & Token Security</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# SonarQube CI/CD Security

## GitHub Actions - Secure Integration
# .github/workflows/sonar.yml

name: SonarQube Analysis

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  sonar:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Required for SonarQube
      
      - name: SonarQube Scan
        uses: SonarSource/sonarqube-scan-action@master
        env:
          SONAR_TOKEN: $\{\{ secrets.SONAR_TOKEN }\}
          SONAR_HOST_URL: $\{\{ secrets.SONAR_HOST_URL }\}

# sonar-project.properties
sonar.projectKey=company:my-application
sonar.projectName=My Application
sonar.projectVersion=1.0

# Source directories
sonar.sources=src
sonar.tests=tests
sonar.exclusions=**/node_modules/**,**/dist/**,**/build/**

# Test coverage
sonar.javascript.lcov.reportPaths=coverage/lcov.info

# Encoding
sonar.sourceEncoding=UTF-8

# Quality Gate wait (optional)
sonar.qualitygate.wait=true

# Token Security Best Practices
## 1. Project Tokens (Scoped)
# Generate in SonarQube: Project Settings > Analysis > Project Analysis Token
# Scope: Single project only
# Rotate: Every 90 days

## 2. User Tokens (For personal use)
# User > My Account > Security > Generate Tokens
# Use for local development only

## 3. Global Tokens (Avoid!)
# Only for initial setup
# Never for CI/CD

## GitLab CI - Secure Token Handling
# .gitlab-ci.yml

sonarqube:
  stage: test
  image: sonarsource/sonar-scanner-cli:latest
  variables:
    SONAR_USER_HOME: "\${CI_PROJECT_DIR}/.sonar"
    GIT_DEPTH: "0"
  cache:
    key: "\${CI_JOB_NAME}"
    paths:
      - .sonar/cache
  script:
    - sonar-scanner
      -Dsonar.projectKey=\${CI_PROJECT_PATH_SLUG}
      -Dsonar.qualitygate.wait=true
  only:
    - merge_requests
    - main
    - develop

## Azure DevOps Pipeline
# azure-pipelines.yml

steps:
- task: SonarQubePrepare@5
  inputs:
    SonarQube: 'SonarQube-Connection'
    scannerMode: 'CLI'
    configMode: 'manual'
    cliProjectKey: '$(Build.Repository.Name)'
    cliProjectName: '$(Build.Repository.Name)'
    
- task: SonarQubeAnalyze@5

- task: SonarQubePublish@5
  inputs:
    pollingTimeoutSec: '300'
    
# Quality Gate Check
- task: SonarQubeQualityGateCheck@1
  inputs:
    pollingTimeoutSec: '300'`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">SonarQube Security Checklist</h2>
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Authentication & Access</h3>
                  {[
                    "SAML/SSO configured",
                    "Force authentication enabled",
                    "Permission templates defined",
                    "Project tokens (not global)",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                      <span className="w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center text-xs text-slate-400">☐</span>
                      <span className="text-slate-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Analysis & Quality</h3>
                  {[
                    "Quality gates enforced in CI/CD",
                    "Secret detection enabled",
                    "Vulnerability rules active",
                    "Coverage thresholds set",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                      <span className="w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center text-xs text-slate-400">☐</span>
                      <span className="text-slate-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">SonarQube Security Assessment</h2>
            <a href={coreLinks.check} className="inline-block px-6 py-3 bg-white text-sky-600 rounded-lg font-semibold">Assessment Starten</a>
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
        headline: "SonarQube Security 2026",
        author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        datePublished: "2026-03-29",
      })}} />
    </main>
  );
}
