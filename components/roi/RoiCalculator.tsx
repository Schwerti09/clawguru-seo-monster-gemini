"use client"

import { useState, useMemo } from "react"
import { Calculator, TrendingDown, TrendingUp, ArrowRight, Clock, Users, AlertTriangle } from "lucide-react"
import { trackEvent } from "@/lib/analytics"
import BookingButton from "@/components/booking/BookingButton"

interface Props {
  locale?: string
  variant?: "full" | "embed"
  source?: string
}

/**
 * ROI Calculator — "Cost of Incident without Runbooks"
 *
 * Core assumptions (conservative, defensible):
 *   - ClawGuru runbooks reduce Mean Time To Resolve (MTTR) by ~65%
 *   - Expert-reviewed runbooks prevent ~40% of incidents from escalating
 *   - Compliance prep cost reduced by ~60% with pre-built templates
 *
 * Inputs:
 *   - teamSize        — engineers involved in security work
 *   - hourlyRate      — blended cost per engineer-hour
 *   - incidentsPerYear
 *   - hoursPerIncident (MTTR in hours)
 *   - compliancePrep  — hours/year on compliance/questionnaires
 *
 * Outputs:
 *   - currentAnnualCost  (without ClawGuru)
 *   - withClawguruCost   (after time reduction)
 *   - annualSavings
 *   - paybackMonths      (vs €15k SaaS package / €45k FinTech retainer / €990/mo MSP)
 *   - roiMultiple        (3-year)
 */

const MTTR_REDUCTION = 0.65
const COMPLIANCE_REDUCTION = 0.60
const CLAWGURU_COST_SAAS = 15000
const CLAWGURU_COST_MSP_ANNUAL = 990 * 12
const CLAWGURU_COST_FINTECH = 45000

