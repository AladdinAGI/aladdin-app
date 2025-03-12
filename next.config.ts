import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 忽略 TypeScript 构建时的错误
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['coin-images.coingecko.com', 'assets.coingecko.com'],
  },
};

export default nextConfig;
