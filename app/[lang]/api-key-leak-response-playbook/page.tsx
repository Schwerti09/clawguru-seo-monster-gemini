import type { Metadata } from "next"
import Link from "next/link"

import Container from "@/components/shared/Container"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { getCoreSecurityLinks } from "@/lib/core-security-links"
import { getApiKeyLeakCopy } from "@/lib/content-api-key-leak-response-i18n"
import { pick } from "@/lib/i18n-pick"

export const revalidate = 60

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  const copy = getApiKeyLeakCopy(locale)
  return {
    title: copy.title,
    description: copy.description,
    alternates: buildLocalizedAlternates(locale, "/api-key-leak-response-playbook"),
    openGraph: {
      images: ["/og-image.png"],
      title: copy.title,
      description: copy.description,
      type: "article",
    },
  }
}

export default function ApiKeyLeakResponsePage(props: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  const copy = getApiKeyLeakCopy(locale)
  const coreLinks = getCoreSecurityLinks(locale)
  const prefix = `/${locale}`

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: copy.h1,
    description: copy.description,
    inLanguage: locale,
    mainEntityOfPage: `${prefix}/api-key-leak-response-playbook`,
  }

  const isDE = locale === 'de'
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: pick(isDE, 'Was tue ich sofort wenn ein API Key geleakt wurde?', 'What do I do immediately if an API key has leaked?'), acceptedAnswer: { '@type': 'Answer', text: pick(isDE, 'API Key Leak Sofortmaßnahmen: 1) Key SOFORT invalidieren/revoken beim Provider (AWS, GitHub, Stripe, etc.) — das ist Schritt 1, nicht Schritt 5. 2) Access Logs prüfen: wann wurde der Key zuletzt genutzt, von welcher IP? 3) Schadensanalyse: welche Berechtigungen hatte der Key? 4) Neuen Key generieren und deployen. 5) Git-History bereinigen (BFG Repo Cleaner oder git-filter-repo). 6) Secret Scanner einrichten (GitHub Secret Scanning, gitleaks).', 'API key leak immediate actions: 1) IMMEDIATELY invalidate/revoke the key at the provider (AWS, GitHub, Stripe, etc.) — that is step 1, not step 5. 2) Check access logs: when was the key last used, from which IP? 3) Damage analysis: what permissions did the key have? 4) Generate and deploy new key. 5) Clean Git history (BFG Repo Cleaner or git-filter-repo). 6) Set up secret scanner (GitHub Secret Scanning, gitleaks).') } },
      { '@type': 'Question', name: pick(isDE, 'Wie entferne ich einen API Key aus der Git-History?', 'How do I remove an API key from Git history?'), acceptedAnswer: { '@type': 'Answer', text: pick(isDE, 'API Key aus Git entfernen: Option 1 - BFG Repo Cleaner (schnell, einfach): bfg --replace-text passwords.txt. Option 2 - git-filter-repo (moderner): git filter-repo --path-glob \'*.env\' --invert-paths. WICHTIG: Force-Push auf alle Branches nötig. GitHub bietet "Remove sensitive data" Guide. Aber: Der Key ist trotzdem kompromittiert (GitHub/GitLab cached Commits). Key IMMER revoken, auch nach History-Bereinigung.', 'Remove API key from Git: option 1 - BFG Repo Cleaner (fast, easy): bfg --replace-text passwords.txt. Option 2 - git-filter-repo (modern): git filter-repo --path-glob \'*.env\' --invert-paths. IMPORTANT: force-push to all branches needed. GitHub offers "Remove sensitive data" guide. But: the key is still compromised (GitHub/GitLab caches commits). Always revoke key, even after history cleanup.') } },
      { '@type': 'Question', name: pick(isDE, 'Wie verhindere ich API Key Leaks in Zukunft?', 'How do I prevent API key leaks in the future?'), acceptedAnswer: { '@type': 'Answer', text: pick(isDE, 'API Key Leak Prävention: Pre-Commit Hook mit gitleaks (blockiert Commit mit Secrets). GitHub Secret Scanning aktivieren (kostenlos für Public Repos). .env in .gitignore (niemals committen). Secrets in Vault/AWS Secrets Manager, nie in Code. Environment Variables im CI/CD-System (GitHub Actions Secrets). Kurzlebige Tokens statt langlebiger Keys. Regelmäßiger Rotation aller Keys (90-Tage-Zyklus). SAST-Scan in CI/CD-Pipeline.', 'API key leak prevention: pre-commit hook with gitleaks (blocks commit with secrets). Enable GitHub Secret Scanning (free for public repos). .env in .gitignore (never commit). Secrets in Vault/AWS Secrets Manager, never in code. Environment variables in CI/CD system (GitHub Actions Secrets). Short-lived tokens instead of long-lived keys. Regular rotation of all keys (90-day cycle). SAST scan in CI/CD pipeline.') } },
      { '@type': 'Question', name: pick(isDE, 'Was ist der Schaden wenn ein AWS Access Key geleakt wird?', 'What is the damage if an AWS Access Key leaks?'), acceptedAnswer: { '@type': 'Answer', text: pick(isDE, 'AWS Access Key Leak Konsequenzen: Angreifer nutzen geleakte Keys sofort (Bots scannen GitHub in Minuten). Typische Angriffe: Crypto-Mining (hunderte USD/h Kosten), Daten-Exfiltration aus S3, neue IAM-User anlegen für Persistenz, andere Regionen nutzen um Erkennung zu umgehen. AWS-Rechnung: bis zu 50.000 USD in einer Nacht möglich. AWS erstattet manchmal bei schneller Reaktion — sofort mit AWS Support kontaktieren.', 'AWS Access Key leak consequences: attackers use leaked keys immediately (bots scan GitHub within minutes). Typical attacks: crypto-mining (hundreds USD/h costs), data exfiltration from S3, create new IAM users for persistence, use other regions to evade detection. AWS bill: up to 50,000 USD in one night possible. AWS sometimes reimburses with fast response — contact AWS Support immediately.') } },
    ],
  }

  return (
    <main className="py-14 border-b border-white/5" style={{ background: "var(--surface-0)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Container>
        <article className="mx-auto max-w-4xl space-y-8">
          <header className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-400/90">Incident Response Playbook</p>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{copy.h1}</h1>
            <p className="text-zinc-300 max-w-3xl">{copy.intro}</p>
          </header>

          <section className="rounded-2xl border border-white/10 bg-black/20 p-6">
            <h2 className="text-xl font-black text-white mb-4">{copy.phasesTitle}</h2>
            <ol className="space-y-2 text-zinc-300 text-sm list-decimal pl-5">
              {copy.phases.map((phase) => (
                <li key={phase}>{phase}</li>
              ))}
            </ol>
          </section>

          <section className="rounded-2xl border border-white/10 bg-black/20 p-6">
            <h2 className="text-xl font-black text-white mb-4">{copy.checklistTitle}</h2>
            <ul className="space-y-2 text-zinc-300 text-sm">
              {copy.checklist.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-white/10 bg-black/20 p-6">
            <h2 className="text-xl font-black text-white mb-3">{copy.aftercareTitle}</h2>
            <ul className="space-y-2 text-zinc-300 text-sm">
              {copy.aftercare.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-zinc-500">{copy.disclaimer}</p>
          </section>

          <div className="flex flex-wrap gap-3">
            <Link href={coreLinks.check} className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-black">
              {copy.ctaCheck}
            </Link>
            <Link href={`${prefix}/ai-agent-security`} className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white">
              {copy.ctaAiSecurity}
            </Link>
            <Link href={`${prefix}/openclaw-security-check`} className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white">
              {copy.ctaOpenclawCheck}
            </Link>
            <Link href={coreLinks.methodology} className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white">
              {copy.ctaMethodik}
            </Link>
          </div>
        </article>
      </Container>
    </main>
  )
}
