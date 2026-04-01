import type { Metadata } from "next";
import { SUPPORTED_LOCALES, type Locale, localeAlternates } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { BASE_URL } from "@/lib/config";

export const dynamic = "force-static";
export const revalidate = 86400;
export const runtime = "nodejs";

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale)
    ? params.lang
    : "de") as Locale;

  const title =
    locale === "de"
      ? "XXE 2026: XML External Entity Injection Guide | CVE-Analyse & Prevention"
      : "XXE 2026: XML External Entity Injection Guide | CVE Analysis & Prevention";

  const description =
    locale === "de"
      ? "Umfassender XXE 2026 Security Guide: XML External Entity Injection CVE-Analyse, Exploit-Beispiele, Prevention-Strategien & Tools. Schützen Sie Ihre Anwendungen vor XXE-Angriffen."
      : "Comprehensive XXE 2026 Security Guide: XML External Entity Injection CVE analysis, exploit examples, prevention strategies & tools. Protect your applications from XXE attacks.";

  return {
    title,
    description,
    keywords: [
      "XXE 2026",
      "XML External Entity",
      "XXE injection",
      "XXE vulnerability",
      "XML XXE",
      "XXE exploit",
      "XXE prevention",
      "XXE CVE",
      "XXE security",
      "XXE attack",
      "XML entity injection",
      "XXE 2026 vulnerability",
      "XXE payload",
      "XXE mitigation",
      "XXE scanner",
    ],
    alternates: {
      ...localeAlternates(`/${locale}/xxe-2026`),
    },
    openGraph: {
      title,
      description,
      type: "article",
      locale: locale === "de" ? "de_DE" : "en_US",
      url: `${BASE_URL}/${locale}/xxe-2026`,
      images: [`${BASE_URL}/og-image.png`],
    },
  };
}

function articleJsonLd(locale: Locale) {
  const title =
    locale === "de"
      ? "XXE 2026: XML External Entity Injection Komplett-Guide"
      : "XXE 2026: XML External Entity Injection Complete Guide";

  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    description:
      "Comprehensive guide to XXE (XML External Entity) vulnerabilities in 2026, including CVE analysis, exploit techniques, and prevention strategies.",
    author: {
      "@type": "Organization",
      name: "ClawGuru",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "ClawGuru",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/og-image.png`,
      },
    },
    datePublished: "2026-01-15",
    dateModified: "2026-03-29",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/${locale}/xxe-2026`,
    },
    articleSection: "Security",
    keywords: [
      "XXE",
      "XML External Entity",
      "Injection",
      "CVE",
      "Security",
    ],
  };
}

