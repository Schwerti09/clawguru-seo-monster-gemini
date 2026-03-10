(
echo /** @type {import('next').NextConfig} */
echo const nextConfig = {
echo   eslint: { ignoreDuringBuilds: true },
echo   typescript: { ignoreBuildErrors: true },
echo };
echo module.exports = nextConfig;
) > next.config.js