import { NextRequest } from 'next/server';
import { GET, POST } from '../route';
import { currentUser } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { stringToDateForDB } from '@/lib/dateUtils';

// Mocks
jest.mock('@clerk/nextjs/server');
jest.mock('@prisma/client');
jest.mock('@/lib/dateUtils');

const mockCurrentUser = currentUser as jest.MockedFunction<typeof currentUser>;
const mockStringToDateForDB = stringToDateForDB as jest.MockedFunction<typeof stringToDateForDB>;

describe('API Gastos - Pruebas de Caja Blanca', () => {
  let mockPrisma: any;

  beforeEach(() => {
    // Reset mocks antes de cada prueba
    jest.clearAllMocks();
    
    // Configurar mock de Prisma
    mockPrisma = {
      usuario: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
      gasto: {
        findMany: jest.fn(),
        create: jest.fn(),
      },
      categoria: {
        findUnique: jest.fn(),
      },
    };
    
    (PrismaClient as jest.Mock).mockImplementation(() => mockPrisma);
    
    // Mock para stringToDateForDB
    mockStringToDateForDB.mockImplementation((dateString: string) => new Date(dateString));
  });

  describe('GET /api/gastos', () => {
    // Caso positivo: usuario autenticado con gastos
    test('debe devolver gastos del usuario autenticado', async () => {
      const mockUser = {
        id: 'clerk_user_123',
        emailAddresses: [{ emailAddress: 'test@example.com' }]
      };
      
      const mockDbUser = { id: 1, email: 'test@example.com' };
      const mockGastos = [
        {
          id: 1,
          monto: 100.50,
          fecha: '2024-01-15',
          descripcion: 'Test gasto',
          categoria: { id: 1, nombre: 'Comida' }
        }
      ];

      mockCurrentUser.mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(mockDbUser);
      mockPrisma.gasto.findMany.mockResolvedValue(mockGastos);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockGastos);
      expect(mockPrisma.usuario.findFirst).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }
      });
      expect(mockPrisma.gasto.findMany).toHaveBeenCalledWith({
        where: { usuario_id: 1 },
        include: { categoria: true },
        orderBy: { fecha: 'desc' }
      });
    });

    // Caso negativo: usuario no autenticado
    test('debe devolver 401 si usuario no está autenticado', async () => {
      mockCurrentUser.mockResolvedValue(null);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    // Caso de borde: usuario sin email
    test('debe devolver 400 si usuario no tiene email', async () => {
      const mockUser = {
        id: 'clerk_user_123',
        emailAddresses: []
      };

      mockCurrentUser.mockResolvedValue(mockUser);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Email not found');
    });

    // Caso de borde: usuario no existe en BD
    test('debe devolver array vacío si usuario no existe en BD', async () => {
      const mockUser = {
        id: 'clerk_user_123',
        emailAddresses: [{ emailAddress: 'test@example.com' }]
      };

      mockCurrentUser.mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(null);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([]);
    });

    // Caso negativo: error de base de datos
    test('debe manejar errores de base de datos', async () => {
      const mockUser = {
        id: 'clerk_user_123',
        emailAddresses: [{ emailAddress: 'test@example.com' }]
      };

      mockCurrentUser.mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockRejectedValue(new Error('DB Error'));

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Error fetching expenses');
      expect(data.details).toBe('DB Error');
    });
  });

  describe('POST /api/gastos', () => {
    const mockUser = {
      id: 'clerk_user_123',
      firstName: 'Juan',
      emailAddresses: [{ emailAddress: 'test@example.com' }]
    };

    // Caso positivo: crear gasto válido
    test('debe crear gasto con datos válidos', async () => {
      const requestBody = {
        monto: 100.50,
        fecha: '2024-01-15',
        descripcion: 'Test gasto',
        categoria_id: 1,
        factura: true,
        metodo_pago: 'tarjeta'
      };

      const mockDbUser = { id: 1, email: 'test@example.com' };
      const mockCategoria = { id: 1, nombre: 'Comida' };
      const mockGastoCreado = {
        id: 1,
        ...requestBody,
        usuario_id: 1,
        categoria: mockCategoria
      };

      mockCurrentUser.mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(mockDbUser);
      mockPrisma.categoria.findUnique.mockResolvedValue(mockCategoria);
      mockPrisma.gasto.create.mockResolvedValue(mockGastoCreado);

      const request = new NextRequest('http://localhost/api/gastos', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockGastoCreado);
      expect(mockPrisma.gasto.create).toHaveBeenCalledWith({
        data: {
          usuario_id: 1,
          monto: 100.50,
          fecha: expect.any(Date),
          descripcion: 'Test gasto',
          categoria_id: 1,
          factura: true,
          metodo_pago: 'tarjeta'
        },
        include: { categoria: true }
      });
    });

    // Caso negativo: campos obligatorios faltantes
    test('debe devolver 400 si faltan campos obligatorios', async () => {
      const requestBody = {
        descripcion: 'Test sin monto'
        // Falta monto y fecha
      };

      mockCurrentUser.mockResolvedValue(mockUser);

      const request = new NextRequest('http://localhost/api/gastos', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Monto y fecha son requeridos');
    });

    // Caso de validación: monto cero
    test('debe rechazar monto cero', async () => {
      const requestBody = {
        monto: 0,
        fecha: '2024-01-15'
      };

      mockCurrentUser.mockResolvedValue(mockUser);

      const request = new NextRequest('http://localhost/api/gastos', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Monto y fecha son requeridos');
    });

    // Caso de validación: monto negativo
    test('debe aceptar monto negativo (caso de ajuste)', async () => {
      const requestBody = {
        monto: -50.25,
        fecha: '2024-01-15'
      };

      const mockDbUser = { id: 1, email: 'test@example.com' };
      const mockGastoCreado = {
        id: 1,
        ...requestBody,
        usuario_id: 1,
        categoria: null
      };

      mockCurrentUser.mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(mockDbUser);
      mockPrisma.gasto.create.mockResolvedValue(mockGastoCreado);

      const request = new NextRequest('http://localhost/api/gastos', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.monto).toBe(-50.25);
    });

    // Caso de borde: crear usuario si no existe
    test('debe crear usuario si no existe en BD', async () => {
      const requestBody = {
        monto: 100.50,
        fecha: '2024-01-15'
      };

      const mockDbUserCreated = {
        id: 2,
        nombre: 'Juan',
        email: 'test@example.com',
        moneda_preferida: 'USD'
      };

      const mockGastoCreado = {
        id: 1,
        ...requestBody,
        usuario_id: 2,
        categoria: null
      };

      mockCurrentUser.mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(null);
      mockPrisma.usuario.create.mockResolvedValue(mockDbUserCreated);
      mockPrisma.gasto.create.mockResolvedValue(mockGastoCreado);

      const request = new NextRequest('http://localhost/api/gastos', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(mockPrisma.usuario.create).toHaveBeenCalledWith({
        data: {
          nombre: 'Juan',
          email: 'test@example.com',
          moneda_preferida: 'USD'
        }
      });
    });

    // Caso de validación: categoría inválida
    test('debe devolver 400 si categoría no existe', async () => {
      const requestBody = {
        monto: 100.50,
        fecha: '2024-01-15',
        categoria_id: 999
      };

      const mockDbUser = { id: 1, email: 'test@example.com' };

      mockCurrentUser.mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(mockDbUser);
      mockPrisma.categoria.findUnique.mockResolvedValue(null);

      const request = new NextRequest('http://localhost/api/gastos', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Categoría no válida');
      expect(mockPrisma.categoria.findUnique).toHaveBeenCalledWith({
        where: { id: 999 }
      });
    });

    // Caso de borde: categoría como string
    test('debe convertir categoria_id de string a número', async () => {
      const requestBody = {
        monto: 100.50,
        fecha: '2024-01-15',
        categoria_id: '1' // String en lugar de número
      };

      const mockDbUser = { id: 1, email: 'test@example.com' };
      const mockCategoria = { id: 1, nombre: 'Comida' };
      const mockGastoCreado = {
        id: 1,
        ...requestBody,
        categoria_id: 1,
        usuario_id: 1,
        categoria: mockCategoria
      };

      mockCurrentUser.mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(mockDbUser);
      mockPrisma.categoria.findUnique.mockResolvedValue(mockCategoria);
      mockPrisma.gasto.create.mockResolvedValue(mockGastoCreado);

      const request = new NextRequest('http://localhost/api/gastos', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockPrisma.categoria.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      });
    });

    // Caso de borde: campos opcionales
    test('debe manejar campos opcionales correctamente', async () => {
      const requestBody = {
        monto: 100.50,
        fecha: '2024-01-15'
        // Sin descripción, categoría, factura, metodo_pago
      };

      const mockDbUser = { id: 1, email: 'test@example.com' };
      const mockGastoCreado = {
        id: 1,
        ...requestBody,
        usuario_id: 1,
        descripcion: null,
        categoria_id: null,
        factura: false,
        metodo_pago: null,
        categoria: null
      };

      mockCurrentUser.mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(mockDbUser);
      mockPrisma.gasto.create.mockResolvedValue(mockGastoCreado);

      const request = new NextRequest('http://localhost/api/gastos', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.descripcion).toBe(null);
      expect(data.categoria_id).toBe(null);
      expect(data.factura).toBe(false);
      expect(data.metodo_pago).toBe(null);
    });

    // Caso negativo: usuario no autenticado
    test('debe devolver 401 si usuario no está autenticado', async () => {
      mockCurrentUser.mockResolvedValue(null);

      const request = new NextRequest('http://localhost/api/gastos', {
        method: 'POST',
        body: JSON.stringify({ monto: 100, fecha: '2024-01-15' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    // Caso negativo: JSON inválido
    test('debe manejar JSON inválido', async () => {
      mockCurrentUser.mockResolvedValue(mockUser);

      const request = new NextRequest('http://localhost/api/gastos', {
        method: 'POST',
        body: 'invalid json',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Error creating expense');
    });

    // Caso negativo: error de base de datos
    test('debe manejar errores de base de datos en creación', async () => {
      const requestBody = {
        monto: 100.50,
        fecha: '2024-01-15'
      };

      const mockDbUser = { id: 1, email: 'test@example.com' };

      mockCurrentUser.mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(mockDbUser);
      mockPrisma.gasto.create.mockRejectedValue(new Error('DB Constraint Error'));

      const request = new NextRequest('http://localhost/api/gastos', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Error creating expense');
      expect(data.details).toBe('DB Constraint Error');
    });

    // Prueba de validación de tipos
    test('debe convertir monto de string a número', async () => {
      const requestBody = {
        monto: '150.75', // String en lugar de número
        fecha: '2024-01-15'
      };

      const mockDbUser = { id: 1, email: 'test@example.com' };
      const mockGastoCreado = {
        id: 1,
        monto: 150.75,
        fecha: new Date('2024-01-15'),
        usuario_id: 1,
        categoria: null
      };

      mockCurrentUser.mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(mockDbUser);
      mockPrisma.gasto.create.mockResolvedValue(mockGastoCreado);

      const request = new NextRequest('http://localhost/api/gastos', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(mockPrisma.gasto.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            monto: 150.75 // Convertido a número
          })
        })
      );
    });
  });

  // Pruebas de integración y casos límite
  describe('Casos límite y validaciones adicionales', () => {
    test('debe validar formato de fecha antes de conversión', async () => {
      const requestBody = {
        monto: 100,
        fecha: 'fecha-invalida'
      };

      const mockUser = {
        id: 'clerk_user_123',
        firstName: 'Juan',
        emailAddresses: [{ emailAddress: 'test@example.com' }]
      };

      mockCurrentUser.mockResolvedValue(mockUser);
      mockStringToDateForDB.mockImplementation(() => {
        throw new Error('Invalid date format');
      });

      const request = new NextRequest('http://localhost/api/gastos', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Error creating expense');
    });

    test('debe manejar montos con muchos decimales', async () => {
      const requestBody = {
        monto: 99.999999,
        fecha: '2024-01-15'
      };

      const mockUser = {
        id: 'clerk_user_123',
        firstName: 'Juan',
        emailAddresses: [{ emailAddress: 'test@example.com' }]
      };

      const mockDbUser = { id: 1, email: 'test@example.com' };
      const mockGastoCreado = {
        id: 1,
        monto: 99.999999,
        fecha: new Date('2024-01-15'),
        usuario_id: 1,
        categoria: null
      };

      mockCurrentUser.mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(mockDbUser);
      mockPrisma.gasto.create.mockResolvedValue(mockGastoCreado);

      const request = new NextRequest('http://localhost/api/gastos', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockPrisma.gasto.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            monto: 99.999999
          })
        })
      );
    });
  });
}); 