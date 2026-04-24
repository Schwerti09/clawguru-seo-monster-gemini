import type { Metadata } from "next"
import Link from "next/link"

import Container from "@/components/shared/Container"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { getCoreSecurityLinks } from "@/lib/core-security-links"
import { getDockerProxyCopy } from "@/lib/content-docker-reverse-proxy-hardening-i18n"
import { pick } from "@/lib/i18n-pick"

export const revalidate = 60

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  const copy = getDockerProxyCopy(locale)
  return {
    title: copy.title,
    description: copy.description,
    alternates: buildLocalizedAlternates(locale, "/docker-reverse-proxy-hardening-cheatsheet"),
    openGraph: {
      images: ["/og-image.png"],
      title: copy.title,
      description: copy.description,
      type: "article",
    },
  }
}

export default function DockerReverseProxyCheatsheetPage(props: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  const copy = getDockerProxyCopy(locale)
  const coreLinks = getCoreSecurityLinks(locale)
  const prefix = `/${locale}`

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: copy.h1,
    description: copy.description,
    inLanguage: locale,
    mainEntityOfPage: `${prefix}/docker-reverse-proxy-hardening-cheatsheet`,
  }

  const isDE = locale === 'de'
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: pick(isDE, 'Wie härte ich einen Docker Reverse Proxy ab?', 'How do I harden a Docker reverse proxy?'), acceptedAnswer: { '@type': 'Answer', text: pick(isDE, 'Docker Reverse Proxy Hardening: nginx oder Traefik als Reverse Proxy im Docker-Netzwerk. Interne Services nicht direkt exponieren (nur Proxy öffentlich). Security Headers setzen (HSTS, CSP, X-Frame-Options). Rate Limiting aktivieren. TLS terminieren am Proxy. Docker-Netzwerk-Isolation: interne Services in eigenem Network, Proxy im öffentlichen Network. Kein --privileged für Proxy-Container.', 'Docker reverse proxy hardening: nginx or Traefik as reverse proxy in Docker network. Do not expose internal services directly (only proxy public). Set security headers (HSTS, CSP, X-Frame-Options). Enable rate limiting. Terminate TLS at proxy. Docker network isolation: internal services in own network, proxy in public network. No --privileged for proxy container.') } },
      { '@type': 'Question', name: pick(isDE, 'Was ist der Unterschied zwischen Traefik und nginx als Docker Reverse Proxy?', 'What is the difference between Traefik and nginx as Docker reverse proxy?'), acceptedAnswer: { '@type': 'Answer', text: pick(isDE, 'Traefik: automatische Service-Discovery via Docker Labels, keine Config-Neulade nötig bei neuem Container, integriertes Let\'s Encrypt, Dashboard. Besser für dynamische Microservices. nginx: stabiler, ausgereifter, mehr Security-Features out-of-the-box (ModSecurity WAF), bessere Performance bei statischen Files. Besser für stabile Deployments. Security-Empfehlung: nginx für kritische Produktionsumgebungen.', 'Traefik: automatic service discovery via Docker labels, no config reload needed for new containers, integrated Let\'s Encrypt, dashboard. Better for dynamic microservices. nginx: more stable, mature, more security features out-of-the-box (ModSecurity WAF), better performance for static files. Better for stable deployments. Security recommendation: nginx for critical production environments.') } },
      { '@type': 'Question', name: pick(isDE, 'Wie konfiguriere ich TLS korrekt im Docker Reverse Proxy?', 'How do I correctly configure TLS in the Docker reverse proxy?'), acceptedAnswer: { '@type': 'Answer', text: pick(isDE, 'Docker Reverse Proxy TLS: Let\'s Encrypt via Certbot (nginx) oder Traefik ACME. Minimum TLS 1.2, TLS 1.3 bevorzugen. Schwache Cipher Suites deaktivieren. HSTS Header setzen (min. 1 Jahr). OCSP Stapling aktivieren. HTTP auf HTTPS redirecten (301). TLS-Zertifikat automatisch erneuern (Cron oder Traefik). SSL-Score A+ auf SSL Labs als Ziel.', 'Docker reverse proxy TLS: Let\'s Encrypt via Certbot (nginx) or Traefik ACME. Minimum TLS 1.2, prefer TLS 1.3. Disable weak cipher suites. Set HSTS header (min. 1 year). Enable OCSP stapling. Redirect HTTP to HTTPS (301). Auto-renew TLS certificate (cron or Traefik). SSL Labs A+ score as target.') } },
      { '@type': 'Question', name: pick(isDE, 'Wie schütze ich Docker-interne Services vor direktem Zugriff?', 'How do I protect Docker-internal services from direct access?'), acceptedAnswer: { '@type': 'Answer', text: pick(isDE, 'Docker Service-Isolation: Interne Services nur im internen Docker-Network (kein ports-Mapping auf 0.0.0.0). Nur Reverse Proxy hat Zugriff auf internen Services. Firewall-Regel: Port 80/443 offen, alle anderen Ports blockiert. docker-compose: services ohne ports-Direktive = nicht extern erreichbar. Traefik/nginx: upstream auf Service-Name statt IP. Regelmäßig prüfen: docker ps --format zeigt exponierte Ports.', 'Docker service isolation: internal services only in internal Docker network (no ports mapping to 0.0.0.0). Only reverse proxy has access to internal services. Firewall rule: port 80/443 open, all other ports blocked. docker-compose: services without ports directive = not externally reachable. Traefik/nginx: upstream on service name instead of IP. Regularly check: docker ps --format shows exposed ports.') } },
    ],
  }

  return (
    <main className="py-14 border-b border-white/5" style={{ background: "var(--surface-0)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Container>
        <article className="mx-auto max-w-4xl space-y-8">
          <header className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-400/90">Docker Proxy Hardening</p>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{copy.h1}</h1>
            <p className="text-zinc-300 max-w-3xl">{copy.intro}</p>
          </header>

          <section className="rounded-2xl border border-white/10 bg-black/20 p-6">
            <h2 className="text-xl font-black text-white mb-4">{copy.checklistTitle}</h2>
            <ul className="space-y-2 text-zinc-300 text-sm">
              {copy.checklist.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-white/10 bg-black/20 p-6">
            <h2 className="text-xl font-black text-white mb-4">{copy.configTitle}</h2>
            <ul className="space-y-2 text-zinc-300 text-sm">
              {copy.configItems.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
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
