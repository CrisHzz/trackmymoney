import {
  capitalize,
  truncate,
  removeSpaces,
  isEmail,
  formatCurrency,
  slugify,
  isEmpty,
  isNotEmpty
} from '@/lib/stringUtils';
describe('stringUtils - Utilidades de Strings', () => {
  describe('capitalize - Capitalizar primera letra', () => {
    it('debe capitalizar la primera letra', () => {
      const input = 'hello world';
      const expected = 'Hello world';
      const result = capitalize(input);
      expect(result).toBe(expected);
      expect(result[0]).toBe('H');
    });
    it('debe convertir el resto a minúsculas', () => {
      const input = 'HELLO WORLD';
      const expected = 'Hello world';
      const result = capitalize(input);
      expect(result).toBe(expected);
    });
    it('debe retornar string vacío para input vacío', () => {
      const input = '';
      const result = capitalize(input);
      expect(result).toBe('');
    });
  });
  describe('truncate - Truncar texto', () => {
    it('debe truncar texto largo y agregar puntos suspensivos', () => {
      const longText = 'Este es un texto muy largo que necesita ser truncado';
      const maxLength = 20;
      const result = truncate(longText, maxLength);
      expect(result).toHaveLength(maxLength + 3);
      expect(result).toContain('...');
      expect(result).toMatch(/^Este es un texto ve\.\.\.$/);
    });
    it('no debe truncar texto más corto que el límite', () => {
      const shortText = 'Texto corto';
      const maxLength = 20;
      const result = truncate(shortText, maxLength);
      expect(result).toBe(shortText);
      expect(result).not.toContain('...');
    });
    it('debe manejar texto exactamente del tamaño límite', () => {
      const text = '12345678901234567890';
      const maxLength = 20;
      const result = truncate(text, maxLength);
      expect(result).toBe(text);
    });
  });
  describe('removeSpaces - Remover espacios', () => {
    it('debe remover todos los espacios', () => {
      const input = 'hello world with spaces';
      const expected = 'helloworldwithspaces';
      const result = removeSpaces(input);
      expect(result).toBe(expected);
      expect(result).not.toContain(' ');
    });
    it('debe manejar strings sin espacios', () => {
      const input = 'nospaces';
      const result = removeSpaces(input);
      expect(result).toBe(input);
    });
    it('debe limitar longitud para prevenir ataques', () => {
      const veryLongString = 'a '.repeat(10000);
      const result = removeSpaces(veryLongString);
      expect(result.length).toBeLessThanOrEqual(10000);
    });
  });
  describe('isEmail - Validar email', () => {
    it('debe validar emails correctos', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co',
        'user+tag@example.com'
      ];
      validEmails.forEach(email => {
        expect(isEmail(email)).toBe(true);
      });
    });
    it('debe rechazar emails inválidos', () => {
      const invalidEmails = [
        'not-an-email',
        '@example.com',
        'user@',
        'user @example.com',
        ''
      ];
      invalidEmails.forEach(email => {
        expect(isEmail(email)).toBe(false);
      });
    });
    it('debe rechazar emails muy largos para prevenir ReDoS', () => {
      const veryLongEmail = 'a'.repeat(300) + '@example.com';
      const result = isEmail(veryLongEmail);
      expect(result).toBe(false);
    });
  });
  describe('formatCurrency - Formatear moneda', () => {
    it('debe formatear cantidad en USD por defecto', () => {
      const amount = 1234.56;
      const result = formatCurrency(amount);
      expect(result).toContain('$');
      expect(result).toContain('1,234.56');
    });
    it('debe formatear en diferentes monedas', () => {
      const amount = 1000;
      const currency = 'EUR';
      const result = formatCurrency(amount, currency);
      expect(result).toContain('1,000');
    });
    it('debe manejar cantidades negativas', () => {
      const amount = -500;
      const result = formatCurrency(amount);
      expect(result).toContain('-');
      expect(result).toContain('500');
    });
  });
  describe('slugify - Convertir a slug', () => {
    it('debe convertir texto a slug válido', () => {
      const text = 'Hello World Test';
      const expected = 'hello-world-test';
      const result = slugify(text);
      expect(result).toBe(expected);
      expect(result).toMatch(/^[a-z0-9-]+$/);
    });
    it('debe remover caracteres especiales', () => {
      const text = 'Hello@World#Test!';
      const expected = 'helloworldtest';
      const result = slugify(text);
      expect(result).toBe(expected);
    });
    it('debe remover guiones al inicio y final', () => {
      const text = '  Hello World  ';
      const result = slugify(text);
      expect(result).not.toMatch(/^-/);
      expect(result).not.toMatch(/-$/);
    });
    it('debe limitar longitud para prevenir ataques', () => {
      const veryLongText = 'a'.repeat(500);
      const result = slugify(veryLongText);
      expect(result.length).toBeLessThanOrEqual(200);
    });
  });
  describe('isEmpty - Verificar si string está vacío', () => {
    it('debe retornar true para string vacío', () => {
      const emptyString = '';
      const result = isEmpty(emptyString);
      expect(result).toBe(true);
      expect(result).toBeTruthy();
    });
    it('debe retornar true para string solo con espacios', () => {
      const spacesString = '   ';
      const result = isEmpty(spacesString);
      expect(result).toBe(true);
    });
    it('debe retornar false para string con contenido', () => {
      const nonEmptyString = 'Hello';
      const result = isEmpty(nonEmptyString);
      expect(result).toBe(false);
      expect(result).toBeFalsy();
    });
  });
  describe('isNotEmpty - Verificar si string no está vacío', () => {
    it('debe retornar false para string vacío', () => {
      const emptyString = '';
      const result = isNotEmpty(emptyString);
      expect(result).toBe(false);
    });
    it('debe retornar true para string con contenido', () => {
      const nonEmptyString = 'Hello';
      const result = isNotEmpty(nonEmptyString);
      expect(result).toBe(true);
      expect(result).toBeTruthy();
    });
  });
});
