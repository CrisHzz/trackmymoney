import { isEmpty, isNotEmpty, sleep, randomInt, clamp, debounce } from '../utils';

describe('utils', () => {
  describe('isEmpty', () => {
    it('should return true for null and undefined', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });

    it('should return true for empty string', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true);
    });

    it('should return true for empty array', () => {
      expect(isEmpty([])).toBe(true);
    });

    it('should return true for empty object', () => {
      expect(isEmpty({})).toBe(true);
    });

    it('should return false for non-empty values', () => {
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty([1, 2, 3])).toBe(false);
      expect(isEmpty({ a: 1 })).toBe(false);
      expect(isEmpty(0)).toBe(false);
      expect(isEmpty(false)).toBe(false);
    });
  });

  describe('isNotEmpty', () => {
    it('should return false for empty values', () => {
      expect(isNotEmpty(null)).toBe(false);
      expect(isNotEmpty('')).toBe(false);
      expect(isNotEmpty([])).toBe(false);
      expect(isNotEmpty({})).toBe(false);
    });

    it('should return true for non-empty values', () => {
      expect(isNotEmpty('hello')).toBe(true);
      expect(isNotEmpty([1])).toBe(true);
      expect(isNotEmpty({ a: 1 })).toBe(true);
    });
  });

  describe('sleep', () => {
    it('should resolve after specified time', async () => {
      const start = Date.now();
      await sleep(50);
      const end = Date.now();
      expect(end - start).toBeGreaterThanOrEqual(45);
    });
  });

  describe('randomInt', () => {
    it('should return number within range', () => {
      for (let i = 0; i < 10; i++) {
        const result = randomInt(1, 5);
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(5);
        expect(Number.isInteger(result)).toBe(true);
      }
    });
  });

  describe('clamp', () => {
    it('should clamp value within range', () => {
      expect(clamp(5, 1, 10)).toBe(5);
      expect(clamp(-5, 1, 10)).toBe(1);
      expect(clamp(15, 1, 10)).toBe(10);
    });
  });

  describe('debounce', () => {
    it('should debounce function calls', (done) => {
      let callCount = 0;
      const debouncedFn = debounce(() => {
        callCount++;
      }, 50);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      setTimeout(() => {
        expect(callCount).toBe(1);
        done();
      }, 100);
    });
  });
});