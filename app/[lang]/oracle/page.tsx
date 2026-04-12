import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import OracleClientPage from "@/app/oracle/page"

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  return {
    alternates: buildLocalizedAlternates(locale, "/oracle"),
  }
}

export default function LocaleOraclePage() {
  return <OracleClientPage />
}
