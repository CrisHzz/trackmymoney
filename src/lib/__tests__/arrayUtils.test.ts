import {
  sum,
  average,
  max,
  min,
  unique,
  chunk,
  shuffle,
  isEmpty,
  isNotEmpty
} from '../arrayUtils';

describe('arrayUtils', () => {
  describe('sum', () => {
    it('should sum array of numbers', () => {
      expect(sum([1, 2, 3, 4, 5])).toBe(15);
    });

    it('should return 0 for empty array', () => {
      expect(sum([])).toBe(0);
    });
  });

  describe('average', () => {
    it('should calculate average', () => {
      expect(average([2, 4, 6])).toBe(4);
    });

    it('should return 0 for empty array', () => {
      expect(average([])).toBe(0);
    });
  });

  describe('max', () => {
    it('should find maximum value', () => {
      expect(max([1, 5, 3, 9, 2])).toBe(9);
    });

    it('should return 0 for empty array', () => {
      expect(max([])).toBe(0);
    });
  });

  describe('min', () => {
    it('should find minimum value', () => {
      expect(min([1, 5, 3, 9, 2])).toBe(1);
    });

    it('should return 0 for empty array', () => {
      expect(min([])).toBe(0);
    });
  });

  describe('unique', () => {
    it('should remove duplicates', () => {
      expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
    });

    it('should handle strings', () => {
      expect(unique(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
    });
  });

  describe('chunk', () => {
    it('should chunk array into smaller arrays', () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('should return empty array for size 0', () => {
      expect(chunk([1, 2, 3], 0)).toEqual([]);
    });
  });

  describe('shuffle', () => {
    it('should return array with same length', () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffle(original);
      expect(shuffled.length).toBe(original.length);
    });

    it('should not modify original array', () => {
      const original = [1, 2, 3];
      const shuffled = shuffle(original);
      expect(original).toEqual([1, 2, 3]);
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty array', () => {
      expect(isEmpty([])).toBe(true);
    });

    it('should return false for non-empty array', () => {
      expect(isEmpty([1, 2, 3])).toBe(false);
    });
  });

  describe('isNotEmpty', () => {
    it('should return false for empty array', () => {
      expect(isNotEmpty([])).toBe(false);
    });

    it('should return true for non-empty array', () => {
      expect(isNotEmpty([1, 2, 3])).toBe(true);
    });
  });
});