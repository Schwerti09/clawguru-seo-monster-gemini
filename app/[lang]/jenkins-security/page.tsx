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
      ? "Jenkins Security 2026 | CI/CD Hardening & Pipeline Security"
      : "Jenkins Security 2026 | CI/CD Hardening & Pipeline Security",
    description: locale === "de"
      ? "Jenkins Security: Matrix Authorization, CSRF Protection, Script Security, Pipeline Sandboxing & Credentials Management."
      : "Jenkins security: matrix authorization, CSRF protection, script security, pipeline sandboxing & credentials management.",
    keywords: [
      "Jenkins security",
      "Jenkins hardening",
      "Jenkins CI/CD security",
      "Jenkins matrix auth",
      "Jenkins CSRF",
      "Jenkins pipeline security",
      "Jenkins credentials",
      "Jenkins sandbox",
      "Jenkins plugins security",
      "Jenkins best practices",
    ],
    alternates: {
      ...localeAlternates(`/${locale}/jenkins-security`),
    },
    openGraph: {
      title: "Jenkins Security 2026: CI/CD Protection",
      description: "Secure Jenkins with matrix auth, CSRF protection, sandboxing & credential management.",
      type: "article",
      url: `${BASE_URL}/${locale}/jenkins-security`,
    },
  };
}

