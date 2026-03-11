import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://clawguru.org';
  const providers = ['hetzner', 'digitalocean', 'aws', 'azure', 'vercel', 'traefik'];

  const locales = ['de','en','fr','es','it','nl','pl','ru','zh','ja'];

  return locales.flatMap(locale =>
    providers.map(provider => ({
      url: `${baseUrl}/${locale}/provider/${provider}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.85,
    }))
  );
}
