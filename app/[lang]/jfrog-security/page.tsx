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
      ? "JFrog Artifactory Security 2026 | Artifact Repository Security"
      : "JFrog Artifactory Security 2026 | Artifact Repository Security",
    description: locale === "de"
      ? "JFrog Security: Access Control, Xray Scanning, Replication, Encryption & Access Tokens."
      : "JFrog security: access control, Xray scanning, replication, encryption & access tokens.",
    keywords: [
      "JFrog Artifactory security",
      "Artifactory hardening",
      "JFrog Xray security",
      "Artifact repository security",
      "JFrog access tokens",
      "JFrog replication",
      "Docker registry security",
      "JFrog permissions",
      "Binary security",
      "Supply chain security",
    ],
    alternates: {
      canonical: `/${locale}/jfrog-security`,
      ...localeAlternates(`/${locale}/jfrog-security`),
    },
    openGraph: {
      title: "JFrog Artifactory Security 2026: Repository Protection",
      description: "Secure JFrog Artifactory with access control, Xray scanning, replication & encryption.",
      type: "article",
      url: `${BASE_URL}/${locale}/jfrog-security`,
    },
  };
}

export default function JFrogSecurityPage({
  params,
}: {
  params: { lang: string };
}) {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-green-700 via-emerald-700 to-teal-800 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">JFrog Artifactory Security</h1>
            <p className="text-2xl text-emerald-200 mb-4">Artifact Repository Security 2026</p>
            <p className="text-xl text-white/80 mb-8">Access Control, Xray Scanning, Replication, Encryption & Access Tokens</p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">RBAC</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Xray</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Tokens</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Encryption</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">JFrog Security Architecture</h2>
            <p className="text-slate-700 text-lg mb-6">
              JFrog Artifactory ist die Single Source of Truth für Binaries. Kompromittierte Artefakte = Supply Chain Attack. Xray, strikte RBAC und Token-Management sind essentiell.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h3 className="font-semibold text-green-900 mb-2">Access Control</h3>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Permission Targets</li>
                  <li>• LDAP/SSO</li>
                  <li>• Scoped Tokens</li>
                  <li>• Groups & Roles</li>
                </ul>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                <h3 className="font-semibold text-emerald-900 mb-2">Xray Scanning</h3>
                <ul className="text-sm text-emerald-800 space-y-1">
                  <li>• Vulnerability DB</li>
                  <li>• License Compliance</li>
                  <li>• Watch Policies</li>
                  <li>• Violation Alerts</li>
                </ul>
              </div>
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-6">
                <h3 className="font-semibold text-teal-900 mb-2">Repository Security</h3>
                <ul className="text-sm text-teal-800 space-y-1">
                  <li>• GPG Signing</li>
                  <li>• Checksum Verify</li>
                  <li>• Replication</li>
                  <li>• Backup/Restore</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Permission Targets & RBAC</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# permissions.yaml - Artifactory Permission Targets

# 1. Production Repository (Read-Only for Devs)
permissionTargets:
  - name: production-readonly
    repoKeys:
      - docker-production-local
      - maven-production-local
      - npm-production-local
    includesPattern: "**"
    excludesPattern: ""
    principals:
      users:
        developer:
          - read
          - annotate  # Can add metadata, not modify
      groups:
        dev-team:
          - read
        sre-team:
          - read
          - write
          - delete
          - manage
          - annotate
          - managedXrayMeta
    
  - name: staging-fullaccess
    repoKeys:
      - docker-staging-local
      - maven-staging-local
    includesPattern: "**"
    excludesPattern: ""
    principals:
      users:
        developer:
          - read
          - write
          - annotate
          - delete
      groups:
        dev-team:
          - read
          - write
          - annotate
          - delete

  - name: ci-upload-only
    repoKeys:
      - docker-snapshots-local
      - maven-snapshots-local
    includesPattern: "**"
    principals:
      users:
        ci-user:
          - read
          - write
          - annotate
        # NO delete permission!

  - name: security-team
    repoKeys:
      - ANY  # All repositories
    includesPattern: "**"
    principals:
      groups:
        security-team:
          - read
          - managedXrayMeta
          - watchManager

# Access Federation (Artifactory Edge)
federatedRepositories:
  - name: docker-federated
    repoType: LOCAL
    packageType: docker
    memberRepositories:
      - docker-production-local
      - docker-edge-eu-local
      - docker-edge-us-local
    
# API - Create Permission Target
curl -X POST https://artifactory.company.com/api/v2/security/permissions/production-readonly \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "repoKeys": ["docker-production-local"],
    "principals": {
      "users": {
        "developer": ["read", "annotate"]
      },
      "groups": {
        "dev-team": ["read"]
      }
    }
  }'`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Access Tokens & API Keys</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# Artifactory Access Tokens - Best Practices

