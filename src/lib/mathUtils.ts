/**
 * Utilidades matemáticas simples para cálculos financieros
 * Actualizado para Quality Gate
 */

export const add = (a: number, b: number): number => a + b;

export const subtract = (a: number, b: number): number => a - b;

export const multiply = (a: number, b: number): number => a * b;

export const divide = (a: number, b: number): number => {
  if (b === 0) throw new Error('División por cero no permitida');
  return a / b;
};

export const percentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

export const round = (value: number, decimals: number = 2): number => {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

export const isPositive = (value: number): boolean => value > 0;

export const isNegative = (value: number): boolean => value < 0;

export const isZero = (value: number): boolean => value === 0;

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};