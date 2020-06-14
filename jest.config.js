process.env.TZ = 'GMT'
module.exports = {
  globals: {
    'ts-jest': {
      isolatedModules: true
    },
    __DEV__: false
  },
  setupFiles: [],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.test.{ts,tsx}', '!src/**/__tests__/**'],
  coverageReporters: ['lcov'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.js$': 'ts-jest'
  },
  moduleDirectories: ['node_modules', 'src'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  moduleNameMapper: {
    '\\.s?css$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/scripts/jest/file-mock.js'
  },
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 80,
      lines: 80,
      statements: 85
    }
  },
  transformIgnorePatterns: ['node_modules/(?!(date-fns)/)']
}
