/**
 * Pruebas unitarias para utilidades matemáticas
 * 
 * Principios FIRST aplicados:
 * - Fast: Pruebas rápidas sin dependencias externas
 * - Independent: Cada test es independiente y puede ejecutarse solo
 * - Repeatable: Resultados consistentes en cualquier entorno
 * - Self-validating: Pasan o fallan automáticamente
 * - Timely: Creadas junto con la funcionalidad
 * 
 * Patrón AAA (Arrange-Act-Assert) aplicado en todos los tests
 */

import {
  add,
  subtract,
  multiply,
  divide,
  percentage,
  round,
  isPositive,
  isNegative,
  isZero,
  clamp
} from '@/lib/mathUtils';

describe('mathUtils - Operaciones Matemáticas', () => {
  
  describe('add - Suma de números', () => {
    it('debe sumar dos números positivos correctamente', () => {
      // Arrange (Preparar)
      const num1 = 2;
      const num2 = 3;
      const expectedResult = 5;

      // Act (Actuar)
      const result = add(num1, num2);

      // Assert (Verificar)
      expect(result).toBe(expectedResult);
      expect(result).toBeGreaterThan(0);
    });

    it('debe sumar números positivos y negativos correctamente', () => {
      // Arrange
      const num1 = 5;
      const num2 = -3;
      const expectedResult = 2;

      // Act
      const result = add(num1, num2);

      // Assert (con fluent assertions)
      expect(result).toBe(expectedResult);
      expect(result).toBeGreaterThan(0);
    });

    it('debe manejar suma con cero', () => {
      // Arrange
      const num1 = 10;
      const num2 = 0;

      // Act
      const result = add(num1, num2);

      // Assert
      expect(result).toBe(num1);
    });
  });

  describe('subtract - Resta de números', () => {
    it('debe restar dos números correctamente', () => {
      // Arrange
      const minuend = 5;
      const subtrahend = 3;
      const expectedResult = 2;

      // Act
      const result = subtract(minuend, subtrahend);

      // Assert
      expect(result).toBe(expectedResult);
      expect(result).toBeGreaterThan(0);
    });

    it('debe manejar resultados negativos correctamente', () => {
      // Arrange
      const minuend = 3;
      const subtrahend = 5;
      const expectedResult = -2;

      // Act
      const result = subtract(minuend, subtrahend);

      // Assert
      expect(result).toBe(expectedResult);
      expect(result).toBeLessThan(0);
    });

    it('debe retornar cero cuando los números son iguales', () => {
      // Arrange
      const num = 10;

      // Act
      const result = subtract(num, num);

      // Assert
      expect(result).toBe(0);
    });
  });

  describe('multiply - Multiplicación de números', () => {
    it('debe multiplicar dos números positivos', () => {
      // Arrange
      const factor1 = 4;
      const factor2 = 5;
      const expectedResult = 20;

      // Act
      const result = multiply(factor1, factor2);

      // Assert
      expect(result).toBe(expectedResult);
    });

    it('debe manejar multiplicación por cero', () => {
      // Arrange
      const num = 5;
      const zero = 0;

      // Act
      const result = multiply(num, zero);

      // Assert
      expect(result).toBe(0);
    });

    it('debe manejar multiplicación de números negativos', () => {
      // Arrange
      const factor1 = -3;
      const factor2 = 4;
      const expectedResult = -12;

      // Act
      const result = multiply(factor1, factor2);

      // Assert
      expect(result).toBe(expectedResult);
      expect(result).toBeLessThan(0);
    });
  });

  describe('divide - División de números', () => {
    it('debe dividir dos números correctamente', () => {
      // Arrange
      const dividend = 10;
      const divisor = 2;
      const expectedResult = 5;

      // Act
      const result = divide(dividend, divisor);

      // Assert
      expect(result).toBe(expectedResult);
    });

    it('debe lanzar error al dividir por cero', () => {
      // Arrange
      const dividend = 10;
      const divisor = 0;
      const expectedError = 'División por cero no permitida';

      // Act & Assert (combinados para excepciones)
      expect(() => divide(dividend, divisor)).toThrow(expectedError);
    });

    it('debe manejar división con resultado decimal', () => {
      // Arrange
      const dividend = 10;
      const divisor = 3;

      // Act
      const result = divide(dividend, divisor);

      // Assert (usando toBeCloseTo para números decimales)
      expect(result).toBeCloseTo(3.333, 2);
    });
  });

  describe('percentage - Cálculo de porcentajes', () => {
    it('debe calcular porcentaje correctamente', () => {
      // Arrange
      const value = 25;
      const total = 100;
      const expectedPercentage = 25;

      // Act
      const result = percentage(value, total);

      // Assert
      expect(result).toBe(expectedPercentage);
    });

    it('debe retornar 0 cuando el total es cero', () => {
      // Arrange
      const value = 10;
      const total = 0;

      // Act
      const result = percentage(value, total);

      // Assert
      expect(result).toBe(0);
    });

    it('debe calcular porcentajes mayores a 100', () => {
      // Arrange
      const value = 150;
      const total = 100;
      const expectedPercentage = 150;

      // Act
      const result = percentage(value, total);

      // Assert
      expect(result).toBe(expectedPercentage);
      expect(result).toBeGreaterThan(100);
    });
  });

  describe('round - Redondeo de números', () => {
    it('debe redondear a 2 decimales por defecto', () => {
      // Arrange
      const num = 3.14159;
      const expectedResult = 3.14;

      // Act
      const result = round(num);

      // Assert
      expect(result).toBe(expectedResult);
    });

    it('debe redondear al número de decimales especificado', () => {
      // Arrange
      const num = 3.14159;
      const decimals = 3;
      const expectedResult = 3.142;

      // Act
      const result = round(num, decimals);

      // Assert
      expect(result).toBe(expectedResult);
    });

    it('debe redondear números enteros sin cambios', () => {
      // Arrange
      const num = 5;

      // Act
      const result = round(num);

      // Assert
      expect(result).toBe(num);
    });
  });

  describe('isPositive - Verificación de números positivos', () => {
    it('debe retornar true para números positivos', () => {
      // Arrange
      const positiveNum = 5;

      // Act
      const result = isPositive(positiveNum);

      // Assert
      expect(result).toBe(true);
      expect(result).toBeTruthy();
    });

    it('debe retornar false para cero', () => {
      // Arrange
      const zero = 0;

      // Act
      const result = isPositive(zero);

      // Assert
      expect(result).toBe(false);
      expect(result).toBeFalsy();
    });

    it('debe retornar false para números negativos', () => {
      // Arrange
      const negativeNum = -1;

      // Act
      const result = isPositive(negativeNum);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('isNegative - Verificación de números negativos', () => {
    it('debe retornar true para números negativos', () => {
      // Arrange
      const negativeNum = -5;

      // Act
      const result = isNegative(negativeNum);

      // Assert
      expect(result).toBe(true);
    });

    it('debe retornar false para cero y positivos', () => {
      // Arrange
      const zero = 0;
      const positiveNum = 1;

      // Act
      const resultZero = isNegative(zero);
      const resultPositive = isNegative(positiveNum);

      // Assert
      expect(resultZero).toBe(false);
      expect(resultPositive).toBe(false);
    });
  });

  describe('isZero - Verificación de cero', () => {
    it('debe retornar true para cero', () => {
      // Arrange
      const zero = 0;

      // Act
      const result = isZero(zero);

      // Assert
      expect(result).toBe(true);
      expect(result).toBeTruthy();
    });

    it('debe retornar false para números no-cero', () => {
      // Arrange
      const positiveNum = 1;
      const negativeNum = -1;

      // Act
      const resultPositive = isZero(positiveNum);
      const resultNegative = isZero(negativeNum);

      // Assert
      expect(resultPositive).toBe(false);
      expect(resultNegative).toBe(false);
    });
  });

  describe('clamp - Limitar valores en un rango', () => {
    it('debe mantener el valor dentro del rango', () => {
      // Arrange
      const value = 15;
      const min = 10;
      const max = 20;

      // Act
      const result = clamp(value, min, max);

      // Assert
      expect(result).toBe(value);
      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThanOrEqual(max);
    });

    it('debe limitar al mínimo cuando el valor es menor', () => {
      // Arrange
      const value = 5;
      const min = 10;
      const max = 20;

      // Act
      const result = clamp(value, min, max);

      // Assert
      expect(result).toBe(min);
    });

    it('debe limitar al máximo cuando el valor es mayor', () => {
      // Arrange
      const value = 25;
      const min = 10;
      const max = 20;

      // Act
      const result = clamp(value, min, max);

      // Assert
      expect(result).toBe(max);
    });
  });
});

