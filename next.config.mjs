/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  async rewrites() {
    // Note: Proxy handling is now done through /api/proxy/[...path] route
    // This provides better control over headers and error handling
    return [];
  },
};

export default nextConfig;
