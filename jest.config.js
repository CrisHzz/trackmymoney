const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Proporciona la ruta al directorio de tu aplicación Next.js para cargar next.config.js y archivos .env
  dir: './',
})

// Configuración personalizada de Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: [
    '**/__tests__/**/*.(test|spec).(js|jsx|ts|tsx)',
    '**/*.(test|spec).(js|jsx|ts|tsx)'
  ],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app/pages/**',
    '!src/app/layout.tsx',
    '!src/app/globals.css',
    '!src/middleware.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
}

// createJestConfig es exportado de esta manera para asegurar que next/jest pueda cargar la configuración de Next.js que es asíncrona
module.exports = createJestConfig(customJestConfig) 