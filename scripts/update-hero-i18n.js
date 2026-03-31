const fs = require("fs")
const path = require("path")
const DIR = path.join(__dirname, "..", "dictionaries")

const badges = {
  de: {
    hero_badge: "Mycelial Engine \u00b7 4,2 Mio. Runbooks \u00b7 Executable Security Content",
    hero_title: "Security-Operationen, die wirklich funktionieren.",
    hero_sub: "ClawGuru ist die KI-gest\u00fctzte SecOps-Plattform mit \u00fcber 4,2 Millionen ausf\u00fchrbaren Runbooks \u2013 f\u00fcr Incident Response, Hardening und Compliance in Echtzeit. Vom Problem zum Fix in unter 30 Sekunden.",
    hero_daypass: "Daypass starten \u2013 9 \u20ac/24 h",
    hero_tryNow: "Kostenlos ausprobieren"
  },
  en: {
    hero_badge: "Mycelial Engine \u00b7 4.2 M Runbooks \u00b7 Executable Security Content",
    hero_title: "Security Operations That Actually Work.",
    hero_sub: "ClawGuru is the AI-powered SecOps platform with 4.2 million executable runbooks \u2013 for incident response, hardening, and compliance in real time. From problem to fix in under 30 seconds.",
    hero_daypass: "Start Daypass \u2013 \u20ac9/24 h",
    hero_tryNow: "Try it for free"
  },
  es: {
    hero_badge: "Mycelial Engine \u00b7 4,2 M Runbooks \u00b7 Contenido de Seguridad Ejecutable",
    hero_title: "Operaciones de seguridad que realmente funcionan.",
    hero_sub: "ClawGuru es la plataforma SecOps impulsada por IA con m\u00e1s de 4,2 millones de runbooks ejecutables \u2013 para respuesta a incidentes, hardening y cumplimiento en tiempo real. Del problema a la soluci\u00f3n en menos de 30 segundos.",
    hero_daypass: "Iniciar Daypass \u2013 9 \u20ac/24 h",
    hero_tryNow: "Probar gratis"
  },
  fr: {
    hero_badge: "Mycelial Engine \u00b7 4,2 M Runbooks \u00b7 Contenu S\u00e9curit\u00e9 Ex\u00e9cutable",
    hero_title: "Des op\u00e9rations de s\u00e9curit\u00e9 qui fonctionnent vraiment.",
    hero_sub: "ClawGuru est la plateforme SecOps propuls\u00e9e par l\u2019IA avec plus de 4,2 millions de runbooks ex\u00e9cutables \u2013 pour la r\u00e9ponse aux incidents, le durcissement et la conformit\u00e9 en temps r\u00e9el. Du probl\u00e8me au correctif en moins de 30 secondes.",
    hero_daypass: "D\u00e9marrer Daypass \u2013 9 \u20ac/24 h",
    hero_tryNow: "Essayer gratuitement"
  },
  pt: {
    hero_badge: "Mycelial Engine \u00b7 4,2 M Runbooks \u00b7 Conte\u00fado de Seguran\u00e7a Execut\u00e1vel",
    hero_title: "Opera\u00e7\u00f5es de seguran\u00e7a que realmente funcionam.",
    hero_sub: "ClawGuru \u00e9 a plataforma SecOps alimentada por IA com mais de 4,2 milh\u00f5es de runbooks execut\u00e1veis \u2013 para resposta a incidentes, hardening e conformidade em tempo real. Do problema \u00e0 corre\u00e7\u00e3o em menos de 30 segundos.",
    hero_daypass: "Iniciar Daypass \u2013 \u20ac9/24 h",
    hero_tryNow: "Experimentar gr\u00e1tis"
  },
  it: {
    hero_badge: "Mycelial Engine \u00b7 4,2 M Runbook \u00b7 Contenuto di Sicurezza Eseguibile",
    hero_title: "Operazioni di sicurezza che funzionano davvero.",
    hero_sub: "ClawGuru \u00e8 la piattaforma SecOps alimentata dall\u2019IA con oltre 4,2 milioni di runbook eseguibili \u2013 per incident response, hardening e conformit\u00e0 in tempo reale. Dal problema alla correzione in meno di 30 secondi.",
    hero_daypass: "Inizia Daypass \u2013 9 \u20ac/24 h",
    hero_tryNow: "Prova gratis"
  },
  ru: {
    hero_badge: "Mycelial Engine \u00b7 4,2 \u043c\u043b\u043d Runbook \u00b7 \u0418\u0441\u043f\u043e\u043b\u043d\u044f\u0435\u043c\u044b\u0439 \u043a\u043e\u043d\u0442\u0435\u043d\u0442 \u0431\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u043e\u0441\u0442\u0438",
    hero_title: "\u041e\u043f\u0435\u0440\u0430\u0446\u0438\u0438 \u0431\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u043e\u0441\u0442\u0438, \u043a\u043e\u0442\u043e\u0440\u044b\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0442\u0435\u043b\u044c\u043d\u043e \u0440\u0430\u0431\u043e\u0442\u0430\u044e\u0442.",
    hero_sub: "ClawGuru \u2014 SecOps-\u043f\u043b\u0430\u0442\u0444\u043e\u0440\u043c\u0430 \u043d\u0430 \u0431\u0430\u0437\u0435 \u0418\u0418 \u0441 \u0431\u043e\u043b\u0435\u0435 \u0447\u0435\u043c 4,2 \u043c\u0438\u043b\u043b\u0438\u043e\u043d\u0430\u043c\u0438 \u0438\u0441\u043f\u043e\u043b\u043d\u044f\u0435\u043c\u044b\u0445 runbook \u2014 \u0434\u043b\u044f \u0440\u0435\u0430\u0433\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f \u043d\u0430 \u0438\u043d\u0446\u0438\u0434\u0435\u043d\u0442\u044b, \u0443\u043a\u0440\u0435\u043f\u043b\u0435\u043d\u0438\u044f \u0438 \u0441\u043e\u043e\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0438\u044f \u0432 \u0440\u0435\u0430\u043b\u044c\u043d\u043e\u043c \u0432\u0440\u0435\u043c\u0435\u043d\u0438. \u041e\u0442 \u043f\u0440\u043e\u0431\u043b\u0435\u043c\u044b \u0434\u043e \u0438\u0441\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u044f \u043c\u0435\u043d\u0435\u0435 \u0447\u0435\u043c \u0437\u0430 30 \u0441\u0435\u043a\u0443\u043d\u0434.",
    hero_daypass: "\u041d\u0430\u0447\u0430\u0442\u044c Daypass \u2013 \u20ac9/24 \u0447",
    hero_tryNow: "\u041f\u043e\u043f\u0440\u043e\u0431\u043e\u0432\u0430\u0442\u044c \u0431\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u043e"
  },
  zh: {
    hero_badge: "Mycelial Engine \u00b7 420\u4e07\u8fd0\u884c\u624b\u518c \u00b7 \u53ef\u6267\u884c\u5b89\u5168\u5185\u5bb9",
    hero_title: "\u771f\u6b63\u6709\u6548\u7684\u5b89\u5168\u8fd0\u8425\u3002",
    hero_sub: "ClawGuru \u662f AI \u9a71\u52a8\u7684 SecOps \u5e73\u53f0\uff0c\u62e5\u6709\u8d85\u8fc7 420 \u4e07\u4e2a\u53ef\u6267\u884c\u8fd0\u884c\u624b\u518c\u2014\u2014\u7528\u4e8e\u4e8b\u4ef6\u54cd\u5e94\u3001\u52a0\u56fa\u548c\u5b9e\u65f6\u5408\u89c4\u3002\u4ece\u95ee\u9898\u5230\u4fee\u590d\u4e0d\u5230 30 \u79d2\u3002",
    hero_daypass: "\u5f00\u59cb Daypass \u2013 \u20ac9/24\u5c0f\u65f6",
    hero_tryNow: "\u514d\u8d39\u8bd5\u7528"
  },
  ja: {
    hero_badge: "Mycelial Engine \u00b7 420\u4e07\u30e9\u30f3\u30d6\u30c3\u30af \u00b7 \u5b9f\u884c\u53ef\u80fd\u306a\u30bb\u30ad\u30e5\u30ea\u30c6\u30a3\u30b3\u30f3\u30c6\u30f3\u30c4",
    hero_title: "\u672c\u5f53\u306b\u6a5f\u80fd\u3059\u308b\u30bb\u30ad\u30e5\u30ea\u30c6\u30a3\u30aa\u30da\u30ec\u30fc\u30b7\u30e7\u30f3\u3002",
    hero_sub: "ClawGuru\u306f420\u4e07\u4ee5\u4e0a\u306e\u5b9f\u884c\u53ef\u80fd\u306a\u30e9\u30f3\u30d6\u30c3\u30af\u3092\u6301\u3064AI\u642d\u8f09SecOps\u30d7\u30e9\u30c3\u30c8\u30d5\u30a9\u30fc\u30e0 \u2013 \u30a4\u30f3\u30b7\u30c7\u30f3\u30c8\u5bfe\u5fdc\u3001\u30cf\u30fc\u30c9\u30cb\u30f3\u30b0\u3001\u30ea\u30a2\u30eb\u30bf\u30a4\u30e0\u30b3\u30f3\u30d7\u30e9\u30a4\u30a2\u30f3\u30b9\u306b\u5bfe\u5fdc\u3002\u554f\u984c\u304b\u3089\u4fee\u6b63\u307e\u306730\u79d2\u4ee5\u5185\u3002",
    hero_daypass: "Daypass\u958b\u59cb \u2013 \u20ac9/24\u6642\u9593",
    hero_tryNow: "\u7121\u6599\u3067\u8a66\u3059"
  },
  ar: {
    hero_badge: "Mycelial Engine \u00b7 4.2 \u0645\u0644\u064a\u0648\u0646 \u062f\u0644\u064a\u0644 \u062a\u0634\u063a\u064a\u0644 \u00b7 \u0645\u062d\u062a\u0648\u0649 \u0623\u0645\u0646\u064a \u0642\u0627\u0628\u0644 \u0644\u0644\u062a\u0646\u0641\u064a\u0630",
    hero_title: "\u0639\u0645\u0644\u064a\u0627\u062a \u0623\u0645\u0646\u064a\u0629 \u062a\u0639\u0645\u0644 \u0641\u0639\u0644\u0627\u064b.",
    hero_sub: "ClawGuru \u0647\u064a \u0645\u0646\u0635\u0629 SecOps \u0627\u0644\u0645\u062f\u0639\u0648\u0645\u0629 \u0628\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a \u0645\u0639 \u0623\u0643\u062b\u0631 \u0645\u0646 4.2 \u0645\u0644\u064a\u0648\u0646 \u062f\u0644\u064a\u0644 \u062a\u0634\u063a\u064a\u0644 \u0642\u0627\u0628\u0644 \u0644\u0644\u062a\u0646\u0641\u064a\u0630 \u2013 \u0644\u0644\u0627\u0633\u062a\u062c\u0627\u0628\u0629 \u0644\u0644\u062d\u0648\u0627\u062f\u062b \u0648\u0627\u0644\u062a\u0642\u0648\u064a\u0629 \u0648\u0627\u0644\u0627\u0645\u062a\u062b\u0627\u0644 \u0641\u064a \u0627\u0644\u0648\u0642\u062a \u0627\u0644\u0641\u0639\u0644\u064a. \u0645\u0646 \u0627\u0644\u0645\u0634\u0643\u0644\u0629 \u0625\u0644\u0649 \u0627\u0644\u0625\u0635\u0644\u0627\u062d \u0641\u064a \u0623\u0642\u0644 \u0645\u0646 30 \u062b\u0627\u0646\u064a\u0629.",
    hero_daypass: "\u0627\u0628\u062f\u0623 Daypass \u2013 \u20ac9/24 \u0633\u0627\u0639\u0629",
    hero_tryNow: "\u062c\u0631\u0651\u0628 \u0645\u062c\u0627\u0646\u064b\u0627"
  },
  nl: {
    hero_badge: "Mycelial Engine \u00b7 4,2 M Runbooks \u00b7 Uitvoerbare Beveiligingscontent",
    hero_title: "Beveiligingsoperaties die echt werken.",
    hero_sub: "ClawGuru is het AI-aangedreven SecOps-platform met meer dan 4,2 miljoen uitvoerbare runbooks \u2013 voor incidentrespons, hardening en compliance in realtime. Van probleem naar oplossing in minder dan 30 seconden.",
    hero_daypass: "Start Daypass \u2013 \u20ac9/24u",
    hero_tryNow: "Gratis proberen"
  },
  hi: {
    hero_badge: "Mycelial Engine \u00b7 4.2 M \u0930\u0928\u092c\u0941\u0915 \u00b7 \u0928\u093f\u0937\u094d\u092a\u093e\u0926\u0928 \u092f\u094b\u0917\u094d\u092f \u0938\u0941\u0930\u0915\u094d\u0937\u093e \u0938\u093e\u092e\u0917\u094d\u0930\u0940",
    hero_title: "\u0938\u0941\u0930\u0915\u094d\u0937\u093e \u0938\u0902\u091a\u093e\u0932\u0928 \u091c\u094b \u0935\u093e\u0938\u094d\u0924\u0935 \u092e\u0947\u0902 \u0915\u093e\u092e \u0915\u0930\u0924\u0947 \u0939\u0948\u0902\u0964",
    hero_sub: "ClawGuru AI-\u0938\u0902\u091a\u093e\u0932\u093f\u0924 SecOps \u092a\u094d\u0932\u0947\u091f\u0ab1\u0949\u0930\u094d\u092e \u0939\u0948 \u091c\u093f\u0938\u092e\u0947\u0902 4.2 \u092e\u093f\u0932\u093f\u092f\u0928 \u0938\u0947 \u0905\u0927\u093f\u0915 \u0928\u093f\u0937\u094d\u092a\u093e\u0926\u0928 \u092f\u094b\u0917\u094d\u092f \u0930\u0928\u092c\u0941\u0915 \u0939\u0948\u0902 \u2013 \u0907\u0902\u0938\u093f\u0921\u0947\u0902\u091f \u0930\u093f\u0938\u094d\u092a\u0949\u0902\u0938, \u0939\u093e\u0930\u094d\u0921\u0928\u093f\u0902\u0917 \u0914\u0930 \u0930\u0940\u092f\u0932-\u091f\u093e\u0907\u092e \u0905\u0928\u0941\u092a\u093e\u0932\u0928 \u0915\u0947 \u0932\u093f\u090f\u0964 \u0938\u092e\u0938\u094d\u092f\u093e \u0938\u0947 \u0938\u092e\u093e\u0927\u093e\u0928 30 \u0938\u0947\u0915\u0902\u0921 \u0938\u0947 \u0915\u092e \u092e\u0947\u0902\u0964",
    hero_daypass: "Daypass \u0936\u0941\u0930\u0942 \u0915\u0930\u0947\u0902 \u2013 \u20ac9/24 \u0918\u0902\u091f\u0947",
    hero_tryNow: "\u092e\u0941\u092b\u093c\u094d\u0924 \u092e\u0947\u0902 \u0906\u091c\u093c\u092e\u093e\u090f\u0901"
  },
  tr: {
    hero_badge: "Mycelial Engine \u00b7 4,2 M Runbook \u00b7 \u00c7al\u0131\u015ft\u0131r\u0131labilir G\u00fcvenlik \u0130\u00e7eri\u011fi",
    hero_title: "Ger\u00e7ekten i\u015fe yarayan g\u00fcvenlik operasyonlar\u0131.",
    hero_sub: "ClawGuru, 4,2 milyondan fazla \u00e7al\u0131\u015ft\u0131r\u0131labilir runbook i\u00e7eren yapay zek\u00e2 destekli SecOps platformudur \u2013 olay m\u00fcdahalesi, g\u00fc\u00e7lendirme ve ger\u00e7ek zamanl\u0131 uyumluluk i\u00e7in. Sorundan \u00e7\u00f6z\u00fcme 30 saniyeden k\u0131sa s\u00fcrede.",
    hero_daypass: "Daypass Ba\u015flat \u2013 \u20ac9/24 saat",
    hero_tryNow: "\u00dccretsiz dene"
  },
  pl: {
    hero_badge: "Mycelial Engine \u00b7 4,2 M Runbook\u00f3w \u00b7 Wykonywalna Tre\u015b\u0107 Bezpiecze\u0144stwa",
    hero_title: "Operacje bezpiecze\u0144stwa, kt\u00f3re naprawd\u0119 dzia\u0142aj\u0105.",
    hero_sub: "ClawGuru to platforma SecOps nap\u0119dzana AI z ponad 4,2 milionami wykonywalnych runbook\u00f3w \u2013 do reagowania na incydenty, utwardzania i zgodno\u015bci w czasie rzeczywistym. Od problemu do naprawy w mniej ni\u017c 30 sekund.",
    hero_daypass: "Rozpocznij Daypass \u2013 \u20ac9/24 h",
    hero_tryNow: "Wypr\u00f3buj za darmo"
  },
  ko: {
    hero_badge: "Mycelial Engine \u00b7 420\ub9cc \ub7f0\ubd81 \u00b7 \uc2e4\ud589 \uac00\ub2a5\ud55c \ubcf4\uc548 \ucf58\ud150\uce20",
    hero_title: "\uc2e4\uc81c\ub85c \uc791\ub3d9\ud558\ub294 \ubcf4\uc548 \uc6b4\uc601.",
    hero_sub: "ClawGuru\ub294 420\ub9cc \uac1c \uc774\uc0c1\uc758 \uc2e4\ud589 \uac00\ub2a5\ud55c \ub7f0\ubd81\uc744 \uac16\ucd98 AI \uae30\ubc18 SecOps \ud50c\ub7ab\ud3fc\uc785\ub2c8\ub2e4 \u2013 \uc778\uc2dc\ub358\ud2b8 \ub300\uc751, \ud558\ub4dc\ub2dd, \uc2e4\uc2dc\uac04 \ucef4\ud50c\ub77c\uc774\uc5b8\uc2a4\ub97c \uc704\ud574. \ubb38\uc81c\uc5d0\uc11c \uc218\uc815\uae4c\uc9c0 30\ucd08 \uc774\ub0b4.",
    hero_daypass: "Daypass \uc2dc\uc791 \u2013 \u20ac9/24\uc2dc\uac04",
    hero_tryNow: "\ubb34\ub8cc \uccb4\ud5d8"
  }
}

for (const [loc, updates] of Object.entries(badges)) {
  const f = path.join(DIR, loc + ".json")
  const d = JSON.parse(fs.readFileSync(f, "utf-8"))
  Object.assign(d.homepage, updates)
  fs.writeFileSync(f, JSON.stringify(d, null, 2) + "\n")
  console.log("Updated", loc)
}
console.log("Done")
