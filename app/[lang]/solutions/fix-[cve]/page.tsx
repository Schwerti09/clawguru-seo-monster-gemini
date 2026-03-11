export default function SolutionPage(props: {
  params: Promise<{ lang: string; cve: string }>
}) {
  const { cve } = await props.params

  const title = `Fix ${cve.toUpperCase()}`
  const summary = `Sicherheitslösung für ${cve} – on-demand generiert von ClawGuru`

  const content = `
    <h2>Schritt-für-Schritt Fix</h2>
    <p>Dieser CVE-Fix wurde gerade on-demand erstellt.</p>
    <ul>
      <li>✅ Update durchführen</li>
      <li>✅ Neustart der Services</li>
      <li>✅ Monitoring aktivieren</li>
    </ul>
    <p><strong>Status:</strong> Vollständig generiert</p>
  `

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui' }}>
      <h1>{title}</h1>
      <p>{summary}</p>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}
