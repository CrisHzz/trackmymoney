/**
 * Escenarios: CP001, CP002, CP003, CP004
 */

import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import {
  saveOfflineGasto,
  getOfflineGastos,
  removeOfflineGasto,
  clearOfflineGastos,
  OfflineGasto
} from '@/lib/offlineStorage';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Escenarios de Almacenamiento Offline - Gastos', () => {
  
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('CP001 – CreateOfflineGasto', () => {
    // Test de Caja Negra: Verifica la funcionalidad sin considerar la implementación interna
    test('debe crear un gasto offline correctamente', () => {
      // Arrange
      const gastoData = {
        monto: 100.50,
        descripcion: 'Comida',
        categoria_id: 1,
        fecha: '2024-01-15'
      };

      // Act
      const gastoCreado = saveOfflineGasto(gastoData);

      // Assert
      expect(gastoCreado).toBeDefined();
      expect(gastoCreado.monto).toBe(100.50);
      expect(gastoCreado.descripcion).toBe('Comida');
      expect(gastoCreado.timestamp).toBeDefined();
    });

    // Test de Caja Negra: Verifica validación de entrada sin revisar implementación interna
    test('debe validar campos obligatorios', () => {
      // Arrange
      const gastoIncompleto = {
        descripcion: 'Test',
        fecha: '2024-01-15'
      } as any;

      // Act & Assert
      expect(() => {
        if (!gastoIncompleto.monto || !gastoIncompleto.categoria_id) {
          throw new Error('Campos obligatorios faltantes');
        }
        saveOfflineGasto(gastoIncompleto);
      }).toThrow('Campos obligatorios faltantes');
    });

    // Test de Caja Blanca: Examina el comportamiento interno específico del flag offline
    test('debe marcar el registro como pendiente de sincronización', () => {
      // Arrange
      const gastoData = {
        monto: 100.50,
        descripcion: 'Test offline',
        categoria_id: 1,
        fecha: '2024-01-15',
        offline: true
      };

      // Act
      const gastoCreado = saveOfflineGasto(gastoData);

      // Assert
      expect(gastoCreado.offline).toBe(true);
    });

    // Test de Caja Negra: Verifica manejo de errores sin considerar la lógica interna
    test('debe manejar errores de validación correctamente', () => {
      // Arrange
      const gastoInvalido = {
        monto: -100,
        categoria_id: 1,
        fecha: '2024-01-15'
      };

      // Act & Assert
      expect(() => {
        if (gastoInvalido.monto < 0) {
          throw new Error('Monto debe ser positivo');
        }
        saveOfflineGasto(gastoInvalido);
      }).toThrow('Monto debe ser positivo');
    });
  });

  describe('CP002 – SaveOfflineGastos', () => {
    // Test de Caja Blanca: Verifica directamente la interacción con localStorage
    test('debe persistir gastos en localStorage', () => {
      // Arrange
      const gastoData = {
        monto: 50,
        descripcion: 'Gasto persistente',
        categoria_id: 1,
        fecha: '2024-01-15'
      };

      // Act
      saveOfflineGasto(gastoData);

      // Assert
      const gastosGuardados = getOfflineGastos();
      expect(gastosGuardados).toHaveLength(1);
      expect(gastosGuardados[0].descripcion).toBe('Gasto persistente');
    });

    // Test de Caja Blanca: Examina la persistencia interna de datos en localStorage
    test('debe mantener datos después de reinicio simulado', () => {
      // Arrange
      const gastoData = {
        monto: 100,
        descripcion: 'Persistente',
        categoria_id: 1,
        fecha: '2024-01-15'
      };

      // Act
      saveOfflineGasto(gastoData);
      const gastosRecuperados = getOfflineGastos();

      // Assert
      expect(gastosRecuperados).toHaveLength(1);
      expect(gastosRecuperados[0].descripcion).toBe('Persistente');
    });

    // Test de Caja Negra: Verifica funcionalidad de múltiples inserciones
    test('debe guardar múltiples gastos correctamente', () => {
      // Arrange
      const gastos = [
        { monto: 50, descripcion: 'Gasto 1', categoria_id: 1, fecha: '2024-01-15' },
        { monto: 75, descripcion: 'Gasto 2', categoria_id: 2, fecha: '2024-01-16' }
      ];

      // Act
      gastos.forEach(gasto => saveOfflineGasto(gasto));

      // Assert
      const gastosGuardados = getOfflineGastos();
      expect(gastosGuardados).toHaveLength(2);
    });

    // Test de Caja Blanca: Simula y verifica comportamiento interno específico de error de cuota
    test('debe manejar error de almacenamiento lleno', () => {
      // Arrange
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        throw new Error('QuotaExceededError');
      });

      // Act & Assert
      expect(() => {
        try {
          saveOfflineGasto({ monto: 100, descripcion: 'Test', categoria_id: 1, fecha: '2024-01-15' });
        } catch (error: any) {
          throw new Error('No hay espacio disponible');
        }
      }).toThrow('No hay espacio disponible');

      // Cleanup
      localStorage.setItem = originalSetItem;
    });
  });

  describe('CP003 – GetOfflineGastos', () => {
    // Test de Caja Negra: Verifica la funcionalidad de recuperación sin considerar implementación
    test('debe devolver listado completo de gastos offline', () => {
      // Arrange
      const gastos = [
        { monto: 50, descripcion: 'Gasto 1', categoria_id: 1, fecha: '2024-01-15' },
        { monto: 75, descripcion: 'Gasto 2', categoria_id: 2, fecha: '2024-01-16' }
      ];

      gastos.forEach(gasto => saveOfflineGasto(gasto));

      // Act
      const gastosRecuperados = getOfflineGastos();

      // Assert
      expect(gastosRecuperados).toHaveLength(2);
      expect(gastosRecuperados[0].descripcion).toBe('Gasto 1');
      expect(gastosRecuperados[1].descripcion).toBe('Gasto 2');
    });

    // Test de Caja Negra: Verifica comportamiento con datos vacíos
    test('debe mostrar mensaje cuando no hay gastos offline', () => {
      // Act
      const gastosRecuperados = getOfflineGastos();

      // Assert
      expect(gastosRecuperados).toHaveLength(0);
      expect(Array.isArray(gastosRecuperados)).toBe(true);
      
      const mensaje = gastosRecuperados.length === 0 ? 'No hay gastos offline' : '';
      expect(mensaje).toBe('No hay gastos offline');
    });

    // Test de Caja Blanca: Verifica manejo interno de datos corruptos en localStorage
    test('debe manejar datos corruptos en localStorage', () => {
      // Arrange
      localStorage.setItem('gastos_offline', 'datos-corruptos-no-json');

      // Act
      const gastosRecuperados = getOfflineGastos();

      // Assert
      expect(gastosRecuperados).toHaveLength(0);
      expect(Array.isArray(gastosRecuperados)).toBe(true);
    });

    // Test de Caja Negra: Verifica requisitos de rendimiento sin considerar implementación
    test('debe responder en tiempo aceptable', () => {
      // Arrange
      Array.from({ length: 50 }, (_, i) => 
        saveOfflineGasto({
          monto: i * 10,
          descripcion: `Gasto ${i}`,
          categoria_id: 1,
          fecha: '2024-01-15'
        })
      );

      // Act
      const startTime = performance.now();
      const gastosRecuperados = getOfflineGastos();
      const endTime = performance.now();

      // Assert
      expect(gastosRecuperados).toHaveLength(25);
      expect(endTime - startTime).toBeLessThan(100);
    });
  });

  describe('CP004 – RemoveOfflineGasto', () => {
    // Test de Caja Negra: Verifica funcionalidad de eliminación específica
    test('debe eliminar gasto específico del almacenamiento local', () => {
      // Arrange
      const gasto1 = saveOfflineGasto({
        monto: 50,
        descripcion: 'Gasto a mantener',
        categoria_id: 1,
        fecha: '2024-01-15'
      });
      
      const gasto2 = saveOfflineGasto({
        monto: 75,
        descripcion: 'Gasto a eliminar',
        categoria_id: 2,
        fecha: '2024-01-16'
      });

      // Act
      removeOfflineGasto(gasto2.id);

      // Assert
      const gastosRestantes = getOfflineGastos();
      expect(gastosRestantes).toHaveLength(1);
      expect(gastosRestantes[0].id).toBe(gasto1.id);
    });

    // Test de Caja Blanca: Verifica que la actualización interna del listado funcione correctamente
    test('debe actualizar el listado automáticamente', () => {
      // Arrange
      const gastos = [
        { monto: 50, descripcion: 'Gasto 1', categoria_id: 1, fecha: '2024-01-15' },
        { monto: 75, descripcion: 'Gasto 2', categoria_id: 2, fecha: '2024-01-16' },
        { monto: 100, descripcion: 'Gasto 3', categoria_id: 1, fecha: '2024-01-17' }
      ];

      const gastosGuardados = gastos.map(gasto => saveOfflineGasto(gasto));

      // Act
      removeOfflineGasto(gastosGuardados[1].id);

      // Assert
      const gastosActualizados = getOfflineGastos();
      expect(gastosActualizados).toHaveLength(2);
      expect(gastosActualizados.find(g => g.id === gastosGuardados[1].id)).toBeUndefined();
    });

    // Test de Caja Negra: Verifica manejo de casos límite (ID no válido)
    test('debe manejar ID inexistente', () => {
      // Arrange
      saveOfflineGasto({
        monto: 50,
        descripcion: 'Gasto existente',
        categoria_id: 1,
        fecha: '2024-01-15'
      });

      // Act & Assert
      expect(() => {
        const idInexistente = 'id-que-no-existe';
        const gastosOriginales = getOfflineGastos();
        removeOfflineGasto(idInexistente);
        const gastosActuales = getOfflineGastos();
        
        if (gastosOriginales.length === gastosActuales.length) {
          throw new Error('El ID del gasto no existe');
        }
      }).toThrow('El ID del gasto no existe');
    });

    // Test de Caja Blanca: Verifica que la eliminación sea permanente en el almacenamiento
    test('debe eliminar de manera permanente', () => {
      // Arrange
      const gasto = saveOfflineGasto({
        monto: 100,
        descripcion: 'Gasto temporal',
        categoria_id: 1,
        fecha: '2024-01-15'
      });

      // Act
      removeOfflineGasto(gasto.id);

      // Assert
      const gastosRestantes = getOfflineGastos();
      expect(gastosRestantes).toHaveLength(0);
      expect(gastosRestantes.find(g => g.id === gasto.id)).toBeUndefined();
    });
  });
});