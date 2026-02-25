// VISUAL UPGRADE 2026: Skeleton loader with scanline sweep effect.
// Drop-in placeholder for loading states with cyber-security aesthetic.

export default function SkeletonScan({
  className = "",
  lines = 3,
}: {
  className?: string
  lines?: number
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton-scan h-4 rounded-lg"
          style={{ width: i === lines - 1 ? "60%" : "100%" }}
        />
      ))}
    </div>
  )
}
