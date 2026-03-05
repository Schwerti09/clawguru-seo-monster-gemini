"use client"

import { useState, type FormEvent } from "react"

const C = {
  green: "#00ff9d",
  cyan: "#00b8ff",
  border: "rgba(255,255,255,0.07)",
  card: "rgba(255,255,255,0.03)",
}

type Status = "idle" | "sending" | "success" | "error"

export default function EnterpriseContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState("")

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus("sending")
    setErrorMsg("")
    try {
      const res = await fetch("/api/enterprise-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, message }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error ?? "Unbekannter Fehler.")
        setStatus("error")
      } else {
        setStatus("success")
      }
    } catch (err) {
      console.error("[enterprise-contact] Netzwerkfehler:", err)
      setErrorMsg("Netzwerkfehler. Bitte versuche es erneut.")
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div
        className="rounded-2xl p-6 text-center"
        style={{ background: "rgba(0,255,157,0.05)", border: "1px solid rgba(0,255,157,0.2)" }}
      >
        <div className="text-3xl mb-2">✅</div>
        <div className="font-black text-white text-base mb-1">Anfrage eingegangen!</div>
        <p className="text-sm text-gray-400">Wir melden uns schnellstmöglich bei dir.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-left">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-400 mb-1" htmlFor="ent-name">
            Name *
          </label>
          <input
            id="ent-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Max Mustermann"
            className="w-full rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:ring-1 focus:ring-sky-500"
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
            }}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1" htmlFor="ent-company">
            Firma
          </label>
          <input
            id="ent-company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Acme GmbH"
            className="w-full rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:ring-1 focus:ring-sky-500"
            style={{ background: C.card, border: `1px solid ${C.border}` }}
          />
        </div>
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1" htmlFor="ent-email">
          E-Mail *
        </label>
        <input
          id="ent-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="max@acme.de"
          className="w-full rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:ring-1 focus:ring-sky-500"
          style={{ background: C.card, border: `1px solid ${C.border}` }}
        />
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1" htmlFor="ent-message">
          Nachricht
        </label>
        <textarea
          id="ent-message"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Kurz beschreiben, was ihr sucht…"
          className="w-full rounded-xl px-4 py-2.5 text-sm text-white outline-none resize-none focus:ring-1 focus:ring-sky-500"
          style={{ background: C.card, border: `1px solid ${C.border}` }}
        />
      </div>
      {status === "error" && (
        <p className="text-xs text-red-400">{errorMsg}</p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full px-6 py-3 rounded-2xl font-black text-sm text-black transition-all duration-200 hover:opacity-90 disabled:opacity-60"
        style={{ background: `linear-gradient(135deg, ${C.cyan}, ${C.green})` }}
      >
        {status === "sending" ? "Wird gesendet…" : "Direkt anfragen →"}
      </button>
    </form>
  )
}
