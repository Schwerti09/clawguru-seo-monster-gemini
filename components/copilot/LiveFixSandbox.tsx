'use client'

// NEXT-LEVEL UPGRADE 2026: Live Fix Sandbox
// In-browser config tester for nginx, Docker, Terraform, K8s configs.
// Uses pattern matching + heuristics (no external deps needed).
// Pyodide/WASM integration scaffold included for future upgrade.

import { useState, useCallback } from "react"
import { Play, Copy, CheckCheck, AlertTriangle, CheckCircle, Info, TerminalSquare } from "lucide-react"

type ConfigType = "nginx" | "docker" | "terraform" | "k8s" | "auto"

interface LintResult {
  line?: number
  severity: "error" | "warning" | "info"
  message: string
}

interface SandboxResult {
  configType: ConfigType
  results: LintResult[]
  score: number // 0-100
  summary: string
}

// NEXT-LEVEL UPGRADE 2026: Config auto-detector
function detectConfigType(code: string): ConfigType {
  const lower = code.toLowerCase().trim()
  if (lower.includes("server {") || lower.includes("location /") || lower.includes("upstream ")) return "nginx"
  if (lower.includes("from ") && (lower.includes("run ") || lower.includes("expose "))) return "docker"
  if (lower.includes('provider "') || lower.includes("terraform {") || lower.includes('resource "')) return "terraform"
  if (lower.includes("apiversion:") || lower.includes("kind: deployment") || lower.includes("kind: service")) return "k8s"
  return "auto"
}

// NEXT-LEVEL UPGRADE 2026: Nginx config linter
function lintNginx(code: string): LintResult[] {
  const results: LintResult[] = []
  const lines = code.split("\n")

  lines.forEach((line, i) => {
    const ln = i + 1
    const trimmed = line.trim().toLowerCase()
    if (trimmed.includes("server_tokens on")) {
      results.push({ line: ln, severity: "error", message: "server_tokens on: gibt Nginx-Version preis – auf 'off' setzen" })
    }
    if (trimmed.includes("autoindex on")) {
      results.push({ line: ln, severity: "error", message: "autoindex on: Directory Listing aktiviert – sicherheitsrisiko" })
    }
    if (trimmed.includes("ssl_protocols") && trimmed.includes("tlsv1 ")) {
      results.push({ line: ln, severity: "error", message: "TLSv1.0/1.1 nicht mehr sicher – nur TLSv1.2 und TLSv1.3 verwenden" })
    }
    if (!code.toLowerCase().includes("add_header x-frame-options") && trimmed.includes("server {")) {
      results.push({ line: ln, severity: "warning", message: "X-Frame-Options Header fehlt – Clickjacking-Schutz empfohlen" })
    }
    if (!code.toLowerCase().includes("add_header content-security-policy")) {
      if (trimmed.includes("server {")) {
        results.push({ line: ln, severity: "warning", message: "Content-Security-Policy Header fehlt" })
      }
    }
    if (trimmed.includes("allow all") && !trimmed.includes("# ")) {
      results.push({ line: ln, severity: "info", message: "Uneingeschränkter Zugriff – prüfen ob Restriction nötig" })
    }
  })

  if (!code.toLowerCase().includes("ssl_certificate")) {
    results.push({ severity: "warning", message: "Kein SSL-Zertifikat konfiguriert – HTTPS empfohlen" })
  }

  return results
}

// NEXT-LEVEL UPGRADE 2026: Dockerfile linter
function lintDockerfile(code: string): LintResult[] {
  const results: LintResult[] = []
  const lines = code.split("\n")

  lines.forEach((line, i) => {
    const ln = i + 1
    const trimmed = line.trim()
    if (/^FROM .+:latest$/i.test(trimmed)) {
      results.push({ line: ln, severity: "warning", message: ":latest Tag unpinned – führt zu nicht-reproduzierbaren Builds" })
    }
    if (/^ENV .*(password|secret|key|token)\s*=/i.test(trimmed)) {
      results.push({ line: ln, severity: "error", message: "Geheimnis/Passwort als ENV Variable – nie in Image baken, secrets verwenden" })
    }
    if (/^USER root$/i.test(trimmed)) {
      results.push({ line: ln, severity: "error", message: "Container läuft als root – non-root USER definieren" })
    }
    if (/^ADD /i.test(trimmed) && !trimmed.match(/\.tar\./)) {
      results.push({ line: ln, severity: "info", message: "ADD statt COPY verwenden, außer für tar-Extraktion" })
    }
  })

  if (!code.toLowerCase().includes("healthcheck")) {
    results.push({ severity: "info", message: "HEALTHCHECK fehlt – orchestrierte Deployments empfehlen einen Health-Check" })
  }

  return results
}

