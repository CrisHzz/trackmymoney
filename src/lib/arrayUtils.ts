/**
 * Utilidades para manejo de arrays
 */

export const sum = (numbers: number[]): number => {
  return numbers.reduce((acc, num) => acc + num, 0);
};

export const average = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  return sum(numbers) / numbers.length;
};

export const max = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  return Math.max(...numbers);
};

export const min = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  return Math.min(...numbers);
};

export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

export const chunk = <T>(array: T[], size: number): T[][] => {
  if (size <= 0) return [];
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export const shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const isEmpty = <T>(array: T[]): boolean => {
  return array.length === 0;
};

export const isNotEmpty = <T>(array: T[]): boolean => {
  return !isEmpty(array);
};