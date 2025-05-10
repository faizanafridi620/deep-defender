/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // Make environment variables available to the client
    // Note: Only add non-sensitive variables here
    DEBUG: process.env.DEBUG || 'false',
  },
  // Enable experimental features if needed
  experimental: {
    // Add experimental features here if needed
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
