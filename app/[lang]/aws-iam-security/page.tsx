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
      ? "AWS IAM Security 2026 | Identity & Access Management Best Practices"
      : "AWS IAM Security 2026 | Identity & Access Management Best Practices",
    description: locale === "de"
      ? "AWS IAM Security: Least Privilege, Service Control Policies, Permission Boundaries, OIDC Federation, Access Analyzer & IAM Access Advisor."
      : "AWS IAM security: least privilege, service control policies, permission boundaries, OIDC federation, access analyzer & IAM access advisor.",
    keywords: [
      "AWS IAM security",
      "AWS IAM best practices",
      "AWS least privilege",
      "AWS SCP",
      "AWS permission boundaries",
      "AWS OIDC",
      "AWS IAM federation",
      "AWS access analyzer",
      "AWS IAM roles",
      "AWS security",
    ],
    alternates: {
      canonical: `/${locale}/aws-iam-security`,
      ...localeAlternates(`/${locale}/aws-iam-security`),
    },
    openGraph: {
      title: "AWS IAM Security 2026: Best Practices & Compliance",
      description: "AWS IAM security with least privilege, SCPs, permission boundaries & OIDC.",
      type: "article",
      url: `${BASE_URL}/${locale}/aws-iam-security`,
    },
  };
}

export default async function AWSIAMSecurityPage({
  params,
}: {
  params: { lang: string };
}) {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">AWS IAM Security</h1>
            <p className="text-2xl text-amber-100 mb-4">Identity & Access Management 2026</p>
            <p className="text-xl text-white/80 mb-8">Least Privilege, SCPs, Permission Boundaries, OIDC & Access Analyzer</p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Least Privilege</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">SCP</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">OIDC</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Access Analyzer</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">AWS IAM Security Pillars</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <h3 className="font-semibold text-orange-900 mb-2">Identity</h3>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• IAM Users (avoid!)</li>
                  <li>• IAM Roles (prefer!)</li>
                  <li>• Identity Center (SSO)</li>
                  <li>• Federation (SAML/OIDC)</li>
                </ul>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <h3 className="font-semibold text-amber-900 mb-2">Access Control</h3>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Least Privilege Policies</li>
                  <li>• Permission Boundaries</li>
                  <li>• Service Control Policies</li>
                  <li>• Resource-based Policies</li>
                </ul>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h3 className="font-semibold text-yellow-900 mb-2">Monitoring</h3>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Access Analyzer</li>
                  <li>• IAM Access Advisor</li>
                  <li>• CloudTrail</li>
                  <li>• Credential Reports</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Least Privilege IAM Policies</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# Terraform - Production-Grade IAM Role
resource "aws_iam_role" "app_role" {
  name = "production-app-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Federated = aws_iam_openid_connect_provider.gitlab.arn
      }
      Action = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = {
          "${aws_iam_openid_connect_provider.gitlab.url}:sub" = "project_path:group/app:ref_type:branch:ref:main"
        }
      }
    }]
  })
}

# Minimal S3 Permissions (specific bucket only)
resource "aws_iam_role_policy" "s3_access" {
  name = "s3-production-access"
  role = aws_iam_role.app_role.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "ListSpecificBucket"
        Effect = "Allow"
        Action = [
          "s3:ListBucket",
          "s3:GetBucketLocation"
        ]
        Resource = "arn:aws:s3:::company-data-prod"
        Condition = {
          StringEquals = {
            "s3:prefix" = ["app/", ""]
          }
        }
      },
      {
        Sid    = "ReadWriteSpecificPrefix"
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject"
        ]
        Resource = "arn:aws:s3:::company-data-prod/app/*"
        Condition = {
          StringEquals = {
            "s3:x-amz-server-side-encryption" = "aws:kms"
          }
        }
      }
    ]
  })
}

