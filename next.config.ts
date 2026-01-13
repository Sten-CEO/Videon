import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mark Remotion packages as external to avoid bundling native dependencies
  serverExternalPackages: [
    '@remotion/renderer',
    '@remotion/bundler',
    '@remotion/cli',
    'remotion',
  ],

  // Increase timeout for video rendering API routes
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
