import type {Config} from 'jest';

const config: Config = {
  displayName: 'backend',
  moduleFileExtensions: [
    'js',
    'json',
    'ts'
  ],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': '@swc/jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!uuid)',
     "\\.pnp\\.[^\\/]+$"
  ],
  collectCoverageFrom: [
    '**/*.(t|j)s'
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/$1'
  }
};

export default config;