"use client"

import { useState, useEffect } from "react"

interface ExitIntentPopupProps {
  couponCode: string
  discountAmount: string
}

export default function ExitIntentPopup({ couponCode, discountAmount }: ExitIntentPopupProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasShown, setHasShown] = useState(false)

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true)
        setHasShown(true)
      }
    }

    document.addEventListener("mouseleave", handleMouseLeave)
    return () => document.removeEventListener("mouseleave", handleMouseLeave)
  }, [hasShown])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-cyan-500 rounded-xl p-6 max-w-md w-full">
        <h3 className="text-2xl font-bold text-cyan-300 mb-2">Warte!</h3>
        <p className="text-gray-300 mb-4">
          Nutze den Code <span className="font-bold text-cyan-400">{couponCode}</span> für {discountAmount} Rabatt.
        </p>
        <button
          onClick={() => setIsVisible(false)}
          className="w-full px-4 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-colors"
        >
          Angebot nutzen
        </button>
        <button
          onClick={() => setIsVisible(false)}
          className="w-full mt-2 px-4 py-2 text-gray-400 hover:text-gray-300 text-sm"
        >
          Nein danke
        </button>
      </div>
    </div>
  )
}
