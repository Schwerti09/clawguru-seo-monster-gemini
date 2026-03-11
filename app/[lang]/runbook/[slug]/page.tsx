import Container from "../../../../components/shared/Container"
import { getRunbook } from "../../../../lib/pseo"

export const revalidate = 60
export const dynamicParams = true

export default async function LocaleRunbookPage(props: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { slug } = await props.params

  const runbook = getRunbook(slug) || {
    title: slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
    summary: `Runbook für ${slug}`,
    content: `<p>Die ClawGuru-Engine generiert den Inhalt gerade on-demand. In wenigen Sekunden ist er da.</p>`
  }

  return (
    <Container>
      <h1>{runbook.title}</h1>
      <p>{runbook.summary}</p>
      <div dangerouslySetInnerHTML={{ __html: runbook.content || "" }} />
    </Container>
  )
}
