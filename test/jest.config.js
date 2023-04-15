module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
  ],
  coverageDirectory: './test/coverage/',
  coverageReporters: [
    'lcov',
    'text-summary',
  ],
  moduleNameMapper: {
    '^.+\\.(scss)$': 'identity-obj-proxy'
  },
  testMatch: [
    '**/*.spec.js',
  ],
  rootDir: 'src',
  setupFiles: [],
};
