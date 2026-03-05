import type { Locale } from '@/lib/i18n';

type MyceliumShareCardProps = {
  title?: string;
  pageUrl?: string;
  locale?: Locale;
  className?: string;
  answer?: string;
};

// TODO: implement full share card UI; currently a placeholder stub
export default function MyceliumShareCard({ className }: MyceliumShareCardProps) {
  return <div className={`p-4 bg-zinc-900 rounded-xl border border-zinc-700 ${className ?? ''}`}>Mycelium Share Card (Placeholder)</div>;
}
