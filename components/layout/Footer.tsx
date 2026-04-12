'use client'

import { useI18n } from "@/components/i18n/I18nProvider"

export default function Footer() {
  const { locale, dict } = useI18n()
  const prefix = `/${locale}`
  const nav = (dict as any)?.nav || {}
  const footer = (dict as any)?.footer || {}

  return (
    <footer className="bg-black border-t border-white/10 py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-12 text-sm">
        <div>
          <div className="text-cyan-400 font-black text-2xl mb-4">CLAWGURU</div>
          <p className="opacity-60">{nav.footerDescription || "A Living Cyber Nervous System"}</p>
        </div>

        <div>
          <h4 className="font-semibold mb-4">{nav.footerHubs || "Platform"}</h4>
          <ul className="space-y-2 opacity-70">
            <li><a href={`${prefix}/runbooks`}>{nav.runbooks || "Runbooks"}</a></li>
            <li><a href={`${prefix}/tags`}>{nav.tags || "Tags"}</a></li>
            <li><a href={`${prefix}/intel`}>{nav.intelFeed || "Intel Feed"}</a></li>
            <li><a href={`${prefix}/copilot`}>{nav.copilot || "Copilot"}</a></li>
            <li><a href={`${prefix}/oracle`}>{nav.oracle || "Oracle"}</a></li>
            <li><a href={`${prefix}/neuro`}>{nav.neuro || "Neuro AI"}</a></li>
            <li><a href={`${prefix}/community`}>{nav.community || "Community"}</a></li>
            <li><a href={`${prefix}/guides`}>Guides</a></li>
            <li><a href={`${prefix}/api-docs`}>API Docs</a></li>
            <li><a href={`${prefix}/developer-hub`}>Developer Hub</a></li>
            <li><a href={`${prefix}/leaderboard`}>Leaderboard</a></li>
            <li><a href={`${prefix}/clawlink`}>ClawLink</a></li>
            <li><a href={`${prefix}/bounties`}>Bounties</a></li>
            <li><a href={`${prefix}/launch-pack`}>Launch Pack</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">{nav.solutions || footer.solutions_title || "Solutions"}</h4>
          <ul className="space-y-2 opacity-70">
            <li><a href={`${prefix}/solutions`}>Solutions</a></li>
            <li><a href={`${prefix}/gsc-optimize`}>Guides Hub</a></li>
            <li><a href={`${prefix}/solutions/soc2-compliance-automation`}>SOC2 Compliance</a></li>
            <li><a href={`${prefix}/solutions/kubernetes-security-hardening`}>Kubernetes Security</a></li>
            <li><a href={`${prefix}/solutions/startup-security-foundation`}>Startup Security</a></li>
            <li><a href={`${prefix}/solutions/enterprise-siem-integration`}>Enterprise SIEM</a></li>
            <li><a href={`${prefix}/solutions/iso27001-certification-roadmap`}>ISO 27001 Roadmap</a></li>
            <li><a href={`${prefix}/solutions/pci-dss-compliance`}>PCI DSS Compliance</a></li>
            <li><a href={`${prefix}/solutions/hipaa-security-controls`}>HIPAA Controls</a></li>
            <li><a href={`${prefix}/solutions/aws-security-architecture`}>AWS Security</a></li>
            <li><a href={`${prefix}/solutions/influxdb-hipaa-compliance`}>InfluxDB HIPAA</a></li>
            <li><a href={`${prefix}/solutions/iso-27001-google-cloud`}>ISO 27001 GCP</a></li>
            <li><a href={`${prefix}/solutions/github-actions-bare-metal`}>GitHub Actions Bare Metal</a></li>
            <li><a href={`${prefix}/solutions/rabbitmq-audit`}>RabbitMQ Audit</a></li>
            <li><a href={`${prefix}/solutions/terraform-canary-deploy`}>Terraform Canary</a></li>
            <li><a href={`${prefix}/emergency`}>{nav.emergency || "Emergency"}</a></li>
            <li><a href={`${prefix}/check`}>{nav.securityCheck || "Security-Check"}</a></li>
            <li><a href={`${prefix}/pricing`}>{nav.pricing || "Pricing"}</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Security Guides</h4>
          <ul className="space-y-2 opacity-70">
            <li><a href={`${prefix}/linux-hardening`}>Linux Hardening</a></li>
            <li><a href={`${prefix}/docker-security-hardening`}>Docker Security</a></li>
            <li><a href={`${prefix}/kubernetes-network-policies`}>Kubernetes Network</a></li>
            <li><a href={`${prefix}/nginx-hardening`}>NGINX Hardening</a></li>
            <li><a href={`${prefix}/terraform-security`}>Terraform Security</a></li>
            <li><a href={`${prefix}/vault-hardening`}>Vault Hardening</a></li>
            <li><a href={`${prefix}/postgresql-security`}>PostgreSQL Security</a></li>
            <li><a href={`${prefix}/redis-security`}>Redis Security</a></li>
            <li><a href={`${prefix}/mongodb-security`}>MongoDB Security</a></li>
            <li><a href={`${prefix}/elasticsearch-security`}>Elasticsearch Security</a></li>
            <li><a href={`${prefix}/grafana-hardening`}>Grafana Hardening</a></li>
            <li><a href={`${prefix}/prometheus-vpn`}>Prometheus VPN</a></li>
            <li><a href={`${prefix}/kafka-security`}>Kafka Security</a></li>
            <li><a href={`${prefix}/rabbitmq-security`}>RabbitMQ Security</a></li>
            <li><a href={`${prefix}/splunk-security`}>Splunk Security</a></li>
            <li><a href={`${prefix}/datadog-security`}>Datadog Security</a></li>
            <li><a href={`${prefix}/jenkins-security`}>Jenkins Security</a></li>
            <li><a href={`${prefix}/gitlab-cicd-security`}>GitLab CI/CD Security</a></li>
            <li><a href={`${prefix}/circleci-security`}>CircleCI Security</a></li>
            <li><a href={`${prefix}/argocd-security`}>ArgoCD Security</a></li>
            <li><a href={`${prefix}/sonarqube-security`}>SonarQube Security</a></li>
            <li><a href={`${prefix}/windows-server-security`}>Windows Server Security</a></li>
            <li><a href={`${prefix}/opentelemetry-security`}>OpenTelemetry Security</a></li>
            <li><a href={`${prefix}/cloudformation-security`}>CloudFormation Security</a></li>
            <li><a href={`${prefix}/tailscale-pam`}>Tailscale PAM</a></li>
            <li><a href={`${prefix}/aws-iam-security`}>AWS IAM Security</a></li>
            <li><a href={`${prefix}/aws-vpc-flow-logs`}>AWS VPC Flow Logs</a></li>
            <li><a href={`${prefix}/azure-ad-security`}>Azure AD Security</a></li>
            <li><a href={`${prefix}/cloudflare-tunnel-firewall-rules`}>Cloudflare Firewall</a></li>
            <li><a href={`${prefix}/docker-reverse-proxy-hardening-cheatsheet`}>Docker Reverse Proxy</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Compare &amp; Resources</h4>
          <ul className="space-y-2 opacity-70">
            <li><a href={`${prefix}/clawguru-vs-wiz`}>ClawGuru vs Wiz</a></li>
            <li><a href={`${prefix}/clawguru-vs-crowdstrike`}>ClawGuru vs CrowdStrike</a></li>
            <li><a href={`${prefix}/clawguru-vs-datadog`}>ClawGuru vs Datadog</a></li>
            <li><a href={`${prefix}/clawguru-vs-lacework`}>ClawGuru vs Lacework</a></li>
            <li><a href={`${prefix}/openclaw-vs-snyk`}>OpenClaw vs Snyk</a></li>
            <li><a href={`${prefix}/openclaw-vs-semgrep`}>OpenClaw vs Semgrep</a></li>
            <li><a href={`${prefix}/openclaw-vs-sonarqube`}>OpenClaw vs SonarQube</a></li>
            <li><a href={`${prefix}/openclaw-vs-falco`}>OpenClaw vs Falco</a></li>
            <li><a href={`${prefix}/moltbot-vs-opsgenie`}>Moltbot vs OpsGenie</a></li>
            <li><a href={`${prefix}/moltbot-vs-pagerduty`}>Moltbot vs PagerDuty</a></li>
            <li><a href={`${prefix}/executable-runbook-vs-static-blog`}>Runbook vs Blog</a></li>
            <li><a href={`${prefix}/security-check-vs-pentest-guide`}>Security Check vs Pentest</a></li>
            <li><a href={`${prefix}/nis2-technical-controls-self-hosted`}>NIS2 Self-Hosted</a></li>
            <li><a href={`${prefix}/openclaw-top-5-exposure-misconfigs`}>Top 5 Misconfigs</a></li>
            <li><a href={`${prefix}/api-key-leak-response-playbook`}>API Key Leak Playbook</a></li>
            <li><a href={`${prefix}/gateway-auth-10-steps`}>Gateway Auth 10 Steps</a></li>
            <li><a href={`${prefix}/hetzner-vs-do-security-baseline-2026`}>Hetzner vs DO Security</a></li>
            <li><a href={`${prefix}/check-methodology-30-seconds`}>Check Methodology</a></li>
            <li><a href={`${prefix}/moltbot/security-framework`}>Moltbot Security Framework</a></li>
            <li><a href={`${prefix}/moltbot/hardening-guide-2024`}>Moltbot Hardening Guide</a></li>
            <li><a href={`${prefix}/moltbot/api-security-protection`}>Moltbot API Security</a></li>
            <li><a href={`${prefix}/moltbot/authentication-oauth2-jwt`}>Moltbot Auth &amp; JWT</a></li>
            <li><a href={`${prefix}/moltbot/network-security-firewall`}>Moltbot Firewall</a></li>
            <li><a href={`${prefix}/moltbot/ssl-tls-management`}>Moltbot TLS</a></li>
            <li><a href={`${prefix}/openclaw/self-hosted-security-checklist`}>OpenClaw Checklist</a></li>
            <li><a href={`${prefix}/openclaw/docker-swarm-hardening`}>OpenClaw Swarm</a></li>
            <li><a href={`${prefix}/openclaw/security-headers-guide`}>OpenClaw Headers</a></li>
            <li><a href={`${prefix}/openclaw/firewall-configuration-guide`}>OpenClaw Firewall</a></li>
            <li><a href={`${prefix}/openclaw/waf-configuration`}>OpenClaw WAF</a></li>
            <li><a href={`${prefix}/openclaw/cicd-security-pipeline`}>OpenClaw CI/CD</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm opacity-70">
        <div>
          <h4 className="font-semibold mb-3 opacity-100">Moltbot</h4>
          <ul className="space-y-1">
            <li><a href={`${prefix}/moltbot/threat-detection-setup`}>Threat Detection</a></li>
            <li><a href={`${prefix}/moltbot/logging-auditing-compliance`}>Logging &amp; Compliance</a></li>
            <li><a href={`${prefix}/moltbot/container-security-docker-kubernetes`}>Container Security</a></li>
            <li><a href={`${prefix}/moltbot/database-security-encryption`}>Database Security</a></li>
            <li><a href={`${prefix}/moltbot/incident-response-automation`}>Incident Response</a></li>
            <li><a href={`${prefix}/moltbot/devsecops-pipeline`}>DevSecOps Pipeline</a></li>
            <li><a href={`${prefix}/moltbot/monitoring-dashboards`}>Monitoring</a></li>
            <li><a href={`${prefix}/moltbot/backup-recovery-disaster-recovery`}>Backup &amp; DR</a></li>
            <li><a href={`${prefix}/moltbot/secrets-vault-management`}>Secrets &amp; Vault</a></li>
            <li><a href={`${prefix}/moltbot/vulnerability-scanning`}>Vulnerability Scanning</a></li>
            <li><a href={`${prefix}/moltbot/zero-trust-architecture`}>Zero Trust</a></li>
            <li><a href={`${prefix}/moltbot/compliance-gdpr-setup`}>GDPR Compliance</a></li>
            <li><a href={`${prefix}/moltbot/identity-governance-iam`}>Identity &amp; IAM</a></li>
            <li><a href={`${prefix}/moltbot/data-loss-prevention`}>Data Loss Prevention</a></li>
            <li><a href={`${prefix}/moltbot/security-automation-workflows`}>Security Automation</a></li>
            <li><a href={`${prefix}/moltbot/cryptography-encryption-guide`}>Cryptography</a></li>
            <li><a href={`${prefix}/moltbot/api-rate-limiting-advanced`}>API Rate Limiting</a></li>
            <li><a href={`${prefix}/moltbot/runtime-protection-rasp`}>Runtime Protection</a></li>
            <li><a href={`${prefix}/moltbot/security-posture-score`}>Security Posture Score</a></li>
            <li><a href={`${prefix}/moltbot/cloud-native-security`}>Cloud Native Security</a></li>
            <li><a href={`${prefix}/moltbot/api-gateway-security`}>API Gateway Security</a></li>
            <li><a href={`${prefix}/moltbot/real-time-cve-feed`}>Real-Time CVE Feed</a></li>
            <li><a href={`${prefix}/moltbot/bot-security-testing`}>Bot Security Testing</a></li>
            <li><a href={`${prefix}/moltbot/ai-agent-threat-model-template`}>AI Agent Threat Model</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 opacity-100">OpenClaw</h4>
          <ul className="space-y-1">
            <li><a href={`${prefix}/openclaw/server-hardening-checklist`}>Server Hardening</a></li>
            <li><a href={`${prefix}/openclaw/reverse-proxy-security`}>Reverse Proxy</a></li>
            <li><a href={`${prefix}/openclaw/intrusion-detection-setup`}>Intrusion Detection</a></li>
            <li><a href={`${prefix}/openclaw/audit-logging-setup`}>Audit Logging</a></li>
            <li><a href={`${prefix}/openclaw/database-access-control`}>Database Access</a></li>
            <li><a href={`${prefix}/openclaw/supply-chain-security`}>Supply Chain Security</a></li>
            <li><a href={`${prefix}/openclaw/service-mesh-security`}>Service Mesh</a></li>
            <li><a href={`${prefix}/openclaw/microservices-security`}>Microservices Security</a></li>
            <li><a href={`${prefix}/openclaw/secrets-rotation-automation`}>Secrets Rotation</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 opacity-100">Company</h4>
          <ul className="space-y-1">
            <li><a href={`${prefix}/ueber-uns`}>{nav.about || "Über uns"}</a></li>
            <li><a href={`${prefix}/case-studies`}>{nav.cases || "Case Studies"}</a></li>
            <li><a href={`${prefix}/support`}>{nav.support || "Support"}</a></li>
            <li><a href={`${prefix}/downloads`}>{nav.downloads || "Downloads"}</a></li>
            <li><a href={`${prefix}/ai-agent-threat-model-template`}>AI Threat Model Template</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 opacity-100">{nav.footerLegal || footer.legal_title || "Legal"}</h4>
          <ul className="space-y-1">
            <li><a href={`${prefix}/impressum`}>{nav.imprint || "Impressum"}</a></li>
            <li><a href={`${prefix}/datenschutz`}>{nav.privacy || "Datenschutz"}</a></li>
            <li><a href={`${prefix}/agb`}>{nav.terms || "AGB"}</a></li>
            <li>{nav.footerDisclaimer || footer.disclaimer || "Cookie-Einstellungen"}</li>
          </ul>
        </div>
      </div>

      <div className="text-center text-xs opacity-50 mt-16">
        © 2026 ClawGuru Mycelium Security Intelligence GmbH • Berlin • All Rights Reserved
      </div>
    </footer>
  )
}
