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
      ? "CircleCI Security 2026 | Pipeline Security & OIDC Best Practices"
      : "CircleCI Security 2026 | Pipeline Security & OIDC Best Practices",
    description: locale === "de"
      ? "CircleCI Security: OpenID Connect, Contexts, Restricted Contexts, IP Ranges & Secrets Management."
      : "CircleCI security: OpenID Connect, contexts, restricted contexts, IP ranges & secrets management.",
    keywords: [
      "CircleCI security",
      "CircleCI OIDC",
      "CircleCI contexts",
      "CircleCI pipeline security",
      "CircleCI IP ranges",
      "CircleCI secrets",
      "CI/CD security",
      "CircleCI best practices",
      "CircleCI AWS OIDC",
      "CircleCI restricted contexts",
    ],
    alternates: buildLocalizedAlternates(locale, "/circleci-security"),
    openGraph: {
      images: ["/og-image.png"],
      title: "CircleCI Security 2026: Pipeline Protection",
      description: "Secure CircleCI with OIDC, restricted contexts, IP ranges & secrets management.",
      type: "article",
      url: `${BASE_URL}/${locale}/circleci-security`,
    },
  };
}

export default async function CircleCISecurityPage({
  params,
}: {
  params: { lang: string };
}) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale;
  const prefix = `/${locale}`;
  const coreLinks = getCoreSecurityLinks(locale);
  return (
    <main className="min-h-screen bg-gray-800">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">CircleCI Security</h1>
            <p className="text-2xl text-indigo-200 mb-4">Pipeline Security 2026</p>
            <p className="text-xl text-white/80 mb-8">OpenID Connect, Contexts, Restricted Contexts, IP Ranges & Secrets Management</p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">OIDC</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Contexts</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">IP Ranges</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Secrets</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">CircleCI Security Architecture</h2>
            <p className="text-gray-200 text-lg mb-6">
              CircleCI Pipelines haben Zugriff auf Code, Secrets und Deployments. Mit OIDC, Restricted Contexts und IP-Ranges können Sie Sicherheit dramatisch verbessern.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-900 border border-blue-700 rounded-xl p-6">
                <h3 className="font-semibold text-blue-200 mb-2">OIDC Authentication</h3>
                <ul className="text-sm text-blue-300 space-y-1">
                  <li>• AWS OIDC Provider</li>
                  <li>• Azure OIDC</li>
                  <li>• GCP Workload Identity</li>
                  <li>• Vault JWT Auth</li>
                </ul>
              </div>
              <div className="bg-indigo-900 border border-indigo-700 rounded-xl p-6">
                <h3 className="font-semibold text-indigo-200 mb-2">Context Security</h3>
                <ul className="text-sm text-indigo-300 space-y-1">
                  <li>• Restricted Contexts</li>
                  <li>• Security Groups</li>
                  <li>• Approval Gates</li>
                  <li>• Rotation Policies</li>
                </ul>
              </div>
              <div className="bg-violet-50 border border-violet-200 rounded-xl p-6">
                <h3 className="font-semibold text-violet-900 mb-2">Network Security</h3>
                <ul className="text-sm text-violet-800 space-y-1">
                  <li>• IP Ranges Product</li>
                  <li>• Self-Hosted Runners</li>
                  <li>• VPN Integration</li>
                  <li>• Firewall Rules</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">OIDC Configuration (AWS + CircleCI)</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# Terraform - AWS OIDC Provider for CircleCI

# 1. Create OIDC Provider
resource "aws_iam_openid_connect_provider" "circleci" {
  url = "https://oidc.circleci.com/org/YOUR_ORG_ID"

  client_id_list = ["YOUR_ORG_ID"]

  thumbprint_list = [
    "9e99a48a9960b14926bb7f3b02e22da2b0ab7280"  # CircleCI OIDC thumbprint
  ]
}

# 2. IAM Role with Trust Policy
resource "aws_iam_role" "circleci_deploy" {
  name = "CircleCIDeployRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = aws_iam_openid_connect_provider.circleci.arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "oidc.circleci.com/org/YOUR_ORG_ID:aud" = "YOUR_ORG_ID"
          }
          StringLike = {
            # Only allow specific projects/branches
            "oidc.circleci.com/org/YOUR_ORG_ID:sub" = [
              "org/YOUR_ORG_ID/project/*/user/*/pipeline/*",
              "org/YOUR_ORG_ID/project/my-production-repo/*"
            ]
          }
        }
      }
    ]
  })
}

