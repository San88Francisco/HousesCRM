import { ChartDataItem, CurrencyRevaluation } from '@/types/core/currency-revaluation-chart/types';

const MILLION = 1_000_000;
const THOUSAND = 1_000;
const DECIMAL_PLACES_MILLION = 1;
const DECIMAL_PLACES_THOUSAND = 0;
const DECIMAL_PLACES_RATE = 2;
const DEFAULT_MAX_LENGTH = 15;

export const transformCurrencyData = (data: CurrencyRevaluation[]): ChartDataItem[] => {
  return data.map(item => ({
    apartmentName: item.apartmentName,
    purchaseAmount: item.purchaseAmountUah,
    revaluationAmount: item.revaluationAmountUah,
    purchaseRate: item.purchaseRate,
    currentRate: item.currentRate,
    id: item.id,
  }));
};

export const formatCurrency = (value: number): string => {
  if (value >= MILLION) {
    return `${(value / MILLION).toFixed(DECIMAL_PLACES_MILLION)}M ₴`;
  }
  if (value >= THOUSAND) {
    return `${(value / THOUSAND).toFixed(DECIMAL_PLACES_THOUSAND)}k ₴`;
  }
  return `${value} ₴`;
};

export const formatRate = (rate: number): string => {
  return `${rate.toFixed(DECIMAL_PLACES_RATE)} ₴/$`;
};

export const truncateText = (text: string, maxLength: number = DEFAULT_MAX_LENGTH): string => {
  const shouldTruncate = text.length > maxLength;

  if (shouldTruncate) {
    return `${text.substring(0, maxLength)}...`;
  }

  return text;
};
