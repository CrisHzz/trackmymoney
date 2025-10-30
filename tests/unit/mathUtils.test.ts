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
      const num1 = 2;
      const num2 = 3;
      const expectedResult = 5;
      const result = add(num1, num2);
      expect(result).toBe(expectedResult);
      expect(result).toBeGreaterThan(0);
    });
    it('debe sumar números positivos y negativos correctamente', () => {
      const num1 = 5;
      const num2 = -3;
      const expectedResult = 2;
      const result = add(num1, num2);
      expect(result).toBe(expectedResult);
      expect(result).toBeGreaterThan(0);
    });
    it('debe manejar suma con cero', () => {
      const num1 = 10;
      const num2 = 0;
      const result = add(num1, num2);
      expect(result).toBe(num1);
    });
  });
  describe('subtract - Resta de números', () => {
    it('debe restar dos números correctamente', () => {
      const minuend = 5;
      const subtrahend = 3;
      const expectedResult = 2;
      const result = subtract(minuend, subtrahend);
      expect(result).toBe(expectedResult);
      expect(result).toBeGreaterThan(0);
    });
    it('debe manejar resultados negativos correctamente', () => {
      const minuend = 3;
      const subtrahend = 5;
      const expectedResult = -2;
      const result = subtract(minuend, subtrahend);
      expect(result).toBe(expectedResult);
      expect(result).toBeLessThan(0);
    });
    it('debe retornar cero cuando los números son iguales', () => {
      const num = 10;
      const result = subtract(num, num);
      expect(result).toBe(0);
    });
  });
  describe('multiply - Multiplicación de números', () => {
    it('debe multiplicar dos números positivos', () => {
      const factor1 = 4;
      const factor2 = 5;
      const expectedResult = 20;
      const result = multiply(factor1, factor2);
      expect(result).toBe(expectedResult);
    });
    it('debe manejar multiplicación por cero', () => {
      const num = 5;
      const zero = 0;
      const result = multiply(num, zero);
      expect(result).toBe(0);
    });
    it('debe manejar multiplicación de números negativos', () => {
      const factor1 = -3;
      const factor2 = 4;
      const expectedResult = -12;
      const result = multiply(factor1, factor2);
      expect(result).toBe(expectedResult);
      expect(result).toBeLessThan(0);
    });
  });
  describe('divide - División de números', () => {
    it('debe dividir dos números correctamente', () => {
      const dividend = 10;
      const divisor = 2;
      const expectedResult = 5;
      const result = divide(dividend, divisor);
      expect(result).toBe(expectedResult);
    });
    it('debe lanzar error al dividir por cero', () => {
      const dividend = 10;
      const divisor = 0;
      const expectedError = 'División por cero no permitida';
      expect(() => divide(dividend, divisor)).toThrow(expectedError);
    });
    it('debe manejar división con resultado decimal', () => {
      const dividend = 10;
      const divisor = 3;
      const result = divide(dividend, divisor);
      expect(result).toBeCloseTo(3.333, 2);
    });
  });
  describe('percentage - Cálculo de porcentajes', () => {
    it('debe calcular porcentaje correctamente', () => {
      const value = 25;
      const total = 100;
      const expectedPercentage = 25;
      const result = percentage(value, total);
      expect(result).toBe(expectedPercentage);
    });
    it('debe retornar 0 cuando el total es cero', () => {
      const value = 10;
      const total = 0;
      const result = percentage(value, total);
      expect(result).toBe(0);
    });
    it('debe calcular porcentajes mayores a 100', () => {
      const value = 150;
      const total = 100;
      const expectedPercentage = 150;
      const result = percentage(value, total);
      expect(result).toBe(expectedPercentage);
      expect(result).toBeGreaterThan(100);
    });
  });
  describe('round - Redondeo de números', () => {
    it('debe redondear a 2 decimales por defecto', () => {
      const num = 3.14159;
      const expectedResult = 3.14;
      const result = round(num);
      expect(result).toBe(expectedResult);
    });
    it('debe redondear al número de decimales especificado', () => {
      const num = 3.14159;
      const decimals = 3;
      const expectedResult = 3.142;
      const result = round(num, decimals);
      expect(result).toBe(expectedResult);
    });
    it('debe redondear números enteros sin cambios', () => {
      const num = 5;
      const result = round(num);
      expect(result).toBe(num);
    });
  });
  describe('isPositive - Verificación de números positivos', () => {
    it('debe retornar true para números positivos', () => {
      const positiveNum = 5;
      const result = isPositive(positiveNum);
      expect(result).toBe(true);
      expect(result).toBeTruthy();
    });
    it('debe retornar false para cero', () => {
      const zero = 0;
      const result = isPositive(zero);
      expect(result).toBe(false);
      expect(result).toBeFalsy();
    });
    it('debe retornar false para números negativos', () => {
      const negativeNum = -1;
      const result = isPositive(negativeNum);
      expect(result).toBe(false);
    });
  });
  describe('isNegative - Verificación de números negativos', () => {
    it('debe retornar true para números negativos', () => {
      const negativeNum = -5;
      const result = isNegative(negativeNum);
      expect(result).toBe(true);
    });
    it('debe retornar false para cero y positivos', () => {
      const zero = 0;
      const positiveNum = 1;
      const resultZero = isNegative(zero);
      const resultPositive = isNegative(positiveNum);
      expect(resultZero).toBe(false);
      expect(resultPositive).toBe(false);
    });
  });
  describe('isZero - Verificación de cero', () => {
    it('debe retornar true para cero', () => {
      const zero = 0;
      const result = isZero(zero);
      expect(result).toBe(true);
      expect(result).toBeTruthy();
    });
    it('debe retornar false para números no-cero', () => {
      const positiveNum = 1;
      const negativeNum = -1;
      const resultPositive = isZero(positiveNum);
      const resultNegative = isZero(negativeNum);
      expect(resultPositive).toBe(false);
      expect(resultNegative).toBe(false);
    });
  });
  describe('clamp - Limitar valores en un rango', () => {
    it('debe mantener el valor dentro del rango', () => {
      const value = 15;
      const min = 10;
      const max = 20;
      const result = clamp(value, min, max);
      expect(result).toBe(value);
      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThanOrEqual(max);
    });
    it('debe limitar al mínimo cuando el valor es menor', () => {
      const value = 5;
      const min = 10;
      const max = 20;
      const result = clamp(value, min, max);
      expect(result).toBe(min);
    });
    it('debe limitar al máximo cuando el valor es mayor', () => {
      const value = 25;
      const min = 10;
      const max = 20;
      const result = clamp(value, min, max);
      expect(result).toBe(max);
    });
  });
});
