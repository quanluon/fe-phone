import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const httpsHostnames = [
  'store.storeimages.cdn-apple.com',
  'example.com',
  'adjxk71gc3.execute-api.ap-southeast-1.amazonaws.com',
  'cdn2.cellphones.com.vn',
  'mac-center.com.pe',
  'cong-phone-dev.s3.ap-southeast-1.amazonaws.com',
  'd10gwy2ckxccqn.cloudfront.net',
  'pngimg.com'
]

const nextConfig: NextConfig = {
  // Optimize for production
  compress: true,
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  
  // Image optimization (Vercel handles this automatically)
  images: {
    remotePatterns: [
      ...httpsHostnames.map((hostname) => ({
        protocol: 'https' as const,
        hostname,
      })),
      ...httpsHostnames.map((hostname) => ({
        protocol: 'http' as const,
        hostname,
      })),
      {
        protocol: 'http' as const,
        hostname: 'localhost',
      },
    ],
  },
  
  // Enable experimental features if needed
  experimental: {
    // Add any experimental features here
  },
  
  // Redirects and rewrites for Vercel
  async redirects() {
    return [
      // Add any redirects here
    ];
  },
  
  async rewrites() {
    return [
      // Add any rewrites here
    ];
  },
  
  // ESLint and TypeScript configuration
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default withNextIntl(nextConfig);
