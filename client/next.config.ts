/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const apiBase =
      process.env.API_BASE_URL ||
      (process.env.NODE_ENV === 'development'
        ? 'http://localhost:8000'
        : 'https://troubled-paula-step-029fdb19.koyeb.app');

    return [
      {
        source: '/api/:path*',
        destination: `${apiBase}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
