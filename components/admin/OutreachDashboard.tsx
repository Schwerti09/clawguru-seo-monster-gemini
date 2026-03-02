"use client"

import { useMemo, useState } from "react"
import { BarChart3, CheckCircle2, Copy, Rocket, Users } from "lucide-react"

const BASE_PARTNER_LINK =
  process.env.NEXT_PUBLIC_AFFILIATE_PROGRAM_URL || "https://clawguru.org/partner-dashboard"

const CHANNEL_TEMPLATES = [
  {
    id: "tiktok",
    label: "TikTok / DM",
    tone: "Kurz & direkt",
    body:
      "Hey {name}, ich hab ein System gebaut, das 100k SEO-Seiten für CVEs kontrolliert. Ich will dir 40% Provision geben, weil dein Publikum genau diesen Schutz braucht. Hier ist dein fertiges Partner-Dashboard: {link}",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    tone: "Business & klar",
    body:
      "Hallo {name}, ich habe ein System gebaut, das 100k SEO-Seiten für CVEs kontrolliert. Ich möchte dir 40% Provision anbieten, weil dein Publikum genau diesen Schutz braucht. Hier ist dein fertiges Partner-Dashboard: {link}",
  },
  {
    id: "email",
    label: "Email",
    tone: "Formal mit Betreff",
    subject: "40% Partner-Provision für CVE-Schutz",
    body:
      "Hallo {name},\n\nich hab ein System gebaut, das 100k SEO-Seiten für CVEs kontrolliert. Ich will dir 40% Provision geben, weil dein Publikum genau diesen Schutz braucht. Hier ist dein fertiges Partner-Dashboard: {link}\n\nWenn du willst, stelle ich dir sofort die Assets bereit.",
  },
]

const LANGUAGE_SCRIPTS = [
  {
    locale: "de",
    label: "Deutsch",
    script:
      "Hey {name}, ich hab ein System gebaut, das 100k SEO-Seiten für CVEs kontrolliert. Ich will dir 40% Provision geben, weil dein Publikum genau diesen Schutz braucht. Hier ist dein fertiges Partner-Dashboard: {link}",
  },
  {
    locale: "en",
    label: "English",
    script:
      "Hi {name}, I built a system that monitors 100k SEO pages for CVEs. I want to give you 40% commission because your audience needs this protection. Here is your ready partner dashboard: {link}",
  },
  {
    locale: "es",
    label: "Español",
    script:
      "Hola {name}, construí un sistema que monitoriza 100k páginas SEO para CVEs. Quiero darte un 40% de comisión porque tu audiencia necesita esta protección. Aquí tienes tu panel de socios listo: {link}",
  },
  {
    locale: "fr",
    label: "Français",
    script:
      "Bonjour {name}, j'ai construit un système qui surveille 100k pages SEO pour les CVE. Je veux te donner 40 % de commission parce que ton audience a besoin de cette protection. Voici ton tableau de bord partenaire prêt : {link}",
  },
  {
    locale: "pt",
    label: "Português",
    script:
      "Olá {name}, construí um sistema que monitora 100k páginas SEO para CVEs. Quero te dar 40% de comissão porque seu público precisa dessa proteção. Aqui está seu painel de parceiro pronto: {link}",
  },
  {
    locale: "it",
    label: "Italiano",
    script:
      "Ciao {name}, ho costruito un sistema che monitora 100k pagine SEO per le CVE. Voglio darti il 40% di commissione perché il tuo pubblico ha bisogno di questa protezione. Ecco la tua dashboard partner pronta: {link}",
  },
  {
    locale: "ru",
    label: "Русский",
    script:
      "Здравствуйте, {name}. Я построил систему, которая контролирует 100k SEO-страниц на CVE. Хочу дать вам 40% комиссии, потому что вашей аудитории нужна такая защита. Вот готовая партнёрская панель: {link}",
  },
  {
    locale: "zh",
    label: "中文",
    script:
      "您好 {name}，我搭建了一个系统，可监控 100k 个 SEO 页面中的 CVE。因为您的受众正需要这种防护，我愿意提供 40% 的佣金。这里是您已准备好的合作伙伴仪表板：{link}",
  },
  {
    locale: "ja",
    label: "日本語",
    script:
      "{name}様、こんにちは。CVE を監視する 100k 件の SEO ページ向けシステムを構築しました。貴社のオーディエンスに最適な防御だと考えており、40% の成果報酬をご提案します。こちらが完成済みのパートナーダッシュボードです: {link}",
  },
  {
    locale: "ar",
    label: "العربية",
    script:
      "مرحبًا {name}، لقد بنيت نظامًا يراقب 100k صفحة SEO بحثًا عن ثغرات CVE. أريد أن أمنحك عمولة بنسبة 40% لأن جمهورك يحتاج إلى هذه الحماية. هذه هي لوحة الشركاء الجاهزة لك: {link}",
  },
]

const CHANNEL_PERFORMANCE = [
  { id: "tiktok", label: "TikTok / DM", value: 64 },
  { id: "twitter", label: "Twitter / X", value: 41 },
  { id: "linkedin", label: "LinkedIn", value: 58 },
]

function buildPartnerLink(source: string) {
  const url = new URL(BASE_PARTNER_LINK, "https://clawguru.org")
  url.searchParams.set("utm_source", source)
  url.searchParams.set("utm_medium", "outreach")
  url.searchParams.set("utm_campaign", "invasion_2026")
  return url.toString()
}

function fillTemplate(template: string, name: string, link: string) {
  return template.replaceAll("{name}", name).replaceAll("{link}", link)
}

