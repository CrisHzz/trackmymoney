/**
 * Pruebas unitarias para utilidades de strings
 * 
 * Principios FIRST:
 * - Fast: Operaciones de string rápidas
 * - Independent: Tests sin dependencias externas
 * - Repeatable: Resultados consistentes
 * - Self-validating: Assertions claras
 * - Timely: Tests junto al código
 * 
 * Patrón AAA aplicado
 */

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
      // Arrange
      const input = 'hello world';
      const expected = 'Hello world';

      // Act
      const result = capitalize(input);

      // Assert
      expect(result).toBe(expected);
      expect(result[0]).toBe('H');
    });

    it('debe convertir el resto a minúsculas', () => {
      // Arrange
      const input = 'HELLO WORLD';
      const expected = 'Hello world';

      // Act
      const result = capitalize(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('debe retornar string vacío para input vacío', () => {
      // Arrange
      const input = '';

      // Act
      const result = capitalize(input);

      // Assert
      expect(result).toBe('');
    });
  });

  describe('truncate - Truncar texto', () => {
    it('debe truncar texto largo y agregar puntos suspensivos', () => {
      // Arrange
      const longText = 'Este es un texto muy largo que necesita ser truncado';
      const maxLength = 20;

      // Act
      const result = truncate(longText, maxLength);

      // Assert
      expect(result).toHaveLength(maxLength + 3); // +3 por los '...'
      expect(result).toContain('...');
      expect(result).toMatch(/^Este es un texto ve\.\.\.$/);
    });

    it('no debe truncar texto más corto que el límite', () => {
      // Arrange
      const shortText = 'Texto corto';
      const maxLength = 20;

      // Act
      const result = truncate(shortText, maxLength);

      // Assert
      expect(result).toBe(shortText);
      expect(result).not.toContain('...');
    });

    it('debe manejar texto exactamente del tamaño límite', () => {
      // Arrange
      const text = '12345678901234567890';
      const maxLength = 20;

      // Act
      const result = truncate(text, maxLength);

      // Assert
      expect(result).toBe(text);
    });
  });

  describe('removeSpaces - Remover espacios', () => {
    it('debe remover todos los espacios', () => {
      // Arrange
      const input = 'hello world with spaces';
      const expected = 'helloworldwithspaces';

      // Act
      const result = removeSpaces(input);

      // Assert
      expect(result).toBe(expected);
      expect(result).not.toContain(' ');
    });

    it('debe manejar strings sin espacios', () => {
      // Arrange
      const input = 'nospaces';

      // Act
      const result = removeSpaces(input);

      // Assert
      expect(result).toBe(input);
    });

    it('debe limitar longitud para prevenir ataques', () => {
      // Arrange
      const veryLongString = 'a '.repeat(10000);

      // Act
      const result = removeSpaces(veryLongString);

      // Assert
      expect(result.length).toBeLessThanOrEqual(10000);
    });
  });

  describe('isEmail - Validar email', () => {
    it('debe validar emails correctos', () => {
      // Arrange
      const validEmails = [
        'test@example.com',
        'user.name@domain.co',
        'user+tag@example.com'
      ];

      // Act & Assert
      validEmails.forEach(email => {
        expect(isEmail(email)).toBe(true);
      });
    });

    it('debe rechazar emails inválidos', () => {
      // Arrange
      const invalidEmails = [
        'not-an-email',
        '@example.com',
        'user@',
        'user @example.com',
        ''
      ];

      // Act & Assert
      invalidEmails.forEach(email => {
        expect(isEmail(email)).toBe(false);
      });
    });

    it('debe rechazar emails muy largos para prevenir ReDoS', () => {
      // Arrange
      const veryLongEmail = 'a'.repeat(300) + '@example.com';

      // Act
      const result = isEmail(veryLongEmail);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('formatCurrency - Formatear moneda', () => {
    it('debe formatear cantidad en USD por defecto', () => {
      // Arrange
      const amount = 1234.56;

      // Act
      const result = formatCurrency(amount);

      // Assert
      expect(result).toContain('$');
      expect(result).toContain('1,234.56');
    });

    it('debe formatear en diferentes monedas', () => {
      // Arrange
      const amount = 1000;
      const currency = 'EUR';

      // Act
      const result = formatCurrency(amount, currency);

      // Assert
      expect(result).toContain('1,000');
    });

    it('debe manejar cantidades negativas', () => {
      // Arrange
      const amount = -500;

      // Act
      const result = formatCurrency(amount);

      // Assert
      expect(result).toContain('-');
      expect(result).toContain('500');
    });
  });

  describe('slugify - Convertir a slug', () => {
    it('debe convertir texto a slug válido', () => {
      // Arrange
      const text = 'Hello World Test';
      const expected = 'hello-world-test';

      // Act
      const result = slugify(text);

      // Assert
      expect(result).toBe(expected);
      expect(result).toMatch(/^[a-z0-9-]+$/);
    });

    it('debe remover caracteres especiales', () => {
      // Arrange
      const text = 'Hello@World#Test!';
      const expected = 'helloworldtest';

      // Act
      const result = slugify(text);

      // Assert
      expect(result).toBe(expected);
    });

    it('debe remover guiones al inicio y final', () => {
      // Arrange
      const text = '  Hello World  ';
      
      // Act
      const result = slugify(text);

      // Assert
      expect(result).not.toMatch(/^-/);
      expect(result).not.toMatch(/-$/);
    });

    it('debe limitar longitud para prevenir ataques', () => {
      // Arrange
      const veryLongText = 'a'.repeat(500);

      // Act
      const result = slugify(veryLongText);

      // Assert
      expect(result.length).toBeLessThanOrEqual(200);
    });
  });

  describe('isEmpty - Verificar si string está vacío', () => {
    it('debe retornar true para string vacío', () => {
      // Arrange
      const emptyString = '';

      // Act
      const result = isEmpty(emptyString);

      // Assert
      expect(result).toBe(true);
      expect(result).toBeTruthy();
    });

    it('debe retornar true para string solo con espacios', () => {
      // Arrange
      const spacesString = '   ';

      // Act
      const result = isEmpty(spacesString);

      // Assert
      expect(result).toBe(true);
    });

    it('debe retornar false para string con contenido', () => {
      // Arrange
      const nonEmptyString = 'Hello';

      // Act
      const result = isEmpty(nonEmptyString);

      // Assert
      expect(result).toBe(false);
      expect(result).toBeFalsy();
    });
  });

  describe('isNotEmpty - Verificar si string no está vacío', () => {
    it('debe retornar false para string vacío', () => {
      // Arrange
      const emptyString = '';

      // Act
      const result = isNotEmpty(emptyString);

      // Assert
      expect(result).toBe(false);
    });

    it('debe retornar true para string con contenido', () => {
      // Arrange
      const nonEmptyString = 'Hello';

      // Act
      const result = isNotEmpty(nonEmptyString);

      // Assert
      expect(result).toBe(true);
      expect(result).toBeTruthy();
    });
  });
});

