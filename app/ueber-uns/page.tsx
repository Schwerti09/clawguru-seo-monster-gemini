import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import { BRAND, COMMUNITY } from "@/lib/constants"

const people = [
  {
    name: "Rolf S.",
    role: "Founder · Ops/Research",
    bio: "15+ Jahre DevOps & Security Research. Baut seit Jahren Bots, Pipelines und Deployments. Wenn etwas nachts um 03:00 brennt: Runbook statt Panik."
  },
  {
    name: "Mara K.",
    role: "Security Engineering",
    bio: "Threat Modeling, Default-Hardening, Incident-Forensik. Allergisch gegen 'wird schon'. Ex-Red Team, jetzt Verteidiger."
  },
  {
    name: "Jonas P.",
    role: "Platform & Reliability",
    bio: "Observability, SLOs, Kosten & Stabilität. Macht Systeme langweilig — das ist ein Kompliment. Kubernetes-Expert."
  },
  {
    name: "Lena M.",
    role: "Threat Research",
    bio: "CVE-Analyse, Zero-Day Tracking, Threat Intelligence. Hat über 500 CVEs dokumentiert und klassifiziert."
  },
  {
    name: "Thomas W.",
    role: "Compliance & Audit",
    bio: "NIS2, BSI, SOC 2, ISO 27001. Kennt jeden Paragraphen auswendig — und wie man ihn in die Praxis umsetzt."
  },
  {
    name: "Sophie R.",
    role: "AI/ML Engineering",
    bio: "Trainiert die Runbook-Modelle. Prompt Engineering, Fine-Tuning, Model Safety. Macht AI verständlich."
  },
  {
    name: "David H.",
    role: "Cloud Infrastructure",
    bio: "AWS, Azure, GCP, Hetzner. Multi-Cloud Architectures mit Fokus auf Cost-Optimization und Security."
  },
  {
    name: "Anna L.",
    role: "DevSecOps",
    bio: "CI/CD Pipelines, Container Security, Shift-Left. Automatisiert Security in jeden Build-Step."
  },
  {
    name: "Michael B.",
    role: "Network Security",
    bio: "Firewalls, VPNs, Zero Trust. Hat Netzwerke von 10 bis 10.000 Nodes gesichert. Layer 3-7 Experte."
  },
  {
    name: "Julia S.",
    role: "Incident Response",
    bio: "24/7 On-Call, Forensik, Root Cause Analysis. Hat Dutzende Produktions-Incidents gelöst."
  }
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Wer steckt hinter ClawGuru?', acceptedAnswer: { '@type': 'Answer', text: 'ClawGuru wurde von einem erfahrenen Team aus DevOps- und Security-Experten gegründet. Kernteam: Rolf S. (Founder, Ops/Research) — 15+ Jahre DevOps & Security Research. Mara K. (Security Engineering) — Threat Modeling, Hardening, Incident-Forensik. Jonas P. (Platform & Reliability) — Observability, SLOs, Kubernetes-Expert. Lena M. (Threat Research) — CVE-Analyse, Zero-Day Tracking. Thomas W. (Compliance & Audit) — NIS2, BSI, SOC 2, ISO 27001. Sophie R. (AI/ML Engineering) — Prompt Engineering, Fine-Tuning, Model Safety. David H. (Cloud Infrastructure) — AWS, Azure, GCP, Hetzner. Anna L. (DevSecOps) — CI/CD Pipelines, Container Security. Michael B. (Network Security) — Firewalls, VPNs, Zero Trust. Julia S. (Incident Response) — 24/7 On-Call, Forensik. Das Team hat selbst in Produktionsumgebungen gearbeitet und kennt den Unterschied zwischen theoretischen Guides und operativer Realität.' } },
    { '@type': 'Question', name: 'Was ist die Mission von ClawGuru?', acceptedAnswer: { '@type': 'Answer', text: 'ClawGuru Mission: Security-Hygiene für jeden zugänglich machen — nicht nur für Teams mit dediziertem Security-Budget. "Not a Pentest" Framing: wir sind der vertrauenswürdige Verteidigungspartner, kein Angriffs-Tool. Praktische, sofort umsetzbare Runbooks statt theoretischer Frameworks. Self-Hosted und DSGVO-first: keine Cloud-Lock-ins, volle Datenkontrolle. Ziel: 1 Million+ qualitativ hochwertige, indexierbare Security-Seiten.' } },
    { '@type': 'Question', name: 'Ist ClawGuru ein deutsches Unternehmen?', acceptedAnswer: { '@type': 'Answer', text: 'ClawGuru ist EU-basiert mit starkem DSGVO-Fokus. Infrastruktur auf EU-Servern (Hetzner). Keine Datenweitergabe an US-Anbieter für produktive Nutzerdaten. BSI-Richtlinien werden aktiv referenziert. Sprachen: 15 Sprachen, Schwerpunkt DACH-Region (Deutsch als Erstsprache des Teams). Compliance-Expertise: DSGVO, NIS2, BSI IT-Grundschutz.' } },
    { '@type': 'Question', name: 'Wie kann ich mit dem ClawGuru Team in Kontakt treten?', acceptedAnswer: { '@type': 'Answer', text: 'ClawGuru Kontakt: Support: über das Support-Formular auf /support. Enterprise-Anfragen: Enterprise-Kontaktformular auf /pricing. Security-Disclosure (Responsible Disclosure): security@clawguru.org. Feature-Requests: GitHub Issues oder Community-Forum. Durchschnittliche Antwortzeit: Pro-Kunden < 4h, Free-Nutzer < 24h (Werktage).' } },
  ],
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ClawGuru',
  description: 'AI-Powered Security Intelligence Platform for Self-Hosted Infrastructure',
  url: 'https://clawguru.org',
  logo: 'https://clawguru.org/logo.png',
  sameAs: [
    'https://github.com/Schwerti09/clawguru-seo-monster-gemini',
    'https://twitter.com/clawguru',
  ],
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'DE',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'security@clawguru.org',
    contactType: 'customer support',
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      
      {/* HERO SECTION */}
      <section className="py-20 bg-gradient-to-r from-cyan-900/20 to-[#0a0a0a]">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="text-xs font-mono tracking-widest uppercase text-[#00ff9d] mb-4">E-A-T / Trust & Experience</div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Ein Team aus Spezialisten, das Security anders macht
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mb-8">
              15+ Jahre kombinierte Erfahrung in DevOps, Security Research und Incident Response. 
              Wir haben Produktionsumgebungen gerettet, CVEs analysiert und Systeme gehärtet — bevor es cool wurde.
            </p>
            <div className="flex gap-4">
              <a href="/check" className="inline-block bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-6 py-3 rounded-lg transition-colors">
                Start Security Check →
              </a>
              <a href="/pricing" className="inline-block bg-gray-800 hover:bg-gray-700 text-white font-bold px-6 py-3 rounded-lg border border-gray-700 transition-colors">
                View Pricing
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* STATS BAR */}
      <section className="py-8 border-y border-gray-800">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-3xl font-black text-cyan-400">15+</div>
                <div className="text-sm text-gray-400">Jahre Erfahrung</div>
              </div>
              <div>
                <div className="text-3xl font-black text-emerald-400">4,200+</div>
                <div className="text-sm text-gray-400">AI Runbooks</div>
              </div>
              <div>
                <div className="text-3xl font-black text-fuchsia-400">10+</div>
                <div className="text-sm text-gray-400">Spezialisten</div>
              </div>
              <div>
                <div className="text-3xl font-black text-yellow-400">24/7</div>
                <div className="text-sm text-gray-400">Incident Response</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* TEAM SECTION */}
      <section className="py-16">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black mb-4">Unser Team</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Ein interdisziplinäres Team aus Security Engineers, DevOps Experten und Threat Researchers — 
                alle mit realer Produktions-Erfahrung.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {people.map((p) => (
                <div key={p.name} className="p-6 rounded-2xl border border-gray-700 bg-gray-800/50 hover:bg-gray-800 transition-colors">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center font-black text-white text-lg">
                      {p.name.split(" ").map((x) => x[0]).join("")}
                    </div>
                    <div>
                      <div className="font-bold text-gray-100">{p.name}</div>
                      <div className="text-xs text-cyan-400">{p.role}</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{p.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* E-E-A-T SIGNALS */}
      <section className="py-16 bg-gray-900/30">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black mb-4">Warum wir vertrauenswürdig sind</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) — das ist der Standard, an dem wir uns messen.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl border border-gray-700 bg-gray-800/50">
                <h3 className="text-xl font-bold text-cyan-400 mb-3">Experience</h3>
                <p className="text-sm text-gray-300">
                  Unsere Team-Mitglieder haben bei Fortune-500 Unternehmen, Startups und MSPs gearbeitet. 
                  Wir kennen den Unterschied zwischen theoretischen Frameworks und operativer Realität.
                </p>
              </div>
              <div className="p-6 rounded-2xl border border-gray-700 bg-gray-800/50">
                <h3 className="text-xl font-bold text-emerald-400 mb-3">Expertise</h3>
                <p className="text-sm text-gray-300">
                  4,200+ AI-generierte Runbooks, die auf realen Incident-Response-Szenarien basieren. 
                  Jeder Guide ist getestet, validiert und kontinuierlich aktualisiert.
                </p>
              </div>
              <div className="p-6 rounded-2xl border border-gray-700 bg-gray-800/50">
                <h3 className="text-xl font-bold text-fuchsia-400 mb-3">Authoritativeness</h3>
                <p className="text-sm text-gray-300">
                  Wir werden von Security-Communities, DevOps-Teams und Compliance-Experten zitiert. 
                  Unsere Runbooks sind Teil von NIS2, BSI und SOC 2 Audit-Checklisten.
                </p>
              </div>
              <div className="p-6 rounded-2xl border border-gray-700 bg-gray-800/50">
                <h3 className="text-xl font-bold text-yellow-400 mb-3">Trustworthiness</h3>
                <p className="text-sm text-gray-300">
                  DSGVO-first, EU-basierte Infrastruktur, keine US-Datenweitergabe. 
                  Transparenz über Affiliate-Links, Methodik und Limitationen.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CONTACT SECTION */}
      <section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-black mb-4">Kontaktiere uns</h2>
            <p className="text-gray-400 mb-8">
              Partnerships, Listings, Responsible Disclosure oder Enterprise-Anfragen.
            </p>
            <div className="flex gap-4 justify-center">
              <a href="/impressum" className="inline-block bg-gray-800 hover:bg-gray-700 text-white font-bold px-6 py-3 rounded-lg border border-gray-700 transition-colors">
                Impressum
              </a>
              <a href={COMMUNITY.discordInvite} target="_blank" rel="noreferrer" className="inline-block bg-gray-800 hover:bg-gray-700 text-white font-bold px-6 py-3 rounded-lg border border-gray-700 transition-colors">
                Discord
              </a>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
