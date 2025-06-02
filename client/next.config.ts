/** @type {import('next').NextConfig} */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    experimental: {
        serverActions: {
            bodySizeLimit: "10mb",
        },
    },
    cacheHandler: require.resolve(
        "next/dist/server/lib/incremental-cache/file-system-cache.js"
    ),
    output: "standalone",
};

export default nextConfig;
