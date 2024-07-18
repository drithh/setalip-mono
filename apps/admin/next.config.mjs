/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'wembleypark.com',
      },
      {
        protocol: 'https',
        hostname: 'admin.pilatesreform.id',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['@node-rs/argon2'],
  },
  transpilePackages: ['@repo/ui'],
};

export default nextConfig;
