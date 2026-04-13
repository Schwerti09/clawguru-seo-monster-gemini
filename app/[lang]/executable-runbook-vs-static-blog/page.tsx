import type { Metadata } from "next"
import Link from "next/link"

import Container from "@/components/shared/Container"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { getCoreSecurityLinks } from "@/lib/core-security-links"
import { getRunbookVsBlogCopy } from "@/lib/content-runbook-vs-blog-i18n"

export const revalidate = 60

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  const copy = getRunbookVsBlogCopy(locale)
  return {
    title: copy.title,
    description: copy.description,
    alternates: buildLocalizedAlternates(locale, "/executable-runbook-vs-static-blog"),
    openGraph: {
      images: ["/og-image.png"],
      title: copy.title,
      description: copy.description,
      type: "article",
    },
  }
}

export default function RunbookVsBlogPage(props: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  const copy = getRunbookVsBlogCopy(locale)
  const coreLinks = getCoreSecurityLinks(locale)
  const prefix = `/${locale}`

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: copy.h1,
    description: copy.description,
    inLanguage: locale,
    mainEntityOfPage: `${prefix}/executable-runbook-vs-static-blog`,
  }

  const isDE = locale === 'de'
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: isDE ? 'Was ist ein Executable Runbook?' : 'What is an executable runbook?', acceptedAnswer: { '@type': 'Answer', text: isDE ? 'Ein Executable Runbook ist ein interaktives, ausführbares Playbook das Schritt für Schritt durch einen Prozess führt und dabei Code, Befehle und Checks direkt ausführt. Im Gegensatz zu statischen Blog-Posts: kein Copy-Paste von Befehlen nötig, automatische Validierung jedes Schritts, personalisierte Parameter (dein Server, dein Hostname), Fortschrittstracking. ClawGuru bietet 600+ Executable Security Runbooks.' : 'An executable runbook is an interactive, executable playbook that guides step-by-step through a process while directly executing code, commands and checks. Unlike static blog posts: no copy-paste of commands needed, automatic validation of each step, personalized parameters (your server, your hostname), progress tracking. ClawGuru offers 600+ executable security runbooks.' } },
      { '@type': 'Question', name: isDE ? 'Warum sind statische Blog-Posts für Security-Anleitungen gefährlich?' : 'Why are static blog posts dangerous for security guides?', acceptedAnswer: { '@type': 'Answer', text: isDE ? 'Statische Blog-Posts Probleme: Veraltete Befehle (Syntax ändert sich mit Versionen). Kein Feedback ob ein Schritt erfolgreich war. Copy-Paste-Fehler führen zu kaputten Configs. Kein Kontext zu deiner spezifischen Umgebung. Keine Rollback-Anleitung bei Fehlern. Executable Runbooks lösen alle diese Probleme: immer aktuell, automatische Verifikation, umgebungsspezifische Parameter, Rollback-Steps integriert.' : 'Static blog post problems: outdated commands (syntax changes with versions). No feedback whether a step succeeded. Copy-paste errors lead to broken configs. No context for your specific environment. No rollback guidance on errors. Executable runbooks solve all these problems: always current, automatic verification, environment-specific parameters, integrated rollback steps.' } },
      { '@type': 'Question', name: isDE ? 'Wie unterscheidet sich ClawGuru von einem statischen Hardening-Guide?' : 'How does ClawGuru differ from a static hardening guide?', acceptedAnswer: { '@type': 'Answer', text: isDE ? 'ClawGuru vs statischer Guide: Statischer Guide: Text lesen, Befehle manuell ausführen, hoffen dass es funktioniert. ClawGuru Executable Runbook: automatischer Security-Check vor dem Runbook (Baseline), Schritt-für-Schritt Ausführung mit Validierung, Re-Check nach jedem kritischen Schritt, Score-Verbesserung sichtbar in Echtzeit, Audit-Trail aller ausgeführten Schritte für Compliance.' : 'ClawGuru vs static guide: static guide: read text, execute commands manually, hope it works. ClawGuru executable runbook: automatic security check before runbook (baseline), step-by-step execution with validation, re-check after each critical step, score improvement visible in real time, audit trail of all executed steps for compliance.' } },
      { '@type': 'Question', name: isDE ? 'Kann ich Runbooks in meiner CI/CD-Pipeline nutzen?' : 'Can I use runbooks in my CI/CD pipeline?', acceptedAnswer: { '@type': 'Answer', text: isDE ? 'ClawGuru Runbooks in CI/CD: Ja — über die ClawGuru API können Runbooks automatisch ausgeführt werden. Integration: GitHub Actions Step, GitLab CI Job, Jenkins Stage. Use Cases: automatische Hardening-Verifikation bei jedem Deploy, Security-Gate vor Prod-Deploy (schlägt fehl wenn Score unter Threshold), kontinuierliche Compliance-Überprüfung. API-Dokumentation unter /api-docs.' : 'ClawGuru runbooks in CI/CD: yes — runbooks can be automatically executed via the ClawGuru API. Integration: GitHub Actions step, GitLab CI job, Jenkins stage. Use cases: automatic hardening verification on every deploy, security gate before prod deploy (fails if score below threshold), continuous compliance verification. API documentation at /api-docs.' } },
    ],
  }

  return (
    <main className="py-14 border-b border-white/5" style={{ background: "var(--surface-0)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Container>
        <article className="mx-auto max-w-4xl space-y-8">
          <header className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-400/90">Execution Design Guide</p>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{copy.h1}</h1>
            <p className="text-zinc-300 max-w-3xl">{copy.intro}</p>
          </header>

          <section className="rounded-2xl border border-white/10 bg-black/20 p-6">
            <h2 className="text-xl font-black text-white mb-4">{copy.compareTitle}</h2>
            <ul className="space-y-2 text-zinc-300 text-sm">
              {copy.compare.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-white/10 bg-black/20 p-6">
            <h2 className="text-xl font-black text-white mb-3">{copy.whyRunbookTitle}</h2>
            <ul className="space-y-2 text-zinc-300 text-sm">
              {copy.whyRunbook.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-white/10 bg-black/20 p-6">
            <h2 className="text-xl font-black text-white mb-3">{copy.transitionTitle}</h2>
            <ol className="space-y-2 text-zinc-300 text-sm list-decimal pl-5">
              {copy.transition.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
            <p className="mt-4 text-xs text-zinc-500">{copy.disclaimer}</p>
          </section>

          <div className="flex flex-wrap gap-3">
            <Link href={`${prefix}/runbooks`} className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-black">
              {copy.ctaRunbooks}
            </Link>
            <Link href={coreLinks.check} className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white">
              {copy.ctaCheck}
            </Link>
            <Link href={`${prefix}/openclaw`} className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white">
              {copy.ctaOpenclaw}
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
