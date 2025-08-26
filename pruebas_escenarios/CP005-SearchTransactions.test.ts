/**
 * Escenario: CP005 – SearchTransactions
 */

import { describe, test, expect, beforeEach } from '@jest/globals';

// Interfaces para las transacciones
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
  tipo_ingreso?: string;
}

// Función de búsqueda simulada
export const searchTransactions = (
  transactions: Transaction[],
  filters: {
    categoria?: string;
    fechaInicio?: string;
    fechaFin?: string;
    descripcion?: string;
    tipo?: 'ingreso' | 'gasto' | 'todos';
  }
): Transaction[] => {
  if (!Array.isArray(transactions)) {
    return [];
  }

  return transactions.filter(transaction => {
    // Filtro por categoría
    if (filters.categoria) {
      const categoria = transaction.categoria?.nombre || transaction.tipo_ingreso || '';
      if (!categoria.toLowerCase().includes(filters.categoria.toLowerCase())) {
        return false;
      }
    }

    // Filtro por fecha
    if (filters.fechaInicio) {
      const fechaTransaccion = new Date(transaction.fecha);
      const fechaInicio = new Date(filters.fechaInicio);
      if (fechaTransaccion < fechaInicio) {
        return false;
      }
    }

    if (filters.fechaFin) {
      const fechaTransaccion = new Date(transaction.fecha);
      const fechaFin = new Date(filters.fechaFin);
      if (fechaTransaccion > fechaFin) {
        return false;
      }
    }

    // Filtro por descripción
    if (filters.descripcion) {
      if (!transaction.descripcion.toLowerCase().includes(filters.descripcion.toLowerCase())) {
        return false;
      }
    }

    // Filtro por tipo
    if (filters.tipo && filters.tipo !== 'todos') {
      if (transaction.tipo !== filters.tipo) {
        return false;
      }
    }

    return true;
  });
};

describe('CP005 – SearchTransactions', () => {
  let mockTransactions: Transaction[];

  beforeEach(() => {
    mockTransactions = [
      {
        id: 1,
        monto: 500,
        fecha: '2024-01-15',
        descripcion: 'Supermercado Éxito',
        categoria: { id: 1, nombre: 'Alimentación' },
        tipo: 'gasto',
        usuario_id: 1
      },
      {
        id: 2,
        monto: 300,
        fecha: '2024-01-16',
        descripcion: 'Gasolina carro',
        categoria: { id: 2, nombre: 'Transporte' },
        tipo: 'gasto',
        usuario_id: 1
      },
      {
        id: 3,
        monto: 2000,
        fecha: '2024-01-20',
        descripcion: 'Salario enero',
        tipo: 'ingreso',
        tipo_ingreso: 'Salario',
        usuario_id: 1
      },
      {
        id: 4,
        monto: 150,
        fecha: '2024-02-01',
        descripcion: 'Cine con amigos',
        categoria: { id: 3, nombre: 'Entretenimiento' },
        tipo: 'gasto',
        usuario_id: 1
      }
    ];
  });

  // Test de Caja Negra: Verifica funcionalidad de filtrado por categoría sin revisar implementación
  test('debe filtrar transacciones por categoría', () => {
    // Arrange
    const filtros = { categoria: 'Alimentación' };

    // Act
    const resultados = searchTransactions(mockTransactions, filtros);

    // Assert
    expect(resultados).toHaveLength(1);
    expect(resultados[0].categoria?.nombre).toBe('Alimentación');
    expect(resultados[0].descripcion).toBe('Supermercado Éxito');
  });

  // Test de Caja Negra: Verifica funcionalidad de filtrado por fechas
  test('debe filtrar transacciones por rango de fechas', () => {
    // Arrange
    const filtros = { 
      fechaInicio: '2024-01-16', 
      fechaFin: '2024-01-20' 
    };

    // Act
    const resultados = searchTransactions(mockTransactions, filtros);

    // Assert
    expect(resultados).toHaveLength(2);
    expect(resultados.every(t => {
      const fecha = new Date(t.fecha);
      return fecha >= new Date('2024-01-16') && fecha <= new Date('2024-01-20');
    })).toBe(true);
  });

  // Test de Caja Negra: Verifica búsqueda por texto en descripción
  test('debe filtrar transacciones por descripción', () => {
    // Arrange
    const filtros = { descripcion: 'gasolina' };

    // Act
    const resultados = searchTransactions(mockTransactions, filtros);

    // Assert
    expect(resultados).toHaveLength(1);
    expect(resultados[0].descripcion).toBe('Gasolina carro');
  });

  // Test de Caja Negra: Verifica comportamiento con filtros que no coinciden
  test('debe manejar búsqueda sin resultados', () => {
    // Arrange
    const filtros = { categoria: 'Categoría Inexistente' };

    // Act
    const resultados = searchTransactions(mockTransactions, filtros);

    // Assert
    expect(resultados).toHaveLength(0);
    expect(Array.isArray(resultados)).toBe(true);
    
    const mensaje = resultados.length === 0 ? 'No se encontraron resultados' : '';
    expect(mensaje).toBe('No se encontraron resultados');
  });
});