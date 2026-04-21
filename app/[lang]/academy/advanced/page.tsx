"use client"

import { useState } from "react"
import Link from "next/link"
import type { Locale } from "@/lib/i18n"

interface Lesson {
  id: number
  title: string
  titleEn: string
  content: string
  contentEn: string
  duration: string
}

const LESSONS: Lesson[] = [
  {
    id: 1,
    title: "Lektion 1: Prompt Injection — wie Angreifer AI-Agents kapern",
    titleEn: "Lesson 1: Prompt Injection — how attackers hijack AI agents",
    content: "Prompt Injection ist der häufigste Angriff auf LLMs. Angreifer manipulieren den Prompt, um den Agent dazu zu bringen, unerwünschte Aktionen auszuführen. Schutz: Input-Validierung, Prompt-Template-Isolation, Output-Filtering, Sandboxing.",
    contentEn: "Prompt Injection is the most common attack on LLMs. Attackers manipulate the prompt to make the agent perform unwanted actions. Protection: Input validation, prompt template isolation, output filtering, sandboxing.",
    duration: "20 Min"
  },
  {
    id: 2,
    title: "Lektion 2: LLM Gateway Hardening",
    titleEn: "Lesson 2: LLM Gateway Hardening",
    content: "Ein LLM-Gateway ist der Einstiegspunkt für alle AI-Anfragen. Hardening: Rate Limiting, Authentifizierung, Request-Logging, Output-Sanitization, Context-Window-Limits. Nutze dedizierte Gateways wie LangChain oder custom Middleware.",
    contentEn: "An LLM Gateway is the entry point for all AI requests. Hardening: Rate limiting, authentication, request logging, output sanitization, context window limits. Use dedicated gateways like LangChain or custom middleware.",
    duration: "20 Min"
  },
  {
    id: 3,
    title: "Lektion 3: AI Agent Sandboxing",
    titleEn: "Lesson 3: AI Agent Sandboxing",
    content: "AI-Agents sollten isoliert laufen. Nutze Container (Docker/Podman), Netzwerk-Isolation, Read-only-Dateisysteme, Resource-Limits. Verhindere Zugriff auf sensible Systeme. Nutze ephemerale Container die nach jeder Anfrage gelöscht werden.",
    contentEn: "AI agents should run in isolation. Use containers (Docker/Podman), network isolation, read-only filesystems, resource limits. Prevent access to sensitive systems. Use ephemeral containers that are deleted after each request.",
    duration: "20 Min"
  },
  {
    id: 4,
    title: "Lektion 4: Threat Modeling für AI-Systeme",
    titleEn: "Lesson 4: Threat Modeling for AI Systems",
    content: "Threat Modeling für AI: Identifiziere Assets (Prompts, Models, Daten), Bedrohungen (Prompt Injection, Data Poisoning, Model Extraction), Gegenmaßnahmen. Nutze STRIDE oder PASTA. Dokumentiere Threat Model regelmäßig.",
    contentEn: "Threat Modeling for AI: Identify assets (prompts, models, data), threats (prompt injection, data poisoning, model extraction), countermeasures. Use STRIDE or PASTA. Document threat models regularly.",
    duration: "20 Min"
  },
  {
    id: 5,
    title: "Lektion 5: OWASP Top 10 für LLMs",
    titleEn: "Lesson 5: OWASP Top 10 for LLMs",
    content: "OWASP LLM Top 10: 1. LLM01 Prompt Injection, 2. LLM02 Insecure Output Handling, 3. LLM03 Training Data Poisoning, 4. LLM04 Model DoS, 5. LLM05 Supply Chain Vulnerabilities, 6. LLM06 Sensitive Information Disclosure, 7. LLM07 Insecure Plugin Design, 8. LLM08 Excessive Agency, 9. LLM09 Overreliance, 10. LLM10 Model Theft.",
    contentEn: "OWASP LLM Top 10: 1. LLM01 Prompt Injection, 2. LLM02 Insecure Output Handling, 3. LLM03 Training Data Poisoning, 4. LLM04 Model DoS, 5. LLM05 Supply Chain Vulnerabilities, 6. LLM06 Sensitive Information Disclosure, 7. LLM07 Insecure Plugin Design, 8. LLM08 Excessive Agency, 9. LLM09 Overreliance, 10. LLM10 Model Theft.",
    duration: "25 Min"
  },
  {
    id: 6,
    title: "Lektion 6: Compliance (EU AI Act)",
    titleEn: "Lesson 6: Compliance (EU AI Act)",
    content: "EU AI Act reguliert AI-Systeme nach Risiko-Kategorien: Unacceptable Risk (verboten), High Risk (z.B. medizinische Diagnose), Limited Risk (z.B. Chatbots), Minimal Risk. High-Risk-Systeme benötigen: Risk Management System, Quality Management, Technical Documentation, Transparency, Human Oversight.",
    contentEn: "EU AI Act regulates AI systems by risk categories: Unacceptable Risk (banned), High Risk (e.g. medical diagnosis), Limited Risk (e.g. chatbots), Minimal Risk. High-Risk systems require: Risk Management System, Quality Management, Technical Documentation, Transparency, Human Oversight.",
    duration: "20 Min"
  }
]

