import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/openclaw/container-escape-prevention"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "Container Escape Prevention: Docker & Kubernetes Ausbrüche verhindern | ClawGuru"
    : "Container Escape Prevention: Prevent Docker & Kubernetes Breakouts | ClawGuru"
  const description = isDE
    ? "Container-Escape-Angriffe erkennen und verhindern: privilegierte Container, Host-Mounts, runc-Exploits, seccomp/AppArmor-Profile, gVisor Sandbox und OpenClaw Runtime Detection."
    : "Detect and prevent container escape attacks: privileged containers, host mounts, runc exploits, seccomp/AppArmor profiles, gVisor sandbox and OpenClaw runtime detection."
  return {
    title, description,
    keywords: ["container escape prevention", "docker container escape", "kubernetes container breakout", "seccomp apparmor container", "gvisor sandbox", "container security hardening"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const ESCAPE_VECTORS = [
  { id: "CE-1", severity: "CRITICAL", name: "Privileged Container", desc: "Running containers with --privileged grants full host capabilities. Trivial escape via /proc/sysrq-trigger, device mounts, or kernel module loading.", fix: `# WRONG — never run in production
docker run --privileged myimage

# CORRECT — drop ALL capabilities, add only what's needed
docker run --cap-drop=ALL --cap-add=NET_BIND_SERVICE myimage

# Kubernetes: enforce via Pod Security Standards
apiVersion: v1
kind: Pod
spec:
  securityContext:
    runAsNonRoot: true
    seccompProfile:
      type: RuntimeDefault
  containers:
  - name: app
    securityContext:
      allowPrivilegeEscalation: false
      privileged: false
      capabilities:
        drop: ["ALL"]
        add: ["NET_BIND_SERVICE"]  # only if needed` },
  { id: "CE-2", severity: "HIGH", name: "Dangerous Host Mounts", desc: "Mounting host paths like /, /etc, /var/run/docker.sock gives container full host access. Docker socket mount = root on host.", fix: `# WRONG — mounts giving host escape
docker run -v /:/host myimage          # Full host filesystem
docker run -v /etc:/etc myimage        # Host config
docker run -v /var/run/docker.sock:/var/run/docker.sock myimage  # Docker-in-Docker escape

# CORRECT — mount only what's needed, read-only where possible
docker run -v /data/app:/app:ro myimage

# Kubernetes: OPA Gatekeeper policy blocking docker.sock mounts
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sPSPVolumeTypes
metadata:
  name: psp-volume-types
spec:
  match:
    kinds: [{apiGroups: [""], kinds: ["Pod"]}]
  parameters:
    volumes:
      - "configMap"
      - "emptyDir"
      - "projected"
      - "secret"
      - "downwardAPI"
      - "persistentVolumeClaim"
    # hostPath EXCLUDED — no host mounts` },
  { id: "CE-3", severity: "HIGH", name: "Missing seccomp / AppArmor Profile", desc: "Without seccomp, containers can call any kernel syscall. 300+ syscalls available — many enable privilege escalation (ptrace, mount, keyctl, clone with new namespaces).", fix: `# Apply seccomp RuntimeDefault (blocks 100+ dangerous syscalls)
# Docker:
docker run --security-opt seccomp=/path/to/profile.json myimage

# Kubernetes — apply to all containers via RuntimeDefault:
apiVersion: v1
kind: Pod
spec:
  securityContext:
    seccompProfile:
      type: RuntimeDefault   # Blocks dangerous syscalls automatically

# AppArmor (Ubuntu/Debian):
docker run --security-opt apparmor=docker-default myimage

# OpenClaw: detect containers running without seccomp profile
openclaw check --namespace production --rule no-seccomp-profile` },
  { id: "CE-4", severity: "HIGH", name: "Writable Root Filesystem", desc: "Writable container filesystem allows attackers to modify binaries, add persistence, install tools after gaining initial access.", fix: `# Kubernetes: enforce read-only root filesystem
spec:
  containers:
  - name: app
    securityContext:
      readOnlyRootFilesystem: true
    volumeMounts:
    - name: tmp
      mountPath: /tmp         # tmpfs for writable temp
    - name: var-run
      mountPath: /var/run     # tmpfs for runtime files
  volumes:
  - name: tmp
    emptyDir:
      medium: Memory
  - name: var-run
    emptyDir:
      medium: Memory

# Docker:
docker run --read-only --tmpfs /tmp --tmpfs /var/run myimage` },
  { id: "CE-5", severity: "MEDIUM", name: "Kernel Namespace Sharing", desc: "Sharing host PID/IPC/network namespaces with the container collapses isolation boundaries. hostPID=true allows container to see and signal all host processes.", fix: `# Kubernetes: explicitly prohibit host namespace sharing
spec:
  hostPID: false     # Default false — but set explicitly
  hostIPC: false     # Default false — but set explicitly
  hostNetwork: false # Default false — only enable if actually needed

# OPA Gatekeeper constraint to block hostPID/hostIPC:
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sPSPHostNamespace
metadata:
  name: psp-host-namespace
spec:
  match:
    kinds: [{apiGroups: [""], kinds: ["Pod"]}]
  # Constraint: hostPID and hostIPC must be false` },
]

const FAQ = [
  { q: "What is a container escape and how common are they?", a: "A container escape is when an attacker who has compromised a container process manages to break out of the container isolation and gain access to the host OS or other containers. Common vectors: privileged containers (trivially exploitable), docker.sock mounts (instant root on host), kernel CVEs in runc/containerd (CVE-2024-21626 runc escape), dangerous syscalls without seccomp (ptrace, mount). Real-world frequency: container escapes are found in nearly every Kubernetes security audit. Misconfigurations (privileged containers, socket mounts) are far more common than actual kernel exploits — and easier to fix." },
  { q: "What is gVisor and when should I use it?", a: "gVisor is a user-space kernel written in Go (developed by Google) that intercepts container syscalls before they reach the host kernel. Instead of syscalls going directly to the Linux kernel, gVisor's Sentry handles them. Why this matters: even if a container process exploits a kernel vulnerability, it exploits gVisor's kernel — not the host kernel. A gVisor escape would require a second exploit against gVisor itself. Use gVisor when: running untrusted workloads (e.g., user-submitted code), multi-tenant Kubernetes where tenant isolation is critical, any workload that would otherwise require privileged containers. Tradeoff: ~10-20% performance overhead for syscall-heavy workloads. Kubernetes RuntimeClass: set runtimeClassName: gvisor on sensitive pods." },
  { q: "How does OpenClaw detect container escape attempts at runtime?", a: "OpenClaw integrates with Falco for runtime detection. Key rules: 1) Privileged container process spawning shell (container_shell_from_privileged). 2) Write to sensitive host paths from within a container (/etc, /proc/sysrq-trigger). 3) Docker socket access from within a container (fd opened matching /var/run/docker.sock). 4) Unexpected capability use (ptrace, mount syscall from non-init container). 5) Namespace escape indicators (setns syscall, clone with CLONE_NEWUSER from container). 6) Unexpected network connections from a container to host-only subnets. Alerts route to your SIEM via OpenClaw's webhook integration." },
  { q: "What is the most impactful single change to prevent container escapes?", a: "Enforce Pod Security Standards at the cluster level. A single admission webhook enforcing the 'restricted' PSS profile prevents: privileged containers, hostPath mounts, hostPID/hostIPC/hostNetwork, missing seccomp profiles, privilege escalation, running as root. One OPA Gatekeeper or Kyverno policy set enforcing PSS 'restricted' eliminates the most common container escape vectors cluster-wide. This is more impactful than addressing individual vulnerabilities because it prevents entire classes of misconfiguration. Enable immediately on new clusters; use 'warn' mode on existing clusters first to identify violations, then switch to 'enforce'." },
]

export default function ContainerEscapePreventionPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "OpenClaw", item: `${SITE_URL}/${locale}/openclaw` },
      { "@type": "ListItem", position: 3, name: "Container Escape Prevention", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  const sevColor: Record<string, string> = { CRITICAL: "bg-red-900 text-red-300", HIGH: "bg-orange-900 text-orange-300", MEDIUM: "bg-yellow-900 text-yellow-300" }

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Container-Hardening-Guide für eigene Infrastruktur." : "Container hardening guide for your own infrastructure."}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">OpenClaw · Batch 5</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          {isDE ? "Container Escape Prevention" : "Container Escape Prevention"}
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          {isDE
            ? "Container-Escapes sind häufiger als Kernel-Exploits — und meist durch simple Fehlkonfiguration. Fünf kritische Vektoren mit fertigen Fixes: von privilegierten Containern bis zu Host-Namespace-Sharing."
            : "Container escapes are more common than kernel exploits — and usually caused by simple misconfiguration. Five critical vectors with ready fixes: from privileged containers to host namespace sharing."}
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "5 Container Escape Vektoren & Fixes" : "5 Container Escape Vectors & Fixes"}</h2>
          <div className="space-y-5">
            {ESCAPE_VECTORS.map((v) => (
              <div key={v.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-700">
                  <span className="font-mono text-xs text-cyan-400 bg-gray-900 px-2 py-0.5 rounded">{v.id}</span>
                  <span className="font-bold text-gray-100">{v.name}</span>
                  <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded ${sevColor[v.severity]}`}>{v.severity}</span>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-300 mb-3">{v.desc}</p>
                  <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs overflow-x-auto"><pre>{v.fix}</pre></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Häufige Fragen" : "Frequently Asked Questions"}</h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <details key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <summary className="font-semibold text-gray-100 cursor-pointer">{f.q}</summary>
                <p className="mt-3 text-sm text-gray-300 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Weiterführende Ressourcen" : "Further Resources"}</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/openclaw/runtime-policy-enforcement`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Runtime Policy Enforcement</div>
              <div className="text-sm text-gray-300">{isDE ? "OPA + Falco + Cilium" : "OPA + Falco + Cilium"}</div>
            </a>
            <a href={`/${locale}/openclaw/supply-chain-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Supply Chain Security</div>
              <div className="text-sm text-gray-300">{isDE ? "Distroless + Cosign" : "Distroless + Cosign"}</div>
            </a>
            <a href={`/${locale}/academy/cve/CVE-2024-21626`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">CVE-2024-21626</div>
              <div className="text-sm text-gray-300">runc Container Escape</div>
            </a>
            <a href={`/${locale}/solutions/kubernetes-security-hardening`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Kubernetes Hardening</div>
              <div className="text-sm text-gray-300">{isDE ? "Cluster-weites Hardening" : "Cluster-wide hardening"}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
