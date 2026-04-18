"use client"

import { useCallback, useMemo, useState, useTransition } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Loader2 } from "lucide-react"
import { roastMyStackAction, type RoastStackResult } from "@/app/actions/roast-stack"
import type { Locale } from "@/lib/i18n"
import { RoastShareCard, type RoastShareDict } from "./RoastShareCard"
import type { RoastLevel } from "@/lib/roast/prompt"

export type RoastUiDict = RoastShareDict & {
  kicker: string
  title: string
  subtitle: string
  placeholder: string
  level_mild: string
  level_medium: string
  level_spicy: string
  cta: string
  loading: string
  disclosure: string
  weaknesses: string
  fixes: string
  error_empty_input: string
  error_input_too_long: string
  error_invalid_level: string
  error_ai_unavailable: string
  error_parse: string
  error_rate_limited: string
  page_link: string
}

const EN_FALLBACK: RoastUiDict = {
  kicker: "Viral · AI · Shareable",
  title: "Roast My Stack",
  subtitle:
    "Drop your tech stack or a domain. Get a savage-but-useful security roast — then ship fixes with ClawGuru runbooks.",
  placeholder: "Kubernetes + Nginx + AWS + Terraform + Postgres — or app.example.com",
  level_mild: "Mild",
  level_medium: "Medium",
  level_spicy: "Spicy",
  cta: "Roast me",
  loading: "Summoning the Roast Master…",
  disclosure:
    "AI-generated orientation, not a penetration test. Threat model and verify everything in your own environment.",
  score_label: "Claw Score",
  score_hint: "Narrative posture score for this roast — still verify in prod.",
  top_roasts: "Top 3 roasts",
  weaknesses: "Weak spots",
  fixes: "What to do next",
  fix_cta: "Fix with ClawGuru",
  share_x: "Share on X",
  share_li: "LinkedIn",
  share_wa: "WhatsApp",
  share_tg: "Telegram",
  share_mail: "Email",
  copy_link: "Copy link",
  copied: "Copied!",
  challenge_title: "Challenge a Friend",
  challenge_desc: "Think your stack is more secure? Send the roast to a colleague.",
  challenge_cta: "Send Challenge",
  error_empty_input: "Enter a stack or domain first.",
  error_input_too_long: "Keep it under 400 characters.",
  error_invalid_level: "Pick a roast level.",
  error_ai_unavailable: "AI is offline. Configure GEMINI_API_KEY (or your AI_PROVIDER_ORDER chain).",
  error_parse: "The model returned junk. Try again with a shorter description.",
  error_rate_limited: "Too many roasts from this connection. Wait a few minutes and try again.",
  page_link: "Open full-page roast (shareable URL)",
}

function mergeDict(raw?: Partial<Record<string, string>>): RoastUiDict {
  return { ...EN_FALLBACK, ...(raw as Partial<RoastUiDict>) }
}

function scoreColor(score: number): string {
  if (score >= 70) return "#22d3ee"
  if (score >= 40) return "#eab308"
  return "#f87171"
}

type Props = {
  locale: Locale
  prefix: string
  dict?: Partial<Record<string, string>>
  variant?: "full" | "compact"
  /** Target page path for dedicated roast page links and share URL. */
  pagePath?: "/roast-my-stack" | "/roast-my-moltbot"
  /** When false, hides the link to `/[lang]/roast-my-stack` (e.g. on that page). */
  showDedicatedPageLink?: boolean
  /** When false, hides kicker/title/subtitle (use page-level H1). */
  showTitleBlock?: boolean
}

