/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['de', 'en', 'fr', 'es', 'it', 'nl', 'pl', 'ru', 'zh', 'ja'],
    defaultLocale: 'de',
    localeDetection: false,
  },
  experimental: {
    isrFlushToDisk: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NETLIFY_ACCOUNT_ID: 'rolf-schwertfechter',
    NETLIFY_SITE_ID: process.env.NETLIFY_SITE_ID,
  },
};

module.exports = nextConfig;
