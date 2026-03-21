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
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return (
    <div className="w-full h-[70vh]">
      <MyceliumClientLoader />
    </div>
  )
}
