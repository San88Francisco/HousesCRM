import { PIE_COLORS } from '@/shared/constants/revenue-pie-chart/chart-pie-colors';
import { getCurrencySymbol } from '@/shared/utils/getCurrencySymbol';
import { Currencies } from '@/types/core/currencies';
import { HousePaybackStats, PaybackChartData } from '@/types/core/payback-chart';

const FULL_PAYBACK_COEFFICIENT = 1;
const COEFFICIENT_DECIMAL_PLACES = 2;
const MILLION = 1_000_000;
const THOUSAND = 1_000;
const DEFAULT_CURRENCY: Currencies = 'USD';

const formatLargeNumber = (abs: number, symbol: string, sign: string): string => {
  if (abs >= MILLION) {
    return `${sign}${symbol}${Math.round(abs / MILLION)}M`;
  }

  const k = Math.round(abs / THOUSAND);
  return k >= 1000 ? `${sign}${symbol}${Math.round(abs / MILLION)}M` : `${sign}${symbol}${k}k`;
};

const formatSmallNumber = (abs: number, symbol: string, sign: string): string => {
  return abs === 0 ? `${symbol}0` : `${sign}${symbol}${abs}`;
};

const formatThousands = (thousands: number, symbol: string, sign: string): string => {
  if (thousands >= 1000) {
    return `${sign}${symbol}${((thousands * THOUSAND) / MILLION).toFixed(2)}M`;
  }

  const decimals = thousands >= 100 ? 1 : 2;
  return Number.isInteger(thousands)
    ? `${sign}${symbol}${thousands}k`
    : `${sign}${symbol}${thousands.toFixed(decimals)}k`;
};

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

export const formatYAxis = (value: number, currency: Currencies = DEFAULT_CURRENCY): string => {
  const symbol = getCurrencySymbol(currency);

  if (!Number.isFinite(value)) return '—';

  const sign = value < 0 ? '-' : '';
  const abs = Math.abs(value);

  if (abs >= THOUSAND) {
    return formatLargeNumber(abs, symbol, sign);
  }

  return formatSmallNumber(abs, symbol, sign);
};

export const formatTooltipPrice = (
  value: number,
  currency: Currencies = DEFAULT_CURRENCY,
): string => {
  const symbol = getCurrencySymbol(currency);

  if (!Number.isFinite(value)) return '—';

  const sign = value < 0 ? '-' : '';
  const abs = Math.abs(value);

  if (abs >= MILLION) {
    return `${sign}${symbol}${(abs / MILLION).toFixed(2)}M`;
  }

  if (abs >= THOUSAND) {
    const thousands = abs / THOUSAND;
    return formatThousands(thousands, symbol, sign);
  }

  return `${sign}${symbol}${abs.toLocaleString()}`;
};
