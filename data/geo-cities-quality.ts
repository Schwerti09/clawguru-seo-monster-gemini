/**
 * Quality Geo Landing Pages Configuration
 * 50 cities with local compliance context for IT Security 2026 landing pages
 */

export type ComplianceFramework = "DSGVO_BSI_NIS2" | "UK_GDPR_CYBER_ESSENTIALS" | "NIST_SOC2" | "NIS2_GDPR" | "LGPD" | "PII" | "PDPA" | "LDPD"

export interface GeoCityQuality {
  slug: string
  nameDE: string
  nameEN: string
  country: string
  countryCode: string
  complianceFramework: ComplianceFramework
  localRegulator: string
  region: string
}

export const GEO_CITIES_QUALITY: GeoCityQuality[] = [
  // DACH (10)
  { slug: "berlin", nameDE: "Berlin", nameEN: "Berlin", country: "Deutschland", countryCode: "DE", complianceFramework: "DSGVO_BSI_NIS2", localRegulator: "BSI (Bundesamt für Sicherheit in der Informationstechnik)", region: "DACH" },
  { slug: "muenchen", nameDE: "München", nameEN: "Munich", country: "Deutschland", countryCode: "DE", complianceFramework: "DSGVO_BSI_NIS2", localRegulator: "BSI (Bundesamt für Sicherheit in der Informationstechnik)", region: "DACH" },
  { slug: "hamburg", nameDE: "Hamburg", nameEN: "Hamburg", country: "Deutschland", countryCode: "DE", complianceFramework: "DSGVO_BSI_NIS2", localRegulator: "BSI (Bundesamt für Sicherheit in der Informationstechnik)", region: "DACH" },
  { slug: "frankfurt", nameDE: "Frankfurt", nameEN: "Frankfurt", country: "Deutschland", countryCode: "DE", complianceFramework: "DSGVO_BSI_NIS2", localRegulator: "BSI (Bundesamt für Sicherheit in der Informationstechnik)", region: "DACH" },
  { slug: "koeln", nameDE: "Köln", nameEN: "Cologne", country: "Deutschland", countryCode: "DE", complianceFramework: "DSGVO_BSI_NIS2", localRegulator: "BSI (Bundesamt für Sicherheit in der Informationstechnik)", region: "DACH" },
  { slug: "wien", nameDE: "Wien", nameEN: "Vienna", country: "Österreich", countryCode: "AT", complianceFramework: "DSGVO_BSI_NIS2", localRegulator: "BSI Austria (Bundesamt für Verfassungsschutz und Terrorismusbekämpfung)", region: "DACH" },
  { slug: "zurich", nameDE: "Zürich", nameEN: "Zurich", country: "Schweiz", countryCode: "CH", complianceFramework: "DSGVO_BSI_NIS2", localRegulator: "MELANI (Melde- und Analysestelle Informationssicherung)", region: "DACH" },
  { slug: "stuttgart", nameDE: "Stuttgart", nameEN: "Stuttgart", country: "Deutschland", countryCode: "DE", complianceFramework: "DSGVO_BSI_NIS2", localRegulator: "BSI (Bundesamt für Sicherheit in der Informationstechnik)", region: "DACH" },
  { slug: "duesseldorf", nameDE: "Düsseldorf", nameEN: "Düsseldorf", country: "Deutschland", countryCode: "DE", complianceFramework: "DSGVO_BSI_NIS2", localRegulator: "BSI (Bundesamt für Sicherheit in der Informationstechnik)", region: "DACH" },
  { slug: "leipzig", nameDE: "Leipzig", nameEN: "Leipzig", country: "Deutschland", countryCode: "DE", complianceFramework: "DSGVO_BSI_NIS2", localRegulator: "BSI (Bundesamt für Sicherheit in der Informationstechnik)", region: "DACH" },

  // UK (5)
  { slug: "london", nameDE: "London", nameEN: "London", country: "Vereinigtes Königreich", countryCode: "GB", complianceFramework: "UK_GDPR_CYBER_ESSENTIALS", localRegulator: "NCSC (National Cyber Security Centre)", region: "UK" },
  { slug: "manchester", nameDE: "Manchester", nameEN: "Manchester", country: "Vereinigtes Königreich", countryCode: "GB", complianceFramework: "UK_GDPR_CYBER_ESSENTIALS", localRegulator: "NCSC (National Cyber Security Centre)", region: "UK" },
  { slug: "edinburgh", nameDE: "Edinburgh", nameEN: "Edinburgh", country: "Vereinigtes Königreich", countryCode: "GB", complianceFramework: "UK_GDPR_CYBER_ESSENTIALS", localRegulator: "NCSC (National Cyber Security Centre)", region: "UK" },
  { slug: "bristol", nameDE: "Bristol", nameEN: "Bristol", country: "Vereinigtes Königreich", countryCode: "GB", complianceFramework: "UK_GDPR_CYBER_ESSENTIALS", localRegulator: "NCSC (National Cyber Security Centre)", region: "UK" },
  { slug: "birmingham", nameDE: "Birmingham", nameEN: "Birmingham", country: "Vereinigtes Königreich", countryCode: "GB", complianceFramework: "UK_GDPR_CYBER_ESSENTIALS", localRegulator: "NCSC (National Cyber Security Centre)", region: "UK" },

  // USA (5)
  { slug: "new-york", nameDE: "New York", nameEN: "New York", country: "Vereinigte Staaten", countryCode: "US", complianceFramework: "NIST_SOC2", localRegulator: "CISA (Cybersecurity and Infrastructure Security Agency)", region: "USA" },
  { slug: "san-francisco", nameDE: "San Francisco", nameEN: "San Francisco", country: "Vereinigte Staaten", countryCode: "US", complianceFramework: "NIST_SOC2", localRegulator: "CISA (Cybersecurity and Infrastructure Security Agency)", region: "USA" },
  { slug: "austin", nameDE: "Austin", nameEN: "Austin", country: "Vereinigte Staaten", countryCode: "US", complianceFramework: "NIST_SOC2", localRegulator: "CISA (Cybersecurity and Infrastructure Security Agency)", region: "USA" },
  { slug: "seattle", nameDE: "Seattle", nameEN: "Seattle", country: "Vereinigte Staaten", countryCode: "US", complianceFramework: "NIST_SOC2", localRegulator: "CISA (Cybersecurity and Infrastructure Security Agency)", region: "USA" },
  { slug: "chicago", nameDE: "Chicago", nameEN: "Chicago", country: "Vereinigte Staaten", countryCode: "US", complianceFramework: "NIST_SOC2", localRegulator: "CISA (Cybersecurity and Infrastructure Security Agency)", region: "USA" },

  // Benelux (5)
  { slug: "amsterdam", nameDE: "Amsterdam", nameEN: "Amsterdam", country: "Niederlande", countryCode: "NL", complianceFramework: "NIS2_GDPR", localRegulator: "NCSC-NL (Nationaal Cyber Security Centrum)", region: "Benelux" },
  { slug: "rotterdam", nameDE: "Rotterdam", nameEN: "Rotterdam", country: "Niederlande", countryCode: "NL", complianceFramework: "NIS2_GDPR", localRegulator: "NCSC-NL (Nationaal Cyber Security Centrum)", region: "Benelux" },
  { slug: "bruessel", nameDE: "Brüssel", nameEN: "Brussels", country: "Belgien", countryCode: "BE", complianceFramework: "NIS2_GDPR", localRegulator: "CCB (Centre for Cybersecurity Belgium)", region: "Benelux" },
  { slug: "antwerpen", nameDE: "Antwerpen", nameEN: "Antwerp", country: "Belgien", countryCode: "BE", complianceFramework: "NIS2_GDPR", localRegulator: "CCB (Centre for Cybersecurity Belgium)", region: "Benelux" },
  { slug: "utrecht", nameDE: "Utrecht", nameEN: "Utrecht", country: "Niederlande", countryCode: "NL", complianceFramework: "NIS2_GDPR", localRegulator: "NCSC-NL (Nationaal Cyber Security Centrum)", region: "Benelux" },

  // Asia (5)
  { slug: "singapur", nameDE: "Singapur", nameEN: "Singapore", country: "Singapur", countryCode: "SG", complianceFramework: "PDPA", localRegulator: "CSA (Cyber Security Agency of Singapore)", region: "Asia" },
  { slug: "tokyo", nameDE: "Tokio", nameEN: "Tokyo", country: "Japan", countryCode: "JP", complianceFramework: "PII", localRegulator: "NISC (National Center of Incident readiness and Strategy for Cybersecurity)", region: "Asia" },
  { slug: "seoul", nameDE: "Seoul", nameEN: "Seoul", country: "Südkorea", countryCode: "KR", complianceFramework: "PII", localRegulator: "KISA (Korea Internet & Security Agency)", region: "Asia" },
  { slug: "bangalore", nameDE: "Bangalore", nameEN: "Bangalore", country: "Indien", countryCode: "IN", complianceFramework: "PDPA", localRegulator: "CERT-In (Indian Computer Emergency Response Team)", region: "Asia" },
  { slug: "mumbai", nameDE: "Mumbai", nameEN: "Mumbai", country: "Indien", countryCode: "IN", complianceFramework: "PDPA", localRegulator: "CERT-In (Indian Computer Emergency Response Team)", region: "Asia" },

  // LatAm (5)
  { slug: "sao-paulo", nameDE: "São Paulo", nameEN: "São Paulo", country: "Brasilien", countryCode: "BR", complianceFramework: "LGPD", localRegulator: "CSIRT.br (Brazilian Computer Emergency Response Team)", region: "LatAm" },
  { slug: "mexico-city", nameDE: "Mexiko-Stadt", nameEN: "Mexico City", country: "Mexiko", countryCode: "MX", complianceFramework: "LDPD", localRegulator: "CERT-MX (Computer Emergency Response Team Mexico)", region: "LatAm" },
  { slug: "buenos-aires", nameDE: "Buenos Aires", nameEN: "Buenos Aires", country: "Argentinien", countryCode: "AR", complianceFramework: "PDPA", localRegulator: "CERT.ar (Computer Emergency Response Team Argentina)", region: "LatAm" },
  { slug: "bogota", nameDE: "Bogotá", nameEN: "Bogotá", country: "Kolumbien", countryCode: "CO", complianceFramework: "PDPA", localRegulator: "Col-CSIRT (Colombian Computer Security Incident Response Team)", region: "LatAm" },
  { slug: "lima", nameDE: "Lima", nameEN: "Lima", country: "Peru", countryCode: "PE", complianceFramework: "PDPA", localRegulator: "PERU-CERT (Peruvian Computer Emergency Response Team)", region: "LatAm" },

  // Nordics (5)
  { slug: "stockholm", nameDE: "Stockholm", nameEN: "Stockholm", country: "Schweden", countryCode: "SE", complianceFramework: "NIS2_GDPR", localRegulator: "MSB (Myndigheten för samhällsskydd och beredskap)", region: "Nordics" },
  { slug: "copenhagen", nameDE: "Kopenhagen", nameEN: "Copenhagen", country: "Dänemark", countryCode: "DK", complianceFramework: "NIS2_GDPR", localRegulator: "CFCS (Center for Cyber Security)", region: "Nordics" },
  { slug: "oslo", nameDE: "Oslo", nameEN: "Oslo", country: "Norwegen", countryCode: "NO", complianceFramework: "NIS2_GDPR", localRegulator: "NCSC Norway (National Cyber Security Centre)", region: "Nordics" },
  { slug: "helsinki", nameDE: "Helsinki", nameEN: "Helsinki", country: "Finnland", countryCode: "FI", complianceFramework: "NIS2_GDPR", localRegulator: "NCSC-FI (Finnish National Cyber Security Centre)", region: "Nordics" },
  { slug: "reykjavik", nameDE: "Reykjavik", nameEN: "Reykjavik", country: "Island", countryCode: "IS", complianceFramework: "NIS2_GDPR", localRegulator: "CERT-IS (Icelandic National CERT)", region: "Nordics" },

  // Other EU (10)
  { slug: "paris", nameDE: "Paris", nameEN: "Paris", country: "Frankreich", countryCode: "FR", complianceFramework: "NIS2_GDPR", localRegulator: "ANSSI (Agence nationale de la sécurité des systèmes d'information)", region: "EU" },
  { slug: "madrid", nameDE: "Madrid", nameEN: "Madrid", country: "Spanien", countryCode: "ES", complianceFramework: "NIS2_GDPR", localRegulator: "CCN-CERT (National Cryptologic Center)", region: "EU" },
  { slug: "barcelona", nameDE: "Barcelona", nameEN: "Barcelona", country: "Spanien", countryCode: "ES", complianceFramework: "NIS2_GDPR", localRegulator: "CCN-CERT (National Cryptologic Center)", region: "EU" },
  { slug: "rome", nameDE: "Rom", nameEN: "Rome", country: "Italien", countryCode: "IT", complianceFramework: "NIS2_GDPR", localRegulator: "CSIRT Italia (Italian Computer Security Incident Response Team)", region: "EU" },
  { slug: "warsaw", nameDE: "Warschau", nameEN: "Warsaw", country: "Polen", countryCode: "PL", complianceFramework: "NIS2_GDPR", localRegulator: "CERT Polska (Polish Computer Emergency Response Team)", region: "EU" },
  { slug: "prague", nameDE: "Prag", nameEN: "Prague", country: "Tschechien", countryCode: "CZ", complianceFramework: "NIS2_GDPR", localRegulator: "NÚKIB (National Cyber and Information Security Authority)", region: "EU" },
  { slug: "budapest", nameDE: "Budapest", nameEN: "Budapest", country: "Ungarn", countryCode: "HU", complianceFramework: "NIS2_GDPR", localRegulator: "CERT-Hungary (Hungarian National Cyber Security Center)", region: "EU" },
  { slug: "athens", nameDE: "Athen", nameEN: "Athens", country: "Griechenland", countryCode: "GR", complianceFramework: "NIS2_GDPR", localRegulator: "CERT.gr (Greek Computer Emergency Response Team)", region: "EU" },
  { slug: "lisbon", nameDE: "Lissabon", nameEN: "Lisbon", country: "Portugal", countryCode: "PT", complianceFramework: "NIS2_GDPR", localRegulator: "CNCS (National Cybersecurity Center)", region: "EU" },
  { slug: "dublin", nameDE: "Dublin", nameEN: "Dublin", country: "Irland", countryCode: "IE", complianceFramework: "NIS2_GDPR", localRegulator: "NCSC Ireland (National Cyber Security Centre)", region: "EU" },
]

