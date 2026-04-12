// Locale community pages: /de/community, /en/community, /es/community, etc.
// Renders the same community page with locale-aware dictionary so content is translated.

import { SUPPORTED_LOCALES, buildLocalizedAlternates, normalizeLocale } from "@/lib/i18n"
import { getDictionary } from "@/lib/getDictionary"
import CommunityPage from "@/app/community/page"

export const revalidate = 60

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }) {
  const locale = normalizeLocale(props.params.lang)
  return {
    title: locale === "de" 
      ? "ClawBot Community | AI Agent Hub für OpenClaw & MoltBot"
      : "ClawBot Community | AI Agent Hub for OpenClaw & MoltBot",
    description: locale === "de"
      ? "Trete der ClawBot Community bei! AI Agents, Integration Guides, Tutorials und Ressourcen für OpenClaw, Moltbot und autonomes Ops-Management."
      : "Join the ClawBot Community! AI Agents, Integration Guides, Tutorials and Resources for OpenClaw, Moltbot and autonomous Ops Management.",
    alternates: buildLocalizedAlternates(locale, "/community"),
  }
}

export default async function LocaleCommunityPage(props: { params: { lang: string } }) {
  const locale = normalizeLocale(props.params.lang)
  const dict = await getDictionary(locale)

  return <CommunityPage dict={dict} locale={locale} />
}
