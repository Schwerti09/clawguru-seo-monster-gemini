"use client"

import { useMemo, useState } from "react"
import { performSecurityCheck, type SecurityCheckResult } from "@/lib/security-check"
import CTAButton from "@/components/marketing/CTAButton"
import BuyButton from "@/components/commerce/BuyButton"
import { ClawguruAvatar } from "@/components/ui/ClawguruAvatar"
import dynamic from "next/dynamic"
import { useI18n } from "@/components/i18n/I18nProvider"
import Image from "next/image"

// WORLD BEAST FINAL LAUNCH: lazy-load upsell modal
const UpsellModal = dynamic(() => import("@/components/onboarding/UpsellModal"), { ssr: false })

export default function HeroSecurityCheck() {
  const { locale, dict } = useI18n()
  const prefix = `/${locale}`
  const p = (dict as any)?.previews ?? {}
  const t = {
    title: p.checkTitle || "LIVE Security Check (Heuristic) — 30 Seconds",
    desc: p.checkDesc || "Enter an IP/domain/bot URL. You get a Claw Security Score + clear next steps.",
    targetLabel: p.checkTargetLabel || "Target (publicly visible): IP, domain or URL",
    placeholder: p.checkPlaceholder || "e.g. 203.0.113.10 or yourbot.example.com",
    btn: p.checkBtn || "CHECK FOR FREE",
    btnLoading: p.checkBtnLoading || "Checking...",
    scoreExcellent: p.checkScoreExcellent || "EXCELLENT",
    scoreSolid: p.checkScoreSolid || "SOLID",
    scoreVulnerable: p.checkScoreVulnerable || "VULNERABLE",
    scoreCritical: p.checkScoreCritical || "CRITICAL",
    hintExcellent: p.checkHintExcellent || "Good baseline. Now automate monitoring & rotation.",
    hintSolid: p.checkHintSolid || "Not bad. A few defaults can still get you burned.",
    hintVulnerable: p.checkHintVulnerable || "One dumb coincidence is enough. Harden now.",
    hintCritical: p.checkHintCritical || "Stop. Rotate. Close. Stabilize.",
    higherRisk: p.checkHigherRisk || "HIGHER RISK",
    nextSteps: p.checkNextSteps || "Your top next steps",
    shareBadge: p.checkShareBadge || "Share badge",
    copyLink: p.checkCopyLink || "Copy link",
    sharePreview: p.checkSharePreview || "Share badge preview",
    downloadSvg: p.checkDownloadSvg || "Download SVG",
    error: p.checkError || "Something went wrong. Please try again.",
    retry: p.checkRetry || "Retry",
    noStorage: p.checkNoStorage || "no storage of targets",
    heuristic: p.checkHeuristic || "score is heuristic",
    configHint: p.checkConfigHint || "For real conclusions: check config/logs",
    riskImmediate: p.checkRiskImmediate || "Want out of the risk immediately?",
    riskDesc: p.checkRiskDesc || "Pro: permanent full access from €49/month. Day Pass: 24h full access for €9.",
    btnPro: p.checkBtnPro || "Pro €49 / month",
    btnDayPass: p.checkBtnDayPass || "Day Pass (€9 / 24h)",
    btnAllPlans: p.checkBtnAllPlans || "All plans",
    openDashboard: p.checkOpenDashboard || "Open dashboard",
    seeProTeam: p.checkSeeProTeam || "See Pro/Team",
    shareMsg: p.checkShareMsg || "My Claw Security Score: {score}/100 — checked via ClawGuru",
    improveTitle90: p.checkImproveTitle90 || "Excellent – add monitoring & rotation",
    improveTitle75: p.checkImproveTitle75 || "Upgrade to excellent in 30 minutes",
    improveTitle: p.checkImproveTitle || "Improve in 30 minutes",
    improveDesc90: p.checkImproveDesc90 || "Stay excellent: automate rotation, alerts & baselines.",
    improveDesc75: p.checkImproveDesc75 || "Take the Academy sprint and go safe by default.",
    improveDesc: p.checkImproveDesc || "Harden quickly and make defaults safe.",
    copilotExposed: p.checkCopilotExposed || "I think my instance is exposed. Target: {target}. Score: {score}/100. What are the next 5 steps?",
    copilotHarden: p.checkCopilotHarden || "I want to harden my baseline. Target: {target}. Score: {score}/100. Give me a runbook.",
  }

  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SecurityCheckResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  // WORLD BEAST FINAL LAUNCH: upsell modal state
  const [showUpsell, setShowUpsell] = useState(false)

  function scoreLabel(score: number) {
    if (score >= 90) return t.scoreExcellent
    if (score >= 75) return t.scoreSolid
    if (score >= 60) return t.scoreVulnerable
    return t.scoreCritical
  }

  function scoreHint(score: number) {
    if (score >= 90) return t.hintExcellent
    if (score >= 75) return t.hintSolid
    if (score >= 60) return t.hintVulnerable
    return t.hintCritical
  }

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
    if (result.score >= 90) return t.improveTitle90
    if (result.score >= 75) return t.improveTitle75
    return t.improveTitle
  }, [result, t.improveTitle90, t.improveTitle75, t.improveTitle])

  const improveText = useMemo(() => {
    if (!result) return ""
    if (result.score >= 90) return t.improveDesc90
    if (result.score >= 75) return t.improveDesc75
    return t.improveDesc
  }, [result, t.improveDesc90, t.improveDesc75, t.improveDesc])

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
      setError(e instanceof Error ? e.message : t.error)
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
    const text = t.shareMsg.replace("{score}", String(result?.score))
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
      ? t.copilotExposed.replace("{target}", result.target).replace("{score}", String(result.score))
      : t.copilotHarden.replace("{target}", result.target).replace("{score}", String(result.score))
    return `${prefix}/copilot?q=${encodeURIComponent(base)}`
  }, [result, prefix, t.copilotExposed, t.copilotHarden])

  return (
    <div className="bg-gradient-to-br from-gray-900/60 to-blue-950/30 border border-gray-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-grow">
          <div className="flex justify-start md:justify-start mb-2">
            <ClawguruAvatar className="w-12 h-12 md:w-16 md:h-16" />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black mb-2">
            {t.title}
          </h2>
          <p className="text-gray-300 mb-4">
            {t.desc.includes("Claw Security Score") ? (
              <>
                {t.desc.split("Claw Security Score")[0]}<span className="font-semibold">Claw Security Score</span>{t.desc.split("Claw Security Score")[1]}
              </>
            ) : t.desc}
          </p>

          <label htmlFor="security-target" className="block text-sm font-medium mb-2 text-gray-200">
            {t.targetLabel}
          </label>
          <input
            id="security-target"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCheck()}
            placeholder={t.placeholder}
            className="w-full p-4 rounded-2xl bg-black/40 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
          />
        </div>

        <a
          href={`${prefix}/check`}
          onClick={(e) => { if (!loading && input.trim()) { e.preventDefault(); handleCheck(); } }}
          aria-disabled={loading || !input.trim()}
          className={`w-full md:w-auto px-8 py-4 rounded-2xl font-black text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl hover:shadow-red-900/30 ${loading || !input.trim() ? "opacity-50 pointer-events-none" : ""}`}
        >
          {loading ? t.btnLoading : t.btn}
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
          <span>{t.error}</span>
          <button
            onClick={handleCheck}
            className="px-3 py-1.5 rounded-xl border border-red-500/50 hover:border-red-400 text-red-200 hover:text-white transition-colors"
          >
            {t.retry}
          </button>
        </div>
      ) : null}

      {result ? (
        <div className={`mt-6 p-6 rounded-3xl border ${result.vulnerable ? "border-red-800 bg-red-950/30" : "border-green-800 bg-green-950/20"}`}>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-3">
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${result.vulnerable ? "bg-red-900/60 text-red-200" : "bg-green-900/60 text-green-200"}`}>
                  {result.vulnerable ? t.higherRisk : "BASIC OK"}
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
                      {t.shareBadge}
                    </button>
                    <button onClick={copyLink} className="px-4 py-2 rounded-xl border border-gray-700 hover:border-gray-500 font-bold text-gray-200 transition-colors">
                      {t.copyLink}
                    </button>
                    <a
                      href={copilotPrefill}
                      className="px-4 py-2 rounded-xl font-black text-black transition-all"
                      style={{
                        background: "linear-gradient(135deg, #d4af37 0%, #e8cc6a 50%, #a8872a 100%)",
                        boxShadow: "0 6px 24px rgba(212,175,55,0.22)",
                      }}
                    >
                      Ask the Guru →
                    </a>
                  </div>

                  <div className="mt-4 text-xs text-gray-500">
                    {result.disclaimer}
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-gray-800 bg-black/30">
                  <div className="text-sm text-gray-400 mb-2">{t.nextSteps}</div>
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
                      <div className="text-sm text-cyan-200 font-bold mb-2">{t.riskImmediate}</div>
                      <div className="text-gray-200 mb-3">
                        {t.riskDesc}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <BuyButton product="pro" label={t.btnPro} className="px-5 py-3 rounded-2xl font-black bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90" />
                        <BuyButton product="daypass" label={t.btnDayPass} className="px-5 py-3 rounded-2xl font-black bg-gradient-to-r from-orange-500 to-red-600 hover:opacity-90" />
                        <CTAButton href={`${prefix}/pricing`} label={t.btnAllPlans} variant="outline" size="md" />
                      </div>
                    </div>
                  ) : (
                    <div className="mt-5 p-4 rounded-2xl border border-gray-800 bg-black/20">
                      <div className="text-sm font-bold text-gray-100 mb-2">{improveTitle}</div>
                      <div className="text-gray-300 mb-3">{improveText}</div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <CTAButton href={`${prefix}/dashboard`} label={t.openDashboard} variant="primary" size="md" />
                        <CTAButton href={`${prefix}/pricing`} label={t.seeProTeam} variant="outline" size="md" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:w-[240px]">
              <div className="text-sm text-gray-400 mb-2">{t.sharePreview}</div>
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
                {t.downloadSvg}
              </a>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
          {t.noStorage}
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
          {t.heuristic}
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-purple-500" />
          {t.configHint}
        </div>
      </div>

      {/* WORLD BEAST FINAL LAUNCH: Upsell modal after 3 checks */}
      {showUpsell && (
        <UpsellModal score={result?.score} />
      )}
    </div>
  )
}
