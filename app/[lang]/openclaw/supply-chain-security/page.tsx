import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'OpenClaw Supply Chain Security: Dependencies & SBOMs 2024',
    description: 'Supply Chain Security für OpenClaw. Software Bill of Materials (SBOM), Dependency Pinning, npm Audit, Sigstore Container Signing und Build Provenance. SolarWinds-Schutz.',
    keywords: ['openclaw supply chain security','sbom software','dependency security','npm audit','sigstore signing','build provenance'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: {
      images: ["/og-image.png"], title: 'OpenClaw Supply Chain Security 2024', description: 'Supply Chain Security für OpenClaw.', type: 'article', url: `https://clawguru.org/${lang}/openclaw/supply-chain-security` },
    alternates: buildLocalizedAlternates(lang as Locale, '/openclaw/supply-chain-security'),
    robots: 'index, follow',
  };
}

export default function OpenClawSupplyChainPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Trust-Anker</strong>: Supply Chain Security schützt eigene Software-Lieferkette. Keine Angriffswerkzeuge.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">OpenClaw Supply Chain Security</h1>
        <p className="text-lg text-gray-300 mb-8">Schutz vor kompromittierten Dependencies — SBOM-Generierung, Dependency Pinning, Container-Signierung und Build Provenance für OpenClaw.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">📦 SBOM Generierung</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
            <pre>{`# Software Bill of Materials (SBOM) für OpenClaw erstellen

# 1. SBOM mit Syft generieren (CycloneDX Format)
syft packages dir:. -o cyclonedx-json > sbom.json

# 2. SBOM auf Vulnerabilities prüfen (Grype)
grype sbom:sbom.json --fail-on critical

# 3. npm SBOM (für Node.js)
npm sbom --sbom-format cyclonedx > npm-sbom.json

# 4. Container SBOM
syft ghcr.io/clawguru/openclaw:latest \\
  -o cyclonedx-json > container-sbom.json

# 5. Attestation (Sigstore/Cosign)
cosign attest \\
  --predicate sbom.json \\
  --type cyclonedx \\
  ghcr.io/clawguru/openclaw:latest

# 6. SBOM Verifikation bei Deployment
cosign verify-attestation \\
  --type cyclonedx \\
  ghcr.io/clawguru/openclaw:latest`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🛡️ Supply Chain Angriffs-Typen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { type: 'Typosquatting', example: 'crpyto statt crypto', mitigation: 'Dependency Pinning + Audit' },
              { type: 'Dependency Confusion', example: 'Interner Paketname öffentlich', mitigation: 'Private Registry + Scoping' },
              { type: 'Compromised Package', example: 'SolarWinds, XZ Utils', mitigation: 'SBOM + Integrity Checks' },
              { type: 'Malicious Maintainer', example: 'event-stream Hack 2018', mitigation: 'Minimal Dependencies + Audit' },
              { type: 'Build System Attack', example: 'Kompromittierter CI/CD', mitigation: 'Hermetic Builds + Provenance' },
              { type: 'Subdependency Attack', example: 'left-pad, colors.js', mitigation: 'Lock Files + Vendoring' },
            ].map(({ type, example, mitigation }) => (
              <div key={type} className="bg-gray-800 border rounded-lg p-4">
                <div className="font-bold text-sm text-red-700 mb-1">{type}</div>
                <div className="text-xs text-gray-400 mb-2">Beispiel: {example}</div>
                <div className="text-xs bg-green-900 text-green-700 px-2 py-1 rounded">✅ {mitigation}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔗 Weiterführende Ressourcen</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🛡️ Security Check</div><div className="text-sm text-gray-300">Dependency Scan</div></a>
            <a href="/runbooks" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">📚 Supply Chain Runbooks</div><div className="text-sm text-gray-300">SBOM Guides</div></a>
            <a href="/oracle" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🔮 Oracle</div><div className="text-sm text-gray-300">CVE Intelligence</div></a>
            <a href="/solutions" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700"><div className="font-semibold text-cyan-400">🏢 Enterprise</div><div className="text-sm text-gray-300">Managed Supply Chain</div></a>
          </div>
        </section>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Ist dieser Guide ein Penetrationstest?", acceptedAnswer: { "@type": "Answer", text: "Nein. Dieser Guide dient ausschlielich zur Absicherung eigener Systeme. Kein Angriffs-Tool, keine illegalen Aktivitten." } },
              { "@type": "Question", name: "Was ist OpenClaw?", acceptedAnswer: { "@type": "Answer", text: "OpenClaw ist das Open-Source Self-Hosting Security Framework von ClawGuru mit Executable Runbooks, Security-Check und Compliance-Dashboard." } },
              { "@type": "Question", name: "Wo finde ich die Runbooks?", acceptedAnswer: { "@type": "Answer", text: "Alle Runbooks sind unter /runbooks abrufbar. Jeder Befund im Security-Check enthlt einen direkten Link zum passenden Runbook." } }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "OpenClaw Security Guide",
            description: "Self-Hosted Security Hardening mit OpenClaw Executable Runbooks.",
            url: "https://clawguru.org/de/openclaw"
          },
          {
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "Supply Chain Security für OpenClaw implementieren",
            description: "Software Supply Chain absichern: SBOM, Dependency Scanning, Image Signing und CI/CD-Integration für OpenClaw.",
            totalTime: "PT60M",
            step: [
              { "@type": "HowToStep", name: "SBOM generieren", text: "syft image myapp:latest -o cyclonedx-json > sbom.json. SBOM in CI/CD nach jedem Build erstellen und archivieren." },
              { "@type": "HowToStep", name: "Dependency Scanning einrichten", text: "npm audit, pip-audit oder trivy fs . in CI-Pipeline als Pflichtschritt. Bei HIGH/CRITICAL Build abbrechen." },
              { "@type": "HowToStep", name: "Container Images signieren", text: "cosign sign --key cosign.key myimage:latest. cosign verify vor jedem Deploy ausführen." },
              { "@type": "HowToStep", name: "Pinned Dependencies erzwingen", text: "package-lock.json committen. Docker-Images mit SHA256-Digest pinnen statt floating Tags (latest)." },
              { "@type": "HowToStep", name: "Renovate/Dependabot aktivieren", text: "renovate.json oder .github/dependabot.yml anlegen für automatische Dependency-Update-PRs." },
            ]
          }
        ]) }} />
      </div>
    </div>
  );
}
