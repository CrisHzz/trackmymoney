import { describe, test, expect } from '@jest/globals';
import {
  getTodayLocalDate,
  formatDateForInput,
  getCurrentDateTime,
  parseLocalDate,
  stringToDateForDB,
  formatDisplayDate
} from '../dateUtils';

describe('dateUtils - Pruebas de Caja Blanca', () => {
  
  describe('getTodayLocalDate', () => {
    // Caso positivo: funcionalidad normal
    test('debe devolver la fecha actual en formato YYYY-MM-DD', () => {
      const result = getTodayLocalDate();
      const today = new Date();
      const expected = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      
      expect(result).toBe(expected);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    // Verificar formato específico
    test('debe usar padding de ceros para mes y día', () => {
      const result = getTodayLocalDate();
      const parts = result.split('-');
      
      expect(parts).toHaveLength(3);
      expect(parts[1]).toMatch(/^\d{2}$/); // Mes con 2 dígitos
      expect(parts[2]).toMatch(/^\d{2}$/); // Día con 2 dígitos
    });
  });

  describe('formatDateForInput', () => {
    // Caso positivo: fecha válida
    test('debe formatear fecha válida correctamente', () => {
      const testDate = new Date(2024, 0, 15); // 15 enero 2024
      const result = formatDateForInput(testDate);
      
      expect(result).toBe('2024-01-15');
    });

    // Caso de borde: fecha sin parámetro (usa fecha actual)
    test('debe usar fecha actual cuando no se proporciona parámetro', () => {
      const result = formatDateForInput();
      const today = new Date();
      const expected = formatDateForInput(today);
      
      expect(result).toBe(expected);
    });

    // Caso de borde: primer día del año
    test('debe manejar primer día del año correctamente', () => {
      const testDate = new Date(2024, 0, 1); // 1 enero 2024
      const result = formatDateForInput(testDate);
      
      expect(result).toBe('2024-01-01');
    });

    // Caso de borde: último día del año
    test('debe manejar último día del año correctamente', () => {
      const testDate = new Date(2024, 11, 31); // 31 diciembre 2024
      const result = formatDateForInput(testDate);
      
      expect(result).toBe('2024-12-31');
    });
  });

  describe('getCurrentDateTime', () => {
    // Caso positivo: formato correcto
    test('debe devolver fecha y hora en formato ISO local', () => {
      const result = getCurrentDateTime();
      
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
    });

    // Verificar componentes específicos
    test('debe incluir todos los componentes de fecha y hora', () => {
      const result = getCurrentDateTime();
      const parts = result.split('T');
      const datePart = parts[0];
      const timePart = parts[1];
      
      expect(datePart).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(timePart).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });
  });

  describe('parseLocalDate', () => {
    // Caso positivo: formato válido YYYY-MM-DD
    test('debe parsear fecha válida correctamente', () => {
      const result = parseLocalDate('2024-03-15');
      
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(2); // Marzo es índice 2
      expect(result.getDate()).toBe(15);
    });

    // Caso de borde: fecha con días de un dígito
    test('debe manejar fechas con componentes de un dígito', () => {
      const result = parseLocalDate('2024-01-05');
      
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(0); // Enero
      expect(result.getDate()).toBe(5);
    });

    // Caso negativo: formato inválido
    test('debe manejar formato inválido', () => {
      expect(() => parseLocalDate('invalid-date')).toThrow();
    });

    // Caso de borde: fecha límite
    test('debe manejar fechas límite válidas', () => {
      const feb29 = parseLocalDate('2024-02-29'); // Año bisiesto
      expect(feb29.getFullYear()).toBe(2024);
      expect(feb29.getMonth()).toBe(1);
      expect(feb29.getDate()).toBe(29);
    });
  });

  describe('stringToDateForDB', () => {
    // Caso positivo: conversión correcta
    test('debe convertir string a Date para BD correctamente', () => {
      const result = stringToDateForDB('2024-05-20');
      
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(4); // Mayo es índice 4
      expect(result.getDate()).toBe(20);
    });

    // Verificar hora configurada al mediodía
    test('debe configurar hora al mediodía para evitar problemas de zona horaria', () => {
      const result = stringToDateForDB('2024-05-20');
      
      expect(result.getHours()).toBe(12);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });

    // Caso de borde: primer día del mes
    test('debe manejar primer día del mes', () => {
      const result = stringToDateForDB('2024-06-01');
      
      expect(result.getDate()).toBe(1);
      expect(result.getMonth()).toBe(5); // Junio
    });

    // Caso de borde: último día del mes
    test('debe manejar último día del mes', () => {
      const result = stringToDateForDB('2024-06-30');
      
      expect(result.getDate()).toBe(30);
      expect(result.getMonth()).toBe(5); // Junio
    });

    // Caso negativo: formato inválido
    test('debe manejar formato inválido', () => {
      expect(() => stringToDateForDB('invalid')).toThrow();
    });
  });

  describe('formatDisplayDate', () => {
    // Caso positivo: fecha ISO completa
    test('debe formatear fecha ISO completa correctamente', () => {
      const isoDate = '2024-03-15T10:30:00.000Z';
      const result = formatDisplayDate(isoDate);
      
      expect(result).toContain('marzo');
      expect(result).toContain('2024');
      expect(result).toContain('15');
    });

    // Caso positivo: fecha simple YYYY-MM-DD
    test('debe formatear fecha simple correctamente', () => {
      const simpleDate = '2024-03-15';
      const result = formatDisplayDate(simpleDate);
      
      expect(result).toContain('marzo');
      expect(result).toContain('2024');
      expect(result).toContain('15');
    });

    // Caso negativo: fecha inválida debe devolver string original
    test('debe devolver string original si fecha es inválida', () => {
      const invalidDate = 'fecha-invalida';
      const result = formatDisplayDate(invalidDate);
      
      expect(result).toBe(invalidDate);
    });

    // Caso de borde: fecha vacía
    test('debe manejar string vacío', () => {
      const result = formatDisplayDate('');
      
      expect(result).toBe('');
    });

    // Caso de borde: fecha con formato diferente
    test('debe manejar diferentes formatos de fecha', () => {
      const result = formatDisplayDate('2024/03/15');
      
      // Puede devolver el original o intentar parsearlo
      expect(typeof result).toBe('string');
    });

    // Verificar manejo de errores en bloque try-catch
    test('debe capturar errores y devolver string original', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const invalidInput = { toString: () => { throw new Error('Error test'); } };
      
      const result = formatDisplayDate(invalidInput as any);
      
      expect(result).toBe(invalidInput);
      consoleSpy.mockRestore();
    });

    // Verificar verificación de fecha válida con isNaN
    test('debe verificar si la fecha es válida usando isNaN', () => {
      const mockDate = 'not-a-date';
      const result = formatDisplayDate(mockDate);
      
      expect(result).toBe(mockDate);
    });

    // Caso específico: verificar formato de salida español
    test('debe usar formato español para fechas válidas', () => {
      const result = formatDisplayDate('2024-01-01');
      
      expect(result).toContain('enero');
      expect(result).toContain('2024');
      expect(result).toContain('1');
    });
  });

  // Pruebas de integración entre funciones
  describe('Integración entre funciones', () => {
    test('parseLocalDate y stringToDateForDB deben ser consistentes', () => {
      const dateString = '2024-07-15';
      const parsed = parseLocalDate(dateString);
      const forDB = stringToDateForDB(dateString);
      
      expect(parsed.getFullYear()).toBe(forDB.getFullYear());
      expect(parsed.getMonth()).toBe(forDB.getMonth());
      expect(parsed.getDate()).toBe(forDB.getDate());
    });

    test('formatDateForInput y parseLocalDate deben ser inversos', () => {
      const originalDate = new Date(2024, 6, 20); // 20 julio 2024
      const formatted = formatDateForInput(originalDate);
      const parsed = parseLocalDate(formatted);
      
      expect(originalDate.getFullYear()).toBe(parsed.getFullYear());
      expect(originalDate.getMonth()).toBe(parsed.getMonth());
      expect(originalDate.getDate()).toBe(parsed.getDate());
    });
  });

  // Pruebas de rendimiento y casos límite
  describe('Casos límite y rendimiento', () => {
    test('debe manejar años extremos', () => {
      const farFuture = formatDateForInput(new Date(2099, 11, 31));
      expect(farFuture).toBe('2099-12-31');
      
      const farPast = formatDateForInput(new Date(1900, 0, 1));
      expect(farPast).toBe('1900-01-01');
    });

    test('debe ser rápido para múltiples llamadas', () => {
      const start = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        getTodayLocalDate();
        formatDateForInput();
        getCurrentDateTime();
      }
      
      const end = performance.now();
      expect(end - start).toBeLessThan(100); // Menos de 100ms para 1000 llamadas
    });
  });
}); 