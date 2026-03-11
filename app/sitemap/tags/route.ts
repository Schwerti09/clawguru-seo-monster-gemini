import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://clawguru.org';
  const tags = ['ssh', 'nginx', 'docker', 'fail2ban', 'prometheus', 'kubernetes', 'traefik'];

  const locales = ['de','en','fr','es','it','nl','pl','ru','zh','ja'];

  return locales.flatMap(locale =>
    tags.map(tag => ({
      url: `${baseUrl}/${locale}/tag/${tag}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }))
  );
}
