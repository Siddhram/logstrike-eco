/** @type {import('next').NextConfig} */
const nextConfig = {
  // Existing configuration...
  
  images: {
    domains: [
      'images.unsplash.com',
      'unsplash.com',
      'plus.unsplash.com',
      'media.unsplash.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
        pathname: '**',
      }
    ]
  },
  
  // Other configuration options...
}

export default nextConfig;
