'use client'

import { useI18n } from "@/components/i18n/I18nProvider"

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} className="text-gray-400 hover:text-cyan-400 transition-colors text-sm leading-relaxed">
    {children}
  </a>
)

const FooterSection = ({ title, accent, children }: { title: string; accent?: string; children: React.ReactNode }) => (
  <div>
    <div className="flex items-center gap-2 mb-4">
      {accent && <span className={`w-2 h-2 rounded-full ${accent}`} />}
      <h4 className="text-gray-200 font-semibold text-sm uppercase tracking-wider">{title}</h4>
    </div>
    <div className="flex flex-col gap-2">{children}</div>
  </div>
)

export default function Footer() {
  const { locale, dict } = useI18n()
  const prefix = `/${locale}`
  const nav = (dict as any)?.nav || {}

  return (
    <footer className="bg-gray-950 border-t border-gray-800 mt-20">

      {/* Top CTA strip */}
      <div className="border-b border-gray-800 bg-gradient-to-r from-cyan-950/40 via-gray-950 to-purple-950/40">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-cyan-400 font-black text-xl tracking-tight">CLAWGURU</span>
            <span className="text-gray-500 text-sm ml-3">{nav.footerDescription || "Security Intelligence Platform"}</span>
          </div>
          <div className="flex items-center gap-3">
            <a href={`${prefix}/check`} className="bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
              🛡️ Security Check starten
            </a>
            <a href={`${prefix}/pricing`} className="border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white text-sm px-4 py-2 rounded-lg transition-colors">
              Preise
            </a>
          </div>
        </div>
      </div>

      {/* Main link grid */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">

        {/* Platform */}
        <FooterSection title="Platform" accent="bg-cyan-400">
          <FooterLink href={`${prefix}/runbooks`}>Runbooks</FooterLink>
          <FooterLink href={`${prefix}/check`}>Security Check</FooterLink>
          <FooterLink href={`${prefix}/copilot`}>Copilot AI</FooterLink>
          <FooterLink href={`${prefix}/oracle`}>Oracle</FooterLink>
          <FooterLink href={`${prefix}/neuro`}>Neuro AI</FooterLink>
          <FooterLink href={`${prefix}/intel`}>Intel Feed</FooterLink>
          <FooterLink href={`${prefix}/solutions`}>CVE Solutions</FooterLink>
          <FooterLink href={`${prefix}/pricing`}>Preise</FooterLink>
          <FooterLink href={`${prefix}/emergency`}>Emergency</FooterLink>
        </FooterSection>

        {/* Moltbot */}
        <FooterSection title="Moltbot" accent="bg-purple-400">
          <FooterLink href={`${prefix}/moltbot/security-framework`}>Security Framework</FooterLink>
          <FooterLink href={`${prefix}/moltbot/hardening-guide-2024`}>Hardening Guide</FooterLink>
          <FooterLink href={`${prefix}/moltbot/api-security-protection`}>API Security</FooterLink>
          <FooterLink href={`${prefix}/moltbot/incident-response-automation`}>Incident Response</FooterLink>
          <FooterLink href={`${prefix}/moltbot/devsecops-pipeline`}>DevSecOps Pipeline</FooterLink>
          <FooterLink href={`${prefix}/moltbot/zero-trust-architecture`}>Zero Trust</FooterLink>
          <FooterLink href={`${prefix}/moltbot/container-security-docker-kubernetes`}>Container Security</FooterLink>
          <FooterLink href={`${prefix}/moltbot/secrets-vault-management`}>Secrets &amp; Vault</FooterLink>
          <FooterLink href={`${prefix}/moltbot/compliance-gdpr-setup`}>GDPR Compliance</FooterLink>
          <FooterLink href={`${prefix}/moltbot/real-time-cve-feed`}>CVE Feed</FooterLink>
          <FooterLink href={`${prefix}/moltbot/ai-agent-security`}>AI Agent Security</FooterLink>
        </FooterSection>

        {/* OpenClaw */}
        <FooterSection title="OpenClaw" accent="bg-green-400">
          <FooterLink href={`${prefix}/openclaw/self-hosted-security-checklist`}>Self-Hosted Checklist</FooterLink>
          <FooterLink href={`${prefix}/openclaw/server-hardening-checklist`}>Server Hardening</FooterLink>
          <FooterLink href={`${prefix}/openclaw/docker-swarm-hardening`}>Docker Swarm</FooterLink>
          <FooterLink href={`${prefix}/openclaw/security-headers-guide`}>Security Headers</FooterLink>
          <FooterLink href={`${prefix}/openclaw/intrusion-detection-setup`}>IDS Setup</FooterLink>
          <FooterLink href={`${prefix}/openclaw/waf-configuration`}>WAF Config</FooterLink>
          <FooterLink href={`${prefix}/openclaw/cicd-security-pipeline`}>CI/CD Security</FooterLink>
          <FooterLink href={`${prefix}/openclaw/firewall-configuration-guide`}>Firewall Guide</FooterLink>
          <FooterLink href={`${prefix}/openclaw/supply-chain-security`}>Supply Chain</FooterLink>
        </FooterSection>

        {/* Compare */}
        <FooterSection title="Compare" accent="bg-orange-400">
          <FooterLink href={`${prefix}/clawguru-vs-wiz`}>vs Wiz</FooterLink>
          <FooterLink href={`${prefix}/clawguru-vs-crowdstrike`}>vs CrowdStrike</FooterLink>
          <FooterLink href={`${prefix}/clawguru-vs-datadog`}>vs Datadog</FooterLink>
          <FooterLink href={`${prefix}/clawguru-vs-lacework`}>vs Lacework</FooterLink>
          <FooterLink href={`${prefix}/clawguru-vs-snyk`}>vs Snyk</FooterLink>
          <FooterLink href={`${prefix}/clawguru-vs-trivy`}>vs Trivy</FooterLink>
          <FooterLink href={`${prefix}/openclaw-vs-wazuh`}>OpenClaw vs Wazuh</FooterLink>
          <FooterLink href={`${prefix}/openclaw-vs-falco`}>OpenClaw vs Falco</FooterLink>
          <FooterLink href={`${prefix}/moltbot-vs-pagerduty`}>Moltbot vs PagerDuty</FooterLink>
          <FooterLink href={`${prefix}/moltbot-vs-splunk`}>Moltbot vs Splunk</FooterLink>
        </FooterSection>

        {/* Security Guides + Company + Legal */}
        <div className="flex flex-col gap-8">
          <FooterSection title="Guides" accent="bg-blue-400">
            <FooterLink href={`${prefix}/linux-hardening`}>Linux Hardening</FooterLink>
            <FooterLink href={`${prefix}/windows-server-security`}>Windows Server</FooterLink>
            <FooterLink href={`${prefix}/docker-security-hardening`}>Docker Security</FooterLink>
            <FooterLink href={`${prefix}/nginx-hardening`}>NGINX Hardening</FooterLink>
            <FooterLink href={`${prefix}/postgresql-security`}>PostgreSQL Security</FooterLink>
            <FooterLink href={`${prefix}/aws-iam-security`}>AWS IAM</FooterLink>
            <FooterLink href={`${prefix}/terraform-security`}>Terraform Security</FooterLink>
          </FooterSection>

          <FooterSection title="Company">
            <FooterLink href={`${prefix}/ueber-uns`}>{nav.about || "Über uns"}</FooterLink>
            <FooterLink href={`${prefix}/case-studies`}>Case Studies</FooterLink>
            <FooterLink href={`${prefix}/support`}>Support</FooterLink>
          </FooterSection>

          <FooterSection title="Legal">
            <FooterLink href={`${prefix}/impressum`}>Impressum</FooterLink>
            <FooterLink href={`${prefix}/datenschutz`}>Datenschutz</FooterLink>
            <FooterLink href={`${prefix}/agb`}>AGB</FooterLink>
          </FooterSection>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <span>© 2026 ClawGuru Mycelium Security Intelligence GmbH · Berlin</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              All systems operational
            </span>
            <a href={`${prefix}/impressum`} className="hover:text-gray-400 transition-colors">Impressum</a>
            <a href={`${prefix}/datenschutz`} className="hover:text-gray-400 transition-colors">Datenschutz</a>
          </div>
        </div>
      </div>

    </footer>
  )
}
