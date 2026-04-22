// TLS X-Ray backend — opens a raw TLS connection to a hostname, extracts the
// cert chain + negotiated params. Node's tls.connect() gives us everything
// sans API keys.

import { NextResponse } from "next/server"
import tls from "node:tls"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface CertSummary {
  subject: string
  issuer: string
  subjectAltNames?: string
  validFrom: string
  validTo: string
  daysRemaining: number
  fingerprint256: string
  serialNumber: string
  signatureAlgorithm?: string
  keyType?: string
  keyBits?: number
}

interface Finding {
  status: "good" | "warn" | "bad"
  label: string
  detail?: string
}

interface Result {
  host: string
  port: number
  protocol: string
  cipher: { name: string; version?: string; standardName?: string }
  alpn?: string
  authorized: boolean
  authorizationError?: string
  peer: CertSummary
  chain: CertSummary[]
  score: number
  grade: "A" | "B" | "C" | "D" | "F"
  findings: Finding[]
}

function sanitizeHost(raw: string): { host: string; port: number } | null {
  const trimmed = (raw ?? "").trim()
  if (!trimmed) return null
  // Allow "example.com", "example.com:8443", or a full URL.
  let host = trimmed
  let port = 443
  try {
    if (/^https?:\/\//.test(trimmed)) {
      const u = new URL(trimmed)
      host = u.hostname
      port = u.port ? Number(u.port) : (u.protocol === "https:" ? 443 : 80)
    } else if (trimmed.includes(":")) {
      const [h, p] = trimmed.split(":")
      host = h
      port = Number(p) || 443
    }
  } catch { return null }
  if (!/^[a-z0-9.-]+$/i.test(host)) return null
  if (host.length > 253) return null
  const low = host.toLowerCase()
  if (low === "localhost" || low.endsWith(".local") || low.endsWith(".internal")) return null
  if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
    // rudimentary private-range block
    if (/^10\./.test(host) || /^192\.168\./.test(host) || /^127\./.test(host)) return null
    if (/^172\.(1[6-9]|2\d|3[01])\./.test(host)) return null
  }
  if (port < 1 || port > 65535) return null
  return { host, port }
}

function summarize(c: tls.PeerCertificate): CertSummary {
  const notBefore = new Date(c.valid_from)
  const notAfter = new Date(c.valid_to)
  const daysRemaining = Math.floor((notAfter.getTime() - Date.now()) / 86400000)
  const subject = Object.entries(c.subject || {}).map(([k, v]) => `${k}=${v}`).join(", ")
  const issuer = Object.entries(c.issuer || {}).map(([k, v]) => `${k}=${v}`).join(", ")
  return {
    subject,
    issuer,
    subjectAltNames: (c as tls.PeerCertificate & { subjectaltname?: string }).subjectaltname,
    validFrom: notBefore.toISOString(),
    validTo: notAfter.toISOString(),
    daysRemaining,
    fingerprint256: c.fingerprint256,
    serialNumber: c.serialNumber,
    signatureAlgorithm: (c as tls.PeerCertificate & { asn1Curve?: string; sigalg?: string }).sigalg,
    keyType: (c as tls.PeerCertificate & { pubkey?: Buffer }).pubkey ? "present" : undefined,
    keyBits: (c as tls.PeerCertificate & { bits?: number }).bits,
  }
}

