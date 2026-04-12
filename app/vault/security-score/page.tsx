import Container from "@/components/shared/Container"

export default function SecurityScoreVault() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Was ist der ClawGuru Security Score?', acceptedAnswer: { '@type': 'Answer', text: 'Der ClawGuru Security Score ist eine heuristische Risiko-Einschätzung für Self-Hosted und Cloud-Infrastruktur. Er analysiert: HTTP Security Headers, TLS-Konfiguration, offene Ports, Authentifizierungs-Konfiguration und bekannte Schwachstellen. Score 0-100: unter 60 = kritisch, 60-80 = verbesserungswürdig, 80-95 = gut, 95+ = exzellent.' } },
      { '@type': 'Question', name: 'Wie verbessere ich meinen Security Score auf 95+?', acceptedAnswer: { '@type': 'Answer', text: 'Security Score 95+ erreichen: 1) Private Networking als Default (keine Bind-All Ports). 2) HTTPS überall mit korrekten Security Headers (HSTS, CSP, X-Frame-Options). 3) Secrets Rotation + kurze Token TTL. 4) Origin Allowlist für WebSockets und Callbacks. 5) Monitoring: Auth-Fails, Anomalien, Request-Rates. 6) Backups mit Restore-Test. 7) Dependency Updates automatisieren.' } },
      { '@type': 'Question', name: 'Wofür eignet sich der Security Score?', acceptedAnswer: { '@type': 'Answer', text: 'Security Score Anwendungsfälle: Startpunkt für Priorisierung (Welche 3 Maßnahmen zuerst?). Kommunikations-Asset für Team und Management (Score + Runbook teilen). Regelmäßiges Ritual: Check → Sprint → Re-Check. Vor/nach Infrastrukturänderungen. Vendor Security Assessments (Kunden fragen oft nach Security-Nachweis). Wichtig: Score ist Heuristik, kein Pentest-Ersatz.' } },
      { '@type': 'Question', name: 'Was ist der Unterschied zwischen Security Score und Penetrationstest?', acceptedAnswer: { '@type': 'Answer', text: 'Security Score vs. Pentest: Score = automatisierter Check bekannter Schwachstellenmuster, sekunden-schnell, kontinuierlich einsetzbar, kostenlos/günstig. Pentest = manueller Test durch Sicherheitsexperten, sucht unbekannte Schwachstellen durch kreative Angriffspfade, dauert Tage/Wochen, kostet 5.000-50.000 EUR. Ideal: Regelmäßiger Score-Check + jährlicher Pentest für kritische Systeme.' } },
    ],
  }

  return (
    <Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="py-16 max-w-4xl mx-auto">
        <div className="text-xs uppercase tracking-widest text-brand-cyan/80">Vault</div>
        <h1 className="mt-2 text-4xl font-black">Claw Security Score</h1>
        <p className="mt-4 text-gray-300 text-lg leading-relaxed">
          Der Score ist eine <strong>heuristische Risiko-Einschätzung</strong>. Er sagt: „Wie wahrscheinlich ist es,
          dass du gerade in typische Fallen läufst?“ — nicht: „Du bist sicher.“
        </p>

        <div className="mt-8 p-6 rounded-3xl border border-gray-800 bg-black/30">
          <h2 className="text-2xl font-black">Wofür er gut ist</h2>
          <ul className="mt-4 space-y-3 text-gray-300">
            <li><span className="text-cyan-300 font-bold">•</span> Als Startpunkt: Welche 3 Dinge zuerst?</li>
            <li><span className="text-cyan-300 font-bold">•</span> Als Kommunikations-Asset: Score + Runbook teilen</li>
            <li><span className="text-cyan-300 font-bold">•</span> Als Ritual: Check → Sprint → Re-Check</li>
          </ul>
        </div>

        <div className="mt-8 p-6 rounded-3xl border border-gray-800 bg-black/30">
          <h2 className="text-2xl font-black">Wie du 95+ erreichst</h2>
          <ol className="mt-4 space-y-3 text-gray-300 list-decimal pl-6">
            <li><strong>Private Networking</strong> als Default (keine Bind-All Ports)</li>
            <li><strong>Secrets Rotation</strong> + kurze Token TTL</li>
            <li><strong>Origin Allowlist</strong> (WebSocket/Callback)</li>
            <li><strong>Monitoring</strong>: Auth-Fails, Anomalien, Requests/min</li>
            <li><strong>Backups + Restore-Test</strong> (sonst ist es kein Backup)</li>
          </ol>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <a href="/check" className="px-6 py-3 rounded-2xl font-black bg-gradient-to-r from-orange-500 to-red-600 hover:opacity-90">
            Score checken →
          </a>
          <a href="/academy" className="px-6 py-3 rounded-2xl border border-gray-700 hover:border-gray-500 font-bold text-gray-200">
            30-Min Sprint →
          </a>
          <a href="/copilot" className="px-6 py-3 rounded-2xl border border-gray-700 hover:border-gray-500 font-bold text-gray-200">
            Copilot →
          </a>
        </div>
      </div>
    </Container>
  )
}
