import Container from "@/components/shared/Container"

export default function KeyRotationVault() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Was ist Key Rotation und warum ist sie wichtig?', acceptedAnswer: { '@type': 'Answer', text: 'Key Rotation ist das regelmäßige Ersetzen von kryptographischen Schlüsseln, API-Tokens und Zertifikaten durch neue. Wichtig weil: kompromittierte Keys werden dadurch unbrauchbar, Audit-Trail bleibt sauber, Compliance-Anforderungen (SOC2, ISO 27001) fordern Rotation. Empfehlung: API-Keys alle 90 Tage, TLS-Zertifikate automatisch via Let¹s Encrypt, DB-Passwort alle 180 Tage.' } },
      { '@type': 'Question', name: 'Wie rotiere ich Keys ohne Produktionsausfall?', acceptedAnswer: { '@type': 'Answer', text: 'Zero-Downtime Key Rotation: 1) Neuen Key generieren (alter Key läuft noch). 2) Neue Key in Secret Manager/Env deployen. 3) Rolling Deploy der Applikation (neuer Key aktiv). 4) Überprüfen: alle Requests laufen über neuen Key. 5) Alten Key invalidieren. Monitoring: Auth-Fails nach Rotation sofort prüfen. Rollback-Plan vorbereiten.' } },
      { '@type': 'Question', name: 'Wie oft sollte ich API-Keys und Secrets rotieren?', acceptedAnswer: { '@type': 'Answer', text: 'Rotationsintervalle: API-Keys (Cloud-Provider): 90 Tage. JWT Signing Keys: 30 Tage oder weniger. TLS-Zertifikate: automatisch (Let¹s Encrypt alle 90 Tage). Datenbank-Passwort: 180 Tage. SSH-Schlüssel: jährlich. Nach Security-Incident: sofort. Faustregel: kurze TTL ist besser als lange, auch wenn der Aufwand steigt.' } },
      { '@type': 'Question', name: 'Welche Tools helfen bei automatischer Key Rotation?', acceptedAnswer: { '@type': 'Answer', text: 'Key Rotation Tools: HashiCorp Vault (Dynamic Secrets, automatische DB-Credentials). AWS Secrets Manager (automatische Rotation via Lambda). GCP Secret Manager (Rotation-Notifications). Kubernetes External Secrets Operator (sync von Vault/AWS). Certbot/Cert-Manager für TLS. Renovate/Dependabot für Dependency-Updates. ClawGuru Runbooks für Schritt-für-Schritt Rotation.' } },
    ],
  }

  return (
    <Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="py-16 max-w-4xl mx-auto">
        <div className="text-xs uppercase tracking-widest text-brand-cyan/80">Vault</div>
        <h1 className="mt-2 text-4xl font-black">Key Rotation (Runbook)</h1>
        <p className="mt-4 text-gray-300 text-lg leading-relaxed">
          Rotation ist nicht „neuen Key erzeugen“. Rotation ist: <strong>neuen Key aktivieren + alten Key töten</strong> —
          und zwar so, dass du nicht nebenbei deine Produktion abfackelst.
        </p>

        <div className="mt-8 p-6 rounded-3xl border border-gray-800 bg-black/30">
          <h2 className="text-2xl font-black">Minimal-Runbook</h2>
          <ol className="mt-4 space-y-3 text-gray-300 list-decimal pl-6">
            <li>Neuen Key erzeugen (Provider-Konsole) — <strong>noch nicht</strong> old key löschen.</li>
            <li>Deploy vorbereiten: ENV update, config check, smoke test.</li>
            <li>Deploy ausrollen (rolling) — prüfen, dass neue Keys genutzt werden.</li>
            <li>Alte Keys invalidieren/löschen.</li>
            <li>Monitoring: Auth-Fails, ungewöhnliche Requests, Kosten-Spikes.</li>
          </ol>
        </div>

        <div className="mt-8 p-6 rounded-3xl border border-gray-800 bg-black/30">
          <h2 className="text-2xl font-black">Fehler, die dich teuer machen</h2>
          <ul className="mt-4 space-y-3 text-gray-300">
            <li><span className="text-cyan-300 font-bold">•</span> Rotation ohne Log-Sicherung (du verlierst forensische Spuren)</li>
            <li><span className="text-cyan-300 font-bold">•</span> Kein Rollback-Plan</li>
            <li><span className="text-cyan-300 font-bold">•</span> Keys in Logs/Client-Bundles</li>
          </ul>
        </div>

        <div className="mt-10">
          <a href="/copilot?q=Ich%20will%20ein%20Key-Rotation%20Runbook%20f%C3%BCr%20mein%20Setup.%20Hier%20ist%20mein%20Stack%3A%20" className="text-cyan-300 underline hover:text-cyan-200">
            Copilot: Rotation runbook →
          </a>
        </div>
      </div>
    </Container>
  )
}
