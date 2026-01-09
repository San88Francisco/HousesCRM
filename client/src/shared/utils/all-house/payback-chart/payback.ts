import { PIE_COLORS } from '@/shared/constants/revenue-pie-chart/chart-pie-colors';
import { getCurrencySymbol } from '@/shared/utils/getCurrencySymbol';
import { Currencies } from '@/types/core/currencies';
import { HousePaybackStats, PaybackChartData } from '@/types/core/payback-chart';

const FULL_PAYBACK_COEFFICIENT = 1;
const COEFFICIENT_DECIMAL_PLACES = 2;
const MILLION = 1_000_000;
const THOUSAND = 1_000;
const MAX_NAME_LENGTH = 20;

export const transformPaybackData = (
  stats: HousePaybackStats[],
  currency: Currencies = 'USD',
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
    };
  });
};

export const formatPaybackCoefficient = (coefficient: number): string => {
  return `x${coefficient.toFixed(COEFFICIENT_DECIMAL_PLACES)}`;
};

export const truncateText = (text: string, maxLength: number = MAX_NAME_LENGTH): string =>
  text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;

export const formatYAxis = (value: number, currency: Currencies = 'USD'): string => {
  const symbol = getCurrencySymbol(currency);

  if (value >= MILLION) {
    return `${symbol}${Math.round(value / MILLION)}M`;
  }

  if (value >= THOUSAND) {
    return `${symbol}${Math.round(value / THOUSAND)}k`;
  }

  return value === 0 ? `${symbol}0` : `${symbol}${value}`;
};

export const formatTooltipPrice = (value: number, currency: Currencies = 'USD'): string => {
  const symbol = getCurrencySymbol(currency);

  if (value >= MILLION) {
    return `${symbol}${(value / MILLION).toFixed(2)}M`;
  }

  if (value >= THOUSAND) {
    const thousands = value / THOUSAND;
    const decimals = thousands >= 100 ? 1 : 2;

    return Number.isInteger(thousands)
      ? `${symbol}${thousands}k`
      : `${symbol}${thousands.toFixed(decimals)}k`;
  }

  return `${symbol}${value.toLocaleString('en-US')}`;
};
