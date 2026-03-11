import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://clawguru.org';

  // Hier kommen später alle echten Slugs aus deiner DB
  const slugs = ['ssh-hardening', 'nginx-security', 'docker-firewall', 'fail2ban-setup', 'prometheus-rate-limit-baseline']; // erweitere später

  const locales = ['de','en','fr','es','it','nl','pl','ru','zh','ja'];

  return locales.flatMap(locale =>
    slugs.map(slug => ({
      url: `${baseUrl}/${locale}/runbook/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }))
  );
}
