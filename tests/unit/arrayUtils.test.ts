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
} from '@/lib/arrayUtils';
describe('arrayUtils - Utilidades de Arrays', () => {
  describe('sum - Suma de elementos', () => {
    it('debe sumar array de números correctamente', () => {
      const numbers = [1, 2, 3, 4, 5];
      const expectedSum = 15;
      const result = sum(numbers);
      expect(result).toBe(expectedSum);
    });
    it('debe retornar 0 para array vacío', () => {
      const emptyArray: number[] = [];
      const result = sum(emptyArray);
      expect(result).toBe(0);
    });
    it('debe manejar números negativos', () => {
      const numbers = [10, -5, 3, -2];
      const expectedSum = 6;
      const result = sum(numbers);
      expect(result).toBe(expectedSum);
    });
    it('debe manejar array con un solo elemento', () => {
      const singleElement = [42];
      const result = sum(singleElement);
      expect(result).toBe(42);
    });
  });
  describe('average - Promedio de elementos', () => {
    it('debe calcular promedio correctamente', () => {
      const numbers = [2, 4, 6];
      const expectedAverage = 4;
      const result = average(numbers);
      expect(result).toBe(expectedAverage);
    });
    it('debe retornar 0 para array vacío', () => {
      const emptyArray: number[] = [];
      const result = average(emptyArray);
      expect(result).toBe(0);
    });
    it('debe calcular promedio con decimales', () => {
      const numbers = [1, 2, 3];
      const expectedAverage = 2;
      const result = average(numbers);
      expect(result).toBe(expectedAverage);
    });
  });
  describe('max - Valor máximo', () => {
    it('debe encontrar el valor máximo', () => {
      const numbers = [1, 5, 3, 9, 2];
      const expectedMax = 9;
      const result = max(numbers);
      expect(result).toBe(expectedMax);
      expect(result).toBeGreaterThanOrEqual(1);
    });
    it('debe retornar 0 para array vacío', () => {
      const emptyArray: number[] = [];
      const result = max(emptyArray);
      expect(result).toBe(0);
    });
    it('debe manejar números negativos', () => {
      const numbers = [-10, -5, -20];
      const expectedMax = -5;
      const result = max(numbers);
      expect(result).toBe(expectedMax);
    });
  });
  describe('min - Valor mínimo', () => {
    it('debe encontrar el valor mínimo', () => {
      const numbers = [1, 5, 3, 9, 2];
      const expectedMin = 1;
      const result = min(numbers);
      expect(result).toBe(expectedMin);
      expect(result).toBeLessThanOrEqual(9);
    });
    it('debe retornar 0 para array vacío', () => {
      const emptyArray: number[] = [];
      const result = min(emptyArray);
      expect(result).toBe(0);
    });
    it('debe manejar números positivos y negativos', () => {
      const numbers = [10, -5, 3, 0];
      const expectedMin = -5;
      const result = min(numbers);
      expect(result).toBe(expectedMin);
    });
  });
  describe('unique - Elementos únicos', () => {
    it('debe remover duplicados de números', () => {
      const numbersWithDuplicates = [1, 2, 2, 3, 3, 3];
      const expectedUnique = [1, 2, 3];
      const result = unique(numbersWithDuplicates);
      expect(result).toEqual(expectedUnique);
      expect(result).toHaveLength(3);
    });
    it('debe manejar strings', () => {
      const stringsWithDuplicates = ['a', 'b', 'a', 'c'];
      const expectedUnique = ['a', 'b', 'c'];
      const result = unique(stringsWithDuplicates);
      expect(result).toEqual(expectedUnique);
      expect(result).toHaveLength(3);
    });
    it('debe retornar array sin cambios si no hay duplicados', () => {
      const uniqueArray = [1, 2, 3];
      const result = unique(uniqueArray);
      expect(result).toEqual(uniqueArray);
    });
    it('debe manejar array vacío', () => {
      const emptyArray: number[] = [];
      const result = unique(emptyArray);
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });
  describe('chunk - Dividir array en partes', () => {
    it('debe dividir array en chunks del tamaño especificado', () => {
      const array = [1, 2, 3, 4, 5];
      const chunkSize = 2;
      const expectedChunks = [[1, 2], [3, 4], [5]];
      const result = chunk(array, chunkSize);
      expect(result).toEqual(expectedChunks);
      expect(result).toHaveLength(3);
    });
    it('debe retornar array vacío para size 0', () => {
      const array = [1, 2, 3];
      const chunkSize = 0;
      const result = chunk(array, chunkSize);
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
    it('debe manejar chunk size mayor que array length', () => {
      const array = [1, 2, 3];
      const chunkSize = 10;
      const expectedChunks = [[1, 2, 3]];
      const result = chunk(array, chunkSize);
      expect(result).toEqual(expectedChunks);
      expect(result).toHaveLength(1);
    });
  });
  describe('shuffle - Mezclar elementos', () => {
    it('debe retornar array con la misma longitud', () => {
      const original = [1, 2, 3, 4, 5];
      const originalLength = original.length;
      const shuffled = shuffle(original);
      expect(shuffled).toHaveLength(originalLength);
    });
    it('no debe modificar el array original', () => {
      const original = [1, 2, 3];
      const originalCopy = [...original];
      shuffle(original);
      expect(original).toEqual(originalCopy);
    });
    it('debe contener todos los elementos originales', () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffle(original);
      original.forEach(element => {
        expect(shuffled).toContain(element);
      });
    });
  });
  describe('isEmpty - Verificar si está vacío', () => {
    it('debe retornar true para array vacío', () => {
      const emptyArray: number[] = [];
      const result = isEmpty(emptyArray);
      expect(result).toBe(true);
      expect(result).toBeTruthy();
    });
    it('debe retornar false para array no vacío', () => {
      const nonEmptyArray = [1, 2, 3];
      const result = isEmpty(nonEmptyArray);
      expect(result).toBe(false);
      expect(result).toBeFalsy();
    });
  });
  describe('isNotEmpty - Verificar si no está vacío', () => {
    it('debe retornar false para array vacío', () => {
      const emptyArray: number[] = [];
      const result = isNotEmpty(emptyArray);
      expect(result).toBe(false);
      expect(result).toBeFalsy();
    });
    it('debe retornar true para array no vacío', () => {
      const nonEmptyArray = [1, 2, 3];
      const result = isNotEmpty(nonEmptyArray);
      expect(result).toBe(true);
      expect(result).toBeTruthy();
    });
  });
});
