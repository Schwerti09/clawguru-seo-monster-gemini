/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    isrFlushToDisk: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
