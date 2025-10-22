module.exports = {
  moduleNameMapper: {
    '\\.(ttf)$': '<rootDir>/tests/mocks/file-mock.js',
  },
  preset: 'react-native',
  transformIgnorePatterns: ['node_modules/(?!(react-native|@react-native)/)'],
};
