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

  const script = `(function(){
var script=document.currentScript;
var dataLang=(script&&script.getAttribute("data-lang"))||"";
var lang=(dataLang||navigator.language||"${DEFAULT_LOCALE}").toLowerCase().slice(0,2);
var translations=${JSON.stringify(translations)};
var locale=translations[lang]?lang:"${DEFAULT_LOCALE}";
var copy=translations[locale];
var slug=(script&&script.getAttribute("data-slug"))||"security-check";
var base=(script&&script.getAttribute("data-base"))||"https://clawguru.org";
var target=base.replace(/\\/$/,"")+"/fix/"+encodeURIComponent(slug);
var container=document.createElement("div");
container.style.position="fixed";
container.style.bottom="24px";
container.style.right="24px";
container.style.zIndex="2147483647";
container.style.fontFamily="Inter,system-ui,sans-serif";
var card=document.createElement("div");
card.style.background="rgba(6,10,18,0.95)";
card.style.border="1px solid rgba(0,184,255,0.3)";
card.style.boxShadow="0 10px 40px rgba(0,0,0,0.35)";
card.style.borderRadius="16px";
card.style.padding="16px 18px";
card.style.maxWidth="260px";
card.style.color="#e5e7eb";
var kicker=document.createElement("div");
kicker.textContent=copy.title;
kicker.style.fontSize="11px";
kicker.style.letterSpacing="0.15em";
kicker.style.textTransform="uppercase";
kicker.style.color="#00b8ff";
kicker.style.marginBottom="6px";
var heading=document.createElement("div");
heading.textContent="Quick Fix";
heading.style.fontWeight="800";
heading.style.fontSize="14px";
heading.style.marginBottom="6px";
var subtitle=document.createElement("div");
subtitle.textContent=copy.subtitle;
subtitle.style.fontSize="12px";
subtitle.style.color="#9ca3af";
subtitle.style.marginBottom="12px";
var cta=document.createElement("a");
cta.href=target;
cta.target="_blank";
cta.rel="noopener noreferrer";
cta.textContent=copy.cta;
cta.style.display="inline-block";
cta.style.padding="8px 12px";
cta.style.borderRadius="12px";
cta.style.background="linear-gradient(135deg,#00b8ff,#0077ff)";
cta.style.color="#021019";
cta.style.fontWeight="800";
cta.style.fontSize="12px";
cta.style.textDecoration="none";
card.appendChild(kicker);
card.appendChild(heading);
card.appendChild(subtitle);
card.appendChild(cta);
container.appendChild(card);
document.body.appendChild(container);
})();`

  return new NextResponse(script, {
    headers: { "content-type": "application/javascript; charset=utf-8" },
  })
}
