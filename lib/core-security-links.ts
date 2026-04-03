import { linkFor, type Locale } from "@/lib/i18n"

export function getCoreSecurityLinks(locale: Locale) {
  return {
    check: linkFor(locale, "/check"),
    methodology: linkFor(locale, "/methodik"),
    openclaw: linkFor(locale, "/openclaw"),
    openclawSecurityCheck: linkFor(locale, "/openclaw-security-check"),
    moltbotHardening: linkFor(locale, "/moltbot-hardening"),
    aiAgentSecurity: linkFor(locale, "/ai-agent-security"),
    roastMyMoltbot: linkFor(locale, "/roast-my-moltbot"),
    runbooksSecurity: linkFor(locale, "/runbooks/security"),
  }
}
