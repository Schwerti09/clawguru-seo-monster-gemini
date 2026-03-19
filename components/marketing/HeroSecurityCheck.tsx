"use client"

import { useMemo, useState } from "react"
import { performSecurityCheck, type SecurityCheckResult } from "@/lib/security-check"
import CTAButton from "@/components/marketing/CTAButton"
import BuyButton from "@/components/commerce/BuyButton"
import { SERVICE } from "@/lib/constants"
import dynamic from "next/dynamic"
import { useI18n } from "@/components/i18n/I18nProvider"
import Image from "next/image"

// WORLD BEAST FINAL LAUNCH: lazy-load upsell modal
const UpsellModal = dynamic(() => import("@/components/onboarding/UpsellModal"), { ssr: false })

function scoreLabel(score: number) {
  if (score >= 90) return "EXZELLENT"
  if (score >= 75) return "SOLIDE"
  if (score >= 60) return "ANGREIFBAR"
  return "KRITISCH"
}

function scoreHint(score: number) {
  if (score >= 90) return "Gute Baseline. Jetzt Monitoring & Rotation automatisieren."
  if (score >= 75) return "Nicht schlecht. Ein paar Defaults können dich trotzdem grillen."
  if (score >= 60) return "Hier reicht ein dummer Zufall. Hardening jetzt."
  return "Stop. Rotieren. Schließen. Stabilisieren."
}

