"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Lock, Shield, CheckCircle, ArrowRight } from "lucide-react"
import BuyButton from "@/components/commerce/BuyButton"
import { trackEvent } from "@/lib/analytics"
import {
  AUTOPILOT_THRESHOLDS,
  buildUpgradeSignalsFromUsage,
} from "@/lib/autopilot-thresholds"

type ProFeatureGateDict = {
  locked_title: string
  locked_desc: string
  benefit_1: string
  benefit_2: string
  benefit_3: string
  benefit_4: string
  cta_pro: string
  cta_daypass: string
  cta_plans: string
  trust_note: string
}

const DE: ProFeatureGateDict = {
  locked_title: "Detaillierte CVE-Analyse nur für Pro-User",
  locked_desc: "Vollständige Impact-Analyse, Exploitation-Indikatoren und automatisierte Runbooks sind exklusiv für Pro-Abonnenten.",
  benefit_1: "Vollständige CVE Impact Analyse",
  benefit_2: "Automatisierte Runbooks (One-Click)",
  benefit_3: "Live Exploitation Tracking",
  benefit_4: "Priorisierter Support",
  cta_pro: "Pro für 99\u202f\u20ac/Monat",
  cta_daypass: "Erst testen: Day Pass 9\u202f\u20ac",
  cta_plans: "Alle Pläne ansehen",
  trust_note: "Kein Abo nötig · Jederzeit kündbar · 30-Tage Geld-zurück"
}

const EN: ProFeatureGateDict = {
  locked_title: "Detailed CVE analysis for Pro users only",
  locked_desc: "Complete impact analysis, exploitation indicators, and automated runbooks are exclusive to Pro subscribers.",
  benefit_1: "Full CVE impact analysis",
  benefit_2: "Automated runbooks (one-click)",
  benefit_3: "Live exploitation tracking",
  benefit_4: "Priority support",
  cta_pro: "Pro for \u20ac99/month",
  cta_daypass: "Try first: Day Pass \u20ac9",
  cta_plans: "View all plans",
  trust_note: "No subscription required · Cancel anytime · 30-day money back"
}

type Props = {
  locale: string
  source?: string
  variant?: "full" | "compact"
  isPro?: boolean
}

export function ProFeatureGate({ locale, source = "cve_page", variant = "full", isPro = false }: Props) {
  const t = locale === "de" ? DE : EN
  const prefix = `/${locale}`

  if (isPro) {
    return null // Pro users see the gate removed
  }

  const handlePlansClick = () => {
    trackEvent("pro_gate_cta", { locale, source, button: "plans" })
  }

  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-amber-800/60 bg-gradient-to-br from-amber-950/30 to-orange-950/20 p-5"
      >
        <div className="flex items-center gap-3 mb-3">
          <Lock className="h-5 w-5 text-amber-400" />
          <h3 className="font-bold text-amber-300">{t.locked_title}</h3>
        </div>
        <p className="text-sm text-gray-300 mb-4">{t.locked_desc}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <BuyButton
            product="pro"
            label={t.cta_pro}
            className="px-4 py-2 rounded-xl font-black text-black text-sm"
            style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", boxShadow: "0 0 20px rgba(245,158,11,0.25)" }}
            analyticsSource={source}
            autoRecommend
            upgradeSignals={buildUpgradeSignalsFromUsage({
              workspaces: AUTOPILOT_THRESHOLDS.pro.minWorkspaces,
              apiExportsRequested: AUTOPILOT_THRESHOLDS.pro.needsApiExports,
              policyControlsRequested: AUTOPILOT_THRESHOLDS.pro.needsPolicyControls,
            })}
          />
          <BuyButton
            product="daypass"
            label={t.cta_daypass}
            className="px-4 py-2 rounded-xl border border-amber-700/50 text-amber-200 hover:bg-amber-900/20 font-black text-sm"
            analyticsSource={source}
            autoRecommend
            upgradeSignals={{ workspaces: 1, needsApiExports: false, needsPolicyControls: false }}
          />
        </div>
      </motion.div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="pro-gate"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl border border-amber-800/60 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(245,158,11,0.04) 0%, rgba(10,10,10,0.98) 100%)",
          boxShadow: "0 0 60px rgba(245,158,11,0.08), inset 0 1px 0 rgba(245,158,11,0.1)"
        }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900/40 to-orange-900/40 px-6 py-4 border-b border-amber-800/30">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-950/50 border border-amber-700/50">
              <Lock className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-amber-300">{t.locked_title}</h3>
              <p className="text-xs text-amber-200/80">{t.locked_desc}</p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {[
              { icon: Shield, text: t.benefit_1 },
              { icon: CheckCircle, text: t.benefit_2 },
              { icon: Shield, text: t.benefit_3 },
              { icon: CheckCircle, text: t.benefit_4 },
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3">
                <benefit.icon className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <span className="text-sm text-gray-300">{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <BuyButton
              product="pro"
              label={t.cta_pro}
              className="flex-1 px-6 py-3 rounded-2xl font-black text-black"
              style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", boxShadow: "0 0 30px rgba(245,158,11,0.25)" }}
              analyticsSource={source}
              autoRecommend
            upgradeSignals={buildUpgradeSignalsFromUsage({
              workspaces: AUTOPILOT_THRESHOLDS.pro.minWorkspaces,
              apiExportsRequested: AUTOPILOT_THRESHOLDS.pro.needsApiExports,
              policyControlsRequested: AUTOPILOT_THRESHOLDS.pro.needsPolicyControls,
            })}
            />
            <BuyButton
              product="daypass"
              label={t.cta_daypass}
              className="flex-1 px-6 py-3 rounded-2xl border border-amber-700/50 text-amber-200 hover:bg-amber-900/20 font-black"
              analyticsSource={source}
              autoRecommend
              upgradeSignals={{ workspaces: 1, needsApiExports: false, needsPolicyControls: false }}
            />
          </div>

          {/* Plans Link */}
          <div className="text-center">
            <a
              href={`${prefix}/pricing`}
              onClick={handlePlansClick}
              className="inline-flex items-center gap-2 text-xs text-amber-300/80 hover:text-amber-200 underline underline-offset-2"
            >
              {t.cta_plans}
              <ArrowRight className="h-3 w-3" />
            </a>
          </div>

          {/* Trust Note */}
          <div className="mt-4 pt-4 border-t border-amber-800/30 text-center">
            <p className="text-[11px] text-gray-500">{t.trust_note}</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
