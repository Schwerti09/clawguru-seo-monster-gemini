// Section title component with optional kicker/subtitle
interface SectionTitleProps {
  children?: React.ReactNode;
  kicker?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function SectionTitle({
  children,
  kicker,
  title,
  subtitle,
  className = '',
}: SectionTitleProps) {
  return (
    <div className={className}>
      {kicker && (
        <p className="text-xs font-mono tracking-widest uppercase text-[#c9a84c] mb-2">
          {kicker}
        </p>
      )}

      {title ? (
        <h2 className="text-3xl font-black mb-2">{title}</h2>
      ) : children ? (
        <h2>{children}</h2>
      ) : null}

      {subtitle && <p className="text-gray-400">{subtitle}</p>}
    </div>
  );
}