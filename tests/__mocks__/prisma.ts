/**
 * Mock centralizado para Prisma Client
 * Implementa test doubles para todas las operaciones de base de datos
 * 
 * Principios aplicados:
 * - Test Doubles: Usa mocks y stubs para aislar dependencias
 * - FIRST: Independent - Los tests no dependen de una BD real
 */

import { jest } from '@jest/globals';

// Mock data para tests
export const mockUsuario = {
  id: 1,
  nombre: 'Test User',
  email: 'test@example.com',
  moneda_preferida: 'USD',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01')
};

export const mockCategoria = {
  id: 1,
  nombre: 'Alimentación',
  usuario_id: 1,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01')
};

export const mockGasto = {
  id: 1,
  usuario_id: 1,
  monto: 100.50,
  fecha: new Date('2024-01-15'),
  descripcion: 'Comida',
  categoria_id: 1,
  factura: false,
  metodo_pago: 'efectivo',
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
  categoria: mockCategoria
};

export const mockIngreso = {
  id: 1,
  usuario_id: 1,
  monto: 1000.00,
  fecha: new Date('2024-01-01'),
  descripcion: 'Salario',
  fuente: 'Trabajo',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01')
};

// Mock de operaciones CRUD para cada modelo
export const createMockPrismaClient = () => ({
  usuario: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn()
  },
  categoria: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn()
  },
  gasto: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
    count: jest.fn(),
    aggregate: jest.fn()
  },
  ingreso: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
    count: jest.fn(),
    aggregate: jest.fn()
  },
  $connect: jest.fn(),
  $disconnect: jest.fn(),
  $transaction: jest.fn()
});

// Export del mock por defecto
const mockPrismaClient = createMockPrismaClient();

export const PrismaClient = jest.fn(() => mockPrismaClient);

export default mockPrismaClient;

