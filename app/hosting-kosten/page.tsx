import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import AffiliateComparison from "@/components/marketing/AffiliateComparison"

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Was kostet Self-Hosting im Vergleich zu Cloud-Managed Services?', acceptedAnswer: { '@type': 'Answer', text: 'Self-Hosting Kosten vs. Managed: Hetzner CX22 (2 vCPU, 4GB RAM): ~4 EUR/Monat vs. vergleichbarer Managed Service: 30-80 EUR/Monat. Ersparnis: 60-90%. Versteckte Kosten beim Self-Hosting: Administrations-Zeit (2-4h/Monat), Security-Updates, Monitoring-Setup. Faustformel: Self-Hosting lohnt ab 3+ Services und vorhandenem DevOps-Know-how. Für einzelne Services oder Teams ohne Ops-Ressourcen: Managed ist oft günstiger (Opportunitätskosten).' } },
    { '@type': 'Question', name: 'Welche Hosting-Anbieter sind für DSGVO-konforme Self-Hosted Setups geeignet?', acceptedAnswer: { '@type': 'Answer', text: 'DSGVO-konforme Hosting-Anbieter: Hetzner (Deutschland): günstigste EU-Option, BSI C5, keine US-Exposition. Netcup (Deutschland): gutes Preis-Leistungs-Verhältnis. IONOS (Deutschland): Enterprise-Features, teurer. OVHcloud (Frankreich): große EU-Infrastruktur. Alle bieten: DPA (Auftragsverarbeitungsvertrag), EU-Rechenzentren, keine CLOUD-Act-Exposition. Nicht empfohlen für DSGVO-kritische Daten: AWS us-east, Google Cloud us, Azure East US.' } },
    { '@type': 'Question', name: 'Wie hoch sind die tatsächlichen Security-Kosten beim Self-Hosting?', acceptedAnswer: { '@type': 'Answer', text: 'Self-Hosting Security-Kosten: Laufende Kosten: Monitoring-Stack (Prometheus + Grafana): 0 EUR (Open Source) + ~2h Setup. Let\'s Encrypt TLS: 0 EUR. Automatische Security-Updates: 0 EUR (unattended-upgrades). ClawGuru Security Check: 0 EUR (kontinuierlich). Incident-Kosten bei Vernachlässigung: Datenverlust, Bußgelder (DSGVO: bis 4% Jahresumsatz), Reputation. ROI einer guten Security-Hygiene: positiv ab erstem verhinderten Incident.' } },
    { '@type': 'Question', name: 'Was sind die häufigsten versteckten Kosten beim Self-Hosting?', acceptedAnswer: { '@type': 'Answer', text: 'Versteckte Self-Hosting Kosten: Bandwidth bei Traffic-Spitzen (Hetzner: 20TB inkl., danach 1 EUR/TB). Storage für Backups (3-2-1 Regel: 3 Kopien). Snapshot-Kosten beim Provider. IP-Adressen (zusätzliche IPv4: ~1 EUR/Monat). Load Balancer für HA-Setup: 6-15 EUR/Monat. SSL-Zertifikate für Wildcard/EV: 50-500 EUR/Jahr (falls kein Let\'s Encrypt). Managed DNS für Failover. ClawGuru tipp: Budget 20% über dem Basis-Server-Preis für Infra-Extras.' } },
  ],
}

export default function Costs() {
  return (
    <Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="py-16">
        <SectionTitle
          kicker="Costs"
          title="Hosting & Kosten"
          subtitle="Infra ist billig. Incidents sind teuer. Zeit ist die teuerste Währung."
        />

        <div className="grid lg:grid-cols-3 gap-4 mb-12">
          {[
            ["Infra", "VPS/Cloud, Storage, Netzwerk, Backups"],
            ["Betrieb", "Monitoring, Updates, On-Call, Incidents"],
            ["Risiko", "Leaks, Datenabfluss, Reputationsschaden"]
          ].map(([t, d]) => (
            <div key={t} className="p-6 rounded-2xl border border-gray-800 bg-black/30">
              <div className="font-black text-xl mb-2">{t}</div>
              <div className="text-gray-300">{d}</div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-black mb-4">Provider Vergleich</h2>
        <AffiliateComparison />

        <div className="mt-12 p-7 rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900/60 to-black">
          <div className="font-black text-2xl">Wenn du nicht basteln willst</div>
          <p className="mt-2 text-gray-300">
            Managed Ops ist oft günstiger als der erste Incident. (Ja, zynisch. Ja, wahr.)
          </p>
          <div className="mt-5">
            <a className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-orange to-brand-red hover:opacity-90 font-black" href="https://clawsyndicate.com?ref=clawguru_costs">
              Managed Ops ansehen
            </a>
          </div>
        </div>
      </div>
    </Container>
  )
}
