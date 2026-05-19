import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Self-hosted Docker target: emit a minimal standalone server bundle.
  output: 'standalone',
  reactStrictMode: true,
  experimental: {
    serverActions: { bodySizeLimit: '2mb' },
  },
};

export default nextConfig;
