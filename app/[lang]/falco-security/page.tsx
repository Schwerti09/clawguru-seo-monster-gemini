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
      ? "Falco Security 2026 | Kubernetes Runtime Security"
      : "Falco Security 2026 | Kubernetes Runtime Security",
    description: locale === "de"
      ? "Falco Security: Runtime Threat Detection, Custom Rules, Response Engine & Forensics."
      : "Falco security: runtime threat detection, custom rules, response engine & forensics.",
    keywords: [
      "Falco security",
      "Falco runtime security",
      "Kubernetes runtime detection",
      "CNCF Falco",
      "Threat detection",
      "Container runtime security",
      "Syscall monitoring",
      "Falco rules",
      "Falcosidekick",
      "eBPF security",
    ],
    alternates: {
      canonical: `/${locale}/falco-security`,
      ...localeAlternates(`/${locale}/falco-security`),
    },
    openGraph: {
      title: "Falco Security 2026: Runtime Threat Detection",
      description: "Detect runtime threats in Kubernetes with Falco eBPF-based security monitoring.",
      type: "article",
      url: `${BASE_URL}/${locale}/falco-security`,
    },
  };
}

export default async function FalcoSecurityPage({
  params,
}: {
  params: { lang: string };
}) {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-700 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Falco Security</h1>
            <p className="text-2xl text-teal-200 mb-4">Kubernetes Runtime Security 2026</p>
            <p className="text-xl text-white/80 mb-8">Runtime Threat Detection, Custom Rules, Response Engine & Forensics</p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">eBPF</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Runtime</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Rules</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">CNCF</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Falco Runtime Security</h2>
            <p className="text-slate-700 text-lg mb-6">
              Falco ist das CNCF-graduated Runtime Security Project. Es erkennt Anomalien in Echtzeit mittels eBPF-Syscall-Monitoring und Kubernetes Audit Logs.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-6">
                <h3 className="font-semibold text-teal-900 mb-2">Detection Sources</h3>
                <ul className="text-sm text-teal-800 space-y-1">
                  <li>• Syscall Monitoring (eBPF)</li>
                  <li>• Kubernetes Audit Logs</li>
                  <li>• Container Events</li>
                  <li>• CloudTrail (AWS)</li>
                </ul>
              </div>
              <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-6">
                <h3 className="font-semibold text-cyan-900 mb-2">Threat Types</h3>
                <ul className="text-sm text-cyan-800 space-y-1">
                  <li>• Privilege Escalation</li>
                  <li>• Container Escape</li>
                  <li>• Reverse Shell</li>
                  <li>• Cryptomining</li>
                </ul>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-2">Response</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Falcosidekick</li>
                  <li>• Webhooks</li>
                  <li>• Automated Response</li>
                  <li>• Forensics Capture</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Falco Rules & Detection</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# Falco Rules - Custom Detection Rules

# falco-rules-custom.yaml

# List: Privileged Container Images
- list: trusted_privileged_images
  items:
    - docker.io/calico/node
    - docker.io/weaveworks/weave-kube
    - gcr.io/google-containers/kube-proxy

# Macro: Sensitive Mounts
- macro: sensitive_mount
  condition: >
    (proc.name in (mount, umount) or
     fd.name contains "/etc" or
     fd.name contains "/root" or
     fd.name contains "/proc")

# Rule: Privilege Escalation via Sudo
- rule: Sudo Privilege Escalation
  desc: Detect privilege escalation via sudo
  condition: >
    spawned_process and
    proc.name = sudo and
    (proc.args contains "-S" or
     proc.args contains "--stdin")
  output: >
    Privilege escalation via sudo detected
    user=%user.name command=%proc.cmdline
    parent=%proc.pname terminal=%proc.tty
  priority: CRITICAL

# Rule: Container Escape via chroot
- rule: Container Escape chroot
  desc: Detect chroot container escape attempt
  condition: >
    spawned_process and
    proc.name = chroot and
    container and
    not proc.args in ("/proc", "/sys")
  output: >
    Container escape via chroot
    user=%user.name command=%proc.cmdline
    container=%container.name
  priority: EMERGENCY

# Rule: Reverse Shell Detection
- rule: Reverse Shell
  desc: Detect reverse shell connections
  condition: >
    spawned_process and
    (proc.name in (bash, sh, zsh, python, python3, perl, ruby, nc, netcat) or
     proc.name in (curl, wget)) and
    (fd.socktype = ipv4 or fd.socktype = ipv6) and
    (fd.name contains ":4444" or
     fd.name contains ":5555" or
     fd.name contains ":1337" or
     outbound)
  output: >
    Reverse shell detected
    user=%user.name process=%proc.name
    command=%proc.cmdline parent=%proc.pname
    connection=%fd.name container=%container.name
  priority: CRITICAL

# Rule: Write to /etc
- rule: Write to etc
  desc: Detect writes to /etc directory
  condition: >
    write_etc_common and
    not etc_mgmt_binaries and
    not user_known_write_etc_conditions and
    not write_etc_common_release_agent
  output: >
    File write to /etc detected
    user=%user.name command=%proc.cmdline
    file=%fd.name container=%container.name
  priority: WARNING

# Rule: Cryptomining Detection
- rule: Cryptomining
  desc: Detect cryptomining processes
  condition: >
    spawned_process and
    (proc.name in (xmrig, minerd, stratum, cgminer, bfgminer) or
     proc.cmdline contains "stratum+tcp" or
     proc.cmdline contains "stratum+ssl" or
     proc.cmdline contains "--donate-level" or
     proc.cmdline contains "-o pool")
  output: >
    Cryptomining process detected
    user=%user.name process=%proc.name
    command=%proc.cmdline container=%container.name
  priority: CRITICAL

# Rule: Kubernetes Exec into Pod
- rule: K8s Exec Pod
  desc: Detect kubectl exec into pods
  condition: >
    ka.verb = create and
    ka.target.resource = pods and
    ka.target.subresource = exec and
    ka.target.name exists
  output: >
    Kubectl exec into pod
    user=%ka.user.name pod=%ka.target.name
    namespace=%ka.target.namespace
    command=%ka.target.subresource
  priority: NOTICE

# Rule: AWS Credentials Access
- rule: AWS Credentials Access
  desc: Access to AWS credential files
  condition: >
    (open_read or open_write) and
    (fd.name contains "/.aws/credentials" or
     fd.name contains "/.aws/config")
  output: >
    AWS credentials file accessed
    user=%user.name file=%fd.name
    command=%proc.cmdline container=%container.name
  priority: WARNING`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Falco Deployment & Falcosidekick</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# Falco Helm Chart Values - Production

# falco-values.yaml

driver:
  kind: modern_ebpf  # oder ebpf, kmod
  loader:
    initContainer:
      enabled: true
      image:
        repository: falcosecurity/falco-driver-loader
        tag: latest

tty: false

falco:
  rules_file:
    - /etc/falco/falco_rules.yaml
    - /etc/falco/falco_rules.local.yaml
    - /etc/falco/rules.d
  
  # HTTP Output für Falcosidekick
  http_output:
    enabled: true
    url: http://falcosidekick:2801
    
  # JSON Output
  json_output: true
  json_include_output_property: true
  
  # Logging
  log_syslog: false
  log_stderr: true
  syslog_output:
    enabled: false
  
  # File Output
  file_output:
    enabled: false
    filename: /var/log/falco/events.log
  
  # Program Output
  program_output:
    enabled: false
    program: mail -s "Falco Alert" admin@example.com
  
  # Time Format
  time_format_iso_8601: true

# Falcosidekick - Response Engine
falcosidekick:
  enabled: true
  
  config:
    # Slack Integration
    slack:
      webhookurl: "https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
      minimumpriority: "warning"
      icon: ":rotating_light:"
    
    # Webhook
    webhook:
      address: "https://api.company.com/falco-webhook"
      minimumpriority: "critical"
      checkcert: true
    
    # AWS Lambda
    lambda:
      functionname: falco-response
      region: us-east-1
      minimumpriority: "critical"
    
    # PagerDuty
    pagerduty:
      routing_key: "your-routing-key"
      minimumpriority: "critical"
    
    # Custom Fields
    customfields: "environment:production,cluster:eu-west-1"
  
  # Replica Count
  replicaCount: 2

# Priority Threshold
falcoctl:
  artifact:
    install:
      enabled: true
    follow:
      enabled: true

# Resources
resources:
  requests:
    cpu: 100m
    memory: 512Mi
  limits:
    cpu: 1000m
    memory: 1Gi

# Prometheus Metrics
metrics:
  enabled: true
  port: 8080
  portName: metrics

# Grafana Dashboard
grafana:
  enabled: true
  sidecar:
    dashboards:
      enabled: true
      label: grafana_dashboard

# Kubernetes API Audit
kubernetes:
  enabled: true
  apiUrl: "https://\$(KUBERNETES_SERVICE_HOST)"
  apiAuth: token`}
              </pre>
            </div>
          </section>

          <section className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Falco Security Assessment</h2>
            <a href="/check" className="inline-block px-6 py-3 bg-white text-teal-600 rounded-lg font-semibold">Assessment Starten</a>
          </section>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "Falco Security 2026",
        author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        datePublished: "2026-03-29",
      })}} />
    </main>
  );
}