# 3. Least Privilege Policy
resource "aws_iam_role_policy" "deploy_policy" {
  name = "CircleCIDeployPolicy"
  role = aws_iam_role.circleci_deploy.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid = "ECSDeploy"
        Effect = "Allow"
        Action = [
          "ecs:RegisterTaskDefinition",
          "ecs:UpdateService",
          "ecs:DescribeServices",
          "iam:PassRole"
        ]
        Resource = "*"
        Condition = {
          StringEquals = {
            "ecs:cluster" = "arn:aws:ecs:*:*:cluster/production"
          }
        }
      },
      {
        Sid = "ECRPush"
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload",
          "ecr:PutImage"
        ]
        Resource = "arn:aws:ecr:*:*:repository/production/*"
      }
    ]
  })
}

# CircleCI Config - Use OIDC
# .circleci/config.yml
version: 2.1

orbs:
  aws-cli: circleci/aws-cli@4.1

jobs:
  deploy:
    docker:
      - image: cimg/python:3.11
    steps:
      - checkout
      
      # Install AWS CLI v2 with OIDC support
      - aws-cli/setup:
          profile_name: default
          role_arn: "arn:aws:iam::123456789:role/CircleCIDeployRole"
          session_duration: '900'  # 15 minutes
      
      # Now authenticated with temporary credentials
      - run:
          name: Deploy to ECS
          command: |
            aws ecs update-service \\\n              --cluster production \\\n              --service my-app \\\n              --force-new-deployment

workflows:
  deploy:
    jobs:
      - deploy:
          filters:
            branches:
              only: main
          context: production-aws`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Restricted Contexts & Security Groups</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# CircleCI Contexts Configuration

# Via CircleCI API / Web UI

# 1. Create Restricted Context
POST https://circleci.com/api/v2/context
{
  "name": "production-secrets",
  "owner": {
    "id": "YOUR_ORG_ID",
    "type": "organization"
  }
}

# 2. Add Environment Variables
POST https://circleci.com/api/v2/context/{context-id}/environment-variable
{
  "variable": {
    "name": "AWS_ACCESS_KEY_ID",
    "value": "AKIA..."  # Encrypted at rest
  }
}

POST https://circleci.com/api/v2/context/{context-id}/environment-variable
{
  "variable": {
    "name": "DATABASE_URL",
    "value": "postgresql://..."
  }
}

# 3. Configure Restrictions (CircleCI Web UI)
# Go to Organization Settings > Security > Restricted Contexts

# Example: Restrict "production-secrets" context
restrictions:
  # Only allow specific GitHub teams
  teams:
    - platform-engineering
    - sre-team
  
  # Require approval for first-time contributors
  approval:
    require_approval: true
    approval_timeout: 24h
  
  # IP Restrictions (requires IP Ranges product)
  ip_ranges:
    allowed:
      - "203.0.113.0/24"  # Office VPN
      - "198.51.100.0/24" # Data Center
  
  # Schedule-based restrictions
  schedule:
    deploy_window:
      days: [monday, tuesday, wednesday, thursday]
      hours: [9, 10, 11, 14, 15, 16]

# CircleCI Config with Multiple Contexts
version: 2.1

jobs:
  test:
    docker:
      - image: cimg/node:20.0
    steps:
      - checkout
      - run: npm ci
      - run: npm test

  build:
    docker:
      - image: cimg/node:20.0
    steps:
      - checkout
      - run: npm ci
      - run: npm run build

  deploy-staging:
    docker:
      - image: cimg/python:3.11
    steps:
      - checkout
      - run: ./deploy.sh staging

  deploy-production:
    docker:
      - image: cimg/python:3.11
    steps:
      - checkout
      - run: ./deploy.sh production

workflows:
  ci-cd:
    jobs:
      - test
      
      - build:
          requires: [test]
      
      - deploy-staging:
          requires: [build]
          context: staging-secrets
          filters:
            branches:
              ignore: main
      
      - hold-for-production:
          type: approval
          requires: [build]
          filters:
            branches:
              only: main
      
      - deploy-production:
          requires: [hold-for-production]
          context: production-secrets  # Restricted context!
          filters:
            branches:
              only: main
          # Additional security: require manual approval
          # configured in CircleCI web UI for restricted contexts`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">IP Ranges & Self-Hosted Runners</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# CircleCI IP Ranges (Paid Feature)
