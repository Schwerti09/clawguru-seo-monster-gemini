/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/sitemaps/:name.xml",
        destination: "/sitemaps/:name",
      },
    ]
  },
}
module.exports = nextConfig
