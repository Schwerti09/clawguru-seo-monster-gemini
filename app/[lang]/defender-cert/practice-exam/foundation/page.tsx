import type { Metadata } from "next"
import Link from "next/link"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import PracticeExamClient from "@/components/cert/PracticeExamClient"
import AuthorBox from "@/components/seo/AuthorBox"
import LastUpdated from "@/components/seo/LastUpdated"
import { buildAuthoredArticleSchema } from "@/lib/seo/author"
import { pick } from "@/lib/i18n-pick"

interface PageProps {
  params: { lang: string }
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/defender-cert/practice-exam/foundation"
const PUBLISHED = "2026-04-20"
const MODIFIED = "2026-04-20"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const title = pick(isDE, "Defender Foundation — Kostenlose Übungsprüfung | ClawGuru", "Defender Foundation — Free Practice Exam | ClawGuru")
  const description = pick(isDE, "Teste dein Security-Wissen mit 15 Praxis-Fragen aus der offiziellen ClawGuru Defender Foundation Prüfung. Sofortiges Feedback, kein Account nötig.", "Test your security knowledge with 15 practice questions from the official ClawGuru Defender Foundation exam. Instant feedback, no account needed.")
  return {
    title,
    description,
    keywords: [
      "security certification practice exam",
      "defender foundation practice",
      "clawguru practice exam",
      "free security exam",
      "secops exam prep",
    ],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

export default function PracticeExamFoundationPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  const articleSchema = buildAuthoredArticleSchema({
    headline: pick(isDE, "Defender Foundation — Kostenlose Übungsprüfung", "Defender Foundation — Free Practice Exam"),
    description: pick(isDE, "15 Praxis-Fragen aus dem offiziellen Foundation-Fragenpool. Sofortiges Feedback + personalisierte Weiterbildungs-Empfehlungen.", "15 practice questions from the official Foundation question pool. Instant feedback + personalized learning recommendations."),
    url: `${SITE_URL}/${locale}${PATH}`,
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    inLanguage: locale,
    articleType: "Article",
  })

  const quizSchema = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: "ClawGuru Defender Foundation Practice Exam",
    about: {
      "@type": "Thing",
      name: "IT Security Fundamentals",
    },
    educationalLevel: "Professional",
    numberOfQuestions: 15,
    timeRequired: "PT25M",
    url: `${SITE_URL}/${locale}${PATH}`,
    inLanguage: locale,
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([articleSchema, quizSchema]) }}
      />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href={`/${locale}`} className="hover:text-cyan-400">ClawGuru</Link>
            </li>
            <li>/</li>
            <li>
              <Link href={`/${locale}/defender-cert`} className="hover:text-cyan-400">
                {pick(isDE, "Defender-Zertifizierung", "Defender Certification")}
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-300">
              {pick(isDE, "Foundation Practice", "Foundation Practice")}
            </li>
          </ol>
        </nav>

        <header className="mb-10 max-w-3xl">
          <div className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-semibold border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
            {pick(isDE, "🎓 Kostenlose Übungsprüfung", "🎓 Free practice exam")}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-3">
            {pick(isDE, "Defender Foundation — Practice Exam", "Defender Foundation — Practice Exam")}
          </h1>
          <LastUpdated date={MODIFIED} publishedDate={PUBLISHED} showPublished locale={locale} className="mb-4" />
          <p className="text-gray-300">
            {pick(isDE, "Prüfe deinen Wissensstand mit 15 realen Praxis-Fragen aus dem offiziellen Foundation-Fragenpool. Kein Account, keine Registrierung — nur dein Ergebnis + detaillierte Erklärungen.", "Check your knowledge level with 15 real practice questions from the official Foundation question pool. No account, no signup — just your result + detailed explanations.")}
          </p>
        </header>

        <PracticeExamClient locale={isDE ? "de" : "en"} />

        <section className="mt-16 max-w-3xl">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-3">
              {pick(isDE, "Weiter lernen", "Keep learning")}
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              {pick(isDE, "Diese Practice ist ein Auszug. Die offizielle Foundation-Prüfung hat 60 Fragen und einen Pass-Score von 70%. Drei Wege zur Prüfungsvorbereitung:", "This practice is a subset. The official Foundation exam has 60 questions and a 70% pass score. Three paths to exam prep:")}
            </p>
            <ol className="space-y-2 text-sm text-gray-300">
              <li>
                <span className="font-semibold text-cyan-300">1. </span>
                <Link href={`/${locale}/runbooks`} className="underline hover:text-cyan-300">
                  {pick(isDE, "Runbooks lesen", "Read runbooks")}
                </Link>{" "}
                —{" "}
                {pick(isDE, "jede Prüfungs-Topic hat dedizierte Playbooks.", "every exam topic has dedicated playbooks.")}
              </li>
              <li>
                <span className="font-semibold text-cyan-300">2. </span>
                <Link href={`/${locale}/daypass`} className="underline hover:text-cyan-300">
                  {pick(isDE, "Day Pass €5", "Day Pass €5")}
                </Link>{" "}
                —{" "}
                {pick(isDE, "24h Vollzugriff auf alle Runbooks + Copilot.", "24h full access to all runbooks + copilot.")}
              </li>
              <li>
                <span className="font-semibold text-cyan-300">3. </span>
                <Link href={`/${locale}/defender-cert`} className="underline hover:text-cyan-300">
                  {pick(isDE, "Warteliste Foundation", "Foundation waitlist")}
                </Link>{" "}
                —{" "}
                {pick(isDE, "Early-Bird 20% Rabatt + 6 Monate Pro-Zugang.", "early-bird 20% off + 6 months Pro access.")}
              </li>
            </ol>
          </div>
        </section>

        <AuthorBox locale={locale} variant="full" className="mt-12" />
      </div>
    </div>
  )
}
