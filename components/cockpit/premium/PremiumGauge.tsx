'use client'

import { useEffect, useRef, useState } from 'react'

interface PremiumGaugeProps {
  value: number
  label: string
  sublabel?: string
  className?: string
}

export default function PremiumGauge({ value, label, sublabel, className = '' }: PremiumGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [animatedValue, setAnimatedValue] = useState(0)

  useEffect(() => {
    let frame = 0
    const totalFrames = 90
    const animate = () => {
      frame++
      const progress = Math.min(frame / totalFrames, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimatedValue(value * eased)
      if (frame < totalFrames) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [value])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = 280 * dpr
    canvas.height = 180 * dpr
    ctx.scale(dpr, dpr)
    canvas.style.width = '280px'
    canvas.style.height = '180px'

    ctx.clearRect(0, 0, 280, 180)

    const cx = 140
    const cy = 150
    const radius = 110
    const startAngle = Math.PI * 0.8
    const endAngle = Math.PI * 2.2
    const totalArc = endAngle - startAngle

    // Background arc
    ctx.beginPath()
    ctx.arc(cx, cy, radius, startAngle, endAngle, false)
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'
    ctx.lineWidth = 14
    ctx.lineCap = 'round'
    ctx.stroke()

    // Tick marks
    for (let i = 0; i <= 10; i++) {
      const angle = startAngle + (totalArc * i) / 10
      const innerR = radius - 22
      const outerR = radius - 12
      ctx.beginPath()
      ctx.moveTo(cx + Math.cos(angle) * innerR, cy + Math.sin(angle) * innerR)
      ctx.lineTo(cx + Math.cos(angle) * outerR, cy + Math.sin(angle) * outerR)
      ctx.strokeStyle = i <= (animatedValue / 10) ? 'rgba(234,179,8,0.5)' : 'rgba(255,255,255,0.1)'
      ctx.lineWidth = 1.5
      ctx.stroke()
    }

    // Value arc gradient
    const progress = animatedValue / 100
    const valueEndAngle = startAngle + totalArc * progress

    const gradient = ctx.createLinearGradient(
      cx + Math.cos(startAngle) * radius,
      cy + Math.sin(startAngle) * radius,
      cx + Math.cos(valueEndAngle) * radius,
      cy + Math.sin(valueEndAngle) * radius
    )
    gradient.addColorStop(0, '#A1A1AA')
    gradient.addColorStop(0.5, '#EAB308')
    gradient.addColorStop(1, '#F59E0B')

    ctx.beginPath()
    ctx.arc(cx, cy, radius, startAngle, valueEndAngle, false)
    ctx.strokeStyle = gradient
    ctx.lineWidth = 14
    ctx.lineCap = 'round'
    ctx.stroke()

    // Gold glow
    ctx.beginPath()
    ctx.arc(cx, cy, radius, startAngle, valueEndAngle, false)
    ctx.strokeStyle = 'rgba(234,179,8,0.15)'
    ctx.lineWidth = 28
    ctx.lineCap = 'round'
    ctx.stroke()

    // Needle
    const needleAngle = startAngle + totalArc * progress
    const needleLength = radius - 30

    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(needleAngle)

    // Needle shadow
    ctx.beginPath()
    ctx.moveTo(0, 3)
    ctx.lineTo(needleLength, 0)
    ctx.moveTo(0, -3)
    ctx.lineTo(needleLength, 0)
    ctx.strokeStyle = 'rgba(234,179,8,0.3)'
    ctx.lineWidth = 4
    ctx.stroke()

    // Needle body
    ctx.beginPath()
    ctx.moveTo(0, 2)
    ctx.lineTo(needleLength, 0)
    ctx.moveTo(0, -2)
    ctx.lineTo(needleLength, 0)
    ctx.strokeStyle = '#EAB308'
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.restore()

    // Center dot
    ctx.beginPath()
    ctx.arc(cx, cy, 6, 0, Math.PI * 2)
    ctx.fillStyle = '#EAB308'
    ctx.fill()

    ctx.beginPath()
    ctx.arc(cx, cy, 3, 0, Math.PI * 2)
    ctx.fillStyle = '#0A0A0A'
    ctx.fill()

  }, [animatedValue])

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      <canvas ref={canvasRef} className="rounded-lg" />
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <div
          className="animate-fade-in-up text-3xl font-black text-white"
          style={{ textShadow: '0 0 20px rgba(234,179,8,0.3)', animationDelay: '0.5s' }}
        >
          {Math.round(animatedValue)}%
        </div>
        <div className="text-[11px] font-semibold tracking-[0.2em] uppercase" style={{ color: '#EAB308' }}>
          {label}
        </div>
        {sublabel && (
          <div className="text-[10px] text-gray-500 mt-0.5">{sublabel}</div>
        )}
      </div>
    </div>
  )
}
