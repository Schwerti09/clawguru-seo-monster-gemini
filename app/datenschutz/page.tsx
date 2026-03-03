import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import { LEGAL_INFO } from "@/lib/constants"

export const metadata = {
  title: "Datenschutz | ClawGuru Security Operations",
  description:
    "Datenschutzerklärung (DSGVO) für ClawGuru Security Operations: User-Accounts, Magic Links, Stripe, Gemini API, Resend, Cookies."
}

const glass =
  "backdrop-blur-md bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"

export default function DatenschutzPage() {
  return (
    <Container>
      <div className="py-20 max-w-4xl mx-auto">
        <SectionTitle
          kicker="DSGVO"
          title="Datenschutzerklärung"
          subtitle="Transparent, vollständig und auf das ausgerichtet, was ClawGuru Security Operations wirklich tut."
        />

        <div className="mt-10 space-y-6 text-gray-200 leading-relaxed">

          <section className={glass}>
            <h2 className="text-xl font-black text-white mb-3">1. Verantwortlicher</h2>
            <p className="text-gray-300">
              Verantwortlich für die Datenverarbeitung auf dieser Website ist:
            </p>
            <div className="mt-3 text-gray-300 space-y-1">
              <p className="text-white font-semibold">{LEGAL_INFO.company}</p>
              <p>{LEGAL_INFO.address}</p>
              <p>{LEGAL_INFO.city}</p>
              <p>Telefon: {LEGAL_INFO.phone}</p>
              <p>
                E-Mail:{" "}
                <a className="text-cyan-300 hover:underline" href={`mailto:${LEGAL_INFO.email}`}>
                  {LEGAL_INFO.email}
                </a>
              </p>
            </div>
          </section>

          <section className={glass}>
            <h2 className="text-xl font-black text-white mb-3">2. Welche Daten verarbeiten wir?</h2>
            <ul className="mt-2 space-y-3 text-gray-300 list-none">
              <li className="flex gap-3">
                <span className="text-cyan-400 mt-0.5">&#9658;</span>
                <div>
                  <strong className="text-white">Server-/Zugriffslogs (Hosting):</strong> technisch notwendige Daten wie
                  IP-Adresse, Zeitpunkt, URL, User-Agent, Referrer (je nach Hosting/CDN: Netlify oder Vercel).
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400 mt-0.5">&#9658;</span>
                <div>
                  <strong className="text-white">User-Accounts (Magic Link):</strong> Zur Anmeldung nutzen wir passwortlose
                  Magic Links. Dabei wird deine E-Mail-Adresse gespeichert, um dir einen einmaligen Login-Link zuzusenden.
                  Der Link ist 15 Minuten gültig. E-Mails werden über <strong>Resend</strong> (resend.com) versandt;
                  Resend verarbeitet dabei die Empfänger-E-Mail-Adresse als Auftragsverarbeiter.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400 mt-0.5">&#9658;</span>
                <div>
                  <strong className="text-white">Access-Cookie / Auth-Token:</strong> Nach erfolgreicher Anmeldung setzen
                  wir ein <code>claw_access</code>-Cookie (httpOnly, Secure, SameSite=Lax), das einen signierten JWT enthält
                  (Plan, Ablaufzeit, ggf. Stripe Customer-ID). Es ist nicht via JavaScript auslesbar.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400 mt-0.5">&#9658;</span>
                <div>
                  <strong className="text-white">Security-Check Eingaben:</strong> Domain, IP oder URL, die du für einen
                  Check eingibst. Diese werden zur Ergebnisberechnung verarbeitet. Wir speichern Check-Eingaben nicht als
                  dauerhaftes Nutzerprofil.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400 mt-0.5">&#9658;</span>
                <div>
                  <strong className="text-white">Zahlungsdaten (Stripe):</strong> Zahlungen werden vollständig über Stripe
                  abgewickelt. Zahlungsdaten (Karte, SEPA, etc.) werden ausschließlich von Stripe verarbeitet. Wir erhalten
                  nur Status-/IDs (Customer-ID, Subscription-ID, Checkout-Session).
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400 mt-0.5">&#9658;</span>
                <div>
                  <strong className="text-white">KI-Assistent / Gemini API:</strong> Wenn du den Copilot oder KI-Features
                  nutzt, können deine Texteingaben zur Generierung von Antworten an die Google Gemini API übertragen
                  werden. Wir senden dabei keine personenbezogenen Kontodaten, sondern nur den jeweiligen Prompt-Inhalt.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400 mt-0.5">&#9658;</span>
                <div>
                  <strong className="text-white">Transaktionale E-Mails (Resend):</strong> Magic Links, Onboarding-
                  Sequenzen und Support-Antworten werden über Resend versandt. Resend verarbeitet als Auftragsverarbeiter
                  (DPA verfügbar unter resend.com) die jeweilige E-Mail-Adresse.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400 mt-0.5">&#9658;</span>
                <div>
                  <strong className="text-white">Kontakt:</strong> Wenn du uns per E-Mail kontaktierst, verarbeiten wir
                  die von dir gesendeten Angaben zur Bearbeitung deiner Anfrage.
                </div>
              </li>
            </ul>
          </section>

          <section className={glass}>
            <h2 className="text-xl font-black text-white mb-3">3. Zwecke &amp; Rechtsgrundlagen</h2>
            <ul className="mt-2 space-y-2 text-gray-300">
              <li className="flex gap-3">
                <span className="text-yellow-400 mt-0.5">&#9658;</span>
                <div>
                  <strong className="text-white">Bereitstellung der Website &amp; Sicherheit</strong> (Logs, DDoS-Abwehr) –
                  Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse).
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-yellow-400 mt-0.5">&#9658;</span>
                <div>
                  <strong className="text-white">Vertragserfüllung</strong> (Zugang, Day Pass, Abos, Downloads, Billing-Portal) –
                  Art. 6 Abs. 1 lit. b DSGVO.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-yellow-400 mt-0.5">&#9658;</span>
                <div>
                  <strong className="text-white">Magic-Link-Authentifizierung</strong> – Art. 6 Abs. 1 lit. b DSGVO
                  (vorvertragliche Maßnahme / Vertragserfüllung).
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-yellow-400 mt-0.5">&#9658;</span>
                <div>
                  <strong className="text-white">Transaktionale E-Mails via Resend</strong> – Art. 6 Abs. 1 lit. b DSGVO.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-yellow-400 mt-0.5">&#9658;</span>
                <div>
                  <strong className="text-white">Support/Kommunikation</strong> – Art. 6 Abs. 1 lit. b oder f DSGVO.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-yellow-400 mt-0.5">&#9658;</span>
                <div>
                  <strong className="text-white">KI-Copilot (Gemini API)</strong> – Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung
                  als Teil des Pro-Dienstes) bzw. f (berechtigtes Interesse bei optionaler Nutzung).
                </div>
              </li>
            </ul>
          </section>

          <section className={glass}>
            <h2 className="text-xl font-black text-white mb-3">4. Empfänger / Drittanbieter</h2>
            <ul className="mt-2 space-y-3 text-gray-300">
              <li className="flex gap-3">
                <span className="text-purple-400 mt-0.5">&#9658;</span>
                <div>
                  <strong className="text-white">Hosting/CDN:</strong> Netlify (Netlify, Inc., 512 2nd St., Suite 200,
                  San Francisco, CA 94107, USA) oder Vercel (Vercel Inc., 340 Pine Street Suite 700, San Francisco,
                  CA 94104, USA) – Auslieferung der Website, Serverless-Funktionen. Standardvertragsklauseln vorhanden.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-400 mt-0.5">&#9658;</span>
                <div>
                  <strong className="text-white">Stripe:</strong> Stripe, Inc. (354 Oyster Point Blvd, South San Francisco,
                  CA 94080, USA) – Zahlungsabwicklung, Rechnungen, Abo-Management, Billing-Portal. DPA und
                  Standardvertragsklauseln unter stripe.com/legal/dpa.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-400 mt-0.5">&#9658;</span>
                <div>
                  <strong className="text-white">Resend:</strong> Resend (YC W23, San Francisco, CA, USA) – transaktionale
                  E-Mails (Magic Links, Onboarding, Support). Resend verarbeitet E-Mail-Adressen als Auftragsverarbeiter.
                  DPA unter resend.com/legal/dpa.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-400 mt-0.5">&#9658;</span>
                <div>
                  <strong className="text-white">Google Gemini API:</strong> Google LLC, 1600 Amphitheatre Pkwy,
                  Mountain View, CA 94043, USA – KI-Verarbeitung von Prompts (Copilot-Feature). Standardvertragsklauseln
                  gemäß Google Cloud Terms.
                </div>
              </li>
            </ul>
            <p className="mt-3 text-gray-500 text-sm">
              Bei Anbietern außerhalb der EU/des EWR werden geeignete Schutzmaßnahmen (Standardvertragsklauseln, Art. 46 DSGVO)
              genutzt, soweit vom Anbieter bereitgestellt.
            </p>
          </section>

          <section className={glass}>
            <h2 className="text-xl font-black text-white mb-3">5. Cookies &amp; lokale Speicherung</h2>
            <p className="text-gray-300">
              Wir setzen primär technisch notwendige Cookies (Art. 6 Abs. 1 lit. f DSGVO). Eine detaillierte Übersicht:
            </p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm text-gray-300">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="py-2 pr-4 font-bold text-white">Name</th>
                    <th className="py-2 pr-4 font-bold text-white">Zweck</th>
                    <th className="py-2 font-bold text-white">Laufzeit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-2 pr-4 font-mono text-cyan-300">claw_access</td>
                    <td className="py-2 pr-4">Auth-Token (Plan, Ablauf, Stripe-ID) – httpOnly, Secure</td>
                    <td className="py-2">Je nach Plan (7–30 Tage)</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono text-cyan-300">claw_locale</td>
                    <td className="py-2 pr-4">Sprachpräferenz (de/en)</td>
                    <td className="py-2">1 Jahr</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-gray-500 text-sm">
              Kein Tracking, keine Werbe-Cookies, kein Google Analytics. Falls sich das ändert, wird diese Seite
              aktualisiert und ggf. eine Consent-Abfrage ergänzt.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">6. Speicherdauer</h2>
            <ul className="mt-2 space-y-2 text-gray-300 list-disc pl-6">
              <li>Server-Logs: je nach Hosting-Anbieter, typisch 7–30 Tage.</li>
              <li>Auth-Tokens / Magic Links: 15 Minuten (Link), danach abgelaufen.</li>
              <li>Access-Cookies: automatisch nach Ablauf des Plans ungültig.</li>
              <li>E-Mail-Adressen (Magic Link): werden gespeichert, solange ein aktives Konto besteht. Löschung auf Anfrage.</li>
              <li>Zahlungsdaten (Stripe): gemäß Stripes Aufbewahrungspflichten (typisch 7–10 Jahre für Rechnungen).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">7. Deine Rechte</h2>
            <ul className="mt-2 space-y-2 text-gray-300 list-disc pl-6">
              <li>Auskunft (Art. 15 DSGVO)</li>
              <li>Berichtigung (Art. 16 DSGVO)</li>
              <li>Löschung (Art. 17 DSGVO)</li>
              <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>Widerspruch gegen Verarbeitung aus berechtigtem Interesse (Art. 21 DSGVO)</li>
              <li>Beschwerde bei einer Aufsichtsbehörde (z. B. LfDI Niedersachsen: lfd.niedersachsen.de)</li>
            </ul>
            <p className="mt-3 text-gray-300">
              Schreibe uns dazu an{" "}
              <a className="text-cyan-300 hover:underline" href={`mailto:${LEGAL_INFO.email}`}>
                {LEGAL_INFO.email}
              </a>
              . Wir reagieren innerhalb von 30 Tagen.
            </p>
          </section>

          <section className={glass}>
            <h2 className="text-xl font-black text-white mb-3">8. Sicherheitsmaßnahmen</h2>
            <p className="text-gray-300">
              Wir setzen technische und organisatorische Maßnahmen ein: TLS/HTTPS für alle Verbindungen, httpOnly- und
              Secure-Cookies, signierte JWTs (HMAC-SHA256), Eingabevalidierung, Rate-Limiting, Circuit-Breaker. Dennoch
              gilt: 100 % Sicherheit existiert nicht – deshalb gibt es ClawGuru.
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
