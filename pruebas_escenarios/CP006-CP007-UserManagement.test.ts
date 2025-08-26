/**
 * Escenarios: CP006 – DeleteUser, CP007 – GetUserTransaction
 */

import { describe, test, expect, beforeEach } from '@jest/globals';

// Interfaces para los datos
interface Usuario {
  id: number;
  email: string;
  clerk_id: string;
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
  
  if (!confirmarEliminacion) {
    throw new Error('Debe confirmar la eliminación del usuario');
  }

  if (!usuario || !usuario.id) {
    return {
      success: false,
      message: 'El usuario no existe'
    };
  }

  if (!usuario.activo) {
    return {
      success: false,
      message: 'El usuario ya está inactivo'
    };
  }

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
  
  if (!usuario || !usuario.clerk_id) {
    return {
      success: false,
      transactions: [],
      message: 'Usuario no autenticado'
    };
  }

  if (!usuario.activo) {
    return {
      success: false,
      transactions: [],
      message: 'Usuario inactivo'
    };
  }

  const transaccionesUsuario = todasTransacciones.filter(t => t.usuario_id === usuario.id);
  const transaccionesOrdenadas = transaccionesUsuario.sort((a, b) => 
    new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );

  return {
    success: true,
    transactions: transaccionesOrdenadas,
    message: transaccionesOrdenadas.length === 0 ? 'No hay transacciones registradas' : undefined
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
      activo: true
    };

    mockTransactions = [
      { id: 1, monto: 500, fecha: '2024-01-15', descripcion: 'Gasto 1', tipo: 'gasto', usuario_id: 1 },
      { id: 2, monto: 1000, fecha: '2024-01-16', descripcion: 'Ingreso 1', tipo: 'ingreso', usuario_id: 1 }
    ];

    mockCategories = [
      { id: 1, nombre: 'Alimentación', usuario_id: 1 },
      { id: 2, nombre: 'Transporte', usuario_id: 1 }
    ];
  });

  // Test de Caja Negra: Verifica comportamiento de seguridad sin revisar implementación
  test('debe requerir confirmación antes de eliminar', () => {
    // Act & Assert
    expect(() => {
      deleteUser(mockUser, mockTransactions, mockCategories, false);
    }).toThrow('Debe confirmar la eliminación del usuario');
  });

  // Test de Caja Negra: Verifica funcionalidad de eliminación exitosa
  test('debe proceder con eliminación cuando se confirma', () => {
    // Act
    const resultado = deleteUser(mockUser, mockTransactions, mockCategories, true);

    // Assert
    expect(resultado.success).toBe(true);
    expect(resultado.message).toBe('Usuario eliminado correctamente');
  });

  // Test de Caja Blanca: Verifica que la lógica interna cuente correctamente las transacciones eliminadas
  test('debe eliminar todas las transacciones del usuario', () => {
    // Act
    const resultado = deleteUser(mockUser, mockTransactions, mockCategories, true);

    // Assert
    expect(resultado.success).toBe(true);
    expect(resultado.deletedData?.transacciones).toBe(2);
  });

  // Test de Caja Negra: Verifica manejo de casos límite (usuario inexistente)
  test('debe mostrar error si el usuario no existe', () => {
    // Arrange
    const usuarioInexistente = null as any;

    // Act
    const resultado = deleteUser(usuarioInexistente, mockTransactions, mockCategories, true);

    // Assert
    expect(resultado.success).toBe(false);
    expect(resultado.message).toBe('El usuario no existe');
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
      activo: true
    };

    mockAllTransactions = [
      { id: 1, monto: 500, fecha: '2024-01-20', descripcion: 'Gasto reciente', tipo: 'gasto', usuario_id: 1 },
      { id: 2, monto: 1000, fecha: '2024-01-15', descripcion: 'Ingreso anterior', tipo: 'ingreso', usuario_id: 1 },
      { id: 3, monto: 200, fecha: '2024-01-25', descripcion: 'Gasto más reciente', tipo: 'gasto', usuario_id: 1 },
      { id: 4, monto: 300, fecha: '2024-01-18', descripcion: 'Transacción otro usuario', tipo: 'gasto', usuario_id: 2 }
    ];
  });

  // Test de Caja Blanca: Verifica el filtrado interno por usuario_id
  test('debe devolver transacciones del usuario autenticado', () => {
    // Act
    const resultado = getUserTransactions(mockUser, mockAllTransactions);

    // Assert
    expect(resultado.success).toBe(true);
    expect(resultado.transactions).toHaveLength(3);
    expect(resultado.transactions.every(t => t.usuario_id === 1)).toBe(true);
  });

  // Test de Caja Negra: Verifica control de acceso sin revisar implementación
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

  // Test de Caja Blanca: Verifica la lógica interna de ordenamiento por fecha
  test('debe ordenar transacciones por fecha descendente', () => {
    // Act
    const resultado = getUserTransactions(mockUser, mockAllTransactions);

    // Assert
    expect(resultado.success).toBe(true);
    
    const fechas = resultado.transactions.map(t => new Date(t.fecha).getTime());
    for (let i = 1; i < fechas.length; i++) {
      expect(fechas[i]).toBeLessThanOrEqual(fechas[i - 1]);
    }
  });

  // Test de Caja Negra: Verifica comportamiento con datos vacíos
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
});