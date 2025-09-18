/** @type {import('jest').Config} */
module.exports = {
  projects: [
    '<rootDir>/backend',
    '<rootDir>/frontend'
  ],
  coverageDirectory: 'coverage',
  collectCoverage: true,
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
};
