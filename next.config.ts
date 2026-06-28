import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@langchain/langgraph', 'mongodb'],
};

export default nextConfig;