const QUIZ_QUESTIONS = [
  {
    question: "Was ist Prompt Injection?",
    questionEn: "What is Prompt Injection?",
    options: ["Eine Art Firewall", "Manipulation des Prompts um unerwünschte Aktionen auszuführen", "Ein Kompressionsalgorithmus", "Ein Backup-Verfahren"],
    optionsEn: ["A type of firewall", "Manipulation of the prompt to execute unwanted actions", "A compression algorithm", "A backup procedure"],
    correct: 1
  },
  {
    question: "Welches ist der häufigste Angriff auf LLMs?",
    questionEn: "Which is the most common attack on LLMs?",
    options: ["DDoS", "SQL Injection", "Prompt Injection", "XSS"],
    correct: 2
  },
  {
    question: "Was ist LLM01 in OWASP LLM Top 10?",
    questionEn: "What is LLM01 in OWASP LLM Top 10?",
    options: ["Model Theft", "Prompt Injection", "Data Poisoning", "Supply Chain Vulnerabilities"],
    correct: 1
  },
  {
    question: "Welche Risiko-Kategorie ist im EU AI Act verboten?",
    questionEn: "Which risk category is banned in EU AI Act?",
    options: ["Limited Risk", "High Risk", "Unacceptable Risk", "Minimal Risk"],
    correct: 2
  }
]

