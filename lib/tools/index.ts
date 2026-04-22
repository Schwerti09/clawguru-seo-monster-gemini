// Registry of Arsenal tools. Each entry drives both the tools hub and the
// per-tool page metadata.

export type ToolStatus = "live" | "soon"

export interface Tool {
  slug: string
  name: string
  tagline: string
  description: string
  icon: string
  accent: "emerald" | "cyan" | "violet" | "amber" | "red" | "blue" | "pink" | "lime"
  status: ToolStatus
}

export const TOOLS: Tool[] = [
  {
    slug: "header-doctor",
    name: "Header Doctor",
    tagline: "Security headers graded + specific fixes.",
    description: "Paste any public URL. Get a per-header verdict, a score, and drop-in nginx/apache/express snippets for every gap.",
    icon: "🩺",
    accent: "emerald",
    status: "live",
  },
  {
    slug: "tls-xray",
    name: "TLS X-Ray",
    tagline: "Full TLS chain + protocol + cipher analysis.",
    description: "Inspect live certificates: chain, SANs, key strength, expiry, negotiated protocol and cipher. No API keys, no third-party dependencies.",
    icon: "🔬",
    accent: "cyan",
    status: "live",
  },
  {
    slug: "prompt-injection-sandbox",
    name: "Prompt Injection Sandbox",
    tagline: "Stress-test your system prompt against 40+ payloads.",
    description: "Paste your AI agent's system prompt. We run it against a curated library of known prompt-injection and jailbreak patterns and highlight likely bypasses.",
    icon: "🧪",
    accent: "violet",
    status: "live",
  },
  { slug: "cve-time-machine",   name: "CVE Time Machine",   tagline: "A library's full CVE history, visualized.",                 description: "Coming soon.", icon: "⏳", accent: "amber",  status: "soon" },
  { slug: "password-entropy",   name: "Password Entropy Lab", tagline: "Rainbow-table-grade entropy visualization.",              description: "Coming soon.", icon: "🔑", accent: "red",    status: "soon" },
  { slug: "jwt-forensics",      name: "JWT Forensics",      tagline: "Decode + vulnerability scan + signature demo.",             description: "Coming soon.", icon: "🪪", accent: "blue",   status: "soon" },
  { slug: "docker-grader",      name: "Docker Hardening Grader", tagline: "Paste Dockerfile → score + auto-fix.",                 description: "Coming soon.", icon: "🐳", accent: "cyan",   status: "soon" },
  { slug: "k8s-auditor",        name: "K8s Policy Auditor", tagline: "OPA-powered manifest audit.",                               description: "Coming soon.", icon: "⚓", accent: "violet", status: "soon" },
  { slug: "nginx-scanner",      name: "Nginx Config Scanner", tagline: "Misconfig detector with explanations.",                   description: "Coming soon.", icon: "🕵️", accent: "emerald",status: "soon" },
  { slug: "secret-scanner",     name: "Secret Pattern Scanner", tagline: "Find hardcoded credentials in pasted code.",            description: "Coming soon.", icon: "🔎", accent: "pink",   status: "soon" },
  { slug: "actions-auditor",    name: "GitHub Actions Auditor", tagline: "Workflow security grade.",                              description: "Coming soon.", icon: "⚙️", accent: "lime",   status: "soon" },
  { slug: "dns-takeover",       name: "DNS Takeover Scanner", tagline: "Subdomain hijack risk map.",                              description: "Coming soon.", icon: "🌐", accent: "cyan",   status: "soon" },
  { slug: "nis2-gap",           name: "NIS2/EUVD Gap Scanner", tagline: "Compliance checklist + evidence.",                       description: "Coming soon.", icon: "📑", accent: "amber",  status: "soon" },
  { slug: "runbook-generator",  name: "Runbook Generator",  tagline: "Incident description → full Markdown runbook.",             description: "Coming soon.", icon: "📘", accent: "blue",   status: "soon" },
  { slug: "ai-jailbreak",       name: "AI Jailbreak Tester", tagline: "EU AI Act bias + robustness testing.",                     description: "Coming soon.", icon: "🤖", accent: "red",    status: "soon" },
]

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug)
}

export function listLiveTools(): Tool[] {
  return TOOLS.filter((t) => t.status === "live")
}