export default function HeroSecurityCheck() {
  const { locale } = useI18n()
  const prefix = `/${locale}`
  const isGerman = locale === "de"
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SecurityCheckResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  // WORLD BEAST FINAL LAUNCH: upsell modal state
  const [showUpsell, setShowUpsell] = useState(false)

  const shareUrl = useMemo(() => {
    if (!result) return ""
    const params = new URLSearchParams({
      target: result.target,
      score: String(result.score),
      vulnerable: result.vulnerable ? "1" : "0"
    })
    return `${prefix}/score?${params.toString()}`
  }, [result, prefix])

  const badgeUrl = useMemo(() => {
    if (!result) return ""
    const params = new URLSearchParams({
      target: result.target,
      score: String(result.score),
      vulnerable: result.vulnerable ? "1" : "0"
    })
    return `/api/score-badge?${params.toString()}`
  }, [result])

  async function handleCheck() {
    if (!input.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await performSecurityCheck(input.trim())
      setResult(res)
      if (typeof window !== "undefined") {
        const current = parseInt(localStorage.getItem("cg_check_count") ?? "0", 10)
        const next = current + 1
        localStorage.setItem("cg_check_count", String(next))
        if (next >= 3) setShowUpsell(true)
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : isGerman ? "Prüfung fehlgeschlagen. Bitte versuche es erneut." : "Check failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function copyLink() {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${shareUrl}`)
    } catch {}
  }

  async function nativeShare() {
    if (!shareUrl) return
    const url = `${window.location.origin}${shareUrl}`
    const text = isGerman
      ? `Mein Claw Security Score: ${result?.score}/100 — geprüft via ClawGuru`
      : `My Claw Security Score: ${result?.score}/100 — checked via ClawGuru`
    if (navigator.share) {
      try {
        await navigator.share({ title: "Claw Security Score", text, url })
      } catch {}
    } else {
      await copyLink()
    }
  }

  const copilotPrefill = useMemo(() => {
    if (!result) return ""
    const base = result.vulnerable
      ? isGerman
        ? `Ich glaube meine Instanz ist exposed. Target: ${result.target}. Score: ${result.score}/100. Was sind die nächsten 5 Schritte?`
        : `I think my instance is exposed. Target: ${result.target}. Score: ${result.score}/100. What are the next 5 steps?`
      : isGerman
        ? `Ich will meine Baseline härten. Target: ${result.target}. Score: ${result.score}/100. Gib mir ein Runbook.`
        : `I want to harden my baseline. Target: ${result.target}. Score: ${result.score}/100. Give me a runbook.`
    return `${prefix}/copilot?q=${encodeURIComponent(base)}`
  }, [isGerman, result, prefix])

  return (
    <div className="bg-gradient-to-br from-gray-900/60 to-blue-950/30 border border-gray-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-grow">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black mb-2">
            {isGerman ? "LIVE Security-Check (Heuristik) — 30 Sekunden" : "LIVE Security Check (Heuristic) — 30 Seconds"}
          </h2>
          <p className="text-gray-300 mb-4">
            {isGerman ? (
              <>
                Gib IP/Domain/Bot-URL ein. Du bekommst einen <span className="font-semibold">Claw Security Score</span> + klare nächste Schritte.
              </>
            ) : (
              <>
                Enter an IP/domain/bot URL. You get a <span className="font-semibold">Claw Security Score</span> + clear next steps.
              </>
            )}
          </p>

          <label htmlFor="security-target" className="block text-sm font-medium mb-2 text-gray-200">
            {isGerman ? "Ziel (öffentlich sichtbar): IP, Domain oder URL" : "Target (publicly visible): IP, domain or URL"}
          </label>
          <input
            id="security-target"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCheck()}
            placeholder={isGerman ? "z.B. 203.0.113.10 oder deinbot.example.com" : "e.g. 203.0.113.10 or yourbot.example.com"}
            className="w-full p-4 rounded-2xl bg-black/40 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
          />
        </div>

        <button
          onClick={handleCheck}
          disabled={loading || !input.trim()}
          className="w-full md:w-auto px-8 py-4 rounded-2xl font-black text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:shadow-red-900/30"
        >
          {loading ? (isGerman ? "Prüfe..." : "Checking...") : isGerman ? "KOSTENLOS PRÜFEN" : "CHECK FOR FREE"}
        </button>
      </div>

      {loading ? (
        <div className="mt-6 animate-pulse">
          <div className="h-4 w-40 bg-gray-800 rounded mb-3" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-gray-800 bg-black/30">
              <div className="h-6 w-48 bg-gray-800 rounded mb-3" />
              <div className="h-8 w-32 bg-gray-800 rounded mb-2" />
              <div className="h-4 w-full bg-gray-800 rounded" />
            </div>
            <div className="p-4 rounded-2xl border border-gray-800 bg-black/30">
              <div className="h-6 w-56 bg-gray-800 rounded mb-3" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-800 rounded" />
                <div className="h-4 w-5/6 bg-gray-800 rounded" />
                <div className="h-4 w-2/3 bg-gray-800 rounded" />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="mt-6 p-4 rounded-2xl border border-red-800 bg-red-950/30 text-red-200 flex items-center justify-between gap-3">
          <span>{isGerman ? "Etwas ist schiefgelaufen. Bitte versuche es erneut." : "Something went wrong. Please try again."}</span>
          <button
            onClick={handleCheck}
            className="px-3 py-1.5 rounded-xl border border-red-500/50 hover:border-red-400 text-red-200 hover:text-white transition-colors"
          >
            {isGerman ? "Nochmal" : "Retry"}
          </button>
        </div>
      ) : null}

      {result ? (
        <div className={`mt-6 p-6 rounded-3xl border ${result.vulnerable ? "border-red-800 bg-red-950/30" : "border-green-800 bg-green-950/20"}`}>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-3">
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${result.vulnerable ? "bg-red-900/60 text-red-200" : "bg-green-900/60 text-green-200"}`}>
                  {result.vulnerable ? (isGerman ? "RISIKO ERHÖHT" : "HIGHER RISK") : "BASIC OK"}
                </div>
                <div className="text-sm text-gray-300">
                  Target: <span className="font-mono text-gray-100">{result.target}</span>
                </div>
              </div>

              <div className="text-xl font-bold mb-2">{result.message}</div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-gray-800 bg-black/30">
                  <div className="text-sm text-gray-400 mb-1">Claw Security Score</div>
                  <div className="flex items-end gap-3">
                    <div className="text-5xl font-black">{result.score}</div>
                    <div className="pb-2 text-sm font-bold text-cyan-300">{scoreLabel(result.score)}</div>
                  </div>
                  <div className="mt-2 text-sm text-gray-300">{scoreHint(result.score)}</div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button onClick={nativeShare} className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 font-bold text-white transition-colors">
                      {isGerman ? "Badge teilen" : "Share badge"}
                    </button>
                    <button onClick={copyLink} className="px-4 py-2 rounded-xl border border-gray-700 hover:border-gray-500 font-bold text-gray-200 transition-colors">
                      {isGerman ? "Link kopieren" : "Copy link"}
                    </button>
                    <a href={copilotPrefill} className="px-4 py-2 rounded-xl border border-gray-700 hover:border-gray-500 font-bold text-gray-200 transition-colors">
                      {isGerman ? "Copilot fragen →" : "Ask Copilot →"}
                    </a>
                  </div>

                  <div className="mt-4 text-xs text-gray-500">
                    {result.disclaimer}
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-gray-800 bg-black/30">
                  <div className="text-sm text-gray-400 mb-2">{isGerman ? "Deine Top-Nächsten Schritte" : "Your top next steps"}</div>
                  <ul className="space-y-2 text-sm">
                    {result.recommendations.slice(0, 4).map((x) => (
                      <li key={x} className="flex items-start gap-2">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span className="text-gray-200">{x}</span>
                      </li>
                    ))}
                  </ul>

                  {result.vulnerable ? (
                    <div className="mt-5 p-4 rounded-2xl border border-cyan-900 bg-gradient-to-br from-cyan-950/30 to-blue-950/20">
                      <div className="text-sm text-cyan-200 font-bold mb-2">{isGerman ? "Sofort raus aus dem Risiko?" : "Want out of the risk immediately?"}</div>
                      <div className="text-gray-200 mb-3">
                        {isGerman ? "Überwacht, gepatcht, gewartet:" : "Monitored, patched, maintained:"} <span className="font-semibold">{SERVICE.managedName}</span> {isGerman ? "ab" : "from"}{" "}
                        <span className="font-bold">{SERVICE.managedFromPrice}</span>.
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <CTAButton href={SERVICE.managedHref} label={isGerman ? "Managed Service starten" : "Start managed service"} variant="primary" size="md" />
                        <BuyButton product="daypass" label={isGerman ? "Day Pass (24h Zugriff)" : "Day Pass (24h access)"} className="px-5 py-3 rounded-2xl font-black bg-gradient-to-r from-orange-500 to-red-600 hover:opacity-90" />
                        <CTAButton href={`${prefix}/pricing`} label={isGerman ? "Pro/Team ansehen" : "See Pro/Team"} variant="outline" size="md" />
                      </div>
                    </div>
                  ) : (
                    <div className="mt-5 p-4 rounded-2xl border border-gray-800 bg-black/20">
                      <div className="text-sm font-bold text-gray-100 mb-2">{isGerman ? "Upgrade auf „solide“ in 30 Minuten" : "Upgrade to “solid” in 30 minutes"}</div>
                      <div className="text-gray-300 mb-3">{isGerman ? "Nimm den Academy-Sprint und bring deine Defaults auf „safe by default“." : "Take the Academy sprint and bring your defaults to “safe by default”."}</div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <CTAButton href={`${prefix}/dashboard`} label={isGerman ? "Dashboard öffnen" : "Open dashboard"} variant="primary" size="md" />
                        
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:w-[240px]">
              <div className="text-sm text-gray-400 mb-2">{isGerman ? "Share-Badge Preview" : "Share badge preview"}</div>
              <div className="rounded-2xl overflow-hidden border border-gray-800 bg-black/30">
                <div className="relative w-full aspect-[16/9]">
                  <Image
                    src={badgeUrl || "/api/score-badge?target=example&score=0&vulnerable=0"}
                    alt="Claw Security Score Badge"
                    fill
                    sizes="(max-width: 1024px) 100vw, 240px"
                    placeholder="empty"
                  />
                </div>
              </div>
              <a
                className="mt-3 inline-flex text-sm text-cyan-300 hover:text-cyan-200 underline"
                href={badgeUrl}
                download
              >
                {isGerman ? "SVG herunterladen" : "Download SVG"}
              </a>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
          {isGerman ? "keine Speicherung von Targets" : "no storage of targets"}
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
          {isGerman ? "Score ist heuristisch" : "score is heuristic"}
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-purple-500" />
          {isGerman ? "Für echte Aussagen: Config/Logs checken" : "For real conclusions: check config/logs"}
        </div>
      </div>

      {/* WORLD BEAST FINAL LAUNCH: Upsell modal after 3 checks */}
      {showUpsell && (
        <UpsellModal score={result?.score} />
      )}
    </div>
  )
}
