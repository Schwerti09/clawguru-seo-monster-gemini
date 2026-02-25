// VISUAL UPGRADE 2026: Section title with claw-green kicker and heading font
export default function SectionTitle({ kicker, title, subtitle }: { kicker?: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      {kicker && <div className="text-xs uppercase tracking-widest" style={{ color: "rgba(0, 255, 157, 0.7)" }}>{kicker}</div>}
      <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-black font-heading">{title}</h2>
      {subtitle && <p className="mt-3 text-gray-300 max-w-3xl">{subtitle}</p>}
    </div>
  )
}
