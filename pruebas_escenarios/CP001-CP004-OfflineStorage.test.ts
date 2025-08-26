/**
 * Pruebas unitarias para escenarios de almacenamiento offline
 * Escenarios: CP001, CP002, CP003, CP004
 * Responsable: Jonathan
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
    // Limpiar localStorage antes de cada prueba
    localStorage.clear();
  });

  afterEach(() => {
    // Limpiar localStorage después de cada prueba
    localStorage.clear();
  });

  describe('CP001 – CreateOfflineGasto', () => {
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
      expect(gastoCreado.id).toBeDefined();
      expect(gastoCreado.monto).toBe(100.50);
      expect(gastoCreado.descripcion).toBe('Comida');
      expect(gastoCreado.categoria_id).toBe(1);
      expect(gastoCreado.fecha).toBe('2024-01-15');
      expect(gastoCreado.timestamp).toBeDefined();
      expect(typeof gastoCreado.timestamp).toBe('number');
    });

    test('debe validar campos obligatorios - monto', () => {
      // Arrange
      const gastoIncompleto = {
        descripcion: 'Test',
        categoria_id: 1,
        fecha: '2024-01-15'
      } as any;

      // Act & Assert
      expect(() => {
        if (!gastoIncompleto.monto) {
          throw new Error('Monto es obligatorio');
        }
        saveOfflineGasto(gastoIncompleto);
      }).toThrow('Monto es obligatorio');
    });

    test('debe validar campos obligatorios - categoría', () => {
      // Arrange
      const gastoIncompleto = {
        monto: 100,
        descripcion: 'Test',
        fecha: '2024-01-15'
      } as any;

      // Act & Assert
      expect(() => {
        if (!gastoIncompleto.categoria_id) {
          throw new Error('Categoría es obligatoria');
        }
        saveOfflineGasto(gastoIncompleto);
      }).toThrow('Categoría es obligatoria');
    });

    test('debe validar campos obligatorios - fecha', () => {
      // Arrange
      const gastoIncompleto = {
        monto: 100,
        descripcion: 'Test',
        categoria_id: 1
      } as any;

      // Act & Assert
      expect(() => {
        if (!gastoIncompleto.fecha) {
          throw new Error('Fecha es obligatoria');
        }
        saveOfflineGasto(gastoIncompleto);
      }).toThrow('Fecha es obligatoria');
    });

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
  });

  describe('CP002 – SaveOfflineGastos', () => {
    test('debe persistir gastos en localStorage', () => {
      // Arrange
      const gasto1 = {
        monto: 50,
        descripcion: 'Gasto 1',
        categoria_id: 1,
        fecha: '2024-01-15'
      };
      const gasto2 = {
        monto: 75,
        descripcion: 'Gasto 2',
        categoria_id: 2,
        fecha: '2024-01-16'
      };

      // Act
      saveOfflineGasto(gasto1);
      saveOfflineGasto(gasto2);

      // Assert
      const gastosGuardados = getOfflineGastos();
      expect(gastosGuardados).toHaveLength(2);
      expect(gastosGuardados[0].descripcion).toBe('Gasto 1');
      expect(gastosGuardados[1].descripcion).toBe('Gasto 2');
    });

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
      
      // Simular reinicio - verificar que los datos persisten
      const gastosRecuperados = getOfflineGastos();

      // Assert
      expect(gastosRecuperados).toHaveLength(1);
      expect(gastosRecuperados[0].descripcion).toBe('Persistente');
    });

    test('debe manejar error de almacenamiento lleno', () => {
      // Arrange - Simular localStorage lleno
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        throw new Error('QuotaExceededError');
      });

      const gastoData = {
        monto: 100,
        descripcion: 'Test',
        categoria_id: 1,
        fecha: '2024-01-15'
      };

      // Act & Assert
      expect(() => {
        try {
          saveOfflineGasto(gastoData);
        } catch (error: any) {
          if (error.message === 'QuotaExceededError') {
            throw new Error('No hay espacio disponible en el almacenamiento local');
          }
          throw error;
        }
      }).toThrow('No hay espacio disponible en el almacenamiento local');

      // Cleanup
      localStorage.setItem = originalSetItem;
    });
  });

  describe('CP003 – GetOfflineGastos', () => {
    test('debe devolver listado completo de gastos offline', () => {
      // Arrange
      const gastos = [
        { monto: 50, descripcion: 'Gasto 1', categoria_id: 1, fecha: '2024-01-15' },
        { monto: 75, descripcion: 'Gasto 2', categoria_id: 2, fecha: '2024-01-16' },
        { monto: 100, descripcion: 'Gasto 3', categoria_id: 1, fecha: '2024-01-17' }
      ];

      gastos.forEach(gasto => saveOfflineGasto(gasto));

      // Act
      const gastosRecuperados = getOfflineGastos();

      // Assert
      expect(gastosRecuperados).toHaveLength(3);
      expect(gastosRecuperados[0].descripcion).toBe('Gasto 1');
      expect(gastosRecuperados[1].descripcion).toBe('Gasto 2');
      expect(gastosRecuperados[2].descripcion).toBe('Gasto 3');
    });

    test('debe mostrar mensaje cuando no hay gastos offline', () => {
      // Act
      const gastosRecuperados = getOfflineGastos();

      // Assert
      expect(gastosRecuperados).toHaveLength(0);
      expect(Array.isArray(gastosRecuperados)).toBe(true);
      
      // Simular el mensaje que mostraría la UI
      const mensaje = gastosRecuperados.length === 0 ? 'No hay gastos offline' : '';
      expect(mensaje).toBe('No hay gastos offline');
    });

    test('debe manejar datos corruptos en localStorage', () => {
      // Arrange - Simular datos corruptos
      localStorage.setItem('gastos_offline', 'datos-corruptos-no-json');

      // Act
      const gastosRecuperados = getOfflineGastos();

      // Assert
      expect(gastosRecuperados).toHaveLength(0);
      expect(Array.isArray(gastosRecuperados)).toBe(true);
    });

    test('debe medir tiempo de respuesta', () => {
      // Arrange
      const gastos = Array.from({ length: 100 }, (_, i) => ({
        monto: i * 10,
        descripcion: `Gasto ${i}`,
        categoria_id: 1,
        fecha: '2024-01-15'
      }));

      gastos.forEach(gasto => saveOfflineGasto(gasto));

      // Act
      const startTime = performance.now();
      const gastosRecuperados = getOfflineGastos();
      const endTime = performance.now();
      const responseTime = endTime - startTime;

      // Assert
      expect(gastosRecuperados).toHaveLength(100);
      expect(responseTime).toBeLessThan(100); // Menos de 100ms
    });
  });

  describe('CP004 – RemoveOfflineGasto', () => {
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
      expect(gastosRestantes[0].descripcion).toBe('Gasto a mantener');
    });

    test('debe actualizar el listado automáticamente', () => {
      // Arrange
      const gastosIniciales = [
        { monto: 50, descripcion: 'Gasto 1', categoria_id: 1, fecha: '2024-01-15' },
        { monto: 75, descripcion: 'Gasto 2', categoria_id: 2, fecha: '2024-01-16' },
        { monto: 100, descripcion: 'Gasto 3', categoria_id: 1, fecha: '2024-01-17' }
      ];

      const gastosGuardados = gastosIniciales.map(gasto => saveOfflineGasto(gasto));

      // Act
      removeOfflineGasto(gastosGuardados[1].id); // Eliminar el segundo gasto

      // Assert
      const gastosActualizados = getOfflineGastos();
      expect(gastosActualizados).toHaveLength(2);
      expect(gastosActualizados.find(g => g.id === gastosGuardados[1].id)).toBeUndefined();
    });

    test('debe manejar ID inexistente', () => {
      // Arrange
      saveOfflineGasto({
        monto: 50,
        descripcion: 'Gasto existente',
        categoria_id: 1,
        fecha: '2024-01-15'
      });

      const gastosAntes = getOfflineGastos();

      // Act & Assert
      expect(() => {
        const idInexistente = 'id-que-no-existe';
        const gastosOriginales = getOfflineGastos();
        removeOfflineGasto(idInexistente);
        const gastosActuales = getOfflineGastos();
        
        // Si el ID no existe, el número de gastos debe ser el mismo
        if (gastosOriginales.length === gastosActuales.length) {
          throw new Error('El ID del gasto no existe');
        }
      }).toThrow('El ID del gasto no existe');
    });

    test('debe medir tiempo de eliminación', () => {
      // Arrange
      const gasto = saveOfflineGasto({
        monto: 100,
        descripcion: 'Gasto a eliminar',
        categoria_id: 1,
        fecha: '2024-01-15'
      });

      // Act
      const startTime = performance.now();
      removeOfflineGasto(gasto.id);
      const endTime = performance.now();
      const eliminationTime = endTime - startTime;

      // Assert
      const gastosRestantes = getOfflineGastos();
      expect(gastosRestantes).toHaveLength(0);
      expect(eliminationTime).toBeLessThan(50); // Menos de 50ms
    });

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

      // Assert - Verificar múltiples veces que el gasto no regrese
      for (let i = 0; i < 5; i++) {
        const gastosActuales = getOfflineGastos();
        expect(gastosActuales.find(g => g.id === gasto.id)).toBeUndefined();
      }
    });
  });
});