/**
 * Pruebas unitarias para utilidades de arrays
 * 
 * Principios FIRST aplicados:
 * - Fast: Operaciones rápidas sin I/O
 * - Independent: Tests aislados sin estado compartido
 * - Repeatable: Mismos resultados en cada ejecución
 * - Self-validating: Assertions claras y automáticas
 * - Timely: Tests escritos con el código
 * 
 * Patrón AAA (Arrange-Act-Assert) en todos los tests
 */

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
      // Arrange
      const numbers = [1, 2, 3, 4, 5];
      const expectedSum = 15;

      // Act
      const result = sum(numbers);

      // Assert
      expect(result).toBe(expectedSum);
    });

    it('debe retornar 0 para array vacío', () => {
      // Arrange
      const emptyArray: number[] = [];

      // Act
      const result = sum(emptyArray);

      // Assert
      expect(result).toBe(0);
    });

    it('debe manejar números negativos', () => {
      // Arrange
      const numbers = [10, -5, 3, -2];
      const expectedSum = 6;

      // Act
      const result = sum(numbers);

      // Assert
      expect(result).toBe(expectedSum);
    });

    it('debe manejar array con un solo elemento', () => {
      // Arrange
      const singleElement = [42];

      // Act
      const result = sum(singleElement);

      // Assert
      expect(result).toBe(42);
    });
  });

  describe('average - Promedio de elementos', () => {
    it('debe calcular promedio correctamente', () => {
      // Arrange
      const numbers = [2, 4, 6];
      const expectedAverage = 4;

      // Act
      const result = average(numbers);

      // Assert
      expect(result).toBe(expectedAverage);
    });

    it('debe retornar 0 para array vacío', () => {
      // Arrange
      const emptyArray: number[] = [];

      // Act
      const result = average(emptyArray);

      // Assert
      expect(result).toBe(0);
    });

    it('debe calcular promedio con decimales', () => {
      // Arrange
      const numbers = [1, 2, 3];
      const expectedAverage = 2;

      // Act
      const result = average(numbers);

      // Assert
      expect(result).toBe(expectedAverage);
    });
  });

  describe('max - Valor máximo', () => {
    it('debe encontrar el valor máximo', () => {
      // Arrange
      const numbers = [1, 5, 3, 9, 2];
      const expectedMax = 9;

      // Act
      const result = max(numbers);

      // Assert
      expect(result).toBe(expectedMax);
      expect(result).toBeGreaterThanOrEqual(1);
    });

    it('debe retornar 0 para array vacío', () => {
      // Arrange
      const emptyArray: number[] = [];

      // Act
      const result = max(emptyArray);

      // Assert
      expect(result).toBe(0);
    });

    it('debe manejar números negativos', () => {
      // Arrange
      const numbers = [-10, -5, -20];
      const expectedMax = -5;

      // Act
      const result = max(numbers);

      // Assert
      expect(result).toBe(expectedMax);
    });
  });

  describe('min - Valor mínimo', () => {
    it('debe encontrar el valor mínimo', () => {
      // Arrange
      const numbers = [1, 5, 3, 9, 2];
      const expectedMin = 1;

      // Act
      const result = min(numbers);

      // Assert
      expect(result).toBe(expectedMin);
      expect(result).toBeLessThanOrEqual(9);
    });

    it('debe retornar 0 para array vacío', () => {
      // Arrange
      const emptyArray: number[] = [];

      // Act
      const result = min(emptyArray);

      // Assert
      expect(result).toBe(0);
    });

    it('debe manejar números positivos y negativos', () => {
      // Arrange
      const numbers = [10, -5, 3, 0];
      const expectedMin = -5;

      // Act
      const result = min(numbers);

      // Assert
      expect(result).toBe(expectedMin);
    });
  });

  describe('unique - Elementos únicos', () => {
    it('debe remover duplicados de números', () => {
      // Arrange
      const numbersWithDuplicates = [1, 2, 2, 3, 3, 3];
      const expectedUnique = [1, 2, 3];

      // Act
      const result = unique(numbersWithDuplicates);

      // Assert
      expect(result).toEqual(expectedUnique);
      expect(result).toHaveLength(3);
    });

    it('debe manejar strings', () => {
      // Arrange
      const stringsWithDuplicates = ['a', 'b', 'a', 'c'];
      const expectedUnique = ['a', 'b', 'c'];

      // Act
      const result = unique(stringsWithDuplicates);

      // Assert
      expect(result).toEqual(expectedUnique);
      expect(result).toHaveLength(3);
    });

    it('debe retornar array sin cambios si no hay duplicados', () => {
      // Arrange
      const uniqueArray = [1, 2, 3];

      // Act
      const result = unique(uniqueArray);

      // Assert
      expect(result).toEqual(uniqueArray);
    });

    it('debe manejar array vacío', () => {
      // Arrange
      const emptyArray: number[] = [];

      // Act
      const result = unique(emptyArray);

      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('chunk - Dividir array en partes', () => {
    it('debe dividir array en chunks del tamaño especificado', () => {
      // Arrange
      const array = [1, 2, 3, 4, 5];
      const chunkSize = 2;
      const expectedChunks = [[1, 2], [3, 4], [5]];

      // Act
      const result = chunk(array, chunkSize);

      // Assert
      expect(result).toEqual(expectedChunks);
      expect(result).toHaveLength(3);
    });

    it('debe retornar array vacío para size 0', () => {
      // Arrange
      const array = [1, 2, 3];
      const chunkSize = 0;

      // Act
      const result = chunk(array, chunkSize);

      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('debe manejar chunk size mayor que array length', () => {
      // Arrange
      const array = [1, 2, 3];
      const chunkSize = 10;
      const expectedChunks = [[1, 2, 3]];

      // Act
      const result = chunk(array, chunkSize);

      // Assert
      expect(result).toEqual(expectedChunks);
      expect(result).toHaveLength(1);
    });
  });

  describe('shuffle - Mezclar elementos', () => {
    it('debe retornar array con la misma longitud', () => {
      // Arrange
      const original = [1, 2, 3, 4, 5];
      const originalLength = original.length;

      // Act
      const shuffled = shuffle(original);

      // Assert
      expect(shuffled).toHaveLength(originalLength);
    });

    it('no debe modificar el array original', () => {
      // Arrange
      const original = [1, 2, 3];
      const originalCopy = [...original];

      // Act
      shuffle(original);

      // Assert
      expect(original).toEqual(originalCopy);
    });

    it('debe contener todos los elementos originales', () => {
      // Arrange
      const original = [1, 2, 3, 4, 5];

      // Act
      const shuffled = shuffle(original);

      // Assert
      original.forEach(element => {
        expect(shuffled).toContain(element);
      });
    });
  });

  describe('isEmpty - Verificar si está vacío', () => {
    it('debe retornar true para array vacío', () => {
      // Arrange
      const emptyArray: number[] = [];

      // Act
      const result = isEmpty(emptyArray);

      // Assert
      expect(result).toBe(true);
      expect(result).toBeTruthy();
    });

    it('debe retornar false para array no vacío', () => {
      // Arrange
      const nonEmptyArray = [1, 2, 3];

      // Act
      const result = isEmpty(nonEmptyArray);

      // Assert
      expect(result).toBe(false);
      expect(result).toBeFalsy();
    });
  });

  describe('isNotEmpty - Verificar si no está vacío', () => {
    it('debe retornar false para array vacío', () => {
      // Arrange
      const emptyArray: number[] = [];

      // Act
      const result = isNotEmpty(emptyArray);

      // Assert
      expect(result).toBe(false);
      expect(result).toBeFalsy();
    });

    it('debe retornar true para array no vacío', () => {
      // Arrange
      const nonEmptyArray = [1, 2, 3];

      // Act
      const result = isNotEmpty(nonEmptyArray);

      // Assert
      expect(result).toBe(true);
      expect(result).toBeTruthy();
    });
  });
});

