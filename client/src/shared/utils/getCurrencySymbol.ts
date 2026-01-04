import { Currencies } from '@/types/core/currencies/currencies';

const currencySymbols: { [key in Currencies]: string } = {
  UAH: '₴',
  USD: '$',
  EUR: '€',
  PLN: 'zł',
};

export const getCurrencySymbol = (currency: Currencies) => {
  return currencySymbols[currency] || '';
};
