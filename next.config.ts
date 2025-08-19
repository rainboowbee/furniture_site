import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Настройки изображений
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "cdn.pixabay.com" }
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 дней
  },

  // Экспериментальные функции
  experimental: {
    serverActions: {
      allowedOrigins: [
        "https://gardenfab.ru", 
        "https://www.gardenfab.ru", 
        "http://localhost:3000"
      ],
    },
    optimizePackageImports: ['framer-motion', 'gsap'],
  },

  // Настройки безопасности
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
      ],
    },
  ],

  // Настройки сборки
  output: 'standalone', // Для продакшена
  poweredByHeader: false,
  
  // Настройки TypeScript
  typescript: {
    ignoreBuildErrors: false, // Строгая проверка
  },
  
  // Настройки ESLint
  eslint: {
    ignoreDuringBuilds: false, // Проверка при сборке
  },
};

export default nextConfig;
