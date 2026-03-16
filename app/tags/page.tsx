import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import NextDynamic from "next/dynamic"
const TagOrbitCloud3D = NextDynamic(() => import("@/components/tags/TagOrbitCloud3D"), { ssr: false })
const TagList = NextDynamic(() => import("@/components/tags/TagList"), { ssr: false })
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
  let tags: string[] = []
  try {
    const { allTags } = await import("@/lib/pseo")
    tags = allTags()
  } catch {}
  if (!Array.isArray(tags) || tags.length === 0) {
    tags = [
      "security",
      "nginx",
      "aws",
      "kubernetes",
      "docker",
      "cloudflare",
      "ssh",
      "firewall",
      "waf",
      "backup",
    ]
  }
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
