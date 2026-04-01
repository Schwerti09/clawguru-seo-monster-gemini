/**
 * Merges homepage preview/check/transparency keys + vorstellung.guidedTour
 * into all locale dictionaries (except en/de). German _de strings come from de.json.
 * Run: node scripts/merge-homepage-tour-i18n.js
 */
const fs = require("fs")
const path = require("path")

const ROOT = path.resolve(__dirname, "..")
const DICT = path.join(ROOT, "dictionaries")

const de = JSON.parse(fs.readFileSync(path.join(DICT, "de.json"), "utf8"))
const en = JSON.parse(fs.readFileSync(path.join(DICT, "en.json"), "utf8"))

const GERMAN_KEYS = [
  "check_title_de",
  "check_sub_de_prefix",
  "check_sub_de_suffix",
  "check_target_label_de",
  "check_risk_high_de",
  "check_risk_ok_de",
  "check_target_chip_de",
  "check_ask_guru_de",
  "check_footer_privacy_de",
  "check_footer_heuristic_de",
  "check_footer_validate_de",
  "transparency_sub_de",
  "transparency_card1_title_de",
  "transparency_card1_desc_de",
  "transparency_card2_title_de",
  "transparency_card2_desc_de",
  "transparency_card3_title_de",
  "transparency_card3_desc_de",
]

function pickGerman() {
  const h = de.homepage
  const o = {}
  for (const k of GERMAN_KEYS) o[k] = h[k]
  return o
}

const STEPS_EN = en.vorstellung.guidedTour.steps

/** @param {string} locale */
function guidedTour(locale, L) {
  const steps = STEPS_EN.map((s, i) => ({
    id: s.id,
    targetId: s.targetId,
    title: L.stepTitle[i],
    value: L.stepValue[i],
    hint: L.stepHint[i] || undefined,
  }))
  return { labels: L.labels, steps }
}

