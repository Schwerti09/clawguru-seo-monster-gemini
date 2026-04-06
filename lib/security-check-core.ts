/**
 * Core security header check logic – shared by /api/public-security-check
 * and the dashboard tool-execution handler.
 */

export interface SecurityCheckResult {
  timestamp: string
  target: string
  vulnerable: boolean
  score: number
  message: string
  details: string[]
  recommendations: string[]
  disclaimer: string
}

export async function runSecurityHeaderCheck(targetInput: string): Promise<SecurityCheckResult> {
  const t = targetInput.trim()
  if (!t) throw new Error("Missing target")

  const url = new URL(/^https?:\/\//i.test(t) ? t : `https://${t}`)

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)
  let resp: Response | null = null
  try {
    resp = await fetch(url.toString(), { method: "HEAD", redirect: "manual", signal: controller.signal })
  } catch {
    try {
      resp = await fetch(url.toString(), { method: "GET", redirect: "manual", signal: controller.signal })
    } catch {
      resp = null
    }
  } finally {
    clearTimeout(timeout)
  }

  const get = (n: string) => (resp?.headers.get(n) || "").toString()
  const hsts = get("strict-transport-security")
  const csp  = get("content-security-policy")
  const server = get("server")
  const xpb  = get("x-powered-by")
  const via  = get("via")

  let score = 100
  const details: string[] = []
  const recs: string[] = []

  if (url.protocol !== "https:") {
    score -= 30
    details.push("Target not using HTTPS")
    recs.push("Force HTTPS and redirect HTTP → HTTPS")
  }
  if (!hsts) {
    score -= 15
    details.push("Missing Strict-Transport-Security")
    recs.push("Enable HSTS (with preload where safe)")
  }
  if (!csp) {
    score -= 10
    details.push("Missing Content-Security-Policy")
    recs.push("Add a CSP to mitigate XSS/data injection")
  }
  if (server && /\d/.test(server)) {
    score -= 5
    details.push("Server header discloses version")
    recs.push("Hide or generalize Server header")
  }
  if (xpb) {
    score -= 5
    details.push("X-Powered-By header present")
    recs.push("Remove X-Powered-By header")
  }
  if (via) {
    details.push("Behind CDN/edge (via header detected)")
  }

  const finalScore = Math.max(0, Math.min(100, score))
  return {
    timestamp: new Date().toISOString(),
    target: url.hostname,
    vulnerable: finalScore < 90,
    score: finalScore,
    message: finalScore < 90 ? "Findings detected – review recommendations" : "Baseline checks passed",
    details: details.length ? details : ["No critical findings"],
    recommendations: recs.length ? recs : [
      "Rotate secrets & tokens regularly",
      "Harden CORS and webhook signatures",
      "Enable strict TLS and HSTS",
      "Set up monitoring & alerting",
    ],
    disclaimer: "Heuristic HTTP header inspection. Validate configs/logs for conclusions.",
  }
}
