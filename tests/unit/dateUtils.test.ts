/**
 * Pruebas unitarias para utilidades de fechas
 * 
 * Principios FIRST:
 * - Fast: Sin dependencias de I/O o red
 * - Independent: Cada test aislado sin estado compartido
 * - Repeatable: Usa fechas fijas para resultados consistentes
 * - Self-validating: Assertions automáticas
 * - Timely: Tests creados con el código
 * 
 * Patrón AAA aplicado
 */

import {
  getTodayLocalDate,
  formatDateForInput,
  getCurrentDateTime,
  parseLocalDate,
  stringToDateForDB,
  formatDisplayDate
} from '@/lib/dateUtils';

describe('dateUtils - Utilidades de Fechas', () => {
  
  describe('getTodayLocalDate - Obtener fecha actual', () => {
    it('debe retornar fecha en formato YYYY-MM-DD', () => {
      // Arrange
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

      // Act
      const result = getTodayLocalDate();

      // Assert
      expect(result).toMatch(dateRegex);
      expect(result).toHaveLength(10);
    });

    it('debe retornar una fecha válida parseable', () => {
      // Arrange & Act
      const result = getTodayLocalDate();
      const parsedDate = new Date(result);

      // Assert
      expect(parsedDate).toBeInstanceOf(Date);
      expect(parsedDate.toString()).not.toBe('Invalid Date');
    });
  });

  describe('formatDateForInput - Formatear fecha para input', () => {
    it('debe formatear fecha específica correctamente', () => {
      // Arrange
      const date = new Date(2024, 0, 15); // 15 de enero 2024
      const expectedFormat = '2024-01-15';

      // Act
      const result = formatDateForInput(date);

      // Assert
      expect(result).toBe(expectedFormat);
    });

    it('debe usar fecha actual si no se proporciona', () => {
      // Arrange
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

      // Act
      const result = formatDateForInput();

      // Assert
      expect(result).toMatch(dateRegex);
    });

    it('debe agregar ceros iniciales a mes y día', () => {
      // Arrange
      const date = new Date(2024, 0, 5); // 5 de enero

      // Act
      const result = formatDateForInput(date);

      // Assert
      expect(result).toBe('2024-01-05');
      expect(result).toContain('-01-');
      expect(result).toContain('-05');
    });
  });

  describe('getCurrentDateTime - Obtener fecha y hora actual', () => {
    it('debe retornar fecha y hora en formato ISO', () => {
      // Arrange
      const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;

      // Act
      const result = getCurrentDateTime();

      // Assert
      expect(result).toMatch(dateTimeRegex);
      expect(result).toContain('T');
    });

    it('debe incluir horas, minutos y segundos', () => {
      // Arrange & Act
      const result = getCurrentDateTime();
      const [date, time] = result.split('T');

      // Assert
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(time).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });
  });

  describe('parseLocalDate - Parsear fecha desde string', () => {
    it('debe parsear fecha correctamente', () => {
      // Arrange
      const dateString = '2024-01-15';
      const expectedDate = new Date(2024, 0, 15);

      // Act
      const result = parseLocalDate(dateString);

      // Assert
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(expectedDate.getFullYear());
      expect(result.getMonth()).toBe(expectedDate.getMonth());
      expect(result.getDate()).toBe(expectedDate.getDate());
    });

    it('debe manejar diferentes meses', () => {
      // Arrange
      const dateString = '2024-12-31';

      // Act
      const result = parseLocalDate(dateString);

      // Assert
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(11); // Diciembre es 11 (0-indexed)
      expect(result.getDate()).toBe(31);
    });
  });

  describe('stringToDateForDB - Convertir string a Date para BD', () => {
    it('debe convertir string a Date con hora al mediodía', () => {
      // Arrange
      const dateString = '2024-01-15';

      // Act
      const result = stringToDateForDB(dateString);

      // Assert
      expect(result).toBeInstanceOf(Date);
      expect(result.getHours()).toBe(12);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
    });

    it('debe mantener la fecha correcta sin cambios de zona horaria', () => {
      // Arrange
      const dateString = '2024-12-31';

      // Act
      const result = stringToDateForDB(dateString);

      // Assert
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(11);
      expect(result.getDate()).toBe(31);
    });
  });

  describe('formatDisplayDate - Formatear fecha para visualización', () => {
    it('debe formatear fecha simple YYYY-MM-DD', () => {
      // Arrange
      const dateString = '2024-01-15';

      // Act
      const result = formatDisplayDate(dateString);

      // Assert
      expect(result).toBeTruthy();
      expect(result).not.toBe(dateString); // Debe estar formateada
      expect(result).toContain('2024');
    });

    it('debe manejar fechas ISO completas', () => {
      // Arrange
      const isoDate = '2024-01-15T12:00:00.000Z';

      // Act
      const result = formatDisplayDate(isoDate);

      // Assert
      expect(result).toBeTruthy();
      expect(result).toContain('2024');
    });

    it('debe retornar string original para fechas inválidas', () => {
      // Arrange
      const invalidDate = 'fecha-invalida';

      // Act
      const result = formatDisplayDate(invalidDate);

      // Assert
      expect(result).toBe(invalidDate);
    });

    it('debe manejar errores sin lanzar excepciones', () => {
      // Arrange
      const malformedDate = 'not-a-date';

      // Act & Assert
      expect(() => formatDisplayDate(malformedDate)).not.toThrow();
    });
  });
});

