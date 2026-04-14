import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/llm-output-encoding-security"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = isDE
    ? "LLM Output Encoding Security: LLM-Output-Encoding-Sicherheit | ClawGuru Moltbot"
    : "LLM Output Encoding Security: LLM Output Encoding Security | ClawGuru Moltbot"
  const description = isDE
    ? "LLM-Output-Encoding-Sicherheit: Unicode Sanitisation, XSS Prevention, Output Encoding Validation und Safe Output Rendering für LLM-Ausgaben."
    : "LLM output encoding security: Unicode sanitisation, XSS prevention, output encoding validation and safe output rendering for LLM outputs."
  return {
    title, description,
    keywords: ["llm output encoding security", "llm xss prevention", "unicode sanitisation", "output encoding validation", "safe rendering", "moltbot encoding"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "OES-1", title: "Unicode Sanitisation", desc: "Sanitise Unicode characters in LLM outputs to prevent homograph attacks and encoding-based exploits.", code: `# Moltbot unicode sanitisation:
unicode_sanitisation:
  enabled: true

  # Normalisation:
  normalisation:
    # Normalise unicode to NFC form
    # This prevents homograph attacks using visually similar characters
    form: "NFC"

  # Character filtering:
  filtering:
    # Block or replace dangerous unicode characters:
    # - Zero-width characters (ZWJ, ZWNJ, ZWSP)
    # - Invisible characters
    # - Bidirectional override characters
    # - Non-printing control characters
    block_zero_width: true
    block_invisible: true
    block_bidi_override: true
    block_control: true

  # Character replacement:
  replacement:
    # Replace problematic characters with safe equivalents
    # Example: replace homographs with their ASCII equivalents
    enabled: true` },
  { id: "OES-2", title: "XSS Prevention", desc: "Prevent cross-site scripting (XSS) attacks in LLM outputs. Escape HTML, JavaScript, and other code before rendering.", code: `# Moltbot XSS prevention:
xss_prevention:
  enabled: true

  # HTML escaping:
  html_escaping:
    enabled: true
    # Escape all HTML special characters:
    # - <, >, &, ", '
    # Use: &lt;, &gt;, &amp;, &quot;, &#39;

  # JavaScript escaping:
  js_escaping:
    enabled: true
    # Escape JavaScript special characters:
    # - ", ', \, /, <, >
    # Use: \", \', \\, \/, \x3C, \x3E

  # Context-aware escaping:
  context_aware:
    enabled: true
    # Escape based on context:
    # - HTML body: escape HTML
    # - HTML attribute: escape HTML and quotes
    # - JavaScript: escape JavaScript
    # - CSS: escape CSS
    # - URL: escape URL

  # Safe rendering:
  safe_rendering:
    # Use safe rendering libraries:
    # - DOMPurify for HTML
    # - DOMPurify for SVG
    # - Safe JSON parsing for JSON
    enabled: true` },
  { id: "OES-3", title: "Output Encoding Validation", desc: "Validate LLM output encoding before rendering. Ensure outputs use expected character sets and encodings.", code: `# Moltbot output encoding validation:
encoding_validation:
  enabled: true

  # Character set validation:
  charset:
    # Validate output character set:
    # - UTF-8 (default)
    # - ASCII (for code blocks)
    # - Reject unexpected character sets
    allowed_charsets: ["UTF-8", "ASCII"]
    reject_unknown: true

  # Encoding validation:
  encoding:
    # Validate output encoding:
    # - UTF-8 (default)
    # - Base64 (for encoded content)
    # - Reject unexpected encodings
    allowed_encodings: ["UTF-8", "Base64"]
    reject_unknown: true

  # Byte order mark (BOM) handling:
  bom_handling:
    # Strip BOM from outputs
    # BOM can cause rendering issues
    strip_bom: true

  # Encoding detection:
  detection:
    # Detect output encoding automatically
    # If encoding is unexpected, block or sanitise
    enabled: true` },
  { id: "OES-4", title: "Safe Output Rendering", desc: "Render LLM outputs safely using sandboxed rendering contexts and content security policies.", code: `# Moltbot safe output rendering:
safe_rendering:
  enabled: true

  # Sandboxed rendering:
  sandbox:
    # Render outputs in sandboxed iframe
    # Prevents: script execution, style injection, frame navigation
    enabled: true
    sandbox_attributes:
      - "allow-scripts"
      - "allow-same-origin"
      # Avoid: allow-popups, allow-top-navigation

  # Content Security Policy (CSP):
  csp:
    enabled: true
    # Apply CSP to rendered outputs:
    # - script-src: 'self' or 'none'
    # - style-src: 'self'
    # - img-src: 'self'
    # - default-src: 'self'
    policy: "default-src 'self'; script-src 'self'; style-src 'self';"

  # Safe DOM APIs:
  safe_dom:
    # Use safe DOM APIs:
    # - textContent instead of innerHTML
    # - createElement instead of insertAdjacentHTML
    # - setAttribute instead of direct property assignment
    enabled: true` },
]

