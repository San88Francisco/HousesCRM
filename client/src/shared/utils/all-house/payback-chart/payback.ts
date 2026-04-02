import { PIE_COLORS } from '@/shared/constants/revenue-pie-chart';
import { getCurrencySymbol } from '@/shared/utils/getCurrencySymbol';
import { Currencies } from '@/types/core/currencies';
import { HousePaybackStats, PaybackChartData } from '@/types/core/payback-chart';

const FULL_PAYBACK_COEFFICIENT = 1;
const COEFFICIENT_DECIMAL_PLACES = 2;
const DEFAULT_CURRENCY: Currencies = 'UAH';

export const transformPaybackData = (
  stats: HousePaybackStats[],
  currency: Currencies = DEFAULT_CURRENCY,
): PaybackChartData[] => {
  const symbol = getCurrencySymbol(currency);

  return stats.map((stat, index) => {
    const isFullyPaidBack = stat.paybackCoefficient >= FULL_PAYBACK_COEFFICIENT;
    const displayCoefficient = Math.min(stat.paybackCoefficient, FULL_PAYBACK_COEFFICIENT);

    return {
      id: stat.id,
      apartmentName: stat.apartmentName,
      paybackCoefficient: stat.paybackCoefficient,
      displayCoefficient,
      isFullyPaidBack,
      color: PIE_COLORS[index % PIE_COLORS.length],
      purchaseDate: stat.purchaseDate,
      purchasePriceUSD: stat.purchasePriceUSD,
      totalIncomeUSD: stat.totalIncomeUSD,
      currencySymbol: symbol,
      currencyCode: currency,
    };
  });
};

export const formatPaybackCoefficient = (coefficient: number): string => {
  return `x${coefficient.toFixed(COEFFICIENT_DECIMAL_PLACES)}`;
};

export const formatTooltipPrice = (
  value: number,
  currency: Currencies = DEFAULT_CURRENCY,
): string => {
  const symbol = getCurrencySymbol(currency);

  if (!Number.isFinite(value)) return '—';

  const sign = value < 0 ? '-' : '';
  const abs = Math.abs(value);

  return `${sign}${symbol}${Math.round(abs).toLocaleString('uk-UA')}`;
};

export const formatYAxis = (value: number, currency: Currencies = DEFAULT_CURRENCY): string => {
  return formatTooltipPrice(value, currency);
};
