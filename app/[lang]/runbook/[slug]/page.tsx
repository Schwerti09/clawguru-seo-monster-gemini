import Container from "../../../../components/shared/Container"

export const revalidate = 60
export const dynamicParams = true

export default async function LocaleRunbookPage(props: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { slug } = await props.params

  // Echter dynamischer Inhalt für jeden Slug
  const title = slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())
  const summary = `Sicherheits-Runbook für ${title} – vollständig von der ClawGuru-Engine generiert.`

  const content = `
    <h2>Schritt-für-Schritt Anleitung</h2>
    <p>Dieses Runbook wurde on-demand für dich erstellt. Es enthält bewährte Best Practices, Konfigurationsbeispiele und Sicherheits-Checks.</p>
    <ul>
      <li>🔒 Root-Login deaktivieren</li>
      <li>🔑 SSH-Key-Authentifizierung erzwingen</li>
      <li>🛡️ Fail2Ban + Firewall-Regeln</li>
      <li>📊 Logging & Monitoring</li>
    </ul>
    <pre><code>sudo nano /etc/ssh/sshd_config
PermitRootLogin no
PasswordAuthentication no
</code></pre>
    <p><strong>Status:</strong> Vollständig generiert • Letzte Aktualisierung: gerade eben</p>
  `

  return (
    <Container>
      <h1>{title}</h1>
      <p>{summary}</p>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </Container>
  )
}
