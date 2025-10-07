/**
 * Pruebas de integración para API de Categorías
 * 
 * Principios FIRST aplicados:
 * - Fast: Usa mocks, no BD real
 * - Independent: Tests aislados
 * - Repeatable: Mocks consistentes
 * - Self-validating: Assertions automáticas
 * - Timely: Tests de integración completos
 * 
 * Patrón AAA aplicado en todos los tests
 * Test Doubles: Mocks de Prisma
 */

import { GET, POST } from '@/app/api/categorias/route';
import { categorias } from '../__fixtures__/testData';

// Mock de Prisma
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    categoria: {
      findMany: jest.fn(),
      create: jest.fn()
    }
  };
  
  return {
    PrismaClient: jest.fn(() => mockPrismaClient)
  };
});

import { PrismaClient } from '@prisma/client';

describe('API Categorías - Pruebas de Integración', () => {
  let mockPrisma: any;
  
  beforeEach(() => {
    // Arrange: Resetear mocks (FIRST: Independent)
    jest.clearAllMocks();
    mockPrisma = new PrismaClient();
  });

  describe('GET /api/categorias - Obtener todas las categorías', () => {
    it('debe retornar lista de categorías ordenadas alfabéticamente', async () => {
      // Arrange
      const mockCategorias = [
        categorias.alimentacion,
        categorias.transporte,
        categorias.entretenimiento
      ];
      
      mockPrisma.categoria.findMany.mockResolvedValue(mockCategorias);

      // Act
      const response = await GET();
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(3);
      expect(mockPrisma.categoria.findMany).toHaveBeenCalledWith({
        orderBy: { nombre: 'asc' }
      });
    });

    it('debe retornar array vacío si no hay categorías', async () => {
      // Arrange
      mockPrisma.categoria.findMany.mockResolvedValue([]);

      // Act
      const response = await GET();
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(0);
    });

    it('debe manejar errores de BD correctamente', async () => {
      // Arrange
      mockPrisma.categoria.findMany.mockRejectedValue(
        new Error('Database connection error')
      );

      // Act
      const response = await GET();
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data).toHaveProperty('error');
      expect(data.error).toBe('Error fetching categories');
      expect(data).toHaveProperty('details');
    });

    it('debe incluir todas las propiedades de categoría', async () => {
      // Arrange
      mockPrisma.categoria.findMany.mockResolvedValue([categorias.alimentacion]);

      // Act
      const response = await GET();
      const data = await response.json();

      // Assert
      expect(data[0]).toHaveProperty('id');
      expect(data[0]).toHaveProperty('nombre');
      expect(data[0]).toHaveProperty('usuario_id');
      expect(data[0].nombre).toBe('Alimentación');
    });
  });

  describe('POST /api/categorias - Crear nueva categoría', () => {
    it('debe crear categoría con nombre válido', async () => {
      // Arrange
      const requestBody = {
        nombre: 'Nueva Categoría'
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestBody)
      } as unknown as Request;

      const createdCategoria = {
        id: 10,
        nombre: requestBody.nombre,
        usuario_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockPrisma.categoria.create.mockResolvedValue(createdCategoria);

      // Act
      const response = await POST(mockRequest);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toHaveProperty('id');
      expect(data.nombre).toBe(requestBody.nombre);
      expect(mockPrisma.categoria.create).toHaveBeenCalledWith({
        data: { nombre: requestBody.nombre }
      });
    });

    it('debe retornar 400 si falta el nombre', async () => {
      // Arrange
      const requestBody = {};

      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestBody)
      } as unknown as Request;

      // Act
      const response = await POST(mockRequest);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
      expect(data.error).toBe('Nombre es requerido');
      expect(mockPrisma.categoria.create).not.toHaveBeenCalled();
    });

    it('debe retornar 400 si el nombre es vacío', async () => {
      // Arrange
      const requestBody = {
        nombre: ''
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestBody)
      } as unknown as Request;

      // Act
      const response = await POST(mockRequest);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Nombre es requerido');
    });

    it('debe manejar errores al crear categoría duplicada', async () => {
      // Arrange
      const requestBody = {
        nombre: 'Alimentación'
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestBody)
      } as unknown as Request;

      const duplicateError = new Error('Unique constraint failed');
      (duplicateError as any).code = 'P2002';
      
      mockPrisma.categoria.create.mockRejectedValue(duplicateError);

      // Act
      const response = await POST(mockRequest);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data).toHaveProperty('error');
      expect(data.error).toBe('Error creating category');
      expect(data).toHaveProperty('details');
      expect(data).toHaveProperty('code');
    });

    it('debe manejar errores generales de BD', async () => {
      // Arrange
      const requestBody = {
        nombre: 'Test Categoría'
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestBody)
      } as unknown as Request;

      mockPrisma.categoria.create.mockRejectedValue(
        new Error('Database error')
      );

      // Act
      const response = await POST(mockRequest);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data.error).toBe('Error creating category');
    });

    it('debe aceptar nombres con caracteres especiales', async () => {
      // Arrange
      const requestBody = {
        nombre: 'Categoría con ñ y acentos'
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestBody)
      } as unknown as Request;

      const createdCategoria = {
        id: 11,
        nombre: requestBody.nombre,
        usuario_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockPrisma.categoria.create.mockResolvedValue(createdCategoria);

      // Act
      const response = await POST(mockRequest);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.nombre).toBe(requestBody.nombre);
    });
  });
});

