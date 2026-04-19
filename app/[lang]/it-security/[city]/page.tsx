import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n';
import Container from '@/components/shared/Container';
import { GEO_CITIES_QUALITY, getCityBySlug, getComplianceText } from '@/data/geo-cities-quality';

interface PageProps {
  params: {
    lang: string;
    city: string;
  };
}

export async function generateStaticParams() {
  const params: { lang: string; city: string }[] = [];
  
  for (const locale of SUPPORTED_LOCALES) {
    for (const city of GEO_CITIES_QUALITY) {
      params.push({ lang: locale, city: city.slug });
    }
  }
  
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, city: citySlug } = params;
  const locale = (SUPPORTED_LOCALES.includes(lang as Locale) ? lang : 'de') as Locale;
  const city = getCityBySlug(citySlug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://clawguru.org';

  if (!city) {
    return { title: 'Page Not Found' };
  }

  const cityName = locale === 'de' ? city.nameDE : city.nameEN;
  const complianceText = getComplianceText(city.complianceFramework, locale);
  const title = `IT-Security für Unternehmen in ${cityName} 2026 — ${city.complianceFramework.replace(/_/g, ' ')}`;
  const description = `Sicherheitsanforderungen für Unternehmen in ${cityName}: ${complianceText}. Kostenloser Security-Check.`;

  const alternates = buildLocalizedAlternates(locale, `/it-security/${city.slug}`);

  return {
    title,
    description,
    keywords: ['IT Security', 'Compliance', city.complianceFramework, cityName, city.country, 'Cybersecurity'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: {
      images: ['/og-image.png'],
      title,
      description,
      type: 'article',
      url: `${siteUrl}/${locale}/it-security/${city.slug}`,
    },
    alternates,
  };
}

export default function CityITSecurityPage({ params }: PageProps) {
  const { lang, city: citySlug } = params;
  const locale = (SUPPORTED_LOCALES.includes(lang as Locale) ? lang : 'de') as Locale;
  const city = getCityBySlug(citySlug);

  if (!city) {
    notFound();
  }

  const cityName = locale === 'de' ? city.nameDE : city.nameEN;
  const complianceText = getComplianceText(city.complianceFramework, locale);
  const complianceFrameworks = city.complianceFramework.split('_');

  return (
    <Container className="py-12">
      <div className="max-w-4xl mx-auto">
        {/* Trust Anchor */}
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Trust-Anker</strong>: {locale === 'de'
            ? `Dieser Guide dient der Information über lokale Compliance-Anforderungen für Unternehmen in ${cityName}. Keine Angriffswerkzeuge.`
            : `This guide provides information about local compliance requirements for companies in ${cityName}. No attack tools.`
          }
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-100 mb-4">
            {locale === 'de' ? `IT-Security für Unternehmen in ${cityName} 2026` : `IT Security for Companies in ${cityName} 2026`}
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            {locale === 'de' ? `Sicherheitsanforderungen und Compliance-Pflichten für Unternehmen in ${cityName}, ${city.country}.` : `Security requirements and compliance obligations for companies in ${cityName}, ${city.country}.`}
          </p>
          
          {/* City Info */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-semibold text-gray-100">{locale === 'de' ? 'Stadt' : 'City'}</h3>
                <p className="text-gray-300">{cityName}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-100">{locale === 'de' ? 'Land' : 'Country'}</h3>
                <p className="text-gray-300">{city.country}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-100">{locale === 'de' ? 'Regulator' : 'Regulator'}</h3>
                <p className="text-gray-300">{city.localRegulator}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Direct Answer Box */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 border-l-4 border-cyan-500">
          <h2 className="text-lg font-semibold text-gray-100 mb-3">
            {locale === 'de' ? `Welche Sicherheitsanforderungen gelten für Unternehmen in ${cityName}?` : `What security requirements apply to companies in ${cityName}?`}
          </h2>
          <p className="text-gray-300">
            {complianceText}
          </p>
        </div>

        {/* Compliance Framework Cards */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-100 mb-6">
            {locale === 'de' ? 'Compliance-Rahmenwerke' : 'Compliance Frameworks'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {complianceFrameworks.map((framework) => (
              <div key={framework} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="font-semibold text-cyan-400 mb-2">{framework}</h3>
                <p className="text-sm text-gray-300">
                  {locale === 'de' ? 'Lokale Compliance-Pflichten und Sicherheitsstandards.' : 'Local compliance obligations and security standards.'}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-cyan-900 to-blue-900 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">
            {locale === 'de' ? `Security Check für ${cityName}` : `Security Check for ${cityName}`}
          </h2>
          <p className="text-gray-300 mb-6">
            {locale === 'de'
              ? 'Führe einen kostenlosen Security-Check durch, um Schwachstellen in deiner IT-Infrastruktur zu identifizieren.'
              : 'Run a free security check to identify vulnerabilities in your IT infrastructure.'
            }
          </p>
          <Link
            href={`/${locale}/check`}
            className="inline-block bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            {locale === 'de' ? 'Security Check starten' : 'Start Security Check'}
          </Link>
        </div>

        {/* Internal Links */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-100 mb-6">
            {locale === 'de' ? 'Weiterführende Ressourcen' : 'Additional Resources'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href={`/${locale}/solutions/dsgvo-compliance-automation`}
              className="block bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="font-semibold text-cyan-400 mb-2">
                {locale === 'de' ? 'DSGVO Compliance Automation' : 'GDPR Compliance Automation'}
              </div>
              <div className="text-sm text-gray-300">
                {locale === 'de' ? 'Automatisierte Compliance-Workflows für Unternehmen.' : 'Automated compliance workflows for companies.'}
              </div>
            </Link>
            <Link
              href={`/${locale}/runbooks`}
              className="block bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="font-semibold text-cyan-400 mb-2">
                {locale === 'de' ? 'Security Runbooks' : 'Security Runbooks'}
              </div>
              <div className="text-sm text-gray-300">
                {locale === 'de' ? '600+ ausführbare Security Playbooks.' : '600+ executable security playbooks.'}
              </div>
            </Link>
            <Link
              href={`/${locale}/openclaw`}
              className="block bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="font-semibold text-cyan-400 mb-2">
                {locale === 'de' ? 'OpenClaw Framework' : 'OpenClaw Framework'}
              </div>
              <div className="text-sm text-gray-300">
                {locale === 'de' ? 'Self-Hosted Security Framework.' : 'Self-hosted security framework.'}
              </div>
            </Link>
            <Link
              href={`/${locale}/it-security`}
              className="block bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="font-semibold text-cyan-400 mb-2">
                {locale === 'de' ? 'IT-Security nach Stadt' : 'IT Security by City'}
              </div>
              <div className="text-sm text-gray-300">
                {locale === 'de' ? 'Compliance-Anforderungen für 50+ Städte weltweit.' : 'Compliance requirements for 50+ cities worldwide.'}
              </div>
            </Link>
          </div>
        </section>

        {/* Schema.org */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: `IT-Security für Unternehmen in ${cityName} 2026`,
              description: `Sicherheitsanforderungen für Unternehmen in ${cityName}: ${complianceText}. Kostenloser Security-Check.`,
              url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/it-security/${city.slug}`,
              breadcrumbList: {
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: locale === 'de' ? 'Home' : 'Home',
                    item: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}`,
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: locale === 'de' ? 'IT-Security' : 'IT Security',
                    item: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/it-security`,
                  },
                  {
                    '@type': 'ListItem',
                    position: 3,
                    name: cityName,
                    item: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/it-security/${city.slug}`,
                  },
                ],
              },
              mainEntity: {
                '@type': 'FAQPage',
                mainEntity: [
                  {
                    '@type': 'Question',
                    name: locale === 'de' ? `Welche Sicherheitsanforderungen gelten für Unternehmen in ${cityName}?` : `What security requirements apply to companies in ${cityName}?`,
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: complianceText,
                    },
                  },
                  {
                    '@type': 'Question',
                    name: locale === 'de' ? 'Welche Compliance-Rahmenwerke sind relevant?' : 'Which compliance frameworks are relevant?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: complianceFrameworks.join(', '),
                    },
                  },
                  {
                    '@type': 'Question',
                    name: locale === 'de' ? 'Wie kann ich meine IT-Sicherheit verbessern?' : 'How can I improve my IT security?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: locale === 'de'
                        ? 'Führe einen kostenlosen Security-Check durch, identifiziere Schwachstellen und nutze unsere 600+ ausführbaren Security Runbooks zur Behebung.'
                        : 'Run a free security check, identify vulnerabilities, and use our 600+ executable security runbooks for remediation.',
                    },
                  },
                ],
              },
            }),
          }}
        />
      </div>
    </Container>
  );
}
