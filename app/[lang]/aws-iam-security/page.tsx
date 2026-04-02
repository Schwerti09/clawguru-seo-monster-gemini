import type { Metadata } from "next";
import { SUPPORTED_LOCALES, type Locale, localeAlternates } from "@/lib/i18n";
import { BASE_URL } from "@/lib/config";
import { getCoreSecurityLinks } from "@/lib/core-security-links";

export const dynamic = "force-static";
export const revalidate = 86400;

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale;

  return {
    title: "AWS IAM Security 2026 | Best Practices",
    description: "AWS IAM Security Guide - Least Privilege, SCPs, OIDC",
    keywords: ["AWS", "IAM", "Security"],
    alternates: {
      ...localeAlternates(`/${locale}/aws-iam-security`),
    },
  };
}

export default function AWSIAMPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale;
  const prefix = `/${locale}`;
  const coreLinks = getCoreSecurityLinks(locale);

  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">AWS IAM Security</h1>
            <p className="text-2xl text-amber-100 mb-4">Identity & Access Management 2026</p>
            <p className="text-xl text-white/80 mb-8">Least Privilege, SCPs, Permission Boundaries, OIDC</p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Least Privilege</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">SCP</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">OIDC</span>
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
                </ul>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h3 className="font-semibold text-yellow-900 mb-2">Monitoring</h3>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Access Analyzer</li>
                  <li>• IAM Access Advisor</li>
                  <li>• CloudTrail</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Terraform IAM Configuration</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# Production-Grade IAM Role with OIDC
resource "aws_iam_role" "app" {
  name = "production-app"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = { Federated = "arn:aws:iam::123:oidc-provider/gitlab.com" }
      Action = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = { "gitlab.com:sub" = "project_path:group/app:ref_type:branch:ref:main" }
      }
    }]
  })
}

# Least Privilege S3 Policy
resource "aws_iam_role_policy" "s3" {
  name = "s3-access"
  role = aws_iam_role.app.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid    = "SpecificBucketOnly"
      Effect = "Allow"
      Action = ["s3:GetObject", "s3:PutObject"]
      Resource = "arn:aws:s3:::bucket-name/app/*"
    }]
  })
}`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Service Control Policies</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# Deny Root Account Usage
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "DenyRoot",
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

# Require MFA for Sensitive Operations
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "RequireMFA",
    "Effect": "Deny",
    "Action": [
      "iam:CreateUser",
      "cloudtrail:StopLogging"
    ],
    "Resource": "*",
    "Condition": {
      "BoolIfExists": {
        "aws:MultiFactorAuthPresent": "false"
      }
    }
  }]
}`}
              </pre>
            </div>
          </section>

          <section className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">AWS IAM Security Assessment</h2>
            <a href={coreLinks.check} className="inline-block px-6 py-3 bg-white text-orange-600 rounded-lg font-semibold">Assessment Starten</a>
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

// End of file
