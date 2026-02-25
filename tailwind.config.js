/** @type {import('tailwindcss').Config} */
// VISUAL BEAST 2026: Extended design system
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { 950: "#05060a" },
        "deep-space": "#0a0a0a",
        neon: {
          green: "#00ff9d",
          blue: "#00b8ff",
          purple: "#8b5cf6",
        },
        brand: {
          cyan: "#22d3ee",
          blue: "#3b82f6",
          orange: "#fb923c",
          red: "#ef4444",
          green: "#22c55e",
          violet: "#8b5cf6"
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        headline: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(34, 211, 238, 0.16)",
        glow2: "0 0 60px rgba(139, 92, 246, 0.12)",
        "neon-green": "0 0 30px rgba(0, 255, 157, 0.25)",
        "neon-blue": "0 0 30px rgba(0, 184, 255, 0.25)",
      },
      keyframes: {
        fadeUp: { "0%": { opacity: "0", transform: "translateY(10px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        pulseSoft: { "0%,100%": { opacity: "1" }, "50%": { opacity: "0.65" } },
        // VISUAL BEAST 2026: new keyframes
        scanline: { "0%": { transform: "translateY(-100%)" }, "100%": { transform: "translateY(100%)" } },
        pulseGlow: { "0%,100%": { opacity: "0.6", boxShadow: "0 0 10px rgba(0,255,157,0.3)" }, "50%": { opacity: "1", boxShadow: "0 0 25px rgba(0,255,157,0.6)" } },
        float: { "0%,100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-10px)" } },
        countUp: { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
      },
      animation: {
        fadeUp: "fadeUp 420ms ease-out",
        pulseSoft: "pulseSoft 1.8s ease-in-out infinite",
        scanline: "scanline 3s linear infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "count-up": "countUp 600ms ease-out",
      }
    }
  },
  plugins: []
}
