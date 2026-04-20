interface Props {
  date: string | Date
  locale?: string
  className?: string
  showPublished?: boolean
  publishedDate?: string | Date
}

/**
 * Visible "Last updated" timestamp. Match the same date passed to
 * buildAuthoredArticleSchema({ dateModified }) so schema + UI agree.
 */
export default function LastUpdated({
  date,
  locale = "de",
  className = "",
  showPublished = false,
  publishedDate,
}: Props) {
  const updated = typeof date === "string" ? new Date(date) : date
  const isDE = locale === "de"
  const lang = isDE ? "de-DE" : locale === "es" ? "es-ES" : "en-GB"
  const labels = isDE
    ? { updated: "Zuletzt aktualisiert", published: "Veröffentlicht" }
    : { updated: "Last updated", published: "Published" }

  const fmt = (d: Date) => d.toLocaleDateString(lang, { year: "numeric", month: "long", day: "numeric" })

  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 ${className}`}>
      <span>
        {labels.updated}:{" "}
        <time dateTime={updated.toISOString()} className="text-gray-300 font-mono">
          {fmt(updated)}
        </time>
      </span>
      {showPublished && publishedDate && (
        <span>
          · {labels.published}:{" "}
          <time
            dateTime={
              typeof publishedDate === "string" ? new Date(publishedDate).toISOString() : publishedDate.toISOString()
            }
            className="text-gray-400 font-mono"
          >
            {fmt(typeof publishedDate === "string" ? new Date(publishedDate) : publishedDate)}
          </time>
        </span>
      )}
    </div>
  )
}
