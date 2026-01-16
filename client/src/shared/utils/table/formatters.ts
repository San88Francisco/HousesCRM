import { FormatCurrencyArgs } from '@/types/core/table/formatters';

export const formatCurrency = (
  amount: number | null | undefined,
  options: FormatCurrencyArgs = {},
): string => {
  const {
    currency = 'USD',
    locale = 'en-US',
    currencyDisplay = 'symbol',
    maximumFractionDigits = 2,
  } = options;

  const safeAmount = amount ?? 0;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay,
    maximumFractionDigits,
  }).format(safeAmount);
};
