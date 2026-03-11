import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://clawguru.org';
  const cves = ['CVE-2024-6387', 'CVE-2024-3094', 'CVE-2023-4863', 'CVE-2024-21626'];

  const locales = ['de','en','fr','es','it','nl','pl','ru','zh','ja'];

  return locales.flatMap(locale =>
    cves.map(cve => ({
      url: `${baseUrl}/${locale}/solutions/fix-${cve}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }))
  );
}
