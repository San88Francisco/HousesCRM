import { HousePaybackStats, PaybackChartData } from '@/types/core/analytics';
import { getApartmentColor } from '@/shared/utils/colors';

const FULL_PAYBACK_COEFFICIENT = 1;
const PERCENTAGE_MULTIPLIER = 100;
const COEFFICIENT_DECIMAL_PLACES = 2;
const PERCENTAGE_DECIMAL_PLACES = 0;

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

export const formatPaybackPercentage = (coefficient: number): string => {
  return `${(coefficient * PERCENTAGE_MULTIPLIER).toFixed(PERCENTAGE_DECIMAL_PLACES)}%`;
};
