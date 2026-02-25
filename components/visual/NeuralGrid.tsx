"use client"

import { useEffect, useState } from "react"

// VISUAL UPGRADE 2026: Enhanced animated backdrop with floating security nodes (particles),
// animated grid background, and cyber-security aesthetic. Pure CSS – no canvas, no deps.

export default function NeuralGrid({ intensity = 0.65 }: { intensity?: number }) {
  const [seed, setSeed] = useState(0)
  useEffect(() => {
    // deterministic-ish per session (just for subtle variation)
    setSeed(Math.floor(Math.random() * 10_000))
  }, [])

  // VISUAL UPGRADE 2026: Generate floating security node positions
  const nodes = Array.from({ length: 8 }, (_, i) => ({
    left: `${(seed + i * 137) % 90 + 5}%`,
    top: `${(seed + i * 89) % 80 + 10}%`,
    size: 2 + (i % 3),
    delay: i * 0.5,
    duration: 3 + (i % 4),
  }))

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ opacity: intensity }}
    >
      {/* VISUAL UPGRADE 2026: Claw-green and cyber-blue radial glows */}
      <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full blur-3xl animate-pulse"
        style={{ background: "rgba(0, 255, 157, 0.08)" }} />
      <div className="absolute -bottom-52 -right-52 h-[620px] w-[620px] rounded-full blur-3xl animate-pulse"
        style={{ background: "rgba(0, 184, 255, 0.08)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full blur-3xl"
        style={{ background: "rgba(0, 255, 157, 0.04)" }} />

      {/* VISUAL UPGRADE 2026: Animated grid with claw-green tint */}
      <div
        className="absolute inset-0 animate-[gridMove_12s_linear_infinite]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 255, 157, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 255, 157, 0.04) 1px, transparent 1px)`,
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(circle at center, black, transparent 70%)",
          WebkitMaskImage: "radial-gradient(circle at center, black, transparent 70%)",
        }}
      />

      {/* VISUAL UPGRADE 2026: Floating security nodes (particles) */}
      {nodes.map((node, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-float"
          style={{
            left: node.left,
            top: node.top,
            width: `${node.size}px`,
            height: `${node.size}px`,
            background: i % 2 === 0 ? "#00ff9d" : "#00b8ff",
            boxShadow: i % 2 === 0
              ? "0 0 8px rgba(0, 255, 157, 0.4)"
              : "0 0 8px rgba(0, 184, 255, 0.4)",
            animationDelay: `${node.delay}s`,
            animationDuration: `${node.duration}s`,
            opacity: 0.6,
          }}
        />
      ))}

      {/* drifting noise dots */}
      <div
        className="absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:18px_18px] animate-[dotsDrift_18s_linear_infinite]"
        style={{
          transform: `translate3d(${seed % 7}px, ${(seed % 13) - 6}px, 0)`,
          maskImage: "radial-gradient(circle at center, black, transparent 65%)",
          WebkitMaskImage: "radial-gradient(circle at center, black, transparent 65%)",
        }}
      />

      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translate3d(0,0,0); }
          100% { transform: translate3d(-44px,-44px,0); }
        }
        @keyframes dotsDrift {
          0% { transform: translate3d(0,0,0); }
          100% { transform: translate3d(40px,-60px,0); }
        }
      `}</style>
    </div>
  )
}
