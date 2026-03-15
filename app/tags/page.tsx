import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import dynamic from "next/dynamic"
const TagOrbitCloud3D = dynamic(() => import("@/components/tags/TagOrbitCloud3D"), { ssr: false })
const TagList = dynamic(() => import("@/components/tags/TagList"), { ssr: false })
export const revalidate = 3600

export const metadata = {
  title: "Tags | ClawGuru",
  description:
    "Tag Index für Runbooks: Provider, Fehler, Topics, Configs. Interne Linkpower für Longtail-Dominanz.",
  alternates: { canonical: "/tags" }
}

export default async function TagsPage() {
  const { allTags } = await import("@/lib/pseo")
  const tags = allTags()
  return (
    <Container>
      <div className="py-16 max-w-6xl mx-auto">
        <SectionTitle
          kicker="Internal Link Clusters"
          title="Tag Index"
          subtitle="Provider · Error · Topic · Config – jede Kombination wird ein Einstiegspunkt."
        />

        <TagOrbitCloud3D tags={tags} />

        <TagList tags={tags} />

        <div className="mt-10 text-sm text-gray-500">
          Tipp: Tags sind ein Link-Graph. Je mehr Runbooks du fütterst, desto stärker wird die interne Autorität.
        </div>
      </div>
    </Container>
  )
}
