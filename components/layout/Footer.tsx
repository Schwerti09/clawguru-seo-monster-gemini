import Link from "next/link"
import Container from "@/components/shared/Container"
import { COMMUNITY } from "@/lib/constants"

export default function Footer() {
  return (
    <footer role="contentinfo" className="mt-20 border-t border-gray-800 py-10 pb-24 lg:pb-10">
      <Container>
        <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-400">
          <div>
            <div className="font-black text-gray-200 mb-2">ClawGuru</div>
            <p>
              Unabhängiges Lage- & Ops-Zentrum für OpenClaw/Moltbot. Fokus: Security, Betrieb, Kostenkontrolle.
            </p>
            <div className="mt-4 text-xs text-gray-500">
              Hinweis: Tools liefern heuristische Orientierung, keine Garantie. Für harte Audits: professionelle Prüfung.
            </div>
          </div>
          <nav aria-label="Seiten-Navigation">
            <div className="font-black text-gray-200 mb-2">Hubs</div>
            <ul className="space-y-1">
              <li><Link href="/clawverse">ClawVerse</Link></li>
              <li><Link href="/check">Security-Check</Link></li>
              <li><Link href="/copilot">Copilot</Link></li>
              <li><Link href="/intel">Intel Feed</Link></li>
              <li><Link href="/academy">Academy</Link></li>
              <li><Link href="/vault">Vault</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="/downloads">Downloads</Link></li>
              <li><Link href="/case-studies">Case Studies</Link></li>
              <li><Link href="/ueber-uns">Über uns</Link></li>
            </ul>
          </nav>
          <nav aria-label="Rechtliche Links">
            <div className="font-black text-gray-200 mb-2">Rechtliches</div>
            <ul className="space-y-1">
              <li><Link href="/impressum">Impressum</Link></li>
              <li><Link href="/datenschutz">Datenschutz</Link></li>
              <li><Link href="/agb">AGB</Link></li>
              <li><Link href="/trust-security">ClawGuru Institutional Trust Center</Link></li>
            </ul>
            <div className="mt-4">
              <a className="inline-flex px-4 py-2 rounded-xl border border-gray-700 hover:border-gray-500 text-gray-200" href={COMMUNITY.discordInvite} target="_blank" rel="noreferrer noopener">
                Discord Community →
              </a>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Affiliate-Hinweis: Einige Links können Provisionen enthalten. Transparenz bleibt Pflicht.
            </div>
          </nav>
        </div>
      </Container>
    </footer>
  )
}
