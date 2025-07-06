const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    // Enable symlink resolution for PNPM
    resolverMainFields: ['react-native', 'browser', 'main'],
    platforms: ['ios', 'android', 'native', 'web'],
    // Follow symlinks
    unstable_enableSymlinks: true,
    // Additional node modules paths for PNPM
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, 'node_modules/.pnpm/node_modules'),
    ],
    // Explicitly resolve React Native Reanimated
    alias: {
      'react-native-reanimated': path.resolve(__dirname, 'node_modules/react-native-reanimated'),
    },
  },
  watchFolders: [
    // Watch PNPM symlinked packages
    path.resolve(__dirname, 'node_modules/.pnpm'),
  ],
  transformer: {
    // Add support for React Native Reanimated
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  server: {
    // Improve server configuration for better stability
    port: 8081,
    host: '0.0.0.0',
    enhanceMiddleware: (middleware, server) => {
      return (req, res, next) => {
        // Add CORS headers for better compatibility
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        if (req.method === 'OPTIONS') {
          res.writeHead(200);
          res.end();
          return;
        }
        
        return middleware(req, res, next);
      };
    },
  },
  // Add better error handling
  resetCache: true,
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
