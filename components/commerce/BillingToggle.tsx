"use client"

import { useState } from "react"
import BuyButton from "@/components/commerce/BuyButton"
import SocialProofBlock from "@/components/commerce/SocialProofBlock"
import type { Locale } from "@/lib/i18n"

export default function BillingToggle({ locale, isDE, prefix }: { locale: Locale; isDE: boolean; prefix: string }) {
  const [annual, setAnnual] = useState(false)

  const proMonthly = 49
  const teamMonthly = 129
  const proAnnual = Math.round(proMonthly * 0.8)     // €39
  const teamAnnual = Math.round(teamMonthly * 0.8)   // €103

  return (
    <div>
      {/* ── Toggle ── */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <span className={`text-sm font-semibold ${!annual ? "text-white" : "text-gray-500"}`}>
          {isDE ? "Monatlich" : "Monthly"}
        </span>
        <button
          role="switch"
          aria-checked={annual}
          onClick={() => setAnnual(!annual)}
          className="relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-200"
          style={{ background: annual ? "rgba(0,255,157,0.3)" : "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
        >
          <span
            className="inline-block h-5 w-5 rounded-full bg-white shadow-md transform transition-transform duration-200"
            style={{ transform: annual ? "translateX(32px)" : "translateX(2px)" }}
          />
        </button>
        <span className={`text-sm font-semibold ${annual ? "text-white" : "text-gray-500"}`}>
          {isDE ? "Jährlich" : "Annual"}
        </span>
        {annual && (
          <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full"
            style={{ background: "rgba(0,255,157,0.15)", color: "#00ff9d", border: "1px solid rgba(0,255,157,0.3)" }}>
            {isDE ? "20% Rabatt" : "Save 20%"}
          </span>
        )}
      </div>

      {/* ── Cards ── */}
      <div className="grid lg:grid-cols-2 gap-6 items-stretch">

        {/* ── Pro ── (most popular) */}
        <div className="relative rounded-3xl p-[1px] overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.8) 0%, rgba(0,255,157,0.3) 100%)" }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10
            text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full text-black"
            style={{ background: "linear-gradient(90deg, #00ff9d, #00b8ff)" }}>
            {isDE ? "Beliebteste Wahl" : "Most Popular"}
          </div>
          <div className="h-full rounded-3xl p-7 flex flex-col" style={{ background: "#0d0a18" }}>
            <div className="flex items-start justify-between gap-3 mt-3">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-[0.2em] mb-2" style={{ color: "#a78bfa" }}>
                  {isDE ? "Für Einzelpersonen & kleine Teams" : "For individuals & small teams"}
                </div>
                <div className="text-xl font-black text-white font-heading">ClawGuru Pro</div>
              </div>
            </div>

            <div className="mt-5 flex items-end gap-2">
              {annual && (
                <span className="text-2xl font-bold text-gray-500 line-through pb-2">49€</span>
              )}
              <span className="text-5xl font-black text-white">
                {annual ? proAnnual : proMonthly}€
              </span>
              <span className="text-sm text-gray-400 pb-2">
                {isDE ? "/Monat" : "/month"}
              </span>
            </div>
            {annual && (
              <div className="text-xs text-emerald-400 font-semibold mt-1">
                {isDE
                  ? `Jährlich abgerechnet (${proAnnual * 12}€/Jahr)`
                  : `Billed annually (€${proAnnual * 12}/year)`}
              </div>
            )}

            <ul className="mt-4 space-y-2 text-sm text-gray-300">
              {[
                isDE ? "Unlimitierte Checks + Full Reports" : "Unlimited checks + full reports",
                isDE ? "Intel Feed, Runbooks, Copilot inklusive" : "Intel feed, runbooks, copilot included",
                isDE ? "Darwinian Feed + Neuro Intelligence" : "Darwinian feed + Neuro Intelligence",
                isDE ? "Prioritäts-Support" : "Priority support",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span style={{ color: "#a78bfa" }}>✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-6">
              <SocialProofBlock locale={locale} />
              <BuyButton
                product="pro"
                annual={annual}
                label={isDE
                  ? `Jetzt Pro werden — ${annual ? proAnnual : proMonthly}€/${isDE ? "Mo" : "mo"}`
                  : `Become Pro now — €${annual ? proAnnual : proMonthly}/mo`}
                className="w-full py-3 px-6 rounded-2xl font-black text-sm text-black transition-all duration-300 hover:opacity-90 disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #a78bfa 0%, #00ff9d 100%)", boxShadow: "0 0 30px rgba(139,92,246,0.35)" }}
              />
              <div className="mt-3 text-xs text-gray-500 text-center">
                {isDE ? "Jederzeit kündbar" : "Cancel anytime"}
              </div>
            </div>
          </div>
        </div>

        {/* ── Teams ── */}
        <div className="relative rounded-3xl p-[1px] overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(0,255,157,0.4) 0%, rgba(0,255,157,0.05) 100%)" }}>
          <div className="h-full rounded-3xl p-7 flex flex-col" style={{ background: "#080f0c" }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-[0.2em] mb-2" style={{ color: "#00ff9d" }}>
                  {isDE ? "Für wachsende Teams" : "For growing teams"}
                </div>
                <div className="text-xl font-black text-white font-heading">ClawGuru Teams</div>
              </div>
            </div>

            <div className="mt-5 flex items-end gap-2">
              {annual && (
                <span className="text-2xl font-bold text-gray-500 line-through pb-2">129€</span>
              )}
              <span className="text-5xl font-black text-white">
                {annual ? teamAnnual : teamMonthly}€
              </span>
              <span className="text-sm text-gray-400 pb-2">
                {isDE ? "/Monat" : "/month"}
              </span>
            </div>
            {annual && (
              <div className="text-xs text-emerald-400 font-semibold mt-1">
                {isDE
                  ? `Jährlich abgerechnet (${teamAnnual * 12}€/Jahr)`
                  : `Billed annually (€${teamAnnual * 12}/year)`}
              </div>
            )}

            <ul className="mt-4 space-y-2 text-sm text-gray-300">
              {[
                isDE ? "Alles aus Pro + Team-Limits" : "Everything from Pro + team limits",
                isDE ? "Shared Runbook Links & Dashboards" : "Shared runbook links & dashboards",
                isDE ? "Roadmap Votes — bestimmt was gebaut wird" : "Roadmap votes — determines what gets built",
                isDE ? "Besser für 5+ Personen" : "Better for 5+ seats",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span style={{ color: "#00ff9d" }}>✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-6">
              <SocialProofBlock locale={locale} />
              <BuyButton
                product="team"
                annual={annual}
                label={isDE
                  ? `Teams starten (${annual ? teamAnnual : teamMonthly}€/Monat) → Stripe`
                  : `Start Teams (€${annual ? teamAnnual : teamMonthly}/month) → Stripe`}
                className="w-full py-3 px-6 rounded-2xl font-black text-sm text-white border transition-all duration-300 hover:bg-white/5 disabled:opacity-60"
                style={{ borderColor: "rgba(0,255,157,0.4)", boxShadow: "0 0 20px rgba(0,255,157,0.1)" }}
              />
              <div className="mt-3 text-xs text-gray-500 text-center">
                {isDE ? "Jederzeit kündbar" : "Cancel anytime"}
              </div>
              <div className="mt-3 text-center">
                <a href={`${prefix}/for-msps/white-label`} className="text-xs text-[#00ff9d] hover:underline">
                  {isDE ? "MSP? White-Label Partnership →" : "MSP? White-Label Partnership →"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