# 1. Scoped Token for CI/CD
curl -X POST https://artifactory.company.com/api/v1/security/token \
  -u admin:password \
  -d "username=ci-service" \
  -d "scope=member-of-groups:ci-group" \
  -d "expires_in=3600" \
  -d "audience=jfrog:*" \
  -d "grant_type=client_credentials"

# Response:
# {
#   "access_token": "eyJ...",
#   "token_type": "Bearer",
#   "expires_in": 3600,
#   "scope": "api:* member-of-groups:ci-group"
# }

# 2. Identity Token for User (Short-lived)
curl -X POST https://artifactory.company.com/api/v1/oauth/token \
  -d "grant_type=urn:ietf:params:oauth:grant-type:token-exchange" \
  -d "subject_token=$USER_TOKEN" \
  -d "subject_token_type=urn:ietf:params:oauth:token-type:access_token" \
  -d "requested_token_type=urn:ietf:params:oauth:token-type:id_token" \
  -d "audience=jfrog:artifactory:$REPO"

# 3. Group-Based Scoped Token
# Token for specific group with limited scope
curl -X POST https://artifactory.company.com/api/v1/security/token \
  -u admin:password \
  -d "username=deploy-service" \
  -d "scope=member-of-groups:deployers api:write@docker-production-local" \
  -d "expires_in=7200"

# 4. Refresh Token Rotation
curl -X POST https://artifactory.company.com/api/v1/oauth/token \
  -d "grant_type=refresh_token" \
  -d "refresh_token=$REFRESH_TOKEN" \
  -d "access_token=$ACCESS_TOKEN"

# Token Revocation
curl -X DELETE https://artifactory.company.com/api/v1/security/token \
  -u admin:password \
  -d "token=$TOKEN_TO_REVOKE"

# List Active Tokens
curl https://artifactory.company.com/api/v1/security/tokens \
  -u admin:password

# Cleanup Expired Tokens
curl -X POST https://artifactory.company.com/api/v1/security/token/revoke \
  -u admin:password \
  -d "token_id=$TOKEN_ID"

