import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();
//require('dotenv').config();

const nextConfig: NextConfig = {
  /* config options here */
  // env: {
  //   PORT: process.env.PORT,
  // },

  // Configure experimental features for WebView compatibility
  experimental: {
    // Optimize package imports for better performance
    optimizePackageImports: ['slick-carousel'],

    // Enable CSS optimization
    optimizeCss: true,
  },

  images: {
    domains: ['images.unsplash.com', 'admin.wuyoufuwu88.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'eiee6dhaa8.ufs.sh',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'http',
        hostname: 'resources.elitestars.net',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'http',
        hostname: 'eiee6dhaa8.ufs.sh',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'http',
        hostname: 'eiee6dhaa8.ufs.sh',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'http',
        hostname: '150.95.82.174',
        port: '5005',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'http',
        hostname: 'admin.globaltakeout.com',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'admin.globaltakeout.com',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'www.admin.globaltakeout.com',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'resources.elitestars.dev',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'admin.wuyoufuwu88.com',
        port: '',
        pathname: '/**',
        search: '',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
