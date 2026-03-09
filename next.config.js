/** @type {import('next').NextConfig} */
const nextConfig = {
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
