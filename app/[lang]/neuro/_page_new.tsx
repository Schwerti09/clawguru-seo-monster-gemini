import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import NeuroClientPage from "@/app/neuro/page"

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  return {
    alternates: buildLocalizedAlternates(locale, "/neuro"),
  }
}

export default function LocaleNeuroPage() {
  return <NeuroClientPage />
}