const FAQ = [
  { q: "What is the difference between XSS prevention and output encoding validation?", a: "XSS prevention is about preventing cross-site scripting attacks by escaping or sanitising dangerous content (HTML, JavaScript, CSS) before it's rendered in the browser. It focuses on the security of the rendered output. Output encoding validation is about ensuring the output uses expected character sets and encodings (UTF-8, ASCII) before rendering. It focuses on the technical correctness of the output. Both are necessary: XSS prevention prevents attacks, encoding validation prevents rendering errors and encoding-based exploits. Example: XSS prevention escapes <script> to &lt;script&gt;. Encoding validation ensures the output is valid UTF-8 and not malformed UTF-8 that could be exploited." },
  { q: "How do homograph attacks work and how do I prevent them?", a: "Homograph attacks use visually similar Unicode characters to deceive users. Example: the Cyrillic 'а' looks identical to Latin 'a' but is a different character. Attackers can use homographs to create phishing URLs that look legitimate (e.g., gооgle.com using Cyrillic 'о' instead of Latin 'o'). Prevention: 1) Unicode normalisation — normalise all Unicode to NFC form, which converts composed characters to canonical form. 2) Character filtering — block or replace dangerous Unicode characters (zero-width, invisible, bidirectional override). 3) Domain validation — validate domains against a list of allowed TLDs and character sets. 4) Visual similarity checks — use libraries to detect homograph characters in domains or URLs." },
  { q: "How do I implement context-aware escaping?", a: "Context-aware escaping means escaping content based on where it will be rendered. Different contexts require different escaping: 1) HTML body — escape HTML special characters (<, >, &, \", '). 2) HTML attribute — escape HTML and quotes (additional quote escaping for attribute values). 3) JavaScript — escape JavaScript special characters (\", \', \\, /, <, >). 4) CSS — escape CSS special characters (quotes, backslashes). 5) URL — escape URL special characters (spaces, quotes, control characters). Use libraries like DOMPurify for HTML, or framework-specific escaping functions (React's JSX auto-escapes, Django's template engine)." },
  { q: "What are the risks of unsafe output rendering?", a: "Unsafe output rendering can lead to: 1) XSS attacks — attackers can inject malicious scripts that execute in the user's browser. 2) Data theft — XSS can steal cookies, session tokens, or sensitive data. 3) UI spoofing — attackers can modify the UI to deceive users (phishing, credential harvesting). 4) Frame navigation — attackers can navigate to malicious sites using iframes. 5) Clickjacking — attackers can overlay transparent iframes to trick users into clicking malicious links. 6) Encoding exploits — malformed encodings can bypass security filters. Safe rendering uses sandboxed iframes, CSP, and safe DOM APIs to prevent these risks." },
]

export default function LlmOutputEncodingSecurityPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "LLM Output Encoding Security", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Output-Encoding-Security-Guide für eigene KI-Systeme." : "Output encoding security guide for your own AI systems."}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 18</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "LLM Output Encoding Security" : "LLM Output Encoding Security"}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {isDE
            ? "LLM-Ausgaben ohne Encoding-Security können XSS-Angriffe und Encoding-Exploits ermöglichen. Vier Kontrollen: Unicode Sanitisation, XSS Prevention, Encoding Validation und Safe Rendering."
            : "LLM outputs without encoding security can enable XSS attacks and encoding exploits. Four controls: unicode sanitisation, XSS prevention, encoding validation and safe rendering."}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "4 Output-Encoding-Security-Kontrollen" : "4 Output Encoding Security Controls"}</h2>
          <div className="space-y-5">
            {CONTROLS.map((c) => (
              <div key={c.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-700">
                  <span className="font-mono text-xs text-cyan-400 bg-gray-900 px-2 py-0.5 rounded">{c.id}</span>
                  <span className="font-bold text-gray-100">{c.title}</span>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-300 mb-3">{c.desc}</p>
                  <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs overflow-x-auto"><pre>{c.code}</pre></div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Häufige Fragen" : "Frequently Asked Questions"}</h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <details key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <summary className="font-semibold text-gray-100 cursor-pointer">{f.q}</summary>
                <p className="mt-3 text-sm text-gray-300 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Weiterführende Ressourcen" : "Further Resources"}</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/moltbot/llm-output-validation`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Output Validation</div>
              <div className="text-sm text-gray-300">{isDE ? "Output-Safety-Classifier" : "Output safety classifier"}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-output-filtering`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Output Filtering</div>
              <div className="text-sm text-gray-300">{isDE ? "Content-Safety-Classifier" : "Content safety classifier"}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-sandboxing`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Sandboxing</div>
              <div className="text-sm text-gray-300">{isDE ? "Sandboxed-Rendering" : "Sandboxed rendering"}</div>
            </a>
            <a href={`/${locale}/moltbot/llm-prompt-hardening`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">LLM Prompt Hardening</div>
              <div className="text-sm text-gray-300">{isDE ? "Prompt-Injection-Defense" : "Prompt injection defense"}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
