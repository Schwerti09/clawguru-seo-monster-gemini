// FortNexus – The #1 Fortnite Fan Hub built by the best AI Team in 2026 🔥
// Sections: Navbar · Hero (particle canvas) · Item Shop · Live Streams · News & Leaks · Community Gallery
"use client"

import { useState, useEffect, useRef, useCallback } from "react"

/* ─── Fortnite colour palette ─────────────────────────────── */
const FN = {
  bg:           "#06010f",
  navy:         "#0d0d2b",
  purple:       "#7B2FBE",
  purpleGlow:   "rgba(123,47,190,0.35)",
  purpleLight:  "#a855f7",
  blue:         "#00d4ff",
  blueGlow:     "rgba(0,212,255,0.3)",
  gold:         "#FFD700",
  goldGlow:     "rgba(255,215,0,0.3)",
  white:        "#FFFFFF",
  glass:        "rgba(255,255,255,0.05)",
  glassBorder:  "rgba(255,255,255,0.10)",
  textDim:      "rgba(255,255,255,0.55)",
  textFaint:    "rgba(255,255,255,0.25)",
} as const

/* ─── Known Fortnite streamers ───────────────────────────── */
const STREAMERS = [
  { id: "ninja",       name: "Ninja",       avatar: "🎮", desc: "OG Fortnite legend" },
  { id: "tfue",        name: "Tfue",        avatar: "🔫", desc: "Pro player & streamer" },
  { id: "nickmercs",   name: "NICKMERCS",   avatar: "🎯", desc: "Controller goat" },
  { id: "timthetatman",name: "TimTheTatman",avatar: "😂", desc: "Fan-favourite streamer" },
  { id: "loltyler1",   name: "Tyler1",      avatar: "💪", desc: "Intense Fortnite vibes" },
  { id: "mongraal",    name: "Mongraal",    avatar: "⚡", desc: "EU competitive beast" },
]

/* ─── News / leak sources ────────────────────────────────── */
const NEWS_ITEMS = [
  {
    tag: "LEAK",
    source: "HYPEX",
    title: "New Fortnite Chapter skins & POI changes spotted in latest patch",
    url: "https://twitter.com/HYPEX",
    time: "2h ago",
    accent: FN.gold,
  },
  {
    tag: "LEAK",
    source: "ShiinaBR",
    title: "Upcoming Fortnite Crew Pack items revealed via file data-mine",
    url: "https://twitter.com/ShiinaBR",
    time: "4h ago",
    accent: FN.gold,
  },
  {
    tag: "NEWS",
    source: "FNLeaksAndInfo",
    title: "Official Fortnite OG Season details – all new weapons and locations confirmed",
    url: "https://twitter.com/FNLeaksAndInfo",
    time: "6h ago",
    accent: FN.blue,
  },
  {
    tag: "NEWS",
    source: "Fortnite Status",
    title: "v34.10 downtime – servers back online with new content update",
    url: "https://twitter.com/FortniteStatus",
    time: "12h ago",
    accent: FN.blue,
  },
  {
    tag: "LEAK",
    source: "iFireMonkey",
    title: "Collaboration skins arriving next week – iconic crossover coming to Battle Royale",
    url: "https://twitter.com/iFireMonkey",
    time: "1d ago",
    accent: FN.gold,
  },
  {
    tag: "NEWS",
    source: "Epic Games",
    title: "New in-game tournament announced – $1M prize pool for FNCS Season Finals",
    url: "https://www.epicgames.com/fortnite/en-US/news",
    time: "1d ago",
    accent: FN.purpleLight,
  },
]

/* ─── Gallery placeholder images ────────────────────────── */
const GALLERY = [
  { title: "Victory Royale #247",   emoji: "🏆", color: FN.gold },
  { title: "Zero Build Master",     emoji: "⚡", color: FN.blue },
  { title: "OG Tilted Towers",      emoji: "🏙️", color: FN.purpleLight },
  { title: "Mythic Weapon Drop",    emoji: "🔮", color: FN.purple },
  { title: "Rank Elite Carry",      emoji: "🎯", color: FN.gold },
  { title: "Battle Bus Jump",       emoji: "🪂", color: FN.blue },
]