const PACK = {
  es: {
    home: {
      live_preview_kicker: "LIVE",
      live_preview_title: "Vista previa Intel",
      live_preview_empty: "No se encontraron incidentes.",
      live_stats_checks: "Comprobaciones hoy",
      live_stats_critical: "CVE críticos",
      live_stats_duration: "duración media",
      check_title_en: "Security Check LIVE (heurística) — 30 segundos",
      check_sub_en_prefix: "Introduce IP/dominio/URL del bot. Obtienes una",
      check_sub_en_suffix: "+ próximos pasos claros.",
      check_score_label: "Claw Security Score",
      check_target_label_en: "Objetivo (visible públicamente): IP, dominio o URL",
      check_risk_high_en: "RIESGO ALTO",
      check_risk_ok_en: "BASE OK",
      check_target_chip_en: "Objetivo",
      check_ask_guru_en: "Pregunta al Guru",
      check_footer_privacy_en: "sin almacenar objetivos",
      check_footer_heuristic_en: "la puntuación es heurística",
      check_footer_validate_en: "Para conclusiones reales: revisa config y registros",
      transparency_sub_en:
        "ClawGuru es gratuito. Algunas recomendaciones son enlaces de afiliados. Curamos según valor operativo real.",
      transparency_card1_title_en: "1) Ingresos por afiliados",
      transparency_card1_desc_en: "Hosting y herramientas de seguridad",
      transparency_card2_title_en: "2) Ops gestionado",
      transparency_card2_desc_en: "Hardening, monitorización, mantenimiento",
      transparency_card3_title_en: "3) Investigación e informes",
      transparency_card3_desc_en: "Informes de situación condensados",
    },
    tour: guidedTour("es", {
      labels: {
        close: "Cerrar tour",
        back: "Atrás",
        next: "Siguiente",
        finish: "Listo",
        skip: "Omitir",
      },
      stepTitle: [
        "Bienvenido a ClawGuru",
        "Funciones principales en vivo",
        "Copiloto de IA para incidentes reales",
        "Confianza con señales transparentes",
        "Empieza ya",
      ],
      stepValue: [
        "En menos de un minuto verás cómo detectar riesgos antes y pasar de insights a acción.",
        "Mira los módulos clave en acción y entiende al instante dónde ahorras tiempo cada día.",
        "Describe tu escenario de incidente y obtén pasos ejecutables, no consejos genéricos.",
        "Métricas y referencias muestran por qué los equipos usan ClawGuru en producción.",
        "Activa con Day Pass o prueba el flujo de check para ver valor en minutos.",
      ],
      stepHint: ["Aquí empieza tu recorrido rápido por el producto.", "", "", "", ""],
    }),
  },
  fr: {
    home: {
      live_preview_kicker: "LIVE",
      live_preview_title: "Aperçu Intel",
      live_preview_empty: "Aucun incident trouvé.",
      live_stats_checks: "Contrôles aujourd'hui",
      live_stats_critical: "CVE critiques",
      live_stats_duration: "durée moy.",
      check_title_en: "Contrôle sécurité LIVE (heuristique) — 30 secondes",
      check_sub_en_prefix: "Saisissez IP/domaine/URL du bot. Vous obtenez un",
      check_sub_en_suffix: "+ prochaines étapes claires.",
      check_score_label: "Claw Security Score",
      check_target_label_en: "Cible (visible publiquement) : IP, domaine ou URL",
      check_risk_high_en: "RISQUE ÉLEVÉ",
      check_risk_ok_en: "BASE OK",
      check_target_chip_en: "Cible",
      check_ask_guru_en: "Demander au Guru",
      check_footer_privacy_en: "pas de stockage des cibles",
      check_footer_heuristic_en: "le score est heuristique",
      check_footer_validate_en: "Pour des conclusions réelles : vérifiez config et journaux",
      transparency_sub_en:
        "ClawGuru est gratuit. Certaines recommandations sont des liens d'affiliation. Nous sélectionnons selon la valeur opérationnelle réelle.",
      transparency_card1_title_en: "1) Revenus d'affiliation",
      transparency_card1_desc_en: "Hébergement et outils de sécurité",
      transparency_card2_title_en: "2) Ops managées",
      transparency_card2_desc_en: "Durcissement, supervision, maintenance",
      transparency_card3_title_en: "3) Recherche et rapports",
      transparency_card3_desc_en: "Rapports de situation condensés",
    },
    tour: guidedTour("fr", {
      labels: {
        close: "Fermer la visite",
        back: "Retour",
        next: "Suivant",
        finish: "Terminé",
        skip: "Passer",
      },
      stepTitle: [
        "Bienvenue sur ClawGuru",
        "Fonctions clés en direct",
        "Copilote IA pour incidents concrets",
        "Confiance par des signaux transparents",
        "Démarrer tout de suite",
      ],
      stepValue: [
        "En moins d'une minute : détecter le risque plus tôt et passer de l'insight à l'action.",
        "Voyez les modules en action et comprenez immédiatement où vous gagnez du temps.",
        "Décrivez votre incident et obtenez des étapes exécutables, pas des généralités.",
        "Métriques et références montrent pourquoi les équipes utilisent ClawGuru en prod.",
        "Lancez-vous avec le Day Pass ou le flux de contrôle pour de la valeur en minutes.",
      ],
      stepHint: ["Voici votre visite produit rapide.", "", "", "", ""],
    }),
  },
  pt: {
    home: {
      live_preview_kicker: "LIVE",
      live_preview_title: "Pré-visualização Intel",
      live_preview_empty: "Nenhum incidente encontrado.",
      live_stats_checks: "Verificações hoje",
      live_stats_critical: "CVEs críticos",
      live_stats_duration: "duração média",
      check_title_en: "Verificação de segurança LIVE (heurística) — 30 segundos",
      check_sub_en_prefix: "Introduza IP/domínio/URL do bot. Recebe um",
      check_sub_en_suffix: "+ próximos passos claros.",
      check_score_label: "Claw Security Score",
      check_target_label_en: "Alvo (visível publicamente): IP, domínio ou URL",
      check_risk_high_en: "RISCO ALTO",
      check_risk_ok_en: "BASE OK",
      check_target_chip_en: "Alvo",
      check_ask_guru_en: "Pergunte ao Guru",
      check_footer_privacy_en: "sem armazenar alvos",
      check_footer_heuristic_en: "a pontuação é heurística",
      check_footer_validate_en: "Para conclusões reais: verifique config e logs",
      transparency_sub_en:
        "ClawGuru é gratuito. Algumas recomendações são links de afiliados. Curamos pelo valor operacional real.",
      transparency_card1_title_en: "1) Receita de afiliados",
      transparency_card1_desc_en: "Hosting e ferramentas de segurança",
      transparency_card2_title_en: "2) Ops gerenciadas",
      transparency_card2_desc_en: "Hardening, monitorização, manutenção",
      transparency_card3_title_en: "3) Pesquisa e relatórios",
      transparency_card3_desc_en: "Relatórios de situação condensados",
    },
    tour: guidedTour("pt", {
      labels: {
        close: "Fechar tour",
        back: "Voltar",
        next: "Seguinte",
        finish: "Concluir",
        skip: "Ignorar",
      },
      stepTitle: [
        "Bem-vindo ao ClawGuru",
        "Funções principais ao vivo",
        "Copiloto de IA para incidentes reais",
        "Confiança com sinais transparentes",
        "Comece já",
      ],
      stepValue: [
        "Em menos de um minuto: detetar risco mais cedo e passar de insights à ação.",
        "Veja os módulos em ação e perceba onde poupa tempo no dia a dia.",
        "Descreva o incidente e obtenha passos executáveis, não conselhos genéricos.",
        "Métricas e referências mostram porque as equipas usam ClawGuru em produção.",
        "Arranque com Day Pass ou o fluxo de verificação para valor em minutos.",
      ],
      stepHint: ["Começa aqui a sua visita rápida ao produto.", "", "", "", ""],
    }),
  },
  it: {
    home: {
      live_preview_kicker: "LIVE",
      live_preview_title: "Anteprima Intel",
      live_preview_empty: "Nessun incidente trovato.",
      live_stats_checks: "Controlli oggi",
      live_stats_critical: "CVE critici",
      live_stats_duration: "durata media",
      check_title_en: "Security check LIVE (euristica) — 30 secondi",
      check_sub_en_prefix: "Inserisci IP/dominio/URL del bot. Ottieni un",
      check_sub_en_suffix: "+ prossimi passi chiari.",
      check_score_label: "Claw Security Score",
      check_target_label_en: "Target (visibile pubblicamente): IP, dominio o URL",
      check_risk_high_en: "RISCHIO ALTO",
      check_risk_ok_en: "BASE OK",
      check_target_chip_en: "Target",
      check_ask_guru_en: "Chiedi al Guru",
      check_footer_privacy_en: "nessun salvataggio dei target",
      check_footer_heuristic_en: "il punteggio è euristico",
      check_footer_validate_en: "Per conclusioni reali: verifica config e log",
      transparency_sub_en:
        "ClawGuru è gratuito. Alcune raccomandazioni sono link di affiliazione. Selezioniamo in base al valore operativo reale.",
      transparency_card1_title_en: "1) Ricavi da affiliazione",
      transparency_card1_desc_en: "Hosting e strumenti di sicurezza",
      transparency_card2_title_en: "2) Ops gestite",
      transparency_card2_desc_en: "Hardening, monitoraggio, manutenzione",
      transparency_card3_title_en: "3) Ricerca e report",
      transparency_card3_desc_en: "Report di situazione condensati",
    },
    tour: guidedTour("it", {
      labels: {
        close: "Chiudi tour",
        back: "Indietro",
        next: "Avanti",
        finish: "Fatto",
        skip: "Salta",
      },
      stepTitle: [
        "Benvenuto in ClawGuru",
        "Funzioni principali dal vivo",
        "Copilot IA per incidenti concreti",
        "Fiducia con segnali trasparenti",
        "Inizia subito",
      ],
      stepValue: [
        "In meno di un minuto: rilevare il rischio prima e passare dagli insight all'azione.",
        "Guarda i moduli in azione e capisci subito dove risparmi tempo.",
        "Descrivi lo scenario d'incidente e ottieni passi eseguibili, non consigli generici.",
        "Metriche e riferimenti mostrano perché i team usano ClawGuru in produzione.",
        "Parti con Day Pass o il flusso di check per valore in pochi minuti.",
      ],
      stepHint: ["Inizia qui la visita rapida al prodotto.", "", "", "", ""],
    }),
  },
  nl: {
    home: {
      live_preview_kicker: "LIVE",
      live_preview_title: "Intel-voorbeeld",
      live_preview_empty: "Geen incidenten gevonden.",
      live_stats_checks: "Checks vandaag",
      live_stats_critical: "kritieke CVE's",
      live_stats_duration: "gem. duur",
      check_title_en: "LIVE security check (heuristiek) — 30 seconden",
      check_sub_en_prefix: "Voer IP/domein/bot-URL in. Je krijgt een",
      check_sub_en_suffix: "+ duidelijke vervolgstappen.",
      check_score_label: "Claw Security Score",
      check_target_label_en: "Doel (openbaar zichtbaar): IP, domein of URL",
      check_risk_high_en: "HOGER RISICO",
      check_risk_ok_en: "BASIS OK",
      check_target_chip_en: "Doel",
      check_ask_guru_en: "Vraag de Guru",
      check_footer_privacy_en: "geen opslag van doelen",
      check_footer_heuristic_en: "score is heuristisch",
      check_footer_validate_en: "Voor echte conclusies: controleer config en logs",
      transparency_sub_en:
        "ClawGuru is gratis. Sommige aanbevelingen zijn affiliate-links. We cureren op echte operationele waarde.",
      transparency_card1_title_en: "1) Affiliate-inkomsten",
      transparency_card1_desc_en: "Hosting en security-tools",
      transparency_card2_title_en: "2) Beheerde ops",
      transparency_card2_desc_en: "Hardening, monitoring, onderhoud",
      transparency_card3_title_en: "3) Onderzoek en rapporten",
      transparency_card3_desc_en: "Verdichte situatierapporten",
    },
    tour: guidedTour("nl", {
      labels: {
        close: "Tour sluiten",
        back: "Terug",
        next: "Volgende",
        finish: "Klaar",
        skip: "Overslaan",
      },
      stepTitle: [
        "Welkom bij ClawGuru",
        "Kernfuncties live",
        "AI-copilot voor echte incidenten",
        "Vertrouwen door transparante signalen",
        "Direct beginnen",
      ],
      stepValue: [
        "Binnen een minuut: risico eerder zien en van inzicht naar actie gaan.",
        "Bekijk de belangrijkste modules live en zie waar je tijd wint.",
        "Beschrijf je incident en krijg uitvoerbare stappen, geen generiek advies.",
        "Metrics en referenties tonen waarom teams ClawGuru in productie gebruiken.",
        "Start met Day Pass of de check-flow voor waarde binnen minuten.",
      ],
      stepHint: ["Hier start je snelle productrondleiding.", "", "", "", ""],
    }),
  },
  pl: {
    home: {
      live_preview_kicker: "LIVE",
      live_preview_title: "Podgląd Intel",
      live_preview_empty: "Nie znaleziono incydentów.",
      live_stats_checks: "Sprawdzenia dziś",
      live_stats_critical: "krytyczne CVE",
      live_stats_duration: "śr. czas",
      check_title_en: "LIVE Security Check (heurystyka) — 30 sekund",
      check_sub_en_prefix: "Podaj IP/domenę/URL bota. Otrzymujesz",
      check_sub_en_suffix: "+ jasne kolejne kroki.",
      check_score_label: "Claw Security Score",
      check_target_label_en: "Cel (publicznie widoczny): IP, domena lub URL",
      check_risk_high_en: "WYŻSZE RYZYKO",
      check_risk_ok_en: "BAZA OK",
      check_target_chip_en: "Cel",
      check_ask_guru_en: "Zapytaj Guru",
      check_footer_privacy_en: "brak zapisu celów",
      check_footer_heuristic_en: "wynik jest heurystyczny",
      check_footer_validate_en: "Aby wyciągnąć wnioski: sprawdź config i logi",
      transparency_sub_en:
        "ClawGuru jest darmowy. Część rekomendacji to linki afiliacyjne. Dobieramy według realnej wartości operacyjnej.",
      transparency_card1_title_en: "1) Przychody z afiliacji",
      transparency_card1_desc_en: "Hosting i narzędzia bezpieczeństwa",
      transparency_card2_title_en: "2) Zarządzane ops",
      transparency_card2_desc_en: "Hardening, monitoring, utrzymanie",
      transparency_card3_title_en: "3) Badania i raporty",
      transparency_card3_desc_en: "Skondensowane raporty sytuacyjne",
    },
    tour: guidedTour("pl", {
      labels: {
        close: "Zamknij tour",
        back: "Wstecz",
        next: "Dalej",
        finish: "Gotowe",
        skip: "Pomiń",
      },
      stepTitle: [
        "Witaj w ClawGuru",
        "Kluczowe funkcje na żywo",
        "Copilot AI na realne incydenty",
        "Zaufanie dzięki przejrzystym sygnałom",
        "Zacznij od razu",
      ],
      stepValue: [
        "W mniej niż minutę: wcześniej wykryj ryzyko i przejdź od insightu do działania.",
        "Zobacz moduły w akcji i od razu zrozum, gdzie oszczędzasz czas.",
        "Opisz scenariusz incydentu i otrzymaj wykonalne kroki, nie ogólniki.",
        "Metryki i referencje pokazują, dlaczego zespoły używają ClawGuru w produkcji.",
        "Start z Day Pass lub flow check — wartość w kilka minut.",
      ],
      stepHint: ["Tu zaczyna się szybki przegląd produktu.", "", "", "", ""],
    }),
  },
  ru: {
    home: {
      live_preview_kicker: "LIVE",
      live_preview_title: "Превью Intel",
      live_preview_empty: "Инциденты не найдены.",
      live_stats_checks: "Проверок сегодня",
      live_stats_critical: "критич. CVE",
      live_stats_duration: "сред. время",
      check_title_en: "LIVE проверка безопасности (эвристика) — 30 секунд",
      check_sub_en_prefix: "Введите IP/домен/URL бота. Вы получаете",
      check_sub_en_suffix: "+ четкие следующие шаги.",
      check_score_label: "Claw Security Score",
      check_target_label_en: "Цель (публично видна): IP, домен или URL",
      check_risk_high_en: "ПОВЫШЕННЫЙ РИСК",
      check_risk_ok_en: "БАЗА OK",
      check_target_chip_en: "Цель",
      check_ask_guru_en: "Спросить Guru",
      check_footer_privacy_en: "цели не сохраняются",
      check_footer_heuristic_en: "оценка эвристическая",
      check_footer_validate_en: "Для выводов: проверьте конфиг и логи",
      transparency_sub_en:
        "ClawGuru бесплатен. Часть рекомендаций — партнёрские ссылки. Отбираем по реальной операционной ценности.",
      transparency_card1_title_en: "1) Доход от партнёрок",
      transparency_card1_desc_en: "Хостинг и инструменты безопасности",
      transparency_card2_title_en: "2) Управляемые ops",
      transparency_card2_desc_en: "Укрепление, мониторинг, обслуживание",
      transparency_card3_title_en: "3) Исследования и отчёты",
      transparency_card3_desc_en: "Сжатые сводные отчёты",
    },
    tour: guidedTour("ru", {
      labels: {
        close: "Закрыть тур",
        back: "Назад",
        next: "Далее",
        finish: "Готово",
        skip: "Пропустить",
      },
      stepTitle: [
        "Добро пожаловать в ClawGuru",
        "Ключевые функции вживую",
        "ИИ‑копилот для реальных инцидентов",
        "Доверие через прозрачные сигналы",
        "Начать сразу",
      ],
      stepValue: [
        "Меньше минуты: раньше видеть риск и переходить от инсайта к действию.",
        "Смотрите модули в работе и сразу понимайте, где экономите время.",
        "Опишите сценарий инцидента — получите исполнимые шаги, а не общие советы.",
        "Метрики и ссылки показывают, почему команды используют ClawGuru в проде.",
        "Старт с Day Pass или проверкой — ценность за минуты.",
      ],
      stepHint: ["Здесь начинается быстрый обзор продукта.", "", "", "", ""],
    }),
  },
  tr: {
    home: {
      live_preview_kicker: "LIVE",
      live_preview_title: "Intel önizleme",
      live_preview_empty: "Olay bulunamadı.",
      live_stats_checks: "Bugünkü kontroller",
      live_stats_critical: "kritik CVE",
      live_stats_duration: "ort. süre",
      check_title_en: "CANLI Güvenlik Kontrolü (heuristik) — 30 saniye",
      check_sub_en_prefix: "IP/alan adı/bot URL'si girin. Bir",
      check_sub_en_suffix: "+ net sonraki adımlar alırsınız.",
      check_score_label: "Claw Security Score",
      check_target_label_en: "Hedef (herkese açık): IP, alan adı veya URL",
      check_risk_high_en: "YÜKSEK RİSK",
      check_risk_ok_en: "TEMEL OK",
      check_target_chip_en: "Hedef",
      check_ask_guru_en: "Guru'ya sor",
      check_footer_privacy_en: "hedefler saklanmaz",
      check_footer_heuristic_en: "skor heuristik",
      check_footer_validate_en: "Gerçek sonuç için: config ve logları kontrol edin",
      transparency_sub_en:
        "ClawGuru ücretsizdir. Bazı öneriler ortaklık bağlantılarıdır. Gerçek operasyonel değere göre seçiyoruz.",
      transparency_card1_title_en: "1) Ortaklık geliri",
      transparency_card1_desc_en: "Hosting ve güvenlik araçları",
      transparency_card2_title_en: "2) Yönetilen ops",
      transparency_card2_desc_en: "Sertleştirme, izleme, bakım",
      transparency_card3_title_en: "3) Araştırma ve raporlar",
      transparency_card3_desc_en: "Özet durum raporları",
    },
    tour: guidedTour("tr", {
      labels: {
        close: "Tur kapat",
        back: "Geri",
        next: "İleri",
        finish: "Bitti",
        skip: "Atla",
      },
      stepTitle: [
        "ClawGuru'ya hoş geldiniz",
        "Canlı temel özellikler",
        "Gerçek olaylar için yapay zekâ copilot",
        "Şeffaf sinyallerle güven",
        "Hemen başlayın",
      ],
      stepValue: [
        "Bir dakikadan kısa sürede riski daha erken görün ve içgörüden aksiyona geçin.",
        "Modülleri canlı izleyin, zaman kazandığınız yeri anında görün.",
        "Olay senaryonuzu yazın; genel tavsiye değil, uygulanabilir adımlar alın.",
        "Metrikler ve referanslar ekiplerin neden ClawGuru kullandığını gösterir.",
        "Day Pass veya kontrol akışıyla dakikalar içinde değer görün.",
      ],
      stepHint: ["Hızlı ürün turunuz burada başlar.", "", "", "", ""],
    }),
  },
  ar: {
    home: {
      live_preview_kicker: "مباشر",
      live_preview_title: "معاينة Intel",
      live_preview_empty: "لم يتم العثور على حوادث.",
      live_stats_checks: "فحوصات اليوم",
      live_stats_critical: "ثغرات حرجة",
      live_stats_duration: "متوسط المدة",
      check_title_en: "فحص أمني مباشر (استدلالي) — 30 ثانية",
      check_sub_en_prefix: "أدخل IP/نطاق/رابط البوت. تحصل على",
      check_sub_en_suffix: "+ خطوات تالية واضحة.",
      check_score_label: "Claw Security Score",
      check_target_label_en: "الهدف (مرئي علنًا): IP أو نطاق أو URL",
      check_risk_high_en: "مخاطر أعلى",
      check_risk_ok_en: "أساسي OK",
      check_target_chip_en: "الهدف",
      check_ask_guru_en: "اسأل Guru",
      check_footer_privacy_en: "لا نخزن الأهداف",
      check_footer_heuristic_en: "النتيجة استدلالية",
      check_footer_validate_en: "لاستنتاجات حقيقية: راجع الإعدادات والسجلات",
      transparency_sub_en:
        "ClawGuru مجاني. بعض التوصيات روابط تابعة. نختار حسب القيمة التشغيلية الحقيقية.",
      transparency_card1_title_en: "1) إيرادات التسويق بالعمولة",
      transparency_card1_desc_en: "استضافة وأدوات أمنية",
      transparency_card2_title_en: "2) عمليات مُدارة",
      transparency_card2_desc_en: "تصليد ومراقبة وصيانة",
      transparency_card3_title_en: "3) أبحاث وتقارير",
      transparency_card3_desc_en: "تقارير وضع مكثفة",
    },
    tour: guidedTour("ar", {
      labels: {
        close: "إغلاق الجولة",
        back: "رجوع",
        next: "التالي",
        finish: "تم",
        skip: "تخطي",
      },
      stepTitle: [
        "مرحبًا بك في ClawGuru",
        "الميزات الأساسية مباشرة",
        "مساعد ذكاء اصطناعي للحوادث الحقيقية",
        "ثقة عبر إشارات شفافة",
        "ابدأ فورًا",
      ],
      stepValue: [
        "في أقل من دقيقة: اكتشف المخاطر مبكرًا وحوّل الرؤية إلى إجراء.",
        "شاهد الوحدات تعمل وافهم أين توفر الوقت.",
        "صف سيناريو الحادث واحصل على خطوات قابلة للتنفيذ لا نصائح عامة.",
        "المقاييس والمراجع توضح لماذا الفرق تستخدم ClawGuru في الإنتاج.",
        "ابدأ بـ Day Pass أو مسار الفحص لقيمة خلال دقائق.",
      ],
      stepHint: ["هنا تبدأ جولة المنتج السريعة.", "", "", "", ""],
    }),
  },
  hi: {
    home: {
      live_preview_kicker: "LIVE",
      live_preview_title: "Intel पूर्वावलोकन",
      live_preview_empty: "कोई घटना नहीं मिली।",
      live_stats_checks: "आज की जाँच",
      live_stats_critical: "गंभीर CVE",
      live_stats_duration: "औसत अवधि",
      check_title_en: "LIVE सुरक्षा जाँच (ह्यूरिस्टिक) — 30 सेकंड",
      check_sub_en_prefix: "IP/डोमेन/बॉट URL दर्ज करें। आपको मिलता है",
      check_sub_en_suffix: "+ स्पष्ट अगले कदम।",
      check_score_label: "Claw Security Score",
      check_target_label_en: "लक्ष्य (सार्वजनिक रूप से दिखाई देने वाला): IP, डोमेन या URL",
      check_risk_high_en: "उच्च जोखिम",
      check_risk_ok_en: "आधार OK",
      check_target_chip_en: "लक्ष्य",
      check_ask_guru_en: "Guru से पूछें",
      check_footer_privacy_en: "लक्ष्य संग्रहीत नहीं",
      check_footer_heuristic_en: "स्कोर ह्यूरिस्टिक है",
      check_footer_validate_en: "वास्तविक निष्कर्ष: कॉन्फ़िग और लॉग जाँचें",
      transparency_sub_en:
        "ClawGuru मुफ्त है। कुछ सिफारिशें सहयोगी लिंक हैं। हम वास्तविक परिचालन मूल्य के अनुसार चुनते हैं।",
      transparency_card1_title_en: "1) सहयोगी आय",
      transparency_card1_desc_en: "होस्टिंग और सुरक्षा उपकरण",
      transparency_card2_title_en: "2) प्रबंधित ऑप्स",
      transparency_card2_desc_en: "हार्डनिंग, निगरानी, रखरखाव",
      transparency_card3_title_en: "3) अनुसंधान और रिपोर्ट",
      transparency_card3_desc_en: "संक्षिप्त स्थिति रिपोर्ट",
    },
    tour: guidedTour("hi", {
      labels: {
        close: "टूर बंद करें",
        back: "पीछे",
        next: "आगे",
        finish: "पूर्ण",
        skip: "छोड़ें",
      },
      stepTitle: [
        "ClawGuru में आपका स्वागत है",
        "मुख्य सुविधाएँ लाइव",
        "वास्तविक घटनाओं के लिए AI सह-पायलट",
        "पारदर्शी संकेतों से विश्वास",
        "तुरंत शुरू करें",
      ],
      stepValue: [
        "एक मिनट से कम में: जोखिम पहले पहचानें और अंतर्दृष्टि से कार्रवाई पर जाएँ।",
        "मॉड्यूल लाइव देखें और तुरंत समझें कहाँ समय बचता है।",
        "घटना परिदृश्य लिखें और निष्पादनीय चरण पाएँ, सामान्य सलाह नहीं।",
        "मेट्रिक्स और संदर्भ दिखाते हैं कि टीमें उत्पादन में ClawGuru क्यों चलाती हैं।",
        "Day Pass या चेक फ़्लो से मिनटों में मूल्य।",
      ],
      stepHint: ["यहाँ आपका त्वरित उत्पाद दौर शुरू होता है।", "", "", "", ""],
    }),
  },
  ja: {
    home: {
      live_preview_kicker: "LIVE",
      live_preview_title: "Intelプレビュー",
      live_preview_empty: "インシデントは見つかりませんでした。",
      live_stats_checks: "本日のチェック",
      live_stats_critical: "重大CVE",
      live_stats_duration: "平均時間",
      check_title_en: "LIVEセキュリティチェック（ヒューリスティック）— 30秒",
      check_sub_en_prefix: "IP/ドメイン/ボットURLを入力。次を取得:",
      check_sub_en_suffix: "+ 明確な次のステップ。",
      check_score_label: "Claw Security Score",
      check_target_label_en: "対象（公開情報）: IP、ドメイン、またはURL",
      check_risk_high_en: "リスク高",
      check_risk_ok_en: "ベースOK",
      check_target_chip_en: "対象",
      check_ask_guru_en: "Guruに聞く",
      check_footer_privacy_en: "対象は保存しません",
      check_footer_heuristic_en: "スコアはヒューリスティック",
      check_footer_validate_en: "本当の結論には設定とログを確認",
      transparency_sub_en:
        "ClawGuruは無料です。一部の推奨はアフィリエイトリンクです。実運用の価値で厳選しています。",
      transparency_card1_title_en: "1) アフィリエイト収益",
      transparency_card1_desc_en: "ホスティングとセキュリティツール",
      transparency_card2_title_en: "2) マネージドOps",
      transparency_card2_desc_en: "ハードニング、監視、保守",
      transparency_card3_title_en: "3) 調査とレポート",
      transparency_card3_desc_en: "凝縮した状況レポート",
    },
    tour: guidedTour("ja", {
      labels: {
        close: "ツアーを閉じる",
        back: "戻る",
        next: "次へ",
        finish: "完了",
        skip: "スキップ",
      },
      stepTitle: [
        "ClawGuruへようこそ",
        "主要機能をライブで",
        "実インシデント向けAIコパイロット",
        "透明なシグナルで信頼",
        "今すぐ開始",
      ],
      stepValue: [
        "1分未満でリスクを早く捉え、インサイトからアクションへ。",
        "モジュールを実際に見て、時間短縮ポイントを即理解。",
        "インシデントを説明し、一般的な助言ではなく実行可能な手順を取得。",
        "メトリクスと参照が本番利用の理由を示します。",
        "Day Passまたはチェックフローで数分で価値を。",
      ],
      stepHint: ["ここからクイック製品ツアーです。", "", "", "", ""],
    }),
  },
  ko: {
    home: {
      live_preview_kicker: "LIVE",
      live_preview_title: "Intel 미리보기",
      live_preview_empty: "인시던트가 없습니다.",
      live_stats_checks: "오늘 검사",
      live_stats_critical: "심각 CVE",
      live_stats_duration: "평균 시간",
      check_title_en: "LIVE 보안 점검(휴리스틱) — 30초",
      check_sub_en_prefix: "IP/도메인/봇 URL을 입력하세요. 다음을 받습니다:",
      check_sub_en_suffix: "+ 명확한 다음 단계.",
      check_score_label: "Claw Security Score",
      check_target_label_en: "대상(공개): IP, 도메인 또는 URL",
      check_risk_high_en: "위험 높음",
      check_risk_ok_en: "기본 OK",
      check_target_chip_en: "대상",
      check_ask_guru_en: "Guru에게 물어보기",
      check_footer_privacy_en: "대상 저장 없음",
      check_footer_heuristic_en: "점수는 휴리스틱",
      check_footer_validate_en: "실제 결론: 설정과 로그 확인",
      transparency_sub_en:
        "ClawGuru는 무료입니다. 일부 추천은 제휴 링크입니다. 실제 운영 가치로 선별합니다.",
      transparency_card1_title_en: "1) 제휴 수익",
      transparency_card1_desc_en: "호스팅 및 보안 도구",
      transparency_card2_title_en: "2) 관리형 Ops",
      transparency_card2_desc_en: "하드닝, 모니터링, 유지보수",
      transparency_card3_title_en: "3) 연구 및 보고서",
      transparency_card3_desc_en: "압축된 상황 보고서",
    },
    tour: guidedTour("ko", {
      labels: {
        close: "투어 닫기",
        back: "뒤로",
        next: "다음",
        finish: "완료",
        skip: "건너뛰기",
      },
      stepTitle: [
        "ClawGuru에 오신 것을 환영합니다",
        "핵심 기능 라이브",
        "실제 인시던트용 AI 코파일럿",
        "투명한 신호로 신뢰",
        "지금 시작",
      ],
      stepValue: [
        "1분 이내에 위험을 더 일찍 감지하고 인사이트에서 실행으로.",
        "모듈을 라이브로 보고 시간 절약 지점을 바로 이해.",
        "인시던트 시나리오를 설명하고 일반 조언이 아닌 실행 가능한 단계를 받으세요.",
        "지표와 참고 자료가 프로덕션에서 ClawGuru를 쓰는 이유를 보여줍니다.",
        "Day Pass 또는 점검 흐름으로 몇 분 안에 가치를.",
      ],
      stepHint: ["빠른 제품 둘러보기가 여기서 시작됩니다.", "", "", "", ""],
    }),
  },
  zh: {
    home: {
      live_preview_kicker: "直播",
      live_preview_title: "Intel 预览",
      live_preview_empty: "未找到事件。",
      live_stats_checks: "今日检查",
      live_stats_critical: "严重 CVE",
      live_stats_duration: "平均耗时",
      check_title_en: "实时安全检查（启发式）— 30 秒",
      check_sub_en_prefix: "输入 IP/域名/机器人 URL。你将获得",
      check_sub_en_suffix: "+ 清晰的下一步。",
      check_score_label: "Claw Security Score",
      check_target_label_en: "目标（公开可见）：IP、域名或 URL",
      check_risk_high_en: "风险较高",
      check_risk_ok_en: "基础 OK",
      check_target_chip_en: "目标",
      check_ask_guru_en: "询问 Guru",
      check_footer_privacy_en: "不存储目标",
      check_footer_heuristic_en: "分数为启发式",
      check_footer_validate_en: "要得出可靠结论：检查配置与日志",
      transparency_sub_en:
        "ClawGuru 免费。部分推荐为联盟链接。我们按真实运营价值筛选。",
      transparency_card1_title_en: "1) 联盟收入",
      transparency_card1_desc_en: "托管与安全工具",
      transparency_card2_title_en: "2) 托管运维",
      transparency_card2_desc_en: "加固、监控、维护",
      transparency_card3_title_en: "3) 研究与报告",
      transparency_card3_desc_en: "精炼态势报告",
    },
    tour: guidedTour("zh", {
      labels: {
        close: "关闭导览",
        back: "返回",
        next: "下一步",
        finish: "完成",
        skip: "跳过",
      },
      stepTitle: [
        "欢迎使用 ClawGuru",
        "核心功能实况",
        "面向真实事件的 AI 副驾驶",
        "透明信号带来信任",
        "立即开始",
      ],
      stepValue: [
        "不到一分钟：更早发现风险，从洞察走向行动。",
        "观看模块运行，立刻理解节省时间之处。",
        "描述事件场景，获得可执行步骤而非泛泛建议。",
        "指标与参考说明团队为何在生产中使用 ClawGuru。",
        "通过 Day Pass 或检查流程在数分钟内获得价值。",
      ],
      stepHint: ["快速产品导览从这里开始。", "", "", "", ""],
    }),
  },
}

function mergeLocale(code) {
  if (code === "en" || code === "de") return
  const pack = PACK[code]
  if (!pack) {
    console.warn("No pack for", code)
    return
  }
  const p = path.join(DICT, `${code}.json`)
  const data = JSON.parse(fs.readFileSync(p, "utf8"))
  const german = pickGerman()
  data.homepage = { ...data.homepage, ...german, ...pack.home }
  data.vorstellung = data.vorstellung || {}
  data.vorstellung.guidedTour = pack.tour
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + "\n", "utf8")
  console.log("merged", code)
}

const german = pickGerman()
for (const code of Object.keys(PACK)) {
  mergeLocale(code)
}

// Add check_title_en to en + de if missing
function ensureCheckTitleEn() {
  const title =
    "LIVE Security Check (Heuristic) — 30 Seconds"
  for (const f of ["en.json", "de.json"]) {
    const p = path.join(DICT, f)
    const data = JSON.parse(fs.readFileSync(p, "utf8"))
    if (!data.homepage.check_title_en) {
      data.homepage.check_title_en = title
      fs.writeFileSync(p, JSON.stringify(data, null, 2) + "\n", "utf8")
      console.log("added check_title_en to", f)
    }
  }
}
ensureCheckTitleEn()
