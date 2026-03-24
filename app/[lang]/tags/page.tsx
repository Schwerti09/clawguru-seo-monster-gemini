import type { Metadata } from "next"
import NextDynamic from "next/dynamic"
import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
import { getDictionary } from "@/lib/getDictionary"
import { Suspense } from "react"

export const dynamic = "force-static"
export const revalidate = 3600
export const dynamicParams = false
export const runtime = "nodejs"
export const maxDuration = 180

const TagsClientLoader = NextDynamic(() => import("@/components/tags/TagsClientLoader"), {
  ssr: false,
  loading: () => (
    <div className="mt-8">
      <div className="relative mx-auto my-10 h-[460px] max-w-5xl rounded-[36px] overflow-hidden">
        <div className="absolute inset-0 rounded-[36px] border border-white/10 bg-white/[0.04] animate-pulse" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 rounded-2xl border border-white/10 bg-black/30 animate-pulse" />
        ))}
      </div>
    </div>
  ),
})

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const params = props.params
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale

  return {
    alternates: { canonical: `/${locale}/tags` },
  }
}

export default async function LocaleTagsPage(props: { params: { lang: string } }) {
  const { lang } = props.params
  const locale = (SUPPORTED_LOCALES.includes(lang as Locale) ? lang : "de") as Locale
  const dict = await getDictionary(locale)
  return (
    <Container>
      <div className="py-16 max-w-6xl mx-auto">
        <SectionTitle
          kicker={(dict as any)?.tags?.kicker || "Internal Link Clusters"}
          title={(dict as any)?.tags?.title || "Tag Index"}
          subtitle={(dict as any)?.tags?.subtitle || "Provider · Error · Topic · Config – jede Kombination wird ein Einstiegspunkt."}
        />
        <Suspense fallback={
          <div className="mt-8">
            <div className="relative mx-auto my-10 h-[460px] max-w-5xl rounded-[36px] overflow-hidden">
              <div className="absolute inset-0 rounded-[36px] border border-white/10 bg-white/[0.04] animate-pulse" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-20 rounded-2xl border border-white/10 bg-black/30 animate-pulse" />
              ))}
            </div>
          </div>
        }>
          <TagsClientLoader dict={(dict as any)?.tags} />
        </Suspense>
        <div className="mt-10 text-sm text-gray-500">
          {(dict as any)?.tags?.hint || "Tipp: Tags sind ein Link-Graph. Je mehr Runbooks du fütterst, desto stärker wird die interne Autorität."}
        </div>
      </div>
    </Container>
  )
}
