/**
 * Configuración global de Jest
 * 
 * Este archivo se ejecuta antes de todas las pruebas y configura:
 * - Testing Library matchers
 * - Mocks globales para Next.js, Clerk y Prisma
 * - Variables de entorno para pruebas
 */

import '@testing-library/jest-dom'

// Variables de entorno para pruebas
process.env.NODE_ENV = 'test'
process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'test_clerk_key'
process.env.CLERK_SECRET_KEY = 'test_clerk_secret'

// Mock para Next.js router
jest.mock('next/router', () => require('next-router-mock'))

// Mock global para console.log, console.error en tests (opcional, comentado por defecto)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   error: jest.fn(),
// }

// NO CREAR mocks globales de Clerk y Prisma aquí
// Se crean en los archivos de test para mejor control (FIRST: Independent)
// Los mocks están en tests/__mocks__/

// Timeout global para tests
jest.setTimeout(10000)

// Cleanup automático después de cada test
afterEach(() => {
  jest.clearAllMocks()
}) 