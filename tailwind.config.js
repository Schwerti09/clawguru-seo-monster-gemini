/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { 950: "#05060a" },
        // Legacy brand colors preserved for backward compatibility
        brand: {
          cyan: "#22d3ee",
          blue: "#3b82f6",
          orange: "#fb923c",
          red: "#ef4444",
          green: "#22c55e",
          violet: "#8b5cf6"
        },
        // Cyber-security palette
        claw: {
          green: "#00ff9d",
          "green-muted": "rgba(0, 255, 157, 0.15)",
        },
        cyber: {
          blue: "#00b8ff",
          "blue-muted": "rgba(0, 184, 255, 0.15)",
        },
        "deep-space": "#0a0a0a",
        // LUXURY DESIGN 2026: 24k Gold palette
        gold: {
          DEFAULT: "#d4af37",
          light: "#e8cc6a",
          dark: "#a8872a",
          muted: "rgba(212, 175, 55, 0.15)",
          glow: "rgba(212, 175, 55, 0.35)",
        },
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
        "neon-green": "0 0 20px rgba(0, 255, 157, 0.3), 0 0 60px rgba(0, 255, 157, 0.1)",
        "neon-blue": "0 0 20px rgba(0, 184, 255, 0.3), 0 0 60px rgba(0, 184, 255, 0.1)",
        "neon-green-lg": "0 0 40px rgba(0, 255, 157, 0.4), 0 0 80px rgba(0, 255, 157, 0.15)",
        // LUXURY DESIGN 2026: Gold glow shadows
        "neon-gold": "0 0 20px rgba(212, 175, 55, 0.4), 0 0 60px rgba(212, 175, 55, 0.15)",
        "neon-gold-lg": "0 0 40px rgba(212, 175, 55, 0.5), 0 0 100px rgba(212, 175, 55, 0.2)",
        "luxury-depth": "0 32px 80px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
        "vault-card": "0 0 0 1px rgba(212,175,55,0.12), 0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(212,175,55,0.05)",
      },
      fontFamily: {
        heading: ["'Space Grotesk'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "'Fira Code'", "monospace"],
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        // LUXURY DESIGN 2026: Premium gradients
        "gold-shimmer": "linear-gradient(135deg, #d4af37 0%, #e8cc6a 40%, #a8872a 70%, #d4af37 100%)",
        "gold-subtle": "linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(232,204,106,0.08) 50%, rgba(168,135,42,0.12) 100%)",
        "luxury-radial": "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,175,55,0.08) 0%, rgba(0,184,255,0.05) 40%, transparent 70%)",
        "mycelium-bg": "radial-gradient(ellipse 120% 80% at 50% 50%, rgba(0,184,255,0.04) 0%, rgba(212,175,55,0.02) 40%, transparent 70%)",
        "vault-gradient": "linear-gradient(160deg, rgba(212,175,55,0.06) 0%, rgba(0,10,20,0) 50%, rgba(0,184,255,0.04) 100%)",
      },
      keyframes: {
        fadeUp: { "0%": { opacity: "0", transform: "translateY(10px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        pulseSoft: { "0%,100%": { opacity: "1" }, "50%": { opacity: "0.65" } },
        pulseNeon: {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 20px rgba(0, 255, 157, 0.3)" },
          "50%": { opacity: "0.7", boxShadow: "0 0 40px rgba(0, 255, 157, 0.5)" },
        },
        // LUXURY DESIGN 2026: Gold shimmer animation
        goldShimmer: {
          "0%": { backgroundPosition: "200% center" },
          "100%": { backgroundPosition: "-200% center" },
        },
        goldPulse: {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 20px rgba(212,175,55,0.3), 0 0 60px rgba(212,175,55,0.1)" },
          "50%": { opacity: "0.85", boxShadow: "0 0 40px rgba(212,175,55,0.5), 0 0 100px rgba(212,175,55,0.2)" },
        },
        scanLine: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "33%": { transform: "translateY(-8px) rotate(1deg)" },
          "66%": { transform: "translateY(-4px) rotate(-0.5deg)" },
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
        // Vault door reveal
        vaultReveal: {
          "0%": { opacity: "0", transform: "scale(0.96) translateY(16px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        orbDrift: {
          "0%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(30px,-20px) scale(1.05)" },
          "66%": { transform: "translate(-20px,15px) scale(0.97)" },
          "100%": { transform: "translate(0,0) scale(1)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 420ms ease-out",
        pulseSoft: "pulseSoft 1.8s ease-in-out infinite",
        "pulse-neon": "pulseNeon 2s ease-in-out infinite",
        "scan-line": "scanLine 3s linear infinite",
        float: "float 3s ease-in-out infinite",
        "float-slow": "floatSlow 6s ease-in-out infinite",
        "grid-pulse": "gridPulse 4s ease-in-out infinite",
        "count-up": "countUp 0.6s ease-out",
        "magnetic-hover": "magneticHover 0.3s ease-out",
        "border-scan": "borderScan 3s linear infinite",
        // LUXURY DESIGN 2026
        "gold-shimmer": "goldShimmer 4s linear infinite",
        "gold-pulse": "goldPulse 3s ease-in-out infinite",
        "vault-reveal": "vaultReveal 0.8s cubic-bezier(0.16,1,0.3,1) forwards",
        "orb-drift": "orbDrift 12s ease-in-out infinite",
      }
    }
  },
  plugins: []
}
