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
    title: "Lektion 1: Docker Security — Container isolieren",
    titleEn: "Lesson 1: Docker Security — Container isolation",
    content: "Docker-Container sollten nicht als root laufen. Verwende USER-Anweisung im Dockerfile. Nutze read-only Dateisysteme (--read-only). Schränke Container-Ressourcen ein mit --cpus und --memory. Scanne Images mit Trivy oder Docker Scout.",
    contentEn: "Docker containers should not run as root. Use USER instruction in Dockerfile. Use read-only filesystems (--read-only). Limit container resources with --cpus and --memory. Scan images with Trivy or Docker Scout.",
    duration: "15 Min"
  },
  {
    id: 2,
    title: "Lektion 2: Nginx Hardening — Headers, Rate Limiting",
    titleEn: "Lesson 2: Nginx Hardening — Headers, Rate Limiting",
    content: "Security-Header in Nginx: add_header X-Frame-Options DENY, add_header X-Content-Type-Options nosniff, add_header X-XSS-Protection. Rate Limiting mit limit_req_zone und limit_req. SSL/TLS nur mit modernen Ciphers.",
    contentEn: "Security Headers in Nginx: add_header X-Frame-Options DENY, add_header X-Content-Type-Options nosniff, add_header X-XSS-Protection. Rate Limiting with limit_req_zone and limit_req. SSL/TLS only with modern ciphers.",
    duration: "12 Min"
  },
  {
    id: 3,
    title: "Lektion 3: Secrets Management mit Vault",
    titleEn: "Lesson 3: Secrets Management with Vault",
    content: "Speichere Passwörter nicht in Git oder Environment-Variablen. Nutze HashiCorp Vault oder AWS Secrets Manager. Rotiere Secrets regelmäßig. Verwende least-privilege IAM-Rollen für den Zugriff.",
    contentEn: "Don't store passwords in Git or environment variables. Use HashiCorp Vault or AWS Secrets Manager. Rotate secrets regularly. Use least-privilege IAM roles for access.",
    duration: "15 Min"
  },
  {
    id: 4,
    title: "Lektion 4: RBAC — wer darf was",
    titleEn: "Lesson 4: RBAC — who can do what",
    content: "Role-Based Access Control: Definiere Rollen mit minimalen Rechten. Prinzip der geringsten Privilegien. Nutze Gruppen statt einzelner User. Auditiere regelmäßig wer welche Rechte hat.",
    contentEn: "Role-Based Access Control: Define roles with minimal permissions. Principle of least privilege. Use groups instead of individual users. Regularly audit who has which permissions.",
    duration: "10 Min"
  },
  {
    id: 5,
    title: "Lektion 5: Incident Response — was tun wenn's brennt",
    titleEn: "Lesson 5: Incident Response — what to do when it burns",
    content: "Incident Response Plan: 1. Erkennen (Monitoring, Alerts), 2. Eindämmen (Systeme isolieren), 3. Beseitigen (Patchen), 4. Wiederherstellen (Backups), 5. Nachbereitung (Post-Mortem). Hab Playbooks für häufige Incidents.",
    contentEn: "Incident Response Plan: 1. Detect (Monitoring, Alerts), 2. Contain (Isolate systems), 3. Eradicate (Patch), 4. Recover (Backups), 5. Post-Mortem. Have playbooks for common incidents.",
    duration: "15 Min"
  },
  {
    id: 6,
    title: "Lektion 6: NIS2 Basics",
    titleEn: "Lesson 6: NIS2 Basics",
    content: "NIS2 ist EU-Richtlinie für kritische Infrastruktur. Erfordert Security-by-Design, Incident-Reporting innerhalb 24h, regelmäßige Audits. Betrifft Energie, Transport, Gesundheit, Finanzen. Dokumentiere alles.",
    contentEn: "NIS2 is EU directive for critical infrastructure. Requires security-by-design, incident reporting within 24h, regular audits. Affects energy, transport, health, finance. Document everything.",
    duration: "12 Min"
  },
  {
    id: 7,
    title: "Lektion 7: Automatisierter Security Check mit CI/CD",
    titleEn: "Lesson 7: Automated Security Check with CI/CD",
    content: "Integriere Security-Checks in CI/CD Pipeline. Pre-commit Hooks für Secrets-Scanning. SAST in Build-Step. Container-Scanning vor Deployment. Automatisierte Security-Checks in PRs.",
    contentEn: "Integrate security checks in CI/CD pipeline. Pre-commit hooks for secrets scanning. SAST in build step. Container scanning before deployment. Automated security checks in PRs.",
    duration: "15 Min"
  }
]

