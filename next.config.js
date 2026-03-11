/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // saubere URLs ohne /
  trailingSlash: false,
  poweredByHeader: false,
  compress: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/sitemap-index",
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": require("path").resolve(__dirname),
    };
    return config;
  },
};

module.exports = nextConfig;