import type { Metadata } from "next";
import { SUPPORTED_LOCALES, type Locale, localeAlternates } from "@/lib/i18n";
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
      ? "Docker Security Hardening 2026 | Container Security Guide"
      : "Docker Security Hardening 2026 | Container Security Guide",
    description: locale === "de"
      ? "Docker Security Hardening: Rootless, seccomp, AppArmor, Cap-Drop, Image Scanning & CIS Benchmark. Enterprise Container Security."
      : "Docker Security Hardening: Rootless, seccomp, AppArmor, cap-drop, image scanning & CIS benchmark. Enterprise container security.",
    keywords: [
      "Docker security",
      "Docker hardening",
      "Container security",
      "Docker rootless",
      "Docker seccomp",
      "Docker AppArmor",
      "Docker capabilities",
      "Docker image scanning",
      "Docker CIS benchmark",
      "Container hardening",
    ],
    alternates: {
      ...localeAlternates(`/${locale}/docker-security-hardening`),
    },
    openGraph: {
      title: "Docker Security Hardening 2026: Container Security",
      description: "Harden Docker with rootless mode, seccomp, AppArmor & CIS benchmarks.",
      type: "article",
      url: `${BASE_URL}/${locale}/docker-security-hardening`,
    },
  };
}

export default function DockerSecurityPage({
  params,
}: {
  params: { lang: string };
}) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale)
    ? params.lang
    : "de") as Locale;
  const prefix = `/${locale}`;
  const coreLinks = getCoreSecurityLinks(locale);

  const isGerman = locale === "de";

  return (
    <main className="min-h-screen bg-gray-800">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-sm mb-4">
              Container Security 2026
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Docker Security
            </h1>
            <p className="text-2xl text-cyan-100 mb-4">
              {isGerman ? "Container Hardening & Security" : "Container Hardening & Security"}
            </p>
            <p className="text-xl text-white/80 mb-8">
              Rootless, seccomp, AppArmor, Cap-Drop, Image Scanning, CIS Benchmarks. Enterprise-grade Docker security.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Rootless</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Seccomp</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">AppArmor</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">CIS</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Docker Security Grundlagen</h2>
            <p className="text-gray-200 text-lg mb-6">
              Container sind keine Sicherheitsgrenzen. Default-Docker ist unsicher - root im Container = root auf dem Host. Hardening ist Pflicht für Production.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-red-900 border border-red-700 rounded-xl p-6">
                <h3 className="font-semibold text-red-900 mb-2">Risiken</h3>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Root im Container</li>
                  <li>• Privileged Mode</li>
                  <li>• Kernel Exploits</li>
                  <li>• Image Vulnerabilities</li>
                </ul>
              </div>
              <div className="bg-green-900 border border-green-700 rounded-xl p-6">
                <h3 className="font-semibold text-green-900 mb-2">Schutz</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Rootless Mode</li>
                  <li>• User Namespaces</li>
                  <li>• Seccomp Profiles</li>
                  <li>• Read-Only FS</li>
                </ul>
              </div>
              <div className="bg-blue-900 border border-blue-700 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-2">Compliance</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• CIS Benchmark</li>
                  <li>• DISA STIG</li>
                  <li>• NIST 800-190</li>
                  <li>• PCI DSS</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Rootless Docker</h2>
            
            <div className="bg-slate-900 rounded-xl p-6 mb-6">
              <h3 className="text-white font-semibold mb-4">Installation & Setup</h3>
              <pre className="font-mono text-sm text-green-400 overflow-x-auto">
{`# Rootless Docker Installation
curl -fsSL https://get.docker.com/rootless | sh

# Umgebungsvariablen setzen
export PATH=/home/user/bin:$PATH
export DOCKER_HOST=unix:///run/user/1000/docker.sock

# Systemd Service
systemctl --user enable docker
systemctl --user start docker

# Verification
docker info --format '{{ .SecurityOptions }}'`}
              </pre>
            </div>

            <div className="bg-slate-900 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Rootless Daemon Config</h3>
              <pre className="font-mono text-sm text-green-400">
{`# ~/.config/docker/daemon.json
{
  "userns-remap": "default",
  "live-restore": true,
  "no-new-privileges": true,
  "selinux-enabled": true,
  "apparmor-default": "docker-default",
  "seccomp-profile": "/etc/docker/seccomp-default.json",
  "cgroup-parent": "docker.slice",
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Hardened Container Runtime</h2>
            
            <div className="bg-slate-900 rounded-xl p-6 mb-6">
              <h3 className="text-white font-semibold mb-4">Secure Docker Run</h3>
              <pre className="font-mono text-sm text-green-400">
{`docker run -d \\
  --name secure-app \\
  --user 1000:1000 \\
  --read-only \\
  --security-opt no-new-privileges:true \\
  --security-opt seccomp:seccomp-profile.json \\
  --security-opt apparmor:docker-default \\
  --cap-drop ALL \\
  --cap-add NET_BIND_SERVICE \\
  --memory 512m \\
  --memory-swap 512m \\
  --cpus 1.0 \\
  --pids-limit 100 \\
  --tmpfs /tmp:noexec,nosuid,size=100m \\
  --tmpfs /var/tmp:noexec,nosuid,size=100m \\
  -p 8080:8080 \\
  company/app:latest`}
              </pre>
            </div>

            <div className="bg-slate-900 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Seccomp Profile</h3>
              <pre className="font-mono text-sm text-green-400">
{`// seccomp-profile.json - Blocks dangerous syscalls
{
  "defaultAction": "SCMP_ACT_ERRNO",
  "architectures": ["SCMP_ARCH_X86_64", "SCMP_ARCH_X86"],
  "syscalls": [
    {
      "names": [
        "accept", "accept4", "bind", "clone", "close",
        "connect", "epoll_create", "epoll_create1"
      ],
      "action": "SCMP_ACT_ALLOW"
    },
    {
      "names": ["ptrace", "mount", "umount2", "reboot"],
      "action": "SCMP_ACT_KILL"
    }
  ]
}`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Hardened Dockerfile</h2>
            
            <div className="bg-slate-900 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Multi-Stage Security Build</h3>
              <pre className="font-mono text-sm text-green-400">
{`# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY . .
RUN npm run build

# Stage 2: Production (Distroless)
FROM gcr.io/distroless/nodejs20-debian12:nonroot
WORKDIR /app

# Copy only necessary files
COPY --from=builder --chown=nonroot:nonroot /app/dist ./dist
COPY --from=builder --chown=nonroot:nonroot /app/node_modules ./node_modules

# Non-root user
USER nonroot:nonroot

# Read-only root filesystem
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD ["/nodejs/bin/node", "dist/healthcheck.js"] || exit 1

CMD ["dist/server.js"]`}
              </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">Image Scanning</h2>
            
            <div className="bg-slate-900 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Trivy Scan in CI/CD</h3>
              <pre className="font-mono text-sm text-green-400">
{`# .github/workflows/security-scan.yml
name: Container Security Scan
on: [push, pull_request]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Build image
        run: docker build -t app:$\${{ github.sha }} .
      
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'app:$\${{ github.sha }}'
          format: 'sarif'
          output: 'trivy-results.sarif'
          severity: 'CRITICAL,HIGH'
          exit-code: '1'  # Fail on CRITICAL/HIGH
          
      - name: Upload to GitHub Security tab
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'`}
              </pre>
            </div>
          </section>

          <section className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Docker Security Assessment</h2>
            <p className="mb-6">Validieren Sie Ihre Container-Konfiguration gegen CIS Benchmarks.</p>
            <a href={coreLinks.check} className="inline-block px-6 py-3 bg-gray-800 text-cyan-400 rounded-lg font-semibold">
              Security Assessment
            </a>
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
        headline: "Docker Security Hardening 2026",
        author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        datePublished: "2026-03-29",
      })}} />
    </main>
  );
}
