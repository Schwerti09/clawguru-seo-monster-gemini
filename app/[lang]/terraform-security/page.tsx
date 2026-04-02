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
      ? "Terraform Security 2026 | IaC Security & Compliance"
      : "Terraform Security 2026 | IaC Security & Compliance",
    description: locale === "de"
      ? "Terraform Security: tfsec, checkov, State Encryption, Remote Backend, Sentinel Policies, Least Privilege IAM."
      : "Terraform security: tfsec, checkov, state encryption, remote backend, Sentinel policies, least privilege IAM.",
    keywords: [
      "Terraform security",
      "Terraform hardening",
      "IaC security",
      "tfsec",
      "checkov",
      "Terraform state",
      "Terraform backend",
      "Terraform Sentinel",
      "Terraform compliance",
      "Infrastructure as Code",
    ],
    alternates: {
      ...localeAlternates(`/${locale}/terraform-security`),
    },
    openGraph: {
      title: "Terraform Security 2026: IaC Security",
      description: "Secure Terraform with tfsec, state encryption, Sentinel policies & least privilege.",
      type: "article",
      url: `${BASE_URL}/${locale}/terraform-security`,
    },
  };
}

export default async function TerraformSecurityPage({
  params,
}: {
  params: { lang: string };
}) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale;
  const prefix = `/${locale}`;
  const coreLinks = getCoreSecurityLinks(locale);
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-700 via-purple-800 to-indigo-900 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Terraform Security</h1>
            <p className="text-2xl text-purple-200 mb-4">IaC Security & Compliance 2026</p>
            <p className="text-xl text-white/80 mb-8">tfsec, checkov, State Encryption, Sentinel, Least Privilege IAM</p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">tfsec</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">checkov</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Sentinel</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">State Encryption</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">State Security</h2>
            <div className="bg-slate-900 rounded-xl p-6">
              <pre className="font-mono text-sm text-green-400">
{`# backend.tf - Remote Backend with Encryption
terraform {
  backend "s3" {
    bucket       = "terraform-state-prod"
    key          = "infrastructure/terraform.tfstate"
    region       = "eu-central-1"
    encrypt      = true
    kms_key_id   = "arn:aws:kms:eu-central-1:123:key/terraform"
    
    # State locking
    dynamodb_table = "terraform-locks"
    
    # Additional protection
    acl = "private"
  }
}

# State encryption at rest (Terraform Cloud)
terraform {
  cloud {
    organization = "company"
    workspaces {
      name = "production"
    }
  }
}`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">tfsec CI/CD Integration</h2>
            <div className="bg-slate-900 rounded-xl p-6">
              <pre className="font-mono text-sm text-green-400">
{`# .github/workflows/terraform-security.yml
name: Terraform Security
on: [push, pull_request]

jobs:
  tfsec:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run tfsec
        uses: aquasecurity/tfsec-action@v1.0.0
        with:
          soft_fail: false
          
  checkov:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Checkov
        uses: bridgecrewio/checkov-action@master
        with:
          directory: .
          framework: terraform
          soft_fail: false
          
  terraform-validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3
      
      - name: Terraform Init
        run: terraform init -backend=false
        
      - name: Terraform Validate
        run: terraform validate`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Least Privilege IAM</h2>
            <div className="bg-slate-900 rounded-xl p-6">
              <pre className="font-mono text-sm text-green-400">
{`# terraform-deployer-role.tf - Minimal Permissions
data "aws_iam_policy_document" "terraform_deployer" {
  statement {
    sid    = "EC2Minimal"
    effect = "Allow"
    actions = [
      "ec2:DescribeInstances",
      "ec2:DescribeInstanceAttribute",
      "ec2:DescribeInstanceCreditSpecifications",
    ]
    resources = ["*"]
  }
  
  statement {
    sid    = "S3StateAccess"
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:PutObject",
    ]
    resources = [
      "arn:aws:s3:::terraform-state-prod/*"
    ]
  }
  
  statement {
    sid    = "DynamoDBLocking"
    effect = "Allow"
    actions = [
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:DeleteItem",
    ]
    resources = [
      "arn:aws:dynamodb:*:*:table/terraform-locks"
    ]
  }
}`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Sentinel Policies (Terraform Cloud)</h2>
            <div className="bg-slate-900 rounded-xl p-6">
              <pre className="font-mono text-sm text-green-400">
{`# require-private-s3.sentinel
import "tfplan"

# Ensure all S3 buckets are private
s3_buckets = filter tfplan.resource_changes as _, rc {
    rc.type is "aws_s3_bucket" and
    rc.mode is "managed"
}

bucket_is_private = rule when s3_buckets is not empty {
    all s3_buckets as _, bucket {
        bucket.change.after.acl is "private"
    }
}

main = rule {
    bucket_is_private
}

# enforce-tags.sentinel - Require Cost Center Tags
required_tags = ["CostCenter", "Environment", "Owner"]

resources = filter tfplan.resource_changes as _, rc {
    rc.mode is "managed"
}

has_required_tags = rule {
    all resources as _, r {
        all required_tags as tag {
            r.change.after.tags contains tag
        }
    }
}`}
              </pre>
            </div>
          </section>

          <section className="bg-gradient-to-r from-purple-700 to-indigo-700 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Terraform Security Assessment</h2>
            <a href={coreLinks.check} className="inline-block px-6 py-3 bg-white text-purple-700 rounded-lg font-semibold">Assessment Starten</a>
          </section>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "Terraform Security 2026",
        author: { "@type": "Organization", name: "ClawGuru" },
        datePublished: "2026-03-29",
      })}} />
    </main>
  );
}
