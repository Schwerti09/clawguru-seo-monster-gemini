"use client"

import { useState, type FormEvent } from "react"

const INVALID_URL_PREVIEW_LIMIT = 3

function filterSafeUrls(lines: string[]) {
  const safe: string[] = []
  const invalid: string[] = []
  for (const line of lines) {
    try {
      const url = new URL(line)
      if (url.protocol === "http:" || url.protocol === "https:") {
        safe.push(line)
      } else {
        invalid.push(line)
      }
    } catch {
      invalid.push(line)
    }
  }
  return { safe, invalid }
}

export default function AffiliateTrackingForm() {
  const [affiliateRef, setAffiliateRef] = useState("")
  const [pixelUrls, setPixelUrls] = useState("")
  const [postbackUrls, setPostbackUrls] = useState("")
  const [secret, setSecret] = useState("")
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    try {
      const pixelLines = pixelUrls.split("\n").map((l) => l.trim()).filter(Boolean)
      const postbackLines = postbackUrls.split("\n").map((l) => l.trim()).filter(Boolean)
      const safePixels = filterSafeUrls(pixelLines)
      const safePostbacks = filterSafeUrls(postbackLines)
      const res = await fetch("/api/affiliate/tracking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(secret ? { "x-affiliate-secret": secret } : {}),
        },
        body: JSON.stringify({
          affiliate_ref: affiliateRef.trim(),
          pixels: safePixels.safe,
          postbacks: safePostbacks.safe,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setStatus(data?.error || "Tracking konnte nicht gespeichert werden.")
      } else {
        const invalidList = [...safePixels.invalid, ...safePostbacks.invalid]
        const invalidCount = invalidList.length
        const invalidPreview =
          invalidCount > 0 ? ` (${invalidList.slice(0, INVALID_URL_PREVIEW_LIMIT).join(", ")})` : ""
        const suffix = invalidCount > 0 ? ` · ${invalidCount} ungültige URLs entfernt${invalidPreview}` : ""
        setStatus(`Gespeichert: ${data?.pixels ?? 0} Pixel · ${data?.postbacks ?? 0} Postbacks${suffix}`)
      }
    } catch {
      setStatus("Tracking konnte nicht gespeichert werden.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="mt-4 grid gap-4 text-sm text-gray-300">
      <div>
        <label className="text-xs uppercase tracking-widest text-gray-500">Affiliate Ref</label>
        <input
          className="mt-2 w-full rounded-2xl border border-gray-800 bg-black/40 px-4 py-3 text-gray-100"
          value={affiliateRef}
          onChange={(e) => setAffiliateRef(e.target.value)}
          placeholder="z.B. hetzner oder pro-affiliate"
          required
        />
      </div>
      <div>
        <label className="text-xs uppercase tracking-widest text-gray-500">Tracking-Pixel URLs (eine pro Zeile)</label>
        <textarea
          className="mt-2 w-full rounded-2xl border border-gray-800 bg-black/40 px-4 py-3 text-gray-100 min-h-[90px]"
          value={pixelUrls}
          onChange={(e) => setPixelUrls(e.target.value)}
          placeholder="https://example.com/pixel?sid={session_id}&amount={amount}"
        />
      </div>
      <div>
        <label className="text-xs uppercase tracking-widest text-gray-500">Postback URLs (Server-to-Server)</label>
        <textarea
          className="mt-2 w-full rounded-2xl border border-gray-800 bg-black/40 px-4 py-3 text-gray-100 min-h-[90px]"
          value={postbackUrls}
          onChange={(e) => setPostbackUrls(e.target.value)}
          placeholder="https://tracker.example.com/postback?sid={session_id}&amount={amount}"
        />
      </div>
      <div>
        <label className="text-xs uppercase tracking-widest text-gray-500">Affiliate Secret (optional)</label>
        <input
          className="mt-2 w-full rounded-2xl border border-gray-800 bg-black/40 px-4 py-3 text-gray-100"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder="AFFILIATE_DASH_SECRET"
          type="password"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="px-5 py-3 rounded-2xl font-black bg-gradient-to-r from-brand-cyan to-brand-violet hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Speichern…" : "Tracking speichern"}
      </button>
      {status ? <div className="text-xs text-gray-400">{status}</div> : null}
      <div className="text-xs text-gray-500">
        Unterstützte Platzhalter: {"{session_id}"} {"{amount}"} {"{currency}"} {"{product}"} {"{email_hash}"}
      </div>
    </form>
  )
}
