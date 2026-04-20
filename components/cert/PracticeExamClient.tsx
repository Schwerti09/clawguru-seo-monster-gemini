"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { CheckCircle2, XCircle, Clock, Award, ArrowRight, RotateCw, Share2, Shield } from "lucide-react"
import { FOUNDATION_EXAM_QUESTIONS, FOUNDATION_EXAM_CONFIG, type Question } from "@/lib/cert/question-bank"

type Phase = "intro" | "exam" | "review" | "result"
type Locale = "de" | "en"

interface Props {
  locale: Locale
}

const STORAGE_KEY = "clawguru_defender_practice_v1"

export default function PracticeExamClient({ locale }: Props) {
  const isDE = locale === "de"
  const questions = FOUNDATION_EXAM_QUESTIONS
  const config = FOUNDATION_EXAM_CONFIG

  const [phase, setPhase] = useState<Phase>("intro")
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [currentIdx, setCurrentIdx] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(config.durationMinutes * 60)
  const [startedAt, setStartedAt] = useState<number | null>(null)

  // Hydrate from localStorage (allow resume in-progress exam)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const saved = JSON.parse(raw)
      if (saved?.phase === "exam" && typeof saved.currentIdx === "number") {
        setAnswers(saved.answers || {})
        setCurrentIdx(saved.currentIdx)
        setStartedAt(saved.startedAt || Date.now())
        setPhase("exam")
      }
    } catch {}
  }, [])

  // Persist progress
  useEffect(() => {
    if (phase !== "exam") return
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ phase, answers, currentIdx, startedAt })
      )
    } catch {}
  }, [phase, answers, currentIdx, startedAt])

  // Timer
  useEffect(() => {
    if (phase !== "exam" || !startedAt) return
    const tick = () => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000)
      const left = config.durationMinutes * 60 - elapsed
      setSecondsLeft(left)
      if (left <= 0) {
        finish()
      }
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, startedAt])

  const start = () => {
    setAnswers({})
    setCurrentIdx(0)
    setStartedAt(Date.now())
    setPhase("exam")
  }

  const selectOption = (qid: string, optionId: string, multi: boolean) => {
    setAnswers((prev) => {
      const current = prev[qid] || []
      let next: string[]
      if (multi) {
        next = current.includes(optionId) ? current.filter((x) => x !== optionId) : [...current, optionId]
      } else {
        next = [optionId]
      }
      return { ...prev, [qid]: next }
    })
  }

  const finish = () => {
    setPhase("result")
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
  }

  const next = () => {
    if (currentIdx < questions.length - 1) setCurrentIdx(currentIdx + 1)
    else finish()
  }

  const prev = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1)
  }

  const score = useMemo(() => {
    let correct = 0
    for (const q of questions) {
      const sel = answers[q.id] || []
      const expected = q.correctOptionIds
      if (sel.length === expected.length && sel.every((s) => expected.includes(s))) {
        correct += 1
      }
    }
    return { correct, total: questions.length, percent: Math.round((correct / questions.length) * 100) }
  }, [answers, questions])

  const passed = score.percent >= config.passingScorePercent

  // ===== INTRO =====
  if (phase === "intro") {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-cyan-900/20 to-purple-900/20 border border-cyan-700/40 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-cyan-500/20 p-3 rounded-lg">
              <Award className="h-6 w-6 text-cyan-400" aria-hidden />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                {isDE ? "Kostenlose Übungsprüfung" : "Free practice exam"}
              </div>
              <h2 className="text-2xl font-bold text-white">
                {isDE ? "Defender Foundation — Practice" : "Defender Foundation — Practice"}
              </h2>
            </div>
          </div>
          <p className="text-gray-300 mb-6">
            {isDE
              ? "15 Praxis-Fragen aus dem echten Foundation-Fragenpool. Du bekommst Score + Erklärung je Frage + ein personalisiertes Feedback, welche Themen du vertiefen solltest."
              : "15 practice questions drawn from the actual Foundation question pool. You get a score + per-question explanation + personalized feedback on which topics to deepen."}
          </p>
          <div className="grid sm:grid-cols-3 gap-3 mb-6 text-sm">
            <div className="bg-black/30 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-cyan-300">{config.totalQuestions}</div>
              <div className="text-xs text-gray-400">{isDE ? "Fragen" : "Questions"}</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-cyan-300">{config.durationMinutes} min</div>
              <div className="text-xs text-gray-400">{isDE ? "Zeit" : "Time"}</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-cyan-300">{config.passingScorePercent}%</div>
              <div className="text-xs text-gray-400">{isDE ? "Bestanden" : "Pass"}</div>
            </div>
          </div>
          <button
            onClick={start}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-black text-lg shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all"
          >
            <Shield className="h-5 w-5" aria-hidden />
            {isDE ? "Prüfung starten" : "Start exam"}
            <ArrowRight className="h-5 w-5" aria-hidden />
          </button>
          <p className="mt-3 text-xs text-gray-500">
            {isDE
              ? "Kein Account nötig · Resume bei Tab-Schließen · DSGVO-konform (Daten bleiben im Browser)"
              : "No account needed · Resume on tab-close · GDPR-compliant (data stays in browser)"}
          </p>
        </div>
      </div>
    )
  }

  // ===== EXAM =====
  if (phase === "exam") {
    const q = questions[currentIdx]
    const sel = answers[q.id] || []
    const multi = q.correctOptionIds.length > 1
    const answered = sel.length > 0
    const mm = Math.max(0, Math.floor(secondsLeft / 60))
    const ss = Math.max(0, secondsLeft % 60).toString().padStart(2, "0")
    const progress = ((currentIdx + 1) / questions.length) * 100

    return (
      <div className="max-w-3xl mx-auto">
        {/* Header bar */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="text-gray-400">
            {isDE ? "Frage" : "Question"} <span className="text-white font-bold">{currentIdx + 1}</span> /{" "}
            {questions.length}
          </div>
          <div className={`flex items-center gap-1.5 font-mono tabular-nums ${secondsLeft < 120 ? "text-red-400" : "text-cyan-400"}`}>
            <Clock className="h-4 w-4" aria-hidden />
            {mm}:{ss}
          </div>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full mb-8 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all" style={{ width: `${progress}%` }} />
        </div>

        {/* Question */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 mb-4">
          <div className="flex items-center gap-2 mb-3 text-xs">
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
              {q.topic}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">
              {q.difficulty}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-6 leading-snug">
            {q.prompt[locale]}
          </h3>
          <div className="space-y-2">
            {q.options.map((opt) => {
              const isSelected = sel.includes(opt.id)
              return (
                <button
                  key={opt.id}
                  onClick={() => selectOption(q.id, opt.id, multi)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                    isSelected
                      ? "bg-cyan-500/10 border-cyan-500 text-white"
                      : "bg-gray-950 border-gray-800 text-gray-300 hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`shrink-0 w-6 h-6 rounded ${multi ? "" : "rounded-full"} border flex items-center justify-center text-xs font-bold ${
                        isSelected ? "bg-cyan-500 border-cyan-500 text-black" : "border-gray-600 text-gray-500"
                      }`}
                    >
                      {isSelected ? "✓" : opt.id.toUpperCase()}
                    </span>
                    <span>{opt[locale]}</span>
                  </div>
                </button>
              )
            })}
          </div>
          {multi && (
            <p className="mt-4 text-xs text-gray-500">
              {isDE ? "Mehrere Antworten möglich" : "Multiple answers possible"}
            </p>
          )}
        </div>

        {/* Nav */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={prev}
            disabled={currentIdx === 0}
            className="px-5 py-2.5 rounded-lg border border-gray-700 text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-900"
          >
            {isDE ? "Zurück" : "Back"}
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={finish}
              className="text-xs text-gray-500 hover:text-gray-300 underline"
            >
              {isDE ? "Abgeben" : "Submit"}
            </button>
            <button
              onClick={next}
              disabled={!answered}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] transition-all flex items-center gap-2"
            >
              {currentIdx === questions.length - 1
                ? isDE
                  ? "Abgeben"
                  : "Submit"
                : isDE
                ? "Weiter"
                : "Next"}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ===== RESULT =====
  const wrongQuestions = questions.filter((q) => {
    const sel = answers[q.id] || []
    return !(sel.length === q.correctOptionIds.length && sel.every((s) => q.correctOptionIds.includes(s)))
  })

  const badgeColor = passed ? "cyan" : "amber"
  const resultHeadline = passed
    ? isDE
      ? "Bestanden! 🛡️"
      : "Passed! 🛡️"
    : isDE
    ? "Nicht bestanden — aber nah dran."
    : "Not passed — but close."

  const weakTopics = Array.from(
    new Set(wrongQuestions.map((q) => q.topic))
  ).slice(0, 3)

  const shareText = encodeURIComponent(
    isDE
      ? `Ich habe die ClawGuru Defender Foundation Practice mit ${score.percent}% geschafft. Probier's selbst:`
      : `I just scored ${score.percent}% on the ClawGuru Defender Foundation practice exam. Try it:`
  )
  const shareUrl = typeof window !== "undefined" ? window.location.href.split("?")[0] : ""

  return (
    <div className="max-w-3xl mx-auto">
      {/* Score card */}
      <div className={`bg-gradient-to-br ${passed ? "from-cyan-900/30 to-green-900/20 border-cyan-700/50" : "from-amber-900/20 to-red-900/10 border-amber-700/40"} border rounded-2xl p-8 mb-6 text-center`}>
        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-black/40 text-xs font-semibold text-gray-300">
          {isDE ? "Ergebnis" : "Result"} · {config.certificateLabel}
        </div>
        <div className={`text-6xl font-black mb-2 ${passed ? "text-cyan-300" : "text-amber-300"}`}>
          {score.percent}%
        </div>
        <div className="text-sm text-gray-400 mb-4">
          {score.correct} / {score.total} {isDE ? "korrekt" : "correct"} ·{" "}
          {isDE ? "Bestanden bei" : "Pass at"} {config.passingScorePercent}%
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">{resultHeadline}</h2>
        {passed ? (
          <p className="text-gray-300 mb-6 max-w-xl mx-auto">
            {isDE
              ? "Solide Foundation-Basis! Für das echte Zertifikat (60 Fragen, offiziell) setz dich auf die Warteliste — Early-Bird gibt 20% Rabatt."
              : "Solid Foundation basis! For the real certificate (60 questions, official), join the waitlist — early-bird gets 20% off."}
          </p>
        ) : (
          <p className="text-gray-300 mb-6 max-w-xl mx-auto">
            {isDE
              ? "Du bist dicht am Pass-Score. Unsere Runbook-Library deckt alle Prüfungs-Topics ab — mit Day Pass bekommst du 24h Vollzugriff."
              : "You're close to the pass score. Our runbook library covers every exam topic — with a Day Pass you get 24h full access."}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {passed ? (
            <>
              <a
                href={`mailto:certification@clawguru.org?subject=${encodeURIComponent(
                  isDE ? "Defender Foundation Warteliste (Practice bestanden)" : "Defender Foundation waitlist (passed practice)"
                )}&body=${encodeURIComponent(
                  isDE
                    ? `Hi,\n\nIch habe die kostenlose Practice mit ${score.percent}% bestanden und möchte auf die Warteliste für die offizielle Foundation-Prüfung.\n\nName: \nLinkedIn: \n`
                    : `Hi,\n\nI passed the free practice with ${score.percent}% and want to join the waitlist for the official Foundation exam.\n\nName: \nLinkedIn: \n`
                )}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-black shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all"
              >
                <Award className="h-4 w-4" aria-hidden />
                {isDE ? "Warteliste — Early Bird 20%" : "Waitlist — early-bird 20% off"}
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-cyan-500/40 text-cyan-200 hover:bg-cyan-500/10"
              >
                <Share2 className="h-4 w-4" aria-hidden />
                {isDE ? "Ergebnis teilen" : "Share result"}
              </a>
            </>
          ) : (
            <>
              <Link
                href={`/${locale}/daypass`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 text-black font-black shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-all"
              >
                <Shield className="h-4 w-4" aria-hidden />
                {isDE ? "Day Pass €5 — Runbooks unlocken" : "Day Pass €5 — unlock runbooks"}
              </Link>
              <button
                onClick={start}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-900"
              >
                <RotateCw className="h-4 w-4" aria-hidden />
                {isDE ? "Nochmal versuchen" : "Try again"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Weak topics */}
      {weakTopics.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
            {isDE ? "Fokus-Themen für dich" : "Focus topics for you"}
          </h3>
          <div className="flex flex-wrap gap-2">
            {weakTopics.map((topic) => (
              <Link
                key={topic}
                href={`/${locale}/runbooks?topic=${encodeURIComponent(topic)}`}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 text-sm hover:bg-cyan-500/20"
              >
                {topic} →
              </Link>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            {isDE
              ? "Diese Themen deckt unsere Runbook-Library mit hunderten Copy-Paste-Playbooks ab."
              : "Our runbook library covers these topics with hundreds of copy-paste playbooks."}
          </p>
        </div>
      )}

      {/* Per-question review */}
      <details className="bg-gray-900 border border-gray-800 rounded-2xl p-6 group">
        <summary className="font-semibold text-gray-100 cursor-pointer list-none flex items-center justify-between">
          <span>{isDE ? "Alle Fragen + Erklärungen ansehen" : "Review all questions + explanations"}</span>
          <span className="text-cyan-400 group-open:rotate-45 transition-transform">+</span>
        </summary>
        <div className="mt-5 space-y-5">
          {questions.map((q, i) => {
            const sel = answers[q.id] || []
            const isCorrect = sel.length === q.correctOptionIds.length && sel.every((s) => q.correctOptionIds.includes(s))
            return (
              <ReviewItem key={q.id} q={q} idx={i + 1} selected={sel} isCorrect={isCorrect} locale={locale} />
            )
          })}
        </div>
      </details>
    </div>
  )
}

function ReviewItem({
  q,
  idx,
  selected,
  isCorrect,
  locale,
}: {
  q: Question
  idx: number
  selected: string[]
  isCorrect: boolean
  locale: Locale
}) {
  return (
    <div className="border-t border-gray-800 pt-5">
      <div className="flex items-start gap-2 mb-2">
        {isCorrect ? (
          <CheckCircle2 className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" aria-hidden />
        ) : (
          <XCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" aria-hidden />
        )}
        <div className="text-sm font-semibold text-white">
          {idx}. {q.prompt[locale]}
        </div>
      </div>
      <ul className="mt-2 space-y-1 text-sm">
        {q.options.map((opt) => {
          const isSelected = selected.includes(opt.id)
          const isExpected = q.correctOptionIds.includes(opt.id)
          return (
            <li
              key={opt.id}
              className={`px-3 py-1.5 rounded ${
                isExpected
                  ? "bg-cyan-500/10 text-cyan-200"
                  : isSelected
                  ? "bg-amber-500/10 text-amber-200"
                  : "text-gray-400"
              }`}
            >
              <span className="font-mono text-xs mr-2">{opt.id.toUpperCase()}.</span>
              {opt[locale]}
              {isExpected && <span className="ml-2 text-xs">✓ {locale === "de" ? "richtig" : "correct"}</span>}
              {isSelected && !isExpected && <span className="ml-2 text-xs">• {locale === "de" ? "deine Wahl" : "your pick"}</span>}
            </li>
          )
        })}
      </ul>
      <p className="mt-3 text-sm text-gray-400 italic">
        {q.explanation[locale]}
      </p>
      {q.reference && (
        <p className="mt-2 text-xs text-gray-500">
          Ref: <span className="font-mono text-cyan-400">{q.reference}</span>
        </p>
      )}
    </div>
  )
}
