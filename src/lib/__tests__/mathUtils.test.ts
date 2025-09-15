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
} from '../mathUtils';

describe('mathUtils', () => {
  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    it('should add positive and negative numbers', () => {
      expect(add(5, -3)).toBe(2);
    });
  });

  describe('subtract', () => {
    it('should subtract two numbers', () => {
      expect(subtract(5, 3)).toBe(2);
    });

    it('should handle negative results', () => {
      expect(subtract(3, 5)).toBe(-2);
    });
  });

  describe('multiply', () => {
    it('should multiply two numbers', () => {
      expect(multiply(4, 5)).toBe(20);
    });

    it('should handle zero multiplication', () => {
      expect(multiply(5, 0)).toBe(0);
    });
  });

  describe('divide', () => {
    it('should divide two numbers', () => {
      expect(divide(10, 2)).toBe(5);
    });

    it('should throw error when dividing by zero', () => {
      expect(() => divide(10, 0)).toThrow('División por cero no permitida');
    });
  });

  describe('percentage', () => {
    it('should calculate percentage correctly', () => {
      expect(percentage(25, 100)).toBe(25);
    });

    it('should return 0 when total is 0', () => {
      expect(percentage(10, 0)).toBe(0);
    });
  });

  describe('round', () => {
    it('should round to 2 decimals by default', () => {
      expect(round(3.14159)).toBe(3.14);
    });

    it('should round to specified decimals', () => {
      expect(round(3.14159, 3)).toBe(3.142);
    });
  });

  describe('isPositive', () => {
    it('should return true for positive numbers', () => {
      expect(isPositive(5)).toBe(true);
    });

    it('should return false for zero and negative numbers', () => {
      expect(isPositive(0)).toBe(false);
      expect(isPositive(-1)).toBe(false);
    });
  });

  describe('isNegative', () => {
    it('should return true for negative numbers', () => {
      expect(isNegative(-5)).toBe(true);
    });

    it('should return false for zero and positive numbers', () => {
      expect(isNegative(0)).toBe(false);
      expect(isNegative(1)).toBe(false);
    });
  });

  describe('isZero', () => {
    it('should return true for zero', () => {
      expect(isZero(0)).toBe(true);
    });

    it('should return false for non-zero numbers', () => {
      expect(isZero(1)).toBe(false);
      expect(isZero(-1)).toBe(false);
    });
  });

  describe('clamp', () => {
    it('should clamp value within range', () => {
      expect(clamp(15, 10, 20)).toBe(15);
    });

    it('should clamp value to minimum', () => {
      expect(clamp(5, 10, 20)).toBe(10);
    });

    it('should clamp value to maximum', () => {
      expect(clamp(25, 10, 20)).toBe(20);
    });
  });
});