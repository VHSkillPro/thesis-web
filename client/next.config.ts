/** @type {import('next').NextConfig} */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    experimental: {
        serverActions: {
            allowedOrigins: [
                "nvhai090903.id.vn",
                "*.nvhai090903.id.vn",
                "localhost",
            ],
            bodySizeLimit: "3mb",
        },
    },
    cacheHandler: require.resolve(
        "next/dist/server/lib/incremental-cache/file-system-cache.js"
    ),
    output: "standalone",
};

export default nextConfig;
