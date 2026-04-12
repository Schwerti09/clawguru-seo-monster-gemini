'use client'

import { useEffect, useState, useRef } from 'react'
import { ArrowUp, ArrowDown, type LucideIcon } from 'lucide-react'

interface PremiumMetricCardProps {
  title: string
  value: number
  unit?: string
  icon: LucideIcon
  trend?: { value: number; isUp: boolean }
  delay?: number
  accentColor?: string
}

function useCountUp(target: number, duration = 2000) {
  const [current, setCurrent] = useState(0)
  const ref = useRef(0)

  useEffect(() => {
    ref.current = 0
    const startTime = performance.now()
    const step = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      const val = Math.round(target * eased)
      setCurrent(val)
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])

  return current
}

export default function PremiumMetricCard({
  title,
  value,
  unit = '',
  icon: Icon,
  trend,
  delay = 0,
  accentColor = '#EAB308'
}: PremiumMetricCardProps) {
  const displayValue = useCountUp(value)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="animate-fade-in-up group relative cursor-default"
      style={{ animationDelay: `${delay}s`, animationDuration: '0.6s' }}
    >
      {/* Card */}
      <div
        className="relative overflow-hidden rounded-2xl border transition-all duration-500"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
          borderColor: isHovered ? 'rgba(234,179,8,0.3)' : 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
          boxShadow: isHovered
            ? `0 0 40px rgba(234,179,8,0.08), inset 0 1px 0 rgba(255,255,255,0.05)`
            : `inset 0 1px 0 rgba(255,255,255,0.03)`
        }}
      >
        {/* Inner Gold Glow on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${accentColor}08 0%, transparent 70%)`
          }}
        />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />

        <div className="relative z-10 p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500"
              style={{
                background: isHovered ? `${accentColor}15` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isHovered ? accentColor + '30' : 'rgba(255,255,255,0.06)'}`
              }}
            >
              <Icon
                className="w-5 h-5 transition-colors duration-500"
                style={{ color: isHovered ? accentColor : '#A1A1AA' }}
              />
            </div>
            {trend && (
              <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                trend.isUp
                  ? 'text-emerald-400 bg-emerald-400/10'
                  : 'text-red-400 bg-red-400/10'
              }`}>
                {trend.isUp ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {trend.value}%
              </div>
            )}
          </div>

          {/* Value */}
          <div className="mb-1">
            <span
              className="text-3xl font-black tracking-tight text-white transition-all duration-500"
              style={{
                textShadow: isHovered ? `0 0 30px ${accentColor}40` : 'none'
              }}
            >
              {displayValue.toLocaleString()}{unit}
            </span>
          </div>

          {/* Title */}
          <div className="text-[11px] font-medium tracking-wide uppercase text-gray-500">
            {title}
          </div>

          {/* Bottom accent line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[1px] transition-transform duration-300 origin-center"
            style={{ background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)`, transform: isHovered ? 'scaleX(1)' : 'scaleX(0)' }}
          />
        </div>
      </div>
    </div>
  )
}