export default function RoiCalculator({ locale = "de", variant = "full", source = "roi_calculator" }: Props) {
  const isDE = locale === "de"
  const [teamSize, setTeamSize] = useState(5)
  const [hourlyRate, setHourlyRate] = useState(95)
  const [incidentsPerYear, setIncidentsPerYear] = useState(24)
  const [hoursPerIncident, setHoursPerIncident] = useState(8)
  const [compliancePrep, setCompliancePrep] = useState(200)
  const [package_, setPackage] = useState<"saas" | "msp" | "fintech">("saas")

  const calc = useMemo(() => {
    const incidentHoursTotal = incidentsPerYear * hoursPerIncident * teamSize
    const incidentCost = incidentHoursTotal * hourlyRate
    const complianceCost = compliancePrep * hourlyRate
    const currentAnnualCost = incidentCost + complianceCost

    const savedIncidentHours = incidentHoursTotal * MTTR_REDUCTION
    const savedComplianceHours = compliancePrep * COMPLIANCE_REDUCTION
    const timeSavings = (savedIncidentHours + savedComplianceHours) * hourlyRate

    const clawguruPrice =
      package_ === "saas" ? CLAWGURU_COST_SAAS :
      package_ === "msp" ? CLAWGURU_COST_MSP_ANNUAL :
      CLAWGURU_COST_FINTECH

    const netAnnualSavings = Math.max(0, timeSavings - clawguruPrice)
    const roi3Year = clawguruPrice > 0 ? ((timeSavings * 3) - clawguruPrice) / clawguruPrice : 0
    const paybackMonths = timeSavings > 0 ? Math.max(1, Math.round((clawguruPrice / timeSavings) * 12)) : 99

    return {
      currentAnnualCost: Math.round(currentAnnualCost),
      timeSavings: Math.round(timeSavings),
      clawguruPrice,
      netAnnualSavings: Math.round(netAnnualSavings),
      roi3Year: Math.round(roi3Year * 100),
      paybackMonths,
    }
  }, [teamSize, hourlyRate, incidentsPerYear, hoursPerIncident, compliancePrep, package_])

  const fmtEur = (n: number) =>
    new Intl.NumberFormat(isDE ? "de-DE" : "en-US", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n)

  return (
    <div className={`bg-gradient-to-br from-cyan-900/10 to-purple-900/10 border border-cyan-700/30 rounded-2xl ${variant === "full" ? "p-8" : "p-6"}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-cyan-500/20 p-2 rounded-lg">
          <Calculator className="h-5 w-5 text-cyan-400" aria-hidden />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">
            {isDE ? "ROI-Rechner: Was kosten Incidents ohne Runbooks?" : "ROI Calculator: What do incidents cost without runbooks?"}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {isDE ? "Basiert auf MTTR-Reduktion 65% und Compliance-Vorbereitung -60%" : "Based on 65% MTTR reduction and -60% compliance prep"}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="space-y-5">
          <InputRow
            icon={Users}
            label={isDE ? "Team-Größe (Engineers mit Security-Aufgaben)" : "Team size (engineers with security work)"}
            value={teamSize}
            onChange={setTeamSize}
            min={1}
            max={50}
            suffix={isDE ? "Personen" : "people"}
          />
          <InputRow
            icon={Clock}
            label={isDE ? "Stundensatz (brutto, blended)" : "Hourly rate (fully-loaded)"}
            value={hourlyRate}
            onChange={setHourlyRate}
            min={30}
            max={300}
            step={5}
            suffix="€/h"
          />
          <InputRow
            icon={AlertTriangle}
            label={isDE ? "Security-Incidents pro Jahr" : "Security incidents per year"}
            value={incidentsPerYear}
            onChange={setIncidentsPerYear}
            min={0}
            max={200}
            suffix={isDE ? "Incidents" : "incidents"}
          />
          <InputRow
            icon={Clock}
            label={isDE ? "Stunden pro Incident (MTTR)" : "Hours per incident (MTTR)"}
            value={hoursPerIncident}
            onChange={setHoursPerIncident}
            min={1}
            max={80}
            suffix="h"
          />
          <InputRow
            icon={Clock}
            label={isDE ? "Compliance-Stunden/Jahr (SOC 2, DORA, Questionnaires)" : "Compliance hours/year (SOC 2, DORA, questionnaires)"}
            value={compliancePrep}
            onChange={setCompliancePrep}
            min={0}
            max={2000}
            step={10}
            suffix="h"
          />
          <div>
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide mb-2 block">
              {isDE ? "Dein Package" : "Your package"}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { id: "saas", label: "SaaS · €15k" },
                { id: "msp", label: "MSP · €990/mo" },
                { id: "fintech", label: "FinTech · €45k" },
              ] as const).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPackage(p.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    package_ === p.id
                      ? "bg-cyan-500 text-black"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="space-y-4">
          <div className="bg-red-950/40 border border-red-800/50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-red-300 text-xs font-semibold uppercase tracking-wide mb-1">
              <TrendingUp className="h-4 w-4" aria-hidden />
              {isDE ? "Aktuelle Jahreskosten ohne ClawGuru" : "Current annual cost without ClawGuru"}
            </div>
            <div className="text-3xl font-black text-red-200">{fmtEur(calc.currentAnnualCost)}</div>
            <div className="text-xs text-gray-400 mt-1">
              {isDE ? "Incidents + Compliance-Aufwand, alles in Engineer-Stunden gerechnet" : "Incidents + compliance workload, all engineer-hour cost"}
            </div>
          </div>

          <div className="bg-cyan-950/30 border border-cyan-700/50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-cyan-300 text-xs font-semibold uppercase tracking-wide mb-1">
              <TrendingDown className="h-4 w-4" aria-hidden />
              {isDE ? "Einsparung pro Jahr mit ClawGuru" : "Annual savings with ClawGuru"}
            </div>
            <div className="text-3xl font-black text-cyan-200">{fmtEur(calc.timeSavings)}</div>
            <div className="text-xs text-gray-400 mt-1">
              {isDE ? "Durch 65% MTTR-Reduktion + 60% Compliance-Automatisierung" : "Via 65% MTTR reduction + 60% compliance automation"}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-3">
              <div className="text-[10px] uppercase tracking-wide text-gray-500">{isDE ? "Netto-Einsparung Jahr 1" : "Net savings Y1"}</div>
              <div className="text-xl font-black text-white">{fmtEur(calc.netAnnualSavings)}</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-3">
              <div className="text-[10px] uppercase tracking-wide text-gray-500">{isDE ? "Payback" : "Payback"}</div>
              <div className="text-xl font-black text-white">
                {calc.paybackMonths <= 12 ? `${calc.paybackMonths} mo` : `${Math.round(calc.paybackMonths / 12)}y`}
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 col-span-2">
              <div className="text-[10px] uppercase tracking-wide text-gray-500">{isDE ? "3-Jahres-ROI" : "3-year ROI"}</div>
              <div className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {calc.roi3Year > 0 ? `+${calc.roi3Year}%` : `${calc.roi3Year}%`}
              </div>
            </div>
          </div>

          <BookingButton
            type="audit"
            label={isDE ? "Diesen Case kostenlos besprechen" : "Discuss this case — free 30min call"}
            locale={locale}
            source={`${source}_roi_result`}
            variant="primary"
            className="w-full justify-center"
            subject={isDE ? `ROI-Rechner: Einsparung ${fmtEur(calc.timeSavings)}` : `ROI Calculator: Savings ${fmtEur(calc.timeSavings)}`}
            body={
              isDE
                ? `Hi ClawGuru,\n\nIch habe euren ROI-Rechner benutzt:\n- Team: ${teamSize} Engineers\n- Stundensatz: ${hourlyRate}€/h\n- Incidents/Jahr: ${incidentsPerYear} × ${hoursPerIncident}h\n- Compliance-Aufwand: ${compliancePrep}h/Jahr\n- Package: ${package_.toUpperCase()}\n\nErgebnis:\n- Aktuelle Kosten: ${fmtEur(calc.currentAnnualCost)}\n- Einsparung: ${fmtEur(calc.timeSavings)}\n- Netto Y1: ${fmtEur(calc.netAnnualSavings)}\n- 3Y ROI: ${calc.roi3Year}%\n\nBitte Termin vorschlagen.\n`
                : `Hi ClawGuru,\n\nI used your ROI calculator:\n- Team: ${teamSize} engineers\n- Hourly rate: €${hourlyRate}/h\n- Incidents/year: ${incidentsPerYear} × ${hoursPerIncident}h\n- Compliance workload: ${compliancePrep}h/year\n- Package: ${package_.toUpperCase()}\n\nResult:\n- Current cost: ${fmtEur(calc.currentAnnualCost)}\n- Savings: ${fmtEur(calc.timeSavings)}\n- Net Y1: ${fmtEur(calc.netAnnualSavings)}\n- 3Y ROI: ${calc.roi3Year}%\n\nPlease suggest a time.\n`
            }
          />
          <p className="text-[11px] text-gray-500 text-center">
            {isDE ? "Konservative Annahmen. Echte Kunden sehen oft stärkere Effekte." : "Conservative assumptions. Real customers often see stronger effects."}
          </p>
        </div>
      </div>
    </div>
  )
}

function InputRow({
  icon: Icon,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix,
}: {
  icon: React.ElementType
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step?: number
  suffix?: string
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-xs font-semibold text-gray-300 mb-1.5">
        <Icon className="h-3.5 w-3.5 text-cyan-400" aria-hidden />
        {label}
      </label>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 accent-cyan-500"
        />
        <div className="w-28 flex items-center gap-1">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-16 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm text-white text-right focus:border-cyan-500 focus:outline-none"
          />
          {suffix && <span className="text-xs text-gray-400">{suffix}</span>}
        </div>
      </div>
    </div>
  )
}
