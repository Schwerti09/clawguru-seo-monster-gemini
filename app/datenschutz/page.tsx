import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import { LEGAL_INFO } from "@/lib/constants"
import { getLegalLocale } from "@/lib/legal"

export const metadata = {
  title: "Datenschutz | ClawGuru",
  description:
    "Datenschutzerklärung (DSGVO) für ClawGuru: Hosting, Stripe-Zahlungen, Access-Cookies, Copilot (optional KI)."
}

/**
 * Hinweis: Datenschutzerklärung muss zur tatsächlichen Datenverarbeitung passen.
 * Diese Version ist bewusst „minimal & wahr“ gehalten (ohne Analytics/Tracking-Behauptungen).
 * Wenn du später Analytics, Newsletter, Discord-Bots etc. ergänzt: hier nachziehen.
 */
export default function DatenschutzPage() {
  const locale = getLegalLocale()
  const isGerman = locale === "de"
  return (
    <Container>
      <div className="py-16 max-w-4xl mx-auto">
        <SectionTitle
          kicker={isGerman ? "DSGVO" : "Privacy"}
          title={isGerman ? "Datenschutzerklärung" : "Privacy Policy"}
          subtitle={
            isGerman
              ? "Kurz, sauber, und auf das ausgerichtet, was die Seite wirklich tut."
              : "Clear and focused on the data this site actually processes."
          }
        />

        <div className="mt-10 space-y-10 text-gray-200 leading-relaxed">
          <section className="p-6 rounded-3xl border border-gray-800 bg-black/25">
            <h2 className="text-2xl font-black">
              {isGerman ? "1. Verantwortlicher" : "1. Data controller"}
            </h2>
            <p className="mt-3 text-gray-300">
              {isGerman ? (
                <>
                  Verantwortlich für die Datenverarbeitung ist <strong>{LEGAL_INFO.company}</strong> (Inhaber:{" "}
                  <strong>{LEGAL_INFO.owner}</strong>), {LEGAL_INFO.address}, {LEGAL_INFO.city}. Kontakt:{" "}
                  <a className="text-cyan-300 hover:underline" href={`mailto:${LEGAL_INFO.email}`}>
                    {LEGAL_INFO.email}
                  </a>
                  .
                </>
              ) : (
                <>
                  The data controller is <strong>{LEGAL_INFO.company}</strong> (owner:{" "}
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
              {isGerman ? "2. Welche Daten verarbeiten wir?" : "2. What data do we process?"}
            </h2>
            <ul className="mt-3 space-y-2 text-gray-300 list-disc pl-6">
              <li>
                <strong>{isGerman ? "Server-/Zugriffslogs (Hosting)" : "Server/access logs (hosting)"}:</strong>{" "}
                {isGerman
                  ? "technisch notwendige Daten wie IP-Adresse, Zeitpunkt, URL, User-Agent, Referrer (je nach Hosting/CDN)."
                  : "technical data such as IP address, timestamp, URL, user agent, referrer (depending on hosting/CDN)."}
              </li>
              <li>
                <strong>{isGerman ? "Security-Check Eingaben" : "Security check inputs"}:</strong>{" "}
                {isGerman
                  ? "Zielangaben (z. B. Domain/IP/URL), die du im Check eingibst. Diese werden zur Ergebnisberechnung verarbeitet. Wir speichern Check-Eingaben nicht als Nutzerprofil."
                  : "target inputs (e.g., domain/IP/URL) provided in the check. They are processed to calculate results. We do not store check inputs as a user profile."}
              </li>
              <li>
                <strong>{isGerman ? "Access-Cookie" : "Access cookie"}:</strong>{" "}
                {isGerman
                  ? "Nach Kauf setzen wir ein technisch notwendiges Cookie (claw_access), das einen signierten Zugriffstoken enthält (Plan, Ablaufzeit, Stripe Customer-ID)."
                  : "After purchase we set a necessary cookie (claw_access) containing a signed access token (plan, expiry, Stripe customer ID)."}
              </li>
              <li>
                <strong>{isGerman ? "Zahlungsdaten" : "Payment data"}:</strong>{" "}
                {isGerman
                  ? "Die Zahlung wird über Stripe abgewickelt. Zahlungsdaten (z. B. Karte/IBAN) werden von Stripe verarbeitet – wir erhalten typischerweise nur Status/IDs (z. B. Customer/Subscription)."
                  : "Payments are processed by Stripe. Payment data (e.g., card/IBAN) is handled by Stripe; we typically receive only status/IDs (e.g., customer/subscription)."}
              </li>
              <li>
                <strong>{isGerman ? "Kontakt" : "Contact"}:</strong>{" "}
                {isGerman
                  ? "Wenn du uns per E-Mail kontaktierst, verarbeiten wir die von dir gesendeten Angaben."
                  : "If you contact us by email, we process the details you provide."}
              </li>
              <li>
                <strong>{isGerman ? "Copilot (optional)" : "Copilot (optional)"}:</strong>{" "}
                {isGerman
                  ? "Wenn KI-Funktionen aktiv sind, können Texteingaben zur Generierung von Antworten an den KI-Dienst übertragen werden."
                  : "If AI features are active, text inputs may be sent to the AI provider to generate responses."}
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black">
              {isGerman ? "3. Zwecke & Rechtsgrundlagen" : "3. Purposes & legal bases"}
            </h2>
            <ul className="mt-3 space-y-2 text-gray-300 list-disc pl-6">
              <li>
                <strong>{isGerman ? "Bereitstellung der Website & Sicherheit" : "Website delivery & security"}</strong>{" "}
                {isGerman
                  ? "(Logs, Abwehr von Angriffen) – berechtigtes Interesse."
                  : "(logs, attack mitigation) – legitimate interest."}
              </li>
              <li>
                <strong>{isGerman ? "Vertragserfüllung" : "Contract performance"}</strong>{" "}
                {isGerman
                  ? "(Zugang, Day Pass, Abos, Downloads, Billing-Portal) – Vertrag/vorvertragliche Maßnahmen."
                  : "(access, day pass, subscriptions, downloads, billing portal) – contract/pre-contract steps."}
              </li>
              <li>
                <strong>{isGerman ? "Support/Kommunikation" : "Support/communication"}</strong>{" "}
                {isGerman ? "(E-Mail) – Vertrag oder berechtigtes Interesse." : "(email) – contract or legitimate interest."}
              </li>
              <li>
                <strong>KI-Copilot</strong> –{" "}
                {isGerman ? "je nach Implementierung Vertrag oder Einwilligung." : "depending on implementation, contract or consent."}
              </li>
            </ul>
            <p className="mt-3 text-gray-400 text-sm">
              {isGerman
                ? "Hinweis: Die konkrete Rechtsgrundlage hängt von deiner Nutzung (B2C/B2B), den aktivierten Features und dem Hosting-Setup ab."
                : "Note: The specific legal basis depends on your use (B2C/B2B), enabled features, and hosting setup."}
            </p>
          </section>

          <section className="p-6 rounded-3xl border border-gray-800 bg-black/25">
            <h2 className="text-2xl font-black">
              {isGerman ? "4. Empfänger / Drittanbieter" : "4. Recipients / third parties"}
            </h2>
            <ul className="mt-3 space-y-2 text-gray-300 list-disc pl-6">
              <li>
                <strong>Hosting/CDN:</strong>{" "}
                {isGerman
                  ? "Je nach Deployment z. B. Netlify oder Vercel (Auslieferung der Website, Serverless-Funktionen)."
                  : "Depending on deployment, e.g., Netlify or Vercel (website delivery, serverless functions)."}
              </li>
              <li>
                <strong>Stripe:</strong>{" "}
                {isGerman
                  ? "Zahlungsabwicklung, Rechnungen, Abo-Management, Billing-Portal."
                  : "Payment processing, invoices, subscription management, billing portal."}
              </li>
              <li>
                <strong>{isGerman ? "KI-Provider (optional)" : "AI providers (optional)"}:</strong>{" "}
                {isGerman
                  ? "z. B. OpenAI (nur wenn KI-Funktionen aktiv sind)."
                  : "e.g., OpenAI (only when AI features are enabled)."}
              </li>
            </ul>
            <p className="mt-3 text-gray-400 text-sm">
              {isGerman
                ? "Wenn Anbieter außerhalb der EU/des EWR sitzen, können Übermittlungen in Drittländer stattfinden. In solchen Fällen werden geeignete Schutzmaßnahmen (z. B. Standardvertragsklauseln) genutzt – soweit vom Anbieter bereitgestellt."
                : "If providers are located outside the EU/EEA, transfers to third countries may occur. In such cases, appropriate safeguards (e.g., standard contractual clauses) are used when provided."}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">{isGerman ? "5. Cookies" : "5. Cookies"}</h2>
            <p className="mt-3 text-gray-300">
              {isGerman ? (
                <>
                  Wir setzen primär technisch notwendige Cookies. Das wichtigste ist <code>claw_access</code>, damit du nach dem
                  Kauf Zugriff auf Pro/Team/Day Pass erhältst. Dieses Cookie ist <strong>httpOnly</strong> (nicht via JS
                  auslesbar) und wird automatisch nach Ablauf ungültig.
                </>
              ) : (
                <>
                  We primarily use technically necessary cookies. The key one is <code>claw_access</code> so you can access
                  Pro/Team/Day Pass after purchase. This cookie is <strong>httpOnly</strong> (not readable via JS) and expires
                  automatically.
                </>
              )}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">
              {isGerman ? "6. Speicherdauer" : "6. Retention"}
            </h2>
            <p className="mt-3 text-gray-300">
              {isGerman
                ? "Logs werden je nach Hosting-Anbieter für einen begrenzten Zeitraum gespeichert. Access-Tokens laufen automatisch ab. Vertrags-/Zahlungsdaten werden im Rahmen der gesetzlichen Aufbewahrungspflichten verarbeitet (typischerweise bei Stripe)."
                : "Logs are stored for a limited period depending on hosting. Access tokens expire automatically. Contract/payment data is processed according to legal retention obligations (typically by Stripe)."}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">
              {isGerman ? "7. Deine Rechte" : "7. Your rights"}
            </h2>
            <ul className="mt-3 space-y-2 text-gray-300 list-disc pl-6">
              {isGerman ? (
                <>
                  <li>Auskunft, Berichtigung, Löschung</li>
                  <li>Einschränkung der Verarbeitung</li>
                  <li>Datenübertragbarkeit</li>
                  <li>Widerspruch gegen Verarbeitung aus berechtigtem Interesse</li>
                  <li>Beschwerde bei einer Aufsichtsbehörde</li>
                </>
              ) : (
                <>
                  <li>Access, rectification, deletion</li>
                  <li>Restriction of processing</li>
                  <li>Data portability</li>
                  <li>Objection to processing based on legitimate interest</li>
                  <li>Complaint to a supervisory authority</li>
                </>
              )}
            </ul>
            <p className="mt-3 text-gray-300">
              {isGerman ? "Schreibe uns dazu an " : "Contact us at "}
              <a className="text-cyan-300 hover:underline" href={`mailto:${LEGAL_INFO.email}`}>
                {LEGAL_INFO.email}
              </a>
              .
            </p>
          </section>

          <section className="p-6 rounded-3xl border border-gray-800 bg-black/25">
            <h2 className="text-2xl font-black">
              {isGerman ? "8. Sicherheitsmaßnahmen" : "8. Security measures"}
            </h2>
            <p className="mt-3 text-gray-300">
              {isGerman
                ? "Wir setzen angemessene technische und organisatorische Maßnahmen ein (z. B. TLS/HTTPS, Zugriffskontrollen, signierte Tokens). Dennoch gilt: 100% Sicherheit existiert nicht – deshalb gibt es ClawGuru."
                : "We implement appropriate technical and organizational measures (e.g., TLS/HTTPS, access controls, signed tokens). Still, 100% security does not exist — which is why ClawGuru exists."}
            </p>
          </section>
        </div>
      </div>
    </Container>
  )
}
