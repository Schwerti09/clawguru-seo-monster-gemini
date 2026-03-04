"use client"

import { useState } from "react"
import Container from "@/components/shared/Container"

const ERROR_MESSAGES: Record<string, string> = {
  expired_token: "Link abgelaufen? Neuen Magic Link anfordern.",
  invalid_token: "Login-Link ungültig. Bitte neuen Link anfordern.",
  missing_token: "Login-Link fehlt. Bitte neuen Link anfordern.",
}

export default function LoginPage({ error }: { error?: string | null }) {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(
    error ? (ERROR_MESSAGES[error] ?? error) : null
  )
  const isExpired = error === "expired_token"

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErr(null)
    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || "Failed")
      }
      setSent(true)
    } catch (e) {
      setErr(e instanceof Error && e.message !== "Failed"
        ? e.message
        : "Magic Link konnte nicht gesendet werden. Bitte nochmal versuchen."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <div className="py-24 max-w-md mx-auto text-center">
        <div className="text-[10px] font-mono tracking-widest uppercase text-[#c9a84c] mb-4">
          Account
        </div>
        <h1 className="text-3xl font-black mb-2">Login · ClawGuru</h1>
        <p className="text-gray-400 text-sm mb-8">
          E-Mail eingeben – wir schicken dir einen Magic Link.
        </p>

        {sent ? (
          <div className="flex flex-col gap-4">
            <div className="p-6 rounded-2xl border border-green-800 bg-green-900/20 text-green-400">
              ✓ Magic Link gesendet! Prüfe dein Postfach und klick den Link.
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {err && (
                <div className="p-3 rounded-xl border border-red-800 bg-red-900/20 text-red-400 text-sm">
                  {err}
                </div>
              )}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="deine@email.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-black/50 text-white
                           placeholder-gray-500 focus:outline-none focus:border-[#c9a84c] transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 rounded-xl font-mono font-bold text-sm uppercase tracking-widest
                           bg-[#c9a84c]/10 border border-[#c9a84c]/40 text-[#c9a84c]
                           hover:bg-[#c9a84c]/20 transition-all disabled:opacity-50"
              >
                {loading ? "Wird gesendet…" : "Neuen Magic Link anfordern →"}
              </button>
            </form>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {isExpired && (
              <div className="p-4 rounded-xl border border-amber-700 bg-amber-900/20 text-amber-400 text-sm">
                <p className="font-bold mb-2">⏱ Link abgelaufen?</p>
                <p>Kein Problem – fordere hier einen neuen Magic Link an.</p>
              </div>
            )}
            {err && !isExpired && (
              <div className="p-3 rounded-xl border border-red-800 bg-red-900/20 text-red-400 text-sm">
                {err}
              </div>
            )}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="deine@email.com"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-black/50 text-white
                         placeholder-gray-500 focus:outline-none focus:border-[#c9a84c] transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-xl font-mono font-bold text-sm uppercase tracking-widest
                         bg-[#c9a84c]/10 border border-[#c9a84c]/40 text-[#c9a84c]
                         hover:bg-[#c9a84c]/20 transition-all disabled:opacity-50"
            >
              {(() => {
                if (loading) return "Wird gesendet…"
                if (isExpired) return "Neuen Magic Link anfordern →"
                return "Magic Link senden →"
              })()}
            </button>
          </form>
        )}
      </div>
    </Container>
  )
}
