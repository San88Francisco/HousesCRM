import { FormatCurrencyArgs } from '@/types/core/table/formatters';

export const formatCurrency = (amount: number, options: FormatCurrencyArgs = {}): string => {
  const {
    currency = 'USD',
    locale = 'en-US',
    currencyDisplay = 'symbol',
    maximumFractionDigits = 2,
  } = options;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay,
    maximumFractionDigits,
  }).format(amount);
};
