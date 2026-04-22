"use client"

import { useState } from "react"

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
  keyBits?: number
}
interface Finding { status: "good" | "warn" | "bad"; label: string; detail?: string }
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

const gradeColor: Record<Result["grade"], string> = {
  A: "text-emerald-300 border-emerald-400/40 bg-emerald-500/10",
  B: "text-lime-300 border-lime-400/40 bg-lime-500/10",
  C: "text-amber-300 border-amber-400/40 bg-amber-500/10",
  D: "text-orange-300 border-orange-400/40 bg-orange-500/10",
  F: "text-red-300 border-red-400/40 bg-red-500/10",
}
const statusColor: Record<Finding["status"], string> = {
  good: "text-emerald-400",
  warn: "text-amber-400",
  bad: "text-red-400",
}

export function TlsXrayClient() {
  const [host, setHost] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Result | null>(null)

  async function run(e: React.FormEvent) {
    e.preventDefault()
    setError(null); setResult(null); setLoading(true)
    try {
      const r = await fetch("/api/tools/tls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ host }),
      })
      if (!r.ok) {
        const err = (await r.json().catch(() => ({}))) as { error?: string; detail?: string }
        throw new Error(err.detail ?? err.error ?? `http_${r.status}`)
      }
      setResult(await r.json())
    } catch (e) {
      setError(e instanceof Error ? e.message : "request_failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={run} className="flex gap-2 mb-8">
        <input
          value={host}
          onChange={(e) => setHost(e.target.value)}
          required
          placeholder="example.com or example.com:8443"
          className="flex-1 bg-white/5 border border-white/10 focus:border-cyan-400/50 rounded-lg px-4 py-3 text-gray-100 placeholder:text-gray-500 outline-none"
        />
        <button
          type="submit"
          disabled={loading || !host.trim()}
          className="px-6 py-3 bg-cyan-500 text-black font-black rounded-lg hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Probing…" : "X-Ray"}
        </button>
      </form>

      {error && (
        <div className="p-4 rounded-lg border border-red-500/30 bg-red-500/5 text-red-300 text-sm font-mono mb-6">
          Error: {error}
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className={`px-4 py-3 rounded-xl border font-mono ${gradeColor[result.grade]}`}>
              <div className="text-xs tracking-widest opacity-70">GRADE</div>
              <div className="text-3xl font-black">{result.grade}</div>
            </div>
            <div>
              <div className="text-xs font-mono text-gray-500 mb-0.5">SCORE</div>
              <div className="text-2xl font-bold text-gray-100">{result.score}/100</div>
            </div>
            <div className="text-xs text-gray-400 font-mono">
              <div>{result.host}:{result.port}</div>
              <div>{result.protocol}{result.alpn ? ` · ALPN ${result.alpn}` : ""}</div>
              <div>{result.cipher.name}</div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-mono tracking-widest text-cyan-400 mb-3">FINDINGS</h3>
            <ul className="space-y-2">
              {result.findings.map((f, i) => (
                <li key={i} className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-3">
                  <span className={`font-mono shrink-0 ${statusColor[f.status]}`}>
                    {f.status === "good" ? "✓" : f.status === "warn" ? "!" : "✗"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-100">{f.label}</div>
                    {f.detail && <div className="text-xs text-gray-400 mt-0.5">{f.detail}</div>}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-mono tracking-widest text-cyan-400 mb-3">PEER CERTIFICATE</h3>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <CertRow label="Subject" value={result.peer.subject} />
              <CertRow label="Issuer" value={result.peer.issuer} />
              <CertRow label="SANs" value={result.peer.subjectAltNames} />
              <CertRow label="Valid From" value={fmtDate(result.peer.validFrom)} />
              <CertRow label="Valid To" value={`${fmtDate(result.peer.validTo)} (${result.peer.daysRemaining}d)`} />
              <CertRow label="Key Bits" value={result.peer.keyBits ? String(result.peer.keyBits) : "?"} />
              <CertRow label="Signature" value={result.peer.signatureAlgorithm ?? "?"} />
              <CertRow label="Serial" value={result.peer.serialNumber} mono />
              <CertRow label="SHA-256" value={result.peer.fingerprint256} mono />
            </dl>
          </div>

          {result.chain.length > 1 && (
            <div>
              <h3 className="text-sm font-mono tracking-widest text-cyan-400 mb-3">CERTIFICATE CHAIN</h3>
              <ol className="space-y-2 text-xs">
                {result.chain.map((c, i) => (
                  <li key={i} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-cyan-400">#{i + 1}</span>
                      <span className="text-gray-400 font-mono">{c.subject}</span>
                    </div>
                    <div className="text-gray-500 text-[11px]">Issuer: {c.issuer}</div>
                    <div className="text-gray-500 text-[11px]">Expires: {fmtDate(c.validTo)} ({c.daysRemaining}d)</div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function CertRow({ label, value, mono }: { label: string; value?: string; mono?: boolean }) {
  if (!value) return null
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
      <div className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-1">{label}</div>
      <div className={`text-gray-200 break-all ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  )
}
function fmtDate(iso: string) {
  try { return new Date(iso).toISOString().slice(0, 16).replace("T", " ") + "Z" }
  catch { return iso }
}
