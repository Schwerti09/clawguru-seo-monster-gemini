import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://clawguru.org';

  // Hier kommen alle deine realen Runbook-Slugs (du kannst später eine DB-Abfrage machen)
  const runbooks = [
    // Beispiel – später dynamisch aus DB laden
    'ssh-hardening', 'nginx-security', 'docker-firewall', 'fail2ban-setup'
  ];

  const locales = ['de', 'en', 'fr', 'es', 'it', 'nl', 'pl', 'ru', 'zh', 'ja'];

  const entries = locales.flatMap(locale =>
    runbooks.map(slug => ({
      url: `${baseUrl}/${locale}/runbook/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }))
  );

  return entries;
}