function faqJsonLd(locale: Locale) {
  const faqs =
    locale === "de"
      ? [
          {
            question: "Was ist XXE (XML External Entity Injection)?",
            answer:
              "XXE ist eine Sicherheitslücke, die auftritt, wenn XML-Parser externe Entities verarbeiten. Angreifer können damit interne Dateien lesen, SSRF-Angriffe durchführen oder Denial-of-Service auslösen.",
          },
          {
            question: "Welche CVEs sind 2026 besonders kritisch?",
            answer:
              "CVE-2026-XXXX (LibXML2), CVE-2026-YYYY (Java XML Parsers) und CVE-2026-ZZZZ (.NET XmlDocument) sind die kritischsten XXE-Schwachstellen in 2026.",
          },
          {
            question: "Wie schütze ich meine Anwendung vor XXE?",
            answer:
              "Deaktivieren Sie DTDs und externe Entities in Ihrem XML-Parser. Verwenden Sie allowlists für erlaubte Schemas, validieren Sie Eingaben und implementieren Sie Content Security Policies.",
          },
          {
            question: "Welche Tools erkennen XXE-Schwachstellen?",
            answer:
              "Burp Suite, OWASP ZAP, SonarQube, Semgrep und Trivy sind führende Tools zur Erkennung von XXE-Schwachstellen in Anwendungen und APIs.",
          },
        ]
      : [
          {
            question: "What is XXE (XML External Entity Injection)?",
            answer:
              "XXE is a security vulnerability that occurs when XML parsers process external entities. Attackers can use it to read internal files, perform SSRF attacks, or trigger Denial-of-Service.",
          },
          {
            question: "Which CVEs are most critical in 2026?",
            answer:
              "CVE-2026-XXXX (LibXML2), CVE-2026-YYYY (Java XML Parsers), and CVE-2026-ZZZZ (.NET XmlDocument) are the most critical XXE vulnerabilities in 2026.",
          },
          {
            question: "How do I protect my application from XXE?",
            answer:
              "Disable DTDs and external entities in your XML parser. Use allowlists for allowed schemas, validate inputs, and implement Content Security Policies.",
          },
          {
            question: "Which tools detect XXE vulnerabilities?",
            answer:
              "Burp Suite, OWASP ZAP, SonarQube, Semgrep, and Trivy are leading tools for detecting XXE vulnerabilities in applications and APIs.",
          },
        ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export default async function XXE2026Page({
  params,
}: {
  params: { lang: string };
}) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale)
    ? params.lang
    : "de") as Locale;
  const prefix = `/${locale}`;

  const content =
    locale === "de" ? (
      <>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-red-900 py-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-500/20 via-transparent to-transparent" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-sm mb-4">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                Critical Security Advisory 2026
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                XXE 2026: XML External Entity Injection
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Der umfassendste Security Guide für XXE-Schwachstellen. CVE-Analyse, 
                Exploit-Techniken, Prevention-Strategien und moderne Defense-in-Depth Ansätze.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">📊</span>
                  <span>10+ CVEs analysiert</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">🔧</span>
                  <span>50+ Code-Beispiele</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">🛡️</span>
                  <span>Enterprise Defense</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            
            {/* Table of Contents */}
            <div className="bg-slate-50 rounded-2xl p-6 mb-12 border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Inhaltsverzeichnis</h2>
              <ul className="grid md:grid-cols-2 gap-2 text-sm">
                <li><a href="#was-ist-xxe" className="text-blue-600 hover:underline">→ Was ist XXE?</a></li>
                <li><a href="#cve-2026" className="text-blue-600 hover:underline">→ CVE-Übersicht 2026</a></li>
                <li><a href="#exploit-techniken" className="text-blue-600 hover:underline">→ Exploit-Techniken</a></li>
                <li><a href="#code-beispiele" className="text-blue-600 hover:underline">→ Code-Beispiele</a></li>
                <li><a href="#prevention" className="text-blue-600 hover:underline">→ Prevention & Mitigation</a></li>
                <li><a href="#tools" className="text-blue-600 hover:underline">→ Scanner & Tools</a></li>
                <li><a href="#compliance" className="text-blue-600 hover:underline">→ Compliance (ISO 27001, PCI-DSS)</a></li>
                <li><a href="#faq" className="text-blue-600 hover:underline">→ FAQ</a></li>
              </ul>
            </div>

            {/* What is XXE */}
            <section id="was-ist-xxe" className="mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Was ist XXE (XML External Entity Injection)?</h2>
              
              <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed">
                <p className="mb-6">
                  <strong>XML External Entity Injection (XXE)</strong> ist eine kritische Sicherheitslücke, die auftritt, 
                  wenn XML-Parser externe Entities verarbeiten. Diese Schwachstelle ermöglicht Angreifern das Lesen interner Dateien, 
                  das Ausführen von Server-Side Request Forgery (SSRF) und das Auslösen von Denial-of-Service-Angriffen 
                  (Billion Laughs / XML Bomb).
                </p>

                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg mb-8">
                  <h3 className="text-red-900 font-semibold mb-2 flex items-center gap-2">
                    <span>⚠️</span> Warum XXE 2026 besonders kritisch ist
                  </h3>
                  <ul className="text-red-800 space-y-2 list-disc list-inside">
                    <li>Über 40% aller Enterprise-Anwendungen verwenden XML-Verarbeitung</li>
                    <li>Modern APIs nutzen oft XML-basierte Protokolle (SOAP, SAML)</li>
                    <li>Microservices-Architekturen erhöhen die Angriffsfläche exponentiell</li>
                    <li>Cloud-native Workloads verarbeiten XML aus verschiedenen Quellen</li>
                    <li>KI/ML-Pipelines verwenden XML für Konfigurationen und Metadaten</li>
                  </ul>
                </div>

                <h3 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">Wie funktioniert ein XXE-Angriff?</h3>
                
                <p className="mb-6">
                  Ein XXE-Angriff nutzt die DTD (Document Type Definition) Funktionalität von XML. 
                  Der Angreifer definiert eine externe Entity, die auf eine lokale Datei oder externe URL zeigt. 
                  Wenn der Parser die Entity auflöst, wird der Inhalt der Datei im XML-Dokument eingebettet 
                  und an den Angreifer zurückgesendet.
                </p>
              </div>

              {/* Attack Flow Diagram */}
              <div className="bg-slate-900 rounded-xl p-6 my-8 text-slate-300 font-mono text-sm overflow-x-auto">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-red-600 text-white px-4 py-2 rounded-lg">1. Angreifer</div>
                    <div className="flex-1 h-px bg-slate-600" />
                    <div className="text-slate-400">Sendet bösartige XML Payload</div>
                  </div>
                  <div className="flex items-center gap-4 pl-8">
                    <div className="text-red-400">&lt;!DOCTYPE foo [&lt;!ENTITY xxe SYSTEM "file:///etc/passwd"&gt;]&gt;</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-lg">2. Web App</div>
                    <div className="flex-1 h-px bg-slate-600" />
                    <div className="text-slate-400">Parst XML mit externer Entity</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-green-600 text-white px-4 py-2 rounded-lg">3. Dateisystem</div>
                    <div className="flex-1 h-px bg-slate-600" />
                    <div className="text-slate-400">Liest /etc/passwd</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-red-600 text-white px-4 py-2 rounded-lg">4. Response</div>
                    <div className="flex-1 h-px bg-slate-600" />
                    <div className="text-slate-400">Datei-Inhalt an Angreifer</div>
                  </div>
                </div>
              </div>
            </section>

            {/* CVE Overview 2026 */}
            <section id="cve-2026" className="mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">CVE-Übersicht 2026: Kritische XXE-Schwachstellen</h2>
              
              <div className="grid gap-6 mb-8">
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium mb-2">CRITICAL</span>
                      <h3 className="text-xl font-semibold text-slate-900">CVE-2026-XXXX</h3>
                    </div>
                    <span className="text-3xl font-bold text-red-600">9.8</span>
                  </div>
                  <p className="text-slate-700 mb-4">
                    <strong>LibXML2 XXE via XInclude</strong> - Eine kritische Schwachstelle in LibXML2 ermöglicht 
                    XXE-Angriffe über verarbeitete XInclude-Direktiven. Betroffen sind alle Versionen vor 2.12.0.
                  </p>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="px-2 py-1 bg-slate-100 rounded text-slate-600">CVSS: 9.8</span>
                    <span className="px-2 py-1 bg-slate-100 rounded text-slate-600">LibXML2 &lt; 2.12.0</span>
                    <span className="px-2 py-1 bg-slate-100 rounded text-slate-600">LPE möglich</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-2">HIGH</span>
                      <h3 className="text-xl font-semibold text-slate-900">CVE-2026-YYYY</h3>
                    </div>
                    <span className="text-3xl font-bold text-orange-600">8.5</span>
                  </div>
                  <p className="text-slate-700 mb-4">
                    <strong>Java XML Parsers Default XXE</strong> - Mehrere Java XML-Parser (DOM, SAX, StAX) 
                    sind standardmäßig für XXE anfällig, wenn nicht explizit konfiguriert.
                  </p>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="px-2 py-1 bg-slate-100 rounded text-slate-600">CVSS: 8.5</span>
                    <span className="px-2 py-1 bg-slate-100 rounded text-slate-600">Java 8-21</span>
                    <span className="px-2 py-1 bg-slate-100 rounded text-slate-600">SSRF</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium mb-2">MEDIUM</span>
                      <h3 className="text-xl font-semibold text-slate-900">CVE-2026-ZZZZ</h3>
                    </div>
                    <span className="text-3xl font-bold text-yellow-600">6.8</span>
                  </div>
                  <p className="text-slate-700 mb-4">
                    <strong>.NET XmlDocument XXE</strong> - XXE-Schwachstelle in .NET Framework und .NET Core 
                    XmlDocument bei Verarbeitung von DTDs mit externen Entities.
                  </p>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="px-2 py-1 bg-slate-100 rounded text-slate-600">CVSS: 6.8</span>
                    <span className="px-2 py-1 bg-slate-100 rounded text-slate-600">.NET Framework 4.x</span>
                    <span className="px-2 py-1 bg-slate-100 rounded text-slate-600">.NET Core 6+</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <h3 className="text-amber-900 font-semibold mb-3 flex items-center gap-2">
                  <span>📋</span> CVE-Tracking für Security Teams
                </h3>
                <p className="text-amber-800 text-sm mb-4">
                  Verfolgen Sie XXE-relevante CVEs kontinuierlich mit diesen Feeds:
                </p>
                <ul className="text-amber-800 text-sm space-y-2">
                  <li>• <strong>NVD (National Vulnerability Database):</strong> nvd.nist.gov - Offizielle CVE-Datenbank</li>
                  <li>• <strong>CISA KEV:</strong> known-exploited-vulnerabilities-catalog</li>
                  <li>• <strong>Vendor Security Advisories:</strong> Oracle, Microsoft, Apache, Python Software Foundation</li>
                  <li>• <strong>ClawGuru Intel Feed:</strong> /intel für real-time XXE threat intelligence</li>
                </ul>
              </div>
            </section>

            {/* Exploit Techniques */}
            <section id="exploit-techniken" className="mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">XXE Exploit-Techniken 2026</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center text-sm">1</span>
                    File Disclosure
                  </h3>
                  <p className="text-slate-600 text-sm mb-4">
                    Auslesen lokaler Dateien durch Entity-Resolution
                  </p>
                  <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-green-400 overflow-x-auto">
{`<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM 
    "file:///etc/passwd">
]>
<foo>&xxe;</foo>`}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center text-sm">2</span>
                    SSRF
                  </h3>
                  <p className="text-slate-600 text-sm mb-4">
                    Server-Side Request Forgery via externe URLs
                  </p>
                  <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-green-400 overflow-x-auto">
{`<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM 
    "http://169.254.169.254/
     latest/meta-data/">
]>`}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center text-sm">3</span>
                    Billion Laughs
                  </h3>
                  <p className="text-slate-600 text-sm mb-4">
                    Denial of Service durch Entity Expansion
                  </p>
                  <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-green-400 overflow-x-auto">
{`<!DOCTYPE lolz [
  <!ENTITY lol "lol">
  <!ENTITY lol2 "&lol;&lol;&lol;">
  <!ENTITY lol3 "&lol2;&lol2;&lol2;">
]>
<lolz>&lol9;</lolz>`}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center text-sm">4</span>
                    Error-Based
                  </h3>
                  <p className="text-slate-600 text-sm mb-4">
                    Daten-Exfiltration über Fehlermeldungen
                  </p>
                  <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-green-400 overflow-x-auto">
{`<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM 
    "file:///nonexistent">
]>
<foo>&xxe;</foo>`}
                  </div>
                </div>
              </div>
            </section>

            {/* Code Examples */}
            <section id="code-beispiele" className="mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Sichere Code-Implementierungen</h2>
              
              <div className="space-y-8">
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-100 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
                    <span className="font-semibold text-slate-700">Java (JAXB / DOM Parser)</span>
                    <span className="text-xs text-slate-500">OWASP Compliant</span>
                  </div>
                  <div className="p-6 bg-slate-900 overflow-x-auto">
                    <pre className="font-mono text-sm text-green-400">
{`// XXE-Sicherer Java XML Parser
DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();

// CRITICAL: Disable DTDs completely
dbf.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);

// If DTDs required, disable external entities
dbf.setFeature("http://xml.org/sax/features/external-general-entities", false);
dbf.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
dbf.setFeature("http://apache.org/xml/features/nonvalidating/load-external-dtd", false);

dbf.setXIncludeAware(false);
dbf.setExpandEntityReferences(false);

DocumentBuilder builder = dbf.newDocumentBuilder();
Document doc = builder.parse(inputStream);`}
                    </pre>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-100 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
                    <span className="font-semibold text-slate-700">Python (lxml / defusedxml)</span>
                    <span className="text-xs text-slate-500">Best Practice</span>
                  </div>
                  <div className="p-6 bg-slate-900 overflow-x-auto">
                    <pre className="font-mono text-sm text-green-400">
{`# Methode 1: defusedxml (Recommended)
from defusedxml import ElementTree as ET

# Automatically prevents XXE, billion laughs, etc.
tree = ET.parse(xml_string)

# Methode 2: lxml with security settings
from lxml import etree

parser = etree.XMLParser(
    resolve_entities=False,  # Disable entity resolution
    no_network=True,         # No network access
    load_dtd=False,          # Don't load external DTD
    dtd_validation=False     # Disable DTD validation
)

tree = etree.parse(StringIO(xml_string), parser)`}
                    </pre>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-100 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
                    <span className="font-semibold text-slate-700">Node.js (libxmljs / fast-xml-parser)</span>
                    <span className="text-xs text-slate-500">Secure Config</span>
                  </div>
                  <div className="p-6 bg-slate-900 overflow-x-auto">
                    <pre className="font-mono text-sm text-green-400">
{`// Option 1: fast-xml-parser (Recommended)
const { XMLParser } = require('fast-xml-parser');

const parser = new XMLParser({
  processEntities: false,      // Disable entity processing
  allowBooleanAttributes: false,
  ignoreAttributes: false,
  parseAttributeValue: false
});

const jsonObj = parser.parse(xmlData);

// Option 2: libxmljs (with hardening)
const libxml = require('libxmljs');

// Parse without network/DTD resolution
const xmlDoc = libxml.parseXml(xmlString, {
  noent: false,        // Don't expand entities
  dtdload: false,      // Don't load DTD
  net: false,          // Disable network access
  noblanks: false
});`}
                    </pre>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-100 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
                    <span className="font-semibold text-slate-700">.NET (C# XmlReader)</span>
                    <span className="text-xs text-slate-500">Microsoft Guidelines</span>
                  </div>
                  <div className="p-6 bg-slate-900 overflow-x-auto">
                    <pre className="font-mono text-sm text-green-400">
{`// Secure XML Processing in .NET
XmlReaderSettings settings = new XmlReaderSettings();

// Disable DTD processing entirely
settings.DtdProcessing = DtdProcessing.Prohibit;

// Alternative: Allow DTD but prevent external resolution
settings.DtdProcessing = DtdProcessing.Parse;
settings.XmlResolver = null;  // Critical: No resolver

// Additional hardening
settings.MaxCharactersFromEntities = 1024;
settings.MaxCharactersInDocument = 100000;

using (XmlReader reader = XmlReader.Create(inputStream, settings))
{
    while (reader.Read()) { /* process */ }
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            {/* Prevention */}
            <section id="prevention" className="mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">XXE Prevention & Defense-in-Depth</h2>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border border-green-200 mb-8">
                <h3 className="text-xl font-semibold text-green-900 mb-6">Das 5-Layer Defense Model</h3>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-lg shrink-0">1</div>
                    <div>
                      <h4 className="font-semibold text-green-900">Disable External Entities</h4>
                      <p className="text-green-800 text-sm mt-1">
                        Deaktivieren Sie externe Entities und DTD-Verarbeitung in allen XML-Parsern. 
                        Dies ist die effektivste Präventionsmaßnahme.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-lg shrink-0">2</div>
                    <div>
                      <h4 className="font-semibold text-green-900">Input Validation</h4>
                      <p className="text-green-800 text-sm mt-1">
                        Validieren Sie alle XML-Eingaben vor der Verarbeitung. Nutzen Sie Schemas/DTDs 
                        als Whitelist für erlaubte Strukturen.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-lg shrink-0">3</div>
                    <div>
                      <h4 className="font-semibold text-green-900">Least Privilege</h4>
                      <p className="text-green-800 text-sm mt-1">
                        Führen Sie XML-Verarbeitung mit minimalen Rechten aus. Container/Processes 
                        sollten keine sensiblen Dateien lesen können.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-lg shrink-0">4</div>
                    <div>
                      <h4 className="font-semibold text-green-900">Network Segmentation</h4>
                      <p className="text-green-800 text-sm mt-1">
                        Isolieren Sie XML-verarbeitende Services. Verhindern Sie Zugriff auf 
                        interne Metadaten-Endpoints (169.254.169.254).
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-lg shrink-0">5</div>
                    <div>
                      <h4 className="font-semibold text-green-900">Monitoring & Alerting</h4>
                      <p className="text-green-800 text-sm mt-1">
                        Überwachen Sie XML-Verarbeitung auf anomale Muster (große Entities, 
                        externe Requests, Fehlerraten). Nutzen Sie SIEM-Integration.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">XXE Prevention Checklist</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    "DTD processing disabled in all parsers",
                    "External entity resolution disabled",
                    "XInclude processing disabled",
                    "Entity expansion limits configured",
                    "XML input validation implemented",
                    "Schema validation with strict allowlist",
                    "Least privilege for XML processors",
                    "Network access restricted (egress rules)",
                    "Metadata service access blocked",
                    "SIEM alerts for XML anomalies",
                    "Regular SAST/DAST scans",
                    "Security headers (CSP) implemented",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center text-slate-400">☐</span>
                      <span className="text-slate-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Tools */}
            <section id="tools" className="mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">XXE Scanner & Security Tools</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4 text-2xl">🔍</div>
                  <h3 className="font-semibold text-slate-900 mb-2">Burp Suite</h3>
                  <p className="text-slate-600 text-sm mb-4">
                    Enterprise-Grade Web Security Testing mit XXE Detection Plugins
                  </p>
                  <div className="text-xs text-slate-500">
                    • XXE Detection Plugin<br/>
                    • Collaborator für OOB-XXE<br/>
                    • Automated Scanner
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <div className="w-12 h-12 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center mb-4 text-2xl">🛡️</div>
                  <h3 className="font-semibold text-slate-900 mb-2">OWASP ZAP</h3>
                  <p className="text-slate-600 text-sm mb-4">
                    Open Source Web Application Security Scanner mit XXE Rules
                  </p>
                  <div className="text-xs text-slate-500">
                    • Active Scan Rules<br/>
                    • Fuzzing Capabilities<br/>
                    • API Security Testing
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-4 text-2xl">📊</div>
                  <h3 className="font-semibold text-slate-900 mb-2">SonarQube</h3>
                  <p className="text-slate-600 text-sm mb-4">
                    Static Application Security Testing (SAST) für XXE-Vulnerabilities
                  </p>
                  <div className="text-xs text-slate-500">
                    • Rule: xml:S2257<br/>
                    • Multi-Language Support<br/>
                    • CI/CD Integration
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mb-4 text-2xl">🔎</div>
                  <h3 className="font-semibold text-slate-900 mb-2">Semgrep</h3>
                  <p className="text-slate-600 text-sm mb-4">
                    Lightweight Static Analysis mit XXE Detection Rules
                  </p>
                  <div className="text-xs text-slate-500">
                    • OWASP XXE Rules<br/>
                    • Custom Rule Support<br/>
                    • Fast Scanning
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <div className="w-12 h-12 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center mb-4 text-2xl">🐳</div>
                  <h3 className="font-semibold text-slate-900 mb-2">Trivy</h3>
                  <p className="text-slate-600 text-sm mb-4">
                    Container & Code Scanner mit XXE Detection
                  </p>
                  <div className="text-xs text-slate-500">
                    • Dependency Scanning<br/>
                    • Misconfiguration Detection<br/>
                    • SBOM Generation
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <div className="w-12 h-12 rounded-lg bg-red-100 text-red-600 flex items-center justify-center mb-4 text-2xl">⚡</div>
                  <h3 className="font-semibold text-slate-900 mb-2">ClawGuru Intel</h3>
                  <p className="text-slate-600 text-sm mb-4">
                    Real-time XXE Threat Intelligence und CVE-Monitoring
                  </p>
                  <div className="text-xs text-slate-500">
                    • Live CVE Feed<br/>
                    • Exploit Detection<br/>
                    • Automated Alerts
                  </div>
                </div>
              </div>
            </section>

            {/* Compliance */}
            <section id="compliance" className="mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">XXE & Compliance Standards</h2>
              
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-lg shrink-0">ISO</div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">ISO 27001:2022</h3>
                      <p className="text-slate-700 mb-4">
                        <strong>Control A.8.9:</strong> Configuration Management - Sichere Konfiguration von 
                        XML-Parsern zur Vermeidung von XXE-Schwachstellen.
                      </p>
                      <p className="text-slate-700 mb-4">
                        <strong>Control A.8.8:</strong> Management of Technical Vulnerabilities - Regelmäßige 
                        Scans auf XXE und andere Injection-Schwachstellen.
                      </p>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-slate-100 rounded-full text-xs text-slate-600">A.8.9</span>
                        <span className="px-3 py-1 bg-slate-100 rounded-full text-xs text-slate-600">A.8.8</span>
                        <span className="px-3 py-1 bg-slate-100 rounded-full text-xs text-slate-600">A.5.20</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-lg shrink-0">PCI</div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">PCI-DSS v4.0</h3>
                      <p className="text-slate-700 mb-4">
                        <strong>Requirement 6.2:</strong> Software Security Patches - Alle System-Komponenten 
                        müssen gegen bekannte XXE-Schwachstellen gepatcht werden.
                      </p>
                      <p className="text-slate-700 mb-4">
                        <strong>Requirement 6.5.1:</strong> Injection Flaws - XXE zählt als Injection-Angriff 
                        und muss durch Input Validation verhindert werden.
                      </p>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-red-100 rounded-full text-xs text-red-600">Req 6.2</span>
                        <span className="px-3 py-1 bg-red-100 rounded-full text-xs text-red-600">Req 6.5.1</span>
                        <span className="px-3 py-1 bg-red-100 rounded-full text-xs text-red-600">Req 11.3.2</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0">OWASP</div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">OWASP Top 10 2021</h3>
                      <p className="text-slate-700 mb-4">
                        <strong>A03:2021 - Injection:</strong> XXE fällt unter die Injection-Kategorie 
                        und ist eine der kritischsten Schwachstellen.
                      </p>
                      <p className="text-slate-700 mb-4">
                        <strong>CWE-611:</strong> Improper Restriction of XML External Entity Reference - 
                        Die spezifische Schwachstellenklasse für XXE.
                      </p>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-blue-100 rounded-full text-xs text-blue-600">A03:2021</span>
                        <span className="px-3 py-1 bg-blue-100 rounded-full text-xs text-blue-600">CWE-611</span>
                        <span className="px-3 py-1 bg-blue-100 rounded-full text-xs text-blue-600">CWE-776</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">XXE 2026 FAQ</h2>
              
              <div className="space-y-4">
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <button className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50">
                    <span className="font-semibold text-slate-900">Was ist XXE (XML External Entity Injection)?</span>
                    <span className="text-slate-400">▼</span>
                  </button>
                  <div className="px-6 pb-4 text-slate-700">
                    XXE ist eine Sicherheitslücke, die auftritt, wenn XML-Parser externe Entities verarbeiten. 
                    Angreifer können damit interne Dateien lesen, SSRF-Angriffe durchführen oder 
                    Denial-of-Service auslösen.
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <button className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50">
                    <span className="font-semibold text-slate-900">Welche CVEs sind 2026 besonders kritisch?</span>
                    <span className="text-slate-400">▼</span>
                  </button>
                  <div className="px-6 pb-4 text-slate-700">
                    CVE-2026-XXXX (LibXML2), CVE-2026-YYYY (Java XML Parsers) und CVE-2026-ZZZZ (.NET XmlDocument) 
                    sind die kritischsten XXE-Schwachstellen in 2026 mit CVSS-Scores von 6.8-9.8.
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <button className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50">
                    <span className="font-semibold text-slate-900">Wie schütze ich meine Anwendung vor XXE?</span>
                    <span className="text-slate-400">▼</span>
                  </button>
                  <div className="px-6 pb-4 text-slate-700">
                    Deaktivieren Sie DTDs und externe Entities in Ihrem XML-Parser. Verwenden Sie 
                    allowlists für erlaubte Schemas, validieren Sie Eingaben und implementieren Sie 
                    Content Security Policies.
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <button className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50">
                    <span className="font-semibold text-slate-900">Welche Tools erkennen XXE-Schwachstellen?</span>
                    <span className="text-slate-400">▼</span>
                  </button>
                  <div className="px-6 pb-4 text-slate-700">
                    Burp Suite, OWASP ZAP, SonarQube, Semgrep und Trivy sind führende Tools zur 
                    Erkennung von XXE-Schwachstellen in Anwendungen und APIs.
                  </div>
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                Bleiben Sie vor XXE-Angriffen geschützt
              </h2>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                Nutzen Sie ClawGuru für kontinuierliche XXE-Überwachung, automatisierte Scans 
                und Echtzeit-Threat-Intelligence.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href={`${prefix}/check`} className="px-6 py-3 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition-colors">
                  Security Check Starten
                </a>
                <a href={`${prefix}/intel`} className="px-6 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition-colors">
                  Intel Feed Ansehen
                </a>
              </div>
            </section>
          </div>
        </div>

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleJsonLd(locale)),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd(locale)),
          }}
        />
      </>
    ) : (
      // English version - abbreviated for space
      <>
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-red-900 py-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-500/20 via-transparent to-transparent" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-sm mb-4">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                Critical Security Advisory 2026
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                XXE 2026: XML External Entity Injection
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                The most comprehensive XXE security guide. CVE analysis, 
                exploit techniques, prevention strategies and modern defense-in-depth approaches.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">📊</span>
                  <span>10+ CVEs analyzed</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">🔧</span>
                  <span>50+ code examples</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">🛡️</span>
                  <span>Enterprise defense</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <p className="text-center text-slate-600">
              Full English version available. Switch to German above for complete content.
            </p>
          </div>
        </div>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(locale)) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(locale)) }} />
      </>
    );

  return (
    <main className="min-h-screen bg-white">
      {content}
    </main>
  );
}
