import type { Metadata } from 'next';
import Link from 'next/link';
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n';
import Container from '@/components/shared/Container';
import { GEO_CITIES_QUALITY, getCitiesByRegion } from '@/data/geo-cities-quality';

interface PageProps {
  params: {
    lang: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = params;
  const locale = (SUPPORTED_LOCALES.includes(lang as Locale) ? lang : 'de') as Locale;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://clawguru.org';

  const title = locale === 'de'
    ? 'IT-Security nach Stadt — lokale Compliance 2026'
    : 'IT Security by City — Local Compliance 2026';

  const description = locale === 'de'
    ? 'IT-Security-Richtlinien und Compliance-Anforderungen für Unternehmen in 50+ Städten weltweit. DSGVO, NIS2, SOC 2 und mehr.'
    : 'IT security guidelines and compliance requirements for companies in 50+ cities worldwide. GDPR, NIS2, SOC 2 and more.';

  const alternates = buildLocalizedAlternates(locale, '/it-security');

  return {
    title,
    description,
    keywords: ['IT Security', 'Compliance', 'DSGVO', 'GDPR', 'NIS2', 'SOC 2', 'Cybersecurity', 'City'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: {
      images: ['/og-image.png'],
      title,
      description,
      type: 'website',
      url: `${siteUrl}/${locale}/it-security`,
    },
    alternates,
  };
}

export default function ITSecurityHubPage({ params }: PageProps) {
  const { lang } = params;
  const locale = (SUPPORTED_LOCALES.includes(lang as Locale) ? lang : 'de') as Locale;

  const regions = ['DACH', 'UK', 'USA', 'Benelux', 'Asia', 'LatAm', 'Nordics', 'EU'] as const;

  return (
    <Container className="py-12">
      <div className="max-w-6xl mx-auto">
        {/* Trust Anchor */}
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Trust-Anker</strong>: {locale === 'de'
            ? 'Diese Seite dient der Information über lokale Compliance-Anforderungen. Keine Angriffswerkzeuge.'
            : 'This page provides information about local compliance requirements. No attack tools.'
          }
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-100 mb-4">
            {locale === 'de' ? 'IT-Security nach Stadt — lokale Compliance 2026' : 'IT Security by City — Local Compliance 2026'}
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            {locale === 'de'
              ? 'IT-Security-Richtlinien und Compliance-Anforderungen für Unternehmen in 50+ Städten weltweit.'
              : 'IT security guidelines and compliance requirements for companies in 50+ cities worldwide.'
            }
          </p>
        </div>

        {/* Region Sections */}
        {regions.map((region) => {
          const cities = getCitiesByRegion(region);
          if (cities.length === 0) return null;

          return (
            <section key={region} className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-100 mb-6">{region}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/${locale}/it-security/${city.slug}`}
                    className="block bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                  >
                    <div className="font-semibold text-cyan-400 mb-2">
                      {locale === 'de' ? city.nameDE : city.nameEN}
                    </div>
                    <div className="text-sm text-gray-300 mb-2">{city.country}</div>
                    <div className="text-xs text-gray-400">
                      {city.complianceFramework.replace(/_/g, ' ')}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        {/* CTA Section */}
        <div className="bg-gray-800 rounded-lg p-8 mt-12">
          <h2 className="text-2xl font-semibold text-gray-100 mb-6">
            {locale === 'de' ? 'Security Check für dein Unternehmen' : 'Security Check for your Company'}
          </h2>
          <p className="text-gray-300 mb-6">
            {locale === 'de'
              ? 'Führe einen kostenlosen Security-Check durch, um Schwachstellen in deiner IT-Infrastruktur zu identifizieren.'
              : 'Run a free security check to identify vulnerabilities in your IT infrastructure.'
            }
          </p>
          <Link
            href={`/${locale}/check`}
            className="inline-block bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-cyan-500 hover:to-blue-500 transition-colors"
          >
            {locale === 'de' ? 'Security Check starten' : 'Start Security Check'}
          </Link>
        </div>

        {/* Schema.org */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: locale === 'de' ? 'IT-Security nach Stadt — lokale Compliance 2026' : 'IT Security by City — Local Compliance 2026',
              description: locale === 'de'
                ? 'IT-Security-Richtlinien und Compliance-Anforderungen für Unternehmen in 50+ Städten weltweit.'
                : 'IT security guidelines and compliance requirements for companies in 50+ cities worldwide.',
              url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/it-security`,
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
                ],
              },
            }),
          }}
        />
      </div>
    </Container>
  );
}
