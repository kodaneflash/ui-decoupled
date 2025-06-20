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
  },
  watchFolders: [
    // Watch PNPM symlinked packages
    path.resolve(__dirname, 'node_modules/.pnpm'),
  ],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
