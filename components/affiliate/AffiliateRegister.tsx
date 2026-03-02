"use client"

import { useState, type FormEvent } from "react"
import Image from "next/image"
import { BASE_URL } from "@/lib/config"
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale, t } from "@/lib/i18n"

type Banner = {
  locale: Locale
  label: string
  dataUrl: string
}

const LOCALE_LABELS: Record<Locale, string> = {
  de: "Deutsch",
  en: "English",
  es: "Español",
  fr: "Français",
  pt: "Português",
  it: "Italiano",
  ru: "Русский",
  zh: "中文",
  ja: "日本語",
  ar: "العربية",
}

const CTA_COPY: Record<Locale, string> = {
  de: "Security Fixes in Minuten",
  en: "Security Fixes in Minutes",
  es: "Fixes de Seguridad en Minutos",
  fr: "Correctifs Sécurité en Minutes",
  pt: "Correções de Segurança em Minutos",
  it: "Fix di Sicurezza in Minuti",
  ru: "Security-фиксы за минуты",
  zh: "分钟级安全修复",
  ja: "数分でセキュリティ修復",
  ar: "إصلاحات أمنية خلال دقائق",
}

const BANNER_WIDTH = 600
const BANNER_HEIGHT = 315

function generateBanner({
  affiliateName,
  affiliateId,
  locale,
}: {
  affiliateName: string
  affiliateId: string
  locale: Locale
}) {
  const canvas = document.createElement("canvas")
  canvas.width = BANNER_WIDTH
  canvas.height = BANNER_HEIGHT
  const ctx = canvas.getContext("2d")
  if (!ctx) return ""

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
  gradient.addColorStop(0, "#0b0f1f")
  gradient.addColorStop(1, "#1c344a")
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = "#00ff9d"
  ctx.font = "bold 28px Inter, sans-serif"
  ctx.fillText("ClawGuru", 32, 60)

  ctx.fillStyle = "#ffffff"
  ctx.font = "bold 30px Inter, sans-serif"
  ctx.fillText(CTA_COPY[locale], 32, 120)

  ctx.fillStyle = "#9fe8ff"
  ctx.font = "16px Inter, sans-serif"
  ctx.fillText(`Partner: ${affiliateName}`, 32, 155)

  ctx.fillStyle = "#00b8ff"
  ctx.font = "bold 18px Inter, sans-serif"
  ctx.fillText(`${BASE_URL}/?ref=${affiliateId}`, 32, 205)

  ctx.fillStyle = "rgba(0,0,0,0.35)"
  ctx.fillRect(32, 230, 200, 36)
  ctx.fillStyle = "#ffffff"
  ctx.font = "bold 16px Inter, sans-serif"
  ctx.fillText("Start Now →", 52, 254)

  return canvas.toDataURL("image/png")
}

type Props = {
  locale?: Locale
}

export default function AffiliateRegister({ locale = DEFAULT_LOCALE }: Props) {
  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [email, setEmail] = useState("")
  const [affiliateId, setAffiliateId] = useState("")
  const [banners, setBanners] = useState<Banner[]>([])
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle")

  const localeLabels = SUPPORTED_LOCALES.map((locale) => ({ locale, label: LOCALE_LABELS[locale] }))

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("loading")
    const res = await fetch("/api/affiliates/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, company, email }),
    })
    if (!res.ok) {
      setStatus("error")
      return
    }
    const data = (await res.json()) as { affiliateId: string }
    const id = data.affiliateId
    setAffiliateId(id)
    const displayName = company || name || "Affiliate"
    const generated = localeLabels
      .map(({ locale, label }) => ({
        locale,
        label,
        dataUrl: generateBanner({ affiliateName: displayName, affiliateId: id, locale }),
      }))
      .filter((banner) => banner.dataUrl)
    setBanners(generated)
    setStatus("ready")
  }

  return (
    <div className="max-w-5xl mx-auto py-16 space-y-10">
      <div className="space-y-3">
        <div className="text-xs uppercase tracking-widest text-cyan-400">{t(locale, "affiliateKicker")}</div>
        <h1 className="text-4xl font-black">{t(locale, "affiliateTitle")}</h1>
        <p className="text-gray-400 text-lg">{t(locale, "affiliateSubtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4 rounded-3xl border border-gray-800 bg-black/40 p-6">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={t(locale, "affiliateNamePlaceholder")}
          className="rounded-2xl border border-gray-700 bg-black/60 px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-cyan-400"
          required
        />
        <input
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          placeholder={t(locale, "affiliateCompanyPlaceholder")}
          className="rounded-2xl border border-gray-700 bg-black/60 px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-cyan-400"
        />
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t(locale, "affiliateEmailPlaceholder")}
          className="rounded-2xl border border-gray-700 bg-black/60 px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-cyan-400"
          required
        />
        <button
          type="submit"
          className="md:col-span-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 font-black text-black hover:opacity-90"
          disabled={status === "loading"}
        >
          {status === "loading" ? t(locale, "affiliateLoading") : t(locale, "affiliateActivateButton")}
        </button>
        {status === "error" && (
          <div className="md:col-span-3 text-sm text-red-300">{t(locale, "affiliateError")}</div>
        )}
      </form>

      {status === "ready" && (
        <div className="space-y-4">
          <div className="rounded-3xl border border-cyan-500/30 bg-cyan-500/10 p-5 text-sm text-cyan-100">
            {t(locale, "affiliateIdLabel")}: <span className="font-bold">{affiliateId}</span> ·{" "}
            {t(locale, "affiliateLinkLabel")}: <span className="font-bold">{BASE_URL}/?ref={affiliateId}</span>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {banners.map((banner) => (
              <div key={banner.locale} className="rounded-3xl border border-gray-800 bg-black/40 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{banner.label}</span>
                  <a
                    href={banner.dataUrl}
                    download={`clawguru-banner-${banner.locale}.png`}
                    className="text-cyan-300 underline"
                  >
                    Download
                  </a>
                </div>
                <Image
                  src={banner.dataUrl}
                  alt={`Banner ${banner.label}`}
                  width={BANNER_WIDTH}
                  height={BANNER_HEIGHT}
                  unoptimized
                  className="rounded-2xl border border-gray-800"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
