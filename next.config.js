/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permitir desarrollo desde IPs externas (por ejemplo, 192.168.1.100)
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://192.168.1.100:3000',
    // Agrega aquí otras IPs o dominios que uses en desarrollo
  ],
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  output: 'standalone',
  images: {
    domains: [],
  },
  // Configuración para evitar problemas de caché completamente
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate, max-age=0',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate, max-age=0',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate, max-age=0',
          },
        ],
      },
    ]
  },
  // Configuraciones para reducir el uso de memoria durante el build
  webpack: (config, { isServer }) => {
    // Optimizar el bundle para usar menos memoria
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
            maxSize: 244000, // Limitar el tamaño de los chunks
          },
        },
      },
    };
    
    // Reducir el paralelismo para usar menos memoria
    config.parallelism = 1;
    
    return config;
  },
  // Configurar el compilador SWC para usar menos memoria
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig
