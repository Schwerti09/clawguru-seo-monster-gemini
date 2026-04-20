import Link from "next/link"
import { DEFAULT_AUTHOR, ORGANIZATION, type Author } from "@/lib/seo/author"

interface Props {
  author?: Author
  locale?: string
  variant?: "full" | "compact"
  className?: string
}

/**
 * Visible author credit block. Pair with buildPersonSchema() in page <head>.
 * E-E-A-T: real name + real company + real location + link to about page.
 */
export default function AuthorBox({
  author = DEFAULT_AUTHOR,
  locale = "de",
  variant = "full",
  className = "",
}: Props) {
  const isDE = locale === "de"
  const bio = isDE ? author.bioDe : author.bio
  const labels = isDE
    ? { written: "Geschrieben und validiert von", readMore: "Über den Autor →" }
    : { written: "Written and validated by", readMore: "About the author →" }

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-3 text-xs text-gray-400 ${className}`}>
        <span>
          {labels.written}{" "}
          <Link href={`/${locale}/about`} className="text-cyan-300 hover:text-cyan-200 underline underline-offset-2">
            {author.name}
          </Link>
          {" · "}
          <span className="text-gray-500">{ORGANIZATION.shortName}</span>
        </span>
      </div>
    )
  }

  return (
    <aside
      className={`rounded-2xl border border-cyan-900/30 bg-black/30 p-5 ${className}`}
      itemScope
      itemType="https://schema.org/Person"
    >
      <div className="flex items-start gap-4">
        <div
          aria-hidden
          className="h-14 w-14 flex-shrink-0 rounded-full border border-cyan-500/40 bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 grid place-items-center text-xl font-black text-cyan-300"
        >
          {author.name.slice(0, 1)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs text-gray-500 mb-1">{labels.written}</div>
          <div className="font-bold text-white" itemProp="name">
            {author.name}
          </div>
          <div className="text-xs text-cyan-300 mb-2" itemProp="jobTitle">
            {author.jobTitle}
          </div>
          <p className="text-sm text-gray-300 leading-relaxed" itemProp="description">
            {bio}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
            <span className="text-gray-500">
              <span itemProp="worksFor" itemScope itemType="https://schema.org/Organization">
                <span itemProp="name">{ORGANIZATION.name}</span>
              </span>
            </span>
            <Link
              href={`/${locale}/about`}
              className="text-cyan-400 hover:text-cyan-300 font-semibold"
              itemProp="url"
            >
              {labels.readMore}
            </Link>
          </div>
        </div>
      </div>
    </aside>
  )
}
