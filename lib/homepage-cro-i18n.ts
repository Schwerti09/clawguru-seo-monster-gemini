import type { Locale } from "@/lib/i18n"

type HomepageCroCopy = {
  heroPrimary: string
  heroSecondary: string
  heroTertiary: string
  finalTitle: string
  finalSub: string
  finalPrimary: string
  finalSecondary: string
  lpHubTitle: string
  lpHubSub: string
  lpOpenclawTitle: string
  lpOpenclawDesc: string
  lpCheckTitle: string
  lpCheckDesc: string
  lpMoltbotTitle: string
  lpMoltbotDesc: string
  lpAiTitle: string
  lpAiDesc: string
}

const EN: HomepageCroCopy = {
  heroPrimary: "Start security check",
  heroSecondary: "Browse runbooks",
  heroTertiary: "Roast my stack",
  finalTitle: "Ready for real security operations?",
  finalSub: "Start now - risk-free. Productive in 5 minutes.",
  finalPrimary: "Start security check",
  finalSecondary: "Open OpenClaw landing page",
  lpHubTitle: "OpenClaw and AI-agent security landing pages",
  lpHubSub: "Go directly to intent-specific pages for checks, hardening, and guided fix paths.",
  lpOpenclawTitle: "OpenClaw",
  lpOpenclawDesc: "Community trust and ops context",
  lpCheckTitle: "OpenClaw Security Check",
  lpCheckDesc: "Fast signal in 30 seconds",
  lpMoltbotTitle: "Moltbot Hardening",
  lpMoltbotDesc: "Gateway, auth, and exposure fixes",
  lpAiTitle: "AI-Agent Security",
  lpAiDesc: "From exposed tooling to measurable controls",
}

