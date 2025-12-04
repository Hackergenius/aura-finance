/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Configuration pour Tailwind/PostCSS
  // Cette partie est cruciale pour le build
  experimental: {
    // Force la compatibilité avec Next.js 14 et les librairies externes
    forceSwcTransforms: true,
    // Optimise le chargement des gros packages comme lucide et framer-motion
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'recharts',
      'geist', // Ajout pour s'assurer que Geist est bien géré
    ],
  },

  // Ignore les erreurs TypeScript/ESLint pendant le build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Configuration pour les images
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