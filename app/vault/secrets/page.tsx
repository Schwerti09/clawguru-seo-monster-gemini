import Container from "@/components/shared/Container"

export default function Secrets() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Was ist Secrets Hygiene?', acceptedAnswer: { '@type': 'Answer', text: 'Secrets Hygiene bezeichnet den sicheren Umgang mit sensiblen Zugangsdaten: API-Keys, Passworts, Zertifikaten, Tokens. Grundregeln: Nie Secrets in Git committen (.gitignore + pre-commit hooks), nie in Logs ausgeben, nie im Frontend-Code, regelmäßig rotieren, Least-Privilege (minimale Berechtigungen). GitGuardian scannt Repos automatisch auf geleakte Secrets.' } },
      { '@type': 'Question', name: 'Wie verhindere ich das Leaken von Secrets in Git?', acceptedAnswer: { '@type': 'Answer', text: 'Secrets-Leaks in Git verhindern: .env Dateien in .gitignore. Pre-commit Hook mit detect-secrets oder gitleaks installieren. GitGuardian Free Tier für automatischen Scan. git-secrets von AWS als Alternative. Falls Leak passiert: sofort Key rotieren, git history rewriten (git filter-repo), GitHub secret scanning alerts aktivieren. Gescannte History ist kein sicherer Ersatz für Rotation.' } },
      { '@type': 'Question', name: 'Welche Secret-Management-Tools gibt es für Self-Hosted?', acceptedAnswer: { '@type': 'Answer', text: 'Secret Management für Self-Hosted: HashiCorp Vault (Enterprise-Grade, kostenlos OSS). Doppler (Cloud, einfache Integration). Infisical (Open-Source Doppler-Alternative). Docker Swarm Secrets (einfach, nur für Swarm). Kubernetes Secrets (base64, nicht verschlüsselt — kombinieren mit SOPS oder Sealed Secrets). Environment-Variablen via Systemd EnvironmentFile für einfache Server.' } },
      { '@type': 'Question', name: 'Was tue ich wenn ein Secret geleakt ist?', acceptedAnswer: { '@type': 'Answer', text: 'Incident Playbook für Secrets-Leak: 1) Key sofort invalidieren/rotieren (Priorität 1, keine Diskussion). 2) Access Logs prüfen: wurde der Key genutzt? Von wem? Wann? 3) Betroffene Systeme und Daten identifizieren. 4) Stakeholder informieren. 5) Git History bereinigen (git filter-repo). 6) Neuen Key deployen. 7) Prozess verbessern: Pre-commit Hooks einführen.' } },
    ],
  }

  return (
    <Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="py-16 max-w-4xl mx-auto">
        <div className="text-xs uppercase tracking-widest text-brand-cyan/80">Vault</div>
        <h1 className="mt-2 text-4xl font-black">Secrets Hygiene</h1>
        <p className="mt-4 text-gray-300 text-lg">
          Secrets sind nicht „Konfiguration“. Sie sind Zugänge. Und Zugänge müssen rotieren können.
        </p>

        <div className="mt-10 space-y-6">
          <div className="p-6 rounded-2xl border border-gray-800 bg-black/30">
            <div className="font-black text-xl mb-2">Die 5 Regeln</div>
            <ol className="list-decimal pl-5 space-y-2 text-gray-300">
              <li>Keine Secrets im Repo. Punkt.</li>
              <li>Rotation ist ein Prozess, kein Event.</li>
              <li>Scope minimieren (least privilege).</li>
              <li>Audit Logs aktivieren.</li>
              <li>Incident: erst rotieren, dann aufräumen.</li>
            </ol>
          </div>

          <div className="p-6 rounded-2xl border border-gray-800 bg-black/30">
            <div className="font-black text-xl mb-2">Schnelltest</div>
            <p className="text-gray-300">
              Wenn ein Key nicht rotierbar ist, ist er ein Bug. Bau Rotation ein – bevor der Leak passiert.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a className="px-5 py-3 rounded-xl bg-brand-red/10 border border-brand-red/30 hover:bg-brand-red/15 font-bold" href="/security/notfall-leitfaden">
              Notfall: Rotation Reihenfolge
            </a>
            <a className="px-5 py-3 rounded-xl bg-black/30 border border-gray-700 hover:bg-black/40 font-bold" href="/academy">
              Sprint
            </a>
          </div>
        </div>
      </div>
    </Container>
  )
}
