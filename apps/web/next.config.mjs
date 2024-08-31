// import path mjs
import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import withPWAInit from 'next-pwa';

const isDev = process.env.NODE_ENV !== 'production';

const withPWA = withPWAInit({
  dest: 'public',
  disable: isDev,

  exclude: [
    // add buildExcludes here
    ({ asset, compilation }) => {
      if (
        asset.name.startsWith('server/') ||
        asset.name.match(
          /^((app-|^)build-manifest\.json|react-loadable-manifest\.json)$/,
        )
      ) {
        return true;
      }
      if (isDev && !asset.name.startsWith('static/runtime/')) {
        return true;
      }
      return false;
    },
  ],
});

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
        hostname: 'pub-f622985fd92b4796a691361dda9a213a.r2.dev',
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
      {
        protocol: 'https',
        hostname: 'pilatesreform.id',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['@node-rs/argon2'],
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
  output: 'standalone',
  transpilePackages: ['@repo/ui'],
};

export default withPWA(nextConfig);
