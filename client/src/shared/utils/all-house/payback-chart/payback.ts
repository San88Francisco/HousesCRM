import { HousePaybackStats, PaybackChartData } from '@/types/core/payback-chart/analytics';
import { getApartmentColor } from '@/shared/utils/all-house/payback-chart/colors';

const FULL_PAYBACK_COEFFICIENT = 1;
const COEFFICIENT_DECIMAL_PLACES = 2;
const MILLION = 1_000_000;
const THOUSAND = 1_000;

export const transformPaybackData = (stats: HousePaybackStats[]): PaybackChartData[] => {
  return stats.map((stat, index) => {
    const isFullyPaidBack = stat.paybackCoefficient >= FULL_PAYBACK_COEFFICIENT;
    const displayCoefficient = Math.min(stat.paybackCoefficient, FULL_PAYBACK_COEFFICIENT);

    return {
      id: stat.id,
      apartmentName: stat.apartmentName,
      paybackCoefficient: stat.paybackCoefficient,
      displayCoefficient,
      isFullyPaidBack,
      color: getApartmentColor(index),
      purchaseDate: stat.purchaseDate,
      purchasePriceUSD: stat.purchasePriceUSD,
      totalIncomeUSD: stat.totalIncomeUSD,
    };
  });
};

export const formatPaybackCoefficient = (coefficient: number): string => {
  return `x${coefficient.toFixed(COEFFICIENT_DECIMAL_PLACES)}`;
};

export const formatYAxis = (value: number): string => {
  if (value >= MILLION) return `${(value / MILLION).toFixed(1)}M`;
  if (value >= THOUSAND) return `${(value / THOUSAND).toFixed(0)}k`;
  return value.toString();
};
