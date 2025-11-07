const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  output: process.env.NEXT_OUTPUT_MODE,

  // Optimize builds with SWC minification
  swcMinify: true,

  // Remove console logs in production (keep errors and warnings)
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Modularize imports for automatic tree-shaking
  modularizeImports: {
    // Automatically transform lodash barrel imports
    'lodash': {
      transform: 'lodash/{{member}}',
    },
    // Ensure Radix UI components are tree-shaken
    '@radix-ui/react-icons': {
      transform: '@radix-ui/react-icons/dist/{{member}}',
    },
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: { unoptimized: true },

  // Webpack customizations for bundle optimization
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Replace full plotly.js with basic distribution to reduce bundle size
      // This reduces plotly from ~5 MB to ~800 KB
      config.resolve.alias = {
        ...config.resolve.alias,
        'plotly.js': 'plotly.js-basic-dist',
      };
    }

    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
