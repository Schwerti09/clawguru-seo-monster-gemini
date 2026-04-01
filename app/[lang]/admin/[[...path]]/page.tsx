import { permanentRedirect } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export default async function LocalizedAdminRedirect(props: {
  params: { lang: string; path?: string[] }
}) {
  const { lang, path } = props.params
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) {
    permanentRedirect("/admin")
  }
  const suffix = Array.isArray(path) && path.length > 0 ? `/${path.join("/")}` : ""

  // Admin area is canonical at /admin; localized aliases redirect here.
  permanentRedirect(`/admin${suffix}`)
}
