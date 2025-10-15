import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingRoot: __dirname,
  webpack: (config) => {
    // Reduce memory usage for webpack cache
    config.cache = false;
    return config;
  },
};

export default nextConfig;
