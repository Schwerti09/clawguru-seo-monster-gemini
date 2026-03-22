"use client"

import dynamic from "next/dynamic"
import { Suspense, useEffect, useState } from "react"

const MyceliumClientLoader = dynamic(() => import("@/components/visual/MyceliumClientLoader"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[70vh] bg-black/40 rounded-2xl flex items-center justify-center border border-white/10">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-500 mb-4 mx-auto"></div>
        <p className="text-gray-400">Lade Mycelium...</p>
      </div>
    </div>
  ),
})

export default function MyceliumVisualizationWrapper() {
  const [mounted, setMounted] = useState(false)
  const [enabled, setEnabled] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  if (!enabled) {
    return (
      <div className="w-full h-[70vh] bg-black/40 rounded-2xl border border-white/10 flex items-center justify-center">
        <div className="text-center px-6">
          <h3 className="text-lg font-semibold text-white">Mycelium – Visualisierung deaktiviert</h3>
          <p className="text-sm text-gray-400 mt-2">Zur Performance‑Optimierung wird die 3D‑Ansicht nur auf Klick geladen.</p>
          <button
            onClick={() => setEnabled(true)}
            className="mt-4 inline-flex items-center px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-700 text-white font-semibold shadow-lg hover:shadow-cyan-500/30 transition-all duration-300"
          >
            Visualisierung aktivieren
          </button>
        </div>
      </div>
    )
  }
  return (
    <div className="w-full h-[70vh]">
      <MyceliumClientLoader />
    </div>
  )
}
