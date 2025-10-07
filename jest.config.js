const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Proporciona la ruta al directorio de tu aplicación Next.js para cargar next.config.js y archivos .env
  dir: './',
})

// Configuración personalizada de Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  // Incluir tests de nueva arquitectura y tests existentes
  testMatch: [
    '<rootDir>/tests/unit/**/*.test.(js|jsx|ts|tsx)',
    '<rootDir>/tests/integration/**/*.test.(js|jsx|ts|tsx)',
    '<rootDir>/src/**/__tests__/**/*.(test|spec).(js|jsx|ts|tsx)',
    '<rootDir>/src/**/*.(test|spec).(js|jsx|ts|tsx)'
  ],
  // Excluir pruebas E2E, PWA y offline
  testPathIgnorePatterns: [
    '/node_modules/',
    '/testEntrega3/',
    '/pruebas_escenarios/',
    '.*offline.*',
    '.*pwa.*',
    '.*service-worker.*'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    // Incluir código fuente
    'src/**/*.{js,jsx,ts,tsx}',
    // Excluir archivos que no son código
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
    '!src/**/*.test.tsx',
    '!src/**/*.spec.ts',
    '!src/**/*.spec.tsx',
    '!src/**/__tests__/**',
    // Excluir funcionalidad offline y PWA
    '!src/lib/offlineStorage.ts',
    '!src/lib/pwaExample.ts',
    '!src/lib/useOnlineStatus.ts',
    // Excluir scripts y middleware
    '!src/scripts/**',
    '!src/middleware.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  // Configuración de timeout para pruebas
  testTimeout: 10000,
  // Verbose para mejor output
  verbose: true,
  // Detectar memory leaks
  detectLeaks: false,
  // Paralelismo
  maxWorkers: '50%'
}

// createJestConfig es exportado de esta manera para asegurar que next/jest pueda cargar la configuración de Next.js que es asíncrona
module.exports = createJestConfig(customJestConfig) 