// VISUAL BEAST 2026: Header with glassmorphism + neon glow
import Container from "@/components/shared/Container"

const NavLink = ({ href, label }: { href: string; label: string }) => (
  <a
    href={href}
    className="px-3 py-2 rounded-xl hover:bg-white/5 hover:text-[#00ff9d] transition-all text-sm"
  >
    {label}
  </a>
)

export default function Header() {
  return (
    <div className="fixed top-10 left-0 right-0 z-40">
      <Container>
        {/* VISUAL BEAST 2026: Glassmorphism nav bar */}
        <div className="flex items-center justify-between backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3 shadow-neon-green/20">
          <a href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#00ff9d] to-[#00b8ff] shadow-neon-green" />
            <div className="leading-tight">
              <div className="font-black font-headline">ClawGuru</div>
              <div className="text-xs text-gray-400 hidden sm:block">Institutional Ops Intelligence</div>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-1">
            <NavLink href="/pricing" label="Pricing" />
            <NavLink href="/live" label="Live" />
            <NavLink href="/check" label="Security-Check" />
            <NavLink href="/copilot" label="Copilot" />
            <NavLink href="/runbooks" label="Runbooks" />
            <NavLink href="/tags" label="Tags" />
            <NavLink href="/intel" label="Intel Feed" />
            <NavLink href="/academy" label="Academy" />
            <NavLink href="/openclaw-security-2026" label="Lagebericht" />
            <NavLink href="/vault" label="Vault" />
            <NavLink href="/hosting-kosten" label="Kosten" />
            <NavLink href="/pricing" label="Pricing" />
            <NavLink href="/downloads" label="Downloads" />
            <NavLink href="/case-studies" label="Cases" />
            <NavLink href="/ueber-uns" label="Über uns" />
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="/security/notfall-leitfaden"
              className="px-3 py-2 rounded-xl bg-red-500/80 hover:bg-red-500 font-black text-sm shadow-[0_0_15px_rgba(239,68,68,0.3)]"
            >
              Notfall
            </a>
            <a
              href="/pricing"
              className="px-3 py-2 rounded-xl glass-card border-[#00ff9d]/30 hover:shadow-neon-green font-bold text-sm neon-text-green transition-all"
            >
              Pro Kits
            </a>
          </div>
        </div>
      </Container>
    </div>
  )
}
