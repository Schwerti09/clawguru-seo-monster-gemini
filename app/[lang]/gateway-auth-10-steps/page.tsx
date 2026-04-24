import type { Metadata } from "next"
import Link from "next/link"

import Container from "@/components/shared/Container"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { getCoreSecurityLinks } from "@/lib/core-security-links"
import { getGatewayAuthCopy } from "@/lib/content-gateway-auth-10-steps-i18n"
import { pick } from "@/lib/i18n-pick"

export const revalidate = 60

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  const copy = getGatewayAuthCopy(locale)
  return {
    title: copy.title,
    description: copy.description,
    alternates: buildLocalizedAlternates(locale, "/gateway-auth-10-steps"),
    openGraph: {
      images: ["/og-image.png"],
      title: copy.title,
      description: copy.description,
      type: "article",
    },
  }
}

export default function GatewayAuthStepsPage(props: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  const copy = getGatewayAuthCopy(locale)
  const coreLinks = getCoreSecurityLinks(locale)
  const prefix = `/${locale}`

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: copy.h1,
    description: copy.description,
    inLanguage: locale,
    mainEntityOfPage: `${prefix}/gateway-auth-10-steps`,
  }

  const isDE = locale === 'de'
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: pick(isDE, 'Was ist Gateway Authentication und warum ist sie wichtig?', 'What is gateway authentication and why is it important?'), acceptedAnswer: { '@type': 'Answer', text: pick(isDE, 'Gateway Authentication sichert den zentralen Eingangspunkt einer Microservice-Architektur. Statt jeder Service einzeln Auth implementiert, übernimmt das API Gateway: Token-Validierung (JWT, OAuth2), Rate Limiting, IP-Allowlisting, mTLS für Service-zu-Service. Vorteile: einheitliche Auth-Policy, single point of enforcement, einfacheres Audit-Logging. Falsch konfiguriertes Gateway = alle dahinterliegenden Services exponiert.', 'Gateway authentication secures the central entry point of a microservice architecture. Instead of each service implementing auth individually, the API gateway handles: token validation (JWT, OAuth2), rate limiting, IP allowlisting, mTLS for service-to-service. Advantages: uniform auth policy, single point of enforcement, simpler audit logging. Misconfigured gateway = all services behind it exposed.') } },
      { '@type': 'Question', name: pick(isDE, 'Welche Authentication-Methoden eignen sich für API Gateways?', 'Which authentication methods are suitable for API gateways?'), acceptedAnswer: { '@type': 'Answer', text: pick(isDE, 'API Gateway Auth-Methoden: JWT (JSON Web Tokens): stateless, skalierbar, Gateway validiert Signatur ohne DB-Lookup. OAuth2 mit PKCE: für Browser-Clients, Authorization Code Flow. API Keys: für Service-zu-Service, einfach aber kein User-Kontext. mTLS (Mutual TLS): höchste Sicherheit für Service-zu-Service, Zertifikat-basiert. Basic Auth: nur intern, nie extern exponiert. Empfehlung: JWT für User-Auth + mTLS für interne Services.', 'API gateway auth methods: JWT (JSON Web Tokens): stateless, scalable, gateway validates signature without DB lookup. OAuth2 with PKCE: for browser clients, authorization code flow. API keys: for service-to-service, simple but no user context. mTLS (mutual TLS): highest security for service-to-service, certificate-based. Basic auth: only internal, never externally exposed. Recommendation: JWT for user auth + mTLS for internal services.') } },
      { '@type': 'Question', name: pick(isDE, 'Wie implementiere ich Rate Limiting im API Gateway?', 'How do I implement rate limiting in the API gateway?'), acceptedAnswer: { '@type': 'Answer', text: pick(isDE, 'API Gateway Rate Limiting: Sliding Window Algorithm (genauer als Fixed Window). Granularität: per IP, per User-ID, per API-Key, per Endpoint. Kong: rate-limiting Plugin (kostenlos). nginx: limit_req_zone Direktive. Traefik: RateLimit Middleware. Empfohlene Limits: Public API: 100 Req/Min. Authenticated: 1000 Req/Min. Premium: 10.000 Req/Min. Response bei Überschreitung: HTTP 429 mit Retry-After Header. DDoS-Schutz: zusätzlich Cloudflare oder WAF.', 'API gateway rate limiting: sliding window algorithm (more accurate than fixed window). Granularity: per IP, per user ID, per API key, per endpoint. Kong: rate-limiting plugin (free). nginx: limit_req_zone directive. Traefik: RateLimit middleware. Recommended limits: public API: 100 req/min. Authenticated: 1000 req/min. Premium: 10,000 req/min. Response on exceeded: HTTP 429 with Retry-After header. DDoS protection: additionally Cloudflare or WAF.') } },
      { '@type': 'Question', name: pick(isDE, 'Wie logge ich alle Gateway-Requests für Security-Audits?', 'How do I log all gateway requests for security audits?'), acceptedAnswer: { '@type': 'Answer', text: pick(isDE, 'Gateway Request Logging: Structured Logging (JSON) mit: Timestamp, Request-ID, User-ID/API-Key, Endpoint, HTTP-Method, Status-Code, Response-Time, Client-IP, User-Agent. Kein Logging von: Passwörtern, JWT-Token-Bodies, sensiblen Query-Params. SIEM-Integration: Logs an Elasticsearch/Grafana Loki/Splunk weiterleiten. Retention: min. 90 Tage (SOC2), 6 Monate (HIPAA), 1 Jahr (PCI-DSS). Anomalie-Alerts: ungewöhnliche Request-Volumen, 4xx/5xx-Häufungen.', 'Gateway request logging: structured logging (JSON) with: timestamp, request ID, user ID/API key, endpoint, HTTP method, status code, response time, client IP, user agent. Do not log: passwords, JWT token bodies, sensitive query params. SIEM integration: forward logs to Elasticsearch/Grafana Loki/Splunk. Retention: min. 90 days (SOC2), 6 months (HIPAA), 1 year (PCI-DSS). Anomaly alerts: unusual request volumes, 4xx/5xx accumulations.') } },
    ],
  }

  return (
    <main className="py-14 border-b border-white/5" style={{ background: "var(--surface-0)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Container>
        <article className="mx-auto max-w-4xl space-y-8">
          <header className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-400/90">Gateway Auth Runbook</p>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{copy.h1}</h1>
            <p className="text-zinc-300 max-w-3xl">{copy.intro}</p>
          </header>

          <section className="rounded-2xl border border-white/10 bg-black/20 p-6">
            <h2 className="text-xl font-black text-white mb-4">{copy.stepsTitle}</h2>
            <ol className="space-y-2 text-zinc-300 text-sm list-decimal pl-5">
              {copy.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>

          <section className="rounded-2xl border border-white/10 bg-black/20 p-6">
            <h2 className="text-xl font-black text-white mb-3">{copy.verifyTitle}</h2>
            <ul className="space-y-2 text-zinc-300 text-sm">
              {copy.verify.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-zinc-500">{copy.disclaimer}</p>
          </section>

          <div className="flex flex-wrap gap-3">
            <Link href={coreLinks.check} className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-black">
              {copy.ctaCheck}
            </Link>
            <Link href={`${prefix}/moltbot-hardening`} className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white">
              {copy.ctaMoltbot}
            </Link>
            <Link href={`${prefix}/openclaw`} className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white">
              {copy.ctaOpenclaw}
            </Link>
            <Link href={coreLinks.methodology} className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white">
              {copy.ctaMethodik}
            </Link>
          </div>
        </article>
      </Container>
    </main>
  )
}
