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
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      const result = getTodayLocalDate();
      expect(result).toMatch(dateRegex);
      expect(result).toHaveLength(10);
    });
    it('debe retornar una fecha válida parseable', () => {
      const result = getTodayLocalDate();
      const parsedDate = new Date(result);
      expect(parsedDate).toBeInstanceOf(Date);
      expect(parsedDate.toString()).not.toBe('Invalid Date');
    });
  });
  describe('formatDateForInput - Formatear fecha para input', () => {
    it('debe formatear fecha específica correctamente', () => {
      const date = new Date(2024, 0, 15);
      const expectedFormat = '2024-01-15';
      const result = formatDateForInput(date);
      expect(result).toBe(expectedFormat);
    });
    it('debe usar fecha actual si no se proporciona', () => {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      const result = formatDateForInput();
      expect(result).toMatch(dateRegex);
    });
    it('debe agregar ceros iniciales a mes y día', () => {
      const date = new Date(2024, 0, 5);
      const result = formatDateForInput(date);
      expect(result).toBe('2024-01-05');
      expect(result).toContain('-01-');
      expect(result).toContain('-05');
    });
  });
  describe('getCurrentDateTime - Obtener fecha y hora actual', () => {
    it('debe retornar fecha y hora en formato ISO', () => {
      const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
      const result = getCurrentDateTime();
      expect(result).toMatch(dateTimeRegex);
      expect(result).toContain('T');
    });
    it('debe incluir horas, minutos y segundos', () => {
      const result = getCurrentDateTime();
      const [date, time] = result.split('T');
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(time).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });
  });
  describe('parseLocalDate - Parsear fecha desde string', () => {
    it('debe parsear fecha correctamente', () => {
      const dateString = '2024-01-15';
      const expectedDate = new Date(2024, 0, 15);
      const result = parseLocalDate(dateString);
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(expectedDate.getFullYear());
      expect(result.getMonth()).toBe(expectedDate.getMonth());
      expect(result.getDate()).toBe(expectedDate.getDate());
    });
    it('debe manejar diferentes meses', () => {
      const dateString = '2024-12-31';
      const result = parseLocalDate(dateString);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(11);
      expect(result.getDate()).toBe(31);
    });
  });
  describe('stringToDateForDB - Convertir string a Date para BD', () => {
    it('debe convertir string a Date con hora al mediodía', () => {
      const dateString = '2024-01-15';
      const result = stringToDateForDB(dateString);
      expect(result).toBeInstanceOf(Date);
      expect(result.getHours()).toBe(12);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
    });
    it('debe mantener la fecha correcta sin cambios de zona horaria', () => {
      const dateString = '2024-12-31';
      const result = stringToDateForDB(dateString);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(11);
      expect(result.getDate()).toBe(31);
    });
  });
  describe('formatDisplayDate - Formatear fecha para visualización', () => {
    it('debe formatear fecha simple YYYY-MM-DD', () => {
      const dateString = '2024-01-15';
      const result = formatDisplayDate(dateString);
      expect(result).toBeTruthy();
      expect(result).not.toBe(dateString);
      expect(result).toContain('2024');
    });
    it('debe manejar fechas ISO completas', () => {
      const isoDate = '2024-01-15T12:00:00.000Z';
      const result = formatDisplayDate(isoDate);
      expect(result).toBeTruthy();
      expect(result).toContain('2024');
    });
    it('debe retornar string original para fechas inválidas', () => {
      const invalidDate = 'fecha-invalida';
      const result = formatDisplayDate(invalidDate);
      expect(result).toBe(invalidDate);
    });
    it('debe manejar errores sin lanzar excepciones', () => {
      const malformedDate = 'not-a-date';
      expect(() => formatDisplayDate(malformedDate)).not.toThrow();
    });
  });
});
