// Locale agents pages: /de/agents, /en/agents, /es/agents, etc.
// Renders the same agents page with locale-aware dictionary so content is translated.

import { SUPPORTED_LOCALES, buildLocalizedAlternates, normalizeLocale } from "@/lib/i18n"
import { getDictionary } from "@/lib/getDictionary"
import AgentsPage from "@/app/agents/page"

export const revalidate = 60

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }) {
  const locale = normalizeLocale(props.params.lang)
  return {
    title: locale === "de" 
      ? "AI Agent Showcase | ClawBot & MoltBot Agent Library"
      : "AI Agent Showcase | ClawBot & MoltBot Agent Library",
    description: locale === "de"
      ? "Entdecke die komplette Sammlung an AI Agents für Security, Operations, Deployment und Monitoring. ClawBot & MoltBot Agent Showcase."
      : "Discover the complete collection of AI Agents for Security, Operations, Deployment and Monitoring. ClawBot & MoltBot Agent Showcase.",
    alternates: buildLocalizedAlternates(locale, "/agents"),
  }
}

export default async function LocaleAgentsPage(props: { params: { lang: string } }) {
  const locale = normalizeLocale(props.params.lang)
  const dict = await getDictionary(locale)

  return <AgentsPage dict={dict} locale={locale} />
}
