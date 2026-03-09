/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['de', 'en', 'fr', 'es', 'it', 'nl', 'pl', 'ru', 'zh', 'ja'],
    defaultLocale: 'de',
    localeDetection: false,          // wichtig bei Middleware!
  },
  async redirects() {
    return [
      { source: '/:lang(de|en|fr|es|it|nl|pl|ru|zh|ja)/old/:path*', destination: '/:lang/new/:path*', permanent: true },
      { source: '/:path*', destination: '/de/:path*', permanent: false },
    ];
  },
  async headers() {
    return [
      { source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'index,follow' }] },
    ];
  },
  experimental: {
    isrFlushToDisk: true,
  },
  eslint: {
    ignoreDuringBuilds: true,        // ← das überspringt ALLE Lint-Fehler beim Build
  },
  env: {
    NETLIFY_ACCOUNT_ID: 'rolf-schwertfechter',
    NETLIFY_SITE_ID: process.env.NETLIFY_SITE_ID,
  },
};

module.exports = nextConfig;
