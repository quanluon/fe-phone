import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for production
  compress: true,
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  
  // Image optimization (Vercel handles this automatically)
  images: {
    domains: ['localhost', 'your-api-domain.com'], // Add your API domain here
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

export default nextConfig;
