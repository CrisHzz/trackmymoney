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

describe('API Ingresos - Pruebas de Caja Blanca', () => {
  let mockPrisma: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockPrisma = {
      usuario: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
      ingreso: {
        findMany: jest.fn(),
        create: jest.fn(),
      },
      categoria: {
        findUnique: jest.fn(),
      },
    };
    
    (PrismaClient as jest.Mock).mockImplementation(() => mockPrisma);
    mockStringToDateForDB.mockImplementation((dateString: string) => new Date(dateString));
  });

  describe('GET /api/ingresos', () => {
    test('debe devolver ingresos del usuario autenticado', async () => {
      const mockUser = {
        id: 'clerk_user_123',
        emailAddresses: [{ emailAddress: 'test@example.com' }]
      };
      
      const mockDbUser = { id: 1, email: 'test@example.com' };
      const mockIngresos = [
        {
          id: 1,
          monto: 2500.00,
          fecha: '2024-01-15',
          descripcion: 'Salario',
          tipo_ingreso: 'Salario',
          recurrente: true,
          frecuencia: 'Mensual',
          categoria: { id: 1, nombre: 'Trabajo' }
        }
      ];

      mockCurrentUser.mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(mockDbUser);
      mockPrisma.ingreso.findMany.mockResolvedValue(mockIngresos);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockIngresos);
      expect(mockPrisma.ingreso.findMany).toHaveBeenCalledWith({
        where: { usuario_id: 1 },
        include: { categoria: true },
        orderBy: { fecha: 'desc' }
      });
    });

    test('debe devolver 401 si usuario no está autenticado', async () => {
      mockCurrentUser.mockResolvedValue(null);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

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
  });

  describe('POST /api/ingresos', () => {
    const mockUser = {
      id: 'clerk_user_123',
      firstName: 'Juan',
      emailAddresses: [{ emailAddress: 'test@example.com' }]
    };

    test('debe crear ingreso con datos válidos completos', async () => {
      const requestBody = {
        monto: 2500.00,
        fecha: '2024-01-15',
        descripcion: 'Salario mensual',
        categoria_id: 1,
        tipo_ingreso: 'Salario',
        recurrente: true,
        frecuencia: 'Mensual',
        fecha_fin: '2024-12-31'
      };

      const mockDbUser = { id: 1, email: 'test@example.com' };
      const mockCategoria = { id: 1, nombre: 'Trabajo' };
      const mockIngresoCreado = {
        id: 1,
        ...requestBody,
        usuario_id: 1,
        categoria: mockCategoria
      };

      mockCurrentUser.mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(mockDbUser);
      mockPrisma.categoria.findUnique.mockResolvedValue(mockCategoria);
      mockPrisma.ingreso.create.mockResolvedValue(mockIngresoCreado);

      const request = new NextRequest('http://localhost/api/ingresos', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockIngresoCreado);
      expect(mockPrisma.ingreso.create).toHaveBeenCalledWith({
        data: {
          usuario_id: 1,
          monto: 2500.00,
          fecha: expect.any(Date),
          descripcion: 'Salario mensual',
          categoria_id: 1,
          tipo_ingreso: 'Salario',
          recurrente: true,
          frecuencia: 'Mensual',
          fecha_fin: expect.any(Date)
        },
        include: { categoria: true }
      });
    });

    test('debe rechazar si faltan campos obligatorios', async () => {
      const requestBody = {
        monto: 2500.00,
        fecha: '2024-01-15'
        // Falta tipo_ingreso
      };

      mockCurrentUser.mockResolvedValue(mockUser);

      const request = new NextRequest('http://localhost/api/ingresos', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Monto, fecha y tipo de ingreso son requeridos');
    });

    test('debe crear ingreso sin campos opcionales', async () => {
      const requestBody = {
        monto: 500.00,
        fecha: '2024-01-15',
        tipo_ingreso: 'Freelance'
        // Sin descripción, categoría, recurrente, etc.
      };

      const mockDbUser = { id: 1, email: 'test@example.com' };
      const mockIngresoCreado = {
        id: 1,
        ...requestBody,
        usuario_id: 1,
        descripcion: null,
        categoria_id: null,
        recurrente: false,
        frecuencia: null,
        fecha_fin: null,
        categoria: null
      };

      mockCurrentUser.mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(mockDbUser);
      mockPrisma.ingreso.create.mockResolvedValue(mockIngresoCreado);

      const request = new NextRequest('http://localhost/api/ingresos', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.recurrente).toBe(false);
      expect(data.frecuencia).toBe(null);
      expect(data.fecha_fin).toBe(null);
    });

    test('debe validar tipos de ingreso específicos', async () => {
      const tiposValidos = ['Salario', 'Freelance', 'Inversiones', 'Bonificación', 'Otros'];
      
      for (const tipo of tiposValidos) {
        const requestBody = {
          monto: 1000.00,
          fecha: '2024-01-15',
          tipo_ingreso: tipo
        };

        const mockDbUser = { id: 1, email: 'test@example.com' };
        const mockIngresoCreado = {
          id: 1,
          ...requestBody,
          usuario_id: 1,
          categoria: null
        };

        mockCurrentUser.mockResolvedValue(mockUser);
        mockPrisma.usuario.findFirst.mockResolvedValue(mockDbUser);
        mockPrisma.ingreso.create.mockResolvedValue(mockIngresoCreado);

        const request = new NextRequest('http://localhost/api/ingresos', {
          method: 'POST',
          body: JSON.stringify(requestBody),
        });

        const response = await POST(request);
        expect(response.status).toBe(200);
      }
    });

    test('debe validar frecuencias para ingresos recurrentes', async () => {
      const frecuenciasValidas = ['Semanal', 'Quincenal', 'Mensual', 'Trimestral', 'Anual'];
      
      for (const frecuencia of frecuenciasValidas) {
        const requestBody = {
          monto: 2000.00,
          fecha: '2024-01-15',
          tipo_ingreso: 'Salario',
          recurrente: true,
          frecuencia: frecuencia
        };

        const mockDbUser = { id: 1, email: 'test@example.com' };
        const mockIngresoCreado = {
          id: 1,
          ...requestBody,
          usuario_id: 1,
          categoria: null
        };

        mockCurrentUser.mockResolvedValue(mockUser);
        mockPrisma.usuario.findFirst.mockResolvedValue(mockDbUser);
        mockPrisma.ingreso.create.mockResolvedValue(mockIngresoCreado);

        const request = new NextRequest('http://localhost/api/ingresos', {
          method: 'POST',
          body: JSON.stringify(requestBody),
        });

        const response = await POST(request);
        expect(response.status).toBe(200);
      }
    });

    test('debe manejar monto cero como inválido', async () => {
      const requestBody = {
        monto: 0,
        fecha: '2024-01-15',
        tipo_ingreso: 'Salario'
      };

      mockCurrentUser.mockResolvedValue(mockUser);

      const request = new NextRequest('http://localhost/api/ingresos', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Monto, fecha y tipo de ingreso son requeridos');
    });

    test('debe manejar fecha_fin sin recurrente como válido', async () => {
      const requestBody = {
        monto: 1500.00,
        fecha: '2024-01-15',
        tipo_ingreso: 'Proyecto',
        recurrente: false,
        fecha_fin: '2024-06-30'
      };

      const mockDbUser = { id: 1, email: 'test@example.com' };
      const mockIngresoCreado = {
        id: 1,
        ...requestBody,
        usuario_id: 1,
        categoria: null
      };

      mockCurrentUser.mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(mockDbUser);
      mockPrisma.ingreso.create.mockResolvedValue(mockIngresoCreado);

      const request = new NextRequest('http://localhost/api/ingresos', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.recurrente).toBe(false);
      expect(data.fecha_fin).not.toBe(null);
    });

    test('debe validar coherencia fecha inicio/fin', async () => {
      const requestBody = {
        monto: 1000.00,
        fecha: '2024-06-01', // Fecha posterior
        tipo_ingreso: 'Temporal',
        fecha_fin: '2024-01-01' // Fecha anterior
      };

      const mockDbUser = { id: 1, email: 'test@example.com' };

      mockCurrentUser.mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(mockDbUser);
      
      // Mock para que la fecha_fin anterior cause un error en BD
      mockPrisma.ingreso.create.mockRejectedValue(new Error('Invalid date range'));

      const request = new NextRequest('http://localhost/api/ingresos', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Error creating income');
    });

    test('debe crear usuario si no existe', async () => {
      const requestBody = {
        monto: 1000.00,
        fecha: '2024-01-15',
        tipo_ingreso: 'Freelance'
      };

      const mockDbUserCreated = {
        id: 2,
        nombre: 'Juan',
        email: 'test@example.com',
        moneda_preferida: 'USD'
      };

      const mockIngresoCreado = {
        id: 1,
        ...requestBody,
        usuario_id: 2,
        categoria: null
      };

      mockCurrentUser.mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(null);
      mockPrisma.usuario.create.mockResolvedValue(mockDbUserCreated);
      mockPrisma.ingreso.create.mockResolvedValue(mockIngresoCreado);

      const request = new NextRequest('http://localhost/api/ingresos', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockPrisma.usuario.create).toHaveBeenCalledWith({
        data: {
          nombre: 'Juan',
          email: 'test@example.com',
          moneda_preferida: 'USD'
        }
      });
    });

    test('debe validar categoría si se proporciona', async () => {
      const requestBody = {
        monto: 1000.00,
        fecha: '2024-01-15',
        tipo_ingreso: 'Freelance',
        categoria_id: 999
      };

      const mockDbUser = { id: 1, email: 'test@example.com' };

      mockCurrentUser.mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(mockDbUser);
      mockPrisma.categoria.findUnique.mockResolvedValue(null);

      const request = new NextRequest('http://localhost/api/ingresos', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Categoría no válida');
    });
  });

  describe('Validaciones de datos específicas', () => {
    const mockUser = {
      id: 'clerk_user_123',
      firstName: 'Juan',
      emailAddresses: [{ emailAddress: 'test@example.com' }]
    };

    test('debe aceptar montos con decimales precisos', async () => {
      const requestBody = {
        monto: 1234.56,
        fecha: '2024-01-15',
        tipo_ingreso: 'Freelance'
      };

      const mockDbUser = { id: 1, email: 'test@example.com' };
      const mockIngresoCreado = {
        id: 1,
        ...requestBody,
        usuario_id: 1,
        categoria: null
      };

      mockCurrentUser.mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(mockDbUser);
      mockPrisma.ingreso.create.mockResolvedValue(mockIngresoCreado);

      const request = new NextRequest('http://localhost/api/ingresos', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockPrisma.ingreso.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            monto: 1234.56
          })
        })
      );
    });

    test('debe convertir strings numéricos a números', async () => {
      const requestBody = {
        monto: '2500.50',
        fecha: '2024-01-15',
        tipo_ingreso: 'Salario',
        categoria_id: '1'
      };

      const mockDbUser = { id: 1, email: 'test@example.com' };
      const mockCategoria = { id: 1, nombre: 'Trabajo' };
      const mockIngresoCreado = {
        id: 1,
        monto: 2500.50,
        categoria_id: 1,
        usuario_id: 1,
        categoria: mockCategoria
      };

      mockCurrentUser.mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(mockDbUser);
      mockPrisma.categoria.findUnique.mockResolvedValue(mockCategoria);
      mockPrisma.ingreso.create.mockResolvedValue(mockIngresoCreado);

      const request = new NextRequest('http://localhost/api/ingresos', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockPrisma.categoria.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      });
    });

    test('debe manejar descripciones largas', async () => {
      const descripcionLarga = 'A'.repeat(500); // 500 caracteres
      const requestBody = {
        monto: 1000.00,
        fecha: '2024-01-15',
        tipo_ingreso: 'Freelance',
        descripcion: descripcionLarga
      };

      const mockDbUser = { id: 1, email: 'test@example.com' };
      const mockIngresoCreado = {
        id: 1,
        ...requestBody,
        usuario_id: 1,
        categoria: null
      };

      mockCurrentUser.mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(mockDbUser);
      mockPrisma.ingreso.create.mockResolvedValue(mockIngresoCreado);

      const request = new NextRequest('http://localhost/api/ingresos', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockPrisma.ingreso.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            descripcion: descripcionLarga
          })
        })
      );
    });

    test('debe manejar caracteres especiales en descripción', async () => {
      const descripcionEspecial = 'Pago por diseño web - €1000 (incluye IVA 21%)';
      const requestBody = {
        monto: 1000.00,
        fecha: '2024-01-15',
        tipo_ingreso: 'Freelance',
        descripcion: descripcionEspecial
      };

      const mockDbUser = { id: 1, email: 'test@example.com' };
      const mockIngresoCreado = {
        id: 1,
        ...requestBody,
        usuario_id: 1,
        categoria: null
      };

      mockCurrentUser.mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(mockDbUser);
      mockPrisma.ingreso.create.mockResolvedValue(mockIngresoCreado);

      const request = new NextRequest('http://localhost/api/ingresos', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockPrisma.ingreso.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            descripcion: descripcionEspecial
          })
        })
      );
    });
  });
}); 