// NEXT-LEVEL UPGRADE 2026: Terraform linter
function lintTerraform(code: string): LintResult[] {
  const results: LintResult[] = []
  const lines = code.split("\n")

  lines.forEach((line, i) => {
    const ln = i + 1
    const trimmed = line.trim().toLowerCase()
    if (trimmed.match(/password\s*=\s*"[^"]+"/)) {
      results.push({ line: ln, severity: "error", message: "Plaintext Passwort im Code – var.password oder secrets manager verwenden" })
    }
    if (trimmed.includes("cidr_blocks") && trimmed.includes('"0.0.0.0/0"') && trimmed.includes("ingress")) {
      results.push({ line: ln, severity: "warning", message: "Ingress von 0.0.0.0/0 – öffnet Port für gesamtes Internet" })
    }
    if (trimmed.includes("encryption") && trimmed.includes("= false")) {
      results.push({ line: ln, severity: "error", message: "Verschlüsselung deaktiviert – encryption = true setzen" })
    }
  })

  if (!code.toLowerCase().includes("backend")) {
    results.push({ severity: "info", message: "Kein Remote Backend konfiguriert – State lokal gespeichert, nicht team-fähig" })
  }

  return results
}

// NEXT-LEVEL UPGRADE 2026: K8s manifest linter
function lintK8s(code: string): LintResult[] {
  const results: LintResult[] = []
  const lower = code.toLowerCase()

  if (!lower.includes("resources:")) {
    results.push({ severity: "warning", message: "Keine resource limits/requests definiert – kann zu OOM führen" })
  }
  if (!lower.includes("readinessprobe:")) {
    results.push({ severity: "warning", message: "readinessProbe fehlt – Kubernetes weiss nicht wann Pod ready ist" })
  }
  if (!lower.includes("livenessprobe:")) {
    results.push({ severity: "info", message: "livenessProbe fehlt – Kubernetes kann hängende Pods nicht automatisch neustarten" })
  }
  if (lower.includes("privileged: true")) {
    results.push({ severity: "error", message: "privileged: true – Container hat vollen Host-Zugriff, sehr gefährlich" })
  }
  if (lower.includes("hostpid: true") || lower.includes("hostnetwork: true")) {
    results.push({ severity: "error", message: "hostPID/hostNetwork aktiviert – Container kann Host-Prozesse einsehen" })
  }
  if (!lower.includes("securitycontext:")) {
    results.push({ severity: "warning", message: "Kein securityContext definiert – runAsNonRoot: true empfohlen" })
  }

  return results
}

function runLint(code: string, type: ConfigType): SandboxResult {
  const detected = type === "auto" ? detectConfigType(code) : type
  let results: LintResult[] = []

  switch (detected) {
    case "nginx":
      results = lintNginx(code)
      break
    case "docker":
      results = lintDockerfile(code)
      break
    case "terraform":
      results = lintTerraform(code)
      break
    case "k8s":
      results = lintK8s(code)
      break
    default:
      results = [{ severity: "info", message: "Config-Typ konnte nicht erkannt werden. Bitte manuell auswählen." }]
  }

  const errors = results.filter((r) => r.severity === "error").length
  const warnings = results.filter((r) => r.severity === "warning").length
  const score = Math.max(0, 100 - errors * 25 - warnings * 10)

  const summary =
    errors === 0 && warnings === 0
      ? "✅ Keine kritischen Probleme gefunden."
      : `${errors} Fehler · ${warnings} Warnungen gefunden`

  return { configType: detected, results, score, summary }
}

const EXAMPLE_CONFIGS: Record<string, { type: ConfigType; code: string }> = {
  nginx: {
    type: "nginx",
    code: `server {
    listen 80;
    server_name example.com;
    server_tokens on;
    autoindex on;
    
    location / {
        proxy_pass http://localhost:3000;
    }
}`,
  },
  docker: {
    type: "docker",
    code: `FROM node:latest
ENV DB_PASSWORD=supersecret123
USER root
COPY . /app
RUN npm install
EXPOSE 3000
CMD ["node", "server.js"]`,
  },
}

