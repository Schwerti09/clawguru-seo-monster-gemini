import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/downloads"

// ─────────────────────────────────────────────────────────────────────────────
// Locale-specific copy
// ─────────────────────────────────────────────────────────────────────────────
const COPY: Record<string, {
  seoTitle: string
  seoDesc: string
  keywords: string[]
  heroBadge: string
  h1Line1: string
  h1Line2: string
  heroSub: string
  trust1: string
  trust2: string
  trust3: string
  dlBtn: string
  ctaH2: string
  ctaP: string
  ctaBtn: string
  ctaTrust1: string
  ctaTrust2: string
  ctaTrust3: string
  faqTitle: string
  faqs: { q: string; a: string }[]
  dl1Badge: string; dl1Title: string; dl1Sub: string; dl1H: string[]
  dl2Badge: string; dl2Title: string; dl2Sub: string; dl2H: string[]
  dl3Badge: string; dl3Title: string; dl3Sub: string; dl3H: string[]
  dl4Badge: string; dl4Title: string; dl4Sub: string; dl4H: string[]
}> = {
  de: {
    seoTitle: "4 Kostenlose Security Downloads 2026 | ClawGuru",
    seoDesc: "Kostenlose Security-Downloads: OpenClaw Fortress Blueprint, Zero-Trust Arsenal, AI Threat Intelligence Kit & IR Warfare Manual. Kein Account, kein Spam.",
    keywords: ["kostenlose security downloads", "security hardening guide", "zero trust template", "incident response playbook", "selbst gehostet sicherheit"],
    heroBadge: "4 Premium Security Downloads — 100% kostenlos",
    h1Line1: "Security-Ressourcen,",
    h1Line2: "die sonst keiner teilt",
    heroSub: "Professionelle Hardening-Dokumente, Toolkits und Playbooks — von Security-Experten für Self-Hoster. Kein Spam, keine Paywall.",
    trust1: "🔒 Exklusiv bei ClawGuru",
    trust2: "📥 Bereits 1.847× heruntergeladen",
    trust3: "🛡️ Kein Account erforderlich",
    dlBtn: "↓ Jetzt herunterladen",
    ctaH2: "Direkt nach dem Download: Wie sicher ist dein System?",
    ctaP: "Nutze den kostenlosen Live Security Check — analysiere HTTP-Header, erhalte einen Security-Score und konkrete Empfehlungen in Sekunden.",
    ctaBtn: "🔍 Kostenloser Live Security Check →",
    ctaTrust1: "✓ Keine Registrierung",
    ctaTrust2: "✓ Sofort-Ergebnis",
    ctaTrust3: "✓ DSGVO-konform",
    faqTitle: "Häufige Fragen",
    faqs: [
      { q: "Sind die Downloads wirklich kostenlos?", a: "Ja, 100%. Kein Account, keine E-Mail, keine Kreditkarte. Alle 4 Pakete sind dauerhaft kostenlos — wir wollen, dass Self-Hoster erstklassige Security-Ressourcen haben." },
      { q: "Was ist im OpenClaw Fortress Blueprint enthalten?", a: "Ein 68-seitiger Hardening-Guide, 22 executable Runbooks, Docker-Compose-Templates für Traefik, Caddy und Nginx, Bash-Hardening-Scripts und eine vollständige Security-Checkliste mit Scoring-System." },
      { q: "Brauche ich technische Vorkenntnisse?", a: "Die Materialien sind für erfahrene Self-Hoster gemacht, aber Schritt-für-Schritt-Anleitungen machen sie auch für Einsteiger nutzbar. Alle Scripts sind dokumentiert." },
      { q: "Kann ich die Downloads in meinem Unternehmen verwenden?", a: "Ja! Die Downloads sind frei nutzbar für eigene und unternehmenseigene Systeme. Bitte keine Weitergabe oder Verkauf ohne Zustimmung." },
      { q: "Gibt es Updates für die Downloads?", a: "Ja, wir aktualisieren die Pakete regelmäßig. Lesezeichen auf diese Seite setzen und bei neuen Versionen erneut herunterladen." },
    ],
    dl1Badge: "EXKLUSIV", dl1Title: "OpenClaw Fortress Blueprint 2026", dl1Sub: "Das tiefste OpenClaw-Hardening-Dokument weltweit",
    dl1H: ["68-seitiger Hardening-Guide (Dark Mode PDF)", "22 executable Runbooks + Copy-Paste Bash Scripts", "Docker-Compose Security Templates (Traefik, Caddy, Nginx)", "Konfigurations-Checklisten + Security Scoring System", "1-Klick Hardening Scripts für Hetzner, Contabo, VPS"],
    dl2Badge: "TOOLKIT", dl2Title: "Zero-Trust Self-Hosting Arsenal 2026", dl2Sub: "Enterprise-Toolkit, jetzt kostenlos für Self-Hoster",
    dl2H: ["Offline-fähiger Security Check (HTML + JS)", "8 Nuclei-Templates für Self-Hosting", "Vault + Bitwarden + Passkey Templates", "Netzwerk-Segmentierung + Firewall Rulesets", "Secret Scanning Tool + HTML-Report Export"],
    dl3Badge: "AI & THREAT", dl3Title: "Moltbot & AI Threat Intelligence Kit", dl3Sub: "Tiefes AI-Agent Threat Modeling – nirgendwo sonst kostenlos",
    dl3H: ["STRIDE Threat Model Template", "14 AI-Agent Kill Chain Modelle", "Runbook Generator (Markdown-Vorlagen)", "Prompt-Injection + Model-Poisoning Playbooks", "Real-World Case Studies 2025/2026"],
    dl4Badge: "INCIDENT RESPONSE", dl4Title: "Self-Hosted IR Warfare Manual", dl4Sub: "Echte Kriegshandbücher für Self-Hoster",
    dl4H: ["18 echte Incident Response Playbooks", "Step-by-Step Anleitungen für Self-Hosting-Vorfälle", "Decision Trees + Checklisten", "Post-Mortem Template + Lessons-Learned-Vorlage", "Forensik-Scripts (Log Extraction, Memory Dump)"],
  },
  en: {
    seoTitle: "4 Free Security Downloads 2026 | ClawGuru",
    seoDesc: "Free security downloads: OpenClaw Fortress Blueprint, Zero-Trust Arsenal, AI Threat Intelligence Kit & IR Warfare Manual. No account, no spam.",
    keywords: ["free security downloads", "security hardening guide", "zero trust template", "incident response playbook", "self-hosted security"],
    heroBadge: "4 Premium Security Downloads — 100% Free",
    h1Line1: "Security Resources",
    h1Line2: "Nobody Else Shares",
    heroSub: "Professional hardening guides, toolkits and playbooks — built by security experts for self-hosters. No spam, no paywall.",
    trust1: "🔒 Exclusive to ClawGuru",
    trust2: "📥 1,847 downloads so far",
    trust3: "🛡️ No account required",
    dlBtn: "↓ Download Now",
    ctaH2: "After downloading: How secure is your system?",
    ctaP: "Use the free Live Security Check — analyze HTTP headers, get a security score and concrete recommendations in seconds.",
    ctaBtn: "🔍 Free Live Security Check →",
    ctaTrust1: "✓ No registration",
    ctaTrust2: "✓ Instant results",
    ctaTrust3: "✓ GDPR compliant",
    faqTitle: "Frequently Asked Questions",
    faqs: [
      { q: "Are the downloads really free?", a: "Yes, 100%. No account, no email, no credit card. All 4 packages are permanently free — we want self-hosters to have access to top-tier security resources." },
      { q: "What's inside the OpenClaw Fortress Blueprint?", a: "A 68-page hardening guide, 22 executable runbooks, Docker Compose templates for Traefik, Caddy and Nginx, bash hardening scripts and a complete security checklist with a scoring system." },
      { q: "Do I need technical experience?", a: "The materials are designed for experienced self-hosters, but step-by-step instructions make them usable for beginners too. All scripts are documented." },
      { q: "Can I use the downloads for my company?", a: "Yes! The downloads are free to use for your own and company systems. Please don't redistribute or sell without permission." },
      { q: "Are the downloads updated?", a: "Yes, we update the packages regularly. Bookmark this page and re-download when new versions are available." },
    ],
    dl1Badge: "EXCLUSIVE", dl1Title: "OpenClaw Fortress Blueprint 2026", dl1Sub: "The deepest OpenClaw hardening document in the world",
    dl1H: ["68-page hardening guide (dark mode PDF)", "22 executable runbooks + copy-paste bash scripts", "Docker Compose security templates (Traefik, Caddy, Nginx)", "Configuration checklists + security scoring system", "1-click hardening scripts for Hetzner, Contabo, VPS"],
    dl2Badge: "TOOLKIT", dl2Title: "Zero-Trust Self-Hosting Arsenal 2026", dl2Sub: "Enterprise toolkit, now free for self-hosters",
    dl2H: ["Offline security check (HTML + JS)", "8 Nuclei templates for self-hosting", "Vault + Bitwarden + passkey templates", "Network segmentation + firewall rulesets", "Secret scanning tool + HTML report export"],
    dl3Badge: "AI & THREAT", dl3Title: "Moltbot & AI Threat Intelligence Kit", dl3Sub: "Deep AI agent threat modeling — free nowhere else",
    dl3H: ["STRIDE threat model template", "14 AI agent kill chain models", "Runbook generator (markdown templates)", "Prompt injection + model poisoning playbooks", "Real-world case studies 2025/2026"],
    dl4Badge: "INCIDENT RESPONSE", dl4Title: "Self-Hosted IR Warfare Manual", dl4Sub: "Real incident response playbooks for self-hosters",
    dl4H: ["18 real incident response playbooks", "Step-by-step guides for common self-hosting incidents", "Decision trees + checklists", "Post-mortem template + lessons learned", "Forensics scripts (log extraction, memory dump)"],
  },
  es: {
    seoTitle: "4 Descargas de Seguridad Gratis 2026 | ClawGuru",
    seoDesc: "Descargas de seguridad gratuitas: OpenClaw Fortress Blueprint, Arsenal Zero-Trust, Kit de Inteligencia de Amenazas IA y Manual IR. Sin cuenta, sin spam.",
    keywords: ["descargas seguridad gratis", "guía hardening", "plantilla zero trust", "playbook respuesta incidentes", "seguridad self-hosting"],
    heroBadge: "4 Descargas Premium de Seguridad — 100% Gratis",
    h1Line1: "Recursos de Seguridad",
    h1Line2: "Que Nadie Más Comparte",
    heroSub: "Guías de hardening, toolkits y playbooks profesionales — creados por expertos para auto-alojamiento. Sin spam, sin paywall.",
    trust1: "🔒 Exclusivo en ClawGuru",
    trust2: "📥 Ya 1.847 descargas",
    trust3: "🛡️ Sin cuenta requerida",
    dlBtn: "↓ Descargar Ahora",
    ctaH2: "Después de descargar: ¿Qué tan seguro es tu sistema?",
    ctaP: "Usa el Security Check gratuito — analiza cabeceras HTTP, obtén una puntuación de seguridad y recomendaciones concretas en segundos.",
    ctaBtn: "🔍 Security Check Gratuito →",
    ctaTrust1: "✓ Sin registro",
    ctaTrust2: "✓ Resultado inmediato",
    ctaTrust3: "✓ Compatible GDPR",
    faqTitle: "Preguntas Frecuentes",
    faqs: [
      { q: "¿Las descargas son realmente gratuitas?", a: "Sí, 100%. Sin cuenta, sin email, sin tarjeta de crédito. Los 4 paquetes son permanentemente gratuitos." },
      { q: "¿Qué contiene el OpenClaw Fortress Blueprint?", a: "Una guía de hardening de 68 páginas, 22 runbooks ejecutables, plantillas Docker Compose para Traefik, Caddy y Nginx, scripts bash y una lista de verificación de seguridad completa." },
      { q: "¿Necesito experiencia técnica?", a: "Los materiales están diseñados para auto-alojadores experimentados, pero las instrucciones paso a paso los hacen útiles para principiantes también." },
      { q: "¿Puedo usar las descargas en mi empresa?", a: "¡Sí! Las descargas son de uso libre para sistemas propios y empresariales. No redistribuir ni vender sin permiso." },
      { q: "¿Se actualizan las descargas?", a: "Sí, actualizamos los paquetes regularmente. Guarda esta página y vuelve a descargar cuando haya nuevas versiones." },
    ],
    dl1Badge: "EXCLUSIVO", dl1Title: "OpenClaw Fortress Blueprint 2026", dl1Sub: "El documento de hardening OpenClaw más completo del mundo",
    dl1H: ["Guía de hardening de 68 páginas (PDF modo oscuro)", "22 runbooks ejecutables + scripts bash", "Plantillas Docker Compose (Traefik, Caddy, Nginx)", "Listas de verificación + sistema de puntuación de seguridad", "Scripts de hardening en 1 clic para VPS"],
    dl2Badge: "KIT", dl2Title: "Arsenal Zero-Trust Self-Hosting 2026", dl2Sub: "Kit empresarial, ahora gratis para auto-alojadores",
    dl2H: ["Security Check offline (HTML + JS)", "8 plantillas Nuclei para self-hosting", "Plantillas Vault + Bitwarden + Passkey", "Segmentación de red + reglas de firewall", "Escáner de secretos + exportación de informe HTML"],
    dl3Badge: "IA & AMENAZAS", dl3Title: "Kit de Inteligencia de Amenazas IA Moltbot", dl3Sub: "Modelado de amenazas para agentes IA — gratis en ningún otro lugar",
    dl3H: ["Plantilla de modelo de amenazas STRIDE", "14 modelos de kill chain para agentes IA", "Generador de runbooks (plantillas markdown)", "Playbooks de inyección de prompts y envenenamiento de modelos", "Casos de estudio del mundo real 2025/2026"],
    dl4Badge: "RESPUESTA A INCIDENTES", dl4Title: "Manual IR de Guerra Self-Hosted", dl4Sub: "Playbooks de respuesta a incidentes reales para auto-alojadores",
    dl4H: ["18 playbooks de respuesta a incidentes reales", "Guías paso a paso para incidentes de self-hosting", "Árboles de decisión + listas de verificación", "Plantilla de post-mortem + lecciones aprendidas", "Scripts forenses (extracción de logs, volcado de memoria)"],
  },
  fr: {
    seoTitle: "4 Téléchargements Sécurité Gratuits 2026 | ClawGuru",
    seoDesc: "Téléchargements sécurité gratuits: OpenClaw Fortress Blueprint, Arsenal Zero-Trust, Kit Intelligence Menaces IA & Manuel IR. Sans compte, sans spam.",
    keywords: ["téléchargements sécurité gratuits", "guide hardening", "modèle zero trust", "playbook réponse incidents", "sécurité auto-hébergé"],
    heroBadge: "4 Téléchargements Sécurité Premium — 100% Gratuits",
    h1Line1: "Ressources Sécurité",
    h1Line2: "Que Personne Ne Partage",
    heroSub: "Guides de durcissement, boîtes à outils et playbooks professionnels — créés par des experts pour l'auto-hébergement. Sans spam, sans paywall.",
    trust1: "🔒 Exclusif chez ClawGuru",
    trust2: "📥 Déjà 1 847 téléchargements",
    trust3: "🛡️ Aucun compte requis",
    dlBtn: "↓ Télécharger Maintenant",
    ctaH2: "Après le téléchargement : Votre système est-il sécurisé ?",
    ctaP: "Utilisez le Security Check gratuit — analysez les en-têtes HTTP, obtenez un score de sécurité et des recommandations concrètes en secondes.",
    ctaBtn: "🔍 Security Check Gratuit →",
    ctaTrust1: "✓ Sans inscription",
    ctaTrust2: "✓ Résultat immédiat",
    ctaTrust3: "✓ Conforme RGPD",
    faqTitle: "Questions Fréquentes",
    faqs: [
      { q: "Les téléchargements sont-ils vraiment gratuits ?", a: "Oui, 100%. Pas de compte, pas d'email, pas de carte bancaire. Les 4 paquets sont définitivement gratuits." },
      { q: "Que contient le OpenClaw Fortress Blueprint ?", a: "Un guide de durcissement de 68 pages, 22 runbooks exécutables, des modèles Docker Compose pour Traefik, Caddy et Nginx, des scripts bash et une liste de contrôle complète." },
      { q: "Ai-je besoin d'expérience technique ?", a: "Les matériaux sont conçus pour les auto-hébergeurs expérimentés, mais les instructions étape par étape les rendent accessibles aux débutants." },
      { q: "Puis-je utiliser les téléchargements pour mon entreprise ?", a: "Oui ! Les téléchargements sont librement utilisables pour vos systèmes personnels et professionnels. Merci de ne pas redistribuer sans autorisation." },
      { q: "Les téléchargements sont-ils mis à jour ?", a: "Oui, nous mettons à jour les paquets régulièrement. Ajoutez cette page à vos favoris et retéléchargez lors de nouvelles versions." },
    ],
    dl1Badge: "EXCLUSIF", dl1Title: "OpenClaw Fortress Blueprint 2026", dl1Sub: "Le document de durcissement OpenClaw le plus complet au monde",
    dl1H: ["Guide de durcissement 68 pages (PDF mode sombre)", "22 runbooks exécutables + scripts bash", "Modèles Docker Compose (Traefik, Caddy, Nginx)", "Listes de contrôle + système de score de sécurité", "Scripts de durcissement en 1 clic pour VPS"],
    dl2Badge: "BOÎTE À OUTILS", dl2Title: "Arsenal Zero-Trust Auto-Hébergement 2026", dl2Sub: "Kit entreprise, maintenant gratuit pour auto-hébergeurs",
    dl2H: ["Security Check hors ligne (HTML + JS)", "8 modèles Nuclei pour l'auto-hébergement", "Modèles Vault + Bitwarden + Passkey", "Segmentation réseau + règles pare-feu", "Outil de scan de secrets + export rapport HTML"],
    dl3Badge: "IA & MENACES", dl3Title: "Kit Intelligence Menaces IA Moltbot", dl3Sub: "Modélisation des menaces pour agents IA — gratuit nulle part ailleurs",
    dl3H: ["Modèle de threat modeling STRIDE", "14 modèles de kill chain pour agents IA", "Générateur de runbooks (modèles markdown)", "Playbooks injection de prompts et empoisonnement de modèles", "Études de cas réels 2025/2026"],
    dl4Badge: "RÉPONSE AUX INCIDENTS", dl4Title: "Manuel IR Warfare Auto-Hébergé", dl4Sub: "Playbooks de réponse aux incidents réels pour auto-hébergeurs",
    dl4H: ["18 playbooks de réponse aux incidents réels", "Guides étape par étape pour incidents d'auto-hébergement", "Arbres de décision + listes de contrôle", "Modèle de post-mortem + leçons apprises", "Scripts forensiques (extraction de logs, dump mémoire)"],
  },
  pt: {
    seoTitle: "4 Downloads de Segurança Gratuitos 2026 | ClawGuru",
    seoDesc: "Downloads de segurança gratuitos: OpenClaw Fortress Blueprint, Arsenal Zero-Trust, Kit de Inteligência de Ameaças IA & Manual IR. Sem conta, sem spam.",
    keywords: ["downloads segurança grátis", "guia hardening", "modelo zero trust", "playbook resposta incidentes", "segurança self-hosting"],
    heroBadge: "4 Downloads Premium de Segurança — 100% Gratuitos",
    h1Line1: "Recursos de Segurança",
    h1Line2: "Que Ninguém Mais Compartilha",
    heroSub: "Guias de hardening, kits e playbooks profissionais — criados por especialistas para auto-hospedagem. Sem spam, sem paywall.",
    trust1: "🔒 Exclusivo no ClawGuru",
    trust2: "📥 Já 1.847 downloads",
    trust3: "🛡️ Sem conta necessária",
    dlBtn: "↓ Baixar Agora",
    ctaH2: "Após o download: Quão seguro é seu sistema?",
    ctaP: "Use o Security Check gratuito — analise cabeçalhos HTTP, obtenha uma pontuação de segurança e recomendações concretas em segundos.",
    ctaBtn: "🔍 Security Check Gratuito →",
    ctaTrust1: "✓ Sem registro",
    ctaTrust2: "✓ Resultado imediato",
    ctaTrust3: "✓ Em conformidade GDPR",
    faqTitle: "Perguntas Frequentes",
    faqs: [
      { q: "Os downloads são realmente gratuitos?", a: "Sim, 100%. Sem conta, sem email, sem cartão. Os 4 pacotes são permanentemente gratuitos." },
      { q: "O que contém o OpenClaw Fortress Blueprint?", a: "Um guia de hardening de 68 páginas, 22 runbooks executáveis, templates Docker Compose para Traefik, Caddy e Nginx, scripts bash e uma lista de verificação completa." },
      { q: "Preciso de experiência técnica?", a: "Os materiais são projetados para auto-hospedeiros experientes, mas as instruções passo a passo os tornam acessíveis para iniciantes também." },
      { q: "Posso usar os downloads na minha empresa?", a: "Sim! Os downloads são de uso livre para sistemas pessoais e empresariais. Por favor, não redistribuir sem permissão." },
      { q: "Os downloads são atualizados?", a: "Sim, atualizamos os pacotes regularmente. Adicione esta página aos favoritos e baixe novamente quando houver novas versões." },
    ],
    dl1Badge: "EXCLUSIVO", dl1Title: "OpenClaw Fortress Blueprint 2026", dl1Sub: "O documento de hardening OpenClaw mais completo do mundo",
    dl1H: ["Guia de hardening de 68 páginas (PDF modo escuro)", "22 runbooks executáveis + scripts bash", "Templates Docker Compose (Traefik, Caddy, Nginx)", "Checklists + sistema de pontuação de segurança", "Scripts de hardening em 1 clique para VPS"],
    dl2Badge: "KIT", dl2Title: "Arsenal Zero-Trust Self-Hosting 2026", dl2Sub: "Kit empresarial, agora gratuito para auto-hospedeiros",
    dl2H: ["Security Check offline (HTML + JS)", "8 templates Nuclei para self-hosting", "Templates Vault + Bitwarden + Passkey", "Segmentação de rede + regras de firewall", "Scanner de segredos + exportação de relatório HTML"],
    dl3Badge: "IA & AMEAÇAS", dl3Title: "Kit de Inteligência de Ameaças IA Moltbot", dl3Sub: "Modelagem de ameaças para agentes IA — gratuito em nenhum outro lugar",
    dl3H: ["Template de threat modeling STRIDE", "14 modelos de kill chain para agentes IA", "Gerador de runbooks (templates markdown)", "Playbooks de injeção de prompts e envenenamento de modelos", "Casos de uso reais 2025/2026"],
    dl4Badge: "RESPOSTA A INCIDENTES", dl4Title: "Manual IR Warfare Self-Hosted", dl4Sub: "Playbooks de resposta a incidentes reais para auto-hospedeiros",
    dl4H: ["18 playbooks de resposta a incidentes reais", "Guias passo a passo para incidentes de self-hosting", "Árvores de decisão + checklists", "Template de post-mortem + lições aprendidas", "Scripts forenses (extração de logs, dump de memória)"],
  },
  it: {
    seoTitle: "4 Download Sicurezza Gratuiti 2026 | ClawGuru",
    seoDesc: "Download sicurezza gratuiti: OpenClaw Fortress Blueprint, Arsenal Zero-Trust, Kit Threat Intelligence IA & Manuale IR. Senza account, senza spam.",
    keywords: ["download sicurezza gratuiti", "guida hardening", "template zero trust", "playbook risposta incidenti", "sicurezza self-hosting"],
    heroBadge: "4 Download Premium Sicurezza — 100% Gratuiti",
    h1Line1: "Risorse di Sicurezza",
    h1Line2: "Che Nessun Altro Condivide",
    heroSub: "Guide di hardening, toolkit e playbook professionali — creati da esperti per il self-hosting. Niente spam, niente paywall.",
    trust1: "🔒 Esclusivo su ClawGuru",
    trust2: "📥 Già 1.847 download",
    trust3: "🛡️ Nessun account richiesto",
    dlBtn: "↓ Scarica Ora",
    ctaH2: "Dopo il download: Quanto è sicuro il tuo sistema?",
    ctaP: "Usa il Security Check gratuito — analizza gli header HTTP, ottieni un punteggio di sicurezza e raccomandazioni concrete in pochi secondi.",
    ctaBtn: "🔍 Security Check Gratuito →",
    ctaTrust1: "✓ Senza registrazione",
    ctaTrust2: "✓ Risultato immediato",
    ctaTrust3: "✓ Conforme GDPR",
    faqTitle: "Domande Frequenti",
    faqs: [
      { q: "I download sono davvero gratuiti?", a: "Sì, 100%. Nessun account, nessuna email, nessuna carta. I 4 pacchetti sono permanentemente gratuiti." },
      { q: "Cosa contiene l'OpenClaw Fortress Blueprint?", a: "Una guida di hardening di 68 pagine, 22 runbook eseguibili, template Docker Compose per Traefik, Caddy e Nginx, script bash e una checklist completa." },
      { q: "Ho bisogno di esperienza tecnica?", a: "I materiali sono progettati per self-hoster esperti, ma le istruzioni passo-passo li rendono accessibili anche ai principianti." },
      { q: "Posso usare i download per la mia azienda?", a: "Sì! I download sono liberamente utilizzabili per sistemi personali e aziendali. Non redistribuire senza autorizzazione." },
      { q: "I download vengono aggiornati?", a: "Sì, aggiorniamo i pacchetti regolarmente. Aggiungi questa pagina ai preferiti e riscarica quando ci sono nuove versioni." },
    ],
    dl1Badge: "ESCLUSIVO", dl1Title: "OpenClaw Fortress Blueprint 2026", dl1Sub: "Il documento di hardening OpenClaw più completo al mondo",
    dl1H: ["Guida hardening 68 pagine (PDF dark mode)", "22 runbook eseguibili + script bash", "Template Docker Compose (Traefik, Caddy, Nginx)", "Checklist + sistema di punteggio sicurezza", "Script hardening 1-click per VPS"],
    dl2Badge: "TOOLKIT", dl2Title: "Arsenal Zero-Trust Self-Hosting 2026", dl2Sub: "Toolkit enterprise, ora gratuito per i self-hoster",
    dl2H: ["Security Check offline (HTML + JS)", "8 template Nuclei per self-hosting", "Template Vault + Bitwarden + Passkey", "Segmentazione rete + regole firewall", "Scanner segreti + esportazione report HTML"],
    dl3Badge: "IA & MINACCE", dl3Title: "Kit Threat Intelligence IA Moltbot", dl3Sub: "Threat modeling per agenti IA — gratuito altrove",
    dl3H: ["Template threat modeling STRIDE", "14 modelli kill chain per agenti IA", "Generatore runbook (template markdown)", "Playbook iniezione prompt e avvelenamento modelli", "Case study reali 2025/2026"],
    dl4Badge: "RISPOSTA INCIDENTI", dl4Title: "Manuale IR Warfare Self-Hosted", dl4Sub: "Playbook di risposta agli incidenti reali per self-hoster",
    dl4H: ["18 playbook risposta incidenti reali", "Guide passo-passo per incidenti self-hosting", "Alberi decisionali + checklist", "Template post-mortem + lezioni apprese", "Script forensici (estrazione log, dump memoria)"],
  },
  ru: {
    seoTitle: "4 Бесплатных Загрузки по Безопасности 2026 | ClawGuru",
    seoDesc: "Бесплатные загрузки по безопасности: OpenClaw Fortress Blueprint, Zero-Trust Arsenal, AI Threat Intelligence Kit и IR Warfare Manual. Без аккаунта.",
    keywords: ["бесплатные загрузки безопасность", "руководство hardening", "zero trust шаблон", "playbook реагирование инциденты", "безопасность self-hosting"],
    heroBadge: "4 Premium Загрузки по Безопасности — 100% Бесплатно",
    h1Line1: "Ресурсы безопасности,",
    h1Line2: "которыми никто не делится",
    heroSub: "Профессиональные руководства по укреплению, наборы инструментов и плейбуки — от экспертов для самостоятельного хостинга. Без спама, без платного доступа.",
    trust1: "�� Только на ClawGuru",
    trust2: "📥 Уже 1 847 загрузок",
    trust3: "🛡️ Аккаунт не нужен",
    dlBtn: "↓ Скачать сейчас",
    ctaH2: "После загрузки: Насколько безопасна ваша система?",
    ctaP: "Используйте бесплатную проверку безопасности — анализируйте HTTP-заголовки, получите оценку безопасности и конкретные рекомендации за секунды.",
    ctaBtn: "🔍 Бесплатная проверка безопасности →",
    ctaTrust1: "✓ Без регистрации",
    ctaTrust2: "✓ Мгновенный результат",
    ctaTrust3: "✓ Соответствует GDPR",
    faqTitle: "Часто задаваемые вопросы",
    faqs: [
      { q: "Загрузки действительно бесплатные?", a: "Да, 100%. Никакого аккаунта, email или карты. Все 4 пакета навсегда бесплатны." },
      { q: "Что содержит OpenClaw Fortress Blueprint?", a: "Руководство по укреплению на 68 страниц, 22 исполняемых runbook, шаблоны Docker Compose для Traefik, Caddy и Nginx, bash-скрипты и полный чеклист безопасности." },
      { q: "Нужен ли технический опыт?", a: "Материалы разработаны для опытных пользователей, но пошаговые инструкции делают их доступными для новичков." },
      { q: "Можно ли использовать загрузки для бизнеса?", a: "Да! Загрузки можно свободно использовать для личных и корпоративных систем. Пожалуйста, не распространяйте без разрешения." },
      { q: "Обновляются ли загрузки?", a: "Да, мы регулярно обновляем пакеты. Добавьте эту страницу в закладки и загружайте снова при выходе новых версий." },
    ],
    dl1Badge: "ЭКСКЛЮЗИВ", dl1Title: "OpenClaw Fortress Blueprint 2026", dl1Sub: "Самый глубокий документ по укреплению OpenClaw в мире",
    dl1H: ["Руководство по укреплению 68 страниц (PDF dark mode)", "22 исполняемых runbook + bash-скрипты", "Шаблоны Docker Compose (Traefik, Caddy, Nginx)", "Чеклисты + система оценки безопасности", "Скрипты укрепления в 1 клик для VPS"],
    dl2Badge: "НАБОР ИНСТРУМЕНТОВ", dl2Title: "Zero-Trust Self-Hosting Arsenal 2026", dl2Sub: "Корпоративный набор, теперь бесплатно для самостоятельного хостинга",
    dl2H: ["Офлайн-проверка безопасности (HTML + JS)", "8 шаблонов Nuclei для self-hosting", "Шаблоны Vault + Bitwarden + Passkey", "Сегментация сети + правила файрвола", "Сканер секретов + экспорт HTML-отчёта"],
    dl3Badge: "ИИ И УГРОЗЫ", dl3Title: "Moltbot AI Threat Intelligence Kit", dl3Sub: "Моделирование угроз для ИИ-агентов — бесплатно только здесь",
    dl3H: ["Шаблон STRIDE threat modeling", "14 моделей kill chain для ИИ-агентов", "Генератор runbook (markdown-шаблоны)", "Плейбуки инъекции промптов и отравления моделей", "Реальные кейсы 2025/2026"],
    dl4Badge: "РЕАГИРОВАНИЕ НА ИНЦИДЕНТЫ", dl4Title: "Self-Hosted IR Warfare Manual", dl4Sub: "Настоящие плейбуки реагирования для самостоятельного хостинга",
    dl4H: ["18 реальных плейбуков реагирования на инциденты", "Пошаговые инструкции для типичных инцидентов", "Деревья решений + чеклисты", "Шаблон постмортема + извлечённые уроки", "Криминалистические скрипты (извлечение логов, дамп памяти)"],
  },
  zh: {
    seoTitle: "4个免费安全下载 2026 | ClawGuru",
    seoDesc: "免费安全下载：OpenClaw堡垒蓝图、零信任武器库、AI威胁情报套件和IR战争手册。无需账户，无垃圾邮件。",
    keywords: ["免费安全下载", "安全加固指南", "零信任模板", "事件响应剧本", "自托管安全"],
    heroBadge: "4个高级安全下载 — 100%免费",
    h1Line1: "安全资源，",
    h1Line2: "别人不会分享的",
    heroSub: "专业的加固指南、工具包和剧本——由安全专家为自托管用户打造。无垃圾邮件，无付费墙。",
    trust1: "🔒 ClawGuru独家",
    trust2: "📥 已有1,847次下载",
    trust3: "🛡️ 无需账户",
    dlBtn: "↓ 立即下载",
    ctaH2: "下载后：您的系统有多安全？",
    ctaP: "使用免费安全检查——分析HTTP标头，在几秒内获得安全评分和具体建议。",
    ctaBtn: "🔍 免费安全检查 →",
    ctaTrust1: "✓ 无需注册",
    ctaTrust2: "✓ 即时结果",
    ctaTrust3: "✓ 符合GDPR",
    faqTitle: "常见问题",
    faqs: [
      { q: "下载真的免费吗？", a: "是的，100%免费。无需账户、电子邮件或信用卡。所有4个包永久免费。" },
      { q: "OpenClaw堡垒蓝图包含什么？", a: "一份68页的加固指南，22个可执行运行手册，Traefik、Caddy和Nginx的Docker Compose模板，bash脚本和完整的安全清单。" },
      { q: "我需要技术经验吗？", a: "材料专为有经验的自托管用户设计，但逐步说明也让初学者可以使用。" },
      { q: "我可以将下载用于公司吗？", a: "可以！下载可免费用于个人和公司系统。请勿未经许可重新分发。" },
      { q: "下载会更新吗？", a: "是的，我们定期更新包。将此页面加入书签，并在新版本可用时重新下载。" },
    ],
    dl1Badge: "独家", dl1Title: "OpenClaw堡垒蓝图 2026", dl1Sub: "全球最深度的OpenClaw加固文档",
    dl1H: ["68页加固指南（深色模式PDF）", "22个可执行运行手册 + bash脚本", "Docker Compose安全模板（Traefik、Caddy、Nginx）", "配置清单 + 安全评分系统", "VPS一键加固脚本"],
    dl2Badge: "工具包", dl2Title: "零信任自托管武器库 2026", dl2Sub: "企业工具包，现在对自托管用户免费",
    dl2H: ["离线安全检查（HTML + JS）", "8个Nuclei模板用于自托管", "Vault + Bitwarden + Passkey模板", "网络分段 + 防火墙规则集", "密钥扫描工具 + HTML报告导出"],
    dl3Badge: "AI与威胁", dl3Title: "Moltbot AI威胁情报套件", dl3Sub: "AI代理威胁建模——仅此免费",
    dl3H: ["STRIDE威胁建模模板", "14个AI代理杀伤链模型", "运行手册生成器（markdown模板）", "提示注入 + 模型投毒防御剧本", "2025/2026真实案例研究"],
    dl4Badge: "事件响应", dl4Title: "自托管IR战争手册", dl4Sub: "自托管用户的真实事件响应剧本",
    dl4H: ["18个真实事件响应剧本", "自托管常见事件的逐步指南", "决策树 + 清单", "事后分析模板 + 经验教训", "取证脚本（日志提取、内存转储）"],
  },
  ja: {
    seoTitle: "4つの無料セキュリティダウンロード 2026 | ClawGuru",
    seoDesc: "無料セキュリティダウンロード：OpenClawフォートレスブループリント、ゼロトラストアーセナル、AI脅威インテリジェンスキット & IRウォーフェアマニュアル。アカウント不要。",
    keywords: ["無料セキュリティダウンロード", "セキュリティ強化ガイド", "ゼロトラストテンプレート", "インシデントレスポンスプレイブック", "セルフホスティングセキュリティ"],
    heroBadge: "4つのプレミアムセキュリティダウンロード — 100%無料",
    h1Line1: "セキュリティリソース、",
    h1Line2: "誰も共有しないもの",
    heroSub: "セルフホスター向けの専門的な強化ガイド、ツールキット、プレイブック。スパムなし、ペイウォールなし。",
    trust1: "🔒 ClawGuru限定",
    trust2: "📥 すでに1,847回ダウンロード",
    trust3: "🛡️ アカウント不要",
    dlBtn: "↓ 今すぐダウンロード",
    ctaH2: "ダウンロード後：あなたのシステムは安全ですか？",
    ctaP: "無料セキュリティチェックを使用してください — HTTPヘッダーを分析し、数秒でセキュリティスコアと具体的な推奨事項を取得します。",
    ctaBtn: "🔍 無料セキュリティチェック →",
    ctaTrust1: "✓ 登録不要",
    ctaTrust2: "✓ 即時結果",
    ctaTrust3: "✓ GDPR準拠",
    faqTitle: "よくある質問",
    faqs: [
      { q: "ダウンロードは本当に無料ですか？", a: "はい、100%無料です。アカウント、メール、クレジットカード不要。4つのパッケージはすべて永久無料です。" },
      { q: "OpenClawフォートレスブループリントには何が含まれていますか？", a: "68ページの強化ガイド、22の実行可能なランブック、Traefik・Caddy・Nginx用のDocker Composeテンプレート、bashスクリプト、完全なセキュリティチェックリストが含まれています。" },
      { q: "技術的な経験が必要ですか？", a: "資料は経験豊富なセルフホスター向けに設計されていますが、ステップバイステップの説明により初心者にも利用可能です。" },
      { q: "会社でダウンロードを使用できますか？", a: "はい！ダウンロードは個人および会社のシステムに自由に使用できます。許可なく再配布しないでください。" },
      { q: "ダウンロードは更新されますか？", a: "はい、定期的にパッケージを更新しています。このページをブックマークし、新しいバージョンが利用可能になったら再ダウンロードしてください。" },
    ],
    dl1Badge: "限定", dl1Title: "OpenClawフォートレスブループリント 2026", dl1Sub: "世界最深度のOpenClaw強化ドキュメント",
    dl1H: ["68ページ強化ガイド（ダークモードPDF）", "22の実行可能ランブック + bashスクリプト", "Docker Composeテンプレート（Traefik・Caddy・Nginx）", "設定チェックリスト + セキュリティスコアリング", "VPS向け1クリック強化スクリプト"],
    dl2Badge: "ツールキット", dl2Title: "ゼロトラスト自己ホスティングアーセナル 2026", dl2Sub: "エンタープライズツールキット、今すぐ無料",
    dl2H: ["オフラインセキュリティチェック（HTML + JS）", "セルフホスティング向け8つのNucleiテンプレート", "Vault + Bitwarden + Passkeyテンプレート", "ネットワーク分割 + ファイアウォールルールセット", "シークレットスキャナー + HTMLレポートエクスポート"],
    dl3Badge: "AI・脅威", dl3Title: "Moltbot AI脅威インテリジェンスキット", dl3Sub: "AIエージェント脅威モデリング — ここだけで無料",
    dl3H: ["STRIDEスレットモデルテンプレート", "14のAIエージェントキルチェーンモデル", "ランブックジェネレーター（markdownテンプレート）", "プロンプトインジェクション + モデルポイズニングプレイブック", "2025/2026の実際のケーススタディ"],
    dl4Badge: "インシデントレスポンス", dl4Title: "セルフホスト IRウォーフェアマニュアル", dl4Sub: "セルフホスター向け実際のインシデントレスポンスプレイブック",
    dl4H: ["18の実際のインシデントレスポンスプレイブック", "一般的なセルフホスティングインシデントのステップバイステップガイド", "決定木 + チェックリスト", "ポストモーテムテンプレート + 教訓", "フォレンジックスクリプト（ログ抽出、メモリダンプ）"],
  },
  ar: {
    seoTitle: "4 تنزيلات أمان مجانية 2026 | ClawGuru",
    seoDesc: "تنزيلات أمان مجانية: OpenClaw Fortress Blueprint وArsenal Zero-Trust وAI Threat Intelligence Kit ودليل IR. بدون حساب وبدون بريد مزعج.",
    keywords: ["تنزيلات أمان مجانية", "دليل التصليب", "قالب zero trust", "دليل الاستجابة للحوادث", "أمان الاستضافة الذاتية"],
    heroBadge: "4 تنزيلات أمان متميزة — مجانية 100%",
    h1Line1: "موارد الأمان",
    h1Line2: "التي لا يشاركها أحد",
    heroSub: "أدلة التصليب الاحترافية والأدوات والأدلة التشغيلية — صُممت من قبل خبراء لمضيفي الاستضافة الذاتية. بدون بريد مزعج وبدون جدار دفع.",
    trust1: "🔒 حصري على ClawGuru",
    trust2: "📥 تم تنزيله 1,847 مرة",
    trust3: "🛡️ لا حساب مطلوب",
    dlBtn: "↓ تحميل الآن",
    ctaH2: "بعد التنزيل: ما مدى أمان نظامك؟",
    ctaP: "استخدم فحص الأمان المجاني — حلل رؤوس HTTP واحصل على درجة أمان وتوصيات محددة في ثوانٍ.",
    ctaBtn: "🔍 فحص الأمان المجاني →",
    ctaTrust1: "✓ بدون تسجيل",
    ctaTrust2: "✓ نتيجة فورية",
    ctaTrust3: "✓ متوافق مع GDPR",
    faqTitle: "أسئلة شائعة",
    faqs: [
      { q: "هل التنزيلات مجانية حقاً؟", a: "نعم، مجانية 100%. لا حساب ولا بريد إلكتروني ولا بطاقة ائتمان. جميع الحزم الـ4 مجانية دائماً." },
      { q: "ما الذي يحتويه OpenClaw Fortress Blueprint؟", a: "دليل تصليب من 68 صفحة، و22 دليلاً تشغيلياً قابلاً للتنفيذ، وقوالب Docker Compose لـTraefik وCaddy وNginx، وسكريبتات bash وقائمة تحقق أمان كاملة." },
      { q: "هل أحتاج إلى خبرة تقنية؟", a: "المواد مصممة لمضيفي الاستضافة الذاتية ذوي الخبرة، لكن التعليمات خطوة بخطوة تجعلها مفيدة للمبتدئين أيضاً." },
      { q: "هل يمكنني استخدام التنزيلات لشركتي؟", a: "نعم! التنزيلات مجانية للاستخدام في الأنظمة الشخصية والتجارية. يُرجى عدم إعادة التوزيع بدون إذن." },
      { q: "هل يتم تحديث التنزيلات؟", a: "نعم، نحدث الحزم بانتظام. احفظ هذه الصفحة وأعد التنزيل عند توفر إصدارات جديدة." },
    ],
    dl1Badge: "حصري", dl1Title: "OpenClaw Fortress Blueprint 2026", dl1Sub: "أعمق وثيقة تصليب OpenClaw في العالم",
    dl1H: ["دليل تصليب 68 صفحة (PDF الوضع الداكن)", "22 دليلاً تشغيلياً + سكريبتات bash", "قوالب Docker Compose (Traefik وCaddy وNginx)", "قوائم تحقق + نظام تسجيل الأمان", "سكريبتات تصليب بنقرة واحدة لـVPS"],
    dl2Badge: "مجموعة أدوات", dl2Title: "Zero-Trust Self-Hosting Arsenal 2026", dl2Sub: "مجموعة أدوات المؤسسات، مجانية الآن",
    dl2H: ["فحص أمان دون اتصال (HTML + JS)", "8 قوالب Nuclei للاستضافة الذاتية", "قوالب Vault + Bitwarden + Passkey", "تجزئة الشبكة + مجموعات قواعد الجدار الناري", "أداة فحص الأسرار + تصدير تقرير HTML"],
    dl3Badge: "ذكاء اصطناعي والتهديدات", dl3Title: "Moltbot AI Threat Intelligence Kit", dl3Sub: "نمذجة التهديدات لوكلاء الذكاء الاصطناعي — مجاني فقط هنا",
    dl3H: ["قالب نمذجة تهديدات STRIDE", "14 نموذج سلسلة قتل لوكلاء الذكاء الاصطناعي", "مولد الأدلة التشغيلية (قوالب markdown)", "أدلة تشغيل حقن التحفيزات وتسميم النماذج", "دراسات حالات حقيقية 2025/2026"],
    dl4Badge: "الاستجابة للحوادث", dl4Title: "Self-Hosted IR Warfare Manual", dl4Sub: "أدلة استجابة للحوادث حقيقية للمضيفين الذاتيين",
    dl4H: ["18 دليلاً تشغيلياً للاستجابة للحوادث الحقيقية", "أدلة خطوة بخطوة للحوادث الشائعة", "أشجار القرار + قوائم التحقق", "قالب تقرير ما بعد الحادث + الدروس المستفادة", "سكريبتات الطب الشرعي (استخراج السجلات، تفريغ الذاكرة)"],
  },
  nl: {
    seoTitle: "4 Gratis Security Downloads 2026 | ClawGuru",
    seoDesc: "Gratis security downloads: OpenClaw Fortress Blueprint, Zero-Trust Arsenal, AI Threat Intelligence Kit & IR Warfare Manual. Geen account, geen spam.",
    keywords: ["gratis security downloads", "security hardening gids", "zero trust sjabloon", "incident response playbook", "self-hosting beveiliging"],
    heroBadge: "4 Premium Security Downloads — 100% Gratis",
    h1Line1: "Security-bronnen",
    h1Line2: "Die Niemand Deelt",
    heroSub: "Professionele hardening-gidsen, toolkits en playbooks — gemaakt door security-experts voor self-hosters. Geen spam, geen betaalmuur.",
    trust1: "🔒 Exclusief bij ClawGuru",
    trust2: "📥 Al 1.847 downloads",
    trust3: "🛡️ Geen account vereist",
    dlBtn: "↓ Nu Downloaden",
    ctaH2: "Na het downloaden: Hoe veilig is uw systeem?",
    ctaP: "Gebruik de gratis Live Security Check — analyseer HTTP-headers, ontvang een beveiligingsscore en concrete aanbevelingen in seconden.",
    ctaBtn: "🔍 Gratis Live Security Check →",
    ctaTrust1: "✓ Geen registratie",
    ctaTrust2: "✓ Direct resultaat",
    ctaTrust3: "✓ AVG-conform",
    faqTitle: "Veelgestelde Vragen",
    faqs: [
      { q: "Zijn de downloads echt gratis?", a: "Ja, 100%. Geen account, geen e-mail, geen creditcard. Alle 4 pakketten zijn permanent gratis." },
      { q: "Wat zit er in de OpenClaw Fortress Blueprint?", a: "Een hardening-gids van 68 pagina's, 22 uitvoerbare runbooks, Docker Compose-sjablonen voor Traefik, Caddy en Nginx, bash-scripts en een complete beveiligingschecklist." },
      { q: "Heb ik technische ervaring nodig?", a: "De materialen zijn ontworpen voor ervaren self-hosters, maar stapsgewijze instructies maken ze ook toegankelijk voor beginners." },
      { q: "Kan ik de downloads voor mijn bedrijf gebruiken?", a: "Ja! De downloads zijn vrij te gebruiken voor persoonlijke en zakelijke systemen. Gelieve niet te herverdelen zonder toestemming." },
      { q: "Worden de downloads bijgewerkt?", a: "Ja, we werken de pakketten regelmatig bij. Voeg deze pagina toe aan uw bladwijzers en download opnieuw wanneer nieuwe versies beschikbaar zijn." },
    ],
    dl1Badge: "EXCLUSIEF", dl1Title: "OpenClaw Fortress Blueprint 2026", dl1Sub: "Het meest diepgaande OpenClaw hardening-document ter wereld",
    dl1H: ["68-pagina hardening-gids (dark mode PDF)", "22 uitvoerbare runbooks + bash-scripts", "Docker Compose beveiligingssjablonen (Traefik, Caddy, Nginx)", "Configuratiechecklists + beveiligingsscoringssysteem", "1-klik hardening scripts voor VPS"],
    dl2Badge: "TOOLKIT", dl2Title: "Zero-Trust Self-Hosting Arsenal 2026", dl2Sub: "Enterprise-toolkit, nu gratis voor self-hosters",
    dl2H: ["Offline beveiligingscheck (HTML + JS)", "8 Nuclei-sjablonen voor self-hosting", "Vault + Bitwarden + Passkey sjablonen", "Netwerksegmentatie + firewallregelsets", "Geheimscanner + HTML-rapportexport"],
    dl3Badge: "AI & DREIGINGEN", dl3Title: "Moltbot AI Threat Intelligence Kit", dl3Sub: "Diepgaande AI-agent dreigingsmodellering — nergens anders gratis",
    dl3H: ["STRIDE dreigingsmodelsjabloon", "14 AI-agent kill chain modellen", "Runbook generator (markdown-sjablonen)", "Prompt-injectie + modelvergifrging playbooks", "Praktijkstudies 2025/2026"],
    dl4Badge: "INCIDENTRESPONS", dl4Title: "Self-Hosted IR Warfare Manual", dl4Sub: "Echte incidentrespons playbooks voor self-hosters",
    dl4H: ["18 echte incidentrespons playbooks", "Stapsgewijze handleidingen voor veelvoorkomende incidenten", "Beslissingsbomen + checklists", "Post-mortem sjabloon + geleerde lessen", "Forensische scripts (logextractie, geheugenopname)"],
  },
  hi: {
    seoTitle: "4 निःशुल्क सुरक्षा डाउनलोड 2026 | ClawGuru",
    seoDesc: "निःशुल्क सुरक्षा डाउनलोड: OpenClaw Fortress Blueprint, Zero-Trust Arsenal, AI Threat Intelligence Kit और IR Warfare Manual। बिना खाते के।",
    keywords: ["निःशुल्क सुरक्षा डाउनलोड", "सुरक्षा हार्डनिंग गाइड", "zero trust टेम्पलेट", "इन्सिडेंट रिस्पांस प्लेबुक", "सेल्फ-होस्टिंग सुरक्षा"],
    heroBadge: "4 प्रीमियम सुरक्षा डाउनलोड — 100% निःशुल्क",
    h1Line1: "सुरक्षा संसाधन",
    h1Line2: "जो कोई और नहीं साझा करता",
    heroSub: "पेशेवर हार्डनिंग गाइड, टूलकिट और प्लेबुक — सेल्फ-होस्टर्स के लिए सुरक्षा विशेषज्ञों द्वारा बनाए गए। कोई स्पैम नहीं, कोई पेवॉल नहीं।",
    trust1: "🔒 ClawGuru पर एक्सक्लूसिव",
    trust2: "📥 पहले से 1,847 डाउनलोड",
    trust3: "🛡️ कोई खाता आवश्यक नहीं",
    dlBtn: "↓ अभी डाउनलोड करें",
    ctaH2: "डाउनलोड के बाद: आपका सिस्टम कितना सुरक्षित है?",
    ctaP: "निःशुल्क सुरक्षा जांच का उपयोग करें — HTTP हेडर का विश्लेषण करें, सुरक्षा स्कोर और सेकंड में ठोस सिफारिशें प्राप्त करें।",
    ctaBtn: "🔍 निःशुल्क सुरक्षा जांच →",
    ctaTrust1: "✓ कोई पंजीकरण नहीं",
    ctaTrust2: "✓ तत्काल परिणाम",
    ctaTrust3: "✓ GDPR अनुपालित",
    faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
    faqs: [
      { q: "क्या डाउनलोड वास्तव में निःशुल्क हैं?", a: "हां, 100%। कोई खाता, ईमेल या क्रेडिट कार्ड नहीं। सभी 4 पैकेज स्थायी रूप से निःशुल्क हैं।" },
      { q: "OpenClaw Fortress Blueprint में क्या है?", a: "68 पृष्ठ की हार्डनिंग गाइड, 22 एक्जीक्यूटेबल रनबुक, Traefik, Caddy और Nginx के लिए Docker Compose टेम्पलेट, bash स्क्रिप्ट और पूर्ण सुरक्षा चेकलिस्ट।" },
      { q: "क्या मुझे तकनीकी अनुभव चाहिए?", a: "सामग्री अनुभवी सेल्फ-होस्टर्स के लिए बनाई गई है, लेकिन चरण-दर-चरण निर्देश इसे शुरुआती के लिए भी उपयोगी बनाते हैं।" },
      { q: "क्या मैं अपनी कंपनी के लिए डाउनलोड का उपयोग कर सकता हूं?", a: "हां! डाउनलोड व्यक्तिगत और कॉर्पोरेट सिस्टम के लिए मुफ्त में उपयोग किए जा सकते हैं।" },
      { q: "क्या डाउनलोड अपडेट होते हैं?", a: "हां, हम पैकेज नियमित रूप से अपडेट करते हैं। इस पेज को बुकमार्क करें।" },
    ],
    dl1Badge: "एक्सक्लूसिव", dl1Title: "OpenClaw Fortress Blueprint 2026", dl1Sub: "दुनिया का सबसे गहरा OpenClaw हार्डनिंग दस्तावेज़",
    dl1H: ["68 पृष्ठ हार्डनिंग गाइड (डार्क मोड PDF)", "22 एक्जीक्यूटेबल रनबुक + bash स्क्रिप्ट", "Docker Compose टेम्पलेट (Traefik, Caddy, Nginx)", "कॉन्फ़िगरेशन चेकलिस्ट + स्कोरिंग सिस्टम", "VPS के लिए 1-क्लिक हार्डनिंग स्क्रिप्ट"],
    dl2Badge: "टूलकिट", dl2Title: "Zero-Trust Self-Hosting Arsenal 2026", dl2Sub: "एंटरप्राइज़ टूलकिट, अब सेल्फ-होस्टर्स के लिए निःशुल्क",
    dl2H: ["ऑफलाइन सुरक्षा जांच (HTML + JS)", "8 Nuclei टेम्पलेट", "Vault + Bitwarden + Passkey टेम्पलेट", "नेटवर्क सेगमेंटेशन + फ़ायरवॉल रूलसेट", "सीक्रेट स्कैनर + HTML रिपोर्ट"],
    dl3Badge: "AI और खतरे", dl3Title: "Moltbot AI Threat Intelligence Kit", dl3Sub: "AI एजेंट थ्रेट मॉडलिंग — केवल यहां निःशुल्क",
    dl3H: ["STRIDE थ्रेट मॉडल टेम्पलेट", "14 AI एजेंट किल चेन मॉडल", "रनबुक जेनरेटर (markdown टेम्पलेट)", "प्रॉम्प्ट इंजेक्शन + मॉडल पॉइज़निंग प्लेबुक", "वास्तविक केस स्टडी 2025/2026"],
    dl4Badge: "इन्सिडेंट रिस्पांस", dl4Title: "Self-Hosted IR Warfare Manual", dl4Sub: "सेल्फ-होस्टर्स के लिए वास्तविक इन्सिडेंट रिस्पांस प्लेबुक",
    dl4H: ["18 वास्तविक इन्सिडेंट रिस्पांस प्लेबुक", "सामान्य इन्सिडेंट के लिए चरण-दर-चरण गाइड", "निर्णय ट्री + चेकलिस्ट", "पोस्ट-मॉर्टम टेम्पलेट + सीखे गए पाठ", "फ़ॉरेंसिक स्क्रिप्ट (लॉग निष्कर्षण, मेमोरी डंप)"],
  },
  tr: {
    seoTitle: "4 Ücretsiz Güvenlik İndirmesi 2026 | ClawGuru",
    seoDesc: "Ücretsiz güvenlik indirmeleri: OpenClaw Fortress Blueprint, Zero-Trust Arsenal, AI Tehdit İstihbarat Kiti ve IR Savaş Kılavuzu. Hesap gerekmez.",
    keywords: ["ücretsiz güvenlik indirmeleri", "güvenlik sertleştirme rehberi", "zero trust şablonu", "olay müdahale playbook", "self-hosting güvenlik"],
    heroBadge: "4 Premium Güvenlik İndirmesi — %100 Ücretsiz",
    h1Line1: "Güvenlik Kaynakları",
    h1Line2: "Kimsenin Paylaşmadığı",
    heroSub: "Profesyonel sertleştirme kılavuzları, araç setleri ve playbook'lar — self-hosting kullanıcıları için güvenlik uzmanları tarafından oluşturuldu. Spam yok, ödeme duvarı yok.",
    trust1: "🔒 ClawGuru'ya Özel",
    trust2: "📥 1.847 kez indirildi",
    trust3: "🛡️ Hesap gerekmez",
    dlBtn: "↓ Şimdi İndir",
    ctaH2: "İndirdikten sonra: Sisteminiz ne kadar güvenli?",
    ctaP: "Ücretsiz Canlı Güvenlik Kontrolünü kullanın — HTTP başlıklarını analiz edin, saniyeler içinde güvenlik puanı ve somut öneriler alın.",
    ctaBtn: "🔍 Ücretsiz Canlı Güvenlik Kontrolü →",
    ctaTrust1: "✓ Kayıt gerekmez",
    ctaTrust2: "✓ Anında sonuç",
    ctaTrust3: "✓ GDPR uyumlu",
    faqTitle: "Sıkça Sorulan Sorular",
    faqs: [
      { q: "İndirmeler gerçekten ücretsiz mi?", a: "Evet, %100 ücretsiz. Hesap, e-posta veya kredi kartı gerekmez. 4 paket de kalıcı olarak ücretsizdir." },
      { q: "OpenClaw Fortress Blueprint'te ne var?", a: "68 sayfalık sertleştirme kılavuzu, 22 çalıştırılabilir runbook, Traefik, Caddy ve Nginx için Docker Compose şablonları, bash betikleri ve tam güvenlik kontrol listesi." },
      { q: "Teknik deneyime ihtiyacım var mı?", a: "Materyaller deneyimli self-hosting kullanıcıları için tasarlanmıştır, ancak adım adım talimatlar yeni başlayanlar için de kullanışlıdır." },
      { q: "İndirmeleri şirketim için kullanabilir miyim?", a: "Evet! İndirmeler kişisel ve kurumsal sistemler için ücretsiz kullanılabilir. İzin almadan yeniden dağıtmayın." },
      { q: "İndirmeler güncelleniyor mu?", a: "Evet, paketleri düzenli olarak güncelliyoruz. Bu sayfayı yer imlerinize ekleyin." },
    ],
    dl1Badge: "ÖZEL", dl1Title: "OpenClaw Fortress Blueprint 2026", dl1Sub: "Dünyanın en derin OpenClaw sertleştirme belgesi",
    dl1H: ["68 sayfalık sertleştirme kılavuzu (karanlık mod PDF)", "22 çalıştırılabilir runbook + bash betikleri", "Docker Compose şablonları (Traefik, Caddy, Nginx)", "Yapılandırma kontrol listeleri + güvenlik puanlama", "VPS için 1 tıkla sertleştirme betikleri"],
    dl2Badge: "ARAÇ SETİ", dl2Title: "Zero-Trust Self-Hosting Arsenal 2026", dl2Sub: "Kurumsal araç seti, artık self-hosting için ücretsiz",
    dl2H: ["Çevrimdışı güvenlik kontrolü (HTML + JS)", "Self-hosting için 8 Nuclei şablonu", "Vault + Bitwarden + Passkey şablonları", "Ağ segmentasyonu + güvenlik duvarı kural setleri", "Gizli tarama aracı + HTML rapor dışa aktarma"],
    dl3Badge: "YZ & TEHDİTLER", dl3Title: "Moltbot AI Tehdit İstihbarat Kiti", dl3Sub: "YZ ajan tehdit modellemesi — yalnızca burada ücretsiz",
    dl3H: ["STRIDE tehdit modeli şablonu", "14 YZ ajan öldürme zinciri modeli", "Runbook oluşturucu (markdown şablonları)", "Komut enjeksiyonu + model zehirleme playbook'ları", "Gerçek dünya vaka çalışmaları 2025/2026"],
    dl4Badge: "OLAY MÜDAHALE", dl4Title: "Self-Hosted IR Savaş Kılavuzu", dl4Sub: "Self-hosting kullanıcıları için gerçek olay müdahale playbook'ları",
    dl4H: ["18 gerçek olay müdahale playbook'u", "Yaygın self-hosting olayları için adım adım kılavuzlar", "Karar ağaçları + kontrol listeleri", "Olay sonrası şablon + çıkarılan dersler", "Adli bilişim betikleri (log çıkarma, bellek dökümü)"],
  },
  pl: {
    seoTitle: "4 Darmowe Pobierania Bezpieczeństwa 2026 | ClawGuru",
    seoDesc: "Darmowe pobierania bezpieczeństwa: OpenClaw Fortress Blueprint, Zero-Trust Arsenal, AI Threat Intelligence Kit i IR Warfare Manual. Bez konta, bez spamu.",
    keywords: ["darmowe pobierania bezpieczeństwa", "przewodnik hardeningu", "szablon zero trust", "playbook odpowiedzi na incydenty", "bezpieczeństwo self-hosting"],
    heroBadge: "4 Premium Pobrania Bezpieczeństwa — 100% Darmowe",
    h1Line1: "Zasoby Bezpieczeństwa",
    h1Line2: "Których Nikt Inny Nie Udostępnia",
    heroSub: "Profesjonalne przewodniki hardeningu, zestawy narzędzi i playbooki — stworzone przez ekspertów ds. bezpieczeństwa dla self-hostów. Bez spamu, bez paywall.",
    trust1: "🔒 Ekskluzywnie w ClawGuru",
    trust2: "📥 Już 1 847 pobrań",
    trust3: "🛡️ Bez wymaganego konta",
    dlBtn: "↓ Pobierz Teraz",
    ctaH2: "Po pobraniu: Jak bezpieczny jest Twój system?",
    ctaP: "Użyj darmowego sprawdzenia bezpieczeństwa — przeanalizuj nagłówki HTTP, uzyskaj wynik bezpieczeństwa i konkretne zalecenia w sekundy.",
    ctaBtn: "🔍 Darmowe Sprawdzenie Bezpieczeństwa →",
    ctaTrust1: "✓ Bez rejestracji",
    ctaTrust2: "✓ Natychmiastowy wynik",
    ctaTrust3: "✓ Zgodny z RODO",
    faqTitle: "Często Zadawane Pytania",
    faqs: [
      { q: "Czy pobierania są naprawdę darmowe?", a: "Tak, 100%. Bez konta, e-maila ani karty kredytowej. Wszystkie 4 pakiety są trwale bezpłatne." },
      { q: "Co zawiera OpenClaw Fortress Blueprint?", a: "68-stronicowy przewodnik hardeningu, 22 wykonywalne runbooki, szablony Docker Compose dla Traefik, Caddy i Nginx, skrypty bash i kompletna lista kontrolna bezpieczeństwa." },
      { q: "Czy potrzebuję doświadczenia technicznego?", a: "Materiały są przeznaczone dla doświadczonych self-hostów, ale instrukcje krok po kroku czynią je dostępnymi również dla początkujących." },
      { q: "Czy mogę używać pobrań dla mojej firmy?", a: "Tak! Pobierania są bezpłatne do użytku w systemach osobistych i firmowych. Proszę nie rozprowadzać bez zezwolenia." },
      { q: "Czy pobierania są aktualizowane?", a: "Tak, regularnie aktualizujemy pakiety. Dodaj tę stronę do zakładek i pobieraj ponownie przy nowych wersjach." },
    ],
    dl1Badge: "EKSKLUZYWNY", dl1Title: "OpenClaw Fortress Blueprint 2026", dl1Sub: "Najgłębszy dokument hardeningu OpenClaw na świecie",
    dl1H: ["68-stronicowy przewodnik hardeningu (ciemny tryb PDF)", "22 wykonywalne runbooki + skrypty bash", "Szablony Docker Compose (Traefik, Caddy, Nginx)", "Listy kontrolne + system oceny bezpieczeństwa", "Skrypty hardeningu 1-kliknięciem dla VPS"],
    dl2Badge: "ZESTAW NARZĘDZI", dl2Title: "Zero-Trust Self-Hosting Arsenal 2026", dl2Sub: "Zestaw korporacyjny, teraz bezpłatny dla self-hostów",
    dl2H: ["Kontrola bezpieczeństwa offline (HTML + JS)", "8 szablonów Nuclei dla self-hostingu", "Szablony Vault + Bitwarden + Passkey", "Segmentacja sieci + zestawy reguł zapory", "Skaner sekretów + eksport raportu HTML"],
    dl3Badge: "AI I ZAGROŻENIA", dl3Title: "Moltbot AI Threat Intelligence Kit", dl3Sub: "Modelowanie zagrożeń dla agentów AI — bezpłatne tylko tutaj",
    dl3H: ["Szablon modelowania zagrożeń STRIDE", "14 modeli łańcucha zabijania dla agentów AI", "Generator runbooków (szablony markdown)", "Playbooki iniekcji promptów i zatrucia modeli", "Rzeczywiste studia przypadków 2025/2026"],
    dl4Badge: "ODPOWIEDŹ NA INCYDENTY", dl4Title: "Self-Hosted IR Warfare Manual", dl4Sub: "Prawdziwe playbooki odpowiedzi na incydenty dla self-hostów",
    dl4H: ["18 prawdziwych playbooków odpowiedzi na incydenty", "Przewodniki krok po kroku dla typowych incydentów", "Drzewa decyzyjne + listy kontrolne", "Szablon postmortem + wyciągnięte wnioski", "Skrypty kryminalistyczne (ekstrakcja logów, zrzut pamięci)"],
  },
  ko: {
    seoTitle: "4개의 무료 보안 다운로드 2026 | ClawGuru",
    seoDesc: "무료 보안 다운로드: OpenClaw Fortress Blueprint, Zero-Trust Arsenal, AI 위협 인텔리전스 키트 및 IR Warfare Manual. 계정 불필요, 스팸 없음.",
    keywords: ["무료 보안 다운로드", "보안 강화 가이드", "zero trust 템플릿", "인시던트 대응 플레이북", "자체 호스팅 보안"],
    heroBadge: "4개의 프리미엄 보안 다운로드 — 100% 무료",
    h1Line1: "보안 리소스,",
    h1Line2: "아무도 공유하지 않는",
    heroSub: "자체 호스터를 위한 전문 강화 가이드, 툴킷 및 플레이북 — 보안 전문가가 제작. 스팸 없음, 페이월 없음.",
    trust1: "🔒 ClawGuru 독점",
    trust2: "📥 이미 1,847회 다운로드",
    trust3: "🛡️ 계정 불필요",
    dlBtn: "↓ 지금 다운로드",
    ctaH2: "다운로드 후: 내 시스템은 얼마나 안전한가요?",
    ctaP: "무료 보안 검사를 사용하세요 — HTTP 헤더를 분석하고, 초 내에 보안 점수와 구체적인 권장 사항을 받으세요.",
    ctaBtn: "🔍 무료 보안 검사 →",
    ctaTrust1: "✓ 등록 불필요",
    ctaTrust2: "✓ 즉시 결과",
    ctaTrust3: "✓ GDPR 준수",
    faqTitle: "자주 묻는 질문",
    faqs: [
      { q: "다운로드가 정말 무료인가요?", a: "네, 100% 무료입니다. 계정, 이메일, 신용카드 불필요. 4개 패키지 모두 영구 무료입니다." },
      { q: "OpenClaw Fortress Blueprint에는 무엇이 포함되어 있나요?", a: "68페이지 강화 가이드, 22개의 실행 가능한 런북, Traefik, Caddy 및 Nginx용 Docker Compose 템플릿, bash 스크립트 및 완전한 보안 체크리스트." },
      { q: "기술적 경험이 필요한가요?", a: "자료는 경험 있는 자체 호스터를 위해 설계되었지만, 단계별 지침으로 초보자도 이용 가능합니다." },
      { q: "회사에서 다운로드를 사용할 수 있나요?", a: "네! 개인 및 회사 시스템에서 무료로 사용할 수 있습니다. 허가 없이 재배포하지 마세요." },
      { q: "다운로드가 업데이트되나요?", a: "네, 정기적으로 패키지를 업데이트합니다. 이 페이지를 북마크하세요." },
    ],
    dl1Badge: "독점", dl1Title: "OpenClaw Fortress Blueprint 2026", dl1Sub: "세계에서 가장 깊은 OpenClaw 강화 문서",
    dl1H: ["68페이지 강화 가이드 (다크모드 PDF)", "22개 실행 가능한 런북 + bash 스크립트", "Docker Compose 보안 템플릿 (Traefik, Caddy, Nginx)", "설정 체크리스트 + 보안 채점 시스템", "VPS용 1클릭 강화 스크립트"],
    dl2Badge: "툴킷", dl2Title: "Zero-Trust Self-Hosting Arsenal 2026", dl2Sub: "엔터프라이즈 툴킷, 이제 자체 호스터에게 무료",
    dl2H: ["오프라인 보안 검사 (HTML + JS)", "자체 호스팅용 8개 Nuclei 템플릿", "Vault + Bitwarden + Passkey 템플릿", "네트워크 분리 + 방화벽 규칙셋", "시크릿 스캐너 + HTML 보고서 내보내기"],
    dl3Badge: "AI & 위협", dl3Title: "Moltbot AI 위협 인텔리전스 키트", dl3Sub: "AI 에이전트 위협 모델링 — 여기서만 무료",
    dl3H: ["STRIDE 위협 모델 템플릿", "14개 AI 에이전트 킬 체인 모델", "런북 생성기 (markdown 템플릿)", "프롬프트 인젝션 + 모델 포이즈닝 플레이북", "실제 사례 연구 2025/2026"],
    dl4Badge: "인시던트 대응", dl4Title: "Self-Hosted IR Warfare Manual", dl4Sub: "자체 호스터를 위한 실제 인시던트 대응 플레이북",
    dl4H: ["18개의 실제 인시던트 대응 플레이북", "일반적인 인시던트에 대한 단계별 가이드", "의사결정 트리 + 체크리스트", "사후 검토 템플릿 + 교훈", "포렌식 스크립트 (로그 추출, 메모리 덤프)"],
  },
  af: {
    seoTitle: "4 Gratis Sekuriteitsaflaai 2026 | ClawGuru",
    seoDesc: "Gratis sekuriteitsaflaai: OpenClaw Fortress Blueprint, Zero-Trust Arsenal, AI Dreigingsintelligensie-kit en IR Warfare Manual. Geen rekening nodig.",
    keywords: ["gratis sekuriteitsaflaai", "sekuriteitsversterking gids", "zero trust sjabloon", "insidentreaksie playbook", "self-hosting sekuriteit"],
    heroBadge: "4 Premium Sekuriteitsaflaai — 100% Gratis",
    h1Line1: "Sekuriteitshulpbronne",
    h1Line2: "Wat Niemand Anders Deel Nie",
    heroSub: "Professionele versterkingsgidse, gereedskapskomme en speelboeke — geskep deur sekuriteitskenners vir self-hosting. Geen strooipos, geen betalingsmuur.",
    trust1: "🔒 Eksklusief by ClawGuru",
    trust2: "📥 Reeds 1 847 aflaai",
    trust3: "🛡️ Geen rekening benodig",
    dlBtn: "↓ Laai Nou Af",
    ctaH2: "Na die aflaai: Hoe veilig is jou stelsel?",
    ctaP: "Gebruik die gratis sekuriteitskontrolering — ontleed HTTP-opskrifte, kry 'n sekuriteitspunt en konkrete aanbevelings binne sekondes.",
    ctaBtn: "🔍 Gratis Sekuriteitskontrolering →",
    ctaTrust1: "✓ Geen registrasie",
    ctaTrust2: "✓ Onmiddellike resultaat",
    ctaTrust3: "✓ GDPR-voldoend",
    faqTitle: "Gereeld Gestelde Vrae",
    faqs: [
      { q: "Is die aflaai regtig gratis?", a: "Ja, 100%. Geen rekening, e-pos of kredietkaart nodig nie. Al 4 pakkette is permanent gratis." },
      { q: "Wat is in die OpenClaw Fortress Blueprint?", a: "'n 68-bladsy versterkingsgids, 22 uitvoerbare runboeke, Docker Compose-sjablone vir Traefik, Caddy en Nginx, bash-skrips en 'n volledige sekuriteitskontrolelys." },
      { q: "Het ek tegniese ondervinding nodig?", a: "Die materiaal is ontwerp vir ervare self-hosting-gebruikers, maar stap-vir-stap-instruksies maak dit ook toeganklik vir beginners." },
      { q: "Kan ek die aflaai vir my maatskappy gebruik?", a: "Ja! Die aflaai is gratis te gebruik vir persoonlike en besigheidstelsels. Moet asseblief nie herdistribueer sonder toestemming nie." },
      { q: "Word die aflaai opgedateer?", a: "Ja, ons dateer die pakkette gereeld op. Blaai hierdie bladsy en laai weer af wanneer nuwe weergawes beskikbaar is." },
    ],
    dl1Badge: "EKSKLUSIEF", dl1Title: "OpenClaw Fortress Blueprint 2026", dl1Sub: "Die diepste OpenClaw-versterkingsdokument wêreldwyd",
    dl1H: ["68-bladsy versterkingsgids (donker modus PDF)", "22 uitvoerbare runboeke + bash-skrips", "Docker Compose-sekuriteitsjablone (Traefik, Caddy, Nginx)", "Konfigurasielyste + sekuriteitspuntetelsel", "1-klik versterkingskrips vir VPS"],
    dl2Badge: "GEREEDSKAPSTEL", dl2Title: "Zero-Trust Self-Hosting Arsenal 2026", dl2Sub: "Ondernemingsgereedskapstel, nou gratis vir self-hosting",
    dl2H: ["Aflyn sekuriteitskontrolering (HTML + JS)", "8 Nuclei-sjablone vir self-hosting", "Vault + Bitwarden + Passkey-sjablone", "Netwerksegmentasie + brandmuurreëlstelle", "Geheimskandeerder + HTML-verslaginvoer"],
    dl3Badge: "KI EN DREIGINGS", dl3Title: "Moltbot KI-dreigingsintelligensie-kit", dl3Sub: "KI-agent-dreigingsmodellering — gratis slegs hier",
    dl3H: ["STRIDE-dreigingsmodelsjabloon", "14 KI-agent doodloopkettingmodelle", "Runboekgenerator (markdown-sjablone)", "Opdrag-inspuiting + modelvergiftiging speelboeke", "Werklike gevallestudies 2025/2026"],
    dl4Badge: "INSIDENTREAKSIE", dl4Title: "Self-Hosted IR Warfare Manual", dl4Sub: "Werklike insidentreaksieboeke vir self-hosting-gebruikers",
    dl4H: ["18 werklike insidentreaksie-speelboeke", "Stap-vir-stap-gidse vir algemene insidente", "Beslissingsbome + kontrolelyste", "Postmortem-sjabloon + geleerde lesse", "Forensiese skrips (log-onttrekking, geheue-dumps)"],
  },
}