# DynamoDB Table-Level Access
resource "aws_iam_role_policy" "dynamodb_access" {
  name = "dynamodb-access"
  role = aws_iam_role.app_role.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid    = "SpecificTableAccess"
      Effect = "Allow"
      Action = [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query"
      ]
      Resource = aws_dynamodb_table.app_table.arn
      Condition = {
        ForAllValues:StringEquals = {
          "dynamodb:LeadingKeys" = ["${aws:PrincipalTag/tenant_id}"]
        }
      }
    }]
  })
}`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Service Control Policies (SCP)</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# SCP - Organization Guardrails

# 1. Deny Root Account Usage
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "DenyRootUsage",
    "Effect": "Deny",
    "Action": "*",
    "Resource": "*",
    "Condition": {
      "StringLike": {
        "aws:PrincipalArn": ["arn:aws:iam::*:root"]
      }
    }
  }]
}

# 2. Require MFA for Sensitive Operations
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "RequireMFAForSensitive",
    "Effect": "Deny",
    "Action": [
      "iam:CreateUser",
      "iam:DeleteAccountPasswordPolicy",
      "cloudtrail:StopLogging",
      "guardduty:DeleteDetector"
    ],
    "Resource": "*",
    "Condition": {
      "BoolIfExists": {
        "aws:MultiFactorAuthPresent": "false"
      }
    }
  }]
}

# 3. Restrict AWS Regions
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "RestrictRegions",
    "Effect": "Deny",
    "Action": "*",
    "Resource": "*",
    "Condition": {
      "StringNotEquals": {
        "aws:RequestedRegion": [
          "eu-central-1",
          "eu-west-1",
          "us-east-1"
        ]
      },
      "StringNotEqualsIfExists": {
        "aws:PrincipalTag/exception-region": "true"
      }
    }
  }]
}

# 4. Deny Unapproved Instance Types
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "DenyLargeInstances",
    "Effect": "Deny",
    "Action": [
      "ec2:RunInstances",
      "eks:CreateNodegroup"
    ],
    "Resource": [
      "arn:aws:ec2:*:*:instance/*"
    ],
    "Condition": {
      "ForAnyValue:StringNotLike": {
        "ec2:InstanceType": [
          "t3.*",
          "t4g.*",
          "m6g.*"
        ]
      }
    }
  }]
}`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">OIDC Federation (GitLab/GitHub)</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# Terraform - OIDC Provider for GitLab

# Create OIDC Provider
resource "aws_iam_openid_connect_provider" "gitlab" {
  url = "https://gitlab.company.com"
  
  client_id_list = [
    "https://gitlab.company.com",  # Audience for GitLab
  ]
  
  thumbprint_list = [
    "A1B2C3D4E5F6..."  # GitLab's certificate thumbprint
  ]
}

# Role for GitLab CI
resource "aws_iam_role" "gitlab_ci" {
  name = "gitlab-ci-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Federated = aws_iam_openid_connect_provider.gitlab.arn
      }
      Action = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = {
          # Only allow specific project
          "gitlab.company.com:sub" = "project_path:mygroup/myproject:ref_type:branch:ref:main"
        }
        StringLike = {
          # Optional: restrict to protected branches
          "gitlab.company.com:ref" = "refs/heads/main"
        }
      }
    }]
  })
  
  max_session_duration = 3600  # 1 hour max
}

# GitLab CI Configuration (no long-term AWS credentials)
# .gitlab-ci.yml
deploy:
  id_tokens:
    GITLAB_ID_TOKEN:
      aud: https://gitlab.company.com
  script:
    - export AWS_WEB_IDENTITY_TOKEN=${GITLAB_ID_TOKEN}
    - export AWS_ROLE_ARN=arn:aws:iam::123456789:role/gitlab-ci-role
    - aws sts get-caller-identity`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">IAM Access Analyzer</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# Terraform - Access Analyzer

resource "aws_accessanalyzer_analyzer" "organization" {
  analyzer_name = "organization-analyzer"
  type          = "ORGANIZATION"
  
  tags = {
    Purpose = "Security Monitoring"
  }
}

# Custom Analyzer Archive Rule (reduce noise)
resource "aws_accessanalyzer_archive_rule" "exclude_dev" {
  analyzer_name = aws_accessanalyzer_analyzer.organization.analyzer_name
  rule_name     = "exclude-development"
  
  filter {
    criteria = "resourceArn"
    contains = ["arn:aws:s3:::dev-"]
  }
  
  filter {
    criteria = "principal.accountId"
    eq       = ["123456789012"]  # Sandbox account
  }
}

# External Access Findings to Security Hub
resource "aws_cloudwatch_event_rule" "access_analyzer" {
  name        = "access-analyzer-findings"
  description = "Capture IAM Access Analyzer findings"
  
  event_pattern = jsonencode({
    source      = ["aws.access-analyzer"]
    detail-type = ["Access Analyzer Finding"]
    detail = {
      status = ["ACTIVE"]
      findingType = ["ExternalAccess"]
    }
  })
}

# Auto-remediate S3 public access
resource "aws_cloudwatch_event_target" "lambda_remediation" {
  rule = aws_cloudwatch_event_rule.access_analyzer.name
  arn  = aws_lambda_function.s3_remediation.arn
}`}
              </pre>
            </div>
          </section>

          <section className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">AWS IAM Security Assessment</h2>
            <a href="/check" className="inline-block px-6 py-3 bg-white text-orange-600 rounded-lg font-semibold">Assessment Starten</a>
          </section>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "AWS IAM Security 2026",
        author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        datePublished: "2026-03-29",
      })}} />
    </main>
  );
}
