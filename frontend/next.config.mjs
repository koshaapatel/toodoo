/** @type {import('next').NextConfig} */
const nextConfig = {eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    const isDev = process.env.NODE_ENV !== 'production';
    return [
      {
        source: '/api/:path*',
        destination: isDev
          ? 'http://localhost:3001/:path*' // Local backend during development
          : 'http://backend:3001/:path*',   // Docker backend in production
      },
    ];
  },
};

export default nextConfig;
