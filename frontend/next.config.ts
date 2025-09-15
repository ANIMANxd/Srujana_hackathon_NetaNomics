import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  publicRuntimeConfig: {
    // This will be available on both server and client
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
  },
  /* config options here */
};

export default nextConfig;
