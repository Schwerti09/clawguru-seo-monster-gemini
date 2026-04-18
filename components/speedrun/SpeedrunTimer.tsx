"use client"

import { useState, useEffect } from "react"
import { Timer, Play, Pause, RotateCcw, Trophy, Zap } from "lucide-react"

interface SpeedrunTimerProps {
  targetTime?: number // seconds
  locale?: string
}

const mockSpeedruns = [
  { userId: "1", username: "SpeedRunner_X", time: 45, stack: "Kubernetes" },
  { userId: "2", username: "Fix_Fast", time: 52, stack: "PostgreSQL" },
  { userId: "3", username: "Quick_Sec", time: 58, stack: "Docker" },
]

export function SpeedrunTimer({ targetTime = 60, locale = "de" }: SpeedrunTimerProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const isDE = locale === "de"

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning && !isComplete) {
      interval = setInterval(() => {
        setTime((prev) => {
          if (prev >= targetTime) {
            setIsRunning(false)
            setIsComplete(true)
            return targetTime
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, isComplete, targetTime])

  const handleStart = () => {
    if (!isComplete) {
      setIsRunning(true)
    }
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTime(0)
    setIsComplete(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progress = (time / targetTime) * 100
  const isFast = time < targetTime * 0.5

  const content = {
    de: {
      title: "Roast Speedrun",
      subtitle: `Fixe alle kritischen Lücken in ${targetTime} Sekunden`,
      start: "Starten",
      pause: "Pausieren",
      reset: "Zurücksetzen",
      completed: "Abgeschlossen!",
      target: "Zielzeit",
      leaderboard: "Bestenliste",
      fastest: "Schnellste Zeiten",
    },
    en: {
      title: "Roast Speedrun",
      subtitle: `Fix all critical issues in ${targetTime} seconds`,
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      completed: "Completed!",
      target: "Target time",
      leaderboard: "Leaderboard",
      fastest: "Fastest times",
    },
  }

  const t = content[locale as keyof typeof content] || content.de

  return (
    <div className="w-full bg-gray-800 rounded-xl border border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 text-amber-400" />
          <div>
            <h3 className="font-semibold text-gray-100">{t.title}</h3>
            <p className="text-xs text-zinc-500">{t.subtitle}</p>
          </div>
        </div>
        <div className="text-sm text-zinc-500">
          {t.target}: {targetTime}s
        </div>
      </div>

      {/* Timer Display */}
      <div className="mb-6">
        <div className="flex items-center justify-center mb-4">
          <div className={`text-6xl font-bold ${isFast && isRunning ? "text-green-400" : isComplete ? "text-cyan-400" : "text-gray-100"}`}>
            {formatTime(time)}
          </div>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${isComplete ? "bg-cyan-500" : isFast ? "bg-green-500" : "bg-amber-500"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 mb-6">
        {!isComplete ? (
          <>
            {!isRunning ? (
              <button
                onClick={handleStart}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-medium text-white transition-colors"
              >
                <Play className="w-4 h-4" />
                {t.start}
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 hover:bg-amber-500 rounded-lg font-medium text-white transition-colors"
              >
                <Pause className="w-4 h-4" />
                {t.pause}
              </button>
            )}
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium text-gray-300 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="flex-1 text-center">
            <div className="text-lg font-bold text-cyan-400 mb-2">{t.completed}</div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium text-gray-300 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              {t.reset}
            </button>
          </div>
        )}
      </div>

      {/* Leaderboard */}
      <div className="border-t border-gray-700 pt-4">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-sm text-zinc-500">{t.fastest}</span>
        </div>
        <div className="space-y-2">
          {mockSpeedruns.map((run, index) => (
            <div key={run.userId} className="flex items-center justify-between text-sm">
              <span className="text-gray-300">
                #{index + 1} {run.username}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-zinc-500">{run.stack}</span>
                <span className="text-cyan-400 font-medium">{run.time}s</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
