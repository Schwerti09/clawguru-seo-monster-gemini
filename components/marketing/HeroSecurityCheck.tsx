"use client"

import { useMemo, useState } from "react"
import { performSecurityCheck, type SecurityCheckResult } from "@/lib/security-check"
import CTAButton from "@/components/marketing/CTAButton"
import BuyButton from "@/components/commerce/BuyButton"
import { ClawguruAvatar } from "@/components/ui/ClawguruAvatar"
import { SecurityCheckShareCard } from "@/components/marketing/SecurityCheckShareCard"
import dynamic from "next/dynamic"
import { useI18n } from "@/components/i18n/I18nProvider"
import Image from "next/image"
import { trackEvent } from "@/lib/analytics"

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

function classifyTarget(input: string): "ip" | "domain" | "url" | "other" {
  const v = input.trim().toLowerCase()
  if (/^\d{1,3}(\.\d{1,3}){3}(\/\d{1,2})?$/.test(v)) return "ip"
  if (/^https?:\/\//.test(v)) return "url"
  if (/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9-]+)+$/.test(v)) return "domain"
  return "other"
}

export default function HeroSecurityCheck({ dict = {} }: { dict?: Record<string, string> }) {
  const { locale } = useI18n()
  const prefix = `/${locale}`
  const isGerman = locale === "de"
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SecurityCheckResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [badgeCopied, setBadgeCopied] = useState(false)
  // WORLD BEAST FINAL LAUNCH: upsell modal state
  const [showUpsell, setShowUpsell] = useState(false)
  const ctaLabel = isGerman ? "JETZT KOSTENLOS ANALYSIEREN" : "ANALYZE FOR FREE NOW"

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

  const improveTitle = useMemo(() => {
    if (!result) return ""
    if (result.score >= 90) return isGerman ? "Exzellent – jetzt Monitoring & Rotation" : "Excellent – add monitoring & rotation"
    if (result.score >= 75) return isGerman ? "Auf „exzellent“ in 30 Minuten" : "Upgrade to “excellent” in 30 minutes"
    return isGerman ? "Verbessern in 30 Minuten" : "Improve in 30 minutes"
  }, [result, isGerman])

  const improveText = useMemo(() => {
    if (!result) return ""
    if (result.score >= 90) return isGerman ? "Bleib exzellent: Automatisiere Rotation, Alerts & Baselines." : "Stay excellent: automate rotation, alerts & baselines."
    if (result.score >= 75) return isGerman ? "Nimm den Academy‑Sprint und geh auf „safe by default“." : "Take the Academy sprint and go “safe by default”."
    return isGerman ? "Jetzt schnell härten und Defaults sicher machen." : "Harden quickly and make defaults safe."
  }, [result, isGerman])

  async function handleCheck() {
    if (!input.trim()) return
    const targetType = classifyTarget(input)
    trackEvent("check_start", { locale, target_type: targetType })
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await performSecurityCheck(input.trim())
      setResult(res)
      trackEvent("check_result", {
        locale,
        score: res.score,
        vulnerable: res.vulnerable,
        target_type: targetType,
      })
      if (typeof window !== "undefined") {
        const current = parseInt(localStorage.getItem("cg_check_count") ?? "0", 10)
        const next = current + 1
        localStorage.setItem("cg_check_count", String(next))
        if (next >= 3) setShowUpsell(true)
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : isGerman ? "Prüfung fehlgeschlagen. Bitte versuche es erneut." : "Check failed. Please try again.")
      trackEvent("check_error", {
        locale,
        target_type: targetType,
      })
    } finally {
      setLoading(false)
    }
  }

  async function copyLink() {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${shareUrl}`)
      trackEvent("share_click", { locale, method: "copy_link", score: result?.score ?? null })
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
        trackEvent("share_click", { locale, method: "native_share", score: result?.score ?? null })
      } catch {}
    } else {
      await copyLink()
    }
  }

  async function copyBadgeEmbedSnippet() {
    if (!result || !shareUrl || !badgeUrl || typeof window === "undefined") return
    const fullShareUrl = `${window.location.origin}${shareUrl}`
    const fullBadgeUrl = `${window.location.origin}${badgeUrl}`
    const html = `<a href="${fullShareUrl}?utm_source=community-launch&utm_medium=badge&utm_campaign=secured-by-clawguru" class="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-cyan-200"><img src="${fullBadgeUrl}" alt="Secured by ClawGuru" width="220" height="124" loading="lazy" /></a>`
    try {
      await navigator.clipboard.writeText(html)
      setBadgeCopied(true)
      trackEvent("share_click", { locale, method: "copy_badge_snippet", score: result.score })
      setTimeout(() => setBadgeCopied(false), 1800)
    } catch {
      setBadgeCopied(false)
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
          <div className="flex justify-start md:justify-start mb-2">
            <ClawguruAvatar className="w-12 h-12 md:w-16 md:h-16" />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black mb-2">
            {isGerman
              ? (dict.check_title_de || "LIVE Security-Check (Heuristik) — 30 Sekunden")
              : (dict.check_title_en || "LIVE Security Check (Heuristic) — 30 Seconds")}
          </h2>
          <p className="text-gray-300 mb-4">
            {isGerman ? (
              <>
                {(dict.check_sub_de_prefix || "Gib IP/Domain/Bot-URL ein. Du bekommst einen")}{" "}
                <span className="font-semibold">{dict.check_score_label || "Claw Security Score"}</span>{" "}
                {(dict.check_sub_de_suffix || "+ klare nächste Schritte.")}
              </>
            ) : (
              <>
                {(dict.check_sub_en_prefix || "Enter an IP/domain/bot URL. You get a")}{" "}
                <span className="font-semibold">{dict.check_score_label || "Claw Security Score"}</span>{" "}
                {(dict.check_sub_en_suffix || "+ clear next steps.")}
              </>
            )}
          </p>
          <div className="mb-4 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-cyan-900/50 bg-cyan-950/25 px-2.5 py-1 text-cyan-200">
              {isGerman ? "No-Signup Start" : "No-signup start"}
            </span>
            <span className="rounded-full border border-emerald-900/50 bg-emerald-950/25 px-2.5 py-1 text-emerald-200">
              {isGerman ? "<30 Sek. Analyse" : "<30 sec analysis"}
            </span>
            <span className="rounded-full border border-violet-900/50 bg-violet-950/25 px-2.5 py-1 text-violet-200">
              {isGerman ? "Direkte Fix-Schritte" : "Direct fix steps"}
            </span>
          </div>

          <label htmlFor="security-target" className="block text-sm font-medium mb-2 text-gray-200">
            {isGerman
              ? (dict.check_target_label_de || "Ziel (oeffentlich sichtbar): IP, Domain oder URL")
              : (dict.check_target_label_en || "Target (publicly visible): IP, domain or URL")}
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

        <a
          href={`${prefix}/check`}
          onClick={(e) => { if (!loading && input.trim()) { e.preventDefault(); handleCheck(); } }}
          aria-disabled={loading || !input.trim()}
          className={`w-full md:w-auto px-8 py-4 rounded-2xl font-black text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl hover:shadow-red-900/30 ${loading || !input.trim() ? "opacity-50 pointer-events-none" : ""}`}
        >
          {loading ? (isGerman ? "Pruefe..." : "Checking...") : ctaLabel}
        </a>
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
                  {result.vulnerable
                    ? (isGerman ? (dict.check_risk_high_de || "RISIKO ERHOEHT") : (dict.check_risk_high_en || "HIGHER RISK"))
                    : (isGerman ? (dict.check_risk_ok_de || "BASIS OK") : (dict.check_risk_ok_en || "BASIC OK"))}
                </div>
                <div className="text-sm text-gray-300">
                  {(isGerman ? (dict.check_target_chip_de || "Ziel") : (dict.check_target_chip_en || "Target"))}:{" "}
                  <span className="font-mono text-gray-100">{result.target}</span>
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
                    <a
                      href={copilotPrefill}
                      className="px-4 py-2 rounded-xl font-black text-black transition-all"
                      style={{
                        background: "linear-gradient(135deg, #d4af37 0%, #e8cc6a 50%, #a8872a 100%)",
                        boxShadow: "0 6px 24px rgba(212,175,55,0.22)",
                      }}
                    >
                      {isGerman
                        ? (dict.check_ask_guru_de || "Frag den Guru")
                        : (dict.check_ask_guru_en || "Ask the Guru")} →
                    </a>
                  </div>

                  {/* Viral Share Card */}
                  <div className="mt-6">
                    <SecurityCheckShareCard
                      score={result.score}
                      target={result.target}
                      vulnerable={result.vulnerable}
                      dict={{
                        share_title: isGerman ? "Score teilen" : "Share score",
                        share_x: isGerman ? "Auf X teilen" : "Share on X",
                        share_li: "LinkedIn",
                        share_wa: "WhatsApp",
                        share_tg: "Telegram",
                        share_mail: isGerman ? "E-Mail" : "Email",
                        copy_link: isGerman ? "Link kopieren" : "Copy link",
                        copied: isGerman ? "Kopiert!" : "Copied!",
                      }}
                      shareUrl={`${window.location.origin}${shareUrl}`}
                    />
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
                        {isGerman
                          ? "Pro: dauerhafter Vollzugriff ab 49€/Monat. Day Pass: 24h Vollzugriff für 9€."
                          : "Pro: permanent full access from €49/month. Day Pass: 24h full access for €9."}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <BuyButton
                          product="pro"
                          label={isGerman ? "Pro 49 € / Monat" : "Pro €49 / month"}
                          className="px-5 py-3 rounded-2xl font-black bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90"
                          analyticsSource="check_vulnerable_card"
                        />
                        <BuyButton
                          product="daypass"
                          label={isGerman ? "Day Pass (9€ / 24h)" : "Day Pass (€9 / 24h)"}
                          className="px-5 py-3 rounded-2xl font-black bg-gradient-to-r from-orange-500 to-red-600 hover:opacity-90"
                          analyticsSource="check_vulnerable_card"
                        />
                        <CTAButton
                          href={`${prefix}/pricing`}
                          label={isGerman ? "Alle Pläne" : "All plans"}
                          variant="outline"
                          size="md"
                          onClick={() => trackEvent("pricing_click", { locale, source: "check_vulnerable_card" })}
                        />
                      </div>
                    </div>
                  ) : result.score < 70 ? (
                    <div className="mt-5 p-4 rounded-2xl border border-amber-800/60 bg-gradient-to-br from-amber-950/30 to-orange-950/20">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-amber-400 text-lg">⚠️</span>
                        <div className="text-sm text-amber-200 font-bold">
                          {isGerman
                            ? `Score ${result.score}/100 — da geht mehr.`
                            : `Score ${result.score}/100 — there's room to improve.`}
                        </div>
                      </div>
                      <div className="text-sm text-gray-300 mb-3">
                        {isGerman
                          ? "Mit Pro bekommst du: Continuous Monitoring, automatische Alerts bei Score-Verschlechterung, Full Remediation Reports, personalisierte Runbooks und Copilot AI."
                          : "With Pro you get: continuous monitoring, automatic alerts on score drops, full remediation reports, personalized runbooks and Copilot AI."}
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                        <div className="flex items-center gap-1.5 text-amber-200/80">
                          <span className="text-amber-400">✓</span> {isGerman ? "Monitoring & Alerts" : "Monitoring & alerts"}
                        </div>
                        <div className="flex items-center gap-1.5 text-amber-200/80">
                          <span className="text-amber-400">✓</span> {isGerman ? "Full Reports" : "Full reports"}
                        </div>
                        <div className="flex items-center gap-1.5 text-amber-200/80">
                          <span className="text-amber-400">✓</span> {isGerman ? "Copilot AI unbegrenzt" : "Copilot AI unlimited"}
                        </div>
                        <div className="flex items-center gap-1.5 text-amber-200/80">
                          <span className="text-amber-400">✓</span> {isGerman ? "Personalisierte Runbooks" : "Personalized runbooks"}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <BuyButton
                          product="pro"
                          label={isGerman ? "Pro starten (49€/Mo)" : "Start Pro (€49/mo)"}
                          className="px-5 py-3 rounded-2xl font-black text-black"
                          style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", boxShadow: "0 0 20px rgba(245,158,11,0.25)" }}
                          analyticsSource="check_score_below_70"
                        />
                        <BuyButton
                          product="daypass"
                          label={isGerman ? "Erst testen: Day Pass 9€" : "Try first: Day Pass €9"}
                          className="px-5 py-3 rounded-2xl font-black border border-amber-700/50 text-amber-200 hover:bg-amber-900/20"
                          analyticsSource="check_score_below_70"
                        />
                        <CTAButton
                          href={`${prefix}/pricing`}
                          label={isGerman ? "Alle Pläne" : "All plans"}
                          variant="outline"
                          size="md"
                          onClick={() => trackEvent("pricing_click", { locale, source: "check_score_below_70" })}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="mt-5 p-4 rounded-2xl border border-gray-800 bg-black/20">
                      <div className="text-sm font-bold text-gray-100 mb-2">{improveTitle}</div>
                      <div className="text-gray-300 mb-3">{improveText}</div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <CTAButton href={`${prefix}/dashboard`} label={isGerman ? "Dashboard öffnen" : "Open dashboard"} variant="primary" size="md" />
                        <CTAButton
                          href={`${prefix}/pricing`}
                          label={isGerman ? "Pro/Team ansehen" : "See Pro/Team"}
                          variant="outline"
                          size="md"
                          onClick={() => trackEvent("pricing_click", { locale, source: "check_safe_card" })}
                        />
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
              <button
                type="button"
                onClick={copyBadgeEmbedSnippet}
                className="mt-3 w-full rounded-xl border border-cyan-400/35 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-100 hover:bg-cyan-500/20"
              >
                {badgeCopied
                  ? (isGerman ? "Badge-Snippet kopiert" : "Badge snippet copied")
                  : (isGerman ? "Badge-Snippet kopieren" : "Copy badge snippet")}
              </button>
              <div className="mt-3 rounded-xl border border-white/10 bg-black/40 p-3">
                <div className="text-[11px] text-gray-400">
                  {isGerman ? "Empfohlenes HTML + Tailwind Snippet" : "Recommended HTML + Tailwind snippet"}
                </div>
                <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-all text-[10px] text-gray-300">
                  {`<a href="${shareUrl || "/check"}" class="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-cyan-200">Secured by ClawGuru</a>`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
          {isGerman ? (dict.check_footer_privacy_de || "keine Speicherung von Zielen") : (dict.check_footer_privacy_en || "no storage of targets")}
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
          {isGerman ? (dict.check_footer_heuristic_de || "Score ist heuristisch") : (dict.check_footer_heuristic_en || "score is heuristic")}
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-purple-500" />
          {isGerman
            ? (dict.check_footer_validate_de || "Fuer echte Aussagen: Config/Logs pruefen")
            : (dict.check_footer_validate_en || "For real conclusions: check config/logs")}
        </div>
      </div>

      {/* WORLD BEAST FINAL LAUNCH: Upsell modal after 3 checks */}
      {showUpsell && (
        <UpsellModal score={result?.score} />
      )}
    </div>
  )
}
