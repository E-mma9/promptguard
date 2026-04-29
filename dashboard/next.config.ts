import type { NextConfig } from 'next';

const isStaticExport = process.env.STATIC_EXPORT === '1';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: { bodySizeLimit: '2mb' },
  },
  ...(isStaticExport
    ? {
        output: 'export' as const,
        basePath: '/promptguard',
        assetPrefix: '/promptguard',
        images: { unoptimized: true },
        trailingSlash: true,
        typescript: { ignoreBuildErrors: true },
        eslint: { ignoreDuringBuilds: true },
      }
    : {}),
};

export default nextConfig;