const QUIZ_QUESTIONS = [
  {
    question: "Warum sollten Docker-Container nicht als root laufen?",
    questionEn: "Why should Docker containers not run as root?",
    options: ["Bessere Performance", "Sicherheit — weniger Angriffsfläche", "Kleinere Images", "Schnellerer Build"],
    optionsEn: ["Better performance", "Security — smaller attack surface", "Smaller images", "Faster build"],
    correct: 1
  },
  {
    question: "Was ist RBAC?",
    questionEn: "What is RBAC?",
    options: ["Remote Backup Access Control", "Role-Based Access Control", "Real-time Business Analytics", "Random Block Allocation"],
    correct: 1
  },
  {
    question: "Was ist NIS2?",
    questionEn: "What is NIS2?",
    options: ["Ein Firewall-Tool", "EU-Richtlinie für kritische Infrastruktur", "Ein Container-Orchestrator", "Ein Secrets Manager"],
    optionsEn: ["A firewall tool", "EU directive for critical infrastructure", "A container orchestrator", "A secrets manager"],
    correct: 1
  },
  {
    question: "Welcher Schritt kommt im Incident Response zuerst?",
    questionEn: "Which step comes first in Incident Response?",
    options: ["Wiederherstellen", "Eindämmen", "Erkennen", "Beseitigen"],
    optionsEn: ["Recover", "Contain", "Detect", "Eradicate"],
    correct: 2
  }
]

export default function IntermediatePage({ params }: { params: { lang: string } }) {
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
      <section className="py-12 bg-gradient-to-r from-blue-900/30 to-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link href={`${prefix}/academy`} className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
              ← {locale === "de" ? "Zurück zur Academy" : "Back to Academy"}
            </Link>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              {locale === "de" ? "Stack Hardening" : "Stack Hardening"}
            </h1>
            <p className="text-xl text-gray-300">
              {locale === "de" ? "7 Lektionen • ~90 Minuten" : "7 Lessons • ~90 Minutes"}
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
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentLesson + 1) / LESSONS.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Lesson Card */}
              <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-blue-900/50 flex items-center justify-center text-3xl font-black text-blue-400">
                    {LESSONS[currentLesson].id}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-100 mb-1">
                      {locale === "de" ? LESSONS[currentLesson].title : LESSONS[currentLesson].titleEn}
                    </h2>
                    <p className="text-blue-400 text-sm">⏱️ {LESSONS[currentLesson].duration}</p>
                  </div>
                </div>
                <div className="text-lg text-gray-300 leading-relaxed mb-8">
                  {locale === "de" ? LESSONS[currentLesson].content : LESSONS[currentLesson].contentEn}
                </div>
                <button
                  onClick={handleNextLesson}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-lg transition-colors"
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
                        ? "bg-blue-900/20 border-blue-500" 
                        : index < currentLesson 
                          ? "bg-gray-800 border-gray-700 opacity-60" 
                          : "bg-gray-800 border-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        index === currentLesson 
                          ? "bg-blue-500 text-white" 
                          : index < currentLesson 
                            ? "bg-blue-600 text-white" 
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
                                  ? "bg-blue-600 border-blue-500 text-white"
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
                    className="w-full mt-8 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-colors"
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
                    <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-6 mb-6">
                      <h3 className="text-2xl font-bold text-blue-400 mb-2">
                        {locale === "de" ? "Completion Badge" : "Completion Badge"}
                      </h3>
                      <p className="text-blue-200">
                        {locale === "de" 
                          ? "Du hast den Intermediate-Pfad abgeschlossen! 🏆"
                          : "You completed the Intermediate path! 🏆"}
                      </p>
                    </div>
                  )}
                  <Link
                    href={`${prefix}/academy/advanced`}
                    className="inline-block bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-4 rounded-lg transition-colors"
                  >
                    {locale === "de" ? "Advanced Pfad starten →" : "Start Advanced Path →"}
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
