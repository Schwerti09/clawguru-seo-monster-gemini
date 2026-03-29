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
      ? "Pulumi Security 2026 | Infrastructure as Code Security"
      : "Pulumi Security 2026 | Infrastructure as Code Security",
    description: locale === "de"
      ? "Pulumi Security: State Management, Secrets Encryption, RBAC, Policy as Code, CI/CD Integration & Compliance. Enterprise IaC Security."
      : "Pulumi security: state management, secrets encryption, RBAC, policy as code, CI/CD integration & compliance. Enterprise IaC security.",
    keywords: [
      "Pulumi security",
      "Pulumi hardening",
      "Pulumi state",
      "Pulumi secrets",
      "Pulumi policy",
      "IaC security",
      "Pulumi RBAC",
      "Pulumi ESC",
      "Pulumi Cloud",
      "Infrastructure security",
    ],
    alternates: {
      canonical: `/${locale}/pulumi-security`,
      ...localeAlternates(`/${locale}/pulumi-security`),
    },
    openGraph: {
      title: "Pulumi Security 2026: IaC Security & Compliance",
      description: "Secure Pulumi with state encryption, secrets management, RBAC & policy enforcement.",
      type: "article",
      url: `${BASE_URL}/${locale}/pulumi-security`,
    },
  };
}

