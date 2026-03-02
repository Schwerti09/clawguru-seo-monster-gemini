"use client"

import { useEffect, useMemo, useState } from "react"

type SocialProofEvent = {
  id: string
  country: string
  cveId: string
  runbookSlug: string
  createdAt: number
}

const ROTATE_MS = 7500

export default function SocialProofOverlay() {
  const [events, setEvents] = useState<SocialProofEvent[]>([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    let mounted = true
    fetch("/api/social-proof")
      .then((res) => res.json())
      .then((data) => {
        if (mounted && Array.isArray(data?.events)) {
          setEvents(data.events)
          setIndex(0)
        }
      })
      .catch(() => undefined)

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (events.length <= 1) return
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % events.length)
    }, ROTATE_MS)
    return () => window.clearInterval(timer)
  }, [events.length])

  const event = useMemo(() => events[index], [events, index])
  if (!event) return null

  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 left-6 z-50 max-w-xs rounded-2xl border border-cyan-500/30 bg-black/80 px-4 py-3 text-xs text-gray-200 shadow-xl shadow-cyan-500/10 backdrop-blur"
    >
      <div className="font-semibold text-cyan-200">Live Ops</div>
      <div className="mt-1 text-gray-300">
        Gerade hat ein User aus <span className="font-bold text-white">{event.country}</span> das Runbook für{" "}
        <a href={`/runbook/${event.runbookSlug}`} className="font-bold text-cyan-300 hover:text-cyan-200">
          {event.cveId}
        </a>{" "}
        gefixt.
      </div>
    </div>
  )
}