function analyze(result: Omit<Result, "score" | "grade" | "findings">): { score: number; findings: Finding[] } {
  const findings: Finding[] = []
  let score = 100

  if (!result.authorized) {
    score -= 35
    findings.push({ status: "bad", label: "Chain not authorized", detail: result.authorizationError })
  } else {
    findings.push({ status: "good", label: "Chain authorized (valid trust path)" })
  }

  // Protocol
  const proto = result.protocol
  if (/TLSv1\.3/.test(proto)) findings.push({ status: "good", label: `Protocol: ${proto}` })
  else if (/TLSv1\.2/.test(proto)) { score -= 5; findings.push({ status: "warn", label: `Protocol: ${proto}`, detail: "Prefer TLS 1.3." }) }
  else { score -= 25; findings.push({ status: "bad", label: `Protocol: ${proto}`, detail: "Legacy TLS — upgrade." }) }

  // Cipher
  const cipher = result.cipher.name || ""
  if (/CBC|3DES|RC4|NULL|EXP/i.test(cipher)) { score -= 15; findings.push({ status: "bad", label: `Cipher: ${cipher}`, detail: "Weak cipher." }) }
  else findings.push({ status: "good", label: `Cipher: ${cipher || "?"}` })

  // Expiry
  const d = result.peer.daysRemaining
  if (d < 0) { score -= 40; findings.push({ status: "bad", label: "Certificate expired", detail: `${-d} day(s) ago` }) }
  else if (d < 14) { score -= 15; findings.push({ status: "bad", label: `Expires in ${d} days`, detail: "Rotate immediately." }) }
  else if (d < 30) { score -= 5; findings.push({ status: "warn", label: `Expires in ${d} days`, detail: "Schedule renewal." }) }
  else findings.push({ status: "good", label: `Expires in ${d} days` })

  // Key strength
  if (result.peer.keyBits && result.peer.keyBits < 2048) {
    score -= 20
    findings.push({ status: "bad", label: `Weak key: ${result.peer.keyBits} bits`, detail: "Use RSA ≥ 2048 or ECDSA." })
  } else if (result.peer.keyBits) {
    findings.push({ status: "good", label: `Key strength: ${result.peer.keyBits} bits` })
  }

  // Signature
  if (/sha1|md5/i.test(result.peer.signatureAlgorithm ?? "")) {
    score -= 15
    findings.push({ status: "bad", label: `Weak signature: ${result.peer.signatureAlgorithm}`, detail: "Re-issue with SHA-256+." })
  }

  if (score < 0) score = 0
  return { score, findings }
}

function gradeFromScore(s: number): Result["grade"] {
  if (s >= 90) return "A"
  if (s >= 75) return "B"
  if (s >= 60) return "C"
  if (s >= 40) return "D"
  return "F"
}

async function inspect(host: string, port: number): Promise<Result> {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(
      {
        host,
        port,
        servername: host,
        rejectUnauthorized: false,         // we want to report errors, not throw
        ALPNProtocols: ["h2", "http/1.1"],
        timeout: 8000,
      },
      () => {
        try {
          const peer = socket.getPeerCertificate(true)
          const cipher = socket.getCipher()
          const protocol = socket.getProtocol() || "?"
          const alpn = socket.alpnProtocol || undefined

          // Walk the chain via issuerCertificate pointers.
          const chain: CertSummary[] = []
          const seen = new Set<string>()
          let cur: tls.PeerCertificate | undefined = peer
          while (cur && !seen.has(cur.fingerprint256)) {
            chain.push(summarize(cur))
            seen.add(cur.fingerprint256)
            cur = (cur as tls.DetailedPeerCertificate).issuerCertificate
            if (cur === peer) break    // self-signed root loop
          }

          const partial: Omit<Result, "score" | "grade" | "findings"> = {
            host,
            port,
            protocol,
            cipher: { name: cipher.name, version: cipher.version, standardName: (cipher as { standardName?: string }).standardName },
            alpn,
            authorized: socket.authorized,
            authorizationError: socket.authorizationError ? String(socket.authorizationError) : undefined,
            peer: summarize(peer),
            chain,
          }
          const { score, findings } = analyze(partial)
          socket.end()
          resolve({ ...partial, score, grade: gradeFromScore(score), findings })
        } catch (e) {
          socket.destroy()
          reject(e)
        }
      }
    )
    socket.on("timeout", () => { socket.destroy(); reject(new Error("timeout")) })
    socket.on("error", (err) => reject(err))
  })
}

export async function POST(req: Request) {
  let body: { host?: string }
  try { body = await req.json() } catch { return NextResponse.json({ error: "invalid_json" }, { status: 400 }) }
  const parsed = sanitizeHost(body.host ?? "")
  if (!parsed) return NextResponse.json({ error: "invalid_host" }, { status: 400 })

  try {
    const result = await inspect(parsed.host, parsed.port)
    return NextResponse.json(result)
  } catch (e) {
    const msg = e instanceof Error ? e.message : "tls_failed"
    return NextResponse.json({ error: "tls_failed", detail: msg.slice(0, 200) }, { status: 502 })
  }
}
