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
      ? "Azure AD Security 2026 | Entra ID Security Best Practices"
      : "Azure AD Security 2026 | Entra ID Security Best Practices",
    description: locale === "de"
      ? "Azure AD Security: Conditional Access, PIM, Zero Trust, Passwordless, Identity Protection, App Registrations & CA Policies."
      : "Azure AD security: Conditional Access, PIM, Zero Trust, passwordless, Identity Protection, app registrations & CA policies.",
    keywords: [
      "Azure AD security",
      "Azure AD hardening",
      "Entra ID security",
      "Azure AD Conditional Access",
      "Azure AD PIM",
      "Azure Zero Trust",
      "Azure AD passwordless",
      "Azure Identity Protection",
      "Azure AD app registration",
      "Microsoft security",
    ],
    alternates: buildLocalizedAlternates(locale, "/azure-ad-security"),
    openGraph: {
      title: "Azure AD Security 2026: Entra ID Protection",
      description: "Azure AD security with Conditional Access, PIM, Zero Trust & passwordless.",
      type: "article",
      url: `${BASE_URL}/${locale}/azure-ad-security`,
    },
  };
}

export default async function AzureADSecurityPage({
  params,
}: {
  params: { lang: string };
}) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale;
  const prefix = `/${locale}`;
  const coreLinks = getCoreSecurityLinks(locale);
  return (
    <main className="min-h-screen bg-gray-800">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-sky-800 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Azure AD Security</h1>
            <p className="text-2xl text-blue-200 mb-4">Entra ID Protection 2026</p>
            <p className="text-xl text-white/80 mb-8">Conditional Access, PIM, Zero Trust, Passwordless & Identity Protection</p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Conditional Access</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">PIM</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Zero Trust</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Passwordless</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Azure AD Security Architecture</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-900 border border-blue-700 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-2">Identity Foundation</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Cloud-Only vs Hybrid</li>
                  <li>• Passwordless Auth</li>
                  <li>• MFA Enforcement</li>
                  <li>• Identity Protection</li>
                </ul>
              </div>
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-6">
                <h3 className="font-semibold text-sky-900 mb-2">Access Control</h3>
                <ul className="text-sm text-sky-800 space-y-1">
                  <li>• Conditional Access</li>
                  <li>• Privileged Identity</li>
                  <li>• App Management</li>
                  <li>• Device Compliance</li>
                </ul>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                <h3 className="font-semibold text-indigo-900 mb-2">Governance</h3>
                <ul className="text-sm text-indigo-800 space-y-1">
                  <li>• Access Reviews</li>
                  <li>• Entitlement Mgmt</li>
                  <li>• Audit Logs</li>
                  <li>• Sign-in Analytics</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Conditional Access Policies</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# Terraform - Conditional Access Policies

# 1. Require MFA for All Users
resource "azuread_conditional_access_policy" "mfa_all" {
  display_name = "Require MFA for All Users"
  state        = "enabled"

  conditions {
    applications {
      included_applications = ["All"]
    }
    
    users {
      included_users = ["All"]
      excluded_users = [
        azuread_group.breakglass.object_id  # Exclude break-glass
      ]
    }
    
    client_app_types = ["all"]
  }

  grant_controls {
    operator          = "OR"
    built_in_controls = ["mfa"]
  }
}

# 2. Block Legacy Authentication
resource "azuread_conditional_access_policy" "block_legacy" {
  display_name = "Block Legacy Authentication"
  state        = "enabled"

  conditions {
    applications {
      included_applications = ["All"]
    }
    
    users {
      included_users = ["All"]
    }
    
    client_app_types = ["exchangeActiveSync", "other"]
  }

  grant_controls {
    operator          = "OR"
    built_in_controls = ["block"]
  }
}

# 3. Require Compliant Device for Admin Roles
resource "azuread_conditional_access_policy" "admin_device" {
  display_name = "Require Compliant Device for Admins"
  state        = "enabled"

  conditions {
    applications {
      included_applications = ["All"]
    }
    
    users {
      included_roles = [
        "62e90394-69f5-4237-9190-012177145e10",  # Global Admin
        "fdd7a751-b60b-444a-984c-02652fe8fa1c",  # Groups Admin
      ]
    }
    
    client_app_types    = ["all"]
    sign_in_risk_levels = ["high"]
  }

  grant_controls {
    operator          = "AND"
    built_in_controls = ["mfa", "compliantDevice"]
  }
  
  session_controls {
    sign_in_frequency = 4
    sign_in_frequency_period = "hours"
  }
}

# 4. Block Access by Location
resource "azuread_conditional_access_policy" "geo_block" {
  display_name = "Block High-Risk Countries"
  state        = "enabled"

  conditions {
    applications {
      included_applications = ["All"]
    }
    
    users {
      included_users = ["All"]
    }
    
    locations {
      included_locations = [
        azuread_named_location.high_risk_countries.id
      ]
    }
  }

  grant_controls {
    operator          = "OR"
    built_in_controls = ["block"]
  }
}`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Privileged Identity Management (PIM)</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# Terraform - PIM Role Settings

# Eligible Assignment for Global Admin
resource "azuread_privileged_access_group_eligibility_schedule" "admin" {
  group_id             = azuread_group.global_admins.object_id
  principal_id         = data.azuread_user.admin.object_id
  assignment_schedule = {
    start_date_time = timestamp()
    expiration = {
      duration_days = 365
    }
  }
  
  justification = "Annual admin assignment"
}

# PIM Role Settings - Require Approval
resource "azuread_privileged_access_group_role_setting" "approval_required" {
  group_id = azuread_group.global_admins.object_id
  
  admin_eligible_settings {
    maximum_duration_hours = 8
    
    approval_rules {
      enabled = true
      
      approval_stage {
        primary_approver {
          object_id = data.azuread_user.security_manager.object_id
          type      = "user"
        }
      }
    }
  }
  
  admin_active_settings {
    maximum_duration_hours = 4
    
    ticketer_rules {
      enabled = true
      ticketer {
        object_id = azuread_service_principal.servicenow.object_id
        type      = "servicePrincipal"
      }
    }
  }
  
  activation_rules {
    maximum_duration_hours = 4
    
    require_approval = true
    
    required_conditional_access_authentication_context = {
      authentication_context_id = "c1"
    }
  }
}`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">App Registration Security</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# Terraform - Secure App Registration

resource "azuread_application" "api_app" {
  display_name = "Production API"
  
  # Owners (not service principals)
  owners = [
    data.azuread_user.tech_lead.object_id
  ]
  
  # No implicit grant (OAuth2 security)
  web {
    redirect_uris = ["https://api.company.com/auth/callback"]
    
    implicit_grant {
      access_token_issuance_enabled = false
      id_token_issuance_enabled       = true  # Only for SPA
    }
  }
  
  # API Permissions (least privilege)
  required_resource_access {
    resource_app_id = "00000003-0000-0000-c000-000000000000"  # Microsoft Graph
    
    resource_access {
      id   = "e1fe6dd8-ba31-4d61-89e7-88639da4683d"  # User.Read
      type = "Scope"
    }
  }
  
  # App Roles (custom permissions)
  app_role {
    allowed_member_types = ["User", "Application"]
    description          = "Read production data"
    display_name         = "Production.Read"
    enabled              = true
    id                   = "12345678-1234-1234-1234-123456789012"
    value                = "Production.Read"
  }
  
  # API exposed by this app
  api {
    requested_access_token_version = 2
    
    oauth2_permission_scope {
      admin_consent_description  = "Read all production data"
      admin_consent_display_name = "Read Production"
      enabled                    = true
      id                         = "abcdef12-1234-5678-90ab-cdef12345678"
      type                       = "Admin"
      value                      = "Production.Read.All"
    }
  }
  
  # Certificate-based auth (no secrets!)
  key_credentials {
    type           = "AsymmetricX509Cert"
    usage          = "Verify"
    value          = filebase64("$\${path.module}/cert.cer")
    end_date       = "2027-03-29T00:00:00Z"
    start_date     = "2026-03-29T00:00:00Z"
  }
  
  # Optional Claims
  optional_claims {
    id_token {
      name                  = "groups"
      source                = null
      essential             = false
      additional_properties = []
    }
  }
}

# Service Principal (Enterprise App)
resource "azuread_service_principal" "api_sp" {
  application_id = azuread_application.api_app.application_id
  
  # Disable password-based auth
  preferred_single_sign_on_mode = "openIdConnect"
  
  # Notes for security team
  notes = "Production API - Certificate auth only"
}`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Identity Protection & Risk Policies</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# PowerShell/Graph API - Identity Protection

# Sign-in Risk Policy
$signInRiskPolicy = @{
  displayName = "High Risk Sign-in Policy"
  state = "enabled"
  conditions = @{
    signInRiskLevels = @("high", "medium")
    applications = @{ includeApplications = @("All") }
    users = @{ includeUsers = @("All") }
  }
  grantControls = @{
    operator = "OR"
    builtInControls = @("mfa")
    customAuthenticationFactors = @()
    termsOfUse = @()
  }
}

# User Risk Policy
$userRiskPolicy = @{
  displayName = "High Risk User Policy"
  state = "enabled"
  conditions = @{
    userRiskLevels = @("high")
    applications = @{ includeApplications = @("All") }
    users = @{ includeUsers = @("All") }
  }
  grantControls = @{
    operator = "OR"
    builtInControls = @("passwordChange", "mfa")
  }
}

# Risk Detection Query (Microsoft Graph)
GET https://graph.microsoft.com/v1.0/identityProtection/riskDetections
  ?$filter=riskState eq 'atRisk' and detectedDateTime gt 2026-03-01
  &$$orderby=detectedDateTime desc
  &$$select=userPrincipalName,riskDetail,riskLevel,detectedDateTime

# Automated Response via Logic App
# Trigger: Risk Detection created
# Action: Disable user + notify SOC + force password reset`}
              </pre>
            </div>
          </section>

          <section className="bg-gradient-to-r from-blue-600 to-sky-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Azure AD Security Assessment</h2>
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
        headline: "Azure AD Security 2026",
        author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        datePublished: "2026-03-29",
      })}} />
    </main>
  );
}