// Fallback to English for any unknown locale
function getCopy(locale: string) {
  return COPY[locale] ?? COPY.en
}

// ─────────────────────────────────────────────────────────────────────────────
// Download definitions (hrefs are locale-independent)
// ─────────────────────────────────────────────────────────────────────────────
const DL_META = [
  {
    id: "dl1",
    icon: "🏰",
    file: "OpenClaw-Fortress-Blueprint-2026.zip",
    size: "~24 MB",
    format: "ZIP",
    accentBorder: "border-cyan-700",
    accentBg: "from-cyan-950/40",
    btnClass: "bg-cyan-500 hover:bg-cyan-400 text-black",
    badgeColor: "text-cyan-400 border-cyan-400",
    href: "/api/downloads/openclaw-fortress-blueprint-2026",
  },
  {
    id: "dl2",
    icon: "🛡️",
    file: "Zero-Trust-Self-Hosting-Arsenal-2026.zip",
    size: "~9 MB",
    format: "ZIP",
    accentBorder: "border-blue-700",
    accentBg: "from-blue-950/40",
    btnClass: "bg-blue-9000 hover:bg-blue-400 text-white",
    badgeColor: "text-blue-400 border-blue-400",
    href: "/api/downloads/zero-trust-self-hosting-arsenal-2026",
  },
  {
    id: "dl3",
    icon: "🤖",
    file: "Moltbot-AI-Threat-Intelligence-Kit-2026.zip",
    size: "~15 MB",
    format: "ZIP",
    accentBorder: "border-purple-700",
    accentBg: "from-purple-950/40",
    btnClass: "bg-purple-9000 hover:bg-purple-400 text-white",
    badgeColor: "text-purple-400 border-purple-400",
    href: "/api/downloads/moltbot-ai-threat-intelligence-kit-2026",
  },
  {
    id: "dl4",
    icon: "⚔️",
    file: "Self-Hosted-IR-Warfare-Manual-2026.zip",
    size: "~31 MB",
    format: "ZIP",
    accentBorder: "border-orange-700",
    accentBg: "from-orange-950/40",
    btnClass: "bg-orange-500 hover:bg-orange-400 text-black",
    badgeColor: "text-orange-400 border-orange-400",
    href: "/api/downloads/self-hosted-ir-warfare-manual-2026",
  },
]

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "en") as Locale
  const copy = getCopy(locale)
  const pageUrl = `${SITE_URL}/${locale}${PATH}`

  return {
    title: copy.seoTitle,
    description: copy.seoDesc,
    keywords: copy.keywords,
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: {
      title: copy.seoTitle,
      description: copy.seoDesc,
      url: pageUrl,
      type: "website",
      images: ["/og-image.png"],
    },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

export default function LocaleDownloadsPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "en") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  const copy = getCopy(locale)
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isRtl = locale === "ar"

  // Assemble per-locale download details
  const downloads = DL_META.map((meta) => {
    const c = copy as typeof copy
    const idx = meta.id as "dl1" | "dl2" | "dl3" | "dl4"
    return {
      ...meta,
      badge: c[`${idx}Badge`],
      title: c[`${idx}Title`],
      subtitle: c[`${idx}Sub`],
      highlights: c[`${idx}H`] as string[],
    }
  })

  // JSON-LD schemas
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: copy.faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  }
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: copy.seoTitle,
    description: copy.seoDesc,
    url: pageUrl,
    inLanguage: locale,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
  }

  return (
    <div className="min-h-screen bg-gray-950" dir={isRtl ? "rtl" : "ltr"}>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      {/* ── Hero ── */}
      <div className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/30 via-gray-950 to-blue-950/20 pointer-events-none" />
        <div className="container mx-auto px-4">
          <div className="py-20 max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-cyan-900/40 border border-cyan-700 rounded-full px-4 py-1.5 text-sm text-cyan-300 font-semibold mb-6">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse inline-block" />
              {copy.heroBadge}
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 text-gray-100 leading-tight">
              {copy.h1Line1}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                {copy.h1Line2}
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">{copy.heroSub}</p>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              {[copy.trust1, copy.trust2, copy.trust3].map((t) => (
                <span key={t} className="bg-gray-800 border border-gray-700 rounded-full px-4 py-1.5 text-gray-300">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Download Cards ── */}
      <div className="container mx-auto px-4">
        <div className="py-16 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {downloads.map((dl) => (
              <div
                key={dl.id}
                className={`rounded-2xl border ${dl.accentBorder} bg-gradient-to-br ${dl.accentBg} to-gray-900 p-6 flex flex-col`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl">{dl.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className={`inline-block text-xs font-bold border rounded px-2 py-0.5 mb-2 ${dl.badgeColor}`}>
                      {dl.badge}
                    </div>
                    <h2 className="text-xl font-black text-gray-100 leading-snug">{dl.title}</h2>
                    <p className="text-sm text-gray-400 mt-1">{dl.subtitle}</p>
                  </div>
                </div>
                <div className="font-mono text-xs text-gray-500 mb-3 truncate">📁 {dl.file}</div>
                <div className="flex gap-3 text-xs mb-5">
                  <span className="bg-gray-800 border border-gray-700 rounded px-2 py-0.5 text-gray-300">{dl.size}</span>
                  <span className="bg-gray-800 border border-gray-700 rounded px-2 py-0.5 text-gray-300">{dl.format}</span>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {dl.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-cyan-500 mt-0.5 flex-shrink-0">✓</span>
                      {h}
                    </li>
                  ))}
                </ul>
                <a
                  href={dl.href}
                  className={`w-full text-center font-black text-base rounded-xl px-6 py-3 transition-all ${dl.btnClass} shadow-lg`}
                >
                  {copy.dlBtn}
                </a>
              </div>
            ))}
          </div>

          {/* ── FAQ Section ── */}
          <section className="mt-20 mb-16">
            <h2 className="text-3xl font-black text-gray-100 mb-8 text-center">{copy.faqTitle}</h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              {copy.faqs.map(({ q, a }, i) => (
                <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                  <h3 className="font-bold text-cyan-400 mb-2">{q}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Bottom CTA ── */}
          <div className="rounded-2xl bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-800 p-8 text-center">
            <div className="text-3xl mb-3">⚡</div>
            <h2 className="text-2xl font-black text-gray-100 mb-3">{copy.ctaH2}</h2>
            <p className="text-gray-300 mb-6 max-w-xl mx-auto">{copy.ctaP}</p>
            <a
              href={`/${locale}/securitycheck`}
              className="inline-block bg-cyan-500 hover:bg-cyan-400 text-black font-black text-lg rounded-xl px-8 py-4 transition-colors shadow-xl"
            >
              {copy.ctaBtn}
            </a>
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <span>{copy.ctaTrust1}</span>
              <span>{copy.ctaTrust2}</span>
              <span>{copy.ctaTrust3}</span>
            </div>
          </div>

          {/* ── Internal Link Grid ── */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { href: `/${locale}/securitycheck`, label: "Security Check", desc: "Live HTTP Scan" },
              { href: `/${locale}/runbooks`, label: "Runbooks", desc: "600+ Playbooks" },
              { href: `/${locale}/openclaw`, label: "OpenClaw", desc: "Framework Docs" },
              { href: `/${locale}/moltbot/security-framework`, label: "Moltbot", desc: "Security Framework" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
              >
                <div className="font-semibold text-cyan-400 text-sm">{link.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{link.desc}</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
