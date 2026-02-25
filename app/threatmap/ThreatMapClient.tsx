'use client'
// WORLD BEAST UPGRADE: app/threatmap/ThreatMapClient.tsx
// Interactive Canvas-based world threat map with clickable regions.
// Uses native Canvas API + SVG – no extra dependencies required.

import { useEffect, useRef, useState, useCallback } from "react"
import type { ThreatRegion } from "@/lib/threatmap-data"

interface Props {
  regions: ThreatRegion[]
}

// WORLD BEAST UPGRADE: Convert lat/lon to canvas x/y (Mercator-like projection)
function latLonToXY(lat: number, lon: number, width: number, height: number): [number, number] {
  const x = ((lon + 180) / 360) * width
  const latRad = (lat * Math.PI) / 180
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2))
  const y = (height / 2) - (width * mercN) / (2 * Math.PI)
  return [x, y]
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: "#ff3b5c",
  high: "#ff6b35",
  medium: "#ffcc00",
  low: "#00ff9d",
}

export default function ThreatMapClient({ regions }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedRegion, setSelectedRegion] = useState<ThreatRegion | null>(null)
  const [hoveredRegion, setHoveredRegion] = useState<ThreatRegion | null>(null)
  const animFrameRef = useRef<number>(0)
  const pulseRef = useRef<number>(0)

  // WORLD BEAST UPGRADE: Draw the threat map on canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height
    pulseRef.current += 0.05

    // Background
    ctx.fillStyle = "#050608"
    ctx.fillRect(0, 0, W, H)

    // WORLD BEAST UPGRADE: Grid lines (meridians & parallels)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.04)"
    ctx.lineWidth = 0.5
    for (let x = 0; x <= W; x += W / 12) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
    }
    for (let y = 0; y <= H; y += H / 6) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
    }

    // WORLD BEAST UPGRADE: Draw threat nodes with pulsing rings
    for (const region of regions) {
      const [cx, cy] = latLonToXY(region.lat, region.lon, W, H)
      const color = SEVERITY_COLORS[region.severity] ?? "#ffffff"
      const isSelected = selectedRegion?.id === region.id
      const isHovered = hoveredRegion?.id === region.id
      const size = Math.log2(region.threats + 1) * 2

      // Outer pulse ring
      const pulse = Math.sin(pulseRef.current + region.threats * 0.001) * 0.5 + 0.5
      const ringRadius = size + 8 + pulse * 6
      ctx.beginPath()
      ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2)
      ctx.strokeStyle = color + "30"
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Glow
      if (isSelected || isHovered) {
        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, size + 20)
        grd.addColorStop(0, color + "40")
        grd.addColorStop(1, "transparent")
        ctx.fillStyle = grd
        ctx.beginPath()
        ctx.arc(cx, cy, size + 20, 0, Math.PI * 2)
        ctx.fill()
      }

      // Core dot
      ctx.beginPath()
      ctx.arc(cx, cy, isSelected ? size + 2 : size, 0, Math.PI * 2)
      ctx.fillStyle = isSelected ? "#ffffff" : color
      ctx.shadowBlur = isSelected ? 20 : 10
      ctx.shadowColor = color
      ctx.fill()
      ctx.shadowBlur = 0

      // Label on hover/select
      if (isHovered || isSelected) {
        ctx.font = "bold 11px 'JetBrains Mono', monospace"
        ctx.fillStyle = "#ffffff"
        ctx.textAlign = "center"
        ctx.fillText(region.name, cx, cy - size - 8)
        ctx.fillStyle = color
        ctx.font = "10px monospace"
        ctx.fillText(region.threats.toLocaleString() + " threats", cx, cy - size - 20)
      }
    }

    animFrameRef.current = requestAnimationFrame(draw)
  }, [regions, selectedRegion, hoveredRegion])

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [draw])

  // WORLD BEAST UPGRADE: Hit-test for mouse events
  function getRegionAtPos(e: React.MouseEvent<HTMLCanvasElement>): ThreatRegion | null {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const mx = (e.clientX - rect.left) * scaleX
    const my = (e.clientY - rect.top) * scaleY

    for (const region of regions) {
      const [cx, cy] = latLonToXY(region.lat, region.lon, canvas.width, canvas.height)
      const size = Math.log2(region.threats + 1) * 2 + 12
      const dist = Math.sqrt((mx - cx) ** 2 + (my - cy) ** 2)
      if (dist <= size) return region
    }
    return null
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    setHoveredRegion(getRegionAtPos(e))
  }

  function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const region = getRegionAtPos(e)
    setSelectedRegion(prev => prev?.id === region?.id ? null : region)
  }

  return (
    <div className="space-y-4">
      {/* WORLD BEAST UPGRADE: Canvas map */}
      <div
        className="relative rounded-2xl overflow-hidden glass-panel"
        style={{ border: "1px solid rgba(255,59,92,0.2)" }}
      >
        <canvas
          ref={canvasRef}
          width={1200}
          height={600}
          className="w-full h-auto cursor-crosshair"
          style={{ maxHeight: "500px" }}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          onMouseLeave={() => setHoveredRegion(null)}
        />
        {/* WORLD BEAST UPGRADE: Legend overlay */}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-3">
          {Object.entries(SEVERITY_COLORS).map(([sev, color]) => (
            <div key={sev} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: color, boxShadow: `0 0 6px ${color}` }}
              />
              <span className="text-xs text-gray-400 capitalize font-mono">{sev}</span>
            </div>
          ))}
        </div>
        <div className="absolute top-4 right-4 font-mono text-xs text-gray-600">
          <span className="text-red-400 animate-pulse">●</span> LIVE
        </div>
      </div>

      {/* WORLD BEAST UPGRADE: Selected region detail panel */}
      {selectedRegion && (
        <div
          className="p-5 rounded-2xl glass-card"
          style={{ borderColor: `${SEVERITY_COLORS[selectedRegion.severity]}40` }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs uppercase tracking-widest text-gray-500">Selected Region</span>
              <h3 className="text-xl font-black font-heading mt-0.5">{selectedRegion.name}</h3>
            </div>
            <span
              className="text-xs font-bold px-3 py-1 rounded-full uppercase"
              style={{
                color: SEVERITY_COLORS[selectedRegion.severity],
                background: `${SEVERITY_COLORS[selectedRegion.severity]}18`,
                border: `1px solid ${SEVERITY_COLORS[selectedRegion.severity]}40`,
              }}
            >
              {selectedRegion.severity}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 rounded-xl glass-card text-center">
              <div
                className="text-2xl font-black"
                style={{ color: SEVERITY_COLORS[selectedRegion.severity] }}
              >
                {selectedRegion.threats.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Exposed Instances</div>
            </div>
            <div className="p-3 rounded-xl glass-card text-center">
              <div className="text-2xl font-black text-gray-200">
                {selectedRegion.id.toUpperCase()}
              </div>
              <div className="text-xs text-gray-500">Region Code</div>
            </div>
          </div>
          <a
            href={`/runbooks?region=${selectedRegion.id}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300"
            style={{
              background: `${SEVERITY_COLORS[selectedRegion.severity]}18`,
              border: `1px solid ${SEVERITY_COLORS[selectedRegion.severity]}40`,
              color: SEVERITY_COLORS[selectedRegion.severity],
            }}
          >
            🔍 Runbooks für {selectedRegion.name} anzeigen →
          </a>
        </div>
      )}
    </div>
  )
}
