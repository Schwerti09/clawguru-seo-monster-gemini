/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    optimizePackageImports: ["react", "react-dom", "framer-motion"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "react$": require.resolve("react"),
      // Map exact 'react-dom' to a small compat shim that provides render/hydrate via React 18/19 Client API
      "react-dom$": require("path").resolve(__dirname, "lib/react-dom-compat.js"),
      "react-dom/client": require.resolve("react-dom/client"),
      "react-dom/server": require.resolve("react-dom/server"),
      "react/jsx-runtime": require.resolve("react/jsx-runtime"),
      "react/jsx-dev-runtime": require.resolve("react/jsx-dev-runtime"),
    };
    return config;
  },
};

module.exports = nextConfig;