export default function AdvancedPage({ params }: { params: { lang: string } }) {
  const locale = (params.lang === "de" ? "de" : "en") as Locale
  const prefix = `/${locale}`
  const [currentLesson, setCurrentLesson] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<number[]>([])
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizScore, setQuizScore] = useState(0)

  const handleNextLesson = () => {
    if (currentLesson < LESSONS.length - 1) {
      setCurrentLesson(currentLesson + 1)
    } else {
      setShowQuiz(true)
    }
  }

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...quizAnswers]
    newAnswers[questionIndex] = answerIndex
    setQuizAnswers(newAnswers)
  }

  const submitQuiz = () => {
    let score = 0
    QUIZ_QUESTIONS.forEach((q, i) => {
      if (quizAnswers[i] === q.correct) score++
    })
    setQuizScore(score)
    setQuizCompleted(true)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      {/* HEADER */}
      <section className="py-12 bg-gradient-to-r from-red-900/30 to-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link href={`${prefix}/academy`} className="text-red-400 hover:text-red-300 mb-4 inline-block">
              ← {locale === "de" ? "Zurück zur Academy" : "Back to Academy"}
            </Link>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              {locale === "de" ? "AI Agent Security" : "AI Agent Security"}
            </h1>
            <p className="text-xl text-gray-300">
              {locale === "de" ? "6 Lektionen • ~120 Minuten" : "6 Lessons • ~120 Minutes"}
            </p>
          </div>
        </div>
      </section>

      {!showQuiz ? (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>{locale === "de" ? "Fortschritt" : "Progress"}</span>
                  <span>{currentLesson + 1} / {LESSONS.length}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentLesson + 1) / LESSONS.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Lesson Card */}
              <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-red-900/50 flex items-center justify-center text-3xl font-black text-red-400">
                    {LESSONS[currentLesson].id}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-100 mb-1">
                      {locale === "de" ? LESSONS[currentLesson].title : LESSONS[currentLesson].titleEn}
                    </h2>
                    <p className="text-red-400 text-sm">⏱️ {LESSONS[currentLesson].duration}</p>
                  </div>
                </div>
                <div className="text-lg text-gray-300 leading-relaxed mb-8">
                  {locale === "de" ? LESSONS[currentLesson].content : LESSONS[currentLesson].contentEn}
                </div>
                <button
                  onClick={handleNextLesson}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-lg transition-colors"
                >
                  {locale === "de" ? "Nächste Lektion" : "Next Lesson"} →
                </button>
              </div>

              {/* Lesson List */}
              <div className="space-y-3">
                {LESSONS.map((lesson, index) => (
                  <div 
                    key={lesson.id}
                    className={`p-4 rounded-lg border transition-all ${
                      index === currentLesson 
                        ? "bg-red-900/20 border-red-500" 
                        : index < currentLesson 
                          ? "bg-gray-800 border-gray-700 opacity-60" 
                          : "bg-gray-800 border-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        index === currentLesson 
                          ? "bg-red-500 text-white" 
                          : index < currentLesson 
                            ? "bg-red-600 text-white" 
                            : "bg-gray-700 text-gray-400"
                      }`}>
                        {index < currentLesson ? "✓" : lesson.id}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-100">
                          {locale === "de" ? lesson.title : lesson.titleEn}
                        </h3>
                        <p className="text-sm text-gray-400">⏱️ {lesson.duration}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {!quizCompleted ? (
                <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
                  <h2 className="text-3xl font-bold text-gray-100 mb-6 text-center">
                    {locale === "de" ? "Quiz" : "Quiz"}
                  </h2>
                  <p className="text-gray-400 mb-8 text-center">
                    {locale === "de" ? "Teste dein Wissen!" : "Test your knowledge!"}
                  </p>
                  <div className="space-y-8">
                    {QUIZ_QUESTIONS.map((q, i) => (
                      <div key={i}>
                        <h3 className="text-xl font-bold text-gray-100 mb-4">
                          {i + 1}. {locale === "de" ? q.question : q.questionEn}
                        </h3>
                        <div className="space-y-3">
                          {(locale === "de" ? q.options : q.optionsEn || q.options).map((option, optIndex) => (
                            <button
                              key={optIndex}
                              onClick={() => handleQuizAnswer(i, optIndex)}
                              className={`w-full p-4 rounded-lg border text-left transition-all ${
                                quizAnswers[i] === optIndex
                                  ? "bg-red-600 border-red-500 text-white"
                                  : "bg-gray-700 border-gray-600 text-gray-100 hover:bg-gray-600"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={submitQuiz}
                    disabled={quizAnswers.length < QUIZ_QUESTIONS.length}
                    className="w-full mt-8 bg-red-600 hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-colors"
                  >
                    {locale === "de" ? "Quiz absenden" : "Submit Quiz"}
                  </button>
                </div>
              ) : (
                <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 text-center">
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-3xl font-bold text-gray-100 mb-4">
                    {locale === "de" ? "Geschafft!" : "Done!"}
                  </h2>
                  <p className="text-xl text-gray-300 mb-6">
                    {locale === "de" 
                      ? `Du hast ${quizScore} von ${QUIZ_QUESTIONS.length} Fragen richtig beantwortet.`
                      : `You got ${quizScore} out of ${QUIZ_QUESTIONS.length} questions correct.`}
                  </p>
                  {quizScore === QUIZ_QUESTIONS.length && (
                    <div className="bg-red-900/30 border border-red-500 rounded-lg p-6 mb-6">
                      <h3 className="text-2xl font-bold text-red-400 mb-2">
                        {locale === "de" ? "Completion Badge" : "Completion Badge"}
                      </h3>
                      <p className="text-red-200">
                        {locale === "de" 
                          ? "Du hast den Advanced-Pfad abgeschlossen! 🏆"
                          : "You completed the Advanced path! 🏆"}
                      </p>
                    </div>
                  )}
                  <Link
                    href={`${prefix}/academy`}
                    className="inline-block bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-4 rounded-lg transition-colors"
                  >
                    {locale === "de" ? "Zurück zur Academy →" : "Back to Academy →"}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
