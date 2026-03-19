import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import NextDynamic from "next/dynamic"
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

        <TagsClientLoader />

        <div className="mt-10 text-sm text-gray-500">
          Tipp: Tags sind ein Link-Graph. Je mehr Runbooks du fütterst, desto stärker wird die interne Autorität.
        </div>
      </div>
    </Container>
  )
}
