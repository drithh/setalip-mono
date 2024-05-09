/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@node-rs/argon2'],
  },
  transpilePackages: ['@repo/ui'],
};

export default nextConfig;
