import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  setupFiles: ['./jest-setup.ts'],
  clearMocks: true,
  transform: {
    ".(ts|tsx)": 'ts-jest'
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx','js', 'jsx', 'json' ],
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ],
  coverageDirectory: './coverage',
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0
    }
  },
  collectCoverageFrom: ['src/**/*.{js,ts,tsx,jsx}', '!<rootDir>/node_modules/'],
  testMatch: ['<rootDir>/**/*.(spec|test).{ts,tsx,js,jsx}'],
  watchPathIgnorePatterns: ['tests/fixtures/.*'],
  rootDir: '.',
  modulePaths: [
    '<rootDir>'
  ],
}

export default config
