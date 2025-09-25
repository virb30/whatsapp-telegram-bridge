export default {
  displayName: 'backend',
  preset: '../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        diagnostics: false,
        babelConfig: {
          presets: [
            ['@babel/preset-env', { targets: { node: 'current' } }],
            ['@babel/preset-typescript', {}],
          ],
          plugins: [
            ['@babel/plugin-proposal-decorators', { version: '2023-05', decoratorsBeforeExport: true }],
            ['@babel/plugin-proposal-class-properties', { loose: true }],
          ],
        },
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../coverage/backend',
  transformIgnorePatterns: ['/node_modules/(?!uuid)'],
};
