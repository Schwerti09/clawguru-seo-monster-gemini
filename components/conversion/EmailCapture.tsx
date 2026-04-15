"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, CheckCircle, Shield, ArrowRight } from "lucide-react"
import { trackEvent } from "@/lib/analytics"

type EmailCaptureDict = {
  headline: string
  subtext: string
  placeholder: string
  cta: string
  consent: string
  privacy_link: string
  success_title: string
  success_text: string
  error_invalid: string
  error_generic: string
}

const DE: EmailCaptureDict = {
  headline: "Wöchentlicher Security-Report",
  subtext: "Kritische CVEs, Fix-Anleitungen und Hardening-Tipps — kostenlos, jede Woche.",
  placeholder: "deine@email.de",
  cta: "Anmelden",
  consent: "Ich stimme dem Erhalt des wöchentlichen Security-Newsletters zu. Jederzeit abbestellbar.",
  privacy_link: "Datenschutz",
  success_title: "Angemeldet!",
  success_text: "Du erhältst den nächsten Security-Report direkt in dein Postfach.",
  error_invalid: "Bitte gib eine gültige E-Mail-Adresse ein.",
  error_generic: "Etwas ist schiefgelaufen. Bitte versuche es erneut.",
}

const EN: EmailCaptureDict = {
  headline: "Weekly Security Report",
  subtext: "Critical CVEs, fix guides, and hardening tips — free, every week.",
  placeholder: "your@email.com",
  cta: "Subscribe",
  consent: "I agree to receive the weekly security newsletter. Unsubscribe anytime.",
  privacy_link: "Privacy",
  success_title: "Subscribed!",
  success_text: "You'll receive the next security report in your inbox.",
  error_invalid: "Please enter a valid email address.",
  error_generic: "Something went wrong. Please try again.",
}

type Props = {
  locale: string
  source?: string
  variant?: "inline" | "card"
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function EmailCapture({ locale, source = "website", variant = "card" }: Props) {
  const t = locale === "de" ? DE : EN
  const prefix = `/${locale}`
  const [email, setEmail] = useState("")
  const [consent, setConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = useCallback(async () => {
    setError(null)
    if (!EMAIL_RE.test(email.trim())) {
      setError(t.error_invalid)
      return
    }
    if (!consent) {
      setError(locale === "de" ? "Bitte bestätige die Einwilligung." : "Please confirm your consent.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), source, locale }),
      })
      const data = (await res.json()) as { ok?: boolean; error?: string }
      if (res.ok && data.ok) {
        setSuccess(true)
        trackEvent("email_capture_success", { locale, source })
      } else {
        setError(t.error_generic)
        trackEvent("email_capture_error", { locale, source, error: data.error ?? "unknown" })
      }
    } catch {
      setError(t.error_generic)
    } finally {
      setLoading(false)
    }
  }, [email, consent, locale, source, t])

  if (variant === "inline") {
    return (
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div key="ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-sm text-emerald-400">
            <CheckCircle className="h-4 w-4" />
            {t.success_text}
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder={t.placeholder}
                disabled={loading}
                className="flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-cyan-500/50 focus:outline-none"
              />
              <button
                onClick={submit}
                disabled={loading}
                className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-bold text-white hover:bg-cyan-700 disabled:opacity-50 transition-colors"
              >
                {loading ? "…" : t.cta}
              </button>
            </div>
            <label className="flex items-start gap-2 text-[11px] text-gray-500 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 rounded border-gray-600 bg-black/30"
              />
              <span>{t.consent}{" "}
                <a href={`${prefix}/datenschutz`} className="text-cyan-400/80 underline">{t.privacy_link}</a>
              </span>
            </label>
            {error && <p className="text-xs text-red-400">{error}</p>}
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  // Card variant (default)
  return (
    <AnimatePresence mode="wait">
      {success ? (
        <motion.div
          key="ok"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-emerald-800/50 p-6 text-center"
          style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(10,10,10,0.95) 100%)" }}
        >
          <CheckCircle className="h-8 w-8 mx-auto mb-3 text-emerald-400" />
          <p className="text-lg font-bold text-white mb-1">{t.success_title}</p>
          <p className="text-sm text-gray-400">{t.success_text}</p>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-cyan-900/40 p-6"
          style={{
            background: "linear-gradient(135deg, rgba(34,211,238,0.04) 0%, rgba(10,10,10,0.96) 100%)",
            boxShadow: "0 0 40px rgba(34,211,238,0.03)",
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-800/40 bg-cyan-950/30">
              <Mail className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">{t.headline}</p>
              <p className="text-xs text-gray-400">{t.subtext}</p>
            </div>
          </div>

          <div className="flex gap-2 mb-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder={t.placeholder}
              disabled={loading}
              className="flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
            />
            <button
              onClick={submit}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 px-5 py-3 text-sm font-bold text-black disabled:opacity-50 shadow-lg shadow-cyan-500/15 transition hover:opacity-90"
            >
              {loading ? "…" : t.cta}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </div>

          <label className="flex items-start gap-2 text-[11px] text-gray-500 cursor-pointer mb-2">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 rounded border-gray-600 bg-black/30 accent-cyan-500"
            />
            <span>
              {t.consent}{" "}
              <a href={`${prefix}/datenschutz`} className="text-cyan-400/80 hover:text-cyan-300 underline underline-offset-2">{t.privacy_link}</a>
            </span>
          </label>

          {error && <p className="text-xs text-red-400 mt-1">{error}</p>}

          <div className="mt-3 flex items-center gap-3 text-[10px] text-gray-600">
            <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> DSGVO-konform</span>
            <span>·</span>
            <span>{locale === "de" ? "Kein Spam, kein Tracking" : "No spam, no tracking"}</span>
            <span>·</span>
            <span>{locale === "de" ? "Jederzeit abbestellbar" : "Unsubscribe anytime"}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
