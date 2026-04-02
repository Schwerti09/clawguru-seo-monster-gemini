import type { Metadata } from "next"

import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import DashboardRootPage from "@/app/dashboard/page"

const TITLES: Record<string, string> = {
  de: "Dashboard | ClawGuru",
  en: "Dashboard | ClawGuru",
  fr: "Tableau de bord | ClawGuru",
  es: "Panel de control | ClawGuru",
}

const DESCRIPTIONS: Record<string, string> = {
  de: "Ihr ClawGuru-Dashboard – überwachen Sie Bedrohungen, Runbook-Ausführungen und Ihr Abonnement.",
  en: "Your ClawGuru dashboard — monitor security threats, runbook executions, and your subscription.",
  fr: "Votre tableau de bord ClawGuru — surveillez les menaces, les exécutions de runbooks et votre abonnement.",
  es: "Su panel de ClawGuru — monitoree amenazas, ejecuciones de runbooks y su suscripción.",
}

export const dynamic = 'force-dynamic'

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const params = props.params
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale

  return {
    title: TITLES[locale] ?? TITLES.en,
    description: DESCRIPTIONS[locale] ?? DESCRIPTIONS.en,
    alternates: buildLocalizedAlternates(locale, "/dashboard"),
  }
}

export default function LocaleDashboardPage() {
  return <DashboardRootPage />
}
