import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import NextDynamic from "next/dynamic"
import { Suspense } from "react"
const TagsClientLoader = NextDynamic(() => import("@/components/tags/TagsClientLoader"), { ssr: false })
export const dynamic = "force-static"
export const revalidate = 3600
export const runtime = "nodejs"
export const maxDuration = 180

export const metadata = {
  title: "Tags | ClawGuru",
  description:
    "Tag Index für Runbooks: Provider, Fehler, Topics, Configs. Interne Linkpower für Longtail-Dominanz.",
  alternates: { canonical: "/tags" }
}

export default async function TagsPage() {
  return (
    <Container>
      <div className="py-16 max-w-6xl mx-auto">
        <SectionTitle
          kicker="Internal Link Clusters"
          title="Tag Index"
          subtitle="Provider · Error · Topic · Config – jede Kombination wird ein Einstiegspunkt."
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
          <TagsClientLoader />
        </Suspense>

        <div className="mt-10 text-sm text-gray-500">
          Tipp: Tags sind ein Link-Graph. Je mehr Runbooks du fütterst, desto stärker wird die interne Autorität.
        </div>
      </div>
    </Container>
  )
}
