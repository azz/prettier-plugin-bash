'use strict';

const ENABLE_COVERAGE = !!process.env.CI;

module.exports = {
  collectCoverage: ENABLE_COVERAGE,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.js',
    '!<rootDir>/node_modules/',
    '!<rootDir>/tests_config/',
  ],
  setupFiles: ['<rootDir>/tests_config/run_spec.js'],
  testRegex: 'jsfmt\\.spec\\.js$|__tests__/.*\\.js$',
  snapshotSerializers: ['jest-snapshot-serializer-raw'],
  testEnvironment: 'node',
};
