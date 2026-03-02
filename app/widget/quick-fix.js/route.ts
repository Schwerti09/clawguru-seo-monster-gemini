import { NextResponse } from "next/server"
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, UI_STRINGS } from "@/lib/i18n"

export const runtime = "edge"
export const dynamic = "force-dynamic"

export async function GET() {
  const translations = Object.fromEntries(
    SUPPORTED_LOCALES.map((locale) => [
      locale,
      {
        title: UI_STRINGS[locale]?.quickFixWidgetTitle ?? UI_STRINGS[DEFAULT_LOCALE].quickFixWidgetTitle,
        subtitle: UI_STRINGS[locale]?.quickFixWidgetSubtitle ?? UI_STRINGS[DEFAULT_LOCALE].quickFixWidgetSubtitle,
        cta: UI_STRINGS[locale]?.quickFixWidgetCta ?? UI_STRINGS[DEFAULT_LOCALE].quickFixWidgetCta,
      },
    ])
  )

  const script = `(function(){var script=document.currentScript;var dataLang=(script&&script.getAttribute("data-lang"))||"";var lang=(dataLang||navigator.language||"${DEFAULT_LOCALE}").toLowerCase().slice(0,2);var translations=${JSON.stringify(
    translations
  )};var locale=translations[lang]?lang:"${DEFAULT_LOCALE}";var copy=translations[locale];var slug=(script&&script.getAttribute("data-slug"))||"security-check";var base=(script&&script.getAttribute("data-base"))||"https://clawguru.org";var target=base.replace(/\\/$/,"")+"/fix/"+encodeURIComponent(slug);var container=document.createElement("div");container.style.position="fixed";container.style.bottom="24px";container.style.right="24px";container.style.zIndex="2147483647";container.style.fontFamily="Inter,system-ui,sans-serif";container.innerHTML='<div style="background:rgba(6,10,18,0.95);border:1px solid rgba(0,184,255,0.3);box-shadow:0 10px 40px rgba(0,0,0,0.35);border-radius:16px;padding:16px 18px;max-width:260px;color:#e5e7eb"><div style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#00b8ff;margin-bottom:6px">'+copy.title+'</div><div style="font-weight:800;font-size:14px;margin-bottom:6px">Quick Fix</div><div style="font-size:12px;color:#9ca3af;margin-bottom:12px">'+copy.subtitle+'</div><a href="'+target+'" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:8px 12px;border-radius:12px;background:linear-gradient(135deg,#00b8ff,#0077ff);color:#021019;font-weight:800;font-size:12px;text-decoration:none">'+copy.cta+'</a></div>';document.body.appendChild(container);})();`

  return new NextResponse(script, {
    headers: { "content-type": "application/javascript; charset=utf-8" },
  })
}