/* ─── Particle Canvas ────────────────────────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef   = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = Math.min(typeof window !== "undefined" && window.devicePixelRatio ? window.devicePixelRatio : 1, 2)

    function resize() {
      if (!canvas) return
      canvas.width  = canvas.offsetWidth  * dpr
      canvas.height = canvas.offsetHeight * dpr
    }
    resize()
    window.addEventListener("resize", resize)

    type Particle = { x: number; y: number; vx: number; vy: number; r: number; color: string; alpha: number; life: number }
    const colors = [FN.blue, FN.purpleLight, FN.gold, "#ffffff"]
    const particles: Particle[] = []
    const COUNT = 80

    function spawn(): Particle {
      return {
        x: Math.random() * (canvas?.width ?? 800),
        y: Math.random() * (canvas?.height ?? 600),
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: 0.8 + Math.random() * 2.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.15 + Math.random() * 0.55,
        life: Math.random() * 400,
      }
    }
    for (let i = 0; i < COUNT; i++) particles.push(spawn())

    let frame = 0
    function draw() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      // subtle gradient background
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      grad.addColorStop(0, "#06010f")
      grad.addColorStop(0.5, "#0d0025")
      grad.addColorStop(1, "#06010f")
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.life++
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        const pulse = 1 + Math.sin(frame * 0.025 + p.life * 0.04) * 0.4
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * pulse, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha * pulse * 0.7
        ctx.fill()
        ctx.globalAlpha = 1
      }

      // draw connecting lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - particles[i].x
          const dy = particles[j].y - particles[i].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.08
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(168,85,247,${alpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      frame++
      animRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener("resize", resize)
      if (animRef.current !== null) cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  )
}

/* ─── Navbar ──────────────────────────────────────────────── */
function FortNexusNavbar({ active, onNav }: { active: string; onNav: (s: string) => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const links = ["Hero", "Shop", "Streams", "News", "Gallery"]

  return (
    <nav
      className="sticky top-0 z-50 w-full transition-all duration-300"
      style={{
        background: scrolled ? "rgba(6,1,15,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? `1px solid ${FN.glassBorder}` : "none",
      }}
      aria-label="FortNexus navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <a
          href="#hero"
          onClick={() => onNav("Hero")}
          className="flex items-center gap-2 group no-underline"
          aria-label="FortNexus home"
        >
          <span
            className="text-2xl font-black tracking-tighter leading-none"
            style={{
              fontFamily: "'Bebas Neue', 'Impact', sans-serif",
              background: `linear-gradient(135deg, ${FN.blue}, ${FN.purpleLight})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            FORT<span style={{ WebkitTextFillColor: FN.gold, color: FN.gold }}>NEXUS</span>
          </span>
          <span
            className="text-[9px] font-mono tracking-widest uppercase self-end pb-0.5"
            style={{ color: FN.textFaint }}
          >
            v2026
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={() => onNav(link)}
              className="px-4 py-2 rounded-full text-xs font-mono tracking-widest uppercase transition-all duration-200 no-underline"
              style={{
                background: active === link ? `${FN.blue}14` : "transparent",
                color: active === link ? FN.blue : FN.textDim,
                borderBottom: active === link ? `1px solid ${FN.blue}` : "1px solid transparent",
              }}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2 rounded-lg"
          style={{ color: FN.textDim }}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <div className="w-5 h-0.5 bg-current mb-1 transition-all" style={{ transform: menuOpen ? "rotate(45deg) translate(2px,6px)" : "none" }} />
          <div className="w-5 h-0.5 bg-current mb-1 transition-all" style={{ opacity: menuOpen ? 0 : 1 }} />
          <div className="w-5 h-0.5 bg-current transition-all" style={{ transform: menuOpen ? "rotate(-45deg) translate(2px,-6px)" : "none" }} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden px-4 pb-4 flex flex-col gap-1"
          style={{ background: "rgba(6,1,15,0.97)", borderBottom: `1px solid ${FN.glassBorder}` }}
        >
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={() => { onNav(link); setMenuOpen(false) }}
              className="px-4 py-3 rounded-lg text-xs font-mono tracking-widest uppercase no-underline transition-colors"
              style={{ color: active === link ? FN.blue : FN.textDim, background: active === link ? `${FN.blue}12` : "transparent" }}
            >
              {link}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}

/* ─── Hero Section ───────────────────────────────────────── */
function HeroSection() {
  const [visible, setVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), 100); return () => clearTimeout(t) }, [])

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] flex flex-col items-center justify-center text-center overflow-hidden px-4"
    >
      {/* Particle background */}
      <ParticleCanvas />

      {/* Glow blobs */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${FN.purpleGlow} 0%, transparent 70%)` }}
      />
      <div
        className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${FN.blueGlow} 0%, transparent 70%)` }}
      />

      <div
        className="relative z-10 flex flex-col items-center"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(32px)", transition: "opacity 0.8s ease, transform 0.8s ease" }}
      >
        <div className="text-xs font-mono tracking-[0.3em] uppercase mb-4" style={{ color: `${FN.gold}aa` }}>
          ⚡ FortNexus · The #1 Fortnite Hub · 2026
        </div>

        <h1
          className="text-[clamp(3rem,12vw,9rem)] font-black leading-none tracking-tighter mb-4"
          style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
        >
          <span
            style={{
              background: `linear-gradient(135deg, ${FN.white} 0%, ${FN.blue} 40%, ${FN.purpleLight} 70%, ${FN.gold} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            FORT
          </span>
          <span style={{ color: FN.gold, WebkitTextFillColor: FN.gold }}>NEXUS</span>
        </h1>

        <p className="text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-3" style={{ color: FN.textDim }}>
          Your ultimate Fortnite companion — live item shop, top streamers,
          breaking leaks, and community highlights. All in one nexus.
        </p>

        <div className="flex flex-wrap gap-3 justify-center mt-4">
          <a
            href="#shop"
            className="px-7 py-3 rounded-full font-mono text-sm font-bold uppercase tracking-widest no-underline transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, ${FN.purple}, ${FN.blue})`,
              color: FN.white,
              boxShadow: `0 0 28px ${FN.blueGlow}`,
            }}
          >
            View Item Shop
          </a>
          <a
            href="#streams"
            className="px-7 py-3 rounded-full font-mono text-sm font-bold uppercase tracking-widest no-underline transition-all duration-300"
            style={{
              background: FN.glass,
              border: `1px solid ${FN.glassBorder}`,
              color: FN.textDim,
            }}
          >
            Watch Streams
          </a>
        </div>

        {/* Live Stats */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-14 mt-14">
          {[
            { label: "Daily Players", value: "4.2M+", accent: FN.blue },
            { label: "Items in Shop", value: "34",    accent: FN.gold },
            { label: "Live Streamers", value: "12K+", accent: FN.purpleLight },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl md:text-3xl font-black" style={{ color: s.accent, fontFamily: "'Bebas Neue','Impact',sans-serif" }}>
                {s.value}
              </div>
              <div className="text-[10px] font-mono tracking-widest uppercase mt-1" style={{ color: FN.textFaint }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        style={{ color: FN.textFaint, animation: "fn-bounce 2s ease-in-out infinite" }}
      >
        <div className="text-[9px] font-mono tracking-widest uppercase">Scroll</div>
        <div style={{ fontSize: "18px" }}>↓</div>
      </div>
    </section>
  )
}

/* ─── Item Shop types & component ───────────────────────── */
type ShopEntry = {
  name: string
  rarity: string
  price: number
  images: { icon: string; featured?: string }
  section?: { name: string }
}

function RarityBadge({ rarity }: { rarity: string }) {
  const map: Record<string, string> = {
    legendary: "#F4A000",
    epic:      "#C84CF4",
    rare:      "#2D9BF0",
    uncommon:  "#39B65A",
    common:    "#808080",
  }
  const color = map[rarity?.toLowerCase()] ?? "#808080"
  return (
    <span
      className="text-[9px] font-mono tracking-widest uppercase px-1.5 py-0.5 rounded"
      style={{ background: `${color}20`, color, border: `1px solid ${color}55` }}
    >
      {rarity ?? "common"}
    </span>
  )
}

function ShopCard({ item }: { item: ShopEntry }) {
  const [hov, setHov] = useState(false)
  const img = item.images?.featured ?? item.images?.icon ?? ""
  return (
    <div
      className="relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
      style={{
        background: FN.glass,
        border: `1px solid ${hov ? FN.purpleLight + "55" : FN.glassBorder}`,
        transform: hov ? "translateY(-4px) scale(1.02)" : "none",
        boxShadow: hov ? `0 12px 40px ${FN.purpleGlow}` : "none",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {img ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={img}
          alt={item.name}
          className="w-full aspect-square object-cover"
          loading="lazy"
        />
      ) : (
        <div
          className="w-full aspect-square flex items-center justify-center text-4xl"
          style={{ background: `linear-gradient(135deg, #1a0533, #0d0d2b)` }}
        >
          🎮
        </div>
      )}
      <div className="p-3">
        <div className="flex items-start justify-between gap-1 mb-1.5">
          <p className="text-xs font-bold leading-tight truncate" style={{ color: FN.white }}>
            {item.name}
          </p>
          <RarityBadge rarity={item.rarity} />
        </div>
        {item.price > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <span style={{ color: FN.gold, fontSize: "11px" }}>🪙</span>
            <span className="text-xs font-black font-mono" style={{ color: FN.gold }}>
              {item.price.toLocaleString()}
            </span>
            <span className="text-[9px] font-mono" style={{ color: FN.textFaint }}>V-Bucks</span>
          </div>
        )}
        {item.section?.name && (
          <div className="text-[9px] font-mono tracking-widest uppercase mt-1.5" style={{ color: FN.textFaint }}>
            {item.section.name}
          </div>
        )}
      </div>
    </div>
  )
}

function ItemShopSection() {
  const [items, setItems]     = useState<ShopEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/fortnexus/shop")
      .then((r) => r.json())
      .then((data) => {
        // fortnite-api.com v2 returns data.data.featured.entries + data.data.daily.entries
        const raw = data?.data
        if (!raw) throw new Error("No data")
        const entries: ShopEntry[] = []
        ;[
          ...(raw.featured?.entries ?? []),
          ...(raw.daily?.entries ?? []),
          ...(raw.specialFeatured?.entries ?? []),
          ...(raw.specialDaily?.entries ?? []),
        ].forEach((e: { bundle?: { name: string; image: string }; items?: ShopEntry[]; regularPrice?: number; finalPrice?: number }) => {
          if (e.bundle) {
            entries.push({
              name:   e.bundle.name,
              rarity: "bundle",
              price:  e.finalPrice ?? e.regularPrice ?? 0,
              images: { icon: e.bundle.image },
            })
          } else {
            ;(e.items ?? []).slice(0, 1).forEach((it: ShopEntry) => {
              entries.push({
                name:    it.name,
                rarity:  it.rarity,
                price:   e.finalPrice ?? e.regularPrice ?? it.price ?? 0,
                images:  it.images,
                section: (e as { section?: { name: string } }).section,
              })
            })
          }
        })
        setItems(entries.slice(0, 24))
        setLoading(false)
      })
      .catch((err) => {
        console.error("[FortNexus] Shop fetch error:", err)
        setError("Could not load item shop – try again later.")
        setLoading(false)
      })
  }, [])

  return (
    <section id="shop" className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="text-[10px] font-mono tracking-[0.3em] uppercase mb-3" style={{ color: `${FN.gold}aa` }}>
          ⚔️ Daily Item Shop
        </div>
        <h2
          className="text-4xl md:text-6xl font-black tracking-tighter"
          style={{ fontFamily: "'Bebas Neue','Impact',sans-serif", color: FN.white }}
        >
          TODAY&apos;S SHOP
        </h2>
        <p className="text-sm mt-2 max-w-md mx-auto" style={{ color: FN.textDim }}>
          Live data from Fortnite API · Refreshes every hour
        </p>
      </div>

      {loading && (
        <div className="flex flex-col items-center gap-4 py-16">
          <div
            className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: `${FN.blue}55`, borderTopColor: FN.blue }}
          />
          <p className="text-xs font-mono" style={{ color: FN.textFaint }}>Loading item shop…</p>
        </div>
      )}

      {error && (
        <div
          className="rounded-2xl p-8 text-center mx-auto max-w-md"
          style={{ background: FN.glass, border: `1px solid ${FN.glassBorder}` }}
        >
          <div className="text-3xl mb-3">🛒</div>
          <p className="text-sm font-mono" style={{ color: FN.textDim }}>{error}</p>
          <a
            href="https://fnbr.co/shop"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 px-5 py-2 rounded-full font-mono text-xs font-bold uppercase tracking-widest no-underline transition-colors"
            style={{ background: `${FN.purple}22`, border: `1px solid ${FN.purple}55`, color: FN.purpleLight }}
          >
            View on FNBR.co →
          </a>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {items.map((item, i) => (
            <ShopCard key={`${item.name}-${i}`} item={item} />
          ))}
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm font-mono" style={{ color: FN.textFaint }}>No items found. Check back soon.</p>
        </div>
      )}
    </section>
  )
}

