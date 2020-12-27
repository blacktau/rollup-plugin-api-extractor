import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  clearMocks: true,
  transform: {
    ".(ts|tsx)": 'ts-jest'
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx','js', 'jsx', 'json' ],
  globals: {
    window: {}
  },
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
  watchPathIgnorePatterns: ['dist']
}

export default config
