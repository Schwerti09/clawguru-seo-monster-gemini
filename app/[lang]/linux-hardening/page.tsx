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
      ? "Linux Server absichern 2026 — Komplette Hardening-Checkliste"
      : "Linux Server absichern 2026 — Komplette Hardening-Checkliste",
    description: locale === "de"
      ? "Linux Hardening: CIS Benchmarks, SELinux, AppArmor, Grsecurity, Kernel Hardening, Auditd & Compliance. Enterprise Linux Security."
      : "Linux hardening: CIS benchmarks, SELinux, AppArmor, grsecurity, kernel hardening, auditd & compliance. Enterprise Linux security.",
    keywords: [
      "Linux hardening",
      "Linux security",
      "CIS benchmark",
      "SELinux",
      "AppArmor",
      "Linux kernel hardening",
      "Auditd",
      "Grsecurity",
      "Server hardening",
      "Linux compliance",
    ],
    alternates: buildLocalizedAlternates(locale, "/linux-hardening"),
    openGraph: {
      images: ["/og-image.png"],
      title: "Linux Hardening 2026: Enterprise Server Security",
      description: "Comprehensive Linux hardening with CIS, SELinux, AppArmor & kernel security.",
      type: "article",
      url: `${BASE_URL}/${locale}/linux-hardening`,
    },
  };
}

const linuxFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Was ist Linux Hardening?", acceptedAnswer: { "@type": "Answer", text: "Linux Hardening bezeichnet die systematische Absicherung eines Linux-Servers durch Kernel-Security (sysctl), Mandatory Access Control (SELinux/AppArmor), Auditd-Logging und CIS-Benchmark-Compliance. Ziel ist die Reduzierung der Angriffsoberfläche." } },
    { "@type": "Question", name: "Was ist der CIS Benchmark für Linux?", acceptedAnswer: { "@type": "Answer", text: "Der CIS (Center for Internet Security) Benchmark ist ein Industriestandard für Linux-Sicherheitskonfigurationen. Er definiert über 200 Prüfpunkte für Kernel, Authentifizierung, Netzwerk, Logging und Dateisystemberechtigungen." } },
    { "@type": "Question", name: "SELinux oder AppArmor – was ist besser?", acceptedAnswer: { "@type": "Answer", text: "SELinux bietet feinere Kontrolle durch Typ-Enforcement und ist Standard auf RHEL/CentOS/Fedora. AppArmor ist einfacher zu konfigurieren und Standard auf Ubuntu/Debian. Beide bieten effektiven Schutz – die Wahl hängt von der Distribution ab." } },
    { "@type": "Question", name: "Wie automatisiert man Linux Hardening mit Moltbot?", acceptedAnswer: { "@type": "Answer", text: "Moltbot bietet 600+ ausführbare Security-Runbooks für Linux Hardening, inklusive automatisierter sysctl-Konfiguration, SELinux-Policy-Deployment, Auditd-Setup und CIS-Benchmark-Compliance-Checks." } },
  ],
}

