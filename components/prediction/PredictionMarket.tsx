"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown, Clock, Users } from "lucide-react"

interface Prediction {
  id: string
  stackName: string
  question: string
  yesOdds: number
  noOdds: number
  totalPool: number
  participants: number
  timeLeft: string
  userBet?: "yes" | "no"
  amount?: number
}

interface PredictionMarketProps {
  locale?: string
}

const mockPredictions: Prediction[] = [
  {
    id: "1",
    stackName: "Kubernetes + Istio",
    question: "Will this stack get hacked in the next 30 days?",
    yesOdds: 65,
    noOdds: 35,
    totalPool: 1250,
    participants: 47,
    timeLeft: "2 days",
  },
  {
    id: "2",
    stackName: "PostgreSQL + pgcrypto",
    question: "Will this stack pass a security audit?",
    yesOdds: 78,
    noOdds: 22,
    totalPool: 890,
    participants: 32,
    timeLeft: "5 days",
  },
  {
    id: "3",
    stackName: "Docker + Alpine Linux",
    question: "Will this stack have 0 critical vulnerabilities?",
    yesOdds: 45,
    noOdds: 55,
    totalPool: 2100,
    participants: 89,
    timeLeft: "1 day",
  },
]

export function PredictionMarket({ locale = "de" }: PredictionMarketProps) {
  const [predictions, setPredictions] = useState(mockPredictions)
  const [betAmount, setBetAmount] = useState(10)
  const isDE = locale === "de"

  const handleBet = (predictionId: string, choice: "yes" | "no") => {
    setPredictions((prev) =>
      prev.map((p) =>
        p.id === predictionId
          ? {
              ...p,
              userBet: choice,
              amount: betAmount,
              totalPool: p.totalPool + betAmount,
              participants: p.participants + 1,
            }
          : p
      )
    )
  }

  const content = {
    de: {
      title: "Prediction Market",
      subtitle: "Wette auf die Zukunft von Stacks",
      yes: "Ja",
      no: "Nein",
      odds: "Quote",
      pool: "Pool",
      participants: "Teilnehmer",
      timeLeft: "Zeit übrig",
      placeBet: "Wette platzieren",
      yourBet: "Deine Wette",
    },
    en: {
      title: "Prediction Market",
      subtitle: "Bet on the future of stacks",
      yes: "Yes",
      no: "No",
      odds: "Odds",
      pool: "Pool",
      participants: "Participants",
      timeLeft: "Time left",
      placeBet: "Place bet",
      yourBet: "Your bet",
    },
  }

  const t = content[locale as keyof typeof content] || content.de

  return (
    <div className="w-full bg-gray-800 rounded-xl border border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-cyan-400" />
        <div>
          <h3 className="font-semibold text-gray-100">{t.title}</h3>
          <p className="text-xs text-zinc-500">{t.subtitle}</p>
        </div>
      </div>

      {/* Predictions */}
      <div className="space-y-4">
        {predictions.map((prediction) => (
          <div
            key={prediction.id}
            className="bg-gray-900/50 rounded-lg p-4 border border-gray-700"
          >
            {/* Stack Name */}
            <div className="font-medium text-gray-100 mb-2">{prediction.stackName}</div>
            <div className="text-sm text-zinc-500 mb-4">{prediction.question}</div>

            {/* Odds */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div
                className={`
                  rounded-lg p-3 text-center cursor-pointer transition-all
                  ${prediction.userBet === "yes"
                    ? "bg-green-900/50 border-2 border-green-600"
                    : "bg-gray-800 border border-gray-700 hover:bg-gray-800/70"}
                `}
                onClick={() => handleBet(prediction.id, "yes")}
              >
                <div className="text-sm text-zinc-500 mb-1">{t.yes}</div>
                <div className="text-2xl font-bold text-green-400">{prediction.yesOdds}%</div>
              </div>
              <div
                className={`
                  rounded-lg p-3 text-center cursor-pointer transition-all
                  ${prediction.userBet === "no"
                    ? "bg-red-900/50 border-2 border-red-600"
                    : "bg-gray-800 border border-gray-700 hover:bg-gray-800/70"}
                `}
                onClick={() => handleBet(prediction.id, "no")}
              >
                <div className="text-sm text-zinc-500 mb-1">{t.no}</div>
                <div className="text-2xl font-bold text-red-400">{prediction.noOdds}%</div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-4 text-xs text-zinc-500">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{prediction.participants} {t.participants}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{prediction.timeLeft}</span>
              </div>
              <div>
                {t.pool}: {prediction.totalPool} XP
              </div>
            </div>

            {/* User Bet */}
            {prediction.userBet && (
              <div className="mt-3 pt-3 border-t border-gray-700">
                <div className="text-xs text-zinc-500 mb-1">{t.yourBet}</div>
                <div className="flex items-center gap-2">
                  {prediction.userBet === "yes" ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <span className="text-sm text-gray-300">
                    {prediction.userBet.toUpperCase()} — {prediction.amount} XP
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
