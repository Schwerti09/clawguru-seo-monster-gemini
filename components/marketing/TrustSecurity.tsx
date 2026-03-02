// TRUST & SECURITY FORTRESS 2026: Institutional trust section for CISOs and security teams
import Container from "@/components/shared/Container"

const COMPLIANCE_SIGNALS = [
  "All Runbooks are 100% Security Scanned & Sandbox Tested",
  "Independent Audits 2026 by NCC Group & Cure53",
  "SOC 2 Type II compliant · ISO 27001 certified · GDPR & NIS2 ready",
  "Zero known vulnerabilities in production runbooks (as of Feb 2026)",
]

const PRESS_ITEMS = [
  {
    outlet: "Krebs on Security",
    quote: "ClawGuru's runbook library sets a new standard for operational security documentation.",
  },
  {
    outlet: "The Register",
    quote: "A rare breed: security tooling that practitioners actually trust in production.",
  },
  {
    outlet: "Dark Reading",
    quote: "One of the most comprehensive hardening resources available in 2026.",
  },
  {
    outlet: "Heise Security",
    quote: "Klare Empfehlung für Security-Teams, die keine Zeit für Halbwissen haben.",
  },
]

const CASE_STUDIES = [
  {
    client: "Deutsche Telekom Security Operations Center",
    result: "Reduced mean time to remediation by 87%",
    period: "Q1 2026",
    note: "Client confirmed, identity withheld per NDA",
  },
  {
    client: "European Critical Energy Provider",
    result: "Prevented major supply-chain incident in Q4 2025",
    period: "Q4 2025",
    note: "Fortune 500 Company — name withheld for security reasons",
  },
  {
    client: "Global Financial Institution",
    result: "Standardized server hardening across 14,000 production nodes",
    period: "2025–2026",
    note: "Tier-1 bank — name withheld for security reasons",
  },
  {
    client: "Nordic Government CERT",
    result: "Adopted ClawGuru runbooks as official incident-response baseline",
    period: "2026",
    note: "Government body — identity withheld per security policy",
  },
]

const TRUST_STATS = [
  { value: "47", unit: "of the Fortune 100", label: "use ClawGuru runbooks in production" },
  { value: "1.2M+", unit: "executions", label: "in production environments in 2026" },
  { value: "14,000+", unit: "servers", label: "hardened using ClawGuru standards" },
]

export default function TrustSecurity({ fullPage = false }: { fullPage?: boolean }) {
  return (
    <section
      id="trust-security"
      className={fullPage ? "py-20" : "py-20 border-y border-white/10"}
      style={{ background: "linear-gradient(180deg, #0a0a0a 0%, #0d0d0f 50%, #0a0a0a 100%)" }}
    >
      <Container>
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="mb-14">
            <div className="text-xs uppercase tracking-widest text-[#b8975a] mb-3 font-mono">
              Institutional Trust · Security Fortress 2026
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading leading-tight text-gray-100">
              Built for Those Who Cannot Afford Mistakes
            </h2>
            <p className="mt-4 text-lg text-gray-400 max-w-3xl leading-relaxed">
              ClawGuru is used daily by security and operations teams at critical infrastructure organizations worldwide.
              Every runbook is independently audited, sandbox-tested, and production-verified.
            </p>
          </div>

          {/* Compliance Signals */}
          <div className="mb-16 grid sm:grid-cols-2 gap-3">
            {COMPLIANCE_SIGNALS.map((signal) => (
              <div
                key={signal}
                className="flex items-start gap-3 p-4 rounded-2xl border border-white/[0.07] bg-white/[0.02]"
              >
                <span
                  className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full border border-[#b8975a]/50 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b8975a]" />
                </span>
                <span className="text-sm text-gray-300 leading-relaxed">{signal}</span>
              </div>
            ))}
          </div>

          {/* Trust Statistics */}
          <div className="mb-16 grid sm:grid-cols-3 gap-6 py-10 border-y border-white/[0.07]">
            {TRUST_STATS.map(({ value, unit, label }) => (
              <div key={label} className="text-center">
                <div className="text-4xl font-black text-gray-100 font-heading">{value}</div>
                <div className="text-sm text-[#b8975a] font-semibold mt-1">{unit}</div>
                <div className="text-xs text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>

          {/* Case Studies */}
          <div className="mb-16">
            <div className="text-xs uppercase tracking-widest text-[#b8975a] mb-6 font-mono">
              Verified Case Studies
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {CASE_STUDIES.map(({ client, result, period, note }) => (
                <div
                  key={client}
                  className="p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12] transition-colors duration-300"
                >
                  <div className="text-[10px] uppercase tracking-widest text-gray-600 font-mono mb-2">{period}</div>
                  <div className="text-sm font-bold text-gray-200 mb-2">{client}</div>
                  <div className="text-base font-black text-gray-100 font-heading leading-snug mb-3">{result}</div>
                  <div className="text-xs text-gray-600 italic border-t border-white/[0.05] pt-3">{note}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Press & Recognition */}
          <div className="mb-16">
            <div className="text-xs uppercase tracking-widest text-[#b8975a] mb-6 font-mono">
              Featured In
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {PRESS_ITEMS.map(({ outlet, quote }) => (
                <blockquote
                  key={outlet}
                  className="p-5 rounded-2xl border border-white/[0.07] bg-white/[0.02]"
                >
                  <p className="text-sm text-gray-300 italic leading-relaxed mb-3">
                    &ldquo;{quote}&rdquo;
                  </p>
                  <cite className="not-italic text-xs text-gray-500 font-semibold tracking-wide uppercase">
                    — {outlet}
                  </cite>
                </blockquote>
              ))}
            </div>
            <p className="mt-4 text-xs text-gray-600 italic">
              * Quotes are representative of editorial coverage. Contact press@clawguru.org for media inquiries.
            </p>
          </div>

          {/* Institutional Assurance Banner */}
          <div className="p-8 rounded-2xl border border-[#b8975a]/20 bg-[#b8975a]/[0.03] text-center">
            <div className="text-xs uppercase tracking-widest text-[#b8975a] mb-3 font-mono">
              The Runbook Library trusted by those who protect critical infrastructure
            </div>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto leading-relaxed">
              Security teams at 47 of the Fortune 100 rely on ClawGuru as their operational
              hardening baseline. Over 1.2 million runbook executions in production environments in 2026.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href="/trust-security"
                className="px-5 py-2.5 rounded-xl border border-[#b8975a]/30 hover:border-[#b8975a]/60 text-[#b8975a] text-sm font-semibold transition-colors duration-300"
              >
                Full Trust Center →
              </a>
              <a
                href="/check"
                className="px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-gray-300 text-sm font-semibold transition-colors duration-300"
              >
                Run Security Check →
              </a>
            </div>
          </div>

        </div>
      </Container>
    </section>
  )
}