# CI/CD Example - Docker Login with Token
# .github/workflows/deploy.yml
jobs:
  deploy:
    steps:
      - name: Get Artifactory Token
        run: |
          TOKEN=$(curl -s -X POST \\n            https://artifactory.company.com/api/v1/security/token \\n            -u ci:${{ secrets.ARTIFACTORY_CI_PASS }} \\n            -d "username=github-actions" \\n            -d "scope=member-of-groups:github-actions" \\n            -d "expires_in=1800" \\n            | jq -r '.access_token')
          echo "::add-mask::$TOKEN"
          echo "ARTIFACTORY_TOKEN=$TOKEN" >> $GITHUB_ENV
      
      - name: Login to Artifactory Docker
        run: |
          echo $ARTIFACTORY_TOKEN | docker login \\n            artifactory.company.com -u github-actions --password-stdin
          echo $ARTIFACTORY_TOKEN | docker login \\\n            artifactory.company.com -u github-actions --password-stdin
      
      - name: Push Docker Image
        run: |
          docker push artifactory.company.com/docker-production/myapp:$\${{ github.sha }}`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Xray Security Policies</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# xray-policies.yaml - Security & License Policies

# 1. Security Policy - Block Critical Vulnerabilities
securityPolicies:
  - name: block-critical-cves
    description: Block artifacts with critical vulnerabilities
    type: security
    severity: Critical
    cvssScore: 9.0
    cvssTo: 10.0
    
    rules:
      - name: block-critical
        criteria:
          minSeverity: Critical
          cvssScore:
            minScore: 9.0
        actions:
          blockDownload:
            active: true
            unblock: false
          failBuild: true
          notifyCommitters: true
          notifyWatchRecipients: true
          createJiraTicket:
            project: SEC
            issueType: Security Vulnerability
    
    watches:
      - name: production-watch
        description: Monitor production repositories
        resources:
          repositories:
            - name: docker-production-local
              type: local
            - name: maven-production-local
              type: local
            - name: npm-production-local
              type: local
        
        assignedPolicies:
          - name: block-critical-cves
            type: security

  - name: warn-high-cves
    description: Warn on high severity vulnerabilities
    type: security
    severity: High
    cvssScore: 7.0
    cvssTo: 8.9
    
    rules:
      - name: warn-high
        criteria:
          minSeverity: High
          cvssScore:
            minScore: 7.0
        actions:
          blockDownload:
            active: false  # Warn only
          notifyCommitters: true
          createJiraTicket:
            project: SEC
            priority: High

# 2. License Compliance Policy
licensePolicies:
  - name: oss-compliance
    description: Open Source License Compliance
    type: license
    
    rules:
      - name: ban-copyleft
        criteria:
          allowedLicenses:
            - MIT
            - Apache-2.0
            - BSD-3-Clause
            - ISC
          bannedLicenses:
            - GPL-2.0
            - GPL-3.0
            - AGPL-3.0
        actions:
          blockDownload:
            active: true
          failBuild: true
          customMessage: "GPL license not permitted in commercial software"
      
      - name: require-approval
        criteria:
          unknownLicenses: true
        actions:
          blockDownload:
            active: true
            unblock: true  # Can be manually approved
          requireApproval: true
    
    watches:
      - name: license-watch
        resources:
          repositories:
            - name: maven-production-local
            - name: npm-production-local
        assignedPolicies:
          - name: oss-compliance
            type: license

# 3. Operational Risk Policy (Outdated Components)
riskPolicies:
  - name: outdated-dependencies
    description: Block outdated dependencies
    type: operational_risk
    
    criteria:
      releaseAge: 365  # Days
      newerVersions: 3
      lastUpdated: 180
    
    actions:
      warn: true
      blockDownload:
        active: false

# API - Create Watch
POST https://artifactory.company.com/xray/api/v2/watches
Authorization: Bearer $TOKEN
{
  "general_data": {
    "name": "production-security-watch",
    "description": "Security monitoring for production"
  },
  "project_resources": {
    "resources": [
      {
        "type": "repository",
        "name": "docker-production-local"
      }
    ]
  },
  "assigned_policies": [
    {
      "name": "block-critical-cves",
      "type": "security"
    },
    {
      "name": "oss-compliance",
      "type": "license"
    }
  ]
}`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Encryption & SSL Configuration</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# artifactory.system.properties - SSL & Security

# HTTPS Configuration
artifactory.port=8081
artifactory.tomcat.connector.httpsPort=8443
artifactory.tomcat.connector.secure=true
artifactory.tomcat.connector.scheme=https

# SSL/TLS Settings
artifactory.tomcat.connector.sslEnabled=true
artifactory.tomcat.connector.sslProtocol=TLS
artifactory.tomcat.connector.sslEnabledProtocols=TLSv1.3,TLSv1.2

# Cipher Suites (Strong only)
artifactory.tomcat.connector.ciphers=TLS_AES_256_GCM_SHA384,TLS_CHACHA20_POLY1305_SHA256,ECDHE-RSA-AES256-GCM-SHA384

# Certificate Configuration
artifactory.tomcat.connector.keystoreFile=/opt/jfrog/artifactory/var/etc/security/keystore.jks
artifactory.tomcat.connector.keystorePass=\${file:/opt/jfrog/artifactory/var/etc/security/keystore.pass}
artifactory.tomcat.connector.keyAlias=artifactory

# Client Certificate (mTLS)
artifactory.tomcat.connector.clientAuth=false  # Set true for mTLS
artifactory.tomcat.connector.truststoreFile=/opt/jfrog/artifactory/var/etc/security/truststore.jks
artifactory.tomcat.connector.truststorePass=\${file:/opt/jfrog/artifactory/var/etc/security/truststore.pass}

# Database Encryption
artifactory.database.encryption.keyFile=/opt/jfrog/artifactory/var/etc/security/db.key

# Master Key for Encryption
## Generated with: openssl rand -hex 32
master.key=<256-bit-hex-key>

# GPG Signing for Repositories
# Upload GPG keys via UI: Admin > Security > Signing Keys

# Docker Registry - Content Trust (Notary)
docker.registry.notary.enabled=true
docker.registry.notary.signing.enabled=true

# Replication - Secure Config
replication:
  - cronExp: "0 0 2 * * ?"  # Daily at 2 AM
    repoKey: docker-production-local
    targetRepoKey: docker-production-local
    targetUrl: https://artifactory-dr.company.com
    enableEventReplication: false
    enabled: true
    syncDeletes: true
    syncProperties: true
    pathPrefix: ""
    
    # SSL verification
    targetVerifySSL: true
    targetCertificate: /opt/jfrog/artifactory/var/etc/security/dr-cert.pem

# Backup Configuration
backups:
  - key: daily-backup
    enabled: true
    cronExp: "0 0 3 * * ?"
    retentionPeriodHours: 168  # 7 days
    excludedRepositories: []`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">JFrog Security Checklist</h2>
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Access & Authentication</h3>
                  {[
                    "LDAP/SSO configured",
                    "Permission targets defined",
                    "Scoped tokens for CI/CD",
                    "Token rotation policy active",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                      <span className="w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center text-xs text-slate-400">☐</span>
                      <span className="text-slate-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Xray & Compliance</h3>
                  {[
                    "Xray watches configured",
                    "CVE policies active",
                    "License compliance enabled",
                    "Build failure on critical CVEs",
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

          <section className="bg-gradient-to-r from-green-700 to-emerald-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">JFrog Security Assessment</h2>
            <a href="/check" className="inline-block px-6 py-3 bg-white text-green-700 rounded-lg font-semibold">Assessment Starten</a>
          </section>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "JFrog Artifactory Security 2026",
        author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        datePublished: "2026-03-29",
      })}} />
    </main>
  );
}
