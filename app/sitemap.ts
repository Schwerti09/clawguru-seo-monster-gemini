import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://clawguru.org';

  return [
    // Haupt-Sitemap-Index
    { url: `${baseUrl}/sitemap/runbooks.xml`, lastModified: new Date() },
    { url: `${baseUrl}/sitemap/solutions.xml`, lastModified: new Date() },
    { url: `${baseUrl}/sitemap/tags.xml`, lastModified: new Date() },
    { url: `${baseUrl}/sitemap/providers.xml`, lastModified: new Date() },
    { url: `${baseUrl}/sitemap/cves.xml`, lastModified: new Date() },
  ];
}
