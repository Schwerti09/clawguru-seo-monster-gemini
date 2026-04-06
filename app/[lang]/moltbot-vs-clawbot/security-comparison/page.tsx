import type { Metadata } from "next";
import { SUPPORTED_LOCALES, type Locale, localeAlternates } from "@/lib/i18n";
import { BASE_URL } from "@/lib/config";
import { getCoreSecurityLinks } from "@/lib/core-security-links";

export const dynamic = "force-static";
export const revalidate = 86400;

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale)
    ? params.lang
    : "de") as Locale;

  return {
    title: "Moltbot vs. Clawbot: Security Vergleich 2024",
    description:
      "Detaillierter Vergleich der Security-Fähigkeiten und Use Cases zwischen Moltbot und Clawbot. Complete Security Architecture Comparison mit Empfehlungen.",
    keywords: [
      "moltbot vs clawbot",
      "security comparison",
      "bot security",
      "ai agent security",
      "moltbot clawbot unterschiede",
      "security architecture",
    ],
    alternates: {
      ...localeAlternates(`/${locale}/moltbot-vs-clawbot/security-comparison`),
    },
    openGraph: {
      title: "Moltbot vs. Clawbot: Security Vergleich 2024",
      description:
        "Detaillierter Vergleich der Security-Fähigkeiten zwischen Moltbot und Clawbot.",
      type: "article",
      url: `${BASE_URL}/${locale}/moltbot-vs-clawbot/security-comparison`,
    },
  };
}

