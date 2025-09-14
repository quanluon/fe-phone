import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static exports for Amplify
  output: 'standalone',
  
  // Optimize for production
  compress: true,
  
  // Enable experimental features if needed
  experimental: {
    // Add any experimental features here
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  
  // Image optimization
  images: {
    unoptimized: true, // Required for static export
  },
  
  // Redirects and rewrites
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
};

export default nextConfig;