function CopyButton({
  text,
  label,
  isCopied,
  onCopy,
}: {
  text: string
  label: string
  isCopied: boolean
  onCopy: (text: string) => void
}) {
  return (
    <button
      onClick={() => onCopy(text)}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-700 hover:border-gray-500 text-xs font-bold text-gray-200 transition-colors"
    >
      {isCopied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
      {isCopied ? "Kopiert" : label}
    </button>
  )
}

export default function OutreachDashboard() {
  const [contactName, setContactName] = useState("")
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const displayName = contactName.trim() || "dein Name"

  const channelLinks = useMemo(() => {
    return Object.fromEntries(
      CHANNEL_TEMPLATES.map((channel) => [channel.id, buildPartnerLink(channel.id)])
    )
  }, [])

  const languageLinks = useMemo(() => {
    return Object.fromEntries(
      LANGUAGE_SCRIPTS.map((lang) => [lang.locale, buildPartnerLink(lang.locale)])
    )
  }, [])

  const maxPerformance = Math.max(...CHANNEL_PERFORMANCE.map((item) => item.value))

  async function handleCopy(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey((prev) => (prev === key ? null : prev)), 2000)
    } catch {
      setCopiedKey(key)
      setTimeout(() => setCopiedKey((prev) => (prev === key ? null : prev)), 2000)
    }
  }

  return (
    <div className="space-y-8 text-white">
      <section className="p-6 rounded-3xl border border-brand-cyan/30 bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-cyan-200">Influencer-Bribe System</div>
            <h2 className="text-3xl font-black">Outreach Invasion Control</h2>
            <p className="text-sm text-gray-300 mt-2">
              Ein Klick genügt: Partner-Assets, Links und Copy sind ready.
            </p>
          </div>
          <a
            href={BASE_PARTNER_LINK}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-black bg-gradient-to-r from-brand-cyan to-brand-violet hover:opacity-90"
          >
            <Rocket className="w-4 h-4" />
            Partner-Dashboard öffnen
          </a>
        </div>
        <div className="mt-5 grid md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-widest text-gray-400">Influencer-Name</span>
            <input
              value={contactName}
              onChange={(event) => setContactName(event.target.value)}
              placeholder="z.B. Yuki Tanaka"
              className="w-full px-4 py-3 rounded-2xl border border-gray-700 bg-black/40 text-sm text-gray-100 focus:outline-none focus:border-brand-cyan"
            />
          </label>
          <div className="p-4 rounded-2xl border border-white/10 bg-black/40 text-sm text-gray-200">
            40% Commission. Fertige Assets. Multi-Language Outbound.
            <div className="mt-2 text-xs text-green-300 font-bold">INVASION READY</div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400">
          <Users className="w-3.5 h-3.5" />
          Influencer-Bribe Templates
        </div>
        <div className="grid lg:grid-cols-3 gap-4">
          {CHANNEL_TEMPLATES.map((channel) => {
            const link = channelLinks[channel.id]
            const message = fillTemplate(channel.body, displayName, link)
            const subjectLine = channel.subject ? `Betreff: ${channel.subject}` : null
            const fullMessage = subjectLine ? `${subjectLine}\n\n${message}` : message
            return (
              <div key={channel.id} className="p-5 rounded-3xl border border-gray-800 bg-black/30 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-black">{channel.label}</div>
                    <div className="text-xs text-gray-500">{channel.tone}</div>
                  </div>
                  <CopyButton
                    text={fullMessage}
                    label="Copy Template"
                    isCopied={copiedKey === `${channel.id}-template`}
                    onCopy={(text) => handleCopy(`${channel.id}-template`, text)}
                  />
                </div>
                <div className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
                  {subjectLine && <div className="font-bold text-gray-100">{subjectLine}</div>}
                  {subjectLine && <div className="h-3" />}
                  {message}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5 text-xs text-gray-400">
                  <a className="text-cyan-300 underline break-all" href={link} target="_blank" rel="noreferrer">
                    {link}
                  </a>
                  <CopyButton
                    text={link}
                    label="Copy Link"
                    isCopied={copiedKey === `${channel.id}-link`}
                    onCopy={(text) => handleCopy(`${channel.id}-link`, text)}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400">
          <Rocket className="w-3.5 h-3.5" />
          Global-Language-Invasion Scripts
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {LANGUAGE_SCRIPTS.map((lang) => {
            const link = languageLinks[lang.locale]
            const message = fillTemplate(lang.script, displayName, link)
            return (
              <div key={lang.locale} className="p-5 rounded-3xl border border-gray-800 bg-black/30 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-black">{lang.label}</div>
                  <CopyButton
                    text={message}
                    label="Copy"
                    isCopied={copiedKey === `${lang.locale}-script`}
                    onCopy={(text) => handleCopy(`${lang.locale}-script`, text)}
                  />
                </div>
                <div className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">{message}</div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="p-6 rounded-3xl border border-gray-800 bg-black/30 space-y-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400">
          <BarChart3 className="w-3.5 h-3.5" />
          Affiliate-Conversion-Tracker
        </div>
        <div className="text-xl font-black">Welcher Outreach-Kanal bringt die meisten Partner?</div>
        <div className="space-y-4">
          {CHANNEL_PERFORMANCE.map((channel) => (
            <div key={channel.id}>
              <div className="flex items-center justify-between text-sm text-gray-300">
                <span>{channel.label}</span>
                <span className="font-bold text-white">{channel.value}</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-gray-800">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-brand-cyan to-brand-violet"
                  style={{ width: `${Math.round((channel.value / maxPerformance) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-500">
          Fokus: TikTok-Shortform + LinkedIn Authority – beide liefern die höchste Partnerdichte.
        </div>
      </section>

      <section className="p-6 rounded-3xl border border-green-500/30 bg-green-500/10 text-green-200 font-black text-center tracking-widest">
        INVASION COMMENCED. THE ARMY IS GROWING.
      </section>
    </div>
  )
}