const COPY: Partial<Record<Locale, Partial<HomepageCroCopy>>> = {
  de: {
    heroPrimary: "Security Check starten",
    heroSecondary: "Runbooks durchsuchen",
    heroTertiary: "Roast my stack",
    finalTitle: "Bereit für echte Security Operations?",
    finalSub: "Jetzt starten - risikofrei. In 5 Minuten produktiv.",
    finalPrimary: "Security Check starten",
    finalSecondary: "OpenClaw Landingpage öffnen",
    lpHubTitle: "Landingpages für OpenClaw und AI-Agent-Security",
    lpHubSub: "Direkt zu intent-starken Seiten für Checks, Hardening und geführte Fix-Pfade.",
    lpOpenclawTitle: "OpenClaw",
    lpOpenclawDesc: "Community-Trust und Ops-Kontext",
    lpCheckTitle: "OpenClaw Security Check",
    lpCheckDesc: "Schnelles Signal in 30 Sekunden",
    lpMoltbotTitle: "Moltbot Hardening",
    lpMoltbotDesc: "Gateway-, Auth- und Exposition-Fixes",
    lpAiTitle: "AI-Agent Security",
    lpAiDesc: "Von exponierten Tools zu messbaren Controls",
  },
  es: {
    heroPrimary: "Iniciar security check",
    heroSecondary: "Ver runbooks",
    heroTertiary: "Roast my stack",
    finalTitle: "¿Listo para operaciones de seguridad reales?",
    finalSub: "Empieza ahora - sin riesgo. Productivo en 5 minutos.",
    finalPrimary: "Iniciar security check",
    finalSecondary: "Abrir landing de OpenClaw",
    lpHubTitle: "Landings de OpenClaw y seguridad de agentes AI",
    lpHubSub: "Ve directo a páginas por intención: checks, hardening y rutas guiadas de fix.",
  },
  fr: {
    heroPrimary: "Démarrer security check",
    heroSecondary: "Voir runbooks",
    heroTertiary: "Roast my stack",
    finalTitle: "Prêt pour des opérations sécurité réelles ?",
    finalSub: "Démarrez maintenant - sans risque. Productif en 5 minutes.",
    finalPrimary: "Démarrer security check",
    finalSecondary: "Ouvrir la landing OpenClaw",
    lpHubTitle: "Landings OpenClaw et sécurité AI-agent",
    lpHubSub: "Accédez directement aux pages d'intention: checks, hardening et parcours de fix guidés.",
  },
  pt: {
    heroPrimary: "Iniciar security check",
    heroSecondary: "Explorar runbooks",
    heroTertiary: "Roast my stack",
    finalTitle: "Pronto para operações de segurança reais?",
    finalSub: "Comece agora - sem risco. Produtivo em 5 minutos.",
    finalPrimary: "Iniciar security check",
    finalSecondary: "Abrir landing OpenClaw",
    lpHubTitle: "Landings de OpenClaw e segurança de AI-agent",
    lpHubSub: "Acesse páginas por intenção para checks, hardening e trilhas guiadas de fix.",
  },
  it: {
    heroPrimary: "Avvia security check",
    heroSecondary: "Sfoglia runbook",
    heroTertiary: "Roast my stack",
    finalTitle: "Pronto per security operations reali?",
    finalSub: "Inizia ora - senza rischio. Produttivo in 5 minuti.",
    finalPrimary: "Avvia security check",
    finalSecondary: "Apri landing OpenClaw",
    lpHubTitle: "Landing OpenClaw e AI-agent security",
    lpHubSub: "Vai alle pagine per intent: check, hardening e percorsi fix guidati.",
  },
  ru: {
    heroPrimary: "Запустить security check",
    heroSecondary: "Открыть runbooks",
    heroTertiary: "Roast my stack",
    finalTitle: "Готовы к реальным security operations?",
    finalSub: "Начните сейчас - без риска. Продуктивно за 5 минут.",
    finalPrimary: "Запустить security check",
    finalSecondary: "Открыть OpenClaw лендинг",
    lpHubTitle: "Лендинги OpenClaw и AI-agent security",
    lpHubSub: "Переходите сразу на intent-страницы для check, hardening и guided fix-путей.",
  },
  zh: {
    heroPrimary: "开始安全检查",
    heroSecondary: "浏览 Runbooks",
    heroTertiary: "Roast 我的栈",
    finalTitle: "准备好进行真正的安全运营了吗？",
    finalSub: "现在开始 - 零风险。5 分钟进入可执行状态。",
    finalPrimary: "开始安全检查",
    finalSecondary: "打开 OpenClaw 落地页",
    lpHubTitle: "OpenClaw 与 AI Agent 安全落地页",
    lpHubSub: "直接进入按意图构建的页面：检查、加固与引导式修复路径。",
  },
  ja: {
    heroPrimary: "security check を開始",
    heroSecondary: "runbooks を見る",
    heroTertiary: "Roast my stack",
    finalTitle: "実運用の security operations を始めますか？",
    finalSub: "今すぐ開始 - リスクなし。5分で実行可能。",
    finalPrimary: "security check を開始",
    finalSecondary: "OpenClaw ランディングを開く",
    lpHubTitle: "OpenClaw と AI-agent security のランディング",
    lpHubSub: "check、hardening、guided fix に直結する intent 別ページへ。",
  },
  ar: {
    heroPrimary: "بدء security check",
    heroSecondary: "تصفح runbooks",
    heroTertiary: "Roast my stack",
    finalTitle: "جاهز لعمليات أمن حقيقية؟",
    finalSub: "ابدأ الآن - بلا مخاطرة. إنتاجي خلال 5 دقائق.",
    finalPrimary: "بدء security check",
    finalSecondary: "فتح صفحة OpenClaw",
    lpHubTitle: "صفحات OpenClaw وأمن AI-agent",
    lpHubSub: "اذهب مباشرة إلى صفحات النية: checks وhardening ومسارات fix موجهة.",
  },
  nl: {
    heroPrimary: "Start security check",
    heroSecondary: "Bekijk runbooks",
    heroTertiary: "Roast my stack",
    finalTitle: "Klaar voor echte security operations?",
    finalSub: "Start nu - zonder risico. In 5 minuten productief.",
    finalPrimary: "Start security check",
    finalSecondary: "Open OpenClaw-landing",
    lpHubTitle: "OpenClaw- en AI-agent-security-landingspagina's",
    lpHubSub: "Ga direct naar intent-pagina's voor checks, hardening en guided fix-paden.",
  },
  hi: {
    heroPrimary: "security check शुरू करें",
    heroSecondary: "runbooks देखें",
    heroTertiary: "Roast my stack",
    finalTitle: "क्या आप वास्तविक security operations के लिए तैयार हैं?",
    finalSub: "अभी शुरू करें - बिना जोखिम। 5 मिनट में प्रोडक्टिव।",
    finalPrimary: "security check शुरू करें",
    finalSecondary: "OpenClaw landing page खोलें",
    lpHubTitle: "OpenClaw और AI-agent security landing pages",
    lpHubSub: "check, hardening और guided fix paths के लिए intent-specific pages पर सीधे जाएं।",
  },
  tr: {
    heroPrimary: "security check başlat",
    heroSecondary: "runbooks görüntüle",
    heroTertiary: "Roast my stack",
    finalTitle: "Gerçek security operations için hazır mısın?",
    finalSub: "Hemen başla - risksiz. 5 dakikada üretken.",
    finalPrimary: "security check başlat",
    finalSecondary: "OpenClaw landing sayfasını aç",
    lpHubTitle: "OpenClaw ve AI-agent security landing sayfaları",
    lpHubSub: "check, hardening ve guided fix yolları için intent sayfalarına doğrudan git.",
  },
  pl: {
    heroPrimary: "Uruchom security check",
    heroSecondary: "Przeglądaj runbooks",
    heroTertiary: "Roast my stack",
    finalTitle: "Gotowy na prawdziwe security operations?",
    finalSub: "Zacznij teraz - bez ryzyka. Produktywnie w 5 minut.",
    finalPrimary: "Uruchom security check",
    finalSecondary: "Otwórz landing OpenClaw",
    lpHubTitle: "Landingi OpenClaw i AI-agent security",
    lpHubSub: "Przejdź bezpośrednio do stron intent dla checks, hardening i guided fix paths.",
  },
  ko: {
    heroPrimary: "security check 시작",
    heroSecondary: "runbooks 보기",
    heroTertiary: "Roast my stack",
    finalTitle: "실전 security operations를 시작할 준비가 되었나요?",
    finalSub: "지금 시작하세요 - 무위험. 5분 안에 실행 가능.",
    finalPrimary: "security check 시작",
    finalSecondary: "OpenClaw 랜딩 열기",
    lpHubTitle: "OpenClaw 및 AI-agent security 랜딩 페이지",
    lpHubSub: "check, hardening, guided fix 경로를 위한 intent 페이지로 바로 이동하세요.",
  },
}

export function getHomepageCroCopy(locale: Locale): HomepageCroCopy {
  return { ...EN, ...(COPY[locale] ?? {}) }
}
