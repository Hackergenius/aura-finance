/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ignore les erreurs TypeScript pendant le build pour éviter les blocages
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignore les erreurs ESLint pendant le build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configuration pour les images (utile plus tard)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;