export default async function LinuxHardeningPage({
  params,
}: {
  params: { lang: string };
}) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale;
  const prefix = `/${locale}`;
  const coreLinks = getCoreSecurityLinks(locale);
  return (
    <main className="min-h-screen bg-gray-800">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(linuxFaqSchema) }} />
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-black py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-sm mb-4">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              Enterprise Linux Security 2026
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Linux Hardening</h1>
            <p className="text-2xl text-slate-300 mb-4">Server Security & CIS Benchmarks</p>
            <p className="text-xl text-white/80 mb-8">CIS Benchmarks, SELinux, AppArmor, Kernel Hardening, Auditd & Compliance</p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">CIS</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">SELinux</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">AppArmor</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Auditd</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg mb-8">
            <strong className="text-gray-100">Was ist Linux Hardening?</strong>
            <p className="text-gray-300 mt-2">
              Linux Hardening bezeichnet die systematische Absicherung von Linux-Servern durch Kernel-Security, SELinux/AppArmor und CIS Benchmarks. Ziel ist die Reduzierung der Angriffsfläche.
            </p>
            <p className="text-gray-400 text-sm mt-1">
              80% aller Linux-Server haben unsichere Default-Konfigurationen.
            </p>
          </div>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Linux Security Architecture</h2>
            <p className="text-gray-200 text-lg mb-6">
              Linux-Server sind das Fundament moderner Infrastrukturen. Standard-Installationen sind unsicher. Hardening umfasst Kernel-Security, Mandatory Access Control, Auditing und kontinuierliche Compliance-Monitoring.
            </p>

            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 text-center">
                <div className="text-3xl mb-2">🔒</div>
                <h3 className="font-semibold text-gray-100 text-sm">Kernel</h3>
                <p className="text-xs text-slate-600">Sysctl, Modules, ASLR</p>
              </div>
              <div className="bg-red-900 border border-red-700 rounded-xl p-5 text-center">
                <div className="text-3xl mb-2">🛡️</div>
                <h3 className="font-semibold text-red-900 text-sm">MAC</h3>
                <p className="text-xs text-red-700">SELinux/AppArmor</p>
              </div>
              <div className="bg-amber-900 border border-amber-700 rounded-xl p-5 text-center">
                <div className="text-3xl mb-2">📊</div>
                <h3 className="font-semibold text-amber-300 text-sm">Audit</h3>
                <p className="text-xs text-amber-400">Auditd, syslog</p>
              </div>
              <div className="bg-blue-900 border border-blue-700 rounded-xl p-5 text-center">
                <div className="text-3xl mb-2">⚙️</div>
                <h3 className="font-semibold text-blue-200 text-sm">CIS</h3>
                <p className="text-xs text-blue-700">Benchmarks, SCAP</p>
              </div>
            </div>
          </section>

          <div className="bg-gray-800 border border-cyan-700 p-5 rounded-lg mb-16">
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-100 mb-2">🔍 Prüf jetzt dein System — kostenloser Security-Check</h3>
              <a href={coreLinks.check} className="inline-block px-6 py-3 bg-cyan-600 text-white rounded-lg font-bold hover:bg-cyan-500 transition-colors mb-2">
                Kostenlos scannen →
              </a>
              <p className="text-sm text-gray-400">Kritische Lücken? Daypass (€9) zeigt dir die Fix-Schritte.</p>
            </div>
          </div>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Kernel Hardening (sysctl)</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# /etc/sysctl.conf - Kernel Security Hardening

# Disable IPv6 if not needed
net.ipv6.conf.all.disable_ipv6 = 1
net.ipv6.conf.default.disable_ipv6 = 1

# IP Spoofing protection
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1

# Ignore ICMP redirects
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv4.conf.all.secure_redirects = 0
net.ipv6.conf.all.accept_redirects = 0

# Ignore source routed packets
net.ipv4.conf.all.accept_source_route = 0
net.ipv6.conf.all.accept_source_route = 0

# Disable ICMP echo broadcasts (smurf attacks)
net.ipv4.icmp_echo_ignore_broadcasts = 1
net.ipv4.icmp_ignore_bogus_error_responses = 1

# Log martian packets
net.ipv4.conf.all.log_martians = 1

# SYN flood protection
tcp_syncookies = 1
net.ipv4.tcp_max_syn_backlog = 2048
net.ipv4.tcp_synack_retries = 2
net.ipv4.tcp_syn_retries = 5

# Memory allocation security
vm.mmap_rnd_bits = 32
vm.mmap_rnd_compat_bits = 16

# ASLR (Address Space Layout Randomization)
kernel.randomize_va_space = 2

# Core dump restrictions
fs.suid_dumpable = 0

# ptrace scope (disable cross-process debugging)
kernel.yama.ptrace_scope = 1

# Restrict dmesg access
kernel.dmesg_restrict = 1

# Restrict kernel pointers in logs
kernel.kptr_restrict = 2

# Restrict perf events (timing attacks)
kernel.perf_event_paranoid = 2

# BPF hardening
net.core.bpf_jit_harden = 2

# Apply settings
sysctl -p`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">SELinux (RHEL/CentOS/Fedora)</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# /etc/selinux/config
SELINUX=enforcing
SELINUXTYPE=targeted

# Check status
sestatus
getenforce

# View current context
ls -Z /var/www/html
ps auxZ | grep httpd

# Custom Policy Module
# myapp.te
module myapp 1.0;

require {
  type httpd_t;
  type httpd_sys_content_t;
  class file { read write execute };
  class dir { read write search };
}

# Allow httpd to read/write application files
allow httpd_t myapp_var_t:file { read write };
allow httpd_t myapp_var_t:dir { read search };

# Build and load policy
checkmodule -M -m -o myapp.mod myapp.te
semodule_package -o myapp.pp -m myapp.mod
semodule -i myapp.pp

# Troubleshooting (dont audit)
semodule -DB  # Disable dontaudit rules for debugging
ausearch -m AVC -ts recent  # View denials

# Permissive mode for single domain
semanage permissive -a httpd_t

# File context management
semanage fcontext -a -t httpd_sys_content_t "/web(/.*)?"
restorecon -Rv /web`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">AppArmor (Ubuntu/Debian/SUSE)</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# /etc/apparmor.d/usr.sbin.nginx
#include <tunables/global>

