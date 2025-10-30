import { NextResponse } from 'next/server';
import { GET, POST } from '@/app/api/gastos/route';
import { usuarios, gastos, categorias } from '../__fixtures__/testData';
jest.mock('@clerk/nextjs/server', () => ({
  currentUser: jest.fn()
}));
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    usuario: {
      findFirst: jest.fn(),
      create: jest.fn()
    },
    gasto: {
      findMany: jest.fn(),
      create: jest.fn()
    },
    categoria: {
      findUnique: jest.fn()
    }
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient)
  };
});
import { currentUser } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
describe('API Gastos - Pruebas de Integración', () => {
  let mockPrisma: any;
  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma = new PrismaClient();
  });
  describe('GET /api/gastos - Obtener gastos del usuario', () => {
    it('debe retornar lista de gastos para usuario autenticado', async () => {
      const mockUser = {
        id: 'clerk_123',
        emailAddresses: [{ emailAddress: 'test@example.com' }]
      };
      (currentUser as jest.Mock).mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(usuarios.usuario1);
      mockPrisma.gasto.findMany.mockResolvedValue([gastos.gasto1, gastos.gasto2]);
      const response = await GET();
      const data = await response.json();
      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(2);
      expect(data[0]).toHaveProperty('monto');
      expect(data[0]).toHaveProperty('descripcion');
      expect(mockPrisma.gasto.findMany).toHaveBeenCalledWith({
        where: { usuario_id: usuarios.usuario1.id },
        include: { categoria: true },
        orderBy: { fecha: 'desc' }
      });
    });
    it('debe retornar 401 para usuario no autenticado', async () => {
      (currentUser as jest.Mock).mockResolvedValue(null);
      const response = await GET();
      const data = await response.json();
      expect(response.status).toBe(401);
      expect(data).toHaveProperty('error');
      expect(data.error).toBe('Unauthorized');
      expect(mockPrisma.gasto.findMany).not.toHaveBeenCalled();
    });
    it('debe retornar array vacío si usuario no existe en BD', async () => {
      const mockUser = {
        id: 'clerk_new',
        emailAddresses: [{ emailAddress: 'new@example.com' }]
      };
      (currentUser as jest.Mock).mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(null);
      const response = await GET();
      const data = await response.json();
      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(0);
    });
    it('debe retornar 400 si no hay email', async () => {
      const mockUserWithoutEmail = {
        id: 'clerk_123',
        emailAddresses: []
      };
      (currentUser as jest.Mock).mockResolvedValue(mockUserWithoutEmail);
      const response = await GET();
      const data = await response.json();
      expect(response.status).toBe(400);
      expect(data.error).toBe('Email not found');
    });
    it('debe manejar errores de BD correctamente', async () => {
      const mockUser = {
        id: 'clerk_123',
        emailAddresses: [{ emailAddress: 'test@example.com' }]
      };
      (currentUser as jest.Mock).mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockRejectedValue(new Error('Database error'));
      const response = await GET();
      const data = await response.json();
      expect(response.status).toBe(500);
      expect(data).toHaveProperty('error');
      expect(data.error).toBe('Error fetching expenses');
    });
  });
  describe('POST /api/gastos - Crear nuevo gasto', () => {
    it('debe crear gasto con datos válidos', async () => {
      const mockUser = {
        id: 'clerk_123',
        firstName: 'Test',
        emailAddresses: [{ emailAddress: 'test@example.com' }]
      };
      const requestBody = {
        monto: 100.50,
        fecha: '2024-01-15',
        descripcion: 'Comida',
        categoria_id: 1,
        factura: true,
        metodo_pago: 'tarjeta'
      };
      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestBody)
      } as unknown as Request;
      (currentUser as jest.Mock).mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(usuarios.usuario1);
      mockPrisma.categoria.findUnique.mockResolvedValue(categorias.alimentacion);
      mockPrisma.gasto.create.mockResolvedValue({
        ...gastos.gasto1,
        ...requestBody
      });
      const response = await POST(mockRequest);
      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data).toHaveProperty('id');
      expect(data.monto).toBe(requestBody.monto);
      expect(data.descripcion).toBe(requestBody.descripcion);
      expect(mockPrisma.gasto.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          usuario_id: usuarios.usuario1.id,
          monto: requestBody.monto,
          descripcion: requestBody.descripcion
        }),
        include: { categoria: true }
      });
    });
    it('debe retornar 401 para usuario no autenticado', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({ monto: 100, fecha: '2024-01-15' })
      } as unknown as Request;
      (currentUser as jest.Mock).mockResolvedValue(null);
      const response = await POST(mockRequest);
      const data = await response.json();
      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });
    it('debe retornar 400 si faltan campos requeridos', async () => {
      const mockUser = {
        id: 'clerk_123',
        emailAddresses: [{ emailAddress: 'test@example.com' }]
      };
      const requestBody = {
        descripcion: 'Sin monto ni fecha'
      };
      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestBody)
      } as unknown as Request;
      (currentUser as jest.Mock).mockResolvedValue(mockUser);
      const response = await POST(mockRequest);
      const data = await response.json();
      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
      expect(data.error).toBe('Monto y fecha son requeridos');
    });
    it('debe retornar 400 si la categoría no existe', async () => {
      const mockUser = {
        id: 'clerk_123',
        emailAddresses: [{ emailAddress: 'test@example.com' }]
      };
      const requestBody = {
        monto: 100,
        fecha: '2024-01-15',
        categoria_id: 999
      };
      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestBody)
      } as unknown as Request;
      (currentUser as jest.Mock).mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(usuarios.usuario1);
      mockPrisma.categoria.findUnique.mockResolvedValue(null);
      const response = await POST(mockRequest);
      const data = await response.json();
      expect(response.status).toBe(400);
      expect(data.error).toBe('Categoría no válida');
    });
    it('debe crear usuario si no existe en BD', async () => {
      const mockUser = {
        id: 'clerk_new',
        firstName: 'New User',
        emailAddresses: [{ emailAddress: 'newuser@example.com' }]
      };
      const requestBody = {
        monto: 50,
        fecha: '2024-01-15',
        descripcion: 'Test'
      };
      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestBody)
      } as unknown as Request;
      (currentUser as jest.Mock).mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(null);
      mockPrisma.usuario.create.mockResolvedValue({
        id: 2,
        nombre: 'New User',
        email: 'newuser@example.com',
        moneda_preferida: 'USD'
      });
      mockPrisma.gasto.create.mockResolvedValue(gastos.gasto1);
      const response = await POST(mockRequest);
      expect(response.status).toBe(200);
      expect(mockPrisma.usuario.create).toHaveBeenCalledWith({
        data: {
          nombre: 'New User',
          email: 'newuser@example.com',
          moneda_preferida: 'USD'
        }
      });
    });
  });
});
