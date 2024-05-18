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
        protocol: 'https',
        hostname: 'fakeimg.pl',
      },
      {
        protocol: 'https',
        hostname: 'wembleypark.com',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['@node-rs/argon2'],
  },
  transpilePackages: ['@repo/ui'],
};

export default nextConfig;