/usr/sbin/nginx {
  #include <abstractions/base>
  #include <abstractions/nameservice>
  #include <abstractions/openssl>

  capability net_bind_service,
  capability setgid,
  capability setuid,
  capability dac_override,
  capability dac_read_search,

  /usr/sbin/nginx mr,
  /etc/nginx/** r,
  /var/log/nginx/** rw,
  /var/www/** r,
  /run/nginx.pid rw,
  /run/nginx.pid.lock k,

  # Deny dangerous operations
  deny /etc/shadow r,
  deny /etc/passwd w,
  deny /proc/sys/** w,
  deny /sys/** w,

  # Network
  network inet stream,
  network inet6 stream,
  network unix stream,
}

# Enable profile
aa-enforce /etc/apparmor.d/usr.sbin.nginx

# Complain mode (logging only)
aa-complain /etc/apparmor.d/usr.sbin.nginx

# Generate profile from logs
aa-genprof nginx

# Check status
aa-status

# View denied operations
dmesg | grep -i apparmor
journalctl -k | grep -i apparmor`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Auditd - Comprehensive System Auditing</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# /etc/audit/rules.d/audit.rules

# Delete all existing rules
-D

# Set buffer size
-b 8192

# Monitor user/group modifications
-w /etc/passwd -p wa -k identity
-w /etc/group -p wa -k identity
-w /etc/shadow -p wa -k identity
-w /etc/gshadow -p wa -k identity
-w /etc/security/opasswd -p wa -k identity

# Monitor sudoers
-w /etc/sudoers -p wa -k sudoers
-w /etc/sudoers.d/ -p wa -k sudoers

# Monitor SSH config
-w /etc/ssh/sshd_config -p wa -k sshd_config
-w /etc/ssh/ssh_config -p wa -k ssh_config

# Monitor PAM config
-w /etc/pam.d/ -p wa -k pam_changes

# Monitor kernel module loading/unloading
-a always,exit -F arch=b64 -S init_module -S delete_module -k kernel_modules

# Monitor mount operations
-a always,exit -F arch=b64 -S mount -S umount2 -k mount_ops

# Monitor setuid/setgid binaries
-a always,exit -F arch=b64 -S setuid -S setgid -S setreuid -S setregid -k privilege_escalation

# Monitor file permission changes
-a always,exit -F arch=b64 -S chmod -S fchmod -S fchmodat -k permission_changes

# Monitor failed access attempts
-a always,exit -F arch=b64 -S open -S openat -F exit=-EACCES -k access_denied
-a always,exit -F arch=b64 -S open -S openat -F exit=-EPERM -k access_denied

# Privileged commands
-a always,exit -F arch=b64 -C uid!=euid -F euid=0 -S execve -k privilege_cmd
-a always,exit -F arch=b64 -C gid!=egid -F egid=0 -S execve -k privilege_cmd

# Logins/Logouts
-w /var/log/lastlog -p wa -k logins
-w /var/run/faillock/ -p wa -k logins

# Process execution tracking
-a always,exit -F arch=b64 -S execve -C uid!=unset -k process_exec

# Network config changes
-a always,exit -F arch=b64 -S socket -S connect -S bind -k network_changes

# Ignore noise
-a never,exit -F arch=b64 -S clock_settime -k time
-a never,exit -F arch=b64 -S adjtimex -k time

# Make rules immutable (require reboot to change)
-e 2`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">CIS Benchmark Automation (OpenSCAP)</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# Install OpenSCAP
yum install -y scap-security-guide openscap-scanner
apt-get install -y ssg-debian openscap-utils

# Run CIS Level 2 Server Benchmark
oscap xccdf eval \\\n  --profile xccdf_org.ssgproject.content_profile_cis_level2_server \\\n  --results-arf /tmp/cis-results.xml \\\n  --report /tmp/cis-report.html \\\n  /usr/share/xml/scap/ssg/content/ssg-rhel9-ds.xml

# View results
firefox /tmp/cis-report.html

# Generate remediation script (Bash)
oscap xccdf generate fix \\\n  --fix-type bash \\\n  --output /tmp/cis-remediation.sh \\\n  --result-id xccdf_org.ssgproject.content_profile_cis_level2_server \\\n  /tmp/cis-results.xml

# Generate Ansible remediation
oscap xccdf generate fix \\\n  --fix-type ansible \\\n  --output /tmp/cis-remediation.yml \\\n  /tmp/cis-results.xml

# Apply remediation
bash /tmp/cis-remediation.sh

# Tailoring (exclude specific rules)
oscap xccdf eval \\\n  --tailoring-file custom-tailoring.xml \\\n  --profile xccdf_custom_profile \\\n  /usr/share/xml/scap/ssg/content/ssg-rhel9-ds.xml

# Continuous compliance scanning via cron
# /etc/cron.daily/cis-scan
#!/bin/bash
oscap xccdf eval \\\n  --profile xccdf_org.ssgproject.content_profile_cis_level1_server \\\n  --results /var/log/cis-scan-$(date +%Y%m%d).xml \\\n  /usr/share/xml/scap/ssg/content/ssg-rhel9-ds.xml

# Alert on failures
if grep -q "fail" /var/log/cis-scan-*.xml; then
  echo "CIS compliance failures detected" | mail -s "CIS Alert" security@company.com
fi`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">SSH Hardening</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="font-mono text-sm text-green-400">
{`# /etc/ssh/sshd_config - Production Hardening

# Protocol (only SSH-2)
Protocol 2

# Authentication
PermitRootLogin no
PubkeyAuthentication yes
PasswordAuthentication no
ChallengeResponseAuthentication no
UsePAM yes

# Key algorithms (secure only)
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com
KexAlgorithms curve25519-sha256@libssh.org,ecdh-sha2-nistp521
MACs hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com
HostKeyAlgorithms ssh-ed25519-cert-v01@openssh.com,ssh-ed25519

# Connection limits
MaxAuthTries 3
MaxSessions 2
ClientAliveInterval 300
ClientAliveCountMax 2
LoginGraceTime 60

# User restrictions
AllowUsers deploy@10.0.0.* ansible@10.0.0.*
DenyUsers root admin test guest
AllowGroups ssh-users wheel

# Security
X11Forwarding no
AllowTcpForwarding no
PermitTunnel no
GatewayPorts no
Banner /etc/ssh/banner
UseDNS no

# Logging
LogLevel VERBOSE
SyslogFacility AUTH

# SFTP only for certain users
Match User sftpuser
    ForceCommand internal-sftp
    AllowTcpForwarding no
    X11Forwarding no
    ChrootDirectory /srv/sftp

Match Group developers
    AllowTcpForwarding yes`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Linux Security Checklist</h2>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-100 mb-4">System Hardening</h3>
                  {[
                    "Kernel updated to latest LTS",
                    "ASLR enabled (randomize_va_space=2)",
                    "Sysctl security parameters applied",
                    "Unused services disabled",
                    "Boot loader password set (GRUB)",
                    "Single user mode password protected",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-700 last:border-0">
                      <span className="w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center text-xs text-slate-400">☐</span>
                      <span className="text-gray-200 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-100 mb-4">Access Control</h3>
                  {[
                    "SELinux/AppArmor enforcing",
                    "Password policy configured (PAM)",
                    "Account lockout after 5 failures",
                    "Session timeout configured",
                    "Sudo logging enabled",
                    "SSH key-only auth (no passwords)",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-700 last:border-0">
                      <span className="w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center text-xs text-slate-400">☐</span>
                      <span className="text-gray-200 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="font-semibold text-gray-100 mb-4">Auditing</h3>
                  {[
                    "Auditd installed and running",
                    "Custom audit rules configured",
                    "Audit logs forwarded to SIEM",
                    "Log rotation configured",
                    "Failed login alerts enabled",
                    "Privileged command auditing",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-700 last:border-0">
                      <span className="w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center text-xs text-slate-400">☐</span>
                      <span className="text-gray-200 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-100 mb-4">Compliance</h3>
                  {[
                    "CIS benchmark scan completed",
                    "SCAP content installed",
                    "Monthly compliance reports",
                    "Vulnerability scanning (OpenVAS)",
                    "Configuration drift detection",
                    "Remediation automation in place",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-700 last:border-0">
                      <span className="w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center text-xs text-slate-400">☐</span>
                      <span className="text-gray-200 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-r from-slate-700 to-black rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Linux Security Assessment</h2>
            <a href={coreLinks.check} className="inline-block px-6 py-3 bg-gray-800 text-gray-100 rounded-lg font-semibold">Assessment Starten</a>
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
        headline: "Linux Hardening 2026: Enterprise Server Security",
        author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        datePublished: "2026-03-29",
      })}} />
    </main>
  );
}
