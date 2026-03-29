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
      ? "ArgoCD Security 2026 | GitOps & Kubernetes Delivery Security"
      : "ArgoCD Security 2026 | GitOps & Kubernetes Delivery Security",
    description: locale === "de"
      ? "ArgoCD Security: RBAC, SSO, AppProjects, Resource Constraints, Secrets Management & Repository Security. Enterprise GitOps Protection."
      : "ArgoCD security: RBAC, SSO, AppProjects, resource constraints, secrets management & repository security. Enterprise GitOps protection.",
    keywords: [
      "ArgoCD security",
      "GitOps security",
      "ArgoCD RBAC",
      "ArgoCD SSO",
      "ArgoCD AppProject",
      "Kubernetes GitOps",
      "ArgoCD hardening",
      "ArgoCD dex",
      "ArgoCD oidc",
      "GitOps compliance",
    ],
    alternates: {
      canonical: `/${locale}/argocd-security`,
      ...localeAlternates(`/${locale}/argocd-security`),
    },
    openGraph: {
      title: "ArgoCD Security 2026: GitOps Protection",
      description: "Secure ArgoCD with RBAC, SSO, AppProjects, resource constraints & repository security.",
      type: "article",
      url: `${BASE_URL}/${locale}/argocd-security`,
    },
  };
}

