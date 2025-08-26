/**
 * Pruebas unitarias para gestión de usuarios
 * Escenarios: CP006 – DeleteUser, CP007 – GetUserTransaction
 * Responsable: Jonathan
 */

import { describe, test, expect, beforeEach } from '@jest/globals';

// Interfaces para los datos
interface Usuario {
  id: number;
  email: string;
  clerk_id: string;
  nombre?: string;
  activo: boolean;
}

interface Transaction {
  id: number;
  monto: number;
  fecha: string;
  descripcion: string;
  categoria?: {
    id: number;
    nombre: string;
  };
  tipo: 'ingreso' | 'gasto';
  usuario_id: number;
}

interface Categoria {
  id: number;
  nombre: string;
  usuario_id: number;
}

// Funciones simuladas para pruebas unitarias
export const deleteUser = (
  usuario: Usuario,
  transacciones: Transaction[],
  categorias: Categoria[],
  confirmarEliminacion: boolean = false
): { success: boolean; message: string; deletedData?: { transacciones: number; categorias: number } } => {
  
  // Validar confirmación
  if (!confirmarEliminacion) {
    throw new Error('Debe confirmar la eliminación del usuario');
  }

  // Validar que el usuario existe
  if (!usuario || !usuario.id) {
    return {
      success: false,
      message: 'El usuario no existe'
    };
  }

  // Validar que el usuario está activo
  if (!usuario.activo) {
    return {
      success: false,
      message: 'El usuario ya está inactivo'
    };
  }

  // Simular eliminación de datos relacionados
  const transaccionesUsuario = transacciones.filter(t => t.usuario_id === usuario.id);
  const categoriasUsuario = categorias.filter(c => c.usuario_id === usuario.id);

  return {
    success: true,
    message: 'Usuario eliminado correctamente',
    deletedData: {
      transacciones: transaccionesUsuario.length,
      categorias: categoriasUsuario.length
    }
  };
};

export const getUserTransactions = (
  usuario: Usuario,
  todasTransacciones: Transaction[]
): { success: boolean; transactions: Transaction[]; message?: string } => {
  
  // Validar usuario autenticado
  if (!usuario || !usuario.clerk_id) {
    return {
      success: false,
      transactions: [],
      message: 'Usuario no autenticado'
    };
  }

  // Validar que el usuario está activo
  if (!usuario.activo) {
    return {
      success: false,
      transactions: [],
      message: 'Usuario inactivo'
    };
  }

  // Filtrar transacciones del usuario autenticado
  const transaccionesUsuario = todasTransacciones.filter(t => t.usuario_id === usuario.id);

  // Ordenar por fecha descendente
  const transaccionesOrdenadas = transaccionesUsuario.sort((a, b) => 
    new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );

  return {
    success: true,
    transactions: transaccionesOrdenadas,
    message: transaccionesOrdenadas.length === 0 ? 'No hay transacciones registradas' : undefined
  };
};

// Función para medir tiempo de respuesta
export const measureResponseTime = <T>(
  operation: () => T
): { result: T; time: number } => {
  const startTime = performance.now();
  const result = operation();
  const endTime = performance.now();
  
  return {
    result,
    time: endTime - startTime
  };
};

