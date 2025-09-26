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
    // Only add proxy if we're using external API in development
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (process.env.NODE_ENV === 'development' && apiBaseUrl && !apiBaseUrl.includes('localhost')) {
      return [
        {
          source: '/api/:path*',
          destination: `${apiBaseUrl}/:path*`,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
