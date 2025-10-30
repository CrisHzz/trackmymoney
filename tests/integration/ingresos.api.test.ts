import { GET, POST } from '@/app/api/ingresos/route';
import { usuarios, ingresos, categorias } from '../__fixtures__/testData';
jest.mock('@clerk/nextjs/server', () => ({
  currentUser: jest.fn()
}));
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    usuario: {
      findFirst: jest.fn(),
      create: jest.fn()
    },
    ingreso: {
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
describe('API Ingresos - Pruebas de Integración', () => {
  let mockPrisma: any;
  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma = new PrismaClient();
  });
  describe('GET /api/ingresos - Obtener ingresos del usuario', () => {
    it('debe retornar lista de ingresos para usuario autenticado', async () => {
      const mockUser = {
        id: 'clerk_123',
        emailAddresses: [{ emailAddress: 'test@example.com' }]
      };
      (currentUser as jest.Mock).mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(usuarios.usuario1);
      mockPrisma.ingreso.findMany.mockResolvedValue([
        ingresos.ingreso1,
        ingresos.ingreso2
      ]);
      const response = await GET();
      const data = await response.json();
      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(2);
      expect(data[0]).toHaveProperty('monto');
      expect(data[0]).toHaveProperty('descripcion');
      expect(mockPrisma.ingreso.findMany).toHaveBeenCalledWith({
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
    });
    it('debe retornar array vacío si usuario no tiene ingresos', async () => {
      const mockUser = {
        id: 'clerk_123',
        emailAddresses: [{ emailAddress: 'test@example.com' }]
      };
      (currentUser as jest.Mock).mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(usuarios.usuario1);
      mockPrisma.ingreso.findMany.mockResolvedValue([]);
      const response = await GET();
      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data).toHaveLength(0);
    });
    it('debe manejar errores de BD correctamente', async () => {
      const mockUser = {
        id: 'clerk_123',
        emailAddresses: [{ emailAddress: 'test@example.com' }]
      };
      (currentUser as jest.Mock).mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockRejectedValue(
        new Error('Database connection error')
      );
      const response = await GET();
      const data = await response.json();
      expect(response.status).toBe(500);
      expect(data.error).toBe('Error fetching income');
    });
  });
  describe('POST /api/ingresos - Crear nuevo ingreso', () => {
    it('debe crear ingreso con datos válidos y tipo_ingreso', async () => {
      const mockUser = {
        id: 'clerk_123',
        firstName: 'Test',
        emailAddresses: [{ emailAddress: 'test@example.com' }]
      };
      const requestBody = {
        monto: 1000,
        fecha: '2024-01-01',
        descripcion: 'Salario',
        tipo_ingreso: 'Trabajo',
        categoria_id: 1,
        recurrente: true,
        frecuencia: 'mensual'
      };
      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestBody)
      } as unknown as Request;
      (currentUser as jest.Mock).mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(usuarios.usuario1);
      mockPrisma.categoria.findUnique.mockResolvedValue(categorias.alimentacion);
      mockPrisma.ingreso.create.mockResolvedValue({
        ...ingresos.ingreso1,
        ...requestBody
      });
      const response = await POST(mockRequest);
      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data).toHaveProperty('id');
      expect(data.monto).toBe(requestBody.monto);
      expect(data.descripcion).toBe(requestBody.descripcion);
      expect(mockPrisma.ingreso.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          usuario_id: usuarios.usuario1.id,
          monto: requestBody.monto,
          tipo_ingreso: requestBody.tipo_ingreso,
          recurrente: true,
          frecuencia: 'mensual'
        }),
        include: { categoria: true }
      });
    });
    it('debe retornar 401 para usuario no autenticado', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          monto: 1000,
          fecha: '2024-01-01',
          tipo_ingreso: 'Trabajo'
        })
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
        descripcion: 'Sin monto ni fecha ni tipo'
      };
      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestBody)
      } as unknown as Request;
      (currentUser as jest.Mock).mockResolvedValue(mockUser);
      const response = await POST(mockRequest);
      const data = await response.json();
      expect(response.status).toBe(400);
      expect(data.error).toBe('Monto, fecha y tipo de ingreso son requeridos');
    });
    it('debe manejar ingresos recurrentes con fecha_fin', async () => {
      const mockUser = {
        id: 'clerk_123',
        emailAddresses: [{ emailAddress: 'test@example.com' }]
      };
      const requestBody = {
        monto: 500,
        fecha: '2024-01-01',
        tipo_ingreso: 'Freelance',
        recurrente: true,
        frecuencia: 'mensual',
        fecha_fin: '2024-12-31'
      };
      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestBody)
      } as unknown as Request;
      (currentUser as jest.Mock).mockResolvedValue(mockUser);
      mockPrisma.usuario.findFirst.mockResolvedValue(usuarios.usuario1);
      mockPrisma.ingreso.create.mockResolvedValue({
        ...ingresos.ingreso1,
        ...requestBody
      });
      const response = await POST(mockRequest);
      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data.recurrente).toBe(true);
      expect(data.frecuencia).toBe('mensual');
      expect(mockPrisma.ingreso.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          recurrente: true,
          frecuencia: 'mensual',
          fecha_fin: expect.any(Date)
        }),
        include: { categoria: true }
      });
    });
    it('debe crear usuario si no existe', async () => {
      const mockUser = {
        id: 'clerk_new',
        firstName: 'New User',
        emailAddresses: [{ emailAddress: 'newuser@example.com' }]
      };
      const requestBody = {
        monto: 1000,
        fecha: '2024-01-01',
        tipo_ingreso: 'Trabajo'
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
      mockPrisma.ingreso.create.mockResolvedValue(ingresos.ingreso1);
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
    it('debe retornar 400 si la categoría no existe', async () => {
      const mockUser = {
        id: 'clerk_123',
        emailAddresses: [{ emailAddress: 'test@example.com' }]
      };
      const requestBody = {
        monto: 1000,
        fecha: '2024-01-01',
        tipo_ingreso: 'Trabajo',
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
  });
});