describe('CP006 – DeleteUser', () => {
  let mockUser: Usuario;
  let mockTransactions: Transaction[];
  let mockCategories: Categoria[];

  beforeEach(() => {
    mockUser = {
      id: 1,
      email: 'test@example.com',
      clerk_id: 'clerk_123',
      nombre: 'Usuario Test',
      activo: true
    };

    mockTransactions = [
      {
        id: 1,
        monto: 500,
        fecha: '2024-01-15',
        descripcion: 'Gasto 1',
        tipo: 'gasto',
        usuario_id: 1
      },
      {
        id: 2,
        monto: 1000,
        fecha: '2024-01-16',
        descripcion: 'Ingreso 1',
        tipo: 'ingreso',
        usuario_id: 1
      },
      {
        id: 3,
        monto: 200,
        fecha: '2024-01-17',
        descripcion: 'Gasto otro usuario',
        tipo: 'gasto',
        usuario_id: 2
      }
    ];

    mockCategories = [
      { id: 1, nombre: 'Alimentación', usuario_id: 1 },
      { id: 2, nombre: 'Transporte', usuario_id: 1 },
      { id: 3, nombre: 'Categoría otro usuario', usuario_id: 2 }
    ];
  });

  describe('Confirmación de eliminación', () => {
    test('debe requerir confirmación antes de eliminar', () => {
      // Act & Assert
      expect(() => {
        deleteUser(mockUser, mockTransactions, mockCategories, false);
      }).toThrow('Debe confirmar la eliminación del usuario');
    });

    test('debe proceder con eliminación cuando se confirma', () => {
      // Act
      const resultado = deleteUser(mockUser, mockTransactions, mockCategories, true);

      // Assert
      expect(resultado.success).toBe(true);
      expect(resultado.message).toBe('Usuario eliminado correctamente');
    });
  });

  describe('Validaciones de usuario', () => {
    test('debe mostrar error si el usuario no existe', () => {
      // Arrange
      const usuarioInexistente = null as any;

      // Act
      const resultado = deleteUser(usuarioInexistente, mockTransactions, mockCategories, true);

      // Assert
      expect(resultado.success).toBe(false);
      expect(resultado.message).toBe('El usuario no existe');
    });

    test('debe mostrar error si el usuario no tiene ID', () => {
      // Arrange
      const usuarioSinId = { ...mockUser, id: null } as any;

      // Act
      const resultado = deleteUser(usuarioSinId, mockTransactions, mockCategories, true);

      // Assert
      expect(resultado.success).toBe(false);
      expect(resultado.message).toBe('El usuario no existe');
    });

    test('debe validar que el usuario esté activo', () => {
      // Arrange
      const usuarioInactivo = { ...mockUser, activo: false };

      // Act
      const resultado = deleteUser(usuarioInactivo, mockTransactions, mockCategories, true);

      // Assert
      expect(resultado.success).toBe(false);
      expect(resultado.message).toBe('El usuario ya está inactivo');
    });
  });

  describe('Eliminación de datos asociados', () => {
    test('debe eliminar todas las transacciones del usuario', () => {
      // Act
      const resultado = deleteUser(mockUser, mockTransactions, mockCategories, true);

      // Assert
      expect(resultado.success).toBe(true);
      expect(resultado.deletedData?.transacciones).toBe(2); // 2 transacciones del usuario
    });

    test('debe eliminar todas las categorías del usuario', () => {
      // Act
      const resultado = deleteUser(mockUser, mockTransactions, mockCategories, true);

      // Assert
      expect(resultado.success).toBe(true);
      expect(resultado.deletedData?.categorias).toBe(2); // 2 categorías del usuario
    });

    test('NO debe eliminar datos de otros usuarios', () => {
      // Arrange
      const otroUsuario = {
        id: 2,
        email: 'otro@example.com',
        clerk_id: 'clerk_456',
        activo: true
      };

      // Act
      const resultado = deleteUser(otroUsuario, mockTransactions, mockCategories, true);

      // Assert
      expect(resultado.success).toBe(true);
      expect(resultado.deletedData?.transacciones).toBe(1); // Solo 1 transacción del usuario 2
      expect(resultado.deletedData?.categorias).toBe(1); // Solo 1 categoría del usuario 2
    });

    test('debe manejar usuario sin datos asociados', () => {
      // Arrange
      const usuarioSinDatos = {
        id: 999,
        email: 'sindatos@example.com',
        clerk_id: 'clerk_999',
        activo: true
      };

      // Act
      const resultado = deleteUser(usuarioSinDatos, mockTransactions, mockCategories, true);

      // Assert
      expect(resultado.success).toBe(true);
      expect(resultado.deletedData?.transacciones).toBe(0);
      expect(resultado.deletedData?.categorias).toBe(0);
    });
  });

  describe('Métricas y rendimiento', () => {
    test('debe completar eliminación con tiempo de respuesta aceptable', () => {
      // Act
      const { result, time } = measureResponseTime(() => 
        deleteUser(mockUser, mockTransactions, mockCategories, true)
      );

      // Assert
      expect(result.success).toBe(true);
      expect(time).toBeLessThan(100); // Menos de 100ms
    });

    test('debe manejar grandes volúmenes de datos eficientemente', () => {
      // Arrange - Crear muchas transacciones y categorías
      const muchasTransacciones = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        monto: 100,
        fecha: '2024-01-15',
        descripcion: `Transacción ${i}`,
        tipo: 'gasto' as const,
        usuario_id: 1
      }));

      const muchasCategorias = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        nombre: `Categoría ${i}`,
        usuario_id: 1
      }));

      // Act
      const { result, time } = measureResponseTime(() => 
        deleteUser(mockUser, muchasTransacciones, muchasCategorias, true)
      );

      // Assert
      expect(result.success).toBe(true);
      expect(result.deletedData?.transacciones).toBe(1000);
      expect(result.deletedData?.categorias).toBe(100);
      expect(time).toBeLessThan(200); // Menos de 200ms incluso con muchos datos
    });
  });
});

