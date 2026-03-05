"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Container from "@/components/shared/Container"

export default function LoginPage({ error }: { error?: string | null }) {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(error ?? null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErr(null)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || "Login fehlgeschlagen.")
      }
      router.push("/")
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Login fehlgeschlagen.")
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
          Benutzername und Passwort eingeben.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {err && (
            <div className="p-3 rounded-xl border border-red-800 bg-red-900/20 text-red-400 text-sm">
              {err}
            </div>
          )}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Benutzername"
            required
            autoComplete="username"
            className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-black/50 text-white
                       placeholder-gray-500 focus:outline-none focus:border-[#c9a84c] transition-colors"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passwort"
            required
            autoComplete="current-password"
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
            {loading ? "Wird angemeldet…" : "Einloggen →"}
          </button>
        </form>
      </div>
    </Container>
  )
}
