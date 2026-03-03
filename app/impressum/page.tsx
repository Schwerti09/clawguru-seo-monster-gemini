import Container from "@/components/shared/Container"
import { LEGAL_INFO } from "@/lib/constants"

export const metadata = {
  title: "Impressum | ClawGuru Security Operations",
  description:
    "Pflichtangaben gemäß § 5 TMG für ClawGuru Security Operations – Rolf Schwertfechter (Einzelunternehmen)."
}

const glass =
  "backdrop-blur-md bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"

const accentLine =
  "h-[2px] w-12 rounded-full mb-5"

function Section({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <section className={glass}>
      <div className={`${accentLine}`} style={{ background: accent }} />
      <h2 className="text-xl font-black mb-4 text-white">{title}</h2>
      <div className="text-gray-300 leading-relaxed space-y-2">{children}</div>
    </section>
  )
}

export default function Impressum() {
  return (
    <Container>
      <div className="py-20 max-w-4xl mx-auto">

        {/* Hero header */}
        <div className="mb-12 text-center">
          <span className="inline-block px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4"
            style={{ background: "rgba(212,175,55,0.1)", color: "#d4af37", border: "1px solid rgba(212,175,55,0.2)" }}>
            Rechtliches
          </span>
          <h1 className="text-5xl font-black text-white mb-3">Impressum</h1>
          <p className="text-gray-400">Pflichtangaben gemäß § 5 TMG</p>
        </div>

        <div className="space-y-6">

          {/* § 5 TMG */}
          <Section title="Angaben gemäß § 5 TMG" accent="linear-gradient(90deg,#d4af37,#e8cc6a)">
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Unternehmensname</p>
                <p className="text-white font-semibold">{LEGAL_INFO.company}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Rechtsform</p>
                <p>Einzelunternehmen</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Inhaber</p>
                <p className="text-white">{LEGAL_INFO.owner}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Anschrift</p>
                <p>{LEGAL_INFO.address}<br />{LEGAL_INFO.city}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Telefon</p>
                <p>{LEGAL_INFO.phone}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">E-Mail</p>
                <a className="text-cyan-300 hover:text-cyan-200 hover:underline transition-colors"
                  href={`mailto:${LEGAL_INFO.email}`}>
                  {LEGAL_INFO.email}
                </a>
              </div>
            </div>
          </Section>

          {/* Steuer & Register */}
          <Section title="Steuerliche Angaben" accent="linear-gradient(90deg,#22d3ee,#6366f1)">
            <p>
              <span className="text-gray-500 mr-2">USt-Identifikationsnummer (§ 27a UStG):</span>
              <span className="font-mono text-white">{LEGAL_INFO.ustId}</span>
            </p>
            <p>
              <span className="text-gray-500 mr-2">Zuständiges Finanzamt:</span>
              <span>{LEGAL_INFO.registergericht}</span>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Rolf Schwertfechter ist Einzelunternehmer und nicht im Handelsregister eingetragen (Kleingewerbetreibender gemäß § 1 Abs. 2 HGB).
            </p>
          </Section>

          {/* Verantwortlich für Inhalte */}
          <Section title="Verantwortlich für den Inhalt (§ 18 Abs. 2 MStV)" accent="linear-gradient(90deg,#a855f7,#ec4899)">
            <p><span className="text-white font-semibold">{LEGAL_INFO.owner}</span></p>
            <p>{LEGAL_INFO.address}, {LEGAL_INFO.city}</p>
            <p>
              <a className="text-cyan-300 hover:underline" href={`mailto:${LEGAL_INFO.email}`}>
                {LEGAL_INFO.email}
              </a>
            </p>
          </Section>

          {/* Streitschlichtung */}
          <Section title="Streitschlichtung (ODR)" accent="linear-gradient(90deg,#10b981,#22d3ee)">
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
              <a
                className="text-cyan-300 hover:underline"
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
            </p>
            <p>
              Unsere E-Mail-Adresse für diesen Zweck:{" "}
              <a className="text-cyan-300 hover:underline" href={`mailto:${LEGAL_INFO.email}`}>
                {LEGAL_INFO.email}
              </a>
            </p>
            <p className="text-sm text-gray-500">
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </Section>

          {/* Haftung für Inhalte */}
          <Section title="Haftung für Inhalte" accent="linear-gradient(90deg,#f59e0b,#ef4444)">
            <p>
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen
              Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet,
              übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine
              rechtswidrige Tätigkeit hinweisen.
            </p>
            <p>
              Sicherheitsinformationen, Runbooks und Check-Ergebnisse ersetzen keinen professionellen Sicherheits-Audit,
              kein Penetration-Testing und keine Rechtsberatung.
            </p>
          </Section>

          {/* Affiliate */}
          <Section title="Affiliate-Offenlegung" accent="linear-gradient(90deg,#6366f1,#a855f7)">
            <p>
              Diese Website enthält Affiliate-Links zu Drittanbietern. Wenn du über diese Links kaufst, erhalten wir
              ggf. eine Provision – ohne Mehrkosten für dich. Affiliate-Links sind als solche kenntlich gemacht oder
              aus dem Kontext ersichtlich.
            </p>
          </Section>

        </div>

        <p className="mt-10 text-center text-xs text-gray-600">
          Stand: März 2026 · {LEGAL_INFO.company}
        </p>
      </div>
    </Container>
  )
}