describe('CP007 – GetUserTransaction', () => {
  let mockUser: Usuario;
  let mockAllTransactions: Transaction[];

  beforeEach(() => {
    mockUser = {
      id: 1,
      email: 'test@example.com',
      clerk_id: 'clerk_123',
      nombre: 'Usuario Test',
      activo: true
    };

    mockAllTransactions = [
      {
        id: 1,
        monto: 500,
        fecha: '2024-01-20',
        descripcion: 'Gasto reciente',
        categoria: { id: 1, nombre: 'Alimentación' },
        tipo: 'gasto',
        usuario_id: 1
      },
      {
        id: 2,
        monto: 1000,
        fecha: '2024-01-15',
        descripcion: 'Ingreso anterior',
        tipo: 'ingreso',
        usuario_id: 1
      },
      {
        id: 3,
        monto: 200,
        fecha: '2024-01-25',
        descripcion: 'Gasto más reciente',
        tipo: 'gasto',
        usuario_id: 1
      },
      {
        id: 4,
        monto: 300,
        fecha: '2024-01-18',
        descripcion: 'Transacción otro usuario',
        tipo: 'gasto',
        usuario_id: 2
      }
    ];
  });

  describe('Autenticación de usuario', () => {
    test('debe devolver transacciones del usuario autenticado', () => {
      // Act
      const resultado = getUserTransactions(mockUser, mockAllTransactions);

      // Assert
      expect(resultado.success).toBe(true);
      expect(resultado.transactions).toHaveLength(3);
      expect(resultado.transactions.every(t => t.usuario_id === 1)).toBe(true);
    });

    test('debe rechazar usuario no autenticado', () => {
      // Arrange
      const usuarioNoAuth = null as any;

      // Act
      const resultado = getUserTransactions(usuarioNoAuth, mockAllTransactions);

      // Assert
      expect(resultado.success).toBe(false);
      expect(resultado.transactions).toHaveLength(0);
      expect(resultado.message).toBe('Usuario no autenticado');
    });

    test('debe rechazar usuario sin clerk_id', () => {
      // Arrange
      const usuarioSinClerkId = { ...mockUser, clerk_id: '' };

      // Act
      const resultado = getUserTransactions(usuarioSinClerkId, mockAllTransactions);

      // Assert
      expect(resultado.success).toBe(false);
      expect(resultado.transactions).toHaveLength(0);
      expect(resultado.message).toBe('Usuario no autenticado');
    });

    test('debe rechazar usuario inactivo', () => {
      // Arrange
      const usuarioInactivo = { ...mockUser, activo: false };

      // Act
      const resultado = getUserTransactions(usuarioInactivo, mockAllTransactions);

      // Assert
      expect(resultado.success).toBe(false);
      expect(resultado.transactions).toHaveLength(0);
      expect(resultado.message).toBe('Usuario inactivo');
    });
  });

  describe('Filtrado de transacciones', () => {
    test('debe mostrar solo transacciones del usuario autenticado', () => {
      // Act
      const resultado = getUserTransactions(mockUser, mockAllTransactions);

      // Assert
      expect(resultado.success).toBe(true);
      expect(resultado.transactions).toHaveLength(3);
      
      // Verificar que no incluye transacciones de otros usuarios
      const transaccionesOtroUsuario = resultado.transactions.filter(t => t.usuario_id !== 1);
      expect(transaccionesOtroUsuario).toHaveLength(0);
    });

    test('debe ordenar transacciones por fecha descendente', () => {
      // Act
      const resultado = getUserTransactions(mockUser, mockAllTransactions);

      // Assert
      expect(resultado.success).toBe(true);
      expect(resultado.transactions).toHaveLength(3);
      
      // Verificar orden descendente por fecha
      const fechas = resultado.transactions.map(t => new Date(t.fecha).getTime());
      for (let i = 1; i < fechas.length; i++) {
        expect(fechas[i]).toBeLessThanOrEqual(fechas[i - 1]);
      }
      
      // Verificar orden específico
      expect(resultado.transactions[0].descripcion).toBe('Gasto más reciente'); // 2024-01-25
      expect(resultado.transactions[1].descripcion).toBe('Gasto reciente');     // 2024-01-20
      expect(resultado.transactions[2].descripcion).toBe('Ingreso anterior');   // 2024-01-15
    });
  });

  describe('Casos sin transacciones', () => {
    test('debe mostrar mensaje cuando no hay transacciones', () => {
      // Arrange
      const transaccionesVacias: Transaction[] = [];

      // Act
      const resultado = getUserTransactions(mockUser, transaccionesVacias);

      // Assert
      expect(resultado.success).toBe(true);
      expect(resultado.transactions).toHaveLength(0);
      expect(resultado.message).toBe('No hay transacciones registradas');
    });

    test('debe manejar usuario sin transacciones propias', () => {
      // Arrange
      const usuarioSinTransacciones = {
        id: 999,
        email: 'sin-transacciones@example.com',
        clerk_id: 'clerk_999',
        activo: true
      };

      // Act
      const resultado = getUserTransactions(usuarioSinTransacciones, mockAllTransactions);

      // Assert
      expect(resultado.success).toBe(true);
      expect(resultado.transactions).toHaveLength(0);
      expect(resultado.message).toBe('No hay transacciones registradas');
    });
  });

  describe('Integridad de datos', () => {
    test('debe preservar todos los campos de las transacciones', () => {
      // Act
      const resultado = getUserTransactions(mockUser, mockAllTransactions);

      // Assert
      expect(resultado.success).toBe(true);
      const primeraTransaccion = resultado.transactions[0];
      
      expect(primeraTransaccion).toHaveProperty('id');
      expect(primeraTransaccion).toHaveProperty('monto');
      expect(primeraTransaccion).toHaveProperty('fecha');
      expect(primeraTransaccion).toHaveProperty('descripcion');
      expect(primeraTransaccion).toHaveProperty('tipo');
      expect(primeraTransaccion).toHaveProperty('usuario_id');
    });

    test('debe incluir categorías cuando están disponibles', () => {
      // Act
      const resultado = getUserTransactions(mockUser, mockAllTransactions);

      // Assert
      expect(resultado.success).toBe(true);
      const transaccionConCategoria = resultado.transactions.find(t => t.categoria);
      
      expect(transaccionConCategoria).toBeDefined();
      expect(transaccionConCategoria?.categoria).toHaveProperty('id');
      expect(transaccionConCategoria?.categoria).toHaveProperty('nombre');
    });
  });

  describe('Métricas y rendimiento', () => {
    test('debe responder en tiempo aceptable', () => {
      // Act
      const { result, time } = measureResponseTime(() => 
        getUserTransactions(mockUser, mockAllTransactions)
      );

      // Assert
      expect(result.success).toBe(true);
      expect(time).toBeLessThan(50); // Menos de 50ms
    });

    test('debe manejar grandes volúmenes de transacciones eficientemente', () => {
      // Arrange
      const muchasTransacciones = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        monto: Math.random() * 1000,
        fecha: `2024-${String(Math.ceil(Math.random() * 12)).padStart(2, '0')}-15`,
        descripcion: `Transacción ${i}`,
        tipo: (i % 2 === 0 ? 'gasto' : 'ingreso') as 'gasto' | 'ingreso',
        usuario_id: i % 3 === 0 ? 1 : 2 // 1/3 de las transacciones para usuario 1
      }));

      // Act
      const { result, time } = measureResponseTime(() => 
        getUserTransactions(mockUser, muchasTransacciones)
      );

      // Assert
      expect(result.success).toBe(true);
      expect(result.transactions.length).toBeGreaterThan(3000); // Aprox 1/3 de 10k
      expect(time).toBeLessThan(200); // Menos de 200ms incluso con muchos datos
    });

    test('debe contar registros recuperados correctamente', () => {
      // Act
      const resultado = getUserTransactions(mockUser, mockAllTransactions);

      // Assert
      expect(resultado.success).toBe(true);
      expect(resultado.transactions).toHaveLength(3);
      
      // Métrica: número de registros recuperados
      const numeroRegistros = resultado.transactions.length;
      expect(numeroRegistros).toBe(3);
    });
  });
});