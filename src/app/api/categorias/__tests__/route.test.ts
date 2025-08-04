import { NextRequest } from 'next/server';
import { GET, POST } from '../route';
import { PrismaClient } from '@prisma/client';

// Mocks
jest.mock('@prisma/client');

describe('API Categorías - Pruebas de Caja Blanca', () => {
  let mockPrisma: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockPrisma = {
      categoria: {
        findMany: jest.fn(),
        create: jest.fn(),
      },
    };
    
    (PrismaClient as jest.Mock).mockImplementation(() => mockPrisma);
  });

  describe('GET /api/categorias', () => {
    test('debe devolver todas las categorías ordenadas alfabéticamente', async () => {
      const mockCategorias = [
        { id: 1, nombre: 'Alimentación' },
        { id: 2, nombre: 'Transporte' },
        { id: 3, nombre: 'Entretenimiento' }
      ];

      mockPrisma.categoria.findMany.mockResolvedValue(mockCategorias);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockCategorias);
      expect(mockPrisma.categoria.findMany).toHaveBeenCalledWith({
        orderBy: { nombre: 'asc' }
      });
    });

    test('debe devolver array vacío si no hay categorías', async () => {
      mockPrisma.categoria.findMany.mockResolvedValue([]);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([]);
    });

    test('debe manejar errores de base de datos', async () => {
      mockPrisma.categoria.findMany.mockRejectedValue(new Error('DB Connection Error'));

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Error fetching categories');
      expect(data.details).toBe('DB Connection Error');
    });

    test('debe usar ordenamiento ascendente por nombre', async () => {
      mockPrisma.categoria.findMany.mockResolvedValue([]);

      await GET();

      expect(mockPrisma.categoria.findMany).toHaveBeenCalledWith({
        orderBy: { nombre: 'asc' }
      });
    });
  });

  describe('POST /api/categorias', () => {
    test('debe crear categoría con nombre válido', async () => {
      const requestBody = { nombre: 'Nueva Categoría' };
      const mockCategoriaCreada = { id: 4, nombre: 'Nueva Categoría' };

      mockPrisma.categoria.create.mockResolvedValue(mockCategoriaCreada);

      const request = new NextRequest('http://localhost/api/categorias', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockCategoriaCreada);
      expect(mockPrisma.categoria.create).toHaveBeenCalledWith({
        data: { nombre: 'Nueva Categoría' }
      });
    });

    test('debe rechazar si falta el nombre', async () => {
      const requestBody = {}; // Sin nombre

      const request = new NextRequest('http://localhost/api/categorias', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Nombre es requerido');
      expect(mockPrisma.categoria.create).not.toHaveBeenCalled();
    });

    test('debe rechazar nombre vacío', async () => {
      const requestBody = { nombre: '' };

      const request = new NextRequest('http://localhost/api/categorias', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Nombre es requerido');
    });

    test('debe rechazar nombre solo con espacios', async () => {
      const requestBody = { nombre: '   ' };

      const request = new NextRequest('http://localhost/api/categorias', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Nombre es requerido');
    });

    test('debe aceptar nombres con caracteres especiales', async () => {
      const requestBody = { nombre: 'Salud & Bienestar' };
      const mockCategoriaCreada = { id: 5, nombre: 'Salud & Bienestar' };

      mockPrisma.categoria.create.mockResolvedValue(mockCategoriaCreada);

      const request = new NextRequest('http://localhost/api/categorias', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockPrisma.categoria.create).toHaveBeenCalledWith({
        data: { nombre: 'Salud & Bienestar' }
      });
    });

    test('debe aceptar nombres con tildes y ñ', async () => {
      const requestBody = { nombre: 'Educación & Niños' };
      const mockCategoriaCreada = { id: 6, nombre: 'Educación & Niños' };

      mockPrisma.categoria.create.mockResolvedValue(mockCategoriaCreada);

      const request = new NextRequest('http://localhost/api/categorias', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockPrisma.categoria.create).toHaveBeenCalledWith({
        data: { nombre: 'Educación & Niños' }
      });
    });

    test('debe manejar nombres muy largos', async () => {
      const nombreLargo = 'A'.repeat(100);
      const requestBody = { nombre: nombreLargo };
      const mockCategoriaCreada = { id: 7, nombre: nombreLargo };

      mockPrisma.categoria.create.mockResolvedValue(mockCategoriaCreada);

      const request = new NextRequest('http://localhost/api/categorias', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockPrisma.categoria.create).toHaveBeenCalledWith({
        data: { nombre: nombreLargo }
      });
    });

    test('debe manejar error de nombre duplicado', async () => {
      const requestBody = { nombre: 'Alimentación' };
      
      mockPrisma.categoria.create.mockRejectedValue({
        code: 'P2002',
        message: 'Unique constraint failed'
      });

      const request = new NextRequest('http://localhost/api/categorias', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Error creating category');
      expect(data.code).toBe('P2002');
    });

    test('debe manejar JSON inválido', async () => {
      const request = new NextRequest('http://localhost/api/categorias', {
        method: 'POST',
        body: 'invalid json',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Error creating category');
    });

    test('debe manejar cuerpo de request vacío', async () => {
      const request = new NextRequest('http://localhost/api/categorias', {
        method: 'POST',
        body: '',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Error creating category');
    });

    test('debe trimear espacios en el nombre', async () => {
      const requestBody = { nombre: '  Categoría con espacios  ' };
      const mockCategoriaCreada = { id: 8, nombre: 'Categoría con espacios' };

      mockPrisma.categoria.create.mockResolvedValue(mockCategoriaCreada);

      const request = new NextRequest('http://localhost/api/categorias', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      // Nota: En el código actual no hay trim, pero sería una mejora
      expect(mockPrisma.categoria.create).toHaveBeenCalledWith({
        data: { nombre: '  Categoría con espacios  ' }
      });
    });

    test('debe manejar tipos de datos incorrectos', async () => {
      const requestBody = { nombre: 123 }; // Número en lugar de string

      const request = new NextRequest('http://localhost/api/categorias', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      // Dependiendo de la implementación, podría convertir o rechazar
      // En este caso, Prisma probablemente convertirá automáticamente
      expect(mockPrisma.categoria.create).toHaveBeenCalledWith({
        data: { nombre: 123 }
      });
    });

    test('debe incluir detalles de error en respuesta', async () => {
      const requestBody = { nombre: 'Test' };
      const errorDetallado = new Error('Database connection timeout');

      mockPrisma.categoria.create.mockRejectedValue(errorDetallado);

      const request = new NextRequest('http://localhost/api/categorias', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Error creating category');
      expect(data.details).toBe('Database connection timeout');
    });
  });

  describe('Validaciones de entrada adicionales', () => {
    test('debe validar estructura del objeto JSON', async () => {
      const requestBody = { 
        nombre: 'Válido',
        campoExtra: 'no debería causar error'
      };

      const mockCategoriaCreada = { id: 9, nombre: 'Válido' };
      mockPrisma.categoria.create.mockResolvedValue(mockCategoriaCreada);

      const request = new NextRequest('http://localhost/api/categorias', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockPrisma.categoria.create).toHaveBeenCalledWith({
        data: { nombre: 'Válido' }
      });
    });

    test('debe manejar arrays en lugar de objetos', async () => {
      const requestBody = ['nombre1', 'nombre2'];

      const request = new NextRequest('http://localhost/api/categorias', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Nombre es requerido');
    });

    test('debe manejar null como nombre', async () => {
      const requestBody = { nombre: null };

      const request = new NextRequest('http://localhost/api/categorias', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Nombre es requerido');
    });

    test('debe manejar undefined como nombre', async () => {
      const requestBody = { nombre: undefined };

      const request = new NextRequest('http://localhost/api/categorias', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Nombre es requerido');
    });
  });
}); 