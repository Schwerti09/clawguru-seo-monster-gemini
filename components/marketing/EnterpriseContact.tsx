'use client'
import { useState, FormEvent } from "react"

type FormState = "idle" | "loading" | "success" | "error"

export default function EnterpriseContact() {
  const [state, setState] = useState<FormState>("idle")
  const [error, setError] = useState("")

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState("loading")
    setError("")
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
      if (!res.ok) throw new Error("Request failed")
      setState("success")
      form.reset()
    } catch {
      setState("error")
      setError("Beim Senden ist ein Fehler aufgetreten. Bitte versuche es erneut.")
    }
  }

  if (state === "success") {
    return (
      <div className="text-center py-10">
        <div className="text-4xl mb-4">✅</div>
        <div className="text-xl font-black text-white mb-2">Anfrage erhalten!</div>
        <p className="text-gray-400 text-sm">Wir melden uns innerhalb von 24 Stunden bei dir.</p>
      </div>
    )
  }

  const inputClass =
    "w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:ring-1"
  const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,165,0,0.2)",
  }
  const focusRingStyle = { "--tw-ring-color": "rgba(255,165,0,0.4)" } as React.CSSProperties

  return (
    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
      <div>
        <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-1" htmlFor="ent-name">
          Name *
        </label>
        <input
          id="ent-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Max Mustermann"
          className={inputClass}
          style={{ ...inputStyle, ...focusRingStyle }}
        />
      </div>
      <div>
        <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-1" htmlFor="ent-email">
          E-Mail *
        </label>
        <input
          id="ent-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="max@unternehmen.de"
          className={inputClass}
          style={{ ...inputStyle, ...focusRingStyle }}
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-1" htmlFor="ent-company">
          Unternehmen
        </label>
        <input
          id="ent-company"
          name="company"
          type="text"
          autoComplete="organization"
          placeholder="Acme GmbH"
          className={inputClass}
          style={{ ...inputStyle, ...focusRingStyle }}
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-1" htmlFor="ent-message">
          Nachricht
        </label>
        <textarea
          id="ent-message"
          name="message"
          rows={4}
          placeholder="Kurz beschreiben: Teamgröße, Use Case, was ihr braucht …"
          className={`${inputClass} resize-none`}
          style={{ ...inputStyle, ...focusRingStyle }}
        />
      </div>
      {state === "error" && (
        <div className="md:col-span-2 text-sm text-red-400">{error}</div>
      )}
      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={state === "loading"}
          className="w-full py-3 px-6 rounded-2xl font-black text-sm text-black transition-all duration-300 hover:opacity-90 disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #ffa500 0%, #ff6b00 100%)", boxShadow: "0 0 30px rgba(255,165,0,0.3)" }}
        >
          {state === "loading" ? "Wird gesendet …" : "Sales kontaktieren →"}
        </button>
        <p className="mt-2 text-center text-xs text-gray-500">
          Kein Spam · Wir antworten innerhalb von 24 Stunden
        </p>
      </div>
    </form>
  )
}
