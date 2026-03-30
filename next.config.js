/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
      },
    ],
    // For local images during development
    unoptimized: process.env.NODE_ENV === 'development',
  },
}
module.exports = nextConfig
