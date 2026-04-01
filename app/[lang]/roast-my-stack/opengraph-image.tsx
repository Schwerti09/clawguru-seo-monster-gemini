import { ImageResponse } from "next/og"

import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"

export const runtime = "edge"

export const alt = "Roast My Stack — ClawGuru"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

/** Short sublines per locale for the OG artwork (English fallback for the rest). */
const SUB: Partial<Record<Locale, string>> = {
  de: "Sarkasmus + echte Security-Insights",
  en: "Savage wit + real SecOps depth",
  es: "Humor + seguridad real",
  fr: "Humour + vraie profondeur sécu",
  pt: "Humor + insights reais de segurança",
  it: "Ironia + insight di sicurezza reali",
  nl: "Humor + echte security-inzichten",
  pl: "Humor + realne insighty bezpieczeństwa",
  ru: "Юмор + реальная безопасность",
  tr: "Espri + gerçek güvenlik içgörüsü",
  ar: "روست ممتع + رؤى أمنية حقيقية",
  hi: "मज़ाक + असली सिक्योरिटी इनसाइट",
  ja: "ユーモア × 本物のセキュリティ洞察",
  ko: "유머 + 실전 보안 인사이트",
  zh: "毒舌 + 真实安全洞察",
}

export default function Image({ params }: { params: { lang: string } }) {
  const loc = SUPPORTED_LOCALES.includes(params.lang as Locale) ? (params.lang as Locale) : "en"
  const sub = SUB[loc] ?? SUB.en ?? "Savage wit + real SecOps depth"

  return new ImageResponse(
    (
      <div
        style={{
          width: size.width,
          height: size.height,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: "linear-gradient(145deg, #050508 0%, #0c0a06 45%, #050a0c 100%)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 80% 20%, rgba(34,211,238,0.15) 0%, transparent 45%), radial-gradient(circle at 15% 85%, rgba(234,179,8,0.18) 0%, transparent 40%)",
          }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "0.35em",
              color: "rgba(34,211,238,0.95)",
              textTransform: "uppercase",
            }}
          >
            CLAWGURU
          </div>
          <div
            style={{
              fontSize: 76,
              fontWeight: 900,
              lineHeight: 1.05,
              color: "#eab308",
            }}
          >
            Roast My Stack
          </div>
          <div style={{ fontSize: 34, color: "rgba(228,228,231,0.92)", maxWidth: 900, lineHeight: 1.35 }}>{sub}</div>
          <div style={{ marginTop: 24, fontSize: 24, color: "rgba(161,161,170,0.95)" }}>clawguru.org · Free AI roast · Runbooks</div>
        </div>
      </div>
    ),
    { ...size }
  )
}
