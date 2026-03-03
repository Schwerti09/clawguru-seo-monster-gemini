import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import { LEGAL_INFO } from "@/lib/constants"

export const metadata = {
  title: "AGB | ClawGuru Security Operations",
  description:
    "Allgemeine Geschäftsbedingungen für ClawGuru Security Operations: Runbooks, Darwinian Engine, Pro/Enterprise-Tiers, Haftung."
}

const glass =
  "backdrop-blur-md bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"

export default function AGBPage() {
  return (
    <Container>
      <div className="py-20 max-w-4xl mx-auto">
        <SectionTitle
          kicker="Rechtliches"
          title="Allgemeine Geschäftsbedingungen (AGB)"
          subtitle="Enterprise-Level AGB für ClawGuru Security Operations. Lesbar, konkret, ohne Juristendeutsch-Orgie. Stand: März 2026."
        />

        <div className="mt-10 space-y-6 text-gray-200 leading-relaxed">

          <section className={glass}>
            <h2 className="text-xl font-black text-white mb-3">1. Anbieter &amp; Kontakt</h2>
            <p className="text-gray-300">
              Anbieter dieses Dienstes ist <strong className="text-white">{LEGAL_INFO.company}</strong>.
            </p>
            <div className="mt-3 text-gray-300 space-y-1">
              <p>Inhaber: <strong className="text-white">{LEGAL_INFO.owner}</strong></p>
              <p>{LEGAL_INFO.address}, {LEGAL_INFO.city}</p>
              <p>
                E-Mail:{" "}
                <a className="text-cyan-300 hover:underline" href={`mailto:${LEGAL_INFO.email}`}>
                  {LEGAL_INFO.email}
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">2. Geltungsbereich</h2>
            <p className="text-gray-300">
              Diese AGB gelten für die Nutzung der Website clawguru.org und der angebotenen digitalen Leistungen,
              insbesondere: Security-Check, Runbooks, Darwinian Engine, Copilot-Funktionen (Gemini), digitale Downloads
              (PDF/ZIP) sowie kostenpflichtige Zugänge (Abo „Pro", Abo „Enterprise", „Day Pass").
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">3. Leistungsbeschreibung</h2>
            <ul className="mt-2 space-y-3 text-gray-300">
              <li className="flex gap-3">
                <span className="text-cyan-400 mt-0.5">&#9658;</span>
                <div>
                  <strong className="text-white">Security-Check:</strong> Heuristische Checks und Indikatoren
                  (kein vollumfängliches Penetration-Testing oder Audit).
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400 mt-0.5">&#9658;</span>
                <div>
                  <strong className="text-white">Runbooks:</strong> Schritt-für-Schritt-Anleitungen zur Fehlerbehebung
                  und Absicherung von Systemen. Inhalte werden laufend aktualisiert.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400 mt-0.5">&#9658;</span>
                <div>
                  <strong className="text-white">Darwinian Engine:</strong> Automatisiertes Threat-Intelligence-System,
                  das Bedrohungslagen aus externen Quellen aggregiert und bewertet. Ergebnisse sind Indikatoren,
                  keine garantierten Tatsachenfeststellungen.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400 mt-0.5">&#9658;</span>
                <div>
                  <strong className="text-white">Copilot (Gemini API):</strong> KI-basierter Assistent für
                  Security-Fragen und Ops-Workflows. Antworten sind assistive Vorschläge und werden eigenverantwortlich
                  vom Nutzer geprüft und umgesetzt.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400 mt-0.5">&#9658;</span>
                <div>
                  <strong className="text-white">Downloads:</strong> Digitale Inhalte (PDF/ZIP) für Ops/Security-Workflows,
                  z. B. Checklisten, Runbook-Bundles, Konfigurationsvorlagen.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400 mt-0.5">&#9658;</span>
                <div>
                  <strong className="text-white">Pro / Enterprise / Day Pass:</strong> Kostenpflichtige Zugangsstufen.
                  Pro: monatliches Abo. Enterprise: individuell vereinbarte Konditionen (Jahresvertrag, SLA, dedizierten
                  Support). Day Pass: Einmalerwerb, 24 Stunden Zugriff ab Aktivierung.
                </div>
              </li>
            </ul>
            <p className="mt-3 text-gray-500 text-sm">
              Wichtig: ClawGuru ist ein Informations- und Tool-Angebot. Es ersetzt keine professionelle Sicherheitsprüfung,
              kein Penetration-Testing und keine Rechtsberatung.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">4. Vertragsschluss</h2>
            <p className="text-gray-300">
              Kostenpflichtige Leistungen werden über Stripe Checkout erworben. Der Vertrag kommt zustande, sobald
              die Zahlung erfolgreich abgeschlossen ist und der Zugriff bzw. Download bereitgestellt wird.
              Enterprise-Verträge kommen durch gesonderte schriftliche Vereinbarung zustande.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">5. Preise &amp; Zahlung</h2>
            <p className="text-gray-300">
              Alle Preise werden auf der Pricing-Seite angezeigt (inkl. MwSt. für Verbraucher, sofern anfallend). Die
              Abwicklung erfolgt über Stripe. Nach erfolgreicher Zahlung erhältst du den Zugriff über einen Magic Link
              oder automatische Aktivierung. Enterprise-Preise werden individuell angefragt.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">6. Laufzeit, Verlängerung, Kündigung</h2>
            <ul className="mt-2 space-y-2 text-gray-300">
              <li className="flex gap-3">
                <span className="text-yellow-400 mt-0.5">&#9658;</span>
                <div>
                  <strong className="text-white">Pro:</strong> Monatliches Abo, automatische Verlängerung, solange nicht
                  gekündigt. Kündigung jederzeit zum Laufzeitende.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-yellow-400 mt-0.5">&#9658;</span>
                <div>
                  <strong className="text-white">Enterprise:</strong> Jahresvertrag mit individuell vereinbarten
                  Konditionen. SLA, dedizierten Support und Custom-Runbooks auf Anfrage.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-yellow-400 mt-0.5">&#9658;</span>
                <div>
                  <strong className="text-white">Day Pass:</strong> Einmalerwerb, Zugriff für 24 Stunden ab Aktivierung.
                  Keine Verlängerung.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-yellow-400 mt-0.5">&#9658;</span>
                <div>
                  <strong className="text-white">Kündigung:</strong> Über das Billing-Portal (im Dashboard) oder per
                  E-Mail an{" "}
                  <a className="text-cyan-300 hover:underline" href={`mailto:${LEGAL_INFO.email}`}>
                    {LEGAL_INFO.email}
                  </a>
                  .
                </div>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">7. Nutzungsrechte &amp; zulässige Nutzung</h2>
            <ul className="mt-2 space-y-2 text-gray-300 list-disc pl-6">
              <li>
                Die Inhalte, Runbooks und Downloads sind für die eigene Nutzung bzw. dein autorisiertes Team gedacht
                (bei Enterprise: gemäß vereinbarter Nutzerzahl/Seat-Lizenz).
              </li>
              <li>
                Weiterverkauf, öffentliche Veröffentlichung oder massenhaftes Scraping/Spiegeln der Inhalte ist
                untersagt, sofern nicht ausdrücklich schriftlich erlaubt.
              </li>
              <li>
                Missbrauch (z. B. Angriffe, Exploits, unbefugtes Scanning Dritter) ist untersagt. Nutze alle Tools
                ausschließlich für Systeme, die du kontrollierst oder für die du eine ausdrückliche schriftliche
                Erlaubnis des Systembetreibers besitzt.
              </li>
              <li>
                Die Darwinian Engine und zugehörige APIs dürfen nicht für automatisiertes Scraping oder
                Weiterverarbeitung in konkurrierenden Diensten genutzt werden.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">8. Verfügbarkeit &amp; Änderungen</h2>
            <p className="text-gray-300">
              Wir bemühen uns um hohe Verfügbarkeit. Wartungen, Updates oder Sicherheitsmaßnahmen können zeitweise zu
              Einschränkungen führen. Inhalte und Features dürfen weiterentwickelt werden (z. B. Runbook-Updates,
              neue Checks, neue Kits). Enterprise-Kunden erhalten bei geplanten Wartungsfenstern eine Vorabbenachrichtigung
              gemäß vereinbartem SLA.
            </p>
          </section>

          <section className={glass}>
            <h2 className="text-xl font-black text-white mb-3">9. Haftung</h2>
            <p className="text-gray-300">
              ClawGuru liefert Hinweise, Runbooks und Empfehlungen nach bestem Wissen und Gewissen – jedoch ohne
              Gewähr für Vollständigkeit, Richtigkeit oder Aktualität. Du setzt Maßnahmen eigenverantwortlich um.
            </p>
            <p className="mt-3 text-gray-300">
              Für Schäden haften wir nur bei Vorsatz und grober Fahrlässigkeit. Bei leichter Fahrlässigkeit haften
              wir nur bei Verletzung wesentlicher Vertragspflichten (Kardinalpflichten) und begrenzt auf den bei
              Vertragsschluss vorhersehbaren, vertragstypischen Schaden.
            </p>
            <p className="mt-3 text-gray-300">
              Zwingende gesetzliche Haftung (z. B. nach dem Produkthaftungsgesetz oder bei Verletzung von Leben,
              Körper oder Gesundheit) bleibt unberührt.
            </p>
            <p className="mt-3 text-gray-500 text-sm">
              Die Darwinian Engine und der Copilot liefern probabilistische Einschätzungen – keine Garantien.
              Sicherheitsentscheidungen auf Basis dieser Daten liegen vollständig in der Verantwortung des Nutzers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">10. Widerruf (Verbraucher)</h2>
            <p className="text-gray-300">
              Wenn du Verbraucher bist, kann dir grundsätzlich ein gesetzliches Widerrufsrecht (14 Tage ab
              Vertragsschluss) zustehen. Bei digitalen Inhalten und digitalen Dienstleistungen kann das
              Widerrufsrecht erlöschen, wenn die Ausführung vor Ablauf der Widerrufsfrist begonnen hat und du
              ausdrücklich zugestimmt hast. Details hängen von der Checkout-/Consent-Implementierung ab.
            </p>
            <p className="mt-3 text-gray-500 text-sm">
              Für maximale Rechtssicherheit: Aktiviere in Stripe Checkout die verpflichtende Zustimmung zu AGB/Datenschutz
              und (falls nötig) eine Einwilligung zum vorzeitigen Beginn der digitalen Leistung.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">11. Schlussbestimmungen</h2>
            <p className="text-gray-300">
              Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts (CISG). Gerichtsstand ist – soweit gesetzlich
              zulässig – der Sitz des Anbieters (Dornum, Deutschland). Sollten einzelne Bestimmungen dieser AGB ganz
              oder teilweise unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen hiervon unberührt.
            </p>
          </section>

          <p className="text-center text-xs text-gray-600">
            Stand: März 2026 · {LEGAL_INFO.company}
          </p>

        </div>
      </div>
    </Container>
  )
}
