import '@testing-library/jest-dom'

// Mock para Next.js router
jest.mock('next/router', () => require('next-router-mock'))

// Mock para Clerk authentication
jest.mock('@clerk/nextjs/server', () => ({
  currentUser: jest.fn(),
}))

// Mock para Prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    usuario: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    gasto: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    ingreso: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    categoria: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  })),
})) 