export default async function ArgoCDSecurityPage({
  params,
}: {
  params: { lang: string };
}) {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-800 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">ArgoCD Security</h1>
            <p className="text-2xl text-cyan-200 mb-4">GitOps & K8s Delivery Security</p>
            <p className="text-xl text-white/80 mb-8">RBAC, SSO, AppProjects, Resource Constraints, Secrets & Repository Security</p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">RBAC</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">SSO</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">AppProject</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">GitOps</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">ArgoCD Security Architecture</h2>
            <p className="text-slate-700 text-lg mb-6">
              ArgoCD ist ein High-Value Target - es hat direkten Zugriff auf Kubernetes-Cluster und kann Deployments steuern. Kompromittiertes ArgoCD = Kompromittierter Cluster. Defense-in-Depth ist essentiell.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-6">
                <h3 className="font-semibold text-cyan-900 mb-2">Authentication</h3>
                <ul className="text-sm text-cyan-800 space-y-1">
                  <li>• OIDC/Dex Integration</li>
                  <li>• SSO (Okta, Azure AD)</li>
                  <li>• Local Users (avoid!)</li>
                  <li>• Service Accounts</li>
                </ul>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-2">Authorization</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• RBAC Policies</li>
                  <li>• AppProject Isolation</li>
                  <li>• Resource Constraints</li>
                  <li>• Multi-Tenancy</li>
                </ul>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                <h3 className="font-semibold text-indigo-900 mb-2">Repository Security</h3>
                <ul className="text-sm text-indigo-800 space-y-1">
                  <li>• Allowed Repositories</li>
                  <li>• GPG Signature Verification</li>
                  <li>• Secret Management</li>
                  <li>• Policy Enforcement</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">ArgoCD RBAC Configuration</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# argocd-rbac-cm.yaml - RBAC ConfigMap

apiVersion: v1
kind: ConfigMap
metadata:
  name: argocd-rbac-cm
  namespace: argocd
data:
  policy.default: role:readonly
  policy.csv: |
    # Built-in roles
    p, role:readonly, applications, get, *, allow
    p, role:readonly, certificates, get, *, allow
    p, role:readonly, clusters, get, *, allow
    p, role:readonly, repositories, get, *, allow
    p, role:readonly, projects, get, *, allow
    
    # Developer role - specific projects only
    p, role:developer, applications, get, dev-project/*, allow
    p, role:developer, applications, sync, dev-project/*, allow
    p, role:developer, applications, override, dev-project/*, deny   # No resource override
    p, role:developer, applications, delete, dev-project/*, deny      # No delete
    p, role:developer, exec, create, dev-project/*/pod/*, allow       # Pod exec for debugging
    
    # DevOps role - staging + prod sync only
    p, role:devops, applications, get, *, allow
    p, role:devops, applications, sync, staging-project/*, allow
    p, role:devops, applications, sync, prod-project/*, allow
    p, role:devops, applications, create, staging-project/*, allow
    p, role:devops, applications, delete, staging-project/*, allow
    p, role:devops, applications, create, prod-project/*, deny          # No prod app creation
    p, role:devops, applications, delete, prod-project/*, deny         # No prod deletion
    p, role:devops, exec, create, staging-project/*/pod/*, allow
    p, role:devops, exec, create, prod-project/*/pod/*, deny         # No prod exec
    
    # Admin role - but restricted
    p, role:restricted-admin, *, *, *, allow
    p, role:restricted-admin, accounts, delete, *, deny                # Can't delete accounts
    p, role:restricted-admin, accounts, update, *, deny                # Can't modify built-in admin
    
    # Break-glass emergency access (use rarely)
    p, role:emergency, *, *, *, allow
    g, emergency-breakglass, role:emergency
    
    # Group mappings (OIDC)
    g, oidc-k8s-developers, role:developer
    g, oidc-k8s-devops, role:devops
    g, oidc-k8s-admins, role:restricted-admin
    
  # Policy for API tokens (service accounts)
  policy.serviceAccount.csv: |
    p, role:ci-service-account, applications, get, ci-project/*, allow
    p, role:ci-service-account, applications, sync, ci-project/*, allow
    g, ci-service-account, role:ci-service-account`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">AppProject Isolation</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# production-project.yaml - Multi-Tenant AppProject

apiVersion: argoproj.io/v1alpha1
kind: AppProject
metadata:
  name: production
  namespace: argocd
spec:
  description: "Production Applications - Strict Controls"
  
  # Allowed sources (prevent random repos)
  sourceRepos:
  - https://github.com/company/gitops.git
  - https://github.com/company/production-apps.git
  
  # Allowed destinations (clusters/namespaces)
  destinations:
  - namespace: production
    server: https://kubernetes.default.svc
  - namespace: kube-system
    server: https://kubernetes.default.svc
  
  # Allowed cluster resources (prevent cluster-admin)
  clusterResourceWhitelist:
  - group: ''
    kind: Namespace
  - group: storage.k8s.io
    kind: StorageClass
  - group: networking.k8s.io
    kind: IngressClass
  
  # Blacklisted resources (never allow)
  clusterResourceBlacklist:
  - group: rbac.authorization.k8s.io
    kind: ClusterRole
  - group: rbac.authorization.k8s.io
    kind: ClusterRoleBinding
  - group: ''
    kind: Node
  
  # Namespace-level restrictions
  namespaceResourceBlacklist:
  - group: ''
    kind: ResourceQuota
  - group: ''
    kind: LimitRange
  
  # Allowed Kinds
  namespaceResourceWhitelist:
  - group: apps
    kind: Deployment
  - group: apps
    kind: StatefulSet
  - group: ''
    kind: Service
  - group: ''
    kind: ConfigMap
  - group: ''
    kind: Secret  # Managed via External Secrets
  - group: networking.k8s.io
    kind: Ingress
  
  # Resource constraints (prevent resource exhaustion)
  roles:
  - name: prod-deployer
    description: "Production Deployment Role"
    policies:
    - p, proj:production:prod-deployer, applications, get, production/*, allow
    - p, proj:production:prod-deployer, applications, sync, production/*, allow
    groups:
    - oidc-k8s-devops
  
  # Sync windows (maintenance windows only)
  syncWindows:
  - kind: allow
    schedule: "0 2 * * 0"  # Sunday 2 AM
    duration: 4h
    applications:
    - '*'
    namespaces:
    - production
    clusters:
    - https://kubernetes.default.svc
    manualSync: true  # Allow manual override
  
  - kind: deny
    schedule: "0 8-18 * * 1-5"  # Business hours
    duration: 10h
    applications:
    - '*'
  
  # Signature verification (prevent unverified commits)
  signatureKeys:
  - keyID: ABCD1234567890  # Company GPG key
  
  # Require signed commits
  sourceNamespaces:
  - argocd

---
# Development Project (less restrictive)
apiVersion: argoproj.io/v1alpha1
kind: AppProject
metadata:
  name: development
  namespace: argocd
spec:
  description: "Development Environment"
  
  sourceRepos:
  - '*'
  
  destinations:
  - namespace: dev-*
    server: https://kubernetes.default.svc
  
  # Allow more resources in dev
  clusterResourceWhitelist:
  - group: '*'
    kind: '*'
  
  # But still deny dangerous things
  namespaceResourceBlacklist:
  - group: rbac.authorization.k8s.io
    kind: RoleBinding  # Can create roles, not bindings
  
  # No sync windows in dev
  syncWindows: []`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">SSO/OIDC Configuration (Dex)</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# argocd-cm.yaml - OIDC/Dex Configuration

apiVersion: v1
kind: ConfigMap
metadata:
  name: argocd-cm
  namespace: argocd
data:
  # Disable built-in admin (use SSO only)
  admin.enabled: "false"
  
  url: https://argocd.company.com
  
  # OIDC Configuration
  oidc.config: |
    name: Okta
    issuer: https://company.okta.com
    clientID: $oidc.okta.clientId
    clientSecret: $oidc.okta.clientSecret
    requestedScopes: ["openid", "profile", "email", "groups"]
    requestedIDTokenClaims: {"groups": {"essential": true}}
    logoutURL: https://company.okta.com/login/signout
  
  # Dex Configuration (alternative to direct OIDC)
  dex.config: |
    connectors:
    - type: oidc
      id: okta
      name: Okta
      config:
        issuer: https://company.okta.com
        clientID: $dex.okta.clientId
        clientSecret: $dex.okta.clientSecret
        redirectURI: https://argocd.company.com/api/dex/callback
        scopes: ["openid", "profile", "email", "groups"]
        insecureSkipEmailVerified: false
        insecureEnableGroups: true
        claimMapping:
          groups: "groups"
    
    # GitHub Enterprise (for repo access)
    - type: github
      id: github
      name: GitHub
      config:
        hostName: github.company.com
        clientID: $dex.github.clientId
        clientSecret: $dex.github.clientSecret
        redirectURI: https://argocd.company.com/api/dex/callback
        orgs:
        - name: platform-team
          teams:
          - k8s-admins
          - k8s-devops
    
    # Microsoft (Azure AD)
    - type: microsoft
      id: azure
      name: Azure AD
      config:
        clientID: $dex.azure.clientId
        clientSecret: $dex.azure.clientSecret
        redirectURI: https://argocd.company.com/api/dex/callback
        tenant: company.onmicrosoft.com
        groups: true
        onlySecurityGroups: true
  
  # Resource customization (prevent dangerous defaults)
  resource.customizations: |
    apps/Deployment:
      health.lua: |
        # Custom health check logic
    
  # Global resource limits
  resource.overrides: |
    memory.limit: 2Gi
    cpu.limit: "1"`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">ArgoCD Hardened Deployment</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# argocd-values.yaml - Production Helm Values

global:
  securityContext:
    runAsNonRoot: true
    seccompProfile:
      type: RuntimeDefault

server:
  replicas: 2
  
  resources:
    limits:
      cpu: 500m
      memory: 512Mi
    requests:
      cpu: 100m
      memory: 256Mi
  
  # Ingress with TLS
  ingress:
    enabled: true
    ingressClassName: nginx
    annotations:
      nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
      nginx.ingress.kubernetes.io/ssl-passthrough: "true"
      nginx.ingress.kubernetes.io/backend-protocol: "HTTPS"
      cert-manager.io/cluster-issuer: "letsencrypt-prod"
    tls:
    - hosts:
      - argocd.company.com
      secretName: argocd-tls
  
  # Environment variables
  env:
  - name: ARGOCD_SERVER_INSECURE
    value: "false"
  - name: ARGOCD_SERVER_DISABLE_AUTH
    value: "false"
  - name: ARGOCD_SERVER_CONTENT_SECURITY_POLICY
    value: "default-src 'self'; script-src 'self' 'unsafe-inline';"
  - name: ARGOCD_SESSION_DURATION
    value: "8h0m"
  
  # Volume mounts for custom TLS
  volumeMounts:
  - name: custom-tls
    mountPath: /app/config/tls
  
  volumes:
  - name: custom-tls
    secret:
      secretName: argocd-custom-tls

dex:
  enabled: true
  
  resources:
    limits:
      cpu: 200m
      memory: 256Mi
  
  env:
  - name: ARGO_WORKFLOWS_SSO_CLIENT_SECRET
    valueFrom:
      secretKeyRef:
        name: argocd-secret
        key: dex.okta.clientSecret

repoServer:
  replicas: 2
  
  resources:
    limits:
      cpu: "1"
      memory: 1Gi
  
  # Security context for repo-server
  containerSecurityContext:
    allowPrivilegeEscalation: false
    readOnlyRootFilesystem: true
    capabilities:
      drop:
      - ALL
  
  # Mount path for git repos (read-only)
  volumeMounts:
  - name: tmp
    mountPath: /tmp
  - name: helm-working-dir
    mountPath: /helm-working-dir
  - name: plugins
    mountPath: /usr/local/bin/ksops
  
  volumes:
  - name: tmp
    emptyDir: {}
  - name: helm-working-dir
    emptyDir: {}
  - name: plugins
    emptyDir: {}

controller:
  replicas: 1  # Don't scale - uses leader election
  
  resources:
    limits:
      cpu: "2"
      memory: 2Gi
  
  # Rate limiting
  env:
  - name: ARGOCD_RECONCILIATION_TIMEOUT
    value: "180s"
  - name: ARGOCD_HARD_RECONCILIATION_TIMEOUT
    value: "600s"
  - name: ARGOCD_K8S_CLIENT_QPS
    value: "50"
  - name: ARGOCD_K8S_CLIENT_BURST
    value: "100"

# ApplicationSet controller
applicationSet:
  enabled: true
  replicaCount: 2
  
  resources:
    limits:
      cpu: 500m
      memory: 512Mi

# Notifications
notifications:
  enabled: true

# Resource Exclusions (don't watch)
resource.exclusions: |
  - apiGroups:
    - tekton.dev
    kinds:
    - TaskRun
    - PipelineRun
    clusters:
    - "*"
  - apiGroups:
    - cilium.io
    kinds:
    - CiliumEndpoint
    clusters:
    - "*"