/* ─── Live Streams ───────────────────────────────────────── */
function TwitchEmbed({ channelId, channelName }: { channelId: string; channelName: string }) {
  const [loaded, setLoaded] = useState(false)
  const parent = typeof window !== "undefined" ? window.location.hostname : "localhost"

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: FN.glass,
        border: `1px solid ${FN.glassBorder}`,
        aspectRatio: "16/9",
        position: "relative",
      }}
    >
      {!loaded && (
        <button
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 cursor-pointer w-full h-full border-0"
          style={{ background: "transparent" }}
          onClick={() => setLoaded(true)}
          aria-label={`Load ${channelName} Twitch stream`}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
            style={{ background: `${FN.purple}33`, border: `2px solid ${FN.purple}66` }}
          >
            ▶
          </div>
          <p className="text-sm font-bold" style={{ color: FN.white }}>{channelName}</p>
          <p className="text-[10px] font-mono tracking-widest uppercase" style={{ color: FN.textFaint }}>
            Click to load stream
          </p>
        </button>
      )}
      {loaded && (
        <iframe
          src={`https://player.twitch.tv/?channel=${channelId}&parent=${parent}&muted=true&autoplay=false`}
          allowFullScreen
          className="w-full h-full"
          title={`${channelName} Twitch stream`}
          loading="lazy"
        />
      )}
    </div>
  )
}

