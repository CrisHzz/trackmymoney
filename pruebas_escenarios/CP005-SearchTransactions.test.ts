/**
 * Pruebas unitarias para búsqueda y filtros de transacciones
 * Escenario: CP005 – SearchTransactions
 * Responsable: Jonathan
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

// Función de búsqueda simulada (función pura para pruebas unitarias)
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

    // Filtro por fecha (rango)
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

// Función para medir tiempo de búsqueda
export const measureSearchTime = (
  transactions: Transaction[],
  filters: any
): { results: Transaction[]; time: number } => {
  const startTime = performance.now();
  const results = searchTransactions(transactions, filters);
  const endTime = performance.now();
  
  return {
    results,
    time: endTime - startTime
  };
};

describe('CP005 – SearchTransactions', () => {
  let mockTransactions: Transaction[];

  beforeEach(() => {
    // Datos de prueba
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
      },
      {
        id: 5,
        monto: 1000,
        fecha: '2024-02-05',
        descripcion: 'Freelance proyecto',
        tipo: 'ingreso',
        tipo_ingreso: 'Freelance',
        usuario_id: 1
      }
    ];
  });

  describe('Filtros por categoría', () => {
    test('debe filtrar transacciones por categoría exacta', () => {
      // Arrange
      const filtros = { categoria: 'Alimentación' };

      // Act
      const resultados = searchTransactions(mockTransactions, filtros);

      // Assert
      expect(resultados).toHaveLength(1);
      expect(resultados[0].categoria?.nombre).toBe('Alimentación');
      expect(resultados[0].descripcion).toBe('Supermercado Éxito');
    });

    test('debe filtrar transacciones por categoría parcial (case insensitive)', () => {
      // Arrange
      const filtros = { categoria: 'transport' }; // Búsqueda parcial

      // Act
      const resultados = searchTransactions(mockTransactions, filtros);

      // Assert
      expect(resultados).toHaveLength(1);
      expect(resultados[0].categoria?.nombre).toBe('Transporte');
    });

    test('debe filtrar ingresos por tipo_ingreso', () => {
      // Arrange
      const filtros = { categoria: 'Salario' };

      // Act
      const resultados = searchTransactions(mockTransactions, filtros);

      // Assert
      expect(resultados).toHaveLength(1);
      expect(resultados[0].tipo_ingreso).toBe('Salario');
      expect(resultados[0].tipo).toBe('ingreso');
    });
  });

  describe('Filtros por fecha', () => {
    test('debe filtrar transacciones por fecha de inicio', () => {
      // Arrange
      const filtros = { fechaInicio: '2024-02-01' };

      // Act
      const resultados = searchTransactions(mockTransactions, filtros);

      // Assert
      expect(resultados).toHaveLength(2);
      expect(resultados.every(t => new Date(t.fecha) >= new Date('2024-02-01'))).toBe(true);
    });

    test('debe filtrar transacciones por fecha de fin', () => {
      // Arrange
      const filtros = { fechaFin: '2024-01-20' };

      // Act
      const resultados = searchTransactions(mockTransactions, filtros);

      // Assert
      expect(resultados).toHaveLength(3);
      expect(resultados.every(t => new Date(t.fecha) <= new Date('2024-01-20'))).toBe(true);
    });

    test('debe filtrar transacciones por rango de fechas', () => {
      // Arrange
      const filtros = { 
        fechaInicio: '2024-01-16', 
        fechaFin: '2024-02-01' 
      };

      // Act
      const resultados = searchTransactions(mockTransactions, filtros);

      // Assert
      expect(resultados).toHaveLength(2);
      expect(resultados[0].descripcion).toBe('Gasolina carro');
      expect(resultados[1].descripcion).toBe('Salario enero');
    });
  });

  describe('Filtros por descripción', () => {
    test('debe filtrar transacciones por descripción exacta', () => {
      // Arrange
      const filtros = { descripcion: 'Cine con amigos' };

      // Act
      const resultados = searchTransactions(mockTransactions, filtros);

      // Assert
      expect(resultados).toHaveLength(1);
      expect(resultados[0].descripcion).toBe('Cine con amigos');
    });

    test('debe filtrar transacciones por descripción parcial (case insensitive)', () => {
      // Arrange
      const filtros = { descripcion: 'gasolina' };

      // Act
      const resultados = searchTransactions(mockTransactions, filtros);

      // Assert
      expect(resultados).toHaveLength(1);
      expect(resultados[0].descripcion).toBe('Gasolina carro');
    });

    test('debe buscar en múltiples palabras de la descripción', () => {
      // Arrange
      const filtros = { descripcion: 'proyecto' };

      // Act
      const resultados = searchTransactions(mockTransactions, filtros);

      // Assert
      expect(resultados).toHaveLength(1);
      expect(resultados[0].descripcion).toBe('Freelance proyecto');
    });
  });

  describe('Filtros por tipo de transacción', () => {
    test('debe filtrar solo gastos', () => {
      // Arrange
      const filtros = { tipo: 'gasto' as const };

      // Act
      const resultados = searchTransactions(mockTransactions, filtros);

      // Assert
      expect(resultados).toHaveLength(3);
      expect(resultados.every(t => t.tipo === 'gasto')).toBe(true);
    });

    test('debe filtrar solo ingresos', () => {
      // Arrange
      const filtros = { tipo: 'ingreso' as const };

      // Act
      const resultados = searchTransactions(mockTransactions, filtros);

      // Assert
      expect(resultados).toHaveLength(2);
      expect(resultados.every(t => t.tipo === 'ingreso')).toBe(true);
    });

    test('debe mostrar todos los tipos cuando se especifica "todos"', () => {
      // Arrange
      const filtros = { tipo: 'todos' as const };

      // Act
      const resultados = searchTransactions(mockTransactions, filtros);

      // Assert
      expect(resultados).toHaveLength(5);
    });
  });

  describe('Filtros combinados', () => {
    test('debe aplicar múltiples filtros simultáneamente', () => {
      // Arrange
      const filtros = {
        tipo: 'gasto' as const,
        fechaInicio: '2024-01-15',
        fechaFin: '2024-01-31'
      };

      // Act
      const resultados = searchTransactions(mockTransactions, filtros);

      // Assert
      expect(resultados).toHaveLength(2);
      expect(resultados.every(t => t.tipo === 'gasto')).toBe(true);
      expect(resultados.every(t => {
        const fecha = new Date(t.fecha);
        return fecha >= new Date('2024-01-15') && fecha <= new Date('2024-01-31');
      })).toBe(true);
    });

    test('debe combinar categoría y descripción', () => {
      // Arrange
      const filtros = {
        categoria: 'Transporte',
        descripcion: 'carro'
      };

      // Act
      const resultados = searchTransactions(mockTransactions, filtros);

      // Assert
      expect(resultados).toHaveLength(1);
      expect(resultados[0].categoria?.nombre).toBe('Transporte');
      expect(resultados[0].descripcion).toContain('carro');
    });
  });

  describe('Casos de resultado vacío', () => {
    test('debe retornar array vacío cuando no hay coincidencias', () => {
      // Arrange
      const filtros = { categoria: 'Categoría Inexistente' };

      // Act
      const resultados = searchTransactions(mockTransactions, filtros);

      // Assert
      expect(resultados).toHaveLength(0);
      expect(Array.isArray(resultados)).toBe(true);
      
      // Simular mensaje que mostraría la UI
      const mensaje = resultados.length === 0 ? 'No se encontraron resultados' : '';
      expect(mensaje).toBe('No se encontraron resultados');
    });

    test('debe manejar fechas que no existen en los datos', () => {
      // Arrange
      const filtros = { 
        fechaInicio: '2025-01-01',
        fechaFin: '2025-12-31'
      };

      // Act
      const resultados = searchTransactions(mockTransactions, filtros);

      // Assert
      expect(resultados).toHaveLength(0);
    });
  });

  describe('Rendimiento y métricas', () => {
    test('debe ejecutar búsqueda en menos de 2 segundos', () => {
      // Arrange
      const filtros = { descripcion: 'test' };

      // Act
      const { results, time } = measureSearchTime(mockTransactions, filtros);

      // Assert
      expect(time).toBeLessThan(2000); // 2 segundos en milisegundos
    });

    test('debe manejar grandes volúmenes de datos eficientemente', () => {
      // Arrange - Crear dataset grande
      const transaccionesGrandes = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        monto: Math.random() * 1000,
        fecha: `2024-${String(Math.ceil(Math.random() * 12)).padStart(2, '0')}-15`,
        descripcion: `Transacción ${i}`,
        categoria: { id: 1, nombre: 'Test' },
        tipo: 'gasto' as const,
        usuario_id: 1
      }));

      const filtros = { categoria: 'Test' };

      // Act
      const { results, time } = measureSearchTime(transaccionesGrandes, filtros);

      // Assert
      expect(results.length).toBeGreaterThan(0);
      expect(time).toBeLessThan(100); // 100ms para 10k registros
    });
  });

  describe('Validación de entrada', () => {
    test('debe manejar array vacío de transacciones', () => {
      // Arrange
      const transaccionesVacias: Transaction[] = [];
      const filtros = { categoria: 'Test' };

      // Act
      const resultados = searchTransactions(transaccionesVacias, filtros);

      // Assert
      expect(resultados).toHaveLength(0);
      expect(Array.isArray(resultados)).toBe(true);
    });

    test('debe manejar entrada null/undefined', () => {
      // Arrange
      const filtros = { categoria: 'Test' };

      // Act
      const resultados1 = searchTransactions(null as any, filtros);
      const resultados2 = searchTransactions(undefined as any, filtros);

      // Assert
      expect(resultados1).toHaveLength(0);
      expect(resultados2).toHaveLength(0);
      expect(Array.isArray(resultados1)).toBe(true);
      expect(Array.isArray(resultados2)).toBe(true);
    });

    test('debe manejar filtros vacíos', () => {
      // Arrange
      const filtros = {};

      // Act
      const resultados = searchTransactions(mockTransactions, filtros);

      // Assert
      expect(resultados).toHaveLength(5); // Debe devolver todas las transacciones
    });
  });

  describe('Precisión de resultados', () => {
    test('debe devolver resultados que cumplan exactamente con los criterios', () => {
      // Arrange
      const filtros = {
        tipo: 'gasto' as const,
        categoria: 'Alimentación'
      };

      // Act
      const resultados = searchTransactions(mockTransactions, filtros);

      // Assert
      expect(resultados).toHaveLength(1);
      
      // Verificar que TODOS los resultados cumplan TODOS los criterios
      resultados.forEach(resultado => {
        expect(resultado.tipo).toBe('gasto');
        expect(resultado.categoria?.nombre).toBe('Alimentación');
      });
    });

    test('debe mantener consistencia en múltiples ejecuciones', () => {
      // Arrange
      const filtros = { descripcion: 'Supermercado' };

      // Act
      const resultados1 = searchTransactions(mockTransactions, filtros);
      const resultados2 = searchTransactions(mockTransactions, filtros);
      const resultados3 = searchTransactions(mockTransactions, filtros);

      // Assert
      expect(resultados1).toEqual(resultados2);
      expect(resultados2).toEqual(resultados3);
      expect(resultados1.length).toBe(1);
    });
  });
});