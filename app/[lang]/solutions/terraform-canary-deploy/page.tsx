import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
import RootPage from "@/app/solutions/terraform-canary-deploy/page"

export const revalidate = 86400

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  return {
    alternates: { canonical: `/solutions/terraform-canary-deploy/page` }
  }
}

export default function LocaleTerraformCanaryDeployPage() {
  return <RootPage />
}
