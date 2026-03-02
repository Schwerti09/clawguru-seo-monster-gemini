import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import { LEGAL_INFO } from "@/lib/constants"
import { getLegalLocale } from "@/lib/legal"

export const metadata = {
  title: "AGB | ClawGuru",
  description:
    "Allgemeine Geschäftsbedingungen für ClawGuru (SaaS-Zugang, Day Pass, Downloads, Copilot)."
}

/**
 * Hinweis: Diese AGB sind ein sauberes, praxisnahes Template.
 * Bitte einmal kurz juristisch gegenchecken lassen, weil Details (Widerruf/Consent, B2C/B2B, Support-Level)
 * je nach konkreter Umsetzung variieren.
 */
export default function AGBPage() {
  const locale = getLegalLocale()
  const isGerman = locale === "de"
  return (
    <Container>
      <div className="py-16 max-w-4xl mx-auto">
        <SectionTitle
          kicker={isGerman ? "Rechtliches" : "Legal"}
          title={isGerman ? "Allgemeine Geschäftsbedingungen (AGB)" : "Terms and Conditions (T&C)"}
          subtitle={
            isGerman
              ? "Lesbar, konkret, ohne Juristendeutsch-Orgie. Stand: Februar 2026."
              : "Clear, practical terms for ClawGuru services. Updated February 2026."
          }
        />

        <div className="mt-10 space-y-10 text-gray-200 leading-relaxed">
          <section className="p-6 rounded-3xl border border-gray-800 bg-black/25">
            <h2 className="text-2xl font-black">
              {isGerman ? "1. Anbieter & Kontakt" : "1. Provider & Contact"}
            </h2>
            <p className="mt-3 text-gray-300">
              {isGerman ? (
                <>
                  Anbieter dieses Dienstes ist <strong>{LEGAL_INFO.company}</strong> (Inhaber:{" "}
                  <strong>{LEGAL_INFO.owner}</strong>), {LEGAL_INFO.address}, {LEGAL_INFO.city}. Kontakt:{" "}
                  <a className="text-cyan-300 hover:underline" href={`mailto:${LEGAL_INFO.email}`}>
                    {LEGAL_INFO.email}
                  </a>
                  .
                </>
              ) : (
                <>
                  This service is provided by <strong>{LEGAL_INFO.company}</strong> (owner:{" "}
                  <strong>{LEGAL_INFO.owner}</strong>), {LEGAL_INFO.address}, {LEGAL_INFO.city}. Contact:{" "}
                  <a className="text-cyan-300 hover:underline" href={`mailto:${LEGAL_INFO.email}`}>
                    {LEGAL_INFO.email}
                  </a>
                  .
                </>
              )}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">
              {isGerman ? "2. Geltungsbereich" : "2. Scope"}
            </h2>
            <p className="mt-3 text-gray-300">
              {isGerman
                ? "Diese AGB gelten für die Nutzung der Website und der angebotenen digitalen Leistungen von ClawGuru, insbesondere: Security-Check, Runbooks, Copilot-Funktionen, digitale Downloads (PDF/ZIP) sowie kostenpflichtige Zugänge (Abo „Pro“, Abo „Team Pro“, „Day Pass“)."
                : "These terms apply to the ClawGuru website and digital services, including security checks, runbooks, copilot features, digital downloads (PDF/ZIP), and paid access (Pro, Team Pro, Day Pass)."}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">
              {isGerman ? "3. Leistungsbeschreibung" : "3. Service description"}
            </h2>
            <ul className="mt-3 space-y-2 text-gray-300 list-disc pl-6">
              <li>
                <strong>{isGerman ? "Security-Check" : "Security check"}:</strong>{" "}
                {isGerman
                  ? "heuristische Checks/Indikatoren (kein vollumfängliches Audit)."
                  : "heuristic checks/indicators (not a full audit)."}
              </li>
              <li>
                <strong>Runbooks:</strong>{" "}
                {isGerman
                  ? "Schritt-für-Schritt-Anleitungen zur Fehlerbehebung / Absicherung."
                  : "step-by-step remediation and hardening guides."}
              </li>
              <li>
                <strong>Copilot:</strong>{" "}
                {isGerman
                  ? "assistive Vorschläge (optional KI-basiert), die du eigenverantwortlich prüfst."
                  : "assistive suggestions (optionally AI-based) that you review independently."}
              </li>
              <li>
                <strong>{isGerman ? "Downloads" : "Downloads"}:</strong>{" "}
                {isGerman
                  ? "digitale Inhalte (PDF/ZIP) für Ops/Security-Workflows."
                  : "digital content (PDF/ZIP) for Ops/Security workflows."}
              </li>
              <li>
                <strong>Pro/Team/Day Pass:</strong>{" "}
                {isGerman
                  ? "zeitlich begrenzter Zugriff auf Pro-Bereiche (Dashboard, Kits etc.)."
                  : "time-limited access to pro areas (dashboard, kits, etc.)."}
              </li>
            </ul>
            <p className="mt-3 text-gray-400 text-sm">
              {isGerman
                ? "Wichtig: ClawGuru ist ein Informations- und Tool-Angebot. Es ersetzt keine professionelle Sicherheitsprüfung, kein Penetration-Testing und keine Rechtsberatung."
                : "Important: ClawGuru is an information and tooling service. It does not replace professional security audits, penetration testing, or legal advice."}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">
              {isGerman ? "4. Vertragsschluss" : "4. Contract formation"}
            </h2>
            <p className="mt-3 text-gray-300">
              {isGerman
                ? "Kostenpflichtige Leistungen werden über Stripe Checkout erworben. Der Vertrag kommt zustande, sobald die Zahlung erfolgreich abgeschlossen ist und dir der Zugriff bzw. Download bereitgestellt wird."
                : "Paid services are purchased via Stripe Checkout. The contract is concluded once payment succeeds and access or download is provided."}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">
              {isGerman ? "5. Preise & Zahlung" : "5. Pricing & payment"}
            </h2>
            <p className="mt-3 text-gray-300">
              {isGerman
                ? "Alle Preise werden auf der Pricing-Seite angezeigt. Die Abwicklung erfolgt über Stripe. Du erhältst den Zugriff nach erfolgreicher Zahlung über den Success-Link (Aktivierung)."
                : "All prices are shown on the pricing page. Payments are processed via Stripe. Access is granted after successful payment via the success link."}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">
              {isGerman ? "6. Laufzeit, Verlängerung, Kündigung" : "6. Term, renewal, cancellation"}
            </h2>
            <ul className="mt-3 space-y-2 text-gray-300 list-disc pl-6">
              <li>
                <strong>Pro/Team Pro:</strong>{" "}
                {isGerman
                  ? "monatliches Abo, automatische Verlängerung, solange nicht gekündigt."
                  : "monthly subscription, auto-renews until canceled."}
              </li>
              <li>
                <strong>Day Pass:</strong>{" "}
                {isGerman
                  ? "einmaliger Kauf, Zugriff für 24 Stunden ab Aktivierung."
                  : "one-time purchase, access for 24 hours after activation."}
              </li>
              <li>
                <strong>{isGerman ? "Kündigung" : "Cancellation"}:</strong>{" "}
                {isGerman ? "über das Billing-Portal (im Dashboard) oder per E-Mail an " : "via the billing portal (dashboard) or by email to "}
                <a className="text-cyan-300 hover:underline" href={`mailto:${LEGAL_INFO.email}`}>
                  {LEGAL_INFO.email}
                </a>
                .
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black">
              {isGerman ? "7. Nutzungsrechte & zulässige Nutzung" : "7. Usage rights & permitted use"}
            </h2>
            <ul className="mt-3 space-y-2 text-gray-300 list-disc pl-6">
              <li>
                {isGerman
                  ? "Die Inhalte/Runbooks/Downloads sind für deine eigene Nutzung bzw. dein Team gedacht."
                  : "Content/runbooks/downloads are for your own use or your team."}
              </li>
              <li>
                {isGerman
                  ? "Weiterverkauf, öffentliche Veröffentlichung oder massenhaftes Scraping/Spiegeln der Inhalte ist untersagt, sofern nicht ausdrücklich schriftlich erlaubt."
                  : "Resale, public redistribution, or large-scale scraping/mirroring is prohibited unless explicitly permitted in writing."}
              </li>
              <li>
                {isGerman
                  ? "Missbrauch (z. B. Angriffe, Exploits, unbefugtes Scanning Dritter) ist untersagt. Nutze die Tools nur für Systeme, die du kontrollierst oder für die du eine ausdrückliche Erlaubnis hast."
                  : "Abuse (e.g., attacks, exploits, unauthorized scanning of third parties) is prohibited. Use the tools only for systems you control or have explicit permission to test."}
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black">
              {isGerman ? "8. Verfügbarkeit & Änderungen" : "8. Availability & changes"}
            </h2>
            <p className="mt-3 text-gray-300">
              {isGerman
                ? "Wir bemühen uns um hohe Verfügbarkeit. Wartungen, Updates oder Sicherheitsmaßnahmen können zeitweise zu Einschränkungen führen. Inhalte und Features dürfen weiterentwickelt werden (z. B. Runbook-Updates, neue Checks, neue Kits)."
                : "We strive for high availability. Maintenance, updates, or security measures may temporarily restrict access. Content and features may evolve (e.g., runbook updates, new checks, new kits)."}
            </p>
          </section>

          <section className="p-6 rounded-3xl border border-gray-800 bg-black/25">
            <h2 className="text-2xl font-black">
              {isGerman ? "9. Haftung" : "9. Liability"}
            </h2>
            <p className="mt-3 text-gray-300">
              {isGerman
                ? "ClawGuru liefert Hinweise und Empfehlungen nach bestem Wissen, jedoch ohne Gewähr. Du setzt Maßnahmen eigenverantwortlich um. Für Schäden haften wir nur bei Vorsatz und grober Fahrlässigkeit; bei leichter Fahrlässigkeit nur bei Verletzung wesentlicher Vertragspflichten und begrenzt auf den vorhersehbaren Schaden. Zwingende gesetzliche Haftung (z. B. Produkthaftung) bleibt unberührt."
                : "ClawGuru provides guidance to the best of our knowledge without warranty. You implement actions at your own risk. Liability applies only for intent and gross negligence; for minor negligence only in case of breach of essential contractual obligations and limited to foreseeable damage. Mandatory statutory liability (e.g., product liability) remains unaffected."}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">
              {isGerman ? "10. Widerruf (Verbraucher)" : "10. Right of withdrawal (consumers)"}
            </h2>
            <p className="mt-3 text-gray-300">
              {isGerman
                ? "Wenn du Verbraucher bist, kann dir grundsätzlich ein gesetzliches Widerrufsrecht zustehen. Bei digitalen Inhalten bzw. digitalen Dienstleistungen kann das Widerrufsrecht unter bestimmten Voraussetzungen erlöschen, wenn die Ausführung vor Ablauf der Widerrufsfrist beginnt und du ausdrücklich zustimmst. Details hängen von der konkreten Checkout-/Consent-Implementierung ab."
                : "If you are a consumer, you may have a statutory right of withdrawal. For digital content/services, this right may expire under certain conditions if performance starts before the withdrawal period ends and you explicitly agree. Details depend on the checkout/consent implementation."}
            </p>
            <p className="mt-3 text-gray-400 text-sm">
              {isGerman
                ? "Praktischer Hinweis: Wenn du maximale Rechtssicherheit willst, aktiviere in Stripe Checkout die verpflichtende Zustimmung zu den AGB/Datenschutz und (falls nötig) eine ausdrückliche Zustimmung zum vorzeitigen Beginn."
                : "Practical note: For maximum legal certainty, require explicit consent to these terms/privacy in Stripe Checkout and, if needed, consent to early performance."}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">
              {isGerman ? "11. Schlussbestimmungen" : "11. Final provisions"}
            </h2>
            <p className="mt-3 text-gray-300">
              {isGerman
                ? "Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Gerichtsstand ist – soweit zulässig – der Sitz des Anbieters. Sollten einzelne Bestimmungen unwirksam sein, bleibt der Vertrag im Übrigen wirksam."
                : "German law applies, excluding the UN Convention on Contracts for the International Sale of Goods. Jurisdiction is the provider's registered location where legally permissible. If any provision is invalid, the remainder of the contract remains effective."}
            </p>
          </section>
        </div>
      </div>
    </Container>
  )
}