export default async function JenkinsSecurityPage({
  params,
}: {
  params: { lang: string };
}) {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-slate-800 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Jenkins Security</h1>
            <p className="text-2xl text-red-200 mb-4">CI/CD Hardening 2026</p>
            <p className="text-xl text-white/80 mb-8">Matrix Authorization, CSRF Protection, Script Security, Pipeline Sandboxing & Credentials</p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Matrix Auth</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">CSRF</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Sandbox</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Credentials</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Jenkins Security Architecture</h2>
            <p className="text-slate-700 text-lg mb-6">
              Jenkins hat Zugriff auf Source Code, Secrets und Production-Deployments. Sicherheit ist essentiell: Authentifizierung, Autorisierung, Script Security und Pipeline-Sandboxing.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="font-semibold text-red-900 mb-2">Authentication</h3>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• Matrix Authorization</li>
                  <li>• LDAP/Active Directory</li>
                  <li>• SSO (SAML, OAuth)</li>
                  <li>• API Tokens</li>
                </ul>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <h3 className="font-semibold text-orange-900 mb-2">Protection</h3>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• CSRF Protection</li>
                  <li>• Script Security</li>
                  <li>• Pipeline Sandbox</li>
                  <li>• Agent Security</li>
                </ul>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-2">Secrets</h3>
                <ul className="text-sm text-slate-800 space-y-1">
                  <li>• Credentials Binding</li>
                  <li>• Masking</li>
                  <li>• Vault Integration</li>
                  <li>• CAS Plugin</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Jenkins Security Configuration</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# Jenkins Security Groovy Script (init.groovy.d/)

import jenkins.model.*
import hudson.security.*
import jenkins.security.s2m.AdminWhitelistRule
import org.jenkinsci.plugins.matrixauth.*
import hudson.security.csrf.DefaultCrumbIssuer

// Enable security
def instance = Jenkins.getInstance()

// 1. Disable CLI over Remoting (SECURITY-433)
instance.CLI.get().setEnabled(false)

// 2. Enable CSRF Protection
instance.setCrumbIssuer(new DefaultCrumbIssuer(true))

// 3. Markup Formatter - Safe HTML
instance.setMarkupFormatter(new hudson.markup.EscapedMarkupFormatter())

// 4. Agent-to-Master Security (Disable deprecated protocols)
instance.agentProtocols = ['JNLP4-connect', 'Ping']

// 5. Master Access Control
instance.getExtensionList(AdminWhitelistRule.class).each { rule ->
    rule.setMasterKillSwitch(false)
}

// 6. Matrix Authorization Strategy
def strategy = new ProjectMatrixAuthorizationStrategy()

// Anonymous - No access
strategy.add(Permission.READ, 'anonymous')

// Authenticated Users - Basic access
strategy.add(Permission.READ, 'authenticated')
strategy.add(Item.BUILD, 'authenticated')
strategy.add(Item.CANCEL, 'authenticated')

// Developers
strategy.add(Permission.READ, 'developer')
strategy.add(Item.BUILD, 'developer')
strategy.add(Item.CANCEL, 'developer')
strategy.add(Item.WORKSPACE, 'developer')
strategy.add(Item.READ, 'developer')
strategy.add(Item.CONFIGURE, 'developer')
strategy.add(Item.CREATE, 'developer')
strategy.add(View.READ, 'developer')

// DevOps - More access
strategy.add(Permission.READ, 'devops')
strategy.add(Item.BUILD, 'devops')
strategy.add(Item.CANCEL, 'devops')
strategy.add(Item.WORKSPACE, 'devops')
strategy.add(Item.READ, 'devops')
strategy.add(Item.CONFIGURE, 'devops')
strategy.add(Item.CREATE, 'devops')
strategy.add(Item.DELETE, 'devops')
strategy.add(Item.EXTENDED_READ, 'devops')
strategy.add(Run.DELETE, 'devops')
strategy.add(Run.REPLAY, 'devops')
strategy.add(View.CONFIGURE, 'devops')
strategy.add(View.CREATE, 'devops')
strategy.add(View.DELETE, 'devops')
strategy.add(Computer.BUILD, 'devops')
strategy.add(Computer.CONFIGURE, 'devops')
strategy.add(Computer.CONNECT, 'devops')
strategy.add(Computer.CREATE, 'devops')
strategy.add(Computer.DISCONNECT, 'devops')

// Admins - Full access
strategy.add(Jenkins.ADMINISTER, 'admin')

instance.setAuthorizationStrategy(strategy)

// 7. Disable signup
instance.setSecurityRealm(new HudsonPrivateSecurityRealm(false))

// 8. Script Security - Sandbox
System.setProperty("hudson.model.DirectoryBrowserSupport.CSP", 
    "sandbox; default-src 'none'; img-src 'self'; style-src 'self';")

// Save
instance.save()

println "Jenkins security configuration applied successfully!"
`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Pipeline Security & Jenkinsfile</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`// Jenkinsfile - Secure Pipeline Definition

pipeline {
    agent any
    
    // Security: Limit build retention
    options {
        buildDiscarder(logRotator(numToKeepStr: '10', artifactNumToKeepStr: '5'))
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES')
    }
    
    // Secure parameters (avoid stringParameter for secrets!)
    parameters {
        choice(name: 'ENVIRONMENT', choices: ['dev', 'staging', 'prod'], description: 'Target environment')
        booleanParam(name: 'SKIP_TESTS', defaultValue: false, description: 'Skip test stage')
    }
    
    environment {
        // Use credentials() step - never hardcode!
        DOCKER_REGISTRY = credentials('docker-registry-credentials')
        SONAR_TOKEN = credentials('sonarqube-token')
        VAULT_ADDR = 'https://vault.company.com:8200'
    }
    
    stages {
        stage('Checkout') {
            steps {
                // Clean workspace before checkout
                cleanWs()
                checkout scm
            }
        }
        
        stage('Secrets from Vault') {
            steps {
                script {
                    // Use Vault plugin for dynamic secrets
                    withVault(configuration: [timeout: 60], 
                              vaultSecrets: [[path: 'secret/data/ci/aws', 
                                             secretValues: [[envVar: 'AWS_ACCESS_KEY_ID', vaultKey: 'access_key'],
                                                           [envVar: 'AWS_SECRET_ACCESS_KEY', vaultKey: 'secret_key']]]]) {
                        sh 'echo "Secrets injected securely"'
                    }
                }
            }
        }
        
        stage('Build') {
            steps {
                // Mask credentials in logs
                withCredentials([string(credentialsId: 'npm-auth-token', variable: 'NPM_TOKEN')]) {
                    sh '''
                        echo "//registry.npmjs.org/:_authToken=\${NPM_TOKEN}" > .npmrc
                        npm ci --ignore-scripts  # Skip postinstall scripts
                        npm run build
                    '''
                }
            }
        }
        
        stage('Security Scan') {
            parallel {
                stage('SAST - SonarQube') {
                    steps {
                        withSonarQubeEnv('SonarQube') {
                            sh 'sonar-scanner -Dsonar.projectKey=myapp -Dsonar.login=$SONAR_TOKEN'
                        }
                    }
                }
                stage('Dependency Check') {
                    steps {
                        sh 'npm audit --audit-level=moderate'
                    }
                }
                stage('Container Scan') {
                    steps {
                        sh 'trivy image --exit-code 1 --severity HIGH,CRITICAL myapp:latest'
                    }
                }
            }
        }
        
        stage('Deploy') {
            when {
                anyOf {
                    branch 'main'
                    branch 'release/*'
                }
            }
            steps {
                // Use SSH agent for deployment keys
                sshagent(['deployment-key']) {
                    sh 'ansible-playbook -i inventory deploy.yml'
                }
            }
        }
    }
    
    post {
        always {
            // Clean credentials from environment
            sh 'rm -f .npmrc || true'
            cleanWs()
        }
        failure {
            // Secure notification (no secrets in message!)
            slackSend(color: 'danger', message: "Build failed: \${env.JOB_NAME} #\${env.BUILD_NUMBER}")
        }
    }
}`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Jenkins Hardening Checklist</h2>
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Core Security</h3>
                  {[
                    "Matrix Authorization enabled",
                    "CSRF Protection enabled",
                    "CLI over Remoting disabled",
                    "Signup disabled",
                    "Security Realm configured",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                      <span className="w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center text-xs text-slate-400">☐</span>
                      <span className="text-slate-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Plugins & Pipeline</h3>
                  {[
                    "Script Security plugin installed",
                    "Pipeline Groovy Sandbox enabled",
                    "Credentials Binding plugin",
                    "Job Restrictions configured",
                    "Workspace cleanup enforced",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                      <span className="w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center text-xs text-slate-400">☐</span>
                      <span className="text-slate-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Jenkins Security Assessment</h2>
            <a href="/check" className="inline-block px-6 py-3 bg-white text-red-600 rounded-lg font-semibold">Assessment Starten</a>
          </section>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "Jenkins Security 2026",
        author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        datePublished: "2026-03-29",
      })}} />
    </main>
  );
}
