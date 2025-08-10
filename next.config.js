/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'palette-haus.example.com'],
    formats: ['image/avif', 'image/webp'],
  },
  // For static export, uncomment the following lines:
  // output: 'export',
  // images: { unoptimized: true },
};

module.exports = nextConfig;