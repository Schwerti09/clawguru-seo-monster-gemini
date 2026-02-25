/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { 950: "#05060a" },
        // VISUAL UPGRADE 2026: Legacy brand colors preserved for backward compatibility
        brand: {
          cyan: "#22d3ee",
          blue: "#3b82f6",
          orange: "#fb923c",
          red: "#ef4444",
          green: "#22c55e",
          violet: "#8b5cf6"
        },
        // VISUAL UPGRADE 2026: New cyber-security palette
        claw: {
          green: "#00ff9d",
          "green-muted": "rgba(0, 255, 157, 0.15)",
        },
        cyber: {
          blue: "#00b8ff",
          "blue-muted": "rgba(0, 184, 255, 0.15)",
        },
        "deep-space": "#0a0a0a",
        severity: {
          critical: "#ff3b5c",
          high: "#ff8c42",
          medium: "#ffcc00",
          low: "#00ff9d",
          info: "#00b8ff",
        }
      },
      boxShadow: {
        glow: "0 0 40px rgba(34, 211, 238, 0.16)",
        glow2: "0 0 60px rgba(139, 92, 246, 0.12)",
        // VISUAL UPGRADE 2026: Neon glow shadows
        "neon-green": "0 0 20px rgba(0, 255, 157, 0.3), 0 0 60px rgba(0, 255, 157, 0.1)",
        "neon-blue": "0 0 20px rgba(0, 184, 255, 0.3), 0 0 60px rgba(0, 184, 255, 0.1)",
        "neon-green-lg": "0 0 40px rgba(0, 255, 157, 0.4), 0 0 80px rgba(0, 255, 157, 0.15)",
      },
      fontFamily: {
        // VISUAL UPGRADE 2026: Typography system
        heading: ["'Space Grotesk'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "'Fira Code'", "monospace"],
      },
      keyframes: {
        fadeUp: { "0%": { opacity: "0", transform: "translateY(10px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        pulseSoft: { "0%,100%": { opacity: "1" }, "50%": { opacity: "0.65" } },
        // VISUAL UPGRADE 2026: New keyframes
        pulseNeon: {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 20px rgba(0, 255, 157, 0.3)" },
          "50%": { opacity: "0.7", boxShadow: "0 0 40px rgba(0, 255, 157, 0.5)" },
        },
        scanLine: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        gridPulse: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.6" },
        },
        countUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        magneticHover: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        borderScan: {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "200% 200%" },
        },
      },
      animation: {
        fadeUp: "fadeUp 420ms ease-out",
        pulseSoft: "pulseSoft 1.8s ease-in-out infinite",
        // VISUAL UPGRADE 2026: New animations
        "pulse-neon": "pulseNeon 2s ease-in-out infinite",
        "scan-line": "scanLine 3s linear infinite",
        float: "float 3s ease-in-out infinite",
        "grid-pulse": "gridPulse 4s ease-in-out infinite",
        "count-up": "countUp 0.6s ease-out",
        "magnetic-hover": "magneticHover 0.3s ease-out",
        "border-scan": "borderScan 3s linear infinite",
      }
    }
  },
  plugins: []
}
