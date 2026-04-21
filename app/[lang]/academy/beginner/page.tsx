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
    title: "Lektion 1: Was sind Security-Headers?",
    titleEn: "Lesson 1: What are Security Headers?",
    content: "Security-Headers sind HTTP-Header, die deinem Browser sagen, wie er sich verhalten soll. Sie schützen vor Clickjacking, XSS und anderen Angriffen. Die wichtigsten sind: CSP (Content Security Policy), X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security (HSTS).",
    contentEn: "Security Headers are HTTP headers that tell your browser how to behave. They protect against clickjacking, XSS, and other attacks. The most important are: CSP (Content Security Policy), X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security (HSTS).",
    duration: "5 Min"
  },
  {
    id: 2,
    title: "Lektion 2: TLS/HTTPS einrichten",
    titleEn: "Lesson 2: Setup TLS/HTTPS",
    content: "HTTPS verschlüsselt die Verbindung zwischen Browser und Server. Du brauchst ein SSL/TLS-Zertifikat. Let's Encrypt ist kostenlos und einfach. Nginx-Konfiguration: ssl_certificate und ssl_certificate_key definieren. HTTP auf HTTPS redirecten.",
    contentEn: "HTTPS encrypts the connection between browser and server. You need an SSL/TLS certificate. Let's Encrypt is free and easy. Nginx configuration: define ssl_certificate and ssl_certificate_key. Redirect HTTP to HTTPS.",
    duration: "10 Min"
  },
  {
    id: 3,
    title: "Lektion 3: Firewall-Grundlagen (UFW)",
    titleEn: "Lesson 3: Firewall Basics (UFW)",
    content: "UFW (Uncomplicated Firewall) ist einfach zu bedienen. Nur Ports öffnen, die du wirklich brauchst. Standard: SSH (22), HTTP (80), HTTPS (443). Befehle: sudo ufw allow 22, sudo ufw enable, sudo ufw status.",
    contentEn: "UFW (Uncomplicated Firewall) is easy to use. Only open ports you really need. Default: SSH (22), HTTP (80), HTTPS (443). Commands: sudo ufw allow 22, sudo ufw enable, sudo ufw status.",
    duration: "8 Min"
  },
  {
    id: 4,
    title: "Lektion 4: Security Check interpretieren",
    titleEn: "Lesson 4: Interpret Security Check",
    content: "Der Claw Score zeigt dir, wie sicher dein Server ist. Grün = gut, Gelb = Warnung, Rot = kritisch. Schau dir die einzelnen Punkte an. Die meisten Fehler sind einfache Misconfigurations.",
    contentEn: "The Claw Score shows how secure your server is. Green = good, Yellow = warning, Red = critical. Look at the individual points. Most errors are simple misconfigurations.",
    duration: "12 Min"
  },
  {
    id: 5,
    title: "Lektion 5: Top 3 Misconfigs beheben",
    titleEn: "Lesson 5: Fix Top 3 Misconfigs",
    content: "1. Offene Ports: UFW schließen. 2. Fehlende HTTPS: TLS-Zertifikat installieren. 3. Default-Passwörter: ändern! Diese drei Fehler machen 80% aller Probleme aus.",
    contentEn: "1. Open ports: close with UFW. 2. Missing HTTPS: install TLS certificate. 3. Default passwords: change! These three errors cause 80% of all problems.",
    duration: "10 Min"
  }
]

const QUIZ_QUESTIONS = [
  {
    question: "Was ist der Zweck von Security-Headers?",
    questionEn: "What is the purpose of Security Headers?",
    options: ["Server schneller machen", "Browser-Sicherheit erhöhen", "Datenbank optimieren", "CSS laden"],
    optionsEn: ["Make server faster", "Increase browser security", "Optimize database", "Load CSS"],
    correct: 1
  },
  {
    question: "Welcher Port ist für HTTPS?",
    questionEn: "Which port is for HTTPS?",
    options: ["80", "22", "443", "3306"],
    correct: 2
  },
  {
    question: "Was macht UFW?",
    questionEn: "What does UFW do?",
    options: ["Backup erstellen", "Firewall verwalten", "Datenbank starten", "Logs analysieren"],
    optionsEn: ["Create backup", "Manage firewall", "Start database", "Analyze logs"],
    correct: 1
  }
]

export default function BeginnerPage({ params }: { params: { lang: string } }) {
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
      <section className="py-12 bg-gradient-to-r from-green-900/30 to-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link href={`${prefix}/academy`} className="text-green-400 hover:text-green-300 mb-4 inline-block">
              ← {locale === "de" ? "Zurück zur Academy" : "Back to Academy"}
            </Link>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              {locale === "de" ? "Security-Grundlagen" : "Security Fundamentals"}
            </h1>
            <p className="text-xl text-gray-300">
              {locale === "de" ? "5 Lektionen • ~45 Minuten" : "5 Lessons • ~45 Minutes"}
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
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentLesson + 1) / LESSONS.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Lesson Card */}
              <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-green-900/50 flex items-center justify-center text-3xl font-black text-green-400">
                    {LESSONS[currentLesson].id}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-100 mb-1">
                      {locale === "de" ? LESSONS[currentLesson].title : LESSONS[currentLesson].titleEn}
                    </h2>
                    <p className="text-green-400 text-sm">⏱️ {LESSONS[currentLesson].duration}</p>
                  </div>
                </div>
                <div className="text-lg text-gray-300 leading-relaxed mb-8">
                  {locale === "de" ? LESSONS[currentLesson].content : LESSONS[currentLesson].contentEn}
                </div>
                <button
                  onClick={handleNextLesson}
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-lg transition-colors"
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
                        ? "bg-green-900/20 border-green-500" 
                        : index < currentLesson 
                          ? "bg-gray-800 border-gray-700 opacity-60" 
                          : "bg-gray-800 border-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        index === currentLesson 
                          ? "bg-green-500 text-white" 
                          : index < currentLesson 
                            ? "bg-green-600 text-white" 
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
                                  ? "bg-green-600 border-green-500 text-white"
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
                    className="w-full mt-8 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-colors"
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
                    <div className="bg-green-900/30 border border-green-500 rounded-lg p-6 mb-6">
                      <h3 className="text-2xl font-bold text-green-400 mb-2">
                        {locale === "de" ? "Completion Badge" : "Completion Badge"}
                      </h3>
                      <p className="text-green-200">
                        {locale === "de" 
                          ? "Du hast den Beginner-Pfad abgeschlossen! 🏆"
                          : "You completed the Beginner path! 🏆"}
                      </p>
                    </div>
                  )}
                  <Link
                    href={`${prefix}/academy/intermediate`}
                    className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-lg transition-colors"
                  >
                    {locale === "de" ? "Intermediate Pfad starten →" : "Start Intermediate Path →"}
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
