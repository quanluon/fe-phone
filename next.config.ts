import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static exports for Amplify
  output: 'export',
  
  // Optimize for production
  compress: true,
  
  // Disable server-side features for static export
  trailingSlash: true,
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  
  // Image optimization
  images: {
    unoptimized: true, // Required for static export
  },
  
  // Disable features that don't work with static export
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
