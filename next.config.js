/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  output: 'standalone',
  images: {
    domains: [],
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
