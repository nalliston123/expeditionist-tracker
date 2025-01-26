/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  experimental: {
    appDir: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
      }
      config.resolve.alias = {
        ...config.resolve.alias,
        "date-fns": false,
        "react-day-picker": false,
      }
    }
    return config
  },
  distDir: ".next",
  generateBuildId: async () => {
    return "my-build-id"
  },
}

module.exports = nextConfig

