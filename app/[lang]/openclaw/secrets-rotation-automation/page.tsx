import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/openclaw/secrets-rotation-automation"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const title = "Secrets Rotation Automation: Vault Management 2026"
  const description = "Complete secrets rotation automation guide with HashiCorp Vault, Kubernetes secrets, and automated credential management for security compliance."
  return {
    title,
    description,
    keywords: ["secrets rotation", "vault automation", "credential management", "hashicorp vault", "kubernetes secrets"],
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

export default function SecretsRotationAutomationPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-sm">
          <strong>"Not a Pentest" Notice</strong>: This guide is for hardening your own systems. No attack tools.
        </div>
        <h1 className="text-4xl font-bold mb-4">Secrets Rotation Automation: Vault Management</h1>
        <p className="text-lg text-gray-600 mb-8">Complete automated secrets rotation with HashiCorp Vault, Kubernetes integration, and compliance-driven credential management.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Secrets Management Fundamentals</h2>
          <div className="bg-gray-100 p-6 rounded-lg mb-4">
            <h3 className="font-semibold mb-2">Core Components</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Automated credential rotation policies</li>
              <li>Zero-trust access controls</li>
              <li>Audit trails and compliance logging</li>
              <li>Dynamic secrets generation</li>
              <li>Multi-cloud secrets orchestration</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">HashiCorp Vault Configuration</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre>
{`# Vault configuration for automated rotation
# vault-config.hcl

listener "tcp" {
  address = "0.0.0.0:8200"
  tls_disable = false
  tls_cert_file = "/etc/vault/tls/vault.crt"
  tls_key_file = "/etc/vault/tls/vault.key"
}

storage "consul" {
  address = "consul.service.consul:8500"
  path = "vault/"
}

api_addr = "https://vault.example.com"
cluster_addr = "https://vault.example.com:8201"

# Enable audit logging
ui = true

# Enable authentication methods
auth "kubernetes" {
  type = "kubernetes"
}

auth "jwt" {
  type = "jwt"
}

# Enable secrets engines
secrets "database" {
  type = "database"
}

secrets "kv" {
  type = "kv"
  options = {
    version = "2"
  }
}

secrets "transit" {
  type = "transit"
} `}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Database Secrets Rotation</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre>
{`# Enable database secrets engine with rotation
vault secrets enable database

# Configure PostgreSQL database connection
vault write database/config/postgresql \
    plugin_name="postgresql-database-plugin" \
    connection_url="postgresql://username:password@postgres.example.com:5432/mydb" \
    allowed_roles="readonly,readwrite" \
    username="vault" \
    password="vault_password"

# Create database roles with rotation
vault write database/roles/readonly \
    db_name="postgresql" \
    creation_statements="CREATE ROLE \"{{name}}\" WITH LOGIN PASSWORD '{{password}}' NOINHERIT; GRANT SELECT ON ALL TABLES IN SCHEMA public TO \"{{name}}\";" \
    default_ttl="1h" \
    max_ttl="24h"

vault write database/roles/readwrite \
    db_name="postgresql" \
    creation_statements="CREATE ROLE \"{{name}}\" WITH LOGIN PASSWORD '{{password}}' NOINHERIT; GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO \"{{name}}\";" \
    default_ttl="30m" \
    max_ttl="12h"

# Configure automatic rotation
vault write database/rotate-root/postgresql`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Kubernetes Integration</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre>
{`# Kubernetes auth method configuration
vault auth enable kubernetes

# Configure Kubernetes auth
vault write auth/kubernetes/config \
    kubernetes_host="https://kubernetes.default.svc:443" \
    kubernetes_ca_cert=@/var/run/secrets/kubernetes.io/serviceaccount/ca.crt \
    token_reviewer_jwt=@/var/run/secrets/kubernetes.io/serviceaccount/token

# Create policy for database access
vault policy write db-policy - <<'EOF'
path "database/creds/readonly" {
  capabilities = ["read"]
}
path "database/creds/readwrite" {
  capabilities = ["read"]
}
EOF

# Create Kubernetes role
vault write auth/kubernetes/role/database-role \
    bound_service_account_names="app-sa" \
    bound_service_account_namespaces="default" \
    policies="db-policy" \
    ttl="1h" \
    max_ttl="24h"

# Kubernetes secret configuration
apiVersion: v1
kind: Secret
metadata:
  name: vault-secret
  annotations:
    vault.hashicorp.com/agent-inject: "true"
    vault.hashicorp.com/role: "database-role"
    vault.hashicorp.com/agent-inject-secret-database: "database/creds/readonly"
type: Opaque`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Automation Scripts</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre>
{`#!/bin/bash
# secrets-rotation.sh - Automated secrets rotation

# Configuration
VAULT_ADDR="https://vault.example.com"
VAULT_TOKEN="$VAULT_TOKEN"
LOG_FILE="/var/log/secrets-rotation.log"

# Function to rotate database credentials
rotate_database_credentials() {
    local db_name="$1"
    echo "$(date): Rotating credentials for db_name" >> "$LOG_FILE"
    
    # Rotate root credentials
    vault write -f "database/rotate-root/db_name"
    
    # Revoke existing leases
    vault lease revoke -prefix "database/creds/"
    
    echo "$(date): Successfully rotated db_name credentials" >> "$LOG_FILE"
}

# Function to rotate AWS credentials
rotate_aws_credentials() {
    echo "$(date): Rotating AWS credentials" >> "$LOG_FILE"
    
    # Rotate AWS access keys
    vault write -f "aws/rotate-root"
    
    # Revoke existing leases
    vault lease revoke -prefix "aws/creds/"
    
    echo "$(date): Successfully rotated AWS credentials" >> "$LOG_FILE"
}

# Function to validate rotation success
validate_rotation() {
    local service="$1"
    local test_command="$2"
    
    if eval "$test_command"; then
        echo "$(date): Validation successful for service" >> "$LOG_FILE"
        return 0
    else
        echo "$(date): Validation failed for service" >> "$LOG_FILE"
        return 1
    fi
}

# Main rotation workflow
main() {
    echo "$(date): Starting secrets rotation" >> "$LOG_FILE"
    
    # Rotate database credentials
    rotate_database_credentials "postgresql"
    
    # Rotate AWS credentials
    rotate_aws_credentials
    
    # Validate rotations
    validate_rotation "postgresql" "vault read database/creds/readonly"
    validate_rotation "aws" "vault read aws/creds/sts"
    
    echo "$(date): Secrets rotation completed" >> "$LOG_FILE"
}

# Execute main function
main "$@"`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Compliance and Monitoring</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-100 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Audit Logging</h3>
              <p className="text-sm text-blue-700">Enable comprehensive audit trails for all secrets access and rotation events.</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Compliance Reports</h3>
              <p className="text-sm text-green-700">Generate automated compliance reports for SOC2, ISO27001, and GDPR requirements.</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Alerting</h3>
              <p className="text-sm text-yellow-700">Configure alerts for failed rotations, expiring secrets, and unusual access patterns.</p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-2">Backup and Recovery</h3>
              <p className="text-sm text-red-700">Implement automated backup and disaster recovery procedures for secrets data.</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Further Resources</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/securitycheck`} className="block bg-gray-100 p-4 rounded-lg hover:bg-gray-200">
              <div className="font-semibold text-blue-600">Security Check</div>
              <div className="text-sm text-gray-600">Scan your system now</div>
            </a>
            <a href={`/${locale}/runbooks`} className="block bg-gray-100 p-4 rounded-lg hover:bg-gray-200">
              <div className="font-semibold text-blue-600">Runbooks</div>
              <div className="text-sm text-gray-600">600+ security playbooks</div>
            </a>
            <a href={`/${locale}/openclaw`} className="block bg-gray-100 p-4 rounded-lg hover:bg-gray-200">
              <div className="font-semibold text-blue-600">OpenClaw Framework</div>
              <div className="text-sm text-gray-600">Self-hosted security</div>
            </a>
            <a href={`/${locale}/solutions/kubernetes-security-hardening`} className="block bg-gray-100 p-4 rounded-lg hover:bg-gray-200">
              <div className="font-semibold text-blue-600">Kubernetes Security</div>
              <div className="text-sm text-gray-600">Complete hardening guide</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
