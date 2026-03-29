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
      ? "Wiz Security 2026 | Cloud-Native Application Protection (CNAPP)"
      : "Wiz Security 2026 | Cloud-Native Application Protection (CNAPP)",
    description: locale === "de"
      ? "Wiz Security: CNAPP, Cloud Security Posture, Container Security & Identity Management."
      : "Wiz security: CNAPP, cloud security posture, container security & identity management.",
    keywords: [
      "Wiz security",
      "Wiz CNAPP",
      "Cloud-native security",
      "CNAPP platform",
      "Cloud security posture",
      "Agentless security",
      "Cloud visibility",
      "Wiz sensor",
      "Cloud vulnerability",
      "Multi-cloud security",
    ],
    alternates: {
      canonical: `/${locale}/wiz-security`,
      ...localeAlternates(`/${locale}/wiz-security`),
    },
    openGraph: {
      title: "Wiz Security 2026: CNAPP Platform",
      description: "Secure multi-cloud environments with Wiz agentless CNAPP platform.",
      type: "article",
      url: `${BASE_URL}/${locale}/wiz-security`,
    },
  };
}

export default async function WizSecurityPage({
  params,
}: {
  params: { lang: string };
}) {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Wiz Security</h1>
            <p className="text-2xl text-indigo-200 mb-4">CNAPP Platform 2026</p>
            <p className="text-xl text-white/80 mb-8">Cloud Security Posture, Container Security, Identity Management & Attack Path Analysis</p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">CNAPP</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">CSPM</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">CWPP</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">CIEM</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Wiz CNAPP Platform</h2>
            <p className="text-slate-700 text-lg mb-6">
              Wiz ist die führende Cloud-Native Application Protection Platform (CNAPP). Agentless, API-basiert und extrem schnell - Wiz scannt die komplette Cloud-Infrastruktur in Minuten.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-2">CSPM</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Configuration Scan</li>
                  <li>• Compliance Checks</li>
                  <li>• Misconfigurations</li>
                  <li>• Best Practices</li>
                </ul>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                <h3 className="font-semibold text-indigo-900 mb-2">CWPP</h3>
                <ul className="text-sm text-indigo-800 space-y-1">
                  <li>• Container Scanning</li>
                  <li>• VM Scanning</li>
                  <li>• Vulnerability Mgmt</li>
                  <li>• Runtime Threats</li>
                </ul>
              </div>
              <div className="bg-violet-50 border border-violet-200 rounded-xl p-6">
                <h3 className="font-semibold text-violet-900 mb-2">CIEM</h3>
                <ul className="text-sm text-violet-800 space-y-1">
                  <li>• IAM Analysis</li>
                  <li>• Privilege Detection</li>
                  <li>• Toxic Combinations</li>
                  <li>• Identity Risks</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Wiz Deployment & Integration</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# Wiz Cloud Connector Setup

## AWS Integration
# CloudFormation Template
AWSTemplateFormatVersion: '2010-09-09'
Description: Wiz Cloud Connector

Resources:
  WizRole:
    Type: AWS::IAM::Role
    Properties:
      RoleName: Wiz-Connector-Role
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              AWS: arn:aws:iam::197171649850:root
            Action: sts:AssumeRole
            Condition:
              StringEquals:
                sts:ExternalId: !Ref WizExternalId
      ManagedPolicyArns:
        - arn:aws:iam::aws:policy/SecurityAudit
        - arn:aws:iam::aws:policy/ReadOnlyAccess
      
      InlinePolicies:
        - PolicyName: WizAdditionalPermissions
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Effect: Allow
                Action:
                  - ec2:GetSnapshotBlockPublicAccessConfiguration
                  - elasticfilesystem:DescribeFileSystemPolicy
                  - lightsail:GetInstancePortStates
                Resource: "*"

## Azure Integration
# Service Principal für Wiz

# Create Service Principal
az ad sp create-for-rbac \
  --name "Wiz-Connector" \
  --role Reader \
  --scopes /subscriptions/$SUBSCRIPTION_ID

# Assign additional roles
az role assignment create \
  --assignee "Wiz-Connector" \
  --role "Security Reader" \
  --scope /subscriptions/$SUBSCRIPTION_ID

# Get credentials for Wiz Portal
{
  "tenantId": "...",
  "subscriptionId": "...",
  "applicationId": "...",
  "secret": "..."
}

## GCP Integration
# Service Account

gcloud iam service-accounts create wiz-connector \
  --display-name "Wiz Cloud Connector"

# Grant roles
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member "serviceAccount:wiz-connector@$PROJECT_ID.iam.gserviceaccount.com" \
  --role "roles/viewer"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member "serviceAccount:wiz-connector@$PROJECT_ID.iam.gserviceaccount.com" \
  --role "roles/securitycenter.adminViewer"

# Create and download key
gcloud iam service-accounts keys create wiz-key.json \
  --iam-account wiz-connector@$PROJECT_ID.iam.gserviceaccount.com

## Kubernetes (Wiz Sensor)
# Helm Chart Installation

helm repo add wiz https://charts.wiz.io/
helm repo update

helm install wiz-sensor wiz/wiz-sensor \
  --namespace wiz \
  --create-namespace \
  --set wizApiToken.clientId=$WIZ_CLIENT_ID \
  --set wizApiToken.clientSecret=$WIZ_CLIENT_SECRET \
  --set clusterName=production \
  --set enabledScanTypes="VULNERABILITY,MISCONFIGURATION,SECRETS"

## Wiz CLI
# Install
curl -sL https://wizcli.app.wiz.io/latest/wizcli-linux-amd64 -o wizcli
chmod +x wizcli

# Authenticate
./wizcli auth --client-id=$WIZ_CLIENT_ID --client-secret=$WIZ_CLIENT_SECRET

# Scan Container Image
./wizcli docker scan --image myapp:latest --tag production

# Scan IaC
./wizcli iac scan --path ./terraform

# Scan Directory
./wizcli dir scan --path ./src

# CI/CD Integration
./wizcli docker scan --image $IMAGE:$TAG \
  --policy "Critical Vulnerabilities" \
  --fail-on-high-severity`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Wiz Attack Path Analysis</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# Wiz Security Graph & Attack Paths

## Wiz Query Language (WQL)
# Cloud Configuration Query

# Find exposed EC2 instances with admin roles
source := "AWS"
assetType := "VIRTUAL_MACHINE"
WHERE
  internetExposure = "exposed" AND
  effectivePermissions contains "sts:AssumeRole" AND
  attachedRoles has AdminAccess

# Find containers running as root with sensitive mounts
source := "KUBERNETES"
assetType := "CONTAINER"
WHERE
  runAsUser = 0 AND
  volumeMounts contains "/var/run/docker.sock"

# Find toxic combinations (Wiz unique feature)
# Example: Publicly accessible VM with high privileges + unencrypted storage

source := "AWS"
WHERE
  assetType = "VIRTUAL_MACHINE" AND
  internetExposure = "exposed" AND
  effectivePermissions has "*:*" AND
  connectedTo contains { 
    assetType = "STORAGE_BUCKET" AND 
    encryption = "none" 
  }

## Wiz Automation (Event-Driven)
# Auto-remediation Playbook

# 1. Detect public S3 bucket
trigger:
  event: NEW_CRITICAL_ISSUE
  filters:
    issueType: S3_BUCKET_PUBLIC_ACCESS

# 2. Auto-remediate
actions:
  - type: AWS_API_CALL
    service: s3
    action: PutBucketAcl
    parameters:
      Bucket: {{ issue.resource.name }}
      ACL: private
  
  - type: NOTIFICATION
    channel: slack
    message: "Auto-remediated public S3 bucket: {{ issue.resource.name }}"
  
  - type: TICKET
    system: jira
    project: SEC
    summary: "Auto-remediated: Public S3 Bucket"

## Wiz Outpost (On-Premises)
# Deploy Wiz scanner on-premises

apiVersion: apps/v1
kind: Deployment
metadata:
  name: wiz-outpost
  namespace: wiz
spec:
  replicas: 1
  selector:
    matchLabels:
      app: wiz-outpost
  template:
    metadata:
      labels:
        app: wiz-outpost
    spec:
      containers:
      - name: outpost
        image: wiziopublic.azurecr.io/wiz-outpost:latest
        env:
        - name: WIZ_CLIENT_ID
          valueFrom:
            secretKeyRef:
              name: wiz-credentials
              key: client-id
        - name: WIZ_CLIENT_SECRET
          valueFrom:
            secretKeyRef:
              name: wiz-credentials
              key: client-secret
        - name: SCAN_INTERVAL
          value: "3600"

# Wiz Sensor Network Policies
# Restrict egress from Wiz sensors

apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: wiz-sensor
  namespace: wiz
spec:
  podSelector:
    matchLabels:
      app: wiz-sensor
  policyTypes:
  - Egress
  egress:
  - to:
    - namespaceSelector: {}  # Internal cluster
    ports:
    - protocol: TCP
      port: 443
  - to: []  # Wiz cloud endpoints
    ports:
    - protocol: TCP
      port: 443`}
              </pre>
            </div>
          </section>

          <section className="bg-gradient-to-r from-blue-700 to-indigo-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Wiz Security Assessment</h2>
            <a href="/check" className="inline-block px-6 py-3 bg-white text-blue-700 rounded-lg font-semibold">Assessment Starten</a>
          </section>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "Wiz Security 2026",
        author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        datePublished: "2026-03-29",
      })}} />
    </main>
  );
}
