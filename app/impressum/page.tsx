import Container from "@/components/shared/Container"
import { LEGAL_INFO } from "@/lib/constants"
import { getLegalLocale } from "@/lib/legal"

export default function Impressum() {
  const locale = getLegalLocale()
  const isGerman = locale === "de"
  return (
    <Container>
      <div className="py-16 max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-8">{isGerman ? "Impressum" : "Legal Notice"}</h1>

        <div className="space-y-8">
          <section className="p-6 rounded-2xl border border-gray-800 bg-black/30">
            <h2 className="text-2xl font-black mb-3">
              {isGerman ? "Angaben gemäß § 5 TMG" : "Provider information"}
            </h2>
            <p><strong>{isGerman ? "Unternehmen" : "Company"}:</strong> {LEGAL_INFO.company}</p>
            <p><strong>{isGerman ? "Inhaber" : "Owner"}:</strong> {LEGAL_INFO.owner}</p>
            <p><strong>{isGerman ? "Anschrift" : "Address"}:</strong> {LEGAL_INFO.address}, {LEGAL_INFO.city}</p>
            <p>
              <strong>{isGerman ? "E-Mail" : "Email"}:</strong>{" "}
              <a className="text-brand-cyan" href={`mailto:${LEGAL_INFO.email}`}>{LEGAL_INFO.email}</a>
            </p>
            <p><strong>{isGerman ? "Steuerliche Angaben" : "Tax information"}:</strong> {LEGAL_INFO.taxNote}</p>
          </section>

          <section className="p-6 rounded-2xl border border-gray-800 bg-black/30">
            <h2 className="text-2xl font-black mb-3">
              {isGerman ? "Affiliate-Offenlegung" : "Affiliate disclosure"}
            </h2>
            <p className="text-gray-300">
              {isGerman
                ? "Diese Website enthält Affiliate-Links. Wenn du darüber kaufst, erhalten wir ggf. eine Provision – ohne Mehrkosten für dich."
                : "This site contains affiliate links. If you purchase through them, we may receive a commission at no extra cost to you."}
            </p>
          </section>

          <section className="p-6 rounded-2xl border border-gray-800 bg-black/30">
            <h2 className="text-2xl font-black mb-3">
              {isGerman ? "Haftung" : "Liability"}
            </h2>
            <p className="text-gray-300">
              {isGerman
                ? "Inhalte werden nach bestem Wissen erstellt. Keine Gewähr für Vollständigkeit/Aktualität. Sicherheitsinfos ersetzen keinen professionellen Audit."
                : "Content is prepared to the best of our knowledge. No warranty for completeness or timeliness. Security information does not replace a professional audit."}
            </p>
          </section>
        </div>
      </div>
    </Container>
  )
}
