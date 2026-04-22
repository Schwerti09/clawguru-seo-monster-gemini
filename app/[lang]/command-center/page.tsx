import type { Metadata } from "next"

import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import CommandCenterRootPage from "@/app/command-center/page"

export const revalidate = 60

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const params = props.params
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale

  const title = locale === "de" ? "Command Center — AI-Powered Security Intelligence" : "Command Center — AI-Powered Security Intelligence"
  const description = locale === "de"
    ? "Find runbooks in seconds, predict CVEs, and visualize your threat landscape — all powered by AI. Summon, Oracle, Neuro, Mycelium."
    : "Find runbooks in seconds, predict CVEs, and visualize your threat landscape — all powered by AI. Summon, Oracle, Neuro, Mycelium."

  return {
    title,
    description,
    alternates: buildLocalizedAlternates(locale, "/command-center"),
    openGraph: {
      title,
      description,
      type: "website",
      locale: locale === "de" ? "de_DE" : "en_US",
      alternateLocale: SUPPORTED_LOCALES.map((l) => (l === "de" ? "de_DE" : "en_US")),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

export default function LocaleCommandCenterPage() {
  return <CommandCenterRootPage />
}
