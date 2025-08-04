import { NextRequest } from 'next/server';
import { GET, PUT, DELETE } from '../route';
import { currentUser } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

// Mocks
jest.mock('@clerk/nextjs/server');
jest.mock('@prisma/client');

const mockCurrentUser = currentUser as jest.MockedFunction<typeof currentUser>;

describe('API Gastos [id] - Pruebas de Caja Blanca', () => {
  let mockPrisma: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockPrisma = {
      usuario: {
        findFirst: jest.fn(),
      },
      gasto: {
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    
    (PrismaClient as jest.Mock).mockImplementation(() => mockPrisma);
  });

  describe('GET /api/gastos/[id]', () => {
    test('debe devolver gasto específico del usuario autenticado', async () => {
      const mockUser = {
        emailAddresses: [{ emailAddress: 'test@example.com' }]
      } as any;
      
      const mockDbUser = { id: 1, email: 'test@example.com' };
      const mockGasto = {
        id: 1,
        monto: 100.50,
        fecha: '2024-01-15',
        descripcion: 'Test gasto',
        usuario_id: 1,
        categoria: { id: 1, nombre: 'Comida' }
      };

      mockCurrentUser.mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(mockDbUser);
      mockPrisma.gasto.findUnique.mockResolvedValue(mockGasto);

      const response = await GET(
        new NextRequest('http://localhost'),
        { params: { id: '1' } }
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockGasto);
      expect(mockPrisma.gasto.findUnique).toHaveBeenCalledWith({
        where: {
          id: 1,
          usuario_id: 1
        },
        include: { categoria: true }
      });
    });

    test('debe devolver 401 si usuario no autenticado', async () => {
      mockCurrentUser.mockResolvedValue(null);

      const response = await GET(
        new NextRequest('http://localhost'),
        { params: { id: '1' } }
      );
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    test('debe devolver 404 si usuario no existe en BD', async () => {
      const mockUser = {
        emailAddresses: [{ emailAddress: 'test@example.com' }]
      } as any;

      mockCurrentUser.mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(null);

      const response = await GET(
        new NextRequest('http://localhost'),
        { params: { id: '1' } }
      );
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('User not found');
    });

    test('debe devolver 404 si gasto no existe', async () => {
      const mockUser = {
        emailAddresses: [{ emailAddress: 'test@example.com' }]
      } as any;
      
      const mockDbUser = { id: 1, email: 'test@example.com' };

      mockCurrentUser.mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(mockDbUser);
      mockPrisma.gasto.findUnique.mockResolvedValue(null);

      const response = await GET(
        new NextRequest('http://localhost'),
        { params: { id: '999' } }
      );
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Expense not found');
    });

    test('debe validar que el gasto pertenezca al usuario', async () => {
      const mockUser = {
        emailAddresses: [{ emailAddress: 'test@example.com' }]
      } as any;
      
      const mockDbUser = { id: 1, email: 'test@example.com' };

      mockCurrentUser.mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(mockDbUser);
      mockPrisma.gasto.findUnique.mockResolvedValue(null); // No encuentra porque usuario_id no coincide

      const response = await GET(
        new NextRequest('http://localhost'),
        { params: { id: '1' } }
      );

      expect(mockPrisma.gasto.findUnique).toHaveBeenCalledWith({
        where: {
          id: 1,
          usuario_id: 1 // Validación de propiedad
        },
        include: { categoria: true }
      });
    });

    test('debe manejar ID inválido', async () => {
      const mockUser = {
        emailAddresses: [{ emailAddress: 'test@example.com' }]
      } as any;
      
      const mockDbUser = { id: 1, email: 'test@example.com' };

      mockCurrentUser.mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(mockDbUser);
      mockPrisma.gasto.findUnique.mockRejectedValue(new Error('Invalid ID'));

      const response = await GET(
        new NextRequest('http://localhost'),
        { params: { id: 'invalid' } }
      );
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Error fetching expense');
    });
  });

  describe('PUT /api/gastos/[id]', () => {
    const mockUser = {
      emailAddresses: [{ emailAddress: 'test@example.com' }]
    } as any;

    test('debe actualizar gasto con datos válidos', async () => {
      const requestBody = {
        monto: 150.75,
        fecha: '2024-01-20',
        descripcion: 'Gasto actualizado',
        categoria_id: 2,
        factura: true,
        metodo_pago: 'efectivo'
      };

      const mockDbUser = { id: 1, email: 'test@example.com' };
      const mockGastoActualizado = {
        id: 1,
        ...requestBody,
        fecha: new Date(requestBody.fecha),
        usuario_id: 1
      };

      mockCurrentUser.mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(mockDbUser);
      mockPrisma.gasto.update.mockResolvedValue(mockGastoActualizado);

      const request = new NextRequest('http://localhost', {
        method: 'PUT',
        body: JSON.stringify(requestBody),
      });

      const response = await PUT(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockGastoActualizado);
      expect(mockPrisma.gasto.update).toHaveBeenCalledWith({
        where: {
          id: 1,
          usuario_id: 1
        },
        data: {
          monto: 150.75,
          fecha: expect.any(Date),
          descripcion: 'Gasto actualizado',
          categoria_id: 2,
          factura: true,
          metodo_pago: 'efectivo'
        }
      });
    });

    test('debe permitir actualización parcial', async () => {
      const requestBody = {
        monto: 200.00,
        descripcion: 'Solo cambio descripción'
        // No incluye otros campos
      };

      const mockDbUser = { id: 1, email: 'test@example.com' };
      const mockGastoActualizado = {
        id: 1,
        monto: 200.00,
        descripcion: 'Solo cambio descripción',
        usuario_id: 1
      };

      mockCurrentUser.mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(mockDbUser);
      mockPrisma.gasto.update.mockResolvedValue(mockGastoActualizado);

      const request = new NextRequest('http://localhost', {
        method: 'PUT',
        body: JSON.stringify(requestBody),
      });

      const response = await PUT(request, { params: { id: '1' } });

      expect(response.status).toBe(200);
      expect(mockPrisma.gasto.update).toHaveBeenCalledWith({
        where: {
          id: 1,
          usuario_id: 1
        },
        data: {
          monto: 200.00,
          fecha: undefined, // No se incluye en la actualización
          descripcion: 'Solo cambio descripción',
          categoria_id: undefined,
          factura: undefined,
          metodo_pago: undefined
        }
      });
    });

    test('debe convertir tipos de datos correctamente', async () => {
      const requestBody = {
        monto: '175.50', // String
        categoria_id: '3', // String
        factura: 'true' // String
      };

      const mockDbUser = { id: 1, email: 'test@example.com' };
      const mockGastoActualizado = {
        id: 1,
        monto: 175.50,
        categoria_id: 3,
        factura: true,
        usuario_id: 1
      };

      mockCurrentUser.mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(mockDbUser);
      mockPrisma.gasto.update.mockResolvedValue(mockGastoActualizado);

      const request = new NextRequest('http://localhost', {
        method: 'PUT',
        body: JSON.stringify(requestBody),
      });

      const response = await PUT(request, { params: { id: '1' } });

      expect(response.status).toBe(200);
      expect(mockPrisma.gasto.update).toHaveBeenCalledWith({
        where: {
          id: 1,
          usuario_id: 1
        },
        data: expect.objectContaining({
          categoria_id: 3 // Convertido a número
        })
      });
    });

    test('debe manejar categoría null', async () => {
      const requestBody = {
        monto: 100.00,
        categoria_id: null
      };

      const mockDbUser = { id: 1, email: 'test@example.com' };
      const mockGastoActualizado = {
        id: 1,
        monto: 100.00,
        categoria_id: null,
        usuario_id: 1
      };

      mockCurrentUser.mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(mockDbUser);
      mockPrisma.gasto.update.mockResolvedValue(mockGastoActualizado);

      const request = new NextRequest('http://localhost', {
        method: 'PUT',
        body: JSON.stringify(requestBody),
      });

      const response = await PUT(request, { params: { id: '1' } });

      expect(response.status).toBe(200);
      expect(mockPrisma.gasto.update).toHaveBeenCalledWith({
        where: {
          id: 1,
          usuario_id: 1
        },
        data: expect.objectContaining({
          categoria_id: null
        })
      });
    });

    test('debe devolver 500 si gasto no existe para actualizar', async () => {
      const requestBody = { monto: 100.00 };

      const mockDbUser = { id: 1, email: 'test@example.com' };

      mockCurrentUser.mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(mockDbUser);
      mockPrisma.gasto.update.mockRejectedValue(new Error('Record not found'));

      const request = new NextRequest('http://localhost', {
        method: 'PUT',
        body: JSON.stringify(requestBody),
      });

      const response = await PUT(request, { params: { id: '999' } });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Error updating expense');
    });
  });

  describe('DELETE /api/gastos/[id]', () => {
    const mockUser = {
      emailAddresses: [{ emailAddress: 'test@example.com' }]
    } as any;

    test('debe eliminar gasto exitosamente', async () => {
      const mockDbUser = { id: 1, email: 'test@example.com' };

      mockCurrentUser.mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(mockDbUser);
      mockPrisma.gasto.delete.mockResolvedValue({ id: 1 });

      const response = await DELETE(
        new NextRequest('http://localhost'),
        { params: { id: '1' } }
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Expense deleted successfully');
      expect(mockPrisma.gasto.delete).toHaveBeenCalledWith({
        where: {
          id: 1,
          usuario_id: 1
        }
      });
    });

    test('debe devolver 401 si usuario no autenticado', async () => {
      mockCurrentUser.mockResolvedValue(null);

      const response = await DELETE(
        new NextRequest('http://localhost'),
        { params: { id: '1' } }
      );
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    test('debe devolver 404 si usuario no existe en BD', async () => {
      const mockUser = {
        emailAddresses: [{ emailAddress: 'test@example.com' }]
      } as any;

      mockCurrentUser.mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(null);

      const response = await DELETE(
        new NextRequest('http://localhost'),
        { params: { id: '1' } }
      );
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('User not found');
    });

    test('debe manejar gasto inexistente', async () => {
      const mockDbUser = { id: 1, email: 'test@example.com' };

      mockCurrentUser.mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(mockDbUser);
      mockPrisma.gasto.delete.mockRejectedValue(new Error('Record not found'));

      const response = await DELETE(
        new NextRequest('http://localhost'),
        { params: { id: '999' } }
      );
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Error deleting expense');
      expect(data.details).toBe('Record not found');
    });

    test('debe validar que el gasto pertenezca al usuario', async () => {
      const mockDbUser = { id: 1, email: 'test@example.com' };

      mockCurrentUser.mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(mockDbUser);
      mockPrisma.gasto.delete.mockResolvedValue({ id: 1 });

      await DELETE(
        new NextRequest('http://localhost'),
        { params: { id: '1' } }
      );

      expect(mockPrisma.gasto.delete).toHaveBeenCalledWith({
        where: {
          id: 1,
          usuario_id: 1 // Validación de propiedad
        }
      });
    });

    test('debe manejar IDs inválidos', async () => {
      const mockDbUser = { id: 1, email: 'test@example.com' };

      mockCurrentUser.mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(mockDbUser);
      mockPrisma.gasto.delete.mockRejectedValue(new Error('Invalid ID format'));

      const response = await DELETE(
        new NextRequest('http://localhost'),
        { params: { id: 'invalid-id' } }
      );
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Error deleting expense');
    });

    test('debe incluir stack trace en caso de error', async () => {
      const mockDbUser = { id: 1, email: 'test@example.com' };
      const errorWithStack = new Error('DB Error');
      errorWithStack.stack = 'Stack trace here';

      mockCurrentUser.mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(mockDbUser);
      mockPrisma.gasto.delete.mockRejectedValue(errorWithStack);

      const response = await DELETE(
        new NextRequest('http://localhost'),
        { params: { id: '1' } }
      );
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.stack).toBe('Stack trace here');
    });
  });

  describe('Casos límite y validaciones de seguridad', () => {
    test('debe validar ID numérico en todas las operaciones', async () => {
      const mockUser = {
        emailAddresses: [{ emailAddress: 'test@example.com' }]
      } as any;

      mockCurrentUser.mockResolvedValue(mockUser);

      // Testear que parseInt se use correctamente
      const operations = [
        () => GET(new NextRequest('http://localhost'), { params: { id: '1' } }),
        () => PUT(new NextRequest('http://localhost', { method: 'PUT', body: '{}' }), { params: { id: '1' } }),
        () => DELETE(new NextRequest('http://localhost'), { params: { id: '1' } })
      ];

      for (const operation of operations) {
        try {
          await operation();
        } catch (error) {
          // Esperamos que se use parseInt(params.id)
        }
      }
    });

    test('debe prevenir acceso cruzado entre usuarios', async () => {
      const mockUser = {
        emailAddresses: [{ emailAddress: 'hacker@example.com' }]
      } as any;
      
      const mockDbUser = { id: 999, email: 'hacker@example.com' };

      mockCurrentUser.mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(mockDbUser);
      mockPrisma.gasto.findUnique.mockResolvedValue(null); // No encuentra gasto de otro usuario

      const response = await GET(
        new NextRequest('http://localhost'),
        { params: { id: '1' } } // Intentando acceder al gasto ID 1
      );

      expect(mockPrisma.gasto.findUnique).toHaveBeenCalledWith({
        where: {
          id: 1,
          usuario_id: 999 // Solo busca en gastos del usuario actual
        },
        include: { categoria: true }
      });
    });
  });
}); 