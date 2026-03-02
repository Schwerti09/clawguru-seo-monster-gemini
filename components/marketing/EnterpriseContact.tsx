'use client'
import { useState } from "react"

type Status = "idle" | "sending" | "success" | "error"

export default function EnterpriseContact() {
  const [status, setStatus] = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("sending")
    setErrorMsg("")

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
      company: (form.elements.namedItem("company") as HTMLInputElement).value.trim(),
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value.trim(),
    }

    try {
      const res = await fetch("/api/enterprise-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setStatus("success")
        form.reset()
      } else {
        const json = await res.json().catch(() => ({}))
        setErrorMsg((json as { error?: string }).error || "Unbekannter Fehler")
        setStatus("error")
      }
    } catch {
      setErrorMsg("Netzwerkfehler – bitte erneut versuchen.")
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-orange-900/40 bg-black/40 p-6 text-center">
        <div className="text-2xl mb-2">✅</div>
        <div className="font-black text-white text-lg">Anfrage gesendet!</div>
        <p className="mt-2 text-sm text-gray-400">
          Wir melden uns innerhalb von 1–2 Werktagen bei dir.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="ec-name" className="block text-xs font-mono uppercase tracking-[0.15em] text-orange-400 mb-1">
            Name *
          </label>
          <input
            id="ec-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className="w-full rounded-xl border border-orange-900/40 bg-black/40 px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/60"
            placeholder="Max Mustermann"
          />
        </div>
        <div>
          <label htmlFor="ec-email" className="block text-xs font-mono uppercase tracking-[0.15em] text-orange-400 mb-1">
            E-Mail *
          </label>
          <input
            id="ec-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-xl border border-orange-900/40 bg-black/40 px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/60"
            placeholder="max@firma.de"
          />
        </div>
      </div>
      <div>
        <label htmlFor="ec-company" className="block text-xs font-mono uppercase tracking-[0.15em] text-orange-400 mb-1">
          Unternehmen
        </label>
        <input
          id="ec-company"
          name="company"
          type="text"
          autoComplete="organization"
          className="w-full rounded-xl border border-orange-900/40 bg-black/40 px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/60"
          placeholder="Acme GmbH"
        />
      </div>
      <div>
        <label htmlFor="ec-message" className="block text-xs font-mono uppercase tracking-[0.15em] text-orange-400 mb-1">
          Nachricht
        </label>
        <textarea
          id="ec-message"
          name="message"
          rows={4}
          className="w-full rounded-xl border border-orange-900/40 bg-black/40 px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/60 resize-none"
          placeholder="Wie kann ClawGuru Enterprise euch helfen?"
        />
      </div>
      {status === "error" && (
        <p className="text-sm text-red-400">{errorMsg || "Fehler beim Senden – bitte erneut versuchen."}</p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full py-3 px-6 rounded-2xl font-black text-sm text-black transition-all duration-300 hover:opacity-90 disabled:opacity-60"
        style={{ background: "linear-gradient(135deg, #ffaa00 0%, #ff5000 100%)", boxShadow: "0 0 30px rgba(255,165,0,0.3)" }}
      >
        {status === "sending" ? "Wird gesendet…" : "Anfrage senden →"}
      </button>
    </form>
  )
}