export default async function MoltbotVsClawbotComparisonPage({
  params,
}: {
  params: { lang: string };
}) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale)
    ? params.lang
    : "de") as Locale;
  const prefix = `/${locale}`;
  const coreLinks = getCoreSecurityLinks(locale);

  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-sm mb-4">
              Security Comparison 2024
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Moltbot vs. Clawbot
            </h1>
            <p className="text-2xl text-blue-200 mb-4">
              Security Vergleich &amp; Empfehlungen
            </p>
            <p className="text-xl text-white/80 mb-8">
              Bot-spezifische Security vs. Enterprise Security. Microservices vs. Monolithische Ansätze. Cloud-native vs. Hybrid.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Moltbot</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Clawbot</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Architecture</span>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm">Enterprise</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-12">
            <p className="text-amber-900 font-semibold">
              🛡️ &quot;Not a Pentest&quot; Trust-Anker: Dieser Vergleich dient ausschließlich zur Analyse und Auswahl geeigneter Security-Frameworks. Keine Angriffswerkzeuge, keine illegalen Aktivitäten.
            </p>
          </div>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🎯 Executive Summary</h2>
            <p className="text-slate-700 text-lg mb-6">
              Der Vergleich zwischen <strong>Moltbot</strong> und <strong>Clawbot</strong> zeigt zwei unterschiedliche Ansätze für die Security von autonomen Systemen. Während Moltbot auf spezialisierte Bot-Security fokussiert ist, bietet Clawbot einen breiteren, enterprise-orientierten Security-Ansatz.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Moltbot</h3>
                <p className="text-blue-800 text-sm">Bot-spezifische Security mit Fokus auf Automation</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <h3 className="font-semibold text-purple-900 mb-2">Clawbot</h3>
                <p className="text-purple-800 text-sm">Enterprise Security mit umfassendem Schutz</p>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🏗️ Architektur-Vergleich</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-3">Moltbot Architecture</h3>
                <ul className="space-y-2 text-slate-700 text-sm">
                  <li>• Bot-zentrische Architektur</li>
                  <li>• Lightweight Security Layer</li>
                  <li>• Spezialisierte Threat Detection</li>
                  <li>• Optimiert für Automation</li>
                  <li>• Microservices-basiert</li>
                </ul>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-3">Clawbot Architecture</h3>
                <ul className="space-y-2 text-slate-700 text-sm">
                  <li>• Enterprise-zentrische Architektur</li>
                  <li>• Full-Stack Security Layer</li>
                  <li>• Umfassende Threat Detection</li>
                  <li>• Optimiert für Compliance</li>
                  <li>• Hybrid-fähig</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🔐 Security Features Vergleich</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-3 font-semibold">Feature</th>
                    <th className="p-3 font-semibold">Moltbot</th>
                    <th className="p-3 font-semibold">Clawbot</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr><td className="p-3">Authentication</td><td className="p-3">OAuth2 + JWT</td><td className="p-3">OAuth2 + SAML + JWT</td></tr>
                  <tr><td className="p-3">Authorization</td><td className="p-3">RBAC</td><td className="p-3">RBAC + ABAC</td></tr>
                  <tr><td className="p-3">Threat Detection</td><td className="p-3">ML-basiert</td><td className="p-3">ML + Rule-basiert</td></tr>
                  <tr><td className="p-3">Encryption</td><td className="p-3">AES-256 + TLS 1.3</td><td className="p-3">AES-256 + TLS 1.3 + HSM</td></tr>
                  <tr><td className="p-3">Compliance</td><td className="p-3">SOC2, ISO 27001</td><td className="p-3">SOC2, ISO 27001, PCI-DSS</td></tr>
                  <tr><td className="p-3">Deployment</td><td className="p-3">Cloud-native</td><td className="p-3">Hybrid (Cloud + On-Prem)</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🛡️ Threat Detection Vergleich</h2>
            <p className="text-slate-700 text-lg mb-6">
              Beide Systeme bieten fortschrittliche Threat Detection, unterscheiden sich aber in Ansatz und Fokus. Moltbot nutzt spezialisierte ML-Modelle für Bot-Threats, während Clawbot breitere Enterprise-Threat-Coverage bietet.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">📊 Performance &amp; Skalierbarkeit</h2>
            <p className="text-slate-700 text-lg mb-6">
              Moltbot zeigt bessere Performance bei Bot-spezifischen Workloads, während Clawbot bei Enterprise-Scale-Deployments mit komplexen Compliance-Anforderungen überlegen ist.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">🎯 Use Case Analyse</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-3">Moltbot empfohlen für:</h3>
                <ul className="space-y-2 text-blue-800 text-sm">
                  <li>• Automation-fokussierte Teams</li>
                  <li>• Cloud-native Deployments</li>
                  <li>• Startups &amp; Scale-ups</li>
                  <li>• Bot-spezifische Security</li>
                </ul>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <h3 className="font-semibold text-purple-900 mb-3">Clawbot empfohlen für:</h3>
                <ul className="space-y-2 text-purple-800 text-sm">
                  <li>• Enterprise-Umgebungen</li>
                  <li>• Compliance-intensive Branchen</li>
                  <li>• Hybrid-Deployments</li>
                  <li>• Umfassende Security-Suites</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">💰 Kosten-Analyse</h2>
            <p className="text-slate-700 text-lg mb-6">
              Moltbot bietet ein günstigeres Einstiegsmodell, während Clawbot bei großen Enterprise-Deployments ein besseres Preis-Leistungs-Verhältnis bietet.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">📋 Entscheidungsmatrix</h2>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <ul className="space-y-2 text-slate-700">
                <li>✅ Bot-Security Fokus → <strong>Moltbot</strong></li>
                <li>✅ Enterprise Compliance → <strong>Clawbot</strong></li>
                <li>✅ Cloud-native → <strong>Moltbot</strong></li>
                <li>✅ Hybrid Deployment → <strong>Clawbot</strong></li>
                <li>✅ Budget-friendly → <strong>Moltbot</strong></li>
                <li>✅ Full-Stack Security → <strong>Clawbot</strong></li>
              </ul>
            </div>
          </section>

          <section className="bg-gradient-to-r from-blue-700 to-indigo-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Security Comparison Assessment</h2>
            <p className="mb-6">Finden Sie heraus, welches Framework am besten zu Ihrer Organisation passt.</p>
            <a href={coreLinks.check} className="inline-block px-6 py-3 bg-white text-blue-700 rounded-lg font-semibold">
              Security Assessment starten
            </a>
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
              <a href={`${prefix}/moltbot/security-framework`} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">Moltbot Framework</a>
              <a href={`${prefix}/moltbot/hardening-guide-2024`} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">Hardening Guide</a>
              <a href={`${prefix}/runbooks/security`} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">Security Runbooks</a>
              <a href={coreLinks.methodology} className="rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10">Methodology</a>
            </div>
          </section>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "Moltbot vs. Clawbot: Security Vergleich 2024",
        author: { "@type": "Organization", name: "ClawGuru", url: BASE_URL },
        datePublished: "2024-04-06",
      })}} />
    </main>
  );
}
