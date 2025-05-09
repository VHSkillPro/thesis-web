/** @type {import('next').NextConfig} */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    experimental: {
        serverActions: {
            bodySizeLimit: "10mb",
        },
    },
    allowedDevOrigins: ["nvhai090903.id.vn", "*.nvhai090903.id.vn"],
};

export default nextConfig;
