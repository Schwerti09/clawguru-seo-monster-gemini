import type { Metadata } from "next"

import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
import Container from "@/components/shared/Container"
import IntelFeed from "@/components/intel/IntelFeed"
import IntelApiDocs from "@/components/intel/IntelApiDocs"

export const revalidate = 60

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const params = props.params
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale

  return {
    alternates: { canonical: `/${locale}/intel` },
  }
}

export default function LocaleIntelPage() {
  return (
    <Container>
      <div className="py-16">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Intel Feed</h1>
        <p className="text-gray-300 text-lg mb-8">
          Wiederkehrende Muster, kuratiert. Kein Clickbait. Du willst Handlungswissen.
        </p>
        <IntelFeed />
        <IntelApiDocs />
      </div>
    </Container>
  )
}