# Enable in Project Settings > Advanced > IP Ranges

# List of CircleCI IP ranges (keep updated!)
# https://circleci.com/docs/ip-ranges

circleci_ip_ranges:
  aws:
    - 3.228.14.0/24
    - 3.228.15.0/24
    - 18.214.240.128/25
    - 52.20.179.168/32
    - 52.203.65.204/32
  
  gcp:
    - 34.75.0.0/16
    - 35.185.0.0/16
  
  azure:
    - 40.76.0.0/16
    - 40.77.0.0/16

# AWS Security Group for CircleCI
resource "aws_security_group" "circleci" {
  name_prefix = "circleci-ip-ranges-"
  description = "Allow CircleCI IP ranges"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "HTTPS from CircleCI"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = [
      "3.228.14.0/24",
      "3.228.15.0/24",
      "18.214.240.128/25",
    ]
  }

  # Enable IP Ranges in CircleCI
  # .circleci/config.yml
  version: 2.1

  jobs:
    deploy:
      circleci_ip_ranges: true  # Enable IP ranges for this job
      docker:
        - image: cimg/python:3.11
      steps:
        - checkout
        - run:
            name: Deploy
            command: ./deploy.sh

  workflows:
    deploy:
      jobs:
        - deploy:
            context: production
}

# Self-Hosted Runner for Maximum Security
# Install CircleCI Runner on your infrastructure

# runner-config.yaml
api:
  auth_token: "YOUR_RUNNER_TOKEN"

runner:
  name: "prod-runner-01"
  working_directory: "/var/lib/circleci/workdir"
  cleanup_working_directory: true
  
  # Resource limits
  max_run_time: 1h
  max_concurrent_tasks: 4

logging:
  level: info
  format: json
  file: "/var/log/circleci-runner.log"

# Docker Runner Configuration (Docker-in-Docker)
resource_class: company/self-hosted

docker:
  image: "cimg/base:stable"
  auth:
    username: $DOCKER_USER
    password: $DOCKER_PASS

# Kubernetes Runner (Container Agent)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: circleci-container-agent
  namespace: circleci
spec:
  replicas: 3
  selector:
    matchLabels:
      app: circleci-agent
  template:
    metadata:
      labels:
        app: circleci-agent
    spec:
      containers:
      - name: agent
        image: circleci/container-agent:1.0
        resources:
          limits:
            cpu: "2"
            memory: 4Gi
          requests:
            cpu: "1"
            memory: 2Gi
        env:
        - name: RUNNER_TOKEN
          valueFrom:
            secretKeyRef:
              name: circleci-runner-token
              key: token
        securityContext:
          runAsNonRoot: true
          readOnlyRootFilesystem: true
          allowPrivilegeEscalation: false
          capabilities:
            drop:
            - ALL`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">CircleCI Security Checklist</h2>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-100 mb-4">Authentication & Access</h3>
                  {[
                    "OIDC configured (AWS/Azure/GCP)",
                    "Restricted contexts enabled",
                    "Team-based access controls",
                    "2FA for all org members",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-700 last:border-0">
                      <span className="w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center text-xs text-slate-400">☐</span>
                      <span className="text-gray-200 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-100 mb-4">Pipeline Security</h3>
                  {[
                    "No hardcoded secrets in config.yml",
                    "IP ranges enabled for sensitive jobs",
                    "Approval gates for production",
                    "Orb pinning (version locks)",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-700 last:border-0">
                      <span className="w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center text-xs text-slate-400">☐</span>
                      <span className="text-gray-200 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">CircleCI Security Assessment</h2>
            <a href={coreLinks.check} className="inline-block px-6 py-3 bg-gray-800 text-cyan-400 rounded-lg font-semibold">Assessment Starten</a>
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
        headline: "CircleCI Security 2026",
        author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        datePublished: "2026-03-29",
      })}} />
    </main>
  );
}