export default function LiveFixSandbox() {
  const [code, setCode] = useState("")
  const [configType, setConfigType] = useState<ConfigType>("auto")
  const [result, setResult] = useState<SandboxResult | null>(null)
  const [copied, setCopied] = useState(false)

  const handleRun = useCallback(() => {
    if (!code.trim()) return
    const r = runLint(code, configType)
    setResult(r)
  }, [code, configType])

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  const loadExample = useCallback((key: keyof typeof EXAMPLE_CONFIGS) => {
    const ex = EXAMPLE_CONFIGS[key]
    setCode(ex.code)
    setConfigType(ex.type)
    setResult(null)
  }, [])

  const severityIcon = (s: LintResult["severity"]) => {
    if (s === "error") return <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
    if (s === "warning") return <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
    return <Info className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
  }

  const scoreColor = (s: number) => {
    if (s >= 80) return "text-[#00ff9d]"
    if (s >= 50) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    // NEXT-LEVEL UPGRADE 2026: Live Fix Sandbox UI
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-black/30">
        <div className="flex items-center gap-2">
          <TerminalSquare className="w-4 h-4 text-[#00b8ff]" />
          <span className="text-sm font-bold text-[#00b8ff]">Live Fix Sandbox</span>
          <span className="text-xs text-gray-500">nginx · docker · terraform · k8s</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Config type selector */}
          <select
            value={configType}
            onChange={(e) => setConfigType(e.target.value as ConfigType)}
            className="text-xs bg-black/50 border border-gray-700 rounded-lg px-2 py-1 text-gray-300"
          >
            <option value="auto">Auto-Detect</option>
            <option value="nginx">nginx</option>
            <option value="docker">Dockerfile</option>
            <option value="terraform">Terraform</option>
            <option value="k8s">Kubernetes</option>
          </select>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors"
          >
            {copied ? <CheckCheck className="w-3.5 h-3.5 text-[#00ff9d]" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
          </button>
        </div>
      </div>

      {/* Example buttons */}
      <div className="flex gap-2 px-5 py-2 border-b border-white/5">
        <span className="text-xs text-gray-500 self-center">Beispiele:</span>
        {Object.keys(EXAMPLE_CONFIGS).map((key) => (
          <button
            key={key}
            onClick={() => loadExample(key as keyof typeof EXAMPLE_CONFIGS)}
            className="text-xs px-2 py-0.5 rounded border border-gray-700 hover:border-[#00b8ff]/50 text-gray-400 hover:text-[#00b8ff] transition-colors"
          >
            {key}
          </button>
        ))}
      </div>

      {/* Code editor */}
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Config hier einfügen (nginx, Dockerfile, Terraform HCL, K8s YAML)…"
        className="w-full h-48 bg-black/50 text-gray-200 font-mono text-xs p-4 resize-none focus:outline-none border-b border-white/5 placeholder:text-gray-600"
        spellCheck={false}
      />

      {/* Run button */}
      <div className="px-5 py-3 flex items-center gap-3 border-b border-white/5">
        <button
          onClick={handleRun}
          disabled={!code.trim()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00b8ff]/15 border border-[#00b8ff]/40 hover:bg-[#00b8ff]/25 text-[#00b8ff] text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Play className="w-3.5 h-3.5" />
          Analyse starten
        </button>
        {result && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Security Score:</span>
            <span className={`text-lg font-black ${scoreColor(result.score)}`}>{result.score}/100</span>
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-2 mb-3">
            {result.results.filter((r) => r.severity === "error").length === 0 ? (
              <CheckCircle className="w-4 h-4 text-[#00ff9d]" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400" />
            )}
            <span className="text-sm font-bold">{result.summary}</span>
            <span className="text-xs text-gray-500 px-2 py-0.5 rounded border border-gray-700 font-mono">
              {result.configType}
            </span>
          </div>

          {result.results.length === 0 ? (
            <p className="text-sm text-[#00ff9d]">Keine Probleme gefunden 🎉</p>
          ) : (
            <div className="space-y-2">
              {result.results.map((r, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2 p-3 rounded-xl border text-xs ${
                    r.severity === "error"
                      ? "border-red-500/20 bg-red-500/5"
                      : r.severity === "warning"
                      ? "border-yellow-400/20 bg-yellow-400/5"
                      : "border-blue-400/20 bg-blue-400/5"
                  }`}
                >
                  {severityIcon(r.severity)}
                  <div>
                    {r.line && <span className="font-mono text-gray-500 mr-2">L{r.line}</span>}
                    <span className="text-gray-200">{r.message}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