export default async function PulumiSecurityPage({
  params,
}: {
  params: { lang: string };
}) {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-violet-700 to-fuchsia-800 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Pulumi Security</h1>
            <p className="text-2xl text-purple-200 mb-4">Infrastructure as Code Security 2026</p>
            <p className="text-xl text-white/80 mb-8">State Management, Secrets Encryption, RBAC, Policy as Code & CI/CD Security</p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">ESC</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Secrets</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Policy</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">RBAC</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Pulumi Security Architecture</h2>
            <p className="text-slate-700 text-lg mb-6">
              Pulumi IaC-Code hat direkten Zugriff auf Cloud-APIs und kann Infrastruktur erstellen/zerstören. State-Dateien enthalten Secrets. Sichern Sie ESC (Environments, Secrets, Config), Policy as Code und State-Management.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <h3 className="font-semibold text-purple-900 mb-2">Secrets Management</h3>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• ESC Environments</li>
                  <li>• Secrets Providers</li>
                  <li>• Encryption at Rest</li>
                  <li>• Dynamic Credentials</li>
                </ul>
              </div>
              <div className="bg-violet-50 border border-violet-200 rounded-xl p-6">
                <h3 className="font-semibold text-violet-900 mb-2">Policy as Code</h3>
                <ul className="text-sm text-violet-800 space-y-1">
                  <li>• CrossGuard Policies</li>
                  <li>• Resource Constraints</li>
                  <li>• Cost Controls</li>
                  <li>• Compliance Rules</li>
                </ul>
              </div>
              <div className="bg-fuchsia-50 border border-fuchsia-200 rounded-xl p-6">
                <h3 className="font-semibold text-fuchsia-900 mb-2">Access Control</h3>
                <ul className="text-sm text-fuchsia-800 space-y-1">
                  <li>• Stack Permissions</li>
                  <li>• Organization Roles</li>
                  <li>• Team Access</li>
                  <li>• Audit Logging</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Pulumi ESC (Environments, Secrets, Config)</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# Pulumi ESC - Centralized Configuration & Secrets

# Pulumi.yaml - Project definition
name: production-infrastructure
runtime: nodejs
description: Production AWS Infrastructure

# ESC Environment Definition (Pulumi.dev.yaml equivalent)
# environments/production.yaml
imports:
  - aws-credentials  # Import shared AWS config
  - common-tags      # Import shared tagging

values:
  # Static configuration
  aws:
    region: eu-central-1
    allowedRegions:
      - eu-central-1
      - eu-west-1
  
  # Pulumi configuration
  pulumiConfig:
    environment: production
    costCenter: platform-engineering
    dataClassification: internal
  
  # Secrets (encrypted in Pulumi Cloud)
  secrets:
    dbPassword:
      fn::secret:
        ciphertext: AAABAF...
    apiKey:
      fn::secret:
        ciphertext: AAABAC...
  
  # Dynamic credentials via OIDC
  awsCredentials:
    fn::open::aws-login:
      oidc:
        duration: 1h
        roleArn: arn:aws:iam::123456789:role/pulumi-deployment-role
        sessionName: pulumi-${pulumi.user.login}
      
  # OpenTelemetry configuration
  openTelemetry:
    fn::open::opentelemetry:
      collector:
        endpoint: https://otel.company.com:4317
        headers:
          X-Scope-OrgID: platform

# Usage in TypeScript
import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config();
const dbPassword = config.requireSecret("dbPassword");
const apiKey = config.requireSecret("apiKey");

// AWS Provider with dynamic credentials from ESC
const provider = new aws.Provider("aws", {
  region: config.require("aws:region"),
  allowedAccountIds: [config.require("aws:accountId")],
});`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Pulumi Policy as Code (CrossGuard)</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# policies/security-policies.ts - Policy Pack

import * as policy from "@pulumi/policy";
import * as aws from "@pulumi/aws";

// Security Policy Pack
const policies = new policy.PolicyPack("security-policies", {
  enforcementLevel: "mandatory",  // advisory, mandatory, disabled
  
  policies: [
    // 1. Require encrypted S3 buckets
    {
      name: "s3-bucket-encryption",
      description: "S3 buckets must have server-side encryption enabled",
      enforcementLevel: "mandatory",
      validateResource: (args, reportViolation) => {
        if (args.type === "aws:s3/bucket:Bucket") {
          const bucket = args.props;
          if (!bucket.serverSideEncryptionConfiguration) {
            reportViolation("S3 bucket must have encryption enabled");
          }
        }
      },
    },
    
    // 2. No public S3 buckets
    {
      name: "s3-no-public-access",
      description: "S3 buckets must not be publicly accessible",
      enforcementLevel: "mandatory",
      validateResource: (args, reportViolation) => {
        if (args.type === "aws:s3/bucketPublicAccessBlock:BucketPublicAccessBlock") {
          const block = args.props;
          if (block.blockPublicAcls === false || 
              block.blockPublicPolicy === false ||
              block.ignorePublicAcls === false ||
              block.restrictPublicBuckets === false) {
            reportViolation("S3 bucket must block all public access");
          }
        }
      },
    },
    
    // 3. Require VPC flow logs
    {
      name: "vpc-flow-logs-required",
      description: "VPCs must have flow logs enabled",
      enforcementLevel: "mandatory",
      validateResource: (args, reportViolation) => {
        if (args.type === "aws:ec2/vpc:Vpc") {
          // Check if flow log exists (via stack reference or tag)
          if (!args.props.tags?.["FlowLogEnabled"]) {
            reportViolation("VPC must have flow logs enabled");
          }
        }
      },
    },
    
    // 4. No hardcoded secrets
    {
      name: "no-plaintext-secrets",
      description: "No plaintext secrets in resource properties",
      enforcementLevel: "mandatory",
      validateResource: (args, reportViolation) => {
        const props = JSON.stringify(args.props);
        const secretPatterns = [
          /password:\s*["'][^"']+["']/i,
          /secret:\s*["'][^"']+["']/i,
          /api_key:\s*["'][^"']+["']/i,
          /private_key:/i,
        ];
        
        for (const pattern of secretPatterns) {
          if (pattern.test(props)) {
            reportViolation("Potential plaintext secret detected");
          }
        }
      },
    },
    
    // 5. Cost control - limit expensive instances
    {
      name: "ec2-instance-size-limit",
      description: "EC2 instances must be smaller than 8xlarge",
      enforcementLevel: "advisory",
      validateResource: (args, reportViolation) => {
        if (args.type === "aws:ec2/instance:Instance") {
          const instance = args.props;
          const largeSizes = [/\.\d?xlarge$/];
          
          if (largeSizes.some(pattern => pattern.test(instance.instanceType))) {
            reportViolation("Large instance type requires approval");
          }
        }
      },
    },
    
    // 6. Require tagging
    {
      name: "mandatory-tags",
      description: "Resources must have required tags",
      enforcementLevel: "mandatory",
      validateResource: (args, reportViolation) => {
        const requiredTags = ["Environment", "CostCenter", "Owner"];
        const tags = args.props.tags || {};
        
        for (const tag of requiredTags) {
          if (!tags[tag]) {
            reportViolation(`Missing required tag: ${tag}`);
          }
        }
      },
    },
  ],
});

export = policies;`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Pulumi State & Backend Security</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# Pulumi.yaml - Secure Backend Configuration

# Use Pulumi Cloud (recommended) for:
# - Encryption at rest
# - RBAC
# - Audit logging
# - State locking
name: secure-infrastructure
runtime: nodejs
backend:
  url: https://api.pulumi.com

# Alternative: Self-managed S3 backend with encryption
# pulumi login s3://pulumi-state-bucket?region=us-west-2&awssdk=v2

# S3 Backend Configuration (for self-hosted)
# Requires:
# - S3 bucket with versioning
# - DynamoDB table for locking
# - KMS key for encryption

# Pulumi.stack.yaml
config:
  # Secrets provider: passphrase, awskms, azurekeyvault, gcpkms, hashivault
  pulumi:secretsProvider: awskms://arn:aws:kms:us-west-2:123456789:key/12345678-1234-1234-1234-123456789012
  
  # Encryption salt (auto-generated)
  pulumi:encryptionsalt: v1:ABC123...
  
  # Backend configuration
  pulumi:backend:
    url: s3://pulumi-state-prod
    secretsProvider: awskms

# TypeScript - Secrets Management
import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// Config with automatic encryption
const config = new pulumi.Config();

// These are automatically encrypted in state
const dbPassword = config.requireSecret("dbPassword");
const apiKey = config.requireSecret("apiKey");

// Create secret in AWS Secrets Manager
const dbSecret = new aws.secretsmanager.Secret("db-secret", {
  description: "Database credentials",
  kmsKeyId: kmsKey.id,
});

new aws.secretsmanager.SecretVersion("db-secret-version", {
  secretId: dbSecret.id,
  secretString: pulumi.secret(JSON.stringify({
    username: "admin",
    password: dbPassword,
  })),
});

# CI/CD Integration - GitHub Actions
# .github/workflows/pulumi.yml
name: Pulumi
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: pulumi/actions@v5
        with:
          command: preview
          stack-name: organization/production
          work-dir: ./infrastructure
          comment-on-pr: true
          github-token: $\{\{ secrets.GITHUB_TOKEN }\}
        env:
          PULUMI_ACCESS_TOKEN: $\{\{ secrets.PULUMI_ACCESS_TOKEN }\}
          # AWS credentials via OIDC
          AWS_REGION: us-west-2
          AWS_ROLE_ARN: arn:aws:iam::123456789:role/pulumi-gha-role

  update:
    needs: preview
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production  # Require approval
    steps:
      - uses: actions/checkout@v4
      
      - uses: pulumi/actions@v5
        with:
          command: up
          stack-name: organization/production
          work-dir: ./infrastructure
        env:
          PULUMI_ACCESS_TOKEN: $\{\{ secrets.PULUMI_ACCESS_TOKEN }\}`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Pulumi Organization & RBAC</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# Pulumi Cloud - Organization Structure

# Organization: company-platform
# Teams:
#   - platform-admins (full access)
#   - platform-devops (deploy access)
#   - platform-devs (read only)
#   - security-team (audit access)

# Access Tokens (Service Accounts)
# - ci-cd-token: Automated deployments
# - monitoring-token: Stack exports for monitoring
# - backup-token: State backups

# Stack Permissions (Pulumi Console or API)
# Stack: production-infrastructure
# Permissions:
#   - platform-admins: ADMIN
#   - platform-devops: WRITE
#   - platform-devs: READ
#   - security-team: READ

# Stack: development-infrastructure  
# Permissions:
#   - platform-admins: ADMIN
#   - platform-devops: ADMIN
#   - platform-devs: WRITE

# Policy Groups
# Organization Policies:
#   - security-pack: Mandatory
#   - cost-pack: Advisory
#   - compliance-pack: Mandatory

# Stack Policy Configuration
# Stack: production-infrastructure
# Policy Group: production-policies
#   - security-pack@1.2.0 (mandatory)
#   - cost-pack@0.5.0 (advisory)
#   - encryption-required (custom, mandatory)

# Audit Logging (Pulumi Enterprise)
# Audit Events:
#   - Stack updates
#   - Secret access
#   - Policy violations
#   - RBAC changes
#   - Login/logout

# Export audit logs to SIEM
# Configure in Pulumi Cloud: Settings > Audit Logs > Webhook
# Webhook URL: https://siem.company.com/api/pulumi-audit`}
              </pre>
            </div>
          </section>

          <section className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Pulumi Security Assessment</h2>
            <a href="/check" className="inline-block px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold">Assessment Starten</a>
          </section>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "Pulumi Security 2026",
        author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        datePublished: "2026-03-29",
      })}} />
    </main>
  );
}