function StreamerCard({ streamer, onSelect, selected }: {
  streamer: typeof STREAMERS[number]
  onSelect: (id: string) => void
  selected: boolean
}) {
  return (
    <button
      className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition-all duration-200 border-0 cursor-pointer"
      style={{
        background: selected ? `${FN.purple}22` : FN.glass,
        border: `1px solid ${selected ? FN.purple + "66" : FN.glassBorder}`,
        color: "inherit",
      }}
      onClick={() => onSelect(streamer.id)}
      aria-pressed={selected}
    >
      <span className="text-xl">{streamer.avatar}</span>
      <div className="min-w-0">
        <p className="text-sm font-bold truncate" style={{ color: selected ? FN.purpleLight : FN.white }}>
          {streamer.name}
        </p>
        <p className="text-[10px] font-mono truncate" style={{ color: FN.textFaint }}>
          {streamer.desc}
        </p>
      </div>
    </button>
  )
}

function LiveStreamsSection() {
  const [active, setActive] = useState(STREAMERS[0].id)
  const current = STREAMERS.find((s) => s.id === active) ?? STREAMERS[0]

  return (
    <section id="streams" className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="text-[10px] font-mono tracking-[0.3em] uppercase mb-3" style={{ color: `${FN.purpleLight}aa` }}>
          📺 Live on Twitch
        </div>
        <h2
          className="text-4xl md:text-6xl font-black tracking-tighter"
          style={{ fontFamily: "'Bebas Neue','Impact',sans-serif", color: FN.white }}
        >
          LIVE STREAMS
        </h2>
        <p className="text-sm mt-2 max-w-md mx-auto" style={{ color: FN.textDim }}>
          Watch top Fortnite streamers live via Twitch
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-6 items-start">
        {/* Main embed */}
        <div>
          <TwitchEmbed channelId={current.id} channelName={current.name} />
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xl">{current.avatar}</span>
            <div>
              <p className="font-bold text-sm" style={{ color: FN.white }}>{current.name}</p>
              <p className="text-xs font-mono" style={{ color: FN.textFaint }}>{current.desc}</p>
            </div>
            <a
              href={`https://www.twitch.tv/${current.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto px-4 py-1.5 rounded-full font-mono text-xs font-bold uppercase tracking-widest no-underline transition-colors"
              style={{ background: `${FN.purple}33`, border: `1px solid ${FN.purple}66`, color: FN.purpleLight }}
            >
              Open on Twitch ↗
            </a>
          </div>
        </div>

        {/* Streamer directory */}
        <div>
          <p className="text-[10px] font-mono tracking-widest uppercase mb-3" style={{ color: FN.textFaint }}>
            Streamer Directory
          </p>
          <div className="flex flex-col gap-2">
            {STREAMERS.map((s) => (
              <StreamerCard key={s.id} streamer={s} onSelect={setActive} selected={active === s.id} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── News & Leaks ───────────────────────────────────────── */
function NewsCard({ item }: { item: typeof NEWS_ITEMS[number] }) {
  const [hov, setHov] = useState(false)
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-2xl p-5 no-underline transition-all duration-300"
      style={{
        background: FN.glass,
        border: `1px solid ${hov ? item.accent + "55" : FN.glassBorder}`,
        transform: hov ? "translateY(-2px)" : "none",
        boxShadow: hov ? `0 8px 32px rgba(0,0,0,0.4)` : "none",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className="text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full"
          style={{ background: `${item.accent}22`, color: item.accent, border: `1px solid ${item.accent}44` }}
        >
          {item.tag}
        </span>
        <span className="text-[10px] font-mono font-bold" style={{ color: item.accent }}>
          @{item.source}
        </span>
        <span className="ml-auto text-[10px] font-mono" style={{ color: FN.textFaint }}>{item.time}</span>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: FN.white }}>{item.title}</p>
      <p className="mt-2 text-[10px] font-mono" style={{ color: item.accent }}>Read more →</p>
    </a>
  )
}

function NewsFeedSection() {
  const [filter, setFilter] = useState<"ALL" | "LEAK" | "NEWS">("ALL")
  const visible = NEWS_ITEMS.filter((n) => filter === "ALL" || n.tag === filter)

  return (
    <section id="news" className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="text-[10px] font-mono tracking-[0.3em] uppercase mb-3" style={{ color: `${FN.gold}aa` }}>
          📰 News & Leaks
        </div>
        <h2
          className="text-4xl md:text-6xl font-black tracking-tighter"
          style={{ fontFamily: "'Bebas Neue','Impact',sans-serif", color: FN.white }}
        >
          LATEST INTEL
        </h2>
        <p className="text-sm mt-2 max-w-md mx-auto" style={{ color: FN.textDim }}>
          Curated from HYPEX, ShiinaBR, FNLeaksAndInfo & more
        </p>
      </div>

      {/* Filter pills */}
      <div className="flex justify-center gap-2 mb-8">
        {(["ALL", "LEAK", "NEWS"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-5 py-2 rounded-full font-mono text-xs uppercase tracking-widest transition-all duration-200 border-0 cursor-pointer"
            style={{
              background: filter === f ? `${FN.blue}22` : FN.glass,
              border: `1px solid ${filter === f ? FN.blue + "55" : FN.glassBorder}`,
              color: filter === f ? FN.blue : FN.textDim,
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map((item, i) => (
          <NewsCard key={i} item={item} />
        ))}
      </div>

      {/* Follow links */}
      <div
        className="mt-10 p-6 rounded-2xl text-center"
        style={{ background: FN.glass, border: `1px solid ${FN.glassBorder}` }}
      >
        <p className="text-[10px] font-mono tracking-widest uppercase mb-4" style={{ color: FN.textFaint }}>
          Follow the best Fortnite leak accounts
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { name: "HYPEX", url: "https://twitter.com/HYPEX" },
            { name: "ShiinaBR", url: "https://twitter.com/ShiinaBR" },
            { name: "FNLeaksAndInfo", url: "https://twitter.com/FNLeaksAndInfo" },
            { name: "iFireMonkey", url: "https://twitter.com/iFireMonkey" },
          ].map((a) => (
            <a
              key={a.name}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full font-mono text-xs no-underline transition-all duration-200"
              style={{
                background: `${FN.gold}12`,
                border: `1px solid ${FN.gold}33`,
                color: FN.gold,
              }}
            >
              @{a.name} ↗
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Community Gallery ──────────────────────────────────── */
function CommunityGallery() {
  return (
    <section id="gallery" className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="text-[10px] font-mono tracking-[0.3em] uppercase mb-3" style={{ color: `${FN.purpleLight}aa` }}>
          🏆 Community
        </div>
        <h2
          className="text-4xl md:text-6xl font-black tracking-tighter"
          style={{ fontFamily: "'Bebas Neue','Impact',sans-serif", color: FN.white }}
        >
          HALL OF FAME
        </h2>
        <p className="text-sm mt-2 max-w-md mx-auto" style={{ color: FN.textDim }}>
          Top community moments, highlights & Victory Royales
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {GALLERY.map((item, i) => (
          <GalleryCard key={i} item={item} index={i} />
        ))}
      </div>

      <div className="text-center mt-10">
        <p className="text-xs font-mono mb-4" style={{ color: FN.textFaint }}>
          Submit your clips & screenshots to be featured
        </p>
        <a
          href="https://discord.gg/fortnite"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-7 py-3 rounded-full font-mono text-sm font-bold uppercase tracking-widest no-underline transition-all duration-300"
          style={{
            background: `linear-gradient(135deg, ${FN.purple}, ${FN.purpleLight})`,
            color: FN.white,
            boxShadow: `0 0 24px ${FN.purpleGlow}`,
          }}
        >
          Join the Community
        </a>
      </div>
    </section>
  )
}

function GalleryCard({ item, index }: { item: typeof GALLERY[number]; index: number }) {
  const [hov, setHov] = useState(false)
  const delay = index * 0.08

  return (
    <div
      className="relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
      style={{
        aspectRatio: index % 3 === 0 ? "1/1" : "4/3",
        background: `linear-gradient(135deg, #1a0533 0%, #0d0d2b 100%)`,
        border: `1px solid ${hov ? item.color + "66" : FN.glassBorder}`,
        transform: hov ? "scale(1.03)" : "none",
        boxShadow: hov ? `0 12px 48px ${item.color}22` : "none",
        transitionDelay: `${delay}s`,
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      role="img"
      aria-label={item.title}
    >
      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at 50% 30%, ${item.color}18 0%, transparent 70%)` }}
      />

      {/* Emoji icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span style={{ fontSize: "clamp(2rem, 6vw, 4rem)", filter: hov ? "drop-shadow(0 0 16px currentColor)" : "none", transition: "filter 0.3s ease" }}>
          {item.emoji}
        </span>
      </div>

      {/* Title overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 p-3"
        style={{
          background: "linear-gradient(to top, rgba(6,1,15,0.9) 0%, transparent 100%)",
          transform: hov ? "translateY(0)" : "translateY(4px)",
          opacity: hov ? 1 : 0.7,
          transition: "transform 0.3s ease, opacity 0.3s ease",
        }}
      >
        <p className="text-xs font-bold" style={{ color: item.color }}>{item.title}</p>
      </div>
    </div>
  )
}

/* ─── Footer ─────────────────────────────────────────────── */
function FortNexusFooter() {
  return (
    <footer
      className="py-10 px-4 text-center"
      style={{ borderTop: `1px solid ${FN.glassBorder}` }}
    >
      <div
        className="text-2xl font-black mb-2"
        style={{
          fontFamily: "'Bebas Neue','Impact',sans-serif",
          background: `linear-gradient(135deg, ${FN.blue}, ${FN.purpleLight})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        FORTNEXUS
      </div>
      <p className="text-xs font-mono mb-4" style={{ color: FN.textFaint }}>
        Built by the best AI Team in 2026 🔥 · Powered by{" "}
        <a href="https://fortnite-api.com" target="_blank" rel="noopener noreferrer" style={{ color: FN.blue }}>
          Fortnite API
        </a>
      </p>
      <p className="text-[10px] font-mono" style={{ color: `${FN.textFaint}88` }}>
        FortNexus is not affiliated with Epic Games. Fortnite® is a trademark of Epic Games, Inc.
      </p>
    </footer>
  )
}

/* ─── Main Page ──────────────────────────────────────────── */
export default function FortNexusPage() {
  const [activeSection, setActiveSection] = useState("Hero")

  const handleNav = useCallback((section: string) => {
    setActiveSection(section)
  }, [])

  // Intersection-based active section tracking
  useEffect(() => {
    const sectionIds = ["hero", "shop", "streams", "news", "gallery"]
    const observers: IntersectionObserver[] = []

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id.charAt(0).toUpperCase() + id.slice(1))
          }
        },
        { threshold: 0.4 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <>
      {/* Load Bebas Neue font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

        @keyframes fn-bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(8px); }
        }

        #fortnexus-root { scroll-behavior: smooth; }
        #fortnexus-root section { scroll-margin-top: 64px; }
      `}</style>

      <div
        id="fortnexus-root"
        style={{
          background: FN.bg,
          minHeight: "100vh",
          color: FN.white,
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        <FortNexusNavbar active={activeSection} onNav={handleNav} />
        <HeroSection />

        {/* Divider */}
        <div className="max-w-7xl mx-auto px-4">
          <div style={{ height: "1px", background: `linear-gradient(90deg, transparent, ${FN.purple}55, transparent)` }} />
        </div>

        <ItemShopSection />

        <div className="max-w-7xl mx-auto px-4">
          <div style={{ height: "1px", background: `linear-gradient(90deg, transparent, ${FN.blue}44, transparent)` }} />
        </div>

        <LiveStreamsSection />

        <div className="max-w-7xl mx-auto px-4">
          <div style={{ height: "1px", background: `linear-gradient(90deg, transparent, ${FN.gold}33, transparent)` }} />
        </div>

        <NewsFeedSection />

        <div className="max-w-7xl mx-auto px-4">
          <div style={{ height: "1px", background: `linear-gradient(90deg, transparent, ${FN.purpleLight}44, transparent)` }} />
        </div>

        <CommunityGallery />

        <FortNexusFooter />
      </div>
    </>
  )
}