function RoastMyStack({
  locale,
  prefix,
  dict: dictProp,
  variant = "full",
  pagePath = "/roast-my-stack",
  showDedicatedPageLink = true,
  showTitleBlock = true,
}: Props) {
  const t = useMemo(() => mergeDict(dictProp), [dictProp])
  const [input, setInput] = useState("")
  const [level, setLevel] = useState<RoastLevel>("medium")
  const [pending, startTransition] = useTransition()
  const [result, setResult] = useState<RoastStackResult | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const shareBase =
    typeof window !== "undefined"
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "")
  const shareUrl = `${shareBase}${prefix || ""}${pagePath}`

  const onCopy = useCallback(async () => {
    const text = `ClawGuru Roast · ${t.score_label} ${result?.score ?? ""}/100\n${result?.top_roasts?.[0] ?? ""}\n${shareUrl}`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }, [result, shareUrl, t.score_label])

  const run = () => {
    setErr(null)
    setResult(null)
    startTransition(async () => {
      const res = await roastMyStackAction({ input, roastLevel: level, locale })
      if (!res.ok) {
        const map: Record<string, string> = {
          empty_input: t.error_empty_input,
          input_too_long: t.error_input_too_long,
          invalid_level: t.error_invalid_level,
          ai_unavailable: t.error_ai_unavailable,
          parse_error: t.error_parse,
          rate_limited: t.error_rate_limited,
        }
        setErr(map[res.error] ?? t.error_parse)
        return
      }
      setResult(res.data)
    })
  }

  const compact = variant === "compact"

  return (
    <div className={compact ? "" : "relative overflow-hidden"}>
      {!compact && (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.12) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
          aria-hidden
        />
      )}

      <div className={compact ? "" : "relative"}>
        {showTitleBlock && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={compact ? "" : "text-center mb-10"}
          >
            <p
              className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400/90 mb-2"
              style={{ letterSpacing: "0.2em" }}
            >
              {t.kicker}
            </p>
            <h2
              className={`font-black text-white ${compact ? "text-xl sm:text-2xl" : "text-3xl sm:text-4xl"} tracking-tight`}
            >
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-cyan-300 bg-clip-text text-transparent">
                {t.title}
              </span>
            </h2>
            {!compact && <p className="mt-3 text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base">{t.subtitle}</p>}
            {!compact && showDedicatedPageLink && (
              <p className="mt-4">
                <Link
                  href={`${prefix}${pagePath}`}
                  className="text-sm font-medium text-cyan-400/90 underline-offset-4 hover:text-cyan-300 hover:underline"
                >
                  {t.page_link}
                </Link>
              </p>
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className={`rounded-2xl border border-white/10 p-4 sm:p-6 ${compact ? "" : "backdrop-blur-md"}`}
          style={{
            background: compact
              ? "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)"
              : "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.2) 100%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          <label className="block text-sm font-medium text-zinc-300 mb-2 sr-only" htmlFor="roast-stack-input">
            {t.placeholder}
          </label>
          <textarea
            id="roast-stack-input"
            rows={compact ? 2 : 3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.placeholder}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 resize-y min-h-[88px]"
            disabled={pending}
          />

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2" role="group" aria-label={t.title}>
              {(
                [
                  ["mild", t.level_mild],
                  ["medium", t.level_medium],
                  ["spicy", t.level_spicy],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setLevel(id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                    level === id
                      ? "bg-amber-500/20 text-amber-200 border border-amber-500/40"
                      : "bg-white/5 text-zinc-400 border border-white/10 hover:border-white/20"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={run}
              disabled={pending}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 px-6 py-3 text-sm font-bold text-black disabled:opacity-50 shadow-lg shadow-cyan-500/20"
            >
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {pending ? t.loading : t.cta}
            </button>
          </div>

          {err && (
            <p className="mt-4 text-sm text-red-400" role="alert">
              {err}
            </p>
          )}

          <p className="mt-4 text-xs text-zinc-500">{t.disclosure}</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {result && (
            <motion.div key="out" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-8 space-y-8">
              <RoastShareCard
                result={result}
                dict={t}
                prefix={prefix}
                shareUrl={shareUrl}
                onCopy={onCopy}
                copied={copied}
              />

              {/* CONVERSION BLOCK - Directly below score, before detailed breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl border border-white/10 bg-gray-900 p-6"
              >
                {/* Score prominently displayed */}
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 text-2xl font-black tabular-nums"
                    style={{
                      borderColor: `${scoreColor(result.score)}55`,
                      color: scoreColor(result.score),
                      background: "rgba(0,0,0,0.35)",
                      boxShadow: `0 0 24px ${scoreColor(result.score)}22`
                    }}
                  >
                    {result.score}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">
                      {locale === 'de' ? `Dein Score: ${result.score}/100` : `Your Score: ${result.score}/100`}
                    </p>
                    <p className="text-sm text-zinc-400">
                      {locale === 'de' ? 'Claw Score für diesen Roast' : 'Claw Score for this roast'}
                    </p>
                  </div>
                </div>

                {/* Top 3 critical issues */}
                <div className="mb-6 rounded-xl border border-red-900/50 bg-red-900/10 p-4">
                  <h3 className="mb-3 text-sm font-semibold text-red-300">
                    {locale === 'de' ? 'Top 3 kritische Lücken:' : 'Top 3 Critical Issues:'}
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    {result.weaknesses.slice(0, 3).map((w, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-red-400">▸</span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Social proof bar */}
                <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 px-4 py-3">
                  <p className="text-xs text-gray-400">
                    ✅ {locale === 'de' ? '3.847 Security Checks diesen Monat' : '3,847 security checks this month'}  •  {locale === 'de' ? '30-Tage-Refund ohne Fragen' : '30-day refund, no questions'}  •  {locale === 'de' ? 'Sofortiger Zugriff' : 'Instant access'}
                  </p>
                </div>

                {/* Primary CTA button */}
                <a
                  href="/api/stripe/checkout?plan=daypass"
                  className="block w-full rounded-xl bg-gradient-to-r from-cyan-700 to-cyan-600 px-6 py-4 text-center font-bold text-white transition hover:from-cyan-600 hover:to-cyan-500"
                >
                  {locale === 'de' ? 'Fix meine kritischen Lücken — Daypass €9 / 24h' : 'Fix my critical gaps — Daypass €9 / 24h'}
                </a>

                {/* Secondary text below button */}
                <p className="mt-3 text-center text-sm text-gray-400">
                  {locale === 'de' ? (
                    <>
                      Oder: <Link href={`${prefix}/pricing`} className="text-cyan-400 hover:underline">Pro-Abo ab €49/Monat</Link> — unlimitierte Runbooks + API-Zugriff
                    </>
                  ) : (
                    <>
                      Or: <Link href={`${prefix}/pricing`} className="text-cyan-400 hover:underline">Pro subscription from €49/month</Link> — unlimited runbooks + API access
                    </>
                  )}
                </p>
              </motion.div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-black/30 p-5">
                  <h3 className="text-sm font-semibold text-amber-200/90 mb-3">{t.weaknesses}</h3>
                  <ul className="space-y-2 text-sm text-zinc-300">
                    {result.weaknesses.map((w, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-red-400/90">▸</span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/30 p-5">
                  <h3 className="text-sm font-semibold text-cyan-200/90 mb-3">{t.fixes}</h3>
                  <ul className="space-y-2 text-sm text-zinc-300">
                    {result.fixes.map((f, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-cyan-400/90">▸</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <article className="prose prose-invert prose-sm max-w-none rounded-xl border border-white/10 bg-black/20 p-6 text-zinc-300">
                <p className="whitespace-pre-wrap leading-relaxed">{result.roast_text}</p>
              </article>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export { RoastMyStack }
export default RoastMyStack
