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
      ? "HashiCorp Vault Hardening 2026 | Secrets Management Security"
      : "HashiCorp Vault Hardening 2026 | Secrets Management Security",
    description: locale === "de"
      ? "Vault Hardening: Auto-Unseal, TLS, PKI, Kubernetes Auth, AWS IAM, Sentinel Policies & Audit Logging."
      : "Vault hardening: auto-unseal, TLS, PKI, Kubernetes auth, AWS IAM, Sentinel policies & audit logging.",
    keywords: [
      "Vault hardening",
      "Vault security",
      "HashiCorp Vault",
      "Vault auto-unseal",
      "Vault TLS",
      "Vault PKI",
      "Vault Kubernetes",
      "Vault Sentinel",
      "Vault audit",
      "Secrets management",
    ],
    alternates: {
      ...localeAlternates(`/${locale}/vault-hardening`),
    },
    openGraph: {
      title: "Vault Hardening 2026: Secrets Security",
      description: "Harden HashiCorp Vault with auto-unseal, TLS, PKI & Sentinel policies.",
      type: "article",
      url: `${BASE_URL}/${locale}/vault-hardening`,
    },
  };
}

export default async function VaultHardeningPage({
  params,
}: {
  params: { lang: string };
}) {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-700 via-slate-800 to-black py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Vault Hardening</h1>
            <p className="text-2xl text-slate-300 mb-4">Secrets Management Security 2026</p>
            <p className="text-xl text-white/80 mb-8">Auto-Unseal, TLS, PKI, Kubernetes Auth, Sentinel & Audit</p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Auto-Unseal</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">PKI</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Sentinel</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">K8s Auth</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Vault Auto-Unseal (AWS KMS)</h2>
            <div className="bg-slate-900 rounded-xl p-6">
              <pre className="font-mono text-sm text-green-400">
{`# vault.hcl - Auto-Unseal Configuration
seal "awskms" {
  region     = "eu-central-1"
  kms_key_id = "arn:aws:kms:eu-central-1:123456789:key/vault-unseal"
}

# Or Azure Key Vault
seal "azurekeyvault" {
  client_id     = ""
  client_secret = ""
  tenant_id     = ""
  vault_name    = "vault-keys"
  key_name      = "unseal-key"
}

# GCP Cloud KMS
seal "gcpckms" {
  project    = "my-project"
  region     = "europe-west1"
  key_ring   = "vault-keys"
  crypto_key = "unseal-key"
}`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">TLS & Listener Config</h2>
            <div className="bg-slate-900 rounded-xl p-6">
              <pre className="font-mono text-sm text-green-400">
{`# vault.hcl - TLS Configuration
listener "tcp" {
  address       = "0.0.0.0:8200"
  tls_cert_file = "/etc/vault/vault.crt"
  tls_key_file  = "/etc/vault/vault.key"
  
  # TLS 1.3 only
  tls_min_version = "tls13"
  
  # Require client certs for admin
  tls_require_and_verify_client_cert = false
  tls_client_ca_file = "/etc/vault/ca.crt"
  
  # Ciphers
  tls_cipher_suites = "TLS_AES_256_GCM_SHA384,TLS_CHACHA20_POLY1305_SHA256"
  
  # HSTS
  x_forwarded_for_authorized_addrs = ["10.0.0.0/8"]
  x_forwarded_for_hop_skips = 1
}

# Disable UI if not needed (API only)
ui = false`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Kubernetes Auth Method</h2>
            <div className="bg-slate-900 rounded-xl p-6">
              <pre className="font-mono text-sm text-green-400">
{`# Enable Kubernetes auth
vault auth enable kubernetes

# Configure JWT validation
vault write auth/kubernetes/config \
  token_reviewer_jwt="@/var/run/secrets/kubernetes.io/serviceaccount/token" \
  kubernetes_host="https://$KUBERNETES_PORT_443_TCP_ADDR:443" \
  kubernetes_ca_cert=@/var/run/secrets/kubernetes.io/serviceaccount/ca.crt

# Create role for service account
vault write auth/kubernetes/role/app-role \
  bound_service_account_names=app \
  bound_service_account_namespaces=production \
  policies=app-read \
  ttl=1h

# Policy: Read specific secrets
path "secret/data/app/*" {
  capabilities = ["read"]
}`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Sentinel Policies (Enterprise)</h2>
            <div className="bg-slate-900 rounded-xl p-6">
              <pre className="font-mono text-sm text-green-400">
{`# Business Hours Only
import "time"

allowed_time = rule {
    time.now.weekday > 0 and time.now.weekday < 6 and
    time.now.hour > 8 and time.now.hour < 18
}

main = rule {
    allowed_time
}

# Require MFA for admin
import "strings"

mfa_required = rule when request.operation in ["create", "update", "delete"] {
    strings.has_prefix(request.path, "secret/admin") == false or
    request.mfa_methods contains "totp"
}

main = rule {
    mfa_required
}`}
              </pre>
            </div>
          </section>

          <section className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Vault Security Assessment</h2>
            <a href="/check" className="inline-block px-6 py-3 bg-white text-slate-800 rounded-lg font-semibold">Assessment Starten</a>
          </section>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "Vault Hardening 2026",
        author: { "@type": "Organization", name: "ClawGuru" },
        datePublished: "2026-03-29",
      })}} />
    </main>
  );
}
