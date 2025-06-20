module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '~': './src',
          '@ledgerhq/native-ui/styles/index': '@ledgerhq/native-ui/lib/styles/index',
        },
      },
    ],
    'react-native-reanimated/plugin', // Must be listed last
  ],
};
