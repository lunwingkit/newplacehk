/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            allowedForwardedHosts: ['localhost', 'https://solid-fishstick-vgqjgjjv777fxpp.github.dev'],
            allowedOrigins: ['http://localhost', "https://solid-fishstick-vgqjgjjv777fxpp.github.dev", 'localhost:3000']
        },
    },
    images: {
        domains: ['miquan-play.oss-cn-shenzhen.aliyuncs.com'], // Add the external domain here
        remotePatterns: [
            {
              protocol: "https",
              hostname: "lh3.googleusercontent.com",
              pathname: "/a/**",
            },
          ],
    },
};

module.exports = nextConfig