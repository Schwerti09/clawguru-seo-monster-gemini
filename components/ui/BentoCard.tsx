"use client"

import { useState } from "react"
import { ReactNode } from "react"

interface BentoCardProps {
  title: string
  description: string
  icon?: ReactNode
  className?: string
}

export const BentoCard = ({ title, description, icon, className = "" }: BentoCardProps) => {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const mx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
    const my = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
    setTilt({ rx: -my * 10, ry: mx * 10 })
  }

  const handleMouseLeave = () => setTilt({ rx: 0, ry: 0 })

  return (
    <div
      className={`relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-cyan-300/30 hover:shadow-xl hover:shadow-cyan-300/5 hover:scale-[1.02] ${className}`}
      style={{ transform: `perspective(800px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`, transformStyle: "preserve-3d", transition: "transform 0.15s ease-out" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {icon && <div className="mb-4 text-3xl" aria-hidden>{icon}</div>}
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-white/70 leading-relaxed">{description}</p>
    </div>
  )
}
