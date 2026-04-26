import {
  AUTOPILOT_PLANS,
  type AutopilotPlanId,
  formatAutopilotPlanMonthlyPrice,
} from "@/lib/autopilot-offering"

/**
 * Public marketing + SEO surfaces: single source of truth for euro amounts
 * (Autopilot monthly tiers + one-shot Day Pass). Stripe IDs stay in env/checkout code.
 */
export const DAY_PASS_EUR = 9

export { AUTOPILOT_PLANS, type AutopilotPlanId, formatAutopilotPlanMonthlyPrice }

export function formatDayPassEur(locale: "de" | "en"): string {
  return locale === "de" ? `${DAY_PASS_EUR}€` : `€${DAY_PASS_EUR}`
}

/** One-line for comparison tables (keeps the leading ✅ used by many pages). */
export function clawGuruCompareTablePriceRow(locale: "de" | "en"): string {
  const d = formatDayPassEur(locale)
  const starter = formatAutopilotPlanMonthlyPrice("starter", locale)
  if (locale === "de") {
    return `✅ ab ${d}/24h (Day Pass) · Abos ab ${starter}/Monat (Starter)`
  }
  return `✅ from ${d}/24h (Day Pass) · plans from ${starter}/mo (Starter)`
}

export function clawGuruFaqSnykPriceAnswerDe(): string {
  const day = formatDayPassEur("de")
  const starter = formatAutopilotPlanMonthlyPrice("starter", "de")
  const pro = formatAutopilotPlanMonthlyPrice("pro", "de")
  return `Snyk bietet einen begrenzten Free-Tier, Pro ab $25/Monat pro Entwickler. ClawGuru: ${day} für 24h (Day Pass) oder monatlich ab ${starter} (Starter) bzw. ${pro} (Pro) — abhängig vom Setup.`
}

export function clawGuruFaqSnykPriceAnswerEn(): string {
  const day = formatDayPassEur("en")
  const starter = formatAutopilotPlanMonthlyPrice("starter", "en")
  const pro = formatAutopilotPlanMonthlyPrice("pro", "en")
  return `Snyk has a limited free tier; paid plans are commonly quoted around $25/developer/month. ClawGuru: ${day} for 24h (day pass) or from ${starter}/month (starter) and ${pro}/month (pro), depending on your setup.`
}

export function clawGuruFaqWizPriceAnswerDe(): string {
  const day = formatDayPassEur("de")
  const starter = formatAutopilotPlanMonthlyPrice("starter", "de")
  return `Ja, deutlich. ClawGuru startet mit einem Day Pass ab ${day} (24h) und monatlichen Plänen ab ${starter} (Starter). Wiz kostet typischerweise $100.000+ pro Jahr für Enterprise-Lizenzen und richtet sich an große Konzerne.`
}

export function clawGuruFaqWizPriceAnswerEn(): string {
  const day = formatDayPassEur("en")
  const starter = formatAutopilotPlanMonthlyPrice("starter", "en")
  return `Yes — for most teams, materially cheaper. ClawGuru is available with a day pass from ${day} (24h) and monthly plans from ${starter} (starter). Wiz is typically a six-figure annual enterprise platform.`
}

export function clawGuruFaqTrivyFreeAnswerDe(): string {
  const day = formatDayPassEur("de")
  const starter = formatAutopilotPlanMonthlyPrice("starter", "de")
  return `Ja, Trivy ist vollständig Open Source und kostenlos (von Aqua Security). Es läuft lokal als CLI oder CI/CD-Plugin ohne Cloud-Abhängigkeit. ClawGuru: kostenloser Security Check möglich; vollständiger Plattform-Zugang z. B. ab ${day}/24h (Day Pass) oder ab ${starter}/Monat (Starter).`
}

export function clawGuruFaqTrivyFreeAnswerEn(): string {
  const day = formatDayPassEur("en")
  const starter = formatAutopilotPlanMonthlyPrice("starter", "en")
  return `Yes — Trivy is open source and free (Aqua Security). It runs locally as a CLI/CI plugin without a cloud requirement. ClawGuru: you can start with a free security check; full platform access is available from ${day} / 24h (day pass) or from ${starter}/month (starter).`
}

export function clawGuruPricingCtaSubline(locale: "de" | "en"): string {
  const d = formatDayPassEur(locale)
  const s = formatAutopilotPlanMonthlyPrice("starter", locale)
  if (locale === "de") return `Ab ${d}/24h (Day Pass) · Abos ab ${s}/Monat (Starter)`
  return `From ${d}/24h (day pass) · plans from ${s}/mo (starter)`
}

type PriceBullet = { k: string; label: string; text: string; highlightClass?: string }

export function clawGuruPublicPricingBullets(locale: "de" | "en"): PriceBullet[] {
  if (locale === "de") {
    return [
      { k: "daypass", label: "Day Pass", text: `${DAY_PASS_EUR}€ / 24h` },
      {
        k: "starter",
        label: "Starter (Autopilot)",
        text: `${AUTOPILOT_PLANS.starter.monthlyPriceEur}€ / Monat`,
      },
      {
        k: "pro",
        label: "Pro (Autopilot)",
        text: `${AUTOPILOT_PLANS.pro.monthlyPriceEur}€ / Monat`,
      },
      {
        k: "scale",
        label: "Scale (Autopilot)",
        text: `${AUTOPILOT_PLANS.scale.monthlyPriceEur}€ / Monat`,
      },
      { k: "ent", label: "Enterprise", text: "Individuelles Angebot" },
      {
        k: "note",
        label: "Hinweis",
        text: "Security Check: kostenlos starten (je nach Flow)",
        highlightClass: "text-green-400",
      },
    ]
  }
  return [
    { k: "daypass", label: "Day pass", text: `€${DAY_PASS_EUR} / 24h` },
    {
      k: "starter",
      label: "Starter (Autopilot)",
      text: `€${AUTOPILOT_PLANS.starter.monthlyPriceEur} / month`,
    },
    {
      k: "pro",
      label: "Pro (Autopilot)",
      text: `€${AUTOPILOT_PLANS.pro.monthlyPriceEur} / month`,
    },
    {
      k: "scale",
      label: "Scale (Autopilot)",
      text: `€${AUTOPILOT_PLANS.scale.monthlyPriceEur} / month`,
    },
    { k: "ent", label: "Enterprise", text: "Custom quote" },
    {
      k: "note",
      label: "Note",
      text: "Security check: free to start (depending on flow)",
      highlightClass: "text-green-400",
    },
  ]
}
