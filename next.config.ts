/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Allow images from Plants of Distinction
      {
        protocol: 'https',
        hostname: 'www.plantsofdistinction.co.uk',
        port: '',
        pathname: '/**',
      },
      // (Optional) include any other external image domains you're using
      {
        protocol: 'https',
        hostname: '5aday.co.nz',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.vyaparify.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'tagawagardens.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'snaped.fns.usda.gov',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'nutritionsource.hsph.harvard.edu',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.hhs1.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
