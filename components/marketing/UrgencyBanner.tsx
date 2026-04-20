"use client"

import { useState, useEffect } from "react"

interface UrgencyBannerProps {
  couponCode?: string
  discountAmount?: string
}

export default function UrgencyBanner({ couponCode, discountAmount }: UrgencyBannerProps) {
  const [timeLeft, setTimeLeft] = useState("23:59:59")

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const endOfDay = new Date()
      endOfDay.setHours(23, 59, 59, 999)
      const diff = endOfDay.getTime() - now.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 px-4 text-center">
      <div className="max-w-4xl mx-auto">
        <span className="font-bold">⚡ FLASH SALE: </span>
        <span>Nur heute {discountAmount || "€5"} Rabatt auf Day Pass! Code: {couponCode || "SAVE5"} </span>
        <span className="font-mono font-bold bg-black/20 px-2 py-1 rounded">Verbleibend: {timeLeft}</span>
      </div>
    </div>
  )
}
