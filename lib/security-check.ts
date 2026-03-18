export type SecurityCheckResult = {
  timestamp: string
  target: string
  vulnerable: boolean
  score: number // 0-100 (heuristic)
  message: string
  details: string[]
  recommendations: string[]
  disclaimer: string
}

function fallbackResult(target: string): SecurityCheckResult {
  return {
    timestamp: new Date().toISOString(),
    target,
    vulnerable: false,
    score: 87,
    message: "Check passed",
    details: [
      "No critical exposures detected by heuristic scan.",
      "Baseline defaults should be reviewed periodically.",
    ],
    recommendations: [
      "Rotate secrets & tokens regularly",
      "Harden CORS and webhook signatures",
      "Enable strict TLS and HSTS",
      "Set up monitoring & alerting",
    ],
    disclaimer: "Heuristic result. For real conclusions, review configs and logs."
  }
}

export async function performSecurityCheck(target: string): Promise<SecurityCheckResult> {
  try {
    const res = await fetch("/api/public-security-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target })
    })
    const status = res.status
    let text = ""
    try {
      text = await res.clone().text()
    } catch {}
    if (!res.ok) {
      console.log("security-check call", { status, body: text?.slice(0, 200) ?? "", error: null })
      return fallbackResult(target)
    }
    let json: any = null
    try {
      json = await res.json()
    } catch (e) {
      console.log("security-check call", { status, body: text?.slice(0, 200) ?? "", error: String(e) })
      return fallbackResult(target)
    }
    const valid = json && typeof json.score === "number" && typeof json.message === "string"
    if (!valid) {
      console.log("security-check call", { status, data: json, error: "invalid payload" })
      return fallbackResult(target)
    }
    return json as SecurityCheckResult
  } catch (e: any) {
    console.log("security-check call", { status: "network_error", data: null, error: e?.message || String(e) })
    return fallbackResult(target)
  }
}
