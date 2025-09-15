/**
 * Application constants
 */

export const APP_NAME = 'TrackMyMoney';
export const VERSION = '1.0.0';
export const AUTHOR = 'Development Team';

export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£'
};

export const DATE_FORMATS = {
  SHORT: 'DD/MM/YYYY',
  LONG: 'DD de MMMM de YYYY'
};

export const getAppInfo = () => ({
  name: APP_NAME,
  version: VERSION,
  author: AUTHOR
});

export const getCurrencySymbol = (currency: string): string => {
  return CURRENCY_SYMBOLS[currency as keyof typeof CURRENCY_SYMBOLS] || currency;
};