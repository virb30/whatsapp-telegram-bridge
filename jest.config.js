/** @type {import('jest').Config} */
module.exports = {
  projects: [, '<rootDir>/frontend'],
  coverageDirectory: 'coverage',
  collectCoverage: true,
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
};
