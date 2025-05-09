/** @type {import('next').NextConfig} */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    experimental: {
        serverActions: {
            bodySizeLimit: "10mb",
        },
    },
    allowedDevOrigins: ["https://nvhai090903.id.vn"],
};

export default nextConfig;
