import {
  capitalize,
  truncate,
  removeSpaces,
  isEmail,
  formatCurrency,
  slugify,
  isEmpty,
  isNotEmpty
} from '../stringUtils';

describe('stringUtils', () => {
  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('');
    });

    it('should handle mixed case', () => {
      expect(capitalize('hELLO')).toBe('Hello');
    });
  });

  describe('truncate', () => {
    it('should truncate long strings', () => {
      expect(truncate('Hello World', 5)).toBe('Hello...');
    });

    it('should not truncate short strings', () => {
      expect(truncate('Hi', 5)).toBe('Hi');
    });
  });

  describe('removeSpaces', () => {
    it('should remove all spaces', () => {
      expect(removeSpaces('Hello World Test')).toBe('HelloWorldTest');
    });

    it('should handle string without spaces', () => {
      expect(removeSpaces('HelloWorld')).toBe('HelloWorld');
    });
  });

  describe('isEmail', () => {
    it('should validate correct email', () => {
      expect(isEmail('test@example.com')).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(isEmail('invalid-email')).toBe(false);
      expect(isEmail('test@')).toBe(false);
      expect(isEmail('@example.com')).toBe(false);
    });
  });

  describe('formatCurrency', () => {
    it('should format currency with default USD', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
    });

    it('should format currency with specified currency', () => {
      expect(formatCurrency(1234.56, 'EUR')).toBe('€1,234.56');
    });
  });

  describe('slugify', () => {
    it('should create slug from string', () => {
      expect(slugify('Hello World!')).toBe('hello-world');
    });

    it('should handle special characters', () => {
      expect(slugify('Test@#$%^&*()String')).toBe('teststring');
    });

    it('should handle multiple spaces', () => {
      expect(slugify('Hello   World')).toBe('hello-world');
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty strings', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true);
    });

    it('should return false for non-empty strings', () => {
      expect(isEmpty('Hello')).toBe(false);
    });
  });

  describe('isNotEmpty', () => {
    it('should return false for empty strings', () => {
      expect(isNotEmpty('')).toBe(false);
      expect(isNotEmpty('   ')).toBe(false);
    });

    it('should return true for non-empty strings', () => {
      expect(isNotEmpty('Hello')).toBe(true);
    });
  });
});