export function getCityBySlug(slug: string): GeoCityQuality | undefined {
  return GEO_CITIES_QUALITY.find(city => city.slug === slug)
}

export function getCitiesByRegion(region: string): GeoCityQuality[] {
  return GEO_CITIES_QUALITY.filter(city => city.region === region)
}

export function getComplianceText(framework: ComplianceFramework, locale: string): string {
  const texts: Record<ComplianceFramework, { de: string; en: string }> = {
    DSGVO_BSI_NIS2: {
      de: "Unternehmen in Deutschland müssen die DSGVO, BSI-Grundschutz und NIS2-Richtlinien einhalten. Dies umfasst Datenschutzfolgenabschätzungen, regelmäßige Security-Audits und Meldepflichten bei Sicherheitsvorfällen.",
      en: "Companies in Germany must comply with GDPR, BSI baseline protection, and NIS2 directives. This includes data protection impact assessments, regular security audits, and incident reporting obligations.",
    },
    UK_GDPR_CYBER_ESSENTIALS: {
      de: "Unternehmen im Vereinigten Königreich müssen UK GDPR und Cyber Essentials einhalten. Dies umfasst Datenschutzfolgenabschätzungen, regelmäßige Security-Audits und Meldepflichten bei Sicherheitsvorfällen.",
      en: "Companies in the UK must comply with UK GDPR and Cyber Essentials. This includes data protection impact assessments, regular security audits, and incident reporting obligations.",
    },
    NIST_SOC2: {
      de: "Unternehmen in den USA sollten NIST CSF und SOC 2 Standards einhalten. Dies umfasst regelmäßige Security-Audits, Zugangskontrollen und Compliance-Reporting.",
      en: "Companies in the US should follow NIST CSF and SOC 2 standards. This includes regular security audits, access controls, and compliance reporting.",
    },
    NIS2_GDPR: {
      de: "Unternehmen in der EU müssen NIS2-Richtlinien und GDPR einhalten. Dies umfasst regelmäßige Security-Audits, Meldepflichten bei Sicherheitsvorfällen und Datenschutzfolgenabschätzungen.",
      en: "Companies in the EU must comply with NIS2 directives and GDPR. This includes regular security audits, incident reporting obligations, and data protection impact assessments.",
    },
    LGPD: {
      de: "Unternehmen in Brasilien müssen LGPD (Lei Geral de Proteção de Dados) einhalten. Dies umfasst Datenschutzfolgenabschätzungen, regelmäßige Security-Audits und Meldepflichten bei Sicherheitsvorfällen.",
      en: "Companies in Brazil must comply with LGPD (Lei Geral de Proteção de Dados). This includes data protection impact assessments, regular security audits, and incident reporting obligations.",
    },
    PII: {
      de: "Unternehmen in Japan müssen PII (Personal Information Protection Act) einhalten. Dies umfasst Datenschutzfolgenabschätzungen, regelmäßige Security-Audits und Meldepflichten bei Sicherheitsvorfällen.",
      en: "Companies in Japan must comply with PII (Personal Information Protection Act). This includes data protection impact assessments, regular security audits, and incident reporting obligations.",
    },
    PDPA: {
      de: "Unternehmen müssen PDPA (Personal Data Protection Act) einhalten. Dies umfasst Datenschutzfolgenabschätzungen, regelmäßige Security-Audits und Meldepflichten bei Sicherheitsvorfällen.",
      en: "Companies must comply with PDPA (Personal Data Protection Act). This includes data protection impact assessments, regular security audits, and incident reporting obligations.",
    },
    LDPD: {
      de: "Unternehmen in Mexiko müssen LDPD (Ley Federal de Protección de Datos Personales en Posesión de los Particulares) einhalten. Dies umfasst Datenschutzfolgenabschätzungen, regelmäßige Security-Audits und Meldepflichten bei Sicherheitsvorfällen.",
      en: "Companies in Mexico must comply with LDPD (Federal Law on Protection of Personal Data Held by Private Parties). This includes data protection impact assessments, regular security audits, and incident reporting obligations.",
    },
  }

  return texts[framework]?.[locale as "de" | "en"] || texts[framework]?.en || ""
}
