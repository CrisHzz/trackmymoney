/**
 * Utilidades para manejo de strings
 */

export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncate = (str: string, length: number): string => {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};

export const removeSpaces = (str: string): string => {
  // Limitar longitud para prevenir ataques
  if (str.length > 10000) return str.slice(0, 10000).replace(/\s/g, '');
  return str.replace(/\s/g, '');
};

export const isEmail = (email: string): boolean => {
  // Limitar longitud para prevenir ataques ReDoS
  if (!email || email.length > 254) return false;
  
  // Regex más simple y seguro
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    // Limitar longitud para prevenir ataques
    .slice(0, 200)
    // Regex más seguro - sin cuantificadores anidados
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    // Regex seguro - sin backtracking catastrófico
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export const isEmpty = (str: string): boolean => {
  return !str || str.trim().length === 0;
};

export const isNotEmpty = (str: string): boolean => {
  return !isEmpty(str);
};