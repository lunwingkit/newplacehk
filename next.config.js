/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            allowedForwardedHosts: ['localhost', 'https://solid-fishstick-vgqjgjjv777fxpp.github.dev'],
            allowedOrigins: ['http://localhost', "https://solid-fishstick-vgqjgjjv777fxpp.github.dev", 'localhost:3000']
        },
        runtime: "nodejs", // Force Node.js runtime
    },
    images: {
        domains: ['miquan-play.oss-cn-shenzhen.aliyuncs.com'], // Add the external domain here
    },
};

module.exports = nextConfig